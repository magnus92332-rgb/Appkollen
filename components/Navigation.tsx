
import React from 'react';
import { AppSection } from '../types';
import { Icons } from '../constants';

interface NavigationProps {
  activeSection: AppSection;
  setActiveSection: (section: AppSection) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, setActiveSection }) => {
  const navItems = [
    { id: AppSection.DASHBOARD, label: 'Hem', icon: Icons.Dashboard },
    { id: AppSection.MESSAGES, label: 'Meddelanden', icon: Icons.Messages },
    { id: AppSection.UTILITIES, label: 'Förbrukning', icon: Icons.Utilities },
    { id: AppSection.RECYCLING, label: 'Återvinning', icon: Icons.Recycling },
    { id: AppSection.PROFILE, label: 'Profil', icon: Icons.Profile },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 safe-area-bottom z-50 shadow-2xl">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                isActive ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
