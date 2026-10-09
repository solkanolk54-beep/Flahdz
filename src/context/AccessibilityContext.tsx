import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type FontSizeLevel = 'normal' | 'large' | 'extra-large';

interface AccessibilityContextType {
  isAccessibleMode: boolean;
  toggleAccessibleMode: () => void;
  fontSize: FontSizeLevel;
  setFontSize: (size: FontSizeLevel) => void;
  isSpeaking: boolean;
  currentlySpeakingText: string | null;
  speakText: (text: string, title?: string) => void;
  stopSpeaking: () => void;
  speechSpeed: number;
  setSpeechSpeed: (speed: number) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAccessibleMode, setIsAccessibleMode] = useState<boolean>(() => {
    return localStorage.getItem('fllah_accessibility_mode') === 'true';
  });

  const [fontSize, setFontSize] = useState<FontSizeLevel>(() => {
    return (localStorage.getItem('fllah_font_size') as FontSizeLevel) || 'normal';
  });

  const [speechSpeed, setSpeechSpeed] = useState<number>(0.85); // calm and clear for elderly farmers
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentlySpeakingText, setCurrentlySpeakingText] = useState<string | null>(null);

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
        speakText('تم تفعيل وضع القراءة الميسر لكبار الفلاحين. يمكنك الآن الاستماع لتفاصيل أي محصول أو سعر بنقرة واحدة.');
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

  const speakText = useCallback((text: string, title?: string) => {
    if (typeof window === 'undefined') return;

    // Clean text for speech
    const cleanText = text
      .replace(/دج/g, 'دينار جزائري')
      .replace(/كم/g, 'كيلومتر')
      .replace(/كغ/g, 'كيلوغرام')
      .replace(/%/g, 'بالمائة')
      .replace(/\+/g, 'زائد')
      .replace(/INRAA/gi, 'مخبر إنرا')
      .replace(/ITDAS/gi, 'معهد إيتداس')
      .replace(/CACQE/gi, 'مخبر قمع الغش')
      .replace(/B2B/gi, 'المؤسسات');

    stopSpeaking();

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ar-XA'; // standard Arabic voice
      utterance.rate = speechSpeed;
      utterance.pitch = 1.0;

      // Try finding an Arabic voice installed on device
      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find(v => v.lang.startsWith('ar'));
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentlySpeakingText(title || cleanText.substring(0, 60) + '...');
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
      setCurrentlySpeakingText(title || cleanText.substring(0, 60) + '...');
      setTimeout(() => {
        setIsSpeaking(false);
        setCurrentlySpeakingText(null);
      }, 5000);
    }
  }, [speechSpeed, stopSpeaking]);

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
