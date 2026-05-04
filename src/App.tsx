import React, { useState, useMemo } from 'react'
import {
  Plus, Check, Trash2, Calendar, Flag, Edit2, X, Save,
  Folder, Filter, Download, ChevronDown, ChevronRight,
  Clock, AlertCircle
} from 'lucide-react'
import { useTaskStore } from './store/taskStore'
import { Task, Priority, isOverdue, isDueToday } from './domain/Task'

type View = 'tasks' | 'projects' | 'dashboard'

function App() {
  const [view, setView] = useState<View>('tasks')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium')
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [selectedDueDate, setSelectedDueDate] = useState('')
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editPriority, setEditPriority] = useState<Priority>('medium')
  const [editProjectId, setEditProjectId] = useState<string | null>(null)
  const [editDueDate, setEditDueDate] = useState('')
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectColor, setNewProjectColor] = useState('#6366f1')
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilter, setActiveFilter] = useState<{ type: 'all' | 'project' | 'priority' | 'status'; value: string } | null>(null)

  const {
    tasks, projects, addTask, toggleTask, deleteTask, editTask,
    addProject, deleteProject, exportToJSON, exportToCSV
  } = useTaskStore()

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
  }

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProjectName.trim()) return
    addProject(newProjectName, newProjectColor)
    setNewProjectName('')
    setShowProjectForm(false)
  }

  const startEdit = (task: Task) => {
    setEditingTaskId(task.id)
    setEditTitle(task.title)
    setEditPriority(task.priority)
    setEditProjectId(task.projectId)
    setEditDueDate(task.dueDate || '')
  }

  const saveEdit = (id: string) => {
    editTask(id, {
      title: editTitle,
      priority: editPriority,
      projectId: editProjectId,
      dueDate: editDueDate || null,
    })
    setEditingTaskId(null)
  }

  const cancelEdit = () => {
    setEditingTaskId(null)
  }

  const applyFilter = (type: 'all' | 'project' | 'priority' | 'status', value: string) => {
    if (type === 'all') {
      setActiveFilter(null)
    } else {
      setActiveFilter({ type, value })
    }
  }

  const filteredTasks = useMemo(() => {
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
  }, [tasks, activeFilter])

  const handleExportJSON = () => {
    const data = exportToJSON()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `clawy-tasks-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportCSV = () => {
    const data = exportToCSV()
    const blob = new Blob([data], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `clawy-tasks-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const priorityColors = {
    high: 'text-red-600 bg-red-50 border-red-200',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    low: 'text-green-600 bg-green-50 border-green-200',
  }

  const priorityLabels = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  }

  const getProjectName = (projectId: string | null) => {
    if (!projectId) return null
    return projects.find((p) => p.id === projectId)?.name || 'Unknown'
  }

  const getProjectColor = (projectId: string | null) => {
    if (!projectId) return null
    return projects.find((p) => p.id === projectId)?.color || '#6366f1'
  }

  const overdueCount = tasks.filter((t) => isOverdue(t)).length
  // const dueTodayCount = tasks.filter((t) => isDueToday(t)).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Clawy Tasks</h1>
              <p className="text-sm text-gray-500 mt-1">
                {tasks.filter((t) => !t.done).length} tasks remaining
                {overdueCount > 0 && (
                  <span className="ml-2 text-red-600 font-medium">
                    ({overdueCount} overdue)
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-1 mt-4">
            <button
              onClick={() => setView('tasks')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                view === 'tasks'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => setView('projects')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                view === 'projects'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setView('dashboard')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                view === 'dashboard'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {view === 'tasks' && (
          <>
            {/* Add Task Form */}
            <form onSubmit={handleAddTask} className="mb-6">
              <div className="flex gap-2 flex-wrap">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="flex-1 min-w-[200px] px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as Priority)}
                  className="px-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <select
                  value={selectedProjectId || ''}
                  onChange={(e) => setSelectedProjectId(e.target.value || null)}
                  className="px-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">No Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={selectedDueDate}
                  onChange={(e) => setSelectedDueDate(e.target.value)}
                  className="px-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  title="Due date"
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add
                </button>
              </div>
            </form>

            {/* Filters & Export */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {showFilters ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
                {activeFilter && (
                  <span className="text-sm text-primary-600 bg-primary-50 px-2 py-1 rounded-md">
                    {activeFilter.type}: {activeFilter.value}
                    <button
                      onClick={() => setActiveFilter(null)}
                      className="ml-1 text-primary-400 hover:text-primary-600"
                    >
                      <X className="w-3 h-3 inline" />
                    </button>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportJSON}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  JSON
                </button>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  CSV
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 space-y-3">
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase">Status</span>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => applyFilter('all', 'all')}
                      className={`px-2 py-1 text-sm rounded-md ${!activeFilter ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => applyFilter('status', 'pending')}
                      className={`px-2 py-1 text-sm rounded-md ${activeFilter?.type === 'status' && activeFilter.value === 'pending' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => applyFilter('status', 'done')}
                      className={`px-2 py-1 text-sm rounded-md ${activeFilter?.type === 'status' && activeFilter.value === 'done' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}`}
                    >
                      Done
                    </button>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase">Priority</span>
                  <div className="flex gap-2 mt-1">
                    {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => applyFilter('priority', p)}
                        className={`px-2 py-1 text-sm rounded-md capitalize ${activeFilter?.type === 'priority' && activeFilter.value === p ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                {projects.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Project</span>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {projects.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => applyFilter('project', p.id)}
                          className={`px-2 py-1 text-sm rounded-md flex items-center gap-1 ${activeFilter?.type === 'project' && activeFilter.value === p.id ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}`}
                        >
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Task List */}
            <div className="space-y-2">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-400 text-lg">
                    {tasks.length === 0
                      ? "No tasks yet. Add one above!"
                      : "No tasks match the current filter."}
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 p-4 bg-white rounded-lg border transition-all ${
                      task.done
                        ? 'border-gray-200 opacity-60'
                        : 'border-gray-200 shadow-sm hover:shadow-md'
                    } ${isOverdue(task) ? 'border-l-4 border-l-red-500' : ''}`}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        task.done
                          ? 'bg-primary-600 border-primary-600 text-white'
                          : 'border-gray-300 hover:border-primary-500'
                      }`}
                    >
                      {task.done && <Check className="w-4 h-4" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      {editingTaskId === task.id ? (
                        <div className="flex gap-2 flex-wrap">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="flex-1 min-w-[150px] px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                          <select
                            value={editPriority}
                            onChange={(e) => setEditPriority(e.target.value as Priority)}
                            className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </select>
                          <select
                            value={editProjectId || ''}
                            onChange={(e) => setEditProjectId(e.target.value || null)}
                            className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="">No Project</option>
                            {projects.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                          <input
                            type="date"
                            value={editDueDate}
                            onChange={(e) => setEditDueDate(e.target.value)}
                            className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                          <button
                            onClick={() => saveEdit(task.id)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <p
                            className={`text-sm font-medium truncate ${
                              task.done ? 'line-through text-gray-400' : 'text-gray-900'
                            }`}
                          >
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${priorityColors[task.priority]}`}
                            >
                              <Flag className="w-3 h-3" />
                              {priorityLabels[task.priority]}
                            </span>
                            {task.projectId && (
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border text-gray-600 bg-gray-50 border-gray-200"
                              >
                                <Folder className="w-3 h-3" style={{ color: getProjectColor(task.projectId) || undefined }} />
                                {getProjectName(task.projectId)}
                              </span>
                            )}
                            {task.dueDate && (
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${
                                  isOverdue(task)
                                    ? 'text-red-600 bg-red-50 border-red-200'
                                    : isDueToday(task)
                                    ? 'text-blue-600 bg-blue-50 border-blue-200'
                                    : 'text-gray-500 bg-gray-50 border-gray-200'
                                }`}
                              >
                                <Clock className="w-3 h-3" />
                                {isOverdue(task) && <AlertCircle className="w-3 h-3" />}
                                {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            )}
                            <span className="text-xs text-gray-400">
                              {new Date(task.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {!editingTaskId && (
                      <>
                        <button
                          onClick={() => startEdit(task)}
                          className="flex-shrink-0 p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Stats */}
            {tasks.length > 0 && (
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                  <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                  <p className="text-2xl font-bold text-primary-600">
                    {tasks.filter((t) => t.done).length}
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Done</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100) || 0}%
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Progress</p>
                </div>
              </div>
            )}
          </>
        )}

        {view === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
              <button
                onClick={() => setShowProjectForm(!showProjectForm)}
                className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                New Project
              </button>
            </div>

            {showProjectForm && (
              <form onSubmit={handleAddProject} className="bg-white p-4 rounded-lg border border-gray-200 flex gap-2 flex-wrap">
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Project name"
                  className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="color"
                  value={newProjectColor}
                  onChange={(e) => setNewProjectColor(e.target.value)}
                  className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                  title="Project color"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Create
                </button>
              </form>
            )}

            {projects.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-400 text-lg">No projects yet. Create one to organize your tasks!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => {
                  const projectTasks = tasks.filter((t) => t.projectId === project.id)
                  const doneCount = projectTasks.filter((t) => t.done).length
                  return (
                    <div
                      key={project.id}
                      className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      </div>
                      <div className="text-sm text-gray-500 mb-3">
                        {projectTasks.length} tasks · {doneCount} done
                      </div>
                      {projectTasks.length > 0 && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                          <div
                            className="bg-primary-600 h-2 rounded-full transition-all"
                            style={{
                              width: `${Math.round((doneCount / projectTasks.length) * 100) || 0}%`,
                            }}
                          />
                        </div>
                      )}
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {view === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <p className="text-3xl font-bold text-gray-900">{tasks.length}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Total Tasks</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <p className="text-3xl font-bold text-primary-600">
                  {tasks.filter((t) => !t.done).length}
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Pending</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <p className="text-3xl font-bold text-green-600">
                  {tasks.filter((t) => t.done).length}
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Completed</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <p className="text-3xl font-bold text-red-600">{overdueCount}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Overdue</p>
              </div>
            </div>

            {projects.length > 0 && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Project Progress</h3>
                <div className="space-y-3">
                  {projects.map((project) => {
                    const projectTasks = tasks.filter((t) => t.projectId === project.id)
                    const doneCount = projectTasks.filter((t) => t.done).length
                    const pct = Math.round((doneCount / projectTasks.length) * 100) || 0
                    return (
                      <div key={project.id}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: project.color }}
                            />
                            <span className="text-sm font-medium text-gray-700">{project.name}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {doneCount}/{projectTasks.length} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: project.color,
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Priority Breakdown</h3>
              <div className="space-y-3">
                {(['high', 'medium', 'low'] as Priority[]).map((p) => {
                  const count = tasks.filter((t) => t.priority === p && !t.done).length
                  const total = tasks.filter((t) => t.priority === p).length
                  void total; void count; // used in JSX below
                  return (
                    <div key={p}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium capitalize text-gray-700">{p} Priority</span>
                        <span className="text-sm text-gray-500">
                          {count} pending / {total} total
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            p === 'high'
                              ? 'bg-red-500'
                              : p === 'medium'
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${total > 0 ? Math.round(((total - count) / total) * 100) : 0}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
