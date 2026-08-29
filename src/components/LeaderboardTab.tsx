import React from 'react';
import { Crown, Trophy, Medal, Flame, Award, Sparkles, TrendingUp, Users, RefreshCw, Database } from 'lucide-react';
import { LeaderboardEntry, UserProfile } from '../types';

interface LeaderboardTabProps {
  user: UserProfile;
  leaderboard: LeaderboardEntry[];
  onRefresh?: () => void;
  isRefreshing?: boolean;
  isGasConnected?: boolean;
}

export const LeaderboardTab: React.FC<LeaderboardTabProps> = ({
  user,
  leaderboard,
  onRefresh,
  isRefreshing = false,
  isGasConnected = false,
}) => {
  // Sort leaderboard descending by score
  const sorted = [...leaderboard].sort((a, b) => b.score - a.score).map((entry, index) => ({
    ...entry,
    rank: index + 1,
    isCurrentUser: entry.userId === user.userId,
  }));

  const top1 = sorted[0];
  const top2 = sorted[1];
  const top3 = sorted[2];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#161633] border border-white/5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-black text-white">อันดับคะแนนจริง (Classroom Leaderboard)</h3>
          </div>
          <p className="text-xs sm:text-sm text-indigo-200 mt-1">
            กระดานผู้นำวิชาการสร้างเว็บไซต์ ปวช.1 บันทึกคะแนนจริงจากการทำแบบทดสอบและการเช็คอิน
          </p>
        </div>

        <div className="flex items-center space-x-3 flex-wrap gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-cyan-300 transition active:scale-95 disabled:opacity-50"
              title="ดึงข้อมูลอันดับล่าสุดจาก Google Sheet"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'กำลังโหลด...' : 'รีเฟรชอันดับ'}</span>
            </button>
          )}

          <div className="flex items-center space-x-2.5 bg-white/5 px-4 py-2.5 rounded-2xl border border-white/10 text-xs">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-indigo-200">อันดับของคุณ:</span>
            <span className="font-bold font-mono text-amber-400 text-sm">
              #{user.rank || 1} ({user.score} EXP)
            </span>
          </div>
        </div>
      </div>

      {/* Podium Section (Responsive layout for 1, 2, or 3+ students) */}
      {sorted.length === 1 && top1 ? (
        /* Single User Podium */
        <div className="max-w-md mx-auto pt-4">
          <div className="p-7 rounded-3xl bg-gradient-to-b from-[#1a1a3c] via-[#161633] to-[#251b4d] border-2 border-amber-400/80 text-center flex flex-col items-center justify-between relative shadow-2xl shadow-amber-500/10">
            <div className="absolute -top-4 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-amber-500/30">
              <Crown className="w-4 h-4 fill-current" />
              <span>อันดับ 1 ประจำห้องเรียน</span>
            </div>

            <div className="mt-3 relative">
              <img
                src={top1.pictureUrl}
                alt={top1.displayName}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-amber-400 shadow-xl shadow-amber-500/25"
              />
              <span className="absolute -bottom-1 -right-1 text-xl">🥇</span>
            </div>

            <div className="my-3">
              <h4 className="font-black text-white text-base line-clamp-1">{top1.displayName}</h4>
              <div className="text-[11px] text-amber-300 font-mono font-bold">รหัส {top1.studentId}</div>
              <div className="text-xs text-indigo-200 mt-1">{top1.classroom}</div>
            </div>

            <div className="w-full py-3 px-4 rounded-2xl bg-white/5 border border-amber-400/30 flex items-center justify-between text-xs">
              <span className="text-amber-300 font-bold flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>คะแนนสะสม</span>
              </span>
              <span className="font-black font-mono text-amber-400 text-base">{top1.score} EXP</span>
            </div>
          </div>
        </div>
      ) : sorted.length === 2 && top1 && top2 ? (
        /* 2-Person Podium */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-4">
          {/* Gold #1 */}
          <div className="p-7 rounded-3xl bg-gradient-to-b from-[#1a1a3c] via-[#161633] to-[#251b4d] border-2 border-amber-400/80 text-center flex flex-col items-center justify-between relative shadow-2xl shadow-amber-500/10">
            <div className="absolute -top-4 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-amber-500/30">
              <Crown className="w-4 h-4 fill-current" />
              <span>อันดับ 1</span>
            </div>
            <div className="mt-3 relative">
              <img
                src={top1.pictureUrl}
                alt={top1.displayName}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-amber-400 shadow-xl shadow-amber-500/25"
              />
              <span className="absolute -bottom-1 -right-1 text-base">🥇</span>
            </div>
            <div className="my-3">
              <h4 className="font-black text-white text-base line-clamp-1">{top1.displayName}</h4>
              <div className="text-[11px] text-amber-300 font-mono font-bold">รหัส {top1.studentId}</div>
              <div className="text-xs text-indigo-200 mt-1">{top1.classroom}</div>
            </div>
            <div className="w-full py-2.5 px-3.5 rounded-2xl bg-white/5 border border-amber-400/30 flex items-center justify-between text-xs">
              <span className="text-amber-300 font-bold">คะแนนสะสม</span>
              <span className="font-black font-mono text-amber-400">{top1.score} EXP</span>
            </div>
          </div>

          {/* Silver #2 */}
          <div className="p-6 rounded-3xl bg-[#161633] border border-white/10 text-center flex flex-col items-center justify-between relative shadow-2xl">
            <div className="absolute -top-3.5 px-3.5 py-1 rounded-full bg-slate-300 text-slate-950 font-black text-xs flex items-center space-x-1 shadow-lg">
              <Medal className="w-3.5 h-3.5" />
              <span>อันดับ 2</span>
            </div>
            <div className="mt-3 relative">
              <img
                src={top2.pictureUrl}
                alt={top2.displayName}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-slate-400/80 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 text-base">🥈</span>
            </div>
            <div className="my-3">
              <h4 className="font-bold text-white text-sm line-clamp-1">{top2.displayName}</h4>
              <div className="text-[11px] text-indigo-300 font-mono">รหัส {top2.studentId}</div>
              <div className="text-xs text-indigo-200 mt-1">{top2.classroom}</div>
            </div>
            <div className="w-full py-2.5 px-3.5 rounded-2xl bg-[#1a1a3c] border border-white/5 flex items-center justify-between text-xs">
              <span className="text-indigo-300">คะแนนสะสม</span>
              <span className="font-bold font-mono text-slate-200">{top2.score} EXP</span>
            </div>
          </div>
        </div>
      ) : sorted.length >= 3 && top1 && top2 && top3 ? (
        /* 3-Person Full Podium */
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          {/* Silver #2 */}
          <div className="order-2 sm:order-1 p-6 rounded-3xl bg-[#161633] border border-white/10 text-center flex flex-col items-center justify-between relative shadow-2xl">
            <div className="absolute -top-3.5 px-3.5 py-1 rounded-full bg-slate-300 text-slate-950 font-black text-xs flex items-center space-x-1 shadow-lg">
              <Medal className="w-3.5 h-3.5" />
              <span>อันดับ 2</span>
            </div>
            <div className="mt-3 relative">
              <img
                src={top2.pictureUrl}
                alt={top2.displayName}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-slate-400/80 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 text-base">🥈</span>
            </div>
            <div className="my-3">
              <h4 className="font-bold text-white text-sm line-clamp-1">{top2.displayName}</h4>
              <div className="text-[11px] text-indigo-300 font-mono">รหัส {top2.studentId}</div>
              <div className="text-xs text-indigo-200 mt-1">{top2.classroom}</div>
            </div>
            <div className="w-full py-2.5 px-3.5 rounded-2xl bg-[#1a1a3c] border border-white/5 flex items-center justify-between text-xs">
              <span className="text-indigo-300">คะแนนสะสม</span>
              <span className="font-bold font-mono text-slate-200">{top2.score} EXP</span>
            </div>
          </div>

          {/* Gold #1 (Champion) */}
          <div className="order-1 sm:order-2 p-7 rounded-3xl bg-gradient-to-b from-[#1a1a3c] via-[#161633] to-[#251b4d] border-2 border-amber-400/80 text-center flex flex-col items-center justify-between relative shadow-2xl shadow-amber-500/10 scale-[1.03]">
            <div className="absolute -top-4 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-amber-500/30">
              <Crown className="w-4 h-4 fill-current" />
              <span>อันดับ 1</span>
            </div>
            <div className="mt-3 relative">
              <img
                src={top1.pictureUrl}
                alt={top1.displayName}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-amber-400 shadow-xl shadow-amber-500/25"
              />
              <span className="absolute -bottom-1 -right-1 text-xl">🥇</span>
            </div>
            <div className="my-3">
              <h4 className="font-black text-white text-base line-clamp-1">{top1.displayName}</h4>
              <div className="text-[11px] text-amber-300 font-mono font-bold">รหัส {top1.studentId}</div>
              <div className="text-xs text-indigo-200 mt-1">{top1.classroom}</div>
            </div>
            <div className="w-full py-3 px-4 rounded-2xl bg-white/5 border border-amber-400/30 flex items-center justify-between text-xs">
              <span className="text-amber-300 font-bold flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>คะแนนสะสม</span>
              </span>
              <span className="font-black font-mono text-amber-400 text-base">{top1.score} EXP</span>
            </div>
          </div>

          {/* Bronze #3 */}
          <div className="order-3 sm:order-3 p-6 rounded-3xl bg-[#161633] border border-white/10 text-center flex flex-col items-center justify-between relative shadow-2xl">
            <div className="absolute -top-3.5 px-3.5 py-1 rounded-full bg-amber-700 text-white font-black text-xs flex items-center space-x-1 shadow-lg">
              <Medal className="w-3.5 h-3.5" />
              <span>อันดับ 3</span>
            </div>
            <div className="mt-3 relative">
              <img
                src={top3.pictureUrl}
                alt={top3.displayName}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-amber-700/80 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 text-base">🥉</span>
            </div>
            <div className="my-3">
              <h4 className="font-bold text-white text-sm line-clamp-1">{top3.displayName}</h4>
              <div className="text-[11px] text-indigo-300 font-mono">รหัส {top3.studentId}</div>
              <div className="text-xs text-indigo-200 mt-1">{top3.classroom}</div>
            </div>
            <div className="w-full py-2.5 px-3.5 rounded-2xl bg-[#1a1a3c] border border-white/5 flex items-center justify-between text-xs">
              <span className="text-indigo-300">คะแนนสะสม</span>
              <span className="font-bold font-mono text-amber-400">{top3.score} EXP</span>
            </div>
          </div>
        </div>
      ) : null}

      {/* Full Leaderboard Table */}
      <div className="rounded-3xl bg-[#161633] border border-white/5 p-5 sm:p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-purple-400" />
            <h4 className="font-bold text-white text-sm sm:text-base">ตารางคะแนนผู้เรียนจริงในระดับชั้น</h4>
          </div>
          <span className="text-xs text-indigo-300 font-mono font-bold">ผู้เรียนในระบบ: {sorted.length} คน</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-indigo-400 uppercase text-[10px] tracking-[0.2em]">
                <th className="py-3 px-3 text-center">อันดับ</th>
                <th className="py-3 px-3">ผู้เรียน</th>
                <th className="py-3 px-3 hidden md:table-cell">ห้องเรียน</th>
                <th className="py-3 px-3 text-center hidden sm:table-cell">สตรีค</th>
                <th className="py-3 px-3 text-center hidden sm:table-cell">Badges</th>
                <th className="py-3 px-3 text-right">คะแนนรวม</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sorted.map((item) => {
                return (
                  <tr
                    key={item.userId}
                    className={`transition ${
                      item.isCurrentUser
                        ? 'bg-purple-900/30 font-semibold border-l-4 border-purple-500'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-3 text-center font-mono font-bold">
                      {item.rank === 1 ? (
                        <span className="text-amber-400 text-sm">🥇 1</span>
                      ) : item.rank === 2 ? (
                        <span className="text-slate-300 text-sm">🥈 2</span>
                      ) : item.rank === 3 ? (
                        <span className="text-amber-600 text-sm">🥉 3</span>
                      ) : (
                        <span className="text-indigo-300">#{item.rank}</span>
                      )}
                    </td>

                    {/* Student Info */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.pictureUrl}
                          alt={item.displayName}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10"
                        />
                        <div>
                          <div className="font-bold text-white flex items-center space-x-1.5">
                            <span>{item.displayName}</span>
                            {item.isCurrentUser && (
                              <span className="px-2 py-0.5 rounded-full bg-purple-600 text-[10px] text-white font-bold">
                                คุณ
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-indigo-300 font-mono">
                            รหัส: {item.studentId}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Classroom */}
                    <td className="py-3.5 px-3 text-indigo-200 hidden md:table-cell">
                      {item.classroom}
                    </td>

                    {/* Streak */}
                    <td className="py-3.5 px-3 text-center hidden sm:table-cell">
                      <span className="inline-flex items-center space-x-1 text-orange-400 font-mono font-bold">
                        <Flame className="w-3.5 h-3.5" />
                        <span>{item.streakDays} วัน</span>
                      </span>
                    </td>

                    {/* Badges Count */}
                    <td className="py-3.5 px-3 text-center hidden sm:table-cell">
                      <span className="inline-flex items-center space-x-1 text-amber-400 font-mono font-bold">
                        <Award className="w-3.5 h-3.5" />
                        <span>{item.badgesCount}</span>
                      </span>
                    </td>

                    {/* Score */}
                    <td className="py-3.5 px-3 text-right">
                      <span className="font-mono font-black text-cyan-300 text-sm">
                        {item.score} <span className="text-[11px] text-indigo-300 font-normal">EXP</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Live sync note */}
        {sorted.length <= 1 && (
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start space-x-3 text-xs text-indigo-200">
            <Database className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">ระบบจัดอันดับคะแนนจริงจาก Google Sheet:</span>
              <p className="mt-0.5 text-indigo-300">
                เมื่อเพื่อนนักศึกษาในชั้นเรียนเข้าใช้งานและส่งคะแนน ระบบจะบันทึกลงใน Google Sheet และแสดงอันดับของทุกคนที่นี่โดยอัตโนมัติ
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
