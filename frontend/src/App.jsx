import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Landing from "./pages/Landing";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import DiscoverEvents from "./pages/DiscoverEvents";
import CreateEvent from "./pages/CreateEvent";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      {/* Auth routes — phone frame layout */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* App routes — responsive layout with top nav (desktop) / bottom nav (mobile) */}
      <Route path="/discover" element={
        <AppLayout><DiscoverEvents /></AppLayout>
      } />
      <Route path="/create" element={
        <AppLayout><CreateEvent /></AppLayout>
      } />
      <Route path="/profile" element={
        <AppLayout><Profile /></AppLayout>
      } />

      {/* 404 */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
