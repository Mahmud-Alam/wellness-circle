import { useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { events } from "../data/events";
import { filterCategories } from "../data/constants";
import { CURRENT_USER } from "../data/constants";
import EventCard from "../components/cards/EventCard";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DiscoverEvents() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = events.filter((e) => {
    const matchCat = activeFilter === "All" || e.category === activeFilter;
    const q = query.toLowerCase();
    const matchQuery =
      !q ||
      e.title.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.host.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });

  return (
    <div className="discover-page">
      {/* Sticky header */}
      <header className="discover-header">
        <div className="discover-header__inner">
          {/* Greeting row */}
          <div className="discover-greeting-row">
            <div className="discover-greeting-text">
              <p className="discover-greeting">
                {getGreeting()}, {CURRENT_USER.firstName} 👋
              </p>
              <h1 className="discover-title">
                Discover Wellness
                <br />
                Events Near You
              </h1>
            </div>
            <div className="discover-avatar-wrap block md:hidden">
              <img src={CURRENT_USER.avatar} alt={CURRENT_USER.name} />
              <span className="discover-avatar-dot" />
            </div>
          </div>

          {/* Search + Sort */}
          <div className="discover-search-row">
            <div className="discover-search-wrap">
              <span className="discover-search-icon">
                <Search size={17} color="#94A3B8" strokeWidth={2.2} />
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Yoga, meditation, running..."
                className="discover-search-input"
              />
              {query.length > 0 && (
                <button
                  className="discover-search-clear"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                >
                  <X size={10} color="#64748B" strokeWidth={3} />
                </button>
              )}
            </div>

            <button className="discover-sort-btn">
              <SlidersHorizontal size={16} color="#10B981" strokeWidth={2} />
              Sort: Nearest
            </button>
          </div>

          {/* Filter pills */}
          <div className="discover-filters">
            {filterCategories.map((cat) => (
              <button
                key={cat}
                className={`filter-pill ${activeFilter === cat ? "active" : ""}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Event feed */}
      <main className="discover-main has-bottom-nav">
        <div className="discover-result-row">
          <p className="discover-result-count">
            <b>{filtered.length}</b> events found
          </p>
          <button className="discover-sort-mobile">
            <SlidersHorizontal size={13} color="#10B981" strokeWidth={2} />
            Sort: Nearest
          </button>
        </div>

        {filtered.length > 0 ? (
          <div className="event-grid">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="discover-empty">
            <div className="discover-empty__icon">
              <Search size={24} color="#10B981" strokeWidth={2} />
            </div>
            <p className="discover-empty__title">No events found</p>
            <p className="discover-empty__text">
              Try a different search or category
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
