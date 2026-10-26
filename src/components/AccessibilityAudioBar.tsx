import React from 'react';
import { useAccessibility, FontSizeLevel } from '../context/AccessibilityContext';
import { 
  Volume2, 
  VolumeX, 
  Pause, 
  Play, 
  Type, 
  Eye, 
  Sparkles, 
  X, 
  Check, 
  HelpCircle,
  Radio
} from 'lucide-react';

export const AccessibilityAudioBar: React.FC = () => {
  const {
    isAccessibleMode,
    toggleAccessibleMode,
    fontSize,
    setFontSize,
    isSpeaking,
    currentlySpeakingText,
    stopSpeaking,
    speechSpeed,
    setSpeechSpeed,
    dialect,
    setDialect,
    availableArabicVoices,
    selectedVoiceURI,
    setSelectedVoiceURI,
    speakText,
  } = useAccessibility();

  if (!isAccessibleMode && !isSpeaking) {
    return null;
  }

  const handleTestVoice = () => {
    const testPhrase = dialect === 'darja'
      ? 'مرحباً بك في فلاّح تيك. أنا القارئ الصوتي بالدارجة الجزائرية الفلاحية. حساب الضمان المشفر إسكرو يحمي عربون الفلاح والمشتري وفق معايير شبكة ساتيم وبطاقة سي إي بي.'
      : 'أهلاً بكم في منصة فلاّح تيك. أنا القارئ الصوتي باللغة العربية الفصحى. نظام الضمان المالي المشفر يضمن تسليم الشحنات والتحاليل المخبرية لإنرا بدقة متناهية.';
    speakText(testPhrase, 'تجربة القارئ الصوتي العربي', true);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-5xl mx-auto animate-fade-in" role="region" aria-label="شريط التحكم في إمكانية الوصول والقارئ الصوتي العربي">
      <div className="bg-stone-900/95 backdrop-blur-md text-white rounded-3xl p-3.5 sm:p-4 shadow-2xl border-2 border-amber-400/80 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Audio Speaking Status & Waveform */}
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <div className={`p-2.5 rounded-2xl flex items-center justify-center shrink-0 ${
            isSpeaking ? 'bg-amber-500 text-stone-950 animate-pulse' : 'bg-stone-800 text-stone-300'
          }`}>
            {isSpeaking ? (
              <Volume2 className="w-6 h-6 animate-bounce" />
            ) : (
              <Eye className="w-5 h-5 text-amber-400" />
            )}
          </div>

          <div className="space-y-0.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-400/40 flex items-center gap-1">
                <span>🇩🇿 القارئ الصوتي العربي</span>
                <span className="text-[10px] text-emerald-400">({dialect === 'darja' ? 'دارجة فلاحية' : 'فصحى'})</span>
              </span>

              {isSpeaking && (
                <div className="flex items-center gap-1">
                  {[40, 90, 60, 100, 70, 30].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 bg-amber-400 rounded-full animate-pulse"
                      style={{ height: `${h * 0.16}px`, animationDelay: `${i * 0.1}s` }}
                    ></span>
                  ))}
                </div>
              )}
            </div>

            <p className="text-xs text-stone-200 font-bold truncate">
              {currentlySpeakingText ? (
                <>جاري القراءة بالعربية: <span className="text-amber-300">"{currentlySpeakingText}"</span></>
              ) : (
                'القارئ الصوتي مفعّل بالعربية • انقر على أي تفصيل مالي أو عربون للاستماع'
              )}
            </p>
          </div>
        </div>

        {/* Center / Right: Accessibility Controls */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Test Voice Button */}
          <button
            type="button"
            onClick={handleTestVoice}
            className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-600 text-white px-2.5 py-1.5 rounded-xl text-xs font-bold transition shadow-xs"
            title="تجربة صوت القارئ العربي"
            aria-label="تجربة القارئ الصوتي باللغة العربية"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-200" />
            <span>تجربة الصوت</span>
          </button>

          {/* Dialect Selector: Algerian Darja vs Standard Arabic */}
          <div className="flex items-center gap-1 bg-stone-800 p-1 rounded-xl border border-stone-700 text-xs font-bold" role="group" aria-label="لهجة القارئ الصوتي">
            <span className="text-[10px] text-stone-400 px-1 hidden md:inline">اللهجة:</span>
            <button
              type="button"
              onClick={() => setDialect('darja')}
              className={`px-2 py-1 rounded-lg text-[11px] transition ${
                dialect === 'darja' ? 'bg-amber-400 text-stone-950 font-black' : 'text-stone-300 hover:text-white'
              }`}
              title="لهجة جزائرية فلاحية"
            >
              🇩🇿 جزائرية
            </button>
            <button
              type="button"
              onClick={() => setDialect('fusha')}
              className={`px-2 py-1 rounded-lg text-[11px] transition ${
                dialect === 'fusha' ? 'bg-amber-400 text-stone-950 font-black' : 'text-stone-300 hover:text-white'
              }`}
              title="اللغة العربية الفصحى"
            >
              فصحى
            </button>
          </div>

          {/* Voices dropdown if multiple detected */}
          {availableArabicVoices.length > 1 && (
            <select
              value={selectedVoiceURI || ''}
              onChange={(e) => setSelectedVoiceURI(e.target.value)}
              className="bg-stone-800 text-stone-200 text-xs rounded-xl px-2 py-1.5 border border-stone-700 focus:outline-none focus:border-amber-400 max-w-[120px] truncate"
              title="اختر صوت القارئ العربي من جهازك"
              aria-label="اختر صوت القارئ العربي"
            >
              {availableArabicVoices.map(v => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name.replace(/Microsoft|Google|Apple/g, '').trim()} ({v.lang})
                </option>
              ))}
            </select>
          )}

          {/* Stop / Pause Voice */}
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-xs transition"
              title="إيقاف الصوت الآن"
              aria-label="إيقاف القراءة الصوتية"
            >
              <VolumeX className="w-4 h-4" />
              <span>إيقاف</span>
            </button>
          )}

          {/* Font Size Selector for Elderly Farmers */}
          <div className="flex items-center gap-1 bg-stone-800 p-1 rounded-xl border border-stone-700 text-xs font-bold" role="group" aria-label="حجم الخط">
            <span className="text-[10px] text-stone-400 px-1 hidden sm:inline">الخط:</span>
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 rounded-lg transition ${
                fontSize === 'normal' ? 'bg-amber-400 text-stone-950 font-black' : 'text-stone-300 hover:text-white'
              }`}
              title="حجم خط عادي"
              aria-label="حجم خط عادي"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-1 rounded-lg transition ${
                fontSize === 'large' ? 'bg-amber-400 text-stone-950 font-black text-sm' : 'text-stone-300 hover:text-white'
              }`}
              title="خط كبير ومريح لكبار السن"
              aria-label="خط كبير"
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('extra-large')}
              className={`px-2 py-1 rounded-lg transition ${
                fontSize === 'extra-large' ? 'bg-amber-400 text-stone-950 font-black text-base' : 'text-stone-300 hover:text-white'
              }`}
              title="خط فائق الكبر"
              aria-label="خط فائق الكبر"
            >
              A++
            </button>
          </div>

          {/* Speech Speed Switcher */}
          <div className="flex items-center gap-1 bg-stone-800 p-1 rounded-xl border border-stone-700 text-xs font-bold hidden sm:flex" role="group" aria-label="سرعة القراءة">
            <span className="text-[10px] text-stone-400 px-1">السرعة:</span>
            <button
              onClick={() => setSpeechSpeed(0.75)}
              className={`px-2 py-1 rounded-lg text-[11px] ${
                speechSpeed === 0.75 ? 'bg-amber-400 text-stone-950 font-black' : 'text-stone-300 hover:text-white'
              }`}
              aria-label="سرعة هادئة"
            >
              0.75x
            </button>
            <button
              onClick={() => setSpeechSpeed(0.85)}
              className={`px-2 py-1 rounded-lg text-[11px] ${
                speechSpeed === 0.85 ? 'bg-amber-400 text-stone-950 font-black' : 'text-stone-300 hover:text-white'
              }`}
              aria-label="سرعة معتدلة"
            >
              0.85x
            </button>
          </div>

          {/* Toggle Accessible Mode Off */}
          <button
            onClick={toggleAccessibleMode}
            className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition"
            title="إغلاق وضع القراءة الميسر"
            aria-label="إغلاق وضع القراءة الميسر"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Screen Reader Live Announcement Region */}
      <div
        id="fllah-sr-announcements"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {currentlySpeakingText || ''}
      </div>
    </div>
  );
};
