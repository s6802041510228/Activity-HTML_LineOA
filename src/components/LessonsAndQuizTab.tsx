import React, { useState, useEffect } from 'react';
import { 
  BookOpen, CheckCircle2, XCircle, Award, Sparkles, HelpCircle, 
  RotateCcw, ArrowRight, ArrowLeft, Lightbulb, Code2, Check,
  BookMarked, Clock, ChevronRight, FileCode2, Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LessonTopic, Question, QuizTopicId, UserProfile } from '../types';
import { LESSON_TOPICS, QUESTIONS_DATA } from '../data/mockData';
import { soundManager } from '../utils/audio';

interface LessonsAndQuizTabProps {
  user: UserProfile;
  onFinishQuiz: (topicId: QuizTopicId, score: number, total: number) => void;
  onReadLesson: (topicId: QuizTopicId) => void;
}

export const LessonsAndQuizTab: React.FC<LessonsAndQuizTabProps> = ({
  user,
  onFinishQuiz,
  onReadLesson,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<QuizTopicId>('structure');
  const [viewMode, setViewMode] = useState<'study' | 'quiz' | 'result'>('study');
  
  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showInstantExplanation, setShowInstantExplanation] = useState<boolean>(true);
  const [quizTimer, setQuizTimer] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<{ score: number; total: number; expGained: number }>({ score: 0, total: 10, expGained: 0 });

  const activeTopic = LESSON_TOPICS.find((t) => t.id === selectedTopicId) || LESSON_TOPICS[0];
  const topicQuestions = QUESTIONS_DATA.filter((q) => q.topicId === selectedTopicId);
  const currentQuestion = topicQuestions[currentQuestionIndex] || topicQuestions[0];

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (viewMode === 'quiz' && isTimerRunning) {
      interval = setInterval(() => {
        setQuizTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [viewMode, isTimerRunning]);

  const handleStartQuiz = () => {
    soundManager.playClick();
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setQuizTimer(0);
    setIsTimerRunning(true);
    setViewMode('quiz');
  };

  const handleSelectOption = (optionIndex: number) => {
    if (selectedAnswers[currentQuestion.id] !== undefined) return; // already answered

    soundManager.playClick();
    const isCorrect = optionIndex === currentQuestion.correctIndex;
    if (isCorrect) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handleNextQuestion = () => {
    soundManager.playClick();
    if (currentQuestionIndex < topicQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevQuestion = () => {
    soundManager.playClick();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setIsTimerRunning(false);

    // Calculate score
    let calculatedScore = 0;
    topicQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        calculatedScore += 1;
      }
    });

    const expGained = calculatedScore * 15;
    setQuizScore({
      score: calculatedScore,
      total: topicQuestions.length,
      expGained,
    });

    if (calculatedScore >= 8) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#a855f7', '#38bdf8', '#fbbf24', '#34d399'],
      });
      soundManager.playLevelUp();
    } else if (calculatedScore >= 6) {
      soundManager.playCorrect();
    }

    onFinishQuiz(selectedTopicId, calculatedScore, topicQuestions.length);
    setViewMode('result');
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isAllAnswered = answeredCount === topicQuestions.length;

  return (
    <div className="space-y-6">
      
      {/* 1. Topic Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LESSON_TOPICS.map((topic) => {
          const isSelected = topic.id === selectedTopicId;
          const userScoreInfo = user.quizScores[topic.id];
          const hasPassed = userScoreInfo && userScoreInfo.bestScore >= 6;

          return (
            <div
              key={topic.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedTopicId(topic.id);
                setViewMode('study');
                onReadLesson(topic.id);
              }}
              className={`cursor-pointer rounded-3xl border p-5 sm:p-6 transition-all duration-300 relative overflow-hidden shadow-2xl ${
                isSelected
                  ? 'bg-gradient-to-br from-indigo-950/90 via-[#161633] to-purple-950/80 border-purple-500 shadow-purple-500/10 ring-1 ring-purple-400'
                  : 'bg-[#161633] border-white/5 hover:border-white/10 hover:bg-[#1a1a3c]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-3xl shadow-lg shadow-purple-500/20">
                    {topic.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      แบบทดสอบ 10 ข้อ
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white mt-1">
                      {topic.title}
                    </h3>
                  </div>
                </div>

                {hasPassed && (
                  <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ผ่านแล้ว ({userScoreInfo.bestScore}/10)</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-indigo-200 mt-3 line-clamp-2">
                {topic.description}
              </p>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10 text-xs">
                <div className="flex items-center space-x-2 text-indigo-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>รางวัล: +{topic.expReward} EXP</span>
                </div>
                <div className="flex items-center space-x-1 text-purple-400 font-bold">
                  <span>{isSelected ? 'กำลังดูหมวดนี้' : 'เลือกบทเรียนนี้'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Mode Toggle (Study Guide vs Quiz) */}
      <div className="flex items-center justify-between bg-[#161633] p-1.5 rounded-full border border-white/10 max-w-md mx-auto shadow-xl">
        <button
          onClick={() => {
            soundManager.playClick();
            setViewMode('study');
            onReadLesson(selectedTopicId);
          }}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-full text-xs sm:text-sm font-bold transition ${
            viewMode === 'study'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25 ring-1 ring-purple-400/40'
              : 'text-indigo-300 hover:text-white'
          }`}
        >
          <BookMarked className="w-4 h-4" />
          <span>สรุปเนื้อหาบทเรียน</span>
        </button>

        <button
          onClick={handleStartQuiz}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-full text-xs sm:text-sm font-bold transition ${
            viewMode === 'quiz' || viewMode === 'result'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 ring-1 ring-blue-400/40'
              : 'text-indigo-300 hover:text-white'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>ทำควิซ 10 ข้อ</span>
        </button>
      </div>

      {/* 3. VIEW: STUDY GUIDE & CHEATSHEET */}
      {viewMode === 'study' && (
        <div className="space-y-6">
          
          {/* Study Header Banner */}
          <div className="p-6 rounded-3xl bg-[#161633] border border-white/5 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{activeTopic.icon}</span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  สรุปเนื้อหา: {activeTopic.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-indigo-200 mt-1">
                อ่านทบทวนหลักการสำคัญและตารางแท็กก่อนเริ่มทำแบบทดสอบ 10 ข้อ
              </p>
            </div>

            <button
              onClick={handleStartQuiz}
              className="w-full md:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition active:scale-95"
            >
              <Play className="w-4 h-4" />
              <span>เริ่มทำแบบทดสอบ 10 ข้อ</span>
            </button>
          </div>

          {/* Key Study Highlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTopic.studyHighlights.map((highlight, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-3xl bg-[#161633] border border-white/5 hover:border-purple-500/30 transition space-y-3 shadow-xl"
              >
                <h4 className="font-bold text-white text-sm sm:text-base flex items-center space-x-2.5">
                  <span className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-300 text-xs flex items-center justify-center font-mono border border-purple-500/30">
                    {idx + 1}
                  </span>
                  <span>{highlight.title}</span>
                </h4>
                
                <p className="text-xs text-indigo-200 leading-relaxed">
                  {highlight.description}
                </p>

                {highlight.codeExample && (
                  <div className="rounded-2xl bg-[#1a1a3c] p-3.5 border border-white/10 font-mono text-xs text-cyan-300 overflow-x-auto shadow-inner">
                    <pre>{highlight.codeExample}</pre>
                  </div>
                )}

                <ul className="space-y-1 text-xs text-indigo-300/80 list-disc list-inside">
                  {highlight.keyPoints.map((point, pIdx) => (
                    <li key={pIdx} className="leading-normal">{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Interactive Tag Cheatsheet Table */}
          <div className="rounded-3xl bg-[#161633] border border-white/5 p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center space-x-2">
              <Code2 className="w-5 h-5 text-purple-400" />
              <h4 className="font-bold text-white text-base">ตารางสรุปคำสั่ง Tag (Cheatsheet)</h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-indigo-400 uppercase text-[10px] tracking-[0.2em]">
                    <th className="py-3 px-3.5">แท็ก HTML</th>
                    <th className="py-3 px-3.5">ชื่อเต็ม / หน้าที่</th>
                    <th className="py-3 px-3.5 hidden sm:table-cell">ตัวอย่างการใช้งาน</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {activeTopic.cheatsheet.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition">
                      <td className="py-3 px-3.5 font-mono font-bold text-cyan-300 whitespace-nowrap">
                        {item.tag}
                      </td>
                      <td className="py-3 px-3.5 text-slate-200">
                        <div className="font-semibold text-white">{item.name}</div>
                        <div className="text-indigo-300 text-[11px]">{item.purpose}</div>
                      </td>
                      <td className="py-3 px-3.5 font-mono text-purple-300 hidden sm:table-cell">
                        <code>{item.example}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 4. VIEW: QUIZ IN PROGRESS */}
      {viewMode === 'quiz' && (
        <div className="space-y-5">
          
          {/* Quiz Top Status Bar */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#161633] border border-white/5 flex items-center justify-between flex-wrap gap-3 shadow-xl">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                ข้อที่ {currentQuestionIndex + 1} จาก {topicQuestions.length}
              </span>
              <span className="text-xs text-indigo-200 hidden sm:inline font-medium">
                {activeTopic.titleTh}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5 text-xs font-mono text-cyan-300 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{formatTimer(quizTimer)}</span>
              </div>

              <div className="text-xs text-indigo-300 font-mono">
                ตอบแล้ว: <span className="text-purple-400 font-bold">{answeredCount}</span>/10
              </div>
            </div>
          </div>

          {/* Question Progress Bar */}
          <div className="w-full h-2 rounded-full bg-gray-900 overflow-hidden p-0.5 border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
              style={{ width: `${((currentQuestionIndex + 1) / topicQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#161633] border border-white/5 shadow-2xl space-y-6">
            
            {/* Question Text */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-indigo-400 font-bold">
                <HelpCircle className="w-4 h-4" />
                <span>QUESTION {currentQuestionIndex + 1} OF 10</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                {currentQuestion.question}
              </h3>
            </div>

            {/* Optional Code Snippet in Question */}
            {currentQuestion.codeSnippet && (
              <div className="p-4 rounded-2xl bg-[#1a1a3c] border border-white/10 font-mono text-xs sm:text-sm text-cyan-300 overflow-x-auto shadow-inner">
                <div className="text-[10px] text-indigo-400 uppercase tracking-widest mb-1 font-sans font-bold">โค้ดตัวอย่าง:</div>
                <pre>{currentQuestion.codeSnippet}</pre>
              </div>
            )}

            {/* 4 Choices */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentQuestion.id] === optIdx;
                const hasAnswered = selectedAnswers[currentQuestion.id] !== undefined;
                const isCorrectChoice = optIdx === currentQuestion.correctIndex;

                let optionStyles = 'bg-[#1a1a3c] border-white/10 hover:border-purple-500 text-slate-200';

                if (hasAnswered) {
                  if (isSelected && isCorrectChoice) {
                    optionStyles = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/20 ring-1 ring-emerald-400';
                  } else if (isSelected && !isCorrectChoice) {
                    optionStyles = 'bg-rose-500/20 border-rose-500 text-rose-200 shadow-md shadow-rose-500/20 ring-1 ring-rose-400';
                  } else if (isCorrectChoice) {
                    optionStyles = 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300';
                  } else {
                    optionStyles = 'bg-[#1a1a3c]/40 border-white/5 text-slate-500 opacity-50';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={hasAnswered}
                    className={`w-full text-left p-4 rounded-2xl border flex items-center justify-between gap-3 transition-all duration-200 ${optionStyles}`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 ${
                        isSelected
                          ? isCorrectChoice
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-rose-500 text-white'
                          : 'bg-white/5 border border-white/10 text-indigo-300'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="text-sm font-medium">{option}</span>
                    </div>

                    {hasAnswered && isCorrectChoice && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    )}
                    {hasAnswered && isSelected && !isCorrectChoice && (
                      <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Instant Rationale / Explanation Box (Shows after answering) */}
            {selectedAnswers[currentQuestion.id] !== undefined && showInstantExplanation && (
              <div className={`p-4 sm:p-5 rounded-2xl border animate-in fade-in duration-300 ${
                selectedAnswers[currentQuestion.id] === currentQuestion.correctIndex
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                  : 'bg-[#1a1a3c] border-purple-500/40 text-slate-200'
              }`}>
                <div className="flex items-start space-x-3">
                  <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1.5">
                    <div className="font-bold text-xs sm:text-sm text-white flex items-center space-x-2">
                      <span>เฉลย & เหตุผลประกอบ:</span>
                      <span className="text-emerald-400 font-mono">
                        (ข้อ {String.fromCharCode(65 + currentQuestion.correctIndex)})
                      </span>
                    </div>
                    <p className="text-xs text-indigo-200 leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                    {currentQuestion.tip && (
                      <p className="text-[11px] text-cyan-300 pt-1 font-mono">
                        💡 ทริกจำ: {currentQuestion.tip}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation & Question Jumpers */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-full text-xs font-bold text-indigo-200 hover:text-white bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:hover:text-indigo-200 transition border border-white/10"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ข้อก่อนหน้า</span>
              </button>

              <div className="flex items-center space-x-1 hidden sm:flex">
                {topicQuestions.map((q, idx) => {
                  const isAns = selectedAnswers[q.id] !== undefined;
                  const isCur = idx === currentQuestionIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        soundManager.playClick();
                        setCurrentQuestionIndex(idx);
                      }}
                      className={`w-8 h-8 rounded-xl text-xs font-mono font-bold transition ${
                        isCur
                          ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                          : isAns
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-white/5 text-slate-500 hover:bg-white/10'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {currentQuestionIndex < topicQuestions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center space-x-1.5 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-500/20 transition"
                >
                  <span>ข้อถัดไป</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  className="flex items-center space-x-1.5 px-6 py-2.5 rounded-full text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 shadow-lg shadow-amber-500/25 transition active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>ส่งคำตอบสรุปผล</span>
                </button>
              )}
            </div>

          </div>

        </div>
      )}

      {/* 5. VIEW: QUIZ RESULT SUMMARY */}
      {viewMode === 'result' && (
        <div className="space-y-6">
          
          {/* Main Result Card */}
          <div className="p-7 sm:p-10 rounded-3xl bg-[#161633] border border-white/5 shadow-2xl text-center space-y-6">
            
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Assessment Summary</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {quizScore.score >= 8
                ? '🎉 ยอดเยี่ยมมาก! ทำคะแนนได้ระดับดีเยี่ยม'
                : quizScore.score >= 6
                ? '👍 ผ่านเกณฑ์การประเมินบทเรียน'
                : '💪 พยายามอีกนิด ทบทวนและลองใหม่อีกครั้ง!'}
            </h2>

            {/* Score Big Circle */}
            <div className="flex items-center justify-center my-4">
              <div className="relative w-40 h-40 rounded-full flex flex-col items-center justify-center bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border-4 border-purple-500/40 shadow-2xl shadow-purple-500/20">
                <span className="text-4xl font-black text-white font-mono">
                  {quizScore.score}
                  <span className="text-xl text-indigo-300 font-normal">/{quizScore.total}</span>
                </span>
                <span className="text-xs font-bold text-cyan-300 mt-1">
                  {Math.round((quizScore.score / quizScore.total) * 100)}%
                </span>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-w-lg mx-auto">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold">EXP ที่ได้รับ</div>
                <div className="text-lg font-black text-amber-400 font-mono mt-0.5">+{quizScore.expGained} EXP</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold">เวลาที่ใช้</div>
                <div className="text-lg font-black text-cyan-400 font-mono mt-0.5">{formatTimer(quizTimer)}</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 col-span-2 sm:col-span-1">
                <div className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold">สถานะผลสอบ</div>
                <div className={`text-lg font-black mt-0.5 ${quizScore.score >= 6 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {quizScore.score >= 6 ? 'ผ่านเกณฑ์ ✅' : 'ยังไม่ผ่าน ❌'}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={handleStartQuiz}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-sm font-bold transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>ทำใหม่อีกครั้ง</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  const otherTopic: QuizTopicId = selectedTopicId === 'structure' ? 'tags' : 'structure';
                  setSelectedTopicId(otherTopic);
                  setViewMode('study');
                }}
                className="inline-flex items-center space-x-2 px-7 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold shadow-lg shadow-purple-500/25 transition"
              >
                <span>ไปยังหมวด {selectedTopicId === 'structure' ? '2. การใช้งาน Tag' : '1. โครงสร้าง HTML'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Full 10 Questions Review Breakdown */}
          <div className="rounded-3xl bg-[#161633] border border-white/5 p-6 sm:p-7 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-lg flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>ตรวจคำตอบและเฉลยละเอียดทั้ง 10 ข้อ</span>
            </h3>

            <div className="space-y-3">
              {topicQuestions.map((q, idx) => {
                const userAnsIndex = selectedAnswers[q.id];
                const isCorrect = userAnsIndex === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-4 sm:p-5 rounded-2xl border space-y-2.5 ${
                      isCorrect
                        ? 'bg-[#1a1a3c]/60 border-emerald-500/30'
                        : 'bg-[#1a1a3c]/60 border-rose-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start space-x-3">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5 ${
                          isCorrect ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-sm text-white">{q.question}</h4>
                      </div>

                      {isCorrect ? (
                        <span className="flex items-center space-x-1 text-emerald-400 text-xs font-bold flex-shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>ถูก (+15 EXP)</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 text-rose-400 text-xs font-bold flex-shrink-0">
                          <XCircle className="w-4 h-4" />
                          <span>ผิด</span>
                        </span>
                      )}
                    </div>

                    <div className="text-xs space-y-1.5 pl-10">
                      <div className="text-indigo-200">
                        คำตอบของคุณ: <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {userAnsIndex !== undefined ? q.options[userAnsIndex] : 'ไม่ได้ตอบ'}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div className="text-emerald-400 font-bold">
                          คำตอบที่ถูกต้อง: {q.options[q.correctIndex]}
                        </div>
                      )}
                      <p className="text-indigo-200 text-[11px] pt-1 bg-[#161633] p-3 rounded-xl border border-white/5 leading-relaxed">
                        <strong className="text-purple-300">💡 เหตุผล:</strong> {q.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
