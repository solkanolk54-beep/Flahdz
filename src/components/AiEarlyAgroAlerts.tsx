import React, { useState } from 'react';
import { AgroAiAlert, AgroWeatherInfo } from '../types/agritech';
import { 
  Sparkles, 
  AlertTriangle, 
  Droplets, 
  Wind, 
  ThermometerSnowflake, 
  Send, 
  ShieldAlert, 
  CheckCircle2, 
  Radio, 
  Calendar,
  CloudSun,
  Layers,
  ArrowRight
} from 'lucide-react';

interface AiEarlyAgroAlertsProps {
  alerts: AgroAiAlert[];
  weatherInfo: AgroWeatherInfo[];
}

export const AiEarlyAgroAlerts: React.FC<AiEarlyAgroAlertsProps> = ({
  alerts: initialAlerts,
  weatherInfo,
}) => {
  const [alerts, setAlerts] = useState<AgroAiAlert[]>(initialAlerts);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('الكل');
  
  // Interactive Diagnostic Console State
  const [customWilaya, setCustomWilaya] = useState<string>('البليدة (Blida)');
  const [customCrop, setCustomCrop] = useState<string>('حمضيات وبرتقال');
  const [observedIssue, setObservedIssue] = useState<string>('انخفاض درجات الحرارة فجراً مع رياح خفيفة');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [broadcastSentNotice, setBroadcastSentNotice] = useState<string | null>(null);

  const filteredAlerts = alerts.filter(a => {
    if (selectedSeverity === 'الكل') return true;
    return a.severity === selectedSeverity;
  });

  const handleRunAiDiagnostic = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);

      const newAlert: AgroAiAlert = {
        id: `ai-alert-${Date.now()}`,
        wilaya: customWilaya,
        targetCrops: [customCrop],
        alertType: customCrop.includes('حمضيات') ? 'حماية طارئة من الصقيع' : 'ري وقائي استباقي',
        severity: 'حرج',
        title: `تنبيه ذكاء اصطناعي فوري: خطة استباقية لـ ${customCrop} في ${customWilaya}`,
        advisoryText: `استناداً إلى معطيات الطقس الزراعي والملاحظات الميدانية (${observedIssue})، يقترح النموذج تشغيل نظام الحماية الوقائية فوراً لتفادي احتراق البراعم وسقوط الثمار.`,
        actionPlan: [
          'تنفيذ ري ترطيب خفيف قبل الفجر لرفع السعة الحرارية للتربة.',
          'استخدام أجهزة قياس الرطوبة في مستوى 30 سم لتعديل برامج التسميد.',
          'تفعيل التنبيه العاجل للفلاحين المكتتبين في المحيط الجغرافي عبر الرسائل النصية القصيرة.'
        ],
        tempCelsius: 3.2,
        humidityPercent: 86,
        broadcastDate: 'الآن (محدث بالذكاء الاصطناعي)',
        sentCountFarmers: Math.floor(250 + Math.random() * 400)
      };

      setAlerts(prev => [newAlert, ...prev]);
      setBroadcastSentNotice(`تم إرسال التنبيه الاستباقي بنجاح إلى ${newAlert.sentCountFarmers} فلاحاً مسجلاً في ولاية ${customWilaya}!`);
      setTimeout(() => setBroadcastSentNotice(null), 5000);
    }, 1200);
  };

  const handleSimulateSmsBroadcast = (alert: AgroAiAlert) => {
    setBroadcastSentNotice(`تمت إعادة بث الرسالة النصية العاجلة إلى ${alert.sentCountFarmers} فلاحاً في ${alert.wilaya}.`);
    setTimeout(() => setBroadcastSentNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top AI Agro Radar Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-900 rounded-3xl p-6 sm:p-7 text-white shadow-lg border border-emerald-900/60">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-800/80 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold text-emerald-200">
              <Sparkles className="w-4 h-4 text-emerald-300 animate-spin" />
              <span>نظام الإنذار المبكر والذكاء الاصطناعي الزراعي (AI Agro-Alerts)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              تنبيهات استباقية بالري الوقائي، مكافحة الصقيع، وإجهاد المحاصيل
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
              تقاطع بيانات الأرصاد الجوية الفلاحية مع النماذج التنبؤية لإرسال إرشادات فورية ورسائل SMS وقائية لكبار وصغار الفلاحين قبل وقوع الكوارث المناخية وتلف المحاصيل.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-400/30 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>رصد آني لـ 58 ولاية</span>
            </span>
          </div>
        </div>

        {/* Global Live Alert Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-emerald-900/80 text-xs">
          <div className="bg-white/5 backdrop-blur p-3 rounded-2xl border border-white/10">
            <span className="text-emerald-200 text-[11px] block">الفلاحون المكتتبون في التنبيهات</span>
            <strong className="text-base text-white font-mono font-black mt-0.5 block">12,450 فلاح</strong>
          </div>
          <div className="bg-white/5 backdrop-blur p-3 rounded-2xl border border-white/10">
            <span className="text-emerald-200 text-[11px] block">تنبيهات حرجة مبكرة اليوم</span>
            <strong className="text-base text-amber-300 font-mono font-black mt-0.5 block">{alerts.length} تنبيهات نشطة</strong>
          </div>
          <div className="bg-white/5 backdrop-blur p-3 rounded-2xl border border-white/10">
            <span className="text-emerald-200 text-[11px] block">نسبة خفض الخسائر بالري الوقائي</span>
            <strong className="text-base text-emerald-400 font-mono font-black mt-0.5 block">حتى 40% حماية</strong>
          </div>
          <div className="bg-white/5 backdrop-blur p-3 rounded-2xl border border-white/10">
            <span className="text-emerald-200 text-[11px] block">متوسط زمن الاستجابة</span>
            <strong className="text-base text-white font-mono font-black mt-0.5 block">&lt; 15 دقيقة SMS</strong>
          </div>
        </div>
      </div>

      {broadcastSentNotice && (
        <div className="bg-emerald-700 text-white p-3.5 rounded-2xl shadow-md text-xs font-bold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{broadcastSentNotice}</span>
          </div>
          <button 
            onClick={() => setBroadcastSentNotice(null)}
            className="text-white/80 hover:text-white underline text-[11px]"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Main Grid: Interactive Diagnostic Tool + Live Alerts Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive AI Diagnostic Console (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-sm text-stone-900">
                أداة التحليل والاستشارة الوقائية بالذكاء الاصطناعي
              </h3>
              <p className="text-[11px] text-stone-500">
                حدد منطقتك ومحصولك لتوليد خطة حماية استباقية فلكية
              </p>
            </div>
          </div>

          <form onSubmit={handleRunAiDiagnostic} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                الولاية والمنطقة الزراعية:
              </label>
              <select
                value={customWilaya}
                onChange={(e) => setCustomWilaya(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="البليدة (Blida)">البليدة (Blida) - سهل متيجة وبوفاريك</option>
                <option value="وادي سوف (El Oued)">وادي سوف (El Oued) - قمار والرقيبة</option>
                <option value="ميلة (Mila)">ميلة (Mila) - شلغوم العيد والتلاغمة</option>
                <option value="بسكرة (Biskra)">بسكرة (Biskra) - طولقة وسيدي عقبة</option>
                <option value="معسكر (Mascara)">معسكر (Mascara) - سهول سيڨ</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                المحصول الفلاحي المستهدف:
              </label>
              <input
                type="text"
                required
                value={customCrop}
                onChange={(e) => setCustomCrop(e.target.value)}
                placeholder="مثال: حمضيات وبرتقال، بطاطا صحراوية، زيتون، تمور..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                الحالة الجوية الملاحظة أو التوقع:
              </label>
              <textarea
                rows={3}
                required
                value={observedIssue}
                onChange={(e) => setObservedIssue(e.target.value)}
                placeholder="اكتب التغيرات الجوية الملاحظة (مثال: برودة قارسة فجراً، رياح ساخنة، رطوبة عالية مع سكون الهواء...)"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-emerald-200" />
                  <span>جاري تحليل البيانات وإعداد خطة الحماية...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>توليد التنبيه الاستباقي وإرسال إشعار SMS</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Info Box */}
          <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-100 text-[11px] text-stone-600 space-y-1">
            <span className="font-bold text-stone-800 block">كيف تعمل التنبيهات المبكرة؟</span>
            <p>
              يتم استشعار حرارة نقطة الندى (Dew Point) وسرعة الرياح لتقدير توقيت تشكل الصقيع قبل 12 ساعة، ما يمنح الفلاح وقتاً كافياً لتشغيل الرشاشات أو التغطية.
            </p>
          </div>
        </div>

        {/* Live Alerts Stream (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>التنبيهات الزراعية الاستباقية النشطة ({filteredAlerts.length})</span>
            </h3>

            {/* Severity filter */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-bold text-stone-700">
              {['الكل', 'حرج', 'تحذير', 'إرشاد وتوجيه'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSelectedSeverity(sev)}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    selectedSeverity === sev ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-stone-900'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Alert Cards */}
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs hover:border-emerald-400 transition space-y-4"
              >
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        alert.severity === 'حرج'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : alert.severity === 'تحذير'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg">
                        {alert.alertType}
                      </span>
                      <span className="text-stone-400 text-xs font-mono">
                        {alert.broadcastDate}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-stone-900 text-sm sm:text-base mt-2">
                      {alert.title}
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      المنطقة: <strong>{alert.wilaya}</strong> • المحاصيل المستهدفة: {alert.targetCrops.join('، ')}
                    </p>
                  </div>

                  <div className="text-left font-mono shrink-0 bg-stone-50 p-2 rounded-xl border border-stone-100">
                    <span className="text-xs font-black text-stone-900 block">{alert.tempCelsius}°C</span>
                    <span className="text-[10px] text-stone-500">رطوبة: {alert.humidityPercent}%</span>
                  </div>
                </div>

                {/* Advisory Narrative */}
                <p className="text-xs text-stone-700 leading-relaxed bg-stone-50/70 p-3.5 rounded-2xl border border-stone-100">
                  {alert.advisoryText}
                </p>

                {/* Action Plan Bullets */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-stone-900 block">
                    خطة التدخل والتدابير الوقائية الموصى بها:
                  </span>
                  <div className="space-y-1">
                    {alert.actionPlan.map((action, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-stone-700 bg-emerald-50/40 p-2 rounded-xl border border-emerald-100">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dispatch Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs">
                  <div className="flex items-center gap-1.5 text-stone-500">
                    <Radio className="w-3.5 h-3.5 text-emerald-600" />
                    <span>تم إشعار <strong>{alert.sentCountFarmers} فلاحاً</strong> في هذه الولاية عبر SMS</span>
                  </div>

                  <button
                    onClick={() => handleSimulateSmsBroadcast(alert)}
                    className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 px-3 py-1.5 rounded-xl font-bold transition text-xs"
                  >
                    <Send className="w-3 h-3 text-emerald-700" />
                    <span>إعادة إرسال SMS عاجل</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
