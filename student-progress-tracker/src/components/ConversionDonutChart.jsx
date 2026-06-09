import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

/* ============================
   FIXED COLOR PALETTE
   ============================ */
const FIXED_COLORS = {
  ml: "#8b5cf6",          // Purple
  dsa: "#a21caf",         // Mulberry
  "soft skills": "#1e3a8a", // Dark blue (indigo-900 vibe)
  gym: "#2dd4bf",         // Teal-Emerald
  masterbate: "#dc2626",  // Deep Red
};

/* ============================
   RED SHADE GENERATOR (NEGATIVE)
   ============================ */
function redShadeFromName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const lightness = 45 + (Math.abs(hash) % 20); // 45–65%
  return `hsl(0, 75%, ${lightness}%)`;
}

/* ============================
   CENTER TEXT PLUGIN
   ============================ */
const centerTextPlugin = {
  id: "centerText",
  beforeDraw(chart) {
    const { ctx, width, height } = chart;
    ctx.save();

    ctx.font = "600 14px Inter";
    ctx.fillStyle = "#c7d2fe";
    ctx.textAlign = "center";
    ctx.fillText("Habits", width / 2, height / 2 - 4);

    ctx.font = "400 12px Inter";
    ctx.fillStyle = "rgba(148,163,184,0.8)";
    ctx.fillText("Conversion rate", width / 2, height / 2 + 14);

    ctx.restore();
  },
};

/* ============================
   COMPONENT
   ============================ */
export default function ConversionDonutChart() {
  const { labels, values, colors } = useMemo(() => {
    const data = JSON.parse(
      localStorage.getItem("habitData") || "{}"
    );

    const monthKey = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;
    const monthData = data[monthKey] || { positive: [], negative: [] };

    const labels = [];
    const values = [];
    const colors = [];

    /* ---------- POSITIVE HABITS ---------- */
    monthData.positive.forEach(habit => {
      const completed = habit.progress.filter(Boolean).length;
      const total = habit.progress.length;
      const percent = total ? Math.round((completed / total) * 100) : 0;

      const key = habit.name.toLowerCase();

      labels.push(habit.name);
      values.push(percent);

      colors.push(
        FIXED_COLORS[key] || "#7c3aed" // fallback purple
      );
    });

    /* ---------- NEGATIVE HABITS ---------- */
    monthData.negative.forEach(habit => {
      const completed = habit.progress.filter(Boolean).length;
      const total = habit.progress.length;
      const percent = total ? Math.round((completed / total) * 100) : 0;

      const key = habit.name.toLowerCase();

      labels.push(habit.name);
      values.push(percent);

      colors.push(
        FIXED_COLORS[key] || redShadeFromName(habit.name)
      );
    });

    return { labels, values, colors };
  }, []);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#020617",
        borderColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
        padding: 10,
        titleColor: "#e5e7eb",
        bodyColor: "#c7d2fe",
        displayColors: false,
        callbacks: {
          label: ctx => ` ${ctx.raw}% consistency`,
        },
      },
    },
  };

  return (
    <div className="h-[220px] w-full flex items-center justify-center">
      {values.length === 0 ? (
        <p className="text-slate-400 text-sm">
          No habits found for this month
        </p>
      ) : (
        <Doughnut
          data={data}
          options={options}
          plugins={[centerTextPlugin]}
        />
      )}
    </div>
  );
}
