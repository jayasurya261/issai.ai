const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { categorizeExpense } = require('../services/aiService');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const PDFDocument = require('pdfkit');

const clerkAuth = require('../middleware/clerkAuth');

const streamifier = require('streamifier');

const upload = multer({ storage: multer.memoryStorage() });

// Apply auth middleware to all routes
router.use(clerkAuth);

// GET /api/expenses - List all expenses
router.get('/', async (req, res) => {
    try {
        console.log("GET /expenses Request Auth:", JSON.stringify(req.auth, null, 2));

        if (!req.auth) {
            throw new Error("req.auth is completely missing");
        }
        if (!req.auth.userId) {
            throw new Error("req.auth.userId is missing");
        }

        const expenses = await Expense.find({ user: req.auth.userId }).sort({ date: -1 });
        console.log(`Found ${expenses.length} expenses for user ${req.auth.userId}`);
        res.json(expenses);
    } catch (error) {
        console.error("GET /expenses Error:", error);
        res.status(500).json({ message: error.message, stack: error.stack });
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
            user: req.auth.userId
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
        const deletedExpense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.auth.userId });
        if (!deletedExpense) {
            return res.status(404).json({ message: 'Expense not found or unauthorized' });
        }
        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/expenses/batch-delete - Delete multiple expenses
router.post('/batch-delete', async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'No expense IDs provided' });
    }

    try {
        const result = await Expense.deleteMany({
            _id: { $in: ids },
            user: req.auth.userId
        });

        res.json({ message: `Successfully deleted ${result.deletedCount} expenses.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/expenses/:id - Update an expense
router.put('/:id', async (req, res) => {
    try {
        const { title, amount, date, description, category } = req.body;
        const updatedExpense = await Expense.findOneAndUpdate(
            { _id: req.params.id, user: req.auth.userId },
            { title, amount, date, description, category },
            { new: true } // Return the updated document
        );

        if (!updatedExpense) {
            return res.status(404).json({ message: 'Expense not found or unauthorized' });
        }
        res.json(updatedExpense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/expenses/batch - Batch insert expenses (from frontend CSV parse)
router.post('/batch', async (req, res) => {
    const { expenses } = req.body; // Expects { expenses: [ { title, amount, date, description }, ... ] }

    if (!expenses || !Array.isArray(expenses) || expenses.length === 0) {
        return res.status(400).json({ message: 'No expenses provided' });
    }

    try {
        const processedExpenses = [];
        for (const item of expenses) {
            const { title, amount, date, description } = item;

            if (title && amount) {
                const category = await categorizeExpense(title, description || '');
                processedExpenses.push({
                    title,
                    amount: parseFloat(amount),
                    date: new Date(date),
                    description: description || '',
                    category,
                    isManual: false,
                    user: req.auth.userId
                });
            }
        }

        await Expense.insertMany(processedExpenses);
        res.status(201).json({ message: `Successfully imported ${processedExpenses.length} expenses.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/expenses/export/csv
router.get('/export/csv', async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.auth.userId }).sort({ date: -1 });
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
            { $match: { user: req.auth.userId } },
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
        const expenses = await Expense.find({ user: req.auth.userId }); // Find all to potential fix bad categories too if needed, or just { category: 'Uncategorized' }
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
