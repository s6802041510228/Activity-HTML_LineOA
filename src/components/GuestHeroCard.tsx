import React from 'react';
import { LogIn, Sparkles, BookOpen, Calendar, Trophy, Award, CheckCircle2, Shield, ArrowRight } from 'lucide-react';

interface GuestHeroCardProps {
  onOpenLogin: () => void;
}

export const GuestHeroCard: React.FC<GuestHeroCardProps> = ({ onOpenLogin }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#161633] via-[#1a1a40] to-[#251a4d] border border-white/10 p-6 sm:p-8 md:p-10 shadow-2xl">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[#06C755]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Heading & Call to Action */}
        <div className="lg:col-span-7 space-y-5 text-left">
          
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#06C755]/15 border border-[#06C755]/40 text-[#06C755] text-xs font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#06C755] animate-ping" />
            <span>เข้าสู่ระบบก่อนเริ่มเรียนรู้ • LINE Login</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
              วิชาการสร้างเว็บไซต์ <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-200 to-purple-300">
                (HTML5 & WebQuest ปวช.1)
              </span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-indigo-200 leading-relaxed pt-1">
              กรุณาเข้าสู่ระบบด้วย LINE เพื่อเริ่มบทเรียน, ทำแบบทดสอบ 20 ข้อ, เช็คอินสะสมสตรีครายวัน และบันทึกคะแนนสะสมลงในระบบ Google Sheets ประจำห้องเรียน
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
            
            {/* Main LINE Login Button */}
            <button
              onClick={onOpenLogin}
              className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl bg-[#06C755] hover:bg-[#05b34c] text-white font-black text-sm sm:text-base flex items-center justify-center space-x-3 shadow-xl shadow-[#06C755]/30 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center font-black text-xs">
                LINE
              </div>
              <span>เข้าสู่ระบบด้วย LINE (LINE Login)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Sub Button */}
            <button
              onClick={onOpenLogin}
              className="px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-indigo-200 hover:text-white font-bold text-xs sm:text-sm transition flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4 text-cyan-400" />
              <span>สลับบัญชี / ทดลองใช้งาน</span>
            </button>

          </div>

          <p className="text-[11px] text-indigo-300 flex items-center space-x-1.5">
            <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>เข้าสู่ระบบแล้วสามารถแก้ไขหรือระบุรหัสนักศึกษาและห้องเรียนได้ทันที</span>
          </p>

        </div>

        {/* Right Column: Feature Badges Preview */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
          
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 shadow-lg backdrop-blur-sm">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-xs sm:text-sm">บทเรียน & ควิซ</h4>
            <p className="text-[11px] text-indigo-200">20 ข้อทดสอบความรู้ HTML โครงสร้างและแท็กสำคัญ</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 shadow-lg backdrop-blur-sm">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-xs sm:text-sm">เช็คอินรายวัน</h4>
            <p className="text-[11px] text-indigo-200">สะสมสตรีคต่อเนื่องและรับโบนัสคะแนน EXP</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 shadow-lg backdrop-blur-sm">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Trophy className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-xs sm:text-sm">อันดับคะแนน</h4>
            <p className="text-[11px] text-indigo-200">ตารางจัดอันดับคะแนนจริงของเพื่อนในชั้นเรียน</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 shadow-lg backdrop-blur-sm">
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-xs sm:text-sm">สะสม Badge</h4>
            <p className="text-[11px] text-indigo-200">ปลดล็อกเหรียญตราเกียรติยศนักพัฒนาเว็บ</p>
          </div>

        </div>

      </div>
    </div>
  );
};
