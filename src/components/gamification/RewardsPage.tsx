import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storageService';
import {
  Gift,
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  ExternalLink,
  ShieldCheck,
  Ticket,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RewardsPage: React.FC = () => {
  const { currentUser, refreshUserState } = useAuth();
  const rewards = storage.getState().rewards;
  const [redeemedCode, setRedeemedCode] = useState<{ id: string; code: string } | null>(null);

  const handleRedeem = (rewardId: string) => {
    const success = storage.redeemReward(rewardId);
    if (success) {
      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
      refreshUserState();
      const rw = storage.getState().rewards.find((r) => r.id === rewardId);
      if (rw?.voucherCode) {
        setRedeemedCode({ id: rewardId, code: rw.voucherCode });
      }
    } else {
      alert('Insufficient Trust Points to redeem this reward.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header with Balance */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-2">
            <Gift className="w-3.5 h-3.5" />
            Farmer & Contributor Incentive Ecosystem
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Incentive Rewards & Agrotourism
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-2xl">
            Redeem your accumulated Trust Score points for sponsored experimental farm visits, certified bio-fertilizers, and passes to national agricultural exhibitions.
          </p>
        </div>

        {/* Balance Card */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[160px]">
          <span className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider block">
            Your Trust Points
          </span>
          <div className="text-4xl font-black text-white mt-1">
            {currentUser.trustScore}
          </div>
          <span className="text-[10px] text-emerald-300 mt-0.5 block">
            Ranked #{currentUser.trustScore > 90 ? '1' : '3'} in district
          </span>
        </div>
      </div>

      {/* Rewards Catalog Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          Available Incentive Catalog
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rewards.map((reward) => {
            const canAfford = currentUser.trustScore >= reward.pointsCost;
            const isRedeemed = reward.isRedeemed;

            return (
              <div
                key={reward.id}
                className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {reward.imageUrl && (
                    <div className="h-44 w-full overflow-hidden relative">
                      <img
                        src={reward.imageUrl}
                        alt={reward.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-extrabold bg-stone-900/80 text-white backdrop-blur-md">
                        {reward.pointsCost} Points
                      </span>
                    </div>
                  )}

                  <div className="p-6 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      {reward.provider}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 dark:text-white leading-snug">
                      {reward.title}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                      {reward.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-stone-100 dark:border-stone-800/80 mt-4">
                  {isRedeemed ? (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-center border border-emerald-200 dark:border-emerald-800 text-xs">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
                        ✓ Redeemed Voucher
                      </span>
                      <code className="font-mono text-xs font-bold text-stone-800 dark:text-stone-200">
                        {reward.voucherCode}
                      </code>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRedeem(reward.id)}
                      disabled={!canAfford}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                        canAfford
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? (
                        <>
                          <Ticket className="w-3.5 h-3.5" />
                          <span>Redeem Voucher ({reward.pointsCost} pts)</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Need {reward.pointsCost - currentUser.trustScore} more points</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
