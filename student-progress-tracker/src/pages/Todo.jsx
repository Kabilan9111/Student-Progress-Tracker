import React, { useEffect, useState } from "react";
import TodoProgress from "./TodoProgress";
import AIReviewer from "../components/AIReviewer";

const STORAGE_KEY = "todo_items";

export default function Todo() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [text, setText] = useState("");
  const [priority, setPriority] = useState("important");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  function addTodo() {
    if (!text.trim()) return;

    setTodos([
      {
        id: crypto.randomUUID(),
        text: text.trim(),
        completed: false,
        time: "",
        priority,
      },
      ...todos,
    ]);

    setText("");
    setPriority("important");
  }

  function toggleTodo(id) {
    setTodos(todos =>
      todos.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  }

  function deleteTodo(id) {
    setTodos(todos => todos.filter(t => t.id !== id));
  }

  function updateTime(id, value) {
    setTodos(todos =>
      todos.map(t =>
        t.id === id ? { ...t, time: value } : t
      )
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-slate-100 px-10 pt-10">

      <h1 className="text-3xl font-semibold mb-8">To-Do List</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl">

        {/* TODO LIST */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl">
          <div className="flex gap-3 mb-4">
            <input
              className="flex-1 px-4 py-2 rounded-xl bg-black/30 outline-none"
              placeholder="Add a task..."
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTodo()}
            />
            <button
              onClick={addTodo}
              className="px-5 rounded-xl bg-emerald-500 text-black font-medium"
            >
              Add
            </button>
          </div>

          {/* PRIORITY SELECTOR */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setPriority("important")}
              className={`px-4 py-1 rounded-full text-sm ${
                priority === "important"
                  ? "bg-purple-500 text-white"
                  : "bg-white/10 text-slate-300"
              }`}
            >
              Important
            </button>
            <button
              onClick={() => setPriority("extra")}
              className={`px-4 py-1 rounded-full text-sm ${
                priority === "extra"
                  ? "bg-cyan-400 text-black"
                  : "bg-white/10 text-slate-300"
              }`}
            >
              Extra
            </button>
          </div>

          <div className="space-y-3">
            {todos.map(todo => (
              <div
                key={todo.id}
                className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className={todo.completed ? "line-through text-slate-400" : ""}>
                    {todo.text}
                  </span>

                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      todo.priority === "important"
                        ? "bg-purple-500/20 text-purple-300"
                        : "bg-cyan-400/20 text-cyan-300"
                    }`}
                  >
                    {todo.priority}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => toggleTodo(todo.id)} className="text-emerald-400">
                    ✓
                  </button>
                  <button onClick={() => deleteTodo(todo.id)} className="text-red-400">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVITY TIMING */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl">
          <h3 className="text-sm text-slate-400 mb-4 text-center">
            Activity Timing
          </h3>

          {todos.map(todo => (
            <div
              key={todo.id}
              className="flex justify-between items-center mb-3 bg-white/10 p-3 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <span>{todo.text}</span>

                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    todo.priority === "important"
                      ? "bg-purple-500/20 text-purple-300"
                      : "bg-cyan-400/20 text-cyan-300"
                  }`}
                >
                  {todo.priority}
                </span>
              </div>

              {/* ✅ TIME ONLY AFTER COMPLETION */}
              {todo.completed && (
                <input
                  className="w-24 bg-black/30 rounded-lg px-2 text-right"
                  placeholder="45m"
                  value={todo.time}
                  onChange={e => updateTime(todo.id, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        {/* PROGRESS */}
        <TodoProgress todos={todos} />
      </div>

      {/* AI REVIEWER */}
      <div className="mt-10 max-w-7xl">
        <AIReviewer todos={todos} />
      </div>

    </div>
  );
}
