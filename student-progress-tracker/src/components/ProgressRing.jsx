import React from 'react';

export default function ProgressRing({
  value,
  max = 100,
  size = 160,
  color = '#a855f7',
  strokeWidth = 6, // NEW: Thinner default
  children
}) {
  const safeValue = Math.max(0, Math.min(value, max));
  const percent = (safeValue / max) * 100;

  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div
      className='relative flex items-center justify-center'
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className='transform transition-all duration-1000 ease-out'>
        {/* Background Track - Darker and thinner */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke='rgba(255,255,255,0.05)'
          strokeWidth={strokeWidth}
          fill='none'
        />

        {/* Progress Circle - Glowing */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill='none'
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap='round'
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          transform="rotate(-90)"
        />
        
         {/* Optional Glue Effect for 'Premium' feel - duplicate circle with blur */}
         <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill='none'
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap='round'
          filter='url(#glow)'
          opacity='0.4'
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          transform="rotate(-90)"
        />
        
        {/* Glow Filter Definition */}
        <defs>
          <filter id='glow' x='-50%' y='-50%' width='200%' height='200%'>
            <feGaussianBlur stdDeviation='4' result='coloredBlur' />
            <feMerge>
              <feMergeNode in='coloredBlur' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* CENTER CONTENT */}
      <div className='absolute inset-0 flex items-center justify-center'>
        {children}
      </div>
    </div>
  );
}

