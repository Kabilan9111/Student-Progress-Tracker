import React, { useEffect, useState } from "react";

export default function TypingWelcome({
  text = "Welcome, Leo",
  subText = "Discipline compounds. Consistency wins.",
  speed = 120,
  subSpeed = 40,
}) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // main typing
  useEffect(() => {
    if (index < text.length) {
      const t = setTimeout(() => setIndex(i => i + 1), speed);
      return () => clearTimeout(t);
    }
  }, [index, text, speed]);

  // subtext typing (starts AFTER main text)
  useEffect(() => {
    if (index === text.length && subIndex < subText.length) {
      const t = setTimeout(() => setSubIndex(i => i + 1), subSpeed);
      return () => clearTimeout(t);
    }
  }, [index, subIndex, subText, subSpeed]);

  // blinking cursor
  useEffect(() => {
    const blink = setInterval(() => {
      setShowCursor(v => !v);
    }, 500);
    return () => clearInterval(blink);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      {/* MAIN TEXT */}
      <h1 className="text-5xl font-semibold tracking-tight text-slate-100 flex items-center">
        {text.slice(0, index)}
        <span
          className={`ml-1 inline-block w-[6px] h-7 rounded-full bg-white transition-opacity ${
            showCursor ? "opacity-100" : "opacity-0"
          }`}
        />
      </h1>

      {/* SUB TEXT */}
      {index === text.length && (
        <p className="mt-4 text-slate-400 text-lg">
          {subText.slice(0, subIndex)}
        </p>
      )}
    </div>
  );
}
