import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown, Trash2, Pencil } from 'lucide-react'
import { useTasks } from '../context/TaskContext'
import { COLUMNS, PRIORITIES } from '../data/mockData'
import Avatar from './Avatar'

const TAG_OPTIONS = ['Frontend', 'Backend', 'Design', 'QA', 'DevOps', 'Other']

const EMPTY_FORM = {
  title: '',
  description: '',
  assigneeId: '',
  status: 'not_started',
  priority: 'medium',
  deadline: '',
  tag: 'Frontend',
}

export default function TaskModal() {
  const { activeModal, closeModal, createTask, updateTask, users } = useTasks()

  const isCreate = activeModal?.type === 'create' || activeModal === 'create'
  const isEdit = activeModal?.type === 'edit'
  const isView = activeModal?.type === 'view'
  const isOpen = isCreate || isEdit || isView

  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isEdit && activeModal.task) {
      setForm({ ...EMPTY_FORM, ...activeModal.task, assigneeId: activeModal.task.assigneeId?._id || activeModal.task.assigneeId || '' })
      setErrors({})
    } else if (isCreate) {
      setForm({ ...EMPTY_FORM, status: activeModal?.defaultStatus || 'not_started' })
      setErrors({})
    } else if (isView && activeModal.task) {
      setForm({ ...EMPTY_FORM, ...activeModal.task, assigneeId: activeModal.task.assigneeId?._id || activeModal.task.assigneeId || '' })
    }
  }, [activeModal, isCreate, isEdit, isView])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  function validate() {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.assigneeId) e.assigneeId = 'Please assign to someone'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    isEdit ? updateTask({ ...form, id: form.id || form._id }) : createTask(form)
    closeModal()
  }

  const modalTitle = isCreate ? 'Create Task' : isEdit ? 'Edit Task' : 'Task Details'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-[#15121b]/45 backdrop-blur-xl" onClick={closeModal} />

          <motion.div
            className="relative w-full max-w-2xl overflow-hidden rounded-[30px] border border-white/70 bg-white/90 shadow-[0_32px_90px_rgba(20,15,31,0.28)] backdrop-blur-2xl"
            initial={{ scale: 0.98, y: 14, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.98, y: 14, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between border-b border-accent-ink/8 bg-gradient-to-r from-white via-[#f8f3ff] to-[#effdf8] px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-ink/38">TaskFlow</p>
                <h2 className="text-xl font-bold tracking-tight text-accent-ink">{modalTitle}</h2>
              </div>
              <button
                onClick={closeModal}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-ink/5 text-accent-ink/55 transition hover:bg-accent-ink hover:text-white"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto px-6 py-6 custom-scrollbar">
              {isView ? <ViewContent task={{ ...form, assigneeId: activeModal.task.assigneeId }} /> : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Field label="Title" error={errors.title} required>
                    <input
                      className="field-input"
                      placeholder="What needs to be done?"
                      value={form.title}
                      onChange={e => set('title', e.target.value)}
                    />
                  </Field>

                  <Field label="Description">
                    <textarea
                      className="field-input min-h-[112px] resize-none"
                      placeholder="Add more context..."
                      value={form.description}
                      onChange={e => set('description', e.target.value)}
                    />
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Assignee" error={errors.assigneeId} required>
                      <StyledSelect value={form.assigneeId} onChange={v => set('assigneeId', v)} placeholder="Assign to...">
                        {users.map(u => <option key={u.id || u._id} value={u.id || u._id}>{u.name}</option>)}
                      </StyledSelect>
                    </Field>
                    <Field label="Status">
                      <StyledSelect value={form.status} onChange={v => set('status', v)}>
                        {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                      </StyledSelect>
                    </Field>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
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
                    <Field label="Deadline" error={errors.deadline}>
                      <input
                        type="date"
                        className="field-input [color-scheme:light]"
                        value={form.deadline ? form.deadline.split('T')[0] : ''}
                        onChange={e => set('deadline', e.target.value)}
                      />
                    </Field>
                  </div>

                  <div className="flex flex-col-reverse gap-3 border-t border-accent-ink/8 pt-5 sm:flex-row">
                    <button type="button" onClick={closeModal} className="h-12 flex-1 rounded-2xl border border-accent-ink/10 bg-white text-sm font-bold text-accent-ink/60 transition hover:bg-accent-ink/5">
                      Cancel
                    </button>
                    <button type="submit" className="h-12 flex-1 rounded-2xl bg-accent-ink text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#2c2636]">
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
      <select value={value} onChange={e => onChange(e.target.value)} className="field-input appearance-none pr-10">
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {children}
      </select>
      <ChevronDown size={15} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-accent-ink/40" />
    </div>
  )
}

function Field({ label, children, error, required }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-accent-ink/42">
        {label} {required && <span className="text-accent-coral">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs font-semibold text-red-500">{error}</p>}
    </div>
  )
}

function ViewContent({ task }) {
  const { deleteTask, openModal, closeModal } = useTasks()
  const priorityColor = { high: 'text-red-600 bg-red-50 border-red-100', medium: 'text-amber-700 bg-amber-50 border-amber-100', low: 'text-emerald-700 bg-emerald-50 border-emerald-100' }[task.priority]
  const statusColor = { not_started: 'text-slate-600 bg-slate-50 border-slate-100', in_progress: 'text-blue-700 bg-blue-50 border-blue-100', completed: 'text-emerald-700 bg-emerald-50 border-emerald-100' }[task.status]
  const statusLabel = { not_started: 'Not Started', in_progress: 'In Progress', completed: 'Completed' }[task.status]
  const priorityLabel = { high: 'High', medium: 'Medium', low: 'Low' }[task.priority]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold leading-tight text-accent-ink text-balance">{task.title}</h3>
        {task.description && <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-accent-ink/55">{task.description}</p>}
      </div>

      <div className="grid gap-3 rounded-[26px] border border-accent-ink/8 bg-accent-ink/[0.035] p-4 sm:grid-cols-2">
        <InfoRow label="Status">
          <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusColor}`}>{statusLabel}</span>
        </InfoRow>
        <InfoRow label="Priority">
          <span className={`rounded-full border px-3 py-1 text-xs font-bold ${priorityColor}`}>{priorityLabel}</span>
        </InfoRow>
        <InfoRow label="Assignee">
          <Avatar userObj={task.assigneeId} userId={task.assigneeId?._id || task.assigneeId} size="sm" showName />
        </InfoRow>
        <InfoRow label="Deadline">
          <span className="font-mono text-sm font-semibold text-accent-ink/70">{task.deadline ? task.deadline.split('T')[0] : '-'}</span>
        </InfoRow>
        {task.tag && (
          <InfoRow label="Tag">
            <span className="text-sm font-bold text-accent-ink/72">{task.tag}</span>
          </InfoRow>
        )}
      </div>

      <div className="flex flex-col gap-3 pt-1 sm:flex-row">
        <button onClick={() => openModal({ type: 'edit', task })} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-accent-ink text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#2c2636]">
          <Pencil size={16} /> Edit Task
        </button>
        <button onClick={() => { deleteTask(task.id || task._id); closeModal() }} className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 text-sm font-bold text-red-600 transition hover:bg-red-100">
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  )
}

function InfoRow({ label, children }) {
  return (
    <div className="rounded-2xl bg-white/70 p-3">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-accent-ink/38">{label}</p>
      {children}
    </div>
  )
}
