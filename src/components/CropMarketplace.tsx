import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { Crop, Farm, StoryReel, AgriculturalEquipment } from '../types/agritech';
import { GisCategoryPipeline } from './GisCategoryPipeline';
import { QuickSearchMapCard } from './QuickSearchMapCard';
import { 
  Sprout, 
  MapPin, 
  Map,
  PhoneCall, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  TrendingDown, 
  Filter, 
  Search, 
  Eye, 
  FileCheck2, 
  PlayCircle,
  Truck,
  ArrowUpRight,
  Clock,
  Volume2,
  VolumeX,
  Lock,
  CheckCircle2,
  Navigation
} from 'lucide-react';

interface CropMarketplaceProps {
  crops: Crop[];
  farms: Farm[];
  equipmentList?: AgriculturalEquipment[];
  onOpenPreOrder: (crop: Crop) => void;
  onOpenTraceability: (farm: Farm) => void;
  onOpenStoryReel: (reel: StoryReel) => void;
  onRequestContract: (crop: Crop) => void;
  onOpenFarmProfile?: (farm: Farm) => void;
  onOpenGisMap?: () => void;
  onOpenAddCrop?: () => void;
  onOpenFlutterCode?: () => void;
  onOpenCarrierMatch?: () => void;
}

export const CropMarketplace: React.FC<CropMarketplaceProps> = ({
  crops,
  farms,
  equipmentList = [],
  onOpenPreOrder,
  onOpenTraceability,
  onOpenStoryReel,
  onRequestContract,
  onOpenFarmProfile,
  onOpenGisMap = () => {},
  onOpenAddCrop = () => {},
  onOpenFlutterCode = () => {},
  onOpenCarrierMatch = () => {},
}) => {
  const { isAccessibleMode, speakText, isSpeaking, stopSpeaking, currentlySpeakingText } = useAccessibility();
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [selectedWilaya, setSelectedWilaya] = useState<string>('الكل');
  const [harvestFilter, setHarvestFilter] = useState<'all' | 'ready' | 'preorder'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // GIS and Quality Fast Filters
  const [radius50kmActive, setRadius50kmActive] = useState<boolean>(false);
  const [inraaOnlyActive, setInraaOnlyActive] = useState<boolean>(false);
  const [escrowOnlyActive, setEscrowOnlyActive] = useState<boolean>(false);
  const [showQuickMap, setShowQuickMap] = useState<boolean>(true);

  // Aggregate stories from all farms
  const allStories: { reel: StoryReel; farmName: string }[] = farms.flatMap(f => 
    f.stories.map(s => ({ reel: s, farmName: f.name }))
  );

  const isCropWithin50Km = (crop: Crop) => {
    // Spatial proximity calculation relative to Algerian Mila/North-East Cluster center
    return crop.wilaya.includes('ميلة') || crop.wilaya.includes('قسنطينة');
  };

  const matchesCategoryFilter = (crop: Crop) => {
    if (selectedCategory === 'الكل' || selectedCategory === 'حسب الولاية') return true;
    if (selectedCategory === 'الخضر') {
      return crop.category === 'خضروات' || crop.title.includes('خضر') || crop.title.includes('بطاطا') || crop.title.includes('طماطم') || crop.title.includes('ثوم');
    }
    if (selectedCategory === 'الفواكه') {
      return crop.category === 'حمضيات' || crop.category === 'تمور' || crop.category === 'أشجار مثمرة وزيتون' || crop.title.includes('فاكهة') || crop.title.includes('فراولة') || crop.title.includes('برتقال');
    }
    if (selectedCategory === 'المواشي') {
      return crop.category === 'دواجن ومواشي' && (crop.title.includes('أغنام') || crop.variety.includes('أولاد جلال') || crop.unit === 'رأس');
    }
    if (selectedCategory === 'الدواجن') {
      return crop.category === 'دواجن ومواشي' && crop.title.includes('دجاج');
    }
    if (selectedCategory === 'البيض') {
      return crop.title.includes('بيض');
    }
    if (selectedCategory === 'الأرانب') {
      return crop.title.includes('أرانب');
    }
    if (selectedCategory === 'البذور') {
      return crop.title.includes('بذور') || (crop.category === 'حبوب وبقوليات' && crop.title.includes('قمح'));
    }
    if (selectedCategory === 'منتجات أخرى') {
      return crop.category === 'أعلاف' || crop.title.includes('عسل');
    }
    return crop.category === selectedCategory;
  };

  const filteredCrops = crops.filter(crop => {
    const matchesCategory = matchesCategoryFilter(crop);
    const matchesWilaya = selectedWilaya === 'الكل' || crop.wilaya.includes(selectedWilaya);
    const matchesHarvest = 
      harvestFilter === 'all' ||
      (harvestFilter === 'ready' && crop.harvestStatus === 'جاهز للشحن الفوري') ||
      (harvestFilter === 'preorder' && crop.harvestStatus === 'حجز مسبق قبل الجني');
    
    const matchesRadius = !radius50kmActive || isCropWithin50Km(crop);
    const matchesInraa = !inraaOnlyActive || Boolean(crop.labCertificate);
    const matchesEscrow = !escrowOnlyActive || crop.isPreOrderAllowed;

    const matchesSearch = 
      crop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.farmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.commune.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesWilaya && matchesHarvest && matchesRadius && matchesInraa && matchesEscrow && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* 1. Interactive GIS Category Grid Pipeline (شبكة التصنيفات البصرية وخط الفلترة GIS) */}
      <GisCategoryPipeline
        activeCategoryId={selectedCategory}
        onSelectCategory={(catId) => setSelectedCategory(catId)}
        onOpenGisMap={onOpenGisMap}
        onOpenAddCrop={onOpenAddCrop}
        onOpenFlutterCode={onOpenFlutterCode}
        onOpenPreOrder={onOpenPreOrder}
        onOpenCarrierMatch={onOpenCarrierMatch}
        radius50kmActive={radius50kmActive}
        onToggleRadius50km={() => setRadius50kmActive(prev => !prev)}
        inraaOnlyActive={inraaOnlyActive}
        onToggleInraaOnly={() => setInraaOnlyActive(prev => !prev)}
        escrowOnlyActive={escrowOnlyActive}
        onToggleEscrowOnly={() => setEscrowOnlyActive(prev => !prev)}
        selectedWilaya={selectedWilaya}
        onSelectWilaya={(w) => setSelectedWilaya(w)}
        equipmentList={equipmentList}
      />
      {/* Field Reels / Stories Bar - Real-time Field Transparency */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
              <PlayCircle className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-extrabold text-stone-900">
              قصص الحقل الحية (Field Stories & Reels)
            </h3>
            <span className="text-xs text-stone-400 hidden sm:inline">
              • فيديوهات وصور موثقة ومباشرة من الفلاحين في الحقول لضمان الشفافية
            </span>
          </div>
          <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
            محدث اليوم
          </span>
        </div>

        {/* Stories Horizontal Scroll */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {allStories.map(({ reel, farmName }) => (
            <div
              key={reel.id}
              onClick={() => onOpenStoryReel(reel)}
              className="group cursor-pointer shrink-0 w-28 sm:w-32 text-center"
            >
              <div className="relative w-28 sm:w-32 h-36 rounded-2xl overflow-hidden p-1 bg-gradient-to-tr from-emerald-500 via-amber-400 to-rose-500 shadow-xs transition group-hover:scale-102">
                <div className="w-full h-full rounded-xl overflow-hidden relative bg-stone-900">
                  <img
                    src={reel.thumbnail}
                    alt={reel.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
                  <div className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur rounded-full p-1 text-white">
                    <PlayCircle className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="absolute bottom-1.5 right-1.5 left-1.5 text-right">
                    <span className="text-[9px] font-bold bg-emerald-600/90 text-white px-1 py-0.2 rounded">
                      {reel.wilaya}
                    </span>
                    <p className="text-[10px] text-white font-bold truncate mt-0.5">
                      {reel.title}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-[11px] font-semibold text-stone-700 truncate mt-1">
                {farmName.split(' ')[0]} {farmName.split(' ')[1]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Direct-to-Buyer Value Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 rounded-2xl p-4 sm:p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-700/80 text-emerald-200 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-500/40">
              Direct-to-Buyer Hub
            </span>
            <h2 className="text-base sm:text-lg font-black">
              شراء مباشر من الحقل • إلغاء هوامش الوسطاء والسماسرة
            </h2>
          </div>
          <p className="text-xs text-emerald-200/90 max-w-2xl">
            توفير يصل حتى 30% للمطاعم ومحلات التجزئة وتجار الجملة مع ضمان شهادات التحاليل المخبرية للتربة، المياه ونسبة الحموضة.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-2.5 text-center">
            <div className="text-xs text-emerald-200">الضمانة</div>
            <div className="text-sm font-black text-white">تحليل مخبري INRAA</div>
          </div>
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-2.5 text-center">
            <div className="text-xs text-emerald-200">اللوجستيات</div>
            <div className="text-sm font-black text-white">نقل مبرد مطابق</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث عن صنف المحصول (مثلاً: دقلة نور، طماطم، زيت زيتون، بطاطا)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pr-9 pl-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Wilaya Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedWilaya}
              onChange={(e) => setSelectedWilaya(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="الكل">جميع الولايات</option>
              <option value="ميلة">ميلة (Mila)</option>
              <option value="قسنطينة">قسنطينة (Constantine)</option>
              <option value="جيجل">جيجل (Jijel)</option>
              <option value="بسكرة">بسكرة (Biskra)</option>
              <option value="معسكر">معسكر (Mascara)</option>
              <option value="البليدة">البليدة (Blida)</option>
              <option value="وادي سوف">وادي سوف (El Oued)</option>
            </select>
          </div>

          {/* Harvest Status Toggle */}
          <div className="md:col-span-4 flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-bold text-stone-700">
            <button
              onClick={() => setHarvestFilter('all')}
              className={`flex-1 py-1.5 rounded-lg text-center transition ${
                harvestFilter === 'all' ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setHarvestFilter('ready')}
              className={`flex-1 py-1.5 rounded-lg text-center transition ${
                harvestFilter === 'ready' ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              جاهز للشحن
            </button>
            <button
              onClick={() => setHarvestFilter('preorder')}
              className={`flex-1 py-1.5 rounded-lg text-center transition ${
                harvestFilter === 'preorder' ? 'bg-white text-amber-900 shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              حجز مسبق (Pre-order)
            </button>
          </div>
        </div>

        {/* Category Fast Switcher Pills & Map Card Toggle */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100 pb-1">
          <div className="flex gap-2 overflow-x-auto scrollbar-none flex-1">
            {[
              'الكل',
              'الخضر',
              'الفواكه',
              'المواشي',
              'الدواجن',
              'البيض',
              'الأرانب',
              'البذور',
              'المشاتل',
              'المعدات',
              'منتجات أخرى'
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Map Visibility Toggle */}
          <button
            onClick={() => setShowQuickMap(prev => !prev)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              showQuickMap
                ? 'bg-[#1B4D3E] text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
            }`}
            title={showQuickMap ? 'إخفاء خريطة البحث السريع' : 'إظهار خريطة البحث السريع'}
          >
            <Map className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {showQuickMap ? 'إخفاء الخريطة' : 'خريطة البحث السريع 🗺️'}
            </span>
            <span className="sm:hidden">
              {showQuickMap ? 'الخريطة ✓' : 'خريطة 🗺️'}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Discovery Map Card (OpenStreetMap / Leaflet Widget matching the user's design) */}
      {showQuickMap && (
        <div className="animate-fade-in">
          <QuickSearchMapCard
            crops={crops}
            farms={farms}
            equipmentList={equipmentList}
            onOpenFullMap={onOpenGisMap}
            onSelectCrop={(crop) => onOpenPreOrder(crop)}
            onSelectFarm={(farm) => onOpenFarmProfile?.(farm)}
          />
        </div>
      )}

      {/* Crop Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.map((crop) => {
          const farm = farms.find(f => f.id === crop.farmId);
          const priceSavings = crop.marketAveragePrice 
            ? Math.round(((crop.marketAveragePrice - crop.pricePerUnit) / crop.marketAveragePrice) * 100)
            : 0;

          return (
            <div
              key={crop.id}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Image and Badges */}
                <div className="relative h-48 bg-stone-100 overflow-hidden">
                  <img
                    src={crop.image}
                    alt={crop.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30"></div>

                  {/* Status & Savings Badges */}
                  <div className="absolute top-2.5 right-2.5 flex flex-wrap gap-1.5">
                    {crop.harvestStatus === 'حجز مسبق قبل الجني' ? (
                      <span className="bg-amber-500 text-stone-900 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        حجز مسبق • جني بعد {crop.daysToHarvest} يوم
                      </span>
                    ) : (
                      <span className="bg-emerald-600 text-white font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        جاهز للشحن الفوري
                      </span>
                    )}

                    {priceSavings > 0 && (
                      <span className="bg-rose-600 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <TrendingDown className="w-3 h-3" />
                        توفير {priceSavings}% عن الوسيط
                      </span>
                    )}

                    {/* GIS 50 KM Proximity Badge */}
                    {isCropWithin50Km(crop) && (
                      <span className="bg-blue-600/90 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                        <Navigation className="w-2.5 h-2.5" />
                        <span>نطاق 50 كم 📍</span>
                      </span>
                    )}

                    {/* Escrow 10-15% pre-order badge */}
                    {crop.isPreOrderAllowed && (
                      <span className="bg-amber-400 text-stone-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                        <Lock className="w-2.5 h-2.5" />
                        <span>عربون Escrow ✓</span>
                      </span>
                    )}
                  </div>

                  {/* Traceability Badge */}
                  {crop.labCertificate && (
                    <div className="absolute top-2.5 left-2.5">
                      <button
                        onClick={() => farm && onOpenTraceability(farm)}
                        className="bg-white/90 backdrop-blur hover:bg-white text-emerald-800 text-[10px] font-extrabold px-2 py-1 rounded-lg flex items-center gap-1 shadow-xs transition"
                        title="انقر لفحص شهادة التحاليل المخبرية والتتبع"
                      >
                        <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>شهادة مخبرية INRAA</span>
                      </button>
                    </div>
                  )}

                  {/* Wilaya & Location */}
                  <div className="absolute bottom-2.5 right-2.5 left-2.5 text-white flex items-end justify-between">
                    <div>
                      <span className="text-[11px] font-bold bg-black/50 backdrop-blur px-2 py-0.5 rounded flex items-center gap-1 w-fit mb-1">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        {crop.wilaya} • {crop.commune}
                      </span>
                      <button
                        type="button"
                        onClick={() => farm && onOpenFarmProfile?.(farm)}
                        className="text-xs text-stone-200 hover:text-white font-bold underline-offset-2 hover:underline text-right block"
                        title="انقر لعرض ملف المزرعة العام ومواصفات التربة والسقي"
                      >
                        {crop.farmName} 🏛️
                      </button>
                    </div>

                    {farm && (
                      <button
                        type="button"
                        onClick={() => onOpenFarmProfile?.(farm)}
                        className="bg-black/60 hover:bg-black/80 backdrop-blur text-[10px] text-emerald-300 font-bold px-2 py-1 rounded-lg border border-emerald-400/30 flex items-center gap-1 transition"
                      >
                        <span>ملف المزرعة</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-sm leading-snug line-clamp-2">
                      {crop.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5 font-medium">
                      الصنف: <strong className="text-stone-700">{crop.variety}</strong>
                    </p>
                  </div>

                  {/* Accessible Voice Audio Read Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const isCurrentlySpeakingThis = isSpeaking && currentlySpeakingText?.includes(crop.title.substring(0, 15));
                      if (isCurrentlySpeakingThis) {
                        stopSpeaking();
                      } else {
                        const harvestInfo = crop.harvestStatus === 'حجز مسبق قبل الجني'
                          ? `متبقي ${crop.daysToHarvest} يوم على بدء الجني`
                          : 'المحصول جاهز للشحن الفوري';
                        const certInfo = crop.labCertificate?.acidityLevel
                          ? `شهادة المخبر تثبت حموضة بنسبة ${crop.labCertificate.acidityLevel}`
                          : '';
                        const speech = `محصول: ${crop.title}، صنف: ${crop.variety}، من ${crop.farmName} في ${crop.wilaya}. سعر المزرعة المباشر هو ${crop.pricePerUnit} دينار جزائري لكل ${crop.unit}. الكمية المتاحة: ${crop.quantityAvailable} ${crop.unit}. ${harvestInfo}. ${certInfo}.`;
                        speakText(speech, crop.title, true);
                      }
                    }}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition ${
                      isSpeaking && currentlySpeakingText?.includes(crop.title.substring(0, 15))
                        ? 'bg-amber-400 text-stone-950 shadow-md ring-2 ring-amber-300 animate-pulse'
                        : isAccessibleMode
                        ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-400 shadow-xs'
                        : 'bg-stone-50 hover:bg-amber-50 text-stone-700 hover:text-amber-950 border border-stone-200'
                    }`}
                    title="استمع لتفاصيل المحصول والسعر بصوت مسموع وواضح لكبار السن"
                  >
                    <Volume2 className={`w-4 h-4 shrink-0 ${
                      isSpeaking && currentlySpeakingText?.includes(crop.title.substring(0, 15))
                        ? 'animate-bounce text-stone-950'
                        : 'text-amber-600'
                    }`} />
                    <span>
                      {isSpeaking && currentlySpeakingText?.includes(crop.title.substring(0, 15))
                        ? 'جاري القراءة بصوت مسموع... (انقر للإيقاف)'
                        : 'استمع لتفاصيل المحصول والسعر بصوت مسموع 🔉'}
                    </span>
                  </button>

                  {/* Pricing Comparison (Direct vs Broker) */}
                  <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-stone-500 font-bold">سعر المزرعة المباشر</div>
                      <div className="text-base font-black text-emerald-700 font-mono">
                        {crop.pricePerUnit.toLocaleString()} دج
                        <span className="text-xs font-normal text-stone-600 mr-1">/ {crop.unit}</span>
                      </div>
                    </div>

                    {crop.marketAveragePrice && (
                      <div className="text-left border-r border-stone-200 pr-3">
                        <div className="text-[10px] text-stone-400 font-bold">سعر الوسطاء المتداول</div>
                        <div className="text-xs font-semibold text-stone-400 line-through font-mono">
                          {crop.marketAveragePrice.toLocaleString()} دج
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quantities & Harvest Timeline */}
                  <div className="space-y-1.5 text-xs text-stone-600">
                    <div className="flex justify-between">
                      <span>الكمية المتاحة:</span>
                      <strong className="text-stone-900 font-mono">
                        {crop.quantityAvailable.toLocaleString()} {crop.unit}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>الحد الأدنى للطلب:</span>
                      <strong className="text-stone-800 font-mono">
                        {crop.minimumOrder} {crop.unit}
                      </strong>
                    </div>
                    {crop.harvestStatus === 'حجز مسبق قبل الجني' && (
                      <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-2 text-[11px] text-amber-900 flex justify-between items-center">
                        <span>المحجوز مسبقاً:</span>
                        <span className="font-bold font-mono">
                          {crop.preOrderedQuantity} {crop.unit} ({crop.preOrdersCount} طلب مسبق)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Traceability Info snippet */}
                  {crop.labCertificate?.acidityLevel && (
                    <div className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg font-semibold flex items-center justify-between">
                      <span>حموضة مخبرية: {crop.labCertificate.acidityLevel}</span>
                      <span className="text-emerald-600">خالي من المبيدات ✓</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 space-y-2 border-t border-stone-100">
                <div className="grid grid-cols-2 gap-2 pt-3">
                  <button
                    onClick={() => onOpenPreOrder(crop)}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2 rounded-xl text-xs font-extrabold transition shadow-xs flex items-center justify-center gap-1 active:scale-95"
                  >
                    <span>{crop.harvestStatus === 'حجز مسبق قبل الجني' ? 'حجز مسبق للمحصول' : 'طلب شراء مباشر'}</span>
                  </button>

                  <button
                    onClick={() => onRequestContract(crop)}
                    className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                    title="طلب عقد توريد موسمي للمطاعم والمصانع"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-stone-600" />
                    <span>عقد توريد B2B</span>
                  </button>
                </div>

                {/* Direct Farmer Instant Calls */}
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={`tel:${crop.farmerPhone}`}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200 transition"
                  >
                    <PhoneCall className="w-3 h-3 text-emerald-600" />
                    <span>اتصال بالفلاح</span>
                  </a>
                  <a
                    href={`https://wa.me/${crop.farmerWhatsapp}?text=مرحباً أخي الفلاح، أرغب في حجز كمية من محصول: ${encodeURIComponent(crop.title)} المعروض في Fllah.dz`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
                  >
                    <MessageSquare className="w-3 h-3 text-emerald-700" />
                    <span>واتساب مباشر</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" {...props}>
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
