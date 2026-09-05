import { useState } from "react";
import {
  ArrowLeft, Mail, Lock, Eye, EyeOff, Check,
  AlertCircle, ArrowRight, Loader2, User, Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import Logo from "../components/layout/Logo";

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const passwordStrength = (() => {
    if (password.length === 0) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  })();
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][passwordStrength];
  const strengthColor = ["", "#EF4444", "#F59E0B", "#3B82F6", "#10B981"][passwordStrength];

  function validateEmail(v) {
    setEmail(v);
    if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setEmailError("Enter a valid email address");
    } else {
      setEmailError("");
    }
  }
  function validatePassword(v) {
    setPassword(v);
    if (v && v.length < 8) {
      setPassError("Password must be at least 8 characters");
    } else {
      setPassError("");
    }
  }

  const canSubmit = email && !emailError && password.length >= 8 && !passError && agreed;

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/discover");
    }, 1100);
  }

  return (
    <AuthLayout>
      <div className="auth-page">
        <div className="auth-page__accent" />

        <div className="auth-header">
          <button
            className="auth-header__back"
            onClick={() => navigate("/")}
            aria-label="Go back"
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
              <div className="auth-illustration__badge">
                <Plus size={8} color="white" strokeWidth={3} />
              </div>
            </div>
          </div>

          <div className="auth-heading">
            <h1>Create your<br />account</h1>
            <p>Join 2,400+ wellness seekers discovering events near them every day.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="auth-field">
              <label className="auth-field__label">
                Email address<span className="auth-field__required">*</span>
              </label>
              <div className="auth-field__input-wrap">
                <span className="auth-field__icon-left">
                  <Mail
                    size={16}
                    color={email && !emailError ? "#10B981" : emailError ? "#EF4444" : "#CBD5E1"}
                    strokeWidth={2}
                  />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => validateEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`auth-field__input auth-field__input--with-left-icon auth-field__input--with-right-icon ${
                    emailError ? "auth-field__input--error" : email && !emailError ? "auth-field__input--valid" : ""
                  }`}
                />
                {email && (
                  <span className="auth-field__icon-right">
                    {emailError
                      ? <AlertCircle size={16} color="#EF4444" strokeWidth={2} />
                      : <Check size={16} color="#10B981" strokeWidth={2.5} />}
                  </span>
                )}
              </div>
              {emailError && (
                <p className="auth-field__error-text">
                  <AlertCircle size={11} strokeWidth={2} />
                  {emailError}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="auth-field">
              <div className="auth-field__label-row">
                <label className="auth-field__label" style={{ margin: 0 }}>
                  Password<span className="auth-field__required">*</span>
                </label>
                <button type="button" className="btn-ghost" style={{ fontSize: "0.6875rem", padding: 0 }}>
                  Forgot password?
                </button>
              </div>
              <div className="auth-field__input-wrap">
                <span className="auth-field__icon-left">
                  <Lock
                    size={16}
                    color={password && !passError ? "#10B981" : passError ? "#EF4444" : "#CBD5E1"}
                    strokeWidth={2}
                  />
                </span>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => validatePassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  className={`auth-field__input auth-field__input--with-left-icon auth-field__input--with-right-icon ${
                    passError ? "auth-field__input--error" : password && !passError ? "auth-field__input--valid" : ""
                  }`}
                />
                <button
                  type="button"
                  className="auth-field__icon-right"
                  onClick={() => setShowPass(!showPass)}
                  style={{ cursor: "pointer", pointerEvents: "auto", background: "none", border: "none" }}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass
                    ? <EyeOff size={17} color="#94A3B8" strokeWidth={2} />
                    : <Eye size={17} color="#94A3B8" strokeWidth={2} />}
                </button>
              </div>

              {password.length > 0 && (
                <div className="auth-strength">
                  <div className="auth-strength__bars">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="auth-strength__bar"
                        style={{ backgroundColor: i <= passwordStrength ? strengthColor : "#E2E8F0" }}
                      />
                    ))}
                  </div>
                  <div className="auth-strength__labels">
                    <span className="auth-strength__label" style={{ color: strengthColor }}>
                      {strengthLabel}
                    </span>
                    <span className="auth-strength__hint">Use uppercase, numbers & symbols</span>
                  </div>
                </div>
              )}

              {passError && (
                <p className="auth-field__error-text">
                  <AlertCircle size={11} strokeWidth={2} />
                  {passError}
                </p>
              )}
            </div>

            {/* Terms */}
            <label className="auth-terms">
              <button
                type="button"
                className={`auth-terms__box ${agreed ? "checked" : ""}`}
                onClick={() => setAgreed(!agreed)}
                aria-pressed={agreed}
                aria-label="Agree to Terms"
              >
                {agreed && <Check size={10} color="white" strokeWidth={3.5} />}
              </button>
              <span className="auth-terms__text">
                I agree to the <a>Terms of Service</a> and <a>Privacy Policy</a>
              </span>
            </label>

            <button
              type="submit"
              className="btn-primary"
              disabled={!canSubmit || loading}
              style={{ marginTop: "0.25rem" }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin-slow" strokeWidth={2.5} />
                  Creating account…
                </>
              ) : (
                <>
                  Sign Up
                  <ArrowRight size={16} strokeWidth={2.5} />
                </>
              )}
            </button>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <button
              type="button"
              className="auth-oauth-btn"
              onClick={() => navigate("/discover")}
            >
              <svg width={18} height={18} viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            <button
              type="button"
              className="auth-oauth-btn"
              onClick={() => navigate("/discover")}
            >
              <svg width={17} height={17} viewBox="0 0 24 24" fill="#1E293B">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-.22.14-2.2 1.28.03 2.53 2.65 3.81 2.68 3.82-.03.07-.42 1.44-1.38 2.77M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Continue with Apple
            </button>
          </form>

          <p className="auth-footer-link">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")}>Log In</button>
          </p>
          <p className="auth-footer-note">
            By signing up you agree to receive occasional emails about wellness events near you. You can unsubscribe at any time.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
