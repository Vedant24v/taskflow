import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown } from 'lucide-react'
import { useTasks } from '../context/TaskContext'
import { USERS, COLUMNS, PRIORITIES } from '../data/mockData'
import Avatar from './Avatar'

const TAG_OPTIONS = ['Frontend', 'Backend', 'Design', 'QA', 'DevOps', 'Other']

const EMPTY_FORM = {
  title: '', description: '', assigneeId: '',
  status: 'not_started', priority: 'medium', deadline: '', tag: 'Frontend',
}

const inputStyle = {
  background: '#1a1a26',
  border: '1.5px solid rgba(255,255,255,0.1)',
  borderRadius: 10,
  padding: '11px 14px',
  fontSize: 14,
  color: '#dde1f0',
  outline: 'none',
  width: '100%',
  fontFamily: 'Syne, sans-serif',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

const inputFocus = {
  borderColor: 'rgba(79,142,247,0.6)',
  boxShadow: '0 0 0 3px rgba(79,142,247,0.1)',
}

export default function TaskModal() {
  const { activeModal, closeModal, createTask, updateTask } = useTasks()

  const isCreate = activeModal?.type === 'create' || activeModal === 'create'
  const isEdit   = activeModal?.type === 'edit'
  const isView   = activeModal?.type === 'view'
  const isOpen   = isCreate || isEdit || isView

  const [form, setForm]     = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isEdit && activeModal.task)        { setForm({ ...EMPTY_FORM, ...activeModal.task }); setErrors({}) }
    else if (isCreate)                     { setForm({ ...EMPTY_FORM, status: activeModal?.defaultStatus || 'not_started' }); setErrors({}) }
    else if (isView && activeModal.task)   { setForm({ ...EMPTY_FORM, ...activeModal.task }) }
  }, [activeModal])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  function validate() {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.assigneeId)   e.assigneeId = 'Please assign to someone'
    if (!form.deadline)     e.deadline = 'Deadline is required'
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
          <motion.div className="absolute inset-0 backdrop-blur-sm"
            style={{ background: 'rgba(0,0,0,0.75)' }} onClick={closeModal} />

          {/* Modal box */}
          <motion.div className="relative w-full max-w-lg"
            style={{ background: '#13131e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, boxShadow: '0 30px 80px rgba(0,0,0,0.8)' }}
            initial={{ scale: 0.96, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 10, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <h2 className="text-base font-bold text-white">{modalTitle}</h2>
              <button onClick={closeModal}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                style={{ color: 'rgba(221,225,240,0.4)', background: 'rgba(255,255,255,0.05)' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#dde1f0'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(221,225,240,0.4)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 overflow-y-auto" style={{ maxHeight: '76vh' }}>
              {isView
                ? <ViewContent task={form} />
                : (
                  <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <Field label="Title" error={errors.title} required>
                        <StyledInput
                          placeholder="What needs to be done?"
                          value={form.title}
                          onChange={e => set('title', e.target.value)}
                        />
                      </Field>

                      <Field label="Description">
                        <StyledTextarea
                          placeholder="Add more context…"
                          value={form.description}
                          onChange={e => set('description', e.target.value)}
                          rows={3}
                        />
                      </Field>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <Field label="Assignee" error={errors.assigneeId} required>
                          <StyledSelect value={form.assigneeId} onChange={v => set('assigneeId', v)} placeholder="Assign to…">
                            {USERS.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                          </StyledSelect>
                        </Field>
                        <Field label="Status">
                          <StyledSelect value={form.status} onChange={v => set('status', v)}>
                            {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                          </StyledSelect>
                        </Field>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <Field label="Priority">
                          <StyledSelect value={form.priority} onChange={v => set('priority', v)}>
                            {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                          </StyledSelect>
                        </Field>
                        <Field label="Tag">
                          <StyledSelect value={form.tag} onChange={v => set('tag', v)}>
                            {TAG_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                          </StyledSelect>
                        </Field>
                      </div>

                      <Field label="Deadline" error={errors.deadline} required>
                        <StyledInput type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
                      </Field>

                      <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                        <button type="button" onClick={closeModal}
                          className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                          style={{ color: 'rgba(221,225,240,0.5)', background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.1)' }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#dde1f0'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(221,225,240,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                        >
                          Cancel
                        </button>
                        <button type="submit"
                          className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                          style={{ background: 'linear-gradient(135deg, #4f8ef7, #7b6cf6)' }}
                        >
                          {isEdit ? 'Save Changes' : 'Create Task'}
                        </button>
                      </div>
                    </div>
                  </form>
                )
              }
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function StyledInput({ type = 'text', placeholder, value, onChange }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputStyle,
        ...(focused ? inputFocus : {}),
        colorScheme: 'dark',
      }}
    />
  )
}

function StyledTextarea({ placeholder, value, onChange, rows }) {
  const [focused, setFocused] = useState(false)
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputStyle,
        ...(focused ? inputFocus : {}),
        resize: 'none',
        lineHeight: 1.6,
      }}
    />
  )
}

function StyledSelect({ value, onChange, children, placeholder }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputStyle,
          paddingRight: 36,
          appearance: 'none',
          WebkitAppearance: 'none',
          colorScheme: 'dark',
          ...(focused ? inputFocus : {}),
        }}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {children}
      </select>
      <ChevronDown size={14} style={{
        position: 'absolute', right: 12, top: '50%',
        transform: 'translateY(-50%)', color: 'rgba(221,225,240,0.4)',
        pointerEvents: 'none',
      }} />
    </div>
  )
}

function Field({ label, children, error, required }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(221,225,240,0.45)', marginBottom: 7 }}>
        {label} {required && <span style={{ color: '#4f8ef7' }}>*</span>}
      </label>
      {children}
      {error && <p style={{ fontSize: 12, color: '#f87171', marginTop: 5 }}>{error}</p>}
    </div>
  )
}

function ViewContent({ task }) {
  const { deleteTask, openModal, closeModal } = useTasks()
  const priorityColor = { high: '#f87171', medium: '#fbbf24', low: '#64748b' }[task.priority]
  const statusColor   = { not_started: '#64748b', in_progress: '#4f8ef7', completed: '#34d399' }[task.status]
  const statusLabel   = { not_started: 'Not Started', in_progress: 'In Progress', completed: 'Completed' }[task.status]
  const priorityLabel = { high: 'High', medium: 'Medium', low: 'Low' }[task.priority]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: '#dde1f0', lineHeight: 1.3 }}>{task.title}</h3>
      {task.description && (
        <p style={{ fontSize: 14, color: 'rgba(221,225,240,0.55)', lineHeight: 1.65 }}>{task.description}</p>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <InfoRow label="Status">
          <span style={{ fontSize: 13, fontWeight: 600, color: statusColor, background: statusColor + '20', padding: '4px 12px', borderRadius: 99 }}>{statusLabel}</span>
        </InfoRow>
        <InfoRow label="Priority">
          <span style={{ fontSize: 13, fontWeight: 600, color: priorityColor, background: priorityColor + '20', padding: '4px 12px', borderRadius: 99 }}>{priorityLabel}</span>
        </InfoRow>
        <InfoRow label="Assignee">
          <Avatar userId={task.assigneeId} size="sm" showName />
        </InfoRow>
        <InfoRow label="Deadline">
          <span style={{ fontSize: 13, color: 'rgba(221,225,240,0.7)', fontFamily: 'JetBrains Mono, monospace' }}>{task.deadline || '—'}</span>
        </InfoRow>
        {task.tag && (
          <InfoRow label="Tag">
            <span style={{ fontSize: 13, color: 'rgba(221,225,240,0.65)', fontWeight: 600 }}>{task.tag}</span>
          </InfoRow>
        )}
      </div>
      <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
        <button onClick={() => openModal({ type: 'edit', task })}
          className="flex-1 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-all"
          style={{ background: 'linear-gradient(135deg, #4f8ef7, #7b6cf6)' }}>
          Edit Task
        </button>
        <button onClick={() => { deleteTask(task.id); closeModal() }}
          className="px-5 py-3 rounded-xl text-sm font-semibold transition-all"
          style={{ color: '#f87171', border: '1.5px solid rgba(248,113,113,0.25)', background: 'transparent' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

function InfoRow({ label, children }) {
  return (
    <div>
      <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'rgba(221,225,240,0.3)', marginBottom: 7 }}>{label}</p>
      {children}
    </div>
  )
}
