import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, UserPlus } from 'lucide-react'
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

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-surface-1 border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="text-lg font-semibold text-gray-200">Manage Team</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-5">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {!isAdding ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-400">Current Members ({users.length})</span>
                  <button onClick={() => setIsAdding(true)}
                    className="flex items-center gap-1.5 text-xs font-medium bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-500/20 transition-colors"
                  >
                    <UserPlus size={14} /> Add Member
                  </button>
                </div>
                
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                  {users.map(u => (
                    <div key={u.id || u._id} className="flex items-center justify-between p-3 rounded-lg bg-surface-2 border border-border">
                      <div className="flex items-center gap-3">
                        <Avatar userObj={u} userId={u.id || u._id} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-gray-200">{u.name}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                      </div>
                      <button onClick={() => deleteUser(u.id || u._id)}
                        className="text-gray-500 hover:text-red-400 p-2 rounded-md hover:bg-surface-3 transition-colors"
                        title="Remove User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name</label>
                  <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gray-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
                  <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gray-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Role</label>
                  <input required type="text" value={form.role} onChange={e => setForm({...form, role: e.target.value})} placeholder="e.g. Frontend Dev"
                    className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gray-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
                  <input required type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                    className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-gray-500" />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsAdding(false)}
                    className="flex-1 py-2 text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-surface-2 rounded-lg transition-colors">
                    Cancel
                  </button>
                  <button type="submit"
                    className="flex-1 py-2 text-sm font-medium bg-gray-200 text-surface-0 hover:bg-white rounded-lg transition-colors">
                    Add User
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
