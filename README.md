# Mini Task Board

A simple full-stack task management application built with
Next.js, TypeScript, React, Node.js API routes and MySQL.

## Tech Stack

- Next.js
- React
- TypeScript
- Node.js
- MySQL
- CSS

## Features

- View all tasks
- Add a new task
- Select task status
- Update task status
- Delete tasks
- Input validation
- Loading state
- Error state
- MySQL persistence
- Shared TypeScript types


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
```

## API Endpoints

GET /api/tasks

Returns all tasks.

POST /api/tasks

Creates a new task.

PATCH /api/tasks/:id

Updates the status of a task.

DELETE /api/tasks/:id

Deletes a task.

## Database

The application uses MySQL.

The database schema and sample seed data are included in:

database.sql

Database table:

tasks

Columns:

- id
- title
- status
- created_at

## Setup

### 1. Clone the repository

git clone https://github.com/Ishagupta414/Full-Stack-Intern-Practical-Task-Isha-Gupta-

### 2. Install dependencies

npm install

### 3. Create MySQL database

Run database.sql using MySQL Workbench or MySQL CLI.

### 4. Configure environment variables

Create .env.local:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=task_board
DB_PORT=3306

### 5. Start the application

npm run dev

