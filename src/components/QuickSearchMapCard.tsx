import React, { useState, useMemo } from 'react';
import { Crop, Farm, AgriculturalEquipment } from '../types/agritech';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  Plus, 
  Minus, 
  MapPin, 
  ArrowLeft, 
  PhoneCall, 
  ExternalLink, 
  Layers, 
  X,
  Volume2,
  CheckCircle2
} from 'lucide-react';

interface QuickSearchMapCardProps {
  crops: Crop[];
  farms: Farm[];
  equipmentList?: AgriculturalEquipment[];
  onOpenFullMap: () => void;
  onSelectCrop?: (crop: Crop) => void;
  onSelectFarm?: (farm: Farm) => void;
  onSelectEquipment?: (eq: AgriculturalEquipment) => void;
  className?: string;
}

interface MapMarker {
  id: string;
  type: 'crop' | 'equipment';
  title: string;
  subtitle: string;
  wilaya: string;
  lat: number;
  lng: number;
  price?: string;
  phone?: string;
  rawCrop?: Crop;
  rawEquipment?: AgriculturalEquipment;
}

export const QuickSearchMapCard: React.FC<QuickSearchMapCardProps> = ({
  crops,
  farms,
  equipmentList = [],
  onOpenFullMap,
  onSelectCrop,
  onSelectFarm,
  onSelectEquipment,
  className = '',
}) => {
  const { speakText } = useAccessibility();
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeFilter, setActiveFilter] = useState<'all' | 'crops' | 'equipment'>('all');
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  // Geographic bounds representing the map in the user's screenshot (Northern to Central Algeria)
  // Lat: 31.0° to 37.8° N
  // Lng: -1.0° to 8.8° E
  const MAP_W = 600;
  const MAP_H = 460;

  const projectPoint = (lng: number, lat: number) => {
    const minLng = -1.2;
    const maxLng = 8.8;
    const minLat = 31.5;
    const maxLat = 37.6;

    // Apply zoom and pan
    const normX = (lng - minLng) / (maxLng - minLng);
    const normY = (maxLat - lat) / (maxLat - minLat);

    const cx = MAP_W / 2;
    const cy = MAP_H / 2;

    const rawX = normX * MAP_W;
    const rawY = normY * MAP_H;

    const scaledX = cx + (rawX - cx) * zoomLevel + panOffset.x;
    const scaledY = cy + (rawY - cy) * zoomLevel + panOffset.y;

    return { x: scaledX, y: scaledY };
  };

  // Compile map markers based on real farms/crops and equipment
  const markers: MapMarker[] = useMemo(() => {
    const list: MapMarker[] = [];

    // 1. Crop / Basket markers (Orange pins 🧺)
    // Distributed around northern Algerian agricultural zones (Mila, Blida, Constantine, Mascara, Jijel, Setif)
    const cropCoordinates: { [key: string]: { lat: number; lng: number } } = {
      'farm-1': { lat: 36.45, lng: 6.26 }, // Mila (زيتون وثوم)
      'farm-2': { lat: 34.85, lng: 5.73 }, // Biskra (تمور دقلة نور)
      'farm-3': { lat: 36.47, lng: 2.83 }, // Blida (حمضيات وفواكه)
      'farm-4': { lat: 33.37, lng: 6.86 }, // El Oued (بطاطا صحراوية)
      'farm-5': { lat: 35.39, lng: 0.14 }, // Mascara (زيتون المائدة)
      'farm-6': { lat: 36.82, lng: 5.76 }, // Jijel (زيتون جبلي ودواجن)
      'farm-7': { lat: 36.36, lng: 6.61 }, // Constantine (حبوب وأغنام)
    };

    crops.slice(0, 10).forEach((crop, idx) => {
      const baseCoord = cropCoordinates[crop.farmId] || { lat: 36.45 + (idx * 0.1), lng: 5.5 + (idx * 0.2) };
      // Small jitter so markers don't overlap completely
      const jitterLat = (idx % 3 - 1) * 0.15;
      const jitterLng = (idx % 4 - 1.5) * 0.2;

      list.push({
        id: `crop-${crop.id}`,
        type: 'crop',
        title: crop.title,
        subtitle: `${crop.farmName} • صنف: ${crop.variety}`,
        wilaya: crop.wilaya,
        lat: baseCoord.lat + jitterLat,
        lng: baseCoord.lng + jitterLng,
        price: `${crop.pricePerUnit.toLocaleString()} دج / ${crop.unit}`,
        phone: crop.farmerPhone,
        rawCrop: crop,
      });
    });

    // 2. Equipment / Tractor markers (Green pins 🚜)
    // Distributed around machinery hubs (Constantine Cirta, Mascara, Djelfa, Setif, Mila)
    const equipmentCoordinates = [
      { id: 'eq-pin-1', lat: 36.35, lng: 6.60, title: 'جرار فلاحي سيرتا Cirta C6807 (4x4)', wilaya: 'قسنطينة' },
      { id: 'eq-pin-2', lat: 35.39, lng: 0.14, title: 'حصادة حبوب سيرتا مع طاقم تشغيل', wilaya: 'معسكر' },
      { id: 'eq-pin-3', lat: 36.44, lng: 6.25, title: 'صهريج مياه فلاحي مجرور 5000 لتر', wilaya: 'ميلة' },
      { id: 'eq-pin-4', lat: 34.67, lng: 3.25, title: 'جرار سيرتا C6807 مع مقطورة كراء يومي', wilaya: 'الجلفة' },
      { id: 'eq-pin-5', lat: 36.19, lng: 5.41, title: 'مضخة غاطسة شمسية عالية الضغط 40HP', wilaya: 'سطيف' },
      { id: 'eq-pin-6', lat: 34.85, lng: 5.73, title: 'رافعة فلاحية متنقلة لجني نخيل التمور', wilaya: 'بسكرة' },
      { id: 'eq-pin-7', lat: 36.47, lng: 2.83, title: 'نظام ري محوري بالطاقة الشمسية', wilaya: 'البليدة' },
    ];

    equipmentCoordinates.forEach((eq, idx) => {
      const matchRaw = equipmentList[idx] || equipmentList[0];
      list.push({
        id: eq.id,
        type: 'equipment',
        title: eq.title,
        subtitle: matchRaw?.description || 'كراء يومي/موسمي معتمد ومباشر',
        wilaya: eq.wilaya,
        lat: eq.lat,
        lng: eq.lng,
        price: matchRaw ? `${matchRaw.price.toLocaleString()} دج ${matchRaw.priceUnit}` : '18,000 دج / اليوم',
        phone: matchRaw?.ownerPhone || '0555123456',
        rawEquipment: matchRaw,
      });
    });

    return list;
  }, [crops, equipmentList]);

  // Filter markers based on active tab
  const displayedMarkers = useMemo(() => {
    return markers.filter(m => {
      if (activeFilter === 'crops') return m.type === 'crop';
      if (activeFilter === 'equipment') return m.type === 'equipment';
      return true;
    });
  }, [markers, activeFilter]);

  // Zoom handlers
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.3, 2.2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.3, 0.8));
  };

  // Select marker without auto-speaking
  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker);
  };

  return (
    <div className={`bg-white rounded-3xl p-3 sm:p-4 border border-stone-200/90 shadow-sm space-y-3 ${className}`}>
      {/* Top Filter Chips & Indicator Strip */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
          <span className="text-xs font-black text-stone-900 tracking-tight">
            خريطة البحث الجغرافي السريع (Quick GIS Discovery)
          </span>
        </div>

        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-[11px] font-bold">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2 py-0.5 rounded-lg transition ${
              activeFilter === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            الكل ({markers.length})
          </button>
          <button
            onClick={() => setActiveFilter('crops')}
            className={`px-2 py-0.5 rounded-lg transition flex items-center gap-1 ${
              activeFilter === 'crops' ? 'bg-amber-500 text-stone-950 font-black shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>🧺 محاصيل</span>
          </button>
          <button
            onClick={() => setActiveFilter('equipment')}
            className={`px-2 py-0.5 rounded-lg transition flex items-center gap-1 ${
              activeFilter === 'equipment' ? 'bg-emerald-800 text-white font-black shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>🚜 عتاد</span>
          </button>
        </div>
      </div>

      {/* Main Map Viewport (Matches the screenshot layout & pastel OpenStreetMap palette) */}
      <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-stone-200/80 bg-[#f4f0e8] select-none shadow-inner">
        {/* SVG Base Map */}
        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          className="w-full h-full object-cover"
        >
          <defs>
            {/* Subtle Land Texture */}
            <pattern id="land-dots" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="0.6" fill="#000000" opacity="0.03" />
            </pattern>
          </defs>

          {/* 1. Mediterranean Sea Background (Top Soft Pastel Blue) */}
          <rect x="0" y="0" width={MAP_W} height={MAP_H} fill="#aadaff" />

          {/* 2. Land Mass Polygon (Algeria and Maghreb in soft warm pastel beige #fcf8ee) */}
          {(() => {
            // Geographic outline coordinates projected
            return (
              <g>
                {/* Algeria Land Base */}
                <path
                  d={`
                    M -50,${MAP_H + 50}
                    L -50,110
                    Q 80,105 160,118
                    Q 240,110 320,85
                    Q 400,60 480,50
                    Q 540,55 600,60
                    L ${MAP_W + 50},60
                    L ${MAP_W + 50},${MAP_H + 50}
                    Z
                  `}
                  fill="#fef9eb"
                  stroke="#e2dac6"
                  strokeWidth="1.2"
                />

                {/* Land texture overlay */}
                <rect x="0" y="0" width={MAP_W} height={MAP_H} fill="url(#land-dots)" />

                {/* Tunisia border strip to the East */}
                <path
                  d="M 520,60 Q 535,120 540,180 L 600,195 L 600,60 Z"
                  fill="#fbf5e1"
                  stroke="#dcd3bd"
                  strokeWidth="1"
                  strokeDasharray="4 2"
                  opacity="0.8"
                />

                {/* Morocco border strip to the West */}
                <path
                  d="M -50,110 Q 30,140 40,240 L -50,260 Z"
                  fill="#fbf5e1"
                  stroke="#dcd3bd"
                  strokeWidth="1"
                  strokeDasharray="4 2"
                  opacity="0.8"
                />

                {/* Internal Wilaya Administrative Boundaries (Light subtle dashed lines) */}
                <g stroke="#d5c8ad" strokeWidth="0.8" strokeDasharray="3 3" fill="none" opacity="0.75">
                  <path d="M 120,115 L 140,190 L 180,240" />
                  <path d="M 160,118 L 220,150 L 250,230" />
                  <path d="M 280,100 L 290,165 L 340,220" />
                  <path d="M 320,85 L 380,120 L 410,190" />
                  <path d="M 400,60 L 430,110 L 480,160" />
                  <path d="M 480,50 L 500,105 L 530,170" />
                  <path d="M 140,190 L 280,210 L 420,200 L 540,210" />
                  <path d="M 180,240 L 300,280 L 460,260" />
                  <path d="M 220,310 L 350,330 L 490,320" />
                </g>

                {/* Regional City & Wilaya Labels (Matching the screenshot with Arabic and Tifinagh / Latin script) */}
                <g fontSize="10" fill="#475569" fontWeight="bold" fontFamily="sans-serif">
                  {/* Algiers / الجزائر */}
                  <text x="260" y="105" fill="#334155" fontSize="11">الجزائر</text>

                  {/* Setif / سطيف */}
                  <text x="400" y="90" fill="#334155" fontSize="10">
                    سطيف; ⵙⴻⵜⵉⴼ; Setif
                  </text>

                  {/* Annaba / عنابة */}
                  <text x="490" y="55" fill="#334155" fontSize="10">
                    عنابة; ⵄⵏⵏⴰⴱⴰ
                  </text>

                  {/* Tunisia / تونس */}
                  <text x="545" y="160" fill="#64748b" fontSize="11" opacity="0.85">تونس</text>

                  {/* Djelfa / الجلفة */}
                  <text x="235" y="180" fill="#475569" fontSize="10">
                    الجلفة; ⵍⵊⴻⵍⴼⴰ
                  </text>

                  {/* Ouargla / ورقلة */}
                  <text x="400" y="275" fill="#475569" fontSize="10">
                    ورقلة; ⵡⴰⵔⴳⵍⴰ
                  </text>

                  {/* Timimoun / تيميمون */}
                  <text x="180" y="325" fill="#64748b" fontSize="10">
                    تيميمون
                  </text>

                  {/* Beni Abbes / بني عباس */}
                  <text x="55" y="360" fill="#64748b" fontSize="10">
                    بني عباس
                  </text>

                  {/* Illizi / إليزي */}
                  <text x="460" y="365" fill="#64748b" fontSize="10">
                    إليزي; ⵉⵍⵍⵉⵣⵉ
                  </text>

                  {/* In Salah / عين صالح */}
                  <text x="250" y="420" fill="#64748b" fontSize="10">
                    عين صالح
                  </text>
                </g>
              </g>
            );
          })()}

          {/* 3. MARKER PINS RENDERED DYNAMICALLY (Orange Baskets 🧺 & Green Tractors 🚜) */}
          {displayedMarkers.map((marker) => {
            const { x, y } = projectPoint(marker.lng, marker.lat);
            const isSelected = selectedMarker?.id === marker.id;
            const isCrop = marker.type === 'crop';

            return (
              <g
                key={marker.id}
                transform={`translate(${x}, ${y})`}
                onClick={() => handleMarkerClick(marker)}
                className="cursor-pointer group"
              >
                {/* Selected Halo */}
                {isSelected && (
                  <circle
                    cx="0"
                    cy="0"
                    r="24"
                    fill="none"
                    stroke={isCrop ? '#ea580c' : '#15803d'}
                    strokeWidth="2.5"
                    opacity="0.8"
                    className="animate-ping"
                  />
                )}

                {/* Pin Shadow */}
                <ellipse cx="1" cy="4" rx="14" ry="7" fill="rgba(0,0,0,0.25)" />

                {/* Pin Drop Badge (Matching user's screenshot exactly!) */}
                {/* Circular Badge with white border and icon */}
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? "17" : "15"}
                  fill={isCrop ? "#ea580c" : "#1b4d3e"}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="transition duration-200 group-hover:scale-110 drop-shadow-md"
                />

                {/* Inner Icon Graphic: Basket 🧺 or Tractor 🚜 */}
                {isCrop ? (
                  // Basket Icon 🧺
                  <g transform="translate(-7, -7) scale(0.75)">
                    <path
                      d="M 4,7 L 16,7 L 14,16 L 6,16 Z"
                      fill="#ffffff"
                    />
                    <path
                      d="M 6,7 C 6,2 14,2 14,7"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <line x1="8" y1="8" x2="8" y2="15" stroke="#ea580c" strokeWidth="1" />
                    <line x1="12" y1="8" x2="12" y2="15" stroke="#ea580c" strokeWidth="1" />
                  </g>
                ) : (
                  // Tractor Icon 🚜
                  <g transform="translate(-7, -7) scale(0.75)">
                    <rect x="5" y="3" width="7" height="6" fill="#ffffff" rx="1" />
                    <rect x="3" y="7" width="13" height="4" fill="#ffffff" rx="1" />
                    {/* Big Rear Wheel */}
                    <circle cx="6" cy="13" r="3.5" fill="#facc15" stroke="#ffffff" strokeWidth="1.2" />
                    <circle cx="6" cy="13" r="1.5" fill="#1b4d3e" />
                    {/* Small Front Wheel */}
                    <circle cx="14" cy="13" r="2.2" fill="#facc15" stroke="#ffffff" strokeWidth="1" />
                    <circle cx="14" cy="13" r="0.8" fill="#1b4d3e" />
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Zoom Controls (Top Left in Screenshot) */}
        <div className="absolute top-3 left-3 bg-white rounded-xl shadow-md border border-stone-300 flex flex-col overflow-hidden z-20">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 flex items-center justify-center text-stone-700 hover:bg-stone-100 hover:text-black font-bold border-b border-stone-200 transition active:bg-stone-200"
            title="تكبير الخريطة"
            aria-label="تكبير"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 flex items-center justify-center text-stone-700 hover:bg-stone-100 hover:text-black font-bold transition active:bg-stone-200"
            title="تصغير الخريطة"
            aria-label="تصغير"
          >
            <Minus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Selected Marker Interactive Floating Popup Card */}
        {selectedMarker && (
          <div className="absolute bottom-9 left-3 right-3 sm:right-auto sm:max-w-xs bg-white rounded-2xl p-3.5 shadow-xl border border-stone-200/90 z-20 animate-fade-in text-xs space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-base">
                  {selectedMarker.type === 'crop' ? '🧺' : '🚜'}
                </span>
                <div>
                  <h4 className="font-extrabold text-stone-900 line-clamp-1">
                    {selectedMarker.title}
                  </h4>
                  <span className="text-[10px] text-stone-500 font-bold block">
                    {selectedMarker.wilaya} • {selectedMarker.price}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const text = selectedMarker.type === 'crop'
                      ? `محصول فلاحي: ${selectedMarker.title} بولاية ${selectedMarker.wilaya}. السعر: ${selectedMarker.price}.`
                      : `عتاد ومعدات فلاحية: ${selectedMarker.title} بولاية ${selectedMarker.wilaya}. السعر: ${selectedMarker.price}.`;
                    speakText(text, selectedMarker.title, true);
                  }}
                  className="text-stone-400 hover:text-emerald-700 p-1 rounded-lg hover:bg-stone-100 transition"
                  title="استماع صوتي للقارئ"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setSelectedMarker(null)}
                  className="text-stone-400 hover:text-stone-700 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
              {selectedMarker.subtitle}
            </p>

            <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
              {selectedMarker.phone && (
                <a
                  href={`tel:${selectedMarker.phone}`}
                  className="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-center font-bold text-[11px] flex items-center justify-center gap-1 transition"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>اتصال مباشر</span>
                </a>
              )}

              {selectedMarker.type === 'crop' && selectedMarker.rawCrop && onSelectCrop && (
                <button
                  onClick={() => onSelectCrop(selectedMarker.rawCrop!)}
                  className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold text-[11px] transition"
                >
                  حجز مسبق
                </button>
              )}
            </div>
          </div>
        )}

        {/* Leaflet & OpenStreetMap Attribution Watermark (Exact bottom-right badge in user's image) */}
        <div className="absolute bottom-1 right-1 bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] text-stone-600 font-sans border border-stone-200/60 z-10 flex items-center gap-1 pointer-events-none">
          <span>Leaflet | © OpenStreetMap</span>
          <span title="Algeria Map Source">🇺🇦</span>
        </div>
      </div>

      {/* Prominent Bottom Full Map Navigation Button (Matching user's screenshot exactly!) */}
      <button
        onClick={onOpenFullMap}
        className="w-full bg-[#1B4D3E] hover:bg-[#153e32] active:scale-[0.99] text-white py-3.5 px-4 rounded-2xl font-black text-sm sm:text-base transition duration-150 flex items-center justify-center gap-2 shadow-sm"
        title="فتح خريطة المسح الجغرافي والحدود العقارية الكاملة (Full GIS Map)"
      >
        <span>فتح خريطة البحث الكاملة</span>
        <span className="font-mono text-lg font-bold">←</span>
      </button>
    </div>
  );
};
