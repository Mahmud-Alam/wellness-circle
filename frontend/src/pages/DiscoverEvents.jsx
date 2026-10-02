import { useState, useEffect, useMemo } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import EventCard from "../components/cards/EventCard";
import { filterCategories } from "../data/constants";

function getGreeting() {
  const h = new Date().getHours();

  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DiscoverEvents() {
  const { user, profile } = useAuth();

  const [events, setEvents] = useState([]);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load real events from backend
  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setError("");

        const data = await api.get("/events");

        setEvents(data.events || []);
      } catch (err) {
        setError(err?.message || "Failed to load events.");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  // Filter events
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return events.filter((event) => {
      const category = event.category || "";

      // Backend uses location_text.
      // This also supports location in case the API changes later.
      const location = event.location_text || event.location || "";

      const host =
        event.host || event.host_name || event.profiles?.full_name || "";

      const title = event.title || "";

      const matchCat = activeFilter === "All" || category === activeFilter;

      const matchQuery =
        !q ||
        title.toLowerCase().includes(q) ||
        location.toLowerCase().includes(q) ||
        category.toLowerCase().includes(q) ||
        host.toLowerCase().includes(q);

      return matchCat && matchQuery;
    });
  }, [events, query, activeFilter]);

  // Get the logged-in user's name
  const userName =
    profile?.full_name.split(" ")[0] || user?.email?.split("@")[0] || "there";

  return (
    <div className="discover-page">
      {/* Sticky header */}
      <header className="discover-header">
        <div className="discover-header__inner">
          {/* Greeting row */}
          <div className="discover-greeting-row">
            <div className="discover-greeting-text">
              <p className="discover-greeting">
                {getGreeting()}, {userName} 👋
              </p>

              <h1 className="discover-title">
                Discover Wellness
                <br />
                Events Near You
              </h1>
            </div>

            {/* Mobile avatar */}
            <div className="discover-avatar-wrap block md:hidden">
              <img
                src={
                  profile?.profile_pic_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    profile?.full_name || "User",
                  )}&background=d1fae5&color=047857`
                }
                alt={profile?.full_name || "Profile"}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://ui-avatars.com/api/?name=User&background=d1fae5&color=047857";
                }}
              />

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
                  type="button"
                  className="discover-search-clear"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                >
                  <X size={10} color="#64748B" strokeWidth={3} />
                </button>
              )}
            </div>

            <button type="button" className="discover-sort-btn">
              <SlidersHorizontal size={16} color="#10B981" strokeWidth={2} />
              Sort: Nearest
            </button>
          </div>

          {/* Filter pills */}
          <div className="discover-filters">
            {filterCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-pill ${
                  activeFilter === cat ? "active" : ""
                }`}
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
        {/* Result count */}
        <div className="discover-result-row">
          <p className="discover-result-count">
            <b>{filtered.length}</b>{" "}
            {filtered.length === 1 ? "event" : "events"} found
          </p>

          <button type="button" className="discover-sort-mobile">
            <SlidersHorizontal size={13} color="#10B981" strokeWidth={2} />
            Sort: Nearest
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="discover-empty">
            <div className="discover-empty__icon">
              <LoaderSpinner />
            </div>

            <p className="discover-empty__title">Loading events...</p>

            <p className="discover-empty__text">
              Finding wellness events for you
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="discover-empty">
            <div className="discover-empty__icon">
              <Search size={24} color="#EF4444" strokeWidth={2} />
            </div>

            <p className="discover-empty__title">Unable to load events</p>

            <p className="discover-empty__text">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 text-sm text-emerald-600 font-medium"
            >
              Try again
            </button>
          </div>
        )}

        {/* Events */}
        {!loading && !error && filtered.length > 0 && (
          <div className="event-grid">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* No events */}
        {!loading && !error && filtered.length === 0 && (
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

// Small loading spinner
function LoaderSpinner() {
  return (
    <div className="w-6 h-6 border-2 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
  );
}
