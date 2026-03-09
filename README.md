# Project Planner

A local web app to turn project ideas into structured task plans.
Built with React, Vite, and Tailwind CSS.

## Setup
```bash
npm install
npm run dev
```

Visit `http://localhost:5173`

## Features

- Create and switch between multiple projects
- Hierarchical task tree with subtasks
- Add, edit, and delete tasks
- Status: To Do, In Progress, Done, Blocked
- Priority: Low, Medium, High
- Dependency indicators between tasks
- Drag-and-drop task reordering
- Progress bar per project
- Inline edit project title and description
- All data persists via localStorage — survives page refresh

## File structure
```
src/
├── App.jsx                  — root layout
├── index.css                — global styles and Tailwind
├── store/
│   └── useStore.js          — all state and localStorage logic
├── components/
│   ├── Sidebar.jsx          — project list, create, delete, switch
│   ├── Header.jsx           — project title and description (inline edit)
│   ├── TaskTree.jsx         — drag-and-drop task list and progress bar
│   ├── TaskNode.jsx         — single task row, subtasks, actions
│   └── TaskForm.jsx         — add and edit form with all fields
└── utils/
    └── helpers.js           — tree utilities, status and priority config
```

## How to use

1. A default project is created on first load
2. Click **+** in the sidebar to create more projects
3. Click **+ Add task** to create your first task
4. Hover a task to see **↻ + ✎ ✕** action buttons
5. Click **+** on a task to add a subtask beneath it
6. Click **✎** to edit title, description, status, priority, and dependencies
7. Click **↻** to cycle through task statuses quickly
8. Drag the **⠿** handle to reorder tasks
9. Click **▶** to collapse and expand subtasks
10. Click the project title or description in the header to edit inline
