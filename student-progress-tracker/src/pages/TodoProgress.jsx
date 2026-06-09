import React from "react";

export default function TodoProgress({ todos }) {
  const total = todos.length;
  const completedTasks = todos.filter(t => t.completed);
  const pendingTasks = todos.filter(t => !t.completed);

  const percent =
    total === 0 ? 0 : Math.round((completedTasks.length / total) * 100);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl">
      <h3 className="text-sm text-slate-400 mb-4 text-center">
        Task Progress
      </h3>

      {/* CIRCLE */}
      <div className="relative w-40 h-40 mx-auto mb-4">
        <svg className="w-full h-full rotate-[-90deg]">
          {/* UNDONE */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#ef4444"
            strokeWidth="12"
            fill="none"
          />

          {/* DONE */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#34d399"
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={
              circumference * (1 - percent / 100)
            }
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-semibold">{percent}%</div>
          <div className="text-xs text-slate-400">Completed</div>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="text-xs text-slate-400 text-center mb-4">
        {completedTasks.length} of {total} tasks done
      </div>

      {/* LEGEND */}
      <div className="space-y-3 text-sm">
        {/* COMPLETED */}
        <div>
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Completed
          </div>
          {completedTasks.length === 0 ? (
            <div className="text-slate-500 text-xs ml-4">
              None yet
            </div>
          ) : (
            completedTasks.map(t => (
              <div key={t.id} className="ml-4 text-xs text-slate-300">
                • {t.text}
              </div>
            ))
          )}
        </div>

        {/* PENDING */}
        <div>
          <div className="flex items-center gap-2 text-red-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
            Pending
          </div>
          {pendingTasks.length === 0 ? (
            <div className="text-slate-500 text-xs ml-4">
              All done 🎯
            </div>
          ) : (
            pendingTasks.map(t => (
              <div key={t.id} className="ml-4 text-xs text-slate-300">
                • {t.text}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
