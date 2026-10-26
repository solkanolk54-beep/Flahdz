import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { B2BEnterpriseContract, Crop, Farm } from '../types/agritech';
import { 
  X, 
  Building2, 
  FileCheck2, 
  CalendarDays, 
  ShieldCheck, 
  Truck, 
  CheckCircle,
  Plus,
  Volume2
} from 'lucide-react';

interface CreateB2BContractModalProps {
  crops: Crop[];
  farms: Farm[];
  onClose: () => void;
  onCreateContract: (newContract: B2BEnterpriseContract) => void;
}

export const CreateB2BContractModal: React.FC<CreateB2BContractModalProps> = ({
  crops,
  farms,
  onClose,
  onCreateContract,
}) => {
  const { speakText } = useAccessibility();
  const [enterpriseName, setEnterpriseName] = useState('');
  const [enterpriseType, setEnterpriseType] = useState<B2BEnterpriseContract['enterpriseType']>('سلسلة فنادق');
  const [selectedCropId, setSelectedCropId] = useState(crops[0]?.id || 'crop-1');
  const [totalQuantity, setTotalQuantity] = useState(5000);
  const [periodicInterval, setPeriodicInterval] = useState<B2BEnterpriseContract['periodicDeliveryInterval']>('شهري');
  const [pricePerUnit, setPricePerUnit] = useState(880);
  const [labSpec, setLabSpec] = useState('شهادة INRAA إلزامية لكل دفعة وخلو تام من متبقيات المبيدات');
  const [nextDeliveryDate, setNextDeliveryDate] = useState('2026-11-01');

  const selectedCrop = crops.find(c => c.id === selectedCropId) || crops[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enterpriseName) {
      alert('يرجى إدخال اسم المؤسسة');
      return;
    }

    const newContract: B2BEnterpriseContract = {
      id: `cnt-${Date.now()}`,
      contractNumber: `DZ-B2B-2026-${Math.floor(100 + Math.random() * 900)}`,
      enterpriseName,
      enterpriseType,
      cropTitle: selectedCrop.title,
      farmId: selectedCrop.farmId,
      farmName: selectedCrop.farmName,
      wilaya: selectedCrop.wilaya,
      totalContractedQuantity: Number(totalQuantity),
      deliveredQuantity: 0,
      unit: selectedCrop.unit,
      periodicDeliveryInterval: periodicInterval,
      nextDeliveryDate,
      pricePerUnit: Number(pricePerUnit),
      labRequirementSpec: labSpec,
      status: 'عقد نشط وساري',
      shipments: [
        {
          id: `shp-${Date.now()}-1`,
          shipmentNumber: `SHP-${selectedCrop.wilaya.substring(0,3).toUpperCase()}-01`,
          deliveryDate: nextDeliveryDate,
          quantity: Math.round(Number(totalQuantity) / (periodicInterval === 'أسبوعي' ? 12 : periodicInterval === 'نصف شهري' ? 6 : 4)),
          unit: selectedCrop.unit,
          labStatus: 'قيد فحص العينات',
          labReportSummary: 'عينات الدفعة الأولى مجدولة للفحص المخبري قبل الشحن',
          carrierName: 'ناقل مبرد معتمد من المنظومة',
          vehicleType: 'شاحنة تبريد Frigo',
          trackingStatus: 'مجدولة',
          invoiceAmountDzd: Math.round((Number(totalQuantity) / 4) * Number(pricePerUnit))
        }
      ]
    };

    onCreateContract(newContract);
    onClose();
  };

  const totalContractValue = totalQuantity * pricePerUnit;
  const escrowDeposit15 = Math.round(totalContractValue * 0.15);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-b2b-contract-title"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
        <div className="bg-gradient-to-r from-stone-900 to-emerald-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-700/60 rounded-xl border border-emerald-500/40" aria-hidden="true">
              <Building2 className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h3 id="create-b2b-contract-title" className="font-extrabold text-base sm:text-lg">
                صياغة وتفعيل عقد توريد سنوي B2B
              </h3>
              <p className="text-xs text-stone-300">
                ربط المؤسسات الغذائية والفنادق بالمزارع مباشرة
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                const speech = `صياغة عقد توريد سنوي. المحصول المختار: ${selectedCrop.title} من ${selectedCrop.farmName}. الكمية السنوية: ${totalQuantity} ${selectedCrop.unit}. سعر الوحدة: ${pricePerUnit} دينار جزائري. القيمة الإجمالية للعقد: ${totalContractValue} دينار جزائري. قيمة العربون المطلوب إيداعه في حساب الضمان إسكرو بنسبة 15 بالمائة هي ${escrowDeposit15} دينار جزائري.`;
                speakText(speech, 'ملخص بنود العقد السنوي');
              }}
              className="p-1.5 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-amber-300 transition"
              title="الاستماع لملخص العقد والعربون المالي"
              aria-label="الاستماع لملخص العقد السنوي وحساب الضمان إسكرو"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition"
              aria-label="إغلاق النافذة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              اسم المؤسسة المتعاقدة:
            </label>
            <input
              type="text"
              required
              placeholder="مثال: فندق الشيراتون وهران / مصنع التصبير الجزائري"
              value={enterpriseName}
              onChange={(e) => setEnterpriseName(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                نوع المؤسسة:
              </label>
              <select
                value={enterpriseType}
                onChange={(e) => setEnterpriseType(e.target.value as B2BEnterpriseContract['enterpriseType'])}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="سلسلة فنادق">سلسلة فنادق</option>
                <option value="سلسلة مطاعم فاخرة">سلسلة مطاعم فاخرة</option>
                <option value="مصنع تحويل وتصبير غذائي">مصنع تحويل وتصبير غذائي</option>
                <option value="مجموعة كبرى لتجارة الأغذية">مجموعة كبرى لتجارة الأغذية</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                المحصول والمزرعة الموردة:
              </label>
              <select
                value={selectedCropId}
                onChange={(e) => {
                  setSelectedCropId(e.target.value);
                  const c = crops.find(crop => crop.id === e.target.value);
                  if (c) setPricePerUnit(c.pricePerUnit);
                }}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 truncate"
              >
                {crops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.wilaya})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                إجمالي الكمية ({selectedCrop?.unit}):
              </label>
              <input
                type="number"
                min="10"
                required
                value={totalQuantity}
                onChange={(e) => setTotalQuantity(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                السعر المتفق عليه (دج):
              </label>
              <input
                type="number"
                required
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                دورية التوريد:
              </label>
              <select
                value={periodicInterval}
                onChange={(e) => setPeriodicInterval(e.target.value as B2BEnterpriseContract['periodicDeliveryInterval'])}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="أسبوعي">أسبوعي</option>
                <option value="نصف شهري">نصف شهري</option>
                <option value="شهري">شهري</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              اشتراطات التحليل المخبري الإلزامية:
            </label>
            <input
              type="text"
              required
              value={labSpec}
              onChange={(e) => setLabSpec(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              تاريخ استلام الشحنة الدورية الأولى:
            </label>
            <input
              type="date"
              required
              value={nextDeliveryDate}
              onChange={(e) => setNextDeliveryDate(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div 
            className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-emerald-900 space-y-2"
            role="region"
            aria-label="الحساب المالي الإجمالي وعربون الضمان المشفر"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs">القيمة الإجمالية للعقد السنوي:</span>
              <span className="font-mono text-base font-black text-emerald-800" aria-label={`القيمة الإجمالية ${totalContractValue} دينار جزائري`}>
                {totalContractValue.toLocaleString()} دج
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-emerald-200/80 text-xs">
              <span className="text-emerald-950 font-bold">عربون الضمان المشفر (Escrow 15%):</span>
              <span className="font-mono text-sm font-black text-emerald-900 bg-emerald-200/60 px-2 py-0.5 rounded-md" aria-label={`قيمة العربون المالي المودع في الضمان المشفر ${escrowDeposit15} دينار جزائري`}>
                {escrowDeposit15.toLocaleString()} دج
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-md"
          >
            تثبيت العقد السنوي وإدراجه في بوابة المؤسسات
          </button>
        </form>
      </div>
    </div>
  );
};
