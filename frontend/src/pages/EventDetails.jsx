import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/ui/Loader";
import {
  Calendar,
  MapPin,
  Tag,
  ArrowLeft,
  Users,
  LogIn,
  UserCircle,
  CheckCircle2,
} from "lucide-react";
import "../styles/EventDetails.css";

const FALLBACK_IMG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'><rect width='800' height='450' fill='%23d1fae5'/><text x='50%25' y='50%25' font-family='sans-serif' font-size='32' fill='%23059669' text-anchor='middle' dy='.3em'>WellnessCircle</text></svg>";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const isAdmin = user?.role === "admin";

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api.get(`/events/${id}`);
      setEvent(data.event);
    } catch (err) {
      console.error("Failed to load event:", err);
      setError(err.message || "Failed to load event.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendees = async () => {
    if (!isAdmin) return;

    try {
      const data = await api.get(`/events/${id}/attendees`);
      setAttendees(data.attendees || []);
    } catch (err) {
      console.error("Failed to load attendees:", err);
    }
  };

  useEffect(() => {
    fetchEvent();

    if (isAdmin) {
      fetchAttendees();
    }
  }, [id, isAdmin]);

  const handleJoin = async () => {
    if (!user) {
      navigate("/login", {
        state: { from: `/event/${id}` },
      });
      return;
    }

    setActionLoading(true);

    try {
      await api.post(`/events/${id}/join`);

      setEvent((prev) => ({
        ...prev,
        is_attending: true,
        attendee_count: Number(prev.attendee_count || 0) + 1,
      }));

      if (isAdmin) {
        fetchAttendees();
      }
    } catch (err) {
      alert(err.message || "Failed to join event.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    setActionLoading(true);

    try {
      await api.delete(`/events/${id}/leave`);

      setEvent((prev) => ({
        ...prev,
        is_attending: false,
        attendee_count: Math.max(0, Number(prev.attendee_count || 0) - 1),
      }));

      if (isAdmin) {
        fetchAttendees();
      }
    } catch (err) {
      alert(err.message || "Failed to leave event.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Loader fullScreen label="Loading event..." />;
  }

  if (error || !event) {
    return (
      <div className="event-details-page">
        <div className="event-details-error">
          <div className="event-details-error__icon">
            <Tag size={22} />
          </div>

          <h2>Event not found</h2>

          <p>{error || "This event could not be found."}</p>

          <Link to="/" className="event-details-back-btn">
            <ArrowLeft size={16} />
            Back to events
          </Link>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.event_date);

  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = eventDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const isCreator = user?.id === event.creator_id;

  const creatorName = event.creator?.full_name || "WellnessCircle Admin";

  const creatorAvatar =
    event.creator?.profile_pic_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      creatorName,
    )}&background=d1fae5&color=047857`;

  return (
    <div className="event-details-page">
      <main className="event-details-content">
        {/* Back */}
        <Link to="/" className="event-details-back">
          <ArrowLeft size={16} />
          <span>Back to events</span>
        </Link>

        {/* Hero image */}
        <div className="event-details-hero">
          <img
            src={event.cover_image_url || FALLBACK_IMG}
            alt={event.title}
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMG;
            }}
          />

          <div className="event-details-hero__overlay" />

          <div className="event-details-hero__category">
            <Tag size={13} />
            {event.category || "Wellness"}
          </div>
        </div>

        {/* Main layout */}
        <div className="event-details-layout">
          {/* Left content */}
          <section className="event-details-main">
            <div className="event-details-badges">
              <span className="event-details-category">
                <Tag size={13} />
                {event.category || "Wellness"}
              </span>

              {isCreator && (
                <span className="event-details-created">Your event</span>
              )}
            </div>

            <h1 className="event-details-title">{event.title}</h1>

            {/* Event information */}
            <div className="event-details-info">
              <div className="event-details-info-row">
                <div className="event-details-info-icon">
                  <Calendar size={17} />
                </div>

                <div>
                  <span className="event-details-info-label">Date & time</span>

                  <p>
                    {formattedDate}
                    <br />
                    <span>{formattedTime}</span>
                  </p>
                </div>
              </div>

              <div className="event-details-info-row">
                <div className="event-details-info-icon">
                  <MapPin size={17} />
                </div>

                <div>
                  <span className="event-details-info-label">Location</span>

                  <p>{event.location_text || "Location not provided"}</p>
                </div>
              </div>

              <div className="event-details-info-row">
                <div className="event-details-info-icon">
                  <UserCircle size={17} />
                </div>

                <div>
                  <span className="event-details-info-label">Hosted by</span>

                  <div className="event-details-host">
                    <img
                      src={creatorAvatar}
                      alt={creatorName}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://ui-avatars.com/api/?name=User&background=d1fae5&color=047857";
                      }}
                    />

                    <p>{creatorName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <section className="event-details-about">
              <h2>About this event</h2>

              <p>
                {event.description ||
                  "No description has been added for this event yet."}
              </p>
            </section>
          </section>

          {/* Right attendance card */}
          <aside className="event-details-sidebar">
            <div className="event-attendance-card">
              <div className="event-attendance-header">
                <div className="event-attendance-icon">
                  <Users size={19} />
                </div>

                <div>
                  <h2>Attendance</h2>

                  <p>
                    {event.attendee_count || 0}{" "}
                    {Number(event.attendee_count) === 1 ? "person" : "people"}{" "}
                    attending
                  </p>
                </div>
              </div>

              <div className="event-attendance-divider" />

              {isCreator ? (
                <div className="event-hosting-box">
                  <CheckCircle2 size={17} />
                  <span>You are hosting this event</span>
                </div>
              ) : user && event.is_attending ? (
                <>
                  <button
                    type="button"
                    onClick={handleLeave}
                    disabled={actionLoading}
                    className="event-leave-btn"
                  >
                    {actionLoading ? "Updating..." : "Leave Event"}
                  </button>

                  <p className="event-attending-message">
                    ✓ You're attending this event
                  </p>
                </>
              ) : user ? (
                <button
                  type="button"
                  onClick={handleJoin}
                  disabled={actionLoading}
                  className="event-join-btn"
                >
                  <CheckCircle2 size={17} />

                  {actionLoading ? "Joining..." : "Join Event"}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/login", {
                        state: { from: `/event/${id}` },
                      })
                    }
                    className="event-join-btn"
                  >
                    <LogIn size={17} />
                    Login to Join
                  </button>

                  <p className="event-login-message">
                    Sign in to join this wellness event.
                  </p>
                </>
              )}
            </div>
          </aside>
        </div>

        {/* Admin attendee list */}
        {isAdmin && (
          <section className="event-admin-attendees">
            <div className="event-section-heading">
              <div className="event-section-heading__icon">
                <Users size={18} />
              </div>

              <div>
                <h2>Attendees</h2>
                <p>{attendees.length} registered</p>
              </div>
            </div>

            {attendees.length === 0 ? (
              <div className="event-no-attendees">
                <Users size={22} />
                <p>No one has joined yet.</p>
              </div>
            ) : (
              <div className="event-attendee-grid">
                {attendees.map((attendee, index) => {
                  const name = attendee.full_name || "User";

                  const avatar =
                    attendee.profile_pic_url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      name,
                    )}&background=d1fae5&color=047857`;

                  return (
                    <div
                      key={attendee.id || attendee.user_id || index}
                      className="event-attendee-card"
                    >
                      <img
                        src={avatar}
                        alt={name}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://ui-avatars.com/api/?name=User&background=d1fae5&color=047857";
                        }}
                      />

                      <div>
                        <p>{name}</p>

                        {attendee.username && <span>@{attendee.username}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
