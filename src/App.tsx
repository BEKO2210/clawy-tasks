import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  Plus, Check, Trash2, Calendar, Flag, Edit2,
  Moon, Sun, Zap, CheckCircle2, Circle, Sparkles,
  Home, BarChart3, Folder, X
} from 'lucide-react'
import { useTaskStore } from './store/taskStore'
import { Task, Priority, isOverdue } from './domain/Task'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

type View = 'tasks' | 'dashboard' | 'projects'
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

// Swipe threshold
const SWIPE_THRESHOLD = 80

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void editingTaskId
  const [editTitle, setEditTitle] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void editTitle
  const [editPriority, setEditPriority] = useState<Priority>('medium')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void editPriority
  const [editProjectId, setEditProjectId] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void editProjectId
  const [editDueDate, setEditDueDate] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void editDueDate
  const [showAddModal, setShowAddModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void showFilters
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void setShowFilters
  const [activeFilter, setActiveFilter] = useState<{ type: 'all' | 'project' | 'priority' | 'status'; value: string } | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [streak, setStreak] = useState(0)
  const [swipedTaskId, setSwipedTaskId] = useState<string | null>(null)

  const {
    tasks, projects, addTask, toggleTask, deleteTask, editTask,
    addProject, deleteProject, exportToJSON, exportToCSV
  } = useTaskStore()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void projects
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void editTask
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void addProject
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
      showToast(`🔥 ${streak} tasks completed!`, 'success')
    }
  }, [streak, showToast])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'n') {
          e.preventDefault()
          setShowAddModal(true)
        }
      }
      if (e.key === 'Escape') {
        setEditingTaskId(null)
        setShowAddModal(false)
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
    setShowAddModal(false)
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

  const handleSwipe = (task: Task, info: PanInfo) => {
    const offset = info.offset.x
    if (offset < -SWIPE_THRESHOLD) {
      // Swipe left - delete
      handleDeleteTask(task.id)
      setSwipedTaskId(null)
    } else if (offset > SWIPE_THRESHOLD) {
      // Swipe right - complete
      handleToggleTask(task)
      setSwipedTaskId(null)
    }
  }

  const handleExport = (format: 'json' | 'csv') => {
    if (format === 'json') exportToJSON()
    else exportToCSV()
    showToast(`Exported as ${format.toUpperCase()}`, 'success')
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void handleExport

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
    <div className={`min-h-screen pb-20 ${theme === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
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

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-gray-800 w-full sm:w-[500px] sm:rounded-2xl rounded-t-2xl p-6 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">New Task</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddTask} className="space-y-4">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  autoFocus
                />
                <div className="flex gap-2">
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value as Priority)}
                    className="flex-1 px-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <input
                    type="date"
                    value={selectedDueDate}
                    onChange={(e) => setSelectedDueDate(e.target.value)}
                    className="flex-1 px-3 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium"
                >
                  Add Task
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Clawy
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stats.pending} pending
                </p>
              </div>
            </motion.div>

            <div className="flex items-center gap-2">
              {streak > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium"
                >
                  <Sparkles className="w-3 h-3" />
                  {streak}
                </motion.div>
              )}
              <motion.button
                whileTap={scaleOnTap}
                onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-4">
        <AnimatePresence mode="wait">
          {view === 'tasks' && (
            <motion.div
              key="tasks"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Quick Filters */}
              <motion.div 
                className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {['All', 'High', 'Medium', 'Low', 'Done'].map((filter) => (
                  <motion.button
                    key={filter}
                    variants={slideIn}
                    whileTap={scaleOnTap}
                    onClick={() => {
                      if (filter === 'All') setActiveFilter(null)
                      else if (filter === 'Done') setActiveFilter({ type: 'status', value: 'done' })
                      else setActiveFilter({ type: 'priority', value: filter.toLowerCase() })
                    }}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      (filter === 'All' && !activeFilter) || 
                      (activeFilter?.value === filter.toLowerCase())
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' 
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {filter}
                  </motion.button>
                ))}
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
                      className="text-center py-12"
                    >
                      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-indigo-400" />
                      </div>
                      <p className="text-gray-400 dark:text-gray-500 font-medium">No tasks yet</p>
                      <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Tap + to add one</p>
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
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(_, info) => handleSwipe(task, info)}
                        onDragStart={() => setSwipedTaskId(task.id)}
                        className={`relative overflow-hidden rounded-xl border ${
                          task.done 
                            ? 'bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700/50 opacity-60' 
                            : isOverdue(task)
                              ? 'bg-white dark:bg-gray-800 border-red-200 dark:border-red-800/50 border-l-4 border-l-red-500'
                              : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                        }`}
                      >
                        {/* Swipe background indicators */}
                        <div className="absolute inset-0 flex items-center justify-between px-4">
                          <div className="text-emerald-500 font-medium text-sm">
                            ✓ Complete
                          </div>
                          <div className="text-red-500 font-medium text-sm">
                            Delete 🗑
                          </div>
                        </div>

                        {/* Task content */}
                        <div className={`relative flex items-center gap-3 p-4 transition-transform ${
                          swipedTaskId === task.id ? '' : ''
                        }`}>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleToggleTask(task)}
                            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              task.done
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 border-transparent text-white'
                                : 'border-gray-300 dark:border-gray-600'
                            }`}
                          >
                            {task.done && <Check className="w-3.5 h-3.5" />}
                          </motion.button>

                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${
                              task.done ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'
                            }`}>
                              {task.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium border ${priorityColors[task.priority]}`}>
                                <Flag className="w-3 h-3" />
                                {priorityLabels[task.priority]}
                              </span>
                              {task.dueDate && (
                                <span className={`inline-flex items-center gap-1 text-xs ${
                                  isOverdue(task) ? 'text-red-500 font-medium' : 'text-gray-400 dark:text-gray-500'
                                }`}>
                                  <Calendar className="w-3 h-3" />
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingTaskId(task.id)
                                setEditTitle(task.title)
                                setEditPriority(task.priority)
                                setEditProjectId(task.projectId)
                                setEditDueDate(task.dueDate || '')
                              }}
                              className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-2 text-gray-400 hover:text-red-600 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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
              className="space-y-4"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Total', value: stats.total, icon: Circle, color: 'from-gray-500 to-gray-600' },
                  { label: 'Pending', value: stats.pending, icon: Circle, color: 'from-amber-500 to-orange-600' },
                  { label: 'Done', value: stats.done, icon: CheckCircle2, color: 'from-emerald-500 to-green-600' },
                  { label: 'Overdue', value: stats.overdue, icon: Zap, color: 'from-red-500 to-rose-600' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2`}>
                      <stat.icon className="w-4 h-4 text-white" />
                    </div>
                    <motion.p 
                      className="text-2xl font-bold text-gray-900 dark:text-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 + 0.2, type: 'spring' }}
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Completion Rate</h3>
                  <span className="text-xl font-bold text-indigo-600">{stats.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.completionRate}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowAddModal(true)}
        className="fixed right-4 bottom-24 z-40 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg shadow-indigo-500/40 flex items-center justify-center"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 safe-area-pb">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            {[
              { id: 'tasks' as View, icon: Home, label: 'Tasks' },
              { id: 'dashboard' as View, icon: BarChart3, label: 'Stats' },
              { id: 'projects' as View, icon: Folder, label: 'Projects' },
            ].map(({ id, icon: Icon, label }) => (
              <motion.button
                key={id}
                whileTap={{ scale: 0.9 }}
                onClick={() => setView(id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  view === id 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default App