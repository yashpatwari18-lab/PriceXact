import React, { useState } from 'react';
import { storage } from '../../services/storageService';
import {
  CloudSun,
  Droplets,
  Wind,
  Compass,
  AlertTriangle,
  Info,
  Calendar,
  Sparkles,
  MapPin,
} from 'lucide-react';

export const WeatherPage: React.FC = () => {
  const weather = storage.getState().weather;
  const [selectedHub, setSelectedHub] = useState('meerut');

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-2">
            <CloudSun className="w-3.5 h-3.5" />
            Agricultural Micro-Climate Advisory
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Weather & Crop Spraying Forecast
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-2xl">
            Real-time agro-meteorological observations to optimize sowing, irrigation cycles, pesticide spraying windows, and post-harvest drying.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-xs text-emerald-200">
          📍 Location: <strong>{weather.city}</strong>
        </div>
      </div>

      {/* Today's Conditions Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Current Metrics Card */}
        <div className="lg:col-span-6 bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-6 md:p-8 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Current Agro-Climate
                </span>
                <div className="text-4xl sm:text-5xl font-extrabold text-stone-900 dark:text-white mt-1">
                  {weather.temp}°C
                </div>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1 block">
                  {weather.condition} • Feels favorable
                </span>
              </div>
              <div className="text-6xl">{weather.icon}</div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-stone-100 dark:border-stone-800 text-xs">
              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
                <span className="text-stone-400 flex items-center gap-1 mb-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-500" />
                  Humidity
                </span>
                <span className="text-base font-bold text-stone-800 dark:text-stone-200">
                  {weather.humidity}%
                </span>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
                <span className="text-stone-400 flex items-center gap-1 mb-1">
                  <CloudSun className="w-3.5 h-3.5 text-amber-500" />
                  Rain Chance
                </span>
                <span className="text-base font-bold text-stone-800 dark:text-stone-200">
                  {weather.rainProbability}%
                </span>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
                <span className="text-stone-400 flex items-center gap-1 mb-1">
                  <Wind className="w-3.5 h-3.5 text-teal-500" />
                  Wind Speed
                </span>
                <span className="text-base font-bold text-stone-800 dark:text-stone-200">
                  {weather.windSpeed} km/h
                </span>
              </div>
            </div>
          </div>

          {/* Advisory banner */}
          <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 text-xs">
            <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Agronomist Advisory Window:
            </span>
            <p className="text-emerald-800/90 dark:text-emerald-200/90 leading-relaxed">
              {weather.agriculturalAdvisory}
            </p>
          </div>
        </div>

        {/* 7-Day Outlook List */}
        <div className="lg:col-span-6 bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            7-Day Farming Weather Outlook
          </h2>

          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {weather.forecast7Days.map((item, idx) => (
              <div
                key={idx}
                className="py-3 flex items-center justify-between text-xs hover:bg-stone-50 dark:hover:bg-stone-800/40 px-2 rounded-xl transition-colors"
              >
                <div className="w-28 font-semibold text-stone-800 dark:text-stone-200">
                  {item.day}
                </div>
                <div className="text-stone-500 flex items-center gap-2">
                  <span>{item.condition}</span>
                  {item.rainProb > 40 && (
                    <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                      ☔ {item.rainProb}% rain
                    </span>
                  )}
                </div>
                <div className="text-right font-bold text-stone-900 dark:text-white">
                  <span>{item.tempMax}°</span>
                  <span className="text-stone-400 font-normal ml-1">/ {item.tempMin}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
