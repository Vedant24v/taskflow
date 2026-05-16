import React from 'react';
import Header from '../components/Header';
import KanbanBoard from '../components/KanbanBoard';
import TaskModal from '../components/TaskModal';
import { TaskProvider } from '../context/TaskContext';

export default function Dashboard({ handleLogout }) {
  return (
    <TaskProvider>
      <div className="app-shell relative flex h-screen flex-col overflow-hidden font-sans text-accent-ink selection:bg-accent-violet/20">
        <div className="aurora-grid absolute inset-0 opacity-80" />
        <div className="orbit-line -left-[12%] top-[8%] h-[760px] w-[900px] rotate-[-18deg]" />
        <div className="orbit-line right-[-18%] top-[-22%] h-[840px] w-[1020px] rotate-[28deg]" />
        <div className="orbit-line left-[28%] top-[7%] h-[560px] w-[780px] rotate-[4deg]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#100d18] via-[#211736]/60 to-transparent" />

        <div className="relative z-10 flex h-full flex-col overflow-hidden px-4 pb-4 pt-4 sm:px-6 lg:px-8">
          <Header handleLogout={handleLogout} />
          <main className="min-h-0 flex-1 overflow-hidden">
            <KanbanBoard />
          </main>
        </div>
        <TaskModal />
      </div>
    </TaskProvider>
  );
}
