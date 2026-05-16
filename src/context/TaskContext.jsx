import React, { createContext, useContext, useReducer, useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { COLUMNS } from '../data/mockData'

const TaskContext = createContext(null)

const initialState = {
  tasks: [],
  columns: COLUMNS,
  filter: { assignee: 'all', priority: 'all', search: '' },
  activeModal: null, // null | 'create' | { type: 'edit', task } | { type: 'view', task }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TASKS': {
      return { ...state, tasks: action.payload }
    }
    case 'CREATE_TASK': {
      return { ...state, tasks: [...state.tasks, action.payload] }
    }
    case 'UPDATE_TASK': {
      return {
        ...state,
        tasks: state.tasks.map(t => (t.id || t._id) === (action.payload.id || action.payload._id) ? action.payload : t),
      }
    }
    case 'DELETE_TASK': {
      return { ...state, tasks: state.tasks.filter(t => (t.id || t._id) !== action.payload) }
    }
    case 'OPTIMISTIC_UPDATE': {
      // For immediate UI update during drag & drop
      return {
        ...state,
        tasks: state.tasks.map(t => (t.id || t._id) === action.payload.id ? { ...t, ...action.payload.changes } : t),
      }
    }
    case 'REORDER_TASKS': {
      const { activeId, overId } = action.payload
      const fromIdx = state.tasks.findIndex(t => (t.id || t._id) === activeId)
      const toIdx = state.tasks.findIndex(t => (t.id || t._id) === overId)
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
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, usersRes] = await Promise.all([
          axios.get('/api/tasks'),
          axios.get('/api/users')
        ])
        dispatch({ type: 'SET_TASKS', payload: tasksRes.data })
        setUsers(usersRes.data.map(u => ({ ...u, id: u.id || u._id })))
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const createTask = useCallback(async (data) => {
    try {
      const res = await axios.post('/api/tasks', data)
      dispatch({ type: 'CREATE_TASK', payload: res.data })
    } catch (err) {
      console.error(err)
    }
  }, [])

  const updateTask = useCallback(async (data) => {
    try {
      const { id, ...rest } = data
      const res = await axios.put(`/api/tasks/${id}`, rest)
      dispatch({ type: 'UPDATE_TASK', payload: res.data })
    } catch (err) {
      console.error(err)
    }
  }, [])

  const deleteTask = useCallback(async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`)
      dispatch({ type: 'DELETE_TASK', payload: id })
    } catch (err) {
      console.error(err)
    }
  }, [])

  const moveTask = useCallback(async (payload) => {
    const { taskId, newStatus, overTaskId } = payload
    
    // Optimistic UI Update
    dispatch({ type: 'OPTIMISTIC_UPDATE', payload: { id: taskId, changes: { status: newStatus } } })
    
    if (overTaskId && overTaskId !== taskId) {
      dispatch({ type: 'REORDER_TASKS', payload: { activeId: taskId, overId: overTaskId } })
    }

    // Backend update
    try {
      const task = state.tasks.find(t => (t.id || t._id) === taskId)
      if (task.status !== newStatus) {
        await axios.put(`/api/tasks/${taskId}`, { status: newStatus })
      }
    } catch (err) {
      console.error(err)
      // Re-fetch tasks if optimistic update fails
      const res = await axios.get('/api/tasks')
      dispatch({ type: 'SET_TASKS', payload: res.data })
    }
  }, [state.tasks])


  const reorderTasks = useCallback((payload) => dispatch({ type: 'REORDER_TASKS', payload }), [])

  const addUser = useCallback(async (data) => {
    try {
      const res = await axios.post('/api/users', data)
      const user = { ...res.data, id: res.data.id || res.data._id }
      setUsers(prev => [...prev, user])
      return user
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [])

  const deleteUser = useCallback(async (userId) => {
    try {
      await axios.delete(`/api/users/${userId}`)
      setUsers(prev => prev.filter(u => (u.id || u._id) !== userId))
      // Update local tasks to remove assigneeId
      dispatch({ 
        type: 'SET_TASKS', 
        payload: state.tasks.map(t => 
          (t.assigneeId?._id === userId || t.assigneeId?.id === userId || t.assigneeId === userId) 
            ? { ...t, assigneeId: null } 
            : t
        )
      })
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [state.tasks])

  const setFilter  = useCallback((payload) => dispatch({ type: 'SET_FILTER', payload }), [])
  const openModal  = useCallback((payload) => dispatch({ type: 'OPEN_MODAL', payload }), [])
  const closeModal = useCallback(() => dispatch({ type: 'CLOSE_MODAL' }), [])

  const filteredTasks = state.tasks.filter(t => {
    const { assignee, priority, search } = state.filter
    if (assignee !== 'all' && (t.assigneeId?._id || t.assigneeId?.id || t.assigneeId) !== assignee) return false
    if (priority !== 'all' && t.priority !== priority) return false
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        filteredTasks,
        users,
        addUser,
        deleteUser,
        loading,
        filter: state.filter,
        setFilter,
        moveTask,
        reorderTasks,
        createTask,
        updateTask,
        deleteTask,
        activeModal: state.activeModal,
        openModal,
        closeModal,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTasks must be used within TaskProvider')
  return ctx
}
