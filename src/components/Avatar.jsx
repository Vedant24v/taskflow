import React from 'react'
import { USERS } from '../data/mockData'

export default function Avatar({ userId, size = 'sm', showName = false, showRole = false }) {
  const user = USERS.find(u => u.id === userId)
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
        className={`${s.box} ${s.text} rounded-full flex items-center justify-center font-semibold shrink-0 select-none ring-2 ring-black`}
        style={{ backgroundColor: user.color + '28', color: user.color, border: `1px solid ${user.color}40` }}
        title={user.name}
      >
        {user.initials}
      </div>
      {showName && (
        <div className="min-w-0">
          <p className="text-sm font-medium text-white leading-none truncate">{user.name}</p>
          {showRole && <p className="text-xs text-white/40 mt-0.5">{user.role}</p>}
        </div>
      )}
    </div>
  )
}
