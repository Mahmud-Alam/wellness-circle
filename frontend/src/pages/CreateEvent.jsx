import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  ShoppingCart,
  Upload,
  AlertCircle,
  Send,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import CategoryBadge from "../components/ui/CategoryBadge";

const CATEGORIES = ["Yoga", "Running", "Meditation", "Marathon", "Other"];

export default function CreateEvent() {
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isValid = title.trim() && date && time && location.trim() && category;

  // Prevent selecting a date/time in the past.
  const minDateTime = new Date(Date.now() + 60 * 60 * 1000);

  const minDate = minDateTime.toISOString().split("T")[0];

  const minTime =
    date === minDate ? minDateTime.toTimeString().slice(0, 5) : undefined;

  async function handleSubmit(e) {
    e?.preventDefault();

    if (!isValid || submitting) return;

    setError("");

    // Combine the old separate date + time fields
    // into the datetime value expected by the backend.
    const eventDate = new Date(`${date}T${time}`);

    if (eventDate <= new Date()) {
      setError("Event date and time must be in the future.");
      return;
    }

    setSubmitting(true);

    try {
      const data = await api.post("/events", {
        title: title.trim(),
        description: description.trim(),
        event_date: eventDate.toISOString(),
        location_text: location.trim(),
        category,
        cover_image_url: imageUrl.trim() || undefined,
      });

      // Backend successfully created the event.
      // Open the newly created event page.
      navigate(`/event/${data.event.id}`, {
        replace: true,
      });
    } catch (err) {
      setError(err?.message || "Failed to create event. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="create-page">
      {/* Header */}
      <header className="create-header">
        <div className="create-header__inner">
          <button
            type="button"
            className="create-header__back"
            onClick={() => navigate("/discover")}
            aria-label="Go back"
          >
            <ArrowLeft size={20} color="#1E293B" strokeWidth={2.2} />
          </button>

          <div className="create-header__title-wrap">
            <h1 className="create-header__title">Create Event</h1>

            <p className="create-header__sub">
              Share your practice with the community
            </p>
          </div>

          <div className="create-header__steps">
            <div className="create-header__step active" />
            <div className="create-header__step" />
            <div className="create-header__step" />
          </div>
        </div>
      </header>

      {/* Error */}
      {error && (
        <div className="mx-auto max-w-3xl px-4 pt-5" role="alert">
          <div className="flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Form */}
      <form className="create-form" onSubmit={handleSubmit}>
        {/* Cover Image */}
        <div className="create-field">
          <label className="create-field__label">Cover Image</label>

          <div className="create-upload">
            <div className="create-upload__zone">
              {imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    alt="Cover preview"
                    className="create-upload__preview-img"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />

                  <div className="create-upload__preview-overlay">
                    <span>Change Image</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="create-upload__icon-circle">
                    <Upload size={22} color="#10B981" strokeWidth={2} />
                  </div>

                  <p className="create-upload__text">Upload Cover Image</p>

                  <p className="create-upload__sub">
                    JPG, PNG or WebP · Max 5 MB
                  </p>
                </>
              )}
            </div>

            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Or paste an image URL..."
              className="input"
              style={{ fontSize: "0.8125rem" }}
            />
          </div>
        </div>

        <div className="create-form__divider" />

        {/* Title */}
        <div className="create-field">
          <label className="create-field__label">
            Event Title
            <span className="create-field__required">*</span>
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Morning Yoga in Rockdale Park"
            maxLength={200}
            className="create-field__input"
            required
          />

          <span
            className={`create-field__char-count ${
              title.length > 200 ? "over" : ""
            }`}
          >
            {title.length}/200
          </span>
        </div>

        {/* Description */}
        <div className="create-field">
          <label className="create-field__label">Description</label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell attendees what to expect — the vibe, what to bring, skill level..."
            rows={4}
            maxLength={2000}
            className="create-field__input"
            style={{
              resize: "none",
              lineHeight: 1.5,
            }}
          />

          <span
            className={`create-field__char-count ${
              description.length > 2000 ? "over" : ""
            }`}
          >
            {description.length}/2000
          </span>
        </div>

        <div className="create-form__divider" />

        {/* Date & Time */}
        <div className="create-datetime-row">
          <div className="create-field">
            <label className="create-field__label">
              Date
              <span className="create-field__required">*</span>
            </label>

            <div className="create-field__input-wrap">
              <span className="create-field__input-icon">
                <Calendar
                  size={15}
                  color={date ? "#10B981" : "#94A3B8"}
                  strokeWidth={2}
                />
              </span>

              <input
                type="date"
                value={date}
                min={minDate}
                onChange={(e) => setDate(e.target.value)}
                className="create-field__input create-field__input--with-icon"
                style={{ colorScheme: "light" }}
                required
              />
            </div>
          </div>

          <div className="create-field">
            <label className="create-field__label">
              Time
              <span className="create-field__required">*</span>
            </label>

            <div className="create-field__input-wrap">
              <span className="create-field__input-icon">
                <Clock
                  size={15}
                  color={time ? "#10B981" : "#94A3B8"}
                  strokeWidth={2}
                />
              </span>

              <input
                type="time"
                value={time}
                min={minTime}
                onChange={(e) => setTime(e.target.value)}
                className="create-field__input create-field__input--with-icon"
                style={{ colorScheme: "light" }}
                required
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="create-field">
          <label className="create-field__label">
            Location
            <span className="create-field__required">*</span>
          </label>

          <div className="create-field__input-wrap">
            <span className="create-field__input-icon">
              <MapPin
                size={15}
                color={location ? "#10B981" : "#94A3B8"}
                strokeWidth={2}
              />
            </span>

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Rockdale Park, NSW"
              className="create-field__input create-field__input--with-icon"
              required
            />
          </div>
        </div>

        {/* Category */}
        <div className="create-field">
          <label className="create-field__label">
            Category
            <span className="create-field__required">*</span>
          </label>

          <div className="create-field__input-wrap">
            <span className="create-field__input-icon">
              <ShoppingCart
                size={15}
                color={category ? "#10B981" : "#94A3B8"}
                strokeWidth={2}
              />
            </span>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="create-field__input create-field__input--with-icon"
              style={{
                appearance: "none",
                cursor: "pointer",
                color: category ? "#1E293B" : "#94A3B8",
              }}
              required
            >
              <option value="" disabled>
                Select a category
              </option>

              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {category && (
            <div className="create-field__preview">
              <span>Preview:</span>
              <CategoryBadge label={category} />
            </div>
          )}
        </div>

        {/* Submit area */}
        <div className="create-submit-footer">
          <div className="create-submit-footer__inner">
            <button
              type="submit"
              className="create-submit-btn"
              disabled={!isValid || submitting}
            >
              {submitting ? (
                <>
                  <Send size={16} className="animate-pulse" />
                  Creating Event...
                </>
              ) : isValid ? (
                <>
                  <Send size={16} />
                  Publish Event
                </>
              ) : (
                "Fill in required fields"
              )}
            </button>

            <p className="create-submit-note">
              Your event will be visible to the WellnessCircle community
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
