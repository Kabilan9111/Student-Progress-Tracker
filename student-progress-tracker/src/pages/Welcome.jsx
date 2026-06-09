import React, { useEffect, useState } from "react";

const messages = [
  {
    lines: [
      {
        text: "Welcome, Leo",
        className:
          "text-5xl font-semibold tracking-tight text-slate-100",
      },
      {
        text: "Discipline compounds. Consistency wins.",
        className:
          "mt-4 text-slate-400 text-lg",
      },
    ],
  },
  {
    lines: [
      {
        text: "Leo, wake up. This is your ",
        className: "text-4xl text-slate-100",
      },
      {
        text: "DO OR DIE YEAR",
        className:
          "text-4xl text-red-500 font-semibold",
      },
      {
        text: ".",
        className: "text-4xl text-slate-100",
      },
      {
        text: "Build the man they can’t ignore.",
        className:
          "mt-4 text-2xl text-red-500 italic font-serif",
      },
    ],
  },
  {
    lines: [
      {
        text: "If you want one thing badly,",
        className: "text-3xl text-slate-100",
      },
      {
        text: " you must sacrifice another.",
        className: "text-3xl text-red-500",
      },
      {
        text:
          "Remember who prayed for your success — and who waited for your failure.",
        className:
          "mt-4 text-2xl text-red-500 font-serif italic",
      },
    ],
  },
  {
    lines: [
      {
        text:
          "School is a well, College is a river, Career is the ocean.",
        className: "text-2xl text-slate-200",
      },
      {
        text:
          "Rivers offer temptation, Oceans offer choice.",
        className: "mt-3 text-2xl text-slate-200",
      },
      {
        text:
          "Wait. Build. Choose better.",
        className:
          "mt-6 text-3xl text-red-500 font-serif italic tracking-wide",
      },
      {
        text:
          "Don’t search for fish too early.",
        className:
          "mt-2 text-3xl text-red-500 font-serif italic tracking-wide",
      },
      {
        text:
          "Discipline is the price of abundance.",
        className:
          "mt-4 text-xl text-slate-400 tracking-wide",
      },
    ],
  },
];

export default function Welcome() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const flatText = messages[msgIndex].lines
    .map((l) => l.text)
    .join("");

  useEffect(() => {
    let timeout;

    if (!deleting && charIndex < flatText.length) {
      timeout = setTimeout(() => {
        setCharIndex((c) => c + 1);
      }, 70);
    } else if (!deleting && charIndex === flatText.length) {
      timeout = setTimeout(() => {
        setDeleting(true);
      }, 3500);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setCharIndex((c) => c - 1);
      }, 40);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setMsgIndex((i) => (i + 1) % messages.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, msgIndex, flatText]);

  useEffect(() => {
    const blink = setInterval(() => {
      setShowCursor((v) => !v);
    }, 500);
    return () => clearInterval(blink);
  }, []);

  let remaining = charIndex;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900 z-50">
      <div className="text-center px-6">
        {messages[msgIndex].lines.map((line, i) => {
          const visibleText = line.text.slice(0, remaining);
          remaining -= visibleText.length;

          return (
            <div key={i} className={line.className}>
              {visibleText}
            </div>
          );
        })}

        {/* CURSOR */}
        <div className="flex justify-center mt-2">
          <span
            className={`inline-block w-2 h-6 rounded-full bg-white transition-opacity ${
              showCursor ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
