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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col flex-shrink-0 w-80"
    >
      {/* Column header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: column.color }} />
          <h3 className="text-sm font-semibold text-gray-300">
            {column.label}
          </h3>
          <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-surface-2 text-gray-400 ml-1">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => openModal({ type: 'create', defaultStatus: column.id })}
          className="w-7 h-7 rounded-md flex items-center justify-center text-gray-500 hover:text-gray-200 hover:bg-surface-2 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 flex flex-col gap-3 rounded-xl p-3 transition-colors ${isOver ? 'bg-surface-2/50 border border-border' : 'bg-surface-0/30 border border-transparent'}`}
        style={{ minHeight: 150 }}
      >
        <SortableContext items={tasks.filter(Boolean).map(t => t.id || t._id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence>
            {tasks.filter(Boolean).map(task => <TaskCard key={task.id || task._id} task={task} />)}
          </AnimatePresence>
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 py-8 opacity-50">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-dashed border-gray-600 mb-3">
              <Plus size={18} className="text-gray-500" />
            </div>
            <p className="text-xs text-gray-500">Drop tasks here</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
