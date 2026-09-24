import React, { useState } from 'react';
import { storage } from '../../services/storageService';
import {
  Building2,
  ShieldCheck,
  Star,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

export const TraderDirectoryPage: React.FC = () => {
  const traders = storage.getState().traders;
  const [selectedTier, setSelectedTier] = useState<string>('all');

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-6 md:p-8 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5" />
            Verified Wholesale & Logistics Directory
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
            Verified Agricultural Traders & Aggregators
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-2xl">
            Directory of licensed APMC commission agents, cold storage operators, and bulk procurement firms vetted by admin compliance.
          </p>
        </div>
      </div>

      {/* Trader Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {traders.map((trader) => (
          <div
            key={trader.id}
            className="bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-stone-900 dark:text-white">
                      {trader.businessName}
                    </h3>
                    {trader.verifiedBadge && (
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <span className="text-xs text-stone-400">
                    Contact: {trader.contactName}
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-lg text-xs font-bold text-amber-700 dark:text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{trader.rating}</span>
                  <span className="text-stone-400 font-normal">({trader.reviewsCount})</span>
                </div>
              </div>

              <div className="text-xs text-stone-500 space-y-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{trader.address}</span>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    {trader.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-stone-400" />
                    {trader.email}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                  Procurement Crops
                </span>
                <div className="flex flex-wrap gap-1">
                  {trader.cropsHandled.map((c, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-[11px] font-semibold text-stone-700 dark:text-stone-300"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
                {trader.subscriptionTier} Partner
              </span>
              <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors">
                Contact Business
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
