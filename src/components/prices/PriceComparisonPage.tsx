import React, { useState } from 'react';
import { storage } from '../../services/storageService';
import { calculateTrimmedStats } from '../../services/calculationEngine';
import {
  Scale,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Info,
  DollarSign,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

interface PriceComparisonPageProps {
  openSubmitModal: () => void;
}

export const PriceComparisonPage: React.FC<PriceComparisonPageProps> = ({ openSubmitModal }) => {
  const crops = storage.getState().crops;
  const submissions = storage.getState().submissions;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Compute table items
  const comparisonData = crops.map((crop) => {
    const cropSubs = submissions.filter((s) => s.cropId === crop.id);

    const fPrices = cropSubs.filter((s) => s.transactionType === 'sell').map((s) => s.normalizedPricePerKg);
    const fStats = calculateTrimmedStats(
      fPrices.length > 0 ? fPrices : [crop.baseReferencePrice * 0.95, crop.baseReferencePrice, crop.baseReferencePrice * 1.05]
    );

    const cPrices = cropSubs.filter((s) => s.transactionType === 'buy').map((s) => s.normalizedPricePerKg);
    const cBaseline = crop.baseReferencePrice * 1.45;
    const cStats = calculateTrimmedStats(
      cPrices.length > 0 ? cPrices : [cBaseline * 0.95, cBaseline, cBaseline * 1.05]
    );

    const farmerPrice = fStats.mean;
    const consumerPrice = cStats.mean;
    const wholesalePrice = Number((farmerPrice * 1.15).toFixed(2));
    const difference = Number((consumerPrice - farmerPrice).toFixed(2));
    const differencePercent = farmerPrice > 0 ? Number(((difference / farmerPrice) * 100).toFixed(1)) : 0;

    return {
      cropId: crop.id,
      name: crop.name,
      shortName: crop.name.split(' ')[0],
      icon: crop.icon,
      category: crop.category,
      farmerPrice,
      consumerPrice,
      wholesalePrice,
      difference,
      differencePercent,
    };
  });

  const filteredData = selectedCategory === 'all'
    ? comparisonData
    : comparisonData.filter((item) => item.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2">
            <Scale className="w-3.5 h-3.5" />
            Direct Spread Analysis
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
            Farmer vs. Consumer Price Comparison
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-2xl">
            Compare actual farmgate selling prices with end-consumer purchase rates across key agricultural commodities to identify intermediary margins and opportunities for direct fair trade.
          </p>
        </div>

        <button
          onClick={openSubmitModal}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors whitespace-nowrap"
        >
          + Submit Today's Rate
        </button>
      </div>

      {/* Visual Bar Chart Comparison */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            Price Gap Disparity by Commodity (₹/kg)
          </h2>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              All Crops
            </button>
            <button
              onClick={() => setSelectedCategory('vegetable')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                selectedCategory === 'vegetable'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              Vegetables
            </button>
            <button
              onClick={() => setSelectedCategory('cereal')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                selectedCategory === 'cereal'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              Cereals
            </button>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="shortName" tick={{ fontSize: 11 }} />
              <YAxis unit="₹" tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(val: any, name: any) => [
                  `₹${val}/kg`,
                  name === 'farmerPrice'
                    ? 'Farmer Farmgate'
                    : name === 'wholesalePrice'
                    ? 'Wholesale APMC'
                    : 'Consumer Retail',
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
                    ? 'Farmer Selling Price'
                    : val === 'wholesalePrice'
                    ? 'Wholesale APMC Mandi'
                    : 'Consumer Retail Price'
                }
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              />
              <Bar dataKey="farmerPrice" fill="#059669" radius={[4, 4, 0, 0]} name="farmerPrice" />
              <Bar dataKey="wholesalePrice" fill="#64748b" radius={[4, 4, 0, 0]} name="wholesalePrice" />
              <Bar dataKey="consumerPrice" fill="#d97706" radius={[4, 4, 0, 0]} name="consumerPrice" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison Data Table */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white">
            Normalized Commodity Spread Ledger
          </h2>
          <span className="text-[11px] text-stone-500 dark:text-stone-400">
            Updated from live community price inputs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 dark:text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-200 dark:border-stone-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Commodity</th>
                <th className="py-3 px-4 font-semibold text-emerald-700 dark:text-emerald-400">
                  Farmer Selling
                </th>
                <th className="py-3 px-4 font-semibold text-stone-600 dark:text-stone-300">
                  Wholesale Mandi
                </th>
                <th className="py-3 px-4 font-semibold text-amber-700 dark:text-amber-400">
                  Consumer Retail
                </th>
                <th className="py-3 px-4 font-semibold">Price Gap (₹/kg)</th>
                <th className="py-3 px-4 font-semibold">Intermediary Markup</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-medium">
              {filteredData.map((row) => (
                <tr
                  key={row.cropId}
                  className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
                >
                  <td className="py-3 px-4 font-bold text-stone-900 dark:text-white flex items-center gap-2">
                    <span className="text-lg">{row.icon}</span>
                    <span>{row.name}</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{row.farmerPrice}/kg
                  </td>
                  <td className="py-3 px-4 text-stone-600 dark:text-stone-300">
                    ₹{row.wholesalePrice}/kg
                  </td>
                  <td className="py-3 px-4 font-bold text-stone-900 dark:text-white">
                    ₹{row.consumerPrice}/kg
                  </td>
                  <td className="py-3 px-4 font-extrabold text-stone-800 dark:text-stone-200">
                    +₹{row.difference}/kg
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-bold text-xs px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                      <TrendingUp className="w-3 h-3" />
                      +{row.differencePercent}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
