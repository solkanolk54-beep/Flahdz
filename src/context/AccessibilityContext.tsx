import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type FontSizeLevel = 'normal' | 'large' | 'extra-large';
export type ArabicDialect = 'darja' | 'fusha';

interface VoiceOption {
  name: string;
  lang: string;
  voiceURI: string;
}

interface AccessibilityContextType {
  isAccessibleMode: boolean;
  toggleAccessibleMode: () => void;
  fontSize: FontSizeLevel;
  setFontSize: (size: FontSizeLevel) => void;
  isSpeaking: boolean;
  currentlySpeakingText: string | null;
  speakText: (text: string, title?: string, force?: boolean) => void;
  stopSpeaking: () => void;
  speechSpeed: number;
  setSpeechSpeed: (speed: number) => void;
  dialect: ArabicDialect;
  setDialect: (dialect: ArabicDialect) => void;
  availableArabicVoices: VoiceOption[];
  selectedVoiceURI: string | null;
  setSelectedVoiceURI: (uri: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAccessibleMode, setIsAccessibleMode] = useState<boolean>(false);

  const [fontSize, setFontSize] = useState<FontSizeLevel>(() => {
    return (localStorage.getItem('fllah_font_size') as FontSizeLevel) || 'normal';
  });

  const [speechSpeed, setSpeechSpeed] = useState<number>(0.85); // calm and clear for Algerian farmers
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentlySpeakingText, setCurrentlySpeakingText] = useState<string | null>(null);
  const [dialect, setDialect] = useState<ArabicDialect>('darja'); // 'darja' Algerian dialect or 'fusha'
  const [availableArabicVoices, setAvailableArabicVoices] = useState<VoiceOption[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(null);

  // Load and cache browser Arabic voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      // Filter Arabic voices (ar-DZ, ar-SA, ar-EG, ar-*, or Arabic in name)
      const arVoices = allVoices.filter(v => 
        v.lang.toLowerCase().startsWith('ar') || 
        v.name.toLowerCase().includes('arabic') || 
        v.name.includes('عربي') ||
        v.name.includes('Tarık') ||
        v.name.includes('Tarik') ||
        v.name.includes('Laila') ||
        v.name.includes('Maged') ||
        v.name.includes('Salma') ||
        v.name.includes('Shakir')
      );

      const voiceOpts = arVoices.map(v => ({
        name: v.name,
        lang: v.lang,
        voiceURI: v.voiceURI
      }));

      setAvailableArabicVoices(voiceOpts);

      if (voiceOpts.length > 0 && !selectedVoiceURI) {
        // Prefer Algerian (ar-DZ) if present, then standard Arabic (ar-SA), then any
        const prefVoice = voiceOpts.find(v => v.lang.toLowerCase() === 'ar-dz') ||
                          voiceOpts.find(v => v.lang.toLowerCase() === 'ar-sa') ||
                          voiceOpts[0];
        setSelectedVoiceURI(prefVoice.voiceURI);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [selectedVoiceURI]);

  useEffect(() => {
    localStorage.setItem('fllah_accessibility_mode', isAccessibleMode.toString());
  }, [isAccessibleMode]);

  useEffect(() => {
    localStorage.setItem('fllah_font_size', fontSize);
    const root = document.documentElement;
    if (fontSize === 'large') {
      root.style.fontSize = '18px';
    } else if (fontSize === 'extra-large') {
      root.style.fontSize = '20px';
    } else {
      root.style.fontSize = '16px';
    }
  }, [fontSize]);

  const toggleAccessibleMode = () => {
    setIsAccessibleMode(prev => {
      const next = !prev;
      if (next) {
        setFontSize('large');
        speakText('مرحباً بك في فلاّح تيك. تم تشغيل القارئ الصوتي باللغة العربية مع نطق جزائري فلاحي ميسر لكبار السن. انقر على أي تفصيل مالي أو عربون للاستماع إليه فوراً.', undefined, true);
      } else {
        setFontSize('normal');
        stopSpeaking();
      }
      return next;
    });
  };

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setCurrentlySpeakingText(null);
  }, []);

  const speakText = useCallback((text: string, title?: string, force: boolean = false) => {
    if (typeof window === 'undefined') return;

    // Advanced phonetic transformation for Algerian agricultural & Escrow financial domain
    let cleanText = text
      // Algerian Currency
      .replace(/دج/g, 'دينار جزائري')
      .replace(/د\.ج/g, 'دينار جزائري')
      .replace(/DZD/gi, 'دينار جزائري')
      // Measurements
      .replace(/كم/g, 'كيلومتر')
      .replace(/كغ/g, 'كيلوغرام')
      .replace(/طن/g, 'طن')
      .replace(/هكتار/g, 'هكتار')
      .replace(/%/g, 'بالمائة')
      .replace(/\+/g, 'زائد')
      .replace(/≤/g, 'أقل من أو يساوي')
      .replace(/≥/g, 'أكبر من أو يساوي')
      .replace(/0\.00\s*mg\/kg/gi, 'صفر بالمائة خلو تام من بقايا المبيدات')
      .replace(/mg\/kg/gi, 'ميليغرام في الكيلوغرام')
      // Algerian Escrow & Payment Terminology
      .replace(/Escrow/gi, 'حساب الضمان المالي المشفر إسكرو')
      .replace(/SATIM/gi, 'شبكة ساتيم للدفع الإلكتروني الجزائري')
      .replace(/GIE/gi, 'تجمع النقد الآلي الجزائري')
      .replace(/CIB/gi, 'البطاقة البنكية سي إي بي')
      .replace(/Edahabia/gi, 'البطاقة الذهبية لبريد الجزائر')
      .replace(/OTP/gi, 'رمز التحقق السري المؤقت')
      .replace(/SMS/gi, 'رسالة نصية قصيرة')
      .replace(/CVV2?/gi, 'رمز الأمان السري للبطاقة')
      // Quality & Research Institutes
      .replace(/INRAA/gi, 'المعهد الوطني للأبحاث الزراعية إنرا')
      .replace(/ITDAS/gi, 'معهد إيتداس للزراعات الصحراوية')
      .replace(/CACQE/gi, 'المركز الجزائري لمراقبة الجودة وقمع الغش')
      .replace(/INPV/gi, 'المعهد الوطني لحماية النباتات')
      .replace(/DSA/gi, 'مديرية المصالح الفلاحية')
      // Commercial & Olive Oil
      .replace(/B2B/gi, 'عقود المؤسسات والشركات')
      .replace(/EVOO/gi, 'زيت زيتون بكر ممتاز فائق الجودة')
      .replace(/HELD/gi, 'محجوز كعربون ضمان')
      .replace(/RELEASED/gi, 'تم تحرير الأموال لحساب الفلاح')
      .replace(/REFUNDED/gi, 'تم إرجاع العربون للمشتري')
      .replace(/GIS/gi, 'نظام المعلومات الجغرافية');

    // Algerian Darja context adaptations if user selected Algerian Darja mode
    if (dialect === 'darja') {
      cleanText = cleanText
        .replace(/العربون/g, 'عربون الضمان المالي')
        .replace(/المطلوب/g, 'المطلوب للدفع')
        .replace(/متبقي/g, 'ما زال باقي');
    }

    stopSpeaking();

    // Screen reader accessible announcement in DOM (aria-live region)
    const liveAnnouncer = document.getElementById('fllah-sr-announcements');
    if (liveAnnouncer) {
      liveAnnouncer.textContent = cleanText;
    }

    // STRICT AUDIO SAFEGUARD:
    // Only synthesize browser audio through speakers if:
    // 1) Explicitly requested by clicking a speaker button (force === true)
    // 2) OR if the user intentionally turned on the Accessible Speaker Mode (isAccessibleMode === true)
    if (!force && !isAccessibleMode) {
      return;
    }

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Standard Arabic lang code for SpeechSynthesis (ar-SA or ar-DZ)
      utterance.lang = 'ar-SA';
      utterance.rate = speechSpeed;
      utterance.pitch = 1.0;

      // Select Arabic voice
      const allVoices = window.speechSynthesis.getVoices();
      let chosenVoice: SpeechSynthesisVoice | undefined;

      if (selectedVoiceURI) {
        chosenVoice = allVoices.find(v => v.voiceURI === selectedVoiceURI);
      }

      if (!chosenVoice) {
        // Priority: ar-DZ (Algeria) -> ar-SA (Saudi/Fusha) -> ar-* -> Arabic in name
        chosenVoice = allVoices.find(v => v.lang.toLowerCase() === 'ar-dz') ||
                      allVoices.find(v => v.lang.toLowerCase().startsWith('ar-sa')) ||
                      allVoices.find(v => v.lang.toLowerCase().startsWith('ar')) ||
                      allVoices.find(v => v.name.toLowerCase().includes('arabic') || v.name.includes('عرب'));
      }

      if (chosenVoice) {
        utterance.voice = chosenVoice;
        utterance.lang = chosenVoice.lang;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentlySpeakingText(title || cleanText.substring(0, 70) + '...');
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentlySpeakingText(null);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setCurrentlySpeakingText(null);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback simulated caption
      setIsSpeaking(true);
      setCurrentlySpeakingText(title || cleanText.substring(0, 70) + '...');
      setTimeout(() => {
        setIsSpeaking(false);
        setCurrentlySpeakingText(null);
      }, 5000);
    }
  }, [isAccessibleMode, dialect, speechSpeed, selectedVoiceURI, stopSpeaking]);

  return (
    <AccessibilityContext.Provider
      value={{
        isAccessibleMode,
        toggleAccessibleMode,
        fontSize,
        setFontSize,
        isSpeaking,
        currentlySpeakingText,
        speakText,
        stopSpeaking,
        speechSpeed,
        setSpeechSpeed,
        dialect,
        setDialect,
        availableArabicVoices,
        selectedVoiceURI,
        setSelectedVoiceURI,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

