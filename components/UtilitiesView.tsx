
import React, { useState, useEffect } from 'react';
import { UtilityStatus, ConsumptionData } from '../types';
import { Icons } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type Timeframe = 'daily' | 'weekly' | 'monthly';

interface UtilitiesViewProps {
  data: any; // Using extended mock data structure
}

const energyTips = [
  "Sänk innetemperaturen med en grad för att spara 5% energi.",
  "Tvätta i 40 grader istället för 60 när det är möjligt.",
  "Använd vattenkokare istället för spisen när du kokar vatten.",
  "Se till att tätningslister runt fönster och dörrar är hela.",
  "Duscha några minuter kortare för att spara både vatten och el.",
  "Släck lampor i rum där ingen vistas.",
  "Fyll alltid tvätt- och diskmaskinen helt innan start."
];

const AnimatedTips: React.FC = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const [animationClass, setAnimationClass] = useState('translate-x-0 opacity-100');

  useEffect(() => {
    const interval = setInterval(() => {
      // Phase 1: Slide out to the left
      setAnimationClass('-translate-x-8 opacity-0');
      
      setTimeout(() => {
        // Phase 2: Update content and reset position to the right (invisible)
        setCurrentTip((prev) => (prev + 1) % energyTips.length);
        setAnimationClass('translate-x-8 opacity-0');
        
        // Phase 3: Slide in from the right
        setTimeout(() => {
          setAnimationClass('translate-x-0 opacity-100');
        }, 50);
      }, 400); // Duration of slide out
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-amber-950/30 to-orange-950/20 p-5 rounded-3xl border border-amber-900/40 shadow-xl relative overflow-hidden group">
      <div className="absolute -top-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12">
        <Icons.Electricity className="w-24 h-24 text-amber-500" />
      </div>
      
      <div className="flex flex-col space-y-3">
        <div className="flex items-center space-x-2">
          <div className="bg-amber-500/20 p-1.5 rounded-lg border border-amber-500/30">
            <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Dagens Spartips</h4>
        </div>

        <div className="relative h-14 overflow-hidden">
          <p className={`text-sm text-slate-200 font-medium leading-relaxed transition-all duration-400 ease-out transform ${animationClass}`}>
            {energyTips[currentTip]}
          </p>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center space-x-1.5 pt-1">
          {energyTips.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1 rounded-full transition-all duration-500 ${
                idx === currentTip ? 'w-5 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'w-1 bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const UtilitiesView: React.FC<UtilitiesViewProps> = ({ data }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('daily');

  const getActiveData = (utility: 'electricity' | 'water'): ConsumptionData[] => {
    const key = timeframe === 'daily' ? 'dailyData' : timeframe === 'weekly' ? 'weeklyData' : 'monthlyData';
    return data[utility][key] || [];
  };

  const getUnit = (utility: 'electricity' | 'water') => utility === 'electricity' ? 'kWh' : 'L';
  const getChartColor = (utility: 'electricity' | 'water') => utility === 'electricity' ? '#60a5fa' : '#22d3ee';
  const getChartBg = (utility: 'electricity' | 'water') => utility === 'electricity' ? '#1e293b' : '#1e293b';

  const TimeframeToggle = () => (
    <div className="flex bg-slate-900 p-1 rounded-xl w-fit border border-slate-800 shadow-inner">
      {(['daily', 'weekly', 'monthly'] as Timeframe[]).map((tf) => (
        <button
          key={tf}
          onClick={() => setTimeframe(tf)}
          className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
            timeframe === tf ? 'bg-slate-800 shadow-md text-blue-400' : 'text-slate-500'
          }`}
        >
          {tf === 'daily' ? 'Dag' : tf === 'weekly' ? 'Vecka' : 'Månad'}
        </button>
      ))}
    </div>
  );

  return (
    <div className="pb-24 pt-6 px-4 space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Förbrukning</h1>
          <p className="text-slate-400 text-sm">Följ dina trender</p>
        </div>
        <TimeframeToggle />
      </header>

      {/* Animated Tips Carousel */}
      <AnimatedTips />

      {/* Electricity Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-900/30 p-2 rounded-lg text-blue-400 border border-blue-900/30">
              <Icons.Electricity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Elförbrukning</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{data.electricity.provider}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-slate-100">
              {Math.round(getActiveData('electricity').reduce((acc, curr) => acc + curr.value, 0) / getActiveData('electricity').length)} {getUnit('electricity')}
            </p>
            <p className="text-xs text-slate-500">Snitt / {timeframe === 'daily' ? 'dag' : timeframe === 'weekly' ? 'vecka' : 'mån'}</p>
          </div>
        </div>
        
        <div className="bg-slate-900 p-4 rounded-2xl shadow-lg border border-slate-800 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getActiveData('electricity')}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#64748b'}} />
              <YAxis hide />
              <Tooltip 
                cursor={{fill: '#0f172a'}}
                contentStyle={{backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)'}}
                itemStyle={{color: '#f1f5f9'}}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {getActiveData('electricity').map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === getActiveData('electricity').length - 1 ? getChartColor('electricity') : getChartBg('electricity')} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Water Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-cyan-900/30 p-2 rounded-lg text-cyan-400 border border-cyan-900/30">
              <Icons.Water className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Vattenförbrukning</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{data.water.provider}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-slate-100">
              {Math.round(getActiveData('water').reduce((acc, curr) => acc + curr.value, 0) / getActiveData('water').length)} {getUnit('water')}
            </p>
            <p className="text-xs text-slate-500">Snitt / {timeframe === 'daily' ? 'dag' : timeframe === 'weekly' ? 'vecka' : 'mån'}</p>
          </div>
        </div>
        
        <div className="bg-slate-900 p-4 rounded-2xl shadow-lg border border-slate-800 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getActiveData('water')}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#64748b'}} />
              <YAxis hide />
              <Tooltip 
                cursor={{fill: '#0f172a'}}
                contentStyle={{backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)'}}
                itemStyle={{color: '#f1f5f9'}}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {getActiveData('water').map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === getActiveData('water').length - 1 ? getChartColor('water') : getChartBg('water')} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default UtilitiesView;
