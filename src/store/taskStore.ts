import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Task, Priority, createTask, toggleTaskStatus } from '../domain/Task'

interface TaskState {
  tasks: Task[]
  addTask: (input: { title: string; priority: Priority; projectId: string | null }) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  getTasksByPriority: (priority: Priority) => Task[]
  getCompletedTasks: () => Task[]
  getPendingTasks: () => Task[]
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (input) => {
        const newTask = createTask(input.title, input.priority, input.projectId)
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

      getTasksByPriority: (priority) => {
        return get().tasks.filter((task) => task.priority === priority)
      },

      getCompletedTasks: () => {
        return get().tasks.filter((task) => task.done)
      },

      getPendingTasks: () => {
        return get().tasks.filter((task) => !task.done)
      },
    }),
    {
      name: 'clawy-tasks-storage',
    }
  )
)
