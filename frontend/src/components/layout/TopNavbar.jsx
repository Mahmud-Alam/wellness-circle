import { Compass, PlusCircle, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "./Logo";

const NAV_ITEMS = [
  { path: "/discover", label: "Discover", Icon: Compass },
  { path: "/create", label: "Create Event", Icon: PlusCircle },
  { path: "/profile", label: "Profile", Icon: User },
];

export default function TopNavbar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className={`nav-top ${user ? "nav-top--logged-in" : "nav-top--logged-out"}`}>
      <div className="nav-top__inner">
        <Logo size={32} onClick={() => navigate("/")} />

        {/* Logged out → show auth actions on both mobile & desktop */}
        {!user ? (
          <div className="flex items-center gap-3">
            <button className="btn-ghost" onClick={() => navigate("/login")}>
              Log In
            </button>
            <button
              className="btn-primary"
              style={{ padding: "0.5rem 1.25rem", fontSize: "0.8125rem" }}
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>
        ) : (
          /* Logged in → normal nav (hide on mobile, bottom nav takes over) */
          <>
            <nav className="nav-top__links">
              {NAV_ITEMS.map(({ path, label, Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <button
                    key={path}
                    className={`nav-top__link ${isActive ? "active" : ""}`}
                    onClick={() => navigate(path)}
                  >
                    <Icon
                      size={18}
                      strokeWidth={2.25}
                      color={isActive ? "#10B981" : "#94A3B8"}
                    />
                    {label}
                  </button>
                );
              })}
            </nav>
            <div
              className="nav-top__avatar"
              onClick={() => navigate("/profile")}
            >
              <img src={user?.avatar} alt={user?.name || "Profile"} />
              <span className="nav-top__avatar-dot" />
            </div>
          </>
        )}
      </div>
    </header>
  );
}
