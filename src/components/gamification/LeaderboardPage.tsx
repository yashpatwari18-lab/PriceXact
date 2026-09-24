import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storageService';
import {
  Trophy,
  Award,
  Medal,
  ShieldCheck,
  EyeOff,
  Eye,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const { currentUser, refreshUserState } = useAuth();
  const users = storage.getState().users;

  const [activeTab, setActiveTab] = useState<'farmer' | 'consumer' | 'verifier'>('farmer');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(
    currentUser.isAnonymousLeaderboard || false
  );

  const toggleAnonymous = () => {
    const nextVal = !isAnonymous;
    setIsAnonymous(nextVal);
    storage.updateUserProfile(currentUser.id, { isAnonymousLeaderboard: nextVal });
    refreshUserState();
  };

  const filteredUsers = users
    .filter((u) => {
      if (activeTab === 'farmer') return u.role === 'farmer';
      if (activeTab === 'consumer') return u.role === 'consumer';
      return u.contributionsCount > 5;
    })
    .sort((a, b) => b.trustScore - a.trustScore);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-emerald-700 to-green-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5" />
            Agricultural Trust & Contribution Standings
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Community Trust Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-2xl">
            Recognizing farmers and consumers whose accurate, verified price inputs eliminate information asymmetry and empower regional markets.
          </p>
        </div>

        {/* Privacy toggle */}
        <button
          onClick={toggleAnonymous}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold backdrop-blur-md transition-all whitespace-nowrap"
        >
          {isAnonymous ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{isAnonymous ? 'Masked Profile (Anonymous)' : 'Public Profile'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('farmer')}
          className={`py-2 px-4 rounded-xl transition-all ${
            activeTab === 'farmer'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          🌾 Top Farmers
        </button>
        <button
          onClick={() => setActiveTab('consumer')}
          className={`py-2 px-4 rounded-xl transition-all ${
            activeTab === 'consumer'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          🛒 Top Consumers
        </button>
        <button
          onClick={() => setActiveTab('verifier')}
          className={`py-2 px-4 rounded-xl transition-all ${
            activeTab === 'verifier'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          ⭐ Top Price Verifiers
        </button>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 uppercase text-[10px] tracking-wider border-b border-stone-200 dark:border-stone-800">
              <tr>
                <th className="py-3 px-4 font-semibold text-center w-12">Rank</th>
                <th className="py-3 px-4 font-semibold">Contributor</th>
                <th className="py-3 px-4 font-semibold">Location</th>
                <th className="py-3 px-4 font-semibold text-center">Trust Score</th>
                <th className="py-3 px-4 font-semibold text-center">Contributions</th>
                <th className="py-3 px-4 font-semibold text-center">Accuracy</th>
                <th className="py-3 px-4 font-semibold">Earned Badges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-medium">
              {filteredUsers.map((user, idx) => {
                const rank = idx + 1;
                const isCurrent = user.id === currentUser.id;
                const displayName =
                  user.isAnonymousLeaderboard && !isCurrent
                    ? `${user.role.toUpperCase()} #${user.id.slice(-4)}`
                    : user.name;

                return (
                  <tr
                    key={user.id}
                    className={`transition-colors ${
                      isCurrent
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/40 font-bold'
                        : 'hover:bg-stone-50 dark:hover:bg-stone-800/40'
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center">
                      {rank === 1 ? (
                        <span className="w-6 h-6 rounded-full bg-amber-400 text-stone-900 font-extrabold text-xs inline-flex items-center justify-center shadow-xs">
                          1
                        </span>
                      ) : rank === 2 ? (
                        <span className="w-6 h-6 rounded-full bg-stone-300 text-stone-900 font-extrabold text-xs inline-flex items-center justify-center">
                          2
                        </span>
                      ) : rank === 3 ? (
                        <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-extrabold text-xs inline-flex items-center justify-center">
                          3
                        </span>
                      ) : (
                        <span className="text-stone-400">{rank}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 dark:text-white">
                          {displayName}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold">
                            YOU
                          </span>
                        )}
                        {user.verificationStatus === 'verified' && (
                          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-stone-500 dark:text-stone-400 text-xs">
                      {user.location.district}, {user.location.state}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                        {user.trustScore}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center text-stone-700 dark:text-stone-300">
                      {user.contributionsCount}
                    </td>

                    <td className="py-3.5 px-4 text-center font-semibold text-emerald-700 dark:text-emerald-400">
                      {user.accuracyRate}%
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {user.badges.map((b, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
