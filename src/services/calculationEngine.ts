import { UnitType, ForecastResult, ForecastPoint } from '../types';

/**
 * Normalizes any quantity and price unit to standard ₹/kg
 */
export function normalizePriceToPerKg(price: number, unit: UnitType, cropCategory?: string): number {
  if (price <= 0) return 0;
  switch (unit) {
    case '₹/kg':
      return Number(price.toFixed(2));
    case '₹/quintal':
      // 1 Quintal = 100 kg
      return Number((price / 100).toFixed(2));
    case '₹/ton':
      // 1 Ton = 1000 kg
      return Number((price / 1000).toFixed(2));
    case '₹/piece':
      // Approximate piece to kg standard
      const factor = cropCategory === 'fruit' ? 0.35 : 0.5;
      return Number((price / factor).toFixed(2));
    case '₹/litre':
      return Number(price.toFixed(2));
    default:
      return Number(price.toFixed(2));
  }
}

export interface TrimmedStatsResult {
  originalCount: number;
  trimmedCount: number;
  trimmedOutCount: number;
  sortedPrices: number[];
  trimmedPrices: number[];
  trimmedMin: number;
  trimmedMax: number;
  mean: number;
  stdDev: number;
  median: number;
  fluctuationRate: number; // percentage
}

/**
 * Statistical data cleaning engine with 10% lower & upper trimming,
 * arithmetic mean, standard deviation, and fluctuation rate
 */
export function calculateTrimmedStats(
  prices: number[],
  baselinePrice?: number,
  trimPercent: number = 0.10
): TrimmedStatsResult {
  if (!prices || prices.length === 0) {
    return {
      originalCount: 0,
      trimmedCount: 0,
      trimmedOutCount: 0,
      sortedPrices: [],
      trimmedPrices: [],
      trimmedMin: 0,
      trimmedMax: 0,
      mean: 0,
      stdDev: 0,
      median: 0,
      fluctuationRate: 0,
    };
  }

  // 1. Sort dataset
  const sorted = [...prices].sort((a, b) => a - b);
  const n = sorted.length;

  // 2. Determine number of elements to trim from both ends
  // For small datasets (>4), trim at least 1 if n >= 5, or round(n * trimPercent)
  let trimCount = 0;
  if (n >= 14) {
    trimCount = Math.round(n * trimPercent); // e.g. 15 * 0.1 = 1.5 -> 2, exactly yields 11 items as in project paper
  } else if (n >= 6) {
    trimCount = Math.floor(n * trimPercent) || 1;
  }

  // 3. Trim lowest and highest percentages
  const trimmed = trimCount > 0 ? sorted.slice(trimCount, n - trimCount) : sorted;
  const trimmedCount = trimmed.length;

  // 4. Calculate Arithmetic Mean
  const sum = trimmed.reduce((acc, val) => acc + val, 0);
  const mean = trimmedCount > 0 ? Number((sum / trimmedCount).toFixed(2)) : 0;

  // 5. Calculate Standard Deviation
  let stdDev = 0;
  if (trimmedCount > 1) {
    const variance = trimmed.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (trimmedCount - 1);
    stdDev = Number(Math.sqrt(variance).toFixed(2));
  }

  // Median
  const mid = Math.floor(trimmedCount / 2);
  const median = trimmedCount % 2 !== 0
    ? trimmed[mid]
    : Number(((trimmed[mid - 1] + trimmed[mid]) / 2).toFixed(2));

  // 6. Fluctuation rate against baseline or first element
  const base = baselinePrice || trimmed[0] || mean || 1;
  const fluctuationRate = Number((((mean - base) / base) * 100).toFixed(1));

  return {
    originalCount: n,
    trimmedCount,
    trimmedOutCount: n - trimmedCount,
    sortedPrices: sorted,
    trimmedPrices: trimmed,
    trimmedMin: trimmed[0] || 0,
    trimmedMax: trimmed[trimmed.length - 1] || 0,
    mean,
    stdDev,
    median,
    fluctuationRate,
  };
}

/**
 * Linear regression price forecasting engine (y = mx + b)
 * Computes slope, intercept, r-squared, and forecasts future periods (7, 14, 30 days)
 * with standard error confidence boundaries
 */
export function generateLinearRegressionForecast(
  historyPoints: { date: string; price: number }[],
  cropId: string,
  cropName: string,
  marketId: string,
  marketName: string,
  forecastDays: 7 | 14 | 30 = 7
): ForecastResult {
  if (!historyPoints || historyPoints.length < 3) {
    return {
      cropId,
      cropName,
      marketId,
      marketName,
      predictedPrice: historyPoints?.[0]?.price || 0,
      trendDirection: 'stable',
      forecastDays,
      historicalAverage: historyPoints?.[0]?.price || 0,
      dataPointsUsed: historyPoints?.length || 0,
      confidenceIndicator: 'Low',
      slope: 0,
      points: [],
      methodNote: 'Not enough historical data to generate a reliable forecast.',
    };
  }

  const n = historyPoints.length;
  // x values are 0, 1, 2, ... n - 1
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  let sumY2 = 0;

  for (let i = 0; i < n; i++) {
    const x = i;
    const y = historyPoints[i].price;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
    sumY2 += y * y;
  }

  const denominator = (n * sumX2 - sumX * sumX);
  const slope = denominator !== 0 ? (n * sumXY - sumX * sumY) / denominator : 0;
  const intercept = (sumY - slope * sumX) / n;

  // Correlation coefficient (R-squared)
  const numeratorR = n * sumXY - sumX * sumY;
  const denomR = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  const rSquared = denomR !== 0 ? Math.pow(numeratorR / denomR, 2) : 0;

  // Standard error of regression
  let sumResiduals2 = 0;
  for (let i = 0; i < n; i++) {
    const predictedY = slope * i + intercept;
    sumResiduals2 += Math.pow(historyPoints[i].price - predictedY, 2);
  }
  const standardError = Math.sqrt(sumResiduals2 / (n - 2 || 1));
  const confidenceMargin = standardError * 1.645; // ~90% confidence interval

  // Generate combined chart points: historical + future
  const points: ForecastPoint[] = [];

  // Historical points
  historyPoints.forEach((hp, idx) => {
    points.push({
      date: hp.date,
      predictedPrice: Number((slope * idx + intercept).toFixed(2)),
      actualPrice: hp.price,
      upperConfidence: Number((hp.price + confidenceMargin).toFixed(2)),
      lowerConfidence: Number(Math.max(1, hp.price - confidenceMargin).toFixed(2)),
      isHistorical: true,
    });
  });

  // Future points
  const lastDate = new Date(historyPoints[historyPoints.length - 1].date);
  const step = Math.max(1, Math.floor(forecastDays / 7));
  let finalPredicted = 0;

  for (let d = 1; d <= forecastDays; d += step) {
    const futureDate = new Date(lastDate);
    futureDate.setDate(lastDate.getDate() + d);
    const dateStr = futureDate.toISOString().split('T')[0];

    const futureX = n - 1 + d;
    const pred = Math.max(1, slope * futureX + intercept);
    finalPredicted = pred;

    // Uncertainty expands slightly with forecast horizon
    const horizonFactor = 1 + (d / forecastDays) * 0.4;
    const dynamicMargin = confidenceMargin * horizonFactor;

    points.push({
      date: dateStr,
      predictedPrice: Number(pred.toFixed(2)),
      upperConfidence: Number((pred + dynamicMargin).toFixed(2)),
      lowerConfidence: Number(Math.max(1, pred - dynamicMargin).toFixed(2)),
      isHistorical: false,
    });
  }

  const historicalAverage = Number((sumY / n).toFixed(2));
  const trendDirection = slope > 0.05 ? 'increasing' : slope < -0.05 ? 'decreasing' : 'stable';
  
  const confidenceIndicator = n >= 10 && rSquared > 0.6 ? 'High' : n >= 5 ? 'Medium' : 'Low';

  return {
    cropId,
    cropName,
    marketId,
    marketName,
    predictedPrice: Number(finalPredicted.toFixed(2)),
    trendDirection,
    forecastDays,
    historicalAverage,
    dataPointsUsed: n,
    confidenceIndicator,
    slope: Number(slope.toFixed(4)),
    points,
    methodNote: 'Model-based estimate generated using ordinary least squares linear regression. Subject to seasonal and market volatility.',
  };
}

/**
 * Calculates reliability confidence score based on sample size, trim ratio, and standard deviation
 */
export function getConfidenceScore(sampleSize: number, stdDev: number, meanPrice: number): 'High' | 'Medium' | 'Low' {
  if (sampleSize < 3) return 'Low';
  const cv = meanPrice > 0 ? (stdDev / meanPrice) : 1; // Coefficient of variation
  if (sampleSize >= 8 && cv < 0.25) return 'High';
  if (sampleSize >= 4 && cv < 0.40) return 'Medium';
  return 'Low';
}
