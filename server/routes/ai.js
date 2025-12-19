const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { getFinancialAdvice } = require('../services/aiService');
const clerkAuth = require('../middleware/clerkAuth');

// Apply auth middleware
router.use(clerkAuth);

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        // 1. Gather Context (Recent expenses, stats summary)
        // We'll limit to last 20 expenses to not overload context
        const recentExpenses = await Expense.find({ user: req.auth.userId })
            .sort({ date: -1 })
            .limit(20)
            .select('title amount category date');

        const totalExpenses = await Expense.aggregate([
            { $match: { user: req.auth.userId } },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ]);

        const contextData = {
            recentExpenses,
            summary: totalExpenses[0] || { totalAmount: 0, count: 0 }
        };

        // 2. Call AI Service
        const aiResponse = await getFinancialAdvice(message, contextData);

        res.json({ response: aiResponse });

    } catch (error) {
        console.error("AI Chat Error:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
