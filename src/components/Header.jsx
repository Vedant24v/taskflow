import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { LayoutGrid, Search, SlidersHorizontal, Plus, X, Zap } from 'lucide-react'
import { useTasks } from '../context/TaskContext'
import { USERS } from '../data/mockData'

export default function Header() {
  const { tasks, filter, setFilter, openModal } = useTasks()
  const [showFilters, setShowFilters] = useState(false)

  const stats = {
    total:       tasks.length,
    not_started: tasks.filter(t => t.status === 'not_started').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed:   tasks.filter(t => t.status === 'completed').length,
  }

  const hasActiveFilter = filter.assignee !== 'all' || filter.priority !== 'all' || filter.search

  return (
    <header className="shrink-0" style={{ background: '#0d0d14', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      {/* Top bar */}
      <div className="flex items-center gap-4 px-7 py-4">
        {/* Brand */}
        <div className="flex items-center gap-3 mr-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #4f8ef7, #a78bfa)' }}>
            <Zap size={16} className="text-white" fill="white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight leading-none">TaskFlow</h1>
            <p className="text-[11px] mt-0.5" style={{ color: 'rgba(221,225,240,0.35)', fontFamily: 'JetBrains Mono, monospace' }}>
              sprint board
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'rgba(221,225,240,0.35)' }} />
          <input
            className="input-dark pl-10 pr-10"
            style={{ background: '#1a1a26', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px 10px 38px', fontSize: 14, color: '#dde1f0', outline: 'none', width: '100%' }}
            placeholder="Search tasks…"
            value={filter.search}
            onChange={e => setFilter({ search: e.target.value })}
          />
          {filter.search && (
            <button onClick={() => setFilter({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-white transition-colors"
              style={{ color: 'rgba(221,225,240,0.4)' }}>
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Filter button */}
          <button
            onClick={() => setShowFilters(s => !s)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={showFilters || hasActiveFilter
              ? { color: '#4f8ef7', background: 'rgba(79,142,247,0.12)', border: '1.5px solid rgba(79,142,247,0.35)' }
              : { color: 'rgba(221,225,240,0.55)', background: '#1a1a26', border: '1.5px solid rgba(255,255,255,0.1)' }
            }
          >
            <SlidersHorizontal size={14} />
            Filter
            {hasActiveFilter && <span className="w-2 h-2 rounded-full bg-blue-400" />}
          </button>

          {/* New task */}
          <button
            onClick={() => openModal('create')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #4f8ef7, #7b6cf6)' }}
          >
            <Plus size={15} />
            New Task
          </button>
        </div>
      </div>

      {/* Stats + avatars */}
      <div className="flex items-center gap-7 px-7 py-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <StatPill label="Total"       value={stats.total}       color="#94a3b8" />
        <StatPill label="Not Started" value={stats.not_started} color="#64748b" />
        <StatPill label="In Progress" value={stats.in_progress} color="#4f8ef7" />
        <StatPill label="Done"        value={stats.completed}   color="#34d399" />

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs mr-1" style={{ color: 'rgba(221,225,240,0.3)' }}>Team</span>
          <div className="flex -space-x-2">
            {USERS.map(u => (
              <div key={u.id} title={u.name}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ring-2"
                style={{ background: u.color + '22', color: u.color, border: `1.5px solid ${u.color}50`, ringColor: '#0d0d14' }}>
                {u.initials}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter panel */}
      <motion.div
        initial={false}
        animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="px-7 py-4 flex flex-wrap items-center gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(221,225,240,0.3)' }}>
            Assignee
          </span>
          <FilterChip active={filter.assignee === 'all'} onClick={() => setFilter({ assignee: 'all' })} color="#94a3b8">
            Everyone
          </FilterChip>
          {USERS.map(u => (
            <FilterChip key={u.id} active={filter.assignee === u.id}
              onClick={() => setFilter({ assignee: filter.assignee === u.id ? 'all' : u.id })} color={u.color}>
              {u.name.split(' ')[0]}
            </FilterChip>
          ))}

          <div className="w-px h-5 mx-1" style={{ background: 'rgba(255,255,255,0.1)' }} />

          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(221,225,240,0.3)' }}>
            Priority
          </span>
          {[
            { id: 'all',    label: 'All',    color: '#94a3b8' },
            { id: 'high',   label: 'High',   color: '#f87171' },
            { id: 'medium', label: 'Medium', color: '#fbbf24' },
            { id: 'low',    label: 'Low',    color: '#64748b' },
          ].map(p => (
            <FilterChip key={p.id} active={filter.priority === p.id}
              onClick={() => setFilter({ priority: filter.priority === p.id ? 'all' : p.id })} color={p.color}>
              {p.label}
            </FilterChip>
          ))}

          {hasActiveFilter && (
            <button
              onClick={() => setFilter({ assignee: 'all', priority: 'all', search: '' })}
              className="ml-auto flex items-center gap-1.5 text-sm font-semibold transition-colors"
              style={{ color: 'rgba(248,113,113,0.7)' }}
              onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(248,113,113,0.7)'}
            >
              <X size={13} /> Clear filters
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
      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      <span className="text-sm" style={{ color: 'rgba(221,225,240,0.4)' }}>{label}</span>
      <span className="text-sm font-bold" style={{ color, fontFamily: 'JetBrains Mono, monospace' }}>{value}</span>
    </div>
  )
}

function FilterChip({ children, active, onClick, color }) {
  return (
    <button onClick={onClick}
      className="text-sm px-3 py-1.5 rounded-full font-semibold transition-all"
      style={active
        ? { color, background: color + '1a', border: `1.5px solid ${color}55` }
        : { color: 'rgba(221,225,240,0.4)', background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)' }
      }
    >
      {children}
    </button>
  )
}
