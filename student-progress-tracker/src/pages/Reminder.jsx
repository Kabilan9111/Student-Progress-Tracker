import React, { useEffect, useMemo, useState, useRef } from "react";
import { useAppData } from "../context/AppDataContext";

/* ---------------- HELPERS ---------------- */
function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const SLOTS = [
  "09:00","09:30","10:00","10:30","11:00",
  "11:30","12:00","14:00","14:30","15:00",
  "15:30","16:00","16:30","17:00", "17:30",
  "18:00","18:30","19:00","19:30","20:00",
  "20:30","21:00","21:30","22:00","22:30",
  "23:00","23:30","00:00","00:30","01:00",
];

const STORAGE_KEY = "persistent_reminders";

/* ---------------- COMPONENT ---------------- */
export default function Reminder() {
  const now = new Date();
  const timerRef = useRef(null);
  const midnightRef = useRef(null);

  const [viewMonth, setViewMonth] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(now);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [title, setTitle] = useState("");
  const [activeEventId, setActiveEventId] = useState(null);

  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? JSON.parse(saved).map(r => ({ ...r, dateObj: new Date(r.dateObj) }))
      : [];
  });

  const [countdown, setCountdown] = useState(null);
  const [nextEvent, setNextEvent] = useState(null);
  const { setReminders: syncReminders } = useAppData();

  const dateKey = d =>
    `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

  /* ---------------- PERSIST ---------------- */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  }, [reminders]);
  useEffect(() => {
    syncReminders(reminders);
  }, [reminders, syncReminders]);

  /* ---------------- AUTO MONTH SWITCH ---------------- */
  useEffect(() => {
    midnightRef.current = setInterval(() => {
      const now = new Date();
      setViewMonth(new Date(now.getFullYear(), now.getMonth(), 1));
      setSelectedDate(now);
    }, 60000);
    return () => clearInterval(midnightRef.current);
  }, []);

  /* ---------------- CALENDAR GRID ---------------- */
  const days = useMemo(() => {
    const start = startOfMonth(viewMonth);
    const end = endOfMonth(viewMonth);
    const grid = [];
    for (let i = 0; i < start.getDay(); i++) grid.push(null);
    for (let d = 1; d <= end.getDate(); d++) {
      grid.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d));
    }
    while (grid.length % 7 !== 0) grid.push(null);
    return grid;
  }, [viewMonth]);

  /* ---------------- ADD REMINDER ---------------- */
  function addReminder() {
    if (!selectedSlot || !title.trim()) return;

    const [h, m] = selectedSlot.split(":").map(Number);

    setReminders(r => [
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        slot: selectedSlot,
        notes: "",
        completed: false,
        dateKey: dateKey(selectedDate),
        dateObj: new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          h,
          m
        )
      },
      ...r
    ]);

    setTitle("");
    setSelectedSlot(null);
  }

  /* ---------------- COUNTDOWN ---------------- */
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const now = new Date();

      const updated = reminders.map(r => ({
        ...r,
        completed: r.dateObj < now
      }));

      setReminders(updated);

      const upcoming = updated.filter(r => r.dateObj > now);
      if (!upcoming.length) {
        setCountdown(null);
        setNextEvent(null);
        return;
      }

      const next = upcoming.sort((a, b) => a.dateObj - b.dateObj)[0];
      setNextEvent(next);

      const diff = next.dateObj - now;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      setCountdown(
        `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`
      );
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [reminders]);

  const monthReminders = reminders.filter(r =>
    r.dateKey.startsWith(
      `${viewMonth.getFullYear()}-${String(viewMonth.getMonth()+1).padStart(2,"0")}`
    )
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-slate-100 px-10 pt-10">

      <h1 className="text-3xl font-semibold mb-10">Reminders</h1>

      <div className="relative h-[520px]">

        {/* CALENDAR */}
        <div className="absolute left-0 top-0 w-[320px] z-30 rounded-3xl bg-white/15 backdrop-blur-xl p-5 shadow-xl">
          <div className="grid grid-cols-7 text-xs mb-2">
            {weekdays.map(d => <div key={d} className="text-center">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {days.map((d,i) => (
              <button
                key={i}
                onClick={() => d && setSelectedDate(d)}
                className={`h-9 rounded-xl ${
                  !d ? "invisible" :
                  dateKey(d) === dateKey(selectedDate)
                    ? "bg-emerald-400 text-black"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {d?.getDate()}
              </button>
            ))}
          </div>
        </div>

        {/* SLOTS — FIXED */}
        <div className="absolute left-[260px] top-[80px] w-[520px] h-[420px] z-20 rounded-3xl bg-white/15 backdrop-blur-2xl shadow-xl flex flex-col">

          <div className="p-6 pb-3 border-b border-white/10">
            <h2>Available Slots</h2>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6">
            <div className="grid grid-cols-4 gap-3">
              {SLOTS.map(slot => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2 rounded-xl ${
                    selectedSlot === slot
                      ? "bg-emerald-400 text-black"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 pt-4 border-t border-white/10 bg-black/20 rounded-b-3xl">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-black/30 mb-3"
              placeholder="Reminder title"
            />
            <button
              onClick={addReminder}
              className="w-full py-2 rounded-xl bg-emerald-500 text-black font-semibold"
            >
              Add Reminder
            </button>
          </div>
        </div>

        {/* COUNTDOWN */}
        <div className="absolute left-[720px] top-[180px] w-[240px] z-10 rounded-2xl bg-white/10 p-4 text-center shadow-xl">
          {countdown && nextEvent && (
            <>
              <div className="text-xs mb-1">Next Event In</div>
              <div className="text-2xl font-mono text-emerald-300">{countdown}</div>
              <div className="text-xs mt-1">{nextEvent.title}</div>
            </>
          )}
        </div>

        {/* EVENTS */}
        <div className="absolute right-0 top-[40px] w-[300px] z-20 rounded-3xl bg-white/10 p-5 shadow-xl">
          <h2 className="mb-3">Your Events</h2>

          {monthReminders.map(r => (
            <div
              key={r.id}
              onClick={() => setActiveEventId(prev => prev === r.id ? null : r.id)}
              className="bg-white/10 rounded-xl p-3 mb-2 cursor-pointer"
            >
              <div className={r.completed ? "line-through text-slate-400" : ""}>
                {r.title}
              </div>
              <div className="text-xs">{r.dateKey} • {r.slot}</div>

              {activeEventId === r.id && (
                <textarea
                  className="w-full mt-3 p-2 rounded-xl bg-black/30 text-sm"
                  placeholder="Event notes..."
                  value={r.notes}
                  onClick={e => e.stopPropagation()}
                  onChange={e =>
                    setReminders(list =>
                      list.map(ev =>
                        ev.id === r.id ? { ...ev, notes: e.target.value } : ev
                      )
                    )
                  }
                />
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
