export const EN = {
  // Navigation & General
  nav: {
    back: '← Back',
    home: 'Home',
    leaderboard: '🏆 Leaderboard',
    about: 'About',
    quiz: 'Take Quiz',
    compare: 'Compare',
    retake: '🔄 Retake Quiz'
  },

  // Home Page
  home: {
    heroTitle: 'You are 1 in 8.28 Billion',
    heroSub: 'Take the 2-minute quiz to find out exactly how many people share your exact combination of traits.',
    liveCounter: 'people have discovered their rarity today',
    startBtn: 'Discover My Rarity →',
    stats: {
      traits: '12+ Traits Analysed',
      calc: 'Deep Probability Calc',
      score: 'Global Rarity Score'
    },
    testimonials: [
      { name: 'Priya S.', country: 'India', tier: 'Mythic', quote: 'I never knew my blood type made me this rare!' },
      { name: 'James L.', country: 'UK', tier: 'Legendary', quote: 'The statistics are mind-blowing. Truly one of a kind.' },
      { name: 'Elena R.', country: 'Brazil', tier: 'Epic', quote: 'Finally a quiz that uses real data. My score was shocking!' }
    ],
    tiersTitle: 'Rarity Tiers',
    tiersSub: 'Where will you place?'
  },

  // Quiz Page
  quiz: {
    back: '← Back',
    step: 'Step',
    of: 'of',
    next: 'Next →',
    finish: '✨ Calculate My Rarity',
    coreStats: 'CORE STATS',
    bonusStats: 'BONUS STATS',
    takesTime: 'Takes ~45 seconds',
    quickResults: '⚡ Quick Results (Skip to End)',
    addMore: 'Add More Details',
    moreAccurate: '(More accurate score)',
    selectAll: 'Select All That Apply — tap quickly',
    skipStep: 'Skip this step',
    accurateNote: '✨ Each step makes your score more accurate',
    questions: {
      start: {
        title: "Let's get started.",
        hint: "Age helps us compare you to the right demographic groups. Your name is optional.",
        namePlaceholder: "Your name (optional)",
        agePlaceholder: "e.g. 24",
        ageUnit: "years old"
      },
      gender: {
        title: "What is your gender?",
        hint: "Used only for statistical comparison — we respect all identities."
      },
      country: {
        title: "Where are you from?",
        hint: "Population distributions vary greatly by country.",
        searchPlaceholder: "Search country…"
      },
      education: {
        title: "What is your highest education level?",
        hint: "Only ~2% of people worldwide hold a doctorate.",
        defaultOption: "Choose your level…"
      },
      birthday: {
        title: "🎂 One more? Add your birthday for a bonus stat",
        hint: "Calculates the exact number of your birthday twins.",
        day: "Day",
        month: "Month",
        year: "Year"
      },
      hand: {
        title: "Are you left- or right-handed?",
        hint: "About 10% of people are left-handed — already pretty rare!"
      },
      blood: {
        title: "What is your blood type?",
        hint: "AB- is carried by fewer than 1% of people worldwide."
      },
      traits: {
        title: "Your eye & hair color",
        hint: "Natural pigmentation is a strong uniqueness signal.",
        eye: "👁️ Eye Color",
        hair: "💇 Hair Color"
      },
      skills: {
        title: "Your Skills & Hobbies ⚡",
        hint: "These make you truly one of a kind. (Select all that apply)"
      }
    },
    errors: {
      ageReq: "Please enter your age.",
      ageRange: "Age must be between 13 and 100.",
      req: "Please select an option.",
      countryReq: "Please select a country.",
      eduReq: "Please select a level.",
      bdayReq: "Please complete your birthday.",
      bloodReq: "Please select a blood type.",
      eyeReq: "Please select your eye color.",
      hairReq: "Please select your hair color."
    }
  },

  // Result Page
  result: {
    empty: 'No results yet.',
    takeQuizLink: 'Take the quiz',
    scale: { earth: 'Earth 🌍', universe: 'Universe 🔭' },
    eyebrow: '✨ Results are in',
    youAre: 'You are',
    oneIn: '1 in',
    oneInSubEarth: 'out of 8.28 billion people on Earth',
    oneInSubUniverse: 'out of 10 trillion beings in the galaxy',
    rarityScore: 'Rarity Score',
    topPercent: 'Top % of Humans',
    tierLabel: 'Tier',
    story: {
      title: 'Your Rarity Story',
      sub: 'A personalised narrative based on your unique profile.',
      newStory: 'New Story',
      left: 'left',
      messages: {
        polymath: '{name} are a polymath — a rare human archetype that history reserves for its most exceptional figures.',
        generalist: '{name} have scattered your curiosity across many domains, a trait that defines the great generalists.',
        unique: '{name} possess a combination of traits that is beautifully uncommon.',
        miracle: '{name} are proof that rarity lives in the details of your specific choices.',
        explorer: '{name} move through the world with a remarkably unrepeatable identity.',
        individual: '{name} carry a demographic fingerprint that the world can barely replicate.',
        special: 'The precise intersection of your traits and skills makes {name} a true outlier.',
        rare: '{name} belong to an exclusive global minority simply by existing.',
        blueprint: 'The breadth of your abilities is a blueprint that almost no one else matches.',
        original: 'Your wide-ranging curiosity ensures that your personal story is a true original.'
      }
    },
    traitBreakdown: {
      title: 'Trait Breakdown',
      sub: 'How rare is each of your traits individually?'
    },
    rareSkills: {
      title: 'Rare Skills',
      sub: 'Your unique collection of abilities and hobbies.',
      rarest: 'Your Rarest Skill',
      worldwideLink: 'only {pct}% of people worldwide'
    },
    anomaly: {
      title: '🌟 Multi-Skilled Anomaly',
      sub: 'You are in an extraordinarily rare group of humans who master multiple uncommon skills.'
    },
    birthday: {
      title: 'Your birthday twin count 🎂',
      subEarth: 'Out of 8.28 billion people:',
      subUniverse: 'Out of 10 trillion beings:',
      monthShareEarth: '~21.9 Million people share',
      monthShareUniverse: '~27.4 Billion beings share',
      monthShareText: 'your exact month and day',
      exactShareEarth: '~365,000 people were born on',
      exactShareUniverse: '~456 Million beings share',
      exactShareText: 'your exact date'
    },
    famous: {
      title: 'Famous Person Comparison',
      sub: 'See how your rarity compares to historical figures.',
      btn: 'Compare with a Famous Person 🎲',
      shuffle: 'Shuffle 🎲',
      tierLabel: 'Rarity Tier:',
      oneInLabel: '1 in:',
      conclusion: "If you had {name}'s traits, you would be {tier} tier!"
    },
    share: {
      title: 'Share Your Rarity',
      sub: 'Let the world know how unique you are',
      copy: 'Copy Link',
      copied: '✅ Copied!',
      twitter: 'Twitter',
      whatsapp: 'WhatsApp',
      linkedin: 'LinkedIn',
      download: 'Download Score Card',
      generating: 'Generating…'
    },
    actions: {
      challenge: '🤝 Challenge a Friend'
    },
    modal: {
      title: 'Add yourself to the global leaderboard? <br/>🌍🏆',
      sub: 'Show off your uniqueness! Enter a display name (no real name needed):',
      placeholder: 'Skywalker99',
      skip: 'Skip',
      submit: 'Submit',
      uploading: 'Uploading...',
      success: 'Success!'
    },
    cosmicDisclaimer: '🔭 **Cosmic mode is purely for fun** — numbers are fictional estimates loosely based on the Drake Equation (assuming 10,000 advanced civilizations in our galaxy).'
  },

  // Trait Labels
  traits: {
    handedness: '✋ Handedness',
    eyeColor:   '👁️ Eye Colour',
    hairColor:  '💇 Hair Colour',
    gender:     '🧬 Gender',
    country:    '🌍 Country',
    bloodType:  '🩸 Blood Type',
    education:  '🎓 Education',
    ageGroup:   '🎂 Age Group',
    birthday:   '🎉 Birthday'
  },

  // Skill Categories
  skillCats: {
    physical: 'Physical Skills',
    technical: 'Technical Skills',
    creative: 'Creative & Other'
  },

  // Footer
  footer: {
    tagline: 'Discover exactly how rare<br />you are among 8.28 billion humans.',
    explore: 'Explore',
    learn: 'Learn',
    howItWorks: 'How It Works',
    dataSources: 'Our Data Sources',
    disclaimer: 'Built for fun — statistics are approximate'
  },

  // About Page
  about: {
    back: 'Back to Home',
    title: 'About',
    subtitle1: 'There are 8.28 billion people on Earth. Not one of them is exactly like you.',
    subtitle2: 'Unique.com turns that insight into a number — your personal rarity score.',
    faqTitle: 'Frequently Asked Questions',
    faq1Q: 'How is the score calculated?',
    faq1A: 'We use a probability engine based on independent trait multiplication. For example, if trait A occurs in 10% of people and trait B in 5%, the combination occurs in 0.5% (0.1 &times; 0.05). We multiply all your selected traits, scale it logarithmically to a 0–100 score, and assign you a global rarity tier.',
    faq2Q: 'Where does the data come from?',
    faq2A: 'Our backend trait database is compiled from major global statistical sources, including the WHO, census data, sociological studies, and peer-reviewed medical journals tracking genetic distributions (like blood types and hair colors).',
    faq3Q: 'Is my data stored?',
    faq3A: '<span className="text-white">No. Everything is entirely local to your device.</span> Nothing is ever sent to a server. We don\'t use cookies for tracking, we don\'t ask for a login, and we do not store your quiz configuration. It disappears the moment you close the tab unless you explicitly save a share link.',
    ctaTitle: 'Ready to find out?',
    ctaSub: 'Take the 2-minute quiz and get your uniqueness score instantly.',
    embedTitle: 'Add Unique.com to Your Website',
    embedSub: 'Embed our uniqueness calculator directly on your blog or website. Simply copy and paste the snippet below into your HTML.',
    embedCopy: 'Copy Embed Code',
    embedNote: 'Widget supports dynamic sizing and responsive layouts.',
    facts: [
      {
        title: 'Science-backed rarity',
        body: 'Each question maps to a real-world statistical distribution of human traits — from blood types to handedness, sleep patterns and more.'
      },
      {
        title: 'Fully anonymous',
        body: 'We never ask for your name or email. Your answers stay on your device and are only used to calculate your score.'
      },
      {
        title: 'Probability engine',
        body: 'We multiply the independent probabilities of each trait and compare you against the full 8-billion population baseline.'
      },
      {
        title: 'Built for curiosity',
        body: 'Unique.com is a passion project celebrating the statistical miracle that is every individual human being.'
      }
    ]
  },

  // Compare Page
  compare: {
    backToHome: 'Back to Home',
    title: 'Compare Rarity',
    subtitle: 'Ask a friend to send you their Unique.com challenge link, and see who has the rarest combination of traits!',
    placeholder: "Enter friend's username or share link…",
    invite: 'Invite',
    challengedTitle: "You've been challenged! ⚔️",
    challengedSub: "Your friend is 1 in {oneIn} on Earth. Can you beat their rarity score?",
    challengerLabel: "Challenger",
    yourProfileLabel: "Your Profile",
    nextStep: "Next",
    compareBtn: "Compare Now! 💥",
    win: "You Win! 🏆",
    loss: "Friend Wins! 👑",
    tie: "It's a Tie! 🤝",
    winSub: "You have the rarer combination of traits.",
    lossSub: "Your friend has the rarer combination of traits.",
    tieSub: "You both hit the exact same rarity score!",
    ageLabel: "Age",
    skillsLabel: "Skills"
  },

  // Leaderboard Page
  leaderboard: {
    back: 'Back to Home',
    title: 'Global Leaderboard',
    subtitle: 'Top 50 rarest human profiles on Earth.',
    live: 'Live Updates',
    loading: 'Scanning the globe...',
    error: 'Displaying simulated data. Real-time connection unavailable.',
    you: 'You',
    yourRank: 'You are ranked #{rank} globally'
  },

  // Templates
  tiers: {
    Mythic: 'Mythic',
    Legendary: 'Legendary',
    Epic: 'Epic',
    Rare: 'Rare',
    Uncommon: 'Uncommon',
    Common: 'Common'
  },
  
  traitTiers: {
    mythic: 'MYTHIC',
    rare: 'RARE',
    uncommon: 'UNCOMMON',
    common: 'COMMON'
  },
  
  // Daily Facts
  facts: [
    "Only ~2% of the world has naturally green eyes.",
    "About 1 in 12 men (8%) are colorblind, but only 1 in 200 women.",
    "Fewer than 1% of people are truly ambidextrous.",
    "Just 0.6% of the global population has AB- blood — the rarest type.",
    "Left-handedness occurs in roughly 10% of the world's population.",
    "Natural red hair appears in only 1–2% of humans worldwide.",
    "Blue eyes are found in approximately 8% of the global population.",
    "Fewer than 2% of people worldwide hold a doctoral degree.",
    "Only about 4% of people are natural-born night owls who thrive after midnight.",
    "Heterochromia (two different colored eyes) affects fewer than 1% of people.",
    "Perfect pitch — hearing a note and naming it — is found in ~1 in 10,000 people.",
    "About 10,000 people in the world can taste the bitterness of PTC paper; most cannot.",
    "Double-jointed thumbs (Hitchhiker's thumb) appear in roughly 25% of people.",
    "O- blood is the universal donor type, carried by only 7% of people.",
    "Only 1 in 20,000 people are born with synesthesia, sensing letters as colors.",
    "Approximately 15% of people have an extra rib called a cervical rib.",
    "Fewer than 1% of people have 20/10 vision — twice as sharp as 'normal'.",
    "The gene for rolling one's tongue is present in about 65–81% of people.",
    "Only 11% of people predominantly use their left hand for everything.",
    "Hyperthymesia — perfect autobiographical memory — has been confirmed in fewer than 100 people globally.",
    "About 3% of people dream exclusively in black and white.",
    "Albinism occurs in roughly 1 in 20,000 people worldwide.",
    "Only about 17% of adults worldwide are lactose tolerant from birth.",
    "Functional tetrachromacy (seeing a fourth color dimension) is found in ~12% of women.",
    "A natural immunity to HIV exists in ~1% of people with a specific CCR5-delta32 mutation.",
    "Fingerprints are unique to every individual — including identical twins.",
    "Mirror-touch synesthesia — feeling others' physical sensations — affects ~1.6% of people.",
    "Natural blondes make up only about 2% of the global adult population.",
    "The ACTN3 'speed gene' variant is absent in ~18% of people — they have no fast-twitch muscle fibers.",
    "Fewer than 0.1% of people are estimated to carry all four Rh-null blood group antigens — the rarest blood on Earth.",
  ],
  
  sharingText: 'I am 1 in {oneIn} people on Earth! I got {tier} on Unique.com 🔥 Find out how rare YOU are →',
  poweredBy: 'Powered by Unique.com'
};

export const HI = {
  // Navigation & General
  nav: {
    back: '← पीछे',
    home: 'होम',
    leaderboard: '🏆 लीडरबोर्ड',
    about: 'हमारे बारे में',
    quiz: 'क्विज़ लें',
    compare: 'तुलना करें',
    retake: '🔄 फिर से खेलें'
  },

  // Home Page
  home: {
    heroTitle: 'आप 8.28 अरब में से 1 हैं',
    heroSub: 'यह जानने के लिए 2 मिनट का क्विज़ लें कि कितने लोग आपके बिल्कुल समान गुणों को साझा करते हैं।',
    liveCounter: 'लोगों ने आज अपनी दुर्लभता की खोज की है',
    startBtn: 'अपनी दुर्लभता खोजें →',
    stats: {
      traits: '12+ गुणों का विश्लेषण',
      calc: 'गहन संभाव्यता गणना',
      score: 'वैश्विक दुर्लभता स्कोर'
    },
    testimonials: [
      { name: 'प्रिया एस.', country: 'भारत', tier: 'पौराणिक', quote: 'मुझे कभी नहीं पता था कि मेरा ब्लड ग्रुप मुझे इतना दुर्लभ बनाता है!' },
      { name: 'जेम्स एल.', country: 'यूके', tier: 'किंवदंती', quote: 'आंकड़े वास्तव में आश्चर्यजनक हैं। सचमुच अपनी तरह का एक।' },
      { name: 'ऐलेना आर.', country: 'ब्राजील', tier: 'महाकाव्य', quote: 'अंत में एक क्विज़ जो वास्तविक डेटा का उपयोग करता है!' }
    ],
    tiersTitle: 'दुर्लभता स्तर',
    tiersSub: 'आप कहाँ स्थान पाएंगे?'
  },

  // Quiz Page
  quiz: {
    back: '← पीछे',
    step: 'चरण',
    of: 'का',
    next: 'आगे →',
    finish: '✨ मेरी दुर्लभता जानें',
    coreStats: 'मुख्य आँकड़े',
    bonusStats: 'बोनस आँकड़े',
    takesTime: '~45 सेकंड लगते हैं',
    quickResults: '⚡ त्वरित परिणाम (अंत तक छोड़ें)',
    addMore: 'अधिक विवरण जोड़ें',
    moreAccurate: '(अधिक सटीक स्कोर)',
    selectAll: 'लागू होने वाले सभी का चयन करें — जल्दी टैप करें',
    skipStep: 'इस चरण को छोड़ें',
    accurateNote: 'प्रत्येक चरण आपके स्कोर को अधिक सटीक बनाता है',
    questions: {
      start: {
        title: "चलिए शुरू करते हैं।",
        hint: "आयु हमें आपको सही जनसांख्यिकीय समूहों से तुलना करने में मदद करती है। आपका नाम वैकल्पिक है।",
        namePlaceholder: "आपका नाम (वैकल्पिक)",
        agePlaceholder: "उदा. 24",
        ageUnit: "साल का"
      },
      gender: {
        title: "आपका लिंग क्या है?",
        hint: "केवल सांख्यिकीय तुलना के लिए उपयोग किया जाता है — हम सभी पहचानों का सम्मान करते हैं।"
      },
      country: {
        title: "आप कहाँ से हैं?",
        hint: "जनसंख्या वितरण देश के अनुसार बहुत भिन्न होता है।",
        searchPlaceholder: "देश खोजें…"
      },
      education: {
        title: "आपकी उच्चतम शिक्षा का स्तर क्या है?",
        hint: "दुनिया भर में केवल ~2% लोगों के पास डॉक्टरेट है।",
        defaultOption: "अपना स्तर चुनें…"
      },
      birthday: {
        title: "🎂 एक और? बोनस जानकारी के लिए अपना जन्मदिन जोड़ें",
        hint: "आपके जन्मदिन के जुड़वा बच्चों की सटीक संख्या की गणना करता है।",
        day: "दिन",
        month: "महीना",
        year: "वर्ष"
      },
      hand: {
        title: "क्या आप बाएं या दाएं हाथ के हैं?",
        hint: "लगभग 10% लोग बाएं हाथ के हैं — पहले से ही काफी दुर्लभ!"
      },
      blood: {
        title: "आपका ब्लड ग्रुप क्या है?",
        hint: "AB- दुनिया भर में 1% से भी कम लोगों में है।"
      },
      traits: {
        title: "आपकी आँखों और बालों का रंग",
        hint: "प्राकृतिक रंजकता एक मजबूत विशिष्टता संकेत है।",
        eye: "👁️ आँखों का रंग",
        hair: "💇 बालों का रंग"
      },
      skills: {
        title: "आपके कौशल और शौक ⚡",
        hint: "ये आपको वास्तव में अद्वितीय बनाते हैं। (लागू होने वाले सभी का चयन करें)"
      }
    },
    errors: {
      ageReq: "कृपया अपनी आयु दर्ज करें।",
      ageRange: "आयु 13 और 100 के बीच होनी चाहिए।",
      req: "कृपया एक विकल्प चुनें।",
      countryReq: "कृपया एक देश चुनें।",
      eduReq: "कृपया एक स्तर चुनें।",
      bdayReq: "कृपया अपना जन्मदिन पूरा करें।",
      bloodReq: "कृपया एक ब्लड ग्रुप चुनें।",
      eyeReq: "कृपया अपनी आँखों का रंग चुनें।",
      hairReq: "कृपया अपने बालों का रंग चुनें।"
    }
  },

  // Result Page
  result: {
    empty: 'अभी तक कोई परिणाम नहीं।',
    takeQuizLink: 'क्विज़ लें',
    scale: { earth: 'पृथ्वी 🌍', universe: 'ब्रह्मांड 🔭' },
    eyebrow: '✨ परिणाम आ गए हैं',
    youAre: 'आप',
    oneIn: 'में 1',
    oneInSubEarth: 'पृथ्वी पर 8.28 अरब लोगों में से',
    oneInSubUniverse: 'मंदाकिनी में 10 ट्रिलियन प्राणियों में से',
    rarityScore: 'दुर्लभता स्कोर',
    topPercent: 'मनुष्यों का शीर्ष %',
    tierLabel: 'स्तर',
    story: {
      title: 'आपकी दुर्लभता की कहानी',
      sub: 'आपके अद्वितीय प्रोफाइल के आधार पर एक व्यक्तिगत कहानी।',
      newStory: 'नई कहानी',
      left: 'बाकी',
      messages: {
        polymath: '{name} एक बहुश्रुत (polymath) हैं — एक दुर्लभ मानव प्रोटोटाइप जिसे इतिहास अपने सबसे असाधारण व्यक्तित्वों के लिए सुरक्षित रखता है।',
        generalist: '{name} ने अपनी जिज्ञासा को कई क्षेत्रों में फैलाया है, एक ऐसा गुण जो महान बहुमुखी प्रतिभाओं को परिभाषित करता है।',
        unique: '{name} के पास गुणों का एक ऐसा संयोजन है जो खूबसूरती से असामान्य है।',
        miracle: '{name} इस बात का प्रमाण हैं कि दुर्लभता आपके विशिष्ट विकल्पों के विवरण में रहती है।',
        explorer: '{name} एक उल्लेखनीय रूप से अप्राप्य पहचान के साथ दुनिया में घूमते हैं।',
        individual: '{name} एक ऐसा जनसांख्यिकीय फिंगरप्रिंट रखते हैं जिसे दुनिया शायद ही दोहरा सके।',
        special: 'आपके गुणों और कौशलों का सटीक प्रतिच्छेदन {name} को एक वास्तविक आउटलायर बनाता है।',
        rare: '{name} केवल अस्तित्व में होने से एक विशिष्ट वैश्विक अल्पसंख्यक का हिस्सा हैं।',
        blueprint: 'आपकी क्षमताओं का विस्तार एक ऐसा ब्लूप्रिंट है जिसका मुकाबला शायद ही कोई कर सके।',
        original: 'आपकी व्यापक जिज्ञासा सुनिश्चित करती है कि आपकी व्यक्तिगत कहानी एक सच्ची मौलिकता है।'
      }
    },
    traitBreakdown: {
      title: 'गुणों का विवरण',
      sub: 'व्यक्तिगत रूप से आपका प्रत्येक गुण कितना दुर्लभ है?'
    },
    rareSkills: {
      title: 'दुर्लभ कौशल',
      sub: 'क्षमताओं और शौक का आपका अनूठा संग्रह।',
      rarest: 'आपका सबसे दुर्लभ कौशल',
      worldwideLink: 'दुनिया भर में केवल {pct}% लोगों का'
    },
    anomaly: {
      title: '🌟 बहु-कुशल विसंगति',
      sub: 'आप मनुष्यों के एक असाधारण रूप से दुर्लभ समूह में हैं जो कई असामान्य कौशलों में महारत हासिल करते हैं।'
    },
    birthday: {
      title: 'आपके जन्मदिन के जुड़वा बच्चों की संख्या 🎂',
      subEarth: '8 अरब लोगों में से:',
      subUniverse: '10 ट्रिलियन प्राणियों में से:',
      monthShareEarth: 'लगभग 21.9 मिलियन लोगों का',
      monthShareUniverse: 'लगभग 27.4 बिलियन प्राणियों का',
      monthShareText: 'आपका सटीक महीना और दिन है',
      exactShareEarth: 'लगभग 3,65,000 लोग',
      exactShareUniverse: 'लगभग 456 मिलियन प्राणी',
      exactShareText: 'आपकी सटीक तारीख को पैदा हुए थे'
    },
    famous: {
      title: 'प्रसिद्ध व्यक्ति की तुलना',
      sub: 'देखें कि आपकी दुर्लभता ऐतिहासिक हस्तियों से कैसे तुलना करती है।',
      btn: 'प्रसिद्ध व्यक्ति के साथ तुलना करें 🎲',
      shuffle: 'शफ़ल 🎲',
      tierLabel: 'दुर्लभता स्तर:',
      oneInLabel: 'विषम:',
      conclusion: "यदि आपके पास {name} के गुण होते, तो आप {tier} स्तर के होते!"
    },
    share: {
      title: 'अपनी दुर्लभता साझा करें',
      sub: 'दुनिया को बताएं कि आप कितने अद्वितीय हैं',
      copy: 'लिंक कॉपी करें',
      copied: '✅ कॉपी हो गया!',
      twitter: 'ट्विटर',
      whatsapp: 'व्हाट्सएप',
      linkedin: 'लिंक्डइन',
      download: 'स्कोर कार्ड डाउनलोड करें',
      generating: 'उत्पन्न हो रहा है…'
    },
    actions: {
      challenge: '🤝 एक दोस्त को चुनौती दें'
    },
    modal: {
      title: 'क्या आप खुद को वैश्विक लीडरबोर्ड में जोड़ना चाहते हैं? <br/>🌍🏆',
      sub: 'अपनी विशिष्टता दिखाएं! एक प्रदर्शन नाम दर्ज करें (कोई वास्तविक नाम आवश्यक नहीं):',
      placeholder: 'Skywalker99',
      skip: 'छोड़ें',
      submit: 'जमा करें',
      uploading: 'अपलोड हो रहा है...',
      success: 'सफल!'
    },
    cosmicDisclaimer: '🔭 **लौकिक मोड विशुद्ध रूप से मनोरंजन के लिए है** — संख्याएं ड्रेक समीकरण (हमारी आकाशगंगा में 10,000 उन्नत सभ्यताओं को मानते हुए) पर आधारित काल्पनिक अनुमान हैं।'
  },

  // Trait Labels
  traits: {
    handedness: '✋ हाथों की प्रवृत्ति',
    eyeColor:   '👁️ आँखों का रंग',
    hairColor:  '💇 बालों का रंग',
    gender:     '🧬 लिंग',
    country:    '🌍 देश',
    bloodType:  '🩸 रक्त समूह',
    education:  '🎓 शिक्षा',
    ageGroup:   '🎂 आयु वर्ग',
    birthday:   '🎉 जन्मदिन'
  },

  // Skill Categories
  skillCats: {
    physical: 'शारीरिक कौशल',
    technical: 'तकनीकी कौशल',
    creative: 'रचनात्मक और अन्य'
  },

  // Footer
  footer: {
    tagline: 'जानें कि आप 8 अरब मनुष्यों में<br />कितने दुर्लभ हैं।',
    explore: 'खोजें',
    learn: 'जानें',
    howItWorks: 'यह कैसे काम करता है',
    dataSources: 'हमारे डेटा स्रोत',
    disclaimer: 'मनोरंजन के लिए बनाया गया है — आँकड़े अनुमानित हैं'
  },

  // About Page
  about: {
    back: 'होम पर वापस जाएँ',
    title: 'हमारे बारे में',
    subtitle1: 'पृथ्वी पर 8 अरब लोग हैं। उनमें से कोई भी आपके जैसा नहीं है।',
    subtitle2: 'Unique.com उस अंतर्दृष्टि को एक संख्या में बदल देता है — आपका व्यक्तिगत दुर्लभता स्कोर।',
    faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
    faq1Q: 'स्कोर की गणना कैसे की जाती है?',
    faq1A: 'हम स्वतंत्र विशेषता गुणा के आधार पर एक संभाव्यता इंजन का उपयोग करते हैं। उदाहरण के लिए, यदि विशेषता A 10% लोगों में और विशेषता B 5% लोगों में होती है, तो संयोजन 0.5% (0.1 × 0.05) में होता है। हम आपके सभी चयनित गुणों को गुणा करते हैं, इसे 0-100 स्कोर पर लघुगणकीय रूप से स्केल करते हैं, और आपको एक वैश्विक दुर्लभता स्तर प्रदान करते हैं।',
    faq2Q: 'डेटा कहाँ से आता है?',
    faq2A: 'हमारा बैकएंड विशेषता डेटाबेस प्रमुख वैश्विक सांख्यिकीय स्रोतों से संकलित है, जिसमें डब्ल्यूएचओ, जनगणना डेटा, समाजशास्त्रीय अध्ययन और अनुवांशिक वितरण (जैसे रक्त प्रकार और बालों के रंग) को ट्रैक करने वाले पीयर-रिव्यू मेडिकल जर्नल शामिल हैं।',
    faq3Q: 'क्या मेरा डेटा संग्रहीत किया गया है?',
    faq3A: '<span className="text-white">नहीं। सब कुछ पूरी तरह से आपके डिवाइस के लिए स्थानीय है।</span> सर्वर पर कुछ भी नहीं भेजा जाता है। हम ट्रैकिंग के लिए कुकीज़ का उपयोग नहीं करते हैं, हम लॉगिन के लिए नहीं पूछते हैं, और हम आपके क्विज़ कॉन्फ़िगरेशन को संग्रहीत नहीं करते हैं। यह उसी क्षण गायब हो जाता है जब आप टैब बंद करते हैं जब तक कि आप स्पष्ट रूप से साझा लिंक को सहेजते नहीं हैं।',
    ctaTitle: 'जानने के लिए तैयार हैं?',
    ctaSub: '2 मिनट का क्विज़ लें और तुरंत अपना विशिष्टता स्कोर प्राप्त करें।',
    embedTitle: 'अपनी वेबसाइट पर Unique.com जोड़ें',
    embedSub: 'हमारे विशिष्टता कैलकुलेटर को सीधे अपने ब्लॉग या वेबसाइट पर एम्बेड करें। बस नीचे दिए गए स्निपेट को कॉपी करें और अपने HTML में पेस्ट करें।',
    embedCopy: 'एम्बेड कोड कॉपी करें',
    embedNote: 'विजेट डायनेमिक साइज़िंग और रिस्पॉन्सिव लेआउट का समर्थन करता है।',
    facts: [
      {
        title: 'विज्ञान समर्थित दुर्लभता',
        body: 'प्रत्येक प्रश्न मानव गुणों के वास्तविक दुनिया के सांख्यिकीय वितरण को दर्शाता है — रक्त प्रकार से लेकर हाथों की प्रवृत्ति, नींद के पैटर्न और बहुत कुछ।'
      },
      {
        title: 'पूरी तरह से गुमनाम',
        body: 'हम कभी आपका नाम या ईमेल नहीं मांगते। आपके उत्तर आपके डिवाइस पर रहते हैं और केवल आपके स्कोर की गणना करने के लिए उपयोग किए जाते हैं।'
      },
      {
        title: 'संभाव्यता इंजन',
        body: 'हम प्रत्येक गुण की स्वतंत्र संभावनाओं को गुणा करते हैं और आपकी तुलना पूर्ण 8-अरब जनसंख्या बेसलाइन से करते हैं।'
      },
      {
        title: 'जिज्ञासा के लिए निर्मित',
        body: 'Unique.com एक जुनून प्रोजेक्ट है जो प्रत्येक व्यक्तिगत मानव होने के सांख्यिकीय चमत्कार का जश्न मनाता है।'
      }
    ]
  },

  // Compare Page
  compare: {
    backToHome: 'होम पर वापस जाएँ',
    title: 'दुर्लभता की तुलना',
    subtitle: 'किसी दोस्त से उनका Unique.com चुनौती लिंक मांगें, और देखें कि किसके पास गुणों का सबसे दुर्लभ संयोजन है!',
    placeholder: "दोस्त का उपयोगकर्ता नाम या साझा लिंक दर्ज करें...",
    invite: 'आमंत्रित करें',
    challengedTitle: "आपको चुनौती दी गई है! ⚔️",
    challengedSub: "आपका दोस्त पृथ्वी पर {oneIn} लोगों में से 1 है। क्या आप उनके दुर्लभता स्कोर को हरा सकते हैं?",
    challengerLabel: "चुनौती देने वाला",
    yourProfileLabel: "आपका प्रोफाइल",
    nextStep: "अगला",
    compareBtn: "अभी तुलना करें! 💥",
    win: "आप जीत गए! 🏆",
    loss: "दोस्त जीत गया! 👑",
    tie: "बराबर! 🤝",
    winSub: "आपके पास गुणों का दुर्लभ संयोजन है।",
    lossSub: "आपके दोस्त के पास गुणों का दुर्लभ संयोजन है।",
    tieSub: "आप दोनों का दुर्लभता स्कोर बिल्कुल समान है!",
    ageLabel: "आयु",
    skillsLabel: "कौशल"
  },

  // Leaderboard Page
  leaderboard: {
    back: 'होम पर वापस जाएँ',
    title: 'वैश्विक लीडरबोर्ड',
    subtitle: 'पृथ्वी पर शीर्ष 50 सबसे दुर्लभ मानव प्रोफ़ाइल।',
    live: 'लाइव अपडेट',
    loading: 'दुनिया को स्कैन कर रहा है...',
    error: 'सिम्युलेटेड डेटा प्रदर्शित कर रहा है। रीयल-टाइम कनेक्शन अनुपलब्ध।',
    you: 'आप',
    yourRank: 'आप वैश्विक स्तर पर #{rank} स्थान पर हैं'
  },

  // Templates
  tiers: {
    Mythic: 'पौराणिक (Mythic)',
    Legendary: 'आप किंवदंती हैं (Legendary)',
    Epic: 'महाकाव्य (Epic)',
    Rare: 'दुर्लभ (Rare)',
    Uncommon: 'असामान्य (Uncommon)',
    Common: 'सामान्य (Common)'
  },

  traitTiers: {
    mythic: 'पौराणिक',
    rare: 'दुर्लभ',
    uncommon: 'असामान्य',
    common: 'सामान्य'
  },
  
  // Daily Facts
  facts: [
    "दुनिया के केवल ~2% लोगों की आँखें प्राकृतिक रूप से हरी होती हैं।",
    "लगभग 12 में से 1 पुरुष (8%) वर्णांध (colorblind) होते हैं, लेकिन 200 में से केवल 1 महिला।",
    "1% से भी कम लोग वास्तव में उभयहस्त (ambidextrous) होते हैं।",
    "वैश्विक जनसंख्या के केवल 0.6% लोगों का ब्लड ग्रुप AB- है — जो सबसे दुर्लभ प्रकार है।",
    "बाएं हाथ से काम करने वाले लोग दुनिया की आबादी के लगभग 10% हैं।",
    "प्राकृतिक लाल बाल दुनिया भर में केवल 1-2% मनुष्यों में दिखाई देते हैं।",
    "नीली आँखें वैश्विक जनसंख्या के लगभग 8% लोगों में पाई जाती हैं।",
    "दुनिया भर में 2% से भी कम लोगों के पास डॉक्टरेट की डिग्री है।",
    "केवल लगभग 4% लोग जन्मजात 'नाइट आउल' होते हैं जो आधी रात के बाद सक्रिय होते हैं।",
    "हेटरोक्रोमिया (दो अलग-अलग रंगों की आँखें) 1% से भी कम लोगों को प्रभावित करता है।",
    "परफेक्ट पिच — एक स्वर सुनकर उसका नाम बताना — ~10,000 में से 1 व्यक्ति में पाया जाता है।",
    "दुनिया में लगभग 10,000 लोग PTC पेपर की कड़वाहट का स्वाद ले सकते हैं; अधिकांश नहीं।",
    "डबल-ज्वाइंटेड अंगूठे (Hitchhiker's thumb) लगभग 25% लोगों में दिखाई देते हैं।",
    "O- रक्त सार्वभौमिक दाता (universal donor) प्रकार है, जो केवल 7% लोगों में होता है।",
    "20,000 में से केवल 1 व्यक्ति सिनेस्थेसिया के साथ पैदा होता है, जो अक्षरों को रंगों के रूप में महसूस करता है।",
    "लगभग 15% लोगों में एक अतिरिक्त पसली होती है जिसे सर्वाइकल रिब कहा जाता है।",
    "1% से भी कम लोगों की दृष्टि 20/10 होती है — जो 'सामान्य' से दोगुनी तेज है।",
    "जीभ रोल करने का जीन लगभग 65-81% लोगों में मौजूद होता है।",
    "केवल 11% लोग मुख्य रूप से हर काम के लिए अपने बाएं हाथ का उपयोग करते हैं।",
    "हाइपरथाइमेसिया — सटीक आत्मकथात्मक स्मृति — की पुष्टि विश्व स्तर पर 100 से कम लोगों में हुई है।",
    "लगभग 3% लोग विशेष रूप से काले और सफेद रंग में सपने देखते हैं।",
    "एल्बिनिज्म दुनिया भर में लगभग 20,000 में से 1 व्यक्ति में होता है।",
    "दुनिया भर में केवल 17% वयस्क जन्म से लैक्टोज सहिष्णु (lactose tolerant) हैं।",
    "कार्यात्मक टेट्राक्रोमेसी (चौथा रंग आयाम देखना) ~12% महिलाओं में पाया जाता है।",
    "HIV के प्रति प्राकृतिक प्रतिरक्षा विशिष्ट CCR5-delta32 उत्परिवर्तन वाले ~1% लोगों में मौजूद है।",
    "फिंगरप्रिंट हर व्यक्ति के लिए अद्वितीय होते हैं — जिसमें समान जुड़वा बच्चे भी शामिल हैं।",
    "मिरर-टच सिनेस्थेसिया — दूसरों की शारीरिक संवेदनाओं को महसूस करना — ~1.6% लोगों को प्रभावित करता है।",
    "प्राकृतिक सुनहरे बाल (blondes) वैश्विक वयस्क जनसंख्या का केवल 2% हिस्सा हैं।",
    "ACTN3 'स्पीड जीन' संस्करण ~18% लोगों में अनुपस्थित है — उनके पास कोई फास्ट-ट्विच मांसपेशी फाइबर नहीं है।",
    "अनुमान है कि 0.1% से भी कम लोग चारों Rh-null रक्त समूह एंटीजन ले जाते हैं — पृथ्वी पर सबसे दुर्लभ रक्त।"
  ],
  
  sharingText: 'मैं पृथ्वी पर {oneIn} लोगों में से 1 हूँ! मुझे Unique.com पर {tier} मिला 🔥 पता करें कि आप कितने दुर्लभ हैं →',
  poweredBy: 'Unique.com द्वारा संचालित'
};
