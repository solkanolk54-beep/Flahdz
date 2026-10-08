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
  variety: string; // صنف المحصول مثل دقلة نور، طماطم كاليستا، زيتون أشملال
  category: 'أشجار مثمرة وزيتون' | 'تمور' | 'خضروات' | 'حمضيات' | 'حبوب وبقوليات' | 'أعلاف';
  quantityAvailable: number;
  unit: 'قنطار' | 'طن' | 'صندوق' | 'لتر';
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
  status: 'قيد المراجعة' | 'مقبول مبدئياً' | 'تم تأكيد العقد';
}

export interface Carrier {
  id: string;
  driverName: string;
  companyName?: string;
  phone: string;
  wilayaBase: string;
  vehicleType: 'شاحنة تبريد Frigo' | 'شاحنة نصف مقطورة 20 طن' | 'شاحنة خفيفة 3.5 طن' | 'صهريج صحي غذائي';
  capacityTons: number;
  isAvailable: boolean;
  ratePerKmDzd: number;
  rating: number;
  tripsCompleted: number;
  coolingTempRange?: string; // e.g. "-18°C إلى +10°C"
  badge: 'ناقل موثوق' | 'لوجستيات معتمدة';
}

export interface AgriculturalEquipment {
  id: string;
  title: string;
  category: 'جرارات وحصادات' | 'معاصر زيتون' | 'ري وطاقة شمسية' | 'أسمدة ومخصبات' | 'بيوت بلاستيكية';
  dealType: 'بيع' | 'كراء موسمي' | 'شراكة';
  price: number; // بالدينار DZD
  priceUnit: 'إجمالي' | 'لليوم' | 'للهكتار' | 'للطن';
  wilaya: string;
  ownerName: string;
  ownerPhone: string;
  condition: 'جديد 0 كلم' | 'حالة ممتازة' | 'مستعمل جيد';
  image: string;
  specs: string[];
  description: string;
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
