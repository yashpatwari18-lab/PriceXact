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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0D110F]/95 backdrop-blur-md border-t border-stone-200/80 dark:border-stone-800/80 px-2 py-1.5 shadow-lg transition-colors">
      <div className="flex items-center justify-around">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
            activeTab === 'home'
              ? 'text-[#143828] dark:text-emerald-400 font-semibold'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('prices')}
          className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
            activeTab === 'prices'
              ? 'text-[#143828] dark:text-emerald-400 font-semibold'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-[10px]">Prices</span>
        </button>

        {/* Center Prominent Submit Action */}
        <button
          onClick={openSubmitModal}
          className="-mt-5 w-12 h-12 rounded-full bg-[#143828] hover:bg-[#1B543A] text-white flex items-center justify-center shadow-md transition-transform active:scale-95 border-2 border-white dark:border-[#0D110F]"
          title="Submit Price"
        >
          <PlusCircle className="w-6 h-6" />
        </button>

        <button
          onClick={() => setActiveTab('compare')}
          className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
            activeTab === 'compare'
              ? 'text-[#143828] dark:text-emerald-400 font-semibold'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Scale className="w-5 h-5" />
          <span className="text-[10px]">Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
            activeTab === 'dashboard'
              ? 'text-[#143828] dark:text-emerald-400 font-semibold'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px]">
            {currentUser.role === 'farmer' ? 'Console' : currentUser.role === 'consumer' ? 'Buyer' : 'Console'}
          </span>
        </button>
      </div>
    </div>
  );
};
