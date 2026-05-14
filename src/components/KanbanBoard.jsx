import React, { useState } from 'react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core'
import KanbanColumn from './KanbanColumn'
import TaskCard from './TaskCard'
import { useTasks } from '../context/TaskContext'
import { COLUMNS } from '../data/mockData'

export default function KanbanBoard() {
  const { filteredTasks, tasks, moveTask, reorderTasks, loading } = useTasks()
  const [activeTask, setActiveTask] = useState(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  function onDragStart({ active }) {
    setActiveTask(tasks.find(t => t.id === active.id || t._id === active.id) || null)
  }

  function onDragOver({ active, over }) {
    if (!over) return
    const activeId = active.id
    const overId   = over.id
    if (activeId === overId) return

    const isOverColumn = COLUMNS.some(c => c.id === overId)
    if (isOverColumn) {
      const t = tasks.find(t => t.id === activeId || t._id === activeId)
      if (t && t.status !== overId) moveTask({ taskId: activeId, newStatus: overId })
      return
    }

    const overTask   = tasks.find(t => t.id === overId || t._id === overId)
    const activeTaskObj = tasks.find(t => t.id === activeId || t._id === activeId)
    if (!overTask || !activeTaskObj) return

    if (activeTaskObj.status !== overTask.status) {
      moveTask({ taskId: activeId, newStatus: overTask.status, overTaskId: overId })
    } else {
      reorderTasks({ activeId, overId })
    }
  }

  function onDragEnd({ active, over }) {
    setActiveTask(null)
    if (!over) return
    const isOverColumn = COLUMNS.some(c => c.id === over.id)
    if (isOverColumn) {
      const t = tasks.find(t => t.id === active.id || t._id === active.id)
      if (t && t.status !== over.id) moveTask({ taskId: active.id, newStatus: over.id })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 font-medium">
        Loading tasks...
      </div>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners}
      onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
      <div className="flex gap-6 p-8 overflow-x-auto h-full pb-10 items-start custom-scrollbar">
        {COLUMNS.map(column => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={filteredTasks.filter(t => t.status === column.id)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="rotate-2 opacity-90 shadow-2xl cursor-grabbing">
            <TaskCard task={activeTask} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
