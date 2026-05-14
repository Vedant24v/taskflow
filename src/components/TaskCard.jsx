import React from 'react'
import { motion } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Calendar, GripVertical, Trash2, Pencil, Eye } from 'lucide-react'
import Avatar from './Avatar'
import { formatDeadline, getDeadlineStatus, getPriorityConfig, TAG_COLORS } from '../utils/helpers'
import { useTasks } from '../context/TaskContext'

export default function TaskCard({ task }) {
  const { deleteTask, openModal } = useTasks()
  if (!task) return null;
  const taskId = task.id || task._id;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: taskId })

  const dndStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 'auto',
  }

  const deadlineLabel  = task.deadline ? formatDeadline(task.deadline) : null
  const deadlineStatus = task.deadline ? getDeadlineStatus(task.deadline) : 'none'
  const priority       = getPriorityConfig(task.priority)
  
  // Minimalist tag colors instead of vibrant neon
  const tagColors = {
    Frontend: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
    Backend:  { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
    Design:   { bg: 'bg-purple-500/10', text: 'text-purple-400' },
    QA:       { bg: 'bg-amber-500/10', text: 'text-amber-400' },
    DevOps:   { bg: 'bg-rose-500/10', text: 'text-rose-400' },
    Other:    { bg: 'bg-gray-500/10', text: 'text-gray-400' }
  }
  const tColor = tagColors[task.tag] || tagColors.Other

  const dlColorMap = { overdue: 'text-red-400', urgent: 'text-amber-400', warning: 'text-yellow-400', ok: 'text-gray-500', none: 'text-gray-500' }

  return (
    <motion.div
      ref={setNodeRef}
      style={dndStyle}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.15 }}
      className="group relative bg-surface-1 border border-border rounded-xl p-4 cursor-default hover:bg-surface-2 transition-colors select-none"
    >
      {/* Drag handle */}
      <div {...attributes} {...listeners}
        className="absolute left-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300">
        <GripVertical size={16} />
      </div>

      {/* Action buttons */}
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <ActionBtn onClick={() => openModal({ type: 'view', task })}><Eye size={14} /></ActionBtn>
        <ActionBtn onClick={() => openModal({ type: 'edit', task })}><Pencil size={14} /></ActionBtn>
        <ActionBtn onClick={() => deleteTask(taskId)} danger><Trash2 size={14} /></ActionBtn>
      </div>

      {/* Tag + Priority */}
      <div className="flex items-center gap-2 mb-3 pl-4">
        {task.tag && (
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${tColor.bg} ${tColor.text}`}>
            {task.tag}
          </span>
        )}
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1.5 bg-surface-3 text-gray-300 border border-border">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: priority.color }} />
          {priority.label}
        </span>
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-gray-200 leading-snug mb-2 pl-4 pr-14">
        {task.title}
      </p>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-500 leading-relaxed mb-4 pl-4 line-clamp-2 pr-2">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pl-4 mt-2">
        <Avatar userObj={task.assigneeId} userId={task.assigneeId?._id || task.assigneeId} size="sm" />
        {deadlineLabel && (
          <div className={`flex items-center gap-1.5 text-xs font-medium ${dlColorMap[deadlineStatus]}`}>
            <Calendar size={12} />
            {deadlineLabel}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function ActionBtn({ onClick, children, danger }) {
  return (
    <button onClick={onClick}
      className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${danger ? 'text-gray-400 hover:text-red-400 hover:bg-red-400/10' : 'text-gray-400 hover:text-gray-200 hover:bg-surface-3'}`}
    >
      {children}
    </button>
  )
}
