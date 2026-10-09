import React from 'react';
import { 
  X, 
  Layers, 
  Database, 
  Smartphone, 
  Truck, 
  ShieldCheck, 
  TrendingUp, 
  Cpu, 
  CheckCircle,
  FileText,
  Compass
} from 'lucide-react';

interface ArchitectureModalProps {
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200">
        <div className="bg-gradient-to-r from-emerald-900 to-stone-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-700/60 rounded-xl border border-emerald-500/40">
              <Cpu className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                معمارية منظومة AgriTech الوطنية (Fllah.dz Ecosystem)
              </h3>
              <p className="text-xs text-emerald-200">
                المخطط الهندسي، مصفوفة الميزات، ونموذج العمل والاستدامة
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

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs text-stone-700">
          {/* Section 1: Mobile & Offline First */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <h4 className="font-black text-stone-900 text-sm flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-700" />
              <span>1. تطبيق الهاتف الذكي ووضع الحقل (Flutter + Offline-First)</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-stone-600 pr-1">
              <li><strong>Local Caching:</strong> تخزين المحاصيل وحدود المزارع في قاعدة بيانات محلية (Hive / Isar) تعمل 100% بدون تغطية إنترنت في الحقول والواحات.</li>
              <li><strong>Voice-First Input:</strong> نظام إدخال صوتي باللهجة الدارجة الجزائرية أو الفصحى يستخرج بيانات المحصول، الكمية، والسعر تلقائياً دون الحاجة للكتابة.</li>
              <li><strong>Polygon Boundary Picker:</strong> رسم محيط القطعة الفلاحية بدقة متناهية لحساب المساحة بالهكتار والإنتاج التقديري.</li>
            </ul>
          </div>

          {/* Section 2: PostGIS & Geospatial Spatial Indexing */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <h4 className="font-black text-stone-900 text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-700" />
              <span>2. النظام الجغرافي وحساب الضمان المشفر (Node.js + Express + PostgreSQL / PostGIS)</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-stone-600 pr-1">
              <li><strong>R-Tree Spatial Indexing:</strong> استعلامات جغرافية فائقة السرعة لتصفية المزارع بشعاع كيلومتري دقيق: "أوجد مزارع الزيتون أو التمور في نطاق 50 كم من ولاية ميلة أو بسكرة".</li>
              <li><strong>Geo-Fencing:</strong> تنبيه المشترين والمطاعم المكتتبين عند جاهزية محصول جديد للحصاد في ولايتهم.</li>
              <li><strong>B2B Escrow Engine (PostgreSQL Transactions):</strong> إدارة دورة حياة عقود التوريد (<code className="text-emerald-700 font-mono">b2b_contracts</code> و <code className="text-emerald-700 font-mono">contract_shipments</code>) مع حجز العربون 15% وتحرير الدفعات فقط بعد استيفاء الشروط المخبرية (<code className="text-emerald-700 font-mono">acidity &le; 0.8%</code> و <code className="text-emerald-700 font-mono">pesticide_free = true</code>).</li>
            </ul>
          </div>

          {/* Section 3: Feature Matrix */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden">
            <table className="w-full text-right text-[11px]">
              <thead className="bg-emerald-950 text-white font-bold">
                <tr>
                  <th className="p-2.5">المحور</th>
                  <th className="p-2.5">الوضع التقليدي</th>
                  <th className="p-2.5 text-emerald-300">الترقية والتطوير في Fllah.dz</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 bg-white">
                <tr>
                  <td className="p-2 font-bold">الخرائط والتتبع</td>
                  <td className="p-2 text-stone-500">Pin فردي غير دقيق</td>
                  <td className="p-2 text-emerald-800 font-semibold">Geo-Fencing & Polygon: مساحة القطعة والإنتاج التقديري</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">إثبات الجودة</td>
                  <td className="p-2 text-stone-500">صور عادية للمنتج</td>
                  <td className="p-2 text-emerald-800 font-semibold">Traceability Badges: شهادات مخبرية (حموضة الزيت، خلو المبيدات، QR)</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">إدارة الطلبيات</td>
                  <td className="p-2 text-stone-500">اتصال هاتفي فقط</td>
                  <td className="p-2 text-emerald-800 font-semibold">Digital Purchase Intent: حجز مسبق قبل الحصاد وعقود B2B</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">اللوجستيات</td>
                  <td className="p-2 text-stone-500">المشتري يبحث بنفسه</td>
                  <td className="p-2 text-emerald-800 font-semibold">Carrier Matching: حاسبة مسافة وتكلفة فورية لشاحنات التبريد</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">سوق المعدات</td>
                  <td className="p-2 text-stone-500">خضار وفواكه فقط</td>
                  <td className="p-2 text-emerald-800 font-semibold">B2B Agro-Supplies: سوق للجرارات، معاصر الزيتون ومضخات الطاقة</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 4: Monetization */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-1.5">
            <h4 className="font-black text-amber-950 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-700" />
              <span>3. نموذج العمل والاستدامة المالية (Monetization Strategy)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
              <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                <strong className="text-amber-900 block mb-0.5">الحسابات الموثقة (Verified Badges)</strong>
                <span className="text-stone-600">اشتراك رمزي للفلاحين لتمييز مزارعهم وصدارتها في الخريطة ومحركات البحث.</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                <strong className="text-amber-900 block mb-0.5">إعلانات الموردين B2B</strong>
                <span className="text-stone-600">مساحات ترويجية لشركات الأسمدة، الطاقة الشمسية، ومعدات الري بالتقطير.</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                <strong className="text-amber-900 block mb-0.5">عمولة الصفقات الكبرى</strong>
                <span className="text-stone-600">تسهيل وتوثيق عقود التوريد السنوية بين المزارع والمطاعم/المصانع بضمان بنكي شفاف.</span>
              </div>
            </div>
          </div>

          {/* Section 5: GTM Strategy & Pilot Regions */}
          <div className="bg-teal-50/70 p-4 rounded-2xl border border-teal-200 space-y-2">
            <h4 className="font-black text-teal-950 text-sm flex items-center gap-2">
              <Compass className="w-4 h-4 text-teal-700" />
              <span>4. خطة العمل الموصى بها للإطلاق الميداني (GTM Strategy & Pilot Hubs)</span>
            </h4>
            
            <div className="space-y-2 text-stone-700 text-[11px]">
              <div>
                <strong className="text-teal-900 block">أ. شبكة الولايات النموذجية للإطلاق (Pilot Regions):</strong>
                <ul className="list-disc list-inside pr-1 space-y-0.5 text-stone-600 mt-1">
                  <li><strong>ميلة وقسنطينة:</strong> التركيز على منتجات أشجار الزيتون، زيت الزيتون البكر الممتاز، والحبوب الصلبة.</li>
                  <li><strong>بسكرة ووادي سوف:</strong> التركيز على الحجز المسبق للتمور (دقلة نور) والمحاصيل المغطاة والبطاطا الصحراوية.</li>
                  <li><strong>البليدة ومتيجة:</strong> التركيز على حمضيات التنعيم وعقود التوريد المباشرة لسلاسل المطاعم والمؤسسات الفندقية.</li>
                </ul>
              </div>

              <div className="pt-1 border-t border-teal-200/60">
                <strong className="text-teal-900 block">ب. الشراكات الميدانية المؤسساتية (Strategic MoUs):</strong>
                <ul className="list-disc list-inside pr-1 space-y-0.5 text-stone-600 mt-1">
                  <li><strong>المخابر الزراعية المعتمدة (INRAA / ITDAS / CACQE):</strong> توقيع مذكرات تفاهم لتبسيط إصدار شهادات التحليل الإلكترونية عبر رموز QR الرقمية في أقل من 24 ساعة.</li>
                  <li><strong>الغرف الفلاحية الولائية (CAW):</strong> التعاون الميداني لتسجيل المزارعين، التحقق من بطاقة الفلاح، وتفعيل تنبيهات الـ SMS والذكاء الاصطناعي المباشرة.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-stone-50 p-4 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition"
          >
            إغلاق المخطط
          </button>
        </div>
      </div>
    </div>
  );
};
