import React, { useState } from 'react';
import { storage } from '../../services/storageService';
import { GovernmentScheme } from '../../types';
import {
  Landmark,
  Search,
  Filter,
  ExternalLink,
  CheckCircle,
  FileText,
  Clock,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export const GovernmentSchemesPage: React.FC = () => {
  const schemes = storage.getState().schemes;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [appliedSchemes, setAppliedSchemes] = useState<Record<string, boolean>>({});

  const filteredSchemes = schemes.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.hindiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.benefits.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'all' || s.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const handleApply = (schemeId: string) => {
    setAppliedSchemes((prev) => ({ ...prev, [schemeId]: true }));
    storage.addNotification({
      userId: storage.getCurrentUser().id,
      type: 'scheme_alert',
      title: '🏛 Scheme Application Verification Initiated',
      message: `Your pre-verification profile packet for ${schemes.find((s) => s.id === schemeId)?.name} has been compiled. Proceed to the official DBT portal.`,
      link: '/schemes',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2">
            <Landmark className="w-3.5 h-3.5" />
            Central & State Welfare Catalog
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
            Government Agricultural Schemes
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-2xl">
            Official financial subsidies, crop insurance protection, e-NAM market integration, and post-harvest infrastructure programs available to verified farmers.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-5 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search schemes (PM-KISAN, crop insurance, AIF subsidy)..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-stone-500 font-medium">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-medium"
          >
            <option value="all">All Scheme Categories</option>
            <option value="credit">Direct Financial & Credit</option>
            <option value="insurance">Crop Insurance</option>
            <option value="infrastructure">Infrastructure & e-NAM</option>
          </select>
        </div>
      </div>

      {/* Scheme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSchemes.map((scheme) => {
          const isApplied = appliedSchemes[scheme.id];

          return (
            <div
              key={scheme.id}
              className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white leading-snug">
                      {scheme.name}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                      {scheme.hindiName}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    {scheme.category}
                  </span>
                </div>

                {/* Benefits */}
                <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl text-xs text-stone-700 dark:text-stone-300 border border-stone-100 dark:border-stone-700/60 leading-relaxed">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                    Direct Benefits:
                  </span>
                  {scheme.benefits}
                </div>

                {/* Eligibility Checklist */}
                <div>
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                    Eligibility Criteria
                  </span>
                  <ul className="space-y-1 text-xs text-stone-600 dark:text-stone-300">
                    {scheme.eligibility.map((crit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{crit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Required Documents */}
                <div>
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                    Required Documentation
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {scheme.requiredDocs.map((doc, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-[11px] text-stone-600 dark:text-stone-300 font-medium flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3 text-stone-400" />
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3 text-xs">
                <a
                  href={scheme.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {isApplied ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                    <CheckCircle className="w-3.5 h-3.5" /> Applied / Profile Queued
                  </span>
                ) : (
                  <button
                    onClick={() => handleApply(scheme.id)}
                    className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors shadow-xs"
                  >
                    Verify & Apply Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
