export type Language = 'en' | 'hi' | 'bn';

export interface Translations {
  appName: string;
  tagline: string;
  navHome: string;
  navHowItWorks: string;
  navPrices: string;
  navCompare: string;
  navForecast: string;
  navFarmers: string;
  navSchemes: string;
  navWeather: string;
  navExpert: string;
  navLeaderboard: string;
  navRewards: string;
  navAdmin: string;
  login: string;
  register: string;
  logout: string;
  getStarted: string;
  checkMarketPrices: string;
  roleFarmer: string;
  roleConsumer: string;
  roleTrader: string;
  roleExpert: string;
  roleAdmin: string;
  submitPrice: string;
  farmerSellingPrice: string;
  consumerPurchasePrice: string;
  wholesalePrice: string;
  retailPrice: string;
  priceGap: string;
  trustScore: string;
  verifiedBadge: string;
  demoDataBadge: string;
  searchPlaceholder: string;
  filterByCrop: string;
  filterByMarket: string;
  reliabilityHigh: string;
  reliabilityMedium: string;
  reliabilityLow: string;
  goodMorning: string;
  todayMarketSnapshot: string;
  fluctuation: string;
  trendUp: string;
  trendDown: string;
  trendStable: string;
  kccNumber: string;
  khatianNumber: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'PriceXact',
    tagline: 'A smart platform to reduce the gap between farmers and end consumers.',
    navHome: 'Home',
    navHowItWorks: 'How It Works',
    navPrices: 'Check Prices',
    navCompare: 'Price Comparison',
    navForecast: 'Forecasting',
    navFarmers: 'Find Sellers',
    navSchemes: 'Govt Schemes',
    navWeather: 'Weather',
    navExpert: 'Ask Expert',
    navLeaderboard: 'Leaderboard',
    navRewards: 'Rewards',
    navAdmin: 'Admin Hub',
    login: 'Log In',
    register: 'Register',
    logout: 'Log Out',
    getStarted: 'Get Started',
    checkMarketPrices: 'Check Market Prices',
    roleFarmer: 'I am a Farmer',
    roleConsumer: 'I am a Consumer',
    roleTrader: 'Verified Trader',
    roleExpert: 'Agri Expert',
    roleAdmin: 'Administrator',
    submitPrice: 'Submit Price',
    farmerSellingPrice: 'Farmer Selling Price',
    consumerPurchasePrice: 'Consumer Purchase Price',
    wholesalePrice: 'Wholesale Price',
    retailPrice: 'Retail Price',
    priceGap: 'Price Gap',
    trustScore: 'Trust Score',
    verifiedBadge: 'Verified',
    demoDataBadge: 'Demo Data',
    searchPlaceholder: 'Search crops (Wheat, Tomato, Potato) or markets...',
    filterByCrop: 'Filter by Crop',
    filterByMarket: 'Filter by Market',
    reliabilityHigh: 'High Confidence',
    reliabilityMedium: 'Medium Confidence',
    reliabilityLow: 'Low Confidence',
    goodMorning: 'Good Day',
    todayMarketSnapshot: "Today's Market Snapshot",
    fluctuation: 'Fluctuation',
    trendUp: 'Increasing',
    trendDown: 'Decreasing',
    trendStable: 'Stable',
    kccNumber: 'Kisan Credit Card (KCC) ID',
    khatianNumber: 'Khatian / Land Record Number',
  },
  hi: {
    appName: 'PriceXact',
    tagline: 'किसानों और उपभोक्ताओं के बीच मूल्य अंतर कम करने का स्मार्ट मंच।',
    navHome: 'होम',
    navHowItWorks: 'यह कैसे काम करता है',
    navPrices: 'भाव देखें',
    navCompare: 'मूल्य तुलना',
    navForecast: 'मूल्य पूर्वानुमान',
    navFarmers: 'विक्रेता खोजें',
    navSchemes: 'सरकारी योजनाएं',
    navWeather: 'मौसम',
    navExpert: 'विशेषज्ञ से पूछें',
    navLeaderboard: 'लीडरबोर्ड',
    navRewards: 'इनाम व अंक',
    navAdmin: 'प्रबंधन हब',
    login: 'लॉग इन करें',
    register: 'पंजीकरण करें',
    logout: 'लॉग आउट',
    getStarted: 'शुरू करें',
    checkMarketPrices: 'मंडी भाव देखें',
    roleFarmer: 'मैं किसान हूँ',
    roleConsumer: 'मैं उपभोक्ता हूँ',
    roleTrader: 'सत्यापित व्यापारी',
    roleExpert: 'कृषि विशेषज्ञ',
    roleAdmin: 'व्यवस्थापक',
    submitPrice: 'मूल्य दर्ज करें',
    farmerSellingPrice: 'किसान विक्रय मूल्य',
    consumerPurchasePrice: 'उपभोक्ता खरीद मूल्य',
    wholesalePrice: 'थोक भाव',
    retailPrice: 'खुदरा भाव',
    priceGap: 'मूल्य अंतर',
    trustScore: 'विश्वास स्कोर',
    verifiedBadge: 'सत्यापित',
    demoDataBadge: 'डेमो डेटा',
    searchPlaceholder: 'फसल (गेहूं, आलू, टमाटर) या मंडी खोजें...',
    filterByCrop: 'फसल अनुसार चुनें',
    filterByMarket: 'मंडी अनुसार चुनें',
    reliabilityHigh: 'उच्च विश्वसनीयता',
    reliabilityMedium: 'मध्यम विश्वसनीयता',
    reliabilityLow: 'कम विश्वसनीयता',
    goodMorning: 'नमस्कार',
    todayMarketSnapshot: 'आज का मंडी सारांश',
    fluctuation: 'उतार-चढ़ाव',
    trendUp: 'बढ़त पर',
    trendDown: 'गिरावट पर',
    trendStable: 'स्थिर',
    kccNumber: 'किसान क्रेडिट कार्ड (KCC) संख्या',
    khatianNumber: 'खतियान / भूमि अभिलेख संख्या',
  },
  bn: {
    appName: 'PriceXact',
    tagline: 'কৃষক ও শেষ ভোক্তাদের মধ্যে দামের ব্যবধান কমানোর স্মার্ট প্ল্যাটফর্ম।',
    navHome: 'হোম',
    navHowItWorks: 'কীভাবে কাজ করে',
    navPrices: 'দামের তথ্য',
    navCompare: 'দাম তুলনা',
    navForecast: 'দামের পূর্বাভাস',
    navFarmers: 'বিক্রেতা খুঁজুন',
    navSchemes: 'সরকারি প্রকল্প',
    navWeather: 'আবহাওয়া',
    navExpert: 'বিশেষজ্ঞের পরামর্শ',
    navLeaderboard: 'লিডারবোর্ড',
    navRewards: 'পুরস্কার',
    navAdmin: 'অ্যাডমিন',
    login: 'লগ ইন',
    register: 'রেজিস্ট্রেশন',
    logout: 'লগ আউট',
    getStarted: 'শুরু করুন',
    checkMarketPrices: 'বাজার দর দেখুন',
    roleFarmer: 'আমি কৃষক',
    roleConsumer: 'আমি ভোক্তা',
    roleTrader: 'যাচাইকৃত ব্যবসায়ী',
    roleExpert: 'কৃষি বিশেষজ্ঞ',
    roleAdmin: 'প্রশাসক',
    submitPrice: 'দাম জমা দিন',
    farmerSellingPrice: 'কৃষকের বিক্রয়মূল্য',
    consumerPurchasePrice: 'ভোক্তার কেনামূল্য',
    wholesalePrice: 'পাইকারি মূল্য',
    retailPrice: 'খুচরা মূল্য',
    priceGap: 'দামের ব্যবধান',
    trustScore: 'আস্থা স্কোর',
    verifiedBadge: 'যাচাইকৃত',
    demoDataBadge: 'ডেমো ডেটা',
    searchPlaceholder: 'ফসল (গম, আলু, টমেটো) বা বাজার খুঁজুন...',
    filterByCrop: 'ফসল নির্বাচন করুন',
    filterByMarket: 'বাজার নির্বাচন করুন',
    reliabilityHigh: 'উচ্চ নির্ভরযোগ্যতা',
    reliabilityMedium: 'মাঝারি নির্ভরযোগ্যতা',
    reliabilityLow: 'কম নির্ভরযোগ্যতা',
    goodMorning: 'নমস্কার / শুভ দিন',
    todayMarketSnapshot: 'আজকের বাজার চিত্র',
    fluctuation: 'মূল্য পরিবর্তন',
    trendUp: 'ঊর্ধ্বমুখী',
    trendDown: 'নিম্নমুখী',
    trendStable: 'স্থিতিশীল',
    kccNumber: 'কিষাণ ক্রেডিট কার্ড (KCC) নম্বর',
    khatianNumber: 'খতিয়ান / জমির রেকর্ড নম্বর',
  },
};
