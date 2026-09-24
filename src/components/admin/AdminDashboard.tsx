import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storageService';
import {
  ShieldAlert,
  Users,
  CheckCircle,
  FileCheck,
  AlertTriangle,
  XCircle,
  TrendingUp,
  BarChart3,
  Scale,
  Award,
  Trash2,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { refreshUserState } = useAuth();
  const users = storage.getState().users;
  const submissions = storage.getState().submissions;
  const moderationReports = storage.getState().moderationReports;
  const markets = storage.getState().markets;

  const [activeTab, setActiveTab] = useState<'moderation' | 'verification' | 'submissions' | 'users'>('moderation');

  const pendingReports = moderationReports.filter((r) => r.status === 'pending');
  const pendingFarmers = users.filter((u) => u.role === 'farmer' && u.verificationStatus === 'temporary');

  const handleResolveReport = (reportId: string, action: 'dismiss' | 'warn' | 'remove_submission' | 'penalize') => {
    storage.resolveModerationReport(reportId, action);
    refreshUserState();
  };

  const handleVerifyFarmer = (userId: string) => {
    storage.verifyFarmer(userId);
    refreshUserState();
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="bg-stone-900 text-white rounded-2xl p-4 sm:p-6 md:p-8 border border-stone-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            System Administration & Moderation
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            PriceXact Management Console
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl">
            Audit crowdsourced price outliers, review farmer Kisan Credit Card (KCC) credentials, resolve community reports, and monitor market coverage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold">
            {pendingReports.length} Flagged Reports
          </span>
          <span className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold">
            {pendingFarmers.length} Pending KCCs
          </span>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <span className="text-xs font-bold text-stone-400 uppercase block">Total Users</span>
          <div className="text-3xl font-black text-stone-900 dark:text-white mt-1">
            {users.length}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
            {users.filter((u) => u.verificationStatus === 'verified').length} verified accounts
          </span>
        </div>

        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <span className="text-xs font-bold text-stone-400 uppercase block">Price Submissions</span>
          <div className="text-3xl font-black text-stone-900 dark:text-white mt-1">
            {submissions.length}
          </div>
          <span className="text-[10px] text-stone-400 mt-1 block">
            Live crowdsourced inputs
          </span>
        </div>

        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <span className="text-xs font-bold text-stone-400 uppercase block">Markets Monitored</span>
          <div className="text-3xl font-black text-stone-900 dark:text-white mt-1">
            {markets.length}
          </div>
          <span className="text-[10px] text-stone-400 mt-1 block">
            APMC yards & rural mandis
          </span>
        </div>

        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <span className="text-xs font-bold text-stone-400 uppercase block">Moderation Queue</span>
          <div className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {pendingReports.length}
          </div>
          <span className="text-[10px] text-stone-400 mt-1 block">
            Requires admin evaluation
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('moderation')}
          className={`py-2 px-4 rounded-xl transition-all ${
            activeTab === 'moderation'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          🚨 Flagged Reports ({pendingReports.length})
        </button>

        <button
          onClick={() => setActiveTab('verification')}
          className={`py-2 px-4 rounded-xl transition-all ${
            activeTab === 'verification'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          🌾 KCC Farmer Verifications ({pendingFarmers.length})
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={`py-2 px-4 rounded-xl transition-all ${
            activeTab === 'submissions'
              ? 'bg-stone-900 dark:bg-stone-700 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          All Submissions ({submissions.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`py-2 px-4 rounded-xl transition-all ${
            activeTab === 'users'
              ? 'bg-stone-900 dark:bg-stone-700 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          User Registry ({users.length})
        </button>
      </div>

      {/* Tab 1: Moderation Reports */}
      {activeTab === 'moderation' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-stone-900 dark:text-white">
            Community Flag Reports Awaiting Moderation
          </h2>

          {pendingReports.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-400">
              No flagged reports currently pending. All community price inputs are within expected statistical bounds.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingReports.map((report) => (
                <div
                  key={report.id}
                  className="p-5 bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl space-y-3 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-stone-900 dark:text-white text-sm">
                        Reported User: {report.submitterName}
                      </span>
                      <p className="text-rose-700 dark:text-rose-300 font-medium mt-1">
                        Reason: {report.reason}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-stone-900 dark:text-white">
                        ₹{report.priceReported}/kg
                      </span>
                      <span className="text-[10px] text-stone-400 block">
                        {report.cropName} • {report.marketName}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-rose-100 dark:border-rose-900/40 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-stone-400">
                      Reported by {report.reportedBy} on {report.date}
                    </span>

                    {/* Admin Moderation Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleResolveReport(report.id, 'dismiss')}
                        className="px-3 py-1 rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-100 text-stone-700 font-semibold"
                      >
                        Dismiss Flag
                      </button>
                      <button
                        onClick={() => handleResolveReport(report.id, 'warn')}
                        className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                      >
                        Issue Warning
                      </button>
                      <button
                        onClick={() => handleResolveReport(report.id, 'remove_submission')}
                        className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold"
                      >
                        Delete Submission (-10 pts)
                      </button>
                      <button
                        onClick={() => handleResolveReport(report.id, 'penalize')}
                        className="px-3 py-1 rounded-lg bg-stone-900 text-white hover:bg-stone-800 font-semibold"
                      >
                        Flag Account (-25 pts)
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: KCC Farmer Verification Queue */}
      {activeTab === 'verification' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-stone-900 dark:text-white">
            Farmer Kisan Credit Card (KCC) Verification Queue
          </h2>

          {pendingFarmers.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-400">
              No pending temporary farmers in queue. All active farmers are verified.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingFarmers.map((farmer) => (
                <div
                  key={farmer.id}
                  className="p-5 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <h3 className="font-bold text-stone-900 dark:text-white text-sm">
                      {farmer.name}
                    </h3>
                    <p className="text-stone-500 mt-0.5">
                      {farmer.location.villageOrTown}, {farmer.location.district} ({farmer.location.state}) • Mobile: {farmer.mobile}
                    </p>
                    <div className="mt-1 flex items-center gap-2 font-mono text-[11px] text-stone-700 dark:text-stone-300">
                      <span>KCC: {farmer.kccId || 'Provided via upload'}</span>
                      <span>•</span>
                      <span>Khatian No: {farmer.khatianNumber || 'KH-Pending'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleVerifyFarmer(farmer.id)}
                    className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve & Grant Verified Badge (+20 pts)</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: All Submissions */}
      {activeTab === 'submissions' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[650px] text-left text-xs whitespace-nowrap">
              <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 uppercase text-[10px] tracking-wider border-b border-stone-200 dark:border-stone-800">
                <tr>
                  <th className="py-3 px-4">Commodity</th>
                  <th className="py-3 px-4">Submitter</th>
                  <th className="py-3 px-4">Market</th>
                  <th className="py-3 px-4">Price (₹/kg)</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-center">Confirmations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                    <td className="py-3 px-4 font-bold text-stone-900 dark:text-white">
                      {sub.cropName}
                    </td>
                    <td className="py-3 px-4">{sub.submitterName}</td>
                    <td className="py-3 px-4 text-stone-500">{sub.marketName}</td>
                    <td className="py-3 px-4 font-extrabold text-emerald-600">
                      ₹{sub.normalizedPricePerKg}
                    </td>
                    <td className="py-3 px-4 uppercase text-[10px] font-bold">
                      {sub.transactionType}
                    </td>
                    <td className="py-3 px-4 text-stone-400">{sub.date}</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-600">
                      {sub.confirmationsCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: User Registry */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[650px] text-left text-xs whitespace-nowrap">
              <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 uppercase text-[10px] tracking-wider border-b border-stone-200 dark:border-stone-800">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4 text-center">Trust Score</th>
                  <th className="py-3 px-4 text-center">Submissions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                    <td className="py-3 px-4 font-bold text-stone-900 dark:text-white">
                      {u.name}
                    </td>
                    <td className="py-3 px-4 uppercase text-[10px] font-bold">
                      {u.role}
                    </td>
                    <td className="py-3 px-4 text-stone-500">
                      {u.location.district}, {u.location.state}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.verificationStatus === 'verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {u.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-extrabold text-emerald-600">
                      {u.trustScore}
                    </td>
                    <td className="py-3 px-4 text-center">{u.contributionsCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
