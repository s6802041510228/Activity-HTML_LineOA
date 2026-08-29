import React, { useState } from 'react';
import { User, GraduationCap, Image, MessageCircle, Check, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSaveProfile: (updated: Partial<UserProfile>) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=200&auto=format&fit=crop&q=80',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveProfile,
}) => {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [studentId, setStudentId] = useState(user.studentId);
  const [classroom, setClassroom] = useState(user.classroom);
  const [pictureUrl, setPictureUrl] = useState(user.pictureUrl);
  const [statusMessage, setStatusMessage] = useState(user.statusMessage || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      displayName,
      studentId,
      classroom,
      pictureUrl,
      statusMessage,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#161633] border border-white/10 p-6 sm:p-7 shadow-2xl space-y-5">
        
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-base">ข้อมูลผู้เรียน (LINE Student Profile)</h3>
              <p className="text-xs text-indigo-200">แก้ไขข้อมูลโปรไฟล์นักศึกษา ปวช.1</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-indigo-200 hover:text-white hover:bg-white/10 transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Avatar Selector */}
          <div>
            <label className="block text-indigo-200 font-bold mb-2">เลือกรูปโปรไฟล์ LINE</label>
            <div className="flex items-center space-x-2.5 overflow-x-auto pb-1">
              {PRESET_AVATARS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPictureUrl(url)}
                  className={`relative w-12 h-12 rounded-2xl overflow-hidden border-2 transition flex-shrink-0 ${
                    pictureUrl === url
                      ? 'border-purple-500 ring-2 ring-purple-400 scale-105 shadow-lg shadow-purple-500/25'
                      : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="preset" className="w-full h-full object-cover" />
                  {pictureUrl === url && (
                    <div className="absolute inset-0 bg-purple-600/40 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-indigo-200 font-bold mb-1.5">ชื่อ-นามสกุล / ชื่อแสดงผล LINE</label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[#1a1a3c] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          {/* Student ID & Classroom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-indigo-200 font-bold mb-1.5">รหัสนักศึกษา</label>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="เช่น 6802041510228"
                className="w-full px-4 py-3 rounded-2xl bg-[#1a1a3c] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            <div>
              <label className="block text-indigo-200 font-bold mb-1.5">ระดับชั้น / แผนกวิชา</label>
              <input
                type="text"
                required
                value={classroom}
                onChange={(e) => setClassroom(e.target.value)}
                placeholder="เช่น ปวช.1/1 เทคโนโลยีสารสนเทศ"
                className="w-full px-4 py-3 rounded-2xl bg-[#1a1a3c] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 transition"
              />
            </div>
          </div>

          {/* Status Message */}
          <div>
            <label className="block text-indigo-200 font-bold mb-1.5">ข้อความสถานะ (Status Message)</label>
            <input
              type="text"
              value={statusMessage}
              onChange={(e) => setStatusMessage(e.target.value)}
              placeholder="กำลังทบทวนเนื้อหา HTML 🚀"
              className="w-full px-4 py-3 rounded-2xl bg-[#1a1a3c] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          {/* Submit & Cancel */}
          <div className="flex items-center justify-end space-x-2.5 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-500/25 transition"
            >
              บันทึกข้อมูล
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
