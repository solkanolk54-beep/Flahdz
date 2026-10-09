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
  } = useAccessibility();

  if (!isAccessibleMode && !isSpeaking) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-4xl mx-auto animate-fade-in">
      <div className="bg-stone-900/95 backdrop-blur-md text-white rounded-3xl p-3.5 sm:p-4 shadow-2xl border-2 border-amber-400/80 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Audio Speaking Status & Waveform */}
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
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
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-400/40">
                وضع القراءة الميسر لكبار الفلاحين
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
                <>جاري القراءة بصوت مسموع: <span className="text-amber-300">"{currentlySpeakingText}"</span></>
              ) : (
                'انقر على زر السماعة 🔉 بجانب أي محصول أو سعر للاستماع لتفاصيله بصوت مريح'
              )}
            </p>
          </div>
        </div>

        {/* Center / Right: Accessibility Controls */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Stop / Pause Voice */}
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-xs transition"
              title="إيقاف الصوت الآن"
            >
              <VolumeX className="w-4 h-4" />
              <span>إيقاف الصوت</span>
            </button>
          )}

          {/* Font Size Selector for Elderly Farmers */}
          <div className="flex items-center gap-1 bg-stone-800 p-1 rounded-xl border border-stone-700 text-xs font-bold">
            <span className="text-[10px] text-stone-400 px-1 hidden sm:inline">حجم الخط:</span>
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 rounded-lg transition ${
                fontSize === 'normal' ? 'bg-amber-400 text-stone-950 font-black' : 'text-stone-300 hover:text-white'
              }`}
              title="حجم خط عادي"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-1 rounded-lg transition ${
                fontSize === 'large' ? 'bg-amber-400 text-stone-950 font-black text-sm' : 'text-stone-300 hover:text-white'
              }`}
              title="خط كبير ومريح لكبار السن"
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('extra-large')}
              className={`px-2 py-1 rounded-lg transition ${
                fontSize === 'extra-large' ? 'bg-amber-400 text-stone-950 font-black text-base' : 'text-stone-300 hover:text-white'
              }`}
              title="خط فائق الكبر"
            >
              A++
            </button>
          </div>

          {/* Speech Speed Switcher */}
          <div className="flex items-center gap-1 bg-stone-800 p-1 rounded-xl border border-stone-700 text-xs font-bold hidden sm:flex">
            <span className="text-[10px] text-stone-400 px-1">سرعة الصوت:</span>
            <button
              onClick={() => setSpeechSpeed(0.75)}
              className={`px-2 py-1 rounded-lg text-[11px] ${
                speechSpeed === 0.75 ? 'bg-amber-400 text-stone-950 font-black' : 'text-stone-300 hover:text-white'
              }`}
            >
              هادئ (0.75x)
            </button>
            <button
              onClick={() => setSpeechSpeed(0.85)}
              className={`px-2 py-1 rounded-lg text-[11px] ${
                speechSpeed === 0.85 ? 'bg-amber-400 text-stone-950 font-black' : 'text-stone-300 hover:text-white'
              }`}
            >
              معتدل (0.85x)
            </button>
          </div>

          {/* Toggle Accessible Mode Off */}
          <button
            onClick={toggleAccessibleMode}
            className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition"
            title="إغلاق وضع القراءة الميسر"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
