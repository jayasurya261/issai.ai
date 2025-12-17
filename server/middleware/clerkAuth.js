const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// This middleware verifies the session token and attaches req.auth
const clerkAuth = ClerkExpressRequireAuth({
    // Optional: Add onError handler
    onError: (err, req, res) => {
        console.error('Clerk Auth Error:', err);
        res.status(401).json({ error: 'Unauthenticated' });
    }
});

module.exports = clerkAuth;
