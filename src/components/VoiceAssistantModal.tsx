import React, { useState } from 'react';
import { Crop } from '../types/agritech';
import { 
  X, 
  Mic, 
  Square, 
  Sparkles, 
  WifiOff, 
  CheckCircle, 
  Volume2, 
  ArrowRight,
  Database,
  Radio
} from 'lucide-react';

interface VoiceAssistantModalProps {
  onClose: () => void;
  onSaveCrop: (cropData: Partial<Crop>, isOfflineSave: boolean) => void;
  isOfflineMode: boolean;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  onClose,
  onSaveCrop,
  isOfflineMode,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedText, setRecordedText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [parsedData, setParsedData] = useState<{
    title: string;
    variety: string;
    category: Crop['category'];
    wilaya: string;
    quantity: number;
    unit: Crop['unit'];
    pricePerUnit: number;
    harvestStatus: Crop['harvestStatus'];
  } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Sample voice recordings in Algerian dialect and Arabic for easy one-click testing
  const samplePresets = [
    {
      dialect: 'دارجة جزائرية (الشرق / ميلة):',
      text: 'راني في ميلة شلغوم العيد، عندي 3500 لتر زيت زيتون بكر ممتاز عصر بارد، الحموضة 0.25%، السعر 880 دج للتر وموجود للحجز المسبق قبل الجني بـ 15 يوم.',
      data: {
        title: 'زيت زيتون بكر ممتاز عصر بارد',
        variety: 'شملال جبلي معصور على البارد',
        category: 'أشجار مثمرة وزيتون' as Crop['category'],
        wilaya: 'ميلة (Mila)',
        quantity: 3500,
        unit: 'لتر' as Crop['unit'],
        pricePerUnit: 880,
        harvestStatus: 'حجز مسبق قبل الجني' as Crop['harvestStatus'],
      }
    },
    {
      dialect: 'دارجة جزائرية (الصحراء / وادي سوف):',
      text: 'عندي 600 قنطار بطاطا سبونتا في وادي سوف بلدية قمار رملية نقية خالية من الطين، السعر 5500 دج للقنطار جاهزة للقلع والشحن الفوري.',
      data: {
        title: 'بطاطا صحراوية نقية صنف سبونتا',
        variety: 'سبونتا هولندية رملية',
        category: 'خضروات' as Crop['category'],
        wilaya: 'وادي سوف (El Oued)',
        quantity: 600,
        unit: 'قنطار' as Crop['unit'],
        pricePerUnit: 5500,
        harvestStatus: 'جاهز للشحن الفوري' as Crop['harvestStatus'],
      }
    },
    {
      dialect: 'فصحى جزائرية (بسكرة / طولقة):',
      text: 'محصول دقلة نور طولقة الأصلية 120 قنطار شماريخ ممتازة خالية من المبيدات، السعر 49000 دج للقنطار وموعد الجني التقديري بعد 10 أيام.',
      data: {
        title: 'تمور دقلة نور طولقة الأصلية شمروخية',
        variety: 'دقلة نور درجة أولى',
        category: 'تمور' as Crop['category'],
        wilaya: 'بسكرة (Biskra)',
        quantity: 120,
        unit: 'قنطار' as Crop['unit'],
        pricePerUnit: 49000,
        harvestStatus: 'حجز مسبق قبل الجني' as Crop['harvestStatus'],
      }
    },
    {
      dialect: 'دارجة ساحلية (جيجل / العوانة):',
      text: 'راني في جيجل العوانة، عندي 350 طير دجاج عرب بلدي ريفي يرعى في بساتين الزيتون، و 1800 لتر زيت زيتون جبلي بكر ممتاز، السعر 1250 دج للدجاجة و 920 دج للتر زيت جاهز للشحن.',
      data: {
        title: 'دجاج عرب بلدي ريفي وزيت زيتون جبلي',
        variety: 'دجاج عرب بلدي وزيتون أشملال جبلي',
        category: 'دواجن ومواشي' as Crop['category'],
        wilaya: 'جيجل (Jijel)',
        quantity: 350,
        unit: 'طير' as Crop['unit'],
        pricePerUnit: 1250,
        harvestStatus: 'جاهز للشحن الفوري' as Crop['harvestStatus'],
      }
    },
    {
      dialect: 'دارجة شرقية (قسنطينة / الخروب):',
      text: 'في قسنطينة سهول الخروب، عندي 800 قنطار قمح صلب سيميتو ممتاز نخب أول، و 60 رأس خراف وأغنام أولاد جلال مسمنة طبيعياً مع دفتر بيطري، السعر 5800 دج لقنطار القمح.',
      data: {
        title: 'قمح صلب ممتاز وخراف أولاد جلال',
        variety: 'قمح صلب سيميتو وأغنام أولاد جلال',
        category: 'حبوب وبقوليات' as Crop['category'],
        wilaya: 'قسنطينة (Constantine)',
        quantity: 800,
        unit: 'قنطار' as Crop['unit'],
        pricePerUnit: 5800,
        harvestStatus: 'جاهز للشحن الفوري' as Crop['harvestStatus'],
      }
    }
  ];

  const handleSimulateRecording = (preset: typeof samplePresets[0]) => {
    setIsRecording(true);
    setRecordedText('');
    setParsedData(null);

    // Simulate audio recording stream
    setTimeout(() => {
      setIsRecording(false);
      setRecordedText(preset.text);
      setIsAnalyzing(true);

      // Simulate AI Natural Language Extraction for Farmer
      setTimeout(() => {
        setIsAnalyzing(false);
        setParsedData(preset.data);
      }, 700);
    }, 1200);
  };

  const handleSave = () => {
    if (!parsedData) return;

    onSaveCrop({
      title: parsedData.title,
      variety: parsedData.variety,
      category: parsedData.category,
      wilaya: parsedData.wilaya,
      commune: 'مركز الفلاحة',
      quantityAvailable: parsedData.quantity,
      unit: parsedData.unit,
      pricePerUnit: parsedData.pricePerUnit,
      harvestStatus: parsedData.harvestStatus,
      harvestDateEstimated: '2026-10-25',
      daysToHarvest: parsedData.harvestStatus === 'حجز مسبق قبل الجني' ? 14 : 0,
      minimumOrder: 5,
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'],
      description: recordedText,
      isPreOrderAllowed: parsedData.harvestStatus === 'حجز مسبق قبل الجني',
      preOrdersCount: 0,
      preOrderedQuantity: 0,
      verifiedDirect: true,
      soilType: 'تربة فلاحية محلية',
    }, isOfflineMode);

    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-green-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-700/60 rounded-xl border border-emerald-500/40">
              <Mic className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                الإدخال الصوتي الذكي (Voice-First Input)
              </h3>
              <p className="text-xs text-emerald-200">
                مخصص لكبار الفلاحين والعمل الميداني بدون كتابة أو تعقيد
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-black text-stone-900">
              {isOfflineMode ? 'تم الحفظ في الذاكرة المحلية (Offline Cache)' : 'تم نشر المحصول بنجاح في السوق!'}
            </h4>
            <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
              {isOfflineMode 
                ? 'تم تخزين بيانات المحصول محلياً بتقنية Isar/Hive وسيتم رفعها ومزامنتها تلقائياً عند توفر تغطية شبكة 4G/5G في المزرعة.'
                : 'أصبح المحصول متاحاً الآن للمشترين والمطاعم وتجار الجملة مباشرة على الخريطة.'}
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Offline-first badge indicator */}
            <div className="flex items-center justify-between bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-xs">
              <span className="flex items-center gap-1.5 text-stone-700 font-semibold">
                <Database className="w-3.5 h-3.5 text-emerald-700" />
                المزامنة المحلية (Offline-First):
              </span>
              <span className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                isOfflineMode ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {isOfflineMode ? 'مفعل (تخزين محلي بدون إنترنت)' : 'مباشر (سحابي)'}
              </span>
            </div>

            {/* Quick Test Voice Prompts */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">
                اختر نموذج تسجيل صوتي للتجربة الفورية بالدارجة المحلية:
              </label>
              <div className="space-y-2">
                {samplePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSimulateRecording(preset)}
                    className="w-full text-right p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 transition text-xs space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-emerald-800 group-hover:text-emerald-900">
                        {preset.dialect}
                      </span>
                      <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded group-hover:bg-emerald-200">
                        تجربة التسجيل
                      </span>
                    </div>
                    <p className="text-stone-600 line-clamp-1 italic">
                      "{preset.text}"
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Recording Audio Waveform Box */}
            <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/50 rounded-2xl p-5 text-center space-y-3">
              <div className="flex items-center justify-center gap-1.5 h-10">
                {isRecording ? (
                  <>
                    {[40, 75, 95, 60, 85, 100, 70, 50, 90, 65, 30].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 bg-emerald-600 rounded-full animate-pulse"
                        style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                      ></span>
                    ))}
                  </>
                ) : (
                  <div className="text-xs text-stone-500 flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-emerald-600" />
                    <span>انقر على أحد النماذج أعلاه لمحاكاة الإدخال الصوتي للفلاح</span>
                  </div>
                )}
              </div>

              {isRecording && (
                <div className="text-xs font-bold text-emerald-800 animate-pulse">
                  جاري الاستماع والتسجيل من الميكروفون...
                </div>
              )}

              {isAnalyzing && (
                <div className="text-xs font-bold text-amber-800 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>جاري تحليل اللهجة واستخراج بيانات المحصول آلياً...</span>
                </div>
              )}

              {recordedText && !isRecording && (
                <div className="bg-white p-3 rounded-xl border border-stone-200 text-right text-xs text-stone-800 leading-relaxed font-medium">
                  <span className="text-[10px] text-stone-400 font-bold block mb-1">النص الصوتي المفرغ:</span>
                  "{recordedText}"
                </div>
              )}
            </div>

            {/* Extracted Structured Data Card */}
            {parsedData && (
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h5 className="font-extrabold text-stone-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>البيانات المستخرجة آلياً للمحصول:</span>
                  </h5>
                  <span className="text-emerald-700 font-bold text-[11px] bg-emerald-100 px-2 py-0.5 rounded">
                    جاهز للنشر
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-white p-2 rounded-lg border border-stone-100">
                    <span className="text-stone-400 block">اسم المحصول:</span>
                    <strong className="text-stone-800">{parsedData.title}</strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-stone-100">
                    <span className="text-stone-400 block">الولاية:</span>
                    <strong className="text-stone-800">{parsedData.wilaya}</strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-stone-100">
                    <span className="text-stone-400 block">الكمية المقدرة:</span>
                    <strong className="text-emerald-700 font-mono font-bold">
                      {parsedData.quantity} {parsedData.unit}
                    </strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-stone-100">
                    <span className="text-stone-400 block">السعر المطلوب:</span>
                    <strong className="text-stone-800 font-mono font-bold">
                      {parsedData.pricePerUnit} دج / {parsedData.unit}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {isOfflineMode ? 'حفظ في وضع عدم الاتصال (Offline Queue)' : 'نشر المحصول فورياً في المنظومة'}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
