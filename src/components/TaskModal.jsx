import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown } from 'lucide-react'
import { useTasks } from '../context/TaskContext'
import { COLUMNS, PRIORITIES } from '../data/mockData'
import Avatar from './Avatar'

const TAG_OPTIONS = ['Frontend', 'Backend', 'Design', 'QA', 'DevOps', 'Other']

const EMPTY_FORM = {
  title: '', description: '', assigneeId: '',
  status: 'not_started', priority: 'medium', deadline: '', tag: 'Frontend',
}

export default function TaskModal() {
  const { activeModal, closeModal, createTask, updateTask, users } = useTasks()

  const isCreate = activeModal?.type === 'create' || activeModal === 'create'
  const isEdit   = activeModal?.type === 'edit'
  const isView   = activeModal?.type === 'view'
  const isOpen   = isCreate || isEdit || isView

  const [form, setForm]     = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isEdit && activeModal.task)        { setForm({ ...EMPTY_FORM, ...activeModal.task, assigneeId: activeModal.task.assigneeId?._id || activeModal.task.assigneeId || '' }); setErrors({}) }
    else if (isCreate)                     { setForm({ ...EMPTY_FORM, status: activeModal?.defaultStatus || 'not_started' }); setErrors({}) }
    else if (isView && activeModal.task)   { setForm({ ...EMPTY_FORM, ...activeModal.task, assigneeId: activeModal.task.assigneeId?._id || activeModal.task.assigneeId || '' }) }
  }, [activeModal])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  function validate() {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.assigneeId)   e.assigneeId = 'Please assign to someone'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    isEdit ? updateTask({ ...form }) : createTask(form)
    closeModal()
  }

  const modalTitle = isCreate ? 'Create Task' : isEdit ? 'Edit Task' : 'Task Details'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {/* Backdrop */}
          <motion.div className="absolute inset-0 bg-surface-0/80 backdrop-blur-sm" onClick={closeModal} />

          {/* Modal box */}
          <motion.div className="relative w-full max-w-lg bg-surface-1 border border-border rounded-xl shadow-2xl"
            initial={{ scale: 0.98, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.98, y: 10, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-gray-100 tracking-tight">{modalTitle}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-200 transition-colors p-1 rounded-md hover:bg-surface-2">
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 overflow-y-auto max-h-[75vh]">
              {isView ? <ViewContent task={{...form, assigneeId: activeModal.task.assigneeId}} users={users} /> : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Field label="Title" error={errors.title} required>
                    <input className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-accent-blue transition-colors"
                      placeholder="What needs to be done?" value={form.title} onChange={e => set('title', e.target.value)} />
                  </Field>

                  <Field label="Description">
                    <textarea className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-accent-blue transition-colors resize-none"
                      placeholder="Add more context…" value={form.description} onChange={e => set('description', e.target.value)} rows={3} />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Assignee" error={errors.assigneeId} required>
                      <StyledSelect value={form.assigneeId} onChange={v => set('assigneeId', v)} placeholder="Assign to…">
                        {users.map(u => <option key={u.id || u._id} value={u.id || u._id}>{u.name}</option>)}
                      </StyledSelect>
                    </Field>
                    <Field label="Status">
                      <StyledSelect value={form.status} onChange={v => set('status', v)}>
                        {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                      </StyledSelect>
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Priority">
                      <StyledSelect value={form.priority} onChange={v => set('priority', v)}>
                        {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                      </StyledSelect>
                    </Field>
                    <Field label="Tag">
                      <StyledSelect value={form.tag} onChange={v => set('tag', v)}>
                        <option value="">None</option>
                        {TAG_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                      </StyledSelect>
                    </Field>
                  </div>

                  <Field label="Deadline" error={errors.deadline}>
                    <input type="date" className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-accent-blue transition-colors [color-scheme:dark]"
                      value={form.deadline ? form.deadline.split('T')[0] : ''} onChange={e => set('deadline', e.target.value)} />
                  </Field>

                  <div className="flex gap-3 pt-4 mt-2 border-t border-border">
                    <button type="button" onClick={closeModal} className="flex-1 py-2.5 rounded-lg text-sm font-medium text-gray-400 bg-surface-2 hover:bg-surface-3 transition-colors border border-transparent">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white bg-accent-blue hover:bg-blue-600 transition-colors">
                      {isEdit ? 'Save Changes' : 'Create Task'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function StyledSelect({ value, onChange, children, placeholder }) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-surface-2 border border-border rounded-lg pl-3 pr-8 py-2 text-sm text-gray-200 outline-none focus:border-accent-blue transition-colors appearance-none">
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {children}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
    </div>
  )
}

function Field({ label, children, error, required }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
        {label} {required && <span className="text-accent-blue">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
    </div>
  )
}

function ViewContent({ task, users }) {
  const { deleteTask, openModal, closeModal } = useTasks()
  const priorityColor = { high: 'text-red-400 bg-red-400/10', medium: 'text-amber-400 bg-amber-400/10', low: 'text-blue-400 bg-blue-400/10' }[task.priority]
  const statusColor   = { not_started: 'text-gray-400 bg-gray-400/10', in_progress: 'text-blue-400 bg-blue-400/10', completed: 'text-emerald-400 bg-emerald-400/10' }[task.status]
  const statusLabel   = { not_started: 'Not Started', in_progress: 'In Progress', completed: 'Completed' }[task.status]
  const priorityLabel = { high: 'High', medium: 'Medium', low: 'Low' }[task.priority]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-100 leading-tight">{task.title}</h3>
        {task.description && <p className="mt-3 text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">{task.description}</p>}
      </div>
      
      <div className="grid grid-cols-2 gap-y-6 gap-x-4 bg-surface-2/50 rounded-xl p-5 border border-border">
        <InfoRow label="Status">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${statusColor}`}>{statusLabel}</span>
        </InfoRow>
        <InfoRow label="Priority">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${priorityColor}`}>{priorityLabel}</span>
        </InfoRow>
        <InfoRow label="Assignee">
          <Avatar userObj={task.assigneeId} userId={task.assigneeId?._id || task.assigneeId} size="sm" showName />
        </InfoRow>
        <InfoRow label="Deadline">
          <span className="text-sm text-gray-300 font-mono">{task.deadline ? task.deadline.split('T')[0] : '—'}</span>
        </InfoRow>
        {task.tag && (
          <InfoRow label="Tag">
            <span className="text-sm font-medium text-gray-300">{task.tag}</span>
          </InfoRow>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={() => openModal({ type: 'edit', task })} className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white bg-accent-blue hover:bg-blue-600 transition-colors">
          Edit Task
        </button>
        <button onClick={() => { deleteTask(task.id || task._id); closeModal() }} className="px-5 py-2.5 rounded-lg text-sm font-medium text-red-400 border border-red-400/30 hover:bg-red-400/10 transition-colors">
          Delete
        </button>
      </div>
    </div>
  )
}

function InfoRow({ label, children }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">{label}</p>
      {children}
    </div>
  )
}
