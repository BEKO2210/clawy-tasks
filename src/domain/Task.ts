export type Priority = 'high' | 'medium' | 'low'

export interface Task {
  id: string
  title: string
  projectId: string | null
  priority: Priority
  done: boolean
  createdAt: string
  completedAt: string | null
}

export interface Project {
  id: string
  name: string
  color: string
  createdAt: string
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export function validateTask(title: string): string | null {
  if (!title || title.trim().length === 0) {
    return 'Task title is required'
  }
  if (title.length > 200) {
    return 'Task title must be under 200 characters'
  }
  return null
}

export function createTask(
  title: string,
  priority: Priority = 'medium',
  projectId: string | null = null
): Task {
  const now = new Date().toISOString()
  return {
    id: generateId(),
    title: title.trim(),
    projectId,
    priority,
    done: false,
    createdAt: now,
    completedAt: null,
  }
}

export function toggleTaskStatus(task: Task): Task {
  const now = new Date().toISOString()
  return {
    ...task,
    done: !task.done,
    completedAt: !task.done ? now : null,
  }
}
