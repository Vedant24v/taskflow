import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, UserPlus, ArrowLeft } from 'lucide-react'
import { useTasks } from '../context/TaskContext'
import Avatar from './Avatar'

export default function TeamModal({ isOpen, onClose }) {
  const { users, addUser, deleteUser } = useTasks()
  const [isAdding, setIsAdding] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', role: '', password: '' })
  const [error, setError] = useState('')

  const handleAddUser = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await addUser(form)
      setIsAdding(false)
      setForm({ name: '', email: '', role: '', password: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add user')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#15121b]/45 backdrop-blur-xl"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[30px] border border-white/70 bg-white/90 shadow-[0_32px_90px_rgba(20,15,31,0.28)] backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-accent-ink/8 bg-gradient-to-r from-white via-[#f8f3ff] to-[#effdf8] px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-ink/38">Workspace</p>
                <h2 className="text-xl font-bold tracking-tight text-accent-ink">{isAdding ? 'Add Member' : 'Manage Team'}</h2>
              </div>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-ink/5 text-accent-ink/55 transition hover:bg-accent-ink hover:text-white"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-600">
                  {error}
                </div>
              )}

              {!isAdding ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-accent-ink/55">Current Members ({users.length})</span>
                    <button
                      onClick={() => setIsAdding(true)}
                      className="flex h-10 items-center gap-2 rounded-2xl bg-accent-ink px-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#2c2636]"
                    >
                      <UserPlus size={15} /> Add
                    </button>
                  </div>

                  <div className="custom-scrollbar max-h-72 space-y-2 overflow-y-auto pr-1">
                    {users.map(u => (
                      <div key={u.id || u._id} className="flex items-center justify-between rounded-2xl border border-accent-ink/8 bg-accent-ink/[0.035] p-3">
                        <Avatar userObj={u} userId={u.id || u._id} size="md" showName showRole />
                        <button
                          onClick={() => deleteUser(u.id || u._id)}
                          className="flex h-10 w-10 items-center justify-center rounded-2xl text-accent-ink/38 transition hover:bg-red-50 hover:text-red-500"
                          title="Remove user"
                          aria-label="Remove user"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAddUser} className="space-y-4">
                  <Field label="Full Name">
                    <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="field-input" />
                  </Field>
                  <Field label="Email">
                    <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="field-input" />
                  </Field>
                  <Field label="Role">
                    <input required type="text" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="e.g. Frontend Dev" className="field-input" />
                  </Field>
                  <Field label="Password">
                    <input required type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="field-input" />
                  </Field>

                  <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                    <button type="button" onClick={() => setIsAdding(false)} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-accent-ink/10 bg-white text-sm font-bold text-accent-ink/60 transition hover:bg-accent-ink/5">
                      <ArrowLeft size={15} /> Back
                    </button>
                    <button type="submit" className="h-12 flex-1 rounded-2xl bg-accent-ink text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#2c2636]">
                      Add Member
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-accent-ink/42">{label}</label>
      {children}
    </div>
  )
}
