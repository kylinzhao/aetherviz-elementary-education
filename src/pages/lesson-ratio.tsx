import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';

// 比例可视化（果汁杯）
function RatioVisualization({ a, b }: { a: number; b: number }) {
  const total = a + b;
  const cupWidth = 4;
  const cupHeight = 6;
  const size = 0.8;

  return (
    <group>
      {/* 果汁杯容器 */}
      <mesh position={[0, cupHeight / 2, 0]}>
        <cylinderGeometry args={[cupWidth / 2, cupWidth / 2 * 0.9, cupHeight, 32]} />
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.2} />
      </mesh>

      {/* 果汁A（橙色） */}
      <group position={[-total * size / 2 + a * size / 2, 0.5, 0]}>
        {Array.from({ length: a }).map((_, i) => (
          <mesh key={i} position={[-(a - 1) * size / 2 + i * size, 0, 0]}>
            <sphereGeometry args={[size * 0.4, 16, 16]} />
            <meshStandardMaterial color="#F97316" />
          </mesh>
        ))}
      </group>

      {/* 果汁B（黄色） */}
      <group position={[a * size - total * size / 2 + b * size / 2, 0.5, 0]}>
        {Array.from({ length: b }).map((_, i) => (
          <mesh key={i} position={[-(b - 1) * size / 2 + i * size, 0, 0]}>
            <sphereGeometry args={[size * 0.4, 16, 16]} />
            <meshStandardMaterial color="#EAB308" />
          </mesh>
        ))}
      </group>

      {/* 混合标签 */}
      <mesh position={[0, cupHeight + 0.5, 0]}>
        <planeGeometry args={[3, 0.8]} />
        <meshBasicMaterial color="#1E293B" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

export default function LessonRatio() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [a, setA] = useState(2);
  const [b, setB] = useState(2);
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // 视角控制函数
  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 8, 15);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const topView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 15, 0.001);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const frontView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 2, 18);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const sideView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(18, 2, 0);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const isoView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(12, 12, 12);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y);
  const simplifiedA = a / gcd(a, b);
  const simplifiedB = b / gcd(a, b);

  // 定义引导任务
  const tasks: Task[] = [
    {
      id: 1,
      title: '调制1:1果汁',
      description: '橙汁和苹果汁一样多（2:2 = 1:1）',
      checkCondition: () => a === 2 && b === 2,
      hint: '完美！1:1表示两种果汁一样多！',
    },
    {
      id: 2,
      title: '调制2:1果汁',
      description: '橙汁是苹果汁的2倍（4:2 = 2:1）',
      checkCondition: () => a === 4 && b === 2,
      hint: '太棒了！2:1表示橙汁是苹果汁的2倍！',
    },
    {
      id: 3,
      title: '理解比例关系',
      description: '试试6:3，它能化简成什么？（提示：2:1）',
      checkCondition: () => a === 6 && b === 3,
      hint: '对了！6:3 = 2:1，它们表示同样的比例！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '🍊 3个橙子和3个苹果，比例是多少？',
      options: ['3:3', '1:1', '3:1', '1:3'],
      correctAnswer: 1,
      hint: '提示: 它们数量相同，可以化简',
      explanation: '正确！3:3可以化简成1:1，表示一样多！',
    },
    {
      id: 2,
      question: '🍊 4个橙子和2个苹果，比例是多少？',
      options: ['4:2', '2:1', '1:2', '4:1'],
      correctAnswer: 1,
      hint: '提示: 橙子是苹果的几倍？',
      explanation: '太聪明了！4:2 = 2:1，橙子是苹果的2倍！',
    },
    {
      id: 3,
      question: '🍊 6个橙子和3个苹果，和哪个比例相同？',
      options: ['3:1', '2:1', '1:2', '6:3'],
      correctAnswer: 1,
      hint: '提示: 可以同时除以3',
      explanation: '对了！6:3 = 2:1，它们表示同样的比例！',
    },
    {
      id: 4,
      question: '🍊 2:1和4:2，哪个比例更大？',
      options: ['2:1大', '4:2大', '一样大', '无法比较'],
      correctAnswer: 2,
      hint: '提示: 4:2可以化简成什么？',
      explanation: '正确！2:1 = 4:2，它们表示相同的比例关系！',
    },
    {
      id: 5,
      question: '🍊 如果比例是3:2，有9个橙子，应该有几个苹果？',
      options: ['3个', '6个', '9个', '12个'],
      correctAnswer: 1,
      hint: '提示: 3:2 = 9:?, 9是3的3倍',
      explanation: '太棒了！3:2 = 9:6，应该有6个苹果！',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-orange-900/20 to-amber-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">⚖️</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">配比大师</h1>
              <p className="text-sm text-orange-300">学习比例的魔法</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">调制美味果汁</h2>
                <p className="text-lg text-orange-200 leading-relaxed">
                  欢迎来到<span className="text-2xl mx-1">🍹</span>果汁实验室！
                  今天我们要学习如何调制<span className="text-2xl mx-1">🍊</span>橙汁和<span className="text-2xl mx-1">🍎</span>苹果汁的完美配方！
                  <br />
                  <span className="text-yellow-300 font-bold">
                    比例就是告诉我们两种东西按什么比例混合！
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
                    🎨 果汁调配室
                  </h2>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-yellow-400">
                      {a} : {b}
                    </div>
                    <div className="text-sm text-orange-300 mt-1">
                      {a}份橙汁 : {b}份苹果汁
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
                    <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 8, 15]} fov={60} />
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 20, 10]} castShadow />
                    <RatioVisualization a={a} b={b} />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-orange-200 text-sm mt-4 text-center">
                  💡 橙色球代表橙汁，黄色球代表苹果汁！
                </p>
              </div>

              {/* 任务卡片 */}
              <TaskCard
                title="调配任务"
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

                {/* 橙汁份数 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    🍊 橙汁份数: {a}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="1"
                    value={a}
                    onChange={(e) => setA(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>1份</span>
                    <span>8份</span>
                  </div>
                </div>

                {/* 苹果汁份数 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    🍎 苹果汁份数: {b}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="1"
                    value={b}
                    onChange={(e) => setB(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>1份</span>
                    <span>8份</span>
                  </div>
                </div>

                {/* 比例的意义 */}
                <div className="p-4 bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-2 border-orange-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-orange-400 mb-3 flex items-center gap-2">
                    📖 比例是什么？
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <p className="text-orange-300">
                      比例就是<span className="font-bold">两个数的对比关系</span>！
                    </p>
                    <p className="text-white text-base leading-relaxed">
                      当前配方：{a}份橙汁 : {b}份苹果汁
                    </p>
                    <p className="text-lg text-center py-2 bg-slate-800/50 rounded-lg">
                      <span className="text-yellow-400 font-bold">化简后</span> = {' '}
                      <span className="text-yellow-400 font-bold">{simplifiedA} : {simplifiedB}</span>
                    </p>
                    <p className="text-xs text-amber-300 mt-2">
                      💡 比例可以化简，就像分数一样！
                    </p>
                  </div>
                </div>

                {/* 小技巧 */}
                <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-yellow-400 mb-2 flex items-center gap-2">
                    💡 配比小秘密
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span>
                        <span className="text-white font-bold">1:1</span> = 两样东西一样多
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span>
                        <span className="text-white font-bold">2:1</span> = 第一样是第二样的2倍
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span>
                        <span className="text-white font-bold">比例可以化简</span>：4:2 = 2:1
                      </span>
                    </li>
                  </ul>
                </div>

                {/* 常见比例 */}
                <div className="p-4 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/30 rounded-lg">
                  <h3 className="font-bold text-red-400 mb-3 flex items-center gap-2">
                    ⭐ 快速配方
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { a: 1, b: 1 }, { a: 2, b: 1 }, { a: 3, b: 1 },
                      { a: 1, b: 2 }, { a: 3, b: 2 }, { a: 4, b: 3 },
                    ].map((ratio) => (
                      <button
                        key={`${ratio.a}-${ratio.b}`}
                        onClick={() => {
                          setA(ratio.a);
                          setB(ratio.b);
                        }}
                        className="p-2 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors border border-slate-700/50"
                      >
                        <div className="text-sm text-white">{ratio.a}:{ratio.b}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="配比挑战赛"
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
            <p className="text-2xl text-white mb-2">你成为配比大师了！</p>
            <p className="text-xl text-orange-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-amber-300 mb-6">你会调制最美味的果汁！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
