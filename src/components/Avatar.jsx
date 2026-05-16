import React from 'react'
import { useTasks } from '../context/TaskContext'

export default function Avatar({ userObj, userId, size = 'sm', showName = false, showRole = false }) {
  const { users } = useTasks()
  
  const isPopulated = userObj && typeof userObj === 'object' && userObj.name;
  const user = isPopulated ? userObj : users.find(u => u.id === userId || u._id === userId)
  if (!user) return null

  const sizeMap = {
    xs: { box: 'w-6 h-6', text: 'text-[10px]' },
    sm: { box: 'w-7 h-7', text: 'text-xs' },
    md: { box: 'w-9 h-9', text: 'text-sm' },
    lg: { box: 'w-12 h-12', text: 'text-base' },
  }
  const s = sizeMap[size] || sizeMap.sm

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${s.box} ${s.text} flex shrink-0 select-none items-center justify-center rounded-full border-2 border-white font-bold shadow-sm`}
        style={{ backgroundColor: (user.color || '#4f8ef7') + '20', color: user.color || '#4f8ef7' }}
        title={user.name}
      >
        {user.initials || (user.name ? user.name.substring(0, 2).toUpperCase() : '??')}
      </div>
      {showName && (
        <div className="min-w-0">
          <p className="truncate text-sm font-bold leading-none text-accent-ink">{user.name}</p>
          {showRole && <p className="mt-0.5 text-xs font-medium text-accent-ink/42">{user.role}</p>}
        </div>
      )}
    </div>
  )
}
