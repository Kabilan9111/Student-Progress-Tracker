import React, { useEffect } from 'react';

export default function IntroAnimation({ name, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // Animation duration

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <h1 className="text-4xl font-bold text-slate-100 animate-fade-in">
        Welcome, {name}
      </h1>
    </div>
  );
}