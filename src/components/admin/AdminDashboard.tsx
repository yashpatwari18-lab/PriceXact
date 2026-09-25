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

import { INITIAL_VERIFICATION_QUEUE } from '../../services/locationAndRiskService';
import { LocationVerificationQueueItem } from '../../types';
import { MapPin, Navigation } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { refreshUserState } = useAuth();
  const users = storage.getState().users;
  const submissions = storage.getState().submissions;
  const moderationReports = storage.getState().moderationReports;
  const markets = storage.getState().markets;

  const [activeTab, setActiveTab] = useState<'moderation' | 'verification' | 'location' | 'submissions' | 'users'>('moderation');
  const [locationQueue, setLocationQueue] = useState<LocationVerificationQueueItem[]>(INITIAL_VERIFICATION_QUEUE);

  const pendingReports = moderationReports.filter((r) => r.status === 'pending');
  const pendingFarmers = users.filter((u) => u.role === 'farmer' && u.verificationStatus === 'temporary');

  const handleResolveReport = (reportId: string, action: 'dismiss' | 'warn' | 'remove_submission' | 'penalize') => {
    storage.resolveModerationReport(reportId, action);
    refreshUserState();
  };

  const handleVerifyLocationAction = (queueId: string, action: 'approve' | 'request_pass' | 'dismiss') => {
    setLocationQueue((prev) =>
      prev.map((item) => {
        if (item.id === queueId) {
          return {
            ...item,
            status: action === 'approve' ? 'verified' : action === 'request_pass' ? 'manual_review' : 'dismissed',
          };
        }
        return item;
      })
    );
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
          onClick={() => setActiveTab('location')}
          className={`py-2 px-4 rounded-xl transition-all ${
            activeTab === 'location'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          📍 Location Risk & Telemetry ({locationQueue.length})
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

      {/* Tab: Location Risk & Telemetry Queue */}
      {activeTab === 'location' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-stone-900 dark:text-white text-base flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  Farmer Location Risk & Urban Telemetry Verification Queue
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Geo-Fence Audit System
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Audit producers whose current physical login telemetry deviates from registered farm acreage coordinates.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              {locationQueue.filter((q) => q.status === 'pending').length} Pending Location Audits
            </span>
          </div>

          {/* Mandatory College Specification Rule Notice */}
          <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-semibold block">
                PriceXact Core Integrity Rule: Urban Telemetry ≠ Middleman
              </strong>
              <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                A farmer logging in from an urban commercial hub (e.g., Central Kolkata) is <strong>never automatically classified as an unauthorized middleman</strong>. Farmers regularly travel to urban terminal mandis (like Sealdah or Posta) with truckloads of produce or to acquire farm supplies. The algorithm flags them for <strong>verification review</strong> to cross-reference their KCC land record with physical APMC transport slips.
              </p>
            </div>
          </div>

          {locationQueue.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-400">
              No location discrepancies detected. All active telemetry matches registered farm locations.
            </div>
          ) : (
            <div className="space-y-4">
              {locationQueue.map((item) => (
                <div
                  key={item.id}
                  className="p-5 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-4 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-stone-900 dark:text-white text-sm">
                          {item.userName}
                        </h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                          item.status === 'verified'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : item.status === 'manual_review'
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        }`}>
                          {item.status === 'verified'
                            ? '✓ Verified Farmgate/Mandi Trip'
                            : item.status === 'manual_review'
                            ? 'Gate Pass Requested'
                            : 'Flagged for Location Verification'}
                        </span>
                      </div>
                      <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
                        {item.riskReason}
                      </p>
                    </div>

                    <div className="text-right sm:text-right text-stone-500 font-mono text-[11px] shrink-0">
                      <span>Telemetry Gap: </span>
                      <strong className="text-rose-600 dark:text-rose-400 font-bold">{item.distanceKm} km</strong>
                    </div>
                  </div>

                  {/* Discrepancy Matrix */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200/80 dark:border-stone-800 text-[11px]">
                    <div className="space-y-1">
                      <span className="text-stone-400 font-semibold block uppercase text-[9px]">
                        Registered Agricultural Land
                      </span>
                      <div className="text-stone-800 dark:text-stone-200 font-medium">
                        {item.declaredVillage}, {item.declaredDistrict}, {item.declaredState}
                      </div>
                      <div className="text-stone-500 font-mono text-[10px]">
                        KCC: {item.kccNumber} · Khatian: {item.khatianNumber}
                      </div>
                    </div>

                    <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-stone-100 dark:border-stone-800 sm:pl-3 pt-2 sm:pt-0">
                      <span className="text-amber-500 font-semibold block uppercase text-[9px]">
                        Active Detected Login Telemetry
                      </span>
                      <div className="text-stone-800 dark:text-stone-200 font-medium">
                        {item.detectedRegion || `${item.detectedLocality || item.detectedDistrict}, ${item.detectedState}`}
                      </div>
                      <div className="text-stone-500 font-mono text-[10px]">
                        Audit Timestamp: {new Date(item.flaggedAt).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Admin Resolution Buttons */}
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <button
                      onClick={() => handleVerifyLocationAction(item.id, 'approve')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                        item.status === 'verified'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-300 dark:border-emerald-800'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve Mandi Transport Trip (+15 pts)</span>
                    </button>

                    <button
                      onClick={() => handleVerifyLocationAction(item.id, 'request_pass')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                        item.status === 'manual_review'
                          ? 'bg-blue-600 text-white'
                          : 'bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-200 border border-stone-300 dark:border-stone-600'
                      }`}
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Request Mandi Gate Pass / Challan</span>
                    </button>

                    <button
                      onClick={() => handleVerifyLocationAction(item.id, 'dismiss')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                    >
                      Dismiss Review
                    </button>
                  </div>
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
