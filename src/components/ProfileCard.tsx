import React from 'react';
import { Trophy, BookOpen, Target, Award, Crown, Sparkles, User, GraduationCap, Edit3 } from 'lucide-react';
import { UserProfile, LevelThreshold } from '../types';
import { LEVEL_THRESHOLDS } from '../data/mockData';

interface ProfileCardProps {
  user: UserProfile;
  totalLessons: number;
  totalQuests: number;
  totalBadges: number;
  syncStatus?: 'idle' | 'saving' | 'saved' | 'error';
  lastSavedTime?: string;
  onEditProfile: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  totalLessons,
  totalQuests,
  totalBadges,
  syncStatus = 'saved',
  lastSavedTime,
  onEditProfile,
}) => {
  const currentLevelInfo: LevelThreshold = LEVEL_THRESHOLDS.find((l) => l.level === user.level) || LEVEL_THRESHOLDS[0];
  const nextLevelInfo: LevelThreshold | undefined = LEVEL_THRESHOLDS.find((l) => l.level === user.level + 1);

  const minExp = currentLevelInfo.minExp;
  const maxExp = nextLevelInfo ? nextLevelInfo.minExp : currentLevelInfo.maxExp;
  const expInLevel = Math.max(0, user.score - minExp);
  const expSpan = Math.max(1, maxExp - minExp);
  const progressPercent = Math.min(100, Math.round((expInLevel / expSpan) * 100));

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#161633] border border-white/5 p-6 sm:p-7 shadow-2xl">
      
      {/* Decorative Subtle Ambient Glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -mb-20 w-60 h-60 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header section with Tracking Tag */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        
        {/* Avatar & Identifiers */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-2 border-purple-500 bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-purple-500/25">
              <img
                src={user.pictureUrl}
                alt={user.displayName}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 rounded-full bg-[#161633] border-2 border-purple-500 text-xs shadow">
              {currentLevelInfo.icon}
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {user.displayName}
              </h2>
              <button
                onClick={onEditProfile}
                className="p-1.5 rounded-full text-indigo-300 hover:text-white hover:bg-white/10 transition"
                title="แก้ไขข้อมูลนักศึกษา"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center space-x-2 mt-1 text-xs sm:text-sm text-indigo-200 flex-wrap gap-y-1">
              <span className="flex items-center space-x-1 text-blue-300 font-mono bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>รหัส: {user.studentId}</span>
              </span>
              <span className="text-white/20 hidden xs:inline">•</span>
              <span className="text-indigo-300 text-xs bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                {user.classroom}
              </span>
            </div>

            {user.statusMessage && (
              <p className="mt-1.5 text-xs text-indigo-300/80 italic line-clamp-1">
                "{user.statusMessage}"
              </p>
            )}
          </div>
        </div>

        {/* Level & Rank Highlight Badge + Edit Profile Button */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end flex-wrap gap-2">
          <button
            onClick={onEditProfile}
            className="px-3.5 py-2 rounded-2xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-200 hover:text-white text-xs font-bold transition flex items-center space-x-1.5 active:scale-95 shadow-sm cursor-pointer"
            title="แก้ไขข้อมูลส่วนตัว / จัดการบัญชี LINE"
          >
            <Edit3 className="w-3.5 h-3.5 text-purple-400" />
            <span>แก้ไขข้อมูลส่วนตัว</span>
          </button>

          <div className="px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-right">
            <div className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-bold">
              Level {user.level}
            </div>
            <div className="flex items-center space-x-1.5 justify-end mt-0.5">
              <span className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {currentLevelInfo.titleEn}
              </span>
            </div>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 text-right">
            <div className="text-[10px] uppercase tracking-[0.2em] text-yellow-400/90 font-bold flex items-center space-x-1 justify-end">
              <Crown className="w-3 h-3 text-yellow-400" />
              <span>Rank</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-yellow-400 font-mono mt-0.5">
              #{user.rank}
            </div>
          </div>
        </div>

      </div>

      {/* Progress Dashboard Sub-section */}
      <div className="relative z-10 mt-6 space-y-4">
        
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2.5">
            <h2 className="text-xs uppercase tracking-[0.2em] text-indigo-400 font-bold">
              Progress Dashboard
            </h2>
            <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Auto-Saved {lastSavedTime}</span>
            </div>
          </div>
          <div className="text-xs font-mono">
            <span className="text-gray-400">Current XP: </span>
            <span className="text-purple-400 font-bold">{progressPercent}%</span>
            <span className="text-gray-500 ml-2">({user.score} / {maxExp} XP)</span>
          </div>
        </div>

        <div className="h-2.5 w-full bg-gray-900 rounded-full overflow-hidden p-0.5 border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 4 Dashboard Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
          
          {/* Metric 1: Points */}
          <div className="bg-white/5 rounded-2xl p-3.5 text-center border border-white/5 hover:border-blue-500/30 transition">
            <p className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-mono">
              {user.score}
            </p>
            <p className="text-[10px] text-indigo-300 uppercase tracking-widest mt-0.5 font-bold">Total Points</p>
          </div>

          {/* Metric 2: Lessons */}
          <div className="bg-white/5 rounded-2xl p-3.5 text-center border border-white/5 hover:border-blue-500/30 transition">
            <p className="text-xl sm:text-2xl font-bold text-blue-400 font-mono">
              {String(user.completedLessons.length).padStart(2, '0')}
              <span className="text-xs text-gray-500 font-normal"> / {String(totalLessons).padStart(2, '0')}</span>
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5 font-bold">Lessons</p>
          </div>

          {/* Metric 3: Missions / Quests */}
          <div className="bg-white/5 rounded-2xl p-3.5 text-center border border-white/5 hover:border-purple-500/30 transition">
            <p className="text-xl sm:text-2xl font-bold text-purple-400 font-mono">
              {String(user.completedQuests.length).padStart(2, '0')}
              <span className="text-xs text-gray-500 font-normal"> / {String(totalQuests).padStart(2, '0')}</span>
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5 font-bold">Missions</p>
          </div>

          {/* Metric 4: Achievement Badges */}
          <div className="bg-white/5 rounded-2xl p-3.5 text-center border border-white/5 hover:border-pink-500/30 transition">
            <p className="text-xl sm:text-2xl font-bold text-pink-400 font-mono">
              {String(user.badges.length).padStart(2, '0')}
              <span className="text-xs text-gray-500 font-normal"> / {String(totalBadges).padStart(2, '0')}</span>
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5 font-bold">Badges</p>
          </div>

        </div>

      </div>

    </div>
  );
};
