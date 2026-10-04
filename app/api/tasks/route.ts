import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import {
  TaskStatus,
  CreateTaskInput,
} from "@/types/task";

// GET /api/tasks
export async function GET() {
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
