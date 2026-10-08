import React, { useState } from 'react';
import { Crop } from '../types/agritech';
import { 
  X, 
  FileCheck2, 
  Building, 
  CheckCircle, 
  ShieldCheck, 
  Download, 
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

interface ContractRequestModalProps {
  crop: Crop;
  onClose: () => void;
}

export const ContractRequestModal: React.FC<ContractRequestModalProps> = ({ crop, onClose }) => {
  const [companyName, setCompanyName] = useState<string>('');
  const [contractType, setContractType] = useState<string>('توريد موسمي حصري للمطاعم/الفنادق');
  const [monthlyVolume, setMonthlyVolume] = useState<number>(20);
  const [durationMonths, setDurationMonths] = useState<number>(6);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerated(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 to-emerald-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-700/60 rounded-xl border border-emerald-500/40">
              <FileCheck2 className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                طلب عقد توريد زراعي مباشر B2B
              </h3>
              <p className="text-xs text-stone-300">
                شراكة موسمية بين الفلاح والمصانع/المطاعم والفنادق
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

        {isGenerated ? (
          <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>

            <div className="border border-stone-300 bg-stone-50 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="font-extrabold text-stone-900">مسودة عقد التوريد الأولي #DZ-B2B-2026</span>
                <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">موثق</span>
              </div>
              <div className="space-y-1 text-stone-700">
                <p><strong>الطرف الأول (المورّد المباشر):</strong> {crop.farmerName} - {crop.farmName}</p>
                <p><strong>الطرف الثاني (المشتري التعاقدي):</strong> {companyName || 'مؤسسة تجارية مسجلة'}</p>
                <p><strong>موضوع العقد:</strong> توريد كمية منتظمة من {crop.title} صنف ({crop.variety})</p>
                <p><strong>الكمية الشهرية المتفق عليها:</strong> {monthlyVolume} {crop.unit}</p>
                <p><strong>المدة التعاقدية:</strong> {durationMonths} أشهر</p>
                <p><strong>شرط الجودة:</strong> مطابقة نتائج التحاليل المخبرية لـ (INRAA/ITDAS) وخلو المنتوج من متبقيات المبيدات.</p>
              </div>
            </div>

            <p className="text-xs text-stone-500 text-center">
              تم إرسال المسودة للفلاح للتوقيع المبدئي وسيتواصل ممثل المنظومة لتنسيق إيداع الضمانات اللوجستية والمالية.
            </p>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => alert('تم تحميل نسخة العقد PDF')}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>تحميل العقد PDF</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition"
              >
                تم والعودة للسوق
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
            {/* Target crop summary */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
              <span className="text-[11px] text-stone-400 block font-bold">المحصول المستهدف للعقد:</span>
              <strong className="text-stone-900 text-sm block mt-0.5">{crop.title}</strong>
              <span className="text-stone-500">{crop.farmName} • {crop.wilaya}</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                اسم المؤسسة أو العلامة التجارية:
              </label>
              <input
                type="text"
                required
                placeholder="مثال: سلسلة مطاعم الأصالة / فندق الشيراتون"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                نوع التعاقد:
              </label>
              <select
                value={contractType}
                onChange={(e) => setContractType(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="توريد موسمي حصري للمطاعم/الفنادق">توريد موسمي حصري للمطاعم/الفنادق</option>
                <option value="عقد توريد خام لمصنع تحويلي غذائي">عقد توريد خام لمصنع تحويلي غذائي</option>
                <option value="توزيع أسبوعي لسلاسل التجزئة والسوبرماركت">توزيع أسبوعي لسلاسل التجزئة والسوبرماركت</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  الكمية الدورية المطلوبة ({crop.unit}):
                </label>
                <input
                  type="number"
                  min="5"
                  required
                  value={monthlyVolume}
                  onChange={(e) => setMonthlyVolume(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  مدة العقد (بالأشهر):
                </label>
                <select
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={3}>3 أشهر (موسمي)</option>
                  <option value={6}>6 أشهر (نصف سنوي)</option>
                  <option value={12}>12 شهراً (عقد سنوي)</option>
                </select>
              </div>
            </div>

            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-emerald-900">
              <span className="font-bold block mb-1">ضمانات الشفافية المالية:</span>
              يتم توثيق الاتفاق بنظام ضمان بنكي أو دفع مرحلي عند تسليم كل شحنة بعد فحص الجودة المخبري.
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-md"
            >
              إنشاء مسودة العقد وإرسالها للفلاح
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
