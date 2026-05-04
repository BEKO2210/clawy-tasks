import { describe, it, expect } from 'vitest'
import { createTask, toggleTaskStatus, updateTask, createProject, validateTask, isOverdue, isDueToday, generateId } from './domain/Task'

describe('Task domain', () => {
  it('createTask generates a task with defaults', () => {
    const task = createTask('Buy milk')
    expect(task.title).toBe('Buy milk')
    expect(task.priority).toBe('medium')
    expect(task.done).toBe(false)
    expect(task.projectId).toBeNull()
    expect(task.dueDate).toBeNull()
    expect(task.id).toBeDefined()
    expect(task.createdAt).toBeDefined()
  })

  it('createTask accepts priority, projectId, and dueDate', () => {
    const task = createTask('Write tests', 'high', 'proj-1', '2026-05-10')
    expect(task.priority).toBe('high')
    expect(task.projectId).toBe('proj-1')
    expect(task.dueDate).toBe('2026-05-10')
  })

  it('toggleTaskStatus flips done and sets completedAt', () => {
    const task = createTask('Test')
    const toggled = toggleTaskStatus(task)
    expect(toggled.done).toBe(true)
    expect(toggled.completedAt).toBeDefined()
    const back = toggleTaskStatus(toggled)
    expect(back.done).toBe(false)
    expect(back.completedAt).toBeNull()
  })

  it('updateTask applies partial updates', () => {
    const task = createTask('Old title')
    const updated = updateTask(task, { title: 'New title', priority: 'high' })
    expect(updated.title).toBe('New title')
    expect(updated.priority).toBe('high')
    expect(updated.id).toBe(task.id)
  })

  it('validateTask rejects empty titles', () => {
    expect(validateTask('')).not.toBeNull()
    expect(validateTask('   ')).not.toBeNull()
    expect(validateTask('Valid')).toBeNull()
  })

  it('validateTask rejects titles over 200 chars', () => {
    expect(validateTask('a'.repeat(201))).not.toBeNull()
    expect(validateTask('a'.repeat(200))).toBeNull()
  })

  it('generateId returns a string', () => {
    expect(typeof generateId()).toBe('string')
    expect(generateId().length).toBeGreaterThan(0)
  })
})

describe('Project domain', () => {
  it('createProject generates a project', () => {
    const project = createProject('My Project', '#ff0000')
    expect(project.name).toBe('My Project')
    expect(project.color).toBe('#ff0000')
    expect(project.id).toBeDefined()
  })

  it('createProject uses default color', () => {
    const project = createProject('Default')
    expect(project.color).toBe('#6366f1')
  })
})

describe('Date helpers', () => {
  it('isOverdue returns true for past due dates', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const task = createTask('Late', 'medium', null, yesterday.toISOString().split('T')[0])
    expect(isOverdue(task)).toBe(true)
  })

  it('isOverdue returns false for future due dates', () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const task = createTask('Future', 'medium', null, tomorrow.toISOString().split('T')[0])
    expect(isOverdue(task)).toBe(false)
  })

  it('isDueToday returns true for today', () => {
    const today = new Date().toISOString().split('T')[0]
    const task = createTask('Today', 'medium', null, today)
    expect(isDueToday(task)).toBe(true)
  })
})
