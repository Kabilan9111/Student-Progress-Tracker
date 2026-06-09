import React, { useState, useEffect } from 'react';
import agentAPI from '../services/agentAPI';

/* ========================================
   MINIMAL SVG ICONS
   ======================================== */

const Icons = {
  Check: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  X: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Clock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  CheckCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  AlertCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Gmail: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  WhatsApp: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
};

/* ========================================
   AGENT PAGE COMPONENT
   ======================================== */

export default function Agent() {
  // Account connection states
  const [gmailConnected, setGmailConnected] = useState(false);
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [showOTPInput, setShowOTPInput] = useState(false);

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Data arrays
  const [waitingApprovals, setWaitingApprovals] = useState([]);
  const [submittedWorks, setSubmittedWorks] = useState([]);
  const [expiringWorks, setExpiringWorks] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = agentAPI.getToken();
      if (token) {
        try {
          const response = await agentAPI.getMe();
          if (response.success) {
            setGmailConnected(response.user.gmailConnected);
            setWhatsappConnected(response.user.whatsappConnected);
            setUserEmail(response.user.email);
            setWhatsappNumber(response.user.whatsappNumber || '');
            
            if (response.user.gmailConnected) {
              fetchData();
            }
          }
        } catch (error) {
          console.error('Failed to load user:', error);
          agentAPI.removeToken();
        }
      }
    };
    loadUser();
  }, []);

  // Gmail Login/Register
  const handleConnectGmail = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await agentAPI.login(email, password);
      
      if (response.success) {
        setGmailConnected(true);
        setUserEmail(response.user.email);
        setWhatsappConnected(response.user.whatsappConnected);
        setWhatsappNumber(response.user.whatsappNumber || '');
        setEmail('');
        setPassword('');
        setSuccess(response.message);
        
        setNotifications([
          { id: Date.now(), message: 'Gmail connected successfully', timestamp: 'Just now' },
        ]);

        // Fetch data
        fetchData();
      }
    } catch (error) {
      setError(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Disconnect Gmail
  const handleDisconnectGmail = async () => {
    setLoading(true);
    try {
      await agentAPI.disconnectGmail();
      setGmailConnected(false);
      setWaitingApprovals([]);
      setSubmittedWorks([]);
      setExpiringWorks([]);
      setNotifications([
        { id: Date.now(), message: 'Gmail disconnected', timestamp: 'Just now' },
      ]);
    } catch (error) {
      setError(error.message || 'Failed to disconnect Gmail');
    } finally {
      setLoading(false);
    }
  };

  // Send WhatsApp OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await agentAPI.sendOTP(phoneInput);

      if (response.success) {
        setShowOTPInput(true);
        setSuccess('OTP sent to your mobile number');
      } else {
        setError('Failed to send OTP');
      }
    } catch (error) {
      setError(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };
  

  // Verify WhatsApp OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await agentAPI.verifyOTP(phoneInput, otpInput);
      if (response.success) {
        setWhatsappConnected(true);
        setWhatsappNumber(phoneInput);
        setPhoneInput('');
        setOtpInput('');
        setShowOTPInput(false);
        setSuccess('WhatsApp connected successfully');
        setNotifications([
          { id: Date.now(), message: `WhatsApp linked to ${phoneInput}`, timestamp: 'Just now' },
          ...notifications,
        ]);
      }
    } catch (error) {
      setError(error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Disconnect WhatsApp
  const handleDisconnectWhatsApp = async () => {
    setLoading(true);
    try {
      await agentAPI.disconnectWhatsApp();
      setWhatsappConnected(false);
      setWhatsappNumber('');
      setNotifications([
        { id: Date.now(), message: 'WhatsApp disconnected', timestamp: 'Just now' },
        ...notifications,
      ]);
    } catch (error) {
      setError(error.message || 'Failed to disconnect WhatsApp');
    } finally {
      setLoading(false);
    }
  };

  // Reset Agent
  const handleResetAgent = async () => {
    setLoading(true);
    try {
      await agentAPI.logout();
      setGmailConnected(false);
      setWhatsappConnected(false);
      setUserEmail('');
      setWhatsappNumber('');
      setWaitingApprovals([]);
      setSubmittedWorks([]);
      setExpiringWorks([]);
      setNotifications([]);
    } catch (error) {
      console.error('Reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data (placeholder)
  const fetchData = () => {
    // Simulate fetching data after Gmail connection
    const mockOpportunities = [
      {
        id: Date.now() + 1,
        title: 'Hackathon registration pending approval',
        description: 'IEEE International Conference on Autonomous Systems',
        source: 'Gmail',
        timestamp: '2 hours ago',
      },
      {
        id: Date.now() + 2,
        title: 'Research paper submission opportunity detected',
        description: 'ACM SIGCHI Conference on Human Factors',
        source: 'Gmail',
        timestamp: '1 day ago',
      },
    ];
    setWaitingApprovals(mockOpportunities);

    const mockSubmissions = [
      {
        id: Date.now() + 1,
        title: 'Registered for IEEE Coding Challenge',
        platform: 'IEEE Conference Portal',
        timestamp: 'Feb 2, 2026 14:30',
        source: 'Gmail',
      },
      {
        id: Date.now() + 2,
        title: 'Submitted abstract for AI Symposium',
        platform: 'MIT Research Portal',
        timestamp: 'Feb 1, 2026 09:15',
        source: 'Gmail',
      },
    ];
    setSubmittedWorks(mockSubmissions);

    const mockDeadlines = [
      {
        id: Date.now() + 1,
        title: 'PPT submission due',
        description: 'Final presentation for Advanced Algorithms course',
        deadline: 'Feb 5, 2026',
        hoursLeft: 48,
        priority: 'high',
      },
      {
        id: Date.now() + 2,
        title: 'Final report upload pending',
        description: 'Machine Learning Project Documentation',
        deadline: 'Feb 7, 2026',
        hoursLeft: 96,
        priority: 'medium',
      },
    ];
    setExpiringWorks(mockDeadlines);
  };

  const handleApprove = (id) => {
    setWaitingApprovals(waitingApprovals.filter(item => item.id !== id));
    setNotifications([
      { id: Date.now(), message: `Approved item and processing registration`, timestamp: 'Just now' },
      ...notifications
    ]);
  };

  const handleIgnore = (id) => {
    setWaitingApprovals(waitingApprovals.filter(item => item.id !== id));
    setNotifications([
      { id: Date.now(), message: `Item dismissed and archived`, timestamp: 'Just now' },
      ...notifications
    ]);
  };

  return (
    <div className="w-full min-h-screen">
      {/* HEADER */}
      <div className="mb-14 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-extralight tracking-tight text-white">
              Agent
            </h1>
            <p className="text-slate-600 text-xs uppercase tracking-[0.2em] font-medium">
              Your autonomous assistant for opportunities, submissions, and approvals
            </p>
          </div>

          {/* STATUS INDICATOR & RESET BUTTON */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 px-4 py-2 bg-surface/40 border border-white/[0.04] rounded-full backdrop-blur-xl">
              <div className="relative flex items-center justify-center w-2 h-2">
                <div className="absolute w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                <div className="relative w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.6)]"></div>
              </div>
              <span className="text-[10px] font-semibold text-emerald-400 tracking-widest uppercase">
                Agent Active
              </span>
            </div>
            {(gmailConnected || whatsappConnected) && (
              <button
                onClick={handleResetAgent}
                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold rounded-lg transition-all duration-300"
              >
                Reset Agent
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ERROR/SUCCESS MESSAGES */}
      {(error || success) && (
        <div className="mb-8 animate-fade-in">
          <div className={`glass-panel p-5 border-l-2 ${error ? 'border-rose-500/50' : 'border-emerald-500/50'}`}>
            <p className={`text-sm ${error ? 'text-rose-400' : 'text-emerald-400'}`}>
              {error || success}
            </p>
          </div>
        </div>
      )}

      {/* CONNECT ACCOUNTS PANEL */}
      {(!gmailConnected && !whatsappConnected) ? (
        <div className="mb-10 animate-fade-in delay-100">
          <div className="glass-panel p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-light tracking-tight text-white mb-2">
                Connect Your Accounts
              </h2>
              <p className="text-slate-600 text-xs uppercase tracking-[0.15em]">
                Link your accounts to enable autonomous agent capabilities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gmail Integration */}
              <div className="p-6 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Icons.Gmail />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-white">Gmail</h3>
                    <p className="text-[10px] text-slate-600 uppercase tracking-wider">OAuth Integration</p>
                  </div>
                </div>
                {gmailConnected ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                      <Icons.CheckCircle />
                      <span className="text-sm font-semibold text-emerald-400">Connected ✓</span>
                    </div>
                    <button
                      onClick={handleDisconnectGmail}
                      className="px-4 py-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-slate-400 hover:text-slate-300 text-sm font-semibold rounded-lg transition-all duration-300"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleConnectGmail} className="space-y-3">
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] text-white placeholder-slate-600 text-sm rounded-lg focus:outline-none focus:border-emerald-500/50 transition-all duration-300"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] text-white placeholder-slate-600 text-sm rounded-lg focus:outline-none focus:border-emerald-500/50 transition-all duration-300"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-4 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-semibold rounded-lg transition-all duration-300 disabled:opacity-50"
                    >
                      {loading ? 'Loading...' : 'Login / Create Account'}
                    </button>
                  </form>
                )}
              </div>

              {/* WhatsApp Integration */}
              <div className="p-6 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                    <Icons.WhatsApp />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-white">WhatsApp</h3>
                    <p className="text-[10px] text-slate-600 uppercase tracking-wider">Notification Alerts</p>
                  </div>
                </div>
                {whatsappConnected ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                      <Icons.CheckCircle />
                      <span className="text-sm font-semibold text-emerald-400">Connected ✓</span>
                    </div>
                    <button
                      onClick={handleDisconnectWhatsApp}
                      className="px-4 py-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-slate-400 hover:text-slate-300 text-sm font-semibold rounded-lg transition-all duration-300"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {!showOTPInput ? (
                      <form onSubmit={handleSendOTP} className="space-y-3">
                        <input
                          type="tel"
                          placeholder="Enter phone number"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] text-white placeholder-slate-600 text-sm rounded-lg focus:outline-none focus:border-cyan-500/50 transition-all duration-300"
                        />
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full px-4 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-semibold rounded-lg transition-all duration-300 disabled:opacity-50"
                        >
                          {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyOTP} className="space-y-3">
                        <input
                          type="text"
                          placeholder="Enter OTP"
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value)}
                          required
                          maxLength="6"
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] text-white placeholder-slate-600 text-sm rounded-lg focus:outline-none focus:border-cyan-500/50 transition-all duration-300"
                        />
                        
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full px-4 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-semibold rounded-lg transition-all duration-300 disabled:opacity-50"
                        >
                          {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* NOTIFICATIONS BANNER */}
      {notifications.length > 0 && (
        <div className="mb-8 animate-fade-in delay-100">
          <div className="glass-panel p-5 border-l-2 border-emerald-500/50">
            <div className="flex items-start gap-4">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icons.CheckCircle />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-300 leading-relaxed">
                  {notifications[0].message}
                </p>
                <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-wider">
                  {notifications[0].timestamp}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* THREE CORE PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PANEL 1: WAITING FOR APPROVAL */}
        <div className="glass-panel p-8 flex flex-col animate-fade-in delay-200">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Icons.Clock />
              </div>
              <h2 className="text-lg font-medium text-white tracking-wide">Waiting for Approval</h2>
            </div>
            <p className="text-[10px] text-slate-600 uppercase tracking-[0.15em]">
              Things that need manual permission
            </p>
          </div>

          {/* Items */}
          <div className="space-y-4 flex-1">
            {waitingApprovals.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-slate-600 text-center italic">
                  No approvals pending.<br />Agent is monitoring.
                </p>
              </div>
            ) : (
              waitingApprovals.map((item) => (
                <div
                  key={item.id}
                  className="p-5 bg-white/[0.02] border border-white/[0.04] hover:border-amber-500/20 rounded-xl transition-all duration-300"
                >
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-white leading-snug mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-600 uppercase tracking-wider">
                        Source: {item.source}
                      </span>
                      <span className="text-slate-600">
                        {item.timestamp}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button 
                        onClick={() => handleApprove(item.id)}
                        className="flex-1 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Icons.Check />
                        Approve
                      </button>
                      <button 
                        onClick={() => handleIgnore(item.id)}
                        className="flex-1 px-3 py-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-slate-500 hover:text-slate-400 text-xs font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Icons.X />
                        Ignore
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PANEL 2: SUBMITTED WORKS */}
        <div className="glass-panel p-8 flex flex-col animate-fade-in delay-300">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Icons.CheckCircle />
              </div>
              <h2 className="text-lg font-medium text-white tracking-wide">Submitted Works</h2>
            </div>
            <p className="text-[10px] text-slate-600 uppercase tracking-[0.15em]">
              Things agent has already handled
            </p>
          </div>

          <div className="space-y-4 flex-1 max-h-[600px] overflow-y-auto pr-2">
            {submittedWorks.length === 0 ? (
              <div className="h-full flex items-center justify-center py-20">
                <p className="text-sm text-slate-600 text-center italic">
                  No submissions yet.<br />Connect accounts to start.
                </p>
              </div>
            ) : (
              submittedWorks.map((item) => (
                <div
                  key={item.id}
                  className="p-5 bg-white/[0.02] border border-white/[0.04] hover:border-emerald-500/20 rounded-xl transition-all duration-300"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-sm font-medium text-white leading-snug flex-1">
                        {item.title}
                      </h4>
                      <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-md flex-shrink-0">
                        <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                          Submitted
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500">
                      {item.platform}
                    </p>

                    <div className="flex items-center justify-between text-[10px] pt-1">
                      <span className="text-slate-600 uppercase tracking-wider">
                        Source: {item.source}
                      </span>
                      <span className="text-slate-600 font-mono">
                        {item.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PANEL 3: WORK GOING TO EXPIRE */}
        <div className="glass-panel p-8 flex flex-col animate-fade-in delay-400">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                <Icons.AlertCircle />
              </div>
              <h2 className="text-lg font-medium text-white tracking-wide">Work Going to Expire</h2>
            </div>
            <p className="text-[10px] text-slate-600 uppercase tracking-[0.15em]">
              Deadlines I must act on
            </p>
          </div>

          <div className="space-y-4 flex-1">
            {expiringWorks.length === 0 ? (
              <div className="h-full flex items-center justify-center py-20">
                <p className="text-sm text-slate-600 text-center italic">
                  Nothing expiring.<br />You're all caught up!
                </p>
              </div>
            ) : (
              expiringWorks.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 border rounded-xl transition-all duration-300 ${
                    item.priority === 'high'
                      ? 'bg-rose-500/[0.05] border-rose-500/30 hover:border-rose-500/50'
                      : 'bg-white/[0.02] border-white/[0.04] hover:border-rose-500/20'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className={`text-sm font-medium leading-snug flex-1 ${
                        item.priority === 'high' ? 'text-rose-400' : 'text-white'
                      }`}>
                        {item.title}
                      </h4>
                      <div className={`px-2 py-0.5 rounded-md flex-shrink-0 ${
                        item.priority === 'high'
                          ? 'bg-rose-500/20 border border-rose-500/40'
                          : 'bg-rose-500/10 border border-rose-500/30'
                      }`}>
                        <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider">
                          {Math.floor(item.hoursLeft / 24)}d
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] pt-1">
                      <span className="text-slate-600 font-mono">
                        {item.deadline}
                      </span>
                      <span className={`font-semibold ${
                        item.priority === 'high' ? 'text-rose-400' : 'text-rose-500'
                      }`}>
                        {item.hoursLeft}h remaining
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
