/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { MobileNav } from './components/common/MobileNav';
import { LandingPage } from './components/landing/LandingPage';
import { FarmerDashboard } from './components/dashboard/FarmerDashboard';
import { ConsumerDashboard } from './components/dashboard/ConsumerDashboard';
import { CheckPrices } from './components/prices/CheckPrices';
import { PriceComparisonPage } from './components/prices/PriceComparisonPage';
import { PriceForecastPage } from './components/prices/PriceForecastPage';
import { PriceCalculatorSandbox } from './components/prices/PriceCalculatorSandbox';
import { CrowdsourcedFeed } from './components/community/CrowdsourcedFeed';
import { FindSellersPage } from './components/sellers/FindSellersPage';
import { GovernmentSchemesPage } from './components/schemes/GovernmentSchemesPage';
import { WeatherPage } from './components/weather/WeatherPage';
import { AskExpertPage } from './components/expert/AskExpertPage';
import { PriceAlertsPage } from './components/alerts/PriceAlertsPage';
import { LeaderboardPage } from './components/gamification/LeaderboardPage';
import { RewardsPage } from './components/gamification/RewardsPage';
import { TraderDirectoryPage } from './components/traders/TraderDirectoryPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SubmitPriceModal } from './components/prices/SubmitPriceModal';
import { AuthModal } from './components/auth/AuthModal';
import { Wheat, Heart, ShieldCheck, Scale, Sparkles } from 'lucide-react';

function MainApp() {
  const { currentUser, switchRole } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCropForView, setSelectedCropForView] = useState<string>('crop_wheat');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login',
  });

  const navigateToPrices = (cropId?: string) => {
    if (cropId) setSelectedCropForView(cropId);
    setActiveTab('prices');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToForecast = (cropId: string) => {
    setSelectedCropForView(cropId);
    setActiveTab('forecast');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoleSelectFromLanding = (role: 'farmer' | 'consumer') => {
    switchRole(role);
    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors pb-16 lg:pb-0 overflow-x-hidden w-full max-w-full">
      {/* Main Responsive Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openSubmitModal={() => setIsSubmitModalOpen(true)}
        openAuthModal={(mode) => setAuthModal({ isOpen: true, mode })}
      />

      {/* Main View Container */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {activeTab === 'home' && (
          <LandingPage
            onCheckPrices={() => navigateToPrices()}
            onGetStarted={() => setAuthModal({ isOpen: true, mode: 'register' })}
            onSelectRole={handleRoleSelectFromLanding}
            onNavigateToCompare={() => setActiveTab('compare')}
          />
        )}

        {activeTab === 'dashboard' && (
          currentUser.role === 'farmer' ? (
            <FarmerDashboard
              openSubmitModal={() => setIsSubmitModalOpen(true)}
              openAuthModal={(mode) => setAuthModal({ isOpen: true, mode })}
              onNavigateToPrices={navigateToPrices}
              onNavigateToCompare={() => setActiveTab('compare')}
              onNavigateToCalculator={() => setActiveTab('calculator')}
              onNavigateToSchemes={() => setActiveTab('schemes')}
            />
          ) : (
            <ConsumerDashboard
              openSubmitModal={() => setIsSubmitModalOpen(true)}
              onNavigateToPrices={navigateToPrices}
              onNavigateToSellers={() => setActiveTab('sellers')}
              onNavigateToCompare={() => setActiveTab('compare')}
            />
          )
        )}

        {activeTab === 'prices' && (
          <CheckPrices
            initialCropId={selectedCropForView}
            openSubmitModal={() => setIsSubmitModalOpen(true)}
            onNavigateToForecast={navigateToForecast}
          />
        )}

        {activeTab === 'compare' && (
          <PriceComparisonPage openSubmitModal={() => setIsSubmitModalOpen(true)} />
        )}

        {activeTab === 'forecast' && (
          <PriceForecastPage
            initialCropId={selectedCropForView}
            openSubmitModal={() => setIsSubmitModalOpen(true)}
          />
        )}

        {activeTab === 'calculator' && <PriceCalculatorSandbox />}

        {activeTab === 'community' && <CrowdsourcedFeed />}

        {activeTab === 'sellers' && <FindSellersPage />}

        {activeTab === 'schemes' && <GovernmentSchemesPage />}

        {activeTab === 'weather' && <WeatherPage />}

        {activeTab === 'expert' && <AskExpertPage />}

        {activeTab === 'alerts' && <PriceAlertsPage />}

        {activeTab === 'leaderboard' && <LeaderboardPage />}

        {activeTab === 'rewards' && <RewardsPage />}

        {activeTab === 'traders' && <TraderDirectoryPage />}

        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Modals */}
      <SubmitPriceModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSuccess={() => {}}
      />

      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
        onSuccess={() => {}}
      />

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openSubmitModal={() => setIsSubmitModalOpen(true)}
      />

      {/* Application Footer */}
      <footer className="bg-white dark:bg-[#0D110F] border-t border-stone-200/80 dark:border-stone-800/80 py-12 mt-16 text-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#143828] text-emerald-400 flex items-center justify-center font-bold text-xs tracking-tighter">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <path d="M12 2v20" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <span className="font-serif text-xl font-bold tracking-tight text-stone-900 dark:text-white">
                  Price<span className="text-[#143828] dark:text-emerald-400 font-sans font-semibold">Xact</span>
                </span>
              </div>
              <p className="text-stone-500 dark:text-stone-400 text-xs leading-relaxed">
                National agricultural price intelligence network designed to eliminate market information asymmetry through statistical normalization and 10% outlier-trimmed price equilibrium.
              </p>
              <div className="text-[11px] text-stone-400 pt-1 font-mono">
                Clearinghouse Mandis: Sealdah Koley, Posta, Howrah, Siliguri, Azadpur, Lasalgaon
              </div>
            </div>

            <div>
              <span className="font-bold text-stone-900 dark:text-white uppercase tracking-wider block mb-3 text-[11px]">
                Market Intelligence
              </span>
              <ul className="space-y-2 text-stone-500 dark:text-stone-400">
                <li>
                  <button onClick={() => setActiveTab('prices')} className="hover:text-stone-900 dark:hover:text-white transition-colors">
                    Mandi Price Intelligence
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('compare')} className="hover:text-stone-900 dark:hover:text-white transition-colors">
                    Farmgate vs Retail Spread Ledger
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('forecast')} className="hover:text-stone-900 dark:hover:text-white transition-colors">
                    30-Day Regression Forecast
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('calculator')} className="hover:text-stone-900 dark:hover:text-white transition-colors">
                    Dynamic 10% Trimming Engine
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-stone-900 dark:text-white uppercase tracking-wider block mb-3 text-[11px]">
                Direct Ecosystem
              </span>
              <ul className="space-y-2 text-stone-500 dark:text-stone-400">
                <li>
                  <button onClick={() => setActiveTab('sellers')} className="hover:text-stone-900 dark:hover:text-white transition-colors">
                    Find Verified Nearby Farmers
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('schemes')} className="hover:text-stone-900 dark:hover:text-white transition-colors">
                    PM-KISAN & Welfare Schemes
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('weather')} className="hover:text-stone-900 dark:hover:text-white transition-colors">
                    Agro-Meteorological Forecast
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('expert')} className="hover:text-stone-900 dark:hover:text-white transition-colors">
                    ICAR Specialist Consultations
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-stone-900 dark:text-white uppercase tracking-wider block mb-3 text-[11px]">
                Integrity & Governance
              </span>
              <p className="text-stone-500 dark:text-stone-400 text-xs mb-3 leading-relaxed">
                Kisan Credit Card (KCC) and land record verification ensure only authentic agricultural data guides community price discovery.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium hover:border-stone-400 transition-colors"
                >
                  Reputation Leaderboard
                </button>
                <button
                  onClick={() => setActiveTab('rewards')}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium hover:border-stone-400 transition-colors"
                >
                  Producer Incentives
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between text-stone-400 text-[11px] gap-2">
            <span>© 2026 PriceXact Network • National Agricultural Price Intelligence</span>
            <span className="font-mono">Econometric Specification: 10% Tail Truncation • OLS Regression</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
