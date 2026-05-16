import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, Plus, X, Layers, LogOut, Users, Sparkles } from 'lucide-react'
import { useTasks } from '../context/TaskContext'
import TeamModal from './TeamModal'

export default function Header({ handleLogout }) {
  const { tasks, users, filter, setFilter, openModal } = useTasks()
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const stats = {
    total: tasks.length,
    not_started: tasks.filter(t => t.status === 'not_started').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }

  const hasActiveFilter = filter.assignee !== 'all' || filter.priority !== 'all' || filter.search

  return (
    <header className="mx-auto w-full max-w-[1420px] shrink-0">
      <div className="graphite-panel rounded-[26px] px-4 py-4 text-white sm:px-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-accent-ink shadow-lg">
              <Layers size={21} />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-accent-mint ring-2 ring-[#4f4c54]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-xl font-bold tracking-tight">TaskFlow</h1>
                <span className="hidden rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white/70 sm:inline-flex">
                  Live Board
                </span>
              </div>
              <p className="truncate text-xs font-medium text-white/48">
                {stats.total} tasks across {users.length} teammates
              </p>
            </div>
          </div>

          <div className="relative min-w-[220px] flex-1 xl:max-w-xl">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/42" />
            <input
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.08] pl-11 pr-10 text-sm text-white outline-none transition focus:border-white/30 focus:bg-white/[0.13] placeholder:text-white/38"
              placeholder="Search tasks..."
              value={filter.search}
              onChange={e => setFilter({ search: e.target.value })}
            />
            {filter.search && (
              <button
                onClick={() => setFilter({ search: '' })}
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 xl:justify-end">
            <button
              onClick={() => setShowFilters(s => !s)}
              className={`flex h-11 items-center gap-2 rounded-2xl border px-3.5 text-sm font-semibold transition ${showFilters || hasActiveFilter ? 'border-accent-mint/60 bg-accent-mint/20 text-white' : 'border-white/10 bg-white/[0.08] text-white/70 hover:bg-white/[0.14] hover:text-white'}`}
            >
              <SlidersHorizontal size={16} />
              Filters
              {hasActiveFilter && <span className="h-1.5 w-1.5 rounded-full bg-accent-mint" />}
            </button>

            <button
              onClick={() => setIsTeamModalOpen(true)}
              className="flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.08] px-3.5 text-sm font-semibold text-white/70 transition hover:bg-white/[0.14] hover:text-white"
            >
              <Users size={16} />
              Team
            </button>

            <button
              onClick={() => openModal({ type: 'create' })}
              className="flex h-11 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-bold text-accent-ink shadow-lg transition hover:-translate-y-0.5 hover:bg-[#f6f1ff]"
            >
              <Plus size={17} />
              New Task
            </button>

            <button
              onClick={handleLogout}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-white/60 transition hover:bg-white/[0.14] hover:text-white"
              title="Log out"
              aria-label="Log out"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-2 border-t border-white/10 pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatPill label="Total" value={stats.total} color="#ffffff" iconColor="#bda5ff" />
          <StatPill label="Queued" value={stats.not_started} color="#d6d3df" iconColor="#94a3b8" />
          <StatPill label="In motion" value={stats.in_progress} color="#dff7ff" iconColor="#4f8ef7" />
          <StatPill label="Shipped" value={stats.completed} color="#dffcf4" iconColor="#62dcbf" />
        </div>

        <motion.div
          initial={false}
          animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-3xl border border-white/10 bg-white/[0.08] p-3">
            <span className="flex items-center gap-1.5 px-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/42">
              <Sparkles size={13} />
              Assignee
            </span>
            <FilterChip active={filter.assignee === 'all'} onClick={() => setFilter({ assignee: 'all' })} color="#ffffff">
              Everyone
            </FilterChip>
            {users.map(u => (
              <FilterChip
                key={u.id || u._id}
                active={filter.assignee === (u.id || u._id)}
                onClick={() => setFilter({ assignee: filter.assignee === (u.id || u._id) ? 'all' : (u.id || u._id) })}
                color={u.color || '#8b5cf6'}
              >
                {u.name.split(' ')[0]}
              </FilterChip>
            ))}

            <div className="hidden h-5 w-px bg-white/12 sm:block" />

            <span className="px-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/42">Priority</span>
            {[
              { id: 'all', label: 'All', color: '#ffffff' },
              { id: 'high', label: 'High', color: '#ff6f61' },
              { id: 'medium', label: 'Medium', color: '#f7b955' },
              { id: 'low', label: 'Low', color: '#62dcbf' },
            ].map(p => (
              <FilterChip
                key={p.id}
                active={filter.priority === p.id}
                onClick={() => setFilter({ priority: filter.priority === p.id ? 'all' : p.id })}
                color={p.color}
              >
                {p.label}
              </FilterChip>
            ))}

            {hasActiveFilter && (
              <button
                onClick={() => setFilter({ assignee: 'all', priority: 'all', search: '' })}
                className="ml-auto flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-white/62 transition hover:bg-white/10 hover:text-white"
              >
                <X size={14} /> Clear
              </button>
            )}
          </div>
        </motion.div>
      </div>

      <TeamModal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} />
    </header>
  )
}

function StatPill({ label, value, color, iconColor }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.075] px-3 py-2.5">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ background: iconColor }} />
        <span className="text-sm font-medium text-white/58">{label}</span>
      </div>
      <span className="font-mono text-sm font-semibold" style={{ color }}>{value}</span>
    </div>
  )
}

function FilterChip({ children, active, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className={`h-9 rounded-full border px-3 text-sm font-semibold transition ${active ? 'bg-white text-accent-ink shadow-sm' : 'border-white/10 bg-white/[0.08] text-white/62 hover:bg-white/[0.14] hover:text-white'}`}
      style={active ? { borderColor: color, boxShadow: `0 0 0 3px ${color}22` } : {}}
    >
      {children}
    </button>
  )
}
