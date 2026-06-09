import React, { useMemo } from "react";

export default function AIReviewer({ todos }) {
  const analysis = useMemo(() => {
    if (todos.length === 0) {
      return {
        percent: 0,
        sections: [],
        verdict: "Nothing planned. Nothing done. Very efficient at doing nothing.",
      };
    }

    const completed = todos.filter(t => t.completed).length;
    const percent = Math.round((completed / todos.length) * 100);

    const sections = todos.map(todo => {
      let feedback = "";

      if (!todo.completed && todo.priority === "important") {
        feedback =
          "You marked this as important and still skipped it. That says more than the checkbox ever could.";
      } else if (!todo.completed && todo.priority === "extra") {
        feedback =
          "Optional task left untouched. That’s fine, unless too many days start looking like this.";
      } else if (todo.completed && todo.time) {
        feedback =
          `Completed in ${todo.time}. Focus was present. This one earns respect.`;
      } else if (todo.completed && !todo.time) {
        feedback =
          "You finished it, but didn’t track time. Results matter, but discipline likes receipts.";
      } else {
        feedback =
          "This task existed. That’s about all that happened here.";
      }

      return {
        title: `${todo.text} (${todo.priority})`,
        feedback,
      };
    });

    let verdict = "";
    if (percent === 100) {
      verdict =
        "Everything completed. No excuses today. This is how momentum is built.";
    } else if (percent >= 60) {
      verdict =
        "Decent output. Some priorities slipped, but effort was visible.";
    } else if (percent >= 30) {
      verdict =
        "Productivity showed up selectively. Comfort zones were visited frequently.";
    } else {
      verdict =
        "This wasn’t a workday. This was activity-shaped procrastination.";
    }

    return { percent, sections, verdict };
  }, [todos]);

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl">
      <h2 className="text-lg font-semibold mb-4">
        AI Daily Review · {analysis.percent}% Completed
      </h2>

      <div className="space-y-5 text-sm">
        {analysis.sections.map((item, idx) => (
          <div key={idx}>
            <div className="font-medium text-slate-200 mb-1">
              {item.title}
            </div>
            <div className="text-slate-400 leading-relaxed">
              {item.feedback}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 text-slate-300">
        <span className="font-medium text-slate-200">Final Verdict:</span>{" "}
        {analysis.verdict}
      </div>
    </div>
  );
}
