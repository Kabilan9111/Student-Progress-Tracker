import React, { useEffect, useState } from 'react'
import LineChart from '../components/LineChart'
import BarChart from '../components/BarChart'
import ProgressCard from '../components/ProgressCard'

/* ---------- HELPERS ---------- */
const avg = arr =>
  arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0

function getMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${date.getMonth() + 1}`
}

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate()
}

function monthLabel(key) {
  const [y, m] = key.split('-').map(Number)
  return new Date(y, m - 1).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  })
}

/* ---------- COMPONENT ---------- */
export default function ProgressTracker() {
  const [activeTab, setActiveTab] = useState('monthly')
  const [monthKey, setMonthKey] = useState(getMonthKey())
  const [positiveHabits, setPositiveHabits] = useState([])
  const [negativeHabits, setNegativeHabits] = useState([])
  const [selectedWeek, setSelectedWeek] = useState(0)

  /* ---------- LOAD HABITS ---------- */
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('habitData') || '{}')
    const monthData = data[monthKey]
    setPositiveHabits(monthData?.positive || [])
    setNegativeHabits(monthData?.negative || [])
  }, [monthKey])

  /* ---------- DATE INFO ---------- */
  const [year, month] = monthKey.split('-').map(Number)
  const daysInMonth = getDaysInMonth(year, month)
  const dayLabels = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  /* ---------- DAILY % ---------- */
  const positiveDaily = dayLabels.map((_, d) =>
    positiveHabits.length
      ? Math.round(
          (positiveHabits.filter(h => h.progress[d]).length /
            positiveHabits.length) *
            100
        )
      : 0
  )

  const negativeDaily = dayLabels.map((_, d) =>
    negativeHabits.length
      ? Math.round(
          (negativeHabits.filter(h => h.progress[d]).length /
            negativeHabits.length) *
            100
        )
      : 0
  )

  /* ---------- WEEKLY DERIVATION ---------- */
  const weeks = []
  for (let i = 0; i < daysInMonth; i += 7) {
    weeks.push({
      positive: positiveDaily.slice(i, i + 7),
      negative: negativeDaily.slice(i, i + 7),
    })
  }

  const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const currentWeek = weeks[selectedWeek] || { positive: [], negative: [] }

  const weeklyAvg = avg(currentWeek.positive)
  const maxVal = Math.max(...currentWeek.positive, 0)
  const minVal = Math.min(...currentWeek.positive, 100)

  const mostProductiveDay =
    weekLabels[currentWeek.positive.indexOf(maxVal)] || '-'
  const mostDistractedDay =
    weekLabels[currentWeek.positive.indexOf(minVal)] || '-'

  /* ---------- BAR DATA (MONTHLY) ---------- */
  const positiveBar = positiveHabits.map(h => ({
    name: h.name,
    value: Math.round(
      (h.progress.filter(Boolean).length / daysInMonth) * 100
    ),
  }))

  const negativeBar = negativeHabits.map(h => ({
    name: h.name,
    value: Math.round(
      (h.progress.filter(Boolean).length / daysInMonth) * 100
    ),
  }))

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Progress Tracker</h1>
          <p className="text-slate-400">
            All analytics are derived from your habit check-ins
          </p>
        </div>

        <select
          value={monthKey}
          onChange={e => setMonthKey(e.target.value)}
          className="bg-slate-800 text-slate-200 px-4 py-2 rounded"
        >
          {Object.keys(JSON.parse(localStorage.getItem('habitData') || {}))
            .slice(-12)
            .map(m => (
              <option key={m} value={m}>
                {monthLabel(m)}
              </option>
            ))}
        </select>
      </header>

      {/* TABS */}
      <div className="flex gap-8 border-b border-slate-700 mb-10">
        {['monthly', 'weekly', 'yearly'].map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`pb-3 text-lg font-medium ${
              activeTab === t
                ? 'text-white border-b-4 border-black'
                : 'text-slate-400'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)} Progress
          </button>
        ))}
      </div>

      {/* ================= MONTHLY ================= */}
      {activeTab === 'monthly' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <section className="lg:col-span-3 space-y-8">
            <LineChart
              labels={dayLabels}
              values={positiveDaily}
              title="Positive Habit Consistency (%)"
            />

            <LineChart
              labels={dayLabels}
              values={negativeDaily}
              title="Negative Habit Frequency (%)"
            />

            <BarChart
              labels={positiveBar.map(h => h.name)}
              values={positiveBar.map(h => h.value)}
              title="Positive Habit Performance"
            />

            <BarChart
              labels={negativeBar.map(h => h.name)}
              values={negativeBar.map(h => h.value)}
              title="Negative Habit Performance"
            />
          </section>

          <aside className="space-y-6">
            <ProgressCard
              title="Monthly Positive Score"
              percent={avg(positiveDaily)}
              items={positiveBar}
            />

            <ProgressCard
              title="Monthly Negative Control"
              percent={100 - avg(negativeDaily)}
              items={negativeBar}
            />
          </aside>
        </div>
      )}

      {/* ================= WEEKLY ================= */}
      {activeTab === 'weekly' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <section className="lg:col-span-3 space-y-6">
            <select
              value={selectedWeek}
              onChange={e => setSelectedWeek(Number(e.target.value))}
              className="bg-slate-800 text-slate-200 px-4 py-2 rounded w-40"
            >
              {weeks.map((_, i) => (
                <option key={i} value={i}>
                  Week {i + 1}
                </option>
              ))}
            </select>

            <LineChart
              labels={weekLabels}
              values={currentWeek.positive}
              title="Positive Habit Consistency (%)"
            />

            <LineChart
              labels={weekLabels}
              values={currentWeek.negative}
              title="Negative Habit Frequency (%)"
            />
          </section>

          <aside className="space-y-4">
            <StatCard title="Weekly Avg Score" value={`${weeklyAvg}%`} />
            <StatCard
              title="Most Productive Day"
              value={`${mostProductiveDay} (${maxVal}%)`}
            />
            <StatCard
              title="Most Distracted Day"
              value={`${mostDistractedDay} (${minVal}%)`}
            />

            <div className="bg-slate-900/60 rounded-2xl p-4">
              <p className="text-sm text-slate-400 mb-3">Daily Breakdown</p>
              {currentWeek.positive.map((v, i) => (
                <div key={i} className="flex justify-between text-sm py-1">
                  <span>{weekLabels[i]}</span>
                  <span className="font-semibold">{v}%</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}

      {/* ================= YEARLY ================= */}
      {activeTab === 'yearly' && (
        <div className="bg-slate-900/60 rounded-2xl p-6">
          <p className="text-slate-400">
            Yearly analytics will aggregate month-wise habit progress.
          </p>
        </div>
      )}
    </div>
  )
}

/* ---------- SMALL CARD ---------- */
function StatCard({ title, value }) {
  return (
    <div className="bg-slate-900/60 rounded-2xl p-5 shadow-lg">
      <p className="text-slate-400 text-sm">{title}</p>
      <p className="text-2xl font-semibold text-slate-100">{value}</p>
    </div>
  )
}
