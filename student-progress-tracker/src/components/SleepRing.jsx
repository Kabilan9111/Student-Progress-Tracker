import React from "react";
import ReactECharts from "echarts-for-react";

export default function SleepRing({ hours, mins }) {
  const total = hours * 60 + mins;
  const goal = 8 * 60; // 8 hours target

  const option = {
    backgroundColor: "transparent",
    series: [
      {
        type: "pie",
        radius: ["70%", "85%"],
        silent: true,
        label: { show: false },
        data: [
          {
            value: total,
            itemStyle: { color: "#3b82f6" }
          },
          {
            value: Math.max(goal - total, 0),
            itemStyle: { color: "rgba(255,255,255,0.08)" }
          }
        ]
      }
    ]
  };

  return (
    <div className="relative w-28 h-28">
      <ReactECharts option={option} style={{ height: "100%" }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-sm">
        <div className="font-semibold">{hours}h {mins}m</div>
        <div className="text-xs text-slate-400">Sleep</div>
      </div>
    </div>
  );
}
