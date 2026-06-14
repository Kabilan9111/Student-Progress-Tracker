import React, { useState, useEffect } from 'react';

const CATEGORIES = ['Deep Work', 'Academics', 'Health', 'Personal', 'Breaks'];
const PRIORITIES = ['high', 'medium', 'low', 'break'];
const ICONS = ['sun', 'dumbbell', 'graduation', 'code', 'coffee', 'folder', 'brain', 'moon', 'sleep'];

export default function TaskModal({ isOpen, onClose, onSave, onDelete, initialData }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Deep Work',
    startTime: '08:00 AM',
    endTime: '09:00 AM',
    priority: 'medium',
    icon: 'code',
    notes: '',
    completed: false
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        category: 'Deep Work',
        startTime: '08:00 AM',
        endTime: '09:00 AM',
        priority: 'medium',
        icon: 'code',
        notes: '',
        completed: false
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#060606]/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#0a1128] to-[#060606] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(34,211,238,0.1)] p-8 overflow-hidden">
        <h2 className="text-xl font-bold tracking-tight text-white uppercase mb-6 flex items-center gap-3">
          <div className="w-2 h-6 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
          {initialData ? 'Edit Time Block' : 'New Time Block'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1.5 block">Task Title</label>
            <input 
              required
              type="text" 
              name="title"
              value={formData.title} 
              onChange={handleChange}
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-colors"
              placeholder="e.g. Deep Work on DSA"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1.5 block">Start Time</label>
              <input 
                required
                type="text" 
                name="startTime"
                value={formData.startTime} 
                onChange={handleChange}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-colors"
                placeholder="08:00 AM"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1.5 block">End Time</label>
              <input 
                required
                type="text" 
                name="endTime"
                value={formData.endTime} 
                onChange={handleChange}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-colors"
                placeholder="09:00 AM"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1.5 block">Category</label>
              <select 
                name="category"
                value={formData.category} 
                onChange={handleChange}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-colors appearance-none"
              >
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0a1128]">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1.5 block">Priority</label>
              <select 
                name="priority"
                value={formData.priority} 
                onChange={handleChange}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-colors appearance-none"
              >
                {PRIORITIES.map(p => <option key={p} value={p} className="bg-[#0a1128]">{p}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
             <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1.5 block">Icon Identifier</label>
                <div className="flex flex-wrap gap-2">
                   {ICONS.map(ic => (
                      <button 
                         key={ic}
                         type="button"
                         onClick={() => setFormData({...formData, icon: ic})}
                         className={`px-3 py-1 text-xs rounded border transition-colors ${formData.icon === ic ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-400' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
                      >
                         {ic}
                      </button>
                   ))}
                </div>
             </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1.5 block">Description / Notes</label>
            <textarea 
              name="notes"
              value={formData.notes} 
              onChange={handleChange}
              rows="2"
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-colors resize-none"
              placeholder="Any details..."
            />
          </div>

          <div className="mt-4 flex items-center justify-end gap-4">
            {initialData && (
              <button 
                type="button"
                onClick={() => { onDelete(initialData.id); onClose(); }}
                className="text-xs text-red-400 hover:text-red-300 font-semibold tracking-wider px-4 py-2"
              >
                Delete
              </button>
            )}
            <button 
              type="button"
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white font-semibold tracking-wider px-4 py-2"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-400 text-xs font-bold tracking-widest hover:bg-cyan-500/30 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]"
            >
              Save Block
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
