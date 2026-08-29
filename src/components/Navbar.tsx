import React from 'react';
import { Volume2, VolumeX, Shield, Database, Sparkles, Flame, UserCheck } from 'lucide-react';
import { UserProfile } from '../types';
import { soundManager } from '../utils/audio';

interface NavbarProps {
  user: UserProfile;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  onOpenGasModal: () => void;
  onOpenProfileModal: () => void;
  isGasConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  audioEnabled,
  onToggleAudio,
  onOpenGasModal,
  onOpenProfileModal,
  isGasConnected,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#1a1a3c]/80 border-b border-indigo-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Subject Info */}
          <div className="flex items-center space-x-3.5">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl border-2 border-purple-500 bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-lg shadow-purple-500/25">
              <span className="text-lg font-black text-white tracking-wider">&lt;/&gt;</span>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0a0a23]" title="LINE LIFF Active" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                  WebQuest
                </span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  วิชาสร้างเว็บไซต์ ปวช.1
                </span>
              </div>
              <p className="text-[11px] text-indigo-300 font-medium hidden xs:block">
                Level {user.level} • Junior Web Developer
              </p>
            </div>
          </div>

          {/* Quick Stats & Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Total Points Highlight in Immersive UI Header */}
            <div className="text-right hidden sm:block">
              <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold">Total Points</p>
              <p className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-mono">
                {user.score} XP
              </p>
            </div>

            {/* Streak Counter */}
            <div 
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs sm:text-sm font-bold shadow-sm"
              title={`สตรีคเช็คอินต่อเนื่อง ${user.streakDays} วัน`}
            >
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
              <span>{user.streakDays} วัน</span>
            </div>

            {/* Google Sheets / Apps Script Status Button */}
            <button
              onClick={onOpenGasModal}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                isGasConnected
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-white/5 text-indigo-200 border-white/10 hover:border-purple-500/50 hover:bg-white/10'
              }`}
              title="ตั้งค่า Google Apps Script & Google Sheets"
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">{isGasConnected ? 'GAS เชื่อมต่อแล้ว' : 'GAS & Sheets'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleAudio}
              className={`p-2 rounded-full border transition-all ${
                audioEnabled
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30'
                  : 'bg-white/5 text-slate-500 border-white/10 hover:text-slate-300'
              }`}
              title={audioEnabled ? 'ปิดเสียงเอฟเฟกต์' : 'เปิดเสียงเอฟเฟกต์'}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* LINE Login / Profile Trigger Pill Button */}
            <button
              onClick={onOpenProfileModal}
              className="flex items-center space-x-2 pl-1.5 pr-3 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-500/25 transition-all duration-200 active:scale-95"
            >
              <img
                src={user.pictureUrl}
                alt={user.displayName}
                className="w-6 h-6 rounded-full object-cover ring-2 ring-white/50"
              />
              <span className="max-w-[90px] sm:max-w-[120px] truncate">
                {user.displayName.split(' ')[0]}
              </span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
