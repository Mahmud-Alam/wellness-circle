import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";

import Landing from "./pages/Landing";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import DiscoverEvents from "./pages/DiscoverEvents";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <Routes>
      {/* Public pages */}
      <Route
        path="/"
        element={user ? <Navigate to="/discover" replace /> : <Landing />}
      />

      <Route
        path="/login"
        element={user ? <Navigate to="/discover" replace /> : <LogIn />}
      />

      <Route
        path="/signup"
        element={user ? <Navigate to="/discover" replace /> : <SignUp />}
      />

      {/* Discover */}
      <Route
        path="/discover"
        element={
          <AppLayout>
            <DiscoverEvents />
          </AppLayout>
        }
      />

      {/* Event details */}
      <Route
        path="/event/:id"
        element={
          <AppLayout>
            <EventDetails />
          </AppLayout>
        }
      />

      {/* Create event - Admin only */}
      <Route
        path="/create"
        element={
          <ProtectedRoute adminOnly>
            <AppLayout>
              <CreateEvent />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Profile - Logged-in users */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="/404" element={<NotFound />} />

      {/* Unknown route */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
