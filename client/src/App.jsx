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
        try {
          const token = await getToken();
          console.log("AuthSync Token obtained:", token ? `${token.substring(0, 10)}...` : "null");
          setAuthToken(token);

          // Sync user to DB
          await syncUser({
            clerkId: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
            imageUrl: clerkUser.imageUrl
          });
        } catch (err) {
          console.error("Failed to sync user or get token", err);
        }
      } else {
        console.log("AuthSync: Not signed in or user not loaded");
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
