import React, { useState } from 'react';
import { 
  FileCheck2, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  Printer, 
  QrCode, 
  Calendar, 
  MapPin, 
  Lock, 
  CreditCard, 
  Truck, 
  X,
  Copy,
  ExternalLink,
  ChevronRight,
  BadgeAlert,
  Sparkles,
  Volume2
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export interface ContractPartyFarmer {
  farmName: string;
  farmerCardNumber: string;
  wilaya: string;
  commune: string;
  polygonId: string;
  representativeName: string;
  phone: string;
}

export interface ContractPartyBuyer {
  enterpriseName: string;
  commercialRegister: string;
  address: string;
  representativeName: string;
  phone: string;
}

export interface ContractCropItem {
  id: string;
  cropName: string;
  specs: string;
  annualQuantity: string;
  shipmentFrequency: string;
  unitPriceDzd: string;
  totalEstimatedDzd?: string;
}

export interface B2BContractModelData {
  contractNumber: string;
  issueDate: string;
  platformName: string;
  platformDomain: string;
  contractNature: string;
  farmer: ContractPartyFarmer;
  buyer: ContractPartyBuyer;
  items: ContractCropItem[];
  escrowPercentage: number;
  qualitySpecs: {
    oliveAcidityMax: string;
    chemicalResidue: string;
    irrigationWaterQuality: string;
    labs: string[];
  };
  logistics: {
    coolingRequired: boolean;
    transportMode: string;
    gpsTrackingEnabled: boolean;
  };
  durationMonths: number;
  status: '🟢 عقد موثق إلكترونياً ومصادق عبر المنصة' | 'مسودة قيد التوقيع' | 'مكتمل';
}

interface B2BContractAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContract?: Partial<B2BContractModelData>;
}

export const DEFAULT_B2B_CONTRACT: B2BContractModelData = {
  contractNumber: 'AGRO-B2B-2026-9081',
  issueDate: '09 أكتوبر 2026',
  platformName: 'منصة فلاّح تيك الرقمية',
  platformDomain: 'Fllah.dz',
  contractNature: 'عقد توريد مجدول مع اعتماد مخبري إلزامي ونظام ضمان مالي مشفر (Escrow)',
  farmer: {
    farmName: 'مستثمرة سيدي خليفة للزيتون والمنتجات الفلاحية المعتمدة',
    farmerCardNumber: 'CARD-AGRO-43-09882 / RC-26/00-19482B',
    wilaya: 'ميلة (Mila)',
    commune: 'شلغوم العيد',
    polygonId: 'GIS-DZ-MLA-POLY-4198',
    representativeName: 'السيد الحاج بلقاسم مرابط',
    phone: '0555123456'
  },
  buyer: {
    enterpriseName: 'شركة الأوراسي للفنادق والخدمات الفندقية الكبرى (EGH El-Aurassi)',
    commercialRegister: 'RC-16/00-0019283-B02',
    address: 'شارع فرانز فانون، الجزائر العاصمة - الجزائر',
    representativeName: 'السيد كريم بن عيسى (مدير المشتريات وسلاسل الإمداد)',
    phone: '021748290'
  },
  items: [
    {
      id: 'item-1',
      cropName: 'زيت زيتون بكر ممتاز',
      specs: 'عصارة أولى على البارد (حموضة ≤ 0.3% ونقاء بيولوجي تام)',
      annualQuantity: '5,000 لتر',
      shipmentFrequency: 'أسبوعي (شحنات مخصصة ومجدولة)',
      unitPriceDzd: '950 د.ج / لتر',
      totalEstimatedDzd: '4,750,000 د.ج'
    },
    {
      id: 'item-2',
      cropName: 'خضروات وفواكه طازجة',
      specs: 'قطاف يومي، معالجة بحيوية، خالية من العيوب ومتبقيات المبيدات (0.00 mg/kg)',
      annualQuantity: '12 طن',
      shipmentFrequency: '3 مرات أسبوعياً',
      unitPriceDzd: 'وفق مؤشر بورصة المنصة اللحظية',
      totalEstimatedDzd: 'تقديري 1,920,000 د.ج'
    },
    {
      id: 'item-3',
      cropName: 'دجاج عرب بلدي حي وثوم أحمر محلي',
      specs: 'تغذية حبوب طبيعية 100%، شهادة بيطرية وفحص مخبري دوري',
      annualQuantity: '2,500 دجاجة + 15 قنطار ثوم',
      shipmentFrequency: 'نصف شهري (كل أسبوعين)',
      unitPriceDzd: '1,350 د.ج / دجاجة | 38,000 د.ج / قنطار ثوم',
      totalEstimatedDzd: 'تقديري 3,945,000 د.ج'
    }
  ],
  escrowPercentage: 15,
  qualitySpecs: {
    oliveAcidityMax: 'ألا تتجاوز 0.8% (وللبكر الممتاز ≤ 0.3%) ودرجة Brix محددة للفواكه',
    chemicalResidue: 'خلو تام من متبقيات المبيدات والمواد الكيميائية الضارة (0.00 mg/kg)',
    irrigationWaterQuality: 'مطابقة مياه الري الجوفية للمقاييس الوطنية للصحة والحماية البيئية',
    labs: ['INRAA (المعهد الوطني للبحث الزراعي)', 'CACQE (المركز الجزائري لمراقبة الجودة والتغليف)', 'ITDAS (المعهد التقني للزراعات الصحراوية)']
  },
  logistics: {
    coolingRequired: true,
    transportMode: 'شاحنات مبردة (Frigo) مجهزة من شبكة الناقلين المعتمدين بالمنصة',
    gpsTrackingEnabled: true
  },
  durationMonths: 12,
  status: '🟢 عقد موثق إلكترونياً ومصادق عبر المنصة'
};

export const B2BContractAgreementModal: React.FC<B2BContractAgreementModalProps> = ({
  isOpen,
  onClose,
  initialContract
}) => {
  const { isVoiceEnabled, isEasyMode, speakText } = useAccessibility();
  const [contractData, setContractData] = useState<B2BContractModelData>({
    ...DEFAULT_B2B_CONTRACT,
    ...initialContract
  });

  const [activeTab, setActiveTab] = useState<'preview' | 'edit' | 'security'>('preview');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSignConfirmed, setIsSignConfirmed] = useState(true);

  if (!isOpen) return null;

  const handleCopyContractNumber = () => {
    navigator.clipboard.writeText(contractData.contractNumber);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleReadContractSummary = () => {
    const speech = `عقد توريد سنوي آلي للمنتجات الفلاحية رقم ${contractData.contractNumber}، المبرم بين المورد ${contractData.farmer.farmName} في ${contractData.farmer.wilaya} والمشتري ${contractData.buyer.enterpriseName}. يشمل توريد زيت الزيتون البكر الممتاز والخضروات ودجاج عرب. مع اعتماد مخبري إلزامي من مخابر اينرا، ونظام ضمان مالي مشفر اسكرو بنسبة 15 بالمئة. العقد موثق ومعتمد رسمياً على منصة فلاح تيك.`;
    speakText(speech);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-stone-50 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-stone-300">
        
        {/* Modal Top Toolbar */}
        <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600/80 rounded-2xl border border-emerald-400/30 text-emerald-100 shadow-md">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg">
                  نموذج عقد توريد سنوي آلي (B2B Supply Agreement)
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                  {contractData.contractNumber}
                </span>
              </div>
              <p className="text-xs text-stone-300">
                المنصة الضامنة: <strong className="text-white">{contractData.platformName}</strong> ({contractData.platformDomain})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Accessibility Speech Button */}
            <button
              onClick={handleReadContractSummary}
              title="قراءة صوتية لملخص العقد الفلاحي"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-emerald-300 rounded-xl text-xs font-bold border border-emerald-500/40 transition active:scale-95"
            >
              <Volume2 className="w-4 h-4" />
              <span>استماع للعقد</span>
            </button>

            {/* Print button */}
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition"
              title="طباعة العقد"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-red-600/80 text-stone-200 hover:text-white transition"
              title="إغلاق النافذة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs in Modal */}
        <div className="bg-white border-b border-stone-200 px-5 py-2.5 flex items-center justify-between text-xs">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                activeTab === 'preview'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              وثيقة العقد الرسمية (الصيغة القانونية)
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                activeTab === 'security'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              نظام الضمان المشفر Escrow والفحص المخبري
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-stone-500">
            <span className="font-mono text-[11px] bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              Polygon ID: {contractData.farmer.polygonId}
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-6">
          {activeTab === 'preview' && (
            <div className="bg-white rounded-2xl border border-stone-300 shadow-sm p-6 sm:p-8 space-y-7 text-stone-900 print:border-none print:shadow-none">
              
              {/* Document Header */}
              <div className="border-b-2 border-stone-900 pb-5 text-center space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                  <span className="font-bold text-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    الجمهورية الجزائرية الديمقراطية الشعبية
                  </span>
                  <span className="font-mono font-bold">التاريخ: {contractData.issueDate}</span>
                </div>
                
                <h1 className="text-xl sm:text-2xl font-black text-stone-950">
                  عقد توريد سنوي وإطار عمل تجاري للمنتجات الفلاحية والغذائية
                </h1>
                <p className="text-xs text-stone-600 font-medium max-w-2xl mx-auto">
                  المنصة الضامنة: <strong className="text-stone-900">{contractData.platformName}</strong> ({contractData.platformDomain})
                </p>

                <div className="inline-flex flex-wrap items-center justify-center gap-3 pt-2">
                  <span className="bg-stone-100 border border-stone-300 text-stone-800 text-xs px-3 py-1 rounded-full font-mono font-bold flex items-center gap-1.5">
                    <span>رقم العقد الإلكتروني:</span>
                    <span className="text-emerald-800">{contractData.contractNumber}</span>
                    <button 
                      onClick={handleCopyContractNumber}
                      className="hover:text-emerald-600 transition"
                      title="نسخ رقم العقد"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {copiedCode && <span className="text-[10px] text-emerald-600 font-bold">تم النسخ!</span>}
                  </span>

                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-3 py-1 rounded-full font-bold">
                    طبيعة الاتفاقية: عقد توريد مجدول مع اعتماد مخبري إلزامي ونظام ضمان مالي مشفر (Escrow)
                  </span>
                </div>
              </div>

              {/* المادة 1: أطراف العقد */}
              <section className="space-y-3">
                <div className="bg-stone-900 text-white px-3 py-1.5 rounded-lg inline-block text-xs font-black">
                  المادة 1: أطراف العقد
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* الطرف الأول المورد */}
                  <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                      <strong className="text-emerald-900 font-black text-sm">
                        الطرف الأول (المورّد / المزرعة المعتمدة):
                      </strong>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        مورّد معتمد
                      </span>
                    </div>

                    <div className="space-y-1.5 text-stone-700">
                      <p><strong>اسم المزرعة / الشركة:</strong> {contractData.farmer.farmName}</p>
                      <p><strong>السجل التجاري / بطاقة الفلاح:</strong> <span className="font-mono font-bold">{contractData.farmer.farmerCardNumber}</span></p>
                      <p><strong>العنوان والجغرافيا:</strong> الولاية: <strong className="text-stone-900">{contractData.farmer.wilaya}</strong> | البلدية: {contractData.farmer.commune}</p>
                      <p><strong>الإحداثيات الجغرافية (Polygon ID):</strong> <span className="font-mono text-emerald-800 font-bold bg-white px-1.5 py-0.5 rounded border border-stone-200">{contractData.farmer.polygonId}</span> (مسجلة وموثقة في نظام GIS للمنصة)</p>
                      <p><strong>يمثلها:</strong> {contractData.farmer.representativeName}</p>
                      <p><strong>الهاتف للتنسيق:</strong> <span className="font-mono">{contractData.farmer.phone}</span></p>
                    </div>
                  </div>

                  {/* الطرف الثاني المشتري */}
                  <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                      <strong className="text-stone-900 font-black text-sm">
                        الطرف الثاني (المشتري / المؤسسة):
                      </strong>
                      <span className="bg-stone-200 text-stone-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        مؤسسة متعاقدة
                      </span>
                    </div>

                    <div className="space-y-1.5 text-stone-700">
                      <p><strong>اسم المؤسسة / الفندق:</strong> {contractData.buyer.enterpriseName}</p>
                      <p><strong>السجل التجاري للمؤسسة:</strong> <span className="font-mono font-bold">{contractData.buyer.commercialRegister}</span></p>
                      <p><strong>العنوان والمقر الاجتماعي:</strong> {contractData.buyer.address}</p>
                      <p><strong>يمثلها:</strong> {contractData.buyer.representativeName}</p>
                      <p><strong>الهاتف:</strong> <span className="font-mono">{contractData.buyer.phone}</span></p>
                      <p className="text-stone-500 text-[11px]">حساب الدفع الإلكتروني موثق عبر CIB / الخزينة المعتمدة</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* المادة 2: موضوع العقد والجدول الزمني التقديري */}
              <section className="space-y-3">
                <div className="bg-stone-900 text-white px-3 py-1.5 rounded-lg inline-block text-xs font-black">
                  المادة 2: موضوع العقد والجدول الزمني التقديري
                </div>
                
                <p className="text-xs text-stone-700 leading-relaxed">
                  يلتزم الطرف الأول بتوريد المنتجات الفلاحية المحددة أدناه للطرف الثاني وفقاً لجدول شحنات دوري (أسبوعي / نصف شهري) طوال فترة العقد (12 شهراً):
                </p>

                {/* Table of Contract Items */}
                <div className="overflow-x-auto rounded-2xl border border-stone-200">
                  <table className="w-full text-xs text-right border-collapse">
                    <thead>
                      <tr className="bg-stone-100 text-stone-800 font-extrabold border-b border-stone-200">
                        <th className="p-3">المنتج / المحصول</th>
                        <th className="p-3">المواصفات الفنية المطلوب توفرها</th>
                        <th className="p-3">الكمية الإجمالية السنوية</th>
                        <th className="p-3">وتيرة الشحنات</th>
                        <th className="p-3">سعر الوحدة (د.ج / DZD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {contractData.items.map((item) => (
                        <tr key={item.id} className="hover:bg-stone-50">
                          <td className="p-3 font-black text-stone-900">{item.cropName}</td>
                          <td className="p-3 text-stone-600 max-w-xs">{item.specs}</td>
                          <td className="p-3 font-mono font-bold text-stone-900">{item.annualQuantity}</td>
                          <td className="p-3">
                            <span className="bg-stone-100 text-stone-700 font-bold px-2 py-0.5 rounded text-[11px]">
                              {item.shipmentFrequency}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-black text-emerald-800">{item.unitPriceDzd}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* المادة 3: معايير الجودة والاعتماد المخبري الإلزامي */}
              <section className="space-y-3 bg-emerald-50/50 p-4 sm:p-5 rounded-2xl border border-emerald-200 text-xs">
                <div className="bg-emerald-900 text-white px-3 py-1.5 rounded-lg inline-block text-xs font-black">
                  المادة 3: معايير الجودة والاعتماد المخبري الإلزامي (Quality Assurance)
                </div>

                <div className="space-y-2 text-stone-800 leading-relaxed">
                  <p>
                    <strong>• الاشتراط المخبري:</strong> يلتزم الطرف الأول بعدم تسليم أي شحنة دورية إلا بوجود تقرير فحص مخبري إلكتروني صادق ومحدث صادر عن أحد المخابر الوطنية المعتمدة (<span className="font-bold text-emerald-900">INRAA / CACQE / ITDAS</span>).
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                      <strong>• زيت الزيتون وحموضته:</strong>
                      <span className="text-stone-600 block mt-0.5">
                        ألا تتجاوز نسبة الحموضة (Free Acidity) 0.8% (ولمنتجات البكر الممتاز ألا تتجاوز 0.3%)، مع تحديد درجة السكريات (Brix) للفواكه.
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                      <strong>• السلامة الكيميائية:</strong>
                      <span className="text-stone-600 block mt-0.5">
                        خلو المنتجات تماماً من بقايا المبيدات الزراعية والمواد الكيميائية الضارة (0.00 mg/kg).
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                      <strong>• سلامة مياه السقي:</strong>
                      <span className="text-stone-600 block mt-0.5">
                        مطابقة مياه الري الجوفية للمقاييس الوطنية للصحة والحماية البيئية.
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                      <strong>• التتبع عبر الـ QR Code:</strong>
                      <span className="text-stone-600 block mt-0.5">
                        تُرفق كل شحنة برمز QR صادر آلياً من المنصة يتيح لمدير الجودة بالفندق مطابقة الشهادة المخبرية ورقم الدفعة (Lot Number) لحظة الاستلام.
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* المادة 4: المعاملات المالية ونظام الضمان المشفر */}
              <section className="space-y-3 bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 text-xs">
                <div className="bg-stone-900 text-white px-3 py-1.5 rounded-lg inline-block text-xs font-black">
                  المادة 4: المعاملات المالية ونظام الضمان المشفر (Escrow System)
                </div>

                <div className="space-y-2 text-stone-700 leading-relaxed">
                  <p>
                    <strong>• عربون تثبيت الجدية:</strong> عند توقيع العقد عبر المنصة، يودع الطرف الثاني عربوناً بنسبة <strong className="text-stone-900 font-mono">15%</strong> من القيمة الإجمالية للطلب المجدول في حساب الضمان المشفر الخاص بالمنصة (<span className="font-mono font-bold text-emerald-800">Fllah.dz Escrow Account</span>).
                  </p>
                  <p>
                    <strong>• الربط بالدفع الإلكتروني:</strong> يتم تسديد المستحقات والشرائح عبر البطاقات البنكية (<span className="font-bold text-blue-700">CIB</span>) أو البطاقة الذهبية (<span className="font-bold text-amber-700">Algérie Poste</span>) أو التحويل البنكي المعتمد المربوط بالنظام.
                  </p>
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-stone-800">
                    <strong className="text-amber-900 block mb-1">آلية تحرير الأموال والضمان:</strong>
                    <ul className="list-disc list-inside space-y-1 text-stone-700">
                      <li>لا يتم تحرير شريحة المبالغ المودعة للفلاح إلا بعد توقيع وصل الاستلام الإلكتروني من الطرف الثاني وإرفاق تقرير المطابقة المخبرية بنجاح.</li>
                      <li>في حال رفض الشحنة لعدم مطابقتها للتقرير المخبري، يُمنح المورد مهلة 48 ساعة للتعويض، وإلا يُسترجع مبلغ العربون تلقائياً لحساب المؤسسة.</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* المادة 5: الشحن وسلسلة التبريد */}
              <section className="space-y-3 text-xs">
                <div className="bg-stone-900 text-white px-3 py-1.5 rounded-lg inline-block text-xs font-black">
                  المادة 5: الشحن وسلسلة التبريد (Logistics & Transport)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-stone-700">
                  <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                    <strong className="text-stone-900 block mb-1">• النقل المبرد (Frigo):</strong>
                    <p className="leading-relaxed">
                      يلتزم الطرف المسؤول عن النقل (وفق اتفاق الطرفين) بالاستعانة بشبكة الناقلين المعتمدين عبر منصة Fllah.dz لضمان شاحنات مبردة أو مجهزة للحفاظ على سلامة الشحنة أثناء الترانزيت.
                    </p>
                  </div>

                  <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                    <strong className="text-stone-900 block mb-1">• حاسبة الشحن الآلية:</strong>
                    <p className="leading-relaxed">
                      يتم احتساب تكاليف النقل وتوثيق خط سير الشحنة جغرافياً (GPS Tracking) من موقع المزرعة المسجل على الخريطة إلى مخازن الفندق مباشرة.
                    </p>
                  </div>
                </div>
              </section>

              {/* المادة 6: مدة العقد وإنهاؤه */}
              <section className="space-y-2 text-xs text-stone-700">
                <div className="bg-stone-900 text-white px-3 py-1.5 rounded-lg inline-block text-xs font-black">
                  المادة 6: مدة العقد وإنهاؤه
                </div>

                <p>
                  <strong>• المدة:</strong> يسري هذا العقد لمدة سنة كاملة (12 شهراً) تبدأ من تاريخ توقيعه الإلكتروني وتُجدد باتفاق الطرفين.
                </p>
                <p>
                  <strong>• الإلغاء:</strong> يحق لأحد الطرفين فسخ العقد في حال الإخلال الشديد بمعايير الجودة لمرتين متتاليتين أو التأخر عن التوريد لمدة تتجاوز 7 أيام دون إخطار استباقي عبر المنصة.
                </p>
              </section>

              {/* توقيع واعتماد الأطراف الإلكتروني */}
              <section className="pt-4 border-t-2 border-stone-900 space-y-4">
                <h4 className="font-black text-center text-stone-950 text-sm">
                  توقيع واعتماد الأطراف (إلكترونياً عبر المنصة)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* توقيع المورد */}
                  <div className="border border-stone-200 bg-stone-50 rounded-2xl p-4 text-center space-y-2">
                    <span className="font-extrabold text-stone-800 block text-[11px]">توقيع المورّد (المزرعة المعتمدة)</span>
                    <strong className="text-stone-900 block text-xs">{contractData.farmer.representativeName}</strong>
                    <span className="text-[10px] text-stone-500 block">{contractData.farmer.farmName}</span>
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[10px] font-mono font-bold">
                      التوقيع الرقمي: [Verified-OTP: 9184-AGRO]
                    </div>
                  </div>

                  {/* توقيع المشتري */}
                  <div className="border border-stone-200 bg-stone-50 rounded-2xl p-4 text-center space-y-2">
                    <span className="font-extrabold text-stone-800 block text-[11px]">توقيع المشتري (المؤسسة الفندقية)</span>
                    <strong className="text-stone-900 block text-xs">{contractData.buyer.representativeName}</strong>
                    <span className="text-[10px] text-stone-500 block">{contractData.buyer.enterpriseName}</span>
                    <div className="p-2 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-[10px] font-mono font-bold">
                      التوقيع الرقمي: [Verified-OTP: 7721-CORP]
                    </div>
                  </div>

                  {/* مصادقة المنصة الضامنة */}
                  <div className="border-2 border-emerald-600 bg-emerald-50/70 rounded-2xl p-4 text-center space-y-2">
                    <span className="font-extrabold text-emerald-950 block text-[11px]">مصادقة المنصة الضامنة (Fllah.dz)</span>
                    <div className="flex items-center justify-center gap-1 text-emerald-800 font-black text-xs">
                      <span>حالة التوثيق:</span>
                      <span>🟢 عقد موثق إلكترونياً</span>
                    </div>
                    <div className="p-1.5 bg-white border border-emerald-300 rounded-xl font-mono text-[10px] text-emerald-900 font-bold">
                      HASH: SHA256-ESCROW-DZ-9081
                    </div>
                    <span className="text-[9px] text-emerald-700 block">ضمان مالي Escrow مفعل بنسبة 15%</span>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Escrow Architecture Explainer Card */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-100 text-amber-900 rounded-2xl">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-stone-900">
                      نظام الضمان المالي المشفر (Fllah.dz Escrow System)
                    </h4>
                    <p className="text-xs text-stone-500">
                      حماية كاملة لأموال الفنادق وضمان حقوق الفلاحين دون مخاطر الدفع المؤجل
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-2">
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                    <div className="flex items-center gap-2 text-stone-900 font-bold">
                      <span className="w-6 h-6 bg-emerald-700 text-white rounded-full flex items-center justify-center text-xs">1</span>
                      <span>إيداع العربون (15%)</span>
                    </div>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      تودع المؤسسة (الفندق أو المصنع) نسبة 15% في حساب بنكي وسيط مشفر عبر CIB أو التحويل المعتمد قبل انطلاق الشحنة الأولى.
                    </p>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                    <div className="flex items-center gap-2 text-stone-900 font-bold">
                      <span className="w-6 h-6 bg-emerald-700 text-white rounded-full flex items-center justify-center text-xs">2</span>
                      <span>الفحص المخبري والشحن المبرد</span>
                    </div>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      يتم فحص العينة بمخبر INRAA أو CACQE وإرفاق الشهادة المخبرية الموثقة برمز QR مع سائق الشاحنة المبردة.
                    </p>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                    <div className="flex items-center gap-2 text-stone-900 font-bold">
                      <span className="w-6 h-6 bg-emerald-700 text-white rounded-full flex items-center justify-center text-xs">3</span>
                      <span>تحرير الدفعة آلياً</span>
                    </div>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      بمجرد مسح رمز QR وتأكيد استلام الشحنة المطابقة لمواصفات العقد، يتم تحرير المبلغ إلى الحساب البنكي للفلاح خلال دقائق.
                    </p>
                  </div>
                </div>
              </div>

              {/* Lab Quality Assurance Guarantee */}
              <div className="bg-gradient-to-r from-emerald-950 to-stone-900 text-white rounded-3xl p-6 shadow-md space-y-3">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>المخابر الوطنية الشريكة المعتمدة في بنود هذا العقد</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                    <strong className="text-white block">مخبر INRAA</strong>
                    <span className="text-stone-300 text-[11px]">المعهد الوطني للأبحاث الزراعية (تحاليل جودة الزيت والحبوب)</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                    <strong className="text-white block">مركز CACQE</strong>
                    <span className="text-stone-300 text-[11px]">المركز الجزائري لمراقبة الجودة والتعليب (بقايا المبيدات ودرجة Brix)</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                    <strong className="text-white block">معهد ITDAS</strong>
                    <span className="text-stone-300 text-[11px]">المعهد التقني لتطوير الزراعة الصحراوية (تمور دقلة نور ومحاصيل البيوت)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="bg-white border-t border-stone-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
            <span className="text-stone-600 font-bold">
              رمز التحقق الآلي: <span className="font-mono text-emerald-800">QR-AUTH-9081-OK</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                alert('تم تنزيل النسخة الإلكترونية الموقعة من العقد السنوي بنجاح بصيغة PDF المعتمدة.');
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-2xl font-bold transition active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>تحميل العقد PDF</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black shadow-md shadow-emerald-700/20 transition active:scale-95"
            >
              إغلاق ومتابعة الشحنات
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
