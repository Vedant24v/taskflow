import React from 'react'
import { TaskProvider } from './context/TaskContext'
import Header from './components/Header'
import KanbanBoard from './components/KanbanBoard'
import TaskModal from './components/TaskModal'

export default function App() {
  return (
    <TaskProvider>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#0d0d14', position: 'relative' }}>
        {/* Ambient blobs */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', width: 700, height: 700,
            top: -300, left: -150, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(79,142,247,0.07), transparent 65%)',
            filter: 'blur(40px)',
          }} />
          <div style={{
            position: 'absolute', width: 500, height: 500,
            bottom: -200, right: 100, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(167,139,250,0.06), transparent 65%)',
            filter: 'blur(40px)',
          }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          <Header />
          <main style={{ flex: 1, overflow: 'hidden' }}>
            <KanbanBoard />
          </main>
        </div>

        <TaskModal />
      </div>
    </TaskProvider>
  )
}
