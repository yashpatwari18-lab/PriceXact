import React, { useState } from 'react';
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
import { ActivityTimeframe } from '../../types';
import { getLiveUserMetrics } from '../../services/liveActivityService';
import { Users, Wheat, ShoppingBag, Store, Clock, Activity, ShieldCheck, Info } from 'lucide-react';

interface LiveActivityGraphProps {
  className?: string;
  compact?: boolean;
}

export const LiveActivityGraph: React.FC<LiveActivityGraphProps> = ({ className = '', compact = false }) => {
  const [timeframe, setTimeframe] = useState<ActivityTimeframe>('24h');
  const metrics = getLiveUserMetrics(timeframe);

  const timeframes: { id: ActivityTimeframe; label: string }[] = [
    { id: '1h', label: 'Past 1h' },
    { id: '6h', label: 'Past 6h' },
    { id: '12h', label: 'Past 12h' },
    { id: '24h', label: 'Past 24h' },
    { id: '7d', label: 'Past 7 Days' },
  ];

  return (
    <div
      className={`bg-white dark:bg-[#141A17] rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm p-4 sm:p-6 md:p-8 space-y-6 ${className}`}
    >
      {/* Header and Telemetry Tag */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live User Activity Graph
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              Diurnal Telemetry Active
            </span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-white tracking-tight">
            Ecosystem Participation & Activity Telemetry
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
            Diurnal activity patterns reflecting morning mandi auction trading (5 AM - 10 AM) and evening retail consumer price reporting (5 PM - 8 PM). Consistent presentation values.
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800/80 p-1 rounded-xl self-start md:self-center">
          {timeframes.map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === tf.id
                  ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-white shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3.5 sm:p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/70 dark:border-stone-700/60 space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span className="font-medium">Active Right Now</span>
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 dark:text-white tabular-nums">
            {metrics.currentActiveUsers.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <Activity className="w-3 h-3" />
            <span>High APMC auction session</span>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800/50 space-y-1">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 text-xs">
            <span className="font-medium">Farmers Online</span>
            <Wheat className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-emerald-900 dark:text-emerald-200 tabular-nums">
            {metrics.farmersOnline.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80 font-medium">
            {((metrics.farmersOnline / metrics.currentActiveUsers) * 100).toFixed(0)}% of total active users
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-800/50 space-y-1">
          <div className="flex items-center justify-between text-blue-700 dark:text-blue-400 text-xs">
            <span className="font-medium">Consumers Online</span>
            <ShoppingBag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-blue-900 dark:text-blue-200 tabular-nums">
            {metrics.consumersOnline.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-blue-700/80 dark:text-blue-400/80 font-medium">
            {((metrics.consumersOnline / metrics.currentActiveUsers) * 100).toFixed(0)}% reporting retail rates
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/50 space-y-1">
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 text-xs">
            <span className="font-medium">Mandi Traders</span>
            <Store className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-amber-900 dark:text-amber-200 tabular-nums">
            {metrics.tradersOnline.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-amber-700/80 dark:text-amber-400/80 font-medium">
            Verified wholesale brokers
          </div>
        </div>
      </div>

      {/* Main Multi-Area Telemetry Chart */}
      <div className="space-y-3">
        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="farmerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="consumerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="traderGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1C1917',
                  color: '#fff',
                  borderRadius: '0.75rem',
                  border: 'none',
                  fontSize: '11px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ fontSize: '12px', paddingBottom: '8px' }}
              />
              <Area
                type="monotone"
                dataKey="farmers"
                name="Producers / Farmers Online"
                stroke="#10B981"
                strokeWidth={2.2}
                fillOpacity={1}
                fill="url(#farmerGradient)"
              />
              <Area
                type="monotone"
                dataKey="consumers"
                name="Consumers / Buyers Online"
                stroke="#3B82F6"
                strokeWidth={2.2}
                fillOpacity={1}
                fill="url(#consumerGradient)"
              />
              <Area
                type="monotone"
                dataKey="traders"
                name="Traders & Wholesale Brokers"
                stroke="#F59E0B"
                strokeWidth={1.8}
                fillOpacity={1}
                fill="url(#traderGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Footer info note */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-[11px] text-stone-500 dark:text-stone-400 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span>
              Diurnal validation: Producer volume peaks between 05:00 - 10:00 during physical mandi auctions.
            </span>
          </div>
          <div className="font-mono text-[10px] text-stone-400 dark:text-stone-500">
            Telemetry Model: Diurnal Gaussian APMC Curve (24h Activity Log)
          </div>
        </div>
      </div>
    </div>
  );
};
