import { useState, useEffect } from "react";
import {
  MapPin,
  Pencil,
  Flame,
  PlusCircle,
  BadgeCheck,
  Home,
  CalendarClock,
  Check,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import Loader from "../components/ui/Loader";
import EventCard from "../components/cards/EventCard";

const STAT_ICONS = {
  badgeCheck: BadgeCheck,
  home: Home,
  calendarClock: CalendarClock,
};

export default function Profile() {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();

  const [profile, setProfile] = useState(null);

  const [attendingEvents, setAttendingEvents] = useState([]);
  const [hostingEvents, setHostingEvents] = useState([]);

  const [activeTab, setActiveTab] = useState("attending");

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [editForm, setEditForm] = useState({
    full_name: "",
    profile_pic_url: "",
    location: "",
  });

  const isAdmin = user?.role === "admin";

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api.get("/profile");

      const profileData = data.profile;

      if (!profileData) {
        setProfile(null);
        return;
      }

      setProfile(profileData);

      setEditForm({
        full_name: profileData.full_name || "",
        profile_pic_url: profileData.profile_pic_url || "",
        location: profileData.location || "",
      });

      /*
       * Prefer separate attending/hosting lists if the backend provides them.
       *
       * Fallback to my_events so this still works with the current API.
       */
      setAttendingEvents(data.attending_events || data.my_events || []);
      setHostingEvents(data.hosting_events || []);
    } catch (err) {
      console.error("Failed to load profile:", err);
      setError(err.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!editForm.full_name.trim()) {
      setError("Full name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const data = await api.put("/profile", {
        full_name: editForm.full_name.trim(),
        profile_pic_url: editForm.profile_pic_url.trim() || undefined,
        location: editForm.location.trim(),
      });

      setProfile(data.profile);
      await refreshProfile();
      
      setEditForm({
        full_name: data.profile.full_name || "",
        profile_pic_url: data.profile.profile_pic_url || "",
        location: data.profile.location || "",
      });

      setEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (!profile) return;

    setEditForm({
      full_name: profile.full_name || "",
      profile_pic_url: profile.profile_pic_url || "",
      location: profile.location || "",
    });

    setError("");
    setEditing(false);
  };

  if (loading) {
    return <Loader fullScreen label="Loading profile..." />;
  }

  if (!profile) {
    return (
      <div className="profile-page has-bottom-nav">
        <div className="profile-content">
          <div className="profile-empty">
            <div className="profile-empty__icon">
              <PlusCircle size={24} color="#10B981" strokeWidth={2} />
            </div>

            <p className="profile-empty__title">Profile not found</p>

            <p className="profile-empty__text">
              We couldn't load your profile.
            </p>

            <button
              type="button"
              onClick={fetchProfile}
              className="profile-empty__action"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayName =
    profile.full_name ||
    profile.username ||
    user?.email?.split("@")[0] ||
    "User";

  const avatar =
    profile.profile_pic_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName,
    )}&background=d1fae5&color=047857`;

  const currentEvents =
    activeTab === "attending" ? attendingEvents : hostingEvents;

  /*
   * These values are calculated from real backend data instead of
   * the old PROFILE_STATS mock data.
   */
  const stats = [
    {
      value: attendingEvents.length,
      label: "Attending",
      iconName: "badgeCheck",
      color: "#10B981",
      bg: "#ECFDF5",
    },
    {
      value: hostingEvents.length,
      label: "Hosting",
      iconName: "home",
      color: "#6366F1",
      bg: "#EEF2FF",
    },
    {
      value: attendingEvents.length + hostingEvents.length,
      label: "Events",
      iconName: "calendarClock",
      color: "#F59E0B",
      bg: "#FFFBEB",
    },
  ];

  return (
    <div className="profile-page has-bottom-nav">
      {/* Header */}
      <header className="profile-header">
        <div className="profile-header__inner">
          <h1 className="profile-header__title">My Profile</h1>

          {!editing && (
            <button
              className="profile-header__edit-btn"
              onClick={() => {
                setError("");
                setEditing(true);
              }}
            >
              Edit Profile
            </button>
          )}
        </div>
      </header>

      <div className="profile-content">
        {/* Error */}
        {error && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px 14px",
              borderRadius: "10px",
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#B91C1C",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* Hero */}
        <div className="profile-hero">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              <img
                src={avatar}
                alt={displayName}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://ui-avatars.com/api/?name=User&background=d1fae5&color=047857";
                }}
              />
            </div>

            <button
              className="profile-avatar-edit"
              aria-label="Edit profile picture"
              onClick={() => {
                setError("");
                setEditing(true);
              }}
            >
              <Pencil size={11} color="white" strokeWidth={2.5} />
            </button>
          </div>

          {!editing ? (
            <>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <h2 className="profile-name">{displayName}</h2>

                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "3px 8px",
                      borderRadius: "999px",
                      background: isAdmin ? "#EEF2FF" : "#ECFDF5",
                      color: isAdmin ? "#4338CA" : "#047857",
                    }}
                  >
                    {isAdmin ? "Admin" : "Member"}
                  </span>
                </div>

                <div className="profile-location">
                  <MapPin size={12} color="#94A3B8" strokeWidth={2} />

                  <span>{profile.location || "Location not set"}</span>
                </div>

                {profile.username && (
                  <p className="profile-member-since">@{profile.username}</p>
                )}
              </div>

              {/* Tags */}
              <div className="profile-tags">
                {["Yoga", "Running", "Meditation"].map((tag) => (
                  <span key={tag} className="profile-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </>
          ) : (
            /* Edit form */
            <form
              onSubmit={handleSave}
              style={{
                width: "100%",
                maxWidth: "420px",
                marginTop: "8px",
              }}
            >
              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 600,
                    marginBottom: "6px",
                  }}
                >
                  Full Name
                </label>

                <input
                  type="text"
                  required
                  value={editForm.full_name}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      full_name: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 600,
                    marginBottom: "6px",
                  }}
                >
                  Profile Picture URL
                </label>

                <input
                  type="url"
                  value={editForm.profile_pic_url}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      profile_pic_url: e.target.value,
                    })
                  }
                  placeholder="https://..."
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 600,
                    marginBottom: "6px",
                  }}
                >
                  Location
                </label>

                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      location: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    outline: "none",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "8px 14px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#10B981",
                    color: "white",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: saving ? "not-allowed" : "pointer",
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  <Check size={15} />
                  {saving ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={saving}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "8px 14px",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    background: "white",
                    color: "#475569",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  <X size={15} />
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* PROFILE_STATS */}
        <div className="profile-stats">
          {stats.map(({ value, label, iconName, color, bg }) => {
            const Icon = STAT_ICONS[iconName];

            return (
              <div key={label} className="profile-stat-card">
                <div
                  className="profile-stat-icon"
                  style={{ backgroundColor: bg }}
                >
                  {Icon && <Icon size={15} strokeWidth={2} color={color} />}
                </div>

                <span className="profile-stat-value" style={{ color }}>
                  {value}
                </span>

                <span className="profile-stat-label">{label}</span>
              </div>
            );
          })}
        </div>

        {/* Streak banner */}
        <div className="profile-streak">
          <div className="profile-streak__icon">
            <Flame size={18} color="#F97316" strokeWidth={2} />
          </div>

          <div className="profile-streak__text">
            <p className="profile-streak__title">12-day streak!</p>

            <p className="profile-streak__sub">
              Keep it up — 3 more days to your next badge
            </p>
          </div>

          <div className="profile-streak__badge">View</div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <div className="profile-tabs__inner">
            {["attending", "hosting"].map((tab) => {
              const isActive = activeTab === tab;

              const label = tab === "attending" ? "Attending" : "Hosting";

              const count =
                tab === "attending"
                  ? attendingEvents.length
                  : hostingEvents.length;

              return (
                <button
                  key={tab}
                  className={`profile-tab ${isActive ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {label}

                  <span className="profile-tab__count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Event list */}
        <div className="profile-event-list">
          {currentEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}

          {currentEvents.length === 0 && (
            <div className="profile-empty">
              <div className="profile-empty__icon">
                <PlusCircle size={24} color="#10B981" strokeWidth={2} />
              </div>

              <p className="profile-empty__title">No events yet</p>

              <p className="profile-empty__text">
                {activeTab === "attending"
                  ? "Join an event to see it here."
                  : "Create your first event to see it here."}
              </p>

              {activeTab === "hosting" && (
                <button
                  type="button"
                  onClick={() => navigate("/create")}
                  style={{
                    marginTop: "10px",
                    border: "none",
                    background: "none",
                    color: "#10B981",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Create Event
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
