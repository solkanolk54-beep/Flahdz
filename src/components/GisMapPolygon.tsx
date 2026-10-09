import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { Farm, Crop } from '../types/agritech';
import { 
  MapPin, 
  Layers, 
  Compass, 
  Eye, 
  CheckCircle2, 
  PhoneCall, 
  MessageSquare, 
  Sliders, 
  Maximize2, 
  ShieldCheck, 
  FileText,
  Filter,
  Sparkles,
  Volume2,
  Settings,
  Droplets,
  Sprout
} from 'lucide-react';

interface GisMapPolygonProps {
  farms: Farm[];
  crops: Crop[];
  selectedWilaya: string;
  setSelectedWilaya: (w: string) => void;
  onSelectFarm: (farm: Farm) => void;
  onOpenTraceability: (farm: Farm) => void;
  onOpenPreOrder: (crop: Crop) => void;
  onOpenFarmProfile?: (farm: Farm) => void;
  onOpenFarmSettings?: (farm: Farm) => void;
}

export const GisMapPolygon: React.FC<GisMapPolygonProps> = ({
  farms,
  crops,
  selectedWilaya,
  setSelectedWilaya,
  onSelectFarm,
  onOpenTraceability,
  onOpenPreOrder,
  onOpenFarmProfile,
  onOpenFarmSettings,
}) => {
  const { isAccessibleMode, speakText, isSpeaking, stopSpeaking, currentlySpeakingText } = useAccessibility();
  const [selectedFarmId, setSelectedFarmId] = useState<string>(farms[0]?.id || 'farm-1');
  const [radiusKm, setRadiusKm] = useState<number>(50);
  const [cropTypeFilter, setCropTypeFilter] = useState<string>('all');
  const [mapMode, setMapMode] = useState<'polygon' | 'satellite' | 'heatmap'>('polygon');

  const activeFarm = farms.find(f => f.id === selectedFarmId) || farms[0];
  const activeFarmCrops = crops.filter(c => c.farmId === activeFarm?.id);

  // Filter farms by Wilaya and Crop Type
  const filteredFarms = farms.filter(f => {
    const matchesWilaya = selectedWilaya === 'الكل' || f.wilaya.includes(selectedWilaya) || selectedWilaya.includes(f.wilaya.split(' ')[0]);
    const matchesCrop = cropTypeFilter === 'all' || f.mainCrops.some(c => c.includes(cropTypeFilter));
    return matchesWilaya && matchesCrop;
  });

  return (
    <div className="space-y-6">
      {/* Top Controller Bar */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                <Compass className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-extrabold text-stone-900">
                  نظام الخرائط والمسح الجغرافي الفلاحي (Geo-Fencing & Polygon GIS)
                </h2>
                <p className="text-xs text-stone-500">
                  تحديد حدود القطع الزراعية (Polygon Boundary)، مساحة الهكتار، وفلترة الشعاع الجغرافي PostGIS
                </p>
              </div>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl text-xs font-bold text-stone-700">
            <button
              onClick={() => setMapMode('polygon')}
              className={`px-3 py-1.5 rounded-lg transition ${
                mapMode === 'polygon' ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              حدود القطع (Polygon)
            </button>
            <button
              onClick={() => setMapMode('satellite')}
              className={`px-3 py-1.5 rounded-lg transition ${
                mapMode === 'satellite' ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              قمر اصطناعي (Satellite)
            </button>
            <button
              onClick={() => setMapMode('heatmap')}
              className={`px-3 py-1.5 rounded-lg transition ${
                mapMode === 'heatmap' ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              كثافة الإنتاج (Heatmap)
            </button>
          </div>
        </div>

        {/* Spatial Query Bar (Radius + Crop Type) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
          {/* Spatial Radius Indexing */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-1.5">
              <span className="flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                شعاع البحث الجغرافي (R-tree Spatial Radius):
              </span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-mono">
                {radiusKm} كم
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="150"
              step="5"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>نطاق محلي (10 كم)</span>
              <span>نطاق متوسط (75 كم)</span>
              <span>نطاق إقليمي (150 كم)</span>
            </div>
          </div>

          {/* Wilaya Filter */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              الولاية والمنطقة الفلاحية:
            </label>
            <select
              value={selectedWilaya}
              onChange={(e) => setSelectedWilaya(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="الكل">جميع الولايات الزراعية النشطة</option>
              <option value="ميلة">ميلة (Mila) - التلاغمة وشلغوم العيد (زيتون وثوم وخضار)</option>
              <option value="قسنطينة">قسنطينة (Constantine) - الخروب وزيغود يوسف (حبوب وأغنام)</option>
              <option value="جيجل">جيجل (Jijel) - العوانة وتاكسنة (زيتون جبلي ودجاج عرب)</option>
              <option value="بسكرة">بسكرة (Biskra) - طولقة وسيدي عقبة (دقلة نور)</option>
              <option value="معسكر">معسكر (Mascara) - سيڨ (زيتون المائدة)</option>
              <option value="البليدة">البليدة (Blida) - متيجة وبوفاريك (حمضيات)</option>
              <option value="وادي سوف">وادي سوف (El Oued) - قمار (بطاطا صحراوية)</option>
            </select>
          </div>

          {/* Crop Spec Filter */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              نوع المحصول المستهدف:
            </label>
            <select
              value={cropTypeFilter}
              onChange={(e) => setCropTypeFilter(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">جميع المحاصيل والمنتجات</option>
              <option value="زيتون">زيتون وزيت زيتون بكر ممتاز</option>
              <option value="دجاج">دواجن ودجاج عرب بلدي وبيض</option>
              <option value="أغنام">أغنام وسلالات مواشي محلية</option>
              <option value="قمح">حبوب وبقوليات (قمح صلب وعدس)</option>
              <option value="ثوم">ثوم التلاغمة وخضروات</option>
              <option value="تمور">تمور دقلة نور ورطب</option>
              <option value="بطاطا">بطاطا صحراوية وخريفية</option>
              <option value="برتقال">حمضيات وكليمونتين</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Vector Map & Parcel Inspector Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Vector GIS Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-stone-900 rounded-2xl p-4 sm:p-6 shadow-md border border-stone-800 relative overflow-hidden min-h-[480px] flex flex-col justify-between">
          {/* Header over map */}
          <div className="flex items-center justify-between z-10 bg-stone-900/80 backdrop-blur px-3 py-2 rounded-xl border border-stone-700/60 text-white">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="font-bold text-emerald-400">الاستعلام المكاني النشط:</span>
              <span className="text-stone-300">
                محيط {radiusKm} كم حول {selectedWilaya === 'الكل' ? 'الشمال والصحراء الفلاحية' : selectedWilaya}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-stone-400">
              <span className="flex items-center gap-1 font-mono">
                <span className="w-3 h-3 bg-emerald-500/30 border border-emerald-400 rounded-xs"></span>
                مزرعة موثقة (Polygon)
              </span>
              <span className="font-mono text-emerald-300">
                {filteredFarms.length} مزارع مطابقة
              </span>
            </div>
          </div>

          {/* SVG Visualizer */}
          <div className="relative my-4 flex-1 flex items-center justify-center">
            <svg
              viewBox="0 0 700 520"
              className="w-full h-full max-h-[440px] drop-shadow-2xl select-none"
              style={{ filter: mapMode === 'satellite' ? 'contrast(1.2) brightness(0.85)' : 'none' }}
            >
              <defs>
                {/* Background Grid Pattern */}
                <pattern id="gis-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />
                </pattern>
                {/* Radial Gradient for Spatial Radius */}
                <radialGradient id="radiusGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="70%" stopColor="#047857" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#065f46" stopOpacity="0.0" />
                </radialGradient>
              </defs>

              {/* Grid Background */}
              <rect width="700" height="520" fill="url(#gis-grid)" />

              {/* Algeria Geo-Outline abstraction (Stylized Agro Regions) */}
              {/* Coastal & Tellian Atlas Agricultural Zone */}
              <path
                d="M 60,110 Q 150,90 280,105 T 480,120 T 630,130 L 610,230 Q 420,240 250,230 T 70,200 Z"
                fill={mapMode === 'satellite' ? '#143825' : '#1c2826'}
                stroke="#2e4d3f"
                strokeWidth="1.5"
                opacity="0.85"
              />
              <text x="320" y="115" fill="#4ade80" fontSize="10" opacity="0.6" fontWeight="bold">
                سهول متيجة وميلة والساحل الفلاحي
              </text>

              {/* High Plateaus Cereal Zone (الهضاب العليا) */}
              <path
                d="M 70,210 Q 240,240 430,250 T 610,240 L 590,320 Q 360,330 180,310 T 60,280 Z"
                fill={mapMode === 'satellite' ? '#26341f' : '#222d28'}
                stroke="#3e5746"
                strokeWidth="1.5"
                opacity="0.75"
              />
              <text x="280" y="275" fill="#a3e635" fontSize="10" opacity="0.6" fontWeight="bold">
                منطقة الهضاب العليا للحبوب والبقوليات (سطيف / قسنطينة)
              </text>

              {/* Oasis & Saharan Agri Basin (الواحات والزراعة الصحراوية بسكرة ووادي سوف) */}
              <path
                d="M 360,300 Q 520,310 650,330 L 630,500 Q 450,490 340,430 Z"
                fill={mapMode === 'satellite' ? '#3d301b' : '#2e271d'}
                stroke="#634e2c"
                strokeWidth="1.5"
                opacity="0.85"
              />
              <text x="450" y="450" fill="#facc15" fontSize="11" opacity="0.6" fontWeight="bold">
                حوض الزراعة الصحراوية والتمور (بسكرة ووادي سوف)
              </text>

              {/* Dynamic PostGIS Radius Indicator Circle around active farm */}
              {activeFarm && (
                <circle
                  cx={activeFarm.coordinates.lng > 0 ? (activeFarm.coordinates.lng * 25 + 230) : 150}
                  cy={activeFarm.coordinates.lat * 15 - 280}
                  r={radiusKm * 1.6}
                  fill="url(#radiusGradient)"
                  stroke="#34d399"
                  strokeWidth="1.5"
                  strokeDasharray="6,4"
                  className="animate-pulse"
                />
              )}

              {/* Render Farm Polygons & Pins */}
              {filteredFarms.map((farm) => {
                const isSelected = farm.id === selectedFarmId;
                // Calculate centroid for pin
                const points = farm.polygonSvgPoints.split(' ').map(p => p.split(',').map(Number));
                const centroidX = points.reduce((acc, p) => acc + p[0], 0) / points.length;
                const centroidY = points.reduce((acc, p) => acc + p[1], 0) / points.length;

                return (
                  <g 
                    key={farm.id} 
                    className="cursor-pointer group transition-transform"
                    onClick={() => {
                      setSelectedFarmId(farm.id);
                      onSelectFarm(farm);
                    }}
                  >
                    {/* Parcel Polygon Boundary */}
                    <polygon
                      points={farm.polygonSvgPoints}
                      fill={isSelected ? 'rgba(16, 185, 129, 0.45)' : 'rgba(16, 185, 129, 0.18)'}
                      stroke={isSelected ? '#10b981' : '#059669'}
                      strokeWidth={isSelected ? '2.5' : '1.5'}
                      className="transition-all duration-300 group-hover:fill-emerald-500/40"
                    />

                    {/* Polygon Corner Nodes */}
                    {points.map(([px, py], idx) => (
                      <circle
                        key={idx}
                        cx={px}
                        cy={py}
                        r={isSelected ? '3.5' : '2'}
                        fill="#34d399"
                        stroke="#064e3b"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Interactive Marker Pin at Centroid */}
                    <g transform={`translate(${centroidX}, ${centroidY})`}>
                      <circle
                        r={isSelected ? '14' : '10'}
                        fill={isSelected ? '#10b981' : '#047857'}
                        className="transition-all"
                      />
                      <circle r="4" fill="#ffffff" />

                      {/* Floating Farm Label */}
                      <rect
                        x="-50"
                        y="-35"
                        width="100"
                        height="20"
                        rx="6"
                        fill="rgba(15, 23, 42, 0.9)"
                        stroke={isSelected ? '#34d399' : '#334155'}
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="-22"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="bold"
                      >
                        {farm.name.length > 16 ? farm.name.substring(0, 16) + '...' : farm.name}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Footer Tools */}
          <div className="z-10 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-300 pt-2 border-t border-stone-800">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 bg-stone-800/80 px-2.5 py-1 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                إسقاط إحداثيات WGS84 دقيق
              </span>
              <span className="hidden sm:inline text-stone-400">
                مساحة القطع محددة بتقنية Geo-Polygon لتسهيل حساب الجرعات واللوجستيات
              </span>
            </div>
            <div className="font-mono text-emerald-400 text-[11px]">
              Spatial Index: R-TREE PostGIS v3.4
            </div>
          </div>
        </div>

        {/* Selected Farm & Parcel Inspector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {activeFarm ? (
            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4">
              {/* Cover & Badges */}
              <div className="relative rounded-xl overflow-hidden h-36 bg-stone-100">
                <img
                  src={activeFarm.coverImage}
                  alt={activeFarm.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                  <span className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    توثيق {activeFarm.badgeLevel}
                  </span>
                  <span className="bg-black/60 backdrop-blur text-white text-[11px] px-2 py-0.5 rounded-full font-mono">
                    ★ {activeFarm.rating} ({activeFarm.reviewCount})
                  </span>
                </div>
                <div className="absolute bottom-2.5 right-2.5 left-2.5 text-white">
                  <h3 className="font-extrabold text-base leading-tight">
                    {activeFarm.name}
                  </h3>
                  <p className="text-xs text-stone-200 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    {activeFarm.wilaya} • {activeFarm.commune}
                  </p>
                </div>
              </div>

              {/* Parcel Geographic Metrics */}
              <div className="grid grid-cols-2 gap-2 bg-stone-50 p-3 rounded-xl border border-stone-100 text-center">
                <div>
                  <div className="text-[11px] text-stone-500">المساحة الممسوحة (GIS)</div>
                  <div className="text-sm font-black text-emerald-800 font-mono">
                    {activeFarm.areaHectares} هكتار
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-stone-500">مصدر الري الموثق</div>
                  <div className="text-xs font-bold text-stone-800 truncate" title={activeFarm.waterSource}>
                    {activeFarm.waterSource.split('(')[0]}
                  </div>
                </div>
              </div>

              {/* Technical Agronomic Soil & Irrigation Metrics Box */}
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/90 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-stone-900 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-amber-700" />
                    المعايير التقنية والمائية للمزرعة
                  </span>
                  <button
                    onClick={() => onOpenFarmSettings?.(activeFarm)}
                    className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 underline"
                    title="تعديل المواصفات التقنية"
                  >
                    <Settings className="w-3 h-3" />
                    <span>تعديل الإعدادات</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-white p-2 rounded-lg border border-stone-100">
                    <span className="text-stone-400 block text-[10px]">نوع وقوام التربة</span>
                    <strong className="text-stone-800 font-bold block truncate" title={activeFarm.soilType || 'طميية خصبة'}>
                      {activeFarm.soilType ? activeFarm.soilType.split('(')[0] : 'طميية خصبة'}
                    </strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-stone-100">
                    <span className="text-stone-400 block text-[10px]">حموضة التربة (pH)</span>
                    <strong className="text-emerald-700 font-mono font-black block">
                      {activeFarm.soilPh || 7.2} pH
                    </strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-stone-100">
                    <span className="text-stone-400 block text-[10px]">نظام السقي</span>
                    <strong className="text-stone-800 font-bold block truncate" title={activeFarm.irrigationMethod || 'ري قطرة قطرة'}>
                      {activeFarm.irrigationMethod ? activeFarm.irrigationMethod.split('(')[0] : 'ري قطرة قطرة'}
                    </strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-stone-100">
                    <span className="text-stone-400 block text-[10px]">ملوحة ماء الري</span>
                    <strong className="text-cyan-700 font-mono font-black block">
                      {activeFarm.waterSalinity !== undefined ? activeFarm.waterSalinity : 0.35} غ/لتر
                    </strong>
                  </div>
                </div>

                {/* View Full Public Profile Button */}
                <button
                  type="button"
                  onClick={() => onOpenFarmProfile?.(activeFarm)}
                  className="w-full py-2 px-3 rounded-lg bg-emerald-100/70 hover:bg-emerald-200/80 text-emerald-900 text-xs font-black flex items-center justify-center gap-1.5 transition border border-emerald-300"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-700" />
                  <span>عرض الملف التعريفي العام الكامل للمزرعة 🏛️</span>
                </button>
              </div>

              {/* Accessible Farm Audio Reader Button */}
              <button
                type="button"
                onClick={() => {
                  const isSpeakingThisFarm = isSpeaking && currentlySpeakingText?.includes(activeFarm.name.substring(0, 15));
                  if (isSpeakingThisFarm) {
                    stopSpeaking();
                  } else {
                    const labInfo = activeFarm.labCertificate ? `وتحمل شهادة جودة مخبرية من ${activeFarm.labCertificate.labName}` : '';
                    const speech = `مزرعة: ${activeFarm.name}، بإشراف المزارع: ${activeFarm.ownerName}، بولاية ${activeFarm.wilaya} بلدية ${activeFarm.commune}. المساحة الممسوحة جغرافياً: ${activeFarm.areaHectares} هكتار. مصدر مياه الري: ${activeFarm.waterSource}. ${labInfo}.`;
                    speakText(speech, activeFarm.name);
                  }
                }}
                className={`w-full py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition ${
                  isSpeaking && currentlySpeakingText?.includes(activeFarm.name.substring(0, 15))
                    ? 'bg-amber-400 text-stone-950 shadow-md ring-2 ring-amber-300 animate-pulse'
                    : isAccessibleMode
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-400 shadow-xs'
                    : 'bg-stone-50 hover:bg-amber-50 text-stone-800 border border-stone-200'
                }`}
                title="استمع لتفاصيل المزرعة والقطعة ومصدر الري بصوت واضح"
              >
                <Volume2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  {isSpeaking && currentlySpeakingText?.includes(activeFarm.name.substring(0, 15))
                    ? 'جاري قراءة بيانات المزرعة... (انقر للإيقاف)'
                    : 'استمع لتفاصيل المزرعة والقطعة 🔉'}
                </span>
              </button>

              {/* Lab Traceability Preview */}
              {activeFarm.labCertificate && (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      شهادة التحليل المخبري للجودة
                    </span>
                    <button
                      onClick={() => onOpenTraceability(activeFarm)}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline flex items-center gap-0.5"
                    >
                      <Eye className="w-3 h-3" />
                      فحص التقرير
                    </button>
                  </div>
                  <p className="text-xs text-emerald-800 font-medium">
                    {activeFarm.labCertificate.labName} • رقم {activeFarm.labCertificate.certNumber}
                  </p>
                  {activeFarm.labCertificate.acidityLevel && (
                    <div className="text-[11px] text-stone-700 bg-white/80 p-1.5 rounded-lg border border-emerald-100">
                      نسبة الحموضة: <strong className="text-emerald-700">{activeFarm.labCertificate.acidityLevel}</strong>
                    </div>
                  )}
                  <div className="text-[11px] text-stone-700 bg-white/80 p-1.5 rounded-lg border border-emerald-100">
                    بقايا المبيدات: <strong className="text-emerald-700">{activeFarm.labCertificate.pesticideResidue}</strong>
                  </div>
                </div>
              )}

              {/* Farm Crops & Harvest Countdown */}
              <div>
                <h4 className="text-xs font-extrabold text-stone-800 mb-2">
                  محاصيل المزرعة المتاحة للطلب المباشر:
                </h4>
                <div className="space-y-2">
                  {activeFarmCrops.map((crop) => (
                    <div
                      key={crop.id}
                      className="p-2.5 rounded-xl border border-stone-200 bg-white hover:border-emerald-500 transition flex items-center justify-between gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-stone-900 truncate">
                            {crop.title}
                          </span>
                        </div>
                        <div className="text-[11px] text-emerald-700 font-extrabold font-mono mt-0.5">
                          {crop.pricePerUnit.toLocaleString()} دج / {crop.unit}
                          {crop.harvestStatus === 'حجز مسبق قبل الجني' && (
                            <span className="mr-2 text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded text-[10px]">
                              متبقي {crop.daysToHarvest} يوم للجني
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenPreOrder(crop)}
                        className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shrink-0 transition"
                      >
                        {crop.harvestStatus === 'حجز مسبق قبل الجني' ? 'حجز مسبق' : 'طلب مباشر'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Farmer Contact (No middle-men) */}
              <div className="pt-2 border-t border-stone-100 space-y-2">
                <div className="text-xs text-stone-500 font-semibold">
                  المزارع المسؤول: <strong>{activeFarm.ownerName}</strong>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${activeFarm.phone}`}
                    className="flex items-center justify-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-900 py-2 rounded-xl text-xs font-bold transition"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                    <span>اتصال هاتفي</span>
                  </a>
                  <a
                    href={`https://wa.me/${activeFarm.whatsapp}?text=السلام عليكم، رأيت مزرعتك في منصة Fllah.dz وأرغب في الاستفسار عن المحصول.`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>واتساب مباشر</span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center text-stone-400 border border-stone-200">
              يرجى اختيار مزرعة على الخريطة لعرض تفاصيلها.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
