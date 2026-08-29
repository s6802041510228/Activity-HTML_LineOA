export type QuizTopicId = 'structure' | 'tags';

export interface UserProfile {
  userId: string;
  displayName: string;
  pictureUrl: string;
  statusMessage?: string;
  studentId: string;
  classroom: string;
  score: number; // EXP
  level: number;
  rank: number;
  streakDays: number;
  lastCheckInDate: string;
  completedLessons: string[];
  completedQuests: string[];
  badges: string[];
  quizScores: {
    [key in QuizTopicId]?: {
      bestScore: number;
      totalQuestions: number;
      attempts: number;
      lastAttemptDate: string;
    };
  };
}

export interface Question {
  id: number;
  topicId: QuizTopicId;
  topicName: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tip?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface LessonTopic {
  id: QuizTopicId;
  title: string;
  titleTh: string;
  description: string;
  icon: string;
  badgeRewardId: string;
  expReward: number;
  color: string;
  gradient: string;
  studyHighlights: Array<{
    title: string;
    description: string;
    codeExample?: string;
    keyPoints: string[];
  }>;
  cheatsheet: Array<{
    tag: string;
    name: string;
    purpose: string;
    example: string;
    type: 'structure' | 'content' | 'link' | 'media' | 'list' | 'formatting';
  }>;
}

export interface Badge {
  id: string;
  name: string;
  nameTh: string;
  description: string;
  icon: string;
  category: 'checkin' | 'quiz' | 'level' | 'special';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  expBonus: number;
  unlocked: boolean;
  unlockedAt?: string;
  requirement: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  studentId: string;
  classroom: string;
  pictureUrl: string;
  score: number;
  level: number;
  badgesCount: number;
  streakDays: number;
  isCurrentUser?: boolean;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  expReward: number;
  completed: boolean;
  claimed: boolean;
  icon: string;
}

export interface LevelThreshold {
  level: number;
  titleTh: string;
  titleEn: string;
  minExp: number;
  maxExp: number;
  icon: string;
  color: string;
}

export type ActiveTab = 'checkin' | 'learn_quiz' | 'badges' | 'leaderboard' | 'gas_setup';
