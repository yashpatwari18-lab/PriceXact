import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Shield, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { storage } from '../../services/storageService';

export const DemoBanner: React.FC = () => {
  const { currentUser, switchRole, refreshUserState } = useAuth();

  const roles: { role: UserRole; label: string; icon: string }[] = [
    { role: 'farmer', label: 'Farmer (Ramesh)', icon: '🌾' },
    { role: 'consumer', label: 'Consumer (Priya)', icon: '🛒' },
    { role: 'trader', label: 'Trader (Gupta)', icon: '🏢' },
    { role: 'expert', label: 'Agri Expert (Dr. Sharma)', icon: '🔬' },
    { role: 'admin', label: 'Admin Hub', icon: '⚡' },
  ];

  const handleReset = () => {
    if (confirm('Reset demo data to initial factory state?')) {
      storage.resetToDefault();
      refreshUserState();
    }
  };

  return (
    <div className="bg-stone-900 text-stone-200 text-xs py-2 px-3 sm:px-6 border-b border-stone-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            LIVE DEMO MODE
          </span>
          <span className="hidden sm:inline text-stone-400">
            Current Persona:
          </span>
          <span className="font-medium text-white flex items-center gap-1.5 bg-stone-800 px-2 py-0.5 rounded">
            <span>{currentUser.role === 'farmer' ? '🌾' : currentUser.role === 'consumer' ? '🛒' : currentUser.role === 'trader' ? '🏢' : currentUser.role === 'expert' ? '🔬' : '⚡'}</span>
            <span className="capitalize">{currentUser.name} ({currentUser.role})</span>
            {currentUser.verificationStatus === 'verified' && (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-stone-400 hidden md:inline text-[11px]">Switch Persona:</span>
          {roles.map((r) => {
            const isActive = currentUser.role === r.role;
            return (
              <button
                key={r.role}
                onClick={() => switchRole(r.role)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
                }`}
                title={`Switch to ${r.label}`}
              >
                {r.icon} <span className="hidden xs:inline">{r.label.split(' ')[0]}</span>
              </button>
            );
          })}

          <button
            onClick={handleReset}
            className="text-[11px] text-stone-400 hover:text-stone-200 ml-2 flex items-center gap-1 border-l border-stone-700 pl-2"
            title="Reset all demo submissions to original baseline"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
