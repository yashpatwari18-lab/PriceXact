import React from 'react';
import { Home, TrendingUp, PlusCircle, Scale, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openSubmitModal: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab,
  openSubmitModal,
}) => {
  const { currentUser } = useAuth();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
            activeTab === 'home'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('prices')}
          className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
            activeTab === 'prices'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-[10px]">Prices</span>
        </button>

        {/* Center Prominent Submit Action */}
        <button
          onClick={openSubmitModal}
          className="-mt-5 w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 transition-transform active:scale-95"
          title="Submit Price"
        >
          <PlusCircle className="w-6 h-6" />
        </button>

        <button
          onClick={() => setActiveTab('compare')}
          className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
            activeTab === 'compare'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Scale className="w-5 h-5" />
          <span className="text-[10px]">Compare</span>
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
            activeTab === 'dashboard'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px]">
            {currentUser.role === 'farmer' ? 'Farmer Hub' : currentUser.role === 'consumer' ? 'Consumer' : 'Hub'}
          </span>
        </button>
      </div>
    </div>
  );
};
