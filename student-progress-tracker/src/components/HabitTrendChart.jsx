import React from "react";
import ReactECharts from "echarts-for-react";

/*
────────────────────────────────────────────
COLOR PALETTES (AS YOU DECIDED)
────────────────────────────────────────────
*/

// Positive habit colors (order matters)
const POSITIVE_COLORS = [
  "#4B0082", // Deep Indigo
  "#10B981", // Emerald
  "#00E5FF", // Neon Blue
  "#C850C0", // Mulberry
  "#3B2F2F", // Black Coffee
  "#F64A8A", // French Rose
  "#9CA3AF", // Grey
];

// Negative habit colors (red spectrum only)
const NEGATIVE_COLORS = [
  "#DC2626",
  "#EF4444",
  "#F87171",
  "#FB7185",
  "#991B1B",
];

export default function HabitTrendChart({ title, habits, type }) {
  if (!habits || habits.length === 0) return null;

  const days = habits[0].progress.length;
  const xAxisData = Array.from({ length: days }, (_, i) => i + 1);

  const palette = type === "positive" ? POSITIVE_COLORS : NEGATIVE_COLORS;

  /*
  ────────────────────────────────────────────
  SERIES (ONE CURVED LINE PER HABIT)
  ────────────────────────────────────────────
  */
  const series = habits.map((habit, index) => ({
    name: habit.name,
    type: "line",
    smooth: true,
    showSymbol: false,
    data: habit.progress.map(v => (v ? 100 : 0)),

    lineStyle: {
      width: 3,
      color: palette[index % palette.length],
    },

    areaStyle: {
      opacity: 0.25,
      color: palette[index % palette.length],
    },

    // 🔥 HOVER / FOCUS LOGIC
    emphasis: {
      focus: "series",
      lineStyle: {
        width: 4,
      },
    },

    // 🔥 FADE OTHER LINES
    blur: {
      lineStyle: {
        opacity: 0.1,
      },
      areaStyle: {
        opacity: 0.05,
      },
    },
  }));

  /*
  ────────────────────────────────────────────
  ECHART CONFIG
  ────────────────────────────────────────────
  */
  const option = {
    backgroundColor: "transparent",

    tooltip: {
      trigger: "axis",
      backgroundColor: "#0F172A",
      borderColor: "#334155",
      textStyle: { color: "#E5E7EB" },
    },

    legend: {
      data: habits.map(h => h.name),
      top: 0,
      selectedMode: "multiple",
      textStyle: { color: "#CBD5F5" },
      inactiveColor: "#475569",
    },

    grid: {
      left: "5%",
      right: "5%",
      top: "18%",
      bottom: "10%",
      containLabel: true,
    },

    xAxis: {
      type: "category",
      data: xAxisData,
      boundaryGap: false,
      axisLine: {
        lineStyle: { color: "#000000" }, // black base
      },
      axisLabel: {
        color: "#94A3B8",
      },
    },

    yAxis: {
      type: "value",
      min: 0,
      max: 100,
      axisLine: {
        lineStyle: { color: "#000000" }, // black base
      },
      axisLabel: {
        formatter: "{value}%",
        color: "#94A3B8",
      },
      splitLine: {
        lineStyle: {
          color: "rgba(255,255,255,0.06)",
        },
      },
    },

    series,
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6">
      <h3 className="text-sm text-slate-400 mb-4">{title}</h3>

      <ReactECharts
        option={option}
        style={{ height: "260px", width: "100%" }}
      />
    </div>
  );
}
