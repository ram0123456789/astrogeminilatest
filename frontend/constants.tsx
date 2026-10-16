import { Astrologer, IndianLanguageOption } from './types';

export interface VedicFestivalBanner {
  id: string;
  monthIndex: number; // 0 = Jan ... 11 = Dec
  festivalNameHi: string;
  festivalNameEn: string;
  tithiTag: string;
  questionHi: (year: number) => string;
  questionEn: (year: number) => string;
  subTextHi: string;
  subTextEn: string;
  promptForAI: string;
}

export const VEDIC_FESTIVAL_CALENDAR: VedicFestivalBanner[] = [
  {
    id: 'makar-sankranti',
    monthIndex: 0,
    festivalNameHi: 'मकर संक्रांति और उत्तरायण पुण्यकाल',
    festivalNameEn: 'Makar Sankranti & Uttarayan Punyakaal',
    tithiTag: 'सूर्य उत्तरायण • माघ मास',
    questionHi: (yr) => `${yr} की मकर संक्रांति और सूर्य गोचर मेरे लिए क्या लेकर आएगा?`,
    questionEn: (yr) => `What will Makar Sankranti & Sun's Uttarayan transit in ${yr} bring for me?`,
    subTextHi: 'जानिए सूर्य उत्तरायण का आपकी राशि और करियर पर प्रभाव →',
    subTextEn: 'Discover how Uttarayan Surya blesses your Rashi & career →',
    promptForAI: 'Makar Sankranti aur Surya Uttarayan gochar mere career aur bhagya ke liye kaisa rahega?',
  },
  {
    id: 'mahashivratri',
    monthIndex: 1,
    festivalNameHi: 'महाशिवरात्रि और बसंत पंचमी महापर्व',
    festivalNameEn: 'Maha Shivratri & Vasant Panchami',
    tithiTag: 'फाल्गुन कृष्ण चतुर्दशी • शिव योग',
    questionHi: (yr) => `महाशिवरात्रि ${yr} पर भोलेनाथ की कृपा मेरे लिए क्या लेकर आएगी?`,
    questionEn: (yr) => `What blessings will Maha Shivratri ${yr} bring to my destiny?`,
    subTextHi: 'जानिए रुद्राभिषेक और ग्रह शांति के विशेष उपाय →',
    subTextEn: 'Unlock Shiva’s grace & planetary remedies for your Kundli →',
    promptForAI: 'Maha Shivratri par meri Kundli ke anusar kaunsa Rudrabhishek ya upay sabse shubh rahega?',
  },
  {
    id: 'holi-navratri',
    monthIndex: 2,
    festivalNameHi: 'होलिका दहन और चैत्र नवरात्रि (हिन्दू नववर्ष)',
    festivalNameEn: 'Holi & Chaitra Navratri (Hindu New Year)',
    tithiTag: 'चैत्र शुक्ल प्रतिपदा • विक्रम संवत',
    questionHi: (yr) => `हिन्दू नववर्ष और चैत्र नवरात्रि ${yr} मेरे लिए क्या लेकर आएगा?`,
    questionEn: (yr) => `What will the Hindu New Year & Chaitra Navratri ${yr} bring for me?`,
    subTextHi: 'मां दुर्गा की कृपा और नए संवत्सर का संपूर्ण राशिफल →',
    subTextEn: 'Read your Vikram Samvat New Year & Navratri forecast →',
    promptForAI: 'Chaitra Navratri aur Hindu Navvarsh mere career, dhan aur parivar ke liye kya lekar aayega?',
  },
  {
    id: 'ram-navami-akshaya',
    monthIndex: 3,
    festivalNameHi: 'श्री राम नवमी और अक्षय तृतीया महामुहूर्त',
    festivalNameEn: 'Sri Ram Navami & Akshaya Tritiya',
    tithiTag: 'वैशाख शुक्ल तृतीया • अबूझ मुहूर्त',
    questionHi: (yr) => `अक्षय तृतीया और राम नवमी ${yr} मेरे भाग्य में क्या नया मोड़ लाएगी?`,
    questionEn: (yr) => `What prosperity will Akshaya Tritiya & Ram Navami ${yr} unlock for me?`,
    subTextHi: 'स्वर्ण खरीद, गृह प्रवेश और धन योग का शुभ मुहूर्त जानें →',
    subTextEn: 'Check your auspicious wealth & gold-buying muhurat →',
    promptForAI: 'Akshaya Tritiya aur Ram Navami par mere liye kaunsa dhan-vriddhi upay shubh rahega?',
  },
  {
    id: 'buddha-purnima-ekadashi',
    monthIndex: 4,
    festivalNameHi: 'वैशाख पूर्णिमा और निर्जला एकादशी योग',
    festivalNameEn: 'Vaishakh Purnima & Nirjala Ekadashi',
    tithiTag: 'वैशाख/ज्येष्ठ शुक्ल एकादशी • गजकेसरी योग',
    questionHi: (yr) => `निर्जला एकादशी और गुरु गोचर ${yr} मेरे लिए क्या शुभ फल लाएगा?`,
    questionEn: (yr) => `What blessings will Nirjala Ekadashi & Jupiter transit ${yr} bring for me?`,
    subTextHi: 'श्री हरि विष्णु की कृपा और आपकी कुंडली का राजयोग →',
    subTextEn: 'Explore Vishnu Sahasranama & Rajyoga remedies for your chart →',
    promptForAI: 'Nirjala Ekadashi aur Guru gochar mere career aur vivah yoga par kya prabhav dalega?',
  },
  {
    id: 'jagannath-ashadhi',
    monthIndex: 5,
    festivalNameHi: 'जगन्नाथ रथयात्रा और देवशयनी एकादशी',
    festivalNameEn: 'Jagannath Rath Yatra & Devshayani Ekadashi',
    tithiTag: 'आषाढ़ शुक्ल द्वितीया • चातुर्मास प्रारंभ',
    questionHi: (yr) => `देवशयनी एकादशी और चातुर्मास ${yr} मेरे लिए क्या लेकर आएगा?`,
    questionEn: (yr) => `What will Rath Yatra & Chaturmas ${yr} bring for my life path?`,
    subTextHi: 'चातुर्मास में ग्रहों की चाल और आपके करियर का हाल →',
    subTextEn: 'See how planetary transits shape your coming months →',
    promptForAI: 'Jagannath Rath Yatra aur aane wale Chaturmas mein meri rashi ke liye kya shubh sanket hain?',
  },
  {
    id: 'guru-purnima-sawan',
    monthIndex: 6,
    festivalNameHi: 'गुरु पूर्णिमा और पवित्र सावन मास',
    festivalNameEn: 'Guru Purnima & Sacred Shravan Maas',
    tithiTag: 'आषाढ़ पूर्णिमा • श्रावण सोमवार व्रत',
    questionHi: (yr) => `पवित्र सावन मास और गुरु पूर्णिमा ${yr} मेरे लिए क्या लेकर आएगा?`,
    questionEn: (yr) => `What blessings will Shravan Maas & Guru Purnima ${yr} bring for me?`,
    subTextHi: 'सावन सोमवार अभिषेक और बृहस्पति कृपा के सटीक उपाय →',
    subTextEn: 'Discover Shravan Somwar & Jupiter blessings for your Kundli →',
    promptForAI: 'Pavitra Sawan maas aur Guru Purnima par meri Kundli ke anusar kya vishesh shubh hone wala hai?',
  },
  {
    id: 'janmashtami-rakhi',
    monthIndex: 7,
    festivalNameHi: 'रक्षाबंधन और श्री कृष्ण जन्माष्टमी महापर्व',
    festivalNameEn: 'Raksha Bandhan & Sri Krishna Janmashtami',
    tithiTag: 'भाद्रपद कृष्ण अष्टमी • रोहिणी नक्षत्र',
    questionHi: (yr) => `श्री कृष्ण जन्माष्टमी ${yr} मेरे भाग्य और करियर के लिए क्या लाएगी?`,
    questionEn: (yr) => `What will Sri Krishna Janmashtami ${yr} bring for my fortune?`,
    subTextHi: 'रोहिणी नक्षत्र और संतान-सुख, प्रेम व धन के शुभ योग →',
    subTextEn: 'Check Janmashtami Rohini Nakshatra blessings for love & wealth →',
    promptForAI: 'Shri Krishna Janmashtami par meri rashi aur Kundli ke liye kaunsa rajyoga ban raha hai?',
  },
  {
    id: 'ganesh-utsav',
    monthIndex: 8,
    festivalNameHi: 'श्री गणेश चतुर्थी और अनंत चतुर्दशी महोत्सव',
    festivalNameEn: 'Ganesh Chaturthi & Anant Chaturdashi',
    tithiTag: 'भाद्रपद शुक्ल चतुर्थी • विघ्नहर्ता योग',
    questionHi: (yr) => `गणेश उत्सव ${yr} मेरे जीवन के कौन से विघ्न दूर करेगा?`,
    questionEn: (yr) => `What obstacles will Lord Ganesha remove for me in ${yr}?`,
    subTextHi: 'बप्पा की कृपा से व्यापार, बुद्धि और नए कार्यों में सफलता →',
    subTextEn: 'Unlock Vighnaharta Ganesha’s blessings for new beginnings →',
    promptForAI: 'Ganesh Chaturthi par mere career aur vyapar ki rukawatein door karne ke liye kya upay karein?',
  },
  {
    id: 'sharad-navratri-diwali',
    monthIndex: 9,
    festivalNameHi: 'शारदीय नवरात्रि, दशहरा और धनतेरस महापर्व',
    festivalNameEn: 'Sharad Navratri, Dussehra & Dhanteras',
    tithiTag: 'आश्विन शुक्ल पक्ष • विजय मुहूर्त',
    questionHi: (yr) => `नवरात्रि और धनतेरस ${yr} मेरे लिए क्या बड़ी खुशखबरी लाएगा?`,
    questionEn: (yr) => `What breakthroughs will Navratri & Dhanteras ${yr} bring for me?`,
    subTextHi: 'मां लक्ष्मी-दुर्गा की कृपा से धन वर्षा और पदोन्नति के योग →',
    subTextEn: 'Discover Maa Durga & Kubera wealth yogas in your chart →',
    promptForAI: 'Sharad Navratri aur Dhanteras par meri Kundli mein dhan aur safalta ke kya yoga hain?',
  },
  {
    id: 'deepavali-dev-diwali',
    monthIndex: 10,
    festivalNameHi: 'दीपावली महालक्ष्मी पूजन और देव दीपावली',
    festivalNameEn: 'Deepavali Mahalakshmi Puja & Dev Diwali',
    tithiTag: 'कार्तिक अमावस्या व पूर्णिमा • महालक्ष्मी योग',
    questionHi: (yr) => `दीपावली और कार्तिक मास ${yr} मेरे लिए क्या सौभाग्य लेकर आएगा?`,
    questionEn: (yr) => `What abundance will Deepavali & Kartik Maas ${yr} bring for me?`,
    subTextHi: 'महालक्ष्मी कृपा, व्यापार वृद्धि और शुभ लग्न मुहूर्त जानें →',
    subTextEn: 'Explore Mahalakshmi Puja muhurat & wealth remedies →',
    promptForAI: 'Deepavali aur Dev Diwali ke shubh avsar par meri rashi ke liye dhan-labha kaisa rahega?',
  },
  {
    id: 'geeta-jayanti-new-year',
    monthIndex: 11,
    festivalNameHi: 'गीता जयंती, मोक्षदा एकादशी और नववर्ष संक्रांति',
    festivalNameEn: 'Gita Jayanti, Mokshada Ekadashi & Upcoming New Year',
    tithiTag: 'मार्गशीर्ष शुक्ल एकादशी • धनु संक्रांति',
    questionHi: (yr) => `मार्गशीर्ष मास और आने वाला वर्ष ${yr + 1} मेरे लिए क्या लेकर आएगा?`,
    questionEn: (yr) => `What will Gita Jayanti & the upcoming year ${yr + 1} bring for me?`,
    subTextHi: 'आने वाले वर्ष की ग्रह दशा और वार्षिक कुंडली भविष्यफल →',
    subTextEn: 'Prepare for the upcoming year with your complete Dasha forecast →',
    promptForAI: `Aane wala saal ${new Date().getFullYear() + 1} mere career, dhan aur vivah ke liye kaisa rahega?`,
  },
];

export function getDynamicFestivalBanner(langCode: string) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const item = VEDIC_FESTIVAL_CALENDAR[currentMonth] || VEDIC_FESTIVAL_CALENDAR[0];
  const isHindiLike = ['hi', 'mr', 'gu', 'bn', 'pa', 'or', 'sa'].includes(langCode);

  return {
    festivalName: isHindiLike ? item.festivalNameHi : item.festivalNameEn,
    tithiTag: item.tithiTag,
    headline: isHindiLike ? item.questionHi(currentYear) : item.questionEn(currentYear),
    subText: isHindiLike ? item.subTextHi : item.subTextEn,
    promptForAI: item.promptForAI,
  };
}

export const INDIAN_LANGUAGES: IndianLanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    greeting: 'Namaskar, Jai Shree Ram. Bataiye, kya janna chahte hain aap?',
    samplePrompts: [
      'What will this festival season bring for my career and wealth?',
      'What does my current Mahadasha indicate?',
      'When is marriage yoga indicated in my chart?',
      'Suggest a practical Vedic remedy for peace and prosperity.',
    ],
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी (Hindi)',
    greeting: 'नमस्कार, जय श्री राम। बताइए, क्या जानना चाहते हैं आप?',
    samplePrompts: [
      'आने वाले पर्व और ग्रह गोचर मेरे लिए क्या लेकर आएंगे?',
      'मेरी कुंडली में करियर और धन योग कैसा है?',
      'विवाह का शुभ योग कब बन रहा है?',
      'वर्तमान महादशा का फल और सरल उपाय बताएं',
    ],
  },
  {
    code: 'hinglish',
    name: 'Hinglish',
    nativeName: 'Hinglish (हिन्दी + EN)',
    greeting: 'Namaskar, Jai Shree Ram. Bataiye, kya janna chahte hain aap?',
    samplePrompts: [
      'Aane wala tyohar aur gochar mere liye kya lekar aayega?',
      'Mera career kab set hoga?',
      'Abhi thoda financial tight chal raha hai, koi upay?',
      'Shaadi ka yoga kab tak ban raha hai?',
    ],
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी (Marathi)',
    greeting: '🙏 नमस्कार, जय श्री राम! सांगा, आज कोणत्या विषयावर मार्गदर्शन हवे आहे?',
    samplePrompts: [
      'माझ्या कुंडलीत करिअर आणि आर्थिक प्रगती कधी होईल?',
      'लग्नाचा योग कधी जुळून येईल?',
      'सध्याच्या महादशेवर काही सोपा उपाय सांगा',
    ],
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી (Gujarati)',
    greeting: '🙏 જય શ્રી કૃષ્ણ! નમસ્તે, જણાવો આજે કયા વિષય પર માર્ગદર્શન જોઈએ છે?',
    samplePrompts: [
      'મારા કરિયર અને ધંધામાં પ્રગતિ ક્યારે થશે?',
      'લગ્નનો શુભ યોગ ક્યારે બની રહ્યો છે?',
      'આર્થિક સમૃદ્ધિ માટે કોઈ સરળ વૈદિક ઉપાય બતાવો',
    ],
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা (Bengali)',
    greeting: '🙏 নমস্কার! আমি আপনার জন্মকুণ্ডলী ও গ্রহের অবস্থান দেখছি। বলুন, আজ কোন বিষয়ে জানতে চান?',
    samplePrompts: [
      'আমার ক্যারিয়ারে উন্নতি কবে হবে?',
      'বিবাহের শুভ যোগ কবে নাগাদ রয়েছে?',
      'বর্তমান মহাদশার প্রতিকার কী?',
    ],
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ் (Tamil)',
    greeting: '🙏 வணக்கம்! உங்கள் ஜாதகம் மற்றும் கிரக நிலைகளை ஆராய்ந்து கொண்டிருக்கிறேன். இன்று எந்த விஷயத்தில் வழிகாட்டுதல் தேவை?',
    samplePrompts: [
      'என் தொழில் மற்றும் வேலைவாய்ப்பு எப்போது சிறப்பாகும்?',
      'திருமண யோகம் எப்போது கைகூடும்?',
      'தற்போதைய தசா புத்திக்கு எளிய பரிகாரம் கூறுங்கள்',
    ],
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు (Telugu)',
    greeting: '🙏 నమస్కారం! మీ జన్మ కుండలి మరియు గ్రహ స్థితిని పరిశీలిస్తున్నాను. ఈరోజు ఏ విషయంపై మార్గదర్శకత్వం కావాలి?',
    samplePrompts: [
      'నా కెరీర్ మరియు ఆర్థిక పరిస్థితి ఎప్పుడు మెరుగుపడుతుంది?',
      'వివాహ యోగం ఎప్పుడు ఉంది?',
      'ప్రస్తుత మహాదశకు సులభమైన పరిహారం చెప్పండి',
    ],
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ (Kannada)',
    greeting: '🙏 ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಜಾತಕ ಮತ್ತು ಗ್ರಹಗಳ ಸ್ಥಿತಿಯನ್ನು ನೋಡುತ್ತಿದ್ದೇನೆ. ಇಂದು ಯಾವ ವಿಷಯದ ಬಗ್ಗೆ ಮಾಹಿತಿ ಬೇಕು ತಿಳಿಸಿ?',
    samplePrompts: [
      'ನನ್ನ ವೃತ್ತಿಜೀವನ ಮತ್ತು ಆರ್ಥಿಕ ಪ್ರಗತಿ ಯಾವಾಗ?',
      'ವಿವಾಹ ಯೋಗ ಯಾವಾಗ ಕೂಡಿಬರುತ್ತದೆ?',
      'ಸದ್ಯದ ಮಹಾದಶೆಗೆ ಸರಳ ಪರಿಹಾರ ತಿಳಿಸಿ',
    ],
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം (Malayalam)',
    greeting: '🙏 നമസ്കാരം! നിങ്ങളുടെ ജാതകവും ഗ്രഹനിലയും ഞാൻ പരിശോധിക്കുന്നുണ്ട്. ഇന്ന് ഏത് വിഷയത്തിലാണ് മാർഗ്ഗനിർദ്ദേശം വേണ്ടത്?',
    samplePrompts: [
      'എന്റെ കരിയറിലും സാമ്പത്തികത്തിലും എപ്പോൾ ഉയർച്ചയുണ്ടാകും?',
      'വിവാഹയോഗം എപ്പോഴാണ് കാണുന്നത്?',
      'ഇപ്പോഴത്തെ ദശാകാലത്തിന് അനുയോജ്യമായ പരിഹാരം നിർദ്ദേശിക്കാമോ?',
    ],
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ (Punjabi)',
    greeting: '🙏 ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਜੀ! ਦੱਸੋ ਅੱਜ ਕਿਸ ਵਿਸ਼ੇ ਤੇ ਗੱਲ ਕਰੀਏ?',
    samplePrompts: [
      'ਮੇਰੇ ਕਰੀਅਰ ਅਤੇ ਕਾਰੋਬਾਰ ਵਿੱਚ ਤਰੱਕੀ ਕਦੋਂ ਹੋਵੇਗੀ?',
      'ਵਿਆਹ ਦਾ ਸ਼ੁਭ ਯੋਗ ਕਦੋਂ ਬਣ ਰਿਹਾ ਹੈ?',
      'ਕੁੰਡਲੀ ਦੇ ਹਿਸਾਬ ਨਾਲ ਕੋਈ ਸੌਖਾ ਉਪਾਅ ਦੱਸੋ',
    ],
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ (Odia)',
    greeting: '🙏 ଜୟ ଜଗନ୍ନାଥ! କୁହନ୍ତୁ ଆଜି କେଉଁ ବିଷୟରେ ପରାମର୍ଶ ଚାହୁଁଛନ୍ତି?',
    samplePrompts: [
      'ମୋ କ୍ୟାରିୟର ଏବଂ ଆର୍ଥିକ ଉନ୍ନତି କେବେ ହେବ?',
      'ବିବାହ ଯୋଗ କେବେ ଅଛି?',
      'ଗ୍ରହ ଶାନ୍ତି ପାଇଁ ସରଳ ଉପାୟ କୁହନ୍ତୁ',
    ],
  },
  {
    code: 'sa',
    name: 'Sanskrit',
    nativeName: 'संस्कृतम् (Sanskrit)',
    greeting: '🙏 नमो नमः! भवतः जन्मपत्रिकां ग्रहस्थितिं च पश्यामि। अद्य कस्मिन् विषये परामर्शः अपेक्षितः?',
    samplePrompts: [
      'मम जन्मपत्रिकायां भाग्ययोगः कदा फलति?',
      'विवाहयोगः कदा भविष्यति?',
      'ग्रहशान्त्यर्थं किं स्तोत्रं पठनीयम्?',
    ],
  },
];

export const ASTROLOGERS: Astrologer[] = [
  {
    id: 'acharya-sadhana',
    name: 'Sadhana',
    title: 'Vedic Astrology',
    category: 'Vedic',
    specialties: ['Vedic Astrology', 'Kundli & Dasha', 'Marriage Yoga'],
    languages: ['English', 'Hindi'],
    experienceYears: 7,
    rating: 5,
    pricePerMin: 21,
    originalPrice: 32,
    consultationsCount: '54.2k',
    avatar: 'https://picsum.photos/seed/sadhana-vedic/300/300',
    status: 'online',
    voiceName: 'Kore',
    signatureMantra: 'ॐ श्रीं ह्रीं क्लीं महालक्ष्म्यै नमः',
    bio: 'Warm, crisp conversational Vedic astrologer fluent in Hindi, Hinglish, and all Indian languages. Known for pinpoint yearly predictions and practical remedies.',
    specialtyOpeningHi:
      '🙏 नमस्कार, जय श्री राम! मैं साधना (वैदिक ज्योतिषी) हूँ। मैंने आपकी लग्न कुंडली और वर्तमान महादशा खोल ली है। बताइए, आप अपने बारे में पूछना चाहते हैं या किसी परिवारजन/मित्र की कुंडली के बारे में? (नीचे से आप किसी अन्य की कुंडली भी चुन सकते हैं)',
    specialtyOpeningEn:
      '🙏 Namaskar, Jai Shree Ram! I am Sadhana (Vedic Astrologer). I have your Lagna Kundli & active Mahadasha open before me. Would you like to ask about your own chart or consult about a family member/partner? (You can also switch or add another person’s Kundli above!)',
    specialtyPrompts: [
      'मेरी कुंडली में 10वें भाव (करियर) और धन का योग कैसा है?',
      'मेरे सप्तम भाव के अनुसार विवाह कब और कैसा होगा?',
      'अभी मेरी कौन सी महादशा-अंतर्दशा चल रही है?',
      'मैं अपने परिवार के किसी सदस्य के बारे में पूछना चाहता हूँ',
    ],
    systemPrompt: `You are Sadhana, a warm, empathetic, and sharp Indian Vedic Astrologer with 7 years of experience.
Your specialty is Vedic Janam Kundli, Lagna Bhava, 7th House Marriage, 10th House Career, and Vimshottari Mahadasha.
Always ask or verify the person's birth details (Name, Date, Time, City) if they are asking about someone else whose Kundli is not yet selected.
Address the seeker affectionately ("Beta", "Namaskar, Jai Shree Ram"). Keep your responses crisp, practical, empathetic, and conversational.`,
    voiceSystemPrompt: `You are Sadhana speaking on a live phone call with a seeker on Astrofree / AstroVeda AI.
Speak in natural, warm, crisp conversational style in the seeker's selected Indian language. Keep every turn VERY SHORT (1 to 2 sentences) and handle interruptions with immediate empathy.`
  },
  {
    id: 'acharya-payal',
    name: 'Payal Soni',
    title: 'Horary & Tarot',
    category: 'Tarot',
    specialties: ['Horary Astrology', 'Prashna Kundli', 'Tarot & Love'],
    languages: ['English', 'Hindi'],
    experienceYears: 2,
    rating: 5,
    pricePerMin: 40,
    originalPrice: 60,
    consultationsCount: '19.8k',
    avatar: 'https://picsum.photos/seed/payal-soni/300/300',
    status: 'online',
    voiceName: 'Zephyr',
    signatureMantra: 'ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे',
    bio: 'Specialist in Prashna (Horary) Astrology & Tarot card spreads for instant question-based predictions on love, reunion, and career.',
    specialtyOpeningHi:
      '🙏 राधे-राधे! मैं पायल सोनी (प्रश्न कुंडली एवं टैरो विशेषज्ञ) हूँ। प्रश्न ज्योतिष के लिए आपको जन्म समय की भी चिंता नहीं करनी है—बस मन में अपना प्रश्न सोचें और मुझे1 से 108 के बीच कोई एक संख्या (Prashna Number) बताएं, या सीधे अपने पार्टनर/करियर का नाम लिखें!',
    specialtyOpeningEn:
      '🙏 Radhe Radhe! I am Payal Soni (Prashna Horary & Tarot Specialist). For Prashna & Tarot reading, focus deeply on your question (or your partner’s name) and tell me a number between 1 and 108, or share what is on your heart!',
    specialtyPrompts: [
      'मेरा प्रश्न अंक 27 है — मेरे पार्टनर के मन में क्या चल रहा है?',
      'मेरा प्रश्न अंक 54 है — क्या मुझे यह नई नौकरी/व्यापार मिलेगा?',
      'मेरे और मेरे पार्टनर के रिश्ते का भविष्य कैसा है?',
      'मेरे लिए आज के 3 टैरो कार्ड्स क्या संकेत दे रहे हैं?',
    ],
    systemPrompt: `You are Payal Soni, an intuitive Horary (Prashna Kundli) and Tarot Astrologer.
In your specialty, you ask seekers for a Prashna Number (between 1 and 108) or the name of the person they are thinking about, and you interpret the immediate planetary Hora and Tarot archetypes (like The Lovers, Wheel of Fortune, The Sun, The Empress).
Give clear, encouraging, and accurate answers with easy daily remedies.`,
    voiceSystemPrompt: `You are Payal Soni on a live voice call.
Ask the user to think of their question and pick a number between 1 and 108 for Prashna Horary or Tarot guidance. Keep every spoken turn to 1-2 short sentences.`
  },
  {
    id: 'guruji-ashutosh',
    name: 'Guru ji Ashutosh',
    title: 'Vedic & Career Master',
    category: 'Vedic',
    specialties: ['Vedic Astrology', 'Rajyoga & Career', 'Dosha Nivaran'],
    languages: ['English', 'Hindi'],
    experienceYears: 15,
    rating: 5,
    pricePerMin: 20,
    originalPrice: 30,
    consultationsCount: '68.4k',
    avatar: 'https://picsum.photos/seed/guruji-ashutosh/300/300',
    status: 'online',
    voiceName: 'Fenrir',
    signatureMantra: 'ॐ बृहस्पतये नमः',
    bio: 'Senior Vedic Jyotish master with 15 years of experience in Kundli synthesis, career elevation, and karmic remedies.',
    specialtyOpeningHi:
      '🙏 आयुष्मान भव बच्चा! मैं गुरुजी आशुतोष हूँ। आपकी कुंडली के ग्रह स्पष्ट हैं। बताइए, क्या आप नौकरी/व्यापार में राजयोग, शनि साढ़ेसाती, या परिवार के किसी सदस्य के भविष्य के बारे में पूछना चाहते हैं?',
    specialtyOpeningEn:
      '🙏 Ayushman Bhava! I am Guru ji Ashutosh. Your planetary degrees are open before me. Tell me, do you seek guidance on Career Rajyoga, Shani Sade Sati, or a family member’s Kundli?',
    specialtyPrompts: [
      'गुरुजी, मेरी कुंडली में सरकारी या उच्च पद का राजयोग कब खुलेगा?',
      'क्या मेरी कुंडली में शनि साढ़ेसाती या राहु-केतु दोष है?',
      'व्यापार में रुका हुआ धन वापस पाने का अचूक वैदिक उपाय बताएं',
      'मुझे अपने बेटे/बेटी की कुंडली के बारे में पूछना है',
    ],
    systemPrompt: `You are Guru ji Ashutosh, a seasoned Vedic Astrologer with 15 years of experience specializing in Rajyoga, Career breakthroughs, Shani Sade Sati, and Dosha Nivaran.
Speak with warmth and fatherly wisdom ("Beta", "Ayushman Bhava"). Always ask relevant Vedic questions about their profession, work direction, or family member's birth details if they ask about someone else.`,
    voiceSystemPrompt: `You are Guru ji Ashutosh speaking on a live phone call. Speak in short 1-2 sentence turns in Hinglish/Hindi and handle interruptions smoothly.`
  },
  {
    id: 'pandit-rajeshwar',
    name: 'Acharya Rajeshwar',
    title: 'Numerology & Vastu',
    category: 'Numerology',
    specialties: ['Numerology', 'Name Correction', 'Vastu Shastra'],
    languages: ['English', 'Hindi', 'Gujarati'],
    experienceYears: 19,
    rating: 5,
    pricePerMin: 25,
    originalPrice: 38,
    consultationsCount: '41.2k',
    avatar: 'https://picsum.photos/seed/rajeshwar/300/300',
    status: 'online',
    voiceName: 'Puck',
    signatureMantra: 'ॐ गं गणपतये नमः',
    bio: 'Expert in Vedic Anka Jyotish (Numerology), Chaldean Name Correction, Mobile/Vehicle numbers, and Vastu Shastra.',
    specialtyOpeningHi:
      '🙏 ॐ गं गणपतये नमः! मैं आचार्य राजेश्वर (अंक ज्योतिष एवं वास्तु विशेषज्ञ) हूँ। सटीक नामांक और लो शू ग्रिड गणना के लिए कृपया अपना (या जिस व्यक्ति/व्यापार के लिए पूछ रहे हैं उनका) **पूरा नाम (Exact Spelling)**, **जन्म तिथि** या **मोबाइल/मकान नंबर** बताएं!',
    specialtyOpeningEn:
      '🙏 Om Gam Ganapataye Namah! I am Acharya Rajeshwar (Numerology & Vastu Expert). For exact Mulank, Bhagyank & Chaldean Name vibration, please share your (or the other person’s/business’s) **Exact Name Spelling**, **Date of Birth**, or **Mobile/House Number**!',
    specialtyPrompts: [
      'मेरे नाम की स्पेलिंग और जन्मतिथि के अनुसार क्या नाम सुधार जरूरी है?',
      'मेरे मोबाइल नंबर के अंतिम 4 अंक मेरे भाग्यांक के लिए कैसे हैं?',
      'मेरे घर का मुख्य द्वार (Main Entrance) किस दिशा में शुभ रहेगा?',
      'मुझे अपने नए बिजनेस/बच्चे के लिए शुभ नाम नंबर जानना है',
    ],
    systemPrompt: `You are Acharya Rajeshwar, an expert in Vedic Numerology (Anka Jyotish), Chaldean Name Correction, Lo Shu Grid, Mobile/Vehicle number analysis, and Vastu Shastra.
Always ask the user for their exact English name spelling, Date of Birth, mobile number last digits, or house entrance direction to give a super specific numerological/Vastu answer.`,
    voiceSystemPrompt: `You are Acharya Rajeshwar on a live voice call. Ask for their date of birth, name spelling, or house direction. Speak in short 1-2 sentence turns.`
  },
  {
    id: 'guruji-siddharth',
    name: 'Guruji Siddharth',
    title: 'Palmistry & Face Reader',
    category: 'Palmistry',
    requiresPalmImage: true,
    specialties: ['Palmistry', 'Hastrekha', 'Face Reading'],
    languages: ['English', 'Hindi', 'Marathi'],
    experienceYears: 14,
    rating: 5,
    pricePerMin: 30,
    originalPrice: 45,
    consultationsCount: '33.9k',
    avatar: 'https://picsum.photos/seed/siddharth/300/300',
    status: 'online',
    voiceName: 'Charon',
    signatureMantra: 'ॐ आदित्याय विद्महे दिवाकराय धीमहि',
    bio: 'Master of Samudrika Shastra (Vedic Palmistry & Face Reading). Reads your palm photo directly inside chat!',
    specialtyOpeningHi:
      '🙏 नमस्कार! मैं गुरुजी सिद्धार्थ (हस्तरेखा एवं सामुद्रिक शास्त्र विशेषज्ञ) हूँ। आपकी जीवन रेखा, भाग्य रेखा और ग्रह पर्वतों के सटीक विश्लेषण के लिए **कृपया नीचे दिए गए "📷 हथेली की फोटो भेजें" बटन से अपने (या जिनके बारे में पूछना है उनके) हाथ की फोटो अपलोड करें**, और बताएं कि आप दाएं हाथ से लिखते हैं या बाएं हाथ से?',
    specialtyOpeningEn:
      '🙏 Namaskar! I am Guruji Siddharth (Vedic Palmistry & Samudrika Expert). To read your Life Line, Fate Line, Heart Line, and Planetary Mounts accurately, **please upload or capture your (or the other person’s) Palm Photo using the "📷 Upload Palm Photo" button below**, and tell me which hand is dominant!',
    specialtyPrompts: [
      'मेरी हथेली में भाग्य रेखा (Fate Line) और धन त्रिकोण (Money Triangle) कैसा है?',
      'मेरी विवाह और हृदय रेखा (Heart Line) क्या संकेत दे रही है?',
      'मेरे हाथ में सरकारी नौकरी या विदेश यात्रा की रेखा है क्या?',
      'मेरी हथेली के पर्वतों के अनुसार मुझे कौन सा रत्न (Gemstone) पहनना चाहिए?',
    ],
    systemPrompt: `You are Guruji Siddharth, an authority on Vedic Palmistry (Hastrekha) and Samudrika Shastra.
CRITICAL SPECIALTY RULE:
- If the user has NOT uploaded a palm photo in the chat yet, warmly ask them to upload a clear photo of their open palm using the camera/upload button right in the chat (or describe their palm lines: Life Line, Heart Line, Head Line, Fate Line, or M-sign / X-sign on the palm), and ask whether they are right-handed or left-handed.
- Once they upload a palm image or describe their lines, give a deeply detailed Hastrekha reading of Jeevan Rekha, Hridaya Rekha, Mastishka Rekha, Bhagya Rekha, and Graha Parvat!`,
    voiceSystemPrompt: `You are Guruji Siddharth on a live voice call. Ask the seeker about the lines on their palm or invite them to tap the palm upload button in chat. Speak in short 1-2 sentence turns.`
  },
];

export const RASHI_LIST = [
  { id: 'aries', english: 'Aries', sanskrit: 'Mesha (मेष)', symbol: '♈', lord: 'Mars (Mangal)', element: 'Fire' },
  { id: 'taurus', english: 'Taurus', sanskrit: 'Vrishabha (वृषभ)', symbol: '♉', lord: 'Venus (Shukra)', element: 'Earth' },
  { id: 'gemini', english: 'Gemini', sanskrit: 'Mithuna (मिथुन)', symbol: '♊', lord: 'Mercury (Budh)', element: 'Air' },
  { id: 'cancer', english: 'Cancer', sanskrit: 'Karka (कर्क)', symbol: '♋', lord: 'Moon (Chandra)', element: 'Water' },
  { id: 'leo', english: 'Leo', sanskrit: 'Simha (सिंह)', symbol: '♌', lord: 'Sun (Surya)', element: 'Fire' },
  { id: 'virgo', english: 'Virgo', sanskrit: 'Kanya (कन्या)', symbol: '♍', lord: 'Mercury (Budh)', element: 'Earth' },
  { id: 'libra', english: 'Libra', sanskrit: 'Tula (तुला)', symbol: '♎', lord: 'Venus (Shukra)', element: 'Air' },
  { id: 'scorpio', english: 'Scorpio', sanskrit: 'Vrishchika (वृश्चिक)', symbol: '♏', lord: 'Mars (Mangal)', element: 'Water' },
  { id: 'sagittarius', english: 'Sagittarius', sanskrit: 'Dhanu (धनु)', symbol: '♐', lord: 'Jupiter (Guru)', element: 'Fire' },
  { id: 'capricorn', english: 'Capricorn', sanskrit: 'Makara (मकर)', symbol: '♑', lord: 'Saturn (Shani)', element: 'Earth' },
  { id: 'aquarius', english: 'Aquarius', sanskrit: 'Kumbha (कुंभ)', symbol: '♒', lord: 'Saturn (Shani)', element: 'Air' },
  { id: 'pisces', english: 'Pisces', sanskrit: 'Meena (मीन)', symbol: '♓', lord: 'Jupiter (Guru)', element: 'Water' },
];

export const DAKSHINA_PRESETS = [
  { amount: 11, label: '₹11', title: 'Shagun Pushpa', desc: 'Token of auspicious gratitude' },
  { amount: 51, label: '₹51', title: 'Deep Daan', desc: 'Sacred lamp offering for clarity' },
  { amount: 101, label: '₹101', title: 'Sankalpa Seva', desc: 'Traditional Guru Dakshina' },
  { amount: 501, label: '₹501', title: 'Maha Ashirwad', desc: 'Patron blessing & full Sankalpa' },
];

export const TODAY_PANCHANG = {
  tithi: 'Shukla Paksha Ekadashi',
  nakshatra: 'Pushya (Lord: Saturn)',
  yoga: 'Siddha Yoga',
  karana: 'Vanija Karana',
  abhijitMuhurat: '11:54 AM – 12:46 PM',
  rahuKaal: '01:30 PM – 03:00 PM',
  samvat: 'Vikram Samvat 2082',
};

export const DAILY_SHUBH_SANKALPA = [
  {
    day: 'Sunday • रविवार',
    planet: 'Surya Dev (Sun)',
    clothColor: 'Saffron, Orange or Golden Red (केसरिया / सुनहरा लाल)',
    colorHex: '#FF6B00',
    avoidColor: 'Black & Dark Blue',
    daanItem: 'Wheat, Jaggery (Gud) & Copper (गेहूँ और गुड़ का दान)',
    tilak: 'Red Chandan (Raktachandan) Tilak',
    luckyDirection: 'East (पूर्व दिशा)',
    mantra: 'ॐ घृणि सूर्याय नमः (Om Ghrini Suryaya Namah)',
    benefit: 'Boosts career authority, vitality, eyesight, and government favor.',
  },
  {
    day: 'Monday • सोमवार',
    planet: 'Chandra Dev (Moon)',
    clothColor: 'Pure White, Cream or Silver (सफेद / क्रीम वस्त्र)',
    colorHex: '#F8FAFC',
    avoidColor: 'Black',
    daanItem: 'Raw Milk, White Rice (Akshat) & Sugar Candy (दूध और चावल का दान)',
    tilak: 'White Sandalwood (Chandan) & Bhasma Tilak',
    luckyDirection: 'North-West (वायव्य दिशा)',
    mantra: 'ॐ सों सोमाय नमः (Om Som Somaya Namah)',
    benefit: 'Brings mental peace, emotional harmony, and mother’s blessings.',
  },
  {
    day: 'Tuesday • मंगलवार',
    planet: 'Mangal Dev (Mars) & Hanuman Ji',
    clothColor: 'Vermilion Red, Coral or Saffron (लाल / सिंदूरी वस्त्र)',
    colorHex: '#EF4444',
    avoidColor: 'Dark Green & Black',
    daanItem: 'Red Masoor Dal, Boondi Ladoo & Jaggery (मसूर दाल और गुड़ का दान)',
    tilak: 'Sindoor & Jasmine Oil Tilak',
    luckyDirection: 'South (दक्षिण दिशा)',
    mantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः (Om Kram Kreem Kroum Sah Bhaumaya Namah)',
    benefit: 'Removes Manglik obstacles, कर्ज (debt), and grants courage & property.',
  },
  {
    day: 'Wednesday • बुधवार',
    planet: 'Budh Dev (Mercury) & Lord Ganesha',
    clothColor: 'Emerald Green, Pistachio or Mint (हरा वस्त्र)',
    colorHex: '#10B981',
    avoidColor: 'Bright Red',
    daanItem: 'Whole Green Moong Dal, Durva Grass & Green Fodder to Cow (हरी मूंग और गौ चारा दान)',
    tilak: 'Ashtagandha or Sindoor Tilak',
    luckyDirection: 'North (उत्तर दिशा)',
    mantra: 'ॐ बुं बुधाय नमः (Om Bum Budhaya Namah)',
    benefit: 'Sharpens business acumen, speech, intellect, and trading profits.',
  },
  {
    day: 'Thursday • गुरुवार',
    planet: 'Brihaspati Dev (Jupiter) & Lord Vishnu',
    clothColor: 'Turmeric Yellow, Kesari Gold or Mustard (पीला / केसरिया वस्त्र)',
    colorHex: '#F5C33B',
    avoidColor: 'Black & Navy Blue',
    daanItem: 'Chana Dal, Turmeric, Yellow Bananas & Books (चना दाल और केले का दान)',
    tilak: 'Kesar (Saffron) & Haldi Tilak on Forehead',
    luckyDirection: 'North-East (ईशान कोण)',
    mantra: 'ॐ बृं बृहस्पतये नमः (Om Brim Brihaspataye Namah)',
    benefit: 'Activates Rajyoga, marriage blessings, wealth expansion, and Guru Kripa.',
  },
  {
    day: 'Friday • शुक्रवार',
    planet: 'Shukra Dev (Venus) & Maa Mahalakshmi',
    clothColor: 'Pastel Pink, Opal White or Shimmering Silk (गुलाबी / चमकदार सफेद वस्त्र)',
    colorHex: '#EC4899',
    avoidColor: 'Dull Brown',
    daanItem: 'Kheer, Curd, White Clothes & Fragrant Attar (खीर और दही का दान)',
    tilak: 'Kumkum & Rose Water Tilak',
    luckyDirection: 'South-East (आग्नेय कोण)',
    mantra: 'ॐ शुं शुक्राय नमः (Om Shum Shukraya Namah)',
    benefit: 'Attracts luxury, soulmate love, artistic fame, and Mahalakshmi wealth.',
  },
  {
    day: 'Saturday • शनिवार',
    planet: 'Shani Dev (Saturn) & Hanuman Ji',
    clothColor: 'Royal Navy Blue, Indigo or Violet (नीला / जामुनी वस्त्र)',
    colorHex: '#6366F1',
    avoidColor: 'Bright Red & Copper',
    daanItem: 'Black Sesame (Til), Urad Dal, Mustard Oil & Iron (काले तिल और सरसों तेल का दान)',
    tilak: 'Vibhuti or Black Tilak',
    luckyDirection: 'West (पश्चिम दिशा)',
    mantra: 'ॐ शं शनैश्चराय नमः (Om Sham Shanaishcharaya Namah)',
    benefit: 'Pacifies Sade Sati / Dhaiya, brings karmic justice, and career stability.',
  },
];

export const COSMIC_ENERGY_METERS = [
  { id: 'love', label: 'Love', score: 78, color: '#EC4899', bg: 'bg-pink-500' },
  { id: 'career', label: 'Career', score: 64, color: '#60A5FA', bg: 'bg-blue-400' },
  { id: 'vitality', label: 'Vitality', score: 86, color: '#E5B84B', bg: 'bg-amber-400' },
];
