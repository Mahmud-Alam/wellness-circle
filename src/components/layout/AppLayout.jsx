import TopNavbar from "./TopNavbar";
import BottomNav from "./BottomNav";
import { CURRENT_USER } from "../../data/constants";

export default function AppLayout({ children }) {
  return (
    <div className="app-layout">
      {/* Desktop top nav — hidden on mobile */}
      <TopNavbar user={CURRENT_USER} />

      {/* Main content area */}
      <div className="flex-1">
        {children}
      </div>

      {/* Mobile bottom nav — hidden on desktop */}
      <BottomNav />
    </div>
  );
}
