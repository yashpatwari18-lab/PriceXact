import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storageService';
import { calculateTrimmedStats } from '../../services/calculationEngine';
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Scale,
  Sparkles,
  Layers,
  ArrowUpRight,
  CheckCircle,
  Building2,
  Users,
  Compass,
  Search,
  ExternalLink,
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

  // Selected crop for hero interactive terminal
  const [heroCropId, setHeroCropId] = useState<string>('crop_wheat');

  const selectedHeroCrop = useMemo(() => {
    return crops.find((c) => c.id === heroCropId) || crops[0];
  }, [crops, heroCropId]);

  // Compute stats for selected crop in hero terminal
  const heroStats = useMemo(() => {
    const cropSubs = submissions.filter((s) => s.cropId === selectedHeroCrop.id);
    const fPrices = cropSubs.filter((s) => s.transactionType === 'sell').map((s) => s.normalizedPricePerKg);
    const cPrices = cropSubs.filter((s) => s.transactionType === 'buy').map((s) => s.normalizedPricePerKg);

    const fStats = calculateTrimmedStats(
      fPrices.length > 0 ? fPrices : [selectedHeroCrop.baseReferencePrice * 0.95, selectedHeroCrop.baseReferencePrice, selectedHeroCrop.baseReferencePrice * 1.05],
      selectedHeroCrop.baseReferencePrice
    );
    const cStats = calculateTrimmedStats(
      cPrices.length > 0 ? cPrices : [selectedHeroCrop.baseReferencePrice * 1.45 * 0.95, selectedHeroCrop.baseReferencePrice * 1.45, selectedHeroCrop.baseReferencePrice * 1.45 * 1.05],
      selectedHeroCrop.baseReferencePrice * 1.45
    );

    const farmgate = fStats.mean;
    const retail = cStats.mean;
    const wholesale = Number((farmgate * 1.15).toFixed(2));
    const spread = Number((retail - farmgate).toFixed(2));
    const farmgateShare = retail > 0 ? Number(((farmgate / retail) * 100).toFixed(1)) : 50;

    return {
      farmgate,
      wholesale,
      retail,
      spread,
      farmgateShare,
      fluctuation: fStats.fluctuationRate,
      sampleCount: fStats.trimmedCount + cStats.trimmedCount,
    };
  }, [submissions, selectedHeroCrop]);

  // Ticker data across 6 commodities
  const tickerItems = [
    { name: 'Wheat (Lokwan)', mandi: 'Meerut APMC', price: '₹22.80/kg', change: '+1.2%', up: true },
    { name: 'Basmati Paddy', mandi: 'Karnal Mandi', price: '₹34.50/kg', change: '-0.4%', up: false },
    { name: 'Potato (Jyoti)', mandi: 'Agra Yard', price: '₹14.20/kg', change: '+2.1%', up: true },
    { name: 'Onion (Nasik Red)', mandi: 'Lasalgaon APMC', price: '₹26.40/kg', change: '-3.2%', up: false },
    { name: 'Tomato (Hybrid)', mandi: 'Kolar Mandi', price: '₹20.00/kg', change: '+0.8%', up: true },
    { name: 'Maize (Yellow)', mandi: 'Chhindwara', price: '₹19.50/kg', change: '+0.0%', up: true },
    { name: 'Soybean (Yellow)', mandi: 'Indore Mandi', price: '₹46.20/kg', change: '+1.5%', up: true },
    { name: 'Cotton (Medium)', mandi: 'Rajkot APMC', price: '₹62.00/kg', change: '-0.8%', up: false },
  ];

  return (
    <div className="space-y-24 pb-24">
      {/* 1. Live APMC Mandi Commodities Ticker Strip */}
      <div className="w-full bg-[#111714] text-stone-300 border-b border-stone-800/80 overflow-hidden py-2 text-xs select-none">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-2 px-6 border-r border-stone-800/80">
              <span className="font-semibold text-stone-200">{item.name}</span>
              <span className="text-[11px] text-stone-500 font-mono">[{item.mandi}]</span>
              <span className="font-mono font-medium text-stone-100 tabular-nums">{item.price}</span>
              <span className={`text-[10px] font-mono tabular-nums flex items-center gap-0.5 ${item.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Hero Section: Editorial Elegance & Commodities Terminal */}
      <section className="relative pt-6 sm:pt-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Hero Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#143828] dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-[#143828] dark:bg-emerald-400" />
              <span>National Agricultural Clearinghouse & Price Intelligence</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-stone-900 dark:text-stone-100 leading-[1.1] text-balance">
              Fair prices. Verifiable data. <br />
              <span className="italic font-serif text-[#143828] dark:text-emerald-400">
                Stronger agriculture.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-xl leading-relaxed">
              PriceXact eliminates agricultural information asymmetry by connecting Indian mandi farmgate data directly with urban consumers through crowdsourced verification and 10% outlier-trimmed mathematical equilibrium.
            </p>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onCheckPrices}
                className="px-6 py-3.5 rounded-lg bg-[#143828] hover:bg-[#1B543A] text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 group"
              >
                <span>Check Mandi Benchmarks</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onNavigateToCompare}
                className="px-5 py-3.5 rounded-lg bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700/80 font-medium text-xs sm:text-sm border border-stone-300 dark:border-stone-700 transition-colors"
              >
                View Spread Ledger
              </button>
            </div>

            {/* Quantitative Proof Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-stone-200 dark:border-stone-800">
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-white tabular-nums">
                  12,480+
                </div>
                <div className="text-[11px] text-stone-500 font-medium mt-0.5">Verified Farmers</div>
              </div>
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-white tabular-nums">
                  420+
                </div>
                <div className="text-[11px] text-stone-500 font-medium mt-0.5">Mandis Aggregated</div>
              </div>
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-white tabular-nums">
                  1,850+
                </div>
                <div className="text-[11px] text-stone-500 font-medium mt-0.5">Daily Ledger Entries</div>
              </div>
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-[#143828] dark:text-emerald-400 tabular-nums">
                  10%
                </div>
                <div className="text-[11px] text-stone-500 font-medium mt-0.5">Trimming Truncation</div>
              </div>
            </div>
          </div>

          {/* Right Hero: Bloomberg-Style High-Precision Commodity Terminal */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-[#141A17] rounded-2xl p-6 border border-stone-200/90 dark:border-stone-800 shadow-md space-y-5">
              {/* Terminal Header */}
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-xs text-stone-900 dark:text-white">
                    Live Commodity Arbitrage Terminal
                  </span>
                </div>
                <span className="text-[10px] font-mono text-stone-400 uppercase">
                  APMC Normalized
                </span>
              </div>

              {/* Commodity Segmented Selector */}
              <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800/80 rounded-lg overflow-x-auto scrollbar-none">
                {crops.slice(0, 5).map((crop) => {
                  const isSelected = crop.id === heroCropId;
                  return (
                    <button
                      key={crop.id}
                      onClick={() => setHeroCropId(crop.id)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                        isSelected
                          ? 'bg-white dark:bg-[#1C2520] text-stone-900 dark:text-white shadow-2xs font-semibold'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                      }`}
                    >
                      {crop.name.split(' ')[0]}
                    </button>
                  );
                })}
              </div>

              {/* Selected Commodity Spread Detail */}
              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-white">
                      {selectedHeroCrop.name}
                    </h3>
                    <div className="text-[11px] text-stone-500">
                      Benchmark: {selectedHeroCrop.variety} · Unit: ₹/kg
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                      Net Intermediary Spread
                    </span>
                    <span className="font-mono text-xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                      +₹{heroStats.spread}/kg
                    </span>
                  </div>
                </div>

                {/* 3 Metric Columns */}
                <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/60 font-mono text-center">
                  <div>
                    <span className="text-[10px] text-stone-500 font-sans block mb-0.5">Farmgate (Producer)</span>
                    <span className="text-base sm:text-lg font-bold text-[#143828] dark:text-emerald-400 tabular-nums">
                      ₹{heroStats.farmgate}
                    </span>
                  </div>

                  <div className="border-x border-stone-200 dark:border-stone-700">
                    <span className="text-[10px] text-stone-500 font-sans block mb-0.5">APMC Mandi</span>
                    <span className="text-base sm:text-lg font-bold text-stone-700 dark:text-stone-300 tabular-nums">
                      ₹{heroStats.wholesale}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-500 font-sans block mb-0.5">Retail Consumer</span>
                    <span className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                      ₹{heroStats.retail}
                    </span>
                  </div>
                </div>

                {/* Visual Value Capture Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-300">
                    <span>Producer Value Capture</span>
                    <span className="font-mono font-semibold text-[#143828] dark:text-emerald-400 tabular-nums">
                      {heroStats.farmgateShare}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden flex">
                    <div
                      style={{ width: `${heroStats.farmgateShare}%` }}
                      className="h-full bg-[#143828] dark:bg-emerald-500 rounded-l-full"
                    />
                    <div
                      style={{ width: `${100 - heroStats.farmgateShare}%` }}
                      className="h-full bg-amber-500/80 rounded-r-full"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                    <span>Producer Realization</span>
                    <span>Intermediary Markups ({Number((100 - heroStats.farmgateShare).toFixed(1))}%)</span>
                  </div>
                </div>

                {/* Terminal Footer */}
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px]">
                  <span className="text-stone-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>10% Trimmed Mean Validated</span>
                  </span>

                  <button
                    onClick={onNavigateToCompare}
                    className="font-semibold text-[#143828] dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>Full Ledger</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Role Portals Architecture: Producer vs Consumer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="border border-stone-200/80 dark:border-stone-800 rounded-2xl bg-white dark:bg-[#141A17] p-8 sm:p-12 shadow-xs space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Ecosystem Onboarding
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 dark:text-white tracking-tight">
              Tailored workspaces for producers and consumers
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
              PriceXact serves distinct participants in the agricultural value chain with dedicated verification protocols and purpose-built market tooling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            {/* Farmer Portal Card */}
            <div
              onClick={() => onSelectRole('farmer')}
              className="border border-stone-200 dark:border-stone-800 rounded-xl p-8 hover:border-[#143828] dark:hover:border-emerald-600 cursor-pointer transition-all bg-stone-50/50 dark:bg-stone-800/20 flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#143828] text-emerald-400 flex items-center justify-center font-serif text-2xl font-bold shadow-xs">
                  🌾
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">
                    Agricultural Producers (Farmers)
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    Overcome local commission agent cartels. Access benchmark wholesale rates, verify your Kisan Credit Card (KCC) credentials, forecast optimal harvest windows, and sell directly to nearby consumers.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300 pt-2 border-t border-stone-200/60 dark:border-stone-700/60">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#143828] dark:text-emerald-400 shrink-0" />
                    <span>Real-time APMC Mandi rates across 420+ markets</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#143828] dark:text-emerald-400 shrink-0" />
                    <span>30-Day predictive commodity price regression</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#143828] dark:text-emerald-400 shrink-0" />
                    <span>Microclimate agro-meteorology and spraying alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#143828] dark:text-emerald-400 shrink-0" />
                    <span>PM-KISAN and PMFBY welfare scheme eligibility checkers</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs font-semibold text-[#143828] dark:text-emerald-400">
                <span>Enter Producer Workspace</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Consumer Portal Card */}
            <div
              onClick={() => onSelectRole('consumer')}
              className="border border-stone-200 dark:border-stone-800 rounded-xl p-8 hover:border-amber-600 dark:hover:border-amber-500 cursor-pointer transition-all bg-stone-50/50 dark:bg-stone-800/20 flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-900/30 text-amber-500 flex items-center justify-center font-serif text-2xl font-bold shadow-xs">
                  🛒
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">
                    Retail Consumers & Institutional Buyers
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    Understand true farmgate production costs versus retail supermarket markups. Locate verified growers within a 25km radius to purchase fresh produce directly.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300 pt-2 border-t border-stone-200/60 dark:border-stone-700/60">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Direct farmer locator with radius distance filters</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Transparent farmgate vs. retail spread analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Crowdsourced grocery receipt rate reporting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Verified farmer direct phone and WhatsApp contact</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs font-semibold text-amber-700 dark:text-amber-400">
                <span>Enter Consumer Workspace</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Deconstructing the Farm-to-Consumer Spread: The Economic Leakage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="border border-stone-200/80 dark:border-stone-800 rounded-2xl bg-white dark:bg-[#141A17] p-8 sm:p-12 shadow-xs space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400">
              The Value Chain Disparity
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 dark:text-white tracking-tight">
              Where does the agricultural rupee go?
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
              Empirical breakdown of standard table tomatoes selling for ₹42.00/kg in urban markets, highlighting intermediate costs between harvest and consumption.
            </p>
          </div>

          {/* Sequential 5-Stage Value Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/80 space-y-2">
              <span className="text-stone-400 font-mono text-[10px] uppercase font-semibold block">Stage 01</span>
              <div className="font-mono text-2xl font-bold text-[#143828] dark:text-emerald-400 tabular-nums">
                ₹20.00
              </div>
              <div className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                Farmgate Realization
              </div>
              <span className="text-[11px] text-stone-500 block font-mono">
                47.6% of retail rupee
              </span>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 pt-1 leading-normal">
                Direct revenue captured by the farmer for seed, fertilizer, irrigation, and labor.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/80 space-y-2">
              <span className="text-stone-400 font-mono text-[10px] uppercase font-semibold block">Stage 02</span>
              <div className="font-mono text-2xl font-bold text-stone-700 dark:text-stone-300 tabular-nums">
                ₹4.80
              </div>
              <div className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                Freight & Crating
              </div>
              <span className="text-[11px] text-stone-500 block font-mono">
                11.4% share
              </span>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 pt-1 leading-normal">
                Truck transport from farmgate, plastic crate leasing, and mandi yard offloading.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/80 space-y-2">
              <span className="text-stone-400 font-mono text-[10px] uppercase font-semibold block">Stage 03</span>
              <div className="font-mono text-2xl font-bold text-stone-700 dark:text-stone-300 tabular-nums">
                ₹7.20
              </div>
              <div className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                APMC Brokerage & Cess
              </div>
              <span className="text-[11px] text-stone-500 block font-mono">
                17.1% share
              </span>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 pt-1 leading-normal">
                Commission agent margins, auction market fees, and secondary trader markups.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/80 space-y-2">
              <span className="text-stone-400 font-mono text-[10px] uppercase font-semibold block">Stage 04</span>
              <div className="font-mono text-2xl font-bold text-stone-700 dark:text-stone-300 tabular-nums">
                ₹3.00
              </div>
              <div className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                Perishability & Spoilage
              </div>
              <span className="text-[11px] text-stone-500 block font-mono">
                7.1% share
              </span>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 pt-1 leading-normal">
                Weight loss and physical damage resulting from lack of refrigerated cold chain.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/80 space-y-2">
              <span className="text-stone-400 font-mono text-[10px] uppercase font-semibold block">Stage 05</span>
              <div className="font-mono text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                ₹7.00
              </div>
              <div className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                Urban Retailer Margin
              </div>
              <span className="text-[11px] text-stone-500 block font-mono">
                16.7% share
              </span>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 pt-1 leading-normal">
                Neighborhood storefront overhead, grading, customer bags, and final shelf markup.
              </p>
            </div>
          </div>

          {/* Outcome comparison banner */}
          <div className="p-6 rounded-xl bg-[#143828] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider block">
                The PriceXact Direct Direct Advantage
              </span>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                By enabling direct transactions within 25km, farmers earn up to <span className="font-bold text-white">₹28/kg (+40%)</span> while consumers purchase fresher produce at <span className="font-bold text-white">₹34/kg (-19%)</span>.
              </p>
            </div>

            <button
              onClick={onNavigateToCompare}
              className="px-4 py-2.5 bg-white text-[#143828] hover:bg-stone-100 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
            >
              Analyze Commodities Spread
            </button>
          </div>
        </div>
      </section>

      {/* 5. Algorithmic Price Intelligence Pipeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="border border-stone-200/80 dark:border-stone-800 rounded-2xl bg-white dark:bg-[#141A17] p-8 sm:p-12 shadow-xs space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Econometric Rigor
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 dark:text-white tracking-tight">
              The 4-stage data verification pipeline
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
              How PriceXact cleans noisy crowdsourced market inputs into high-confidence statistical signals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-2.5 border-l-2 border-stone-200 dark:border-stone-700 pl-4">
              <span className="font-mono text-stone-400 text-xs font-bold">01.</span>
              <h3 className="font-bold text-stone-900 dark:text-white text-sm">
                Unit Normalization
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Diverse transaction units (quintals, metric tons, crates, pieces, or bags) are mathematically normalized to standard ₹/kg.
              </p>
            </div>

            <div className="space-y-2.5 border-l-2 border-stone-200 dark:border-stone-700 pl-4">
              <span className="font-mono text-stone-400 text-xs font-bold">02.</span>
              <h3 className="font-bold text-stone-900 dark:text-white text-sm">
                10% Boundary Truncation
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Chronologically ordered samples are sorted and truncated by 10% on both upper and lower tails to eliminate extreme outliers and data entry errors.
              </p>
            </div>

            <div className="space-y-2.5 border-l-2 border-stone-200 dark:border-stone-700 pl-4">
              <span className="font-mono text-stone-400 text-xs font-bold">03.</span>
              <h3 className="font-bold text-stone-900 dark:text-white text-sm">
                Robust Trimmed Estimators
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Calculation of the robust arithmetic mean and standard deviation (σ), yielding clean indicators of true equilibrium value.
              </p>
            </div>

            <div className="space-y-2.5 border-l-2 border-stone-200 dark:border-stone-700 pl-4">
              <span className="font-mono text-stone-400 text-xs font-bold">04.</span>
              <h3 className="font-bold text-stone-900 dark:text-white text-sm">
                Predictive Trend Models
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Ordinary least squares regression projects 7, 14, and 30-day commodity price trends with 90% confidence bands to guide harvest and procurement timing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Attributable Testimonials & Field Evidence */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="space-y-8">
          <div className="max-w-xl space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Field Impact
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-900 dark:text-white">
              Proven results from mandis and households
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#141A17] border border-stone-200/80 dark:border-stone-800 space-y-4">
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed italic">
                "Before PriceXact, commission agents at Meerut Mandi quoted ₹18/kg for Sharbati wheat when wholesale was trading at ₹24/kg. Checking the trimmed benchmark on my phone gave me the leverage to demand ₹22.50/kg."
              </p>
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#143828] text-emerald-300 flex items-center justify-center font-bold text-xs">
                  RP
                </div>
                <div>
                  <div className="text-xs font-semibold text-stone-900 dark:text-white">
                    Rameshwar Singh Patel
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Wheat & Mustard Farmer · Meerut, UP
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#141A17] border border-stone-200/80 dark:border-stone-800 space-y-4">
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed italic">
                "We connected with an organic potato farmer 18km outside Delhi through PriceXact. Our residential society now procures directly at ₹16/kg instead of paying ₹28/kg at local supermarkets."
              </p>
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-950 text-amber-300 flex items-center justify-center font-bold text-xs">
                  PM
                </div>
                <div>
                  <div className="text-xs font-semibold text-stone-900 dark:text-white">
                    Priya Mukherjee
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Community Purchasing Lead · South Delhi
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#141A17] border border-stone-200/80 dark:border-stone-800 space-y-4">
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed italic">
                "The 10% outlier-trimmed calculation is legitimate econometric science. It automatically drops bogus bids from cartels, leaving farmers with clear visibility of actual equilibrium price."
              </p>
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-stone-800 text-stone-200 flex items-center justify-center font-bold text-xs">
                  VS
                </div>
                <div>
                  <div className="text-xs font-semibold text-stone-900 dark:text-white">
                    Dr. Virendra K. Sharma
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Senior Agronomist · ICAR Research Fellow
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
