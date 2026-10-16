export interface FullAppTranslation {
  // Header & Navigation
  namaste: string;
  heroTitle: string;
  heroSub: string;
  exploreServices: string;
  dailyHoroscope: string;
  freeKundli: string;
  matchMaking: string;
  freeChat: string;
  astroMall: string;
  vastu: string;
  dreamPalm: string;
  moreNumerology: string;
  liveAstrologers: string;
  viewAll: string;
  yourDailyHoroscope: string;
  tapSignSub: string;
  navHome: string;
  navChat: string;
  navKundli: string;
  navMatch: string;
  navRemedy: string;
  navProfile: string;
  chatBtn: string;
  callBtn: string;
  expYears: string;
  freeTag: string;
  cosmicEnergy: string;
  love: string;
  career: string;
  vitality: string;

  // Zodiac Signs (12 Rashis)
  rashis: Record<string, string>;

  // Kundli Generator Screen
  kundliTitle: string;
  kundliSubtitle: string;
  discussChartBtn: string;
  fullNameLabel: string;
  birthDateLabel: string;
  birthTimeLabel: string;
  birthCityLabel: string;
  generateKundliBtn: string;
  calculatingBtn: string;
  lagnaLabel: string;
  moonSignLabel: string;
  nakshatraLabel: string;
  manglikLabel: string;
  activeDashaLabel: string;
  planetaryPositionsTitle: string;
  grahaCol: string;
  rashiCol: string;
  houseCol: string;
  degreeCol: string;
  lagnaSynthesisTitle: string;
  careerHouseTitle: string;
  marriageHouseTitle: string;
  remediesTitle: string;
  northIndian: string;
  southIndian: string;

  // Kundli Matching Screen
  matchTitle: string;
  boyDetailsTitle: string;
  girlDetailsTitle: string;
  calculateMatchBtn: string;
  matchResultTitle: string;
  outOf36: string;
  manglikParityTitle: string;
  kootaDistributionTitle: string;

  // Numerology Screen
  numerologyTitle: string;
  numerologySub: string;
  mulankLabel: string;
  bhagyankLabel: string;
  naamAnkLabel: string;
  loShuGridTitle: string;
  nameBreakdownTitle: string;
  loShuPlanesTitle: string;
  nameCorrectionTitle: string;
  luckyDatesTitle: string;
  missingRemediesTitle: string;
  calculateNumerologyBtn: string;

  // Palm Reading Screen
  palmTitle: string;
  palmSubtitle: string;
  rightHand: string;
  leftHand: string;
  uploadPalmBtn: string;
  openCameraBtn: string;
  mountsTitle: string;
  luckyGemstoneTitle: string;

  // Horoscope & Panchang Screen
  panchangTitle: string;
  selectRashiTitle: string;
  tithiLabel: string;
  yogaLabel: string;
  rahuKaalLabel: string;
  luckyColorLabel: string;
  luckyNumberLabel: string;
  mantraOfDayLabel: string;

  // Dakshina & Profile & Auth
  dakshinaTitle: string;
  dakshinaSubtitle: string;
  offerDakshinaBtn: string;
  skipDakshinaBtn: string;
  signInTitle: string;
  signInSub: string;
  signOutBtn: string;
  ashirwadScrollsTitle: string;
}

const BASE_HI: FullAppTranslation = {
  namaste: 'नमस्ते',
  heroTitle: '2025 मेरे लिए क्या लेकर आएगा?',
  heroSub: 'जानिए अपनी कुंडली और ग्रहों का पूरा हाल →',
  exploreServices: 'सेवाओं का अन्वेषण करें',
  dailyHoroscope: 'दैनिक राशिफल',
  freeKundli: 'जन्म कुंडली',
  matchMaking: 'कुंडली मिलान',
  freeChat: 'मुफ्त चैट',
  astroMall: 'दक्षिणा सेवा',
  vastu: 'वास्तु शास्त्र',
  dreamPalm: 'हस्तरेखा ज्ञान',
  moreNumerology: 'अंक ज्योतिष',
  liveAstrologers: 'लाइव ज्योतिषी',
  viewAll: 'सभी देखें',
  yourDailyHoroscope: 'आपका दैनिक राशिफल',
  tapSignSub: 'आज का राशिफल जानने के लिए अपनी राशि चुनें!',
  navHome: 'होम',
  navChat: 'चैट',
  navKundli: 'कुंडली',
  navMatch: 'मिलान',
  navRemedy: 'उपाय',
  navProfile: 'प्रोफाइल',
  chatBtn: 'चैट करें',
  callBtn: 'कॉल करें',
  expYears: 'अनुभव: वर्ष',
  freeTag: 'निःशुल्क',
  cosmicEnergy: 'ब्रह्मांडीय ऊर्जा',
  love: 'प्रेम',
  career: 'करियर',
  vitality: 'स्वास्थ्य',
  rashis: {
    aries: 'मेष', taurus: 'वृषभ', gemini: 'मिथुन', cancer: 'कर्क',
    leo: 'सिंह', virgo: 'कन्या', libra: 'तुला', scorpio: 'वृश्चिक',
    sagittarius: 'धनु', capricorn: 'मकर', aquarius: 'कुंभ', pisces: 'मीन',
  },
  kundliTitle: 'जन्म कुंडली और ग्रह विश्लेषण',
  kundliSubtitle: 'सटीक लाहिड़ी अयनांश • वास्तविक अक्षांश और देशांतर गणना',
  discussChartBtn: 'ज्योतिषी से पूछें →',
  fullNameLabel: 'पूरा नाम',
  birthDateLabel: 'जन्म तिथि',
  birthTimeLabel: 'जन्म समय',
  birthCityLabel: 'जन्म शहर और देश (लाइव खोज)',
  generateKundliBtn: 'कुंडली और भविष्यफल बनाएं',
  calculatingBtn: 'गणना हो रही है...',
  lagnaLabel: 'लग्न (Ascendant)',
  moonSignLabel: 'चंद्र राशि',
  nakshatraLabel: 'जन्म नक्षत्र',
  manglikLabel: 'मंगल दोष स्थिति',
  activeDashaLabel: 'वर्तमान विंशोत्तरी महादशा',
  planetaryPositionsTitle: 'नवग्रह स्पष्ट (ग्रहों की स्थिति)',
  grahaCol: 'ग्रह',
  rashiCol: 'राशि',
  houseCol: 'भाव',
  degreeCol: 'अंश',
  lagnaSynthesisTitle: 'लग्न और राजयोग सारांश',
  careerHouseTitle: 'कर्म और करियर (दशम भाव)',
  marriageHouseTitle: 'विवाह और संबंध (सप्तम भाव)',
  remediesTitle: 'वैदिक शुभ उपाय',
  northIndian: 'उत्तर भारतीय',
  southIndian: 'दक्षिण भारतीय',
  matchTitle: 'अष्टकूट (36 गुण) कुंडली मिलान',
  boyDetailsTitle: 'वर (लड़के) का जन्म विवरण',
  girlDetailsTitle: 'वधू (लड़की) का जन्म विवरण',
  calculateMatchBtn: '36 गुण मिलान करें',
  matchResultTitle: 'अष्टकूट गुण मिलान परिणाम',
  outOf36: '36 में से',
  manglikParityTitle: 'मांगलिक दोष सामंजस्य',
  kootaDistributionTitle: 'अष्टकूट (8 कूट) अंक विवरण',
  numerologyTitle: 'वैदिक अंक ज्योतिष और लो शू ग्रिड',
  numerologySub: 'मूलांक, भाग्यांक और नामांक सुधार',
  mulankLabel: 'मूलांक (Psychic)',
  bhagyankLabel: 'भाग्यांक (Destiny)',
  naamAnkLabel: 'नामांक (Name)',
  loShuGridTitle: 'पवित्र 3×3 लो शू यंत्र',
  nameBreakdownTitle: 'नाम के अक्षरों का कंपन',
  loShuPlanesTitle: 'अष्ट-रेखा लो शू योग',
  nameCorrectionTitle: 'AI नाम स्पेलिंग सुधार सुझाव',
  luckyDatesTitle: 'शुभ तिथियां और रत्न',
  missingRemediesTitle: 'अनुपस्थित अंकों के वैदिक उपाय',
  calculateNumerologyBtn: 'नाम सुधार और उपाय जानें',
  palmTitle: 'AI हस्तरेखा परीक्षण (समुद्रिक शास्त्र)',
  palmSubtitle: 'अपनी हथेली की फोटो अपलोड करें या कैमरे से स्कैन करें',
  rightHand: 'दायां हाथ',
  leftHand: 'बायां हाथ',
  uploadPalmBtn: 'हथेली की फोटो अपलोड करें',
  openCameraBtn: 'लाइव कैमरा खोलें',
  mountsTitle: 'ग्रह पर्वत विश्लेषण',
  luckyGemstoneTitle: 'शुभ रत्न (Ratna)',
  panchangTitle: 'आज का पंचांग और शुभ मुहूर्त',
  selectRashiTitle: 'अपनी चंद्र राशि चुनें',
  tithiLabel: 'तिथि',
  yogaLabel: 'योग',
  rahuKaalLabel: 'राहु काल',
  luckyColorLabel: 'शुभ रंग',
  luckyNumberLabel: 'शुभ अंक',
  mantraOfDayLabel: 'आज का राशि मंत्र',
  dakshinaTitle: 'स्वैच्छिक गुरु दक्षिणा अर्पण',
  dakshinaSubtitle: 'वैदिक परंपरा में परामर्श के बाद श्रद्धा अनुसार दक्षिणा और आशीर्वाद प्राप्त करें',
  offerDakshinaBtn: 'दक्षिणा अर्पित करें और आशीर्वाद पाएं',
  skipDakshinaBtn: 'बिना दक्षिणा के निःशुल्क आशीर्वाद प्राप्त करें',
  signInTitle: 'अपनी कुंडली प्रोफाइल में लॉगिन करें',
  signInSub: 'मोबाइल OTP या Google से लॉगिन करें',
  signOutBtn: 'लॉग आउट करें',
  ashirwadScrollsTitle: 'आपके पवित्र आशीर्वाद पत्र',
};

const BASE_EN: FullAppTranslation = {
  namaste: 'Namaste',
  heroTitle: 'What Will 2025 Bring For Me?',
  heroSub: 'Discover your complete Vedic Kundli & planetary transit →',
  exploreServices: 'Explore Sacred Services',
  dailyHoroscope: 'Daily Horoscope',
  freeKundli: 'Free Kundli',
  matchMaking: 'Match Making',
  freeChat: 'Free Chat',
  astroMall: 'Dakshina Seva',
  vastu: 'Vastu Shastra',
  dreamPalm: 'Palm Reading',
  moreNumerology: 'Numerology',
  liveAstrologers: 'Live AI Astrologers',
  viewAll: 'View All',
  yourDailyHoroscope: 'Your Daily Horoscope',
  tapSignSub: 'Tap your sign to get today’s personalized prediction!',
  navHome: 'Home',
  navChat: 'Chat',
  navKundli: 'Kundli',
  navMatch: 'Match',
  navRemedy: 'Anka',
  navProfile: 'Profile',
  chatBtn: 'Chat',
  callBtn: 'Call',
  expYears: 'Exp: Years',
  freeTag: 'FREE',
  cosmicEnergy: 'Cosmic Energy',
  love: 'Love',
  career: 'Career',
  vitality: 'Vitality',
  rashis: {
    aries: 'Aries', taurus: 'Taurus', gemini: 'Gemini', cancer: 'Cancer',
    leo: 'Leo', virgo: 'Virgo', libra: 'Libra', scorpio: 'Scorpio',
    sagittarius: 'Sagittarius', capricorn: 'Capricorn', aquarius: 'Aquarius', pisces: 'Pisces',
  },
  kundliTitle: 'Janam Kundli & Planetary Analysis',
  kundliSubtitle: 'Sidereal Lahiri Ephemeris • Real Lat/Lon Astronomical Engine',
  discussChartBtn: 'Ask AI Astrologer →',
  fullNameLabel: 'Full Name',
  birthDateLabel: 'Birth Date',
  birthTimeLabel: 'Birth Time',
  birthCityLabel: 'Birth City & Country (Live Geocoder)',
  generateKundliBtn: 'Calculate Real Kundli & AI Forecast',
  calculatingBtn: 'Calculating...',
  lagnaLabel: 'Lagna (Ascendant)',
  moonSignLabel: 'Chandra Rashi (Moon)',
  nakshatraLabel: 'Janma Nakshatra',
  manglikLabel: 'Manglik Dosha',
  activeDashaLabel: 'Active Vimshottari Mahadasha',
  planetaryPositionsTitle: 'Navagraha Sphuta (Planetary Positions)',
  grahaCol: 'Planet',
  rashiCol: 'Sign',
  houseCol: 'House',
  degreeCol: 'Degree',
  lagnaSynthesisTitle: 'Lagna & Rajyoga Synthesis',
  careerHouseTitle: 'Karma & Career (10th House)',
  marriageHouseTitle: 'Marriage & Relationships (7th House)',
  remediesTitle: 'Recommended Vedic Remedies (Upay)',
  northIndian: 'North Indian',
  southIndian: 'South Indian',
  matchTitle: '36-Guna Ashta-Koota Kundli Matching',
  boyDetailsTitle: 'Partner 01 • Groom Birth Details',
  girlDetailsTitle: 'Partner 02 • Bride Birth Details',
  calculateMatchBtn: 'Calculate 36-Guna Compatibility',
  matchResultTitle: 'Ashta-Koota Guna Milan Result',
  outOf36: 'out of 36',
  manglikParityTitle: 'Manglik / Kuja Dosha Parity',
  kootaDistributionTitle: 'Ashta-Koota (8-Fold) Point Breakdown',
  numerologyTitle: 'Vedic Numerology & Lo Shu Grid',
  numerologySub: 'Mulank, Bhagyank & Chaldean Name Correction',
  mulankLabel: 'Mulank (Psychic)',
  bhagyankLabel: 'Bhagyank (Destiny)',
  naamAnkLabel: 'Name Number',
  loShuGridTitle: 'Sacred 3×3 Lo Shu Grid',
  nameBreakdownTitle: 'Chaldean Name Vibration',
  loShuPlanesTitle: 'Ashta-Rekha Lo Shu Planes',
  nameCorrectionTitle: 'AI Chaldean Name Spelling Suggestions',
  luckyDatesTitle: 'Auspicious Dates & Gemstone',
  missingRemediesTitle: 'Lo Shu Missing Number Remedies',
  calculateNumerologyBtn: 'Generate AI Name & Remedies',
  palmTitle: 'AI Hastrekha (Palm Reading)',
  palmSubtitle: 'Upload a photo of your open palm or scan with live camera',
  rightHand: 'Right Hand',
  leftHand: 'Left Hand',
  uploadPalmBtn: 'Upload Palm Photo',
  openCameraBtn: 'Use Live Camera',
  mountsTitle: 'Planetary Mounts (Graha Parvat)',
  luckyGemstoneTitle: 'Recommended Gemstone',
  panchangTitle: 'Today’s Drik Panchang & Shubh Muhurat',
  selectRashiTitle: 'Select Your Moon Sign (Rashi)',
  tithiLabel: 'Tithi',
  yogaLabel: 'Yoga',
  rahuKaalLabel: 'Rahu Kaal',
  luckyColorLabel: 'Lucky Color',
  luckyNumberLabel: 'Lucky Number',
  mantraOfDayLabel: 'Today’s Rashi Mantra',
  dakshinaTitle: 'Offer Optional Guru Dakshina',
  dakshinaSubtitle: 'Voluntary offering of gratitude to receive your personalized Sanskrit Ashirwad scroll',
  offerDakshinaBtn: 'Offer Dakshina & Receive Ashirwad',
  skipDakshinaBtn: 'Skip Dakshina & Receive Free Blessing',
  signInTitle: 'Sign In to Your Kundli Sanctuary',
  signInSub: 'Use Mobile Phone + OTP or Google Sign-In',
  signOutBtn: 'Sign Out',
  ashirwadScrollsTitle: 'Your Sacred Ashirwad Scrolls',
};

export const FULL_TRANSLATIONS: Record<string, FullAppTranslation> = {
  hi: BASE_HI,
  en: BASE_EN,
  hinglish: {
    ...BASE_EN,
    namaste: 'Namaste',
    heroTitle: '2025 Mere Liye Kya Lekar Aayega?',
    heroSub: 'Jaaniye apni Kundli aur graho ka poora haal →',
    exploreServices: 'Vedic Services Explore Karein',
    dailyHoroscope: 'Dainik Rashifal',
    freeKundli: 'Free Kundli',
    matchMaking: 'Kundli Milan',
    freeChat: 'Free Chat',
    astroMall: 'Dakshina Seva',
    vastu: 'Vastu Shastra',
    dreamPalm: 'Palm Reading',
    moreNumerology: 'Anka Jyotish',
    liveAstrologers: 'Live AI Jyotishi',
    yourDailyHoroscope: 'Aapka Dainik Rashifal',
    tapSignSub: 'Aaj ka rashifal jaanne ke liye apni rashi chunein!',
    navHome: 'Home',
    navChat: 'Chat',
    navKundli: 'Kundli',
    navMatch: 'Milan',
    navRemedy: 'Upay',
    navProfile: 'Profile',
  },
  mr: {
    ...BASE_HI,
    namaste: 'नमस्कार',
    heroTitle: '२०२५ माझ्यासाठी काय घेऊन येणार?',
    heroSub: 'जाणून घ्या तुमची जन्मकुंडली आणि ग्रहांची स्थिती →',
    exploreServices: 'ज्योतिष सेवा एक्सप्लोर करा',
    dailyHoroscope: 'दैनिक राशीभविष्य',
    freeKundli: 'मोफत कुंडली',
    matchMaking: 'कुंडली मिलन',
    freeChat: 'मोफत चॅट',
    astroMall: 'दक्षिणा सेवा',
    vastu: 'वास्तू शास्त्र',
    dreamPalm: 'हस्तरेषा शास्त्र',
    moreNumerology: 'अंकशास्त्र',
    liveAstrologers: 'लाईव्ह ज्योतिषी',
    viewAll: 'सर्व पहा',
    yourDailyHoroscope: 'तुमचे दैनिक राशीभविष्य',
    tapSignSub: 'आजचे भविष्य जाणून घेण्यासाठी तुमची रास निवडा!',
    navHome: 'होम',
    navChat: 'चॅट',
    navKundli: 'कुंडली',
    navMatch: 'मिलन',
    navRemedy: 'उपाय',
    navProfile: 'प्रोफाइल',
    chatBtn: 'चॅट करा',
    callBtn: 'कॉल करा',
    kundliTitle: 'जन्मकुंडली आणि ग्रह विश्लेषण',
    generateKundliBtn: 'कुंडली आणि भविष्य तयार करा',
    matchTitle: 'अष्टकूट (३६ गुण) कुंडली मिलन',
    boyDetailsTitle: 'वराचे जन्म तपशील',
    girlDetailsTitle: 'वधूचे जन्म तपशील',
    calculateMatchBtn: '३६ गुण मिलन करा',
    numerologyTitle: 'वैदिक अंकशास्त्र आणि लो शू ग्रिड',
    palmTitle: 'AI हस्तरेषा परीक्षण',
    panchangTitle: 'आजचे पंचांग आणि शुभ मुहूर्त',
  },
  gu: {
    ...BASE_HI,
    namaste: 'નમસ્તે',
    heroTitle: '૨૦૨૫ મારા માટે શું લઈને આવશે?',
    heroSub: 'જાણો તમારી જન્મ કુંડળી અને ગ્રહોનું ફળ →',
    exploreServices: 'સેવાઓનું અન્વેષણ કરો',
    dailyHoroscope: 'દૈનિક રાશિફળ',
    freeKundli: 'મફત કુંડળી',
    matchMaking: 'કુંડળી મિલન',
    freeChat: 'મફત ચેટ',
    astroMall: 'દક્ષિણા સેવા',
    vastu: 'વાસ્તુ શાસ્ત્ર',
    dreamPalm: 'હસ્તરેખા જ્ઞાન',
    moreNumerology: 'અંક જ્યોતિષ',
    liveAstrologers: 'લાઈવ જ્યોતિષી',
    viewAll: 'બધા જુઓ',
    yourDailyHoroscope: 'તમારું દૈનિક રાશિફળ',
    tapSignSub: 'આજનું રાશિફળ જાણવા માટે તમારી રાશિ પસંદ કરો!',
    navHome: 'હોમ',
    navChat: 'ચેટ',
    navKundli: 'કુંડળી',
    navMatch: 'મિલન',
    navRemedy: 'ઉપાય',
    navProfile: 'પ્રોફાઇલ',
    chatBtn: 'ચેટ કરો',
    callBtn: 'કૉલ કરો',
    rashis: {
      aries: 'મેષ', taurus: 'વૃષભ', gemini: 'મિથુન', cancer: 'કર્ક',
      leo: 'સિંહ', virgo: 'કન્યા', libra: 'તુલા', scorpio: 'વૃશ્ચિક',
      sagittarius: 'ધનુ', capricorn: 'મકર', aquarius: 'કુંભ', pisces: 'મીન',
    },
    kundliTitle: 'જન્મ કુંડળી અને ગ્રહ વિશ્લેષણ',
    generateKundliBtn: 'કુંડળી અને ભવિષ્યફળ બનાવો',
    matchTitle: 'અષ્ટકૂટ (૩૬ ગુણ) કુંડળી મિલન',
    numerologyTitle: 'વૈદિક અંક જ્યોતિષ અને લો શૂ ગ્રિડ',
    palmTitle: 'AI હસ્તરેખા પરીક્ષણ',
    panchangTitle: 'આજનું પંચાંગ અને શુભ મુહૂર્ત',
  },
  bn: {
    ...BASE_HI,
    namaste: 'নমস্কার',
    heroTitle: '২০২৫ আমার জন্য কী নিয়ে আসবে?',
    heroSub: 'জেনে নিন আপনার জন্মকুণ্ডলী ও গ্রহের অবস্থান →',
    exploreServices: 'পরিষেবাগুলি অন্বেষণ করুন',
    dailyHoroscope: 'দৈনিক রাশিফল',
    freeKundli: 'জন্ম কুণ্ডলী',
    matchMaking: 'যোটক বিচার',
    freeChat: 'ফ্রি চ্যাট',
    astroMall: 'দক্ষিণা সেবা',
    vastu: 'বাস্তু শাস্ত্র',
    dreamPalm: 'হস্তরেখা বিচার',
    moreNumerology: 'সংখ্যা জ্যোতিষ',
    liveAstrologers: 'লাইভ জ্যোতিষী',
    viewAll: 'সব দেখুন',
    yourDailyHoroscope: 'আপনার দৈনিক রাশিফল',
    tapSignSub: 'আজকের রাশিফল জানতে আপনার রাশি নির্বাচন করুন!',
    navHome: 'হোম',
    navChat: 'চ্যাট',
    navKundli: 'কুণ্ডলী',
    navMatch: 'মিলন',
    navRemedy: 'উপায়',
    navProfile: 'প্রোফাইল',
    chatBtn: 'চ্যাট করুন',
    callBtn: 'কল করুন',
    rashis: {
      aries: 'মেষ', taurus: 'বৃষ', gemini: 'মিথুন', cancer: 'কর্কট',
      leo: 'সিংহ', virgo: 'কন্যা', libra: 'তুলা', scorpio: 'বৃশ্চিক',
      sagittarius: 'ধনু', capricorn: 'মকর', aquarius: 'কুম্ভ', pisces: 'মীন',
    },
    kundliTitle: 'জন্ম কুণ্ডলী ও গ্রহ বিশ্লেষণ',
    generateKundliBtn: 'কুণ্ডলী তৈরি করুন',
    matchTitle: 'অষ্টকূট (৩৬ গুণ) কুণ্ডলী মিলন',
    numerologyTitle: 'বৈদিক সংখ্যাতত্ত্ব ও লো শু গ্রিড',
    palmTitle: 'AI হস্তরেখা বিচার',
    panchangTitle: 'আজকের পঞ্চাঙ্গ ও শুভ মুহূর্ত',
  },
  ta: {
    ...BASE_EN,
    namaste: 'வணக்கம்',
    heroTitle: '2025 எனக்கு என்ன கொண்டு வரும்?',
    heroSub: 'உங்கள் ஜாதகம் மற்றும் கிரக பலன்களை அறியுங்கள் →',
    exploreServices: 'சேவைகளை ஆராயுங்கள்',
    dailyHoroscope: 'தினசரி ராசிபலன்',
    freeKundli: 'இலவச ஜாதகம்',
    matchMaking: 'திருமண பொருத்தம்',
    freeChat: 'இலவச சாட்',
    astroMall: 'தட்சிணை சேவை',
    vastu: 'வாஸ்து சாஸ்திரம்',
    dreamPalm: 'கைரேகை ஜோதிடம்',
    moreNumerology: 'எண் கணிதம்',
    liveAstrologers: 'நேரலை ஜோதிடர்கள்',
    viewAll: 'அனைத்தும்',
    yourDailyHoroscope: 'உங்கள் தினசரி ராசிபலன்',
    tapSignSub: 'இன்றைய பலனை அறிய உங்கள் ராசியை தேர்வு செய்யவும்!',
    navHome: 'முகப்பு',
    navChat: 'சாட்',
    navKundli: 'ஜாதகம்',
    navMatch: 'பொருத்தம்',
    navRemedy: 'பரிகாரம்',
    navProfile: 'சுயவிவரம்',
    chatBtn: 'சாட்',
    callBtn: 'அழைப்பு',
    rashis: {
      aries: 'மேஷம்', taurus: 'ரிஷபம்', gemini: 'மிதுனம்', cancer: 'கடகம்',
      leo: 'சிம்மம்', virgo: 'கன்னி', libra: 'துலாம்', scorpio: 'விருச்சிகம்',
      sagittarius: 'தனுசு', capricorn: 'மகரம்', aquarius: 'கும்பம்', pisces: 'மீனம்',
    },
    kundliTitle: 'ஜாதகம் மற்றும் கிரக நிலை ஆய்வு',
    generateKundliBtn: 'ஜாதகம் கணிக்கவும்',
    matchTitle: 'திருமண பொருத்தம் (36 குணங்கள்)',
    numerologyTitle: 'வேத எண் கணிதம் & லோ ஷு கட்டம்',
    palmTitle: 'AI கைரேகை ஜோதிடம்',
    panchangTitle: 'இன்றைய பஞ்சாங்கம் & சுப முகூர்த்தம்',
  },
  te: {
    ...BASE_EN,
    namaste: 'నమస్కారం',
    heroTitle: '2025 నాకు ఎలా ఉండబోతోంది?',
    heroSub: 'మీ జన్మ కుండలి మరియు గ్రహ ఫలితాలను తెలుసుకోండి →',
    exploreServices: 'సేవలను అన్వేషించండి',
    dailyHoroscope: 'దైనిక రాశిఫలాలు',
    freeKundli: 'ఉచిత కుండలి',
    matchMaking: 'వివాహ పొంతన',
    freeChat: 'ఉచిత చాట్',
    astroMall: 'దక్షిణ సేవ',
    vastu: 'వాస్తు శాస్త్రం',
    dreamPalm: 'హస్తరేఖ జ్యోతిష్యం',
    moreNumerology: 'సంఖ్యా శాస్త్రం',
    liveAstrologers: 'లైవ్ జ్యోతిష్యులు',
    viewAll: 'అన్నీ చూడండి',
    yourDailyHoroscope: 'మీ నేటి రాశిఫలాలు',
    tapSignSub: 'నేటి ఫలితాల కోసం మీ రాశిని ఎంచుకోండి!',
    navHome: 'హోమ్',
    navChat: 'చాట్',
    navKundli: 'కుండలి',
    navMatch: 'పొంతన',
    navRemedy: 'పరిహారం',
    navProfile: 'ప్రొఫైల్',
    chatBtn: 'చాట్',
    callBtn: 'కాల్',
    rashis: {
      aries: 'మేషం', taurus: 'వృషభం', gemini: 'మిథునం', cancer: 'కర్కాటకం',
      leo: 'సింహం', virgo: 'కన్య', libra: 'తుల', scorpio: 'వృశ్చికం',
      sagittarius: 'ధనుస్సు', capricorn: 'మకరం', aquarius: 'కుంభం', pisces: 'మీనం',
    },
    kundliTitle: 'జన్మ కుండలి & గ్రహ విశ్లేషణ',
    generateKundliBtn: 'కుండలి రూపొందించండి',
    matchTitle: 'అష్టకూట (36 గుణాల) వివాహ పొంతన',
    numerologyTitle: 'వేద సంఖ్యా శాస్త్రం & లో షు గ్రిడ్',
    palmTitle: 'AI హస్తరేఖ విశ్లేషణ',
    panchangTitle: 'నేటి పంచాంగం & శుభ ముహూర్తం',
  },
  kn: {
    ...BASE_EN,
    namaste: 'ನಮಸ್ಕಾರ',
    heroTitle: '2025 ನನಗೆ ಏನು ತರಲಿದೆ?',
    heroSub: 'ನಿಮ್ಮ ಜಾತಕ ಮತ್ತು ಗ್ರಹಗಳ ಸಂಪೂರ್ಣ ಫಲ ತಿಳಿಯಿರಿ →',
    exploreServices: 'ಸೇವೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
    dailyHoroscope: 'ದೈನಂದಿನ ರಾಶಿಭವಿಷ್ಯ',
    freeKundli: 'ಉಚಿತ ಜಾತಕ',
    matchMaking: 'ಕುಂಡಲಿ ಹೊಂದಾಣಿಕೆ',
    freeChat: 'ಉಚಿತ ಚಾಟ್',
    astroMall: 'ದಕ್ಷಿಣೆ ಸೇವೆ',
    vastu: 'ವಾಸ್ತು ಶಾಸ್ತ್ರ',
    dreamPalm: 'ಹಸ್ತಸಾಮುದ್ರಿಕ',
    moreNumerology: 'ಸಂಖ್ಯಾಶಾಸ್ತ್ರ',
    liveAstrologers: 'ಲೈವ್ ಜ್ಯೋತಿಷಿಗಳು',
    viewAll: 'ಎಲ್ಲವನ್ನೂ ನೋಡಿ',
    yourDailyHoroscope: 'ನಿಮ್ಮ ದೈನಂದಿನ ರಾಶಿಭವಿಷ್ಯ',
    tapSignSub: 'ಇಂದಿನ ಭವಿಷ್ಯ ತಿಳಿಯಲು ನಿಮ್ಮ ರಾಶಿಯನ್ನು ಆರಿಸಿ!',
    navHome: 'ಹೋಮ್',
    navChat: 'ಚಾಟ್',
    navKundli: 'ಜಾತಕ',
    navMatch: 'ಹೊಂದಾಣಿಕೆ',
    navRemedy: 'ಪರಿಹಾರ',
    navProfile: 'ಪ್ರೊಫೈಲ್',
    chatBtn: 'ಚಾಟ್',
    callBtn: 'ಕರೆ',
    rashis: {
      aries: 'ಮೇಷ', taurus: 'ವೃಷಭ', gemini: 'ಮಿಥುನ', cancer: 'ಕರ್ಕಾಟಕ',
      leo: 'ಸಿಂಹ', virgo: 'ಕನ್ಯಾ', libra: 'ತುಲಾ', scorpio: 'ವೃಶ್ಚಿಕ',
      sagittarius: 'ಧನು', capricorn: 'ಮಕರ', aquarius: 'ಕುಂಭ', pisces: 'ಮೀನ',
    },
    kundliTitle: 'ಜನ್ಮ ಜಾತಕ ಮತ್ತು ಗ್ರಹ ವಿಶ್ಲೇಷಣೆ',
    generateKundliBtn: 'ಜಾತಕ ರಚಿಸಿ',
    matchTitle: 'ಅಷ್ಟಕೂಟ (36 ಗುಣ) ಕುಂಡಲಿ ಹೊಂದಾಣಿಕೆ',
    numerologyTitle: 'ವೇದ ಸಂಖ್ಯಾಶಾಸ್ತ್ರ & ಲೋ ಶು ಗ್ರಿಡ್',
    palmTitle: 'AI ಹಸ್ತಸಾಮುದ್ರಿಕ ಪರೀಕ್ಷೆ',
    panchangTitle: 'ಇಂದಿನ ಪಂಚಾಂಗ ಮತ್ತು ಶುಭ ಮುಹೂರ್ತ',
  },
  ml: {
    ...BASE_EN,
    namaste: 'നമസ്കാരം',
    heroTitle: '2025 എനിക്ക് എന്ത് നൽകും?',
    heroSub: 'നിങ്ങളുടെ ജാതകവും ഗ്രഹനിലയും അറിയുക →',
    exploreServices: 'സേവനങ്ങൾ കാണുക',
    dailyHoroscope: 'ദിവസഫലം',
    freeKundli: 'സൗജന്യ ജാതകം',
    matchMaking: 'വിവാഹ പൊരുത്തം',
    freeChat: 'സൗജന്യ ചാറ്റ്',
    astroMall: 'ദക്ഷിണ സേവ',
    vastu: 'വാസ്തു ಶാസ്ത്രം',
    dreamPalm: 'ഹസ്തരേഖ',
    moreNumerology: 'സംഖ്യാശാസ്ത്രം',
    liveAstrologers: 'ലൈവ് ജ്യോതിഷികൾ',
    viewAll: 'എല്ലാം കാണുക',
    yourDailyHoroscope: 'നിങ്ങളുടെ ഇന്നത്തെ രാശിഫലം',
    tapSignSub: 'ഇന്നത്തെ ഫലം അറിയാൻ നിങ്ങളുടെ രാശി തിരഞ്ഞെടുക്കുക!',
    navHome: 'ഹോം',
    navChat: 'ചാറ്റ്',
    navKundli: 'ജാതകം',
    navMatch: 'പൊരുത്തം',
    navRemedy: 'പരിഹാരം',
    navProfile: 'പ്രൊഫൈൽ',
    chatBtn: 'ചാറ്റ്',
    callBtn: 'കോൾ',
    rashis: {
      aries: 'മേടം', taurus: 'ഇടവം', gemini: 'മിഥുനം', cancer: 'കർക്കടകം',
      leo: 'ചിങ്ങം', virgo: 'കന്നി', libra: 'തുലാം', scorpio: 'വൃശ്ചികം',
      sagittarius: 'ധനു', capricorn: 'മകരം', aquarius: 'കുംഭം', pisces: 'മീനം',
    },
    kundliTitle: 'ജാതകവും ഗ്രഹനിലയും',
    generateKundliBtn: 'ജാതകം തയ്യാറാക്കുക',
    matchTitle: 'വിവാഹ പൊരുത്തം (36 ഗുണങ്ങൾ)',
    numerologyTitle: 'സംഖ്യാശാസ്ത്രം & ലോ ഷു ഗ്രിഡ്',
    palmTitle: 'AI ഹസ്തരേഖാ പരിശോധന',
    panchangTitle: 'ഇന്നത്തെ പഞ്ചാംഗവും ശുഭമുഹൂർത്തവും',
  },
  pa: {
    ...BASE_HI,
    namaste: 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ',
    heroTitle: '2025 ਮੇਰੇ ਲਈ ਕੀ ਲੈ ਕੇ ਆਵੇਗਾ?',
    heroSub: 'ਜਾਣੋ ਆਪਣੀ ਜਨਮ ਕੁੰਡਲੀ ਅਤੇ ਗ੍ਰਹਿਆਂ ਦਾ ਹਾਲ →',
    exploreServices: 'ਸੇਵਾਵਾਂ ਦੀ ਪੜਚੋਲ ਕਰੋ',
    dailyHoroscope: 'ਰੋਜ਼ਾਨਾ ਰਾਸ਼ੀਫਲ',
    freeKundli: 'ਮੁਫ਼ਤ ਕੁੰਡਲੀ',
    matchMaking: 'ਕੁੰਡਲੀ ਮਿਲਾਨ',
    freeChat: 'ਮੁਫ਼ਤ ਚੈਟ',
    astroMall: 'ਦਕਸ਼ਿਣਾ ਸੇਵਾ',
    vastu: 'ਵਾਸਤੂ ਸ਼ਾਸਤਰ',
    dreamPalm: 'ਹਸਤਰੇਖਾ ਗਿਆਨ',
    moreNumerology: 'ਅੰਕ ਜੋਤਿਸ਼',
    liveAstrologers: 'ਲਾਈਵ ਜੋਤਿਸ਼ੀ',
    viewAll: 'ਸਭ ਦੇਖੋ',
    yourDailyHoroscope: 'ਤੁਹਾਡਾ ਰੋਜ਼ਾਨਾ ਰਾਸ਼ੀਫਲ',
    tapSignSub: 'ਅੱਜ ਦਾ ਰਾਸ਼ੀਫਲ ਜਾਣਨ ਲਈ ਆਪਣੀ ਰਾਸ਼ੀ ਚੁਣੋ!',
    navHome: 'ਹੋਮ',
    navChat: 'ਚੈਟ',
    navKundli: 'ਕੁੰਡਲੀ',
    navMatch: 'ਮਿਲਾਨ',
    navRemedy: 'ਉਪਾਅ',
    navProfile: 'ਪ੍ਰੋਫਾਈਲ',
    chatBtn: 'ਚੈਟ ਕਰੋ',
    callBtn: 'ਕਾਲ ਕਰੋ',
    rashis: {
      aries: 'ਮੇਖ', taurus: 'ਬ੍ਰਿਸ਼ਭ', gemini: 'ਮਿਥੁਨ', cancer: 'ਕਰਕ',
      leo: 'ਸਿੰਘ', virgo: 'ਕੰਨਿਆ', libra: 'ਤੁਲਾ', scorpio: 'ਬ੍ਰਿਸ਼ਚਕ',
      sagittarius: 'ਧਨੁ', capricorn: 'ਮਕਰ', aquarius: 'ਕੁੰਭ', pisces: 'ਮੀਨ',
    },
    kundliTitle: 'ਜਨਮ ਕੁੰਡਲੀ ਅਤੇ ਗ੍ਰਹਿ ਵਿਸ਼ਲੇਸ਼ਣ',
    generateKundliBtn: 'ਕੁੰਡਲੀ ਬਣਾਓ',
    matchTitle: 'ਅਸ਼ਟਕੂਟ (36 ਗੁਣ) ਕੁੰਡਲੀ ਮਿਲਾਨ',
    numerologyTitle: 'ਵੈਦਿਕ ਅੰਕ ਜੋਤਿਸ਼ ਅਤੇ ਲੋ ਸ਼ੂ ਗ੍ਰਿਡ',
    palmTitle: 'AI ਹਸਤਰੇਖਾ ਜਾਂਚ',
    panchangTitle: 'ਅੱਜ ਦਾ ਪੰਚਾਂਗ ਅਤੇ ਸ਼ੁਭ ਮੁਹੂਰਤ',
  },
  or: {
    ...BASE_HI,
    namaste: 'ନମସ୍କାର',
    heroTitle: '୨୦୨୫ ମୋ ପାଇଁ କଣ ଆଣିବ?',
    heroSub: 'ଜାଣନ୍ତୁ ଆପଣଙ୍କ ଜନ୍ମ କୁଣ୍ଡଳୀ ଓ ଗ୍ରହ ସ୍ଥିତି →',
    exploreServices: 'ସେବାଗୁଡ଼ିକ ଦେଖନ୍ତୁ',
    dailyHoroscope: 'ଦୈନିକ ରାଶିଫଳ',
    freeKundli: 'ମାଗଣା କୁଣ୍ଡଳୀ',
    matchMaking: 'କୁଣ୍ଡଳୀ ମିଳନ',
    freeChat: 'ମାଗଣା ଚାଟ୍',
    astroMall: 'ଦକ୍ଷିଣା ସେବା',
    vastu: 'ବାସ୍ତୁ ଶାସ୍ତ୍ର',
    dreamPalm: 'ହସ୍ତରେଖା',
    moreNumerology: 'ଅଙ୍କ ଜ୍ୟୋତିଷ',
    liveAstrologers: 'ଲାଇଭ୍ ଜ୍ୟୋତିଷ',
    viewAll: 'ସବୁ ଦେଖନ୍ତୁ',
    yourDailyHoroscope: 'ଆପଣଙ୍କ ଦୈନିକ ରାଶିଫଳ',
    tapSignSub: 'ଆଜିର ରାଶିଫଳ ଜାଣିବା ପାଇଁ ଆପଣଙ୍କ ରାଶି ବାଛନ୍ତୁ!',
    navHome: 'ହୋମ୍',
    navChat: 'ଚାଟ୍',
    navKundli: 'କୁଣ୍ଡଳୀ',
    navMatch: 'ମିଳନ',
    navRemedy: 'ଉପାୟ',
    navProfile: 'ପ୍ରୋଫାଇଲ୍',
    chatBtn: 'ଚାଟ୍',
    callBtn: 'କଲ୍',
    rashis: {
      aries: 'ମେଷ', taurus: 'ବୃଷ', gemini: 'ମିଥୁନ', cancer: 'କର୍କଟ',
      leo: 'ସିଂହ', virgo: 'କନ୍ୟା', libra: 'ତୁଳା', scorpio: 'ବିଛା',
      sagittarius: 'ଧନୁ', capricorn: 'ମକର', aquarius: 'କୁମ୍ଭ', pisces: 'ମୀନ',
    },
    kundliTitle: 'ଜନ୍ମ କୁଣ୍ଡଳୀ ଓ ଗ୍ରହ ବିଶ୍ଳେଷଣ',
    generateKundliBtn: 'କୁଣ୍ଡଳୀ ପ୍ରସ୍ତୁତ କରନ୍ତୁ',
    matchTitle: 'ଅଷ୍ଟକୂଟ (୩୬ ଗୁଣ) କୁଣ୍ଡଳୀ ମିଳନ',
    numerologyTitle: 'ବୈଦିକ ଅଙ୍କ ଜ୍ୟୋତିଷ ଓ ଲୋ ଶୁ ଗ୍ରିଡ୍',
    palmTitle: 'AI ହସ୍ତରେଖା ପରୀକ୍ଷଣ',
    panchangTitle: 'ଆଜିର ପଞ୍ଚାଙ୍ଗ ଓ ଶୁଭ ମୁହୂର୍ତ୍ତ',
  },
  sa: {
    ...BASE_HI,
    namaste: 'नमो नमः',
    heroTitle: '२०२५ वर्षं मह्यं किम् आनेष्यति?',
    heroSub: 'भवतः जन्मपत्रिकां ग्रहफलं च जानन्तु →',
    exploreServices: 'ज्योतिषसेवाः अन्वेषयन्तु',
    dailyHoroscope: 'दैनिकराशिफलम्',
    freeKundli: 'जन्मपत्रिका',
    matchMaking: 'वरवधूमेलनम्',
    freeChat: 'संभाषणम्',
    astroMall: 'दक्षिणासेवा',
    vastu: 'वास्तुशास्त्रम्',
    dreamPalm: 'हस्तरेखाशास्त्रम्',
    moreNumerology: 'अङ्कज्योतिषम्',
    liveAstrologers: 'प्रत्यक्षदैवज्ञाः',
    viewAll: 'सर्वं पश्यन्तु',
    yourDailyHoroscope: 'भवतः दैनिकराशिफलम्',
    tapSignSub: 'अद्यतनं फलं ज्ञातुं स्वराशिं चिनुत!',
    navHome: 'गृहम्',
    navChat: 'संवादः',
    navKundli: 'कुण्डली',
    navMatch: 'मेलनम्',
    navRemedy: 'उपायः',
    navProfile: 'परिचयः',
    chatBtn: 'संवादः',
    callBtn: 'आह्वानम्',
    kundliTitle: 'जन्मपत्रिका ग्रहस्फुटविश्लेषणं च',
    generateKundliBtn: 'जन्मपत्रिकां रचयन्तु',
    matchTitle: 'अष्टकूट (३६ गुण) वरवधूमेलनम्',
    numerologyTitle: 'वैदिक-अङ्कज्योतिषं लो-शू-यन्त्रं च',
    palmTitle: 'सामुद्रिकशास्त्र-हस्तरेखापरीक्षणम्',
    panchangTitle: 'अद्यतनं पञ्चाङ्गं शुभमुहूर्तश्च',
  },
};

export function getTranslation(langCode: string): FullAppTranslation {
  return FULL_TRANSLATIONS[langCode] || FULL_TRANSLATIONS.hi;
}
