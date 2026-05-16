import React from 'react'
import { motion } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Calendar, GripVertical, Trash2, Pencil, Eye, Flag } from 'lucide-react'
import Avatar from './Avatar'
import { formatDeadline, getDeadlineStatus, getPriorityConfig, TAG_COLORS } from '../utils/helpers'
import { useTasks } from '../context/TaskContext'

export default function TaskCard({ task }) {
  const { deleteTask, openModal } = useTasks()
  if (!task) return null

  const taskId = task.id || task._id
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: taskId })

  const dndStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
    zIndex: isDragging ? 50 : 'auto',
  }

  const deadlineLabel = task.deadline ? formatDeadline(task.deadline) : null
  const deadlineStatus = task.deadline ? getDeadlineStatus(task.deadline) : 'none'
  const priority = getPriorityConfig(task.priority)
  const tagColor = TAG_COLORS[task.tag] || TAG_COLORS.Other

  const deadlineStyle = {
    overdue: 'border-red-200 bg-red-50 text-red-600',
    urgent: 'border-amber-200 bg-amber-50 text-amber-700',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-700',
    ok: 'border-slate-200 bg-slate-50 text-slate-500',
    none: 'border-slate-200 bg-slate-50 text-slate-500',
  }[deadlineStatus]

  return (
    <motion.article
      ref={setNodeRef}
      style={dndStyle}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.16 }}
      className="group relative overflow-hidden rounded-[24px] border border-white/80 bg-white/82 p-4 shadow-[0_18px_38px_rgba(35,28,54,0.10)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-white hover:shadow-[0_24px_52px_rgba(35,28,54,0.16)]"
    >
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, ${tagColor.text}, ${priority.color})` }} />

      <button
        {...attributes}
        {...listeners}
        className="absolute left-2 top-4 flex h-7 w-6 cursor-grab items-center justify-center rounded-xl text-accent-ink/20 opacity-0 transition hover:bg-accent-ink/5 hover:text-accent-ink/55 group-hover:opacity-100 active:cursor-grabbing"
        aria-label="Drag task"
      >
        <GripVertical size={16} />
      </button>

      <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition group-hover:opacity-100">
        <ActionBtn onClick={() => openModal({ type: 'view', task })} label="View task"><Eye size={14} /></ActionBtn>
        <ActionBtn onClick={() => openModal({ type: 'edit', task })} label="Edit task"><Pencil size={14} /></ActionBtn>
        <ActionBtn onClick={() => deleteTask(taskId)} label="Delete task" danger><Trash2 size={14} /></ActionBtn>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 pl-3 pr-20">
        {task.tag && (
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-bold"
            style={{ color: tagColor.text, background: tagColor.bg }}
          >
            {task.tag}
          </span>
        )}
        <span className="flex items-center gap-1.5 rounded-full border border-accent-ink/10 bg-accent-ink/[0.035] px-2.5 py-1 text-[11px] font-bold text-accent-ink/62">
          <Flag size={11} style={{ color: priority.color }} />
          {priority.label}
        </span>
      </div>

      <h4 className="pl-3 pr-3 text-[15px] font-bold leading-snug text-accent-ink text-balance">
        {task.title}
      </h4>

      {task.description && (
        <p className="mt-2 line-clamp-2 pl-3 pr-3 text-xs leading-relaxed text-accent-ink/48">
          {task.description}
        </p>
      )}

      <div className="mt-5 flex items-center justify-between gap-3 pl-3">
        <Avatar userObj={task.assigneeId} userId={task.assigneeId?._id || task.assigneeId} size="sm" />
        {deadlineLabel && (
          <div className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${deadlineStyle}`}>
            <Calendar size={12} />
            {deadlineLabel}
          </div>
        )}
      </div>
    </motion.article>
  )
}

function ActionBtn({ onClick, children, danger, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-full border border-accent-ink/8 bg-white/90 shadow-sm transition ${danger ? 'text-accent-ink/42 hover:bg-red-50 hover:text-red-500' : 'text-accent-ink/45 hover:bg-accent-ink hover:text-white'}`}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  )
}
