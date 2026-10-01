import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

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

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public / Auth routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />

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
    </AuthProvider>
  );
}
