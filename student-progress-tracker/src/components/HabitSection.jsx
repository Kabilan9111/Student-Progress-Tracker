import React, { useEffect, useState } from "react";
import HabitTrendChart from "./HabitTrendChart";
import { useAppData } from "../context/AppDataContext";

/* ---------- HELPERS ---------- */
function getMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${date.getMonth() + 1}`;
}

function getDaysInMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

/* ---------- CIRCULAR PROGRESS ---------- */
function ProgressRing({ value, color }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width="70" height="70">
      <circle
        cx="35"
        cy="35"
        r={radius}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="6"
        fill="none"
      />
      <circle
        cx="35"
        cy="35"
        r={radius}
        stroke={color}
        strokeWidth="6"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 35 35)"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="6"
        fontSize="12"
        fill="#fff"
      >
        {value}%
      </text>
    </svg>
  );
}

/* ---------- DAY CARD ---------- */
function DayCard({ day, habits, theme, toggle }) {
  const completed = habits.filter(h => h.progress[day]).length;
  const percent =
    habits.length === 0 ? 0 : Math.round((completed / habits.length) * 100);

  const color = theme === "positive" ? "#10b981" : "#ef4444";
  const accent =
    theme === "positive" ? "accent-emerald-500" : "accent-red-500";

  return (
    <div className="min-w-[260px] bg-white/10 backdrop-blur-xl rounded-2xl p-4 hover:scale-[1.02] transition">
      <h3 className="text-center font-semibold mb-3">Day {day + 1}</h3>

      <div className="flex justify-center mb-4">
        <ProgressRing value={percent} color={color} />
      </div>

      <div className="space-y-2">
        {habits.map((habit, i) => (
          <label key={i} className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={habit.progress[day]}
              onChange={() => toggle(i, day)}
              className={`w-5 h-5 ${accent}`}
            />
            <span>{habit.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

/* ---------- MAIN ---------- */
export default function HabitSection() {
  const today = new Date();
  const monthKey = getMonthKey(today);
  const daysInMonth = getDaysInMonth(today);

  const [positiveHabits, setPositiveHabits] = useState([]);
  const [negativeHabits, setNegativeHabits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [habitName, setHabitName] = useState("");
  const [habitType, setHabitType] = useState("positive");
  const { setHabits } = useAppData();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("habitData") || "{}");
    if (!data[monthKey]) {
      data[monthKey] = { positive: [], negative: [] };
      localStorage.setItem("habitData", JSON.stringify(data));
    }
    setPositiveHabits(data[monthKey].positive);
    setNegativeHabits(data[monthKey].negative);
  }, [monthKey]);

  useEffect(() => {
  const todayIndex = new Date().getDate() - 1;

  const todayHabits = [
    ...positiveHabits,
    ...negativeHabits,
  ].map(h => ({
    title: h.name,
    completed: h.progress[todayIndex],
    date: new Date().toISOString().split("T")[0],
  }));

  setHabits(todayHabits);
}, [positiveHabits, negativeHabits, setHabits]);

  const saveHabits = type => {
    const data = JSON.parse(localStorage.getItem("habitData") || "{}");
    data[monthKey] = {
      positive: type === "positive" ? positiveHabits : data[monthKey].positive,
      negative: type === "negative" ? negativeHabits : data[monthKey].negative,
    };
    localStorage.setItem("habitData", JSON.stringify(data));
    alert("Habits saved");
  };

  const addHabit = () => {
    if (!habitName.trim()) return;

    const habit = {
      name: habitName,
      progress: Array(daysInMonth).fill(false),
    };

    habitType === "positive"
      ? setPositiveHabits([...positiveHabits, habit])
      : setNegativeHabits([...negativeHabits, habit]);

    setHabitName("");
    setShowModal(false);
  };

  const toggle = (type, habitIndex, dayIndex) => {
    const list = type === "positive" ? [...positiveHabits] : [...negativeHabits];
    list[habitIndex].progress[dayIndex] =
      !list[habitIndex].progress[dayIndex];
    type === "positive" ? setPositiveHabits(list) : setNegativeHabits(list);
  };

  return (
    <div className="min-h-screen px-10 py-8 space-y-16">
      <h1 className="text-3xl font-semibold">Habits</h1>

      <button
        onClick={() => setShowModal(true)}
        className="px-5 py-2 bg-emerald-500 rounded-xl font-medium"
      >
        Add Habit
      </button>

      {/* POSITIVE */}
      <section>
        <h2 className="text-xl font-semibold text-emerald-400 mb-4">
          Positive Habits
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {Array.from({ length: daysInMonth }).map((_, day) => (
            <DayCard
              key={day}
              day={day}
              habits={positiveHabits}
              theme="positive"
              toggle={(h, d) => toggle("positive", h, d)}
            />
          ))}
        </div>

        <button
          onClick={() => saveHabits("positive")}
          className="mt-4 px-8 py-3 bg-emerald-500 rounded-xl font-semibold"
        >
          Save Habits
        </button>
      </section>

      {/* NEGATIVE */}
      <section>
        <h2 className="text-xl font-semibold text-red-400 mb-4">
          Negative Habits
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {Array.from({ length: daysInMonth }).map((_, day) => (
            <DayCard
              key={day}
              day={day}
              habits={negativeHabits}
              theme="negative"
              toggle={(h, d) => toggle("negative", h, d)}
            />
          ))}
        </div>

        <button
          onClick={() => saveHabits("negative")}
          className="mt-4 px-8 py-3 bg-red-500 rounded-xl font-semibold"
        >
          Save Habits
        </button>
      </section>

      {/* 📈 APACHE ECHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/10">
        <HabitTrendChart
          title="Positive Habit Trend"
          habits={positiveHabits}
          type="positive"
        />
        <HabitTrendChart
          title="Negative Habit Trend"
          habits={negativeHabits}
          type="negative"
        />
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-slate-900 p-6 rounded-xl w-[320px]">
            <h3 className="font-semibold mb-3">Add Habit</h3>

            <input
              value={habitName}
              onChange={e => setHabitName(e.target.value)}
              placeholder="Habit name"
              className="w-full px-3 py-2 mb-3 rounded bg-slate-800"
            />

            <select
              value={habitType}
              onChange={e => setHabitType(e.target.value)}
              className="w-full mb-4 px-3 py-2 bg-slate-800 rounded"
            >
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={addHabit}
                className="px-4 py-2 bg-emerald-500 rounded font-semibold"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
