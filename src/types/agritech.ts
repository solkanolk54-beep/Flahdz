export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PolygonPoint {
  x: number;
  y: number;
}

export interface LabCertificate {
  labName: string;
  certNumber: string;
  issueDate: string;
  acidityLevel?: string; // e.g. "0.28% (بكر ممتاز - Extra Vierge)"
  pesticideResidue: string; // e.g. "0.00 ملغ/كغ - سليم 100%"
  waterSource: string; // e.g. "بئر ارتوازي عذب - 0.4 غ/ل ملوحة"
  organicCertified: boolean;
  qrCodeUrl?: string;
  reportPdfUrl?: string;
}

export interface StoryReel {
  id: string;
  title: string;
  date: string;
  mediaType: 'image' | 'video';
  thumbnail: string;
  caption: string;
  wilaya: string;
}

export interface Farm {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  whatsapp: string;
  wilaya: string;
  commune: string;
  coordinates: Coordinates;
  polygonSvgPoints: string; // SVG polygon coordinate points for custom rendering
  areaHectares: number;
  isVerified: boolean;
  badgeLevel: 'ذهبي' | 'فضي' | 'معتمد';
  mainCrops: string[];
  coverImage: string;
  rating: number;
  reviewCount: number;
  labCertificate?: LabCertificate;
  waterSource: string;
  // Technical Farm & Agronomic Soil Profile
  soilType?: 'طميية خصبة (Limoneux)' | 'طينية ثقيلة (Argileux)' | 'رملية خفيفة (Sableux)' | 'كلسية بركانية (Calcaire)' | 'مزيج طميي رملي (Sablonneux)';
  soilPh?: number; // e.g. 6.8 - 7.5
  irrigationMethod?: 'ري قطرة قطرة ذكي (Goutte-à-goutte)' | 'رش محوري بالطاقة الشمسية (Pivot)' | 'سواقي تقليدية فلاحية' | 'ري انسيابي بالراحة';
  waterSalinity?: number; // g/L e.g. 0.35 g/L
  organicMatterPercentage?: number; // e.g. 2.8%
  elevationMeters?: number; // e.g. 450 m
  farmerCardNumber?: string; // بطاقة الفلاح e.g. "DZ-CARD-AGRI-19-8832"
  stories: StoryReel[];
}

export interface Crop {
  id: string;
  farmId: string;
  farmName: string;
  farmerName: string;
  farmerPhone: string;
  farmerWhatsapp: string;
  wilaya: string;
  commune: string;
  title: string;
  variety: string; // صنف المحصول مثل دقلة نور، طماطم كاليستا، زيتون أشملال، دجاج عرب بلدي
  category: 'أشجار مثمرة وزيتون' | 'تمور' | 'خضروات' | 'حمضيات' | 'حبوب وبقوليات' | 'دواجن ومواشي' | 'أعلاف';
  quantityAvailable: number;
  unit: 'قنطار' | 'طن' | 'صندوق' | 'لتر' | 'رأس' | 'طير' | 'كغ';
  pricePerUnit: number; // بالدينار الجزائري DZD
  marketAveragePrice?: number;
  harvestStatus: 'جاهز للشحن الفوري' | 'حجز مسبق قبل الجني' | 'قيد النضج الميداني';
  harvestDateEstimated: string;
  daysToHarvest: number; // 0 if ready
  minimumOrder: number;
  image: string;
  images: string[];
  description: string;
  labCertificate?: LabCertificate;
  isPreOrderAllowed: boolean;
  preOrdersCount: number;
  preOrderedQuantity: number;
  verifiedDirect: boolean;
  soilType: string;
}

export interface PreOrderRequest {
  id: string;
  cropId: string;
  cropTitle: string;
  farmerName: string;
  buyerName: string;
  buyerPhone: string;
  buyerType: 'تاجر جملة' | 'مطعم / فندق' | 'مصنع تحويلي' | 'مستهلك مباشر';
  quantity: number;
  offeredPricePerUnit: number;
  deliveryNeeded: boolean;
  destinationWilaya: string;
  notes: string;
  createdAt: string;
  status: 'قيد المراجعة' | 'مقبول مبدئياً' | 'تم تأكيد العقد' | 'عربون مضمون في الضمان (Escrow) ✓';
}

export interface Carrier {
  id: string;
  driverName: string;
  companyName?: string;
  phone: string;
  wilayaBase: string;
  vehicleType: 'شاحنة تبريد Frigo' | 'شاحنة نصف مقطورة 20 طن' | 'شاحنة خفيفة 3.5 طن' | 'صهريج صحي غذائي' | 'شاحنة مجهزة لنقل الدواجن الحية والمواشي والمبردات' | 'شاحنة قلاب لنقل الحبوب والبقوليات 25 طن';
  capacityTons: number;
  isAvailable: boolean;
  ratePerKmDzd: number;
  rating: number;
  tripsCompleted: number;
  coolingTempRange?: string; // e.g. "-18°C إلى +10°C"
  badge: 'ناقل موثوق' | 'لوجستيات معتمدة';
}

export interface FrigoTruckTelemetry {
  id: string;
  truckPlate: string; // e.g. "04891-126-19"
  driverName: string;
  driverPhone: string;
  carrierCompany: string;
  contractId: string;
  contractNumber: string;
  enterpriseName: string;
  cargoTitle: string;
  cargoWeightTons: number;
  originWilaya: string;
  originPoint: { name: string; lat: number; lng: number };
  destinationWilaya: string;
  destinationPoint: { name: string; lat: number; lng: number };
  currentLocation: { lat: number; lng: number; locality: string };
  headingDegrees: number;
  speedKmH: number;
  currentTempCelsius: number;
  targetTempCelsius: number;
  minAllowedTemp: number;
  maxAllowedTemp: number;
  humidityPercent: number;
  coolingStatus: 'مثالية وآمنة' | 'تحذير تذبذب حراري' | 'خطر كسر سلسلة التبريد';
  escrowStatus: 'عربون مؤمن في Escrow (HELD)' | 'محرر بعد الفحص والاستلام';
  escrowAmountDzd: number;
  totalDistanceKm: number;
  coveredDistanceKm: number;
  etaMinutes: number;
  status: 'في الطريق' | 'قيد التحميل بالمزرعة' | 'وصلت للتفريغ والفحص المخبري' | 'متوقفة للاستراحة';
  lastPingTime: string;
  routeCorridor: string; // e.g. "الطريق السيار شرق-غرب (A1)"
  gpsWaypoints: { lat: number; lng: number; label?: string }[];
  iotSensorsStatus: {
    compressorOn: boolean;
    doorClosed: boolean;
    batteryLevel: number;
    satelliteGpsLock: boolean;
    defrostCycle: boolean;
  };
}

export interface CertifiedNurseryItem {
  id: string;
  name: string;
  variety: 'شتلات شملال (Chemlal) نقية' | 'شتلات سيغواز (Sigoise) معتمدة' | 'شتلات قرقوري وزبوج جبلي' | 'فسائل نخيل دقلة نور مخبرية معتمدة' | 'شتلات حمضيات طومسون خالية من الفيروسات';
  nurseryName: string;
  ownerName: string;
  phone: string;
  wilaya: string;
  commune: string;
  coordinates: Coordinates;
  certificateNumber: string;
  inspectionBody: string; // e.g. "المفتشية الولائية لحماية النباتات (INPV / DSA ميلة)"
  phytosanitaryStatus: string; // e.g. "سليمة 100% وخالية من بكتيريا Xylella fastidiosa وذبول الفيرتيسيليوم"
  lotNumber: string;
  ageMonths: number;
  heightCm: number;
  quantityAvailable: number;
  unitPriceDzd: number;
  qrVerifyUrl: string;
  image: string;
  rating: number;
}

export interface AgriculturalEquipment {
  id: string;
  title: string;
  category: 'جرارات وحصادات' | 'معاصر زيتون' | 'ري وطاقة شمسية' | 'أسمدة ومخصبات' | 'بيوت بلاستيكية' | 'صهاريج مياه ومضخات';
  equipmentType?: 'جرار Cirta سيرتا' | 'صهريج مياه مجرور' | 'مضخة غاطسة شمسية' | 'معصرة زيتون حديثة' | 'حصادة حبوب';
  dealType: 'بيع' | 'كراء موسمي' | 'شراكة';
  price: number; // بالدينار DZD
  priceUnit: 'إجمالي' | 'لليوم' | 'للهكتار' | 'للطن';
  wilaya: string;
  commune?: string;
  coordinates?: Coordinates;
  distanceKm?: number;
  ownerName: string;
  ownerPhone: string;
  condition: 'جديد 0 كلم' | 'حالة ممتازة' | 'مستعمل جيد';
  image: string;
  specs: string[];
  description: string;
  availableNow?: boolean;
}

export interface MarketPriceIndex {
  cropName: string;
  category: string;
  wholesaleMarket: string; // سوق الجملة (بوفاريك، شلغوم العيد، حطاطبة، سطيف)
  todayPriceDzd: number;
  yesterdayPriceDzd: number;
  changeRate: number; // percentage
  trend: 'up' | 'down' | 'stable';
  unit: string;
}

export interface AgroWeatherInfo {
  wilaya: string;
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: string;
  advisory: string; // نصيحة زراعية للمنطقة
  frostAlert: boolean;
}

export interface B2BShipment {
  id: string;
  shipmentNumber: string;
  deliveryDate: string;
  quantity: number;
  unit: string;
  labStatus: 'مفحوص ومطابق مخبرياً' | 'قيد فحص العينات' | 'في انتظار التقرير';
  labReportSummary: string;
  carrierName: string;
  vehicleType: string;
  trackingStatus: 'مجدولة' | 'في الطريق إلى المؤسسة' | 'تم الفحص والاستلام';
  invoiceAmountDzd: number;
}

export interface B2BEnterpriseContract {
  id: string;
  contractNumber: string;
  enterpriseName: string;
  enterpriseType: 'سلسلة فنادق' | 'سلسلة مطاعم فاخرة' | 'مصنع تحويل وتصبير غذائي' | 'مجموعة كبرى لتجارة الأغذية';
  cropTitle: string;
  farmId: string;
  farmName: string;
  wilaya: string;
  totalContractedQuantity: number;
  deliveredQuantity: number;
  unit: string;
  periodicDeliveryInterval: 'أسبوعي' | 'نصف شهري' | 'شهري';
  nextDeliveryDate: string;
  pricePerUnit: number;
  labRequirementSpec: string;
  status: 'عقد نشط وساري' | 'شحنة قيد التسليم' | 'مكتمل الموسم';
  shipments: B2BShipment[];
}

export interface PaymentDeposit {
  id: string;
  preOrderId: string;
  cropTitle: string;
  amountDzd: number;
  depositPercentage: number;
  cardType: 'Edahabia' | 'CIB';
  cardNumberMasked: string;
  holderName: string;
  status: 'مضمون في حساب الضمان (Escrow)' | 'مكتمل ومؤكد' | 'مسترد';
  transactionDate: string;
  authCode: string;
  satimRef: string;
}

export interface AgroAiAlert {
  id: string;
  wilaya: string;
  targetCrops: string[];
  alertType: 'ري وقائي استباقي' | 'حماية طارئة من الصقيع' | 'إنذار مبكر من الفطريات' | 'توقيت الجني المثالي';
  severity: 'حرج' | 'تحذير' | 'إرشاد وتوجيه';
  title: string;
  advisoryText: string;
  actionPlan: string[];
  tempCelsius: number;
  humidityPercent: number;
  broadcastDate: string;
  sentCountFarmers: number;
}

export interface PilotRegionCluster {
  id: string;
  clusterName: string;
  wilayas: string[];
  focalCrops: string[];
  focusPill: string;
  theme: 'olive-cereals' | 'dates-sahara' | 'citrus-b2b';
  description: string;
  pilotGoal: string;
  registeredFarmersTarget: number;
  enrolledFarmersCurrent: number;
  activeHectares: number;
  labPartner: string;
  institutionalPartner: string;
  readinessScore: number;
  keyPillars: string[];
}

export interface StrategicMoU {
  id: string;
  organizationName: string;
  orgType: 'مخبر زراعي معتمد' | 'غرفة فلاحية ولائية' | 'معهد تقني وطني' | 'تعاونية ناقلين مبردة';
  wilayaScope: string;
  scopeTitle: string;
  keyDeliverables: string[];
  status: 'موقعة ونافذة ميدانياً' | 'قيد التنفيذ والمصادقة' | 'مسودة اتفاقية';
  signedDate: string;
  digitalQrApiStatus: 'نشط ومربوط بـ QR' | 'قيد الربط البرمجي';
  contactPerson: string;
}


