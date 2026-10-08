import React from 'react';
import { MarketPriceIndex, AgroWeatherInfo } from '../types/agritech';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  CloudSun, 
  Droplets, 
  Wind, 
  AlertTriangle, 
  Sparkles, 
  Calendar,
  Building2
} from 'lucide-react';

interface MarketTrendsProps {
  prices: MarketPriceIndex[];
  weatherAlerts: AgroWeatherInfo[];
}

export const MarketTrends: React.FC<MarketTrendsProps> = ({
  prices,
  weatherAlerts,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-amber-100 text-amber-800 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </span>
          <div>
            <h2 className="text-lg font-black text-stone-900">
              مؤشر أسعار أسواق الجملة والطقس الزراعي (Agro-Market & Meteo Index)
            </h2>
            <p className="text-xs text-stone-500">
              رصد يومي للأسعار المتداولة في أسواق الجملة الوطنية الكبرى (الحطاطبة، بوفاريك، شلغوم العيد، طولقة)
            </p>
          </div>
        </div>

        <div className="text-xs font-bold text-stone-500 bg-stone-100 px-3 py-1.5 rounded-xl">
          تحديث الأسعار: اليوم 06:00 صباحاً
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Wholesale Price Tracker (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>بورصة أسعار الجملة الوطنية اليومية</span>
            </h3>
            <span className="text-[11px] text-stone-400 font-mono">DZ-WHOLESALE-LIVE</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-stone-50 text-stone-500 font-bold border-b border-stone-100">
                  <th className="py-2.5 px-3">المحصول</th>
                  <th className="py-2.5 px-3">سوق الجملة المرجعي</th>
                  <th className="py-2.5 px-3">السعر اليوم</th>
                  <th className="py-2.5 px-3">التغير اليومي</th>
                  <th className="py-2.5 px-3">المؤشر</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {prices.map((p, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/70 transition">
                    <td className="py-3 px-3 font-bold text-stone-900">
                      {p.cropName}
                      <span className="block text-[10px] text-stone-400 font-normal">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-stone-600">
                      {p.wholesaleMarket}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-stone-900">
                      {p.todayPriceDzd} {p.unit}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold">
                      <span className={`inline-flex items-center gap-1 ${
                        p.changeRate > 0 
                          ? 'text-emerald-700' 
                          : p.changeRate < 0 
                          ? 'text-rose-700' 
                          : 'text-stone-500'
                      }`}>
                        {p.changeRate > 0 ? `+${p.changeRate}%` : `${p.changeRate}%`}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {p.trend === 'up' && (
                        <span className="bg-emerald-100 text-emerald-800 p-1 rounded-md inline-block">
                          <TrendingUp className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {p.trend === 'down' && (
                        <span className="bg-rose-100 text-rose-800 p-1 rounded-md inline-block">
                          <TrendingDown className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {p.trend === 'stable' && (
                        <span className="bg-stone-100 text-stone-600 p-1 rounded-md inline-block">
                          <Minus className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p>
              <strong>نصيحة المنظومة للفلاح:</strong> عند البيع المباشر عبر Fllah.dz يمكنك بيع منتجاتك بمتوسط أعلى بنسبة 15% من أسعار الجملة، مع بقاء السعر أقل بنسبة 20% للمشتري النهائي بسبب إلغاء عمولات الوسطاء المتراكمة.
            </p>
          </div>
        </div>

        {/* Agricultural Weather & Warnings (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
              <CloudSun className="w-4 h-4 text-amber-600" />
              <span>النشرة الجوية الزراعية والتنبيهات الميدانية</span>
            </h3>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              مراقبة آنية
            </span>
          </div>

          <div className="space-y-3">
            {weatherAlerts.map((w, idx) => (
              <div
                key={idx}
                className="bg-stone-50 rounded-xl p-3.5 border border-stone-200 space-y-2 hover:border-emerald-400 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <strong className="text-stone-900 text-xs font-extrabold">{w.wilaya}</strong>
                    <span className="text-[11px] text-stone-500 font-medium">({w.condition})</span>
                  </div>
                  <span className="text-base font-black text-stone-800 font-mono">
                    {w.temp}°C
                  </span>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-stone-500 font-mono">
                  <span className="flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-blue-500" />
                    رطوبة: {w.humidity}%
                  </span>
                  <span className="flex items-center gap-1">
                    <Wind className="w-3 h-3 text-stone-500" />
                    رياح: {w.windSpeed} كم/س
                  </span>
                </div>

                {/* Agro Advisory */}
                <div className="text-[11px] text-stone-700 bg-white p-2 rounded-lg border border-stone-100">
                  <span className="font-bold text-emerald-800 ml-1">توصية الحقل:</span>
                  {w.advisory}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
