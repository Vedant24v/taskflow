import React from 'react';
import Header from '../components/Header';
import KanbanBoard from '../components/KanbanBoard';
import TaskModal from '../components/TaskModal';
import { TaskProvider } from '../context/TaskContext';

export default function Dashboard({ handleLogout }) {
  return (
    <TaskProvider>
      <div className="flex flex-col h-screen overflow-hidden bg-surface-0 text-white font-sans selection:bg-accent-blue/30 relative">
        <div className="relative z-10 flex flex-col h-full overflow-hidden">
          <Header handleLogout={handleLogout} />
          <main className="flex-1 overflow-hidden">
            <KanbanBoard />
          </main>
        </div>
        <TaskModal />
      </div>
    </TaskProvider>
  );
}
