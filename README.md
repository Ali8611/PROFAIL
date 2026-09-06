# WANS — Next-Gen Cyber & Gaming Personal Profile Platform

WANS is a production-ready, highly customizable personal profile and link-in-bio platform engineered for gamers, developers, streamers, and digital creators.

---

## ⚡ Key Features

- 🎮 **Cyber & Gaming Aesthetic**: Dark glassmorphism, neon glows, smooth micro-interactions, responsive on all devices.
- 🔗 **Clean Routing**: Direct handles via `/[username]` (e.g., `/WANS`, `/HACKER`, `/GAMER`).
- 🎨 **Dynamic Theme Engine**: 10+ built-in themes (Cyberpunk Neon, Royal Nebula, Obsidian Dark, Crimson Blood, Frosted Glass, AMOLED) with customizable accents, borders, and effects.
- 🎵 **Interactive Music Player**: Native HTML5 audio player supporting MP3 uploads, streaming URLs, cover art, scrubbing, loop, and browser-safe autoplay handling.
- 🎧 **Spotify & Discord Sync**: Live Spotify track widget ("Listening to Spotify") and Discord rich presence card with custom game/activity status.
- 🔗 **Tracked Social Links**: Add, reorder, and style links (Neon, Glass, Filled, Outline) with real-time per-link click tracking.
- 🏆 **Database-Driven Badges**: Badges system (Owner, Verified, Developer, Early User, Pro Gamer, Popular, Staff) assignable via Admin and toggleable on profiles.
- 💬 **Interactive Guestbook**: Visitors can sign profiles, while owners can pin favorites, delete spam, or toggle the guestbook.
- 📊 **Privacy-Friendly Analytics**: Real database tracking for total impressions, daily/weekly/monthly trends, mobile vs. desktop visitor ratios, and referrers.
- 📱 **QR Code Sharing**: Real-time QR generation with one-click URL copying and high-res PNG download.
- 🛡️ **Full Admin Suite (`/admin`)**: User moderation, username management, suspensions, badge creation & assignment, and moderation report queue.
- 💎 **Free vs. Premium Architecture**: Tiered gating for video backgrounds, custom CSS, diamond badge, and watermark removal.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom neon keyframes, glassmorphism, and dynamic CSS variables
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) with SQLite for instant local zero-dependency development (100% compatible with PostgreSQL)
- **Authentication**: Secure cookie-based JWT sessions with bcryptjs password hashing
- **Icons & QR**: `lucide-react`, `qrcode.react`
- **Validation**: `zod`

---

## 🚀 Quick Start (Local Setup)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Initialize Database & Seed Demo Data
```bash
npx prisma db push
npm run seed
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🔑 Pre-Seeded Demo Accounts

All accounts are created with password: `Password123!`

| Username | Role | Badges | Theme | Profile URL |
| :--- | :--- | :--- | :--- | :--- |
| **WANS** | **ADMIN** | 👑 Owner, 🛠 Dev, ✓ Verified, 💎 Pro | Cyberpunk Neon | `/WANS` |
| **HACKER** | USER | 🛠 Dev, ⭐ Early, 🔥 Popular | Obsidian / Matrix | `/HACKER` |
| **GAMER** | USER | 🎮 Gamer, 🔥 Popular, 💎 Pro | Royal Nebula | `/GAMER` |
| **DEVELOPER** | USER | ✓ Verified, 🛠 Dev | Azure Minimal | `/DEVELOPER` |

> 👑 Log in as `WANS` (or email `admin@wans.gg`) to access both `/dashboard` and the protected `/admin` panel!

---

## 🚢 Deployment Guide

### Deploy to Vercel
1. Push this repository to GitHub.
2. Import the project in Vercel.
3. For persistent storage in production, provide a PostgreSQL database URL (e.g. from Supabase, Neon, or Railway) in the `DATABASE_URL` environment variable.
4. Update `prisma/schema.prisma` datasource provider from `"sqlite"` to `"postgresql"`.
5. Set build command to: `npx prisma generate && next build`.

### Deploy to Railway / Render / VPS (Docker or Node)
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user and initialize profile |
| `POST` | `/api/auth/login` | Authenticate and issue secure session cookie |
| `POST` | `/api/auth/logout` | Terminate session |
| `GET` | `/api/auth/me` | Fetch authenticated user data & permissions |
| `GET` | `/api/profile/:username` | Public profile JSON representation |
| `PATCH`| `/api/profile` | Update profile information & styling |
| `POST` | `/api/profile/links` | Add new social link |
| `POST` | `/api/profile/links/:id/click` | Track link click and return target URL |
| `POST` | `/api/profile/music` | Update profile background audio track |
| `POST` | `/api/guestbook` | Submit message to profile guestbook |
| `POST` | `/api/upload` | Upload avatar, audio, or background media |
| `POST` | `/api/reports` | Submit report for moderation |
| `GET` | `/api/admin/users` | List and filter users (Admin only) |
| `POST` | `/api/admin/badges` | Create and assign badges (Admin only) |

---

## 📄 License
MIT © WANS. Built for creators and competitive gamers.
