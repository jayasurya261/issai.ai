const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const clerkAuth = require('../middleware/clerkAuth');

// Apply auth middleware
router.use(clerkAuth);

// GET /api/budgets - Get all budgets for user
router.get('/', async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.auth.userId });
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/budgets - Create or update a budget
router.post('/', async (req, res) => {
    const { category, limit } = req.body;

    if (!category || !limit) {
        return res.status(400).json({ message: 'Category and limit are required' });
    }

    try {
        const budget = await Budget.findOneAndUpdate(
            { user: req.auth.userId, category },
            { limit },
            { upsert: true, new: true }
        );
        res.json(budget);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/budgets/:category - Delete a budget
router.delete('/:category', async (req, res) => {
    try {
        await Budget.findOneAndDelete({ user: req.auth.userId, category: req.params.category });
        res.json({ message: 'Budget deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
