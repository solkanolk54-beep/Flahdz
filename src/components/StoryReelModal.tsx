import React from 'react';
import { StoryReel } from '../types/agritech';
import { X, Play, MapPin, Calendar, MessageSquare, ShieldCheck } from 'lucide-react';

interface StoryReelModalProps {
  reel: StoryReel;
  onClose: () => void;
}

export const StoryReelModal: React.FC<StoryReelModalProps> = ({ reel, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative bg-stone-900 rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-stone-800 text-white flex flex-col h-[580px]">
        {/* Top Controls */}
        <div className="absolute top-4 right-4 left-4 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold bg-black/60 backdrop-blur px-2.5 py-1 rounded-full flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              {reel.wilaya} • {reel.date}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Background */}
        <div className="relative flex-1 bg-stone-950 flex items-center justify-center overflow-hidden">
          <img
            src={reel.thumbnail}
            alt={reel.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40"></div>

          {reel.mediaType === 'video' && (
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 animate-pulse">
              <Play className="w-6 h-6 ml-1" />
            </div>
          )}
        </div>

        {/* Bottom Story Caption & Direct Action */}
        <div className="relative z-20 p-5 bg-gradient-to-t from-stone-950 via-stone-900/90 to-transparent space-y-3">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
              توثيق حي من المزرعة
            </span>
            <h4 className="text-base font-extrabold text-white">
              {reel.title}
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              {reel.caption}
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                alert('تم التوجيه للتواصل المباشر مع صاحب الحقل عبر واتساب للاستفسار عن هذا المحصول.');
                onClose();
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>استفسر عن هذا المحصول مباشرة</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
