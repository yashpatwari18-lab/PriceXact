import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storageService';
import {
  Bell,
  PlusCircle,
  Trash2,
  CheckCircle,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

export const PriceAlertsPage: React.FC = () => {
  const { currentUser, refreshUserState } = useAuth();
  const crops = storage.getState().crops;
  const markets = storage.getState().markets;
  const alerts = storage.getState().alerts.filter((a) => a.userId === currentUser.id);

  const [cropId, setCropId] = useState(crops[0]?.id || 'crop_potato');
  const [marketId, setMarketId] = useState(markets[0]?.id || 'mkt_kol_sealdah');
  const [targetPrice, setTargetPrice] = useState<number | ''>(17);
  const [condition, setCondition] = useState<'below' | 'above'>('below');
  const [notifyMethod, setNotifyMethod] = useState<'in-app' | 'push' | 'sms'>('in-app');

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPrice || targetPrice <= 0) return;

    const crop = crops.find((c) => c.id === cropId);
    const market = markets.find((m) => m.id === marketId);

    storage.addPriceAlert({
      userId: currentUser.id,
      cropId,
      cropName: crop ? crop.name : 'Crop',
      marketId,
      marketName: market ? market.name : 'Market',
      targetPrice: Number(targetPrice),
      condition,
      notifyMethod,
    });

    refreshUserState();
  };

  const handleDelete = (id: string) => {
    storage.deletePriceAlert(id);
    refreshUserState();
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-6 md:p-8 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2">
            <Bell className="w-3.5 h-3.5" />
            Automated Mandi Triggers
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
            Custom Price Alerts & Triggers
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-2xl">
            Configure automated alerts to be notified immediately when a commodity price breaches your desired threshold at local aggregation yards.
          </p>
        </div>
      </div>

      {/* Create Alert Box */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-emerald-600" />
          Create New Price Alert Trigger
        </h2>

        <form onSubmit={handleCreateAlert} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs items-end">
          <div>
            <label className="block font-medium mb-1">Commodity</label>
            <select
              value={cropId}
              onChange={(e) => setCropId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium"
            >
              {crops.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name.split(' ')[0]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Market</label>
            <select
              value={marketId}
              onChange={(e) => setMarketId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium"
            >
              {markets.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium"
            >
              <option value="below">Price falls below (≤)</option>
              <option value="above">Price rises above (≥)</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Target Price (₹/kg)</label>
            <input
              type="number"
              step="0.5"
              required
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
              placeholder="e.g. 20"
              className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-bold"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors shadow-sm"
          >
            Activate Alert
          </button>
        </form>
      </div>

      {/* Active Alerts List */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-stone-900 dark:text-white">
          Configured Alert Rules ({alerts.length})
        </h2>

        {alerts.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400">
            No price alerts configured yet. Create one above to monitor market dips.
          </div>
        ) : (
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="py-4 flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 dark:text-white text-sm">
                      {alert.cropName}
                    </h3>
                    <p className="text-stone-500">
                      When price is{' '}
                      <strong>{alert.condition === 'below' ? 'below' : 'above'} ₹{alert.targetPrice}/kg</strong>{' '}
                      at {alert.marketName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      alert.status === 'triggered'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {alert.status}
                  </span>

                  <button
                    onClick={() => handleDelete(alert.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                    title="Delete Alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
