const express = require('express');
const router = express.Router();
const User = require('../models/User');
const clerkAuth = require('../middleware/clerkAuth');

// Apply auth middleware to all routes
router.use(clerkAuth);

// POST /api/users/sync - Sync user data from Clerk to MongoDB
router.post('/sync', async (req, res) => {
    try {
        const { clerkId, email, firstName, lastName, imageUrl } = req.body;

        // Ensure the ID in body matches the authenticated token (security check)
        if (clerkId !== req.auth.userId) {
            return res.status(403).json({ message: 'Unauthorized: User ID mismatch' });
        }

        const update = {
            email,
            firstName,
            lastName,
            imageUrl,
            lastLogin: new Date()
        };

        const user = await User.findOneAndUpdate(
            { clerkId: clerkId },
            update,
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.json(user);
    } catch (error) {
        console.error('User sync error:', error);
        res.status(500).json({ message: error.message });
    }
});

// GET /api/users/profile - Get user profile
router.get('/profile', async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.auth.userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
