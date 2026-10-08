import React from 'react';
import { 
  Sprout, 
  MapPin, 
  Wifi, 
  WifiOff, 
  Mic, 
  PlusCircle, 
  Truck, 
  Wrench, 
  TrendingUp, 
  Layers, 
  ShieldCheck, 
  PhoneCall,
  CalendarDays
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'market' | 'gis' | 'preorder' | 'carriers' | 'equipment' | 'trends';
  setActiveTab: (tab: 'market' | 'gis' | 'preorder' | 'carriers' | 'equipment' | 'trends') => void;
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  onOpenVoiceInput: () => void;
  onOpenAddCrop: () => void;
  pendingOfflineCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isOffline,
  setIsOffline,
  onOpenVoiceInput,
  onOpenAddCrop,
  pendingOfflineCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-200 shadow-xs">
      {/* Top micro-bar: Algeria AgriTech Identity & Network Status */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-emerald-800/80 px-2 py-0.5 rounded text-[11px] font-semibold text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              المنظومة الوطنية Fllah.dz
            </span>
            <span className="hidden md:inline text-stone-300">
              ربط مباشر للمزارع الجزائرية بدون وسطاء • تتبع مخبري • لوجستيات مبردة
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Offline Simulator Switch */}
            <button
              onClick={() => setIsOffline(!isOffline)}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${
                isOffline
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-800/60 text-emerald-200 hover:bg-emerald-800'
              }`}
              title="محاكاة وضع الحقل بدون تغطية إنترنت (Offline-First)"
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>وضع الحقل بدون شبكة (Offline Caching)</span>
                  {pendingOfflineCount > 0 && (
                    <span className="bg-amber-400 text-stone-900 font-bold px-1.5 rounded-full text-[10px]">
                      {pendingOfflineCount}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span>الشبكة متصلة (مزامنة فورية)</span>
                </>
              )}
            </button>

            <span className="text-emerald-400 font-mono text-[11px] hidden sm:inline">
              DZ-AGRI-2026
            </span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('market')}>
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-900 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
            <Sprout className="w-6 h-6 text-emerald-200" />
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-stone-900 rounded-full p-0.5 border-2 border-white">
              <ShieldCheck className="w-3 h-3" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-stone-900 font-['Cairo']">
                فلاّح تيك <span className="text-emerald-700 font-black">Fllah.dz</span>
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-300">
                AgriTech DZ
              </span>
            </div>
            <p className="text-xs text-stone-500">
              سوق المحاصيل المباشر • Geo-GIS • مطابقة النقل • التنبؤ بالحصاد
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Voice Input Simulator for elderly / busy farmers */}
          <button
            onClick={onOpenVoiceInput}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition shadow-xs"
            title="إدخال صوتي باللهجة الدارجة أو الفصحى"
          >
            <Mic className="w-4 h-4 text-amber-600 animate-pulse" />
            <span className="hidden sm:inline">إدخال صوتي للمحصول</span>
            <span className="sm:hidden">صوتي</span>
          </button>

          {/* Add Crop Listing */}
          <button
            onClick={onOpenAddCrop}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition shadow-sm shadow-emerald-700/25 active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-emerald-200" />
            <span>إضافة محصول / قطعة</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-stone-50 border-t border-stone-200 px-4 sm:px-6 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 py-1.5 min-w-max">
          <button
            onClick={() => setActiveTab('market')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${
              activeTab === 'market'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-700 hover:bg-stone-200/70'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>السوق المباشر (Direct-to-Buyer)</span>
          </button>

          <button
            onClick={() => setActiveTab('gis')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${
              activeTab === 'gis'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-700 hover:bg-stone-200/70'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>الخريطة والمحيط الجغرافي (GIS & Polygon)</span>
          </button>

          <button
            onClick={() => setActiveTab('preorder')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${
              activeTab === 'preorder'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-700 hover:bg-stone-200/70'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>الحجز المسبق قبل الحصاد (Pre-order)</span>
          </button>

          <button
            onClick={() => setActiveTab('carriers')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${
              activeTab === 'carriers'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-700 hover:bg-stone-200/70'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>شبكة الناقلين والشاحنات المبردة</span>
          </button>

          <button
            onClick={() => setActiveTab('equipment')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${
              activeTab === 'equipment'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-700 hover:bg-stone-200/70'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>سوق العتاد والمستلزمات B2B</span>
          </button>

          <button
            onClick={() => setActiveTab('trends')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${
              activeTab === 'trends'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-700 hover:bg-stone-200/70'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>بورصة الأسعار والطقس الزراعي</span>
          </button>
        </div>
      </div>
    </header>
  );
};
