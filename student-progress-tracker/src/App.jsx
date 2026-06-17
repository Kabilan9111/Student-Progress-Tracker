import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Sidebar from './components/Sidebar'
import Welcome from './pages/Welcome'
import Dashboard from './pages/Dashboard'

import HabitSection from './components/HabitSection'
import ActivitySection from './components/Activity'
import ProgressTracker from './pages/ProgressTracker'
import Reminder from './pages/Reminder'
import Todo from './pages/Todo'
import Agent from './pages/Agent'
import Timetable from './pages/Timetable'

export default function App() {
  return (
    <div className='flex min-h-screen w-full bg-background text-white font-sans overflow-hidden'>

      {/* SIDEBAR - Fixed width, premium glass effect */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <main className='flex-1 relative h-screen overflow-y-auto overflow-x-hidden custom-scrollbar bg-pattern'>

        {/* Cinematic Ambient Glows - Deep and Controlled */}
        <div className='fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0'>
          {/* Top Left: Deep Emerald */}
          <div className='absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/10 rounded-full blur-[160px] opacity-40 mix-blend-screen'></div>
          {/* Bottom Right: Deep Cyan */}
          <div className='absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[160px] opacity-30 mix-blend-screen'></div>
          {/* Center: Very subtle fill */}
          <div className='absolute top-[20%] left-[20%] w-[60%] h-[60%] bg-slate-900/20 rounded-full blur-[200px] opacity-20'></div>
        </div>

        <div className='relative z-10 px-8 py-10 md:px-16 md:py-12 max-w-[1920px] mx-auto'>
          <Routes>
            <Route path='/home' element={<Welcome />} />
            <Route path='/' element={<Dashboard />} />
            <Route path='/timetable' element={<Timetable />} />
            <Route path='/habits' element={<HabitSection />} />
            <Route path='/activity' element={<ActivitySection />} />
            <Route path='/progress' element={<ProgressTracker />} />
            <Route path='/reminders' element={<Reminder />} />
            <Route path='/todo' element={<Todo />} />
            <Route path='/agent' element={<Agent />} />
            <Route
              path='/settings'
              element={
                <div className='flex items-center justify-center h-[60vh] text-slate-500 font-light tracking-widest uppercase text-sm'>
                  Settings Implementation Pending
                </div>
              }
            />
          </Routes>
        </div>
      </main>
    </div>
  )
}
