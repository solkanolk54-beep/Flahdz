import React, { useState } from 'react';
import { Crop } from '../types/agritech';
import { 
  X, 
  PlusCircle, 
  Sprout, 
  Layers, 
  MapPin, 
  CheckCircle, 
  Clock, 
  ShieldCheck,
  FileCheck2
} from 'lucide-react';

interface AddCropModalProps {
  onClose: () => void;
  onAddCrop: (crop: Partial<Crop>) => void;
}

export const AddCropModal: React.FC<AddCropModalProps> = ({ onClose, onAddCrop }) => {
  const [title, setTitle] = useState('');
  const [variety, setVariety] = useState('');
  const [category, setCategory] = useState<Crop['category']>('خضروات');
  const [wilaya, setWilaya] = useState('ميلة (Mila)');
  const [commune, setCommune] = useState('');
  const [quantity, setQuantity] = useState(50);
  const [unit, setUnit] = useState<Crop['unit']>('قنطار');
  const [pricePerUnit, setPricePerUnit] = useState(6000);
  const [harvestStatus, setHarvestStatus] = useState<Crop['harvestStatus']>('جاهز للشحن الفوري');
  const [daysToHarvest, setDaysToHarvest] = useState(0);
  const [farmerName, setFarmerName] = useState('الحاج العربي');
  const [farmerPhone, setFarmerPhone] = useState('0555123456');
  const [hasLabCert, setHasLabCert] = useState(true);
  const [acidity, setAcidity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !variety) {
      alert('يرجى كتابة اسم المحصول وصنفه');
      return;
    }

    onAddCrop({
      title,
      variety,
      category,
      wilaya,
      commune: commune || 'البلدية الفلاحية',
      farmName: `مزرعة ${farmerName}`,
      farmerName,
      farmerPhone,
      farmerWhatsapp: `213${farmerPhone.replace(/^0/, '')}`,
      quantityAvailable: Number(quantity),
      unit,
      pricePerUnit: Number(pricePerUnit),
      harvestStatus,
      daysToHarvest: harvestStatus === 'حجز مسبق قبل الجني' ? Number(daysToHarvest) : 0,
      harvestDateEstimated: harvestStatus === 'حجز مسبق قبل الجني' ? '2026-10-28' : '2026-10-08',
      minimumOrder: 5,
      image: category === 'أشجار مثمرة وزيتون' 
        ? 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
        : category === 'تمور'
        ? 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=800&q=80'
        : category === 'دواجن ومواشي'
        ? 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
      images: [],
      description: `محصول طازج عالي الجودة من حقول ${wilaya} مباشر من الفلاح دون سماسرة.`,
      isPreOrderAllowed: harvestStatus === 'حجز مسبق قبل الجني',
      preOrdersCount: 0,
      preOrderedQuantity: 0,
      verifiedDirect: true,
      soilType: 'تربة فلاحية محلية خصبة',
      labCertificate: hasLabCert ? {
        labName: 'مخبر التحاليل الزراعية والنوعية (INRAA)',
        certNumber: `DZ-${wilaya.substring(0,3).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        issueDate: '2026-10-01',
        acidityLevel: acidity || undefined,
        pesticideResidue: '0.00 ملغ/كغ (سليم وخالي من المبيدات)',
        waterSource: 'مياه جوفية عذبة',
        organicCertified: true,
      } : undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-700/60 rounded-xl border border-emerald-500/40">
              <PlusCircle className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                إضافة محصول فلاحي جديد أو قطعة أرض
              </h3>
              <p className="text-xs text-emerald-200">
                تسجيل مباشر في سوق Fllah.dz مع التوثيق الجغرافي
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                اسم المحصول:
              </label>
              <input
                type="text"
                required
                placeholder="مثال: طماطم حقلية / زيت زيتون بكر"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                الصنف الفلاحي (Variety):
              </label>
              <input
                type="text"
                required
                placeholder="مثال: كاليستا / دقلة نور / شملال"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                التصنيف:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Crop['category'])}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="أشجار مثمرة وزيتون">أشجار مثمرة وزيتون</option>
                <option value="دواجن ومواشي">دواجن ومواشي (دجاج عرب وأغنام)</option>
                <option value="حبوب وبقوليات">حبوب وبقوليات (قمح صلب وعدس)</option>
                <option value="خضروات">خضروات وثوم</option>
                <option value="تمور">تمور</option>
                <option value="حمضيات">حمضيات</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                الولاية:
              </label>
              <select
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ميلة (Mila)">ميلة (Mila)</option>
                <option value="قسنطينة (Constantine)">قسنطينة (Constantine)</option>
                <option value="جيجل (Jijel)">جيجل (Jijel)</option>
                <option value="بسكرة (Biskra)">بسكرة (Biskra)</option>
                <option value="معسكر (Mascara)">معسكر (Mascara)</option>
                <option value="البليدة (Blida)">البليدة (Blida)</option>
                <option value="وادي سوف (El Oued)">وادي سوف (El Oued)</option>
                <option value="مستغانم (Mostaganem)">مستغانم (Mostaganem)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                الكمية:
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                الوحدة:
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as Crop['unit'])}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="قنطار">قنطار</option>
                <option value="طن">طن</option>
                <option value="لتر">لتر</option>
                <option value="طير">طير (دواجن)</option>
                <option value="رأس">رأس (أغنام)</option>
                <option value="صندوق">صندوق</option>
                <option value="كغ">كغ</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                السعر (دج):
              </label>
              <input
                type="number"
                min="1"
                required
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Harvest status */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              حالة الجني والحصاد:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setHarvestStatus('جاهز للشحن الفوري')}
                className={`py-2 px-3 rounded-xl border text-center font-bold transition ${
                  harvestStatus === 'جاهز للشحن الفوري'
                    ? 'bg-emerald-100 border-emerald-600 text-emerald-900'
                    : 'border-stone-200 bg-white text-stone-600'
                }`}
              >
                جاهز للشحن الفوري
              </button>

              <button
                type="button"
                onClick={() => setHarvestStatus('حجز مسبق قبل الجني')}
                className={`py-2 px-3 rounded-xl border text-center font-bold transition ${
                  harvestStatus === 'حجز مسبق قبل الجني'
                    ? 'bg-amber-100 border-amber-600 text-amber-900'
                    : 'border-stone-200 bg-white text-stone-600'
                }`}
              >
                حجز مسبق قبل الجني
              </button>
            </div>
          </div>

          {harvestStatus === 'حجز مسبق قبل الجني' && (
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                كم يوماً متبقياً حتى اكتمال النضج والجني؟
              </label>
              <input
                type="number"
                min="1"
                max="90"
                value={daysToHarvest}
                onChange={(e) => setDaysToHarvest(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          {/* Farmer Contact info */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-100">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                اسم الفلاح / التعاونية:
              </label>
              <input
                type="text"
                required
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                رقم الهاتف (للاتصال المباشر):
              </label>
              <input
                type="tel"
                required
                value={farmerPhone}
                onChange={(e) => setFarmerPhone(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-md mt-2"
          >
            نشر المحصول في المنظومة
          </button>
        </form>
      </div>
    </div>
  );
};
