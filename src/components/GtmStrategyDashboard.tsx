import React, { useState } from 'react';
import { PilotRegionCluster, StrategicMoU } from '../types/agritech';
import { 
  Compass, 
  MapPin, 
  Award, 
  FileCheck2, 
  Building2, 
  CheckCircle2, 
  Send, 
  Smartphone, 
  QrCode, 
  Calendar, 
  TrendingUp, 
  Users, 
  Layers, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Check,
  Radio,
  FileSignature
} from 'lucide-react';

interface GtmStrategyDashboardProps {
  clusters: PilotRegionCluster[];
  mous: StrategicMoU[];
  onSelectClusterWilaya?: (wilaya: string) => void;
}

export const GtmStrategyDashboard: React.FC<GtmStrategyDashboardProps> = ({
  clusters,
  mous,
  onSelectClusterWilaya,
}) => {
  const [selectedClusterId, setSelectedClusterId] = useState<string>(clusters[0]?.id || 'cluster-1');
  const [filterMoUType, setFilterMoUType] = useState<string>('الكل');

  // Simulation State for Agricultural Chamber Farmer Registration & SMS push
  const [farmerRegName, setFarmerRegName] = useState<string>('');
  const [farmerRegPhone, setFarmerRegPhone] = useState<string>('');
  const [farmerRegCrop, setFarmerRegCrop] = useState<string>('زيتون وزيت بكر');
  const [isSimulatingSMS, setIsSimulatingSMS] = useState<boolean>(false);
  const [smsSuccessMessage, setSmsSuccessMessage] = useState<string | null>(null);

  const activeCluster = clusters.find(c => c.id === selectedClusterId) || clusters[0];

  const filteredMoUs = mous.filter(m => {
    if (filterMoUType === 'الكل') return true;
    return m.orgType === filterMoUType;
  });

  const handleSimulateChamberRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerRegName || !farmerRegPhone) {
      alert('يرجى إدخال اسم الفلاح ورقم الهاتف');
      return;
    }

    setIsSimulatingSMS(true);

    setTimeout(() => {
      setIsSimulatingSMS(false);
      setSmsSuccessMessage(
        `تم تسجيل الفلاح "${farmerRegName}" بنجاح وتوثيقه لدى ${activeCluster.institutionalPartner}، وتم إرسال رسالة ترحيبية SMS برابط بطاقة الفلاح الرقمية ورمز QR على الرقم ${farmerRegPhone}!`
      );
      setFarmerRegName('');
      setFarmerRegPhone('');
      setTimeout(() => setSmsSuccessMessage(null), 6000);
    }, 1200);
  };

  const handleBroadcastChamberSMS = () => {
    setSmsSuccessMessage(
      `تم إرسال بث رسائل نصية قصيرة SMS توعوية إلى ${activeCluster.enrolledFarmersCurrent} فلاحاً مسجلاً في ${activeCluster.clusterName} بالتنسيق مع ${activeCluster.institutionalPartner}.`
    );
    setTimeout(() => setSmsSuccessMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* GTM Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-emerald-900/60">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-800/80 border border-emerald-500/40 px-3.5 py-1 rounded-full text-xs font-bold text-emerald-200">
              <Compass className="w-4 h-4 text-emerald-300" />
              <span>استراتيجية وخطة العمل للإطلاق الميداني (GTM Strategy & Pilot Hubs)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              شبكة الولايات النموذجية والشراكات المؤسساتية الميدانية
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              تطبيق عملي مركز على 3 أقطاب جغرافية رائدة في الجزائر، يقوم على مذكرات تفاهم ملزمة مع المخابر الزراعية المعتمدة (INRAA/ITDAS) والغرف الفلاحية الولائية لضمان التدفق السلس، الفحص السريع، وتأمين سلاسل التوريد.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleBroadcastChamberSMS}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-2xl text-xs font-black shadow-md shadow-emerald-700/25 transition active:scale-95"
            >
              <Radio className="w-4 h-4 text-emerald-200 animate-pulse" />
              <span>بث حملة SMS الميدانية للفلاحين المكتتبين</span>
            </button>
          </div>
        </div>

        {/* Global Pilot KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-stone-800 text-xs">
          <div className="bg-white/5 backdrop-blur rounded-2xl p-3.5 border border-white/10">
            <span className="text-emerald-300 text-[11px] block font-semibold">الأقطاب النموذجية للإطلاق</span>
            <div className="text-lg font-black text-white font-mono mt-0.5">3 أقطاب استراتيجية</div>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-2xl p-3.5 border border-white/10">
            <span className="text-emerald-300 text-[11px] block font-semibold">الفلاحون المكتتبون ميدانياً</span>
            <div className="text-lg font-black text-white font-mono mt-0.5">1,480 فلاحاً موثقاً</div>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-2xl p-3.5 border border-white/10">
            <span className="text-emerald-300 text-[11px] block font-semibold">مذكرات التفاهم المبرمة (MoUs)</span>
            <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">{mous.length} اتفاقيات نافذة</div>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-2xl p-3.5 border border-white/10">
            <span className="text-emerald-300 text-[11px] block font-semibold">زمن الفحص المخبري وإصدار الـ QR</span>
            <div className="text-lg font-black text-amber-300 font-mono mt-0.5">&lt; 24 ساعة رقمياً</div>
          </div>
        </div>
      </div>

      {smsSuccessMessage && (
        <div className="bg-emerald-700 text-white p-4 rounded-2xl shadow-md text-xs font-bold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{smsSuccessMessage}</span>
          </div>
          <button 
            onClick={() => setSmsSuccessMessage(null)}
            className="text-white/80 hover:text-white underline text-[11px]"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* 1. The 3 Pilot Regional Clusters Interactive Explorer */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-700" />
              <span>الولايات النموذجية لشبكة الإطلاق الميداني (Pilot Clusters)</span>
            </h3>
            <p className="text-xs text-stone-500">
              تم اختيار الأقطاب بعناية وفق خصوصية المحصول وقنوات التوزيع المستهدفة
            </p>
          </div>
        </div>

        {/* Cluster Tabs Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {clusters.map((cluster) => {
            const isSelected = cluster.id === selectedClusterId;

            return (
              <div
                key={cluster.id}
                onClick={() => setSelectedClusterId(cluster.id)}
                className={`p-5 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white border-stone-200 hover:border-emerald-300 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      cluster.theme === 'olive-cereals'
                        ? 'bg-emerald-100 text-emerald-800'
                        : cluster.theme === 'dates-sahara'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-orange-100 text-orange-900'
                    }`}>
                      {cluster.focusPill}
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      جاهزية {cluster.readinessScore}%
                    </span>
                  </div>

                  <h4 className="font-black text-stone-900 text-sm leading-snug">
                    {cluster.clusterName}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1">
                    الولايات: <strong className="text-stone-800">{cluster.wilayas.join('، ')}</strong>
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {cluster.wilayas.map((wName, wIdx) => {
                      const cleanW = wName.split(' ')[0];
                      return (
                        <button
                          key={wIdx}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectClusterWilaya) {
                              onSelectClusterWilaya(cleanW);
                            }
                          }}
                          className="text-[10px] bg-stone-100 hover:bg-emerald-600 hover:text-white text-stone-700 font-bold px-2 py-0.5 rounded-md transition border border-stone-200"
                          title={`انقر لاستعراض مزارع ${cleanW}`}
                        >
                          📍 {cleanW}
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-xs text-stone-600 mt-2 line-clamp-3 leading-relaxed">
                    {cluster.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 space-y-2">
                  <div className="flex justify-between text-[11px] text-stone-600">
                    <span>الفلاحون المسجلون:</span>
                    <strong className="text-emerald-700 font-mono font-bold">
                      {cluster.enrolledFarmersCurrent} / {cluster.registeredFarmersTarget} فلاح
                    </strong>
                  </div>

                  <div className="flex justify-between text-[11px] text-stone-600">
                    <span>المساحة المفحوصة:</span>
                    <strong className="text-stone-800 font-mono font-bold">
                      {cluster.activeHectares.toLocaleString()} هكتار
                    </strong>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClusterId(cluster.id);
                        if (onSelectClusterWilaya) {
                          onSelectClusterWilaya(cluster.wilayas[0].split(' ')[0]);
                        }
                      }}
                      className="w-full py-2 bg-stone-100 hover:bg-emerald-700 hover:text-white text-stone-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                    >
                      <span>استعراض مزارع ومحاصيل هذا القطب</span>
                      <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cluster In-Depth Architecture Details Box */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-black text-stone-900">
                مخطط التشغيل والتنفيذ الميداني لـ: {activeCluster.clusterName}
              </h4>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-lg">
                Pôle Actif
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              الهدف الجوهري للقطب: <strong className="text-stone-800">{activeCluster.pilotGoal}</strong>
            </p>
          </div>

          <div className="text-left font-mono">
            <span className="text-xs text-stone-400 block">المساحة الجغرافية المستهدفة</span>
            <span className="text-base font-black text-emerald-800">
              {activeCluster.activeHectares.toLocaleString()} هكتار ممسوح
            </span>
          </div>
        </div>

        {/* 3 Pillars of this cluster */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {activeCluster.keyPillars.map((pillar, idx) => (
            <div key={idx} className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-1">
              <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                المحور التنفيذي {idx + 1}:
              </span>
              <p className="text-xs font-extrabold text-stone-800 leading-snug">
                {pillar}
              </p>
            </div>
          ))}
        </div>

        {/* Institutional Partners for this Cluster */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200 text-xs">
            <span className="text-emerald-900 font-bold block mb-1">
              المخبر الزراعي المعتمد للقطب (Lab Partner):
            </span>
            <div className="font-extrabold text-emerald-950 text-sm">
              {activeCluster.labPartner}
            </div>
            <span className="text-[11px] text-emerald-700 block mt-0.5">
              إصدار شهادات التحليل الإلكترونية برمز QR معتمد خلال 24 ساعة.
            </span>
          </div>

          <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200 text-xs">
            <span className="text-blue-900 font-bold block mb-1">
              الشريك المؤسساتي الميداني (Institutional Partner):
            </span>
            <div className="font-extrabold text-blue-950 text-sm">
              {activeCluster.institutionalPartner}
            </div>
            <span className="text-[11px] text-blue-700 block mt-0.5">
              تأطير المزارعين، التحقق من بطاقة الفلاح، وتفعيل التنبيهات المباشرة.
            </span>
          </div>
        </div>
      </div>

      {/* 2. Strategic Partnerships & MoUs Ledger (مذكرات التفاهم الميدانية) */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
              <FileSignature className="w-5 h-5 text-emerald-700" />
              <span>مذكرات التفاهم والشراكات الميدانية الموقعة (Strategic MoUs)</span>
            </h3>
            <p className="text-xs text-stone-500">
              اتفاقيات رسمية مع المخابر الزراعية والغرف الفلاحية لتبسيط إصدار شهادات الـ QR والتسجيل الميداني
            </p>
          </div>

          {/* Filter MoUs */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-bold text-stone-700">
            {['الكل', 'مخبر زراعي معتمد', 'غرفة فلاحية ولائية', 'معهد تقني وطني'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterMoUType(type)}
                className={`px-3 py-1 rounded-lg transition ${
                  filterMoUType === type ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-stone-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* MoU Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMoUs.map((mou) => (
            <div
              key={mou.id}
              className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-emerald-400 transition space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold bg-stone-200 text-stone-800 px-2 py-0.5 rounded">
                    {mou.orgType}
                  </span>
                  <h4 className="font-extrabold text-stone-900 text-sm mt-1.5">
                    {mou.organizationName}
                  </h4>
                  <span className="text-xs text-stone-500 font-semibold">
                    نطاق الولايات: {mou.wilayaScope}
                  </span>
                </div>

                <div className="text-left shrink-0">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full block">
                    {mou.status}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono block mt-1">
                    {mou.signedDate}
                  </span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1">
                <strong className="text-stone-900 block font-bold">موضوع الاتفاقية:</strong>
                <p className="text-emerald-900 font-semibold">{mou.scopeTitle}</p>
              </div>

              {/* Deliverables */}
              <div className="space-y-1 text-xs">
                <span className="text-[11px] font-bold text-stone-500 block">البنود والمخرجات التنفيذية:</span>
                {mou.keyDeliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-stone-600 text-[11px]">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Sign-off strip */}
              <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
                <span>المسؤول المعتمد: <strong>{mou.contactPerson}</strong></span>
                <span className="flex items-center gap-1 font-mono font-bold text-emerald-800">
                  <QrCode className="w-3.5 h-3.5" />
                  {mou.digitalQrApiStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Agricultural Chamber Registration & SMS Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Registration Form (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <span className="p-2 bg-blue-100 text-blue-800 rounded-xl">
              <Users className="w-5 h-5" />
            </span>
            <div>
              <h4 className="font-extrabold text-sm text-stone-900">
                تسجيل المزارعين الميداني مع الغرفة الفلاحية (CAW)
              </h4>
              <p className="text-[11px] text-stone-500">
                تسجيل الفلاح في منظومة Fllah.dz وتفعيل رمز QR وبث الرسائل النصية
              </p>
            </div>
          </div>

          <form onSubmit={handleSimulateChamberRegistration} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                الغرفة الفلاحية الولائية المشرفة:
              </label>
              <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800">
                {activeCluster.institutionalPartner}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                اسم الفلاح / التعاونية:
              </label>
              <input
                type="text"
                required
                placeholder="مثال: الحاج عمار بن ساسي"
                value={farmerRegName}
                onChange={(e) => setFarmerRegName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  رقم الهاتف (لتلقي الـ SMS):
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0550123456"
                  value={farmerRegPhone}
                  onChange={(e) => setFarmerRegPhone(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  المحصول الرئيسي:
                </label>
                <input
                  type="text"
                  required
                  value={farmerRegCrop}
                  onChange={(e) => setFarmerRegCrop(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSimulatingSMS}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-2"
            >
              {isSimulatingSMS ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>جاري تسجيل الفلاح وتوليد بطاقة QR...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تأكيد تسجيل الفلاح وإرسال SMS الترحيب والتنبيه</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Phased Action Plan & Roadmap (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <span className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <h4 className="font-extrabold text-sm text-stone-900">
                مراحل التنفيذ الميداني (Phased Action Plan)
              </h4>
              <p className="text-[11px] text-stone-500">
                جدول زمني تدريجي من الأقطاب النموذجية حتى التعميم الوطني الكامل
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {/* Phase 1 */}
            <div className="p-3.5 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-950">
                  المرحلة 1: تفعيل الأقطاب الثلاثة ومذكرات التفاهم (الأشهر 1 - 3)
                </span>
                <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                  المرحلة النشطة
                </span>
              </div>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                تركيز كامل على قطب ميلة، قسنطينة وجيجل (منتجات أشجار الزيتون، زيت الزيتون البكر الممتاز، الحبوب، الثوم والخضروات، الدواجن ودجاج عرب والأغنام)، بسكرة ووادي سوف (التمور والزراعة الصحراوية)، والبليدة ومتيجة (الحمضيات وسلاسل التوريد B2B)، مع تفعيل واجهات الربط البرمجي لمخابر INRAA/ITDAS والمخابر البيطرية لإصدار شهادات الـ QR في أقل من 24 ساعة.
              </p>
            </div>

            {/* Phase 2 */}
            <div className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-stone-900">
                  المرحلة 2: تعميم الدفع الإلكتروني وتوسيع شبكة B2B (الأشهر 4 - 6)
                </span>
                <span className="bg-stone-200 text-stone-700 font-bold text-[10px] px-2 py-0.5 rounded-full">
                  مجدولة
                </span>
              </div>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                تأكيد 100% من عربونات الحجز المسبق عبر البطاقة الذهبية و CIB في حساب الضمان المشترك (Escrow)، وتوسيع عقود التوريد إلى 150 مؤسسة فندقية ومصنع تحويل.
              </p>
            </div>

            {/* Phase 3 */}
            <div className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-stone-900">
                  المرحلة 3: التعميم الوطني عبر الـ 58 ولاية والتصدير (الأشهر 7 - 12)
                </span>
                <span className="bg-stone-200 text-stone-700 font-bold text-[10px] px-2 py-0.5 rounded-full">
                  مجدولة
                </span>
              </div>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                ربط موانئ التصدير وشبكات النقل اللوجستي الكبرى بالمنظومة، وإصدار شهادات التتبع الرقمي (Phytosanitary Traceability) المعتمدة دولياً.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
