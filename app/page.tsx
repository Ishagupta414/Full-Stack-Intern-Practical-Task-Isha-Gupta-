"use client";

import { FormEvent, useEffect, useState } from "react";

type TaskStatus = "todo" | "in-progress" | "done";

interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  created_at: string;
}

const statusLabels: Record<TaskStatus, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/tasks");

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data: Task[] = await response.json();

      setTasks(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add task
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Task title cannot be empty.");
      return;
    }

    try {
      setAdding(true);
      setError("");

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: trimmedTitle,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create task");
      }

      setTasks((currentTasks) => [data, ...currentTasks]);

      setTitle("");
      setStatus("todo");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to create task."
      );
    } finally {
      setAdding(false);
    }
  };

  // Update status
  const updateStatus = async (
    taskId: number,
    newStatus: TaskStatus
  ) => {
    try {
      setError("");

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update task");
      }

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId ? data : task
        )
      );
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to update task."
      );
    }
  };

  // Delete task
  const deleteTask = async (taskId: number) => {
  // Prevent the same task from being deleted twice
  if (deletingId === taskId) {
    return;
  }

  try {
    setDeletingId(taskId);
    setError("");

    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to delete task");
    }

    // Remove the task from the UI
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId)
    );
  } catch (err) {
    console.error("Delete error:", err);

    setError(
      err instanceof Error
        ? err.message
        : "Failed to delete task."
    );
  } finally {
    setDeletingId(null);
  }
};
  return (
    <main className="page">
      <div className="container">

        {/* Header */}
        <header className="header">
          <div>
            <h1>Mini Task Board</h1>
          </div>

          <div className="task-count">
            {tasks.length}{" "}
            {tasks.length === 1 ? "Task" : "Tasks"}
          </div>
        </header>

        {/* Add Task */}
        <section className="add-card">
          <h2>Add New Task</h2>

          <form onSubmit={handleSubmit} className="task-form">

            <div className="input-group">
              <label htmlFor="title">Task Title</label>

              <input
                id="title"
                type="text"
                placeholder="Enter task title..."
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
              />
            </div>

            <div className="input-group status-input">
              <label htmlFor="status">Status</label>

              <select
                id="status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as TaskStatus)
                }
              >
                <option value="todo">To Do</option>
                <option value="in-progress">
                  In Progress
                </option>
                <option value="done">Done</option>
              </select>
            </div>

            <button
              type="submit"
              className="add-button"
              disabled={adding}
            >
              {adding ? "Adding..." : "+ Add Task"}
            </button>
          </form>
        </section>

        {/* Error */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="loading">
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty">
            <h3>No tasks yet</h3>
            <p>Add your first task using the form above.</p>
          </div>
        ) : (
          <section className="board">

            {/* TODO */}
            <TaskColumn
              title="To Do"
              status="todo"
              tasks={tasks}
              onUpdateStatus={updateStatus}
              onDelete={deleteTask}
              deletingId={deletingId}
            />

            {/* IN PROGRESS */}
            <TaskColumn
              title="In Progress"
              status="in-progress"
              tasks={tasks}
              onUpdateStatus={updateStatus}
              onDelete={deleteTask}
              deletingId={deletingId}
            />

            {/* DONE */}
            <TaskColumn
              title="Done"
              status="done"
              tasks={tasks}
              onUpdateStatus={updateStatus}
              onDelete={deleteTask}
              deletingId={deletingId}
            />

          </section>
        )}

      </div>
    </main>
  );
}

interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onUpdateStatus: (
    taskId: number,
    status: TaskStatus
  ) => void;
  onDelete: (taskId: number) => void;
  deletingId: number | null;
}

function TaskColumn({
  title,
  status,
  tasks,
  onUpdateStatus,
  onDelete,
  deletingId
}: TaskColumnProps) {

  const columnTasks = tasks.filter(
    (task) => task.status === status
  );

  return (
    <div className={`column ${status}`}>

      <div className="column-header">
        <h2>{title}</h2>

        <span className="badge">
          {columnTasks.length}
        </span>
      </div>

      <div className="task-list">

        {columnTasks.length === 0 ? (
          <p className="no-tasks">
            No tasks
          </p>
        ) : (
          columnTasks.map((task) => (

            <article
              key={task.id}
              className="task-card"
            >

              <h3>{task.title}</h3>

              <p className="task-date">
                {new Date(task.created_at).toLocaleDateString()}
              </p>

              <div className="task-actions">

                <select
                  value={task.status}
                  onChange={(event) =>
                    onUpdateStatus(
                      task.id,
                      event.target.value as TaskStatus
                    )
                  }
                >
                  <option value="todo">To Do</option>

                  <option value="in-progress">
                    In Progress
                  </option>

                  <option value="done">
                    Done
                  </option>
                </select>

                <button
                   type="button"
                   className="delete-button"
                   onClick={() => onDelete(task.id)}
                   disabled={deletingId === task.id}
                >
                 {deletingId === task.id ? "Deleting..." : "Delete"}
                </button>

              </div>

            </article>

          ))
        )}

      </div>
    </div>
  );
}