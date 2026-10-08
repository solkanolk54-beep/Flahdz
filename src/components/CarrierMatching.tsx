import React, { useState } from 'react';
import { Carrier } from '../types/agritech';
import { 
  Truck, 
  MapPin, 
  Calculator, 
  PhoneCall, 
  ShieldCheck, 
  ThermometerSnowflake, 
  ArrowLeftRight, 
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface CarrierMatchingProps {
  carriers: Carrier[];
}

// Distance matrix approximation between key Algerian agricultural wilayas (in KM)
const DISTANCE_MATRIX: Record<string, Record<string, number>> = {
  'البليدة': { 'الجزائر العاصمة': 45, 'وهران': 390, 'قسنطينة': 410, 'سطيف': 300, 'عنابة': 560, 'بسكرة': 420 },
  'ميلة': { 'الجزائر العاصمة': 370, 'قسنطينة': 55, 'سطيف': 95, 'عنابة': 180, 'وهران': 740, 'بسكرة': 240 },
  'بسكرة': { 'الجزائر العاصمة': 430, 'قسنطينة': 230, 'سطيف': 220, 'وهران': 780, 'باتنة': 115, 'الوادي': 220 },
  'معسكر': { 'وهران': 95, 'الجزائر العاصمة': 360, 'مستغانم': 75, 'سيدي بلعباس': 80, 'قسنطينة': 750 },
  'وادي سوف': { 'الجزائر العاصمة': 620, 'قسنطينة': 380, 'بسكرة': 220, 'ورقلة': 230, 'سطيف': 440 },
};

export const CarrierMatching: React.FC<CarrierMatchingProps> = ({ carriers }) => {
  const [originWilaya, setOriginWilaya] = useState<string>('ميلة');
  const [destCity, setDestCity] = useState<string>('الجزائر العاصمة');
  const [cargoTons, setCargoTons] = useState<number>(10);
  const [requireCooling, setRequireCooling] = useState<boolean>(true);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  // Calculate distance
  const baseOrigin = Object.keys(DISTANCE_MATRIX).find(k => originWilaya.includes(k)) || 'ميلة';
  const estimatedKm = DISTANCE_MATRIX[baseOrigin]?.[destCity] || 350;

  // Filter matching carriers
  const filteredCarriers = carriers.filter(c => {
    if (requireCooling && !c.vehicleType.includes('Frigo')) {
      return false;
    }
    return true;
  });

  const handleBookCarrier = (carrier: Carrier) => {
    setBookingSuccess(`تم إرسال طلب الشحن بنجاح إلى السائق: ${carrier.driverName}. سيتصل بك لتأكيد موعد التحميل.`);
    setTimeout(() => setBookingSuccess(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Header and Value Proposition */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-blue-100 text-blue-800 rounded-xl">
              <Truck className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-lg font-black text-stone-900">
                شبكة مطابقة الناقلين وسلسلة التبريد (Carrier Matching Logistics)
              </h2>
              <p className="text-xs text-stone-500">
                ربط مباشر بين المزارع والمطاعم/الأسواق مع أصحاب الشاحنات المبردة والعادية لحساب التكلفة الفورية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300">
              سلسلة تبريد معتمدة
            </span>
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
              شاحنات مرخصة
            </span>
          </div>
        </div>
      </div>

      {bookingSuccess && (
        <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-md flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{bookingSuccess}</span>
          </div>
          <button 
            onClick={() => setBookingSuccess(null)}
            className="text-white/80 hover:text-white text-xs underline"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Logistics Cost Estimator Tool */}
      <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-2xl p-5 sm:p-6 text-white shadow-md">
        <div className="flex items-center gap-2 mb-4 text-emerald-400 font-bold text-sm">
          <Calculator className="w-4 h-4" />
          <span>حاسبة تكلفة الشحن التقديرية (Logistics Freight Calculator)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Origin */}
          <div>
            <label className="block text-xs text-stone-300 mb-1 font-semibold">
              نقطة التحميل (ولاية المزرعة):
            </label>
            <select
              value={originWilaya}
              onChange={(e) => setOriginWilaya(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ميلة">ميلة (Mila) - شلغوم العيد</option>
              <option value="بسكرة">بسكرة (Biskra) - طولقة</option>
              <option value="معسكر">معسكر (Mascara) - سيڨ</option>
              <option value="البليدة">البليدة (Blida) - متيجة</option>
              <option value="وادي سوف">وادي سوف (El Oued) - قمار</option>
            </select>
          </div>

          {/* Destination */}
          <div>
            <label className="block text-xs text-stone-300 mb-1 font-semibold">
              وجهة التسليم (السوق / المشتري):
            </label>
            <select
              value={destCity}
              onChange={(e) => setDestCity(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="الجزائر العاصمة">الجزائر العاصمة (سوق الكاليتوس / فنادق)</option>
              <option value="وهران">وهران (سوق الجملة الكرمة)</option>
              <option value="قسنطينة">قسنطينة (سوق الخروب)</option>
              <option value="سطيف">سطيف (سوق الجملة عين أرنات)</option>
              <option value="عنابة">عنابة (سوق الجملة سيدي عمار)</option>
            </select>
          </div>

          {/* Weight */}
          <div>
            <label className="block text-xs text-stone-300 mb-1 font-semibold">
              الوزن التقديري (بالأطنان):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="30"
                value={cargoTons}
                onChange={(e) => setCargoTons(Number(e.target.value))}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-xs text-stone-400">طن</span>
            </div>
          </div>

          {/* Cooling Requirement */}
          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 bg-stone-800/80 p-2.5 rounded-xl border border-stone-700 cursor-pointer hover:bg-stone-800">
              <input
                type="checkbox"
                checked={requireCooling}
                onChange={(e) => setRequireCooling(e.target.checked)}
                className="accent-emerald-500 rounded"
              />
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                <ThermometerSnowflake className="w-3.5 h-3.5" />
                شاحنة تبريد Frigo إلزامية
              </span>
            </label>
          </div>
        </div>

        {/* Calculation Result strip */}
        <div className="mt-5 pt-4 border-t border-stone-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center sm:text-right">
          <div className="bg-stone-800/60 p-3 rounded-xl border border-stone-700">
            <span className="text-[11px] text-stone-400">المسافة التقديرية بالمسار السريع:</span>
            <div className="text-lg font-black text-white font-mono mt-0.5">
              ~ {estimatedKm} كم
            </div>
          </div>

          <div className="bg-stone-800/60 p-3 rounded-xl border border-stone-700">
            <span className="text-[11px] text-stone-400">زمن التوصيل الميداني المتوقع:</span>
            <div className="text-lg font-black text-white font-mono mt-0.5">
              {Math.round(estimatedKm / 65)} ساعات
            </div>
          </div>

          <div className="bg-emerald-950/80 p-3 rounded-xl border border-emerald-800/80 text-emerald-200">
            <span className="text-[11px] text-emerald-300 font-bold">التكلفة التقديرية الموصى بها:</span>
            <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">
              {Math.round(estimatedKm * (requireCooling ? 170 : 130)).toLocaleString()} دج
            </div>
          </div>
        </div>
      </div>

      {/* Available Verified Carriers Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-extrabold text-stone-900">
            السائقون والشاحنات المتاحة الآن للتحميل المباشر ({filteredCarriers.length})
          </h3>
          <span className="text-xs text-stone-500">
            الأسعار تخضع للتفاوض المباشر بدون عمولة
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCarriers.map((carrier) => (
            <div
              key={carrier.id}
              className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-emerald-500 transition space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-stone-900 text-sm">
                        {carrier.driverName}
                      </h4>
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                        {carrier.badge}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">
                      {carrier.companyName || 'سائق ناقل حر'} • قاعدة الانطلاق: {carrier.wilayaBase}
                    </p>
                  </div>
                </div>

                <div className="text-left">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    carrier.isAvailable 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-stone-100 text-stone-500'
                  }`}>
                    {carrier.isAvailable ? 'متاح للتحميل' : 'في مهمة حالية'}
                  </span>
                </div>
              </div>

              {/* Carrier Vehicle Specs */}
              <div className="grid grid-cols-3 gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100 text-center text-xs">
                <div>
                  <div className="text-[10px] text-stone-500">نوع الشاحنة</div>
                  <strong className="text-stone-800 font-bold block truncate">
                    {carrier.vehicleType}
                  </strong>
                </div>
                <div>
                  <div className="text-[10px] text-stone-500">الحمولة القصوى</div>
                  <strong className="text-emerald-700 font-mono font-bold block">
                    {carrier.capacityTons} طن
                  </strong>
                </div>
                <div>
                  <div className="text-[10px] text-stone-500">التسعيرة المرجعية</div>
                  <strong className="text-stone-800 font-mono font-bold block">
                    {carrier.ratePerKmDzd} دج/كم
                  </strong>
                </div>
              </div>

              {carrier.coolingTempRange && (
                <div className="text-[11px] bg-blue-50/80 border border-blue-200 text-blue-900 p-2 rounded-lg flex items-center gap-1.5">
                  <ThermometerSnowflake className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>سلسلة التبريد: <strong>{carrier.coolingTempRange}</strong></span>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                <button
                  onClick={() => handleBookCarrier(carrier)}
                  disabled={!carrier.isAvailable}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                    carrier.isAvailable
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>طلب حجز الشاحنة</span>
                </button>

                <a
                  href={`tel:${carrier.phone}`}
                  className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                  <span>اتصال بالسائق</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
