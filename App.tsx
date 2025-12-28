
import React, { useState, useEffect } from 'react';
import { AppSection, UserProfile, UtilityStatus, Message, WasteSchedule } from './types';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import ProfileSetup from './components/ProfileSetup';
import UtilitiesView from './components/UtilitiesView';
import RecyclingAccess from './components/RecyclingAccess';
import { getMockMessages, getMockUtilityStatus } from './services/mockData';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.DASHBOARD);
  const [messages, setMessages] = useState<Message[]>([]);
  const [utilities, setUtilities] = useState<UtilityStatus | null>(null);

  useEffect(() => {
    // Load persisted profile if exists
    const stored = localStorage.getItem('hc_user_profile');
    if (stored) {
      setProfile(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (profile) {
      setMessages(getMockMessages(profile.address));
      const mockUtils = getMockUtilityStatus();
      
      // Check for persisted waste schedule
      const storedWaste = localStorage.getItem(`hc_waste_${profile.address}`);
      if (storedWaste) {
        mockUtils.waste = JSON.parse(storedWaste);
      }
      
      setUtilities(mockUtils);
    }
  }, [profile]);

  const handleProfileComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('hc_user_profile', JSON.stringify(newProfile));
  };

  const handleLogout = () => {
    localStorage.removeItem('hc_user_profile');
    setProfile(null);
    setActiveSection(AppSection.DASHBOARD);
  };

  const updateWasteSchedule = (newSchedules: WasteSchedule[]) => {
    if (!utilities || !profile) return;
    const updated = { ...utilities, waste: newSchedules };
    setUtilities(updated);
    localStorage.setItem(`hc_waste_${profile.address}`, JSON.stringify(newSchedules));
  };

  if (!profile) {
    return <ProfileSetup onComplete={handleProfileComplete} />;
  }

  const renderContent = () => {
    if (!utilities) return null;

    switch (activeSection) {
      case AppSection.DASHBOARD:
        return <Dashboard profile={profile} utilities={utilities} messages={messages} />;
      case AppSection.MESSAGES:
        return (
          <div className="pb-24 pt-6 px-4 space-y-4">
            <h1 className="text-2xl font-bold text-slate-100 mb-6">Meddelanden</h1>
            {messages.map(msg => (
              <div key={msg.id} className="bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-800">
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    msg.priority === 'high' ? 'bg-red-900/30 text-red-400 border border-red-900/30' : 
                    msg.priority === 'medium' ? 'bg-orange-900/30 text-orange-400 border border-orange-900/30' : 
                    'bg-blue-900/30 text-blue-400 border border-blue-900/30'
                  }`}>
                    {msg.priority === 'high' ? 'Brådskande' : msg.priority === 'medium' ? 'Viktigt' : 'Information'}
                  </span>
                  <span className="text-xs text-slate-500">{new Date(msg.timestamp).toLocaleDateString()}</span>
                </div>
                <h3 className="font-bold text-slate-200 mb-1">{msg.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{msg.body}</p>
                <p className="text-[10px] text-slate-500 mt-4 font-semibold uppercase tracking-widest">{msg.sender}</p>
              </div>
            ))}
          </div>
        );
      case AppSection.UTILITIES:
        return <UtilitiesView data={utilities} />;
      case AppSection.RECYCLING:
        return (
          <RecyclingAccess 
            wasteSchedule={utilities.waste} 
            onUpdateSchedule={updateWasteSchedule} 
          />
        );
      case AppSection.PROFILE:
        return (
          <div className="pb-24 pt-6 px-4 space-y-6">
            <h1 className="text-2xl font-bold text-slate-100">Din profil</h1>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Namn</label>
                <p className="text-lg font-semibold text-slate-100">{profile.name}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Adress</label>
                <p className="text-lg font-semibold text-slate-100">{profile.address}</p>
                <p className="text-slate-400">{profile.postalCode}, {profile.city}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full py-3 bg-red-900/20 text-red-400 font-bold rounded-xl mt-4 border border-red-900/30 active:bg-red-900/30 transition-colors"
              >
                Logga ut / Ändra adress
              </button>
            </div>
          </div>
        );
      default:
        return <Dashboard profile={profile} utilities={utilities} messages={messages} />;
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto relative overflow-x-hidden bg-slate-950">
      {renderContent()}
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
    </div>
  );
};

export default App;
