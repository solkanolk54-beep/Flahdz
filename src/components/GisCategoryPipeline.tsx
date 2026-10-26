import React, { useState } from 'react';
import { 
  MapPin, 
  Map, 
  ShieldCheck, 
  Lock, 
  Truck, 
  Store, 
  Sparkles, 
  Filter, 
  CheckCircle2, 
  Phone, 
  QrCode, 
  Volume2, 
  ExternalLink,
  ChevronRight,
  Radio,
  Check,
  Building2,
  CalendarDays,
  Smartphone,
  Navigation
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { Crop, Farm, CertifiedNurseryItem, AgriculturalEquipment } from '../types/agritech';
import { MOCK_NURSERIES } from '../data/mockData';

export interface CategoryCardData {
  id: string;
  title: string;
  icon: string;
  count: string;
  badgeBg: string;
  badgeText: string;
  tag: string;
  speechDescription: string;
}

interface GisCategoryPipelineProps {
  onSelectCategory: (categoryId: string) => void;
  activeCategoryId: string;
  onOpenGisMap: () => void;
  onOpenAddCrop: () => void;
  onOpenFlutterCode: () => void;
  onOpenPreOrder: (crop: Crop) => void;
  onOpenCarrierMatch?: () => void;
  // Filter states
  radius50kmActive: boolean;
  onToggleRadius50km: () => void;
  inraaOnlyActive: boolean;
  onToggleInraaOnly: () => void;
  escrowOnlyActive: boolean;
  onToggleEscrowOnly: () => void;
  selectedWilaya: string;
  onSelectWilaya: (wilaya: string) => void;
  equipmentList: AgriculturalEquipment[];
}

export const GisCategoryPipeline: React.FC<GisCategoryPipelineProps> = ({
  onSelectCategory,
  activeCategoryId,
  onOpenGisMap,
  onOpenAddCrop,
  onOpenFlutterCode,
  onOpenPreOrder,
  onOpenCarrierMatch,
  radius50kmActive,
  onToggleRadius50km,
  inraaOnlyActive,
  onToggleInraaOnly,
  escrowOnlyActive,
  onToggleEscrowOnly,
  selectedWilaya,
  onSelectWilaya,
  equipmentList,
}) => {
  const { speakText } = useAccessibility();
  const [selectedNursery, setSelectedNursery] = useState<CertifiedNurseryItem | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<AgriculturalEquipment | null>(null);

  // 11 Comprehensive Categories matching the user's brief & Flutter mobile specification
  const categories: CategoryCardData[] = [
    {
      id: 'الخضر',
      title: 'الخضر',
      icon: '🥦',
      count: '120 مزرعة',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      tag: 'طماطم، بطاطا، ثوم التلاغمة',
      speechDescription: 'تصنيف الخضر: مائة وعشرون مزرعة قريبة موثقة بالسجل الجغرافي والتحليل المخبري'
    },
    {
      id: 'الفواكه',
      title: 'الفواكه',
      icon: '🍎',
      count: '85 بستان',
      badgeBg: 'bg-rose-100',
      badgeText: 'text-rose-800',
      tag: 'حمضيات متيجة، تفاح، تين',
      speechDescription: 'تصنيف الفواكه: خمسة وثمانون بستاناً معتمداً مع إمكانية الشحن المبرد'
    },
    {
      id: 'المواشي',
      title: 'المواشي',
      icon: '🐑',
      count: '45 عرض',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      tag: 'سلالة أولاد جلال، مراعي حرة',
      speechDescription: 'تصنيف المواشي: خمسة وأربعون عرضاً موثقاً من سلالة أولاد جلال مع فحص بيطري رسمي'
    },
    {
      id: 'الدواجن',
      title: 'الدواجن',
      icon: '🐔',
      count: '32 مزرعة',
      badgeBg: 'bg-orange-100',
      badgeText: 'text-orange-800',
      tag: 'دجاج عرب بلدي طليق',
      speechDescription: 'تصنيف الدواجن: اثنان وثلاثون مزرعة حرة لدجاج عرب بلدي ريفي طليق'
    },
    {
      id: 'البيض',
      title: 'البيض',
      icon: '🥚',
      count: '28 منتج',
      badgeBg: 'bg-yellow-100',
      badgeText: 'text-yellow-800',
      tag: 'بيض بلدي مخصب طازج',
      speechDescription: 'تصنيف البيض: ثمانية وعشرون منتجاً ريفياً مجمعاً يومياً من دجاج عرب حر'
    },
    {
      id: 'الأرانب',
      title: 'الأرانب',
      icon: '🐇',
      count: '14 مربي',
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-800',
      tag: 'سلالات مهجنة عالية الخصوبة',
      speechDescription: 'تصنيف الأرانب: أربعة عشر مربياً معتمداً لسلالات مهجنة عالية الإنتاجية'
    },
    {
      id: 'البذور',
      title: 'البذور',
      icon: '🌾',
      count: '36 مخزن',
      badgeBg: 'bg-teal-100',
      badgeText: 'text-teal-800',
      tag: 'قمح صلب سيميتو R1 معتمد',
      speechDescription: 'تصنيف البذور: ستة وثلاثون مخزناً معتمداً لبذور القمح الصلب والشعير المعتمدة من سي سي إل إس'
    },
    {
      id: 'المشاتل',
      title: 'المشاتل',
      icon: '🪴',
      count: '18 مشتلة',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-800',
      tag: 'شتلات سيغواز وشملال نقية',
      speechDescription: 'تصنيف المشاتل: ثمانية عشر مشتلة معتمدة من مفتشية حماية النباتات لنقاوة شتلات الزيتون الشملال والسيغواز'
    },
    {
      id: 'المعدات',
      title: 'المعدات',
      icon: '🚜',
      count: '24 عتاد',
      badgeBg: 'bg-indigo-100',
      badgeText: 'text-indigo-800',
      tag: 'جرارات سيرتا، صهاريج، طاقة',
      speechDescription: 'تصنيف المعدات الفلاحية: أربعة وعشرون جرار سيرتا وصهريج مياه ومضخات شمسية جاهزة للكراء والبيع'
    },
    {
      id: 'حسب الولاية',
      title: 'حسب الولاية',
      icon: '📍',
      count: '58 ولاية',
      badgeBg: 'bg-cyan-100',
      badgeText: 'text-cyan-800',
      tag: 'ميلة، بسكرة، متيجة، سطيف',
      speechDescription: 'تصفية جغرافية حسب ثمانية وخمسين ولاية جزائرية وفق الأقطاب الفلاحية المتخصصة'
    },
    {
      id: 'منتجات أخرى',
      title: 'منتجات أخرى',
      icon: '🧺',
      count: '19 عرض',
      badgeBg: 'bg-stone-200',
      badgeText: 'text-stone-800',
      tag: 'عسل سدر، معاصر زيتون، أعلاف',
      speechDescription: 'منتجات فلاحية أخرى وعسل طبيعي ومعاصر زيتون ومخلفات عضوية'
    },
  ];

  return (
    <div className="space-y-4" role="region" aria-label="شبكة التصنيفات البصرية ونظام الفلترة الجغرافية GIS">
      {/* 1. Workflow Pipeline Breadcrumb / Architectural Header */}
      <div className="bg-stone-900 text-white rounded-2xl p-3 sm:p-4 shadow-sm border border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-emerald-700/60 rounded-xl text-emerald-300">
            <Radio className="w-4 h-4 animate-pulse" />
          </span>
          <div>
            <h2 className="font-extrabold text-sm sm:text-base text-stone-100">
              ربط التصنيف البصري بخدمات الـ GIS والتتبع المتقدمة
            </h2>
            <p className="text-[11px] text-stone-400">
              Fllah.dz AgriGIS Engine • مطابقة الموقع والشهادات المخبرية في ثوانٍ
            </p>
          </div>
        </div>

        {/* Visual 3-Stage Pipeline Diagram */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] font-bold overflow-x-auto py-1">
          <div className="flex items-center gap-1 bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-700 text-emerald-300">
            <span>[ 1. بطاقة التصنيف ]</span>
          </div>
          <span className="text-emerald-500 font-mono">──►</span>
          <div className="flex items-center gap-1 bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-700 text-amber-300">
            <span>[ 2. الفلترة الجغرافية السريعة ]</span>
          </div>
          <span className="text-emerald-500 font-mono">──►</span>
          <div className="flex items-center gap-1 bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-700 text-blue-300">
            <span>[ 3. توثيق الـ GIS والتحليل ]</span>
          </div>
        </div>
      </div>

      {/* 2. Top Quick Action Banners (matching Flutter mobile layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Banner 1: Explore GIS Map */}
        <div 
          onClick={onOpenGisMap}
          className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white p-3.5 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer group border border-blue-600/50"
          role="button"
          tabIndex={0}
          aria-label="استكشف المزارع على خريطة الـ GIS"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Map className="w-5 h-5 text-blue-200 group-hover:scale-110 transition" />
                <span className="font-extrabold text-sm">استكشف المزارع على الخريطة</span>
              </div>
              <p className="text-xs text-blue-200">
                مسح جغرافي GIS لكل الولايات • حدود الحقول (Polygons)
              </p>
            </div>
            <span className="p-1 bg-white/20 rounded-lg text-white group-hover:translate-x-[-2px] transition">
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Banner 2: Add Farm Produce */}
        <div 
          onClick={onOpenAddCrop}
          className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-green-900 text-white p-3.5 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer group border border-emerald-600/50"
          role="button"
          tabIndex={0}
          aria-label="عرض منتجات مزرعتك والبيع المباشر"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Store className="w-5 h-5 text-emerald-200 group-hover:scale-110 transition" />
                <span className="font-extrabold text-sm">عرض منتجات مزرعتك</span>
              </div>
              <p className="text-xs text-emerald-200">
                سجّل الآن وبع المباشر • بدون هوامش السماسرة
              </p>
            </div>
            <span className="p-1 bg-white/20 rounded-lg text-white group-hover:translate-x-[-2px] transition">
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Banner 3: Flutter Mobile SDK / Code Export */}
        <div 
          onClick={onOpenFlutterCode}
          className="bg-gradient-to-br from-stone-800 via-stone-900 to-black text-white p-3.5 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer group border border-stone-700"
          role="button"
          tabIndex={0}
          aria-label="عرض كود Flutter الجاهز لتطبيق الهاتف"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-5 h-5 text-amber-300 group-hover:scale-110 transition" />
                <span className="font-extrabold text-sm">كود تطبيق Flutter للجوال</span>
              </div>
              <p className="text-xs text-stone-300">
                واجهة جاهزة مع شبكة التصنيفات والشريط السفلي
              </p>
            </div>
            <span className="bg-amber-400 text-stone-950 font-bold px-2 py-0.5 rounded text-[10px]">
              Flutter Code
            </span>
          </div>
        </div>
      </div>

      {/* 3. Fast Geographic & Quality Filter Bar (الفلترة الجغرافية السريعة) */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-amber-100 text-amber-800 rounded-lg">
              <Filter className="w-4 h-4" />
            </span>
            <span className="text-xs font-black text-stone-900">
              الفلترة الجغرافية السريعة والتتبع المخبري المباشر:
            </span>
          </div>
          <span className="text-[11px] text-stone-500">
            SRID: EPSG:4326 • استعلام فوري لنطاق المزارع
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Radius 50 KM Button */}
          <button
            type="button"
            onClick={onToggleRadius50km}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border shadow-xs ${
              radius50kmActive
                ? 'bg-blue-600 text-white border-blue-700 shadow-sm ring-2 ring-blue-300'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-300'
            }`}
            title="تحديد المزارع المتواجدة ضمن مسافة 50 كم فقط من إحداثياتك"
            aria-pressed={radius50kmActive}
          >
            <Navigation className={`w-3.5 h-3.5 ${radius50kmActive ? 'text-white animate-spin' : 'text-blue-600'}`} />
            <span>شعاع 50 كم من موقعك</span>
            {radius50kmActive && <Check className="w-3.5 h-3.5 text-white" />}
          </button>

          {/* INRAA / Lab Quality Certified Only */}
          <button
            type="button"
            onClick={onToggleInraaOnly}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border shadow-xs ${
              inraaOnlyActive
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm ring-2 ring-emerald-300'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-300'
            }`}
            title="المزارع التي تملك شهادات تحاليل مخبرية معتمدة من INRAA"
            aria-pressed={inraaOnlyActive}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${inraaOnlyActive ? 'text-white' : 'text-emerald-700'}`} />
            <span>شارة مخبر INRAA (حموضة ≤ 0.8%)</span>
            {inraaOnlyActive && <Check className="w-3.5 h-3.5 text-white" />}
          </button>

          {/* Escrow pre-order only */}
          <button
            type="button"
            onClick={onToggleEscrowOnly}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border shadow-xs ${
              escrowOnlyActive
                ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-sm ring-2 ring-amber-300'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-300'
            }`}
            title="عروض تتيح الحجز المسبق مع حجز العربون في حساب الضمان المشفر"
            aria-pressed={escrowOnlyActive}
          >
            <Lock className={`w-3.5 h-3.5 ${escrowOnlyActive ? 'text-stone-950' : 'text-amber-600'}`} />
            <span>حجز مسبق مع عربون (Escrow 10-15%)</span>
            {escrowOnlyActive && <Check className="w-3.5 h-3.5 text-stone-950" />}
          </button>

          {/* Frigo Carrier Request Button */}
          {onOpenCarrierMatch && (
            <button
              type="button"
              onClick={onOpenCarrierMatch}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 transition shadow-xs"
              title="طلب شاحنة تبريد Frigo للشحن الفوري"
            >
              <Truck className="w-3.5 h-3.5 text-indigo-700" />
              <span>طلب شاحنة نقل مبردة (Frigo)</span>
            </button>
          )}

          {/* Wilaya Filter Dropdown */}
          <div className="flex items-center gap-1 bg-stone-100 px-2 py-1 rounded-xl border border-stone-300 text-xs mr-auto">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <select
              value={selectedWilaya}
              onChange={(e) => onSelectWilaya(e.target.value)}
              className="bg-transparent text-stone-800 font-bold focus:outline-none text-xs"
              aria-label="اختر الولاية الفلاحية للتصفية السريعة"
            >
              <option value="الكل">كل الولايات (58)</option>
              <option value="ميلة">ميلة (قطب الزيتون والحبوب)</option>
              <option value="بسكرة">بسكرة (قطب دقلة نور)</option>
              <option value="البليدة">البليدة (قطب متيجة للحمضيات)</option>
              <option value="جيجل">جيجل (زيتون الجبال ودواجن عرب)</option>
              <option value="قسنطينة">قسنطينة (سيرتا للحبوب والأغنام)</option>
              <option value="معسكر">معسكر (زيتون سيڨ ومكروم)</option>
              <option value="وادي سوف">وادي سوف (البطاقة الصحراوية)</option>
              <option value="سطيف">سطيف (هضاب الحبوب والأبقار)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Visual Category Grid with Smart Badges (بطاقات الحالات الفورية) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-sm text-stone-900">
              شبكة التصنيفات البصرية والخدمات التقنية المعتمدة
            </h3>
            <span className="text-[11px] text-stone-500 hidden sm:inline">
              (انقر على أي تصنيف لتطبيقه والاستماع لتفاصيله)
            </span>
          </div>
          {activeCategoryId !== 'الكل' && (
            <button
              onClick={() => onSelectCategory('الكل')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline"
            >
              عرض الكل (إلغاء التحديد)
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {categories.map((cat) => {
            const isSelected = activeCategoryId === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-1.5 shadow-xs relative group ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/50 shadow-md scale-[1.02]'
                    : 'bg-white hover:bg-stone-50 border-stone-200 hover:border-emerald-300'
                }`}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`${cat.title}، ${cat.count}`}
              >
                {/* Visual Icon */}
                <span className="text-3xl filter drop-shadow-xs group-hover:scale-110 transition duration-200">
                  {cat.icon}
                </span>

                {/* Title */}
                <span className="font-black text-xs text-stone-900">
                  {cat.title}
                </span>

                {/* Smart Badge (العداد الذكي الفوري) */}
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${cat.badgeBg} ${cat.badgeText} border border-current/20`}>
                  {cat.count}
                </span>

                {/* Subtag snippet */}
                <span className="text-[9px] text-stone-500 font-medium line-clamp-1 max-w-[110px]">
                  {cat.tag}
                </span>

                {/* Active check indicator */}
                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600"></span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. DEDICATED SECTION A: Certified Nurseries (قسم المشاتل والشتلات المعتمدة) */}
      {activeCategoryId === 'المشاتل' && (
        <div className="bg-gradient-to-br from-blue-50/80 via-white to-blue-50/50 border-2 border-blue-300 rounded-3xl p-5 shadow-sm space-y-4 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-200 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-700 text-white rounded-2xl shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-base text-stone-900">
                    قسم المشاتل والشتلات المعتمدة لنقاوة الصنف
                  </h4>
                  <span className="bg-blue-700 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                    مفتشية حماية النباتات INPV / DSA
                  </span>
                </div>
                <p className="text-xs text-stone-600">
                  شتلات زيتون الشملال (Chemlal) والسيغواز (Sigoise) بميلة ومعسكر وجيجل • حماية من بكتيريا Xylella والشتلات المغشوشة
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const speech = 'قسم المشاتل المعتمدة. يعرض شتلات الزيتون المعتمدة رسمياً من المفتشية الولائية لحماية النباتات لنقاوة الصنف مثل شتلات الشملال بميلة والسيغواز بمعسكر، مع ضمان الخلو التام من بكتيريا كسيليلا فاستيديوزا لمنع انتشار الأمراض أو الشتلات المغشوشة.';
                speakText(speech, 'معايير المشاتل المعتمدة');
              }}
              className="flex items-center gap-1.5 bg-blue-100 hover:bg-blue-200 text-blue-950 px-3 py-1.5 rounded-xl text-xs font-bold transition"
              title="استمع لمعايير اعتماد المشاتل"
            >
              <Volume2 className="w-4 h-4 text-blue-700" />
              <span>نطق المعايير</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_NURSERIES.map((nur) => (
              <div key={nur.id} className="bg-white rounded-2xl p-4 border border-blue-200 shadow-xs flex flex-col justify-between gap-3">
                <div className="flex items-start gap-3">
                  <img
                    src={nur.image}
                    alt={nur.name}
                    className="w-20 h-20 rounded-xl object-cover border border-stone-200 shrink-0"
                  />
                  <div className="space-y-1 min-w-0">
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      {nur.variety}
                    </span>
                    <h5 className="font-black text-sm text-stone-900 leading-snug line-clamp-2">
                      {nur.name}
                    </h5>
                    <p className="text-xs text-stone-600 font-medium">
                      المشتلة: <strong className="text-stone-800">{nur.nurseryName}</strong> ({nur.wilaya} - {nur.commune})
                    </p>
                    <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{nur.phytosanitaryStatus}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-stone-50 rounded-xl p-2.5 text-xs text-stone-700 flex flex-wrap items-center justify-between gap-2 border border-stone-200">
                  <div>
                    <span className="text-[10px] text-stone-500 block">سعر الشتلة الواحدة</span>
                    <strong className="font-mono text-sm text-emerald-800">{nur.unitPriceDzd} دج</strong>
                    <span className="text-[10px] text-stone-500 mr-2 font-mono">(المتاح: {nur.quantityAvailable.toLocaleString()} شتلة)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${nur.phone}`}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition"
                    >
                      <Phone className="w-3 h-3" />
                      <span>اتصال بالمشتلة</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setSelectedNursery(nur)}
                      className="px-2.5 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-bold transition flex items-center gap-1"
                      title="عرض شهادة الاعتماد الولائية"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>الشهادة</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. DEDICATED SECTION B: Equipment & Agro-Supplies (تصنيف المعدات والخدمات الفلاحية B2B) */}
      {activeCategoryId === 'المعدات' && (
        <div className="bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/50 border-2 border-indigo-300 rounded-3xl p-5 shadow-sm space-y-4 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-200 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-700 text-white rounded-2xl shadow-sm">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-base text-stone-900">
                    تصنيف المعدات والخدمات الفلاحية (B2B Agro-Supplies)
                  </h4>
                  <span className="bg-indigo-700 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                    مكننة فلاحية وطنية
                  </span>
                </div>
                <p className="text-xs text-stone-600">
                  كراء جرارات سيرتا (Cirta) • صهاريج مياه 6000L للسقي • مضخات الطاقة الشمسية للآبار الارتوازية
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const speech = 'تصنيف المعدات والخدمات الفلاحية بي تو بي. يربط الفلاحين بكراء جرارات سيرتا الوطنية التابعة لواد حميمين قسنطينة، صهاريج نقل المياه في فترات الجفاف، ومضخات الطاقة الشمسية للآبار مع تحديد الإحداثيات والمسافة الأقرب للمزرعة.';
                speakText(speech, 'المعدات والعتاد الفلاحي');
              }}
              className="flex items-center gap-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-950 px-3 py-1.5 rounded-xl text-xs font-bold transition"
            >
              <Volume2 className="w-4 h-4 text-indigo-700" />
              <span>نطق التفاصيل</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {equipmentList.map((eq) => (
              <div key={eq.id} className="bg-white rounded-2xl p-4 border border-indigo-200 shadow-xs flex flex-col justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      {eq.equipmentType || eq.category}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-stone-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-500" />
                      <span>{eq.distanceKm ? `يبعد ${eq.distanceKm} كم` : eq.wilaya}</span>
                    </span>
                  </div>

                  <h5 className="font-extrabold text-sm text-stone-900 leading-snug">
                    {eq.title}
                  </h5>

                  <p className="text-xs text-stone-600 line-clamp-2">
                    {eq.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {eq.specs.slice(0, 3).map((spec, i) => (
                      <span key={i} className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-medium">
                        • {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-stone-500 block">سعر الكراء / الخدمة</span>
                    <strong className="font-mono text-sm text-indigo-900">{eq.price.toLocaleString()} دج</strong>
                    <span className="text-[10px] text-stone-500 mr-1">/ {eq.priceUnit}</span>
                  </div>

                  <a
                    href={`tel:${eq.ownerPhone}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-700 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition shadow-xs"
                  >
                    <Phone className="w-3 h-3" />
                    <span>حجز العتاد</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nursery Detail Modal */}
      {selectedNursery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-blue-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-blue-100 text-blue-800 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="font-extrabold text-sm text-stone-900">شهادة نقاوة الصنف والاعتماد المخبري</h4>
                  <p className="text-[11px] text-stone-500">{selectedNursery.inspectionBody}</p>
                </div>
              </div>
              <button onClick={() => setSelectedNursery(null)} className="p-1 rounded-lg hover:bg-stone-100 text-stone-500">
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-stone-700">
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                <span className="text-[10px] text-blue-800 font-bold block">رقم الشهادة الرسمية:</span>
                <strong className="font-mono text-sm text-blue-950">{selectedNursery.certificateNumber}</strong>
              </div>
              <p><strong>• الصنف:</strong> {selectedNursery.variety}</p>
              <p><strong>• رقم الدفعة:</strong> <span className="font-mono font-bold">{selectedNursery.lotNumber}</span></p>
              <p><strong>• السلامة الصحية:</strong> {selectedNursery.phytosanitaryStatus}</p>
              <p><strong>• عمر الشتلة:</strong> {selectedNursery.ageMonths} شهراً • الارتفاع: {selectedNursery.heightCm} سم</p>
              <p><strong>• الموقع:</strong> {selectedNursery.wilaya} - {selectedNursery.commune}</p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <a
                href={`tel:${selectedNursery.phone}`}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                <Phone className="w-4 h-4" />
                <span>اتصال بالمشتلة الآن ({selectedNursery.phone})</span>
              </a>
              <button
                onClick={() => setSelectedNursery(null)}
                className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-bold"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
