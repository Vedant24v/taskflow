# TaskFlow — Jira-like Kanban Board

A modern, production-grade task management application built with React, featuring drag-and-drop, smooth animations, and a clean dark UI.

![TaskFlow Preview](https://via.placeholder.com/900x500/0a0a0f/4f8ef7?text=TaskFlow+Kanban+Board)

## 🚀 Live Demo

> _Add your Vercel URL here after deployment_

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

## ☁️ Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Framework preset: **Vite** (auto-detected)
4. Click **Deploy**

---

Built as part of the JMD Solutions & Beyond Frontend Assessment.
