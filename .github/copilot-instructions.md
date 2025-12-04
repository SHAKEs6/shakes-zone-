# Shakes Zone - AI Coding Agent Instructions

## Project Overview
Shakes Zone is a multiplayer gaming platform with real-time friend matching. It combines a **Node.js/Express backend** with a **vanilla JavaScript frontend**, using **Socket.IO for real-time communication** and **MongoDB for persistence**.

## Architecture

### Backend Stack (`/backend`)
- **Express.js** HTTP server + **Socket.IO** for real-time connections
- **MongoDB/Mongoose** for user data persistence
- **JWT** for session tokens (7-day expiry), **bcryptjs** for password hashing
- **CORS** enabled for cross-origin frontend requests
- Deployed on **Render** (see `Procfile`)

### Frontend Stack (root level)
- Vanilla JavaScript (no frameworks) — all HTML/CSS/JS files at project root
- **Socket.IO client** library for real-time messaging
- **localStorage** for storing authentication tokens and user session state
- Game pages in `/games` directory

### Data Flow
1. **Auth**: `login.js`/`register.js` → POST `/api/auth/{login,register}` → backend stores user, returns JWT
2. **Real-time**: Dashboard connects via Socket.IO → emits `registerUser` → server broadcasts `updateOnlineUsers`
3. **Game Invites**: Socket.IO events (`sendGameRequest` → `receiveGameRequest`) pass game selection between users

## Key Files & Patterns

| File | Purpose | Key Pattern |
|------|---------|-------------|
| `backend/server.js` | Express app + Socket.IO setup | Direct socket registration (no rooms/namespaces yet) |
| `backend/controllers/authController.js` | Login/register logic | Always hash passwords with bcrypt, return token on success |
| `backend/models/User.js` | MongoDB schema | Includes `friends` array (ObjectId references), `timestamps: true` |
| `login.js` / `register.js` | Frontend auth forms | Fetch calls store token/username in localStorage |
| `dashboard.js` | Real-time user list + game invites | Uses Socket.IO events, localStorage for user persistence |

## Development Commands

```bash
# Backend only
cd backend
npm install
npm run dev          # Runs nodemon (auto-reload on file changes)
npm start            # Production mode

# Full stack local testing
npm run dev          # From /backend, backend runs on PORT 5000
# Open root index.html in browser, backend URL points to http://localhost:5000
```

## Critical Environment Variables
Stored in `backend/.env`:
- `MONGO_URI`: MongoDB connection string (shared cluster)
- `JWT_SECRET`: Token signing key (must be cryptographically random in production)
- `PORT`: Server port (defaults to 5000)

**⚠️ Never commit `.env` to version control** — use `.env.example` template instead.

## Project-Specific Conventions

1. **Frontend Socket.IO**: Always emit `registerUser` on connection; listen for `updateOnlineUsers` broadcast
2. **Game Routing**: Game selection flows through `sendGameRequest` socket event; frontend navigates to `games/{game}.html`
3. **User Session**: Store username in localStorage as `loggedUser`; token as `token`
4. **Error Handling**: Backend returns JSON with `message` field; frontend alerts users on non-200 responses
5. **Deployment**: Backend deployed on Render, frontend static files served from backend's `express.static()` middleware

## Common Tasks

- **Add new game**: Create `games/{game}.html`, link from dashboard button, emit socket event with game name
- **Add user fields**: Update `User.js` schema + frontend login/register forms
- **Debug socket issues**: Check browser console + backend terminal logs for socket.id registration
- **Add authentication middleware**: Verify JWT from headers in route handlers before accessing protected endpoints
