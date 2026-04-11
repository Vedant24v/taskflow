import React, { createContext, useContext, useReducer, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { INITIAL_TASKS, COLUMNS } from '../data/mockData'

const TaskContext = createContext(null)

const initialState = {
  tasks: INITIAL_TASKS,
  columns: COLUMNS,
  filter: { assignee: 'all', priority: 'all', search: '' },
  activeModal: null, // null | 'create' | { type: 'edit', task } | { type: 'view', task }
}

function reducer(state, action) {
  switch (action.type) {
    case 'CREATE_TASK': {
      const task = { ...action.payload, id: uuidv4(), createdAt: new Date().toISOString() }
      return { ...state, tasks: [...state.tasks, task] }
    }
    case 'UPDATE_TASK': {
      return {
        ...state,
        tasks: state.tasks.map(t => t.id === action.payload.id ? { ...t, ...action.payload } : t),
      }
    }
    case 'DELETE_TASK': {
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) }
    }
    case 'MOVE_TASK': {
      // Move task to new column (and optionally new index)
      const { taskId, newStatus, overTaskId } = action.payload
      let tasks = state.tasks.map(t =>
        t.id === taskId ? { ...t, status: newStatus } : t
      )
      if (overTaskId && overTaskId !== taskId) {
        const fromIdx = tasks.findIndex(t => t.id === taskId)
        const toIdx = tasks.findIndex(t => t.id === overTaskId)
        const moved = tasks.splice(fromIdx, 1)[0]
        tasks.splice(toIdx, 0, moved)
      }
      return { ...state, tasks }
    }
    case 'REORDER_TASKS': {
      // Reorder within same column
      const { activeId, overId } = action.payload
      const fromIdx = state.tasks.findIndex(t => t.id === activeId)
      const toIdx = state.tasks.findIndex(t => t.id === overId)
      const tasks = [...state.tasks]
      const [moved] = tasks.splice(fromIdx, 1)
      tasks.splice(toIdx, 0, moved)
      return { ...state, tasks }
    }
    case 'SET_FILTER': {
      return { ...state, filter: { ...state.filter, ...action.payload } }
    }
    case 'OPEN_MODAL': {
      return { ...state, activeModal: action.payload }
    }
    case 'CLOSE_MODAL': {
      return { ...state, activeModal: null }
    }
    default:
      return state
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const createTask = useCallback((data) => dispatch({ type: 'CREATE_TASK', payload: data }), [])
  const updateTask = useCallback((data) => dispatch({ type: 'UPDATE_TASK', payload: data }), [])
  const deleteTask = useCallback((id) => dispatch({ type: 'DELETE_TASK', payload: id }), [])
  const moveTask   = useCallback((payload) => dispatch({ type: 'MOVE_TASK', payload }), [])
  const reorderTasks = useCallback((payload) => dispatch({ type: 'REORDER_TASKS', payload }), [])
  const setFilter  = useCallback((payload) => dispatch({ type: 'SET_FILTER', payload }), [])
  const openModal  = useCallback((payload) => dispatch({ type: 'OPEN_MODAL', payload }), [])
  const closeModal = useCallback(() => dispatch({ type: 'CLOSE_MODAL' }), [])

  const filteredTasks = state.tasks.filter(t => {
    const { assignee, priority, search } = state.filter
    if (assignee !== 'all' && t.assigneeId !== assignee) return false
    if (priority !== 'all' && t.priority !== priority) return false
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <TaskContext.Provider value={{
      ...state,
      filteredTasks,
      createTask, updateTask, deleteTask, moveTask, reorderTasks,
      setFilter, openModal, closeModal,
    }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTasks must be used within TaskProvider')
  return ctx
}
