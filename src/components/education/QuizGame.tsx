import React, { useState } from 'react';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  hint?: string;
  explanation?: string;
}

interface QuizGameProps {
  title: string;
  questions: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
}

export function QuizGame({ title, questions, onComplete }: QuizGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);

  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  const handleAnswer = (answerIndex: number) => {
    if (showResult) return;

    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const isCorrect = answerIndex === currentQ.correctAnswer;

    if (isCorrect && !answeredQuestions.has(currentQ.id)) {
      setScore(score + 1);
      setAnsweredQuestions(new Set(answeredQuestions).add(currentQ.id));
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1500);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // 完成所有问题
      if (onComplete) {
        onComplete(score + (selectedAnswer === currentQ.correctAnswer && !answeredQuestions.has(currentQ.id) ? 1 : 0), questions.length);
      }
    } else {
      // 下一题
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const isCorrect = selectedAnswer === currentQ.correctAnswer;

  return (
    <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-2xl">
      {/* 标题和进度 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-purple-400 text-lg flex items-center gap-2">
          🎮 {title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 text-lg">
            {'⭐'.repeat(score)}
          </span>
          <span className="text-sm text-white">
            {currentQuestion + 1} / {questions.length}
          </span>
        </div>
      </div>

      {/* 进度条 */}
      <div className="w-full bg-slate-700/50 rounded-full h-2 mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-300 rounded-full"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* 庆祝动画 */}
      {showCelebration && isCorrect && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className="text-6xl animate-bounce">🎉</div>
        </div>
      )}

      {/* 问题 */}
      <div className="mb-4">
        <p className="text-white font-medium text-lg">{currentQ.question}</p>
      </div>

      {/* 选项 */}
      <div className="space-y-2 mb-4">
        {currentQ.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectOption = index === currentQ.correctAnswer;

          let buttonClass = 'p-3 rounded-lg border-2 transition-all duration-300 ';

          if (!showResult) {
            // 未选择状态
            buttonClass += isSelected
              ? 'bg-purple-500/30 border-purple-500'
              : 'bg-slate-800/50 border-slate-700/50 hover:border-purple-500/50 hover:bg-slate-700/50';
          } else {
            // 已选择状态
            if (isCorrectOption) {
              buttonClass += 'bg-green-500/30 border-green-500';
            } else if (isSelected && !isCorrect) {
              buttonClass += 'bg-red-500/30 border-red-500';
            } else {
              buttonClass += 'bg-slate-800/30 border-slate-700/30 opacity-50';
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showResult}
              className={`w-full text-left ${buttonClass}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center text-sm font-bold text-white">
                  {String.fromCharCode(65 + index)}
                </div>
                <span className={`flex-1 ${showResult && isCorrectOption ? 'text-green-300' : showResult && isSelected && !isCorrect ? 'text-red-300' : 'text-white'}`}>
                  {option}
                </span>
                {showResult && isCorrectOption && <span className="text-xl">✅</span>}
                {showResult && isSelected && !isCorrect && <span className="text-xl">❌</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* 结果反馈 */}
      {showResult && (
        <div className={`p-3 rounded-lg mb-4 border-2 ${isCorrect ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50'}`}>
          {isCorrect ? (
            <>
              <p className="text-green-300 font-bold mb-1">🎉 答对了！太聪明了！</p>
              {currentQ.explanation && <p className="text-sm text-green-200">{currentQ.explanation}</p>}
            </>
          ) : (
            <>
              <p className="text-red-300 font-bold mb-1">💡 再想一想～</p>
              <p className="text-sm text-red-200">
                {currentQ.hint || '提示：想想乘法的含义'}
              </p>
            </>
          )}
        </div>
      )}

      {/* 下一题按钮 */}
      {showResult && (
        <button
          onClick={handleNext}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold text-white hover:opacity-90 transition-opacity"
        >
          {isLastQuestion ? '🏆 查看成绩' : '下一题 →'}
        </button>
      )}

      {/* 完成总结 */}
      {currentQuestion >= questions.length && (
        <div className="mt-4 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 rounded-lg text-center">
          <p className="text-2xl font-bold text-yellow-300 mb-2">🏆 太棒了！</p>
          <p className="text-lg text-white mb-2">
            你答对了 {score} / {questions.length} 题
          </p>
          <div className="text-3xl mb-2">{'⭐'.repeat(score)}</div>
          <p className="text-sm text-yellow-200">
            {score === questions.length
              ? '完美！你是乘法小达人！'
              : score >= questions.length / 2
              ? '很棒！继续加油！'
              : '再练习一下，你一定可以的！'}
          </p>
        </div>
      )}
    </div>
  );
}
