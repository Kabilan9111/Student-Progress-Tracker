import React, { useEffect, useState } from 'react';
import DashboardLineChart from '../components/DashboardLineChart';
import LiveCalendar from '../components/LiveCalendar';
import SleepRing from '../components/SleepRing';
import ProgressRing from '../components/ProgressRing';
import AnalyticsBarChart from '../components/AnalyticsBarChart';
import ConversionDonutChart from '../components/ConversionDonutChart';

/* ---------- DATE HELPERS ---------- */
const todayKey = () => new Date().toISOString().split('T')[0];

const parseTime = (t) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

export default function Dashboard() {
  /* ---------- MANUAL INPUTS ---------- */
  const [sleepHrs, setSleepHrs] = useState(6);
  const [sleepMins, setSleepMins] = useState(30);
  const [waterL, setWaterL] = useState(1);
  const [waterMl, setWaterMl] = useState(865);

  /* ---------- DERIVED VALUES ---------- */
  const totalSleepMins = sleepHrs * 60 + sleepMins;
  const maxSleepMins = 7 * 60;
  const sleepPercent = Math.min(Math.round((totalSleepMins / maxSleepMins) * 100), 100);
  const sleepOverLimit = totalSleepMins > maxSleepMins;

  const totalWaterMl = waterL * 1000 + waterMl;
  const maxWaterMl = 4000;
  const waterPercent = Math.min(Math.round((totalWaterMl / maxWaterMl) * 100), 100);
  const isWaterOverLimit = totalWaterMl > maxWaterMl;

  const activityPercent = 72;
  const activityLow = activityPercent < 50;

  /* ---------- TODAY DATA ---------- */
  const [todaySchedule, setTodaySchedule] = useState([]);

  useEffect(() => {
    // Mock data fetching logic (kept original logic)
    const today = todayKey();
    const reminders = JSON.parse(localStorage.getItem('persistent_reminders')) || [];
    
    const todayReminders = reminders
      .filter(r => r.dateKey === today)
      .map(r => ({ title: r.title, time: r.slot, type: 'REMINDER' }));

    const habitData = JSON.parse(localStorage.getItem('habitData')) || {};
    const monthKey = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;
    const dayIndex = new Date().getDate() - 1;
    const positiveHabits = habitData?.[monthKey]?.positive || [];

    const todayHabits = positiveHabits.map(h => ({
      title: h.name,
      time: '--',
      type: 'HABIT',
      completed: h.progress[dayIndex],
    }));

    const combined = [...todayReminders, ...todayHabits].sort((a, b) =>
      a.time === '--' ? 1 : b.time === '--' ? -1 : parseTime(a.time) - parseTime(b.time)
    );
    setTodaySchedule(combined);
  }, []);

  return (
    <div className='w-full'>
      {/* HEADER SECTION - Minimalist & Spacious */}
      <div className='mb-12 flex flex-col md:flex-row md:items-end justify-between'>
        <div className='space-y-2'>
          <h1 className='text-4xl md:text-5xl font-thin tracking-tight text-white animate-fade-in'>
            Hello, <span className='font-normal text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400'>Leo</span>
          </h1>
          <p className='text-slate-500 font-light tracking-wide uppercase text-xs animate-fade-in delay-100'>
             {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} • Orbit Status: Stable
          </p>
        </div>
        <div className='mt-6 md:mt-0'>
           {/* Premium Action Button */}
           <button className='group relative px-6 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 flex items-center gap-2 overflow-hidden'>
              <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></span>
              <span className='text-xs font-medium tracking-wider text-slate-300 group-hover:text-white uppercase'>Customize Grid</span>
           </button>
        </div>
      </div>

      {/* MAIN DATA GRID - High-End Layout */}
      <div className='grid grid-cols-12 gap-8'>
        
        {/* LEFT COLUMN (MAIN METRICS) - Wider for drama */}
        <div className='col-span-12 lg:col-span-8 flex flex-col gap-8 animate-fade-in delay-200'>
          
          {/* PRIMARY CHART - Floating Glass */}
          <div className='glass-panel p-8 relative overflow-hidden group'>
             {/* Decorative sheen */}
             <div className='absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none translate-x-[50%] translate-y-[-50%]'></div>

             <div className='flex justify-between items-center mb-8 relative z-10'>
               <div>
                  <h3 className='text-sm font-semibold text-white tracking-wide'>Performance Vector</h3>
                  <p className='text-[10px] text-slate-500 uppercase tracking-widest mt-1'>Based on Habit Consistency</p>
               </div>
               <div className='flex p-1 bg-black/20 rounded-lg border border-white/5'>
                 {['D', 'W', 'M', 'Y'].map(t => (
                    <button key={t} className='px-3 py-1 text-[10px] font-bold text-slate-500 hover:text-white rounded-md hover:bg-white/10 transition-colors'>
                        {t}
                    </button>
                 ))}
               </div>
             </div>

             <div className='relative w-full h-[320px]'>
                <DashboardLineChart />
             </div>
          </div>

          {/* VITAL METRICS ROW - 3 Column Layout for Symmetry */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
             
             {/* ACTIVITY - The Core Engine */}
             <div className='glass-panel p-6 flex flex-col items-center justify-center relative overflow-hidden group/card min-h-[220px]'>
                <div className='absolute top-4 left-4 flex items-center gap-2 z-20'>
                    <div className='w-1 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]'></div>
                    <span className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>Activity</span>
                </div>
                
                <div className='relative scale-95 group-hover/card:scale-105 transition-transform duration-700 ease-out'>
                   {/* Background Glow */}
                   <div className={`absolute inset-0 blur-3xl opacity-20 ${activityLow ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                   
                   <ProgressRing
                    value={activityPercent}
                    max={100}
                    size={150}
                    strokeWidth={4}
                    color={activityLow ? '#f43f5e' : '#10b981'} // Emerald
                  />
                  <div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none'>
                    <span className='text-3xl font-light text-white tracking-tighter'>{activityPercent}<span className='text-sm text-slate-500 ml-0.5'>%</span></span>
                  </div>
                </div>
             </div>

             {/* HYDRATION - Liquid Glass */}
             <div className='glass-panel p-6 flex flex-col items-center justify-center relative overflow-hidden group/card'>
                <div className='absolute top-4 left-4 flex items-center gap-2 z-20'>
                    <div className='w-1 h-3 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]'></div>
                    <span className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>Hydration</span>
                </div>
                
                <div className='relative scale-95 group-hover/card:scale-105 transition-transform duration-700 ease-out'>
                  <div className={`absolute inset-0 blur-3xl opacity-20 ${isWaterOverLimit ? 'bg-rose-500' : 'bg-cyan-500'}`}></div>

                  <ProgressRing
                    value={totalWaterMl}
                    max={maxWaterMl}
                    size={150}
                    strokeWidth={4}
                    color={isWaterOverLimit ? '#f43f5e' : '#06b6d4'} // Cyan
                  />
                  <div className='absolute inset-0 flex flex-col items-center justify-center'>
                     <div className='text-center'>
                        <span className='text-2xl font-light text-white tracking-tighter'>{waterL}<span className='text-base text-slate-500'>L</span></span>
                        <div className='text-xs text-cyan-400/80 mt-1 font-mono'>{waterMl}ml</div>
                     </div>
                  </div>
                </div>

                {/* Hidden Input Controls - slide up on hover */}
                <div className='absolute bottom-4 flex gap-2 translate-y-10 group-hover/card:translate-y-0 transition-transform duration-300 opacity-0 group-hover/card:opacity-100'>
                     <input
                      type='number'
                      className='w-12 bg-black/40 backdrop-blur-md border border-white/10 rounded text-center text-xs p-1 focus:border-cyan-500 outline-none hover:bg-black/60 transition-colors'
                      value={waterL}
                      onChange={e => setWaterL(Number(e.target.value))}
                    />
                    <input
                      type='number'
                      className='w-14 bg-black/40 backdrop-blur-md border border-white/10 rounded text-center text-xs p-1 focus:border-cyan-500 outline-none hover:bg-black/60 transition-colors'
                      value={waterMl}
                      onChange={e => setWaterMl(Number(e.target.value))}
                    />
                </div>
             </div>

             {/* SLEEP - Deep Space */}
             <div className='glass-panel p-6 flex flex-col items-center justify-center relative overflow-hidden group/card'>
                 <div className='absolute top-4 left-4 flex items-center gap-2 z-20'>
                    <div className='w-1 h-3 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]'></div>
                    <span className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>Rest</span>
                </div>

                <div className='relative scale-95 group-hover/card:scale-105 transition-transform duration-700 ease-out'>
                    <div className={`absolute inset-0 blur-3xl opacity-20 ${sleepOverLimit ? 'bg-indigo-300' : 'bg-indigo-600'}`}></div>
                    
                    <ProgressRing
                        value={totalSleepMins}
                        max={maxSleepMins}
                        size={150}
                        strokeWidth={4}
                        color={'#6366f1'} // Indigo
                    />
                     <div className='absolute inset-0 flex flex-col items-center justify-center'>
                        <span className='text-2xl font-light text-white tracking-tighter'>{sleepHrs}<span className='text-base text-slate-500'>h</span> {sleepMins}<span className='text-base text-slate-500'>m</span></span>
                     </div>
                </div>

                <div className='absolute bottom-6 w-full px-8 opacity-50 group-hover/card:opacity-100 transition-opacity flex justify-between text-[10px] uppercase font-bold tracking-wider text-slate-500'>
                    <span>Target: 7h</span>
                    <span className='text-rose-400'>-30m</span>
                </div>
             </div>

          </div>
          
          {/* ANALYTICS ROW - Full Width for depth */}
          <div className='glass-panel p-8'>
             <div className='flex items-center gap-4 mb-6'>
                <h3 className='text-sm font-semibold text-white tracking-wide'>Weekly Discipline & Focus</h3>
                <div className='h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent'></div>
             </div>
             
             <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                 <div className='md:col-span-2 h-[200px]'>
                     <AnalyticsBarChart />
                 </div>
                 {/* Quick Stats Column */}
                 <div className='flex flex-col justify-center gap-4 border-l border-white/5 pl-8'>
                     <div className='group cursor-pointer'>
                         <p className='text-[10px] text-slate-500 uppercase tracking-widest mb-1 group-hover:text-emerald-400 transition-colors'>Focus Score</p>
                         <p className='text-3xl font-light text-white'>86<span className='text-sm text-slate-600'>/100</span></p>
                     </div>
                     <div className='group cursor-pointer'>
                         <p className='text-[10px] text-slate-500 uppercase tracking-widest mb-1 group-hover:text-cyan-400 transition-colors'>Tasks Cleared</p>
                         <p className='text-3xl font-light text-white'>12<span className='text-sm text-slate-600'> items</span></p>
                     </div>
                     <div className='group cursor-pointer'>
                         <p className='text-[10px] text-slate-500 uppercase tracking-widest mb-1 group-hover:text-amber-400 transition-colors'>Streak</p>
                         <p className='text-3xl font-light text-white'>3<span className='text-sm text-slate-600'> days</span></p>
                     </div>
                 </div>
             </div>
          </div>

        </div>

        {/* RIGHT COLUMN (CALENDAR + AGENDA) - Control Panel Feel */}
        <div className='col-span-12 lg:col-span-4 flex flex-col gap-6 animate-fade-in delay-300'>
          
          {/* CALENDAR */}
          <div className='glass-panel p-0 overflow-hidden min-h-[380px] bg-gradient-to-b from-[#0A0A0A]/80 to-[#0A0A0A]/40'>
             <LiveCalendar />
          </div>

          {/* AGENDA - The Checklist */}
          <div className='glass-panel p-8 flex-1 flex flex-col min-h-[400px]'>
            <div className='flex justify-between items-center mb-6 border-b border-white/5 pb-4'>
               <h3 className='text-sm font-semibold text-white tracking-wide'>Mission Log</h3>
               <button className='w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all'>+</button>
            </div>
            
            <div className='space-y-3 overflow-y-auto custom-scrollbar flex-1 -mr-2 pr-2'>
               {todaySchedule.length === 0 ? (
                 <div className='h-full flex flex-col items-center justify-center text-slate-600 space-y-2 opacity-50'>
                    <div className='w-12 h-12 rounded-full bg-white/5 flex items-center justify-center'>
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14"/></svg>
                    </div>
                    <span className='text-xs font-medium tracking-wide'>No Active Missions</span>
                 </div>
               ) : (
                 todaySchedule.map((item, i) => (
                   <div key={i} className='group flex items-center justify-between p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-emerald-500/20 transition-all cursor-pointer'>
                      <div className='flex items-center gap-4'>
                         <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] ${item.type === 'HABIT' ? 'bg-purple-500 text-purple-500' : 'bg-emerald-500 text-emerald-500'}`}></div>
                         <div className='flex flex-col'>
                            <span className='text-sm font-medium text-slate-200 group-hover:text-white transition-colors'>{item.title}</span>
                            <span className='text-[9px] text-slate-500 uppercase tracking-widest font-bold'>{item.type}</span>
                         </div>
                      </div>
                      <span className='text-xs font-mono text-slate-500 group-hover:text-emerald-400 transition-colors'>{item.time}</span>
                   </div>
                 ))
               )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

