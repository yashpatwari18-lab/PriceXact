import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storageService';
import {
  Bell,
  Sun,
  Moon,
  Globe,
  Plus,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  LogOut,
  User as UserIcon,
  SlidersHorizontal,
  Compass,
  Check,
  Wheat,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openSubmitModal: () => void;
  openAuthModal: (mode: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openSubmitModal,
  openAuthModal,
}) => {
  const {
    currentUser,
    language,
    setLanguage,
    t,
    isDarkMode,
    toggleDarkMode,
    unreadNotificationsCount,
    logout,
    refreshUserState,
    switchRole,
  } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const notifications = storage
    .getState()
    .notifications.filter((n) => n.userId === currentUser.id)
    .slice(0, 5);

  const primaryNavLinks = [
    { id: 'home', label: 'Overview' },
    { id: 'prices', label: 'Market Prices' },
    { id: 'compare', label: 'Spread Ledger' },
    { id: 'forecast', label: 'Forecast' },
    { id: 'sellers', label: 'Direct Sellers' },
  ];

  const secondaryNavLinks = [
    { id: 'dashboard', label: currentUser.role === 'farmer' ? 'Producer Console' : 'Consumer Console' },
    { id: 'calculator', label: '10% Trimming Engine' },
    { id: 'schemes', label: 'Government Welfare Schemes' },
    { id: 'weather', label: 'Agro-Meteorology' },
    { id: 'expert', label: 'Agricultural Experts Q&A' },
    { id: 'leaderboard', label: 'Trust & Reputation Leaderboard' },
    { id: 'rewards', label: 'Producer Incentives & Rewards' },
  ];

  if (currentUser.role === 'admin') {
    secondaryNavLinks.push({ id: 'admin', label: 'Clearinghouse Operations' });
  }

  const handleMarkAllRead = () => {
    storage.markAllNotificationsAsRead(currentUser.id);
    refreshUserState();
  };

  const languages = [
    { code: 'en', label: 'English', sub: 'National' },
    { code: 'hi', label: 'हिन्दी', sub: 'Hindi' },
    { code: 'bn', label: 'বাংলা', sub: 'Bengali' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0D110F]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Distinctive Single-Element Brand Wordmark */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            {/* Geometric Botanical Monogram */}
            <div className="w-8 h-8 rounded-lg bg-[#143828] text-emerald-400 flex items-center justify-center font-bold text-sm tracking-tighter shadow-xs border border-emerald-900/60 transition-transform group-hover:scale-105">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M12 2v20" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-none">
                Price<span className="text-[#1B543A] dark:text-emerald-400 font-sans font-semibold">Xact</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-stone-600 dark:text-stone-300 font-mono mt-0.5">
                Agricultural Intelligence
              </span>
            </div>
          </div>

          {/* Zone 2: 4-6 Clean Text Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {primaryNavLinks.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`text-xs xl:text-sm font-medium tracking-normal transition-colors py-1.5 relative whitespace-nowrap ${
                    isActive
                      ? 'text-stone-950 dark:text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#143828] dark:after:bg-emerald-400'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Quiet Secondary Dropdown */}
            <div className="relative group">
              <button className="text-xs xl:text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white flex items-center gap-1 py-1.5 whitespace-nowrap">
                <span>Analytics & Hubs</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors" />
              </button>

              <div className="absolute left-0 mt-1 w-64 bg-white dark:bg-[#141A17] rounded-xl shadow-xl border border-stone-200 dark:border-stone-800 py-1.5 hidden group-hover:block z-50">
                <div className="px-3.5 py-1.5 text-[10px] uppercase tracking-wider text-stone-400 font-semibold border-b border-stone-100 dark:border-stone-800/80">
                  Specialized Portals & Tools
                </div>
                <div className="py-1">
                  {secondaryNavLinks.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium hover:bg-stone-50 dark:hover:bg-stone-800/80 transition-colors flex items-center justify-between ${
                        activeTab === item.id
                          ? 'text-[#143828] dark:text-emerald-400 font-semibold bg-stone-50 dark:bg-stone-800/40'
                          : 'text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <span>{item.label}</span>
                      {activeTab === item.id && <span className="w-1.5 h-1.5 rounded-full bg-[#143828] dark:bg-emerald-400" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Zone 3: 1-2 Primary Actions & Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Sign In / KCC Verify Button */}
            <button
              onClick={() => openAuthModal('login')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-stone-200 dark:border-stone-700 hover:border-stone-400 text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-800 transition-colors whitespace-nowrap shadow-2xs"
              title="Sign In with Credentials or Verify KCC & Khatian Land Records"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#143828] dark:text-emerald-400" />
              <span>Sign In / KCC</span>
            </button>

            {/* Primary Action: Submit Price */}
            <button
              onClick={openSubmitModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#143828] hover:bg-[#1B543A] text-white shadow-xs transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Submit Market Rate</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg flex items-center gap-1 text-xs font-medium transition-colors"
                title="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-stone-400" />
                <span className="uppercase text-[11px] font-semibold">{language}</span>
              </button>

              {langDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangDropdownOpen(false)} />
                  <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-[#141A17] rounded-xl shadow-xl border border-stone-200 dark:border-stone-800 py-1.5 z-50 text-xs">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code as any);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800/80 transition-colors ${
                          language === l.code ? 'font-semibold text-[#143828] dark:text-emerald-400 bg-stone-50 dark:bg-stone-800/40' : 'text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <div>
                          <div>{l.label}</div>
                          <div className="text-[10px] text-stone-400">{l.sub}</div>
                        </div>
                        {language === l.code && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full" />
                )}
              </button>

              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#141A17] rounded-xl shadow-2xl border border-stone-200 dark:border-stone-800 py-2 z-50">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-stone-100 dark:border-stone-800">
                      <span className="text-xs font-semibold text-stone-900 dark:text-white">
                        Market Notifications ({notifications.length})
                      </span>
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] text-[#143828] dark:text-emerald-400 hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-stone-400">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-3 text-xs transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/60 ${
                              !n.isRead ? 'bg-stone-50/70 dark:bg-stone-800/30' : ''
                            }`}
                          >
                            <div className="font-semibold text-stone-900 dark:text-stone-100">
                              {n.title}
                            </div>
                            <p className="text-stone-600 dark:text-stone-300 text-[11px] mt-0.5">
                              {n.message}
                            </p>
                            <span className="text-[10px] text-stone-400 mt-1 block font-mono">
                              {n.date}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Avatar & Menu */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors border border-transparent hover:border-stone-200 dark:hover:border-stone-700"
              >
                <div className="w-7 h-7 rounded-full bg-[#143828] text-emerald-300 flex items-center justify-center font-bold text-xs border border-emerald-800/50">
                  {currentUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 leading-tight">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-stone-400 capitalize">
                    {currentUser.role}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />
              </button>

              {userDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#141A17] rounded-xl shadow-2xl border border-stone-200 dark:border-stone-800 py-2 z-50">
                    <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-800">
                      <div className="font-semibold text-xs text-stone-900 dark:text-white">
                        {currentUser.name}
                      </div>
                      <div className="text-[11px] text-stone-500 capitalize">
                        {currentUser.role} · {currentUser.location.district} ({currentUser.location.state})
                      </div>
                    </div>

                    <div className="py-1 border-b border-stone-100 dark:border-stone-800">
                      <button
                        onClick={() => {
                          setActiveTab('dashboard');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2"
                      >
                        <UserIcon className="w-3.5 h-3.5" />
                        <span>Manage {currentUser.role === 'farmer' ? 'Producer' : 'Consumer'} Console</span>
                      </button>

                      <button
                        onClick={() => {
                          openAuthModal('login');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2 font-medium"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Sign In to Account</span>
                      </button>

                      <button
                        onClick={() => {
                          openAuthModal('register');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-[#143828] dark:text-emerald-400 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2 font-semibold"
                      >
                        <Wheat className="w-3.5 h-3.5 text-amber-600" />
                        <span>Register with KCC & Khatian Records</span>
                      </button>
                    </div>

                    {/* Quick Persona Switcher inside Profile */}
                    <div className="py-1 border-b border-stone-100 dark:border-stone-800">
                      <div className="px-4 py-1.5 text-[10px] uppercase font-semibold text-stone-400 tracking-wider">
                        Switch Persona
                      </div>
                      {[
                        { role: 'farmer', name: 'Rameshwar Singh Patel', label: 'Farmer (Meerut)' },
                        { role: 'consumer', name: 'Priya Mukherjee', label: 'Consumer (Delhi)' },
                        { role: 'trader', name: 'Gupta Agro Trading', label: 'APMC Trader (Azadpur)' },
                        { role: 'expert', name: 'Dr. Virendra K. Sharma', label: 'Agronomist (ICAR)' },
                        { role: 'admin', name: 'PriceXact Operations', label: 'Clearinghouse Admin' },
                      ].map((item) => (
                        <button
                          key={item.role}
                          onClick={() => {
                            switchRole(item.role as any);
                            setUserDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-1.5 text-xs flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors ${
                            currentUser.role === item.role
                              ? 'text-[#143828] dark:text-emerald-400 font-semibold bg-stone-50 dark:bg-stone-800/40'
                              : 'text-stone-600 dark:text-stone-300'
                          }`}
                        >
                          <div>
                            <div>{item.name}</div>
                            <div className="text-[10px] text-stone-400">{item.label}</div>
                          </div>
                          {currentUser.role === item.role && (
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          if (confirm('Reset database to baseline APMC mandi seed?')) {
                            storage.resetToDefault();
                            refreshUserState();
                            setUserDropdownOpen(false);
                          }
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2"
                      >
                        <span>Reset Baseline Data</span>
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-stone-200 dark:border-stone-800 space-y-2">
            {/* Quick Mobile Action Bar for Sign In / KCC */}
            <div className="px-3 pb-3 border-b border-stone-100 dark:border-stone-800 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  openAuthModal('login');
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => {
                  openAuthModal('register');
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-3 rounded-lg bg-[#143828] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Wheat className="w-3.5 h-3.5 text-emerald-300" />
                <span>KCC Register</span>
              </button>
            </div>

            {primaryNavLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                  activeTab === item.id
                    ? 'bg-[#143828] text-white font-semibold'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 my-2">
              <span className="px-3 text-[10px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                More Portals
              </span>
              {secondaryNavLinks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs ${
                    activeTab === item.id
                      ? 'text-[#143828] font-semibold'
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
