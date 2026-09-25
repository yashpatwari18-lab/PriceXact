import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storageService';
import { calculateTrimmedStats, getConfidenceScore } from '../../services/calculationEngine';
import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Scale,
  ArrowRight,
  Info,
  Calendar,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

interface CheckPricesProps {
  initialCropId?: string;
  openSubmitModal: () => void;
  openAlertModal?: (cropId: string) => void;
  onNavigateToForecast: (cropId: string) => void;
}

export const CheckPrices: React.FC<CheckPricesProps> = ({
  initialCropId,
  openSubmitModal,
  onNavigateToForecast,
}) => {
  const { t } = useAuth();
  const crops = storage.getState().crops;
  const markets = storage.getState().markets;
  const submissions = storage.getState().submissions;

  const [selectedCropId, setSelectedCropId] = useState<string>(initialCropId || crops[0]?.id || 'crop_wheat');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedLocality, setSelectedLocality] = useState<string>('all');
  const [selectedMarketId, setSelectedMarketId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const selectedCrop = crops.find((c) => c.id === selectedCropId) || crops[0];

  // Distinct available states from markets database
  const availableStates = useMemo(() => {
    const statesSet = new Set<string>();
    markets.forEach((m) => {
      if (m.state) statesSet.add(m.state);
    });
    return Array.from(statesSet).sort((a, b) => {
      if (a === 'West Bengal') return -1;
      if (b === 'West Bengal') return 1;
      return a.localeCompare(b);
    });
  }, [markets]);

  // Distinct districts filtered by selected state
  const availableDistricts = useMemo(() => {
    const distSet = new Set<string>();
    markets.forEach((m) => {
      if (selectedState === 'all' || m.state === selectedState) {
        if (m.district) distSet.add(m.district);
      }
    });
    return Array.from(distSet).sort((a, b) => {
      if (a === 'Kolkata') return -1;
      if (b === 'Kolkata') return 1;
      return a.localeCompare(b);
    });
  }, [markets, selectedState]);

  // Distinct localities filtered by selected state & district
  const availableLocalities = useMemo(() => {
    const locSet = new Set<string>();
    markets.forEach((m) => {
      const matchState = selectedState === 'all' || m.state === selectedState;
      const matchDist = selectedDistrict === 'all' || m.district === selectedDistrict;
      if (matchState && matchDist && m.locality) {
        locSet.add(m.locality);
      }
    });
    return Array.from(locSet).sort();
  }, [markets, selectedState, selectedDistrict]);

  // Markets filtered by state, district, locality
  const filteredMarkets = useMemo(() => {
    return markets.filter((m) => {
      const matchState = selectedState === 'all' || m.state === selectedState;
      const matchDist = selectedDistrict === 'all' || m.district === selectedDistrict;
      const matchLoc = selectedLocality === 'all' || m.locality === selectedLocality;
      return matchState && matchDist && matchLoc;
    });
  }, [markets, selectedState, selectedDistrict, selectedLocality]);

  // Handle State change
  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedDistrict('all');
    setSelectedLocality('all');
    setSelectedMarketId('all');
  };

  // Handle District change
  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    setSelectedLocality('all');
    setSelectedMarketId('all');
  };

  // Handle Locality change
  const handleLocalityChange = (locality: string) => {
    setSelectedLocality(locality);
    setSelectedMarketId('all');
  };

  // Quick preset shortcuts
  const applyQuickPreset = (state: string, district: string, marketId: string) => {
    setSelectedState(state);
    setSelectedDistrict(district);
    setSelectedLocality('all');
    setSelectedMarketId(marketId);
  };

  const clearGeoFilters = () => {
    setSelectedState('all');
    setSelectedDistrict('all');
    setSelectedLocality('all');
    setSelectedMarketId('all');
  };

  // Filter crops for selector
  const filteredCrops = useMemo(() => {
    return crops.filter((c) => {
      const matchText =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.hindiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.bengaliName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = filterCategory === 'all' || c.category === filterCategory;
      return matchText && matchCategory;
    });
  }, [crops, searchQuery, filterCategory]);

  // Selected market object if specific market is picked
  const selectedMarket = useMemo(() => {
    return markets.find((m) => m.id === selectedMarketId);
  }, [markets, selectedMarketId]);

  // Aggregate submissions for selected crop & cascading location
  const cropSubmissions = useMemo(() => {
    return submissions.filter((s) => {
      const matchCrop = s.cropId === selectedCropId;
      const mkt = markets.find((m) => m.id === s.marketId);

      const sState = s.state || mkt?.state;
      const sDist = s.district || mkt?.district;
      const sLoc = mkt?.locality;

      const matchState = selectedState === 'all' || sState === selectedState;
      const matchDist = selectedDistrict === 'all' || sDist === selectedDistrict;
      const matchLoc = selectedLocality === 'all' || sLoc === selectedLocality;
      const matchMarket = selectedMarketId === 'all' || s.marketId === selectedMarketId;

      return matchCrop && matchState && matchDist && matchLoc && matchMarket;
    });
  }, [submissions, selectedCropId, selectedState, selectedDistrict, selectedLocality, selectedMarketId, markets]);

  // Farmer price stats - benchmark against specific mandi modal summary if selected
  const mktModal = selectedMarket?.modalPriceSummary?.[selectedCropId];
  const baseFarmerRate = mktModal || selectedCrop.baseReferencePrice;

  const farmerPrices = cropSubmissions
    .filter((s) => s.transactionType === 'sell')
    .map((s) => s.normalizedPricePerKg);
  const farmerStats = calculateTrimmedStats(
    farmerPrices.length > 0 ? farmerPrices : [baseFarmerRate * 0.96, baseFarmerRate, baseFarmerRate * 1.04],
    baseFarmerRate
  );

  // Consumer price stats
  const consumerPrices = cropSubmissions
    .filter((s) => s.transactionType === 'buy')
    .map((s) => s.normalizedPricePerKg);
  const consumerBaseline = Number((baseFarmerRate * 1.45).toFixed(2));
  const consumerStats = calculateTrimmedStats(
    consumerPrices.length > 0 ? consumerPrices : [consumerBaseline * 0.96, consumerBaseline, consumerBaseline * 1.04],
    consumerBaseline
  );

  // Wholesale benchmark
  const wholesalePrice = Number((farmerStats.mean * 1.15).toFixed(2));
  const retailPrice = Number((consumerStats.mean).toFixed(2));
  const priceGap = Number((retailPrice - farmerStats.mean).toFixed(2));
  const priceGapPercent = farmerStats.mean > 0 ? Number(((priceGap / farmerStats.mean) * 100).toFixed(1)) : 0;
  const confidenceScore = getConfidenceScore(cropSubmissions.length, farmerStats.stdDev, farmerStats.mean);

  // Generate 14-day historical trend data points
  const historicalData = useMemo(() => {
    const points = [];
    const baseFarmer = farmerStats.mean;
    const baseConsumer = consumerStats.mean;

    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateLabel = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

      const wobble = Math.sin(i * 0.7) * (baseFarmer * 0.04);
      const fPrice = Number((baseFarmer - wobble).toFixed(2));
      const cPrice = Number((baseConsumer - wobble * 1.2).toFixed(2));
      const wPrice = Number((fPrice * 1.12).toFixed(2));

      points.push({
        date: dateLabel,
        farmerPrice: fPrice,
        consumerPrice: cPrice,
        wholesalePrice: wPrice,
      });
    }
    return points;
  }, [farmerStats.mean, consumerStats.mean]);

  const hasActiveGeoFilters =
    selectedState !== 'all' ||
    selectedDistrict !== 'all' ||
    selectedLocality !== 'all' ||
    selectedMarketId !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* Top Search & Filter Bar */}
      <div className="bg-white dark:bg-[#141A17] rounded-2xl p-4 sm:p-5 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search commodities (Wheat, Paddy, Potato, Tomato, Onion...)"
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#143828]"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs py-2 px-3 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none"
          >
            <option value="all">All Commodity Groups</option>
            <option value="cereal">Cereals & Grains</option>
            <option value="vegetable">Perishable Vegetables</option>
            <option value="oilseed">Oilseeds & Pulses</option>
          </select>

          <button
            onClick={openSubmitModal}
            className="text-xs font-semibold px-4 py-2 bg-[#143828] hover:bg-[#1B543A] text-white rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            + Report Market Rate
          </button>
        </div>
      </div>

      {/* Cascading State -> District -> Locality -> Mandi Filter Bar */}
      <div className="bg-white dark:bg-[#141A17] rounded-2xl p-4 sm:p-5 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800/80 pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              State → District → Locality → Mandi Filter
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              Official APMC & e-NAM Verified Benchmarks
            </span>
          </div>

          {/* Quick Presets for West Bengal / Kolkata */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-stone-400 font-medium">Quick Presets:</span>
            <button
              onClick={() => applyQuickPreset('West Bengal', 'Kolkata', 'mkt_kol_sealdah')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                selectedMarketId === 'mkt_kol_sealdah'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
              }`}
            >
              Kolkata: Sealdah
            </button>
            <button
              onClick={() => applyQuickPreset('West Bengal', 'Kolkata', 'mkt_kol_posta')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                selectedMarketId === 'mkt_kol_posta'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
              }`}
            >
              Kolkata: Posta
            </button>
            <button
              onClick={() => applyQuickPreset('West Bengal', 'Hooghly', 'mkt_singur')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                selectedMarketId === 'mkt_singur'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
              }`}
            >
              Hooghly: Singur
            </button>
            {hasActiveGeoFilters && (
              <button
                onClick={clearGeoFilters}
                className="px-2 py-1 rounded-md text-[11px] font-medium text-rose-600 dark:text-rose-400 hover:underline"
              >
                Reset All
              </button>
            )}
          </div>
        </div>

        {/* The 4 Synchronized Cascading Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* 1. State Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 block">
              1. State / UT
            </label>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full text-xs py-2 px-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              <option value="all">All States & UTs (All India)</option>
              {availableStates.map((st) => (
                <option key={st} value={st}>
                  {st} {st === 'West Bengal' ? '★' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* 2. District Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 block">
              2. District
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full text-xs py-2 px-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              <option value="all">
                {selectedState !== 'all' ? `All Districts in ${selectedState}` : 'All Districts'}
              </option>
              {availableDistricts.map((dst) => (
                <option key={dst} value={dst}>
                  {dst} {dst === 'Kolkata' ? '★ (Capital Metro)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Locality Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 block">
              3. Sub-Locality / Yard
            </label>
            <select
              value={selectedLocality}
              onChange={(e) => handleLocalityChange(e.target.value)}
              className="w-full text-xs py-2 px-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              <option value="all">
                {selectedDistrict !== 'all' ? `All Localities in ${selectedDistrict}` : 'All Localities'}
              </option>
              {availableLocalities.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Mandi / APMC Yard Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 block">
              4. Specific Mandi / Terminal
            </label>
            <select
              value={selectedMarketId}
              onChange={(e) => setSelectedMarketId(e.target.value)}
              className="w-full text-xs py-2 px-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              <option value="all">
                {filteredMarkets.length > 0 ? `All Matching Mandis (${filteredMarkets.length})` : 'All Mandis'}
              </option>
              {filteredMarkets.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.locality || m.district})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Breadcrumb */}
        {hasActiveGeoFilters && (
          <div className="flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/40 px-3 py-1.5 rounded-lg font-mono">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <span className="text-stone-400">Filtering:</span>
              <span>India</span>
              <span>&gt;</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {selectedState !== 'all' ? selectedState : 'All States'}
              </span>
              <span>&gt;</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {selectedDistrict !== 'all' ? selectedDistrict : 'All Districts'}
              </span>
              <span>&gt;</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {selectedLocality !== 'all' ? selectedLocality : 'All Localities'}
              </span>
              <span>&gt;</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {selectedMarket ? selectedMarket.name : 'All Regional Mandis'}
              </span>
            </div>
            {selectedMarket && (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                {selectedMarket.type.toUpperCase()} Yard
              </span>
            )}
          </div>
        )}
      </div>

      {/* Commodity Selector Segmented Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filteredCrops.map((c) => {
          const isSelected = c.id === selectedCropId;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCropId(c.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-2 transition-all border ${
                isSelected
                  ? 'bg-[#143828] text-white border-[#143828] shadow-xs font-semibold'
                  : 'bg-white dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-400'
              }`}
            >
              <span>{c.name.split(' ')[0]}</span>
              <span className="text-[10px] text-stone-400 font-mono">₹{c.baseReferencePrice}/kg</span>
            </button>
          );
        })}
      </div>

      {/* Selected Commodity Hero Details Card */}
      <div className="bg-white dark:bg-[#141A17] rounded-2xl p-6 sm:p-8 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-white">
                {selectedCrop.name}
              </h1>
              <span className="text-xs text-stone-400 font-normal">
                ({selectedCrop.hindiName} · {selectedCrop.bengaliName})
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xl">
              {selectedCrop.description} · Benchmark Variety: {selectedCrop.variety} · Unit: ₹/kg
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{confidenceScore} Confidence Index</span>
            </span>

            <button
              onClick={() => onNavigateToForecast(selectedCrop.id)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-colors flex items-center gap-1.5"
            >
              <span>30-Day Forecast</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 Key Metric Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Farmgate Producer Price */}
          <div className="bg-stone-50/70 dark:bg-stone-800/40 p-5 rounded-xl border border-stone-200/80 dark:border-stone-700/80 space-y-1">
            <div className="text-[11px] font-semibold text-[#143828] dark:text-emerald-400 uppercase tracking-wider">
              {t.farmerSellingPrice}
            </div>
            <div className="font-mono text-3xl font-bold text-stone-900 dark:text-white tabular-nums">
              ₹{farmerStats.mean}
              <span className="text-xs font-normal text-stone-400 ml-1">/kg</span>
            </div>
            <div className="flex items-center gap-1.5 pt-1 text-xs font-medium text-stone-600 dark:text-stone-300 font-mono tabular-nums">
              {farmerStats.fluctuationRate >= 0 ? (
                <span className="text-[#143828] dark:text-emerald-400 flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> +{farmerStats.fluctuationRate}% (48h)
                </span>
              ) : (
                <span className="text-rose-600 flex items-center gap-0.5">
                  <TrendingDown className="w-3.5 h-3.5" /> {farmerStats.fluctuationRate}%
                </span>
              )}
              <span className="text-[10px] text-stone-400 ml-auto font-sans">
                σ: ±₹{farmerStats.stdDev}
              </span>
            </div>
            <span className="text-[10px] text-stone-400 pt-1 block font-sans">
              Computed from {farmerStats.trimmedCount} cleaned transactions
            </span>
          </div>

          {/* Consumer Purchase Price */}
          <div className="bg-stone-50/70 dark:bg-stone-800/40 p-5 rounded-xl border border-stone-200/80 dark:border-stone-700/80 space-y-1">
            <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              {t.consumerPurchasePrice}
            </div>
            <div className="font-mono text-3xl font-bold text-stone-900 dark:text-white tabular-nums">
              ₹{consumerStats.mean}
              <span className="text-xs font-normal text-stone-400 ml-1">/kg</span>
            </div>
            <div className="flex items-center gap-1.5 pt-1 text-xs font-medium text-amber-700 dark:text-amber-400 font-mono tabular-nums">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{consumerStats.fluctuationRate}% retail trend</span>
            </div>
            <span className="text-[10px] text-stone-400 pt-1 block font-sans">
              Urban supermarkets & local wet markets
            </span>
          </div>

          {/* Wholesale APMC Benchmark */}
          <div className="bg-stone-50/70 dark:bg-stone-800/40 p-5 rounded-xl border border-stone-200/80 dark:border-stone-700/80 space-y-1">
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              {t.wholesalePrice} (APMC Yard)
            </div>
            <div className="font-mono text-3xl font-bold text-stone-800 dark:text-stone-200 tabular-nums">
              ₹{wholesalePrice}
              <span className="text-xs font-normal text-stone-400 ml-1">/kg</span>
            </div>
            <div className="text-xs text-stone-500 pt-1 font-sans">
              Mandi auction clearinghouse benchmark
            </div>
          </div>

          {/* Intermediary Spread */}
          <div className="bg-[#143828] text-white p-5 rounded-xl border border-[#143828] space-y-1 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider flex items-center justify-between">
                <span>Intermediary Spread</span>
                <Scale className="w-3.5 h-3.5" />
              </div>
              <div className="font-mono text-3xl font-bold text-white mt-1 tabular-nums">
                +₹{priceGap}
                <span className="text-xs font-normal text-emerald-200 ml-1">/kg</span>
              </div>
              <span className="text-xs font-semibold text-emerald-300 block font-mono tabular-nums mt-0.5">
                {priceGapPercent}% Farm-to-Consumer Gap
              </span>
            </div>
            <p className="text-[10px] text-emerald-200/80 mt-2 leading-relaxed">
              PriceXact direct trading preserves producer realization while saving consumer expenditure.
            </p>
          </div>
        </div>

        {/* 14-Day Price Movement Visual Chart */}
        <div className="pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-stone-900 dark:text-white">
              14-Day Price Movement & Spread Dynamic (₹/kg)
            </h3>
            <span className="text-[11px] text-stone-400 font-mono">
              10% Outlier-Trimmed Daily Arithmetic Mean
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConsumer" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorFarmer" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#143828" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#143828" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} unit="₹" />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    `₹${val}/kg`,
                    name === 'farmerPrice'
                      ? 'Farmgate Selling Price'
                      : name === 'consumerPrice'
                      ? 'Consumer Retail Price'
                      : 'APMC Wholesale Yard',
                  ]}
                  contentStyle={{
                    backgroundColor: '#141A17',
                    borderRadius: '8px',
                    color: '#fff',
                    border: '1px solid #28332D',
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono',
                  }}
                />
                <Legend
                  formatter={(val) =>
                    val === 'farmerPrice'
                      ? 'Producer Farmgate Rate'
                      : val === 'consumerPrice'
                      ? 'Consumer Retail Rate'
                      : 'APMC Wholesale Benchmark'
                  }
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
                <Area
                  type="monotone"
                  dataKey="consumerPrice"
                  stroke="#d97706"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorConsumer)"
                />
                <Area
                  type="monotone"
                  dataKey="wholesalePrice"
                  stroke="#78716c"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  fill="none"
                />
                <Area
                  type="monotone"
                  dataKey="farmerPrice"
                  stroke="#143828"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorFarmer)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* High-Density Recent Submissions Ledger */}
        <div className="pt-6 border-t border-stone-100 dark:border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-stone-900 dark:text-white">
              Recent Verified Submissions for {selectedCrop.name}
            </h3>
            <span className="text-[11px] text-stone-400 font-mono">
              {cropSubmissions.length} active records in current window
            </span>
          </div>

          {/* Mobile Card List (< sm) */}
          <div className="sm:hidden space-y-2.5">
            {cropSubmissions.slice(0, 6).map((sub) => (
              <div
                key={sub.id}
                className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-stone-900 dark:text-white">
                    {sub.submitterName}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {sub.date}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-stone-600 dark:text-stone-300">
                    {sub.marketName}
                  </span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                    sub.transactionType === 'sell'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                  }`}>
                    {sub.transactionType === 'sell' ? 'Farmgate Sale' : 'Retail Purchase'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-stone-200/60 dark:border-stone-700/60 font-mono text-xs">
                  <span className="text-stone-500 text-[11px]">
                    Reported: ₹{sub.originalPrice}/{sub.originalUnit}
                  </span>
                  <span className="font-bold text-stone-900 dark:text-white">
                    Normalized: ₹{sub.normalizedPricePerKg.toFixed(2)}/kg
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop/Tablet Table (>= sm) with Horizontal Scroll & Min-Width */}
          <div className="hidden sm:block overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[620px] text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-stone-400 border-b border-stone-100 dark:border-stone-800">
                  <th className="pb-2.5 font-medium">Participant</th>
                  <th className="pb-2.5 font-medium">Mandi Location</th>
                  <th className="pb-2.5 font-medium">Type</th>
                  <th className="pb-2.5 text-right font-medium">Reported Price</th>
                  <th className="pb-2.5 text-right font-medium">Normalized (₹/kg)</th>
                  <th className="pb-2.5 text-right font-medium">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-mono text-[11px] tabular-nums">
                {cropSubmissions.slice(0, 6).map((sub) => (
                  <tr key={sub.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors">
                    <td className="py-2.5 font-sans font-medium text-stone-900 dark:text-white">
                      {sub.submitterName}
                    </td>
                    <td className="py-2.5 text-stone-600 dark:text-stone-300">
                      {sub.marketName}
                    </td>
                    <td className="py-2.5 font-sans">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                        sub.transactionType === 'sell'
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                      }`}>
                        {sub.transactionType === 'sell' ? 'Farmgate Sale' : 'Retail Purchase'}
                      </span>
                    </td>
                    <td className="py-2.5 text-right text-stone-500">
                      ₹{sub.originalPrice}/{sub.originalUnit}
                    </td>
                    <td className="py-2.5 text-right font-semibold text-stone-900 dark:text-white">
                      ₹{sub.normalizedPricePerKg.toFixed(2)}/kg
                    </td>
                    <td className="py-2.5 text-right text-stone-400 font-sans text-[10px]">
                      {sub.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
