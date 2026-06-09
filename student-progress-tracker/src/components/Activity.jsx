import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { getVerdict } from "../ml/verdictEngine";

/* ---------- HELPERS ---------- */
function getMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${date.getMonth() + 1}`;
}

export default function ActivitySection() {
  const [positiveHabits, setPositiveHabits] = useState([]);
  const [negativeHabits, setNegativeHabits] = useState([]);
  const [verdicts, setVerdicts] = useState([]);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  /* ---------- LOAD HABITS ---------- */
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("habitData") || "{}");
    const monthKey = getMonthKey(new Date());
    if (!data[monthKey]) return;

    setPositiveHabits(data[monthKey].positive || []);
    setNegativeHabits(data[monthKey].negative || []);
  }, []);

  /* ---------- VERDICTS ---------- */
  useEffect(() => {
    const allHabits = [...positiveHabits, ...negativeHabits];
    if (!allHabits.length) return;

    setVerdicts(
      allHabits.map(habit => {
        const validDays = habit.progress.filter(v => v !== undefined);
        const completed = validDays.filter(Boolean).length;
        const percentage = validDays.length
          ? Math.round((completed / validDays.length) * 100)
          : 0;

        return {
          name: habit.name,
          percentage,
          verdict: getVerdict({
            percentage,
            isInconsistent: false,
            inconsistencyCount: 0,
            phaseAtBreak: null,
          }),
        };
      })
    );
  }, [positiveHabits, negativeHabits]);

  /* ============================================================
     ✅ POSITIVE HABIT — STEP GRAPH (UNCHANGED)
     ============================================================ */
  const buildPositiveStepSeries = habits => {
    if (!habits.length) return [];

    const total = habits.length;
    const points = [];

    for (let day = 0; day < 31; day++) {
      let interacted = false;
      let done = 0;

      habits.forEach(h => {
        if (h.progress[day] === true || h.progress[day] === false) {
          interacted = true;
          if (h.progress[day]) done++;
        }
      });

      if (!interacted) break;

      points.push({
        index: day,
        value: Math.round((done / total) * 100),
      });
    }

    if (!points.length) return [];

    const series = [];

    series.push({
      type: "line",
      step: "end",
      showSymbol: false,
      data: [
        [0, points[0].value],
        [1, points[0].value],
      ],
      lineStyle: { width: 3, color: "#22c55e" },
      emphasis: { disabled: true },
    });

    for (let i = 0; i < points.length - 1; i++) {
      const x = points[i + 1].index;
      const y1 = points[i].value;
      const y2 = points[i + 1].value;

      if (y2 !== y1) {
        series.push({
          type: "line",
          showSymbol: false,
          data: [
            [x, y1],
            [x, y2],
          ],
          lineStyle: {
            width: 3,
            color: y2 < y1 ? "#ef4444" : "#22c55e",
          },
          emphasis: { disabled: true },
        });
      }

      series.push({
        type: "line",
        step: "end",
        showSymbol: false,
        data: [
          [x, y2],
          [x + 1, y2],
        ],
        lineStyle: { width: 3, color: "#22c55e" },
        emphasis: { disabled: true },
      });
    }

    return series;
  };

  /* ============================================================
     🔥 NEGATIVE HABIT — DAY 1 + COLOR LOGIC FIXED
     ============================================================ */
  const buildNegativeSegmentedSeries = habits => {
    if (!habits.length) return [];

    const series = [];

    habits.forEach(habit => {
      const points = [];

      for (let day = 0; day < 31; day++) {
        if (habit.progress[day] === true || habit.progress[day] === false) {
          points.push({
            index: day, // category index (0 = Day 1)
            value: habit.progress[day] ? 100 : 0,
          });
        } else {
          break;
        }
      }

      if (!points.length) return;

      // Anchor from Day 1
      series.push({
        type: "line",
        step: "end",
        showSymbol: false,
        data: [
          [0, points[0].value],
          [1, points[0].value],
        ],
        lineStyle: {
          width: 3,
          color: points[0].value === 100 ? "#ef4444" : "#3b82f6",
        },
        emphasis: { disabled: true },
      });

      for (let i = 0; i < points.length - 1; i++) {
        const x = points[i + 1].index;
        const y1 = points[i].value;
        const y2 = points[i + 1].value;

        if (y1 !== y2) {
          series.push({
            type: "line",
            showSymbol: false,
            data: [
              [x, y1],
              [x, y2],
            ],
            lineStyle: {
              width: 3,
              color: y2 > y1 ? "#ef4444" : "#3b82f6",
            },
            emphasis: { disabled: true },
          });
        }

        series.push({
          type: "line",
          step: "end",
          showSymbol: false,
          data: [
            [x, y2],
            [x + 1, y2],
          ],
          lineStyle: {
            width: 3,
            color: y2 === 100 ? "#ef4444" : "#3b82f6",
          },
          emphasis: { disabled: true },
        });
      }
    });

    return series;
  };

  /* ---------- BASE LINE OPTION ---------- */
  const baseLineOption = series => ({
    tooltip: { trigger: "axis" },
    grid: { left: 50, right: 20, top: 30, bottom: 40 },
    xAxis: {
      type: "category",
      data: days,
      axisLabel: { color: "#94a3b8" },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 100,
      axisLabel: { color: "#94a3b8" },
      splitLine: { lineStyle: { color: "#1e293b" } },
    },
    series,
  });

  /* ---------- PIE ---------- */
  const buildPieData = habits =>
    habits.map(h => ({
      name: h.name,
      value: Math.round(
        (h.progress.filter(Boolean).length /
          h.progress.filter(v => v !== undefined).length) *
          100
      ),
    }));

  const basePieOption = data => ({
    tooltip: { trigger: "item" },
    legend: {
      orient: "vertical",
      left: "left",
      textStyle: { color: "#cbd5f5" },
    },
    series: [{ type: "pie", radius: "60%", data }],
  });

  /* ======================= RENDER ======================= */
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-14">
      <h1 className="text-3xl font-semibold">Activity</h1>

      <div className="bg-slate-900/50 rounded-2xl p-6">
        <h2 className="mb-4 font-semibold text-emerald-400">
          Positive Habit Activity
        </h2>
        <ReactECharts
          option={baseLineOption(buildPositiveStepSeries(positiveHabits))}
          style={{ height: 320 }}
        />
      </div>

      <div className="bg-slate-900/50 rounded-2xl p-6">
        <h2 className="mb-4 font-semibold text-red-400">
          Negative Habit Activity
        </h2>
        <ReactECharts
          option={baseLineOption(buildNegativeSegmentedSeries(negativeHabits))}
          style={{ height: 320 }}
        />
      </div>

      <div className="bg-slate-900/50 rounded-2xl p-6">
        <h2 className="mb-4 font-semibold">Positive Focus Distribution</h2>
        <ReactECharts
          option={basePieOption(buildPieData(positiveHabits))}
          style={{ height: 280 }}
        />
      </div>

      <div className="bg-slate-900/50 rounded-2xl p-6">
        <h2 className="mb-4 font-semibold">Negative Focus Distribution</h2>
        <ReactECharts
          option={basePieOption(buildPieData(negativeHabits))}
          style={{ height: 280 }}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Discipline Verdicts</h2>
        {verdicts.map(v => (
          <div
            key={v.name}
            className="bg-slate-800/60 p-4 rounded-xl border border-slate-700"
          >
            <div className="font-semibold text-slate-200">
              {v.name} ({v.percentage}%)
            </div>
            <div className="text-emerald-400 mt-1">{v.verdict}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
