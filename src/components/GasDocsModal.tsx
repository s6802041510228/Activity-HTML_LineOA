import React, { useState } from 'react';
import { 
  Database, Copy, Check, ExternalLink, Code2, ShieldAlert, Sparkles, 
  Send, RefreshCw, Layers, CheckCircle2, MessageSquare, Smartphone
} from 'lucide-react';
import { GAS_CODE_GS, GAS_HTML_INDEX, sendToGasBackend } from '../utils/gasService';
import { UserProfile } from '../types';

interface GasDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gasUrl: string;
  onSaveGasUrl: (url: string) => void;
  user: UserProfile;
}

export const GasDocsModal: React.FC<GasDocsModalProps> = ({
  isOpen,
  onClose,
  gasUrl,
  onSaveGasUrl,
  user,
}) => {
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);
  const [inputUrl, setInputUrl] = useState<string>(gasUrl);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'guide' | 'codegs' | 'sheets' | 'line'>('guide');

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GAS_CODE_GS);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(GAS_HTML_INDEX);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleTestGasConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    const result = await sendToGasBackend(inputUrl, 'syncUser', {
      userId: user.userId,
      studentId: user.studentId,
      displayName: user.displayName,
      score: user.score,
      level: user.level,
      streakDays: user.streakDays,
    });

    setIsTesting(false);
    setTestResult(result);
    if (result.success && inputUrl) {
      onSaveGasUrl(inputUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-[#161633] border border-white/10 shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#1a1a3c]/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-md">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white flex items-center space-x-2">
                <span>เชื่อมต่อ Google Apps Script + Sheets + LINE</span>
              </h3>
              <p className="text-xs text-indigo-200">
                โค้ดแบ็กเอนด์สำหรับเชื่อมต่อฐานข้อมูล Google Sheets และ LINE Messaging API
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

        {/* Navigation Sub-Tabs */}
        <div className="flex items-center space-x-2 px-6 pt-4 border-b border-white/10 bg-[#161633] overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-3 font-bold transition border-b-2 whitespace-nowrap ${
              activeTab === 'guide'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-indigo-300 hover:text-white'
            }`}
          >
            🚀 ขั้นตอนการติดตั้ง (Setup Guide)
          </button>

          <button
            onClick={() => setActiveTab('codegs')}
            className={`pb-3 font-bold transition border-b-2 whitespace-nowrap flex items-center space-x-1 ${
              activeTab === 'codegs'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-indigo-300 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>โค้ด Code.gs (Google Apps Script)</span>
          </button>

          <button
            onClick={() => setActiveTab('sheets')}
            className={`pb-3 font-bold transition border-b-2 whitespace-nowrap flex items-center space-x-1 ${
              activeTab === 'sheets'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-indigo-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>โครงสร้างตาราง Google Sheets</span>
          </button>

          <button
            onClick={() => setActiveTab('line')}
            className={`pb-3 font-bold transition border-b-2 whitespace-nowrap flex items-center space-x-1 ${
              activeTab === 'line'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-indigo-300 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>ตั้งค่า LINE Login & LIFF</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-200 text-sm leading-relaxed">
          
          {/* TAB 1: GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-5">
              
              {/* Web App URL Config Box */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#1a1a3c] border border-white/10 space-y-3">
                <div className="flex items-center space-x-2 text-indigo-200 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>เชื่อมต่อ Web App URL จริง (เมื่อนำไป Deploy บน Google Apps Script)</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/.../exec"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#0a0a23] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-purple-500 transition"
                  />

                  <button
                    onClick={handleTestGasConnection}
                    disabled={isTesting}
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition whitespace-nowrap flex items-center justify-center space-x-1.5"
                  >
                    {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>ทดสอบเชื่อมต่อ</span>
                  </button>
                </div>

                {testResult && (
                  <div className={`p-3.5 rounded-2xl text-xs flex items-center space-x-2 ${
                    testResult.success ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30' : 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                  }`}>
                    {testResult.success ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                    <span>{testResult.message}</span>
                  </div>
                )}
              </div>

              {/* 4 Steps Guide */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#1a1a3c] border border-white/5 space-y-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs flex items-center justify-center">1</div>
                  <h4 className="font-bold text-white text-sm">สร้าง Google Sheet</h4>
                  <p className="text-xs text-indigo-200">
                    เปิด <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-cyan-400 underline inline-flex items-center space-x-0.5"><span>Google Sheets</span> <ExternalLink className="w-2.5 h-2.5 ml-0.5" /></a> ตั้งชื่อไฟล์ว่า "WebQuest_HTML_DB"
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#1a1a3c] border border-white/5 space-y-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs flex items-center justify-center">2</div>
                  <h4 className="font-bold text-white text-sm">เปิด Extensions &gt; Apps Script</h4>
                  <p className="text-xs text-indigo-200">
                    คัดลอกโค้ดจากแท็บ <strong>Code.gs</strong> ไปวาง แล้วกดเลือกฟังก์ชัน <code>setupDatabase</code> แล้วกด <strong>Run</strong> 1 ครั้ง เพื่อสร้างตารางทั้งหมด
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#1a1a3c] border border-white/5 space-y-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center">3</div>
                  <h4 className="font-bold text-white text-sm">Deploy เป็น Web App</h4>
                  <p className="text-xs text-indigo-200">
                    กดปุ่ม <strong>Deploy &gt; New deployment &gt; Web app</strong> เลือก <em>Execute as: Me</em> และ <em>Who has access: Anyone</em>
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#1a1a3c] border border-white/5 space-y-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center">4</div>
                  <h4 className="font-bold text-white text-sm">นำ URL มาเชื่อมต่อ</h4>
                  <p className="text-xs text-indigo-200">
                    นำ Web App URL ที่ได้มาวางลงในช่องด้านบน เพื่อเริ่มบันทึกคะแนนและเช็คอินตรงลง Google Sheets และส่งข้อความ LINE OA
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CODE.GS */}
          {activeTab === 'codegs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">โค้ด Code.gs สำหรับวางใน Google Apps Script</h4>
                  <p className="text-xs text-indigo-200">มีครบทั้งระบบสร้างฐานข้อมูลอัตโนมัติ, บันทึกคะแนน, เช็คอิน, และยิง LINE Flex Message</p>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="flex items-center space-x-1.5 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-500/25 transition"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'คัดลอกแล้ว!' : 'คัดลอกโค้ด Code.gs'}</span>
                </button>
              </div>

              <div className="relative rounded-2xl bg-[#0a0a23] p-4 border border-white/10 font-mono text-xs text-cyan-300 max-h-96 overflow-y-auto">
                <pre>{GAS_CODE_GS}</pre>
              </div>
            </div>
          )}

          {/* TAB 3: SHEETS STRUCTURE */}
          {activeTab === 'sheets' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-white text-sm">โครงสร้างตารางที่ถูกสร้างใน Google Sheets</h4>
                <p className="text-xs text-indigo-200">เมื่อรันฟังก์ชัน <code>setupDatabase()</code> ใน Code.gs ระบบจะสร้างแท็บเหล่านี้ให้อัตโนมัติ</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-[#1a1a3c] border border-white/5 space-y-1.5">
                  <div className="font-bold text-indigo-300 text-xs">1. แท็บ Users (ผู้เรียน)</div>
                  <div className="text-[11px] text-indigo-200 font-mono">
                    LineUID | StudentID | FullName | Classroom | PictureURL | TotalScore | Level | StreakDays | LastCheckInDate | BadgesJSON
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1a1a3c] border border-white/5 space-y-1.5">
                  <div className="font-bold text-cyan-400 text-xs">2. แท็บ CheckIn_Logs (ประวัติเช็คอิน)</div>
                  <div className="text-[11px] text-indigo-200 font-mono">
                    LogID | LineUID | StudentID | FullName | CheckInDate | ExpEarned | StreakDays | Timestamp
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1a1a3c] border border-white/5 space-y-1.5">
                  <div className="font-bold text-purple-400 text-xs">3. แท็บ Quiz_Results (ผลคะแนนควิซ)</div>
                  <div className="text-[11px] text-indigo-200 font-mono">
                    ResultID | LineUID | StudentID | TopicID | TopicName | Score | TotalQuestions | Percentage | Passed | Timestamp
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1a1a3c] border border-white/5 space-y-1.5">
                  <div className="font-bold text-amber-400 text-xs">4. แท็บ Badges (เหรียญตรา)</div>
                  <div className="text-[11px] text-indigo-200 font-mono">
                    BadgeRecordID | LineUID | StudentID | BadgeID | BadgeName | Rarity | ExpBonus | UnlockedAt
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LINE LOGIN & LIFF */}
          {activeTab === 'line' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-white text-sm">การเชื่อมต่อ LINE Login, LIFF และ LINE OA Messaging API</h4>
                <p className="text-xs text-indigo-200">วิธีเปิดใช้งาน LINE Login สำหรับนักเรียนและส่งแจ้งเตือน Flex Message เข้าห้องแชต</p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#1a1a3c] border border-white/5 space-y-2">
                  <div className="font-bold text-emerald-400 text-xs flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>1. สมัคร Provider ที่ LINE Developers Console</span>
                  </div>
                  <p className="text-xs text-indigo-200 leading-relaxed">
                    ไปที่ <a href="https://developers.line.biz" target="_blank" rel="noreferrer" className="text-cyan-400 underline">developers.line.biz</a> &gt; สร้าง Messaging API Channel และ LINE Login Channel
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#1a1a3c] border border-white/5 space-y-2">
                  <div className="font-bold text-indigo-300 text-xs flex items-center space-x-2">
                    <Smartphone className="w-4 h-4" />
                    <span>2. สร้าง LIFF App (LINE Front-end Framework)</span>
                  </div>
                  <p className="text-xs text-indigo-200 leading-relaxed">
                    ใน LINE Login Channel &gt; แท็บ LIFF &gt; กด Add LIFF app &gt; นำ Endpoint URL ของ Google Apps Script หรือ Web App URL มาใส่ &gt; กำหนด Scope: <code>profile, openid</code>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#1a1a3c] border border-white/5 space-y-2">
                  <div className="font-bold text-purple-400 text-xs flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>3. ใส่ Channel Access Token ใน Code.gs</span>
                  </div>
                  <p className="text-xs text-indigo-200 leading-relaxed">
                    นำ <code>Channel access token (long-lived)</code> จาก Messaging API มาใส่ในบรรทัดที่ 9 ของ <code>Code.gs</code> เพื่อให้บอทส่งข้อความ Flex Message รายงานผลคะแนนและเช็คอินเข้าสู่ LINE ผู้เรียนโดยอัตโนมัติ
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#1a1a3c]/60 flex items-center justify-between">
          <div className="text-xs text-indigo-200">
            ระบบรองรับทั้งบนคอมพิวเตอร์และเบราว์เซอร์ในมือถือ / LINE In-App Browser
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs transition"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
