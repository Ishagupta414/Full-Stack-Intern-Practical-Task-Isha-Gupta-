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

## Architecture

The application uses Next.js App Router with Next.js
Route Handlers for the backend API.

I chose Next.js API routes instead of a separate Express
server because the assignment allows either approach and
using Next.js Route Handlers keeps the frontend and backend
in a single application while still providing REST-style APIs.

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

git clone YOUR_REPOSITORY_URL

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

Open:

http://localhost:3000
