import React, { useState, useMemo } from 'react';
import { storage } from '../../services/storageService';
import { SellerProfile } from '../../types';
import {
  MapPin,
  Search,
  Filter,
  ShieldCheck,
  Award,
  Phone,
  MessageSquare,
  Navigation,
  CheckCircle,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';

export const FindSellersPage: React.FC = () => {
  const sellers = storage.getState().sellers;
  const crops = storage.getState().crops;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(25);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'list' | 'map'>('list');
  const [selectedSeller, setSelectedSeller] = useState<SellerProfile | null>(null);
  const [contactSuccess, setContactSuccess] = useState(false);

  const filteredSellers = useMemo(() => {
    return sellers.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.approxLocation.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRadius = s.distanceKm <= maxRadiusKm;
      const matchVerified = !verifiedOnly || s.verified;
      const matchCrop =
        selectedCrop === 'all' ||
        s.cropsAvailable.some((c) => c.cropName.toLowerCase().includes(selectedCrop.toLowerCase()));

      return matchSearch && matchRadius && matchVerified && matchCrop;
    });
  }, [sellers, searchQuery, maxRadiusKm, verifiedOnly, selectedCrop]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setSelectedSeller(null);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-6 md:p-8 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2">
            <Navigation className="w-3.5 h-3.5" />
            Direct Producer Marketplace
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
            Find Nearby Farmers & Sellers
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-2xl">
            Connect directly with verified local growers to purchase fresh harvest at fair prices. Private home addresses are masked to protect farmer privacy.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveView('list')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeView === 'list'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-500'
            }`}
          >
            List View ({filteredSellers.length})
          </button>
          <button
            onClick={() => setActiveView('map')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeView === 'map'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-500'
            }`}
          >
            🗺️ Interactive Map
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-5 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search farmer name or district..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
            />
          </div>

          <div>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium"
            >
              <option value="all">All Produce Types</option>
              {crops.map((c) => (
                <option key={c.id} value={c.name.split(' ')[0]}>
                  {c.icon} {c.name.split(' ')[0]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-500 font-medium whitespace-nowrap">Radius:</span>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={maxRadiusKm}
              onChange={(e) => setMaxRadiusKm(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <span className="font-bold text-stone-800 dark:text-stone-200 min-w-[45px]">
              {maxRadiusKm} km
            </span>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
              />
              <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Farmers Only
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Content: Map or List */}
      {activeView === 'map' ? (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="relative w-full h-96 bg-stone-100 dark:bg-stone-800 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 flex items-center justify-center">
            {/* Visual Simulated Map Grid */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute top-4 left-4 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-800 dark:text-stone-200 shadow-sm">
              📍 Simulated Agro-Clustering Map (Meerut & Delhi-NCR Belt)
            </div>

            {/* Map Markers for sellers */}
            {filteredSellers.map((seller, idx) => {
              const offsets = [
                { top: '35%', left: '42%' },
                { top: '55%', left: '60%' },
                { top: '25%', left: '68%' },
                { top: '65%', left: '30%' },
              ];
              const pos = offsets[idx % offsets.length];

              return (
                <div
                  key={seller.id}
                  style={{ top: pos.top, left: pos.left }}
                  onClick={() => setSelectedSeller(seller)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                >
                  <div className="relative flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-lg group-hover:scale-110 transition-transform ring-4 ring-emerald-400/30">
                      🌾
                    </div>
                    <div className="bg-stone-900 text-white px-2 py-0.5 rounded text-[10px] font-bold mt-1 shadow-md whitespace-nowrap">
                      {seller.name.split(' ')[0]} ({seller.distanceKm} km)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSellers.map((seller) => (
            <div
              key={seller.id}
              className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                      {seller.name}
                      {seller.verified && (
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      {seller.approxLocation}
                    </p>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800">
                    {seller.distanceKm} km away
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs border-y border-stone-100 dark:border-stone-800/80 py-2.5">
                  <div className="flex items-center gap-1 font-semibold text-stone-700 dark:text-stone-300">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Trust: {seller.trustScore}/100</span>
                  </div>
                  <span className="text-stone-300 dark:text-stone-700">•</span>
                  <div className="text-stone-500 text-[11px]">
                    {seller.directPickupAvailable ? '✓ Farmgate pickup' : 'Logistics partner'}
                  </div>
                </div>

                {/* Available Produce */}
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                    Available Harvest Lot
                  </span>
                  <div className="space-y-1.5">
                    {seller.cropsAvailable.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs bg-stone-50 dark:bg-stone-800/60 p-2 rounded-xl"
                      >
                        <span className="font-semibold text-stone-800 dark:text-stone-200">
                          {c.cropName} ({c.variety})
                        </span>
                        <div className="text-right">
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                            ₹{c.pricePerKg}/kg
                          </span>
                          <span className="text-[10px] text-stone-400 block">
                            {c.quantityAvailableKg} kg left
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2">
                <button
                  onClick={() => setSelectedSeller(seller)}
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Enquire / Book Lot</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contact / Booking Modal */}
      {selectedSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 relative">
            {contactSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white">
                  Enquiry Dispatched!
                </h3>
                <p className="text-xs text-stone-500">
                  {selectedSeller.name} has been notified via SMS & PriceXact app.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white">
                  Direct Enquiry: {selectedSeller.name}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Approx Location: {selectedSeller.approxLocation} • Masked Contact: {selectedSeller.phoneMasked}
                </p>

                <form onSubmit={handleContactSubmit} className="mt-4 space-y-3 text-xs">
                  <div>
                    <label className="block font-medium mb-1">Requested Produce</label>
                    <select className="w-full p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800">
                      {selectedSeller.cropsAvailable.map((c, i) => (
                        <option key={i}>
                          {c.cropName} - ₹{c.pricePerKg}/kg ({c.quantityAvailableKg} kg ready)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Desired Quantity (kg)</label>
                    <input
                      type="number"
                      defaultValue="25"
                      min="1"
                      className="w-full p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">Your Message / Delivery Preference</label>
                    <textarea
                      rows={3}
                      defaultValue="Hello, looking to pick up 25kg fresh lot this weekend."
                      className="w-full p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedSeller(null)}
                      className="flex-1 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                    >
                      Send Direct Message
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
