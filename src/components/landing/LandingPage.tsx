import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storageService';
import { calculateTrimmedStats } from '../../services/calculationEngine';
import {
  Wheat,
  TrendingUp,
  Scale,
  ShieldCheck,
  Award,
  ArrowRight,
  CheckCircle2,
  Users,
  Building2,
  DollarSign,
  BarChart2,
  Navigation,
  Sparkles,
  Layers,
} from 'lucide-react';

interface LandingPageProps {
  onCheckPrices: () => void;
  onGetStarted: () => void;
  onSelectRole: (role: 'farmer' | 'consumer') => void;
  onNavigateToCompare: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onCheckPrices,
  onGetStarted,
  onSelectRole,
  onNavigateToCompare,
}) => {
  const { t } = useAuth();
  const crops = storage.getState().crops;
  const submissions = storage.getState().submissions;

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-14 pb-12 overflow-hidden bg-gradient-to-b from-emerald-50/70 via-stone-50 to-white dark:from-stone-900 dark:via-stone-900 dark:to-stone-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-300 dark:border-emerald-800">
                <Sparkles className="w-3.5 h-3.5" />
                Crowdsourced Fair Agricultural Price Intelligence
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-900 dark:text-white leading-[1.12]">
                Fair Prices. <br />
                <span className="text-emerald-700 dark:text-emerald-400">
                  Better Decisions.
                </span>{' '}
                <br />
                Stronger Farmers.
              </h1>

              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-xl leading-relaxed">
                PriceXact connects farmers and consumers through local agricultural price intelligence, crowdsourced mandi data, and transparent price spread insights.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onCheckPrices}
                  className="px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-lg shadow-emerald-700/25 transition-all flex items-center gap-2 group"
                >
                  <span>{t.checkMarketPrices}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onGetStarted}
                  className="px-6 py-3.5 rounded-2xl bg-white dark:bg-stone-800 text-stone-900 dark:text-white hover:bg-stone-50 dark:hover:bg-stone-700 font-bold text-sm border border-stone-200 dark:border-stone-700 shadow-xs transition-all"
                >
                  {t.getStarted}
                </button>
              </div>

              {/* Animated Live Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-stone-200 dark:border-stone-800">
                <div>
                  <div className="text-2xl font-black text-stone-900 dark:text-white">
                    12,480+
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium">Farmers Connected</span>
                </div>
                <div>
                  <div className="text-2xl font-black text-stone-900 dark:text-white">
                    420+
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium">Mandis Covered</span>
                </div>
                <div>
                  <div className="text-2xl font-black text-stone-900 dark:text-white">
                    1,850+
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium">Daily Inputs</span>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    98.4%
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium">Verified Accuracy</span>
                </div>
              </div>
            </div>

            {/* Right Hero Interactive Visual Card */}
            <div className="lg:col-span-5">
              <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 relative space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌾</span>
                    <div>
                      <span className="font-bold text-stone-900 dark:text-white text-sm block">
                        Live Price Intelligence Ticker
                      </span>
                      <span className="text-[10px] text-stone-400">Azadpur & Meerut Mandis</span>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                </div>

                {/* Mini Snapshot Ticker */}
                <div className="space-y-2.5">
                  {crops.slice(0, 3).map((crop) => {
                    const subs = submissions.filter((s) => s.cropId === crop.id);
                    const fPrices = subs.filter((s) => s.transactionType === 'sell').map((s) => s.normalizedPricePerKg);
                    const cPrices = subs.filter((s) => s.transactionType === 'buy').map((s) => s.normalizedPricePerKg);

                    const fStats = calculateTrimmedStats(
                      fPrices.length > 0 ? fPrices : [crop.baseReferencePrice * 0.95, crop.baseReferencePrice, crop.baseReferencePrice * 1.05]
                    );
                    const cStats = calculateTrimmedStats(
                      cPrices.length > 0 ? cPrices : [crop.baseReferencePrice * 1.45 * 0.95, crop.baseReferencePrice * 1.45, crop.baseReferencePrice * 1.45 * 1.05]
                    );

                    return (
                      <div
                        key={crop.id}
                        className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-100 dark:border-stone-700/60 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{crop.icon}</span>
                          <div>
                            <span className="font-bold text-stone-800 dark:text-stone-200 text-xs block">
                              {crop.name.split(' ')[0]}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              Spread: +₹{(cStats.mean - fStats.mean).toFixed(1)}/kg
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs text-stone-500">
                            Farm: <strong className="text-emerald-600 font-extrabold">₹{fStats.mean}</strong>
                          </div>
                          <div className="text-xs text-stone-500">
                            Retail: <strong className="text-stone-800 dark:text-stone-200 font-extrabold">₹{cStats.mean}</strong>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={onNavigateToCompare}
                  className="w-full py-2 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Analyze Farmgate vs Retail Spreads</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Section (Section 7) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 border border-stone-800 shadow-2xl relative overflow-hidden text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Welcome to PriceXact
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold">
              Choose Your Role in the Network
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm">
              Tailored dashboards and tools configured specifically for growers and purchasers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto pt-4">
            {/* Farmer Card */}
            <div
              onClick={() => onSelectRole('farmer')}
              className="bg-stone-800/80 hover:bg-stone-800 p-6 rounded-3xl border border-stone-700 hover:border-emerald-500 cursor-pointer transition-all text-left group flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                  🌾
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                  I am a Farmer
                </h3>
                <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                  Discover prevailing mandi rates, bypass local cartels, record verified farmgate transactions, and build your community trust badge.
                </p>
              </div>

              <div className="pt-4 border-t border-stone-700/60 flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>Enter Farmer Hub</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Consumer Card */}
            <div
              onClick={() => onSelectRole('consumer')}
              className="bg-stone-800/80 hover:bg-stone-800 p-6 rounded-3xl border border-stone-700 hover:border-amber-500 cursor-pointer transition-all text-left group flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                  🛒
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                  I am a Consumer
                </h3>
                <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                  Avoid unjustified retail markups, find verified growers within 25km for direct harvest lots, and track commodity price dips.
                </p>
              </div>

              <div className="pt-4 border-t border-stone-700/60 flex items-center justify-between text-xs font-bold text-amber-400">
                <span>Enter Consumer Hub</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section (Section 5) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 sm:p-12 border border-stone-200 dark:border-stone-800 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              The Agricultural Information Asymmetry Problem
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
              Why the Price Gap Exists
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              Farmers produce essential food with high risk, yet often capture only a fraction of retail prices due to information barriers.
            </p>
          </div>

          {/* Visual Farmer -> Intermediary -> Consumer Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                🌾
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                1. Smallholder Farmer
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Limited knowledge of actual prevailing market rates, weak bargaining leverage at local village gates, leading to low realization (e.g. Tomato at ₹20/kg).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                🚚
              </div>
              <h3 className="text-base font-bold text-amber-900 dark:text-amber-200">
                2. Multi-tier Intermediaries
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Layered commission agents, transport markups, and speculative hoarding add up to 100%+ spreads without proportionate value addition.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                🛒
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                3. End Consumer
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Pays steep retail prices (e.g. Tomato at ₹42/kg) with no transparency regarding the actual farmgate cost or source farmer welfare.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How PriceXact Works (Section 6) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-stone-50 dark:bg-stone-900/50 rounded-3xl p-8 sm:p-12 border border-stone-200 dark:border-stone-800 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              The 4-Step Solution Pipeline
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
              How PriceXact Delivers Trust
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              Transforming raw crowdsourced agricultural inputs into reliable market intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="font-bold text-stone-900 dark:text-white text-sm">
                Data Collection
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                Crowdsourced entries from farmers, consumers, APMC mandis, and verified traders normalized automatically into standard ₹/kg.
              </p>
            </div>

            <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="font-bold text-stone-900 dark:text-white text-sm">
                Data Processing
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                Automated statistical sorting and truncation of the lowest & highest 10% outliers to eliminate fake quotes or typo errors.
              </p>
            </div>

            <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="font-bold text-stone-900 dark:text-white text-sm">
                Price Intelligence
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                Trimmed arithmetic mean, dispersion standard deviation, and predictive linear regression trend forecasting.
              </p>
            </div>

            <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                4
              </div>
              <h3 className="font-bold text-stone-900 dark:text-white text-sm">
                Fair Market Display
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                Intuitive charts, confidence indicators, and direct producer-consumer connection to level the bargaining field.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
