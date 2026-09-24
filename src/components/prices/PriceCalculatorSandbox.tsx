import React, { useState } from 'react';
import { calculateTrimmedStats, TrimmedStatsResult } from '../../services/calculationEngine';
import {
  Calculator,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const PriceCalculatorSandbox: React.FC = () => {
  // Default to the project paper's demonstration farmer dataset
  const [inputStr, setInputStr] = useState<string>('6, 5, 5, 5, 7, 9, 8, 9, 10, 11, 14, 14, 15, 12, 10');
  const [baselinePrice, setBaselinePrice] = useState<number | ''>(8.5);
  const [trimPercent, setTrimPercent] = useState<number>(0.10);
  const [unit, setUnit] = useState<string>('₹/kg');

  const parsePrices = (str: string): number[] => {
    return str
      .split(/[\s,]+/)
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n) && n > 0);
  };

  const currentPrices = parsePrices(inputStr);
  const stats: TrimmedStatsResult = calculateTrimmedStats(
    currentPrices,
    typeof baselinePrice === 'number' ? baselinePrice : undefined,
    trimPercent
  );

  const loadPreset = (type: 'farmer_paper' | 'consumer_paper' | 'volatile_mandi') => {
    if (type === 'farmer_paper') {
      setInputStr('6, 5, 5, 5, 7, 9, 8, 9, 10, 11, 14, 14, 15, 12, 10');
      setBaselinePrice(8.5);
    } else if (type === 'consumer_paper') {
      setInputStr('50, 48, 60, 39, 48, 50, 50, 41, 65, 42');
      setBaselinePrice(44.0);
    } else {
      setInputStr('18, 19, 21, 20, 22, 19, 25, 23, 19, 21, 28, 17, 22');
      setBaselinePrice(20.0);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-400/30 text-emerald-200 text-xs font-semibold mb-3">
            <Calculator className="w-3.5 h-3.5" />
            Statistical Engine Verification
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            PriceXact Dynamic Calculation Sandbox
          </h1>
          <p className="text-emerald-100 text-sm mt-2 leading-relaxed">
            Test the algorithmic methodology proposed for PriceXact: sorting crowdsourced prices, trimming the lowest & highest 10% outliers, and computing the robust trimmed mean and standard deviation.
          </p>

          {/* Quick Preset Buttons */}
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <span className="text-emerald-200/80 font-medium py-1">Load Project Paper Datasets:</span>
            <button
              onClick={() => loadPreset('farmer_paper')}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-medium transition-all"
            >
              🌾 Farmer Paper Sample (15 points)
            </button>
            <button
              onClick={() => loadPreset('consumer_paper')}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-medium transition-all"
            >
              🛒 Consumer Paper Sample (10 points)
            </button>
            <button
              onClick={() => loadPreset('volatile_mandi')}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-medium transition-all"
            >
              📊 Daily Mandi Vegetable Sample
            </button>
          </div>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Panel */}
        <div className="lg:col-span-5 bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-800 dark:text-stone-200">
                Comma-separated Price Inputs ({unit})
              </label>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                {currentPrices.length} points detected
              </span>
            </div>
            <textarea
              rows={4}
              value={inputStr}
              onChange={(e) => setInputStr(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. 6, 5, 5, 5, 7, 9, 8, 9, 10, 11, 14, 14, 15, 12, 10"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Supports spaces, commas, or new lines. Invalid entries are skipped automatically.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                Baseline Price for Fluctuation
              </label>
              <input
                type="number"
                step="0.1"
                value={baselinePrice}
                onChange={(e) => setBaselinePrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-full p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
                placeholder="e.g. 8.5"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                Trimming Ratio (Each End)
              </label>
              <select
                value={trimPercent}
                onChange={(e) => setTrimPercent(parseFloat(e.target.value))}
                className="w-full p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              >
                <option value="0.10">10% Trimming (Standard)</option>
                <option value="0.05">5% Trimming</option>
                <option value="0.15">15% Trimming</option>
              </select>
            </div>
          </div>

          {/* Theoretical Match Banner */}
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/40 text-xs space-y-1">
            <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Verified Methodology Verification
            </span>
            <p className="text-stone-600 dark:text-stone-300 text-[11px]">
              When applying 10% trimming to the paper's 15 farmer points, the trimmed dataset produces an arithmetic average of{' '}
              <strong>₹9.18/kg</strong> and standard deviation of <strong>₹2.52/kg</strong>, matching the theoretical document benchmark.
            </p>
          </div>
        </div>

        {/* Right Processed Results Display */}
        <div className="lg:col-span-7 space-y-5">
          {/* Key Output Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
              <span className="text-[11px] font-semibold text-stone-500 uppercase block">Trimmed Average</span>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                ₹{stats.mean}
                <span className="text-xs font-normal text-stone-400 ml-0.5">/kg</span>
              </div>
              <span className="text-[10px] text-stone-400">Arithmetic Mean</span>
            </div>

            <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
              <span className="text-[11px] font-semibold text-stone-500 uppercase block">Std Deviation</span>
              <div className="text-2xl font-extrabold text-stone-800 dark:text-stone-200 mt-1">
                ±₹{stats.stdDev}
              </div>
              <span className="text-[10px] text-stone-400">Spread dispersion</span>
            </div>

            <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
              <span className="text-[11px] font-semibold text-stone-500 uppercase block">Fluctuation</span>
              <div className={`text-2xl font-extrabold mt-1 ${stats.fluctuationRate >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stats.fluctuationRate >= 0 ? `+${stats.fluctuationRate}%` : `${stats.fluctuationRate}%`}
              </div>
              <span className="text-[10px] text-stone-400">vs baseline</span>
            </div>

            <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
              <span className="text-[11px] font-semibold text-stone-500 uppercase block">Sample Retained</span>
              <div className="text-2xl font-extrabold text-stone-800 dark:text-stone-200 mt-1">
                {stats.trimmedCount}
                <span className="text-xs font-normal text-stone-400 ml-1">/ {stats.originalCount}</span>
              </div>
              <span className="text-[10px] text-stone-400">Outliers removed: {stats.trimmedOutCount}</span>
            </div>
          </div>

          {/* Visual Step-by-Step Data Pipeline */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Algorithmic Step-by-Step Execution
            </h3>

            {/* Step 1: Raw Sorted Array */}
            <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-100 dark:border-stone-700/60">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
                <span>Step 1: Sorted Dataset ({stats.originalCount} points)</span>
                <span className="text-[10px] text-stone-400 font-mono">Min: ₹{stats.sortedPrices[0] || 0} → Max: ₹{stats.sortedPrices[stats.sortedPrices.length - 1] || 0}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                {stats.sortedPrices.map((p, idx) => {
                  const isTrimmedLow = idx < Math.floor(stats.trimmedOutCount / 2);
                  const isTrimmedHigh = idx >= stats.sortedPrices.length - Math.ceil(stats.trimmedOutCount / 2);
                  const isOutlier = isTrimmedLow || isTrimmedHigh;

                  return (
                    <span
                      key={idx}
                      className={`px-2 py-1 rounded font-semibold transition-all ${
                        isOutlier
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 line-through opacity-70 border border-rose-300 dark:border-rose-800'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      }`}
                      title={isOutlier ? 'Trimmed Outlier (10% boundary)' : 'Retained Clean Point'}
                    >
                      ₹{p}
                    </span>
                  );
                })}
              </div>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-2">
                * Highlighted in red: Truncated lowest & highest 10% outliers to eliminate speculative price quotes or data-entry errors.
              </p>
            </div>

            {/* Step 2: Trimmed Array */}
            <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-900 dark:text-emerald-300 mb-2">
                <span>Step 2: Cleaned Array for Intelligence Computation ({stats.trimmedCount} points)</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">Sum: ₹{stats.trimmedPrices.reduce((a, b) => a + b, 0)}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                {stats.trimmedPrices.map((p, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-emerald-300 dark:border-emerald-700 font-bold shadow-xs"
                  >
                    ₹{p}
                  </span>
                ))}
              </div>
            </div>

            {/* Step 3: Mathematical Formulations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                <span className="font-bold text-stone-800 dark:text-stone-200 block mb-1">
                  1. Arithmetic Mean:
                </span>
                <code className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">
                  Mean = Σ(Cleaned) / N = ₹{stats.trimmedPrices.reduce((a, b) => a + b, 0)} / {stats.trimmedCount} = ₹{stats.mean}/kg
                </code>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                <span className="font-bold text-stone-800 dark:text-stone-200 block mb-1">
                  2. Standard Deviation:
                </span>
                <code className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">
                  σ = √[Σ(x - μ)² / (N - 1)] = ±₹{stats.stdDev}/kg
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
