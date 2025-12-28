
import React, { useEffect, useState } from 'react';
import { UserProfile, UtilityStatus, Message } from '../types';
import { Icons } from '../constants';
import { getEnergyAdvice } from '../services/geminiService';

interface DashboardProps {
  profile: UserProfile;
  utilities: UtilityStatus;
  messages: Message[];
}

const Dashboard: React.FC<DashboardProps> = ({ profile, utilities, messages }) => {
  const [tips, setTips] = useState<string[]>([]);
  const [loadingTips, setLoadingTips] = useState(true);

  useEffect(() => {
    const fetchTips = async () => {
      setLoadingTips(true);
      const advice = await getEnergyAdvice(utilities);
      setTips(advice);
      setLoadingTips(false);
    };
    fetchTips();
  }, [utilities]);

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="pb-24 pt-4 px-4 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Hej {profile.name}!</h1>
          <p className="text-slate-400 text-sm">{profile.address}, {profile.city}</p>
        </div>
        <div className="relative p-2 rounded-full bg-slate-900 border border-slate-800">
          <Icons.Messages className="w-6 h-6 text-slate-300" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </div>
      </header>

      {/* Main Status Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm">
          <div className="flex items-center space-x-2 text-blue-400 mb-2">
            <Icons.Electricity className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">El idag</span>
          </div>
          <p className="text-2xl font-bold text-slate-100">{utilities.electricity.currentUsage} <span className="text-sm font-normal text-slate-500">kWh</span></p>
        </div>
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm">
          <div className="flex items-center space-x-2 text-cyan-400 mb-2">
            <Icons.Water className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Vatten idag</span>
          </div>
          <p className="text-2xl font-bold text-slate-100">{utilities.water.currentUsage} <span className="text-sm font-normal text-slate-500">L</span></p>
        </div>
      </div>

      {/* Waste Reminder */}
      <div className="bg-emerald-950/30 p-4 rounded-2xl border border-emerald-900/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Icons.Trash className="w-5 h-5" />
            <span className="text-sm font-semibold">Nästa sophämtning</span>
          </div>
          <span className="text-[10px] bg-emerald-900/50 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase border border-emerald-800/50">Idag</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-slate-100">Matavfall</p>
          <p className="text-xs text-slate-400 font-medium italic">Ställ ut kärlet före kl 06:00</p>
        </div>
      </div>

      {/* AI Tips Section */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-100 flex items-center">
          <span className="bg-gradient-to-r from-purple-500 to-blue-500 w-2 h-6 rounded mr-3"></span>
          Smarta tips för ditt hem
        </h2>
        <div className="bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-800 space-y-4">
          {loadingTips ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-slate-800 rounded w-3/4"></div>
              <div className="h-4 bg-slate-800 rounded w-full"></div>
              <div className="h-4 bg-slate-800 rounded w-5/6"></div>
            </div>
          ) : (
            tips.map((tip, idx) => (
              <div key={idx} className="flex items-start space-x-3 text-slate-300 text-sm">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                <p>{tip}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Latest Messages */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-100">Senaste meddelanden</h2>
        <div className="space-y-3">
          {messages.slice(0, 2).map((msg) => (
            <div key={msg.id} className="bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-800 flex items-start space-x-4">
              <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${msg.isRead ? 'bg-slate-700' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'}`}></div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{msg.sender}</p>
                  <span className="text-[10px] text-slate-500">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-200 truncate">{msg.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{msg.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
