import { Compass, PlusCircle, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { path: "/discover", label: "Discover", Icon: Compass },
  { path: "/create", label: "Create Event", Icon: PlusCircle, adminOnly: true },
  { path: "/profile", label: "Profile", Icon: User },
];

export default function TopNavbar() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === "admin";

  const navItems = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  return (
    <header
      className={`nav-top ${
        user ? "nav-top--logged-in" : "nav-top--logged-out"
      }`}
    >
      <div className="nav-top__inner">
        <Logo size={32} onClick={() => navigate("/")} />

        {!user ? (
          <div className="flex items-center gap-3">
            <button className="btn-ghost" onClick={() => navigate("/login")}>
              Log In
            </button>

            <button
              className="btn-primary"
              style={{
                padding: "0.5rem 1.25rem",
                fontSize: "0.8125rem",
              }}
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>
        ) : (
          <>
            <nav className="nav-top__links">
              {navItems.map(({ path, label, Icon }) => {
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
              <img
                src={
                  profile?.profile_pic_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    profile?.full_name || user?.email?.split("@")[0] || "User",
                  )}&background=d1fae5&color=047857`
                }
                alt={profile?.full_name || "Profile"}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://ui-avatars.com/api/?name=User&background=d1fae5&color=047857";
                }}
              />
              <span className="nav-top__avatar-dot" />
            </div>
          </>
        )}
      </div>
    </header>
  );
}
