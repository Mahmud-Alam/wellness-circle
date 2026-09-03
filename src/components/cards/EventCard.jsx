import { useState } from "react";
import { Heart, Calendar, Clock, MapPin } from "lucide-react";
import CategoryBadge from "../ui/CategoryBadge";

export default function EventCard({ event }) {
  const [saved, setSaved] = useState(false);

  return (
    <article className="event-card">
      {/* Cover image */}
      <div className="event-card__cover">
        <img src={event.coverImage} alt={event.title} loading="lazy" />
        <div className="event-card__cover-overlay" />

        <div className="event-card__badge-wrap">
          <CategoryBadge label={event.category} />
        </div>

        <button
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

        {event.spotsLeft <= 5 && (
          <div className="event-card__spots">
            {event.spotsLeft} spots left
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="event-card__body">
        <h3 className="event-card__title">{event.title}</h3>

        <div className="event-card__meta">
          <div className="event-card__meta-row">
            <Calendar size={13} color="#94A3B8" strokeWidth={2} />
            <span>{event.date}</span>
            <span className="event-card__meta-dot">·</span>
            <Clock size={13} color="#94A3B8" strokeWidth={2} />
            <span>{event.time}</span>
          </div>
          <div className="event-card__meta-row">
            <MapPin size={13} color="#94A3B8" strokeWidth={2} />
            <span>{event.location}</span>
          </div>
        </div>

        <div className="event-card__divider" />

        <div className="event-card__host-row">
          <div className="event-card__host">
            <img src={event.hostAvatar} alt={event.host} />
            <span className="event-card__host-name">
              Hosted by <b>{event.host}</b>
            </span>
          </div>
          <button className="event-card__join-btn">Join</button>
        </div>
      </div>
    </article>
  );
}
