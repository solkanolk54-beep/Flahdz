import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { Crop, PreOrderRequest } from '../types/agritech';
import { 
  X, 
  CalendarDays, 
  Clock, 
  Truck, 
  CheckCircle, 
  Sparkles, 
  ShieldCheck,
  Building,
  Utensils,
  Store,
  UserCheck,
  Volume2
} from 'lucide-react';

interface PreOrderModalProps {
  crop: Crop;
  onClose: () => void;
  onSubmit: (request: Omit<PreOrderRequest, 'id' | 'createdAt' | 'status'>) => void;
}

export const PreOrderModal: React.FC<PreOrderModalProps> = ({ crop, onClose, onSubmit }) => {
  const { speakText } = useAccessibility();
  const [buyerName, setBuyerName] = useState<string>('');
  const [buyerPhone, setBuyerPhone] = useState<string>('');
  const [buyerType, setBuyerType] = useState<PreOrderRequest['buyerType']>('مطعم / فندق');
  const [quantity, setQuantity] = useState<number>(crop.minimumOrder || 10);
  const [offeredPrice, setOfferedPrice] = useState<number>(crop.pricePerUnit);
  const [deliveryNeeded, setDeliveryNeeded] = useState<boolean>(true);
  const [destinationWilaya, setDestinationWilaya] = useState<string>('الجزائر العاصمة');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const totalPrice = quantity * offeredPrice;
  const deposit10 = Math.round(totalPrice * 0.10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone || quantity <= 0) {
      alert('يرجى ملء الاسم ورقم الهاتف والكمية المطلوبة.');
      return;
    }

    onSubmit({
      cropId: crop.id,
      cropTitle: crop.title,
      farmerName: crop.farmerName,
      buyerName,
      buyerPhone,
      buyerType,
      quantity,
      offeredPricePerUnit: offeredPrice,
      deliveryNeeded,
      destinationWilaya,
      notes,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preorder-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-700 to-amber-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-600/60 rounded-xl border border-amber-400/40" aria-hidden="true">
              <CalendarDays className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <h3 id="preorder-modal-title" className="font-extrabold text-base sm:text-lg">
                إبداء رغبة الشراء وحجز المحصول (Purchase Intent)
              </h3>
              <p className="text-xs text-amber-200">
                حجز مباشر قبل الجني • ربط لوجستي موحد
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                const speech = `إبداء رغبة الشراء وحجز المحصول المسبق. المحصول: ${crop.title} من المزرعة ${crop.farmName} في ${crop.wilaya}. الكمية المحددة: ${quantity} ${crop.unit}. السعر المقترح: ${offeredPrice} دينار جزائري للوحدة. إجمالي القيمة: ${totalPrice} دينار جزائري. قيمة العربون المالي المطلوب إيداعه في حساب الضمان إسكرو بنسبة 10 بالمائة هي ${deposit10} دينار جزائري.`;
                speakText(speech, 'ملخص طلب الحجز المسبق والعربون');
              }}
              className="p-1.5 rounded-full bg-amber-800 hover:bg-amber-700 text-amber-200 transition"
              title="الاستماع لتفاصيل الحجز المسبق والعربون المالي"
              aria-label="الاستماع لتفاصيل الحجز المسبق والعربون المالي"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition"
              aria-label="إغلاق النافذة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-black text-stone-900">
              تم تسجيل إبداء رغبتك بالحجز المسبق بنجاح!
            </h4>
            <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
              تم إشعار الفلاح <strong>{crop.farmerName}</strong> وسيقوم بالاتصال بك لتأكيد تفاصيل عقد التوريد وحجز الكمية من الحقل.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Selected Crop Summary */}
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 flex items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-extrabold text-stone-900 block truncate">
                  {crop.title}
                </span>
                <span className="text-stone-500 text-[11px]">
                  المزرعة: {crop.farmName} ({crop.wilaya})
                </span>
              </div>
              <div className="text-left font-mono shrink-0">
                <span className="font-bold text-amber-800 text-sm">
                  {crop.pricePerUnit.toLocaleString()} دج
                </span>
                <span className="text-stone-500 block text-[10px]">لكل {crop.unit}</span>
              </div>
            </div>

            {/* Buyer Type Selection */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                فئة المشتري:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {(['مطعم / فندق', 'تاجر جملة', 'مصنع تحويلي', 'مستهلك مباشر'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setBuyerType(type)}
                    className={`py-2 px-2 rounded-xl border text-center font-bold transition ${
                      buyerType === type
                        ? 'bg-amber-100 border-amber-600 text-amber-900'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  الاسم / اسم المؤسسة:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: مطعم الأوراس / شركة الهضاب"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  رقم الهاتف (للاتصال والتأكيد):
                </label>
                <input
                  type="tel"
                  required
                  placeholder="مثال: 0550123456"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Quantity and Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  الكمية المطلوبة ({crop.unit}):
                </label>
                <input
                  type="number"
                  min={crop.minimumOrder || 1}
                  max={crop.quantityAvailable}
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-[10px] text-stone-400 mt-0.5 block">
                  الحد الأدنى: {crop.minimumOrder} {crop.unit}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  السعر المقترح للوحدة (دج):
                </label>
                <input
                  type="number"
                  required
                  value={offeredPrice}
                  onChange={(e) => setOfferedPrice(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-[10px] text-stone-400 mt-0.5 block">
                  سعر المزرعة المرجعي: {crop.pricePerUnit} دج
                </span>
              </div>
            </div>

            {/* Logistics & Destination */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deliveryNeeded}
                  onChange={(e) => setDeliveryNeeded(e.target.checked)}
                  className="accent-amber-600 rounded"
                />
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                  أرغب في ربطي بشاحنة نقل مبردة / لوجستيات تابعة للمنظومة
                </span>
              </label>

              {deliveryNeeded && (
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    ولاية وجهة الاستلام:
                  </label>
                  <select
                    value={destinationWilaya}
                    onChange={(e) => setDestinationWilaya(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="الجزائر العاصمة">الجزائر العاصمة</option>
                    <option value="وهران">وهران</option>
                    <option value="قسنطينة">قسنطينة</option>
                    <option value="سطيف">سطيف</option>
                    <option value="عنابة">عنابة</option>
                    <option value="البليدة">البليدة</option>
                  </select>
                </div>
              )}
            </div>

            {/* Total Estimated Calculation & Escrow Deposit */}
            <div 
              className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 space-y-2"
              role="region"
              aria-label="الحساب المالي الإجمالي وعربون الضمان"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-700 block font-bold">القيمة الإجمالية التقديرية للطلبية:</span>
                  <span className="text-[11px] text-stone-500">مباشر من المزرعة بدون عمولة وسيط</span>
                </div>
                <div className="text-base font-black text-amber-950 font-mono" aria-label={`القيمة الإجمالية ${totalPrice} دينار جزائري`}>
                  {totalPrice.toLocaleString()} دج
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-amber-200/80 text-xs">
                <span className="text-amber-950 font-bold">عربون تأكيد الجدية في الضمان (Escrow 10%):</span>
                <span className="font-mono text-sm font-black text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded-md" aria-label={`قيمة العربون المودع في حساب الضمان ${deposit10} دينار جزائري`}>
                  {deposit10.toLocaleString()} دج
                </span>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black shadow-md transition"
              >
                تأكيد إبداء الرغبة بالشراء وإرسال الطلب للفلاح
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
