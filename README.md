# TaskFlow — Jira-like Kanban Board

A modern, production-grade task management application built with React, featuring drag-and-drop, smooth animations, and a clean dark UI.

## 🚀 Live Demo
https://taskkfloww.vercel.app/

## ✨ Features

- **Kanban Board** — 3 columns: Not Started, In Progress, Completed
- **Drag & Drop** — Move and reorder tasks across columns with smooth animations
- **Full CRUD** — Create, view, edit, and delete tasks with form validation
- **User Assignment** — Assign tasks to 5 mock team members with color-coded avatars
- **Priority System** — High / Medium / Low with live status indicators
- **Deadline Tracking** — Overdue, Urgent, Warning, and OK states with color signals
- **Filters** — Filter by assignee, priority, or search by title — all reactive
- **Animations** — Framer Motion card entrances, modal spring transitions, filter panel slide
- **Responsive** — Works on tablet and desktop

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Animations | Framer Motion |
| State | React Context + useReducer |
| Icons | Lucide React |
| Date Handling | date-fns |

## 📁 Project Structure

```
taskflow/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Avatar.jsx        # User avatar with initials
│   │   ├── Header.jsx        # Top nav, search, filters, stats
│   │   ├── KanbanBoard.jsx   # DnD context + board layout
│   │   ├── KanbanColumn.jsx  # Droppable column with task list
│   │   ├── TaskCard.jsx      # Sortable task card
│   │   └── TaskModal.jsx     # Create / Edit / View modal
│   ├── context/
│   │   └── TaskContext.jsx   # Global state (useReducer)
│   ├── data/
│   │   └── mockData.js       # Mock users, columns, initial tasks
│   ├── utils/
│   │   └── helpers.js        # Date formatting, priority/tag colors
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
├── vercel.json
└── package.json
```

## ⚙️ Setup & Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

## 📦 Build for Production

```bash
npm run build
```

Output is in the `dist/` folder.

## 🔧 Production Deployment

This repo is split into a frontend and backend:

- Frontend: root project built by Vite
- Backend: `server/` Node API

### Frontend on Vercel

1. Push this repo to GitHub
2. Create a Vercel project from the repo root
3. Set the environment variable:

```env
VITE_API_URL=https://<your-backend-url>
```

4. Deploy the frontend project

### Backend deployment options

For a production backend, deploy the `server/` folder as a separate Vercel project or another Node host.

If using Vercel for the backend, use the `server/vercel.json` configuration and set these environment variables:

```env
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
PORT=5000
```

If Atlas SRV fails from your network, use the standard connection string from Atlas instead of `mongodb+srv://`. The standard string includes direct shard hosts and replica set options.

### Notes

- Do not use `mongodb://127.0.0.1:27017/...` in production
- Use MongoDB Atlas or another hosted MongoDB provider
- Keep `.env` files out of GitHub; use Vercel environment variables instead

---

Built as part of the JMD Solutions & Beyond Frontend Assessment.
