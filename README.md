# 🌌 3D Portfolio Website

> A cinematic, space-themed developer portfolio with Three.js starfield, GSAP animations, and a Node.js/MongoDB backend.

---

## 📁 Project Structure

```
portfolio/
├── portfolio-frontend/   # React + Vite + Three.js + GSAP
└── portfolio-backend/    # Node.js + Express + MongoDB + Nodemailer
```

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd portfolio-backend

# Copy environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and email credentials

# Install dependencies
npm install

# Start server (port 5000)
npm run dev
```

### 2. Frontend Setup

```bash
cd portfolio-frontend

# Install dependencies
npm install

# Start dev server (port 5173)
npm run dev
```

Open **http://localhost:5173** — the Vite proxy automatically forwards `/api/*` requests to `http://localhost:5000`.

---

## ⚙️ Environment Variables

### `portfolio-backend/.env`

| Variable       | Description                                      |
|----------------|--------------------------------------------------|
| `PORT`         | Backend server port (default: `5000`)            |
| `MONGO_URI`    | MongoDB Atlas connection string                  |
| `EMAIL_HOST`   | SMTP host (e.g. `smtp.gmail.com`)               |
| `EMAIL_PORT`   | SMTP port (e.g. `587`)                          |
| `EMAIL_USER`   | Your email address                               |
| `EMAIL_PASS`   | App password (Gmail: generate in Google Account) |
| `EMAIL_TO`     | Where contact messages are delivered             |
| `NODE_ENV`     | `development` or `production`                   |

---

## 🌐 MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Click **Connect → MongoDB Drivers** → copy the URI
4. Replace `<password>` in `MONGO_URI` with your DB user password
5. Whitelist your IP (or `0.0.0.0/0` for development)

---

## 📧 Gmail SMTP Setup

1. Enable **2-Step Verification** on your Google Account
2. Go to **Google Account → Security → App Passwords**
3. Generate a password for "Mail"
4. Use that as `EMAIL_PASS` in your `.env`

---

## 🎨 Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React 18, Vite, Three.js, GSAP   |
| Styling     | Vanilla CSS, CSS Variables        |
| 3D          | Three.js (Points, Mesh, WebGL)    |
| Animations  | GSAP ScrollTrigger                |
| Backend     | Node.js, Express.js               |
| Database    | MongoDB Atlas, Mongoose           |
| Email       | Nodemailer (SMTP/Gmail)           |

---

## 🚢 Deployment

### Frontend → Vercel
```bash
cd portfolio-frontend
npm run build
# Push to GitHub → import repo in Vercel → done!
```

### Backend → Render
1. Create new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repo
3. Set **Root Directory** to `portfolio-backend`
4. **Build Command**: `npm install`
5. **Start Command**: `node server.js`
6. Add all `.env` variables in Render's Environment tab
7. Update frontend's API URL to the Render URL

---

## 🌟 Features

- **Galaxy Loading Screen** — Three.js spiral galaxy + GSAP logo reveal + progress bar (sessionStorage-cached)
- **Parallax Starfield** — 3-layer Three.js starfield with mouse parallax
- **Hero Section** — Rotating 3D icosahedron + GSAP character animation
- **Projects** — 3D tilt cards + gradient borders + modal popup
- **Certifications** — Scale-reveal animation + certificate modal
- **Skills** — Animated progress bars via ScrollTrigger
- **Contact** — Full API form → MongoDB + email notification
- **Glassmorphism Navbar** — GSAP hamburger menu for mobile
- **Fully Responsive** — Mobile-first, works on all screen sizes

---

Made with ❤️ by **Manan Patel**
