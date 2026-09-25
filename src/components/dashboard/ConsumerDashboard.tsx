import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storageService';
import { calculateTrimmedStats } from '../../services/calculationEngine';
import {
  ShoppingBag,
  PlusCircle,
  TrendingDown,
  TrendingUp,
  MapPin,
  ShieldCheck,
  Award,
  Scale,
  Sparkles,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

interface ConsumerDashboardProps {
  openSubmitModal: () => void;
  onNavigateToPrices: (cropId?: string) => void;
  onNavigateToSellers: () => void;
  onNavigateToCompare: () => void;
}

export const ConsumerDashboard: React.FC<ConsumerDashboardProps> = ({
  openSubmitModal,
  onNavigateToPrices,
  onNavigateToSellers,
  onNavigateToCompare,
}) => {
  const { currentUser, t } = useAuth();
  const crops = storage.getState().crops;
  const sellers = storage.getState().sellers;
  const submissions = storage.getState().submissions;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-6 md:p-8 border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Consumer Market Intelligence
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Consumer
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white">
            Welcome back, {currentUser.name}
          </h1>

          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xl">
            Location: {currentUser.location.district}, {currentUser.location.state} · Track prevailing retail grocery benchmarks and buy directly from nearby growers.
          </p>
        </div>

        {/* Trust Score */}
        <div className="bg-stone-50 dark:bg-stone-800 p-4 rounded-xl border border-stone-200/80 dark:border-stone-700 text-center min-w-[140px]">
          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
            {t.trustScore}
          </span>
          <div className="font-mono text-3xl font-bold text-stone-900 dark:text-white mt-0.5 tabular-nums">
            {currentUser.trustScore}
            <span className="text-xs font-normal text-stone-400 ml-0.5">/100</span>
          </div>
          <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold mt-0.5 block">
            ⭐ Price Verifier
          </span>
        </div>
      </div>

      {/* Quick Action Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={openSubmitModal}
          className="p-3.5 bg-[#143828] hover:bg-[#1E5136] text-white rounded-xl font-medium text-xs shadow-2xs transition-colors flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Submit Purchase Price</span>
        </button>

        <button
          onClick={onNavigateToSellers}
          className="p-3.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-stone-400 rounded-xl font-medium text-xs transition-colors flex items-center justify-center gap-2"
        >
          <MapPin className="w-4 h-4 text-stone-500" />
          <span>Find Nearby Farmers</span>
        </button>

        <button
          onClick={onNavigateToCompare}
          className="p-3.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-stone-400 rounded-xl font-medium text-xs transition-colors flex items-center justify-center gap-2"
        >
          <Scale className="w-4 h-4 text-stone-500" />
          <span>Intermediary Markups</span>
        </button>

        <button
          onClick={() => onNavigateToPrices()}
          className="p-3.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-stone-400 rounded-xl font-medium text-xs transition-colors flex items-center justify-center gap-2"
        >
          <TrendingDown className="w-4 h-4 text-stone-500" />
          <span>Commodity Price Drops</span>
        </button>
      </div>

      {/* Popular Commodities & Retail Rates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white">
              Fair Retail Commodity Benchmarks
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Aggregated from residential retail grocery inputs vs farmgate rates
            </p>
          </div>

          <button
            onClick={() => onNavigateToPrices()}
            className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
          >
            <span>Explore Price Intelligence</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {crops.slice(0, 4).map((crop) => {
            const cropSubs = submissions.filter((s) => s.cropId === crop.id);
            const cPrices = cropSubs.filter((s) => s.transactionType === 'buy').map((s) => s.normalizedPricePerKg);
            const cBaseline = crop.baseReferencePrice * 1.45;
            const cStats = calculateTrimmedStats(
              cPrices.length > 0 ? cPrices : [cBaseline * 0.95, cBaseline, cBaseline * 1.05]
            );

            const fPrices = cropSubs.filter((s) => s.transactionType === 'sell').map((s) => s.normalizedPricePerKg);
            const fStats = calculateTrimmedStats(
              fPrices.length > 0 ? fPrices : [crop.baseReferencePrice * 0.95, crop.baseReferencePrice, crop.baseReferencePrice * 1.05]
            );

            return (
              <div
                key={crop.id}
                onClick={() => onNavigateToPrices(crop.id)}
                className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-emerald-500 transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{crop.icon}</span>
                    <span className="font-bold text-stone-900 dark:text-white text-sm">
                      {crop.name.split(' ')[0]}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                    Retail
                  </span>
                </div>

                <div>
                  <div className="text-2xl font-extrabold text-stone-900 dark:text-white">
                    ₹{cStats.mean}
                    <span className="text-xs font-normal text-stone-400 ml-1">/kg</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                    Farmgate rate: ₹{fStats.mean}/kg (Spread: +₹{(cStats.mean - fStats.mean).toFixed(1)})
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 text-[10px] text-stone-400 flex justify-between">
                  <span>Mandi: Sealdah Koley & Gariahat</span>
                  <span>Std: ±₹{cStats.stdDev}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nearby Farmers to Buy Directly From */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Direct Producers Within 25km
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Skip intermediaries and purchase directly from certified local growers
            </p>
          </div>

          <button
            onClick={onNavigateToSellers}
            className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
          >
            <span>View All Sellers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sellers.map((s) => (
            <div
              key={s.id}
              className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 dark:text-white text-sm flex items-center gap-1">
                    {s.name}
                    {s.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                  </h3>
                  <span className="text-[11px] text-stone-500 block">
                    {s.approxLocation} ({s.distanceKm} km)
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  Trust {s.trustScore}
                </span>
              </div>

              <div className="text-xs space-y-1">
                {s.cropsAvailable.slice(0, 2).map((c, i) => (
                  <div key={i} className="flex justify-between text-stone-600 dark:text-stone-300">
                    <span>{c.cropName}</span>
                    <span className="font-bold text-emerald-600">₹{c.pricePerKg}/kg</span>
                  </div>
                ))}
              </div>

              <button
                onClick={onNavigateToSellers}
                className="w-full py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors"
              >
                Contact Farmer
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
