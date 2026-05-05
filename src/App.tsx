import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  Plus, Check, Trash2, Calendar, Flag, Edit2, X, Save,
  Folder, Filter, Download, Clock, AlertCircle,
  Moon, Sun, Zap, CheckCircle2, Circle, Sparkles
} from 'lucide-react'
import { useTaskStore } from './store/taskStore'
import { Task, Priority, isOverdue } from './domain/Task'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

type View = 'tasks' | 'projects' | 'dashboard'
type Theme = 'light' | 'dark'

// Animation variants
const slideIn = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, x: -100, scale: 0.9 }
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

const scaleOnTap = {
  scale: 0.97,
  transition: { duration: 0.1 }
}

function App() {
  const [view, setView] = useState<View>('tasks')
  const [theme, setTheme] = useState<Theme>('light')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium')
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void setSelectedProjectId
  const [selectedDueDate, setSelectedDueDate] = useState('')
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editPriority, setEditPriority] = useState<Priority>('medium')
  const [editProjectId, setEditProjectId] = useState<string | null>(null)
  const [editDueDate, setEditDueDate] = useState('')
  const [showProjectForm, setShowProjectForm] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void showProjectForm
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectColor, setNewProjectColor] = useState('#6366f1')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void setNewProjectColor
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilter, setActiveFilter] = useState<{ type: 'all' | 'project' | 'priority' | 'status'; value: string } | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void setActiveFilter
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [streak, setStreak] = useState(0)

  const {
    tasks, projects, addTask, toggleTask, deleteTask, editTask,
    addProject, deleteProject, exportToJSON, exportToCSV
  } = useTaskStore()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void deleteProject

  // Toast helper
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  // Confetti on streak
  useEffect(() => {
    if (streak > 0 && streak % 5 === 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#22c55e', '#f59e0b', '#ef4444']
      })
      showToast(`🔥 ${streak} tasks completed! Keep it up!`, 'success')
    }
  }, [streak, showToast])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'n') {
          e.preventDefault()
          document.querySelector<HTMLInputElement>('input[type="text"]')?.focus()
        }
      }
      if (e.key === 'Escape') {
        setEditingTaskId(null)
        setShowProjectForm(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    
    addTask({
      title: newTaskTitle,
      priority: selectedPriority,
      projectId: selectedProjectId,
      dueDate: selectedDueDate || null,
    })
    
    setNewTaskTitle('')
    setSelectedDueDate('')
    showToast('Task created!', 'success')
  }

  const handleToggleTask = (task: Task) => {
    toggleTask(task.id)
    if (!task.done) {
      setStreak(s => s + 1)
      showToast('Task completed! ✅', 'success')
    } else {
      setStreak(0)
    }
  }

  const handleDeleteTask = (id: string) => {
    deleteTask(id)
    showToast('Task deleted', 'success')
  }

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProjectName.trim()) return
    addProject(newProjectName, newProjectColor)
    setNewProjectName('')
    setShowProjectForm(false)
    showToast('Project created!', 'success')
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void handleAddProject

  const handleExport = (format: 'json' | 'csv') => {
    if (format === 'json') exportToJSON()
    else exportToCSV()
    showToast(`Exported as ${format.toUpperCase()}`, 'success')
  }

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    let result = tasks
    if (activeFilter) {
      switch (activeFilter.type) {
        case 'project':
          result = result.filter(t => t.projectId === activeFilter.value)
          break
        case 'priority':
          result = result.filter(t => t.priority === activeFilter.value)
          break
        case 'status':
          result = result.filter(t => activeFilter.value === 'done' ? t.done : !t.done)
          break
      }
    }
    return result
  }, [tasks, activeFilter])

  // Stats
  const stats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter(t => !t.done).length,
    done: tasks.filter(t => t.done).length,
    overdue: tasks.filter(t => isOverdue(t)).length,
    highPriority: tasks.filter(t => t.priority === 'high' && !t.done).length,
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.done).length / tasks.length) * 100) : 0
  }), [tasks])

  const priorityColors = {
    high: 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400',
    medium: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400',
    low: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400',
  }

  const priorityLabels = { high: 'High', medium: 'Medium', low: 'Low' }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg backdrop-blur-md ${
              toast.type === 'success' 
                ? 'bg-emerald-500/90 text-white' 
                : 'bg-red-500/90 text-white'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glassmorphism Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Clawy Tasks
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stats.pending} pending · {stats.done} done
                </p>
              </div>
            </motion.div>

            <div className="flex items-center gap-2">
              {/* Streak indicator */}
              {streak > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium"
                >
                  <Sparkles className="w-4 h-4" />
                  {streak}
                </motion.div>
              )}

              {/* Theme toggle */}
              <motion.button
                whileTap={scaleOnTap}
                onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </motion.button>

              {/* View switcher */}
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                {(['tasks', 'projects', 'dashboard'] as View[]).map(v => (
                  <motion.button
                    key={v}
                    whileTap={scaleOnTap}
                    onClick={() => setView(v)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      view === v 
                        ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {view === 'tasks' && (
            <motion.div
              key="tasks"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Add Task Form */}
              <motion.form 
                onSubmit={handleAddTask}
                className="mb-6 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
                whileHover={{ boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="What needs to be done? (Ctrl+N)"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value as Priority)}
                    className="px-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <input
                    type="date"
                    value={selectedDueDate}
                    onChange={(e) => setSelectedDueDate(e.target.value)}
                    className="px-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={scaleOnTap}
                    className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-2 font-medium"
                  >
                    <Plus className="w-5 h-5" />
                    Add
                  </motion.button>
                </div>
              </motion.form>

              {/* Filters */}
              <motion.div 
                className="mb-4 flex flex-wrap gap-2"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <motion.button
                  variants={slideIn}
                  whileTap={scaleOnTap}
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </motion.button>
                
                <motion.button
                  variants={slideIn}
                  whileTap={scaleOnTap}
                  onClick={() => handleExport('json')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                >
                  <Download className="w-4 h-4" />
                  JSON
                </motion.button>
                
                <motion.button
                  variants={slideIn}
                  whileTap={scaleOnTap}
                  onClick={() => handleExport('csv')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                >
                  <Download className="w-4 h-4" />
                  CSV
                </motion.button>
              </motion.div>

              {/* Task List */}
              <motion.div 
                className="space-y-2"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {filteredTasks.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-16"
                    >
                      <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                        <CheckCircle2 className="w-12 h-12 text-indigo-400" />
                      </div>
                      <p className="text-gray-400 dark:text-gray-500 text-lg font-medium">No tasks yet</p>
                      <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Add one above to get started</p>
                    </motion.div>
                  ) : (
                    filteredTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        layout
                        variants={slideIn}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        whileHover={{ scale: 1.01, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                        className={`group flex items-center gap-3 p-4 rounded-xl border transition-all ${
                          task.done 
                            ? 'bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700/50 opacity-60' 
                            : isOverdue(task)
                              ? 'bg-white dark:bg-gray-800 border-red-200 dark:border-red-800/50 shadow-sm border-l-4 border-l-red-500'
                              : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md'
                        }`}
                      >
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleToggleTask(task)}
                          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            task.done
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 border-transparent text-white'
                              : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                          }`}
                        >
                          {task.done && <Check className="w-3.5 h-3.5" />}
                        </motion.button>

                        <div className="flex-1 min-w-0">
                          {editingTaskId === task.id ? (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                autoFocus
                              />
                              <select
                                value={editPriority}
                                onChange={(e) => setEditPriority(e.target.value as Priority)}
                                className="px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600"
                              >
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                              </select>
                              <motion.button
                                whileTap={scaleOnTap}
                                onClick={() => {
                                  editTask(task.id, { title: editTitle, priority: editPriority, projectId: editProjectId, dueDate: editDueDate || null })
                                  setEditingTaskId(null)
                                  showToast('Task updated!', 'success')
                                }}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg"
                              >
                                <Save className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileTap={scaleOnTap}
                                onClick={() => setEditingTaskId(null)}
                                className="p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                              >
                                <X className="w-4 h-4" />
                              </motion.button>
                            </div>
                          ) : (
                            <>
                              <p className={`text-sm font-medium truncate ${
                                task.done ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'
                              }`}>
                                {task.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium border ${priorityColors[task.priority]}`}>
                                  <Flag className="w-3 h-3" />
                                  {priorityLabels[task.priority]}
                                </span>
                                {task.dueDate && (
                                  <span className={`inline-flex items-center gap-1 text-xs ${
                                    isOverdue(task) 
                                      ? 'text-red-500 font-medium' 
                                      : 'text-gray-400 dark:text-gray-500'
                                  }`}>
                                    <Calendar className="w-3 h-3" />
                                    {new Date(task.dueDate).toLocaleDateString()}
                                  </span>
                                )}
                                {task.projectId && (
                                  <span 
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium"
                                    style={{ 
                                      backgroundColor: projects.find(p => p.id === task.projectId)?.color + '20',
                                      color: projects.find(p => p.id === task.projectId)?.color 
                                    }}
                                  >
                                    <Folder className="w-3 h-3" />
                                    {projects.find(p => p.id === task.projectId)?.name}
                                  </span>
                                )}
                              </div>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            whileTap={scaleOnTap}
                            onClick={() => {
                              setEditingTaskId(task.id)
                              setEditTitle(task.title)
                              setEditPriority(task.priority)
                              setEditProjectId(task.projectId)
                              setEditDueDate(task.dueDate || '')
                            }}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileTap={scaleOnTap}
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}

          {view === 'dashboard' && (
            <motion.div
              key="dashboard"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total', value: stats.total, icon: Circle, color: 'from-gray-500 to-gray-600' },
                  { label: 'Pending', value: stats.pending, icon: Clock, color: 'from-amber-500 to-orange-600' },
                  { label: 'Done', value: stats.done, icon: CheckCircle2, color: 'from-emerald-500 to-green-600' },
                  { label: 'Overdue', value: stats.overdue, icon: AlertCircle, color: 'from-red-500 to-rose-600' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <motion.p 
                      className="text-3xl font-bold text-gray-900 dark:text-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 + 0.2, type: 'spring' }}
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Completion Rate</h3>
                  <span className="text-2xl font-bold text-indigo-600">{stats.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.completionRate}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>

              {/* Priority Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Priority Breakdown</h3>
                <div className="space-y-3">
                  {(['high', 'medium', 'low'] as Priority[]).map((p, i) => {
                    const count = tasks.filter(t => t.priority === p && !t.done).length
                    const total = tasks.filter(t => t.priority === p).length
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0
                    return (
                      <div key={p}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium capitalize text-gray-700 dark:text-gray-300">{p} Priority</span>
                          <span className="text-sm text-gray-500">{count}/{total}</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                          <motion.div
                            className={`h-full rounded-full ${
                              p === 'high' ? 'bg-red-500' : p === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ delay: i * 0.1 + 0.6, duration: 0.8 }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App