import React, { useState, useEffect } from 'react';
import { 
  MOCK_FARMS, 
  MOCK_CROPS, 
  MOCK_CARRIERS, 
  MOCK_EQUIPMENT, 
  MOCK_MARKET_PRICES, 
  MOCK_WEATHER_ALERTS,
  MOCK_ENTERPRISE_CONTRACTS,
  MOCK_PAYMENT_DEPOSITS,
  MOCK_AI_ALERTS
} from './data/mockData';
import { MOCK_PILOT_CLUSTERS, MOCK_STRATEGIC_MOUS } from './data/gtmData';
import { 
  Farm, 
  Crop, 
  Carrier, 
  StoryReel, 
  PreOrderRequest, 
  B2BEnterpriseContract, 
  B2BShipment, 
  PaymentDeposit, 
  AgroAiAlert,
  PilotRegionCluster,
  StrategicMoU
} from './types/agritech';

// Components
import { Header, NavigationTab } from './components/Header';
import { CropMarketplace } from './components/CropMarketplace';
import { GisMapPolygon } from './components/GisMapPolygon';
import { CarrierMatching } from './components/CarrierMatching';
import { PreOrderSection } from './components/PreOrderSection';
import { EquipmentB2B } from './components/EquipmentB2B';
import { MarketTrends } from './components/MarketTrends';
import { EnterpriseB2BDashboard } from './components/EnterpriseB2BDashboard';
import { AiEarlyAgroAlerts } from './components/AiEarlyAgroAlerts';
import { GtmStrategyDashboard } from './components/GtmStrategyDashboard';
import { AccessibilityAudioBar } from './components/AccessibilityAudioBar';

// Modals
import { TraceabilityModal } from './components/TraceabilityModal';
import { PreOrderModal } from './components/PreOrderModal';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { StoryReelModal } from './components/StoryReelModal';
import { ContractRequestModal } from './components/ContractRequestModal';
import { AddCropModal } from './components/AddCropModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { EdahabiaCibPaymentModal } from './components/EdahabiaCibPaymentModal';
import { CreateB2BContractModal } from './components/CreateB2BContractModal';
import { ShipmentLabCertificateModal } from './components/ShipmentLabCertificateModal';
import { B2BContractAgreementModal } from './components/B2BContractAgreementModal';
import { EscrowNodeBackendModal } from './components/EscrowNodeBackendModal';
import { FarmTechnicalSettingsModal } from './components/FarmTechnicalSettingsModal';
import { FarmPublicProfileModal } from './components/FarmPublicProfileModal';
import { FlutterCodeModal } from './components/FlutterCodeModal';

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
  Building2,
  Lock,
  CreditCard,
  Compass
} from 'lucide-react';

export default function App() {
  // App Navigation & Wilaya State
  const [activeTab, setActiveTab] = useState<NavigationTab>('market');
  const [selectedWilaya, setSelectedWilaya] = useState<string>('الكل');
  
  // Agricultural Datasets State
  const [farms, setFarms] = useState<Farm[]>(MOCK_FARMS);
  const [crops, setCrops] = useState<Crop[]>(MOCK_CROPS);
  const [carriers, setCarriers] = useState<Carrier[]>(MOCK_CARRIERS);
  const [equipmentList, setEquipmentList] = useState(MOCK_EQUIPMENT);
  const [enterpriseContracts, setEnterpriseContracts] = useState<B2BEnterpriseContract[]>(MOCK_ENTERPRISE_CONTRACTS);
  const [aiAlerts, setAiAlerts] = useState<AgroAiAlert[]>(MOCK_AI_ALERTS);
  const [paymentDeposits, setPaymentDeposits] = useState<PaymentDeposit[]>(MOCK_PAYMENT_DEPOSITS);

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
      status: 'عربون مضمون في الضمان (Escrow) ✓'
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
      status: 'عربون مضمون في الضمان (Escrow) ✓'
    }
  ]);

  // Offline-First Simulation State
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [offlineQueue, setOfflineQueue] = useState<Partial<Crop>[]>([]);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Modals Visibility State
  const [voiceInputOpen, setVoiceInputOpen] = useState<boolean>(false);
  const [addCropOpen, setAddCropOpen] = useState<boolean>(false);
  const [traceabilityFarm, setTraceabilityFarm] = useState<Farm | null>(null);
  const [preOrderCrop, setPreOrderCrop] = useState<Crop | null>(null);
  const [storyReel, setStoryReel] = useState<StoryReel | null>(null);
  const [contractCrop, setContractCrop] = useState<Crop | null>(null);
  const [architectureOpen, setArchitectureOpen] = useState<boolean>(false);
  const [paymentModalPreOrder, setPaymentModalPreOrder] = useState<PreOrderRequest | null>(null);
  const [createContractModalOpen, setCreateContractModalOpen] = useState<boolean>(false);
  const [selectedShipmentLab, setSelectedShipmentLab] = useState<B2BShipment | null>(null);
  const [b2bAgreementModalOpen, setB2bAgreementModalOpen] = useState<boolean>(false);
  const [escrowNodeModalOpen, setEscrowNodeModalOpen] = useState<boolean>(false);
  const [farmSettingsOpen, setFarmSettingsOpen] = useState<boolean>(false);
  const [publicProfileFarm, setPublicProfileFarm] = useState<Farm | null>(null);
  const [flutterModalOpen, setFlutterModalOpen] = useState<boolean>(false);

  const handleUpdateFarm = (updatedFarm: Farm) => {
    setFarms(prev => prev.map(f => f.id === updatedFarm.id ? updatedFarm : f));
    setSyncNotice(`تم تحديث المعايير التقنية ومصادر السقي لمزرعة "${updatedFarm.name}" بنجاح!`);
    setTimeout(() => setSyncNotice(null), 4000);
  };

  // Sync background queue when switching from Offline to Online
  useEffect(() => {
    if (!isOffline && offlineQueue.length > 0) {
      setSyncNotice(`جاري المزامنة السحابية لـ ${offlineQueue.length} من المحاصيل المحفوظة محلياً أثناء انقطاع التغطية...`);
      
      const timer = setTimeout(() => {
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
      createdAt: '2026-10-09',
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

    // Prompt user to secure deposit right away
    setTimeout(() => {
      setPaymentModalPreOrder(newReq);
    }, 600);
  };

  // Handler for successful deposit payment
  const handlePaymentSuccess = (deposit: PaymentDeposit) => {
    setPaymentDeposits(prev => [deposit, ...prev]);
    
    // Update pre-order status to secured by Escrow
    setPreOrderRequests(prev => prev.map(p => {
      if (p.id === deposit.preOrderId) {
        return { ...p, status: 'عربون مضمون في الضمان (Escrow) ✓' };
      }
      return p;
    }));

    setSyncNotice(`تم تأكيد إيداع العربون بقيمة ${deposit.amountDzd.toLocaleString()} دج بنجاح عبر ${deposit.cardType} برقم ترخيص ${deposit.authCode}`);
    setTimeout(() => setSyncNotice(null), 5000);
  };

  // Handler for creating new B2B contract
  const handleCreateB2BContract = (newContract: B2BEnterpriseContract) => {
    setEnterpriseContracts(prev => [newContract, ...prev]);
    setSyncNotice(`تم تثبيت عقد التوريد السنوي رقم ${newContract.contractNumber} لمؤسسة ${newContract.enterpriseName} بنجاح!`);
    setTimeout(() => setSyncNotice(null), 4000);
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
        alertsCount={aiAlerts.length}
        onOpenFarmSettings={() => setFarmSettingsOpen(true)}
      />

      {/* Sync / Payment Notification Banner */}
      {syncNotice && (
        <div className="bg-emerald-700 text-white py-2 px-4 text-xs font-bold shadow-md transition-all animate-fade-in flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-300 animate-spin" />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* KPI Strip & Architectural Overview trigger */}
        <div className="grid grid-cols-2 lg:grid-cols-7 gap-3">
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-stone-500 font-bold block">مزارع موثقة بالكامل</span>
              <span className="text-base font-black text-stone-900 font-mono">1,480+ مزرعة</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('b2b')}
            className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3 cursor-pointer hover:border-emerald-500 transition group"
          >
            <div className="p-2.5 bg-purple-100 text-purple-800 rounded-xl group-hover:scale-105 transition">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-stone-500 font-bold block">عقود توريد B2B</span>
              <span className="text-base font-black text-purple-950 font-mono">{enterpriseContracts.length} عقود كبرى</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('ai-alerts')}
            className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3 cursor-pointer hover:border-emerald-500 transition group"
          >
            <div className="p-2.5 bg-rose-100 text-rose-800 rounded-xl group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <span className="text-[11px] text-stone-500 font-bold block">الإنذار المبكر AI</span>
              <span className="text-base font-black text-rose-700 font-mono">{aiAlerts.length} تنبيهات</span>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('gtm')}
            className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3 cursor-pointer hover:border-emerald-500 transition group"
          >
            <div className="p-2.5 bg-teal-100 text-teal-800 rounded-xl group-hover:scale-105 transition">
              <Compass className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <span className="text-[11px] text-stone-500 font-bold block">خطة الإطلاق GTM</span>
              <span className="text-base font-black text-teal-950 font-mono">3 أقطاب رائدة</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl">
              <Lock className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <span className="text-[11px] text-stone-500 font-bold block">ودائع الضمان (Escrow)</span>
              <span className="text-base font-black text-amber-800 font-mono">
                {paymentDeposits.reduce((acc, d) => acc + d.amountDzd, 0).toLocaleString()} دج
              </span>
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
              <span className="text-xs font-black">تحليل المنظومة</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
          </button>
        </div>

        {/* Tab Views */}
        {activeTab === 'market' && (
          <CropMarketplace
            crops={crops}
            farms={farms}
            equipmentList={equipmentList}
            onOpenPreOrder={(c) => setPreOrderCrop(c)}
            onOpenTraceability={(f) => setTraceabilityFarm(f)}
            onOpenStoryReel={(r) => setStoryReel(r)}
            onRequestContract={(c) => setContractCrop(c)}
            onOpenFarmProfile={(f) => setPublicProfileFarm(f)}
            onOpenGisMap={() => setActiveTab('gis')}
            onOpenAddCrop={() => setAddCropOpen(true)}
            onOpenFlutterCode={() => setFlutterModalOpen(true)}
            onOpenCarrierMatch={() => setActiveTab('carriers')}
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
            onOpenFarmProfile={(f) => setPublicProfileFarm(f)}
            onOpenFarmSettings={() => setFarmSettingsOpen(true)}
          />
        )}

        {activeTab === 'preorder' && (
          <PreOrderSection
            crops={crops}
            onOpenPreOrder={(c) => setPreOrderCrop(c)}
            preOrderRequests={preOrderRequests}
            onOpenPaymentModal={(req) => setPaymentModalPreOrder(req)}
          />
        )}

        {activeTab === 'b2b' && (
          <EnterpriseB2BDashboard
            contracts={enterpriseContracts}
            onOpenNewContractModal={() => setCreateContractModalOpen(true)}
            onOpenShipmentLabReport={(shipment) => setSelectedShipmentLab(shipment)}
            onOpenContractAgreement={() => setB2bAgreementModalOpen(true)}
            onOpenNodeEscrowModal={() => setEscrowNodeModalOpen(true)}
          />
        )}

        {activeTab === 'ai-alerts' && (
          <AiEarlyAgroAlerts
            alerts={aiAlerts}
            weatherInfo={MOCK_WEATHER_ALERTS}
          />
        )}

        {activeTab === 'gtm' && (
          <GtmStrategyDashboard
            clusters={MOCK_PILOT_CLUSTERS}
            mous={MOCK_STRATEGIC_MOUS}
            onSelectClusterWilaya={(w) => {
              setSelectedWilaya(w);
              setActiveTab('gis');
            }}
          />
        )}

        {activeTab === 'carriers' && (
          <CarrierMatching
            carriers={carriers}
            contracts={enterpriseContracts}
          />
        )}

        {activeTab === 'equipment' && (
          <EquipmentB2B
            equipmentList={equipmentList}
            crops={crops}
            farms={farms}
            onOpenGisMap={() => setActiveTab('gis')}
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
              الربط المباشر بين المزارع والمشترين • بوابة المؤسسات B2B • خطة الإطلاق الميداني (3 أقطاب) • ضمان العربون عبر Edahabia/CIB • إنذار مبكر بالذكاء الاصطناعي • لوجستيات وسلسلة تبريد.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-400">
            <button 
              onClick={() => setActiveTab('gtm')} 
              className="hover:text-emerald-400 transition underline font-bold text-emerald-300"
            >
              خطة الإطلاق الميداني (GTM)
            </button>
            <span>•</span>
            <button 
              onClick={() => setActiveTab('b2b')} 
              className="hover:text-emerald-400 transition underline"
            >
              بوابة المؤسسات (B2B)
            </button>
            <span>•</span>
            <button 
              onClick={() => setActiveTab('ai-alerts')} 
              className="hover:text-emerald-400 transition underline"
            >
              الإنذار المبكر (AI Alerts)
            </button>
            <span>•</span>
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
          onOpenOfficialAgreement={() => setB2bAgreementModalOpen(true)}
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

      {/* B2B & Electronic Payment & Lab Modals */}
      {paymentModalPreOrder && (
        <EdahabiaCibPaymentModal
          preOrder={paymentModalPreOrder}
          onClose={() => setPaymentModalPreOrder(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {createContractModalOpen && (
        <CreateB2BContractModal
          crops={crops}
          farms={farms}
          onClose={() => setCreateContractModalOpen(false)}
          onCreateContract={handleCreateB2BContract}
        />
      )}

      {selectedShipmentLab && (
        <ShipmentLabCertificateModal
          shipment={selectedShipmentLab}
          onClose={() => setSelectedShipmentLab(null)}
        />
      )}

      {/* Official Automated B2B Supply Agreement (AGRO-B2B-2026-9081) Modal */}
      <B2BContractAgreementModal
        isOpen={b2bAgreementModalOpen}
        onClose={() => setB2bAgreementModalOpen(false)}
      />

      {/* Node.js (Express + PostgreSQL) Escrow Engine & Lab Verification Sandbox */}
      <EscrowNodeBackendModal
        isOpen={escrowNodeModalOpen}
        onClose={() => setEscrowNodeModalOpen(false)}
      />

      {/* Farm Technical Agronomic & Soil/Irrigation Settings Modal */}
      <FarmTechnicalSettingsModal
        isOpen={farmSettingsOpen}
        onClose={() => setFarmSettingsOpen(false)}
        farms={farms}
        onUpdateFarm={handleUpdateFarm}
        onViewFarmPublicProfile={(farm) => {
          setFarmSettingsOpen(false);
          setPublicProfileFarm(farm);
        }}
      />

      {/* Farm Public Profile Modal with Visual Soil & Water Analytics */}
      {publicProfileFarm && (
        <FarmPublicProfileModal
          farm={publicProfileFarm}
          crops={crops}
          isOpen={!!publicProfileFarm}
          onClose={() => setPublicProfileFarm(null)}
          onOpenSettings={(f) => {
            setPublicProfileFarm(null);
            setFarmSettingsOpen(true);
          }}
          onOpenTraceability={(f) => setTraceabilityFarm(f)}
          onOpenPreOrder={(c) => setPreOrderCrop(c)}
        />
      )}

      {/* Flutter Mobile Architecture & Dart Source Code Modal */}
      <FlutterCodeModal
        isOpen={flutterModalOpen}
        onClose={() => setFlutterModalOpen(false)}
      />

      {/* Floating Audio Bar and Accessibility Controls for Elderly Farmers */}
      <AccessibilityAudioBar />
    </div>
  );
}
