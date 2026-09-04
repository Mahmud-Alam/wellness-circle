import { Compass, PlusCircle, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const TABS = [
  { path: "/discover", label: "Discover", Icon: Compass },
  { path: "/create", label: "Create", Icon: PlusCircle },
  { path: "/profile", label: "Profile", Icon: User },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="nav-bottom">
      <div className="nav-bottom__inner">
        {TABS.map(({ path, label, Icon }) => {
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
