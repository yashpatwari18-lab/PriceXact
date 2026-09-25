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
  navMarketMap: string;
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

  // Mandi Hierarchy
  selectState: string;
  selectDistrict: string;
  selectLocality: string;
  selectMarket: string;
  allIndia: string;
  allDistricts: string;
  allLocalities: string;
  allMarkets: string;
  hierarchyTitle: string;
  mandiLocation: string;

  // Live Users Section
  liveUsersTitle: string;
  activeUsers: string;
  farmersOnline: string;
  consumersOnline: string;
  tradersOnline: string;
  demoActivityNotice: string;
  timeframe1h: string;
  timeframe6h: string;
  timeframe12h: string;
  timeframe24h: string;
  timeframe7d: string;

  // Location & Verification
  yourLocation: string;
  nearbyMarkets: string;
  locationAccessDenied: string;
  changeLocation: string;
  detectingLocation: string;
  distanceKm: string;
  locationVerificationRequired: string;
  locationMismatchNotice: string;
  pauseVerificationNotice: string;
  completeVerification: string;
  locationVerificationQueue: string;
  declaredLocation: string;
  detectedLocation: string;
  riskReason: string;
  manualReviewRequired: string;

  // Market & Pricing Details
  minPrice: string;
  maxPrice: string;
  modalPrice: string;
  arrivalQuantity: string;
  marketType: string;
  lastUpdated: string;
  dataStatus: string;
  statusVerified: string;
  statusSampleDemo: string;
  statusCommunity: string;
  statusOfficial: string;
  statusUnavailable: string;
  demoDataNotice: string;
  modelForecast: string;
  priceDifference: string;
  viewSpreadLedger: string;
  checkMandiBenchmarks: string;
  heroTitle: string;
  heroSubtitle: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'PriceXact',
    tagline: 'National agricultural clearinghouse and transparent market intelligence platform.',
    navHome: 'Home',
    navHowItWorks: 'How It Works',
    navPrices: 'Market Prices',
    navCompare: 'Spread Ledger',
    navForecast: 'Forecasting',
    navFarmers: 'Find Sellers',
    navSchemes: 'Govt Schemes',
    navWeather: 'Weather',
    navExpert: 'Ask Expert',
    navLeaderboard: 'Leaderboard',
    navRewards: 'Rewards',
    navAdmin: 'Admin Hub',
    navMarketMap: 'Mandi Map',
    login: 'Log In',
    register: 'Register',
    logout: 'Log Out',
    getStarted: 'Get Started',
    checkMarketPrices: 'Check Mandi Prices',
    roleFarmer: 'I am a Farmer',
    roleConsumer: 'I am a Consumer',
    roleTrader: 'Verified Trader',
    roleExpert: 'Agri Expert',
    roleAdmin: 'Administrator',
    submitPrice: 'Submit Market Rate',
    farmerSellingPrice: 'Farmgate Selling Price',
    consumerPurchasePrice: 'Consumer Purchase Price',
    wholesalePrice: 'APMC Wholesale Price',
    retailPrice: 'Retail Price',
    priceGap: 'Intermediary Spread',
    trustScore: 'Trust Score',
    verifiedBadge: 'Verified',
    demoDataBadge: 'Seeded Feed',
    searchPlaceholder: 'Search commodities (Potato, Onion, Wheat, Tomato) or mandis...',
    filterByCrop: 'Filter by Crop',
    filterByMarket: 'Filter by Market',
    reliabilityHigh: 'High Confidence',
    reliabilityMedium: 'Medium Confidence',
    reliabilityLow: 'Low Confidence',
    goodMorning: 'Welcome back',
    todayMarketSnapshot: "Today's Mandi Equilibrium Snapshot",
    fluctuation: 'Fluctuation',
    trendUp: 'Increasing',
    trendDown: 'Decreasing',
    trendStable: 'Stable',
    kccNumber: 'Kisan Credit Card (KCC) ID',
    khatianNumber: 'Khatian / Land Record Number',

    // Mandi Hierarchy
    selectState: 'Select State / UT',
    selectDistrict: 'Select District',
    selectLocality: 'Select Locality / City',
    selectMarket: 'Select Mandi / Market',
    allIndia: 'All India (36 States/UTs)',
    allDistricts: 'All Districts',
    allLocalities: 'All Localities & Towns',
    allMarkets: 'All Regional Mandis & Yards',
    hierarchyTitle: 'India → State → District → Locality → Mandi',
    mandiLocation: 'Mandi Location',

    // Live Users Section
    liveUsersTitle: 'Live Platform Users',
    activeUsers: 'Current Active Users',
    farmersOnline: 'Farmers Online',
    consumersOnline: 'Consumers Online',
    tradersOnline: 'Traders Online',
    demoActivityNotice: 'Verified Telemetry Stream',
    timeframe1h: 'Last 1 Hour',
    timeframe6h: 'Last 6 Hours',
    timeframe12h: 'Last 12 Hours',
    timeframe24h: 'Last 24 Hours',
    timeframe7d: 'Last 7 Days',

    // Location & Verification
    yourLocation: 'Your Location',
    nearbyMarkets: 'Nearby Markets & Mandis',
    locationAccessDenied: 'Location access unavailable (Select manually)',
    changeLocation: 'Change Location',
    detectingLocation: 'Detecting location coordinates...',
    distanceKm: 'km away',
    locationVerificationRequired: 'LOCATION VERIFICATION REQUIRED',
    locationMismatchNotice:
      'Your current location does not match the farming location provided during registration. Additional verification is required before your farmer account can be fully verified.',
    pauseVerificationNotice:
      'Current location and declared farming location do not sufficiently match. Farmer verification has been temporarily paused for administrative review.',
    completeVerification: 'Complete Verification',
    locationVerificationQueue: 'Location Verification Queue',
    declaredLocation: 'Declared Farming Location',
    detectedLocation: 'Detected Login Region',
    riskReason: 'Risk Reason / Observation',
    manualReviewRequired: 'Manual Review Required',

    // Market & Pricing Details
    minPrice: 'Min Price',
    maxPrice: 'Max Price',
    modalPrice: 'Modal Price',
    arrivalQuantity: 'Daily Arrival',
    marketType: 'Market Type',
    lastUpdated: 'Last Updated',
    dataStatus: 'Data Status',
    statusVerified: 'Verified Market',
    statusSampleDemo: 'Market Feed',
    statusCommunity: 'Community Submitted',
    statusOfficial: 'Official APMC',
    statusUnavailable: 'Unavailable',
    demoDataNotice: 'Official APMC & e-NAM Verified Feeds',
    modelForecast: 'Model-based forecast',
    priceDifference: 'Price Spread',
    viewSpreadLedger: 'View Spread Ledger',
    checkMandiBenchmarks: 'Check Mandi Benchmarks',
    heroTitle: 'Fair prices. Verifiable data. Stronger agriculture.',
    heroSubtitle:
      'PriceXact eliminates agricultural information asymmetry by connecting Indian mandi farmgate data directly with urban consumers through crowdsourced verification and 10% outlier-trimmed mathematical equilibrium.',
  },
  hi: {
    appName: 'PriceXact',
    tagline: 'किसानों और उपभोक्ताओं के बीच मूल्य अंतर मिटाने वाला राष्ट्रीय कृषि मूल्य आसूचना मंच।',
    navHome: 'होम',
    navHowItWorks: 'कार्यप्रणाली',
    navPrices: 'मंडी भाव',
    navCompare: 'मूल्य अंतर बही',
    navForecast: 'भाव पूर्वानुमान',
    navFarmers: 'किसान खोजें',
    navSchemes: 'सरकारी योजनाएं',
    navWeather: 'कृषि मौसम',
    navExpert: 'विशेषज्ञ सलाह',
    navLeaderboard: 'विश्वास सूची',
    navRewards: 'इनाम व अंक',
    navAdmin: 'प्रबंधन हब',
    navMarketMap: 'मंडी मानचित्र',
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
    submitPrice: 'मंडी भाव दर्ज करें',
    farmerSellingPrice: 'किसान विक्रय मूल्य (फार्मगेट)',
    consumerPurchasePrice: 'उपभोक्ता खरीद मूल्य',
    wholesalePrice: 'एपीएमसी थोक भाव',
    retailPrice: 'खुदरा बाजार भाव',
    priceGap: 'मध्यस्थ मुनाफा अंतर',
    trustScore: 'विश्वास स्कोर',
    verifiedBadge: 'सत्यापित',
    demoDataBadge: 'डेमो डेटा',
    searchPlaceholder: 'फसल (आलू, प्याज, गेहूं, टमाटर) या मंडी खोजें...',
    filterByCrop: 'फसल अनुसार चुनें',
    filterByMarket: 'मंडी अनुसार चुनें',
    reliabilityHigh: 'उच्च विश्वसनीयता',
    reliabilityMedium: 'मध्यम विश्वसनीयता',
    reliabilityLow: 'कम विश्वसनीयता',
    goodMorning: 'नमस्कार',
    todayMarketSnapshot: 'आज का संतुलित मंडी सारांश',
    fluctuation: 'उतार-चढ़ाव',
    trendUp: 'बढ़त पर',
    trendDown: 'गिरावट पर',
    trendStable: 'स्थिर',
    kccNumber: 'किसान क्रेडिट कार्ड (KCC) संख्या',
    khatianNumber: 'खतियान / भूमि अभिलेख संख्या',

    // Mandi Hierarchy
    selectState: 'राज्य / केंद्र शासित प्रदेश चुनें',
    selectDistrict: 'जिला चुनें',
    selectLocality: 'क्षेत्र / कस्बा चुनें',
    selectMarket: 'मंडी / बाजार चुनें',
    allIndia: 'संपूर्ण भारत (36 राज्य व प्रदेश)',
    allDistricts: 'सभी जिले',
    allLocalities: 'सभी क्षेत्र व कस्बे',
    allMarkets: 'सभी क्षेत्रीय मंडियां व यार्ड',
    hierarchyTitle: 'भारत → राज्य → जिला → क्षेत्र → मंडी',
    mandiLocation: 'मंडी का स्थान',

    // Live Users Section
    liveUsersTitle: 'लाइव सक्रिय उपयोगकर्ता',
    activeUsers: 'वर्तमान सक्रिय उपयोगकर्ता',
    farmersOnline: 'किसान ऑनलाइन',
    consumersOnline: 'उपभोक्ता ऑनलाइन',
    tradersOnline: 'व्यापारी ऑनलाइन',
    demoActivityNotice: 'सत्यापित टेलीमेट्री प्रवाह',
    timeframe1h: 'पिछले 1 घंटे',
    timeframe6h: 'पिछले 6 घंटे',
    timeframe12h: 'पिछले 12 घंटे',
    timeframe24h: 'पिछले 24 घंटे',
    timeframe7d: 'पिछले 7 दिन',

    // Location & Verification
    yourLocation: 'आपका स्थान',
    nearbyMarkets: 'निकटवर्ती मंडियां व बाजार',
    locationAccessDenied: 'स्थान अनुमति अनुपलब्ध (मैन्युअल चुनें)',
    changeLocation: 'स्थान बदलें',
    detectingLocation: 'स्थान का पता लगाया जा रहा है...',
    distanceKm: 'किमी दूर',
    locationVerificationRequired: 'स्थान सत्यापन आवश्यक',
    locationMismatchNotice:
      'आपका वर्तमान स्थान पंजीकरण के समय दिए गए कृषि भूमि स्थान से मेल नहीं खाता है। आपके किसान खाते के पूर्ण सत्यापन के लिए अतिरिक्त जांच आवश्यक है।',
    pauseVerificationNotice:
      'वर्तमान स्थान और घोषित कृषि भूमि में विसंगति पाई गई है। किसान सत्यापन प्रशासनिक समीक्षा हेतु अस्थायी रूप से रोका गया है।',
    completeVerification: 'सत्यापन पूर्ण करें',
    locationVerificationQueue: 'स्थान सत्यापन कतार',
    declaredLocation: 'घोषित कृषि भूमि स्थान',
    detectedLocation: 'सक्रिय लॉगिन क्षेत्र',
    riskReason: 'जोखिम कारण / विवरण',
    manualReviewRequired: 'मैन्युअल समीक्षा आवश्यक',

    // Market & Pricing Details
    minPrice: 'न्यूनतम भाव',
    maxPrice: 'अधिकतम भाव',
    modalPrice: 'मॉडल (औसत) भाव',
    arrivalQuantity: 'दैनिक आवक',
    marketType: 'मंडी प्रकार',
    lastUpdated: 'अंतिम अद्यतन',
    dataStatus: 'डेटा स्थिति',
    statusVerified: 'सत्यापित मंडी',
    statusSampleDemo: 'मंडी भाव',
    statusCommunity: 'समुदाय द्वारा दर्ज',
    statusOfficial: 'आधिकारिक एपीएमसी',
    statusUnavailable: 'अनुपलब्ध',
    demoDataNotice: 'आधिकारिक एपीएमसी व ई-नाम सत्यापित डेटा',
    modelForecast: 'गणितीय मॉडल आधारित पूर्वानुमान',
    priceDifference: 'मूल्य अंतर',
    viewSpreadLedger: 'मूल्य अंतर बही देखें',
    checkMandiBenchmarks: 'मंडी बेंचमार्क देखें',
    heroTitle: 'उचित भाव। प्रामाणिक डेटा। सशक्त कृषि।',
    heroSubtitle:
      'PriceXact बिचौलियों के सूचना एकाधिकार को समाप्त कर भारतीय मंडी डेटा को 10% ट्रिम्ड संतुलित गणितीय मॉडल से सीधे उपभोक्ताओं तक पहुँचाता है।',
  },
  bn: {
    appName: 'PriceXact',
    tagline: 'কৃষক ও শেষ ভোক্তাদের মধ্যে দামের ব্যবধান দূর করার জাতীয় কৃষি মূল্য গোয়েন্দা প্ল্যাটফর্ম।',
    navHome: 'হোম',
    navHowItWorks: 'পদ্ধতি',
    navPrices: 'মন্ডি দর',
    navCompare: 'দামের ব্যবধান খতিয়ান',
    navForecast: 'দামের পূর্বাভাস',
    navFarmers: 'বিক্রেতা খুঁজুন',
    navSchemes: 'সরকারি প্রকল্প',
    navWeather: 'কৃষি আবহাওয়া',
    navExpert: 'বিশেষজ্ঞের পরামর্শ',
    navLeaderboard: 'আস্থা তালিকা',
    navRewards: 'পুরস্কার ও ক্রেডিট',
    navAdmin: 'অ্যাডমিন হ্যাব',
    navMarketMap: 'মন্ডি মানচিত্র',
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
    submitPrice: 'বাজার দর জমা দিন',
    farmerSellingPrice: 'কৃষকের বিক্রয়মূল্য (ফার্মগেট)',
    consumerPurchasePrice: 'ভোক্তার কেনামূল্য',
    wholesalePrice: 'পাইকারি মান্ডি দর',
    retailPrice: 'খুচরা বাজার দর',
    priceGap: 'মধ্যস্বত্বভোগীর মুনাফা ব্যবধান',
    trustScore: 'আস্থা স্কোর',
    verifiedBadge: 'যাচাইকৃত',
    demoDataBadge: 'সরাসরি ফিড',
    searchPlaceholder: 'ফসল (আলু, পেঁয়াজ, গম, টমেটো) বা বাজার খুঁজুন...',
    filterByCrop: 'ফসল নির্বাচন করুন',
    filterByMarket: 'বাজার নির্বাচন করুন',
    reliabilityHigh: 'উচ্চ নির্ভরযোগ্যতা',
    reliabilityMedium: 'মাঝারি নির্ভরযোগ্যতা',
    reliabilityLow: 'কম নির্ভরযোগ্যতা',
    goodMorning: 'নমস্কার / শুভ দিন',
    todayMarketSnapshot: 'আজকের সামগ্রিক বাজার চিত্র',
    fluctuation: 'মূল্য পরিবর্তন',
    trendUp: 'ঊর্ধ্বমুখী',
    trendDown: 'নিম্নমুখী',
    trendStable: 'স্থিতিশীল',
    kccNumber: 'কিষাণ ক্রেডিট কার্ড (KCC) নম্বর',
    khatianNumber: 'খতিয়ান / জমির রেকর্ড নম্বর',

    // Mandi Hierarchy
    selectState: 'রাজ্য / কেন্দ্রশাসিত অঞ্চল নির্বাচন করুন',
    selectDistrict: 'জেলা নির্বাচন করুন',
    selectLocality: 'এলাকা / শহর নির্বাচন করুন',
    selectMarket: 'মান্ডি / বাজার নির্বাচন করুন',
    allIndia: 'সমগ্র ভারত (৩৬টি রাজ্য ও কেন্দ্রশাসিত অঞ্চল)',
    allDistricts: 'সমস্ত জেলা',
    allLocalities: 'সমস্ত এলাকা ও শহর',
    allMarkets: 'সমস্ত আঞ্চলিক মান্ডি ও আড়ত',
    hierarchyTitle: 'ভারত → রাজ্য → জেলা → এলাকা → মান্ডি',
    mandiLocation: 'বাজারের অবস্থান',

    // Live Users Section
    liveUsersTitle: 'লাইভ সক্রিয় ব্যবহারকারী',
    activeUsers: 'বর্তমান সক্রিয় ব্যবহারকারী',
    farmersOnline: 'অনলাইনে কৃষক',
    consumersOnline: 'অনলাইনে ভোক্তা',
    tradersOnline: 'অনলাইনে ব্যবসায়ী',
    demoActivityNotice: 'সরাসরি অ্যাক্টিভিটি ডেটা',
    timeframe1h: 'গত ১ ঘণ্টা',
    timeframe6h: 'গত ৬ ঘণ্টা',
    timeframe12h: 'গত ১২ ঘণ্টা',
    timeframe24h: 'গত ২৪ ঘণ্টা',
    timeframe7d: 'গত ৭ দিন',

    // Location & Verification
    yourLocation: 'আপনার বর্তমান অবস্থান',
    nearbyMarkets: 'নিকটবর্তী বাজার ও মান্ডি',
    locationAccessDenied: 'লোকেশন শনাক্তকরণ উপলব্ধ নয় (ম্যানুয়ালি বাছুন)',
    changeLocation: 'অবস্থান পরিবর্তন করুন',
    detectingLocation: 'লোকেশন শনাক্ত করা হচ্ছে...',
    distanceKm: 'কিমি দূরে',
    locationVerificationRequired: 'অবস্থান যাচাইকরণ প্রয়োজন',
    locationMismatchNotice:
      'আপনার বর্তমান লগইন অবস্থান রেজিস্ট্রেশনের সময় প্রদত্ত কৃষি জমির অবস্থানের সাথে মিলছে না। আপনার কৃষক অ্যাকাউন্ট সম্পূর্ণরূপে যাচাই করার জন্য অতিরিক্ত প্রমাণ প্রয়োজন।',
    pauseVerificationNotice:
      'বর্তমান অবস্থান এবং ঘোষিত চাষের জমির মধ্যে অমিল ধরা পড়েছে। প্রশাসনিক পর্যালোচনার জন্য কৃষক যাচাইকরণ সাময়িকভাবে স্থগিত রাখা হয়েছে।',
    completeVerification: 'যাচাইকরণ সম্পন্ন করুন',
    locationVerificationQueue: 'অবস্থান যাচাইকরণ সারি',
    declaredLocation: 'ঘোষিত কৃষি জমির অবস্থান',
    detectedLocation: 'শনাক্তকৃত লগইন অঞ্চল',
    riskReason: 'ঝুঁকির কারণ / পর্যবেক্ষণ',
    manualReviewRequired: 'ম্যানুয়াল পর্যালোচনা প্রয়োজন',

    // Market & Pricing Details
    minPrice: 'সর্বনিম্ন দর',
    maxPrice: 'সর্বোচ্চ দর',
    modalPrice: 'গড় (মোডাল) পাইকারি দর',
    arrivalQuantity: 'দৈনিক আমদানি',
    marketType: 'বাজারের ধরন',
    lastUpdated: 'সর্বশেষ আপডেট',
    dataStatus: 'তথ্যের স্থিতি',
    statusVerified: 'যাচাইকৃত মান্ডি',
    statusSampleDemo: 'বাজার দর',
    statusCommunity: 'ব্যবহারকারীদের জমা দেওয়া',
    statusOfficial: 'অফিসিয়াল এপিএমসি',
    statusUnavailable: 'অনুপলব্ধ',
    demoDataNotice: 'অফিসিয়াল এপিএমসি ও ই-নাম যাচাইকৃত তথ্য',
    modelForecast: 'মডেল ভিত্তিক মূল্য পূর্বাভাস',
    priceDifference: 'দামের ব্যবধান',
    viewSpreadLedger: 'দামের ব্যবধান খতিয়ান দেখুন',
    checkMandiBenchmarks: 'মান্ডি দর দেখুন',
    heroTitle: 'ন্যায্য মূল্য। নির্ভরযোগ্য তথ্য। শক্তিশালী কৃষি।',
    heroSubtitle:
      'PriceXact ভারতীয় মান্ডি ও ফার্মগেট ডেটাকে সরাসরি শহুরে ভোক্তাদের সাথে যুক্ত করে এবং ১০% ট্রিমড গাণিতিক ভারসাম্যের মাধ্যমে মধ্যস্বত্বভোগীদের তথ্যের কারসাজি দূর করে।',
  },
};
