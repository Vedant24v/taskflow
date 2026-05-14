# TaskFlow

A full-stack Kanban board for managing tasks and teams — built with React, Node.js, Express, and MongoDB.

🔗 **Live Demo:** [taskkfloww.vercel.app](https://taskkfloww.vercel.app)

---

## Features

- 🔐 JWT-based authentication (register & login)
- 📋 Kanban board with drag-and-drop (Not Started → In Progress → Completed)
- ✅ Create, edit, delete tasks with priority, deadline, and assignee
- 👥 Team member management
- 🔒 Data isolation — each user sees only their own tasks and team
- ☁️ Deployed on Vercel (frontend + serverless API)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Drag & Drop | @dnd-kit |
| Deployment | Vercel |

---

## Local Development

### Prerequisites
- Node.js 18+
- A MongoDB Atlas connection string (or local MongoDB)

### 1. Clone the repo
```bash
git clone https://github.com/Vedant24v/taskflow.git
cd taskflow
```

### 2. Install dependencies
```bash
# Root (frontend + backend deps)
npm install

# Server
cd server && npm install
```

### 3. Set up environment variables

Create `.env` in the root:
```env
VITE_API_URL=
```

Create `.env` in the `server/` folder:
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/taskflow
JWT_SECRET=your_secret_key
PORT=5000
```

### 4. Run the app

Open **two terminals**:

```bash
# Terminal 1 — Backend
node server/server.js

# Terminal 2 — Frontend
node node_modules/vite/bin/vite.js
```

Visit `http://localhost:5173`

---

## Deploying to Vercel

1. Push code to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add these **Environment Variables** in Vercel dashboard:

| Key | Value |
|---|---|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A secure random string |

4. Deploy — Vercel auto-detects Vite and builds the frontend. The `api/index.js` file becomes a serverless function.

---

## Project Structure

```
taskflow/
├── api/
│   └── index.js          # Vercel serverless entrypoint
├── server/
│   ├── models/           # Mongoose schemas (User, Task)
│   ├── routes/           # Express routes (auth, tasks, users)
│   ├── middleware/       # JWT auth middleware
│   └── server.js         # Express app
├── src/
│   ├── components/       # React components
│   ├── context/          # TaskContext (state management)
│   ├── pages/            # Auth, Dashboard
│   └── App.jsx
├── vercel.json           # Vercel routing config
└── vite.config.js
```

---

## License

MIT
