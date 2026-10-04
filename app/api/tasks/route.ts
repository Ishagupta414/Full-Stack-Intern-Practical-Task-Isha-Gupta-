import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import type {
  TaskStatus,
  CreateTaskInput,
  Task,
} from "@/types/task";

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

const demoTasks: Task[] = [
  {
    id: 1,
    title: "Complete Mini Task Board",
    status: "todo",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Learn Next.js API Routes",
    status: "in-progress",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Connect MySQL Database",
    status: "done",
    created_at: new Date().toISOString(),
  },
];

// GET /api/tasks
export async function GET() {
  // Vercel demo mode
  if (DEMO_MODE) {
    return NextResponse.json(demoTasks);
  }

  // Local MySQL mode
  try {
    const [rows] = await pool.query(
      "SELECT id, title, status, created_at FROM tasks ORDER BY created_at DESC"
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/tasks error:", error);

    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST /api/tasks
export async function POST(request: NextRequest) {
  try {
    const body: CreateTaskInput = await request.json();

    const title = body.title?.trim();
    const status = body.status;

    // Validate title
    if (!title) {
      return NextResponse.json(
        { error: "Task title is required" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses: TaskStatus[] = [
      "todo",
      "in-progress",
      "done",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid task status" },
        { status: 400 }
      );
    }

    // Vercel demo mode
    if (DEMO_MODE) {
      const newTask: Task = {
        id: Date.now(),
        title,
        status,
        created_at: new Date().toISOString(),
      };

      return NextResponse.json(newTask, { status: 201 });
    }

    // Local MySQL mode
    const [result] = await pool.execute(
      "INSERT INTO tasks (title, status) VALUES (?, ?)",
      [title, status]
    );

    const insertId = (result as { insertId: number }).insertId;

    const [rows] = await pool.execute(
      "SELECT id, title, status, created_at FROM tasks WHERE id = ?",
      [insertId]
    );

    return NextResponse.json(
      (rows as unknown[])[0],
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/tasks error:", error);

    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
