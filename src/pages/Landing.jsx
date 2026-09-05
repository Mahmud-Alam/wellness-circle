import { Search, Users, PlusCircle, Star, ArrowRight, Lock, Zap, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import Logo from "../components/layout/Logo";

const FEATURES = [
  { iconName: "search", title: "Discover Events", desc: "Browse yoga classes, meditation circles, group runs, and more — all happening right in your neighbourhood." },
  { iconName: "users",  title: "Join & Connect",  desc: "Meet like-minded people in your area. Build real friendships through shared practices and movement." },
  { iconName: "plus",   title: "Host Your Own",   desc: "Share your practice with the world. Create and host events that bring your local wellness community together." },
];
const FEATURE_ICONS = { search: Search, users: Users, plus: PlusCircle };

const TESTIMONIALS = [
  { quote: "I went from knowing no one in my suburb to having a whole yoga crew within a month.", name: "Priya N.", location: "Newtown, NSW", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format" },
  { quote: "WellnessCircle made it so easy to find a morning run group. Best thing I did all year.", name: "James O.", location: "Fortitude Valley, QLD", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format" },
];

const TRUST_SIGNALS = [
  { Icon: Lock, label: "Private & secure" },
  { Icon: Zap, label: "Free forever" },
  { Icon: MapPin, label: "Local-first" },
];

const AVATAR_STACK = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&auto=format",
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <div className="auth-page">
        <div className="landing__accent" />

        {/* Nav */}
        <nav className="landing__nav">
          <div className="landing__nav-inner">
            <Logo size={32} />
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <button
                className="btn-ghost"
                onClick={() => navigate("/login")}
              >
                Log In
              </button>
              <button
                className="btn-primary"
                style={{ padding: "0.5rem 1.25rem", fontSize: "0.8125rem" }}
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="landing__hero">
          <img
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&h=700&fit=crop&auto=format&q=80"
            alt="People doing yoga together in a park"
          />
          <div className="landing__hero-overlay" />

          <div className="landing__hero-badge">
            <span className="landing__hero-badge-dot" />
            <span>240+ events happening near you</span>
          </div>

          <div className="landing__hero-content">
            <h1 className="landing__hero-title">
              Find Your Local<br />Wellness Community.
            </h1>
            <p className="landing__hero-subtitle">
              Combat loneliness. Discover, join, and host local wellness events near you.
            </p>
          </div>
        </section>

        {/* CTA Card */}
        <div className="landing__cta-card">
          <button
            className="btn-primary"
            style={{ width: "100%", padding: "1rem" }}
            onClick={() => navigate("/signup")}
          >
            Get Started — it's free
          </button>
          <div className="landing__cta-divider">
            <span>or</span>
          </div>
          <button
            className="btn-secondary"
            style={{ width: "100%", padding: "0.875rem" }}
            onClick={() => navigate("/login")}
          >
            Log In to your account
          </button>
          <div className="landing__trust-row">
            {TRUST_SIGNALS.map(({ Icon, label }) => (
              <div key={label} className="landing__trust-item">
                <Icon size={12} color="#94A3B8" strokeWidth={2} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <section className="landing__social">
          <div className="landing__avatar-stack">
            {AVATAR_STACK.map((src, i) => (
              <img key={i} src={src} alt="Community member" />
            ))}
            <div className="landing__avatar-more">
              <span>+2k</span>
            </div>
          </div>
          <p className="landing__social-text">
            Joined by <b>2,400+ wellness seekers</b> across Australia
          </p>
          <div className="landing__stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} fill="#F59E0B" strokeWidth={0} />
            ))}
            <span>4.9 · 380+ reviews</span>
          </div>
        </section>

        {/* Features */}
        <section className="landing__features">
          <div className="landing__features-header">
            <p className="section-label">How it works</p>
            <h2 className="landing__features-title" style={{ marginTop: "0.25rem" }}>
              Everything you need<br />to find your tribe.
            </h2>
          </div>
          {FEATURES.map(({ iconName, title, desc }, i) => {
            const Icon = FEATURE_ICONS[iconName];
            return (
              <div key={title} className="landing__feature-card">
                <div className="landing__feature-icon-wrap">
                  <div className="landing__feature-icon-box">
                    {Icon && <Icon size={26} color="#10B981" strokeWidth={2} />}
                  </div>
                  <div className="landing__feature-number">
                    <span>{i + 1}</span>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 className="landing__feature-title">{title}</h3>
                  <p className="landing__feature-desc">{desc}</p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Testimonials */}
        <section className="landing__testimonials">
          <div className="landing__testimonials-header">
            <p className="section-label">Community love</p>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginTop: "0.25rem" }}>
              Real people, real results.
            </h2>
          </div>
          {TESTIMONIALS.map(({ quote, name, location, avatar }) => (
            <div key={name} className="landing__testimonial-card">
              <div style={{ display: "flex", gap: "0.125rem", marginBottom: "0.75rem" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} fill="#F59E0B" strokeWidth={0} />
                ))}
              </div>
              <p className="landing__testimonial-quote">"{quote}"</p>
              <div className="landing__testimonial-author">
                <img src={avatar} alt={name} />
                <div>
                  <p className="landing__testimonial-name">{name}</p>
                  <p className="landing__testimonial-location">{location}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Final CTA */}
        <section className="landing__final-cta">
          <h2>Ready to find your<br />wellness community?</h2>
          <p>Join thousands of people already moving, meditating, and connecting near you.</p>
          <button
            className="landing__final-cta-btn"
            onClick={() => navigate("/signup")}
          >
            Get Started — it's free
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
          <p className="landing__final-cta-note">No credit card required · Cancel anytime</p>
        </section>

        {/* Footer */}
        <footer className="landing__footer">
          <Logo size={24} />
          <div className="landing__footer-links">
            {["Log In", "Sign Up", "Discover Events", "Host an Event", "About", "Privacy"].map((link) => (
              <button
                key={link}
                onClick={() => {
                  if (link === "Log In") navigate("/login");
                  else if (link === "Sign Up") navigate("/signup");
                  else if (link === "Discover Events") navigate("/discover");
                }}
              >
                {link}
              </button>
            ))}
          </div>
          <div className="divider" style={{ marginBottom: "1rem" }} />
          <p className="landing__footer-copy">
            © {new Date().getFullYear()} WellnessCircle Pty Ltd. All rights reserved.
          </p>
          <p className="landing__footer-made">Made with care in Sydney, Australia 🌿</p>
        </footer>
      </div>
    </AuthLayout>
  );
}
