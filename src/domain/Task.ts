export type Priority = 'high' | 'medium' | 'low'

export interface Task {
  id: string
  title: string
  projectId: string | null
  priority: Priority
  done: boolean
  createdAt: string
  completedAt: string | null
  dueDate: string | null
}

export interface Project {
  id: string
  name: string
  color: string
  createdAt: string
}

export type FilterType = 'all' | 'project' | 'priority' | 'status'

export interface TaskFilter {
  type: FilterType
  value: string
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
  projectId: string | null = null,
  dueDate: string | null = null
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
    dueDate,
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

export function updateTask(task: Task, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task {
  return {
    ...task,
    ...updates,
  }
}

export function createProject(name: string, color: string = '#6366f1'): Project {
  return {
    id: generateId(),
    name: name.trim(),
    color,
    createdAt: new Date().toISOString(),
  }
}

export function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.done) return false
  return new Date(task.dueDate) < new Date(new Date().toDateString())
}

export function isDueToday(task: Task): boolean {
  if (!task.dueDate || task.done) return false
  return new Date(task.dueDate).toDateString() === new Date().toDateString()
}
