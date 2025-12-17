const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { categorizeExpense } = require('../services/aiService');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const PDFDocument = require('pdfkit');

const upload = multer({ dest: 'uploads/' });

// GET /api/expenses - List all expenses
router.get('/', async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/expenses - Add new expense
router.post('/', async (req, res) => {
    const { title, amount, date, description, category } = req.body;

    try {
        let finalCategory = category;
        if (!finalCategory || finalCategory === 'Uncategorized') {
            finalCategory = await categorizeExpense(title, description);
        }

        const newExpense = new Expense({
            title,
            amount,
            date,
            description,
            category: finalCategory,
            isManual: true,
        });

        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/expenses/:id - Delete an expense
router.delete('/:id', async (req, res) => {
    try {
        const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
        if (!deletedExpense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/expenses/:id - Update an expense
router.put('/:id', async (req, res) => {
    try {
        const { title, amount, date, description, category } = req.body;
        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            { title, amount, date, description, category },
            { new: true } // Return the updated document
        );

        if (!updatedExpense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json(updatedExpense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/expenses/upload - CSV Upload
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                const expenses = [];
                for (const row of results) {
                    // Mapping CSV columns - assuming Title, Amount, Date, Description headers
                    const title = row.Title || row.title;
                    const amount = row.Amount || row.amount;
                    const date = row.Date || row.date || new Date(); // Default to now if missing
                    const description = row.Description || row.description || '';

                    // Basic validation
                    if (title && amount) {
                        const category = await categorizeExpense(title, description);
                        expenses.push({
                            title,
                            amount: parseFloat(amount),
                            date: new Date(date),
                            description,
                            category,
                            isManual: false
                        });
                    }
                }

                await Expense.insertMany(expenses);
                fs.unlinkSync(req.file.path); // Clean up uploaded file
                res.status(201).json({ message: `Successfully imported ${expenses.length} expenses.` });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
});

// GET /api/expenses/export/csv
router.get('/export/csv', async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ date: -1 });
        const fields = ['title', 'amount', 'category', 'date', 'description'];
        const csvContent = [
            fields.join(','),
            ...expenses.map(e => {
                return [
                    `"${e.title}"`,
                    e.amount,
                    `"${e.category}"`,
                    e.date.toISOString().split('T')[0],
                    `"${e.description || ''}"`
                ].join(',')
            })
        ].join('\n');

        res.header('Content-Type', 'text/csv');
        res.attachment('expenses.csv');
        res.send(csvContent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/expenses/stats - Aggregated data for charts
router.get('/stats', async (req, res) => {
    try {
        const stats = await Expense.aggregate([
            {
                $group: {
                    _id: "$category",
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// POST /api/expenses/analyze-all - Re-categorize all uncategorized expenses
router.post('/analyze-all', async (req, res) => {
    try {
        const expenses = await Expense.find({}); // Find all to potential fix bad categories too if needed, or just { category: 'Uncategorized' }
        let count = 0;

        for (const expense of expenses) {
            // Re-analyze if Uncategorized OR via explicit override requests (can refine logic later)
            if (expense.category === 'Uncategorized' || expense.category === 'Other') {
                const newCategory = await categorizeExpense(expense.title, expense.description);
                if (newCategory !== expense.category) {
                    expense.category = newCategory;
                    await expense.save();
                    count++;
                }
            }
        }
        res.json({ message: `Re-categorized ${count} expenses` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
