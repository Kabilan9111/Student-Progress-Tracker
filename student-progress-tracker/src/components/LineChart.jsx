import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function LineChart({ labels, values, title = 'Daily Productivity' }) {
  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        fill: false,
        tension: 0.35,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 5,
        pointBackgroundColor: '#22c55e',

        // ✅ CORRECT segment coloring (no crash)
        segment: {
          borderColor: ctx => {
            const y0 = ctx.p0?.parsed?.y
            const y1 = ctx.p1?.parsed?.y
            if (y0 === undefined || y1 === undefined) return '#22c55e'
            return y1 >= y0 ? '#22c55e' : '#ef4444'
          },
        },
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        titleColor: '#94a3b8',
        bodyColor: '#e6f4ea',
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(148,163,184,0.06)' },
        ticks: { color: '#94a3b8' },
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(148,163,184,0.04)' },
        ticks: { color: '#94a3b8' },
      },
    },
  }

  return (
    <div className="bg-slate-900/60 p-5 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="text-left text-sm font-semibold text-slate-200">
          {title}
        </div>
        <div className="text-xs text-slate-400">Daily view</div>
      </div>
      <div style={{ height: 260 }}>
        <Line data={data} options={options} />
      </div>
    </div>
  )
}
