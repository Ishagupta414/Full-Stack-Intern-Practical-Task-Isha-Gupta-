import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { TaskStatus } from "@/types/task";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// PATCH /api/tasks/:id
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const taskId = Number(id);

    if (!Number.isInteger(taskId)) {
      return NextResponse.json(
        { error: "Invalid task ID" },
        { status: 400 }
      );
    }

    const body: { status: TaskStatus } = await request.json();

    const validStatuses: TaskStatus[] = [
      "todo",
      "in-progress",
      "done",
    ];

    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: "Invalid task status" },
        { status: 400 }
      );
    }

    const [result] = await pool.execute(
      "UPDATE tasks SET status = ? WHERE id = ?",
      [body.status, taskId]
    );

    const affectedRows = (result as { affectedRows: number }).affectedRows;

    if (affectedRows === 0) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    const [rows] = await pool.execute(
      "SELECT id, title, status, created_at FROM tasks WHERE id = ?",
      [taskId]
    );

    return NextResponse.json((rows as unknown[])[0]);
  } catch (error) {
    console.error("PATCH /api/tasks/:id error:", error);

    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/:id
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const taskId = Number(id);

    if (!Number.isInteger(taskId)) {
      return NextResponse.json(
        { error: "Invalid task ID" },
        { status: 400 }
      );
    }

    const [result] = await pool.execute(
      "DELETE FROM tasks WHERE id = ?",
      [taskId]
    );

    const affectedRows = (result as { affectedRows: number }).affectedRows;

    if (affectedRows === 0) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/tasks/:id error:", error);

    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}