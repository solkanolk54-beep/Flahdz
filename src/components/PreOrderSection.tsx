import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { Crop, PreOrderRequest } from '../types/agritech';
import { 
  CalendarDays, 
  Clock, 
  FileCheck, 
  ShieldCheck, 
  TrendingUp, 
  Store, 
  Utensils, 
  Factory, 
  User, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Volume2,
  VolumeX
} from 'lucide-react';

interface PreOrderSectionProps {
  crops: Crop[];
  onOpenPreOrder: (crop: Crop) => void;
  preOrderRequests: PreOrderRequest[];
  onOpenPaymentModal: (req: PreOrderRequest) => void;
}

export const PreOrderSection: React.FC<PreOrderSectionProps> = ({
  crops,
  onOpenPreOrder,
  preOrderRequests,
  onOpenPaymentModal,
}) => {
  const { isAccessibleMode, speakText, isSpeaking, stopSpeaking, currentlySpeakingText } = useAccessibility();
  const [activeFilter, setActiveFilter] = useState<'all' | 'olive' | 'dates' | 'citrus'>('all');

  const preOrderCrops = crops.filter(c => c.isPreOrderAllowed || c.harvestStatus === 'حجز مسبق قبل الجني');

  return (
    <div className="space-y-6">
      {/* Hero explanation of Pre-Order Harvesting */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-950 rounded-2xl p-5 sm:p-6 text-white shadow-md">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-amber-600/60 border border-amber-400/40 px-3 py-1 rounded-full text-xs font-bold text-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>نظام إبداء الرغبة بالشراء والحصاد التعاقدي (Pre-Order Harvesting)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            احجز محصولك قبل الجني مباشرة من الحقل بأسعار تفضيلية
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
            يمكّن هذا النظام المطاعم، الفنادق، المصانع التحويلية وتجار الجملة من التعاقد المسبق مع الفلاحين قبل نضج المحصول. يضمن الفلاح تصريف منتوجه مسبقاً، ويضمن المشتري جودة نقية وسعراً ثابتاً دون مضاربات الأسواق.
          </p>
        </div>

        {/* Benefits strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-amber-600/60 text-xs">
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/15">
            <div className="font-extrabold text-white">ضمان الكمية</div>
            <div className="text-amber-200 text-[11px]">حجز حصتك من القنطارات المتاحة</div>
          </div>
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/15">
            <div className="font-extrabold text-white">توفير مالي</div>
            <div className="text-amber-200 text-[11px]">تجنب ارتفاع الأسعار وقت ذروة الطلب</div>
          </div>
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/15">
            <div className="font-extrabold text-white">جودة مفحوصة</div>
            <div className="text-amber-200 text-[11px]">متابعة التقرير المخبري ونقاء الثمار</div>
          </div>
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/15">
            <div className="font-extrabold text-white">عقد توريد موثق</div>
            <div className="text-amber-200 text-[11px]">شروط استلام واضحة ولوجستيات جاهزة</div>
          </div>
        </div>
      </div>

      {/* Crops Available for Pre-Order */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-stone-900">
            المحاصيل المفتوحة للحجز المسبق حالياً ({preOrderCrops.length})
          </h3>
          <span className="text-xs text-stone-500">
            يتم التوصيل فور اكتمال الجني في التاريخ المحدد
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {preOrderCrops.map((crop) => {
            const reservedPercent = Math.min(100, Math.round((crop.preOrderedQuantity / crop.quantityAvailable) * 100));

            return (
              <div
                key={crop.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs hover:border-amber-500 transition duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Image & Countdown */}
                  <div className="relative h-44 bg-stone-100 overflow-hidden">
                    <img
                      src={crop.image}
                      alt={crop.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>

                    {/* Countdown banner */}
                    <div className="absolute top-2.5 right-2.5 bg-amber-500 text-stone-900 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      <Clock className="w-3.5 h-3.5" />
                      <span>متبقي {crop.daysToHarvest} يوم على بدء الجني</span>
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 left-2.5 text-white">
                      <div className="text-[11px] font-semibold text-amber-300">
                        تاريخ الجني التقديري: {crop.harvestDateEstimated}
                      </div>
                      <h4 className="font-extrabold text-sm truncate mt-0.5">
                        {crop.title}
                      </h4>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-stone-500">سعر الحجز المسبق:</span>
                      <span className="text-base font-black text-amber-800 font-mono">
                        {crop.pricePerUnit.toLocaleString()} دج / {crop.unit}
                      </span>
                    </div>

                    {/* Audio Reader for Pre-Order Details */}
                    <button
                      type="button"
                      onClick={() => {
                        const isSpeakingThis = isSpeaking && currentlySpeakingText?.includes(crop.title.substring(0, 15));
                        if (isSpeakingThis) {
                          stopSpeaking();
                        } else {
                          const speech = `حجز مسبق لمحصول: ${crop.title}. موعد الجني التقديري هو ${crop.harvestDateEstimated}، متبقي ${crop.daysToHarvest} يوم. سعر الحجز المسبق هو ${crop.pricePerUnit} دينار جزائري لكل ${crop.unit}. تم حجز ${crop.preOrderedQuantity} ${crop.unit} بنسبة ${reservedPercent} بالمائة. المزرعة: ${crop.farmName} بولاية ${crop.wilaya}.`;
                          speakText(speech, crop.title);
                        }
                      }}
                      className={`w-full py-1.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition ${
                        isSpeaking && currentlySpeakingText?.includes(crop.title.substring(0, 15))
                          ? 'bg-amber-400 text-stone-950 shadow-md ring-2 ring-amber-300 animate-pulse'
                          : isAccessibleMode
                          ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-400 shadow-xs'
                          : 'bg-stone-50 hover:bg-amber-50 text-stone-700 hover:text-amber-950 border border-stone-200'
                      }`}
                      title="استمع لتفاصيل الحجز المسبق وتاريخ الجني بصوت واضح"
                    >
                      <Volume2 className={`w-4 h-4 shrink-0 ${
                        isSpeaking && currentlySpeakingText?.includes(crop.title.substring(0, 15))
                          ? 'animate-bounce text-stone-950'
                          : 'text-amber-600'
                      }`} />
                      <span>
                        {isSpeaking && currentlySpeakingText?.includes(crop.title.substring(0, 15))
                          ? 'جاري القراءة... (انقر للإيقاف)'
                          : 'استمع لموعد الجني والسعر 🔉'}
                      </span>
                    </button>

                    {/* Reservation Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-stone-600">
                        <span>نسبة الحجز المكتمل:</span>
                        <strong className="text-amber-800 font-mono">{reservedPercent}%</strong>
                      </div>
                      <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-200">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-amber-600 h-full transition-all duration-500"
                          style={{ width: `${reservedPercent}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[11px] text-stone-400">
                        <span>تم حجز {crop.preOrderedQuantity} {crop.unit}</span>
                        <span>متاح {crop.quantityAvailable - crop.preOrderedQuantity} {crop.unit}</span>
                      </div>
                    </div>

                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100 text-xs text-stone-700 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-stone-500">المزرعة:</span>
                        <span className="font-bold">{crop.farmName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">الولاية:</span>
                        <span className="font-bold">{crop.wilaya}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">الحد الأدنى للحجز:</span>
                        <span className="font-bold font-mono">{crop.minimumOrder} {crop.unit}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <div className="p-4 pt-0">
                  <button
                    onClick={() => onOpenPreOrder(crop)}
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <CalendarDays className="w-4 h-4" />
                    <span>تقديم إبداء رغبة الشراء (حجز مسبق)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Pre-orders & Activity Feed */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
        <h3 className="text-sm font-extrabold text-stone-900 mb-3 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-emerald-600" />
          <span>سجل طلبات الحجز المسبق النشطة في المنظومة ({preOrderRequests.length})</span>
        </h3>

        <div className="divide-y divide-stone-100">
          {preOrderRequests.map((req) => (
            <div key={req.id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <strong className="text-stone-900 font-bold">{req.buyerName}</strong>
                  <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                    {req.buyerType}
                  </span>
                  <span className="text-stone-400">• وجهة التسليم: {req.destinationWilaya}</span>
                </div>
                <p className="text-stone-600">
                  طلب حجز <strong>{req.quantity} وحدة</strong> من محصول <strong>{req.cropTitle}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="text-left font-mono font-bold text-stone-700 hidden sm:block">
                  {req.offeredPricePerUnit.toLocaleString()} دج / وحدة
                </div>
                
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {req.status}
                </span>

                <button
                  onClick={() => onOpenPaymentModal(req)}
                  className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black px-3 py-1.5 rounded-xl text-[11px] shadow-xs flex items-center gap-1.5 transition active:scale-95"
                  title="تأكيد العربون بنسبة 10% في حساب الضمان عبر البطاقة الذهبية أو CIB"
                >
                  <span>تأكيد العربون (Edahabia/CIB)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
