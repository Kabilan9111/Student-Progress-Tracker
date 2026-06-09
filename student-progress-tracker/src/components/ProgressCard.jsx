import React from 'react'

function ProgressRing({ percent = 0, size = 160, stroke = 14 }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <div className="w-full flex justify-center">
      <svg width={size} height={size} className="block">
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          {/* 🔴 Unfinished (background) */}
          <circle
            r={radius}
            fill="transparent"
            stroke="#ef4444"
            strokeWidth={stroke}
          />

          {/* 🟢 Completed */}
          <circle
            r={radius}
            fill="transparent"
            stroke="#34d399"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90)"
          />

          <text
            x="0"
            y="6"
            textAnchor="middle"
            fontSize="22"
            fill="#e6fffa"
            fontWeight="700"
          >
            {Math.round(percent)}%
          </text>
        </g>
      </svg>
    </div>
  )
}

function HabitBar({ value = 0 }) {
  return (
    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
      <div
        className="h-2 rounded-full bg-emerald-400"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

export default function ProgressCard({ title = 'Overall', percent = 72, items = [] }) {
  return (
    <div className="bg-slate-900/60 p-5 rounded-2xl shadow-lg text-slate-200">
      <div className="flex flex-col items-center gap-4">
        <div className="w-full text-center">
          <div className="text-sm font-semibold text-slate-200">{title}</div>
          <div className="text-xs text-slate-400">
            Monthly emotional score
          </div>
        </div>

        <ProgressRing percent={percent} />

        <div className="w-full mt-2">
          <div className="grid grid-cols-1 gap-3">
            {items.map((t, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {t.name}
                  </div>
                  <div className="mt-1">
                    <HabitBar value={t.value} />
                  </div>
                </div>
                <div className="w-16 text-right text-sm font-semibold text-slate-200">
                  {t.value}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
