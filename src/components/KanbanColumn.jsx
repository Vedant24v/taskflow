import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import TaskCard from './TaskCard'
import { useTasks } from '../context/TaskContext'

export default function KanbanColumn({ column, tasks }) {
  const { openModal } = useTasks()
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col flex-shrink-0"
      style={{ width: 320 }}
    >
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full"
            style={{ background: column.color, boxShadow: `0 0 10px ${column.color}70` }} />
          <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'rgba(221,225,240,0.65)' }}>
            {column.label}
          </h3>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ color: column.color, background: column.accent, fontFamily: 'JetBrains Mono, monospace' }}>
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => openModal({ type: 'create', defaultStatus: column.id })}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
          style={{ color: 'rgba(221,225,240,0.3)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          onMouseEnter={e => { e.currentTarget.style.color = column.color; e.currentTarget.style.background = column.accent }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(221,225,240,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className="flex-1 flex flex-col gap-3 rounded-2xl p-2.5 transition-all duration-200"
        style={{
          minHeight: 140,
          background: isOver ? `${column.color}0a` : 'rgba(255,255,255,0.018)',
          border: `1px solid ${isOver ? column.color + '40' : 'rgba(255,255,255,0.06)'}`,
        }}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence>
            {tasks.map(task => <TaskCard key={task.id} task={task} />)}
          </AnimatePresence>
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 py-10 gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: column.accent }}>
              <Plus size={20} style={{ color: column.color, opacity: 0.6 }} />
            </div>
            <p className="text-sm" style={{ color: 'rgba(221,225,240,0.25)' }}>No tasks yet</p>
            <button
              onClick={() => openModal({ type: 'create', defaultStatus: column.id })}
              className="text-xs font-semibold transition-colors"
              style={{ color: column.color + '80' }}
              onMouseEnter={e => e.currentTarget.style.color = column.color}
              onMouseLeave={e => e.currentTarget.style.color = column.color + '80'}
            >
              + Add task
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
