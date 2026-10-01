import { Compass, PlusCircle, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function BottomNav() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === "admin";

  const tabs = [
    {
      path: "/discover",
      label: "Discover",
      Icon: Compass,
    },
    ...(isAdmin
      ? [
          {
            path: "/create",
            label: "Create",
            Icon: PlusCircle,
          },
        ]
      : []),
    ...(user
      ? [
          {
            path: "/profile",
            label: "Profile",
            Icon: User,
          },
        ]
      : []),
  ];

  return (
    <nav className="nav-bottom">
      <div className="nav-bottom__inner">
        {tabs.map(({ path, label, Icon }) => {
          const isActive = location.pathname === path;

          return (
            <button
              key={path}
              className={`nav-bottom__tab ${isActive ? "active" : ""}`}
              onClick={() => navigate(path)}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="nav-bottom__tab-icon">
                <Icon
                  size={22}
                  strokeWidth={2}
                  color={isActive ? "#10B981" : "#94A3B8"}
                />
              </span>

              <span className="nav-bottom__tab-label">{label}</span>

              {isActive && <span className="nav-bottom__tab-dot" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
