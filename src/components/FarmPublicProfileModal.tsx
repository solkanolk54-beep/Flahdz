import React from 'react';
import { Farm, Crop } from '../types/agritech';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  Award, 
  PhoneCall, 
  MessageSquare, 
  Droplets, 
  Layers, 
  Mountain, 
  Sprout, 
  CheckCircle2, 
  FileCheck2, 
  Eye, 
  Settings, 
  Calendar, 
  QrCode, 
  Download, 
  ExternalLink,
  ChevronLeft,
  Share2,
  Clock,
  Sparkles
} from 'lucide-react';

interface FarmPublicProfileModalProps {
  farm: Farm;
  crops: Crop[];
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: (farm: Farm) => void;
  onOpenTraceability: (farm: Farm) => void;
  onOpenPreOrder: (crop: Crop) => void;
}

export const FarmPublicProfileModal: React.FC<FarmPublicProfileModalProps> = ({
  farm,
  crops,
  isOpen,
  onClose,
  onOpenSettings,
  onOpenTraceability,
  onOpenPreOrder
}) => {
  if (!isOpen) return null;

  const farmCrops = crops.filter(c => c.farmId === farm.id);

  // Default fallbacks for technical metrics if not provided
  const soilType = farm.soilType || 'طميية خصبة (Limoneux)';
  const soilPh = farm.soilPh || 7.2;
  const irrigationMethod = farm.irrigationMethod || 'ري قطرة قطرة ذكي (Goutte-à-goutte)';
  const waterSalinity = farm.waterSalinity !== undefined ? farm.waterSalinity : 0.35;
  const organicMatter = farm.organicMatterPercentage !== undefined ? farm.organicMatterPercentage : 3.2;
  const elevation = farm.elevationMeters || 420;
  const cardNumber = farm.farmerCardNumber || `DZ-AGRI-${farm.id.replace('farm-', '')}-2026`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/75 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[92vh]">
        {/* Top Cover Banner */}
        <div className="relative h-56 sm:h-64 bg-stone-900 overflow-hidden shrink-0">
          <img
            src={farm.coverImage}
            alt={farm.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/40 to-transparent"></div>

          {/* Close & Edit Settings Buttons */}
          <div className="absolute top-4 right-4 left-4 flex items-center justify-between">
            <span className="bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              الملف العام المعتمد • منصة Fllah.dz
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenSettings(farm)}
                className="bg-white/90 hover:bg-white text-stone-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-md transition flex items-center gap-1.5"
                title="تعديل المواصفات التقنية والمائية للمزرعة"
              >
                <Settings className="w-3.5 h-3.5 text-emerald-700" />
                <span>إدارة المعايير التقنية</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Farm Header Information in Cover */}
          <div className="absolute bottom-4 right-4 left-4 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="bg-emerald-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                توثيق {farm.badgeLevel} معتمد
              </span>
              <span className="bg-white/20 backdrop-blur-md text-stone-100 text-[11px] font-mono px-2 py-0.5 rounded-full">
                بطاقة الفلاح: {cardNumber}
              </span>
              <span className="bg-black/50 backdrop-blur-md text-amber-300 text-[11px] font-mono px-2 py-0.5 rounded-full">
                ★ {farm.rating} ({farm.reviewCount} تقييم)
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {farm.name}
            </h2>
            <p className="text-xs sm:text-sm text-stone-200 flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{farm.wilaya} • دائرة وبلدية {farm.commune}</span>
              <span className="text-stone-400">•</span>
              <span>المشرف الفلاحي: <strong>{farm.ownerName}</strong></span>
            </p>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Agronomic Technical Card (The Core Highlight) */}
          <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-950 rounded-2xl p-5 text-white shadow-md relative overflow-hidden border border-emerald-800">
            <div className="absolute -left-10 -bottom-10 w-44 h-44 rounded-full bg-emerald-700/20 blur-2xl pointer-events-none"></div>

            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-emerald-800/80">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-800/80 rounded-xl text-emerald-300">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white">
                    البطاقة التقنية للمزرعة والخصائص الزراعية الميدانية
                  </h3>
                  <p className="text-xs text-emerald-200">
                    مواصفات التربة الموثقة، مصادر مياه السقي، ونسب الملوحة والارتفاع
                  </p>
                </div>
              </div>

              <button
                onClick={() => onOpenSettings(farm)}
                className="text-xs text-emerald-300 hover:text-white font-bold flex items-center gap-1 bg-emerald-800/60 hover:bg-emerald-800 px-3 py-1 rounded-lg transition"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>تحديث المقاييس</span>
              </button>
            </div>

            {/* Technical 6-Cell Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-stone-100">
              {/* 1. Soil Texture */}
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 space-y-1">
                <div className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  قوام ونوع التربة
                </div>
                <div className="font-extrabold text-xs text-white leading-tight">
                  {soilType.split('(')[0]}
                </div>
                <div className="text-[10px] text-emerald-200 font-mono">
                  {soilType.includes('(') ? `(${soilType.split('(')[1]}` : ''}
                </div>
              </div>

              {/* 2. Soil pH */}
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 space-y-1">
                <div className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
                  <Sprout className="w-3.5 h-3.5" />
                  حموضة التربة (pH)
                </div>
                <div className="font-black text-sm text-emerald-300 font-mono">
                  {soilPh} pH
                </div>
                <div className="text-[10px] text-stone-300">
                  {soilPh >= 6.8 && soilPh <= 7.5 ? '✓ نطاق حيوي مثالي' : 'معدل ملائم'}
                </div>
              </div>

              {/* 3. Irrigation Method */}
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 space-y-1">
                <div className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-300" />
                  نظام السقي
                </div>
                <div className="font-extrabold text-xs text-white leading-tight">
                  {irrigationMethod.split('(')[0]}
                </div>
                <div className="text-[10px] text-blue-200">
                  كفاءة ترشيد عالية
                </div>
              </div>

              {/* 4. Water Salinity */}
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 space-y-1">
                <div className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-cyan-300" />
                  ملوحة مياه السقي
                </div>
                <div className="font-black text-sm text-cyan-200 font-mono">
                  {waterSalinity} غ/لتر
                </div>
                <div className="text-[10px] text-stone-300">
                  {waterSalinity <= 0.5 ? '✓ مياه عذبة نقية' : 'مياه معالجة ومطابقة'}
                </div>
              </div>

              {/* 5. Organic Matter */}
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 space-y-1">
                <div className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  المادة العضوية
                </div>
                <div className="font-black text-sm text-amber-200 font-mono">
                  {organicMatter}%
                </div>
                <div className="text-[10px] text-stone-300">
                  خصوبة تربة ممتازة
                </div>
              </div>

              {/* 6. Elevation & Parcel */}
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 space-y-1">
                <div className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
                  <Mountain className="w-3.5 h-3.5 text-emerald-300" />
                  الارتفاع والمساحة
                </div>
                <div className="font-black text-xs text-white font-mono">
                  {elevation}م • {farm.areaHectares} هكتار
                </div>
                <div className="text-[10px] text-emerald-200">
                  GIS مسح جوي دقيق
                </div>
              </div>
            </div>

            {/* Detailed Water Source text */}
            <div className="mt-3.5 pt-3 border-t border-emerald-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-emerald-200">
                <strong>مصدر الري الميداني:</strong> {farm.waterSource}
              </span>
              <span className="text-emerald-300 font-mono text-[11px]">
                نظام ري موثق ومسجل في قاعدة Fllah.dz
              </span>
            </div>
          </div>

          {/* Lab Certification Card */}
          {farm.labCertificate && (
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl shrink-0">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-stone-900">
                      شهادة الجودة والتحليل المخبري المعتمدة
                    </h4>
                    <span className="bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {farm.labCertificate.certNumber}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600">
                    صادرة عن: <strong>{farm.labCertificate.labName}</strong> بتاريخ {farm.labCertificate.issueDate}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-700 pt-1">
                    {farm.labCertificate.acidityLevel && (
                      <span className="bg-white px-2 py-0.5 rounded-lg border border-stone-200">
                        الحموضة: <strong className="text-emerald-700 font-mono">{farm.labCertificate.acidityLevel}</strong>
                      </span>
                    )}
                    <span className="bg-white px-2 py-0.5 rounded-lg border border-stone-200">
                      بقايا المبيدات: <strong className="text-emerald-700">{farm.labCertificate.pesticideResidue}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenTraceability(farm)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <Eye className="w-4 h-4" />
                <span>معاينة شهادة التتبع والـ QR الكاملة</span>
              </button>
            </div>
          )}

          {/* Farm Crops Catalog */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-700" />
                <h3 className="font-extrabold text-base text-stone-900">
                  محاصيل المزرعة المتاحة للطلب الفوري والحجز المسبق ({farmCrops.length})
                </h3>
              </div>
              <span className="text-xs text-stone-500">
                تسليم مباشر من الحقل دون وسطاء
              </span>
            </div>

            {farmCrops.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {farmCrops.map((crop) => (
                  <div
                    key={crop.id}
                    className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs hover:border-emerald-500 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-36 bg-stone-100 overflow-hidden">
                        <img
                          src={crop.image}
                          alt={crop.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          {crop.harvestStatus === 'حجز مسبق قبل الجني' ? (
                            <span className="bg-amber-500 text-stone-900 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              حجز مسبق • {crop.daysToHarvest} يوم للجني
                            </span>
                          ) : (
                            <span className="bg-emerald-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              جاهز للشحن الفوري
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-3.5 space-y-1.5">
                        <h4 className="font-extrabold text-xs text-stone-900 line-clamp-1">
                          {crop.title}
                        </h4>
                        <div className="text-[11px] text-stone-500">
                          الصنف: <strong>{crop.variety}</strong>
                        </div>
                        <div className="font-mono text-sm font-black text-emerald-800 pt-1">
                          {crop.pricePerUnit.toLocaleString()} دج / {crop.unit}
                        </div>
                        <div className="text-[10px] text-stone-500">
                          الكمية المتوفرة: {crop.quantityAvailable} {crop.unit}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 pt-0">
                      <button
                        onClick={() => onOpenPreOrder(crop)}
                        className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                      >
                        {crop.harvestStatus === 'حجز مسبق قبل الجني' ? 'حجز مسبق مع عربون' : 'طلب مباشر من الحقل'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-stone-50 rounded-2xl text-center text-xs text-stone-500 border border-stone-200">
                لا توجد محاصيل معروضة حالياً لهذه المزرعة.
              </div>
            )}
          </div>

          {/* Contact Direct Section */}
          <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h4 className="font-extrabold text-sm text-stone-900">
                التواصل المباشر مع صاحب المزرعة
              </h4>
              <p className="text-xs text-stone-600">
                المشرف: <strong>{farm.ownerName}</strong> • {farm.phone}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${farm.phone}`}
                className="flex items-center gap-1.5 px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-900 rounded-xl text-xs font-bold transition"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                <span>اتصال هاتفي</span>
              </a>

              <a
                href={`https://wa.me/${farm.whatsapp}?text=السلام عليكم، أنا مهتم بمنتجات ${farm.name} عبر منصة فلاّح تيك.`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>محادثة واتساب</span>
              </a>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-100 p-4 border-t border-stone-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-stone-500 font-mono">
            Fllah.dz Verified Farm Profile ID: {farm.id}
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold transition"
          >
            إغلاق الملف
          </button>
        </div>
      </div>
    </div>
  );
};
