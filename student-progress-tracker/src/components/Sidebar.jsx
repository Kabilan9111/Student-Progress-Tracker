import React from 'react';
import { NavLink } from 'react-router-dom';

/* Premium Minimalist SVG Icons */
const Icons = {
  Home: () => <path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />,
  Grid: () => <path d='M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z' />,
  Activity: () => <path d='M22 12h-4l-3 9L9 3l-3 9H2' />,
  Check: () => <path d='M9 11l3 3L22 4' />,
  Clock: () => <><circle cx='12' cy='12' r='10' /><path d='M12 6v6l4 2' /></>,
  Chart: () => <path d='M18 20V10M12 20V4M6 20v-6' />,
  Settings: () => <><circle cx='12' cy='12' r='3' /><path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' /></>,
  User: () => <><path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' /><circle cx='12' cy='7' r='4' /></>,
  List: () => <><line x1='8' y1='6' x2='21' y2='6' /><line x1='8' y1='12' x2='21' y2='12' /><line x1='8' y1='18' x2='21' y2='18' /><line x1='3' y1='6' x2='3.01' y2='6' /><line x1='3' y1='12' x2='3.01' y2='12' /><line x1='3' y1='18' x2='3.01' y2='18' /></>,
  Bot: () => <><rect x='3' y='11' width='18' height='10' rx='2' /><circle cx='8' cy='15' r='1' /><circle cx='16' cy='15' r='1' /><path d='M9 6l3-3 3 3' /><path d='M12 3v8' /></>,
  Timetable: () => <><rect x='3' y='4' width='18' height='18' rx='2' ry='2' /><line x1='16' y1='2' x2='16' y2='6' /><line x1='8' y1='2' x2='8' y2='6' /><line x1='3' y1='10' x2='21' y2='10' /><circle cx='12' cy='16' r='2' /></>
};

export default function Sidebar() {
  const links = [
    { to: '/home', icon: Icons.Home, label: 'Home' },
    { to: '/', icon: Icons.Grid, label: 'Dashboard' },
    { to: '/timetable', icon: Icons.Timetable, label: 'Timetable' },
    { to: '/habits', icon: Icons.List, label: 'Habits' },
    { to: '/activity', icon: Icons.Activity, label: 'Activity' },
    { to: '/progress', icon: Icons.Chart, label: 'Progress' },
    { to: '/reminders', icon: Icons.Clock, label: 'Reminders' },
    { to: '/todo', icon: Icons.Check, label: 'ToDo' },
    { to: '/agent', icon: Icons.Bot, label: 'Agent' },
    { to: '/settings', icon: Icons.Settings, label: 'Settings' },
  ];

  return (
    <aside className='h-screen w-[88px] flex-shrink-0 flex flex-col items-center py-10 z-50 bg-[#060606]/80 backdrop-blur-2xl border-r border-white/[0.04]'>
      
      {/* Brand - Abstract Monolith */}
      <div className='mb-16 group relative cursor-pointer'>
        <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(6,182,212,0.5)]'></div>
        <div className='absolute inset-0 bg-white mix-blend-overlay opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-500'></div>
      </div>

      <nav className='flex-1 flex flex-col gap-6 w-full items-center'>
        {links.map((link) => {
          const Icon = link.icon;
          const isTimetable = link.to === '/timetable';
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-500 group ${
                  isActive 
                    ? `bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.05] shadow-inner ${isTimetable ? 'text-cyan-400' : 'text-emerald-400'}`
                    : 'text-slate-500 hover:text-white hover:bg-white/[0.03]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20' // Slightly smaller for elegance
                    height='20'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={isActive ? '2' : '1.5'}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className={`transition-all duration-500 ${isActive ? `scale-100 ${isTimetable ? 'drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]' : 'drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]'}` : 'group-hover:scale-110'}`}
                  >
                    <Icon />
                  </svg>
                  
                  {/* Subtle Indicator Line for Active State */}
                  {isActive && (
                    <div className={`absolute left-[-22px] w-[3px] h-6 rounded-r-full shadow-[0_0_15px_rgba(16,185,129,1)] transition-all duration-300 ${isTimetable ? 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)]' : 'bg-emerald-500'}`}></div>
                  )}
                  
                  {/* Hover Tooltip - Floating Glass */}
                  <div className='absolute left-16 pl-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 pointer-events-none z-50'>
                    <div className='px-3 py-1.5 bg-[#121212]/90 backdrop-blur-md border border-white/10 rounded-lg shadow-xl'>
                      <span className='text-[11px] font-medium tracking-wide text-white whitespace-nowrap'>{link.label}</span>
                    </div>
                  </div>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
      
      {/* Profile - Minimalist */}
      <div className='mt-auto mb-4 cursor-pointer group'>
         <div className='w-10 h-10 rounded-full bg-surface-highlight border border-white/5 flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:text-white group-hover:border-white/20 transition-all duration-300 shadow-lg'>
             LEO
         </div>
      </div>
    </aside>
  );
}

