import React, { useState } from 'react';
import { AgriculturalEquipment } from '../types/agritech';
import { 
  Wrench, 
  Tag, 
  MapPin, 
  PhoneCall, 
  PlusCircle, 
  CheckCircle, 
  ShieldCheck, 
  Sun, 
  Zap, 
  Check, 
  Filter
} from 'lucide-react';

interface EquipmentB2BProps {
  equipmentList: AgriculturalEquipment[];
  onOpenAddEquipment?: () => void;
}

export const EquipmentB2B: React.FC<EquipmentB2BProps> = ({
  equipmentList,
  onOpenAddEquipment,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [dealTypeFilter, setDealTypeFilter] = useState<string>('الكل');

  const categories = [
    'الكل',
    'جرارات وحصادات',
    'معاصر زيتون',
    'ري وطاقة شمسية',
    'أسمدة ومخصبات'
  ];

  const filteredItems = equipmentList.filter(item => {
    const matchesCat = selectedCategory === 'الكل' || item.category === selectedCategory;
    const matchesDeal = dealTypeFilter === 'الكل' || item.dealType === dealTypeFilter;
    return matchesCat && matchesDeal;
  });

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-stone-900 to-emerald-950 rounded-2xl p-5 sm:p-6 text-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                <Wrench className="w-5 h-5" />
              </span>
              <h2 className="text-lg sm:text-xl font-black">
                سوق العتاد والمستلزمات الفلاحية B2B (Agro-Supplies & Equipment)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl">
              منصة لتبادل وكراء وشراء الآلات الزراعية (جرارات، معاصر زيتون، مضخات طاقة شمسية، أسمدة عضوية معتمدة) مباشرة بين الفلاحين والتعاونيات والموردين.
            </p>
          </div>

          <button
            onClick={() => alert('تم فتح نموذج نشر إعلان عتاد أو مستلزمات فلاحية جديدة')}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>عرض آلة أو سماد للإيجار/البيع</span>
          </button>
        </div>
      </div>

      {/* Filter and Tabs */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Deal Type Switcher */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-bold text-stone-700">
          {['الكل', 'بيع', 'كراء موسمي'].map((deal) => (
            <button
              key={deal}
              onClick={() => setDealTypeFilter(deal)}
              className={`px-3 py-1.5 rounded-lg transition ${
                dealTypeFilter === deal ? 'bg-white text-emerald-800 shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              {deal}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs hover:border-emerald-500 transition duration-200 flex flex-col justify-between"
          >
            <div>
              {/* Image & Badges */}
              <div className="relative h-48 bg-stone-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30"></div>

                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black shadow-xs ${
                    item.dealType === 'بيع' ? 'bg-blue-600 text-white' : 'bg-amber-500 text-stone-900'
                  }`}>
                    {item.dealType}
                  </span>
                  <span className="bg-black/60 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.condition}
                  </span>
                </div>

                <div className="absolute bottom-2.5 right-2.5 text-white">
                  <span className="text-[11px] font-bold bg-black/50 backdrop-blur px-2 py-0.5 rounded flex items-center gap-1 w-fit mb-0.5">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    {item.wilaya}
                  </span>
                  <div className="text-xs text-stone-200 font-medium">
                    {item.ownerName}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <h3 className="font-extrabold text-stone-900 text-sm leading-snug line-clamp-2">
                  {item.title}
                </h3>

                {/* Price */}
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-500 font-semibold">التسعيرة:</span>
                  <div className="text-base font-black text-emerald-800 font-mono">
                    {item.price.toLocaleString()} دج
                    <span className="text-xs font-normal text-stone-600 mr-1">/ {item.priceUnit}</span>
                  </div>
                </div>

                {/* Specs List */}
                <div className="space-y-1">
                  <div className="text-[11px] text-stone-500 font-bold">المواصفات الفنية:</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {item.specs.map((spec, idx) => (
                      <div key={idx} className="text-[11px] text-stone-700 bg-stone-50 p-1.5 rounded-lg border border-stone-100 flex items-center gap-1 truncate">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 pt-0">
              <a
                href={`tel:${item.ownerPhone}`}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>اتصال بالمالك ({item.ownerPhone})</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
