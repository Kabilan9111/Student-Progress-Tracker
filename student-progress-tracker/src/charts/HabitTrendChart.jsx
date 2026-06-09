import React from "react";
import ReactECharts from "echarts-for-react";

export default function HabitTrendChart({ habits, mode }) {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const series = habits.map(habit => ({
    name: habit.name,
    type: "line",
    smooth: true,
    showSymbol: false,
    lineStyle: { width: 3 },
    data: habit.progress.map(v => (v ? 100 : 10)), // lift baseline
  }));

  const visualMap =
    mode === "positive"
      ? {
          show: false,
          dimension: 1,
          pieces: [
            { gt: 50, color: "#22c55e" }, // done → green
            { lte: 50, color: "#ef4444" }, // missed → red
          ],
        }
      : {
          show: false,
          dimension: 1,
          pieces: [
            { gt: 50, color: "#ef4444" }, // negative done → red
            { lte: 50, color: "#3b82f6" }, // avoided → blue
          ],
        };

  const option = {
    tooltip: { trigger: "axis" },
    legend: { textStyle: { color: "#cbd5f5" } },
    grid: { left: 40, right: 20, top: 30, bottom: 40 },
    xAxis: {
      type: "category",
      data: days,
      axisLabel: { color: "#94a3b8" },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 110,
      axisLabel: { color: "#94a3b8" },
    },
    visualMap,
    series,
  };

  return <ReactECharts option={option} style={{ height: 320 }} />;
}
