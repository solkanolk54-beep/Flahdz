import React, { useState } from 'react';
import { Farm } from '../types/agritech';
import { 
  X, 
  Settings, 
  Save, 
  Sprout, 
  Droplets, 
  Layers, 
  Compass, 
  CheckCircle2, 
  FileText, 
  Building2, 
  ShieldCheck, 
  MapPin, 
  Mountain, 
  Award,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

interface FarmTechnicalSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  farms: Farm[];
  onUpdateFarm: (updatedFarm: Farm) => void;
  onViewFarmPublicProfile: (farm: Farm) => void;
}

export const FarmTechnicalSettingsModal: React.FC<FarmTechnicalSettingsModalProps> = ({
  isOpen,
  onClose,
  farms,
  onUpdateFarm,
  onViewFarmPublicProfile
}) => {
  const [selectedFarmId, setSelectedFarmId] = useState<string>(farms[0]?.id || 'farm-1');
  const currentFarm = farms.find(f => f.id === selectedFarmId) || farms[0];

  // Editable Form State
  const [soilType, setSoilType] = useState<Farm['soilType']>(currentFarm?.soilType || 'طميية خصبة (Limoneux)');
  const [soilPh, setSoilPh] = useState<number>(currentFarm?.soilPh || 7.2);
  const [irrigationMethod, setIrrigationMethod] = useState<Farm['irrigationMethod']>(currentFarm?.irrigationMethod || 'ري قطرة قطرة ذكي (Goutte-à-goutte)');
  const [waterSource, setWaterSource] = useState<string>(currentFarm?.waterSource || '');
  const [waterSalinity, setWaterSalinity] = useState<number>(currentFarm?.waterSalinity || 0.35);
  const [organicMatterPercentage, setOrganicMatterPercentage] = useState<number>(currentFarm?.organicMatterPercentage || 3.2);
  const [elevationMeters, setElevationMeters] = useState<number>(currentFarm?.elevationMeters || 420);
  const [farmerCardNumber, setFarmerCardNumber] = useState<string>(currentFarm?.farmerCardNumber || 'DZ-CARD-AGRI-43-9041');
  const [areaHectares, setAreaHectares] = useState<number>(currentFarm?.areaHectares || 24.5);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Sync state when selected farm changes
  const handleSelectFarm = (farmId: string) => {
    setSelectedFarmId(farmId);
    const target = farms.find(f => f.id === farmId);
    if (target) {
      setSoilType(target.soilType || 'طميية خصبة (Limoneux)');
      setSoilPh(target.soilPh || 7.2);
      setIrrigationMethod(target.irrigationMethod || 'ري قطرة قطرة ذكي (Goutte-à-goutte)');
      setWaterSource(target.waterSource || '');
      setWaterSalinity(target.waterSalinity || 0.35);
      setOrganicMatterPercentage(target.organicMatterPercentage || 3.0);
      setElevationMeters(target.elevationMeters || 350);
      setFarmerCardNumber(target.farmerCardNumber || 'DZ-CARD-AGRI-2026');
      setAreaHectares(target.areaHectares || 10);
      setSavedSuccess(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFarm) return;

    const updated: Farm = {
      ...currentFarm,
      soilType,
      soilPh,
      irrigationMethod,
      waterSource,
      waterSalinity,
      organicMatterPercentage,
      elevationMeters,
      farmerCardNumber,
      areaHectares
    };

    onUpdateFarm(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3500);
  };

  if (!isOpen || !currentFarm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-950 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-700/60 rounded-2xl border border-emerald-500/40">
              <Settings className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg">
                  إعدادات الحساب الفلاحي وإدارة المعايير التقنية للمزرعة
                </h3>
                <span className="bg-emerald-500/30 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/40 font-mono">
                  Agronomic GIS & Soil Hub
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">
                تحديث المواصفات الفنية للتربة ومصادر السقي لإبرازها في الملف التعريفي العام وربطها بعقود التوريد B2B
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Farm Selector (if multiple or switching context) */}
          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold text-stone-700">المزرعة المحددة للتعديل:</span>
            </div>
            <select
              value={selectedFarmId}
              onChange={(e) => handleSelectFarm(e.target.value)}
              className="bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-bold text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} — {f.wilaya} ({f.commune})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Notice Banner */}
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 space-y-1">
              <p className="font-bold">
                أهمية توثيق المعطيات التقنية (نوع التربة، درجة الحموضة pH، ومصادر الري):
              </p>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                تظهر هذه البيانات بشكل مرئي في بطاقة المزرعة العامة، والنافذة الجغرافية GIS، وفي عقود التوريد المؤسساتية B2B لمطابقة دفاتر الشروط الصارمة للفنادق، مصانع التحويل، والمطاعم الكبرى.
              </p>
            </div>
          </div>

          {/* Settings Form */}
          <form onSubmit={handleSave} className="space-y-6">
            {/* 1. Legal / Administrative Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <h4 className="text-sm font-extrabold text-stone-900">
                  1. الهوية والتوثيق الرسمي للمستثمرة
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    رقم بطاقة الفلاح أو السجل الفلاحي:
                  </label>
                  <input
                    type="text"
                    value={farmerCardNumber}
                    onChange={(e) => setFarmerCardNumber(e.target.value)}
                    required
                    placeholder="مثال: DZ-CARD-AGRI-19-8832"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">
                    صادرة عن الغرفة الفلاحية للولاية
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    المساحة الإجمالية للمستثمرة (هكتار):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    value={areaHectares}
                    onChange={(e) => setAreaHectares(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">
                    مساحة القطع الممسوحة جغرافياً
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    الارتفاع عن سطح البحر (Elevation):
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={elevationMeters}
                      onChange={(e) => setElevationMeters(parseInt(e.target.value) || 0)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                    <span className="absolute left-3 top-2 text-xs font-bold text-stone-400">
                      متر
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-500 mt-0.5 block">
                    يحدد جودة زيت الزيتون ودرجة حلاوة الثمار
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Soil Agronomic Profile */}
            <div className="pt-2 border-t border-stone-200">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-amber-700" />
                <h4 className="text-sm font-extrabold text-stone-900">
                  2. التركيبة التقنية للتربة والخصوبة (Soil Agronomic Profile)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    نوع وقوام التربة (Soil Texture):
                  </label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value as Farm['soilType'])}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="طميية خصبة (Limoneux)">طميية خصبة (Limoneux)</option>
                    <option value="طينية ثقيلة (Argileux)">طينية ثقيلة (Argileux)</option>
                    <option value="رملية خفيفة (Sableux)">رملية خفيفة (Sableux)</option>
                    <option value="كلسية بركانية (Calcaire)">كلسية بركانية (Calcaire)</option>
                    <option value="مزيج طميي رملي (Sablonneux)">مزيج طميي رملي (Sablonneux)</option>
                  </select>
                  <span className="text-[10px] text-stone-500 mt-0.5 block">
                    التحليل النسيجي الميداني
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    درجة حموضة التربة (pH Soil):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="4.0"
                    max="9.0"
                    value={soilPh}
                    onChange={(e) => setSoilPh(parseFloat(e.target.value) || 7.0)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                  <div className="flex items-center justify-between text-[10px] text-stone-500 mt-0.5">
                    <span>حمضية (&lt;6.5)</span>
                    <span className="font-bold text-emerald-700">مثالية (6.8 - 7.5)</span>
                    <span>قلوية (&gt;7.8)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    نسبة المادة العضوية (Matière Organique %):
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      max="10.0"
                      value={organicMatterPercentage}
                      onChange={(e) => setOrganicMatterPercentage(parseFloat(e.target.value) || 2.5)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                    <span className="absolute left-3 top-2 text-xs font-bold text-stone-400">
                      %
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-500 mt-0.5 block">
                    مؤشر حيوية التربة وخصوبتها الحيوية
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Water Source & Irrigation System */}
            <div className="pt-2 border-t border-stone-200">
              <div className="flex items-center gap-2 mb-3">
                <Droplets className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-extrabold text-stone-900">
                  3. مصادر المياه ونظام السقي المعتمد (Irrigation & Water Quality)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    نظام وطريقة الري الفلاحي:
                  </label>
                  <select
                    value={irrigationMethod}
                    onChange={(e) => setIrrigationMethod(e.target.value as Farm['irrigationMethod'])}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="ري قطرة قطرة ذكي (Goutte-à-goutte)">ري قطرة قطرة ذكي (Goutte-à-goutte)</option>
                    <option value="رش محوري بالطاقة الشمسية (Pivot)">رش محوري بالطاقة الشمسية (Pivot)</option>
                    <option value="سواقي تقليدية فلاحية">سواقي تقليدية فلاحية</option>
                    <option value="ري انسيابي بالراحة">ري انسيابي بالراحة</option>
                  </select>
                  <span className="text-[10px] text-stone-500 mt-0.5 block">
                    الترشيد المائي وكفاءة الاستهلاك
                  </span>
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    مصدر مياه الري والعمق:
                  </label>
                  <input
                    type="text"
                    value={waterSource}
                    onChange={(e) => setWaterSource(e.target.value)}
                    required
                    placeholder="مثال: بئر جوفي عميق طبيعي (ملوحة 0.35 غ/لتر)"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">
                    سد، بئر ارتوازي، ساقية، أو ينابيع جبلية
                  </span>
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    نسبة الملوحة في ماء الري (Salinité g/L):
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0.05"
                      max="5.0"
                      value={waterSalinity}
                      onChange={(e) => setWaterSalinity(parseFloat(e.target.value) || 0.4)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-stone-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                    <span className="absolute left-3 top-2 text-xs font-bold text-stone-400">
                      غ/لتر
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-500 mt-0.5 block">
                    المعدل القياسي العذب: أقل من 0.60 غ/لتر
                  </span>
                </div>
              </div>
            </div>

            {/* Success notification */}
            {savedSuccess && (
              <div className="p-3.5 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-900 flex items-center justify-between gap-3 text-xs font-bold animate-fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <span>
                    تم حفظ وتحديث المعايير التقنية للمزرعة بنجاح! تم عكس البيانات في ملف المزرعة العام وخرائط GIS.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onViewFarmPublicProfile(currentFarm)}
                  className="px-3 py-1 bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 transition flex items-center gap-1 shrink-0"
                >
                  <span>معاينة الملف العام</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Actions Bar */}
            <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onViewFarmPublicProfile(currentFarm)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition"
              >
                <ExternalLink className="w-4 h-4 text-stone-600" />
                <span>معاينة الملف التعريفي العام للمزرعة</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white rounded-xl text-xs font-extrabold shadow-sm shadow-emerald-700/30 transition"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ التعديلات التقنية للمزرعة</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
