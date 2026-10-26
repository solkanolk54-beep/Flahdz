import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { Carrier, B2BEnterpriseContract, FrigoTruckTelemetry } from '../types/agritech';
import { MOCK_FRIGO_TRACKING } from '../data/mockData';
import { 
  Truck, 
  MapPin, 
  Calculator, 
  PhoneCall, 
  ShieldCheck, 
  ThermometerSnowflake, 
  ArrowLeftRight, 
  CheckCircle,
  Clock,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  AlertTriangle,
  Radio,
  Navigation,
  Gauge,
  Layers,
  Compass,
  FileCheck2,
  Building2,
  Wifi,
  Sliders,
  Eye,
  Info,
  ChevronDown,
  Search,
  ExternalLink,
  Bell,
  BellRing,
  Send,
  Smartphone,
  MessageSquare,
  Check,
  CheckCheck,
  X,
  AlertOctagon,
  Clock3,
  UserCheck,
  Share2
} from 'lucide-react';

export interface SmartDispatchAlert {
  id: string;
  truckId: string;
  truckPlate: string;
  driverName: string;
  contractNumber: string;
  enterpriseName: string;
  farmName: string;
  cargoTitle: string;
  type: 'temperature_breach' | 'route_delay' | 'door_breach';
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  title: string;
  description: string;
  
  // Dual notification targets
  farmerNotice: {
    farmName: string;
    farmerPhone: string;
    message: string;
    actionRequired: string;
    sentStatus: 'تم الإرسال (SMS/App)' | 'قيد الإرسال';
    sentTime: string;
  };
  
  buyerNotice: {
    enterpriseName: string;
    buyerPhone: string;
    message: string;
    actionRequired: string;
    sentStatus: 'تم الإرسال (SMS/App)' | 'قيد الإرسال';
    sentTime: string;
  };
  
  escrowImpact: string;
  acknowledged: boolean;
  smsSentConfirmation?: boolean;
}

interface CarrierMatchingProps {
  carriers: Carrier[];
  contracts?: B2BEnterpriseContract[];
}

// Distance matrix approximation between key Algerian agricultural wilayas (in KM)
const DISTANCE_MATRIX: Record<string, Record<string, number>> = {
  'البليدة': { 'الجزائر العاصمة': 45, 'وهران': 390, 'قسنطينة': 410, 'سطيف': 300, 'عنابة': 560, 'بسكرة': 420 },
  'ميلة': { 'الجزائر العاصمة': 370, 'قسنطينة': 55, 'سطيف': 95, 'عنابة': 180, 'وهران': 740, 'بسكرة': 240 },
  'بسكرة': { 'الجزائر العاصمة': 430, 'قسنطينة': 230, 'سطيف': 220, 'وهران': 780, 'باتنة': 115, 'الوادي': 220 },
  'معسكر': { 'وهران': 95, 'الجزائر العاصمة': 360, 'مستغانم': 75, 'سيدي بلعباس': 80, 'قسنطينة': 750 },
  'وادي سوف': { 'الجزائر العاصمة': 620, 'قسنطينة': 380, 'بسكرة': 220, 'ورقلة': 230, 'سطيف': 440 },
};

// Cities and agricultural hubs coordinates for map display
const ALGERIA_CITIES = [
  { id: 'algiers', name: 'الجزائر العاصمة', wilaya: 'الجزائر', lat: 36.75, lng: 3.05, role: 'مركز الاستهلاك والفنادق' },
  { id: 'blida', name: 'البليدة (متيجة)', wilaya: 'البليدة', lat: 36.47, lng: 2.83, role: 'بساتين الحمضيات والفواكه' },
  { id: 'chlef', name: 'الشلف', wilaya: 'الشلف', lat: 36.16, lng: 1.33, role: 'محور A1 الغربي' },
  { id: 'oran', name: 'وهران (الكرمة)', wilaya: 'وهران', lat: 35.69, lng: -0.63, role: 'أسواق الجملة الغربية' },
  { id: 'mascara', name: 'معسكر (سيڨ)', wilaya: 'معسكر', lat: 35.39, lng: 0.14, role: 'زيتون المائدة' },
  { id: 'bouira', name: 'البويرة (الأخضرية)', wilaya: 'البويرة', lat: 36.38, lng: 3.90, role: 'ممر جبال جرجرة A1' },
  { id: 'setif', name: 'سطيف (عين أرنات)', wilaya: 'سطيف', lat: 36.19, lng: 5.41, role: 'صوامع ومصانع التحويل' },
  { id: 'mila', name: 'ميلة (شلغوم العيد)', wilaya: 'ميلة', lat: 36.45, lng: 6.26, role: 'زيتون وثوم وبقوليات' },
  { id: 'constantine', name: 'قسنطينة (سيرتا)', wilaya: 'قسنطينة', lat: 36.36, lng: 6.61, role: 'محور الحبوب وسوق الخروب' },
  { id: 'jijel', name: 'جيجل (الكورنيش)', wilaya: 'جيجل', lat: 36.82, lng: 5.76, role: 'زيتون جبلي ودواجن عرب' },
  { id: 'batna', name: 'باتنة (الأوراس)', wilaya: 'باتنة', lat: 35.55, lng: 6.18, role: 'محور RN3 الأوراسي' },
  { id: 'biskra', name: 'بسكرة (طولقة)', wilaya: 'بسكرة', lat: 34.85, lng: 5.73, role: 'واحات دقلة نور' },
  { id: 'el-oued', name: 'وادي سوف (قمار)', wilaya: 'وادي سوف', lat: 33.37, lng: 6.86, role: 'بطاطا الغوط الصحراوية' },
];

// Map projection helper
const MAP_WIDTH = 820;
const MAP_HEIGHT = 500;

function projectCoords(lng: number, lat: number) {
  const minLng = -1.8;
  const maxLng = 8.6;
  const minLat = 32.8;
  const maxLat = 37.6;
  
  const x = ((lng - minLng) / (maxLng - minLng)) * (MAP_WIDTH - 120) + 60;
  const y = ((maxLat - lat) / (maxLat - minLat)) * (MAP_HEIGHT - 90) + 45;
  return { x, y };
}

export const CarrierMatching: React.FC<CarrierMatchingProps> = ({ carriers, contracts = [] }) => {
  const { isAccessibleMode, speakText, isSpeaking, stopSpeaking } = useAccessibility();

  // Primary view mode: 'tracking' for Live Frigo Map or 'matching' for Freight Rates & Booking
  const [activeView, setActiveView] = useState<'tracking' | 'matching'>('tracking');

  // Live Frigo Trucks fleet state
  const [trucks, setTrucks] = useState<FrigoTruckTelemetry[]>(MOCK_FRIGO_TRACKING);
  const [selectedTruckId, setSelectedTruckId] = useState<string>(MOCK_FRIGO_TRACKING[0].id);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [mapLayer, setMapLayer] = useState<'corridors' | 'satellite' | 'heatmap'>('corridors');
  const [filterCorridor, setFilterCorridor] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Smart Notification System State
  const [alerts, setAlerts] = useState<SmartDispatchAlert[]>([
    {
      id: 'alt-init-1',
      truckId: 'trk-1',
      truckPlate: '04891-126-19',
      driverName: 'عثمان بلعرابي',
      contractNumber: 'DZ-B2B-2026-089',
      enterpriseName: 'سلسلة فنادق الأوراسي الجزائر',
      farmName: 'مزرعة سيدي خليفة للزيتون العضوي (ميلة)',
      cargoTitle: 'زيت زيتون بكر ممتاز (1200 لتر)',
      type: 'route_delay',
      severity: 'warning',
      timestamp: 'منذ 12 دقيقة',
      title: 'تأخير غير متوقع على الطريق السيار شرق-غرب A1 (+35 دقيقة)',
      description: 'تباطؤ في حركة المرور وأشغال صيانة قرب نفق الأخضرية بالبويرة، أدى لتأخير شحنة زيت الزيتون المتجهة إلى العاصمة.',
      farmerNotice: {
        farmName: 'مزرعة سيدي خليفة (ميلة)',
        farmerPhone: '0550123456',
        message: 'إشعار المنظومة: شحنتكم رقم SHP-MLA-02 متأخرة 35 دقيقة بسبب أشغال الأخضرية. السائق عثمان يواصل السير بأمان.',
        actionRequired: 'لا يلزم أي تدخل من الفلاح، سلسلة التبريد مستقرة (+7.8°C).',
        sentStatus: 'تم الإرسال (SMS/App)',
        sentTime: 'اليوم، 14:10'
      },
      buyerNotice: {
        enterpriseName: 'سلسلة فنادق الأوراسي الجزائر',
        buyerPhone: '021748200',
        message: 'إشعار تأخير التوريد: موعد وصول شاحنة زيت الزيتون تحدّث إلى 15:45 بدلاً من 15:10. سلسلة التبريد مطابقة تماماً.',
        actionRequired: 'إبلاغ فريق رصيف الاستلام وفنيي فحص الجودة بالموعد المحدث.',
        sentStatus: 'تم الإرسال (SMS/App)',
        sentTime: 'اليوم، 14:10'
      },
      escrowImpact: 'الضمان المالي محمي بالكامل ويظل سارياً دون أي غرامات تأخير قاهرة.',
      acknowledged: false,
      smsSentConfirmation: true
    }
  ]);

  const [notificationHubOpen, setNotificationHubOpen] = useState<boolean>(false);
  const [selectedAlertForModal, setSelectedAlertForModal] = useState<SmartDispatchAlert | null>(null);
  const [broadcastToast, setBroadcastToast] = useState<string | null>(null);

  // Simulation flags for testing
  const [tempAlertSimulated, setTempAlertSimulated] = useState<boolean>(false);
  const [routeDelaySimulated, setRouteDelaySimulated] = useState<boolean>(false);

  // Freight rates calculator state (existing functionality)
  const [originWilaya, setOriginWilaya] = useState<string>('ميلة');
  const [destCity, setDestCity] = useState<string>('الجزائر العاصمة');
  const [cargoTons, setCargoTons] = useState<number>(10);
  const [requireCooling, setRequireCooling] = useState<boolean>(true);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  // Selected truck object
  const selectedTruck = useMemo(() => {
    return trucks.find(t => t.id === selectedTruckId) || trucks[0];
  }, [trucks, selectedTruckId]);

  // Simulation timer: smoothly moves in-transit trucks and fluctuates sensor telemetry realistically
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setTrucks(prevTrucks => {
        return prevTrucks.map(truck => {
          if (truck.status !== 'في الطريق') return truck;

          // Tiny realistic fluctuation in temperature around target
          const tempDelta = (Math.random() - 0.5) * 0.15;
          let newTemp = Math.round((truck.currentTempCelsius + tempDelta) * 10) / 10;
          if (tempAlertSimulated && truck.id === 'trk-1') {
            newTemp = 14.2; // Simulated breach
          }

          // Move along waypoints if distance covered is less than total
          const newCovered = Math.min(truck.totalDistanceKm, truck.coveredDistanceKm + 0.8);
          const progressRatio = newCovered / truck.totalDistanceKm;

          // Interpolate GPS coords between origin and destination via waypoints
          const waypoints = truck.gpsWaypoints;
          let newLat = truck.currentLocation.lat;
          let newLng = truck.currentLocation.lng;

          if (waypoints.length >= 2) {
            const segmentCount = waypoints.length - 1;
            const segmentProgress = progressRatio * segmentCount;
            const segmentIndex = Math.min(Math.floor(segmentProgress), segmentCount - 1);
            const subProgress = segmentProgress - segmentIndex;

            const p1 = waypoints[segmentIndex];
            const p2 = waypoints[segmentIndex + 1];

            newLat = p1.lat + (p2.lat - p1.lat) * subProgress;
            newLng = p1.lng + (p2.lng - p1.lng) * subProgress;
          }

          let newEta = Math.max(0, Math.round((truck.totalDistanceKm - newCovered) / (truck.speedKmH / 60)));
          if (routeDelaySimulated && truck.id === 'trk-1') {
            newEta += 45; // Add simulated traffic delay
          }

          const speedVariance = Math.round((Math.random() - 0.5) * 4);
          const newSpeed = Math.min(90, Math.max(60, truck.speedKmH + speedVariance));

          return {
            ...truck,
            coveredDistanceKm: Math.round(newCovered * 10) / 10,
            etaMinutes: newEta,
            speedKmH: newSpeed,
            currentTempCelsius: newTemp,
            currentLocation: {
              ...truck.currentLocation,
              lat: newLat,
              lng: newLng,
            },
            lastPingTime: 'منذ ثوانٍ قليلة (IoT GPS 4G)',
          };
        });
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isSimulating, tempAlertSimulated, routeDelaySimulated]);

  // SMART ALERT GENERATION: Trigger temperature deviation alert
  const handleTriggerTempBreachAlert = () => {
    if (!tempAlertSimulated) {
      setTempAlertSimulated(true);

      // Mutate truck to breached state
      setTrucks(prev => prev.map(t => {
        if (t.id === 'trk-1') {
          return {
            ...t,
            currentTempCelsius: 14.5,
            coolingStatus: 'خطر كسر سلسلة التبريد',
            escrowStatus: 'عربون مؤمن في Escrow (HELD)',
          };
        }
        return t;
      }));

      // Create dual alert for farmer and buyer
      const newAlert: SmartDispatchAlert = {
        id: `alert-temp-${Date.now()}`,
        truckId: 'trk-1',
        truckPlate: '04891-126-19',
        driverName: 'عثمان بلعرابي',
        contractNumber: 'DZ-B2B-2026-089',
        enterpriseName: 'سلسلة فنادق الأوراسي الجزائر',
        farmName: 'مزرعة سيدي خليفة للزيتون العضوي (ميلة)',
        cargoTitle: 'زيت زيتون بكر ممتاز (1200 لتر)',
        type: 'temperature_breach',
        severity: 'critical',
        timestamp: 'الآن (تنبيه فوري مباشر)',
        title: 'انحراف حرج في درجة حرارة الشاحنة (+14.5°C بدلاً من 8.0°C)',
        description: 'رصد حساس IoT في الثلاجة ارتفاعاً مفاجئاً يتجاوز الحد الأقصى المسموح (10.0°C) في شحنة زيت الزيتون أثناء السير بالبويرة.',
        farmerNotice: {
          farmName: 'مزرعة سيدي خليفة (ميلة)',
          farmerPhone: '0550123456',
          message: 'تنبيه طارئ من فلاّح تيك: شحنتكم رقم SHP-MLA-02 المتجهة للأوراسي سجلت حرارة 14.5°C. تم تجميد تحرير العربون مؤقتاً في Escrow حفاظاً على حقوقكم حتى فحص المخبر. تم الاتصال بالسائق لتفقد الضاغط.',
          actionRequired: 'التواصل الفوري مع السائق عثمان والتأهب لتقرير مخبر CACQE عند الوصول.',
          sentStatus: 'تم الإرسال (SMS/App)',
          sentTime: 'الآن'
        },
        buyerNotice: {
          enterpriseName: 'سلسلة فنادق الأوراسي الجزائر',
          buyerPhone: '021748200',
          message: 'إشعار أمان عاجل: شاحنة التوريد رقم 04891-126-19 سجلت انحرافاً حرارياً (+14.5°C). وفق بروتوكول Escrow، تم حجز العربون المالي (158,400 دج) ولن يُحرر إلا بعد تأكيد سلامة العينات بمخبر معتمد.',
          actionRequired: 'إلزام مراقب الجودة بأخذ عينة مخبرية فورية عند وصول الشاحنة لرصيف الفندق.',
          sentStatus: 'تم الإرسال (SMS/App)',
          sentTime: 'الآن'
        },
        escrowImpact: 'تم تجميد تحرير العربون المالي في Escrow فوراً. الدفعة المالية محمية بنسبة 100%.',
        acknowledged: false,
        smsSentConfirmation: true
      };

      setAlerts(prev => [newAlert, ...prev]);

      setBroadcastToast('تم إرسال إشعار فوري متزامن للفلاح (مزرعة سيدي خليفة) والمشتري (فنادق الأوراسي) عبر SMS والمنظومة!');
      setTimeout(() => setBroadcastToast(null), 6000);
    } else {
      // Restore normal
      setTempAlertSimulated(false);
      setTrucks(prev => prev.map(t => {
        if (t.id === 'trk-1') {
          return {
            ...t,
            currentTempCelsius: 7.8,
            coolingStatus: 'مثالية وآمنة',
          };
        }
        return t;
      }));
      setBroadcastToast('تم استعادة سلسلة التبريد الآمنة للشاحنة (+7.8°C). تم إشعار الطرفين بعودة الاستقرار.');
      setTimeout(() => setBroadcastToast(null), 5000);
    }
  };

  // SMART ALERT GENERATION: Trigger unexpected route delay alert
  const handleTriggerRouteDelayAlert = () => {
    if (!routeDelaySimulated) {
      setRouteDelaySimulated(true);

      const delayMinutes = 55;
      const newAlert: SmartDispatchAlert = {
        id: `alert-delay-${Date.now()}`,
        truckId: 'trk-1',
        truckPlate: '04891-126-19',
        driverName: 'عثمان بلعرابي',
        contractNumber: 'DZ-B2B-2026-089',
        enterpriseName: 'سلسلة فنادق الأوراسي الجزائر',
        farmName: 'مزرعة سيدي خليفة للزيتون العضوي (ميلة)',
        cargoTitle: 'زيت زيتون بكر ممتاز (1200 لتر)',
        type: 'route_delay',
        severity: 'warning',
        timestamp: 'الآن (تنبيه مسار ذكي)',
        title: `تأخير لوجستي غير متوقع في المسار (+${delayMinutes} دقيقة إضافية)`,
        description: `ازدحام مروري حاد وأشغال طارئة بالمسار السريع A1 بين البويرة وتيزي وزو. تم تحديث خوارزمية ETA لإعادة جدولة الاستلام.`,
        farmerNotice: {
          farmName: 'مزرعة سيدي خليفة (ميلة)',
          farmerPhone: '0550123456',
          message: `إشعار تتبع المسار: شحنتكم للشاحنة 04891-126-19 ستتأخر بنحو ${delayMinutes} دقيقة نتيجة ازدحام الطريق السيار. السائق عثمان على تواصل دائم وسلسلة التبريد آمنة.`,
          actionRequired: 'لا يلزم أي إجراء مالي؛ التأخير ناتج عن حالة مرورية طارئة موثقة بالـ GIS.',
          sentStatus: 'تم الإرسال (SMS/App)',
          sentTime: 'الآن'
        },
        buyerNotice: {
          enterpriseName: 'سلسلة فنادق الأوراسي الجزائر',
          buyerPhone: '021748200',
          message: `تحديث موعد التسليم: شحنة زيت الزيتون ستصل بتأخير ${delayMinutes} دقيقة (الموعد المتوقع الجديد: 16:20). تم التثبت من سلامة التبريد لحظياً.`,
          actionRequired: 'تعديل جدول عمال التفريغ واستلام الشحنة حسب التوقيت الجديد.',
          sentStatus: 'تم الإرسال (SMS/App)',
          sentTime: 'الآن'
        },
        escrowImpact: 'عقد التوريد محمي وفق بند القوة القاهرة المؤقتة دون تطبيق غرامات تأخير.',
        acknowledged: false,
        smsSentConfirmation: true
      };

      setAlerts(prev => [newAlert, ...prev]);

      setBroadcastToast('تم إرسال إشعار التأخير الفوري وموعد الوصول المحدث للفلاح والمشتري!');
      setTimeout(() => setBroadcastToast(null), 6000);
    } else {
      setRouteDelaySimulated(false);
      setBroadcastToast('تم انتظام حركة المرور وانفراج المسار اللوجستي. تم إرسال تحديث للطرفين.');
      setTimeout(() => setBroadcastToast(null), 5000);
    }
  };

  // Resend or broadcast manual notification
  const handleResendAlertBroadcast = (alert: SmartDispatchAlert) => {
    setBroadcastToast(`تمت إعادة إرسال الرسالة النصية وتنبيه التطبيق بنجاح إلى الفلاح (${alert.farmerNotice.farmerPhone}) والمشتري (${alert.buyerNotice.buyerPhone})!`);
    setTimeout(() => setBroadcastToast(null), 5000);
  };

  // Announce single alert via accessibility speaker (explicit user click)
  const handleSpeakAlert = (alert: SmartDispatchAlert) => {
    const text = alert.type === 'temperature_breach'
      ? `تنبيه انحراف درجة حرارة الشاحنة ${alert.truckPlate}. تنقل ${alert.cargoTitle} من ${alert.farmName} إلى ${alert.enterpriseName}. الرسالة المرسلة للفلاح: ${alert.farmerNotice.message}. الرسالة المرسلة للمشتري: ${alert.buyerNotice.message}. وضع الضمان المالي: ${alert.escrowImpact}.`
      : `تنبيه تأخير مسار الشحن للشاحنة ${alert.truckPlate}. السائق ${alert.driverName}. التفاصيل: ${alert.description}. تم إشعار الفلاح ${alert.farmerNotice.farmName} والمشتري ${alert.buyerNotice.enterpriseName} بالموعد الجديد.`;
    
    speakText(text, 'تنبيه لوجستي ذكي', true);
  };

  // Acknowledge alert
  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a));
    setBroadcastToast('تم تأكيد مراجعة التنبيه وتدوينه في سجل المراقبة اللوجستية.');
    setTimeout(() => setBroadcastToast(null), 4000);
  };

  // Announce truck telemetry in Arabic using Accessibility Voice (explicit user click)
  const handleSpeakTruckTelemetry = (truck: FrigoTruckTelemetry) => {
    const isAlert = truck.coolingStatus === 'خطر كسر سلسلة التبريد';
    const text = isAlert
      ? `تحذير طارئ لسلسلة التبريد! الشاحنة رقم ${truck.truckPlate} التابعة للسائق ${truck.driverName}. درجة الحرارة الحالية ${truck.currentTempCelsius} مئوية وتتجاوز الحد الأقصى المسموح. تم تجميد تحرير العربون المالي المشفر بمبلغ ${truck.escrowAmountDzd.toLocaleString()} دينار في حساب الضمان إسكرو حمايةً للمشتري.`
      : `تقرير تتبع الشاحنة المبردة رقم ${truck.truckPlate}. السائق ${truck.driverName} من ${truck.carrierCompany}. تنقل حمولة ${truck.cargoTitle} لصالح ${truck.enterpriseName}. المسار الحالي ${truck.routeCorridor}، الموقع قرب ${truck.currentLocation.locality}. درجة حرارة الثلاجة الحالية ${truck.currentTempCelsius} درجات مئوية وحالة سلسلة التبريد ${truck.coolingStatus}. السرعة ${truck.speedKmH} كم في الساعة ووقت الوصول التقديري ${truck.etaMinutes} دقيقة. العربون المالي بقيمة ${truck.escrowAmountDzd.toLocaleString()} دينار مضمون في حساب الضمان حتى الفحص المخبري والاستلام.`;

    speakText(text, 'بيانات تتبع الشاحنة', true);
  };

  // Filtered trucks list
  const filteredTrucks = useMemo(() => {
    return trucks.filter(t => {
      const matchCorridor = filterCorridor === 'all' || t.routeCorridor.includes(filterCorridor) || t.originWilaya.includes(filterCorridor);
      const matchStatus = filterStatus === 'all' || t.status === filterStatus;
      const matchSearch = searchQuery === '' || 
        t.driverName.includes(searchQuery) || 
        t.truckPlate.includes(searchQuery) || 
        t.enterpriseName.includes(searchQuery) ||
        t.cargoTitle.includes(searchQuery);
      return matchCorridor && matchStatus && matchSearch;
    });
  }, [trucks, filterCorridor, filterStatus, searchQuery]);

  // Distance calculator calculations
  const baseOrigin = Object.keys(DISTANCE_MATRIX).find(k => originWilaya.includes(k)) || 'ميلة';
  const estimatedKm = DISTANCE_MATRIX[baseOrigin]?.[destCity] || 350;

  const filteredCarriers = carriers.filter(c => {
    if (requireCooling && !c.vehicleType.includes('Frigo')) {
      return false;
    }
    return true;
  });

  const handleBookCarrier = (carrier: Carrier) => {
    setBookingSuccess(`تم إرسال طلب الشحن بنجاح إلى السائق: ${carrier.driverName}. سيتصل بك لتأكيد موعد التحميل.`);
    setTimeout(() => setBookingSuccess(null), 6000);
  };

  // KPIs
  const activeInTransitCount = trucks.filter(t => t.status === 'في الطريق').length;
  const loadingCount = trucks.filter(t => t.status === 'قيد التحميل بالمزرعة').length;
  const arrivedCount = trucks.filter(t => t.status === 'وصلت للتفريغ والفحص المخبري').length;
  const totalTonsInMotion = trucks.reduce((acc, t) => acc + t.cargoWeightTons, 0);
  const totalEscrowSecuredDzd = trucks.reduce((acc, t) => acc + t.escrowAmountDzd, 0);
  const unreadAlertsCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="space-y-6">
      {/* Top Value Proposition & Mode Switcher */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-md shadow-blue-500/20">
              <Truck className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
                  سلسلة اللوجستيات والتتبع المباشر للشاحنات المبردة (Frigo Telematics & GIS)
                </h2>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                  مربوط بـ Escrow
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                تتبع أقمار اصطناعية لحظي لشاحنات العقود B2B، مراقبة حساسات IoT للحرارة، ونظام إشعارات ذكي للفلاح والمشتري
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Notification Bell with unread pulse counter */}
            <button
              onClick={() => setNotificationHubOpen(true)}
              className="relative p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-2xl transition border border-stone-200 flex items-center gap-2 text-xs font-bold"
              title="مركز الإشعارات الذكي (تنبيهات الفلاح والمشتري)"
            >
              {unreadAlertsCount > 0 ? (
                <BellRing className="w-5 h-5 text-rose-600 animate-bounce" />
              ) : (
                <Bell className="w-5 h-5 text-stone-600" />
              )}
              <span className="hidden sm:inline">مركز التنبيهات الذكي</span>
              {unreadAlertsCount > 0 && (
                <span className="bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full font-mono animate-pulse">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Primary View Switcher Tabs */}
            <div className="flex items-center p-1 bg-stone-100 rounded-2xl border border-stone-200 text-xs font-bold">
              <button
                onClick={() => setActiveView('tracking')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
                  activeView === 'tracking'
                    ? 'bg-white text-blue-900 shadow-sm border border-stone-200'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Navigation className="w-4 h-4 text-blue-600" />
                <span>خريطة التتبع الحية</span>
                <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                  {trucks.length}
                </span>
              </button>

              <button
                onClick={() => setActiveView('matching')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
                  activeView === 'matching'
                    ? 'bg-white text-emerald-900 shadow-sm border border-stone-200'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Calculator className="w-4 h-4 text-emerald-600" />
                <span>حاسبة الشحن</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Live Fleet KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5 pt-5 border-t border-stone-100">
          <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-100">
            <div className="flex items-center justify-between text-blue-800 text-[11px] font-bold mb-1">
              <span>شاحنات في الطريق</span>
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            </div>
            <div className="text-xl font-black text-blue-950 font-mono">
              {activeInTransitCount} <span className="text-xs font-normal text-blue-700">شاحنات Frigo</span>
            </div>
          </div>

          <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100">
            <div className="flex items-center justify-between text-emerald-800 text-[11px] font-bold mb-1">
              <span>سلامة سلسلة التبريد</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-xl font-black text-emerald-950 font-mono">
              {tempAlertSimulated ? (
                <span className="text-rose-600 text-sm font-bold flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> انحراف حراري رُصد
                </span>
              ) : (
                '100% آمنة'
              )}
            </div>
          </div>

          <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-100">
            <div className="flex items-center justify-between text-amber-800 text-[11px] font-bold mb-1">
              <span>انضباط المسار والتوقيت</span>
              <Clock className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-xl font-black text-amber-950 font-mono">
              {routeDelaySimulated ? (
                <span className="text-amber-700 text-sm font-bold">
                  تأخير A1 (+55 د)
                </span>
              ) : (
                'وفق الجدولة'
              )}
            </div>
          </div>

          <div className="bg-purple-50/70 p-3 rounded-2xl border border-purple-100">
            <div className="flex items-center justify-between text-purple-800 text-[11px] font-bold mb-1">
              <span>وصلت للتفريغ والفحص</span>
              <CheckCircle className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div className="text-xl font-black text-purple-950 font-mono">
              {arrivedCount} <span className="text-xs font-normal text-purple-700">بالمؤسسات</span>
            </div>
          </div>

          <div className="bg-stone-900 text-white p-3 rounded-2xl border border-stone-800 col-span-2 sm:col-span-1">
            <div className="text-emerald-400 text-[11px] font-bold mb-1">
              العربون المؤمن في Escrow
            </div>
            <div className="text-base font-black text-white font-mono truncate">
              {totalEscrowSecuredDzd.toLocaleString()} <span className="text-[10px] text-stone-400 font-sans">دج</span>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast Toast Banner */}
      {broadcastToast && (
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-4 rounded-2xl shadow-lg border border-blue-400/40 flex items-center justify-between animate-fade-in text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 font-bold">
            <Smartphone className="w-5 h-5 text-emerald-400 shrink-0 animate-bounce" />
            <span>{broadcastToast}</span>
          </div>
          <button 
            onClick={() => setBroadcastToast(null)}
            className="text-white/80 hover:text-white text-xs underline px-2 py-1"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* ACTIVE SMART ALERT NOTIFICATION BANNER (When critical or unread alerts exist) */}
      {alerts.length > 0 && alerts.some(a => !a.acknowledged) && (
        <div className="bg-gradient-to-r from-rose-950 via-stone-900 to-rose-950 text-white p-4 rounded-3xl border border-rose-600/60 shadow-lg flex flex-wrap items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-rose-600 text-white rounded-2xl animate-pulse">
              <AlertOctagon className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-rose-300 bg-rose-900/60 px-2 py-0.5 rounded-full border border-rose-500">
                  تنبيه ذكي فوري نشط (Smart Alert Dispatched)
                </span>
                <span className="text-xs text-stone-300 font-mono">
                  {alerts[0].timestamp}
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-white mt-1">
                {alerts[0].title}
              </h3>
              <p className="text-xs text-rose-200/90 mt-0.5">
                تم إرسال الإشعار التلقائي للفلاح: <strong>{alerts[0].farmName}</strong> والمشتري: <strong>{alerts[0].enterpriseName}</strong> بنجاح.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSpeakAlert(alerts[0])}
              className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-2 rounded-xl text-xs font-bold border border-stone-700 transition"
              title="الاستماع الصوتي للإشعار باللغة العربية"
            >
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>استماع صوتي 🇩🇿</span>
            </button>

            <button
              onClick={() => {
                setSelectedAlertForModal(alerts[0]);
                setNotificationHubOpen(true);
              }}
              className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-black shadow-md shadow-rose-600/30 transition"
            >
              <Eye className="w-4 h-4" />
              <span>معاينة إشعارات الطرفين</span>
            </button>

            <button
              onClick={() => handleAcknowledgeAlert(alerts[0].id)}
              className="p-2 bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white rounded-xl transition"
              title="تأكيد الاطلاع والمعالجة"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {bookingSuccess && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-md flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{bookingSuccess}</span>
          </div>
          <button 
            onClick={() => setBookingSuccess(null)}
            className="text-white/80 hover:text-white text-xs underline"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* VIEW 1: LIVE INTERACTIVE TRACKING MAP (خرائط التفاعل لشاحنات التبريد B2B) */}
      {activeView === 'tracking' && (
        <div className="space-y-6">
          {/* Map Controls Toolbar with Smart Alert Simulation Buttons */}
          <div className="bg-stone-900 text-white rounded-3xl p-4 sm:p-5 border border-stone-800 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Simulation and Alert Trigger Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsSimulating(!isSimulating)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition ${
                    isSimulating 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/30' 
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                  }`}
                  title={isSimulating ? 'إيقاف مؤقت لمحاكاة GPS' : 'تشغيل محاكاة GPS التفاعلية'}
                >
                  {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isSimulating ? 'تتبع مباشر (نشط)' : 'استئناف التتبع'}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                </button>

                {/* 1. Simulate Temp Breach Alert */}
                <button
                  onClick={handleTriggerTempBreachAlert}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                    tempAlertSimulated
                      ? 'bg-rose-900/90 border-rose-500 text-rose-200'
                      : 'bg-stone-800/80 border-stone-700 text-stone-300 hover:bg-stone-800'
                  }`}
                  title="محاكاة فورية لانحراف درجة حرارة الشاحنة وإشعار الفلاح والمشتري"
                >
                  <AlertTriangle className={`w-3.5 h-3.5 ${tempAlertSimulated ? 'text-rose-400 animate-bounce' : 'text-amber-400'}`} />
                  <span>{tempAlertSimulated ? 'إلغاء انحراف الحرارة' : 'محاكاة انحراف حراري ⚠️'}</span>
                </button>

                {/* 2. Simulate Route Delay Alert */}
                <button
                  onClick={handleTriggerRouteDelayAlert}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                    routeDelaySimulated
                      ? 'bg-amber-900/90 border-amber-500 text-amber-200'
                      : 'bg-stone-800/80 border-stone-700 text-stone-300 hover:bg-stone-800'
                  }`}
                  title="محاكاة فورية لتأخير مسار الشاحنة وإرسال إشعار بالموعد المحدث للفلاح والمشتري"
                >
                  <Clock3 className={`w-3.5 h-3.5 ${routeDelaySimulated ? 'text-amber-400 animate-spin' : 'text-blue-400'}`} />
                  <span>{routeDelaySimulated ? 'إلغاء تأخير المسار' : 'محاكاة تأخير مسار ⏳'}</span>
                </button>
              </div>

              {/* Map Layer Switcher */}
              <div className="flex items-center gap-1 bg-stone-800 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setMapLayer('corridors')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition ${
                    mapLayer === 'corridors' ? 'bg-blue-600 text-white' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  مسارات النقل (Corridors)
                </button>
                <button
                  onClick={() => setMapLayer('satellite')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition ${
                    mapLayer === 'satellite' ? 'bg-blue-600 text-white' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  قمر اصطناعي ليلي
                </button>
                <button
                  onClick={() => setMapLayer('heatmap')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition ${
                    mapLayer === 'heatmap' ? 'bg-blue-600 text-white' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  خريطة التبريد
                </button>
              </div>

              {/* Quick Filters */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-48">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="بحث برقم الشاحنة أو السائق..."
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-stone-800 border border-stone-700 rounded-xl px-2.5 py-2 text-xs font-bold text-stone-300 focus:outline-none"
                >
                  <option value="all">كل الحالات ({trucks.length})</option>
                  <option value="في الطريق">في الطريق ({activeInTransitCount})</option>
                  <option value="قيد التحميل بالمزرعة">قيد التحميل ({loadingCount})</option>
                  <option value="وصلت للتفريغ والفحص المخبري">وصلت ({arrivedCount})</option>
                </select>
              </div>
            </div>
          </div>

          {/* MAIN INTERACTIVE MAP & TELEMETRY SPLIT SCREEN */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Interactive Vector GIS Map Canvas (8 Columns) */}
            <div className="lg:col-span-8 bg-stone-950 rounded-3xl p-4 sm:p-5 border border-stone-800 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[560px]">
              {/* Map Canvas Header HUD */}
              <div className="flex items-center justify-between z-10 bg-stone-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-stone-700/70 text-white text-xs">
                <div className="flex items-center gap-2.5">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="font-bold text-stone-200">الرصد المكاني الحي:</span>
                  <span className="font-mono text-emerald-300">
                    WGS 84 / SRID 4326 (الشبكة اللوجستية الوطنية)
                  </span>
                </div>

                <div className="flex items-center gap-3 text-stone-400 font-mono text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    شاحنة Frigo نشطة
                  </span>
                  <span className="text-stone-600">|</span>
                  <span>{filteredTrucks.length} معروضة</span>
                </div>
              </div>

              {/* Main SVG Vector Interactive Map */}
              <div className="relative my-3 flex-1 flex items-center justify-center select-none overflow-hidden">
                <svg
                  viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                  className="w-full h-full max-h-[480px] drop-shadow-2xl"
                  style={{
                    filter: mapLayer === 'satellite' ? 'contrast(1.25) brightness(0.85)' : 'none'
                  }}
                >
                  <defs>
                    {/* Background Grid Pattern */}
                    <pattern id="frigo-gis-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8" />
                    </pattern>

                    {/* Gradient for Cold Chain Safe Route */}
                    <linearGradient id="route-gradient-safe" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
                    </linearGradient>

                    {/* Gradient for Temp Alert Route */}
                    <linearGradient id="route-gradient-alert" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0.9" />
                    </linearGradient>

                    {/* Glow filter for truck icons */}
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Background grid */}
                  <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="#0c0f14" />
                  <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#frigo-gis-grid)" />

                  {/* Mediterranean Sea outline strip at North */}
                  <path
                    d={`M 0,0 L ${MAP_WIDTH},0 L ${MAP_WIDTH},55 Q 600,45 420,60 Q 200,40 0,65 Z`}
                    fill="#081a2e"
                    opacity="0.6"
                  />
                  <text x="30" y="35" fill="#38bdf8" fontSize="11" fontWeight="bold" opacity="0.4" fontFamily="sans-serif">
                    البحر الأبيض المتوسط (Mediterranean Coast)
                  </text>

                  {/* MAJOR HIGHWAY CORRIDORS (الشبكة اللوجستية الطرقية الرئيسية) */}
                  {/* A1 East-West Highway Corridor (الطريق السيار شرق-غرب) */}
                  {(() => {
                    const cOran = projectCoords(-0.63, 35.69);
                    const cChlef = projectCoords(1.33, 36.16);
                    const cBlida = projectCoords(2.83, 36.47);
                    const cAlgiers = projectCoords(3.05, 36.75);
                    const cBouira = projectCoords(3.90, 36.38);
                    const cSetif = projectCoords(5.41, 36.19);
                    const cMila = projectCoords(6.26, 36.45);
                    const cConstantine = projectCoords(6.61, 36.36);

                    const dPath = `M ${cOran.x},${cOran.y} Q ${(cOran.x+cChlef.x)/2},${cChlef.y+10} ${cChlef.x},${cChlef.y} L ${cBlida.x},${cBlida.y} L ${cAlgiers.x},${cAlgiers.y} L ${cBouira.x},${cBouira.y} L ${cSetif.x},${cSetif.y} L ${cMila.x},${cMila.y} L ${cConstantine.x},${cConstantine.y}`;
                    return (
                      <g>
                        <path
                          d={dPath}
                          fill="none"
                          stroke="rgba(148, 163, 184, 0.25)"
                          strokeWidth="6"
                          strokeLinecap="round"
                        />
                        <path
                          d={dPath}
                          fill="none"
                          stroke={routeDelaySimulated ? '#f59e0b' : '#38bdf8'}
                          strokeWidth="2"
                          strokeDasharray="6 4"
                          opacity="0.8"
                        />
                        {routeDelaySimulated && (
                          <g transform={`translate(${cBouira.x}, ${cBouira.y - 12})`}>
                            <rect x="-40" y="-14" width="80" height="16" rx="4" fill="#78350f" stroke="#fbbf24" strokeWidth="1" />
                            <text x="0" y="-3" fill="#fef3c7" fontSize="8" fontWeight="bold" textAnchor="middle">
                              ⚠️ تباطؤ مروري A1
                            </text>
                          </g>
                        )}
                        <text
                          x={(cBlida.x + cBouira.x) / 2}
                          y={cBouira.y + 24}
                          fill="#94a3b8"
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                          opacity="0.8"
                        >
                          الطريق السيار شرق-غرب (A1 Autoroute)
                        </text>
                      </g>
                    );
                  })()}

                  {/* RN3 Ziban Corridor (محور الزيبان والأوراس: قسنطينة ◄ باتنة ◄ بسكرة) */}
                  {(() => {
                    const cConst = projectCoords(6.61, 36.36);
                    const cBatna = projectCoords(6.18, 35.55);
                    const cBiskra = projectCoords(5.73, 34.85);
                    const dPath = `M ${cConst.x},${cConst.y} L ${cBatna.x},${cBatna.y} L ${cBiskra.x},${cBiskra.y}`;
                    return (
                      <g>
                        <path d={dPath} fill="none" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="4" />
                        <path d={dPath} fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="4 3" opacity="0.6" />
                        <text x={cBatna.x + 15} y={cBatna.y + 10} fill="#fbbf24" fontSize="8" fontWeight="bold">
                          RN3 الأوراس
                        </text>
                      </g>
                    );
                  })()}

                  {/* RN48 El Oued Corridor (محور وادي سوف ◄ بسكرة ◄ سطيف) */}
                  {(() => {
                    const cElOued = projectCoords(6.86, 33.37);
                    const cBiskra = projectCoords(5.73, 34.85);
                    const cSetif = projectCoords(5.41, 36.19);
                    const dPath = `M ${cElOued.x},${cElOued.y} L ${cBiskra.x},${cBiskra.y} L ${cSetif.x},${cSetif.y}`;
                    return (
                      <g>
                        <path d={dPath} fill="none" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="4" />
                        <path d={dPath} fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6" />
                      </g>
                    );
                  })()}

                  {/* RN43 Corniche Corridor (جيجل ◄ بجاية ◄ البويرة ◄ العاصمة) */}
                  {(() => {
                    const cJijel = projectCoords(5.76, 36.82);
                    const cBouira = projectCoords(3.90, 36.38);
                    const dPath = `M ${cJijel.x},${cJijel.y} Q ${(cJijel.x+cBouira.x)/2},${cJijel.y+15} ${cBouira.x},${cBouira.y}`;
                    return (
                      <g>
                        <path d={dPath} fill="none" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="3" />
                        <path d={dPath} fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />
                      </g>
                    );
                  })()}

                  {/* Render Cities & Agricultural Hubs Pins */}
                  {ALGERIA_CITIES.map(city => {
                    const { x, y } = projectCoords(city.lng, city.lat);
                    return (
                      <g key={city.id} className="cursor-pointer group">
                        <circle cx={x} cy={y} r="4" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
                        <circle cx={x} cy={y} r="2" fill="#94a3b8" />
                        <text
                          x={x}
                          y={y - 8}
                          fill="#e2e8f0"
                          fontSize="10"
                          fontWeight="bold"
                          textAnchor="middle"
                          className="pointer-events-none drop-shadow"
                        >
                          {city.name.split(' ')[0]}
                        </text>
                      </g>
                    );
                  })}

                  {/* ACTIVE TRUCK ROUTES & POLYLINES */}
                  {trucks.map(truck => {
                    if (truck.status === 'قيد التحميل بالمزرعة' && truck.coveredDistanceKm === 0) return null;
                    const waypoints = truck.gpsWaypoints.map(wp => projectCoords(wp.lng, wp.lat));
                    const isSelected = truck.id === selectedTruckId;
                    const isAlert = truck.coolingStatus === 'خطر كسر سلسلة التبريد';

                    const pathString = waypoints.reduce((acc, pt, idx) => {
                      return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
                    }, '');

                    return (
                      <g key={`route-${truck.id}`}>
                        {/* Highlight line for selected truck */}
                        <path
                          d={pathString}
                          fill="none"
                          stroke={isAlert ? '#ef4444' : isSelected ? '#3b82f6' : 'rgba(59, 130, 246, 0.3)'}
                          strokeWidth={isSelected ? 4 : 2}
                          strokeLinecap="round"
                          opacity={isSelected ? 0.9 : 0.4}
                        />
                        {isSelected && (
                          <path
                            d={pathString}
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="2"
                            strokeDasharray="8 6"
                            className="animate-pulse"
                          />
                        )}
                      </g>
                    );
                  })}

                  {/* RENDER TRUCK MARKERS WITH TELEMETRY BADGES */}
                  {trucks.map(truck => {
                    const { x, y } = projectCoords(truck.currentLocation.lng, truck.currentLocation.lat);
                    const isSelected = truck.id === selectedTruckId;
                    const isAlert = truck.coolingStatus === 'خطر كسر سلسلة التبريد';

                    return (
                      <g
                        key={`marker-${truck.id}`}
                        transform={`translate(${x}, ${y})`}
                        onClick={() => setSelectedTruckId(truck.id)}
                        className="cursor-pointer group"
                      >
                        {/* Selected Pulsing Halo */}
                        {isSelected && (
                          <circle
                            cx="0"
                            cy="0"
                            r="22"
                            fill="none"
                            stroke={isAlert ? '#ef4444' : '#3b82f6'}
                            strokeWidth="2"
                            opacity="0.8"
                            className="animate-ping"
                          />
                        )}

                        {/* Outer Glow Halo */}
                        <circle
                          cx="0"
                          cy="0"
                          r={isSelected ? 18 : 14}
                          fill={isAlert ? 'rgba(239, 68, 68, 0.3)' : isSelected ? 'rgba(59, 130, 246, 0.3)' : 'rgba(16, 185, 129, 0.2)'}
                        />

                        {/* Truck Icon Box */}
                        <rect
                          x="-12"
                          y="-12"
                          width="24"
                          height="24"
                          rx="6"
                          fill={isAlert ? '#dc2626' : isSelected ? '#2563eb' : '#0f766e'}
                          stroke="#ffffff"
                          strokeWidth="2"
                          filter="url(#glow)"
                        />

                        {/* Mini Truck Glyph */}
                        <path
                          d="M -6,-3 L 1,-3 L 4,0 L 4,4 L -6,4 Z M 4,0 L 6,0 L 7,2 L 7,4 L 4,4 Z"
                          fill="#ffffff"
                        />
                        <circle cx="-3" cy="5" r="1.5" fill="#ffffff" />
                        <circle cx="4" cy="5" r="1.5" fill="#ffffff" />

                        {/* Live Temperature Badge directly on map */}
                        <g transform="translate(14, -14)">
                          <rect
                            x="0"
                            y="0"
                            width="52"
                            height="18"
                            rx="5"
                            fill={isAlert ? '#991b1b' : '#0f172a'}
                            stroke={isAlert ? '#f87171' : isSelected ? '#60a5fa' : '#34d399'}
                            strokeWidth="1.2"
                          />
                          <text
                            x="26"
                            y="13"
                            fill="#ffffff"
                            fontSize="9"
                            fontWeight="bold"
                            textAnchor="middle"
                            fontFamily="monospace"
                          >
                            {truck.currentTempCelsius > 0 ? `+${truck.currentTempCelsius}` : truck.currentTempCelsius}°C
                          </text>
                        </g>

                        {/* Driver & Plate Label below marker */}
                        <g transform="translate(0, 20)">
                          <rect
                            x="-45"
                            y="0"
                            width="90"
                            height="14"
                            rx="4"
                            fill="rgba(15, 23, 42, 0.9)"
                            stroke="rgba(255, 255, 255, 0.2)"
                            strokeWidth="0.8"
                          />
                          <text
                            x="0"
                            y="10"
                            fill="#e2e8f0"
                            fontSize="8"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {truck.driverName.split(' ')[0]} • {truck.truckPlate}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Bottom HUD Bar on Map */}
              <div className="z-10 bg-stone-900/90 backdrop-blur-md p-3 rounded-2xl border border-stone-800 text-white flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-stone-400">الشاحنة المحددة:</span>
                  <span className="font-extrabold text-blue-400 font-mono">
                    {selectedTruck.truckPlate} ({selectedTruck.driverName})
                  </span>
                  <span className="text-stone-600">|</span>
                  <span className="text-stone-300">
                    {selectedTruck.originWilaya} ◄ {selectedTruck.destinationWilaya}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleSpeakTruckTelemetry(selectedTruck)}
                    className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-xl font-bold transition text-xs"
                    title="الاستماع الصوتي لتقرير الشاحنة باللغة العربية"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>تقرير صوتي عربي 🇩🇿</span>
                  </button>

                  <a
                    href={`tel:${selectedTruck.driverPhone}`}
                    className="flex items-center gap-1 bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded-xl font-bold transition text-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                    <span>اتصال بالسائق</span>
                  </a>
                </div>
              </div>
            </div>

            {/* LIVE TELEMETRY & B2B CONTRACT INSPECTOR (4 Columns) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Selected Truck Main Telemetry Card */}
              <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-5">
                {/* Header with Plate & Status */}
                <div className="flex items-start justify-between gap-2 pb-4 border-b border-stone-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-black text-stone-900 tracking-wider">
                        {selectedTruck.truckPlate}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        selectedTruck.coolingStatus === 'خطر كسر سلسلة التبريد'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {selectedTruck.coolingStatus}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {selectedTruck.carrierCompany}
                    </p>
                  </div>

                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 font-mono">
                    {selectedTruck.status}
                  </span>
                </div>

                {/* TEMPERATURE PROBE IOT GAUGE */}
                <div className={`p-4 rounded-2xl border ${
                  selectedTruck.coolingStatus === 'خطر كسر سلسلة التبريد'
                    ? 'bg-rose-50 border-rose-200 text-rose-950'
                    : 'bg-gradient-to-br from-blue-50 to-indigo-50/50 border-blue-100 text-blue-950'
                }`}>
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="flex items-center gap-1.5">
                      <ThermometerSnowflake className="w-4 h-4 text-blue-600" />
                      <span>حساس حرارة الثلاجة IoT (Cold-Chain Probe)</span>
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      الهدف: {selectedTruck.targetTempCelsius}°C
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mt-1">
                    <div className="text-3xl font-black font-mono tracking-tight text-stone-900">
                      {selectedTruck.currentTempCelsius > 0 ? `+${selectedTruck.currentTempCelsius}` : selectedTruck.currentTempCelsius}°C
                    </div>
                    <div className="text-left text-xs font-bold text-stone-600 font-mono">
                      نطاق الأمان: [{selectedTruck.minAllowedTemp}°C .. {selectedTruck.maxAllowedTemp}°C]
                    </div>
                  </div>

                  {/* Visual Temperature Range Bar */}
                  <div className="w-full bg-stone-200 h-2.5 rounded-full mt-3 overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        selectedTruck.coolingStatus === 'خطر كسر سلسلة التبريد'
                          ? 'bg-rose-600'
                          : 'bg-gradient-to-r from-blue-500 to-emerald-500'
                      }`}
                      style={{
                        width: `${Math.min(100, Math.max(10, ((selectedTruck.currentTempCelsius - selectedTruck.minAllowedTemp) / (selectedTruck.maxAllowedTemp - selectedTruck.minAllowedTemp)) * 100))}%`
                      }}
                    />
                  </div>

                  {/* Micro sensors telemetry strip */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-stone-200/60 text-[11px] text-center font-mono">
                    <div className="bg-white/80 p-1.5 rounded-lg border border-stone-100">
                      <span className="text-[10px] text-stone-500 block">الرطوبة</span>
                      <strong className="text-stone-800">{selectedTruck.humidityPercent}% RH</strong>
                    </div>
                    <div className="bg-white/80 p-1.5 rounded-lg border border-stone-100">
                      <span className="text-[10px] text-stone-500 block">ضاغط التبريد</span>
                      <strong className="text-emerald-700">{selectedTruck.iotSensorsStatus.compressorOn ? 'يعمل ✓' : 'متوقف'}</strong>
                    </div>
                    <div className="bg-white/80 p-1.5 rounded-lg border border-stone-100">
                      <span className="text-[10px] text-stone-500 block">قفل الباب</span>
                      <strong className="text-stone-800">{selectedTruck.iotSensorsStatus.doorClosed ? 'محكم ✓' : 'مفتوح ⚠️'}</strong>
                    </div>
                  </div>
                </div>

                {/* ESCROW SECURITY BADGE */}
                <div className="bg-stone-900 text-white p-4 rounded-2xl border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>العربون المالي المشفر (Escrow Deposit)</span>
                    </span>
                    <span className="bg-emerald-950 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-800 font-mono">
                      SATIM / Edahabia
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <div className="text-xl font-black font-mono text-emerald-400">
                      {selectedTruck.escrowAmountDzd.toLocaleString()} دج
                    </div>
                    <div className="text-xs text-stone-400 font-bold">
                      {selectedTruck.escrowStatus}
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-400 leading-relaxed pt-1 border-t border-stone-800">
                    {selectedTruck.coolingStatus === 'خطر كسر سلسلة التبريد' ? (
                      <span className="text-rose-400 font-bold">
                        ⚠️ تم تجميد تحرير العربون آلياً وإشعار الفلاح والمشتري بسبب تذبذب درجة الحرارة.
                      </span>
                    ) : (
                      'الأموال محجوزة في الضمان حتى مطابقة فحص المخبر واستلام المشتري عبر المسح بالـ QR.'
                    )}
                  </p>
                </div>

                {/* B2B CONTRACT & CARGO DETAILS */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-500">رقم العقد B2B:</span>
                    <span className="font-mono font-bold text-stone-900">{selectedTruck.contractNumber}</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-500">المؤسسة المستلمة:</span>
                    <span className="font-bold text-stone-900">{selectedTruck.enterpriseName}</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-500">المحصول والحمولة:</span>
                    <span className="font-bold text-stone-800 text-left max-w-[200px] truncate" title={selectedTruck.cargoTitle}>
                      {selectedTruck.cargoTitle}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-500">الوزن الصافي:</span>
                    <span className="font-mono font-bold text-emerald-700">{selectedTruck.cargoWeightTons} طن</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                    <span className="text-stone-500">المسافة وسرعة الشاحنة:</span>
                    <span className="font-mono font-bold text-stone-800">
                      {selectedTruck.coveredDistanceKm} / {selectedTruck.totalDistanceKm} كم ({selectedTruck.speedKmH} كم/س)
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-stone-500">الوقت المتبقي للوصول:</span>
                    <span className="font-bold text-blue-700 font-mono">
                      ~ {selectedTruck.etaMinutes} دقيقة
                    </span>
                  </div>
                </div>

                {/* DRIVER CONTACT & DISPATCH ACTIONS */}
                <div className="pt-2 flex items-center gap-2">
                  <a
                    href={`tel:${selectedTruck.driverPhone}`}
                    className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>اتصال بالسائق ({selectedTruck.driverName.split(' ')[0]})</span>
                  </a>

                  <button
                    onClick={() => handleSpeakTruckTelemetry(selectedTruck)}
                    className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl transition"
                    title="الاستماع الصوتي لتقرير الشاحنة باللغة العربية"
                  >
                    <Volume2 className="w-4 h-4 text-emerald-700" />
                  </button>
                </div>
              </div>

              {/* LIST OF ALL B2B CONTRACT FRIGO TRUCKS (Selector Strip) */}
              <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-stone-900">
                    أسطول الشاحنات المبردة المتعاقد عليها ({filteredTrucks.length})
                  </h3>
                  <span className="text-[11px] text-stone-500">اختر للتتبع اللحظي</span>
                </div>

                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                  {filteredTrucks.map(truck => {
                    const isSelected = truck.id === selectedTruckId;
                    const isAlert = truck.coolingStatus === 'خطر كسر سلسلة التبريد';

                    return (
                      <div
                        key={truck.id}
                        onClick={() => setSelectedTruckId(truck.id)}
                        className={`p-3 rounded-2xl border cursor-pointer transition text-xs space-y-1.5 ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-500 shadow-xs'
                            : 'bg-stone-50/60 border-stone-200 hover:bg-white hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-stone-900">{truck.truckPlate}</span>
                            <span className="text-[10px] text-stone-500">({truck.driverName})</span>
                          </div>

                          <span className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded-lg ${
                            isAlert ? 'bg-rose-200 text-rose-900 font-black animate-pulse' : 'bg-white text-blue-900 border border-stone-200'
                          }`}>
                            {truck.currentTempCelsius > 0 ? `+${truck.currentTempCelsius}` : truck.currentTempCelsius}°C
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-stone-500">
                          <span>{truck.originWilaya} ◄ {truck.destinationWilaya}</span>
                          <span className="font-mono text-emerald-700 font-bold">{truck.status}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FREIGHT CALCULATOR & DIRECT CARRIER BOOKING (حاسبة الشحن ومطابقة الناقلين) */}
      {activeView === 'matching' && (
        <div className="space-y-6">
          {/* Logistics Cost Estimator Tool */}
          <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-3xl p-5 sm:p-6 text-white shadow-md">
            <div className="flex items-center gap-2 mb-4 text-emerald-400 font-bold text-sm">
              <Calculator className="w-4 h-4" />
              <span>حاسبة تكلفة الشحن التقديرية (Logistics Freight Calculator)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Origin */}
              <div>
                <label className="block text-xs text-stone-300 mb-1 font-semibold">
                  نقطة التحميل (ولاية المزرعة):
                </label>
                <select
                  value={originWilaya}
                  onChange={(e) => setOriginWilaya(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ميلة">ميلة (Mila) - شلغوم العيد</option>
                  <option value="بسكرة">بسكرة (Biskra) - طولقة</option>
                  <option value="معسكر">معسكر (Mascara) - سيڨ</option>
                  <option value="البليدة">البليدة (Blida) - متيجة</option>
                  <option value="وادي سوف">وادي سوف (El Oued) - قمار</option>
                </select>
              </div>

              {/* Destination */}
              <div>
                <label className="block text-xs text-stone-300 mb-1 font-semibold">
                  وجهة التسليم (السوق / المشتري):
                </label>
                <select
                  value={destCity}
                  onChange={(e) => setDestCity(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="الجزائر العاصمة">الجزائر العاصمة (سوق الكاليتوس / فنادق)</option>
                  <option value="وهران">وهران (سوق الجملة الكرمة)</option>
                  <option value="قسنطينة">قسنطينة (سوق الخروب)</option>
                  <option value="سطيف">سطيف (سوق الجملة عين أرنات)</option>
                  <option value="عنابة">عنابة (سوق الجملة سيدي عمار)</option>
                </select>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-xs text-stone-300 mb-1 font-semibold">
                  الوزن التقديري (بالأطنان):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={cargoTons}
                    onChange={(e) => setCargoTons(Number(e.target.value))}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-stone-400">طن</span>
                </div>
              </div>

              {/* Cooling Requirement */}
              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2 bg-stone-800/80 p-2.5 rounded-xl border border-stone-700 cursor-pointer hover:bg-stone-800">
                  <input
                    type="checkbox"
                    checked={requireCooling}
                    onChange={(e) => setRequireCooling(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                    <ThermometerSnowflake className="w-3.5 h-3.5" />
                    شاحنة تبريد Frigo إلزامية
                  </span>
                </label>
              </div>
            </div>

            {/* Calculation Result strip */}
            <div className="mt-5 pt-4 border-t border-stone-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center sm:text-right">
              <div className="bg-stone-800/60 p-3 rounded-xl border border-stone-700">
                <span className="text-[11px] text-stone-400">المسافة التقديرية بالمسار السريع:</span>
                <div className="text-lg font-black text-white font-mono mt-0.5">
                  ~ {estimatedKm} كم
                </div>
              </div>

              <div className="bg-stone-800/60 p-3 rounded-xl border border-stone-700">
                <span className="text-[11px] text-stone-400">زمن التوصيل الميداني المتوقع:</span>
                <div className="text-lg font-black text-white font-mono mt-0.5">
                  {Math.round(estimatedKm / 65)} ساعات
                </div>
              </div>

              <div className="bg-emerald-950/80 p-3 rounded-xl border border-emerald-800/80 text-emerald-200">
                <span className="text-[11px] text-emerald-300 font-bold">التكلفة التقديرية الموصى بها:</span>
                <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">
                  {Math.round(estimatedKm * (requireCooling ? 170 : 130)).toLocaleString()} دج
                </div>
              </div>
            </div>
          </div>

          {/* Available Verified Carriers Cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-stone-900">
                السائقون والشاحنات المتاحة الآن للتحميل المباشر ({filteredCarriers.length})
              </h3>
              <span className="text-xs text-stone-500">
                الأسعار تخضع للتفاوض المباشر بدون عمولة
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCarriers.map((carrier) => (
                <div
                  key={carrier.id}
                  className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs hover:border-emerald-500 transition space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                        <Truck className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-stone-900 text-sm">
                            {carrier.driverName}
                          </h4>
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                            {carrier.badge}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500">
                          {carrier.companyName || 'سائق ناقل حر'} • قاعدة الانطلاق: {carrier.wilayaBase}
                        </p>
                      </div>
                    </div>

                    <div className="text-left">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        carrier.isAvailable 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-stone-100 text-stone-500'
                      }`}>
                        {carrier.isAvailable ? 'متاح للتحميل' : 'في مهمة حالية'}
                      </span>
                    </div>
                  </div>

                  {/* Carrier Vehicle Specs */}
                  <div className="grid grid-cols-3 gap-2 bg-stone-50 p-2.5 rounded-2xl border border-stone-100 text-center text-xs">
                    <div>
                      <div className="text-[10px] text-stone-500">نوع الشاحنة</div>
                      <strong className="text-stone-800 font-bold block truncate">
                        {carrier.vehicleType}
                      </strong>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-500">الحمولة القصوى</div>
                      <strong className="text-emerald-700 font-mono font-bold block">
                        {carrier.capacityTons} طن
                      </strong>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-500">التسعيرة المرجعية</div>
                      <strong className="text-stone-800 font-mono font-bold block">
                        {carrier.ratePerKmDzd} دج/كم
                      </strong>
                    </div>
                  </div>

                  {carrier.coolingTempRange && (
                    <div className="text-[11px] bg-blue-50/80 border border-blue-200 text-blue-900 p-2.5 rounded-xl flex items-center gap-1.5">
                      <ThermometerSnowflake className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>سلسلة التبريد: <strong>{carrier.coolingTempRange}</strong></span>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                    <button
                      onClick={() => handleBookCarrier(carrier)}
                      disabled={!carrier.isAvailable}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        carrier.isAvailable
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                          : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>طلب حجز الشاحنة</span>
                    </button>

                    <a
                      href={`tel:${carrier.phone}`}
                      className="px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition flex items-center gap-1"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                      <span>اتصال بالسائق</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SMART NOTIFICATION HUB MODAL / DRAWER (مركز التنبيهات الذكي للفلاح والمشتري) */}
      {notificationHubOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-stone-900 via-indigo-950 to-stone-900 text-white flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-md">
                  <BellRing className="w-6 h-6 animate-pulse" />
                </span>
                <div>
                  <h3 className="text-lg font-black">
                    مركز الإشعارات الذكي لسلسلة الإمداد (Smart Dispatch Notification Hub)
                  </h3>
                  <p className="text-xs text-stone-300 mt-0.5">
                    إرسال تنبيهات فورية للفلاح والمشتري عبر SMS وWhatsApp لحالات انحراف الحرارة وتأخير المسار
                  </p>
                </div>
              </div>

              <button
                onClick={() => setNotificationHubOpen(false)}
                className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-stone-50/50">
              {/* Quick dispatch simulator pills in Modal */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-stone-200">
                <div className="text-xs font-bold text-stone-700 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-600" />
                  <span>محاكاة إرسال التنبيهات المباشرة:</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTriggerTempBreachAlert}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-xl text-xs font-extrabold transition"
                  >
                    تنبيه انحراف حراري (+14.5°C)
                  </button>
                  <button
                    onClick={handleTriggerRouteDelayAlert}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-extrabold transition"
                  >
                    تنبيه تأخير مسار (+55 دقيقة)
                  </button>
                </div>
              </div>

              {/* List of Alerts */}
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`rounded-3xl border p-5 sm:p-6 space-y-4 transition ${
                      alert.type === 'temperature_breach'
                        ? 'bg-rose-50/60 border-rose-200 shadow-xs'
                        : 'bg-amber-50/60 border-amber-200 shadow-xs'
                    }`}
                  >
                    {/* Alert Title bar */}
                    <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-stone-200/80">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                            alert.type === 'temperature_breach'
                              ? 'bg-rose-600 text-white'
                              : 'bg-amber-600 text-white'
                          }`}>
                            {alert.type === 'temperature_breach' ? '🚨 انحراف حراري حرج' : '⏳ تأخير مسار لوجستي'}
                          </span>
                          <span className="font-mono text-xs font-black text-stone-900">
                            الشاحنة: {alert.truckPlate} ({alert.driverName})
                          </span>
                        </div>
                        <h4 className="text-base font-extrabold text-stone-900 mt-1.5">
                          {alert.title}
                        </h4>
                        <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                          {alert.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-stone-400 font-mono">
                          {alert.timestamp}
                        </span>
                        <button
                          onClick={() => handleSpeakAlert(alert)}
                          className="p-2 bg-white hover:bg-stone-100 text-stone-800 rounded-xl border border-stone-200 shadow-xs transition"
                          title="استماع صوتي للإشعار باللغة العربية"
                        >
                          <Volume2 className="w-4 h-4 text-emerald-700" />
                        </button>
                      </div>
                    </div>

                    {/* DUAL NOTIFICATION COLUMNS (فلاح + مشتري) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* 1. Farmer Alert Box (نسخة إشعار الفلاح) */}
                      <div className="bg-white rounded-2xl p-4 border border-stone-200 space-y-2.5 shadow-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                              👨‍🌾
                            </span>
                            <div>
                              <strong className="text-xs font-extrabold text-stone-900 block">
                                تنبيه الفلاح (Farmer Dispatch Notice)
                              </strong>
                              <span className="text-[11px] text-stone-500">
                                {alert.farmerNotice.farmName}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-mono">
                            {alert.farmerNotice.sentStatus}
                          </span>
                        </div>

                        {/* Simulated SMS Message to Farmer */}
                        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs text-stone-800 font-sans leading-relaxed">
                          <div className="flex items-center gap-1.5 text-[10px] text-stone-400 font-bold mb-1">
                            <Smartphone className="w-3 h-3 text-emerald-600" />
                            <span>نص رسالة الـ SMS الموجهة لهاتف: {alert.farmerNotice.farmerPhone}</span>
                          </div>
                          <p className="text-[11px] text-stone-700">
                            "{alert.farmerNotice.message}"
                          </p>
                        </div>

                        <div className="text-[11px] text-stone-600 bg-stone-100/60 p-2 rounded-lg">
                          <strong className="text-stone-800 block">الإجراء المطلوب من الفلاح:</strong>
                          <span>{alert.farmerNotice.actionRequired}</span>
                        </div>
                      </div>

                      {/* 2. Buyer Alert Box (نسخة إشعار المشتري) */}
                      <div className="bg-white rounded-2xl p-4 border border-stone-200 space-y-2.5 shadow-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                              🏢
                            </span>
                            <div>
                              <strong className="text-xs font-extrabold text-stone-900 block">
                                تنبيه المشتري (Buyer Dispatch Notice)
                              </strong>
                              <span className="text-[11px] text-stone-500">
                                {alert.buyerNotice.enterpriseName}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 font-mono">
                            {alert.buyerNotice.sentStatus}
                          </span>
                        </div>

                        {/* Simulated SMS Message to Buyer */}
                        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs text-stone-800 font-sans leading-relaxed">
                          <div className="flex items-center gap-1.5 text-[10px] text-stone-400 font-bold mb-1">
                            <Smartphone className="w-3 h-3 text-blue-600" />
                            <span>نص رسالة الـ SMS الموجهة لإدارة المشتريات: {alert.buyerNotice.buyerPhone}</span>
                          </div>
                          <p className="text-[11px] text-stone-700">
                            "{alert.buyerNotice.message}"
                          </p>
                        </div>

                        <div className="text-[11px] text-stone-600 bg-stone-100/60 p-2 rounded-lg">
                          <strong className="text-stone-800 block">الإجراء المطلوب من المشتري:</strong>
                          <span>{alert.buyerNotice.actionRequired}</span>
                        </div>
                      </div>
                    </div>

                    {/* Escrow Protective Clause & Action Bar */}
                    <div className="bg-stone-900 text-white p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <strong className="text-emerald-400 font-bold block">
                            حالة الأمان المالي لعقد الـ Escrow:
                          </strong>
                          <span className="text-stone-300 text-[11px]">
                            {alert.escrowImpact}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleResendAlertBroadcast(alert)}
                          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl font-bold transition text-xs"
                          title="إعادة بث الإشعار إلى هاتفي الفلاح والمشتري"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>إعادة إرسال SMS 📲</span>
                        </button>

                        {!alert.acknowledged ? (
                          <button
                            onClick={() => handleAcknowledgeAlert(alert.id)}
                            className="flex items-center gap-1 bg-stone-800 hover:bg-stone-700 text-emerald-400 px-3 py-1.5 rounded-xl font-bold border border-emerald-500/30 transition text-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>تأكيد المعالجة</span>
                          </button>
                        ) : (
                          <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold font-mono">
                            <CheckCheck className="w-4 h-4" />
                            تمت المعالجة ✓
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>نظام التنبيهات متصل مباشرة ببوابة الرسائل القصيرة الوطنية SATIM / Algérie Télécom</span>
              </span>

              <button
                onClick={() => setNotificationHubOpen(false)}
                className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl transition"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
