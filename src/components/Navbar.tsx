import React from 'react';
import { Volume2, VolumeX, Shield, Database, Sparkles, Flame, UserCheck, Cloud, RefreshCw, Check, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';
import { soundManager } from '../utils/audio';

interface NavbarProps {
  user: UserProfile;
  isLoggedIn: boolean;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  onOpenGasModal: () => void;
  onOpenProfileModal: () => void;
  isGasConnected: boolean;
  syncStatus: 'idle' | 'saving' | 'saved' | 'error';
  lastSavedTime: string;
  onManualSave: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  isLoggedIn,
  audioEnabled,
  onToggleAudio,
  onOpenGasModal,
  onOpenProfileModal,
  isGasConnected,
  syncStatus,
  lastSavedTime,
  onManualSave,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#1a1a3c]/80 border-b border-indigo-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Subject Info */}
          <div className="flex items-center space-x-3.5">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl border-2 border-purple-500 bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-lg shadow-purple-500/25">
              <span className="text-lg font-black text-white tracking-wider">&lt;/&gt;</span>
              <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0a0a23] ${isLoggedIn ? 'bg-emerald-500' : 'bg-slate-500'}`} title={isLoggedIn ? 'LINE Active' : 'Offline'} />
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
                {isLoggedIn ? `Level ${user.level} • Junior Web Developer` : 'ระบบการเรียนรู้และทำแบบทดสอบ HTML5'}
              </p>
            </div>
          </div>

          {/* Quick Stats & Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Total Points Highlight in Immersive UI Header */}
            {isLoggedIn && (
              <div className="text-right hidden sm:block">
                <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold">Total Points</p>
                <p className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-mono">
                  {user.score} XP
                </p>
              </div>
            )}

            {/* Streak Counter */}
            {isLoggedIn && (
              <div 
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs sm:text-sm font-bold shadow-sm"
                title={`สตรีคเช็คอินต่อเนื่อง ${user.streakDays} วัน`}
              >
                <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                <span>{user.streakDays} วัน</span>
              </div>
            )}

            {/* Real-time Auto-Save Status Badge */}
            <button
              onClick={onManualSave}
              disabled={syncStatus === 'saving'}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border group active:scale-95 cursor-pointer ${
                syncStatus === 'saving'
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 animate-pulse'
                  : syncStatus === 'error'
                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25 hover:border-emerald-500/50'
              }`}
              title={`ระบบบันทึกอัตโนมัติแบบเรียลไทม์ (Auto-Save Realtime)\nบันทึกล่าสุด: ${lastSavedTime || 'เริ่มต้นระบบ'}\nคลิกเพื่อบันทึกและซิงค์ทันที`}
            >
              {syncStatus === 'saving' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                  <span className="hidden md:inline">กำลัง Auto Save...</span>
                </>
              ) : syncStatus === 'error' ? (
                <>
                  <Cloud className="w-3.5 h-3.5 text-red-400" />
                  <span className="hidden md:inline">บันทึกลงเครื่องแล้ว</span>
                </>
              ) : (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <Cloud className="w-3.5 h-3.5 text-emerald-400 hidden xs:inline" />
                  <span className="hidden lg:inline text-[11px]">Auto Saved</span>
                  <span className="text-[10px] opacity-80 font-mono hidden sm:inline">{lastSavedTime}</span>
                </>
              )}
            </button>

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

            {/* LINE Login / Profile Trigger Button */}
            {isLoggedIn ? (
              <button
                onClick={onOpenProfileModal}
                className="flex items-center space-x-2 pl-1.5 pr-3 py-1.5 rounded-full bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#06C755]/25 transition-all duration-200 active:scale-95 cursor-pointer"
                title="แก้ไขข้อมูลส่วนตัว / โปรไฟล์"
              >
                <img
                  src={user.pictureUrl}
                  alt={user.displayName}
                  className="w-6 h-6 rounded-full object-cover ring-2 ring-white/70"
                />
                <div className="flex items-center space-x-1">
                  <span className="hidden xs:inline text-[10px] bg-black/20 px-1.5 py-0.5 rounded-full font-black">LINE</span>
                  <span className="max-w-[80px] sm:max-w-[110px] truncate">
                    {user.displayName.split(' ')[0]}
                  </span>
                </div>
              </button>
            ) : (
              <button
                onClick={onOpenProfileModal}
                className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#06C755]/30 transition-all duration-200 active:scale-95 cursor-pointer"
                title="เข้าสู่ระบบด้วย LINE"
              >
                <span className="font-black text-xs bg-black/20 px-1.5 py-0.5 rounded-md">LINE</span>
                <span>เข้าสู่ระบบ</span>
              </button>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};
