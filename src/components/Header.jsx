import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, Plus, X, Layers, LogOut, Users, Settings } from 'lucide-react'
import { useTasks } from '../context/TaskContext'
import TeamModal from './TeamModal'

export default function Header({ handleLogout }) {
  const { tasks, users, filter, setFilter, openModal } = useTasks()
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const stats = {
    total:       tasks.length,
    not_started: tasks.filter(t => t.status === 'not_started').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed:   tasks.filter(t => t.status === 'completed').length,
  }

  const hasActiveFilter = filter.assignee !== 'all' || filter.priority !== 'all' || filter.search

  return (
    <header className="shrink-0 bg-surface-1 border-b border-border">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-6 py-4">
        {/* Brand */}
        <div className="flex items-center gap-3 mr-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent-blue/10 border border-accent-blue/20">
            <Layers size={18} className="text-accent-blue" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-white">TaskFlow</h1>
          </div>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm ml-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input
            className="w-full bg-surface-2 border border-border rounded-lg pl-9 pr-8 py-2 text-sm text-gray-200 outline-none focus:border-accent-blue transition-colors"
            placeholder="Search tasks…"
            value={filter.search}
            onChange={e => setFilter({ search: e.target.value })}
          />
          {filter.search && (
            <button onClick={() => setFilter({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {/* Filter button */}
          <button
            onClick={() => setShowFilters(s => !s)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${showFilters || hasActiveFilter ? 'bg-accent-blue/10 border-accent-blue/30 text-accent-blue' : 'bg-surface-2 border-border text-gray-300 hover:text-white'}`}
          >
            <SlidersHorizontal size={16} />
            Filter
            {hasActiveFilter && <span className="w-1.5 h-1.5 rounded-full bg-accent-blue" />}
          </button>

          {/* New task */}
          <button
            onClick={() => openModal('create')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white text-surface-0 hover:bg-gray-200 transition-colors"
          >
            <Plus size={16} />
            New Task
          </button>
          
          <div className="w-px h-6 bg-border mx-1"></div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-surface-2 transition-colors"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Stats + avatars */}
      <div className="flex items-center gap-6 px-6 py-3 border-t border-border/50 bg-surface-0/50">
        <StatPill label="Total"       value={stats.total}       color="#a1a1aa" />
        <StatPill label="Not Started" value={stats.not_started} color="#71717a" />
        <StatPill label="In Progress" value={stats.in_progress} color="#3b82f6" />
        <StatPill label="Done"        value={stats.completed}   color="#10b981" />

        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-gray-500 font-medium">Team</span>
          <div className="flex -space-x-2 overflow-hidden px-1">
            {users.slice(0, 10).map(u => (
              <div key={u.id} title={u.name}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium border-2 border-surface-1"
                style={{ background: u.color + '33', color: u.color }}>
                {u.initials || (u.name ? u.name.substring(0, 2).toUpperCase() : '??')}
              </div>
            ))}
            {users.length > 10 && (
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium bg-surface-2 text-gray-400 border-2 border-surface-1">
                +{users.length - 10}
              </div>
            )}
            <button onClick={() => setIsTeamModalOpen(true)}
              className="w-7 h-7 rounded-full flex items-center justify-center bg-surface-2 text-gray-400 hover:text-gray-200 hover:bg-surface-3 transition-colors border-2 border-surface-1"
              title="Manage Team">
              <Settings size={12} />
            </button>
          </div>
        </div>
      </div>

      <TeamModal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} />

      {/* Filter panel */}
      <motion.div
        initial={false}
        animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="px-6 py-4 flex flex-wrap items-center gap-3 bg-surface-2/30 border-t border-border">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">
            Assignee
          </span>
          <FilterChip active={filter.assignee === 'all'} onClick={() => setFilter({ assignee: 'all' })} color="#a1a1aa">
            Everyone
          </FilterChip>
          {users.map(u => (
            <FilterChip key={u.id} active={filter.assignee === u.id}
              onClick={() => setFilter({ assignee: filter.assignee === u.id ? 'all' : u.id })} color={u.color}>
              {u.name.split(' ')[0]}
            </FilterChip>
          ))}

          <div className="w-px h-5 mx-2 bg-border" />

          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">
            Priority
          </span>
          {[
            { id: 'all',    label: 'All',    color: '#a1a1aa' },
            { id: 'high',   label: 'High',   color: '#ef4444' },
            { id: 'medium', label: 'Medium', color: '#f59e0b' },
            { id: 'low',    label: 'Low',    color: '#3b82f6' },
          ].map(p => (
            <FilterChip key={p.id} active={filter.priority === p.id}
              onClick={() => setFilter({ priority: filter.priority === p.id ? 'all' : p.id })} color={p.color}>
              {p.label}
            </FilterChip>
          ))}

          {hasActiveFilter && (
            <button
              onClick={() => setFilter({ assignee: 'all', priority: 'all', search: '' })}
              className="ml-auto flex items-center gap-1.5 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </motion.div>
    </header>
  )
}

function StatPill({ label, value, color }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-semibold font-mono" style={{ color }}>{value}</span>
    </div>
  )
}

function FilterChip({ children, active, onClick, color }) {
  return (
    <button onClick={onClick}
      className={`text-sm px-3 py-1.5 rounded-full font-medium transition-all border ${active ? 'bg-opacity-10' : 'bg-surface-3 border-transparent text-gray-400 hover:text-white'}`}
      style={active ? { color, background: color + '1a', borderColor: color + '40' } : {}}
    >
      {children}
    </button>
  )
}
