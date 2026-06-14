import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

export default function LeftPanels({ hasTimetable, onAddTimetable, focusPulse, tasks = [] }) {
  // Mock Calendar
  const renderCalendar = () => {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const dates = Array.from({ length: 30 }, (_, i) => i + 1);
    
    return (
      <div className='p-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl backdrop-blur-md mb-6'>
        <div className='flex justify-between items-center mb-4'>
          <button className='text-slate-500 hover:text-white'>{'<'}</button>
          <span className='text-xs font-bold tracking-widest text-white'>JUNE 2026</span>
          <button className='text-slate-500 hover:text-white'>{'>'}</button>
        </div>
        <div className='grid grid-cols-7 gap-2 mb-2'>
          {days.map((d, i) => (
            <div key={i} className='text-center text-[10px] text-slate-500 font-semibold'>{d}</div>
          ))}
        </div>
        <div className='grid grid-cols-7 gap-2'>
          {dates.map(d => {
            const isToday = d === 14; // Mock today
            return (
              <div 
                key={d} 
                className={`text-center text-xs py-1 rounded-full cursor-pointer transition-all duration-300 ${
                  isToday 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.3)]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {d}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderFocusPulse = () => {
    // Generate an array that trends towards the current focusPulse
    const fp = focusPulse || 0;
    const mockTrend = [Math.max(0, fp - 20), Math.max(0, fp - 10), Math.max(0, fp - 15), Math.max(0, fp - 5), Math.min(100, fp + 5), Math.max(0, fp - 2), fp];

    const data = {
      labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      datasets: [
        {
          fill: true,
          label: 'Focus Pulse',
          data: mockTrend,
          borderColor: '#22d3ee', // Cyan 400
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 150);
            gradient.addColorStop(0, 'rgba(34, 211, 238, 0.4)');
            gradient.addColorStop(1, 'rgba(34, 211, 238, 0)');
            return gradient;
          },
          borderWidth: 2,
          pointBackgroundColor: '#22d3ee',
          pointBorderColor: '#000',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.4,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleColor: '#fff',
          bodyColor: '#22d3ee',
          borderColor: 'rgba(34, 211, 238, 0.2)',
          borderWidth: 1,
        }
      },
      scales: {
        x: { display: false },
        y: { display: false, min: 0, max: 100 }
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
    };

    return (
      <div className='p-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl backdrop-blur-md mb-6 relative overflow-hidden group'>
        <div className='absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none'></div>
        <h3 className='text-[10px] font-bold tracking-widest text-slate-400 mb-1'>FOCUS PULSE</h3>
        <div className='flex items-baseline gap-2 mb-4'>
          <span className='text-4xl font-light text-white'>{hasTimetable ? fp : '--'}</span>
          <span className='text-cyan-400 text-sm'>%</span>
        </div>
        <p className='text-xs text-slate-500 mb-4'>{hasTimetable ? (fp > 75 ? 'Right on track' : 'Needs attention') : 'No data available'}</p>
        <div className='h-[80px] w-full'>
          <Line data={data} options={options} />
        </div>
      </div>
    );
  };

  const renderTodaysMission = () => {
    // Top 3 highest priority tasks
    const priorityWeights = { high: 3, medium: 2, low: 1, break: 0 };
    const missionTasks = [...tasks]
      .filter(t => t.priority !== 'break')
      .sort((a, b) => priorityWeights[b.priority] - priorityWeights[a.priority])
      .slice(0, 3);
      
    const completedMissions = missionTasks.filter(t => t.completed).length;
    const missionProgress = missionTasks.length > 0 ? Math.round((completedMissions / missionTasks.length) * 100) : 0;
    const strokeDashoffset = 100 - missionProgress;

    return (
      <div className='p-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl backdrop-blur-md mb-6'>
        <h3 className='text-[10px] font-bold tracking-widest text-slate-400 mb-4'>TODAY'S MISSION</h3>
        {hasTimetable && missionTasks.length > 0 ? (
          <>
            <ul className='flex flex-col gap-2 mb-6'>
              {missionTasks.map(t => (
                <li key={t.id} className='text-xs flex items-center gap-2'>
                  <div className={`w-1.5 h-1.5 rounded-full ${t.completed ? 'bg-cyan-400 shadow-[0_0_5px_#22d3ee]' : 'bg-slate-600'}`}></div>
                  <span className={`${t.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{t.title}</span>
                </li>
              ))}
            </ul>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-full border-2 border-cyan-500/30 flex items-center justify-center relative'>
                {/* SVG Circle Progress */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-white/5" />
                  <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="2" fill="transparent" strokeDasharray="100" strokeDashoffset={strokeDashoffset} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all duration-500" />
                </svg>
                <span className='text-[10px] font-bold text-white relative z-10'>{missionProgress}%</span>
              </div>
              <span className='text-xs text-slate-400 font-medium tracking-wide'>Mission Progress</span>
            </div>
          </>
        ) : (
          <p className='text-xs text-slate-500 italic'>No tasks planned</p>
        )}
      </div>
    );
  };

  const renderEmptyStateCard = () => {
    if (hasTimetable) return null;
    return (
      <div className='p-8 bg-gradient-to-br from-white/[0.04] to-transparent border border-white/[0.05] rounded-3xl backdrop-blur-xl flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-[0_8px_32px_rgba(0,0,0,0.5)]'>
        <div className='absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none'></div>
        
        {/* Abstract Calendar Icon */}
        <div className='w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center mb-6 relative group-hover:scale-110 transition-transform duration-500'>
          <div className='absolute top-3 left-1/2 -translate-x-1/2 flex gap-1.5'>
            <div className='w-1 h-2 bg-slate-600 rounded-full'></div>
            <div className='w-1 h-2 bg-slate-600 rounded-full'></div>
          </div>
          <div className='grid grid-cols-3 gap-1 mt-2'>
            <div className='w-1.5 h-1.5 rounded-sm bg-slate-700'></div>
            <div className='w-1.5 h-1.5 rounded-sm bg-slate-700'></div>
            <div className='w-1.5 h-1.5 rounded-sm bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]'></div>
            <div className='w-1.5 h-1.5 rounded-sm bg-slate-700'></div>
            <div className='w-1.5 h-1.5 rounded-sm bg-slate-700'></div>
            <div className='w-1.5 h-1.5 rounded-sm bg-slate-700'></div>
          </div>
        </div>

        <h3 className='text-white font-medium mb-2'>No timetable created yet!</h3>
        <p className='text-xs text-slate-400 mb-8 leading-relaxed max-w-[200px]'>
          Plan your day by adding your first time block.
        </p>

        <button 
          onClick={onAddTimetable}
          className='relative w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 text-cyan-300 text-sm font-medium hover:from-cyan-500/30 hover:to-emerald-500/30 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]'
        >
          + Add Timetable
        </button>
      </div>
    );
  };

  return (
    <div className='flex flex-col w-full h-full'>
      {renderCalendar()}
      {renderFocusPulse()}
      {renderTodaysMission()}
      {renderEmptyStateCard()}
    </div>
  );
}
