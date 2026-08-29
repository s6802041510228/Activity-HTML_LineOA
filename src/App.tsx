import React, { useState, useEffect } from 'react';
import { 
  Calendar, BookOpen, Award, Trophy, Database, Sparkles, 
  Flame, CheckCircle2, ChevronRight, Shield, Layers, HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ActiveTab, DailyQuest, LeaderboardEntry, QuizTopicId, UserProfile } from './types';
import { BADGES_DATA, DAILY_QUESTS, INITIAL_LEADERBOARD, INITIAL_USER, LEVEL_THRESHOLDS } from './data/mockData';
import { soundManager } from './utils/audio';
import { sendToGasBackend, fetchLeaderboardFromGas } from './utils/gasService';

import { Navbar } from './components/Navbar';
import { ProfileCard } from './components/ProfileCard';
import { GuestHeroCard } from './components/GuestHeroCard';
import { CheckInTab } from './components/CheckInTab';
import { LessonsAndQuizTab } from './components/LessonsAndQuizTab';
import { BadgesTab } from './components/BadgesTab';
import { LeaderboardTab } from './components/LeaderboardTab';
import { GasDocsModal } from './components/GasDocsModal';
import { LineLoginModal } from './components/LineLoginModal';
import { liffManager } from './utils/liffService';

export default function App() {
  // 1. User & App State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('webquest_is_logged_in') === 'true';
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('webquest_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.score === 180 && parsed.level === 2) {
          return INITIAL_USER;
        }
        if (parsed.rank && parsed.rank > 1) {
          parsed.rank = 1;
        }
        return parsed;
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_USER;
  });

  const [quests, setQuests] = useState<DailyQuest[]>(() => {
    const saved = localStorage.getItem('webquest_daily_quests');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.some((q: DailyQuest) => q.id === 'quest_checkin' && q.claimed)) {
          return DAILY_QUESTS;
        }
        return parsed;
      } catch (e) {
        // fallback
      }
    }
    return DAILY_QUESTS;
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem('webquest_leaderboard');
    if (saved) {
      try {
        const parsed: LeaderboardEntry[] = JSON.parse(saved);
        // Filter out legacy mock user IDs (U001, U002, U003, U005, U006, U007)
        const filtered = parsed.filter((item) => !['U001', 'U002', 'U003', 'U005', 'U006', 'U007'].includes(item.userId));
        if (filtered.length > 0) {
          return filtered;
        }
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_LEADERBOARD;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('learn_quiz');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [isRefreshingLeaderboard, setIsRefreshingLeaderboard] = useState<boolean>(false);
  const [gasUrl, setGasUrl] = useState<string>(() => {
    return localStorage.getItem('webquest_gas_url') || 'https://script.google.com/macros/s/AKfycbyuY2H0kS2uAIyXpZwvad1J7ZzVzaBah6feAJa7KLRXHs5ViwUC5hIavSpaE7g_c28O5w/exec';
  });

  const [isGasModalOpen, setIsGasModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Real-time Auto-Save State
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>(() => {
    const d = new Date();
    return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  });

  const triggerSaveTimestamp = () => {
    const d = new Date();
    setLastSavedTime(d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setSyncStatus('saved');
  };

  // 1. Instant Real-time Local Storage Auto-Save
  useEffect(() => {
    localStorage.setItem('webquest_user_profile', JSON.stringify(user));
    triggerSaveTimestamp();
  }, [user]);

  useEffect(() => {
    localStorage.setItem('webquest_daily_quests', JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem('webquest_leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  useEffect(() => {
    localStorage.setItem('webquest_gas_url', gasUrl);
  }, [gasUrl]);

  useEffect(() => {
    localStorage.setItem('webquest_is_logged_in', isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  // 2. Debounced Cloud Real-time Auto-Save to Google Apps Script
  useEffect(() => {
    if (!gasUrl || !gasUrl.startsWith('https://script.google.com/')) return;
    
    setSyncStatus('saving');
    const timer = setTimeout(async () => {
      try {
        const res = await sendToGasBackend(gasUrl, 'syncUser', user);
        if (res.success) {
          triggerSaveTimestamp();
        } else {
          setSyncStatus('saved'); // Local is saved
        }
      } catch (err) {
        setSyncStatus('saved'); // Fallback to local save
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [user, gasUrl]);

  // 3. Tab Visibility & BeforeUnload Auto-Save Handlers
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem('webquest_user_profile', JSON.stringify(user));
      localStorage.setItem('webquest_daily_quests', JSON.stringify(quests));
      localStorage.setItem('webquest_is_logged_in', isLoggedIn ? 'true' : 'false');
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        localStorage.setItem('webquest_user_profile', JSON.stringify(user));
        if (gasUrl && gasUrl.startsWith('https://script.google.com/')) {
          sendToGasBackend(gasUrl, 'syncUser', user);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, quests, isLoggedIn, gasUrl]);

  // 4. Periodic Background Auto-Sync (Every 45 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (gasUrl && gasUrl.startsWith('https://script.google.com/')) {
        sendToGasBackend(gasUrl, 'syncUser', user).then((res) => {
          if (res.success) triggerSaveTimestamp();
        });
      }
    }, 45000);

    return () => clearInterval(interval);
  }, [user, gasUrl]);

  // Manual Force Save / Sync Handler
  const handleManualSave = async () => {
    soundManager.playClick();
    setSyncStatus('saving');
    
    // Save to LocalStorage immediately
    localStorage.setItem('webquest_user_profile', JSON.stringify(user));
    localStorage.setItem('webquest_daily_quests', JSON.stringify(quests));
    localStorage.setItem('webquest_leaderboard', JSON.stringify(leaderboard));
    localStorage.setItem('webquest_is_logged_in', isLoggedIn ? 'true' : 'false');

    if (gasUrl && gasUrl.startsWith('https://script.google.com/')) {
      try {
        const res = await sendToGasBackend(gasUrl, 'syncUser', user);
        await handleRefreshLeaderboard();
        triggerSaveTimestamp();
      } catch (err) {
        triggerSaveTimestamp();
      }
    } else {
      setTimeout(() => {
        triggerSaveTimestamp();
      }, 400);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('webquest_is_logged_in', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('webquest_is_logged_in');
    liffManager.logout();
  };

  // Attempt automatic LIFF initialization if in LINE app or saved LIFF ID exists
  useEffect(() => {
    const autoInitLiff = async () => {
      const savedLiffId = liffManager.getSavedLiffId();
      if (!savedLiffId) return;
      try {
        const res = await liffManager.initLiff(savedLiffId);
        if (res.success && res.profile) {
          handleSaveProfile({
            userId: res.profile.userId,
            displayName: res.profile.displayName,
            pictureUrl: res.profile.pictureUrl || user.pictureUrl,
            statusMessage: res.profile.statusMessage || user.statusMessage,
          });
          handleLogin();
        }
      } catch (e) {
        // Silently skip if not logged in yet
      }
    };
    autoInitLiff();
  }, []);

  // Handler to fetch real leaderboard from Google Sheets
  const handleRefreshLeaderboard = async () => {
    if (!gasUrl || !gasUrl.startsWith('https://script.google.com/')) return;
    setIsRefreshingLeaderboard(true);
    try {
      const remote = await fetchLeaderboardFromGas(gasUrl);
      if (remote && remote.length > 0) {
        setLeaderboard(remote);
      }
    } finally {
      setIsRefreshingLeaderboard(false);
    }
  };

  // Recalculate level whenever user score changes
  const calculateLevelFromScore = (score: number): number => {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (score >= LEVEL_THRESHOLDS[i].minExp) {
        return LEVEL_THRESHOLDS[i].level;
      }
    }
    return 0;
  };

  // 2. Gamification Handlers
  const handleCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    const newStreak = user.streakDays + 1;
    const expReward = 30 + (newStreak > 3 ? 20 : 0);
    const newScore = user.score + expReward;
    const newLevel = calculateLevelFromScore(newScore);

    const newBadges = [...user.badges];
    if (newStreak >= 3 && !newBadges.includes('badge_streak_3')) {
      newBadges.push('badge_streak_3');
      soundManager.playBadgeUnlock();
    }
    if (newStreak >= 7 && !newBadges.includes('badge_streak_7')) {
      newBadges.push('badge_streak_7');
      soundManager.playBadgeUnlock();
    }

    const updatedUser: UserProfile = {
      ...user,
      score: newScore,
      level: newLevel,
      streakDays: newStreak,
      lastCheckInDate: today,
      badges: newBadges,
    };

    setUser(updatedUser);

    // Update quest
    setQuests((prev) =>
      prev.map((q) => (q.id === 'quest_checkin' ? { ...q, progress: 1, completed: true } : q))
    );

    // Send to GAS
    sendToGasBackend(gasUrl, 'checkIn', {
      userId: user.userId,
      studentId: user.studentId,
      displayName: user.displayName,
      streakDays: newStreak,
      expEarned: expReward,
    });
  };

  const handleClaimQuest = (questId: string) => {
    const targetQuest = quests.find((q) => q.id === questId);
    if (!targetQuest || targetQuest.claimed) return;

    const newScore = user.score + targetQuest.expReward;
    const newLevel = calculateLevelFromScore(newScore);

    const newCompletedQuests = user.completedQuests.includes(questId)
      ? user.completedQuests
      : [...user.completedQuests, questId];

    setUser({
      ...user,
      score: newScore,
      level: newLevel,
      completedQuests: newCompletedQuests,
    });

    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, claimed: true } : q))
    );
  };

  const handleFinishQuiz = (topicId: QuizTopicId, score: number, total: number) => {
    const expGained = score * 15;
    const newScore = user.score + expGained;
    const newLevel = calculateLevelFromScore(newScore);

    const currentTopicScores = user.quizScores[topicId];
    const bestScore = Math.max(score, currentTopicScores ? currentTopicScores.bestScore : 0);
    const attempts = (currentTopicScores ? currentTopicScores.attempts : 0) + 1;

    const newBadges = [...user.badges];

    // Badge logic
    if (score >= 6 && !newBadges.includes('badge_html_starter')) {
      newBadges.push('badge_html_starter');
    }
    if (topicId === 'structure' && score === 10 && !newBadges.includes('badge_structure_master')) {
      newBadges.push('badge_structure_master');
    }
    if (topicId === 'tags' && score === 10 && !newBadges.includes('badge_tag_master')) {
      newBadges.push('badge_tag_master');
    }
    if (newBadges.includes('badge_structure_master') && newBadges.includes('badge_tag_master') && !newBadges.includes('badge_perfect_all')) {
      newBadges.push('badge_perfect_all');
    }
    if (newLevel >= 5 && !newBadges.includes('badge_level_5')) {
      newBadges.push('badge_level_5');
    }

    const updatedUser: UserProfile = {
      ...user,
      score: newScore,
      level: newLevel,
      badges: newBadges,
      quizScores: {
        ...user.quizScores,
        [topicId]: {
          bestScore,
          totalQuestions: total,
          attempts,
          lastAttemptDate: new Date().toISOString().split('T')[0],
        },
      },
    };

    setUser(updatedUser);

    // Update quests
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === 'quest_quiz_one') return { ...q, progress: 1, completed: true };
        if (q.id === 'quest_high_score' && score >= 8) return { ...q, progress: score, completed: true };
        return q;
      })
    );

    // Update leaderboard entry for current user
    setLeaderboard((prev) =>
      prev.map((item) =>
        item.userId === user.userId
          ? {
              ...item,
              score: newScore,
              level: newLevel,
              badgesCount: newBadges.length,
            }
          : item
      )
    );

    // Send to GAS
    sendToGasBackend(gasUrl, 'submitQuiz', {
      userId: user.userId,
      studentId: user.studentId,
      displayName: user.displayName,
      topicId: topicId,
      topicName: topicId === 'structure' ? 'โครงสร้างพื้นฐานของ HTML' : 'การใช้งาน Tag พื้นฐาน',
      score: score,
      totalQuestions: total,
    });
  };

  const handleReadLesson = (topicId: QuizTopicId) => {
    if (!user.completedLessons.includes(topicId)) {
      setUser((prev) => ({
        ...prev,
        completedLessons: [...prev.completedLessons, topicId],
      }));
    }

    setQuests((prev) =>
      prev.map((q) =>
        q.id === 'quest_cheatsheet' ? { ...q, progress: 1, completed: true } : q
      )
    );
  };

  const handleSaveProfile = (updated: Partial<UserProfile>) => {
    const updatedUser: UserProfile = {
      ...user,
      ...updated,
    };
    setUser(updatedUser);

    // Update in leaderboard
    setLeaderboard((prev) =>
      prev.map((item) =>
        item.userId === user.userId
          ? {
              ...item,
              displayName: updated.displayName || item.displayName,
              studentId: updated.studentId || item.studentId,
              classroom: updated.classroom || item.classroom,
              pictureUrl: updated.pictureUrl || item.pictureUrl,
            }
          : item
      )
    );

    // Send update to GAS
    sendToGasBackend(gasUrl, 'syncUser', updatedUser);
  };

  const handleToggleAudio = () => {
    const enabled = soundManager.toggle();
    setAudioEnabled(enabled);
  };

  return (
    <div className="min-h-screen bg-[#0a0a23] text-white flex flex-col selection:bg-purple-500 selection:text-white font-['Prompt',sans-serif]">
      
      {/* 1. Header Navigation Bar */}
      <Navbar
        user={user}
        isLoggedIn={isLoggedIn}
        audioEnabled={audioEnabled}
        onToggleAudio={handleToggleAudio}
        onOpenGasModal={() => setIsGasModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        isGasConnected={Boolean(gasUrl && gasUrl.startsWith('https://script.google.com/'))}
        syncStatus={syncStatus}
        lastSavedTime={lastSavedTime}
        onManualSave={handleManualSave}
      />

      {/* 2. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24 md:pb-12">
        
        {/* Conditional Header: Profile Card (Logged In) OR Guest Hero Card (Logged Out) */}
        {isLoggedIn ? (
          <ProfileCard
            user={user}
            totalLessons={2}
            totalQuests={quests.length}
            totalBadges={BADGES_DATA.length}
            syncStatus={syncStatus}
            lastSavedTime={lastSavedTime}
            onEditProfile={() => setIsProfileModalOpen(true)}
          />
        ) : (
          <GuestHeroCard
            onOpenLogin={() => setIsProfileModalOpen(true)}
          />
        )}

        {/* Desktop Tab Navigation Bar */}
        <div className="flex items-center space-x-2 p-2 rounded-3xl bg-[#161633] border border-white/5 backdrop-blur-xl overflow-x-auto shadow-2xl">
          
          <button
            onClick={() => { soundManager.playClick(); setActiveTab('checkin'); }}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
              activeTab === 'checkin'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-500/25 ring-1 ring-orange-400/40'
                : 'text-indigo-200 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-4 h-4 text-orange-400" />
            <span>เช็คอินรายวัน</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); setActiveTab('learn_quiz'); }}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
              activeTab === 'learn_quiz'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30 ring-1 ring-purple-400/40'
                : 'text-indigo-200 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>บทเรียน & Quiz (20 ข้อ)</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); setActiveTab('badges'); }}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
              activeTab === 'badges'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 ring-1 ring-pink-400/40'
                : 'text-indigo-200 hover:text-white hover:bg-white/5'
            }`}
          >
            <Award className="w-4 h-4 text-pink-400" />
            <span>สะสม Badge ({user.badges.length}/{BADGES_DATA.length})</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); setActiveTab('leaderboard'); }}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
              activeTab === 'leaderboard'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-lg shadow-yellow-500/25 ring-1 ring-yellow-300'
                : 'text-indigo-200 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span>อันดับคะแนน</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); setIsGasModalOpen(true); }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-semibold text-xs sm:text-sm transition-all whitespace-nowrap text-cyan-400 hover:bg-white/5 border border-cyan-500/20 ml-auto"
          >
            <Database className="w-4 h-4 text-cyan-400" />
            <span>GAS & Sheets</span>
          </button>

        </div>

        {/* Tab Content Display */}
        <div className="pt-1">
          {activeTab === 'checkin' && (
            <CheckInTab
              user={user}
              quests={quests}
              onCheckIn={handleCheckIn}
              onClaimQuest={handleClaimQuest}
              onGoToQuiz={() => setActiveTab('learn_quiz')}
            />
          )}

          {activeTab === 'learn_quiz' && (
            <LessonsAndQuizTab
              user={user}
              onFinishQuiz={handleFinishQuiz}
              onReadLesson={handleReadLesson}
            />
          )}

          {activeTab === 'badges' && (
            <BadgesTab user={user} />
          )}

          {activeTab === 'leaderboard' && (
            <LeaderboardTab
              user={user}
              leaderboard={leaderboard}
              onRefresh={handleRefreshLeaderboard}
              isRefreshing={isRefreshingLeaderboard}
              isGasConnected={Boolean(gasUrl && gasUrl.startsWith('https://script.google.com/'))}
            />
          )}
        </div>

      </main>

      {/* 3. Mobile Fixed Bottom Navigation Bar (Optimized for LIFF / Mobile View) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#161633]/95 backdrop-blur-xl border-t border-white/10 px-3 py-2 flex items-center justify-around shadow-2xl">
        
        <button
          onClick={() => { soundManager.playClick(); setActiveTab('checkin'); }}
          className={`flex flex-col items-center space-y-1 p-1.5 rounded-xl transition ${
            activeTab === 'checkin' ? 'text-orange-400 font-bold bg-orange-500/10' : 'text-indigo-300'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px]">เช็คอิน</span>
        </button>

        <button
          onClick={() => { soundManager.playClick(); setActiveTab('learn_quiz'); }}
          className={`flex flex-col items-center space-y-1 p-1.5 rounded-xl transition ${
            activeTab === 'learn_quiz' ? 'text-purple-400 font-bold bg-purple-500/10' : 'text-indigo-300'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px]">บทเรียน/ควิซ</span>
        </button>

        <button
          onClick={() => { soundManager.playClick(); setActiveTab('badges'); }}
          className={`flex flex-col items-center space-y-1 p-1.5 rounded-xl transition ${
            activeTab === 'badges' ? 'text-pink-400 font-bold bg-pink-500/10' : 'text-indigo-300'
          }`}
        >
          <Award className="w-5 h-5" />
          <span className="text-[10px]">Badge</span>
        </button>

        <button
          onClick={() => { soundManager.playClick(); setActiveTab('leaderboard'); }}
          className={`flex flex-col items-center space-y-1 p-1.5 rounded-xl transition ${
            activeTab === 'leaderboard' ? 'text-yellow-400 font-bold bg-yellow-500/10' : 'text-indigo-300'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[10px]">อันดับ</span>
        </button>

        <button
          onClick={() => { soundManager.playClick(); setIsGasModalOpen(true); }}
          className="flex flex-col items-center space-y-1 p-1.5 rounded-xl text-cyan-400"
        >
          <Database className="w-5 h-5" />
          <span className="text-[10px]">GAS/ชีต</span>
        </button>

      </div>

      {/* 4. Modals */}
      <GasDocsModal
        isOpen={isGasModalOpen}
        onClose={() => setIsGasModalOpen(false)}
        gasUrl={gasUrl}
        onSaveGasUrl={(url) => setGasUrl(url)}
        user={user}
      />

      <LineLoginModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        isLoggedIn={isLoggedIn}
        onUpdateProfile={handleSaveProfile}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

    </div>
  );
}
