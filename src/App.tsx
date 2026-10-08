import React, { useState, useEffect } from 'react';
import { 
  MOCK_FARMS, 
  MOCK_CROPS, 
  MOCK_CARRIERS, 
  MOCK_EQUIPMENT, 
  MOCK_MARKET_PRICES, 
  MOCK_WEATHER_ALERTS 
} from './data/mockData';
import { Farm, Crop, Carrier, StoryReel, PreOrderRequest } from './types/agritech';

// Components
import { Header } from './components/Header';
import { CropMarketplace } from './components/CropMarketplace';
import { GisMapPolygon } from './components/GisMapPolygon';
import { CarrierMatching } from './components/CarrierMatching';
import { PreOrderSection } from './components/PreOrderSection';
import { EquipmentB2B } from './components/EquipmentB2B';
import { MarketTrends } from './components/MarketTrends';

// Modals
import { TraceabilityModal } from './components/TraceabilityModal';
import { PreOrderModal } from './components/PreOrderModal';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { StoryReelModal } from './components/StoryReelModal';
import { ContractRequestModal } from './components/ContractRequestModal';
import { AddCropModal } from './components/AddCropModal';
import { ArchitectureModal } from './components/ArchitectureModal';

import { 
  Sprout, 
  ShieldCheck, 
  Layers, 
  Truck, 
  TrendingUp, 
  CheckCircle2, 
  Cpu, 
  Wifi, 
  WifiOff, 
  Sparkles,
  ArrowUpRight,
  Info
} from 'lucide-react';

export default function App() {
  // App State
  const [activeTab, setActiveTab] = useState<'market' | 'gis' | 'preorder' | 'carriers' | 'equipment' | 'trends'>('market');
  const [selectedWilaya, setSelectedWilaya] = useState<string>('الكل');
  
  // Data State
  const [farms, setFarms] = useState<Farm[]>(MOCK_FARMS);
  const [crops, setCrops] = useState<Crop[]>(MOCK_CROPS);
  const [carriers, setCarriers] = useState<Carrier[]>(MOCK_CARRIERS);
  const [equipmentList, setEquipmentList] = useState(MOCK_EQUIPMENT);
  const [preOrderRequests, setPreOrderRequests] = useState<PreOrderRequest[]>([
    {
      id: 'po-1',
      cropId: 'crop-2',
      cropTitle: 'تمور دقلة نور أصيلة شمروخية',
      farmerName: 'الشيخ عبد الرزاق بن عمار',
      buyerName: 'سلسلة فنادق الأوراسي الجزائر',
      buyerPhone: '0550998877',
      buyerType: 'مطعم / فندق',
      quantity: 45,
      offeredPricePerUnit: 48000,
      deliveryNeeded: true,
      destinationWilaya: 'الجزائر العاصمة',
      notes: 'توصيل مبرد قبل بداية شهر رمضان',
      createdAt: '2026-10-07',
      status: 'تم تأكيد العقد'
    },
    {
      id: 'po-2',
      cropId: 'crop-1',
      cropTitle: 'زيت زيتون بكر ممتاز معصور على البارد',
      farmerName: 'الحاج بلقاسم مرابط',
      buyerName: 'تعاونية أسواق التغذية الصحية بوهران',
      buyerPhone: '0661223344',
      buyerType: 'تاجر جملة',
      quantity: 800,
      offeredPricePerUnit: 880,
      deliveryNeeded: true,
      destinationWilaya: 'وهران',
      notes: 'مع شهادة التحليل المخبري لحموضة 0.24%',
      createdAt: '2026-10-08',
      status: 'مقبول مبدئياً'
    }
  ]);

  // Offline-First Simulation State
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [offlineQueue, setOfflineQueue] = useState<Partial<Crop>[]>([]);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Modal States
  const [voiceInputOpen, setVoiceInputOpen] = useState<boolean>(false);
  const [addCropOpen, setAddCropOpen] = useState<boolean>(false);
  const [traceabilityFarm, setTraceabilityFarm] = useState<Farm | null>(null);
  const [preOrderCrop, setPreOrderCrop] = useState<Crop | null>(null);
  const [storyReel, setStoryReel] = useState<StoryReel | null>(null);
  const [contractCrop, setContractCrop] = useState<Crop | null>(null);
  const [architectureOpen, setArchitectureOpen] = useState<boolean>(false);

  // Sync background queue when switching from Offline to Online
  useEffect(() => {
    if (!isOffline && offlineQueue.length > 0) {
      setSyncNotice(`جاري المزامنة السحابية لـ ${offlineQueue.length} من المحاصيل المحفوظة محلياً أثناء انقطاع التغطية...`);
      
      const timer = setTimeout(() => {
        // Append offline items to live state
        const syncedCrops: Crop[] = offlineQueue.map((item, idx) => ({
          id: `synced-${Date.now()}-${idx}`,
          farmId: 'farm-1',
          farmName: 'مزرعة محلية موثقة',
          farmerName: 'فلاح المنظومة',
          farmerPhone: '0555000000',
          farmerWhatsapp: '213555000000',
          wilaya: item.wilaya || 'ميلة (Mila)',
          commune: item.commune || 'مركز الولاية',
          title: item.title || 'محصول جديد',
          variety: item.variety || 'صنف ممتاز',
          category: item.category || 'خضروات',
          quantityAvailable: item.quantityAvailable || 50,
          unit: item.unit || 'قنطار',
          pricePerUnit: item.pricePerUnit || 5000,
          harvestStatus: item.harvestStatus || 'جاهز للشحن الفوري',
          harvestDateEstimated: item.harvestDateEstimated || '2026-10-25',
          daysToHarvest: item.daysToHarvest || 0,
          minimumOrder: 5,
          image: item.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
          images: [],
          description: item.description || '',
          isPreOrderAllowed: item.harvestStatus === 'حجز مسبق قبل الجني',
          preOrdersCount: 0,
          preOrderedQuantity: 0,
          verifiedDirect: true,
          soilType: 'تربة فلاحية خصبة',
        }));

        setCrops(prev => [...syncedCrops, ...prev]);
        setOfflineQueue([]);
        setSyncNotice('اكتملت المزامنة بنجاح! تم نشر جميع المحاصيل بنجاح في قاعدة البيانات المركزية.');

        setTimeout(() => setSyncNotice(null), 4000);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isOffline, offlineQueue]);

  // Handler for saving crop from voice or modal
  const handleSaveCrop = (cropData: Partial<Crop>, isOfflineSave: boolean) => {
    if (isOfflineSave) {
      setOfflineQueue(prev => [...prev, cropData]);
    } else {
      const newCrop: Crop = {
        id: `crop-${Date.now()}`,
        farmId: 'farm-1',
        farmName: cropData.farmName || 'مزرعة الحاج العربي',
        farmerName: cropData.farmerName || 'الحاج العربي',
        farmerPhone: cropData.farmerPhone || '0555123456',
        farmerWhatsapp: cropData.farmerWhatsapp || '213555123456',
        wilaya: cropData.wilaya || 'ميلة (Mila)',
        commune: cropData.commune || 'شلغوم العيد',
        title: cropData.title || 'محصول جديد',
        variety: cropData.variety || 'صنف ممتاز',
        category: cropData.category || 'خضروات',
        quantityAvailable: cropData.quantityAvailable || 100,
        unit: cropData.unit || 'قنطار',
        pricePerUnit: cropData.pricePerUnit || 6000,
        harvestStatus: cropData.harvestStatus || 'جاهز للشحن الفوري',
        harvestDateEstimated: cropData.harvestDateEstimated || '2026-10-20',
        daysToHarvest: cropData.daysToHarvest || 0,
        minimumOrder: cropData.minimumOrder || 5,
        image: cropData.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        images: [],
        description: cropData.description || 'محصول عالي الجودة مباشر من الحقل.',
        isPreOrderAllowed: cropData.harvestStatus === 'حجز مسبق قبل الجني',
        preOrdersCount: 0,
        preOrderedQuantity: 0,
        verifiedDirect: true,
        soilType: 'تربة فلاحية محلية',
        labCertificate: cropData.labCertificate,
      };

      setCrops(prev => [newCrop, ...prev]);
    }
  };

  // Handler for submitting purchase intent
  const handleAddPreOrder = (req: Omit<PreOrderRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: PreOrderRequest = {
      ...req,
      id: `po-${Date.now()}`,
      createdAt: '2026-10-08',
      status: 'قيد المراجعة',
    };

    setPreOrderRequests(prev => [newReq, ...prev]);

    // Update crop reserved quantity
    setCrops(prev => prev.map(c => {
      if (c.id === req.cropId) {
        return {
          ...c,
          preOrdersCount: c.preOrdersCount + 1,
          preOrderedQuantity: c.preOrderedQuantity + req.quantity,
        };
      }
      return c;
    }));
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-['Cairo',sans-serif] text-stone-900 selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOffline={isOffline}
        setIsOffline={setIsOffline}
        onOpenVoiceInput={() => setVoiceInputOpen(true)}
        onOpenAddCrop={() => setAddCropOpen(true)}
        pendingOfflineCount={offlineQueue.length}
      />

      {/* Sync Notification Banner */}
      {syncNotice && (
        <div className="bg-emerald-700 text-white py-2 px-4 text-xs font-bold shadow-md transition-all animate-fade-in flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-300 animate-spin" />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* KPI Strip & Architectural Overview trigger */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-stone-500 font-bold block">مزارع موثقة بالكامل</span>
              <span className="text-base font-black text-stone-900 font-mono">1,480+ مزرعة</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-800 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-stone-500 font-bold block">مساحة ممسوحة (GIS)</span>
              <span className="text-base font-black text-stone-900 font-mono">32,400 هكتار</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-stone-500 font-bold block">توفير إلغاء السماسرة</span>
              <span className="text-base font-black text-amber-800 font-mono">25% - 30%</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100 text-indigo-800 rounded-xl">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-stone-500 font-bold block">شاحنات وسلسلة تبريد</span>
              <span className="text-base font-black text-stone-900 font-mono">260 شاحنة</span>
            </div>
          </div>

          {/* Button to view the full Architecture & Strategic Analysis */}
          <button
            onClick={() => setArchitectureOpen(true)}
            className="col-span-2 lg:col-span-1 bg-gradient-to-r from-emerald-800 to-stone-900 hover:from-emerald-900 hover:to-stone-950 text-white p-3 rounded-2xl shadow-xs transition flex items-center justify-between text-right group"
          >
            <div>
              <span className="text-[10px] text-emerald-300 font-bold block flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                المعمارية وخطة MVP
              </span>
              <span className="text-xs font-black">تحليل المنظومة والرؤية</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
          </button>
        </div>

        {/* Tab Views */}
        {activeTab === 'market' && (
          <CropMarketplace
            crops={crops}
            farms={farms}
            onOpenPreOrder={(c) => setPreOrderCrop(c)}
            onOpenTraceability={(f) => setTraceabilityFarm(f)}
            onOpenStoryReel={(r) => setStoryReel(r)}
            onRequestContract={(c) => setContractCrop(c)}
          />
        )}

        {activeTab === 'gis' && (
          <GisMapPolygon
            farms={farms}
            crops={crops}
            selectedWilaya={selectedWilaya}
            setSelectedWilaya={setSelectedWilaya}
            onSelectFarm={(f) => {}}
            onOpenTraceability={(f) => setTraceabilityFarm(f)}
            onOpenPreOrder={(c) => setPreOrderCrop(c)}
          />
        )}

        {activeTab === 'preorder' && (
          <PreOrderSection
            crops={crops}
            onOpenPreOrder={(c) => setPreOrderCrop(c)}
            preOrderRequests={preOrderRequests}
          />
        )}

        {activeTab === 'carriers' && (
          <CarrierMatching
            carriers={carriers}
          />
        )}

        {activeTab === 'equipment' && (
          <EquipmentB2B
            equipmentList={equipmentList}
          />
        )}

        {activeTab === 'trends' && (
          <MarketTrends
            prices={MOCK_MARKET_PRICES}
            weatherAlerts={MOCK_WEATHER_ALERTS}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 text-xs py-8 border-t border-stone-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>فلاّح تيك | Fllah.dz</span>
              <span className="text-emerald-400 text-xs">منظومة AgriTech الوطنية</span>
            </div>
            <p className="text-stone-400 text-xs">
              الربط المباشر بين المزارع والمشترين • تتبع مخبري للجودة • مسح جغرافي للقطع الفلاحية • لوجستيات وسلسلة تبريد.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-400">
            <button 
              onClick={() => setArchitectureOpen(true)} 
              className="hover:text-emerald-400 transition underline"
            >
              مصفوفة الميزات والمعمارية
            </button>
            <span>•</span>
            <span className="font-mono text-emerald-400">Fllah.dz © 2026 Algeria</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {traceabilityFarm && (
        <TraceabilityModal
          farm={traceabilityFarm}
          onClose={() => setTraceabilityFarm(null)}
        />
      )}

      {preOrderCrop && (
        <PreOrderModal
          crop={preOrderCrop}
          onClose={() => setPreOrderCrop(null)}
          onSubmit={handleAddPreOrder}
        />
      )}

      {voiceInputOpen && (
        <VoiceAssistantModal
          onClose={() => setVoiceInputOpen(false)}
          onSaveCrop={handleSaveCrop}
          isOfflineMode={isOffline}
        />
      )}

      {storyReel && (
        <StoryReelModal
          reel={storyReel}
          onClose={() => setStoryReel(null)}
        />
      )}

      {contractCrop && (
        <ContractRequestModal
          crop={contractCrop}
          onClose={() => setContractCrop(null)}
        />
      )}

      {addCropOpen && (
        <AddCropModal
          onClose={() => setAddCropOpen(false)}
          onAddCrop={(data) => handleSaveCrop(data, isOffline)}
        />
      )}

      {architectureOpen && (
        <ArchitectureModal
          onClose={() => setArchitectureOpen(false)}
        />
      )}
    </div>
  );
}
