import { useState } from "react";
import { Calendar, Heart } from "lucide-react";
import CategoryBadge from "../ui/CategoryBadge";

export default function CompactCard({ title, date, category, thumb }) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="compact-card">
      <div className="compact-card__thumb">
        <img src={thumb} alt={title} loading="lazy" />
      </div>

      <div className="compact-card__body">
        <p className="compact-card__title">{title}</p>
        <div className="compact-card__date">
          <Calendar size={11} color="#94A3B8" strokeWidth={2} />
          <span>{date}</span>
        </div>
        <div style={{ marginTop: "0.375rem" }}>
          <CategoryBadge label={category} />
        </div>
      </div>

      <button
        className="compact-card__save"
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
    </div>
  );
}
