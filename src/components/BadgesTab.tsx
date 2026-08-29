import React, { useState } from 'react';
import { Award, Lock, Sparkles, CheckCircle2, Shield, Star, Filter } from 'lucide-react';
import { Badge, UserProfile } from '../types';
import { BADGES_DATA } from '../data/mockData';
import { soundManager } from '../utils/audio';

interface BadgesTabProps {
  user: UserProfile;
}

export const BadgesTab: React.FC<BadgesTabProps> = ({ user }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unlocked' | 'locked' | 'quiz' | 'checkin'>('all');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const badges = BADGES_DATA.map((b) => ({
    ...b,
    unlocked: user.badges.includes(b.id),
  }));

  const filteredBadges = badges.filter((b) => {
    if (selectedFilter === 'unlocked') return b.unlocked;
    if (selectedFilter === 'locked') return !b.unlocked;
    if (selectedFilter === 'quiz') return b.category === 'quiz';
    if (selectedFilter === 'checkin') return b.category === 'checkin';
    return true;
  });

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  const getRarityBadgeStyle = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'Legendary':
        return 'border-amber-500/60 bg-amber-500/10 text-amber-300';
      case 'Epic':
        return 'border-purple-500/60 bg-purple-500/10 text-purple-300';
      case 'Rare':
        return 'border-cyan-500/60 bg-cyan-500/10 text-cyan-300';
      default:
        return 'border-slate-700 bg-slate-800/40 text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#161633] border border-white/5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <Award className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-black text-white">สมุดสะสมเหรียญตรา (Badge Collection)</h3>
          </div>
          <p className="text-xs sm:text-sm text-indigo-200 mt-1">
            ปลดล็อกเหรียญตราเกียรติยศจากการเช็คอินสม่ำเสมอและทำแบบทดสอบได้คะแนนสูง
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-white/5 px-4 py-2.5 rounded-2xl border border-white/10">
          <div className="text-right">
            <div className="text-[10px] text-indigo-300 uppercase tracking-widest font-bold">ปลดล็อกแล้ว</div>
            <div className="text-lg font-black text-amber-400 font-mono">
              {unlockedCount} <span className="text-xs text-indigo-300 font-normal">/ {badges.length}</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300 border border-amber-500/30">
            <Star className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => { soundManager.playClick(); setSelectedFilter('all'); }}
          className={`px-4 py-2 rounded-full font-bold transition whitespace-nowrap ${
            selectedFilter === 'all'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
              : 'bg-[#161633] text-indigo-200 hover:text-white border border-white/5'
          }`}
        >
          ทั้งหมด ({badges.length})
        </button>

        <button
          onClick={() => { soundManager.playClick(); setSelectedFilter('unlocked'); }}
          className={`px-4 py-2 rounded-full font-bold transition whitespace-nowrap ${
            selectedFilter === 'unlocked'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
              : 'bg-[#161633] text-indigo-200 hover:text-white border border-white/5'
          }`}
        >
          ปลดล็อกแล้ว ({unlockedCount})
        </button>

        <button
          onClick={() => { soundManager.playClick(); setSelectedFilter('locked'); }}
          className={`px-4 py-2 rounded-full font-bold transition whitespace-nowrap ${
            selectedFilter === 'locked'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-[#161633] text-indigo-200 hover:text-white border border-white/5'
          }`}
        >
          ยังไม่ปลดล็อก ({badges.length - unlockedCount})
        </button>

        <button
          onClick={() => { soundManager.playClick(); setSelectedFilter('quiz'); }}
          className={`px-4 py-2 rounded-full font-bold transition whitespace-nowrap ${
            selectedFilter === 'quiz'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'bg-[#161633] text-indigo-200 hover:text-white border border-white/5'
          }`}
        >
          สายทำควิซ 🎯
        </button>

        <button
          onClick={() => { soundManager.playClick(); setSelectedFilter('checkin'); }}
          className={`px-4 py-2 rounded-full font-bold transition whitespace-nowrap ${
            selectedFilter === 'checkin'
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20'
              : 'bg-[#161633] text-indigo-200 hover:text-white border border-white/5'
          }`}
        >
          สายเช็คอิน 🔥
        </button>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => {
          return (
            <div
              key={badge.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedBadge(badge);
              }}
              className={`cursor-pointer rounded-3xl border p-5 sm:p-6 transition-all duration-300 relative overflow-hidden flex flex-col justify-between shadow-xl ${
                badge.unlocked
                  ? 'bg-[#161633] border-white/5 hover:border-purple-500 hover:shadow-purple-500/10 hover:-translate-y-1'
                  : 'bg-[#161633]/60 border-white/5 opacity-60 hover:opacity-80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  {/* Badge Icon */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${
                    badge.unlocked
                      ? 'bg-purple-500/20 border border-purple-500/30 shadow-lg shadow-purple-500/20'
                      : 'bg-white/5 border border-white/10 grayscale'
                  }`}>
                    {badge.unlocked ? badge.icon : '🔒'}
                  </div>

                  {/* Rarity Tag */}
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getRarityBadgeStyle(badge.rarity)}`}>
                    {badge.rarity}
                  </span>
                </div>

                <div className="mt-4">
                  <h4 className="font-bold text-white text-base flex items-center space-x-1.5">
                    <span>{badge.nameTh}</span>
                  </h4>
                  <div className="text-[11px] text-indigo-300 font-mono">{badge.name}</div>
                  <p className="text-xs text-indigo-200 mt-2 line-clamp-2">
                    {badge.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1 text-amber-400 font-mono font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+{badge.expBonus} EXP</span>
                </div>

                {badge.unlocked ? (
                  <span className="flex items-center space-x-1 text-emerald-400 text-[11px] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ปลดล็อกแล้ว</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 text-indigo-300 text-[11px]">
                    <Lock className="w-3 h-3" />
                    <span>ล็อกอยู่</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-[#161633] border border-white/10 p-6 sm:p-7 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${getRarityBadgeStyle(selectedBadge.rarity)}`}>
                ระดับ: {selectedBadge.rarity}
              </span>
              <button
                onClick={() => setSelectedBadge(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-indigo-200 hover:text-white hover:bg-white/10 transition"
              >
                ✕
              </button>
            </div>

            <div className="text-center space-y-2 pt-2">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-4xl shadow-xl shadow-purple-500/20">
                {selectedBadge.unlocked ? selectedBadge.icon : '🔒'}
              </div>
              <h3 className="text-xl font-black text-white">{selectedBadge.nameTh}</h3>
              <div className="text-xs text-indigo-300 font-mono">{selectedBadge.name}</div>
              <p className="text-xs text-indigo-200 leading-relaxed pt-1">
                {selectedBadge.description}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#1a1a3c] border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-indigo-300">เงื่อนไขการปลดล็อก:</span>
                <span className="text-white font-medium text-right">{selectedBadge.requirement}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-300">โบนัสคะแนน:</span>
                <span className="text-amber-400 font-mono font-bold">+{selectedBadge.expBonus} EXP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-300">สถานะ:</span>
                <span className={selectedBadge.unlocked ? 'text-emerald-400 font-bold' : 'text-indigo-300 font-semibold'}>
                  {selectedBadge.unlocked ? '✅ ปลดล็อกเรียบร้อยแล้ว' : '🔒 ยังไม่สำเร็จ'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition"
            >
              ปิดหน้าต่าง
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
