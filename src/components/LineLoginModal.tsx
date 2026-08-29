import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, Shield, Sparkles, Check, AlertCircle, Copy, ExternalLink, HelpCircle, User, RefreshCw, Edit3, UserCheck, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';
import { liffManager } from '../utils/liffService';

interface LineLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  isLoggedIn: boolean;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onLogin: () => void;
  onLogout: () => void;
}

const PRESET_STUDENTS = [
  {
    userId: 'U6802041510228',
    studentId: '6802041510228',
    displayName: 'สมชาย พัฒนาเว็บ (ปวช.1)',
    classroom: 'ปวช.1 แผนกเทคโนโลยีสารสนเทศ',
    pictureUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    statusMessage: 'กำลังเรียนรู้ HTML5 & WebQuest',
  },
  {
    userId: 'U6802041510001',
    studentId: '6802041510001',
    displayName: 'นริศรา สุขสวัสดิ์ (ปวช.1)',
    classroom: 'ปวช.1/1 เทคโนโลยีสารสนเทศ',
    pictureUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    statusMessage: 'Web Developer in training 💻',
  },
  {
    userId: 'U6802041510012',
    studentId: '6802041510012',
    displayName: 'กิตติพงษ์ เจริญผล (ปวช.1)',
    classroom: 'ปวช.1/2 คอมพิวเตอร์ธุรกิจ',
    pictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    statusMessage: 'สนุกกับการเขียนโค้ด HTML ✨',
  },
];

export const LineLoginModal: React.FC<LineLoginModalProps> = ({
  isOpen,
  onClose,
  user,
  isLoggedIn,
  onUpdateProfile,
  onLogin,
  onLogout,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'liff' | 'custom' | 'docs'>(() => (isLoggedIn ? 'custom' : 'liff'));
  const [liffIdInput, setLiffIdInput] = useState<string>(() => liffManager.getSavedLiffId());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  
  // Custom manual edit state
  const [displayName, setDisplayName] = useState(user.displayName);
  const [studentId, setStudentId] = useState(user.studentId);
  const [classroom, setClassroom] = useState(user.classroom);
  const [pictureUrl, setPictureUrl] = useState(user.pictureUrl);
  const [statusMessage, setStatusMessage] = useState(user.statusMessage || '');

  useEffect(() => {
    if (isOpen) {
      setDisplayName(user.displayName);
      setStudentId(user.studentId);
      setClassroom(user.classroom);
      setPictureUrl(user.pictureUrl);
      setStatusMessage(user.statusMessage || '');
      setLiffIdInput(liffManager.getSavedLiffId());
      setStatusMsg(null);
      setActiveSubTab(isLoggedIn ? 'custom' : 'liff');
    }
  }, [isOpen, user, isLoggedIn]);

  if (!isOpen) return null;

  const handleLiffLogin = async () => {
    if (!liffIdInput.trim()) {
      setStatusMsg({ type: 'error', text: 'กรุณากรอก LIFF ID ก่อนเข้าสู่ระบบ' });
      return;
    }

    setIsLoading(true);
    setStatusMsg({ type: 'info', text: 'กำลังเชื่อมต่อ LINE LIFF SDK...' });

    try {
      liffManager.setLiffId(liffIdInput.trim());
      const result = await liffManager.initLiff(liffIdInput.trim());

      if (result.success && result.profile) {
        onUpdateProfile({
          userId: result.profile.userId,
          displayName: result.profile.displayName,
          pictureUrl: result.profile.pictureUrl || user.pictureUrl,
          statusMessage: result.profile.statusMessage || user.statusMessage,
        });
        onLogin();
        setStatusMsg({
          type: 'success',
          text: `เข้าสู่ระบบสำเร็จในชื่อ: ${result.profile.displayName}`,
        });
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        // Trigger standard LINE login redirect
        liffManager.login();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setStatusMsg({ type: 'error', text: `ข้อผิดพลาด LIFF: ${msg}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset: typeof PRESET_STUDENTS[0]) => {
    onUpdateProfile({
      userId: preset.userId,
      studentId: preset.studentId,
      displayName: preset.displayName,
      classroom: preset.classroom,
      pictureUrl: preset.pictureUrl,
      statusMessage: preset.statusMessage,
    });
    onLogin();
    setStatusMsg({
      type: 'success',
      text: `เข้าสู่ระบบในชื่อ: ${preset.displayName}`,
    });
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleSaveCustomProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      displayName: displayName.trim() || user.displayName,
      studentId: studentId.trim() || user.studentId,
      classroom: classroom.trim() || user.classroom,
      pictureUrl: pictureUrl.trim() || user.pictureUrl,
      statusMessage: statusMessage.trim(),
    });
    onLogin();
    setStatusMsg({ type: 'success', text: 'บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว' });
    setTimeout(() => {
      onClose();
    }, 700);
  };

  const handleLogoutAction = () => {
    liffManager.logout();
    onLogout();
    setStatusMsg({ type: 'info', text: 'ออกจากระบบเรียบร้อยแล้ว' });
    setTimeout(() => {
      setActiveSubTab('liff');
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#161633] border border-white/10 p-6 sm:p-7 shadow-2xl space-y-5 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#06C755] flex items-center justify-center text-white shadow-lg shadow-[#06C755]/30">
              <span className="font-black text-lg">LINE</span>
            </div>
            <div>
              <h3 className="font-black text-white text-base sm:text-lg">
                {isLoggedIn ? 'ข้อมูลส่วนตัว & บัญชี LINE' : 'เข้าสู่ระบบด้วย LINE (LINE Login)'}
              </h3>
              <p className="text-xs text-indigo-200">
                {isLoggedIn ? 'แก้ไขข้อมูลนักศึกษาเพื่อบันทึกลง Google Sheet' : 'เข้าสู่ระบบเพื่อเริ่มเรียนรู้และสะสมคะแนน'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-indigo-200 hover:text-white hover:bg-white/10 transition"
          >
            ✕
          </button>
        </div>

        {/* Profile Card Banner if Logged In */}
        {isLoggedIn ? (
          <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-[#1e1b4b] to-[#0f172a] border border-white/15 p-4 sm:p-5 flex items-center justify-between shadow-xl">
            <div className="flex items-center space-x-3.5">
              <div className="relative">
                <img
                  src={user.pictureUrl}
                  alt={user.displayName}
                  className="w-14 h-14 rounded-full object-cover ring-3 ring-white/40 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#06C755] border-2 border-slate-900 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </span>
              </div>
              <div>
                <div className="text-xs text-indigo-300 flex items-center space-x-1">
                  <span>สวัสดีครับ/ค่ะ 👋</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#06C755]/20 text-[#06C755] font-bold">LINE Active</span>
                </div>
                <h4 className="font-black text-white text-base leading-tight mt-0.5">{user.displayName}</h4>
                <p className="text-[11px] text-indigo-200 mt-0.5">
                  รหัส <span className="font-mono text-cyan-300 font-bold">{user.studentId}</span> • {user.classroom}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogoutAction}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition flex items-center space-x-1"
              title="ออกจากระบบ"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        ) : (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs sm:text-sm">สถานะ: ยังไม่ได้เข้าสู่ระบบ</h4>
              <p className="text-[11px] text-indigo-200">
                เข้าสู่ระบบด้วย LINE เพื่อซิงค์ชื่อ รูปโปรไฟล์ และคะแนนสะสมของคุณ
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 text-xs">
          <button
            onClick={() => setActiveSubTab('liff')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold transition flex items-center justify-center space-x-1.5 ${
              activeSubTab === 'liff'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-indigo-200 hover:text-white hover:bg-white/5'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>LINE LIFF Login</span>
          </button>

          <button
            onClick={() => setActiveSubTab('custom')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold transition flex items-center justify-center space-x-1.5 ${
              activeSubTab === 'custom'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-indigo-200 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{isLoggedIn ? 'แก้ไขข้อมูลส่วนตัว' : 'กรอกข้อมูล / สลับบัญชี'}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('docs')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold transition flex items-center justify-center space-x-1.5 ${
              activeSubTab === 'docs'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-indigo-200 hover:text-white hover:bg-white/5'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>คู่มือ LIFF</span>
          </button>
        </div>

        {/* Status Notification */}
        {statusMsg && (
          <div
            className={`p-3 rounded-2xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in ${
              statusMsg.type === 'success'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : statusMsg.type === 'error'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
            }`}
          >
            {statusMsg.type === 'success' && <Check className="w-4 h-4 shrink-0 text-emerald-400" />}
            {statusMsg.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />}
            {statusMsg.type === 'info' && <RefreshCw className="w-4 h-4 shrink-0 animate-spin text-purple-400" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* TAB 1: Real LINE LIFF Login */}
        {activeSubTab === 'liff' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#06C755]/10 to-indigo-600/10 border border-[#06C755]/30 space-y-2">
              <span className="font-black text-white text-sm flex items-center space-x-1.5">
                <span>🟢</span>
                <span>เชื่อมต่อ LINE Front-end Framework (LIFF)</span>
              </span>
              <p className="text-indigo-200 leading-relaxed">
                เมื่อเปิดแอพผ่านแชท LINE หรือตั้งค่า LIFF ID ระบบจะดึงชื่อ LINE, รูปโปรไฟล์, และ User ID
                จริงของผู้เรียนเข้ามาใช้งานและบันทึกคะแนนลง Google Sheet โดยอัตโนมัติ
              </p>
            </div>

            <div>
              <label className="block text-indigo-200 font-bold mb-1.5">
                LIFF ID (จาก LINE Developers Console)
              </label>
              <input
                type="text"
                value={liffIdInput}
                onChange={(e) => setLiffIdInput(e.target.value)}
                placeholder="เช่น 2011321555-xxxxxx"
                className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#06C755] font-mono text-xs"
              />
              <p className="text-[11px] text-indigo-300 mt-1">
                หากเปิดผ่าน LINE Web/Browser แล้วมี LIFF ID สามารถกดปุ่มล็อกอินเพื่อเชื่อมต่อบัญชีจริงได้ทันที
              </p>
            </div>

            {/* Official LINE Login Button */}
            <button
              onClick={handleLiffLogin}
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-full bg-[#06C755] hover:bg-[#05b34c] text-white font-black text-sm flex items-center justify-center space-x-2 shadow-xl shadow-[#06C755]/25 transition active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              <span className="font-black text-base">LINE</span>
              <span>{isLoading ? 'กำลังเชื่อมต่อ LINE...' : 'เข้าสู่ระบบด้วย LINE (LINE Login)'}</span>
            </button>
          </div>
        )}

        {/* TAB 2: Custom Profile / Switch Student */}
        {activeSubTab === 'custom' && (
          <div className="space-y-5 text-xs">
            {/* Form for Student Profile */}
            <form onSubmit={handleSaveCustomProfile} className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs sm:text-sm flex items-center space-x-1.5">
                  <Edit3 className="w-4 h-4 text-purple-400" />
                  <span>แก้ไข / เพิ่มข้อมูลนักศึกษา</span>
                </span>
                <span className="text-[10px] text-indigo-300">* ใช้สำหรับส่งคะแนนลง Google Sheet</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-indigo-200 font-bold mb-1">ชื่อ-นามสกุล / ชื่อแสดงผล</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    placeholder="เช่น สมชาย พัฒนาเว็บ (ปวช.1)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-indigo-200 font-bold mb-1">รหัสนักศึกษา (Student ID)</label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                    placeholder="เช่น 6802041510228"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-indigo-200 font-bold mb-1">ระดับชั้น / ห้องเรียน / แผนกวิชา</label>
                  <input
                    type="text"
                    value={classroom}
                    onChange={(e) => setClassroom(e.target.value)}
                    required
                    placeholder="เช่น ปวช.1 แผนกเทคโนโลยีสารสนเทศ"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-indigo-200 font-bold mb-1">ข้อความสถานะ (Status Message)</label>
                  <input
                    type="text"
                    value={statusMessage}
                    onChange={(e) => setStatusMessage(e.target.value)}
                    placeholder="เช่น กำลังเรียนรู้ HTML5 & WebQuest"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-indigo-200 font-bold mb-1">URL รูปโปรไฟล์ (Photo URL)</label>
                <input
                  type="url"
                  value={pictureUrl}
                  onChange={(e) => setPictureUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition active:scale-98 cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>บันทึกข้อมูลส่วนตัว & เริ่มใช้งาน</span>
              </button>
            </form>

            {/* Quick Demo Switcher */}
            <div className="pt-3 border-t border-white/10">
              <label className="block text-indigo-200 font-bold mb-2">หรือเลือกบัญชีตัวอย่างเพื่อทดสอบ</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {PRESET_STUDENTS.map((preset) => (
                  <button
                    key={preset.userId}
                    onClick={() => handleSelectPreset(preset)}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 text-left transition flex items-center space-x-2.5"
                  >
                    <img
                      src={preset.pictureUrl}
                      alt={preset.displayName}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-purple-400 shrink-0"
                    />
                    <div className="overflow-hidden">
                      <p className="font-bold text-white text-[11px] truncate">{preset.displayName}</p>
                      <p className="text-[10px] text-indigo-300 font-mono">รหัส {preset.studentId}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Guide on creating LIFF */}
        {activeSubTab === 'docs' && (
          <div className="space-y-3.5 text-xs text-indigo-200">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h5 className="font-bold text-white text-sm">📌 วิธีสร้าง LINE LIFF App ใน 3 ขั้นตอน:</h5>
              <ol className="list-decimal list-inside space-y-1.5 leading-relaxed text-indigo-200">
                <li>ไปที่ <a href="https://developers.line.biz/" target="_blank" rel="noreferrer" className="text-cyan-400 underline font-bold">LINE Developers Console</a> แล้วสร้าง Provider & Channel ประเภท <strong>LINE Login</strong></li>
                <li>ไปที่แท็บ <strong>LIFF</strong> แล้วกด <strong>Add LIFF App</strong></li>
                <li>ตั้งค่า <strong>Size</strong> เป็น Full และใส่ <strong>Endpoint URL</strong> เป็น URL ของเว็บแอพนี้</li>
                <li>คัดลอก <strong>LIFF ID</strong> (เช่น <code>2011321555-jl54Ygfm</code>) นำมาวางในช่อง LIFF ID ด้านบน</li>
              </ol>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
