import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, ChartTooltip, Legend);

export default function RightPanels({ hasTimetable }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).split(' ');
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).toUpperCase();
  };

  const [timeStr, ampm] = formatTime(time);

  const renderLiveClock = () => (
    <div className='p-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl backdrop-blur-md mb-6'>
      <h3 className='text-[10px] font-bold tracking-widest text-slate-400 mb-2'>{formatDate(time)}</h3>
      <div className='flex items-baseline gap-2'>
        <span className='text-4xl font-light text-white tracking-wider'>{timeStr}</span>
        <span className='text-cyan-400 text-sm font-semibold'>{ampm}</span>
      </div>
      <div className='flex items-center gap-2 mt-3'>
        <span className='text-xs text-slate-400'>Live Time</span>
        <div className='w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse'></div>
        <span className='text-[10px] text-cyan-400 font-bold uppercase tracking-wider'>Live</span>
      </div>
    </div>
  );

  const renderAIInsight = () => (
    <div className='p-5 bg-gradient-to-b from-[#0a1128] to-transparent border border-white/[0.05] rounded-2xl backdrop-blur-md mb-6 relative overflow-hidden'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-[10px] font-bold tracking-widest text-slate-400'>AI INSIGHT</h3>
        <span className='text-[8px] px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded uppercase font-bold tracking-widest border border-indigo-500/30'>BETA</span>
      </div>
      
      {hasTimetable ? (
        <>
          <p className='text-xs text-slate-300 leading-relaxed mb-4'>
            You perform best between <span className='text-cyan-400 font-semibold'>02:00 PM – 06:00 PM</span>.
            <br/><br/>
            Consider scheduling your deep work in this window.
          </p>
          <button className='w-full py-2 rounded-lg bg-white/[0.03] border border-white/[0.1] text-xs text-cyan-300 hover:bg-white/[0.08] transition-colors flex items-center justify-center gap-2'>
            Reschedule with AI
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </>
      ) : (
        <p className='text-xs text-slate-500 italic'>Waiting for schedule data</p>
      )}
    </div>
  );

  const renderDayBalance = () => {
    const data = {
      labels: ['Deep Work', 'Academics', 'Health', 'Personal', 'Breaks'],
      datasets: [
        {
          data: hasTimetable ? [42, 28, 15, 10, 5] : [100],
          backgroundColor: hasTimetable 
            ? ['#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']
            : ['#1e293b'],
          borderWidth: 0,
          cutout: '80%',
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: hasTimetable }
      }
    };

    return (
      <div className='p-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl backdrop-blur-md mb-6'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='text-[10px] font-bold tracking-widest text-slate-400'>DAY BALANCE</h3>
          <span className='text-[10px] text-slate-500 flex items-center gap-1 cursor-pointer hover:text-white'>This Week <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg></span>
        </div>
        
        {hasTimetable ? (
          <div className='flex items-center gap-6'>
            <div className='relative w-24 h-24 flex-shrink-0'>
              <Doughnut data={data} options={options} />
              <div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none'>
                <span className='text-[10px] text-slate-400'>Balanced</span>
                <span className='text-lg font-bold text-white'>84%</span>
              </div>
            </div>
            <div className='flex flex-col gap-2 flex-1'>
              {[
                { label: 'Deep Work', val: '42%', color: 'bg-purple-500' },
                { label: 'Academics', val: '28%', color: 'bg-blue-500' },
                { label: 'Health', val: '15%', color: 'bg-emerald-500' },
                { label: 'Personal', val: '10%', color: 'bg-amber-500' },
                { label: 'Breaks', val: '5%', color: 'bg-red-500' },
              ].map((item, i) => (
                <div key={i} className='flex items-center justify-between text-[10px]'>
                  <div className='flex items-center gap-2'>
                    <div className={`w-1.5 h-1.5 rounded-full ${item.color}`}></div>
                    <span className='text-slate-300'>{item.label}</span>
                  </div>
                  <span className='text-white font-medium'>{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className='text-xs text-slate-500 italic text-center py-4'>No data available</p>
        )}
      </div>
    );
  };

  const renderUpNext = () => {
    return (
      <div className='p-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl backdrop-blur-md mb-6'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-[10px] font-bold tracking-widest text-slate-400'>UP NEXT</h3>
          {hasTimetable && <span className='text-[10px] text-cyan-400'>In 35 mins</span>}
        </div>
        
        {hasTimetable ? (
          <div className='flex items-start gap-4'>
            <div className='w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0'>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>
            </div>
            <div>
              <h4 className='text-sm text-white font-medium'>Gym & Fitness</h4>
              <p className='text-[10px] text-slate-400 mt-1'>11:00 AM – 12:00 PM</p>
              <div className='w-full h-1 bg-white/5 rounded-full mt-3 overflow-hidden'>
                <div className='h-full bg-emerald-500 w-[0%]'></div>
              </div>
            </div>
          </div>
        ) : (
          <p className='text-xs text-slate-500 italic'>No tasks planned</p>
        )}
      </div>
    );
  };

  const renderDayProgress = () => {
    return (
      <div className='p-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl backdrop-blur-md mb-6 flex flex-col items-center justify-center relative'>
        <h3 className='text-[10px] font-bold tracking-widest text-slate-400 absolute top-5 left-5'>DAY PROGRESS</h3>
        
        {hasTimetable ? (
          <>
            <div className='w-32 h-32 relative mt-8 mb-4'>
              <svg className="w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="351.85" strokeDashoffset="239.26" className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-1000 ease-out" strokeLinecap="round" />
              </svg>
              <div className='absolute inset-0 flex flex-col items-center justify-center'>
                <span className='text-2xl font-light text-white'>32%</span>
                <span className='text-[9px] text-slate-400 uppercase tracking-widest mt-1'>Completed</span>
              </div>
            </div>
            <p className='text-xs text-slate-300'>
              <span className='font-bold text-white'>8h 15m</span> / 24h
            </p>
            <p className='text-[10px] text-slate-500 mt-1 tracking-wide'>Planned Time</p>
          </>
        ) : (
          <div className='mt-8 mb-4 flex items-center justify-center h-32'>
            <p className='text-xs text-slate-500 italic'>No data</p>
          </div>
        )}
      </div>
    );
  };

  const renderQuickActions = () => (
    <div className='p-5 bg-transparent mb-6'>
      <h3 className='text-[10px] font-bold tracking-widest text-slate-400 mb-4'>QUICK ACTIONS</h3>
      <div className='flex flex-col gap-3'>
        <button className='flex items-center gap-3 text-xs text-slate-300 hover:text-white group transition-colors'>
          <div className='w-6 h-6 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors'>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
          </div>
          Add Time Block
        </button>
        <button className='flex items-center gap-3 text-xs text-slate-300 hover:text-white group transition-colors'>
          <div className='w-6 h-6 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors'>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          </div>
          Import Schedule
        </button>
        <button className='flex items-center gap-3 text-xs text-slate-300 hover:text-red-400 group transition-colors'>
          <div className='w-6 h-6 rounded-full border border-white/10 flex items-center justify-center group-hover:border-red-400/30 transition-colors text-slate-400 group-hover:text-red-400'>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </div>
          Clear All
        </button>
      </div>
    </div>
  );

  return (
    <div className='flex flex-col w-full h-full'>
      {renderLiveClock()}
      {renderAIInsight()}
      {renderDayBalance()}
      {renderUpNext()}
      {renderDayProgress()}
      {renderQuickActions()}
    </div>
  );
}
