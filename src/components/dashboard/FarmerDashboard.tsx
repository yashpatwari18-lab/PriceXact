import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storageService';
import { calculateTrimmedStats } from '../../services/calculationEngine';
import {
  Wheat,
  PlusCircle,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Award,
  Bell,
  CloudSun,
  Scale,
  Calendar,
  Sparkles,
  ArrowRight,
  Calculator,
  CheckCircle,
  CreditCard,
  FileText,
} from 'lucide-react';

interface FarmerDashboardProps {
  openSubmitModal: () => void;
  openAuthModal?: (mode: 'login' | 'register') => void;
  onNavigateToPrices: (cropId?: string) => void;
  onNavigateToCompare: () => void;
  onNavigateToCalculator: () => void;
  onNavigateToSchemes: () => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  openSubmitModal,
  openAuthModal,
  onNavigateToPrices,
  onNavigateToCompare,
  onNavigateToCalculator,
  onNavigateToSchemes,
}) => {
  const { currentUser, t } = useAuth();
  const crops = storage.getState().crops;
  const submissions = storage.getState().submissions;
  const weather = storage.getState().weather;
  const userSubmissions = submissions.filter((s) => s.submitterId === currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 sm:p-8 border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Producer Management Console
            </span>
            {currentUser.verificationStatus === 'verified' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1E5136] dark:text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                KCC Verified
              </span>
            )}
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white">
            {t.goodMorning}, {currentUser.name}
          </h1>

          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xl">
            Jurisdiction: {currentUser.location.villageOrTown}, {currentUser.location.district} ({currentUser.location.state}) · Record: {currentUser.kccId || 'KCC Verified Profile'}
          </p>
        </div>

        {/* Trust Score Card */}
        <div className="bg-stone-50 dark:bg-stone-800 p-4 rounded-xl border border-stone-200/80 dark:border-stone-700 text-center min-w-[140px]">
          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
            {t.trustScore}
          </span>
          <div className="font-mono text-3xl font-bold text-stone-900 dark:text-white mt-0.5 tabular-nums">
            {currentUser.trustScore}
            <span className="text-xs font-normal text-stone-400 ml-0.5">/100</span>
          </div>
          <span className="text-[10px] text-[#1E5136] dark:text-emerald-400 font-semibold mt-0.5 block">
            {currentUser.badges[0] || 'Smart Farmer'}
          </span>
        </div>
      </div>

      {/* Kisan Credit Card (KCC) & Khatian Land Record Verification Card */}
      <div className="bg-white dark:bg-[#141A17] rounded-2xl p-5 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-200/60 dark:border-amber-800/40 shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-stone-900 dark:text-white text-sm">
                Kisan Credit Card (KCC) & Khatian Land Records
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                {currentUser.verificationStatus === 'verified' ? '✓ Verified Producer' : 'Pending Verification'}
              </span>
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 flex flex-wrap items-center gap-3 mt-1 font-mono">
              <span>KCC Number: <strong className="text-stone-800 dark:text-stone-200">{currentUser.kccId || 'KCC-UP-98234-MEE'}</strong></span>
              <span>·</span>
              <span>Khatian / RoR: <strong className="text-stone-800 dark:text-stone-200">{currentUser.khatianNumber || 'KHAT-742-MEERUT'}</strong></span>
            </div>
          </div>
        </div>

        <button
          onClick={() => openAuthModal && openAuthModal('register')}
          className="px-3.5 py-2 rounded-lg border border-stone-200 dark:border-stone-700 hover:border-stone-400 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-semibold whitespace-nowrap transition-colors"
        >
          Update KCC / Khatian
        </button>
      </div>

      {/* Quick Action Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={openSubmitModal}
          className="p-3.5 bg-[#143828] hover:bg-[#1E5136] text-white rounded-xl font-medium text-xs shadow-2xs transition-colors flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Submit Selling Price</span>
        </button>

        <button
          onClick={onNavigateToCompare}
          className="p-3.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-stone-400 rounded-xl font-medium text-xs transition-colors flex items-center justify-center gap-2"
        >
          <Scale className="w-4 h-4 text-stone-500" />
          <span>Farm vs Retail Spread</span>
        </button>

        <button
          onClick={onNavigateToCalculator}
          className="p-3.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-stone-400 rounded-xl font-medium text-xs transition-colors flex items-center justify-center gap-2"
        >
          <Calculator className="w-4 h-4 text-stone-500" />
          <span>Trimming Sandbox</span>
        </button>

        <button
          onClick={onNavigateToSchemes}
          className="p-3.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-stone-400 rounded-xl font-medium text-xs transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-stone-500" />
          <span>Welfare Schemes</span>
        </button>
      </div>

      {/* Today's Market Snapshot Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-white">
              {t.todayMarketSnapshot}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Cleaned arithmetic trimmed averages in prevailing regional mandis
            </p>
          </div>

          <button
            onClick={() => onNavigateToPrices()}
            className="text-xs font-semibold text-[#1E5136] dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View All Mandi Rates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {crops.slice(0, 6).map((crop) => {
            const cropSubs = submissions.filter((s) => s.cropId === crop.id && s.transactionType === 'sell');
            const prices = cropSubs.map((s) => s.normalizedPricePerKg);
            const stats = calculateTrimmedStats(
              prices.length > 0 ? prices : [crop.baseReferencePrice * 0.95, crop.baseReferencePrice, crop.baseReferencePrice * 1.05],
              crop.baseReferencePrice
            );

            return (
              <div
                key={crop.id}
                onClick={() => onNavigateToPrices(crop.id)}
                className="bg-white dark:bg-stone-900 rounded-xl p-5 border border-stone-200/80 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition-colors cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg bg-stone-50 dark:bg-stone-800 flex items-center justify-center text-xl border border-stone-200/60 dark:border-stone-700">
                        {crop.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-900 dark:text-white text-sm">
                          {crop.name.split(' ')[0]}
                        </h3>
                        <span className="text-[11px] text-stone-400">
                          {crop.hindiName}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] text-stone-400 font-medium">
                      High Confidence
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-baseline justify-between">
                    <div>
                      <span className="font-mono text-2xl font-bold text-stone-900 dark:text-white tabular-nums">
                        ₹{stats.mean}
                      </span>
                      <span className="text-xs font-normal text-stone-400 ml-1">/kg</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-mono tabular-nums">
                      {stats.fluctuationRate >= 0 ? (
                        <span className="text-[#1E5136] dark:text-emerald-400 flex items-center gap-0.5">
                          <TrendingUp className="w-3.5 h-3.5" /> +{stats.fluctuationRate}%
                        </span>
                      ) : (
                        <span className="text-rose-600 flex items-center gap-0.5">
                          <TrendingDown className="w-3.5 h-3.5" /> {stats.fluctuationRate}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-stone-50 dark:border-stone-800/60">
                  <span>Mandi: Azadpur & Meerut</span>
                  <span className="font-mono tabular-nums">σ: ±₹{stats.stdDev}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Grid: Weather & Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weather advisory widget */}
        <div className="lg:col-span-4 bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-stone-500 uppercase flex items-center gap-1.5">
                <CloudSun className="w-4 h-4 text-amber-500" />
                Agro Weather Alert
              </span>
              <span className="text-xs font-bold text-emerald-600">
                {weather.temp}°C
              </span>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              {weather.agriculturalAdvisory}
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-400">
            Rain chance: {weather.rainProbability}% • Humidity: {weather.humidity}%
          </div>
        </div>

        {/* My Recent Submissions */}
        <div className="lg:col-span-8 bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 dark:text-white">
              My Price Contributions ({userSubmissions.length})
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold">
              +10 Trust Points per verified entry
            </span>
          </div>

          <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
            {userSubmissions.slice(0, 4).map((sub) => (
              <div key={sub.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-900 dark:text-white">
                    {sub.cropName}
                  </div>
                  <span className="text-[11px] text-stone-400">
                    {sub.marketName} • {sub.date}
                  </span>
                </div>

                <div className="text-right">
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    ₹{sub.normalizedPricePerKg}/kg
                  </div>
                  <span className="text-[10px] text-stone-400 flex items-center gap-1 justify-end">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    {sub.confirmationsCount} Community Confirmations
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
