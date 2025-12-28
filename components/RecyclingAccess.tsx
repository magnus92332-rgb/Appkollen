
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';
import { WasteSchedule } from '../types';

interface RecyclingAccessProps {
  wasteSchedule: WasteSchedule[];
  onUpdateSchedule: (schedules: WasteSchedule[]) => void;
}

const RecyclingAccess: React.FC<RecyclingAccessProps> = ({ wasteSchedule, onUpdateSchedule }) => {
  const [activeTab, setActiveTab] = useState<'access' | 'schedule'>('access');
  const [qrValue, setQrValue] = useState('HC-PRO-TEMP-TOKEN-' + Math.random().toString(36).substr(2, 9));
  const [timeLeft, setTimeLeft] = useState(60);
  const [isAdding, setIsAdding] = useState(false);
  const [newWaste, setNewWaste] = useState({ type: '', date: '' });

  useEffect(() => {
    if (activeTab === 'access') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setQrValue('HC-PRO-TEMP-TOKEN-' + Math.random().toString(36).substr(2, 9));
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeTab]);

  const handleAddWaste = () => {
    if (newWaste.type && newWaste.date) {
      const todayStr = new Date().toISOString().split('T')[0];
      const status = newWaste.date === todayStr ? 'today' : 'upcoming';
      const updated = [...wasteSchedule, { type: newWaste.type, nextDate: newWaste.date, status } as WasteSchedule];
      onUpdateSchedule(updated);
      setNewWaste({ type: '', date: '' });
      setIsAdding(false);
    }
  };

  const removeWaste = (index: number) => {
    const updated = wasteSchedule.filter((_, i) => i !== index);
    onUpdateSchedule(updated);
  };

  return (
    <div className="pb-24 pt-6 px-4 space-y-6">
      <header className="flex flex-col items-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-100">Återvinning & Avfall</h1>
        
        {/* Tab Switcher */}
        <div className="bg-slate-900 p-1 rounded-xl flex w-full max-w-[280px] border border-slate-800 shadow-inner">
          <button 
            onClick={() => setActiveTab('access')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'access' ? 'bg-slate-800 shadow-lg text-blue-400' : 'text-slate-500'}`}
          >
            Digital Nyckel
          </button>
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'schedule' ? 'bg-slate-800 shadow-lg text-blue-400' : 'text-slate-500'}`}
          >
            Hämtningar
          </button>
        </div>
      </header>

      {activeTab === 'access' ? (
        <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
          <p className="text-slate-400 text-sm">Skanna koden vid miljöstationens terminal</p>
          
          <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-800 flex flex-col items-center space-y-6 max-w-xs mx-auto">
            <div className="bg-slate-100 p-6 rounded-2xl border-2 border-white shadow-inner">
              <div className="grid grid-cols-5 gap-1 w-48 h-48">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? 'bg-slate-900' : 'bg-transparent'}`}></div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2 w-full">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Koden uppdateras om {timeLeft}s</p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-blue-500 transition-all duration-1000 ease-linear shadow-[0_0_8px_rgba(59,130,246,0.6)]" 
                  style={{ width: `${(timeLeft / 60) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-blue-900/20 rounded-2xl p-6 text-left space-y-4 border border-blue-900/30">
            <h2 className="text-blue-400 font-bold flex items-center">
              <Icons.Recycling className="w-5 h-5 mr-2" />
              Närmaste stationer
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-blue-900/20">
                <div>
                  <p className="text-sm font-bold text-slate-100">Solnavägen 12</p>
                  <p className="text-xs text-slate-500">210m • Öppet till 21:00</p>
                </div>
                <Icons.ArrowRight className="w-5 h-5 text-blue-800" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-100">Ditt hämtningsschema</h2>
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="text-blue-400 bg-blue-900/20 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-900/30 hover:bg-blue-900/40 transition-colors"
            >
              {isAdding ? 'Avbryt' : 'Lägg till'}
            </button>
          </div>

          {isAdding && (
            <div className="bg-slate-900 p-4 rounded-2xl shadow-lg border border-slate-800 space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Typ av avfall</label>
                  <input 
                    type="text" 
                    placeholder="t.ex. Grovavfall"
                    className="w-full p-2 text-sm bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-blue-500 text-slate-100 placeholder-slate-600"
                    value={newWaste.type}
                    onChange={(e) => setNewWaste({ ...newWaste, type: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Nästa hämtning</label>
                  <input 
                    type="date" 
                    className="w-full p-2 text-sm bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-blue-500 text-slate-100"
                    value={newWaste.date}
                    onChange={(e) => setNewWaste({ ...newWaste, date: e.target.value })}
                  />
                </div>
              </div>
              <button 
                onClick={handleAddWaste}
                className="w-full bg-blue-600 text-white py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 active:scale-95 transition-transform"
              >
                Spara schema
              </button>
            </div>
          )}

          <div className="space-y-3">
            {wasteSchedule.length === 0 ? (
              <div className="text-center py-10 bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-800">
                <p className="text-slate-500 text-sm italic">Inga inlagda hämtningar</p>
              </div>
            ) : (
              wasteSchedule.map((waste, idx) => (
                <div key={idx} className="bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${
                      waste.status === 'today' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-900/50' : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}>
                      <Icons.Trash className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">{waste.type}</h3>
                      <p className="text-xs text-slate-400">{waste.nextDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {waste.status === 'today' && (
                      <span className="bg-emerald-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]">Idag</span>
                    )}
                    <button 
                      onClick={() => removeWaste(idx)}
                      className="p-2 text-slate-600 hover:text-red-400 transition-colors"
                    >
                      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
            <p className="text-[10px] text-slate-500 leading-relaxed italic">
              * Appen skickar automatiskt notiser kvällen innan en planerad hämtning. Om du har bytt kärltyp, vänligen uppdatera schemat ovan.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecyclingAccess;
