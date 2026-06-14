import React, { useState, useEffect } from 'react';
import LeftPanels from '../components/Timetable/LeftPanels';
import RightPanels from '../components/Timetable/RightPanels';
import Timeline from '../components/Timetable/Timeline';
import TaskModal from '../components/Timetable/TaskModal';

import useTimetable from '../hooks/useTimetable';
import { requestNotificationPermission } from '../utils/notifications';

export default function Timetable() {
  const {
    tasks,
    currentTime,
    currentTask,
    previousTask,
    nextTask,
    focusPulse,
    dayBalance,
    dayProgress,
    actions
  } = useTimetable();

  const [hasTimetable, setHasTimetable] = useState(false);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' | 'calendar'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTaskData, setModalTaskData] = useState(null);

  const openModal = (task = null) => {
    setModalTaskData(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (taskData) => {
    if (taskData.id) {
      actions.updateTask(taskData.id, taskData);
    } else {
      actions.addTask(taskData);
    }
    setIsModalOpen(false);
  };

  const handleDeleteTask = (id) => {
    actions.deleteTask(id);
    setIsModalOpen(false);
  };

  // Load from local storage for persistence across reloads
  useEffect(() => {
    const saved = localStorage.getItem('spt_has_timetable');
    if (saved === 'true') {
      setHasTimetable(true);
      requestNotificationPermission(); // Ask for permissions if they have a timetable
    }
  }, []);

  const handleAddTimetable = () => {
    setHasTimetable(true);
    localStorage.setItem('spt_has_timetable', 'true');
    requestNotificationPermission();
  };

  return (
    <div className='w-full min-h-screen flex flex-col font-sans text-white pb-20'>
      
      {/* Top Header Section */}
      <header className='flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 relative z-20'>
        <div>
          <div className='flex items-center gap-4 mb-1'>
            <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]'></div>
            <h1 className='text-4xl font-bold tracking-tight text-white uppercase'>TIMETABLE</h1>
          </div>
          <p className='text-slate-400 text-sm tracking-wide ml-12'>Own your day. Design your future.</p>
        </div>

        {/* Center Toggle & Actions */}
        <div className='flex items-center gap-8'>
          
          {/* View Toggle */}
          <div className='flex items-center p-1 bg-white/[0.03] border border-white/[0.05] rounded-full backdrop-blur-md'>
            <button 
              onClick={() => setViewMode('timeline')}
              className={`px-6 py-2 rounded-full text-xs font-semibold tracking-widest transition-all duration-300 ${viewMode === 'timeline' ? 'bg-white/[0.1] text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'text-slate-500 hover:text-white'}`}
            >
              Timeline
            </button>
            <button 
              onClick={() => setViewMode('calendar')}
              className={`px-6 py-2 rounded-full text-xs font-semibold tracking-widest transition-all duration-300 ${viewMode === 'calendar' ? 'bg-white/[0.1] text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'text-slate-500 hover:text-white'}`}
            >
              Calendar
            </button>
          </div>

          {/* AI Optimize Button */}
          <button 
            onClick={() => {
              const success = actions.optimizeSchedule();
              if(success) alert('Schedule optimized by AI!');
            }}
            className='flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-widest hover:bg-cyan-500/20 transition-all shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]'
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
            AI Optimize
            <span className='w-5 h-5 rounded-full bg-cyan-400 text-[#060606] flex items-center justify-center text-[10px] ml-1 shadow-[0_0_10px_rgba(34,211,238,0.8)]'>3</span>
          </button>
          
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10'>
        
        {/* Left Sidebar (Calendar, Pulse, Mission) */}
        <div className='lg:col-span-3 flex flex-col'>
          <LeftPanels 
            hasTimetable={hasTimetable} 
            onAddTimetable={handleAddTimetable} 
            focusPulse={focusPulse}
            tasks={tasks}
          />
        </div>

        {/* Center Hero Timeline */}
        <div className='lg:col-span-6 relative min-h-[600px]'>
           {/* Ambient background glow for center area */}
           <div className='absolute inset-0 bg-gradient-to-b from-cyan-900/5 via-transparent to-transparent pointer-events-none rounded-3xl'></div>
           <Timeline 
             hasTimetable={hasTimetable} 
             setHasTimetable={setHasTimetable} 
             tasks={tasks}
             currentTime={currentTime}
             currentTask={currentTask}
             actions={actions}
             openModal={openModal}
           />
           
           {/* Bottom Encouragement Text */}
           <div className='absolute -bottom-16 left-0 right-0 flex justify-between items-center text-[11px] font-medium tracking-widest text-slate-500 border-t border-white/[0.05] pt-6'>
             <div className='flex items-center gap-2'>
                <span className='text-amber-400'>✨</span> Discipline today, freedom tomorrow.
             </div>
             <div className='flex items-center gap-2'>
                Keep going, Leo! You've got this. <span className='text-red-400'>🚀</span>
             </div>
           </div>
        </div>

        {/* Right Sidebar (Clock, AI Insight, Balance, Progress) */}
        <div className='lg:col-span-3 flex flex-col'>
          <RightPanels 
            hasTimetable={hasTimetable} 
            currentTime={currentTime}
            dayBalance={dayBalance}
            nextTask={nextTask}
            dayProgress={dayProgress}
            actions={actions}
            openModal={openModal}
          />
        </div>

      </div>

      {/* Priority Legend Footer */}
      {hasTimetable && (
        <div className='fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-8 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 px-8 py-3 rounded-full shadow-2xl z-50'>
          <div className='flex items-center gap-2'>
            <div className='w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]'></div>
            <span className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>High Priority</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]'></div>
            <span className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>Medium Priority</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'></div>
            <span className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>Low Priority</span>
          </div>
          <div className='w-px h-4 bg-white/10 mx-2'></div>
          <div className='flex items-center gap-2'>
            <div className='w-2.5 h-2.5 rounded-full bg-slate-500'></div>
            <span className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>Break</span>
          </div>
        </div>
      )}

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={modalTaskData}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />

    </div>
  );
}
