import { useState } from "react";
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/layout/AuthLayout";
import Logo from "../components/layout/Logo";

export default function LogIn() {
  const navigate = useNavigate();
  const location = useLocation();

  // Real authentication from AuthContext
  const { signIn } = useAuth();

  // If user was redirected to login from a protected page,
  // send them back there after successful login.
  const from = location.state?.from || "/discover";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = email.trim().length > 0 && password.length > 0;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!canSubmit || submitting) return;

    setError("");
    setSubmitting(true);

    try {
      // Real backend authentication
      await signIn(email.trim(), password);

      // AuthContext should update the user.
      // Navigate to the original destination.
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err?.message ||
          "Unable to log in. Please check your email and password.",
      );
    } finally {
      setSubmitting(false);
    }
  }

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

        {/* Body */}
        <div className="auth-body">
          <div className="auth-heading">
            <h1>Welcome back.</h1>
            <p>
              Log in to pick up where you left off and see what's happening near
              you.
            </p>
          </div>

          {/* Authentication error */}
          {error && (
            <div
              className="mb-4 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700"
              role="alert"
            >
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="auth-field">
              <label className="auth-field__label">
                Email address
                <span className="auth-field__required">*</span>
              </label>

              <div className="auth-field__input-wrap">
                <span className="auth-field__icon-left">
                  <Mail size={16} color="#CBD5E1" strokeWidth={2} />
                </span>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="auth-field__input auth-field__input--with-left-icon"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-field">
              <div className="auth-field__label-row">
                <label className="auth-field__label" style={{ margin: 0 }}>
                  Password
                  <span className="auth-field__required">*</span>
                </label>

                <button
                  type="button"
                  className="btn-ghost"
                  style={{
                    fontSize: "0.6875rem",
                    padding: 0,
                  }}
                  onClick={() => {
                    // Add forgot-password flow later
                  }}
                >
                  Forgot password?
                </button>
              </div>

              <div className="auth-field__input-wrap">
                <span className="auth-field__icon-left">
                  <Lock size={16} color="#CBD5E1" strokeWidth={2} />
                </span>

                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  minLength={6}
                  required
                  className="auth-field__input auth-field__input--with-left-icon auth-field__input--with-right-icon"
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
                    <EyeOff size={17} color="#94A3B8" strokeWidth={2} />
                  ) : (
                    <Eye size={17} color="#94A3B8" strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="auth-remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />

              <span>Remember me on this device</span>
            </label>

            {/* Login button */}
            <button
              type="submit"
              className="btn-primary"
              disabled={!canSubmit || submitting}
              style={{ marginTop: "0.25rem" }}
            >
              {submitting ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin-slow"
                    strokeWidth={2.5}
                  />
                  Logging in…
                </>
              ) : (
                <>
                  Log In
                  <ArrowRight size={16} strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>

          {/* Sign up */}
          <p className="auth-footer-link">
            Don't have an account?{" "}
            <button type="button" onClick={() => navigate("/signup")}>
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
