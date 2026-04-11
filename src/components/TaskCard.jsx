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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  const dndStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 50 : 'auto',
  }

  const deadlineLabel  = formatDeadline(task.deadline)
  const deadlineStatus = getDeadlineStatus(task.deadline)
  const priority       = getPriorityConfig(task.priority)
  const tagColor       = TAG_COLORS[task.tag] || TAG_COLORS.Other

  const deadlineColorMap = {
    overdue: '#f87171',
    urgent:  '#fbbf24',
    warning: '#fde68a',
    ok:      'rgba(221,225,240,0.38)',
    none:    'rgba(221,225,240,0.38)',
  }
  const dlColor = deadlineColorMap[deadlineStatus]

  return (
    <motion.div
      ref={setNodeRef}
      style={{
        ...dndStyle,
        background: '#15151f',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14,
        padding: '14px 14px 12px',
        cursor: 'default',
        userSelect: 'none',
        position: 'relative',
      }}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.18 }}
      className="group"
      onMouseEnter={e => { e.currentTarget.style.background = '#1c1c2a'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
      onMouseLeave={e => { e.currentTarget.style.background = '#15151f'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
    >
      {/* Drag handle */}
      <div {...attributes} {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        style={{ color: 'rgba(221,225,240,0.25)' }}>
        <GripVertical size={15} />
      </div>

      {/* Action buttons — top right */}
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <ActionBtn onClick={() => openModal({ type: 'view', task })} hoverColor="rgba(221,225,240,0.8)">
          <Eye size={13} />
        </ActionBtn>
        <ActionBtn onClick={() => openModal({ type: 'edit', task })} hoverColor="#4f8ef7">
          <Pencil size={13} />
        </ActionBtn>
        <ActionBtn onClick={() => deleteTask(task.id)} hoverColor="#f87171">
          <Trash2 size={13} />
        </ActionBtn>
      </div>

      {/* Tag + Priority row */}
      <div className="flex items-center gap-2 mb-3 pl-5">
        {task.tag && (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
            style={{ color: tagColor.text, background: tagColor.bg }}>
            {task.tag}
          </span>
        )}
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5"
          style={{ color: priority.color, background: priority.bg }}>
          <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: priority.color }} />
          {priority.label}
        </span>
      </div>

      {/* Title */}
      <p className="text-sm font-semibold leading-snug mb-2 pl-5 pr-16"
        style={{ color: 'rgba(221,225,240,0.92)' }}>
        {task.title}
      </p>

      {/* Description */}
      {task.description && (
        <p className="text-xs leading-relaxed mb-3 pl-5 line-clamp-2"
          style={{ color: 'rgba(221,225,240,0.42)' }}>
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pl-5 mt-1">
        <Avatar userId={task.assigneeId} size="sm" />
        {deadlineLabel && (
          <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: dlColor }}>
            <Calendar size={11} />
            {deadlineLabel}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function ActionBtn({ onClick, children, hoverColor }) {
  return (
    <button onClick={onClick}
      className="w-6 h-6 rounded-lg flex items-center justify-center transition-all"
      style={{ color: 'rgba(221,225,240,0.3)', background: 'transparent' }}
      onMouseEnter={e => { e.currentTarget.style.color = hoverColor; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(221,225,240,0.3)'; e.currentTarget.style.background = 'transparent' }}
    >
      {children}
    </button>
  )
}
