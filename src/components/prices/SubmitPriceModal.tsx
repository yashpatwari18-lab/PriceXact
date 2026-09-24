import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storageService';
import { UnitType } from '../../types';
import { normalizePriceToPerKg } from '../../services/calculationEngine';
import {
  X,
  PlusCircle,
  MapPin,
  Upload,
  CheckCircle,
  DollarSign,
  Calendar,
  Sparkles,
  Camera,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SubmitPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SubmitPriceModal: React.FC<SubmitPriceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentUser, t, refreshUserState } = useAuth();
  const crops = storage.getState().crops;
  const markets = storage.getState().markets;

  const [cropId, setCropId] = useState(crops[0]?.id || 'crop_wheat');
  const [marketId, setMarketId] = useState(markets[0]?.id || 'mkt_azadpur');
  const [originalPrice, setOriginalPrice] = useState<number | ''>(24);
  const [originalUnit, setOriginalUnit] = useState<UnitType>('₹/kg');
  const [quantity, setQuantity] = useState<number | ''>(50);
  const [transactionType, setTransactionType] = useState<'sell' | 'buy'>(
    currentUser.role === 'farmer' ? 'sell' : 'buy'
  );
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [district, setDistrict] = useState(currentUser.location.district || 'Meerut');
  const [state, setState] = useState(currentUser.location.state || 'Uttar Pradesh');
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [gpsTagActive, setGpsTagActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<{
    cropName: string;
    normalizedPrice: number;
    trustGained: number;
  } | null>(null);

  if (!isOpen) return null;

  const selectedCrop = crops.find((c) => c.id === cropId);
  const normalizedPreview =
    typeof originalPrice === 'number' && originalPrice > 0
      ? normalizePriceToPerKg(originalPrice, originalUnit, selectedCrop?.category)
      : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalPrice || originalPrice <= 0) return;

    setIsSubmitting(true);

    try {
      const newSub = storage.addSubmission({
        cropId,
        marketId,
        originalPrice: Number(originalPrice),
        originalUnit,
        quantity: Number(quantity) || 1,
        transactionType,
        notes: notes || undefined,
        district,
        state,
        photoUrl: photoUploaded
          ? 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=300&auto=format&fit=crop&q=80'
          : undefined,
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (err) {
        // Safe fallback
      }

      setSuccessResult({
        cropName: newSub.cropName,
        normalizedPrice: newSub.normalizedPricePerKg,
        trustGained: 10,
      });

      refreshUserState();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDone = () => {
    setSuccessResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-stone-200 dark:border-stone-800 relative my-4 sm:my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {successResult ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-bold text-stone-900 dark:text-white">
              Price Contribution Recorded!
            </h3>

            <p className="text-sm text-stone-600 dark:text-stone-300">
              Thank you for strengthening agricultural transparency.
            </p>

            <div className="bg-stone-50 dark:bg-stone-800 p-4 rounded-xl border border-stone-100 dark:border-stone-700 max-w-sm mx-auto space-y-2 text-left">
              <div className="flex justify-between text-xs">
                <span className="text-stone-500">Crop:</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {successResult.cropName}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-500">Normalized Value:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  ₹{successResult.normalizedPrice}/kg
                </span>
              </div>
              <div className="flex justify-between text-xs border-t border-stone-200 dark:border-stone-700 pt-2">
                <span className="text-stone-500">Trust Score Reward:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> +{successResult.trustGained} Points
                </span>
              </div>
            </div>

            <button
              onClick={handleDone}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm shadow-md transition-colors"
            >
              Continue to Market Intelligence
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  <DollarSign className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                    {currentUser.role === 'farmer' ? 'Submit Farmgate Selling Price' : 'Submit Consumer Purchase Price'}
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Your real price entry directly updates the trimmed community intelligence engine.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Transaction Type Selector */}
              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Transaction Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTransactionType('sell')}
                    className={`py-2 px-3 rounded-lg font-medium border text-center transition-all ${
                      transactionType === 'sell'
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold'
                        : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    🌾 Farmer Selling (Farmgate)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransactionType('buy')}
                    className={`py-2 px-3 rounded-lg font-medium border text-center transition-all ${
                      transactionType === 'buy'
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold'
                        : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    🛒 Consumer Purchase (Retail)
                  </button>
                </div>
              </div>

              {/* Crop & Market Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Commodity / Crop *
                  </label>
                  <select
                    value={cropId}
                    onChange={(e) => setCropId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
                  >
                    {crops.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Market / Mandi *
                  </label>
                  <select
                    value={marketId}
                    onChange={(e) => setMarketId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
                  >
                    {markets.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.district})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Unit Grid with live ₹/kg normalization indicator */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Price Rate *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold"
                    placeholder="e.g. 2450"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Unit *
                  </label>
                  <select
                    value={originalUnit}
                    onChange={(e) => setOriginalUnit(e.target.value as UnitType)}
                    className="w-full p-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
                  >
                    <option value="₹/kg">₹ / Kilogram (kg)</option>
                    <option value="₹/quintal">₹ / Quintal (100 kg)</option>
                    <option value="₹/ton">₹ / Metric Ton (1000 kg)</option>
                    <option value="₹/piece">₹ / Piece (Standard unit)</option>
                    <option value="₹/litre">₹ / Litre</option>
                  </select>
                </div>
              </div>

              {/* Real-time normalized preview banner */}
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold block">
                    Normalized Standard Value:
                  </span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400">
                    Automatic unit conversion for price intelligence
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                    ₹{normalizedPreview} / kg
                  </span>
                </div>
              </div>

              {/* Quantity & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Quantity Transacted ({originalUnit.replace('₹/', '')})
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    placeholder="e.g. 50"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Date of Transaction
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              {/* Optional Photo / Receipt & GPS Verification */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-300">
                  <span className="flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-stone-400" />
                    Bill / Mandi Slip / Crop Photo (Optional)
                  </span>
                  <button
                    type="button"
                    onClick={() => setPhotoUploaded(!photoUploaded)}
                    className={`font-semibold ${
                      photoUploaded ? 'text-emerald-600' : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    {photoUploaded ? '✓ Receipt Attached' : '+ Attach Simulated Slip'}
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/60 p-2 rounded-lg">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    GPS Verification Tag: <strong>{district}, {state}</strong>
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Variety / Quality Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Grade A moisture 11%, freshly harvested"
                  className="w-full p-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 mt-4"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publish Real Price Entry (+10 Trust)</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
