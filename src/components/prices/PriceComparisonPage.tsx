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
  ShieldCheck,
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

  // Compute comparative table items
  const comparisonData = crops.map((crop) => {
    const cropSubs = submissions.filter((s) => s.cropId === crop.id);

    const fPrices = cropSubs.filter((s) => s.transactionType === 'sell').map((s) => s.normalizedPricePerKg);
    const fStats = calculateTrimmedStats(
      fPrices.length > 0 ? fPrices : [crop.baseReferencePrice * 0.95, crop.baseReferencePrice, crop.baseReferencePrice * 1.05],
      crop.baseReferencePrice
    );

    const cPrices = cropSubs.filter((s) => s.transactionType === 'buy').map((s) => s.normalizedPricePerKg);
    const cBaseline = crop.baseReferencePrice * 1.45;
    const cStats = calculateTrimmedStats(
      cPrices.length > 0 ? cPrices : [cBaseline * 0.95, cBaseline, cBaseline * 1.05],
      cBaseline
    );

    const farmerPrice = fStats.mean;
    const consumerPrice = cStats.mean;
    const wholesalePrice = Number((farmerPrice * 1.15).toFixed(2));
    const difference = Number((consumerPrice - farmerPrice).toFixed(2));
    const differencePercent = farmerPrice > 0 ? Number(((difference / farmerPrice) * 100).toFixed(1)) : 0;
    const farmerShare = consumerPrice > 0 ? Number(((farmerPrice / consumerPrice) * 100).toFixed(1)) : 50;

    return {
      cropId: crop.id,
      name: crop.name,
      shortName: crop.name.split(' ')[0],
      variety: crop.variety,
      category: crop.category,
      farmerPrice,
      consumerPrice,
      wholesalePrice,
      difference,
      differencePercent,
      farmerShare,
    };
  });

  const filteredData = selectedCategory === 'all'
    ? comparisonData
    : comparisonData.filter((item) => item.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#141A17] rounded-2xl p-6 sm:p-8 border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
            Commodity Spread Ledger & Value Chain Analytics
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-white">
            Farmgate Realization vs. Urban Retail Price
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
            Quantifying the intermediary spread across major agricultural commodities. Every row reflects 10% outlier-trimmed crowdsourced entries normalized to standard ₹/kg.
          </p>
        </div>

        <button
          onClick={openSubmitModal}
          className="px-4 py-2.5 bg-[#143828] hover:bg-[#1B543A] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
        >
          + Report Field Rate
        </button>
      </div>

      {/* Visual Bar Comparison Chart */}
      <div className="bg-white dark:bg-[#141A17] rounded-2xl p-6 sm:p-8 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-white">
              Price Differential Across Key Commodities (₹/kg)
            </h2>
            <span className="text-[11px] text-stone-400">
              Farmgate Selling Price vs APMC Mandi vs End-Consumer Purchase
            </span>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800/80 rounded-lg">
            {['all', 'cereal', 'vegetable', 'oilseed'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                  selectedCategory === cat
                    ? 'bg-white dark:bg-[#1C2520] text-stone-900 dark:text-white shadow-2xs font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                {cat === 'all' ? 'All Commodities' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="shortName" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit="₹" />
              <Tooltip
                formatter={(val: any, name: any) => [
                  `₹${val}/kg`,
                  name === 'farmerPrice'
                    ? 'Farmgate Realization'
                    : name === 'wholesalePrice'
                    ? 'APMC Mandi Benchmark'
                    : 'Consumer Retail Price',
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
                    ? 'Farmgate Realization (Producer)'
                    : val === 'wholesalePrice'
                    ? 'APMC Mandi Benchmark'
                    : 'Consumer Retail Price'
                }
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              />
              <Bar dataKey="farmerPrice" fill="#143828" radius={[4, 4, 0, 0]} />
              <Bar dataKey="wholesalePrice" fill="#78716c" radius={[4, 4, 0, 0]} />
              <Bar dataKey="consumerPrice" fill="#d97706" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comprehensive Ledger Table */}
      <div className="bg-white dark:bg-[#141A17] rounded-2xl p-6 sm:p-8 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-white">
            Commodity Spread Matrix & Value Capture
          </h2>
          <span className="text-[11px] text-stone-400 font-mono">
            {filteredData.length} active commodities
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-stone-400 border-b border-stone-100 dark:border-stone-800">
                <th className="pb-3 font-medium">Commodity</th>
                <th className="pb-3 font-medium">Variety / Spec</th>
                <th className="pb-3 text-right font-medium text-[#143828] dark:text-emerald-400">Farmgate (₹/kg)</th>
                <th className="pb-3 text-right font-medium text-stone-500">APMC Mandi</th>
                <th className="pb-3 text-right font-medium text-amber-700 dark:text-amber-400">Retail Consumer</th>
                <th className="pb-3 text-right font-medium">Net Spread (₹/kg)</th>
                <th className="pb-3 text-right font-medium">Spread %</th>
                <th className="pb-3 text-right font-medium">Farmer Capture</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-mono text-[11px] tabular-nums">
              {filteredData.map((row) => (
                <tr key={row.cropId} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors">
                  <td className="py-3 font-sans font-medium text-stone-900 dark:text-white">
                    {row.name}
                  </td>
                  <td className="py-3 font-sans text-stone-500">
                    {row.variety}
                  </td>
                  <td className="py-3 text-right font-semibold text-[#143828] dark:text-emerald-400">
                    ₹{row.farmerPrice.toFixed(2)}
                  </td>
                  <td className="py-3 text-right text-stone-500">
                    ₹{row.wholesalePrice.toFixed(2)}
                  </td>
                  <td className="py-3 text-right font-semibold text-amber-700 dark:text-amber-400">
                    ₹{row.consumerPrice.toFixed(2)}
                  </td>
                  <td className="py-3 text-right font-bold text-stone-900 dark:text-white">
                    +₹{row.difference.toFixed(2)}
                  </td>
                  <td className="py-3 text-right font-bold text-rose-600 dark:text-rose-400">
                    +{row.differencePercent}%
                  </td>
                  <td className="py-3 text-right">
                    <span className="font-semibold text-stone-700 dark:text-stone-300">
                      {row.farmerShare}%
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
