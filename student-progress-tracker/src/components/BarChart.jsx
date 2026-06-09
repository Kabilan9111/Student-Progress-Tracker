import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function BarChart({ labels, values, title = 'Monthly Breakdown' }) {
  const palette = ['#22c55e', '#16a34a', '#4ade80', '#86efac', '#bbf7d0', '#34d399']
  const data = {
    labels,
    datasets: [
      {
        label: '%',
        data: values,
        backgroundColor: labels.map((_, i) => palette[i % palette.length]),
        borderRadius: 8,
        maxBarThickness: 36,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => `${ctx.parsed.y}%` } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
      y: { beginAtZero: true, max: 100, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.04)' } },
    },
  }

  return (
    <div className="bg-slate-900/60 p-5 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="text-left text-sm font-semibold text-slate-200">{title}</div>
        <div className="text-xs text-slate-400">Monthly summary</div>
      </div>
      <div style={{ height: 260 }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  )
}
