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
} from 'lucide-react';

interface FarmerDashboardProps {
  openSubmitModal: () => void;
  onNavigateToPrices: (cropId?: string) => void;
  onNavigateToCompare: () => void;
  onNavigateToCalculator: () => void;
  onNavigateToSchemes: () => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  openSubmitModal,
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
      <div className="bg-gradient-to-r from-emerald-800 via-green-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-emerald-200 text-xs font-semibold backdrop-blur-md">
              🌾 Farmer Intelligence Hub
            </span>
            {currentUser.verificationStatus === 'verified' && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified via KCC
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {t.goodMorning}, {currentUser.name}
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
            Location: {currentUser.location.villageOrTown}, {currentUser.location.district} ({currentUser.location.state}) • Kisan ID: {currentUser.kccId || 'Verified Record'}
          </p>
        </div>

        {/* Quick Trust Score & Contribution Pill */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[150px] relative z-10">
          <span className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider block">
            {t.trustScore}
          </span>
          <div className="text-4xl font-black text-white mt-1">
            {currentUser.trustScore}
            <span className="text-xs font-normal text-emerald-200 ml-1">/100</span>
          </div>
          <span className="text-[10px] text-emerald-300 mt-1 block">
            🏆 {currentUser.badges[0] || 'Smart Farmer'}
          </span>
        </div>
      </div>

      {/* Quick Action Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={openSubmitModal}
          className="p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 text-left"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Submit Today's Selling Rate</span>
        </button>

        <button
          onClick={onNavigateToCompare}
          className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-emerald-500 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2"
        >
          <Scale className="w-5 h-5 text-emerald-600" />
          <span>Farmer vs Retail Spread</span>
        </button>

        <button
          onClick={onNavigateToCalculator}
          className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-emerald-500 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2"
        >
          <Calculator className="w-5 h-5 text-emerald-600" />
          <span>Trimming Sandbox Engine</span>
        </button>

        <button
          onClick={onNavigateToSchemes}
          className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-emerald-500 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <span>PM-KISAN & Subsidies</span>
        </button>
      </div>

      {/* Today's Market Snapshot Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white">
              {t.todayMarketSnapshot}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Cleaned arithmetic trimmed averages in prevailing regional mandis
            </p>
          </div>

          <button
            onClick={() => onNavigateToPrices()}
            className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
          >
            <span>View All Mandi Rates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-2xl border border-emerald-100 dark:border-emerald-900">
                        {crop.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-900 dark:text-white text-base">
                          {crop.name.split(' ')[0]}
                        </h3>
                        <span className="text-xs text-stone-500 dark:text-stone-400">
                          {crop.hindiName}
                        </span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      High Confidence
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-baseline justify-between">
                    <div>
                      <span className="text-3xl font-extrabold text-stone-900 dark:text-white">
                        ₹{stats.mean}
                      </span>
                      <span className="text-xs font-normal text-stone-400 ml-1">/kg</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold">
                      {stats.fluctuationRate >= 0 ? (
                        <span className="text-emerald-600 flex items-center gap-0.5">
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
                  <span>Market: Azadpur & Meerut Mandis</span>
                  <span>Std: ±₹{stats.stdDev}</span>
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
