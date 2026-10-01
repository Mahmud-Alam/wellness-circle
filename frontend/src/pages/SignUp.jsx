import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  ArrowRight,
  Loader2,
  User,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import Logo from "../components/layout/Logo";
import { useAuth } from "../context/AuthContext";

export default function SignUp() {
  const { user, loading, signUp } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    username: "",
    location: "",
    profile_pic_url: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate("/discover", { replace: true });
    }
  }, [user, loading, navigate]);

  const passwordStrength = (() => {
    if (form.password.length === 0) return 0;

    let score = 0;

    if (form.password.length >= 8) score++;
    if (/[A-Z]/.test(form.password)) score++;
    if (/[0-9]/.test(form.password)) score++;
    if (/[^A-Za-z0-9]/.test(form.password)) score++;

    return score;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][
    passwordStrength
  ];

  const strengthColor = ["", "#EF4444", "#F59E0B", "#3B82F6", "#10B981"][
    passwordStrength
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "email") {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setEmailError("Enter a valid email address");
      } else {
        setEmailError("");
      }
    }

    if (name === "password") {
      if (value && value.length < 8) {
        setPassError("Password must be at least 8 characters");
      } else {
        setPassError("");
      }
    }

    if (name === "username") {
      if (value && !/^[a-zA-Z0-9]+$/.test(value)) {
        setUsernameError("Username can contain only letters and numbers");
      } else if (value && value.length < 3) {
        setUsernameError("Username must be at least 3 characters");
      } else {
        setUsernameError("");
      }
    }
  };

  const canSubmit =
    form.email &&
    !emailError &&
    form.password.length >= 8 &&
    !passError &&
    form.full_name.trim() &&
    form.username.length >= 3 &&
    !usernameError &&
    form.location.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canSubmit) return;

    setError("");
    setSubmitting(true);

    try {
      await signUp({
        email: form.email,
        password: form.password,

        // Public signup always creates a normal user.
        role: "user",

        full_name: form.full_name.trim(),
        username: form.username.trim(),
        location: form.location.trim(),
        profile_pic_url: form.profile_pic_url.trim() || undefined,
      });

      navigate("/discover", { replace: true });
    } catch (err) {
      setError(err?.message || "Unable to create your account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-page">
        <div className="auth-page__accent" />

        {/* Header */}
        <div className="auth-header">
          <button
            className="auth-header__back"
            onClick={() => navigate("/")}
            aria-label="Go back"
            type="button"
          >
            <ArrowLeft size={20} color="#1E293B" strokeWidth={2.2} />
          </button>

          <Logo size={28} />

          <div className="auth-header__spacer" />
        </div>

        <div className="auth-body">
          {/* Illustration */}
          <div className="auth-illustration">
            <div className="auth-illustration__circle">
              <User size={44} color="#10B981" strokeWidth={1.8} />
            </div>
          </div>

          {/* Heading */}
          <div className="auth-heading">
            <h1>
              Create your
              <br />
              account
            </h1>

            <p>Join WellnessCircle and discover wellness events near you.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="auth-error" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="auth-field">
              <label className="auth-field__label">
                Email address
                <span className="auth-field__required">*</span>
              </label>

              <div className="auth-field__input-wrap">
                <span className="auth-field__icon-left">
                  <Mail
                    size={16}
                    color={
                      form.email && !emailError
                        ? "#10B981"
                        : emailError
                          ? "#EF4444"
                          : "#CBD5E1"
                    }
                    strokeWidth={2}
                  />
                </span>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`auth-field__input auth-field__input--with-left-icon auth-field__input--with-right-icon ${
                    emailError
                      ? "auth-field__input--error"
                      : form.email && !emailError
                        ? "auth-field__input--valid"
                        : ""
                  }`}
                />

                {form.email && (
                  <span className="auth-field__icon-right">
                    {emailError ? (
                      <AlertCircle size={16} color="#EF4444" />
                    ) : (
                      <Check size={16} color="#10B981" strokeWidth={2.5} />
                    )}
                  </span>
                )}
              </div>

              {emailError && (
                <p className="auth-field__error-text">
                  <AlertCircle size={11} />
                  {emailError}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="auth-field">
              <label className="auth-field__label">
                Password
                <span className="auth-field__required">*</span>
              </label>

              <div className="auth-field__input-wrap">
                <span className="auth-field__icon-left">
                  <Lock
                    size={16}
                    color={
                      form.password && !passError
                        ? "#10B981"
                        : passError
                          ? "#EF4444"
                          : "#CBD5E1"
                    }
                    strokeWidth={2}
                  />
                </span>

                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  className={`auth-field__input auth-field__input--with-left-icon auth-field__input--with-right-icon ${
                    passError
                      ? "auth-field__input--error"
                      : form.password && !passError
                        ? "auth-field__input--valid"
                        : ""
                  }`}
                />

                <button
                  type="button"
                  className="auth-field__icon-right"
                  onClick={() => setShowPass((prev) => !prev)}
                  style={{
                    cursor: "pointer",
                    pointerEvents: "auto",
                    background: "none",
                    border: "none",
                  }}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? (
                    <EyeOff size={17} color="#94A3B8" />
                  ) : (
                    <Eye size={17} color="#94A3B8" />
                  )}
                </button>
              </div>

              {/* Password strength */}
              {form.password.length > 0 && (
                <div className="auth-strength">
                  <div className="auth-strength__bars">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="auth-strength__bar"
                        style={{
                          backgroundColor:
                            i <= passwordStrength ? strengthColor : "#E2E8F0",
                        }}
                      />
                    ))}
                  </div>

                  <div className="auth-strength__labels">
                    <span
                      className="auth-strength__label"
                      style={{
                        color: strengthColor,
                      }}
                    >
                      {strengthLabel}
                    </span>

                    <span className="auth-strength__hint">
                      Use uppercase, numbers & symbols
                    </span>
                  </div>
                </div>
              )}

              {passError && (
                <p className="auth-field__error-text">
                  <AlertCircle size={11} />
                  {passError}
                </p>
              )}
            </div>

            {/* Full Name */}
            <div className="auth-field">
              <label className="auth-field__label">
                Full Name
                <span className="auth-field__required">*</span>
              </label>

              <div className="auth-field__input-wrap">
                <span className="auth-field__icon-left">
                  <User size={16} color="#CBD5E1" />
                </span>

                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  autoComplete="name"
                  className="auth-field__input auth-field__input--with-left-icon"
                />
              </div>
            </div>

            {/* Username */}
            <div className="auth-field">
              <label className="auth-field__label">
                Username
                <span className="auth-field__required">*</span>
              </label>

              <div className="auth-field__input-wrap">
                <span
                  className="auth-field__icon-left"
                  style={{
                    fontSize: "0.9rem",
                    color: "#94A3B8",
                  }}
                >
                  @
                </span>

                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="janedoe"
                  autoCapitalize="none"
                  autoComplete="username"
                  className={`auth-field__input auth-field__input--with-left-icon ${
                    usernameError ? "auth-field__input--error" : ""
                  }`}
                />
              </div>

              {usernameError && (
                <p className="auth-field__error-text">
                  <AlertCircle size={11} />
                  {usernameError}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="auth-field">
              <label className="auth-field__label">
                Location
                <span className="auth-field__required">*</span>
              </label>

              <div className="auth-field__input-wrap">
                <span className="auth-field__icon-left">
                  <MapPin size={16} color="#CBD5E1" />
                </span>

                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Sydney, NSW"
                  className="auth-field__input auth-field__input--with-left-icon"
                />
              </div>
            </div>

            {/* Profile picture */}
            <div className="auth-field">
              <label className="auth-field__label">
                Profile Picture URL
                <span
                  style={{
                    marginLeft: "0.35rem",
                    color: "#94A3B8",
                    fontWeight: 400,
                  }}
                >
                  (optional)
                </span>
              </label>

              <input
                type="url"
                name="profile_pic_url"
                value={form.profile_pic_url}
                onChange={handleChange}
                placeholder="https://..."
                className="auth-field__input"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary"
              disabled={!canSubmit || submitting}
              style={{
                marginTop: "0.25rem",
              }}
            >
              {submitting ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin-slow"
                    strokeWidth={2.5}
                  />
                  Creating account…
                </>
              ) : (
                <>
                  Sign Up
                  <ArrowRight size={16} strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>

          {/* Login */}
          <p className="auth-footer-link">
            Already have an account?{" "}
            <button type="button" onClick={() => navigate("/login")}>
              Log In
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
