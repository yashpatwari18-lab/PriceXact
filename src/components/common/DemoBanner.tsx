import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ShieldCheck, ChevronDown, RotateCcw, Check, Sparkles } from 'lucide-react';
import { storage } from '../../services/storageService';

export const DemoBanner: React.FC = () => {
  const { currentUser, switchRole, refreshUserState } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const personas: { role: UserRole; name: string; title: string; location: string; initial: string; badge?: string }[] = [
    { role: 'farmer', name: 'Subhash Chandra Mondal', title: 'Agricultural Producer', location: 'Purba Bardhaman / Sealdah (KCC Verified)', initial: 'SM', badge: 'KCC Verified' },
    { role: 'consumer', name: 'Priya Mukherjee', title: 'Direct Consumer', location: 'Kolkata Urban Hub (Gariahat)', initial: 'PM' },
    { role: 'trader', name: 'Bengal Agro Commodities Corp', title: 'Licensed APMC Trader', location: 'Sealdah Koley Market Yard #2', initial: 'BA', badge: 'Licensed' },
    { role: 'expert', name: 'Dr. Virendra K. Sharma', title: 'Senior Agronomist', location: 'ICAR / BCKV Agri Research Fellow', initial: 'VS', badge: 'ICAR' },
    { role: 'admin', name: 'PriceXact Intelligence Hub', title: 'Market Operations Lead', location: 'National Data Clearinghouse', initial: 'PX', badge: 'Admin' },
  ];

  const handleReset = () => {
    if (confirm('Reset agricultural database to baseline state? This reloads benchmark APMC mandi prices and seed datasets.')) {
      storage.resetToDefault();
      refreshUserState();
    }
  };

  const activePersona = personas.find((p) => p.role === currentUser.role) || personas[0];

  return (
    <aside aria-label="Ecosystem Context and Role Switcher" className="bg-[#121815] text-stone-300 text-xs border-b border-stone-800/80 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Intelligence Network Status */}
        <div className="flex items-center gap-2.5 text-[11px] tracking-tight">
          <span className="flex items-center gap-1.5 font-medium text-stone-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            PriceXact Market Network
          </span>
          <span className="text-stone-700 hidden sm:inline">|</span>
          <span className="text-stone-400 hidden sm:inline">
            e-NAM & APMC Clearinghouse
          </span>
          <span className="text-stone-700 hidden md:inline">·</span>
          <span className="text-stone-400 hidden md:inline">
            Active Mandis: Sealdah, Posta, Mechua, Howrah, Siliguri, Azadpur, Lasalgaon
          </span>
        </div>

        {/* Right: Clean Persona Switcher Control */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#19221D] hover:bg-[#202B25] text-stone-200 border border-stone-700/80 hover:border-stone-600 text-[11px] transition-colors"
            >
              <span className="w-4 h-4 rounded-full bg-[#24352A] text-emerald-400 flex items-center justify-center text-[9px] font-bold">
                {activePersona.initial}
              </span>
              <span className="text-stone-400 font-normal">Active Persona:</span>
              <span className="font-semibold text-stone-100">{activePersona.name.split(' ')[0]}</span>
              {activePersona.badge && (
                <span className="text-[10px] text-emerald-400 font-mono tracking-tight bg-emerald-950/60 px-1 py-0.5 rounded border border-emerald-800/60">
                  {activePersona.badge}
                </span>
              )}
              <ChevronDown className="w-3 h-3 text-stone-400 ml-0.5" />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-72 bg-[#141A17] rounded-xl shadow-2xl border border-stone-800 py-1.5 z-50 overflow-hidden">
                  <div className="px-3.5 py-2 border-b border-stone-800/80 flex items-center justify-between text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                    <span>Switch Active Persona</span>
                    <span className="font-mono text-stone-500">5 Personas</span>
                  </div>

                  <div className="py-1 divide-y divide-stone-800/40">
                    {personas.map((p) => {
                      const isSelected = p.role === currentUser.role;
                      return (
                        <button
                          key={p.role}
                          onClick={() => {
                            switchRole(p.role);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-[#1C2520] transition-colors ${
                            isSelected ? 'bg-[#18231D] text-emerald-300' : 'text-stone-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-full bg-[#202E24] text-emerald-400 flex items-center justify-center text-[10px] font-bold border border-stone-700/60">
                              {p.initial}
                            </span>
                            <div>
                              <div className="font-semibold text-stone-100 leading-tight flex items-center gap-1.5">
                                <span>{p.name}</span>
                                {p.badge && (
                                  <span className="text-[9px] text-emerald-400 font-normal px-1 py-0.2 rounded bg-emerald-950 border border-emerald-800/50">
                                    {p.badge}
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-stone-400 mt-0.5">
                                {p.title} · {p.location}
                              </div>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleReset}
            className="text-[11px] text-stone-400 hover:text-stone-200 flex items-center gap-1 transition-colors px-1.5 py-1 rounded hover:bg-stone-800"
            title="Reset database to baseline APMC seed"
          >
            <RotateCcw className="w-3 h-3 text-stone-400" />
            <span className="hidden sm:inline">Reset Baseline</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
