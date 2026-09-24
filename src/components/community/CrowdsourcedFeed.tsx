import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storageService';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Calendar,
  ShieldCheck,
  Award,
  Filter,
  Search,
  Flag,
} from 'lucide-react';

export const CrowdsourcedFeed: React.FC = () => {
  const { currentUser, refreshUserState } = useAuth();
  const submissions = storage.getState().submissions;

  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [flagModalSubId, setFlagModalSubId] = useState<string | null>(null);
  const [flagReason, setFlagReason] = useState<string>('Inaccurate price for prevailing market');

  const handleConfirm = (id: string) => {
    storage.confirmSubmission(id);
    refreshUserState();
  };

  const handleFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (flagModalSubId) {
      storage.flagSubmission(flagModalSubId, flagReason);
      setFlagModalSubId(null);
      refreshUserState();
    }
  };

  const filteredSubs = submissions.filter((s) => {
    const matchCrop = selectedCrop === 'all' || s.cropId === selectedCrop;
    const matchRole = filterRole === 'all' || s.submitterRole === filterRole;
    return matchCrop && matchRole;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            Crowdsourced Community Validation
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
            Community Price Intelligence Feed
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-2xl">
            Real, crowdsourced agricultural price records submitted by verified farmers and retail consumers. Confirm accurate prices to boost trust scores or flag suspicious anomalies.
          </p>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubs.map((sub) => {
          const hasConfirmed = sub.confirmedByUserIds.includes(currentUser.id);
          const hasFlagged = sub.flaggedByUserIds.includes(currentUser.id);

          return (
            <div
              key={sub.id}
              className="bg-white dark:bg-stone-900 rounded-2xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center font-bold text-emerald-700 dark:text-emerald-400 text-base">
                    {sub.submitterRole === 'farmer' ? '🌾' : '🛒'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 dark:text-white text-sm">
                        {sub.submitterName}
                      </span>
                      {sub.submitterVerification === 'verified' && (
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      )}
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                        {sub.submitterRole}
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      {sub.district}, {sub.state} • {sub.marketName}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    ₹{sub.normalizedPricePerKg}
                    <span className="text-xs font-normal text-stone-400 ml-1">/kg</span>
                  </div>
                  <span className="text-[10px] text-stone-400">
                    Entered: {sub.originalPrice} {sub.originalUnit} ({sub.quantity} {sub.originalUnit.replace('₹/', '')})
                  </span>
                </div>
              </div>

              {sub.notes && (
                <p className="text-xs text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-800/60 p-2.5 rounded-xl border border-stone-100 dark:border-stone-700/60">
                  "{sub.notes}"
                </p>
              )}

              {/* Action Ribbon: Confirm, Flag */}
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleConfirm(sub.id)}
                    disabled={hasConfirmed}
                    className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
                      hasConfirmed
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 font-bold border border-emerald-300'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{hasConfirmed ? 'Confirmed' : 'Confirm Accurate'} ({sub.confirmationsCount})</span>
                  </button>

                  <button
                    onClick={() => setFlagModalSubId(sub.id)}
                    disabled={hasFlagged}
                    className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
                      hasFlagged
                        ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                        : 'text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{hasFlagged ? 'Flagged for Review' : 'Report / Flag'} ({sub.flagsCount})</span>
                  </button>
                </div>

                <span className="text-[10px] text-stone-400">
                  {new Date(sub.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Flag Modal */}
      {flagModalSubId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800">
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              Report Suspicious Price Submission
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Moderators review all flagged entries. Flagging prevents false data from skewing statistical calculations.
            </p>

            <form onSubmit={handleFlagSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">Reason for Report</label>
                <select
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800"
                >
                  <option value="Inaccurate price for prevailing market">Inaccurate price for prevailing market</option>
                  <option value="Unrealistic or absurd outlier quote">Unrealistic or absurd outlier quote</option>
                  <option value="Wrong commodity or variety grade reported">Wrong commodity or variety grade reported</option>
                  <option value="Suspected market manipulation">Suspected market manipulation</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFlagModalSubId(null)}
                  className="flex-1 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold"
                >
                  Submit Flag to Moderation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
