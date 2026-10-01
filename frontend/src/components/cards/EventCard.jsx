import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Calendar, Clock, MapPin, Users } from "lucide-react";
import CategoryBadge from "../ui/CategoryBadge";

const FALLBACK_IMG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 225'><rect width='400' height='225' fill='%23d1fae5'/><text x='50%25' y='50%25' font-family='sans-serif' font-size='20' fill='%23059669' text-anchor='middle' dy='.3em'>WellnessCircle</text></svg>";

export default function EventCard({ event }) {
  const [saved, setSaved] = useState(false);

  const date = new Date(event.event_date);

  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const image = event.cover_image_url || FALLBACK_IMG;
  const hostName = event.creator?.full_name || "Unknown";

  return (
    <article className="event-card">
      {/* Cover image */}
      <div className="event-card__cover">
        <Link to={`/event/${event.id}`}>
          <img
            src={image}
            alt={event.title}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMG;
            }}
          />
        </Link>

        <div className="event-card__cover-overlay" />

        <div className="event-card__badge-wrap">
          <CategoryBadge label={event.category} />
        </div>

        {/* Save */}
        <button
          type="button"
          className="event-card__save-btn"
          onClick={() => setSaved((s) => !s)}
          aria-label={saved ? "Unsave event" : "Save event"}
        >
          <Heart
            size={17}
            strokeWidth={2}
            color={saved ? "#10B981" : "#CBD5E1"}
            fill={saved ? "#10B981" : "none"}
          />
        </button>

        {/* Spots left */}
        {event.spots_left <= 5 && event.spots_left > 0 && (
          <div className="event-card__spots">{event.spots_left} spots left</div>
        )}
      </div>

      {/* Card body */}
      <div className="event-card__body">
        <Link to={`/event/${event.id}`} className="event-card__title-link">
          <h3 className="event-card__title">{event.title}</h3>
        </Link>

        <div className="event-card__meta">
          <div className="event-card__meta-row">
            <Calendar size={13} color="#94A3B8" strokeWidth={2} />
            <span>{formattedDate}</span>

            <span className="event-card__meta-dot">·</span>

            <Clock size={13} color="#94A3B8" strokeWidth={2} />
            <span>{formattedTime}</span>
          </div>

          <div className="event-card__meta-row">
            <MapPin size={13} color="#94A3B8" strokeWidth={2} />
            <span>{event.location_text}</span>
          </div>
        </div>

        <div className="event-card__divider" />

        <div className="event-card__host-row">
          <div className="event-card__host">
            {event.creator?.avatar_url ? (
              <img src={event.creator.avatar_url} alt={hostName} />
            ) : (
              <div className="event-card__host-placeholder">
                {hostName.charAt(0).toUpperCase()}
              </div>
            )}

            <span className="event-card__host-name">
              Hosted by <b>{hostName}</b>
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Users size={13} />
            <span>{event.attendee_count || 0}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
