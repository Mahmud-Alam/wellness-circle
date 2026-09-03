import { useState } from "react";
import {
  MapPin,
  Pencil,
  Flame,
  PlusCircle,
  BadgeCheck,
  Home,
  CalendarClock,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { attendingEvents, hostingEvents } from "../data/events";
import { CURRENT_USER, PROFILE_STATS } from "../data/constants";
import CompactCard from "../components/cards/CompactCard";

const STAT_ICONS = {
  badgeCheck: BadgeCheck,
  home: Home,
  calendarClock: CalendarClock,
};

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("attending");

  const listData = activeTab === "attending" ? attendingEvents : hostingEvents;

  return (
    <div className="profile-page has-bottom-nav">
      {/* Header */}
      <header className="profile-header">
        <div className="profile-header__inner">
          <h1 className="profile-header__title">My Profile</h1>
          <button
            className="profile-header__edit-btn"
            onClick={() => navigate("/profile")}
          >
            Edit Profile
          </button>
        </div>
      </header>

      <div className="profile-content">
        {/* Hero */}
        <div className="profile-hero">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              <img src={CURRENT_USER.avatar} alt={CURRENT_USER.name} />
            </div>
            <button
              className="profile-avatar-edit"
              aria-label="Edit profile picture"
            >
              <Pencil size={11} color="white" strokeWidth={2.5} />
            </button>
          </div>

          <div style={{ textAlign: "center" }}>
            <h2 className="profile-name">{CURRENT_USER.name}</h2>
            <div className="profile-location">
              <MapPin size={12} color="#94A3B8" strokeWidth={2} />
              <span>{CURRENT_USER.location}</span>
            </div>
            <p className="profile-member-since">
              Member since {CURRENT_USER.memberSince}
            </p>
          </div>

          <p className="profile-bio">{CURRENT_USER.bio}</p>

          <div className="profile-tags">
            {["Yoga", "Running", "Meditation"].map((tag) => (
              <span key={tag} className="profile-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* PROFILE_STATS */}
        <div className="profile-stats">
          {PROFILE_STATS.map(({ value, label, iconName, color, bg }) => {
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
          {listData.map((ev) => (
            <CompactCard key={ev.id} {...ev} />
          ))}

          {listData.length === 0 && (
            <div className="profile-empty">
              <div className="profile-empty__icon">
                <PlusCircle size={24} color="#10B981" strokeWidth={2} />
              </div>
              <p className="profile-empty__title">No events yet</p>
              <p className="profile-empty__text">
                Tap Create to host your first event
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
