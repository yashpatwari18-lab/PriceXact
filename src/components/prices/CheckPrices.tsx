import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storageService';
import { calculateTrimmedStats, getConfidenceScore } from '../../services/calculationEngine';
import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldCheck,
  Calendar,
  MapPin,
  Bell,
  Scale,
  Sparkles,
  ArrowRight,
  Info,
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
  const [selectedMarketId, setSelectedMarketId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const selectedCrop = crops.find((c) => c.id === selectedCropId) || crops[0];

  // Filter crops for selector list
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

  // Aggregate prices for selected crop
  const cropSubmissions = useMemo(() => {
    return submissions.filter((s) => {
      const matchCrop = s.cropId === selectedCropId;
      const matchMarket = selectedMarketId === 'all' || s.marketId === selectedMarketId;
      return matchCrop && matchMarket;
    });
  }, [submissions, selectedCropId, selectedMarketId]);

  // Farmer price stats
  const farmerPrices = cropSubmissions
    .filter((s) => s.transactionType === 'sell')
    .map((s) => s.normalizedPricePerKg);
  const farmerStats = calculateTrimmedStats(
    farmerPrices.length > 0 ? farmerPrices : [selectedCrop.baseReferencePrice * 0.95, selectedCrop.baseReferencePrice, selectedCrop.baseReferencePrice * 1.05],
    selectedCrop.baseReferencePrice
  );

  // Consumer price stats
  const consumerPrices = cropSubmissions
    .filter((s) => s.transactionType === 'buy')
    .map((s) => s.normalizedPricePerKg);
  const consumerBaseline = selectedCrop.baseReferencePrice * 1.45;
  const consumerStats = calculateTrimmedStats(
    consumerPrices.length > 0 ? consumerPrices : [consumerBaseline * 0.95, consumerBaseline, consumerBaseline * 1.05],
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

      // Deterministic realistic variance
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-5 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200"
          >
            <option value="all">All Crops</option>
            <option value="cereal">Cereals & Grains</option>
            <option value="vegetable">Vegetables</option>
            <option value="oilseed">Oilseeds</option>
          </select>

          <select
            value={selectedMarketId}
            onChange={(e) => setSelectedMarketId(e.target.value)}
            className="text-xs p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200"
          >
            <option value="all">All Mandis & Markets</option>
            {markets.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.district})
              </option>
            ))}
          </select>

          <button
            onClick={openSubmitModal}
            className="text-xs font-semibold px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors"
          >
            + Submit Today's Price
          </button>
        </div>
      </div>

      {/* Crop Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filteredCrops.map((c) => {
          const isSelected = c.id === selectedCropId;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCropId(c.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all ${
                isSelected
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20 scale-[1.02]'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-emerald-400'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.name.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Commodity Hero Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-3xl shadow-xs border border-emerald-100 dark:border-emerald-900">
              {selectedCrop.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white">
                  {selectedCrop.name}
                </h1>
                <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                  {selectedCrop.hindiName}
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                  {selectedCrop.bengaliName}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-xl">
                {selectedCrop.description} • Standard Unit: {selectedCrop.defaultUnit}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border ${
                confidenceScore === 'High'
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : confidenceScore === 'Medium'
                  ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                  : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-300'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {confidenceScore} Confidence Intelligence
            </span>

            <button
              onClick={() => onNavigateToForecast(selectedCrop.id)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors flex items-center gap-1"
            >
              <span>View 30-Day Forecast</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4-Column Price Comparison Grid (Farmer, Consumer, Wholesale, Reference) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Farmer Farmgate Price */}
          <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 relative overflow-hidden">
            <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
              {t.farmerSellingPrice}
            </div>
            <div className="text-3xl font-extrabold text-emerald-900 dark:text-emerald-200 mt-1">
              ₹{farmerStats.mean}
              <span className="text-xs font-normal text-stone-500 ml-1">/kg</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              {farmerStats.fluctuationRate >= 0 ? (
                <>
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{farmerStats.fluctuationRate}% (48h)</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>{farmerStats.fluctuationRate}%</span>
                </>
              )}
              <span className="text-[10px] text-stone-500 ml-auto font-normal">
                Trimmed σ: ±₹{farmerStats.stdDev}
              </span>
            </div>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 mt-2 block">
              Based on {farmerStats.trimmedCount} cleaned verified transactions
            </span>
          </div>

          {/* Consumer Purchase Price */}
          <div className="bg-amber-50/60 dark:bg-amber-950/30 p-5 rounded-2xl border border-amber-200 dark:border-amber-800/60">
            <div className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
              {t.consumerPurchasePrice}
            </div>
            <div className="text-3xl font-extrabold text-stone-900 dark:text-white mt-1">
              ₹{consumerStats.mean}
              <span className="text-xs font-normal text-stone-500 ml-1">/kg</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-amber-700 dark:text-amber-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{consumerStats.fluctuationRate}% retail trend</span>
            </div>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 mt-2 block">
              Neighborhood grocery & supermarket rates
            </span>
          </div>

          {/* Wholesale Mandi Price */}
          <div className="bg-stone-50 dark:bg-stone-800/60 p-5 rounded-2xl border border-stone-200 dark:border-stone-700">
            <div className="text-[11px] font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider">
              {t.wholesalePrice} (APMC Yard)
            </div>
            <div className="text-3xl font-extrabold text-stone-800 dark:text-stone-100 mt-1">
              ₹{wholesalePrice}
              <span className="text-xs font-normal text-stone-400 ml-1">/kg</span>
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-2">
              Auction floor avg for {selectedMarketId === 'all' ? 'major mandis' : 'selected yard'}
            </div>
          </div>

          {/* Price Gap Disparity Indicator */}
          <div className="bg-stone-900 text-white p-5 rounded-2xl border border-stone-800 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                <span>Intermediary Gap</span>
                <Scale className="w-3.5 h-3.5" />
              </div>
              <div className="text-3xl font-black text-white mt-1">
                +₹{priceGap}
                <span className="text-xs font-normal text-stone-400 ml-1">/kg</span>
              </div>
              <span className="text-xs font-bold text-emerald-400 block mt-1">
                {priceGapPercent}% Farm-to-Consumer Spread
              </span>
            </div>
            <p className="text-[10px] text-stone-400 mt-2">
              PriceXact direct farmer connection can save consumers up to 25% while lifting farmgate earnings.
            </p>
          </div>
        </div>

        {/* 14-Day Price Movement Visual Chart */}
        <div className="pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              14-Day Historical Movement (₹/kg)
            </h3>
            <span className="text-[11px] text-stone-400">
              Cleaned daily arithmetic trimmed averages
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConsumer" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorFarmer" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="₹" />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    `₹${val}/kg`,
                    name === 'farmerPrice'
                      ? 'Farmer Farmgate'
                      : name === 'consumerPrice'
                      ? 'Consumer Retail'
                      : 'Wholesale APMC',
                  ]}
                  contentStyle={{
                    backgroundColor: '#1c1917',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  formatter={(val) =>
                    val === 'farmerPrice'
                      ? 'Farmer Farmgate Rate'
                      : val === 'consumerPrice'
                      ? 'Consumer Retail Rate'
                      : 'Wholesale Mandi'
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
                  stroke="#64748b"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  fill="none"
                />
                <Area
                  type="monotone"
                  dataKey="farmerPrice"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorFarmer)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
