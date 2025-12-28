
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && address && postalCode && city) {
      onComplete({ name, address, postalCode, city });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 pb-20">
      <div className="w-full max-w-md bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-800 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-100">Välkommen!</h1>
          <p className="text-slate-400">Registrera din adress för att se lokala meddelanden och förbrukning.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Fullständigt namn</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Erik Johansson"
              className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Gatuadress</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Storgatan 12"
              className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Postnummer</label>
              <input
                type="text"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="123 45"
                className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Ort</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Stockholm"
                className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all transform active:scale-[0.98] mt-4"
          >
            Börja använda appen
          </button>
        </form>

        <p className="text-[10px] text-slate-500 text-center">
          Genom att fortsätta godkänner du att HemKollen hämtar data från Message Pro, Digpro, Kamstrup och Avfallsappen för din angivna adress.
        </p>
      </div>
    </div>
  );
};

export default ProfileSetup;
