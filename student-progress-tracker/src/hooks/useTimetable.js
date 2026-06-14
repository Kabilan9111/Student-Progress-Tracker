import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { triggerEndTaskAlert } from '../utils/notifications';

// Utility to parse "08:00 AM" to today's Date object for math
export const parseTimeStr = (timeStr) => {
  if (!timeStr) return new Date();
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);
  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
};

// Utility to calculate duration text (e.g., "1h 30m")
export const calculateDurationText = (startStr, endStr) => {
  const start = parseTimeStr(startStr);
  const end = parseTimeStr(endStr);
  let diffMs = end - start;
  if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000; // handle midnight wrap
  
  const totalMins = Math.floor(diffMs / 60000);
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  
  if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
  if (hrs > 0) return `${hrs}h`;
  return `${mins}m`;
};

// Format a Date object to "08:00 AM" string
export const formatTimeStr = (date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).replace(/^0/, '0'); // Some browsers don't zero pad hour 1-9
};

const defaultTasks = [
  { id: 1, title: 'Wake Up & Meditation', category: 'Health', startTime: '05:00 AM', endTime: '05:45 AM', priority: 'low', completed: false, icon: 'sun', notes: '' },
  { id: 2, title: 'Gym & Fitness', category: 'Health', startTime: '06:00 AM', endTime: '07:00 AM', priority: 'high', completed: false, icon: 'dumbbell', notes: '' },
  { id: 3, title: 'College', category: 'Academics', startTime: '08:00 AM', endTime: '02:00 PM', priority: 'high', completed: false, icon: 'graduation', notes: 'Lectures, Notes, Learn' },
  { id: 4, title: 'Deep Work on DSA', category: 'Deep Work', startTime: '02:30 PM', endTime: '05:15 PM', priority: 'high', completed: false, icon: 'code', notes: '' },
  { id: 5, title: 'Break / Snack', category: 'Breaks', startTime: '05:15 PM', endTime: '05:35 PM', priority: 'break', completed: false, icon: 'coffee', notes: '' },
  { id: 6, title: 'Project Work', category: 'Deep Work', startTime: '05:35 PM', endTime: '07:30 PM', priority: 'medium', completed: false, icon: 'folder', notes: '' },
  { id: 7, title: 'Aptitude Practice', category: 'Academics', startTime: '07:30 PM', endTime: '09:00 PM', priority: 'medium', completed: false, icon: 'brain', notes: '' },
  { id: 8, title: 'Wind Down / Reading', category: 'Personal', startTime: '09:00 PM', endTime: '10:30 PM', priority: 'medium', completed: false, icon: 'moon', notes: '' },
  { id: 9, title: 'Sleep', category: 'Health', startTime: '10:30 PM', endTime: '05:00 AM', priority: 'low', completed: false, icon: 'sleep', notes: '' },
];

export default function useTimetable() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('spt_timetable_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultTasks;
      }
    }
    return defaultTasks;
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const lastTaskRef = useRef(null);
  
  // Real-time clock tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('spt_timetable_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Ensure tasks have duration calculated
  const processedTasks = useMemo(() => {
    return tasks.map(t => ({
      ...t,
      duration: calculateDurationText(t.startTime, t.endTime),
      parsedStart: parseTimeStr(t.startTime),
      parsedEnd: parseTimeStr(t.endTime),
    })).sort((a, b) => {
       // Sort chronologically (assuming no midnight wrap for simplistic sorting, or handling it carefully)
       if (a.parsedStart.getHours() < 4) a.parsedStart.setDate(a.parsedStart.getDate() + 1);
       if (b.parsedStart.getHours() < 4) b.parsedStart.setDate(b.parsedStart.getDate() + 1);
       return a.parsedStart - b.parsedStart;
    });
  }, [tasks]);

  // Derived state: Active Task Detection
  const { currentTask, previousTask, nextTask } = useMemo(() => {
    let curr = null;
    let prev = null;
    let nxt = null;
    
    // Sort tasks logically from 4AM to 4AM next day
    const timeToValue = (dateObj) => {
      let val = dateObj.getHours() * 60 + dateObj.getMinutes();
      if (val < 4 * 60) val += 24 * 60; // Shift day boundary to 4 AM
      return val;
    };
    
    const currVal = timeToValue(currentTime);

    for (let i = 0; i < processedTasks.length; i++) {
      const t = processedTasks[i];
      const sVal = timeToValue(t.parsedStart);
      let eVal = timeToValue(t.parsedEnd);
      if (eVal <= sVal) eVal += 24 * 60; // Handle wraps like 10:30 PM to 05:00 AM

      if (currVal >= sVal && currVal < eVal) {
        curr = t;
        prev = i > 0 ? processedTasks[i - 1] : null;
        nxt = i < processedTasks.length - 1 ? processedTasks[i + 1] : null;
        break;
      } else if (sVal > currVal && !nxt) {
        // If we haven't found a current, and this is in the future
        nxt = t;
        prev = i > 0 ? processedTasks[i - 1] : null;
      }
    }
    
    // If we're past the last task
    if (!curr && !nxt && processedTasks.length > 0) {
      prev = processedTasks[processedTasks.length - 1];
    }
    
    return { currentTask: curr, previousTask: prev, nextTask: nxt };
  }, [processedTasks, currentTime]);

  // Alert when currentTask changes
  useEffect(() => {
    if (lastTaskRef.current && currentTask && lastTaskRef.current.id !== currentTask.id) {
      // The task changed! That means the old one ended.
      triggerEndTaskAlert(lastTaskRef.current.title);
    } else if (lastTaskRef.current && !currentTask && nextTask) {
       // We went from having a task to no task (break time not tracked, or gap)
       triggerEndTaskAlert(lastTaskRef.current.title);
    }
    lastTaskRef.current = currentTask;
  }, [currentTask, nextTask]);

  // Actions
  const addTask = (task) => {
    setTasks(prev => [...prev, { ...task, id: Date.now() }]);
  };

  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const duplicateTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      addTask({ ...task, title: `${task.title} (Copy)` });
    }
  };

  const toggleTaskCompletion = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) return { ...t, completed: !t.completed };
      return t;
    }));
  };

  // Basic Frontend AI Optimize logic
  const optimizeSchedule = () => {
    // A simplified algorithm: Sort by duration, group 'Deep Work', resolve overlaps linearly
    let newTasks = [...tasks];
    
    // Convert to minute offsets
    const toMins = (str) => {
      const p = parseTimeStr(str);
      let m = p.getHours() * 60 + p.getMinutes();
      if (m < 240) m += 1440; // shift 4AM boundary
      return m;
    };
    
    const toStr = (mins) => {
      let m = mins % 1440;
      const d = new Date();
      d.setHours(Math.floor(m / 60), m % 60, 0, 0);
      return formatTimeStr(d);
    };

    // Sort by start time
    newTasks.sort((a, b) => toMins(a.startTime) - toMins(b.startTime));
    
    // Fix overlaps
    for (let i = 1; i < newTasks.length; i++) {
      const prevEnd = toMins(newTasks[i-1].endTime);
      const currStart = toMins(newTasks[i].startTime);
      if (currStart < prevEnd) {
        // Shift current task forward
        const duration = toMins(newTasks[i].endTime) - currStart;
        newTasks[i].startTime = toStr(prevEnd);
        newTasks[i].endTime = toStr(prevEnd + duration);
      }
    }
    
    setTasks(newTasks);
    return true; // Indicates success
  };

  // Metrics Calculations
  const focusPulse = useMemo(() => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  }, [tasks]);

  const dayBalance = useMemo(() => {
    const categories = {
      'Deep Work': 0,
      'Academics': 0,
      'Health': 0,
      'Personal': 0,
      'Breaks': 0
    };
    
    let totalMins = 0;
    
    processedTasks.forEach(t => {
      const start = parseTimeStr(t.startTime);
      const end = parseTimeStr(t.endTime);
      let diff = (end - start) / 60000;
      if (diff < 0) diff += 1440; // midnight wrap
      
      const cat = t.category || 'Personal';
      if (categories[cat] !== undefined) {
        categories[cat] += diff;
      } else {
        categories['Personal'] += diff;
      }
      totalMins += diff;
    });

    if (totalMins === 0) return { 'Deep Work': 0, 'Academics': 0, 'Health': 0, 'Personal': 0, 'Breaks': 0 };

    Object.keys(categories).forEach(k => {
      categories[k] = Math.round((categories[k] / totalMins) * 100);
    });

    return categories;
  }, [processedTasks]);
  
  const dayProgress = useMemo(() => {
    // Sum planned time vs time elapsed in day (using 04:00 AM as start of day)
    let totalPlannedMins = 0;
    processedTasks.forEach(t => {
      const start = parseTimeStr(t.startTime);
      const end = parseTimeStr(t.endTime);
      let diff = (end - start) / 60000;
      if (diff < 0) diff += 1440;
      totalPlannedMins += diff;
    });
    
    if (totalPlannedMins === 0) return { percent: 0, text: '0h 0m' };
    
    const now = currentTime;
    let elapsedDayMins = (now.getHours() * 60 + now.getMinutes()) - (4 * 60);
    if (elapsedDayMins < 0) elapsedDayMins += 1440;
    
    let percent = Math.round((elapsedDayMins / totalPlannedMins) * 100);
    if (percent > 100) percent = 100;
    
    const hrs = Math.floor(totalPlannedMins / 60);
    const mins = totalPlannedMins % 60;
    
    return { percent, text: `${hrs}h ${mins}m` };
  }, [processedTasks, currentTime]);

  return {
    tasks: processedTasks,
    currentTime,
    currentTask,
    previousTask,
    nextTask,
    focusPulse,
    dayBalance,
    dayProgress,
    actions: {
      addTask,
      updateTask,
      deleteTask,
      duplicateTask,
      toggleTaskCompletion,
      optimizeSchedule
    }
  };
}
