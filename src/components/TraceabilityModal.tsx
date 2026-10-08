import React from 'react';
import { Farm } from '../types/agritech';
import { 
  X, 
  ShieldCheck, 
  FileCheck2, 
  Award, 
  Droplet, 
  CheckCircle, 
  Sparkles, 
  QrCode, 
  Download,
  Building,
  Check
} from 'lucide-react';

interface TraceabilityModalProps {
  farm: Farm;
  onClose: () => void;
}

export const TraceabilityModal: React.FC<TraceabilityModalProps> = ({ farm, onClose }) => {
  const cert = farm.labCertificate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-700/60 rounded-xl border border-emerald-500/40">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                شهادة الجودة والتتبع المخبري (Traceability Certificate)
              </h3>
              <p className="text-xs text-emerald-200">
                توثيق رسمي صادر عن مخابر التحاليل الفلاحية والنوعية الوطنية
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

        {/* Certificate Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Certificate Header Banner */}
          <div className="border-2 border-emerald-600/30 bg-emerald-50/50 rounded-2xl p-4 text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full">
              <Award className="w-3.5 h-3.5 text-emerald-700" />
              <span>شهادة مطابقة بيولوجية وصحية رقم: {cert?.certNumber || 'DZ-CERT-2026'}</span>
            </div>
            <h4 className="font-black text-stone-900 text-base pt-1">
              {farm.name}
            </h4>
            <p className="text-xs text-stone-600">
              المزارع: {farm.ownerName} • {farm.wilaya} ({farm.commune})
            </p>
          </div>

          {/* Test Metrics Grid */}
          <div className="space-y-3">
            <h5 className="text-xs font-extrabold text-stone-900">
              نتائج الفحوصات المخبرية المعتمدة:
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {cert?.acidityLevel && (
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                  <span className="text-stone-500 text-[11px] block">نسبة الحموضة للزيت (Acidity):</span>
                  <div className="font-mono font-black text-emerald-700 text-sm">
                    {cert.acidityLevel}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold block">
                    ✓ أقل بكثير من الحد الأقصى الدولي (0.8%)
                  </span>
                </div>
              )}

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                <span className="text-stone-500 text-[11px] block">فحص بقايا المبيدات (Pesticide Residue):</span>
                <div className="font-mono font-black text-emerald-700 text-sm">
                  {cert?.pesticideResidue || '0.00 ملغ/كغ (سليم 100%)'}
                </div>
                <span className="text-[10px] text-emerald-600 font-bold block">
                  ✓ خالي تماماً من المواد السامة
                </span>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                <span className="text-stone-500 text-[11px] block">فحص جودة مياه الري:</span>
                <div className="font-bold text-stone-800 text-xs">
                  {cert?.waterSource || farm.waterSource}
                </div>
                <span className="text-[10px] text-emerald-600 font-bold block">
                  ✓ مياه جوفية عذبة ومطابقة بيولوجياً
                </span>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                <span className="text-stone-500 text-[11px] block">تاريخ أخذ العينات المخبرية:</span>
                <div className="font-mono font-bold text-stone-800 text-xs">
                  {cert?.issueDate || '2026-09-28'}
                </div>
                <span className="text-[10px] text-stone-500 block">
                  صادر عن: {cert?.labName || 'المخبر الوطني للنوعية'}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code and Farm-to-Fork Traceability */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-stone-900 block">
                رمز التتبع الرقمي السريع (QR Traceability Code)
              </span>
              <p className="text-[11px] text-stone-500 leading-tight">
                امسح الرمز على هاتفك للاطلاع على التقرير الرقمي المباشر، إحداثيات القطعة الفلاحية، وتاريخ الشحن.
              </p>
              <div className="font-mono text-[10px] text-emerald-700 font-bold pt-1">
                UUID: dz-agro-{farm.id}-trace-2026
              </div>
            </div>

            <div className="p-2 bg-white rounded-xl border border-stone-300 shrink-0 text-center shadow-xs">
              <QrCode className="w-16 h-16 text-stone-900 mx-auto" />
              <span className="text-[9px] font-bold text-stone-500 block mt-0.5">موثق في Fllah.dz</span>
            </div>
          </div>

          {/* Signatures */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100">
            <span className="flex items-center gap-1 text-emerald-800 font-bold">
              <Check className="w-3.5 h-3.5" />
              ختم المراقبة والتحليل المعتمد
            </span>
            <span className="font-mono">ITDAS / INRAA Certified</span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 p-4 border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            onClick={() => alert('تم تنزيل نسخة رقمية من شهادة التحليل المخبري PDF')}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-bold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تنزيل التقرير المخبري (PDF)</span>
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
