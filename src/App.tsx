/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DemoBanner } from './components/common/DemoBanner';
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
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors pb-16 lg:pb-0">
      {/* Persistent Demo Persona Switcher Ribbon */}
      <DemoBanner />

      {/* Main Responsive Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openSubmitModal={() => setIsSubmitModalOpen(true)}
        openAuthModal={(mode) => setAuthModal({ isOpen: true, mode })}
      />

      {/* Main View Container */}
      <main className="flex-1">
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
      <footer className="bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 py-10 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Wheat className="w-5 h-5 text-emerald-600" />
                <span className="font-extrabold text-stone-900 dark:text-white text-base">
                  Price<span className="text-emerald-600">Xact</span>
                </span>
              </div>
              <p className="text-stone-500 dark:text-stone-400 text-xs leading-relaxed">
                A smart agricultural intelligence platform designed to eliminate the information asymmetry gap between farmers and end consumers through statistical normalization and trimmed price intelligence.
              </p>
            </div>

            <div>
              <span className="font-bold text-stone-900 dark:text-white uppercase tracking-wider block mb-2 text-[11px]">
                Market Intelligence
              </span>
              <ul className="space-y-1.5 text-stone-500 dark:text-stone-400">
                <li>
                  <button onClick={() => setActiveTab('prices')} className="hover:text-emerald-600">
                    Mandi Price Intelligence
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('compare')} className="hover:text-emerald-600">
                    Farmgate vs Retail Spread
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('forecast')} className="hover:text-emerald-600">
                    30-Day Regression Forecast
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('calculator')} className="hover:text-emerald-600">
                    Dynamic 10% Trimming Engine
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-stone-900 dark:text-white uppercase tracking-wider block mb-2 text-[11px]">
                Direct Ecosystem
              </span>
              <ul className="space-y-1.5 text-stone-500 dark:text-stone-400">
                <li>
                  <button onClick={() => setActiveTab('sellers')} className="hover:text-emerald-600">
                    Find Nearby Farmers
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('schemes')} className="hover:text-emerald-600">
                    PM-KISAN & Welfare Schemes
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('weather')} className="hover:text-emerald-600">
                    Agro-Meteorological Forecast
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('expert')} className="hover:text-emerald-600">
                    ICAR Specialist Advice
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-stone-900 dark:text-white uppercase tracking-wider block mb-2 text-[11px]">
                Trust & Verification
              </span>
              <p className="text-stone-500 dark:text-stone-400 text-xs mb-3">
                Kisan Credit Card (KCC) and land record verification ensure only authentic farmgate data guides community decisions.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold"
                >
                  🏆 Leaderboard
                </button>
                <button
                  onClick={() => setActiveTab('rewards')}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold"
                >
                  🎁 Rewards
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between text-stone-400 text-[11px]">
            <span>© 2026 PriceXact Platform • Built for Fair Agricultural Markets</span>
            <span>Trimming Algorithm: 10% Outlier Removal • Mean & Std Dev • Linear Regression</span>
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
