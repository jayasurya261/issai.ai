import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!publishableKey) {
  throw new Error("Missing Publishable Key")
}

import { useAuth, useUser } from '@clerk/clerk-react';
import { setAuthToken, syncUser } from './services/api';

const AuthSync = () => {
  const { getToken, isSignedIn } = useAuth(); // Note: useAuth doesn't return user, useUser does
  const { user: clerkUser } = useUser();

  React.useEffect(() => {
    const sync = async () => {
      if (isSignedIn && clerkUser) {
        const token = await getToken();
        setAuthToken(token);

        // Sync user to DB
        try {
          await syncUser({
            clerkId: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
            imageUrl: clerkUser.imageUrl
          });
        } catch (err) {
          console.error("Failed to sync user", err);
        }
      } else {
        setAuthToken(null);
      }
    };
    sync();
  }, [isSignedIn, getToken, clerkUser]);

  return null;
};

function App() {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <AuthSync />
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/dashboard"
              element={
                <>
                  <SignedIn>
                    <Dashboard />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            {/* Catch all route - redirect to landing page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ClerkProvider>
  );
}

export default App;
