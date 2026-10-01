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

const FALLBACK_IMG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450"><rect width="800" height="450" fill="%23d1fae5"/><text x="50%25" y="50%25" font-family="sans-serif" font-size="32" fill="%23059669" text-anchor="middle" dy=".3em">WellnessCircle</text></svg>';

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
  const isRegularUser = user?.role === "user";

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/events/${id}`);
      setEvent(data.event);
    } catch (err) {
      setError(err.message);
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
      // ignore
    }
  };

  useEffect(() => {
    fetchEvent();
    if (isAdmin) fetchAttendees();
  }, [id, isAdmin]);

  const handleJoin = async () => {
    if (!user) {
      navigate("/login", { state: { from: `/event/${id}` } });
      return;
    }
    setActionLoading(true);
    try {
      await api.post(`/events/${id}/join`);
      setEvent({
        ...event,
        is_attending: true,
        attendee_count: event.attendee_count + 1,
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    setActionLoading(true);
    try {
      await api.delete(`/events/${id}/leave`);
      setEvent({
        ...event,
        is_attending: false,
        attendee_count: event.attendee_count - 1,
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loader fullScreen label="Loading event..." />;

  if (error || !event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-700 mb-4">{error || "Event not found."}</p>
        <Link to="/" className="text-emerald-600 font-medium">
          Back to discover
        </Link>
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-emerald-600 mb-4"
      >
        <ArrowLeft size={16} /> Back to events
      </Link>

      <article>
        <div className="aspect-[16/9] w-full bg-emerald-50 rounded-2xl overflow-hidden mb-6">
          <img
            src={event.cover_image_url || FALLBACK_IMG}
            alt={event.title}
            onError={(e) => (e.target.src = FALLBACK_IMG)}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 rounded-full">
                <Tag size={12} /> {event.category}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-3">
              {event.title}
            </h1>

            <div className="space-y-2 mb-6 text-sm text-slate-700">
              <div className="flex items-start gap-2">
                <Calendar
                  size={16}
                  className="mt-0.5 text-emerald-500 flex-shrink-0"
                />
                <span>
                  {formattedDate} at {formattedTime}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin
                  size={16}
                  className="mt-0.5 text-emerald-500 flex-shrink-0"
                />
                <span>{event.location_text}</span>
              </div>
              <div className="flex items-start gap-2">
                <UserCircle
                  size={16}
                  className="mt-0.5 text-emerald-500 flex-shrink-0"
                />
                <span>Hosted by {event.creator?.full_name || "Unknown"}</span>
              </div>
            </div>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">
                About this event
              </h2>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                {event.description}
              </p>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-20">
              <h2 className="text-base font-semibold text-slate-800 mb-1">
                Attendance
              </h2>
              <p className="text-sm text-slate-500 mb-4 flex items-center gap-1.5">
                <Users size={14} /> {event.attendee_count}{" "}
                {event.attendee_count === 1 ? "person" : "people"} attending
              </p>

              {/* Admin: no join button */}
              {isAdmin && (
                <div className="w-full py-2.5 px-4 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg text-center">
                  Admin view — you created this
                </div>
              )}

              {/* Regular user: join/leave */}
              {isRegularUser &&
                (event.is_attending ? (
                  <button
                    onClick={handleLeave}
                    disabled={actionLoading}
                    className="w-full py-2.5 px-4 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-medium rounded-lg disabled:opacity-60"
                  >
                    {actionLoading ? "Updating..." : "Leave Event"}
                  </button>
                ) : (
                  <button
                    onClick={handleJoin}
                    disabled={actionLoading}
                    className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg disabled:opacity-60 flex items-center justify-center gap-1.5"
                  >
                    {actionLoading ? (
                      "Joining..."
                    ) : (
                      <>
                        <CheckCircle2 size={16} /> Join Event
                      </>
                    )}
                  </button>
                ))}

              {/* Not logged in */}
              {!user && (
                <button
                  onClick={() =>
                    navigate("/login", { state: { from: `/event/${id}` } })
                  }
                  className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg flex items-center justify-center gap-1.5"
                >
                  <LogIn size={16} /> Login to Join
                </button>
              )}

              {isRegularUser && event.is_attending && (
                <p className="mt-3 text-xs text-emerald-600 text-center">
                  You're attending this event
                </p>
              )}
            </div>
          </aside>
        </div>

        {/* Attendee list — admin only */}
        {isAdmin && (
          <section className="mt-10">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
              <Users size={18} className="text-emerald-500" /> Attendees (
              {attendees.length})
            </h2>
            {attendees.length === 0 ? (
              <p className="text-sm text-slate-500 bg-slate-50 rounded-lg p-4">
                No one has joined yet.
              </p>
            ) : (
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {attendees.map((a, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 p-3 bg-white border border-gray-100 rounded-lg"
                  >
                    {a.profile_pic_url ? (
                      <img
                        src={a.profile_pic_url}
                        alt={a.full_name}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-semibold">
                        {a.full_name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-slate-700 truncate">
                        {a.full_name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        @{a.username}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </article>
    </div>
  );
}
