import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';

// 分数可视化（披萨）
function FractionVisualization({ numerator, denominator }: { numerator: number; denominator: number }) {
  const parts = [];
  const anglePerPart = (2 * Math.PI) / denominator;

  for (let i = 0; i < denominator; i++) {
    const color = i < numerator ? '#3B82F6' : '#1E293B';
    parts.push(
      <mesh key={i} rotation={[Math.PI / 2, 0, i * anglePerPart]} position={[0, 0, 0]}>
        <ringGeometry args={[0, 3, 32, 1, 0, anglePerPart]} />
        <meshStandardMaterial color={color} side={2} />
      </mesh>
    );
  }

  return <group>{parts}</group>;
}

export default function LessonFraction() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [numerator, setNumerator] = useState(1);
  const [denominator, setDenominator] = useState(2);
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // 视角控制函数
  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 8, 8);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const topView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 12, 0.001);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const frontView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 2, 12);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const sideView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(12, 2, 0);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const isoView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(8, 8, 8);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  // 定义引导任务
  const tasks: Task[] = [
    {
      id: 1,
      title: '切成2块，吃掉1块',
      description: '把披萨切成2块，吃掉1块（1/2 = 一半）',
      checkCondition: () => numerator === 1 && denominator === 2,
      hint: '太棒了！1/2就是一半！',
    },
    {
      id: 2,
      title: '切成4块，吃掉2块',
      description: '把披萨切成4块，吃掉2块（2/4 = 也是一半哦）',
      checkCondition: () => numerator === 2 && denominator === 4,
      hint: '对了！2/4也是一半！',
    },
    {
      id: 3,
      title: '切成8块，吃掉4块',
      description: '把披萨切成8块，吃掉4块（4/8 = 还是一半！）',
      checkCondition: () => numerator === 4 && denominator === 8,
      hint: '哇！你发现了！4/8还是一半！',
    },
    {
      id: 4,
      title: '试试别的分数！',
      description: '试试切成3块，吃掉1块（1/3）',
      checkCondition: () => numerator === 1 && denominator === 3,
      hint: '做得好！1/3比一半小一点！',
    },
    {
      id: 5,
      title: '挑战！哪个更大？',
      description: '试试切成4块吃掉3块（3/4），比1/2大吗？',
      checkCondition: () => numerator === 3 && denominator === 4,
      hint: '正确！3/4比1/2大！吃掉的部分更多了！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '🍕 一个披萨切成4块，你吃掉1块，你吃了多少？',
      options: ['1/2', '1/3', '1/4', '1/5'],
      correctAnswer: 2,
      hint: '提示: 分母是总块数，分子是吃掉的块数',
      explanation: '正确！1/4，就是4块中的1块！',
    },
    {
      id: 2,
      question: '🍕 1/2 和 2/4，哪个更大？',
      options: ['1/2大', '2/4大', '一样大', '不知道'],
      correctAnswer: 2,
      hint: '提示: 都是一半哦！',
      explanation: '太聪明了！1/2 = 2/4，它们一样大！',
    },
    {
      id: 3,
      question: '🍕 一个披萨切成6块，你吃掉3块，吃了多少？',
      options: ['1/2', '2/3', '3/6', '3/4'],
      correctAnswer: 2,
      hint: '提示: 3块 / 总共6块',
      explanation: '对了！3/6，而且3/6也等于一半！',
    },
    {
      id: 4,
      question: '🍕 1/3 和 1/4，哪个更大？',
      options: ['1/3大', '1/4大', '一样大', '不知道'],
      correctAnswer: 0,
      hint: '提示: 切的块数越少，每块越大',
      explanation: '正确！1/3比1/4大，因为切成3块比切成4块，每块更大！',
    },
    {
      id: 5,
      question: '🍕 3/4 表示什么意思？',
      options: ['切成3块吃4块', '切成4块吃3块', '切成4块每块3', '都不对'],
      correctAnswer: 1,
      hint: '提示: 分母是总份数，分子是取的份数',
      explanation: '太棒了！3/4表示把披萨切成4块，吃掉其中的3块！',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900/20 to-cyan-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">🍕</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">披萨派对</h1>
              <p className="text-sm text-blue-300">学习分数的秘密</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
          >
            ← 返回首页
          </button>
        </div>
      </nav>

      {/* 故事引入 */}
      <div className="pt-28 pb-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <span className="text-5xl">📖</span>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">美味披萨分享</h2>
                <p className="text-lg text-blue-200 leading-relaxed">
                  今天是<span className="text-2xl mx-1">🎉</span>披萨派对！
                  大家一起分享<span className="text-2xl mx-1">🍕</span>美味的披萨！
                  怎样才能<span className="text-2xl mx-1">🎯</span>公平地分给每个人呢？
                  <br />
                  <span className="text-yellow-300 font-bold">
                    分数就是把东西平均分成几份，取其中的几份！
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：3D场景和任务 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 3D场景 */}
              <div className="glass-panel rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    🎨 披萨分享场景
                  </h2>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-yellow-400">
                      {numerator}/{denominator}
                    </div>
                    <div className="text-sm text-blue-300 mt-1">
                      把披萨切成{denominator}块，吃掉{numerator}块
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <ViewControlButtons
                    onReset={resetView}
                    onTopView={topView}
                    onFrontView={frontView}
                    onSideView={sideView}
                    onIsoView={isoView}
                  />
                </div>
                <div className="w-full h-[400px] rounded-lg overflow-hidden bg-slate-800/50">
                  <Canvas shadows gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
                    <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 8, 8]} fov={60} />
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 20, 10]} castShadow />
                    <FractionVisualization numerator={numerator} denominator={denominator} />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-blue-200 text-sm mt-4 text-center">
                  💡 蓝色部分是你吃掉的，灰色部分是剩下的！
                </p>
              </div>

              {/* 任务卡片 */}
              <TaskCard
                title="学习任务"
                tasks={tasks}
                onAllCompleted={() => setTasksCompleted(true)}
              />
            </div>

            {/* 右侧：控制面板和小测验 */}
            <div className="lg:col-span-1 space-y-6">
              {/* 控制面板 */}
              <div className="glass-panel rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  🎛️ 控制面板
                </h2>

                {/* 吃掉的块数 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    🍴 吃掉几块: {numerator}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="1"
                    value={numerator}
                    onChange={(e) => setNumerator(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>1块</span>
                    <span>12块</span>
                  </div>
                </div>

                {/* 切成几块 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    🔪 切成几块: {denominator}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="12"
                    step="1"
                    value={denominator}
                    onChange={(e) => setDenominator(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>2块</span>
                    <span>12块</span>
                  </div>
                </div>

                {/* 分数的意义 */}
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                    📖 分数是什么？
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <p className="text-green-300">
                      分数就是<span className="font-bold">平均分配</span>！
                    </p>
                    <p className="text-white text-base leading-relaxed">
                      把1个披萨平均切成{denominator}块：
                    </p>
                    <p className="text-lg text-center py-2 bg-slate-800/50 rounded-lg">
                      <span className="text-yellow-400 font-bold">{numerator}</span> /
                      <span className="text-yellow-400 font-bold">{denominator}</span>
                      {' '}={''} 吃掉{numerator}块，总共{denominator}块
                    </p>
                    <p className="text-xs text-blue-300 mt-2">
                      💡 分母是总份数，分子是取的份数
                    </p>
                  </div>
                </div>

                {/* 小技巧 */}
                <div className="p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-2 border-purple-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-purple-400 mb-2 flex items-center gap-2">
                    💡 小秘密
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <span>
                        <span className="text-white font-bold">1/2 = 2/4 = 4/8</span>
                        <br />
                        <span className="text-xs">它们都是一半！</span>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <span>
                        <span className="text-white font-bold">分母越大：</span>切的块数越多，每块越小
                      </span>
                    </li>
                  </ul>
                </div>

                {/* 常见分数 */}
                <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-lg">
                  <h3 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
                    ⭐ 快速选择
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { n: 1, d: 2 }, { n: 1, d: 3 }, { n: 2, d: 3 }, { n: 3, d: 4 },
                      { n: 1, d: 4 }, { n: 2, d: 5 }, { n: 3, d: 5 }, { n: 5, d: 8 },
                    ].map((f) => (
                      <button
                        key={`${f.n}-${f.d}`}
                        onClick={() => {
                          setNumerator(f.n);
                          setDenominator(f.d);
                        }}
                        className="p-2 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors border border-slate-700/50"
                      >
                        <div className="text-sm text-white">{f.n}/{f.d}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="披萨挑战赛"
                questions={quizQuestions}
                onComplete={(score, total) => {
                  setQuizScore(score);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 完成庆祝 */}
      {tasksCompleted && quizScore !== null && quizScore >= 4 && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="glass-panel rounded-3xl p-8 max-w-lg w-full text-center animate-bounce">
            <div className="text-8xl mb-4">🏆</div>
            <h2 className="text-4xl font-bold text-yellow-400 mb-4">太棒了！</h2>
            <p className="text-2xl text-white mb-2">你完成了所有挑战！</p>
            <p className="text-xl text-blue-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-green-300 mb-6">你真是个分数小达人！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
