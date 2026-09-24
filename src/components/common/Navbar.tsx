import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Language } from '../../services/i18n';
import { storage } from '../../services/storageService';
import {
  Wheat,
  Bell,
  Sun,
  Moon,
  Globe,
  PlusCircle,
  Menu,
  X,
  ShieldCheck,
  Award,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Settings,
  HelpCircle,
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
  } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const notifications = storage
    .getState()
    .notifications.filter((n) => n.userId === currentUser.id)
    .slice(0, 5);

  const navLinks = [
    { id: 'home', label: t.navHome },
    { id: 'dashboard', label: currentUser.role === 'farmer' ? 'Farmer Hub' : currentUser.role === 'consumer' ? 'Consumer Hub' : 'My Hub' },
    { id: 'prices', label: t.navPrices },
    { id: 'compare', label: t.navCompare },
    { id: 'forecast', label: t.navForecast },
    { id: 'calculator', label: 'Price Engine' },
    { id: 'sellers', label: t.navFarmers },
    { id: 'schemes', label: t.navSchemes },
    { id: 'weather', label: t.navWeather },
    { id: 'expert', label: t.navExpert },
    { id: 'leaderboard', label: t.navLeaderboard },
    { id: 'rewards', label: t.navRewards },
  ];

  if (currentUser.role === 'admin') {
    navLinks.push({ id: 'admin', label: 'Admin Hub' });
  }

  const handleMarkAllRead = () => {
    storage.markAllNotificationsAsRead(currentUser.id);
    refreshUserState();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Wheat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-stone-900 dark:text-white">
                  Price<span className="text-emerald-600 dark:text-emerald-400">Xact</span>
                </span>
                <span className="text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Agri Intel
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 hidden sm:block leading-none">
                Fair Market Platform
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.slice(0, 7).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 text-xs xl:text-sm font-medium rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* More dropdown for remaining nav items */}
            <div className="relative group">
              <button className="px-3 py-1.5 text-xs xl:text-sm font-medium rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-1">
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-stone-800 rounded-xl shadow-xl border border-stone-200 dark:border-stone-700 py-1 hidden group-hover:block z-50">
                {navLinks.slice(7).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-emerald-50 dark:hover:bg-stone-700 ${
                      activeTab === item.id ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-stone-700 dark:text-stone-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Submit Price Action Button */}
            <button
              onClick={openSubmitModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.submitPrice}</span>
            </button>

            {/* Language Selector */}
            <div className="relative group">
              <button
                className="p-1.5 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg flex items-center gap-1 text-xs font-medium"
                title="Select Language"
              >
                <Globe className="w-4 h-4 text-stone-500" />
                <span className="uppercase font-semibold">{language}</span>
              </button>
              <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-stone-800 rounded-lg shadow-lg border border-stone-200 dark:border-stone-700 py-1 hidden group-hover:block z-50">
                <button
                  onClick={() => setLanguage('en')}
                  className={`w-full text-left px-3 py-1.5 text-xs ${
                    language === 'en' ? 'font-bold text-emerald-600' : 'text-stone-700 dark:text-stone-200'
                  } hover:bg-stone-100 dark:hover:bg-stone-700`}
                >
                  English (EN)
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`w-full text-left px-3 py-1.5 text-xs ${
                    language === 'hi' ? 'font-bold text-emerald-600' : 'text-stone-700 dark:text-stone-200'
                  } hover:bg-stone-100 dark:hover:bg-stone-700`}
                >
                  हिन्दी (HI)
                </button>
                <button
                  onClick={() => setLanguage('bn')}
                  className={`w-full text-left px-3 py-1.5 text-xs ${
                    language === 'bn' ? 'font-bold text-emerald-600' : 'text-stone-700 dark:text-stone-200'
                  } hover:bg-stone-100 dark:hover:bg-stone-700`}
                >
                  বাংলা (BN)
                </button>
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-stone-800 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-700 py-2 z-50">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-stone-100 dark:border-stone-700">
                    <span className="text-xs font-bold text-stone-900 dark:text-white">
                      Notifications ({notifications.length})
                    </span>
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-700/50">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-stone-400">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 text-xs transition-colors hover:bg-stone-50 dark:hover:bg-stone-700/50 ${
                            !n.isRead ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                          }`}
                        >
                          <div className="font-semibold text-stone-900 dark:text-stone-100">
                            {n.title}
                          </div>
                          <p className="text-stone-600 dark:text-stone-300 text-[11px] mt-0.5">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-stone-400 mt-1 block">
                            {new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Trust Score Pill */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 text-xs">
              <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-stone-600 dark:text-stone-300 font-medium">Trust:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-300">
                {currentUser.trustScore}
              </span>
            </div>

            {/* Profile Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-stone-800 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-700 py-2 z-50">
                  <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-700">
                    <p className="text-xs font-bold text-stone-900 dark:text-white truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                      {currentUser.email}
                    </p>
                    <div className="mt-1 flex items-center gap-1">
                      <span className="inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {currentUser.role}
                      </span>
                      {currentUser.verificationStatus === 'verified' && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 font-semibold">
                          <ShieldCheck className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveTab('dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5" /> Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('rewards');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 flex items-center gap-2"
                    >
                      <Award className="w-3.5 h-3.5" /> My Badges & Rewards
                    </button>
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          setActiveTab('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-stone-50 dark:hover:bg-stone-700 flex items-center gap-2 font-medium"
                      >
                        <Settings className="w-3.5 h-3.5" /> Admin Moderation
                      </button>
                    )}
                  </div>

                  <div className="border-t border-stone-100 dark:border-stone-700 pt-1">
                    <button
                      onClick={() => {
                        openAuthModal('login');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 flex items-center gap-2"
                    >
                      <HelpCircle className="w-3.5 h-3.5" /> Switch User / Login
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-4 pt-2 pb-6 space-y-1">
          <div className="grid grid-cols-2 gap-1 pb-3 mb-2 border-b border-stone-100 dark:border-stone-800">
            <button
              onClick={openSubmitModal}
              className="col-span-2 flex items-center justify-center gap-2 py-2 px-3 bg-emerald-600 text-white rounded-lg font-semibold text-xs"
            >
              <PlusCircle className="w-4 h-4" /> {t.submitPrice}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg font-medium ${
                  activeTab === item.id
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 font-semibold'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
