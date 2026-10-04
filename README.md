# 🌿 Wellness Circle

**Discover wellness events near you — move, breathe and grow, together.**

> A mobile-first, full-stack web application that combats urban loneliness by helping people discover, join, and host local wellness events — yoga in the park, guided breathwork, trail-running clinics, and more.

**Live Demo:** [wellnesscircle.vercel.app](https://wellnesscircle.vercel.app/)
**Source Code:** [github.com/Mahmud-Alam/wellness-circle](https://github.com/Mahmud-Alam/wellness-circle)

---

## 📖 About The Project

**Wellness Circle** is a mobile-first full-stack web application for discovering local wellness events — sunrise yoga in the park, guided breathwork, trail-running clinics, plant-based nutrition workshops — and for keeping track of the events you attend and host. The platform is built on a clear three-tier architecture: a React single-page application frontend, an Express.js REST API backend, and a PostgreSQL database hosted on Supabase.

The experience is designed to feel like a polished native mobile app: a sticky greeting header, horizontally scrollable filter pills, bottom tab navigation on phones, and a clean responsive card grid that scales beautifully to desktop. The backend exposes 18 REST endpoints covering authentication, profile management, event discovery and CRUD, and attendee tracking — all protected by JWT-based authentication and role-based access control.

### 🎯 Purpose & Motivation

**The problem.** Wellness activities are everywhere, yet surprisingly hard to discover. They're scattered across Meetup listings, gym noticeboards, Instagram stories and WhatsApp groups — and the wellness world itself can feel intimidating: expensive studios, cliques that are hard to break into, and classes where beginners feel out of place. Meanwhile, more people than ever are looking for real, in-person ways to move their bodies and quiet their minds.

**The idea.** Wellness Circle puts local, community-run wellness events in one calm, friendly place. Browsing is low-pressure and instant — search, tap a category, see what's happening near you this week. The focus is on accessible, beginner-friendly gatherings in parks, piers and studios, hosted by real people from the community rather than faceless brands.

**The "circle" concept.** Wellness sticks when it's shared. The app is built around your circle of people — the events you attend, the ones you host, and the momentum you build together. The profile page surfaces your attending and hosting lists side-by-side so you can see your commitments at a glance.

**The inspiration.** The interface takes cues from the apps that get mobile UX right — native bottom tab navigation, pill-shaped filters and soft card layouts — while the product thinking borrows from the discovery simplicity of Meetup, the community accountability of Strava, and the calm visual language of mindfulness apps like Headspace. The emerald-green palette (`#10B981`) was chosen deliberately: it reads as growth, renewal and fresh air.

**The name.** A _circle_ — the group of people who move, breathe and grow together.

---

## 🏗️ System Architecture

The application follows a classic three-tier architecture with clear separation between presentation, application logic, and data layers.

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION TIER                         │
│                                                                  │
│   React 18 + Vite + Tailwind CSS + React Router v6              │
│   Deployed on Vercel (frontend)                                 │
│                                                                  │
│   • Single-page application                                     │
│   • Context API for global auth state                           │
│   • Client-side routing (7 routes)                              │
│   • Mobile-first responsive UI                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS / REST
                             │ Authorization: Bearer <jwt>
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION TIER                            │
│                                                                  │
│   Node.js + Express.js                                          │
│   Deployed on Vercel (serverless function via api/index.js)     │
│                                                                  │
│   Layered architecture:                                         │
│   Routes → Controllers → Services → Validators                  │
│                                                                  │
│   • 18 REST endpoints                                           │
│   • JWT authentication middleware                                │
│   • Role-based access control (admin / user)                    │
│   • bcryptjs password hashing                                    │
│   • express-validator input validation                           │
└────────────────────────────┬────────────────────────────────────┘
                             │ PostgreSQL connection (pg Pool)
                             │ SSL-secured
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                          DATA TIER                               │
│                                                                  │
│   PostgreSQL (hosted on Supabase)                               │
│                                                                  │
│   4 tables:                                                      │
│   • users (auth credentials + role)                              │
│   • profiles (public profile data, 1:1 with users)              │
│   • events (event metadata + creator FK)                        │
│   • event_attendees (many-to-many join)                          │
│                                                                  │
│   • Foreign keys with ON DELETE CASCADE                         │
│   • Unique constraint on (event_id, user_id)                    │
│   • Updated_at triggers                                          │
└─────────────────────────────────────────────────────────────────┘
```

### Communication Flow

1. The React frontend sends HTTPS REST requests to the Express API on Vercel
2. Each authenticated request includes a `Authorization: Bearer <jwt>` header
3. The Express `requireAuth` middleware verifies the JWT using `jsonwebtoken`
4. If the route is admin-protected, `requireAdmin` middleware checks `user.role === 'admin'`
5. The controller receives the validated request and delegates to the service layer
6. The service executes parameterized SQL via the `pg` Pool connection
7. The controller formats the response as a standardized JSON envelope:
   ```json
   { "success": true, "message": "...", "data": { ... } }
   ```

---

## ✨ Key Features

### 🔎 Discover Events (Public)

- **Live search** — instantly filters events by title, location, category or host.
- **Category filter pills** — All, Yoga, Running, Meditation, Marathon, Other, with active-state highlight.
- **Responsive event grid** — flows from 1 column on phones to 2 → 3 → 4 columns as the screen widens.
- **Rich event cards** — cover image, host avatar, date/time, location, attendee count, and quick-join button.
- **Time-aware greeting** — the header says good morning, afternoon or evening based on the visitor's clock.
- **Graceful empty state** — a friendly illustration and guidance when a search returns no results.

### 👤 Profile Management

- **Identity card** — avatar with edit affordance, location, member-since date, role badge (Admin/Member).
- **Stats grid** — events attended, hosting and upcoming, each with its own colour-coded icon.
- **Attending / Hosting tabs** — switch between the two event lists with live counts on each tab.
- **Edit profile** — inline form to update full name, profile picture URL, and location.

### 🔐 Authentication & Authorization

- **Email/password registration** with bcrypt password hashing (10 salt rounds).
- **JWT-based login** — tokens expire after 7 days, stored in `localStorage`.
- **Role-based access control**:
  - **Admin** (event hosts): can create events, view attendee lists, manage user roles.
  - **User** (attendees): can join/leave events, edit their own profile.
- **Server-side enforcement** — role checks via `requireAuth` and `requireAdmin` middleware; the frontend never makes authorization decisions alone.

### 📅 Event Lifecycle

- **Create Event** (admin only) — title, description, date/time picker, location, category dropdown, cover image URL.
- **View Event Details** (public) — full cover image, description, date, location, host info, attendee count, join/leave button.
- **Join / Leave Event** (any authenticated user) — idempotent endpoint prevents duplicate joins; creators cannot join their own events.
- **Attendee List** (admin only) — admin can see every user who joined an event, including names and avatars.

### 🛡️ Admin User Management

- **User Management page** (admin only) — list all registered users with role badges.
- **Toggle Role** — promote a regular user to admin or demote an admin to member with one click.
- **Safety guard** — admins cannot change their own role.

### 🧭 Everywhere

- **Mobile-first, desktop-aware** — bottom navigation and sticky headers on small screens; top navigation and a centred, max-width layout on desktop.
- **Category colour system** — every category carries consistent badge colours across the whole app.
- **Component-driven architecture** — reusable `EventCard`, `CompactCard`, `AppLayout`, `ProtectedRoute`, and `Loader` components keep pages lean.

---

## 🛠️ Tech Stack

### Frontend

| Technology                                     | Role                    | Why it was chosen                                                                       |
| ---------------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------- |
| [React](https://react.dev) 18                  | UI library              | Component model and hooks make the card/tab/filter interactions clean and maintainable. |
| [Vite](https://vite.dev)                       | Build tool & dev server | Instant HMR in development, fast production builds, native ES modules.                  |
| [React Router DOM](https://reactrouter.com) v6 | Client-side routing     | Powers protected routes and navigation across 7 pages.                                  |
| [Tailwind CSS](https://tailwindcss.com/)       | Styling                 | Utility-first classes for rapid iteration and consistent design tokens.                 |
| [Lucide React](https://lucide.dev)             | Icon library            | Crisp, consistent, tree-shakable icons that match the calm aesthetic.                   |
| Context API                                    | State management        | Lightweight global auth state without Redux overhead.                                   |
| JavaScript (ES Modules)                        | Language                | Modern syntax, zero-config tooling.                                                     |

### Backend

| Technology                                                 | Role              | Why it was chosen                                                                                                                            |
| ---------------------------------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| [Node.js](https://nodejs.org)                              | Runtime           | Shares JavaScript with frontend; massive ecosystem.                                                                                          |
| [Express](https://expressjs.com)                           | Web framework     | Lightweight, flexible routing + middleware primitives. Enables explicit layered architecture (routes → controllers → services → validators). |
| [pg](https://node-postgres.com) (node-postgres)            | PostgreSQL driver | Direct SQL authorship with parameterized queries; connection pooling.                                                                        |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js)           | Password hashing  | Industry standard with adjustable salt rounds (10).                                                                                          |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | JWT auth          | Stateless authentication; tokens carry `id`, `email`, `role`.                                                                                |
| [express-validator](https://express-validator.github.io)   | Input validation  | Declarative validation chains with detailed error responses.                                                                                 |
| [helmet](https://helmetjs.github.io)                       | Security headers  | Sets HTTP security headers (XSS protection, no-sniff, etc.).                                                                                 |
| [cors](https://github.com/expressjs/cors)                  | CORS middleware   | Allows the frontend origin to call the API.                                                                                                  |
| [morgan](https://github.com/expressjs/morgan)              | HTTP logging      | Request logging for development and debugging.                                                                                               |

### Database & Hosting

| Technology                               | Role                       | Why it was chosen                                                                                                                                 |
| ---------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| [PostgreSQL](https://www.postgresql.org) | Relational database        | ACID-compliant; enforces referential integrity via foreign keys.                                                                                  |
| [Supabase](https://supabase.com)         | Managed Postgres host      | Free tier, SSL-secured connections, SQL editor for direct schema management.                                                                      |
| [Vercel](https://vercel.com)             | Frontend + backend hosting | Seamless GitHub integration, auto-deploy on push, free HTTPS, generous free tier. Both frontend and backend deployed as separate Vercel projects. |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20.19 (required by Vite)
- **npm** (comes with Node.js)
- A **Supabase account** (free tier is sufficient)
- A **Vercel account** (free tier is sufficient)

### Frontend Setup

```bash
# 1. Clone the repository
git clone https://github.com/Mahmud-Alam/wellness-circle.git
cd wellness-circle

# 2. Install dependencies
npm install

# 3. Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# 4. Start the dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Backend Setup

The backend lives in a separate repository at `wellness-circle-backend`. To run it locally:

```bash
# 1. Clone the backend repository
git clone https://github.com/Mahmud-Alam/wellness-circle-backend.git
cd wellness-circle-backend

# 2. Install dependencies
npm install

# 3. Create .env file (see .env.example for required vars)
cp .env.example .env
# Fill in: DATABASE_URL, JWT_SECRET, CLIENT_URL

# 4. Apply the SQL schema (see sql/schema.sql in the backend repo)
#    Run it in Supabase Dashboard → SQL Editor

# 5. Start the dev server
npm run dev
```

Open **http://localhost:5000/health** to verify the API is running.

### Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Navigate to **SQL Editor → New query**
3. Paste the contents of `sql/schema.sql` (in the backend repo) and click **Run**
4. Get your connection string from **Project Settings → Database → Connection string → URI**
5. Add it to your backend `.env` as `DATABASE_URL`

### Creating an Admin User

All new users default to the `user` role. To promote someone to admin:

```sql
-- Run in Supabase SQL Editor
UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
```

The user must then log out and log back in for the role change to take effect (roles are baked into the JWT).

| Command           | Description                                      |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Start the dev server with hot module replacement |
| `npm run build`   | Create an optimised production build in `dist/`  |
| `npm run preview` | Preview the production build locally             |

---

## 📁 Project Structure

### Frontend Repository (`wellness-circle`)

```
wellness-circle/
├── public/                              # Static assets
├── src/
│   ├── components/
│   │   ├── cards/
│   │   │   ├── EventCard.jsx            # Full event card (Discover grid)
│   │   │   └── CompactCard.jsx          # Compact event row (Profile lists)
│   │   ├── AppLayout.jsx                # Top nav (desktop) / bottom nav (mobile)
│   │   ├── ProtectedRoute.jsx           # Route guard (auth + adminOnly flag)
│   │   └── Loader.jsx                   # Loading spinner
│   ├── context/
│   │   └── AuthContext.jsx              # Global auth state (user, profile, signIn, signUp, signOut)
│   ├── lib/
│   │   └── api.js                       # Fetch wrapper (auto-injects JWT, parses JSON, throws on error)
│   ├── pages/
│   │   ├── DiscoverEvents.jsx           # Home: search + filters + event grid
│   │   ├── EventDetails.jsx             # Single event view with join/leave
│   │   ├── CreateEvent.jsx              # Admin-only event creation form
│   │   ├── Profile.jsx                  # Own profile + attending/hosting tabs + edit
│   │   ├── Users.jsx                    # Admin-only user management page
│   │   ├── Login.jsx                    # Email/password login
│   │   └── Signup.jsx                   # Registration with full profile
│   ├── App.jsx                          # Router setup with protected routes
│   ├── main.jsx                         # Entry point
│   └── index.css                        # Global styles / design tokens
├── index.html
├── package.json
└── vite.config.js
```

### Backend Repository (`wellness-circle-backend`)

```
wellness-circle-backend/
├── api/
│   └── index.js                          # Vercel serverless entry point
├── src/
│   ├── app.js                            # Express app (middleware, route mounting)
│   ├── server.js                         # Local dev server (with DB connection test)
│   ├── config/
│   │   ├── env.js                        # Environment variable loading + validation
│   │   └── db.js                         # Postgres Pool (query + getClient)
│   ├── middleware/
│   │   ├── auth.js                       # requireAuth, requireAdmin, optionalAuth
│   │   └── errors.js                     # validate, notFound, errorHandler
│   ├── routes/
│   │   ├── authRoutes.js                 # /api/auth/*
│   │   ├── profileRoutes.js              # /api/profile/*
│   │   ├── eventRoutes.js                # /api/events/*
│   │   └── userRoutes.js                 # /api/users/* (admin only)
│   ├── controllers/
│   │   ├── authController.js             # register, login, me
│   │   ├── profileController.js          # getMyProfile, updateMyProfile
│   │   ├── eventController.js            # list, get, create, update, delete, attendees, join, leave
│   │   └── userController.js             # listUsers, toggleRole
│   ├── services/
│   │   ├── authService.js                # signUp, signIn, getCurrentUserWithProfile
│   │   ├── profileService.js            # getProfile, updateProfile, getAttendingEvents, getHostingEvents
│   │   ├── eventService.js              # listUpcomingEvents, getEventById, createEvent, joinEvent, leaveEvent, listAttendees
│   │   └── userService.js              # listUsers, toggleUserRole
│   ├── validators.js                    # All express-validator chains in one file
│   └── utils.js                         # apiResponse (success/error), hashPassword, comparePassword, signToken, verifyToken
├── sql/
│   └── schema.sql                        # Full DB schema (users, profiles, events, event_attendees, triggers, RLS)
├── vercel.json
├── package.json
├── .env.example
└── README.md
```

---

## 🔌 API Reference

The backend exposes **18 REST endpoints** across four resource groups. All responses follow the envelope format `{ success, message, data }`. Authenticated requests require `Authorization: Bearer <jwt>`.

### Authentication (`/api/auth`)

| Method | Endpoint    | Auth | Description                                               |
| ------ | ----------- | ---- | --------------------------------------------------------- |
| POST   | `/register` | No   | Register with email, password, full profile. Returns JWT. |
| POST   | `/login`    | No   | Login with email/password. Returns JWT.                   |
| GET    | `/me`       | Yes  | Get current user + profile.                               |

### Profile (`/api/profile`)

| Method | Endpoint | Auth | Description                                            |
| ------ | -------- | ---- | ------------------------------------------------------ |
| GET    | `/`      | Yes  | Get own profile + attending/hosting events + stats.    |
| PUT    | `/`      | Yes  | Update own profile (full name, profile pic, location). |

### Events (`/api/events`)

| Method | Endpoint         | Auth     | Description                                                                          |
| ------ | ---------------- | -------- | ------------------------------------------------------------------------------------ |
| GET    | `/`              | No       | List upcoming events (search, category, pagination).                                 |
| GET    | `/:id`           | Optional | Get single event with creator + attendee count + `is_attending` flag (if logged in). |
| POST   | `/`              | Admin    | Create a new event.                                                                  |
| GET    | `/:id/attendees` | Admin    | List all users who joined this event.                                                |
| POST   | `/:id/join`      | Yes      | Join an event (idempotent).                                                          |
| DELETE | `/:id/leave`     | Yes      | Leave an event.                                                                      |

### User Management (`/api/users` — admin only)

| Method | Endpoint    | Auth  | Description                          |
| ------ | ----------- | ----- | ------------------------------------ |
| GET    | `/`         | Admin | List all registered users.           |
| PATCH  | `/:id/role` | Admin | Toggle a user's role (admin ↔ user). |

### Example: Register Request/Response

```http
POST /api/auth/register HTTP/1.1
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "password123",
  "full_name": "Jane Doe",
  "username": "janedoe",
  "location": "Sydney, NSW"
}
```

```json
{
  "success": true,
  "message": "Account created.",
  "data": {
    "user": {
      "id": "a1b2c3d4-...",
      "email": "jane@example.com",
      "role": "user",
      "created_at": "2026-10-04T..."
    },
    "profile": {
      "id": "...",
      "username": "janedoe",
      "full_name": "Jane Doe",
      "profile_pic_url": null,
      "location": "Sydney, NSW"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Example: Create Event Request

```http
POST /api/events HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "title": "Sunset Yoga at Bondi",
  "description": "Join us for a calming sunset yoga session by the beach. Bring your own mat.",
  "event_date": "2026-10-15T18:00:00.000Z",
  "location_text": "Bondi Beach, Sydney NSW",
  "category": "Yoga",
  "cover_image_url": "https://images.unsplash.com/photo-..."
}
```

---

## 🗄️ Database Schema

The PostgreSQL schema has 4 tables with referential integrity enforced via foreign keys.

```sql
-- USERS: auth accounts (we hash passwords ourselves with bcrypt)
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PROFILES: public profile data (1:1 with users)
CREATE TABLE profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name       TEXT NOT NULL,
  username        TEXT UNIQUE NOT NULL CHECK (char_length(username) >= 3
                                              AND username ~ '^[a-zA-Z0-9]+$'),
  profile_pic_url TEXT,
  location        TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- EVENTS: event metadata
CREATE TABLE events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  description      TEXT NOT NULL,
  event_date       TIMESTAMPTZ NOT NULL,
  location_text    TEXT NOT NULL,
  category         TEXT NOT NULL CHECK (category IN ('Yoga','Running','Meditation','Marathon','Other')),
  cover_image_url  TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- EVENT_ATTENDEES: many-to-many join (user ↔ event)
CREATE TABLE event_attendees (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, user_id)   -- prevents duplicate joins
);

-- updated_at triggers auto-maintain the timestamp on every UPDATE
```

**Key constraints:**

- `users.email` is UNIQUE (one account per email)
- `profiles.username` is UNIQUE and validated (3-30 chars, alphanumeric only)
- `profiles.user_id` is UNIQUE (one profile per user)
- `event_attendees` has a UNIQUE constraint on `(event_id, user_id)` to prevent duplicate joins
- All foreign keys use `ON DELETE CASCADE` so deleting a user or event automatically cleans up related rows

---

## 🎨 Design System

**Palette**

| Token             | Value                 | Usage                                       |
| ----------------- | --------------------- | ------------------------------------------- |
| Primary (emerald) | `#10B981`             | Buttons, active filters, brand, role badges |
| Yoga              | `#DCFCE7` / `#15803D` | Category badge background / text            |
| Meditation        | `#DBEAFE` / `#1D4ED8` | Category badge                              |
| Running           | `#FFE4E6` / `#BE123C` | Category badge                              |
| Admin badge       | `#EEF2FF` / `#4338CA` | Role indicator                              |
| Member badge      | `#ECFDF5` / `#047857` | Role indicator                              |

**Principles**

- **Mobile first** — every screen is designed for a phone, then progressively enhanced for desktop.
- **Calm, not loud** — soft pastel badges, generous whitespace and rounded cards keep the experience soothing.
- **Consistent categories** — a single `categoryStyles` map guarantees every category looks the same everywhere.
- **Accessibility** — semantic HTML (`nav`, `main`, `article`), aria-labels, alt text, keyboard focus rings, WCAG 2.1 AA contrast.

---

## 🔐 Security

- **Password hashing** — bcryptjs with 10 salt rounds; plaintext passwords never stored or logged.
- **JWT authentication** — 7-day expiry, signed with `JWT_SECRET` environment variable.
- **Role-based access control** — enforced server-side via `requireAuth` + `requireAdmin` middleware.
- **SQL injection prevention** — all queries use parameterized inputs via `pg` driver (`$1`, `$2`, ...).
- **Input validation** — `express-validator` chains reject malformed requests with `422 Unprocessable Entity` responses.
- **HTTPS-only in production** — Vercel automatic TLS for both frontend and backend.
- **Secrets management** — `DATABASE_URL` and `JWT_SECRET` stored as Vercel environment variables, never committed to git.

---

## 🗺️ Roadmap

- [ ] **Refresh tokens** — short-lived access tokens + refresh token rotation
- [ ] **Google OAuth** sign-in option
- [ ] **Event editing** — let creators edit their own events
- [ ] **Email notifications** — reminders 24 hours before an event
- [ ] **Map integration** — geocode locations and filter events by distance
- [ ] **Image uploads** — direct upload instead of URL input (S3/Cloudinary)
- [ ] **Public profile pages** — shareable `/profile/:username` links
- [ ] **Recurring events** — weekly/monthly recurrence patterns
- [ ] **PWA support** and dark mode
- [ ] **Automated tests** — Jest unit tests, Cypress E2E tests

---

## 🚢 Deployment

Both frontend and backend deploy automatically on every push to `main` via Vercel GitHub integration.

### Frontend

- **Live URL:** [wellnesscircle.vercel.app](https://wellnesscircle.vercel.app/)
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Environment variable:** `VITE_API_URL=https://wellness-circle-backend.vercel.app/api`

### Backend

- **Live URL:** `https://wellness-circle-backend.vercel.app`
- **Build command:** none (serverless)
- **Entry point:** `api/index.js`
- **Environment variables:**
  - `DATABASE_URL` — Supabase Postgres connection string
  - `JWT_SECRET` — long random string
  - `JWT_EXPIRES_IN=7d`
  - `CLIENT_URL=https://wellnesscircle.vercel.app`
  - `NODE_ENV=production`

### Database

- **Host:** Supabase (managed PostgreSQL)
- **Region:** closest to your users (e.g. `ap-southeast-2` for Sydney)

---

## 🤝 Contributing

Contributions are welcome! If you'd like to help:

1. Fork the project and create your branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m "Add amazing feature"`)
3. Open a Pull Request

---

## 👨‍💻 Author

**Mahmud Alam**

- 🌐 [Portfolio Website](https://mahmudalam.com)
- 📧 Email: [mahmudalam.official@gmail.com](mailto:mahmudalam.official@gmail.com)
- 💻 [GitHub](https://github.com/Mahmud-Alam)
- 💼 [LinkedIn](https://www.linkedin.com/in/mahmudalamofficial/)

---

## 🙏 Acknowledgements

- [Unsplash](https://unsplash.com) — beautiful event and avatar photography
- [Lucide](https://lucide.dev) — the icon set used throughout the app
- [Supabase](https://supabase.com) — managed PostgreSQL with a generous free tier
- [Vercel](https://vercel.com) — frictionless deployment for both frontend and backend
- The [React](https://react.dev) and [Vite](https://vite.dev) teams for outstanding tooling
- Everyone who has ever dragged a friend along to a 6 AM yoga class 💚
