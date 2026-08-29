import React, { useState } from 'react';
import { Calendar, Flame, CheckCircle2, Sparkles, Gift, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyQuest, UserProfile } from '../types';
import { soundManager } from '../utils/audio';

interface CheckInTabProps {
  user: UserProfile;
  quests: DailyQuest[];
  onCheckIn: () => void;
  onClaimQuest: (questId: string) => void;
  onGoToQuiz: () => void;
}

const STREAK_REWARDS = [
  { day: 1, exp: 30, bonus: 'เริ่มต้นสัปดาห์' },
  { day: 2, exp: 40, bonus: 'สะสมวันที่ 2' },
  { day: 3, exp: 50, bonus: 'สตรีค 3 วัน 🔥' },
  { day: 4, exp: 60, bonus: 'สะสมวันที่ 4' },
  { day: 5, exp: 70, bonus: 'สปีดอัพ x1.5' },
  { day: 6, exp: 80, bonus: 'เกือบครบสัปดาห์' },
  { day: 7, exp: 150, bonus: '👑 โบนัสแชมป์ 7 วัน' },
];

export const CheckInTab: React.FC<CheckInTabProps> = ({
  user,
  quests,
  onCheckIn,
  onClaimQuest,
  onGoToQuiz,
}) => {
  const [isCheckedInToday, setIsCheckedInToday] = useState<boolean>(() => {
    const today = new Date().toISOString().split('T')[0];
    return user.lastCheckInDate === today;
  });

  const handleCheckInClick = () => {
    if (isCheckedInToday) return;

    soundManager.playCheckIn();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#818cf8', '#c084fc', '#f59e0b'],
    });

    setIsCheckedInToday(true);
    onCheckIn();
  };

  const currentStreakDay = user.streakDays % 7 || (user.streakDays > 0 ? 7 : 0);

  return (
    <div className="space-y-6">
      
      {/* 1. Daily Check-in Main Action Card */}
      <div className="relative overflow-hidden rounded-3xl bg-[#161633] border border-white/5 p-6 sm:p-7 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>Daily Attendance Check-in</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              เช็คอินเข้าเรียนสะสมสตรีค & รับ EXP
            </h3>
            <p className="text-sm text-indigo-200 leading-relaxed">
              เช็คอินทุกวันเพื่อรับคะแนน EXP และรักษาแถบสตรีคไฟ 🔥 ยิ่งเช็คอินต่อเนื่อง โบนัสคะแนนยิ่งสูงขึ้น บันทึกลง Google Sheet และแจ้งเตือนผ่าน LINE ทันที
            </p>
          </div>

          {/* Big Check-in Button */}
          <div className="w-full md:w-auto flex flex-col items-center">
            {isCheckedInToday ? (
              <div className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold shadow-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>เช็คอินวันนี้แล้ว (+{STREAK_REWARDS[Math.min(6, Math.max(0, user.streakDays - 1))].exp} EXP)</span>
              </div>
            ) : (
              <button
                onClick={handleCheckInClick}
                className="w-full sm:w-auto group relative inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-base shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Flame className="w-5 h-5 text-slate-950 animate-bounce" />
                <span>กดเช็คอินวันนี้ (+30 EXP)</span>
                <Sparkles className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition" />
              </button>
            )}
            <span className="text-[11px] text-indigo-300 mt-2 flex items-center space-x-1">
              <Clock className="w-3 h-3 text-indigo-400" />
              <span>รีเซ็ตทุกเที่ยงคืน (00:00 น.)</span>
            </span>
          </div>

        </div>

        {/* 7-Day Streak Timeline Board */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-xs uppercase tracking-[0.2em] text-indigo-400 flex items-center space-x-1.5">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>7-Day Streak Journey (สตรีคปัจจุบัน: {user.streakDays} วัน)</span>
            </span>
            <span className="text-purple-400 font-mono font-bold">วันที่ {currentStreakDay}/7</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
            {STREAK_REWARDS.map((item) => {
              const isPastOrCurrent = item.day <= currentStreakDay;
              const isToday = item.day === currentStreakDay;

              return (
                <div
                  key={item.day}
                  className={`relative p-3.5 rounded-2xl border flex flex-col items-center text-center transition-all ${
                    isToday
                      ? 'bg-purple-600/30 border-purple-500 shadow-lg shadow-purple-500/20 ring-1 ring-purple-400'
                      : isPastOrCurrent
                      ? 'bg-[#1a1a3c] border-indigo-500/40 text-slate-200'
                      : 'bg-[#1a1a3c]/50 border-white/5 text-slate-500'
                  }`}
                >
                  {isToday && (
                    <span className="absolute -top-2.5 px-2 py-0.5 rounded-full bg-purple-500 text-[9px] font-black text-white uppercase tracking-wider shadow">
                      วันนี้
                    </span>
                  )}

                  <div className="text-[11px] font-bold text-indigo-300 mb-1">
                    Day {item.day}
                  </div>

                  <div className="my-1">
                    {isPastOrCurrent ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <Gift className="w-6 h-6 text-slate-600" />
                    )}
                  </div>

                  <div className={`font-mono text-sm font-black mt-1 ${isPastOrCurrent ? 'text-amber-400' : 'text-slate-500'}`}>
                    +{item.exp}
                  </div>

                  <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                    {item.bonus}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 2. Daily Quests Section */}
      <div className="rounded-3xl bg-[#161633] border border-white/5 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg">ภารกิจประจำวัน (Daily Missions)</h3>
              <p className="text-xs text-indigo-300">ทำภารกิจให้สำเร็จเพื่อรับโบนัส EXP เพิ่มเติม</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {quests.map((quest) => {
            const isFinished = quest.progress >= quest.target;

            return (
              <div
                key={quest.id}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition ${
                  quest.claimed
                    ? 'bg-[#1a1a3c]/40 border-white/5 opacity-70'
                    : isFinished
                    ? 'bg-[#1a1a3c] border-purple-500/50 shadow-md shadow-purple-500/10'
                    : 'bg-[#1a1a3c] border-white/10 hover:border-purple-500/40'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl flex-shrink-0">
                    {quest.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{quest.title}</h4>
                    <p className="text-xs text-indigo-200 mt-0.5">{quest.description}</p>
                    
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-24 h-1.5 rounded-full bg-gray-900 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                          style={{ width: `${Math.min(100, (quest.progress / quest.target) * 100)}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-indigo-300">
                        {quest.progress}/{quest.target}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-1.5 flex-shrink-0">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    +{quest.expReward} EXP
                  </span>

                  {quest.claimed ? (
                    <span className="px-2.5 py-1 rounded-full bg-white/5 text-[11px] font-medium text-slate-400 border border-white/5">
                      รับแล้ว
                    </span>
                  ) : isFinished ? (
                    <button
                      onClick={() => {
                        soundManager.playLevelUp();
                        confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
                        onClaimQuest(quest.id);
                      }}
                      className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow transition active:scale-95"
                    >
                      รับรางวัล
                    </button>
                  ) : (
                    <button
                      onClick={onGoToQuiz}
                      className="px-3 py-1 rounded-full bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center space-x-1 transition"
                    >
                      <span>ทำทันที</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
