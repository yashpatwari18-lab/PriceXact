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
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const { currentUser, refreshUserState } = useAuth();
  const [activeTab, setActiveTab] = useState<'farmer' | 'consumer' | 'verifier'>('farmer');
  const [isAnonymous, setIsAnonymous] = useState(currentUser.isAnonymousLeaderboard);

  const allUsers = storage.getState().users;

  const toggleAnonymous = () => {
    const updated = !isAnonymous;
    setIsAnonymous(updated);
    storage.updateUserProfile(currentUser.id, { isAnonymousLeaderboard: updated });
    refreshUserState();
  };

  const filteredUsers = allUsers
    .filter((u) => {
      if (activeTab === 'farmer') return u.role === 'farmer';
      if (activeTab === 'consumer') return u.role === 'consumer';
      return u.contributionsCount > 5;
    })
    .sort((a, b) => b.trustScore - a.trustScore);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-[#141A17] rounded-2xl p-6 sm:p-8 border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
            Community Verifier Standings
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-white">
            Agricultural Trust & Integrity Index
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
            Recognizing farmers and consumers whose accurate, verified price contributions eliminate regional information asymmetry.
          </p>
        </div>

        {/* Privacy toggle */}
        <button
          onClick={toggleAnonymous}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-medium border border-stone-200/80 dark:border-stone-700 transition-colors whitespace-nowrap"
        >
          {isAnonymous ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{isAnonymous ? 'Masked Profile' : 'Public Profile'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('farmer')}
          className={`py-2 px-4 rounded-lg transition-all ${
            activeTab === 'farmer'
              ? 'bg-[#143828] text-white shadow-xs font-semibold'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          Producer Leaders
        </button>
        <button
          onClick={() => setActiveTab('consumer')}
          className={`py-2 px-4 rounded-lg transition-all ${
            activeTab === 'consumer'
              ? 'bg-[#143828] text-white shadow-xs font-semibold'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          Consumer Reporters
        </button>
        <button
          onClick={() => setActiveTab('verifier')}
          className={`py-2 px-4 rounded-lg transition-all ${
            activeTab === 'verifier'
              ? 'bg-[#143828] text-white shadow-xs font-semibold'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          Top Price Verifiers
        </button>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-[#141A17] rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 uppercase text-[10px] tracking-wider border-b border-stone-200 dark:border-stone-800">
              <tr>
                <th className="py-3 px-4 font-semibold text-center w-12">Rank</th>
                <th className="py-3 px-4 font-semibold">Contributor</th>
                <th className="py-3 px-4 font-semibold">Location</th>
                <th className="py-3 px-4 font-semibold text-center">Trust Score</th>
                <th className="py-3 px-4 font-semibold text-center">Submissions</th>
                <th className="py-3 px-4 font-semibold text-center">Trimmed Inlier Rate</th>
                <th className="py-3 px-4 font-semibold">Recognition</th>
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
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/30 font-semibold'
                        : 'hover:bg-stone-50/60 dark:hover:bg-stone-800/40'
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center font-mono">
                      {rank === 1 ? (
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-900 font-extrabold text-[11px] inline-flex items-center justify-center">
                          1
                        </span>
                      ) : rank === 2 ? (
                        <span className="w-5 h-5 rounded-full bg-stone-300 text-stone-900 font-extrabold text-[11px] inline-flex items-center justify-center">
                          2
                        </span>
                      ) : rank === 3 ? (
                        <span className="w-5 h-5 rounded-full bg-amber-700 text-white font-extrabold text-[11px] inline-flex items-center justify-center">
                          3
                        </span>
                      ) : (
                        <span className="text-stone-400">{rank}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-900 dark:text-white">
                          {displayName}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                            (You)
                          </span>
                        )}
                        {user.verificationStatus === 'verified' && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-stone-500">
                      {user.location.district}, {user.location.state}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono text-stone-900 dark:text-white font-bold tabular-nums">
                      {user.trustScore}
                      <span className="text-[10px] text-stone-400 font-normal">/100</span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono tabular-nums text-stone-700 dark:text-stone-300">
                      {user.contributionsCount}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono tabular-nums text-emerald-700 dark:text-emerald-400 font-semibold">
                      98.2%
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {user.badges.slice(0, 2).map((b, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-medium"
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
