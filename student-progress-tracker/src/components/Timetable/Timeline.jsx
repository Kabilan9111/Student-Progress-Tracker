import React, { useState, useEffect, useRef } from 'react';

const PRIORITY_COLORS = {
  high: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]',
  medium: 'text-purple-400 bg-purple-400/10 border-purple-400/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]',
  low: 'text-amber-400 bg-amber-400/10 border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.2)]',
  break: 'text-slate-400 bg-white/5 border-white/10'
};

const STATUS_ICONS = {
  completed: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>,
  live: <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-bold tracking-widest border border-cyan-500/30 animate-pulse">LIVE</span>,
  upcoming: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><circle cx="12" cy="12" r="10"/></svg>
};

const ICONS = {
  sun: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>,
  dumbbell: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6.5 6.5 11 11M21 21l-1-1M3 3l1 1M18 22l4-4M2 6l4-4M3 10l7-7M14 21l7-7"/></svg>,
  graduation: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  code: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/></svg>,
  coffee: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>,
  folder: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>,
  brain: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
  moon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>,
  sleep: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/></svg>
};

const TaskCard = ({ task, isLive }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div 
      className={`relative w-full rounded-2xl border transition-all duration-500 group flex flex-col justify-center cursor-pointer overflow-hidden ${PRIORITY_COLORS[task.priority]} ${isLive ? 'scale-[1.02] bg-opacity-20 shadow-[0_0_30px_rgba(34,211,238,0.2)] border-cyan-400/50' : 'hover:scale-[1.01] hover:bg-opacity-20'} ${task.status === 'completed' ? 'opacity-60 saturate-50' : ''}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{ minHeight: '80px' }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      <div className="px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner ${isLive ? 'bg-cyan-500/20 border-cyan-400/30 text-cyan-400' : 'bg-white/5 border-white/10'}`}>
            {ICONS[task.icon] || ICONS.sun}
          </div>
          <div>
            <h4 className="text-white font-medium text-base tracking-wide flex items-center gap-3">
              {task.title}
            </h4>
            <p className="text-xs text-slate-400 mt-1 font-medium tracking-wider">
              {task.startTime} – {task.endTime}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-5">
          <span className="text-xs font-semibold text-slate-300 tracking-wider w-16 text-right">
            {task.duration}
          </span>
          <div className="w-16 flex justify-end">
            {STATUS_ICONS[task.status]}
          </div>
        </div>
      </div>
      
      {/* Expanded details */}
      <div className={`px-6 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${expanded || isLive ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="pt-2 border-t border-white/10 flex flex-col gap-3">
          {task.notes && (
            <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
              {task.notes}
            </p>
          )}
          {isLive && (
             <div className="flex items-center gap-3 mt-1">
               <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full bg-cyan-400 w-[60%] shadow-[0_0_10px_rgba(34,211,238,0.8)] relative">
                    <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/50 blur-[2px]"></div>
                 </div>
               </div>
               <span className="text-[10px] font-bold text-cyan-400 w-8 text-right">60%</span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Timeline({ hasTimetable, setHasTimetable }) {
  const [currentTimePos, setCurrentTimePos] = useState(30); // percentage 0-100

  // Animate the line down slowly
  useEffect(() => {
    if(!hasTimetable) return;
    const interval = setInterval(() => {
      setCurrentTimePos(prev => (prev < 90 ? prev + 0.1 : 30));
    }, 1000);
    return () => clearInterval(interval);
  }, [hasTimetable]);

  const mockTasks = [
    { id: 1, title: 'Wake Up & Meditation', startTime: '05:00 AM', endTime: '05:45 AM', duration: '45m', priority: 'low', status: 'completed', icon: 'sun' },
    { id: 2, title: 'Gym & Fitness', startTime: '06:00 AM', endTime: '07:00 AM', duration: '60m', priority: 'high', status: 'completed', icon: 'dumbbell' },
    { id: 3, title: 'College', startTime: '08:00 AM', endTime: '02:00 PM', duration: '6h', priority: 'high', status: 'live', icon: 'graduation', notes: 'Lectures, Notes, Learn' },
    { id: 4, title: 'Deep Work on DSA', startTime: '02:30 PM', endTime: '05:15 PM', duration: '2h 45m', priority: 'high', status: 'upcoming', icon: 'code' },
    { id: 5, title: 'Break / Snack', startTime: '05:15 PM', endTime: '05:35 PM', duration: '20m', priority: 'break', status: 'upcoming', icon: 'coffee' },
    { id: 6, title: 'Project Work', startTime: '05:35 PM', endTime: '07:30 PM', duration: '1h 55m', priority: 'medium', status: 'upcoming', icon: 'folder' },
    { id: 7, title: 'Aptitude Practice', startTime: '07:30 PM', endTime: '09:00 PM', duration: '1h 30m', priority: 'medium', status: 'upcoming', icon: 'brain' },
    { id: 8, title: 'Wind Down / Reading', startTime: '09:00 PM', endTime: '10:30 PM', duration: '1h 30m', priority: 'medium', status: 'upcoming', icon: 'moon' },
    { id: 9, title: 'Sleep', startTime: '10:30 PM', endTime: '05:00 AM', duration: '6h 30m', priority: 'low', status: 'upcoming', icon: 'sleep' },
  ];

  if (!hasTimetable) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center opacity-50 pointer-events-none">
        <div className="w-1 h-full bg-gradient-to-b from-transparent via-white/5 to-transparent relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-600 tracking-[0.5em] text-sm uppercase font-light whitespace-nowrap rotate-90 opacity-30">
              Empty Timeline
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex pt-8 pb-12">
      
      {/* The Central Glowing Line */}
      <div className="absolute left-[80px] top-0 bottom-0 w-[2px] bg-white/[0.03]">
        {/* Filled portion up to current time */}
        <div 
          className="absolute top-0 left-0 w-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] transition-all duration-1000 ease-linear"
          style={{ height: `${currentTimePos}%` }}
        ></div>
        
        {/* Current Time Glowing Orb */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_20px_rgba(34,211,238,1)] flex items-center justify-center transition-all duration-1000 ease-linear z-50 animate-pulse"
          style={{ top: `${currentTimePos}%` }}
        >
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          
          {/* Animated horizontal scanner line spanning across the timeline */}
          <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none"></div>
          
          {/* Time Label on the Line */}
          <div className="absolute right-8 text-[10px] font-bold text-cyan-400 tracking-widest whitespace-nowrap bg-[#060606] px-2 py-0.5 rounded border border-cyan-500/30">
            10:24 AM
          </div>
        </div>
      </div>

      {/* Start Day Marker */}
      <div className="absolute left-[66px] top-4 flex items-center gap-6 z-10">
        <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
        </div>
        <div>
          <h5 className="text-[11px] font-medium text-slate-300 tracking-wider">Start Your Day</h5>
          <p className="text-[10px] text-slate-500 font-medium">05:00 AM</p>
        </div>
      </div>

      {/* Tasks Container */}
      <div className="w-full pl-[140px] pr-8 flex flex-col gap-6 mt-16 relative z-20">
        {mockTasks.map((task, idx) => (
          <div key={task.id} className="relative group">
            {/* Connection Node to main line */}
            <div className="absolute -left-[60px] top-1/2 -translate-y-1/2 flex items-center w-[60px]">
              <div className={`w-2.5 h-2.5 rounded-full border-2 bg-[#060606] z-10 transition-colors duration-500 ${task.status === 'completed' || task.status === 'live' ? 'border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]' : 'border-slate-700'}`}></div>
              <div className={`h-[1px] w-full transition-colors duration-500 ${task.status === 'completed' || task.status === 'live' ? 'bg-cyan-400/30' : 'bg-slate-800'}`}></div>
            </div>
            
            <TaskCard task={task} isLive={task.status === 'live'} />
          </div>
        ))}
      </div>
      
      {/* End Day Marker */}
      <div className="absolute left-[66px] bottom-4 flex items-center gap-6 z-10">
        <div className="w-8 h-8 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
        </div>
        <h5 className="text-[11px] font-medium text-slate-500 tracking-wider">End of Day</h5>
      </div>

    </div>
  );
}
