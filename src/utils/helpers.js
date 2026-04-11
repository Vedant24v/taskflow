import { format, isPast, isToday, isTomorrow, differenceInDays } from 'date-fns'

export function formatDeadline(dateStr) {
  if (!dateStr) return null
  const date = new Date(dateStr + 'T00:00:00')
  if (isToday(date)) return 'Due today'
  if (isTomorrow(date)) return 'Due tomorrow'
  if (isPast(date)) return `Overdue ${format(date, 'MMM d')}`
  const diff = differenceInDays(date, new Date())
  if (diff <= 7) return `${diff}d left`
  return format(date, 'MMM d')
}

export function getDeadlineStatus(dateStr) {
  if (!dateStr) return 'none'
  const date = new Date(dateStr + 'T00:00:00')
  if (isPast(date) && !isToday(date)) return 'overdue'
  if (isToday(date) || isTomorrow(date)) return 'urgent'
  const diff = differenceInDays(date, new Date())
  if (diff <= 5) return 'warning'
  return 'ok'
}

export function getPriorityConfig(priority) {
  switch (priority) {
    case 'high':   return { label: 'High',   color: '#f87171', bg: 'rgba(248,113,113,0.1)' }
    case 'medium': return { label: 'Medium', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' }
    case 'low':    return { label: 'Low',    color: '#64748b', bg: 'rgba(100,116,139,0.1)' }
    default:       return { label: 'Low',    color: '#64748b', bg: 'rgba(100,116,139,0.1)' }
  }
}

export const TAG_COLORS = {
  Frontend: { text: '#4f8ef7', bg: 'rgba(79,142,247,0.12)' },
  Backend:  { text: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  Design:   { text: '#34d399', bg: 'rgba(52,211,153,0.12)' },
  QA:       { text: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
  DevOps:   { text: '#f87171', bg: 'rgba(248,113,113,0.12)' },
  Other:    { text: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
}
