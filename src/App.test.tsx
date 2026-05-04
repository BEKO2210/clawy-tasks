import { describe, it, expect } from 'vitest'
import { createTask, toggleTaskStatus, validateTask, generateId } from './domain/Task'

describe('Task domain', () => {
  it('creates a task with defaults', () => {
    const task = createTask('Test task')
    expect(task.title).toBe('Test task')
    expect(task.priority).toBe('medium')
    expect(task.done).toBe(false)
    expect(task.projectId).toBeNull()
    expect(task.id).toHaveLength(7)
  })

  it('creates a task with custom priority', () => {
    const task = createTask('High priority', 'high')
    expect(task.priority).toBe('high')
  })

  it('toggles task status', () => {
    const task = createTask('Toggle me')
    expect(task.done).toBe(false)
    
    const toggled = toggleTaskStatus(task)
    expect(toggled.done).toBe(true)
    expect(toggled.completedAt).not.toBeNull()
    
    const toggledBack = toggleTaskStatus(toggled)
    expect(toggledBack.done).toBe(false)
    expect(toggledBack.completedAt).toBeNull()
  })

  it('validates empty title', () => {
    const error = validateTask('')
    expect(error).toBe('Task title is required')
  })

  it('validates long title', () => {
    const error = validateTask('a'.repeat(201))
    expect(error).toBe('Task title must be under 200 characters')
  })

  it('accepts valid title', () => {
    const error = validateTask('Valid task')
    expect(error).toBeNull()
  })

  it('generates unique IDs', () => {
    const id1 = generateId()
    const id2 = generateId()
    expect(id1).not.toBe(id2)
    expect(id1).toHaveLength(7)
  })
})
