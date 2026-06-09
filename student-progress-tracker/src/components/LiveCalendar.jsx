import React, { useState } from 'react';

export default function LiveCalendar() {
  const today = new Date();
  const [current] = useState(today);

  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return (
    <div className='p-6 h-full flex flex-col text-slate-300'>
      {/* Header */}
      <div className='flex justify-between items-center mb-6 pl-2 pr-2'>
          <span className='text-xs font-bold text-white uppercase tracking-[0.2em]'>
             {current.toLocaleString('default', { month: 'long' })}
          </span>
          <span className='text-xs font-mono text-slate-500 opacity-60 tracking-widest'>{year}</span>
      </div>

      <div className='grid grid-cols-7 gap-y-4 gap-x-1 text-center flex-1'>
        {/* Week Days */}
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className='text-[10px] font-bold text-slate-600 uppercase tracking-widest py-2'>{d.substring(0, 1)}</div>
        ))}

        {/* Empty Cells */}
        {Array(firstDay).fill(0).map((_, i) => (
          <div key={`e-${i}`} />
        ))}

        {/* Days */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const isToday = day === today.getDate();
          
          return (
            <div
              key={day}
              className={`
                group relative flex items-center justify-center text-xs font-medium cursor-pointer transition-all duration-300 rounded-lg h-8 w-8 mx-auto
                ${isToday 
                  ? 'text-black bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] font-bold scale-110' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white hover:scale-105'
                }
              `}
            >
              {day}
              
              {/* Event Dot Mockup */}
              {[3, 12, 18, 24].includes(day) && !isToday && (
                 <div className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-500 opacity-70 group-hover:opacity-100 transition-opacity"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

