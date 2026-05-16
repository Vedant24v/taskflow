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
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
      className="flex h-full w-[min(86vw,360px)] shrink-0 flex-col"
    >
      <div className="mb-3 flex items-center justify-between rounded-[24px] border border-white/65 bg-white/58 px-4 py-3 shadow-[0_18px_50px_rgba(39,27,67,0.09)] backdrop-blur-2xl">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full shadow-[0_0_0_5px_rgba(255,255,255,0.65)]" style={{ background: column.color }} />
            <h3 className="truncate text-sm font-bold text-accent-ink">{column.label}</h3>
          </div>
          <p className="mt-0.5 text-xs font-medium text-accent-ink/45">{tasks.length} active</p>
        </div>

        <button
          onClick={() => openModal({ type: 'create', defaultStatus: column.id })}
          className="flex h-9 w-9 items-center justify-center rounded-2xl bg-accent-ink text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#2c2636]"
          title={`Add task to ${column.label}`}
          aria-label={`Add task to ${column.label}`}
        >
          <Plus size={17} />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={`custom-scrollbar min-h-[220px] flex-1 overflow-y-auto rounded-[28px] border p-3 transition ${isOver ? 'border-accent-violet/35 bg-white/78 shadow-soft' : 'border-white/55 bg-white/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-2xl'}`}
      >
        <SortableContext items={tasks.filter(Boolean).map(t => t.id || t._id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {tasks.filter(Boolean).map(task => <TaskCard key={task.id || task._id} task={task} />)}
            </AnimatePresence>
          </div>
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex min-h-[180px] flex-col items-center justify-center rounded-[22px] border border-dashed border-accent-ink/14 bg-white/34 py-8 text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-accent-ink shadow-sm">
              <Plus size={18} />
            </div>
            <p className="text-xs font-semibold text-accent-ink/42">Drop tasks here</p>
          </div>
        )}
      </div>
    </motion.section>
  )
}
