import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Task, Priority, Project, createTask, toggleTaskStatus, updateTask, createProject } from '../domain/Task'

interface TaskState {
  tasks: Task[]
  projects: Project[]
  activeFilter: { type: 'all' | 'project' | 'priority' | 'status'; value: string } | null
  addTask: (input: { title: string; priority: Priority; projectId: string | null; dueDate?: string | null }) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  editTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void
  addProject: (name: string, color?: string) => void
  deleteProject: (id: string) => void
  setFilter: (filter: { type: 'all' | 'project' | 'priority' | 'status'; value: string } | null) => void
  getFilteredTasks: () => Task[]
  getTasksByPriority: (priority: Priority) => Task[]
  getCompletedTasks: () => Task[]
  getPendingTasks: () => Task[]
  exportToJSON: () => string
  exportToCSV: () => string
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      projects: [],
      activeFilter: null,

      addTask: (input) => {
        const newTask = createTask(input.title, input.priority, input.projectId, input.dueDate || null)
        set((state) => ({
          tasks: [newTask, ...state.tasks],
        }))
      },

      toggleTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? toggleTaskStatus(task) : task
          ),
        }))
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }))
      },

      editTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? updateTask(task, updates) : task
          ),
        }))
      },

      addProject: (name, color) => {
        const newProject = createProject(name, color)
        set((state) => ({
          projects: [...state.projects, newProject],
        }))
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          tasks: state.tasks.map((t) =>
            t.projectId === id ? { ...t, projectId: null } : t
          ),
        }))
      },

      setFilter: (filter) => {
        set({ activeFilter: filter })
      },

      getFilteredTasks: () => {
        const { tasks, activeFilter } = get()
        if (!activeFilter || activeFilter.type === 'all') return tasks
        if (activeFilter.type === 'project') {
          return tasks.filter((t) => t.projectId === activeFilter.value)
        }
        if (activeFilter.type === 'priority') {
          return tasks.filter((t) => t.priority === activeFilter.value)
        }
        if (activeFilter.type === 'status') {
          return activeFilter.value === 'done'
            ? tasks.filter((t) => t.done)
            : tasks.filter((t) => !t.done)
        }
        return tasks
      },

      getTasksByPriority: (priority) => {
        return get().tasks.filter((task) => task.priority === priority)
      },

      getCompletedTasks: () => {
        return get().tasks.filter((task) => task.done)
      },

      getPendingTasks: () => {
        return get().tasks.filter((task) => !task.done)
      },

      exportToJSON: () => {
        const { tasks, projects } = get()
        return JSON.stringify({ tasks, projects, exportedAt: new Date().toISOString() }, null, 2)
      },

      exportToCSV: () => {
        const { tasks } = get()
        const headers = ['id', 'title', 'projectId', 'priority', 'done', 'createdAt', 'completedAt', 'dueDate']
        const rows = tasks.map((t) => [
          t.id,
          `"${t.title.replace(/"/g, '""')}"`,
          t.projectId || '',
          t.priority,
          t.done ? 'true' : 'false',
          t.createdAt,
          t.completedAt || '',
          t.dueDate || '',
        ])
        return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
      },
    }),
    {
      name: 'clawy-tasks-storage',
    }
  )
)
