import React from 'react';
import { B2BShipment } from '../types/agritech';
import { 
  X, 
  ShieldCheck, 
  FileCheck2, 
  Award, 
  QrCode, 
  Download, 
  Check, 
  Truck, 
  ThermometerSnowflake 
} from 'lucide-react';

interface ShipmentLabCertificateModalProps {
  shipment: B2BShipment;
  onClose: () => void;
}

export const ShipmentLabCertificateModal: React.FC<ShipmentLabCertificateModalProps> = ({
  shipment,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-stone-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-700/60 rounded-xl border border-emerald-500/40">
              <ShieldCheck className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                شهادة المطابقة والتحليل المخبري للشحنة
              </h3>
              <p className="text-xs text-emerald-200">
                الشحنة رقم: {shipment.shipmentNumber} • تاريخ التسليم: {shipment.deliveryDate}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Body */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {/* Certificate Header Stamp */}
          <div className="border-2 border-emerald-600/30 bg-emerald-50/50 rounded-2xl p-4 text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full">
              <Award className="w-3.5 h-3.5 text-emerald-700" />
              <span>مخبر التحاليل الزراعية والنوعية الوطني (INRAA / CACQE)</span>
            </div>
            <h4 className="font-black text-stone-900 text-sm pt-1">
              تقرير المطابقة الصحية والفيزيوكيميائية رقم #{shipment.shipmentNumber}-LAB
            </h4>
            <p className="text-[11px] text-stone-600">
              الكمية المفحوصة: <strong className="font-mono">{shipment.quantity} {shipment.unit}</strong>
            </p>
          </div>

          {/* Test Results */}
          <div className="space-y-2.5">
            <span className="font-extrabold text-stone-900 block">
              النتائج المخبرية المعتمدة للمؤسسة:
            </span>

            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
              <span className="text-stone-500 text-[11px] block">ملخص التقرير والشهادة:</span>
              <div className="font-extrabold text-stone-800 text-xs">
                {shipment.labReportSummary}
              </div>
              <span className="text-[10px] text-emerald-700 font-bold block">
                ✓ متوافق مع معايير الجودة الصارمة لعقود الفنادق والمصانع الغذائية
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                <span className="text-stone-400 text-[10px] block">متبقيات المبيدات:</span>
                <strong className="text-emerald-700 font-mono text-xs">0.00 ppm (خالٍ تماماً)</strong>
              </div>

              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                <span className="text-stone-400 text-[10px] block">سلسلة التبريد أثناء النقل:</span>
                <strong className="text-blue-700 font-mono text-xs flex items-center gap-1">
                  <ThermometerSnowflake className="w-3 h-3" />
                  +4°C إلى +8°C مستقرة
                </strong>
              </div>
            </div>
          </div>

          {/* Transport & Carrier Info */}
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-stone-700 space-y-1">
            <span className="text-stone-400 text-[10px] font-bold block">بيانات الناقل وسلسلة التبريد:</span>
            <div className="flex items-center justify-between">
              <span>السائق المعتمد: <strong>{shipment.carrierName}</strong></span>
              <span className="text-stone-500 font-mono">{shipment.vehicleType}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-stone-200">
              <span>حالة التتبع:</span>
              <span className="font-bold text-emerald-800">{shipment.trackingStatus}</span>
            </div>
          </div>

          {/* QR Code and Verification */}
          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 flex items-center justify-between gap-3">
            <div>
              <span className="font-bold text-stone-900 block text-xs">
                التحقق الرقمي الفوري (Digital Verification)
              </span>
              <p className="text-[10px] text-stone-500 mt-0.5">
                يمكن لمسؤولي الجودة في المؤسسة مسح الرمز لمطابقة الختم المخبري.
              </p>
            </div>
            <QrCode className="w-12 h-12 text-stone-900 shrink-0" />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 p-4 border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            onClick={() => alert(`تم تحميل الشهادة المخبرية للشحنة ${shipment.shipmentNumber} بصيغة PDF`)}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-bold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تحميل التقرير المخبري PDF</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
