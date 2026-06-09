// src/pages/Home.jsx
import React from "react";
import TypingWelcome from "../components/TypingWelcome";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-semibold text-slate-100">
        Welcome, Leo
      </h1>
      <p className="mt-4 text-slate-400 text-lg">
        Discipline compounds. Consistency wins.
      </p>
    </div>
  );
}
