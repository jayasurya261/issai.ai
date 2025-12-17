const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

// This middleware verifies the session token and attaches req.auth
// We use WithAuth (loose) to prevent hard crashes, and handle 401 manually in routes
const clerkAuth = ClerkExpressWithAuth({
    // Optional: Add onError handler
    onError: (err, req, res) => {
        console.error('Clerk Auth Error:', err);
        // Do not end response here, let next() handle it or simple return
        res.status(401).json({ error: 'Unauthenticated', details: err.message });
    },
    debug: true
});

module.exports = clerkAuth;
