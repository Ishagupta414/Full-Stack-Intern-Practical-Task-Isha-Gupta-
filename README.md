# Mini Task Board

A simple task management application built as a full-stack project using Next.js, TypeScript, React, Node.js and MySQL.

The application allows users to create tasks, assign a status to them, change their status later and delete tasks. Tasks are stored in a MySQL database.

## Features

- Add a new task with a title and status
- Three task statuses:
  - To Do
  - In Progress
  - Done
- Change the status of an existing task
- Delete tasks
- Tasks are stored in MySQL
- Validation for empty task titles
- Loading state while tasks are being fetched
- Error messages when an API operation fails
- Responsive layout for different screen sizes

## Technologies Used

### Frontend
- Next.js
- React
- TypeScript
- HTML
- CSS

### Backend
- Next.js API Route Handlers
- Node.js
- REST API

### Database
- MySQL
- MySQL2

### Development Tools
- Visual Studio Code
- MySQL Workbench
- Git
- GitHub

## Project Structure

```text
task_board/
│
├── app/
│   ├── api/
│   │   └── tasks/
│   │       ├── route.ts
│   │       └── [id]/
│   │           └── route.ts
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── lib/
│   └── db.ts
│
├── types/
│   └── task.ts
│
├── public/
│
├── database.sql
├── .env.local
├── package.json
└── README.md
