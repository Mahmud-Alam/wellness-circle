import { useState } from "react";
import {
  ArrowLeft, Check, Calendar, Clock, MapPin,
  ShoppingCart, Users, Globe, Lock, Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CategoryBadge from "../components/ui/CategoryBadge";

const CATEGORIES = [
  "Yoga", "Running", "Meditation", "Pilates",
  "Breathwork", "Cycling", "Nutrition", "Sound Healing",
];

export default function CreateEvent() {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isValid = title.trim() && date && time && location.trim() && category;

  function handleSubmit(e) {
    e?.preventDefault();
    if (!isValid) return;
    setSubmitted(true);
  }

  function resetForm() {
    setSubmitted(false);
    setTitle(""); setDescription(""); setDate("");
    setTime(""); setLocation(""); setCategory(""); setImageUrl("");
  }

  if (submitted) {
    return (
      <div className="create-success">
        <div className="create-success__icon">
          <Check size={36} color="#10B981" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="create-success__title">Event Published!</h2>
          <p className="create-success__text">
            <b>{title}</b> is now live. Your community can discover and join it.
          </p>
        </div>
        <button className="btn-primary" onClick={resetForm}>
          Create Another
        </button>
      </div>
    );
  }

  return (
    <div className="create-page">
      {/* Header */}
      <header className="create-header">
        <div className="create-header__inner">
          <button
            className="create-header__back"
            onClick={() => navigate("/discover")}
            aria-label="Go back"
          >
            <ArrowLeft size={20} color="#1E293B" strokeWidth={2.2} />
          </button>
          <div className="create-header__title-wrap">
            <h1 className="create-header__title">Create Event</h1>
            <p className="create-header__sub">Share your practice with the community</p>
          </div>
          <div className="create-header__steps">
            <div className="create-header__step active" />
            <div className="create-header__step" />
            <div className="create-header__step" />
          </div>
        </div>
      </header>

      {/* Form */}
      <form className="create-form" onSubmit={handleSubmit}>
        {/* Cover Image */}
        <div className="create-field">
          <label className="create-field__label">Cover Image</label>
          <div className="create-upload">
            <div className="create-upload__zone">
              {imageUrl ? (
                <>
                  <img src={imageUrl} alt="Cover preview" className="create-upload__preview-img" />
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
                  <p className="create-upload__sub">JPG, PNG or WebP · Max 5 MB</p>
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
            Event Title<span className="create-field__required">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Morning Yoga in Rockdale Park"
            maxLength={80}
            className="create-field__input"
          />
          <span className={`create-field__char-count ${title.length > 80 ? "over" : ""}`}>
            {title.length}/80
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
            maxLength={500}
            className="create-field__input"
            style={{ resize: "none", lineHeight: 1.5 }}
          />
          <span className={`create-field__char-count ${description.length > 500 ? "over" : ""}`}>
            {description.length}/500
          </span>
        </div>

        <div className="create-form__divider" />

        {/* Date & Time */}
        <div className="create-datetime-row">
          <div className="create-field">
            <label className="create-field__label">
              Date<span className="create-field__required">*</span>
            </label>
            <div className="create-field__input-wrap">
              <span className="create-field__input-icon">
                <Calendar size={15} color={date ? "#10B981" : "#94A3B8"} strokeWidth={2} />
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="create-field__input create-field__input--with-icon"
                style={{ colorScheme: "light" }}
              />
            </div>
          </div>
          <div className="create-field">
            <label className="create-field__label">
              Time<span className="create-field__required">*</span>
            </label>
            <div className="create-field__input-wrap">
              <span className="create-field__input-icon">
                <Clock size={15} color={time ? "#10B981" : "#94A3B8"} strokeWidth={2} />
              </span>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="create-field__input create-field__input--with-icon"
                style={{ colorScheme: "light" }}
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="create-field">
          <label className="create-field__label">
            Location<span className="create-field__required">*</span>
          </label>
          <div className="create-field__input-wrap">
            <span className="create-field__input-icon">
              <MapPin size={15} color={location ? "#10B981" : "#94A3B8"} strokeWidth={2} />
            </span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Rockdale Park, NSW"
              className="create-field__input create-field__input--with-icon"
            />
          </div>
        </div>

        {/* Category */}
        <div className="create-field">
          <label className="create-field__label">
            Category<span className="create-field__required">*</span>
          </label>
          <div className="create-field__input-wrap">
            <span className="create-field__input-icon">
              <ShoppingCart size={15} color={category ? "#10B981" : "#94A3B8"} strokeWidth={2} />
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
            >
              <option value="" disabled>Select a category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
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

        {/* Max Attendees */}
        <div className="create-field">
          <label className="create-field__label">Max Attendees</label>
          <div className="create-field__input-wrap">
            <span className="create-field__input-icon">
              <Users size={15} color="#94A3B8" strokeWidth={2} />
            </span>
            <input
              type="number"
              min={1}
              max={500}
              placeholder="e.g., 20"
              className="create-field__input create-field__input--with-icon"
            />
          </div>
          <p className="create-field__hint">Leave blank for unlimited capacity</p>
        </div>

        {/* Visibility */}
        <div className="create-field">
          <label className="create-field__label">Visibility</label>
          <div className="create-visibility">
            <label className="create-visibility__option active">
              <input type="radio" name="visibility" value="Public" defaultChecked className="sr-only" />
              <Globe size={15} strokeWidth={2} />
              Public
            </label>
            <label className="create-visibility__option">
              <input type="radio" name="visibility" value="Private" className="sr-only" />
              <Lock size={15} strokeWidth={2} />
              Private
            </label>
          </div>
        </div>
      </form>

      {/* Sticky submit footer */}
      <div className="create-submit-footer">
        <div className="create-submit-footer__inner">
          <button
            className="create-submit-btn"
            onClick={handleSubmit}
            disabled={!isValid}
          >
            {isValid ? "Publish Event" : "Fill in required fields"}
          </button>
          <p className="create-submit-note">
            Your event will be visible to the WellnessCircle community
          </p>
        </div>
      </div>
    </div>
  );
}
