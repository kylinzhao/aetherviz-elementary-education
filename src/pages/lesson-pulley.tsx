import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';
import * as THREE from 'three';

// 滑轮3D模型
function Pulley3D({
  pulleyType,
  showLoad,
  liftDistance,
}: {
  pulleyType: 'fixed' | 'movable' | 'compound';
  showLoad: boolean;
  liftDistance: number;
}) {
  const wheelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (wheelRef.current && showLoad) {
      wheelRef.current.rotation.z += 0.02;
    }
  });

  return (
    <group>
      {/* 顶部支架 */}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[4, 0.2, 0.5]} />
        <meshStandardMaterial color="#6B7280" />
      </mesh>

      {/* 定滑轮或滑轮组 */}
      {pulleyType === 'fixed' && (
        <>
          {/* 定滑轮轴 */}
          <mesh position={[0, 2.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.8]} />
            <meshStandardMaterial color="#4B5563" />
          </mesh>

          {/* 定滑轮 */}
          <group ref={wheelRef}>
            <mesh position={[0, 2.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.6, 0.15, 16, 32]} />
              <meshStandardMaterial color="#F59E0B" />
            </mesh>
          </group>

          {/* 绳子 */}
          <mesh position={[0.6, 1.5, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 2]} />
            <meshStandardMaterial color="#9CA3AF" />
          </mesh>

          {/* 重物 */}
          {showLoad && (
            <mesh position={[0.6, 0.5 - liftDistance * 0.5, 0]}>
              <boxGeometry args={[0.8, 0.8, 0.8]} />
              <meshStandardMaterial color="#EF4444" />
            </mesh>
          )}
        </>
      )}

      {pulleyType === 'movable' && (
        <>
          {/* 定滑轮轴 */}
          <mesh position={[0, 2.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.8]} />
            <meshStandardMaterial color="#4B5563" />
          </mesh>

          {/* 定滑轮 */}
          <mesh position={[0, 2.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.6, 0.15, 16, 32]} />
            <meshStandardMaterial color="#F59E0B" />
          </mesh>

          {/* 动滑轮组 */}
          <group position={[0, 1.5 - liftDistance * 0.5, 0]}>
            {/* 动滑轮轴 */}
            <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.8]} />
              <meshStandardMaterial color="#4B5563" />
            </mesh>

            {/* 动滑轮 */}
            <group ref={wheelRef}>
              <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.6, 0.15, 16, 32]} />
                <meshStandardMaterial color="#F59E0B" />
              </mesh>
            </group>

            {/* 重物 */}
            {showLoad && (
              <mesh position={[0, -0.6, 0]}>
                <boxGeometry args={[0.8, 0.8, 0.8]} />
                <meshStandardMaterial color="#EF4444" />
              </mesh>
            )}
          </group>

          {/* 绳子 */}
          <mesh position={[0.6, 2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 1]} />
            <meshStandardMaterial color="#9CA3AF" />
          </mesh>
        </>
      )}

      {pulleyType === 'compound' && (
        <>
          {/* 顶部两个定滑轮 */}
          {[-0.8, 0.8].map((x) => (
            <React.Fragment key={`fixed-${x}`}>
              <mesh position={[x, 2.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 0.8]} />
                <meshStandardMaterial color="#4B5563" />
              </mesh>
              <mesh position={[x, 2.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.5, 0.12, 16, 32]} />
                <meshStandardMaterial color="#F59E0B" />
              </mesh>
            </React.Fragment>
          ))}

          {/* 底部两个动滑轮 */}
          <group position={[0, 1.2 - liftDistance * 0.5, 0]}>
            {[-0.8, 0.8].map((x) => (
              <React.Fragment key={`movable-${x}`}>
                <mesh position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.1, 0.1, 0.8]} />
                  <meshStandardMaterial color="#4B5563" />
                </mesh>
                <mesh position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.5, 0.12, 16, 32]} />
                  <meshStandardMaterial color="#F59E0B" />
                </mesh>
              </React.Fragment>
            ))}

            {/* 重物 */}
            {showLoad && (
              <mesh position={[0, -0.6, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#EF4444" />
              </mesh>
            )}
          </group>

          {/* 绳子 */}
          <mesh position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 2]} />
            <meshStandardMaterial color="#9CA3AF" />
          </mesh>
        </>
      )}
    </group>
  );
}

export default function LessonPulley() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [pulleyType, setPulleyType] = useState<'fixed' | 'movable' | 'compound'>('fixed');
  const [showLoad, setShowLoad] = useState(false);
  const [liftDistance, setLiftDistance] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // 视角控制函数
  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 5, 10);
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
      title: '认识定滑轮',
      description: '选择定滑轮模式，观察其结构和工作原理',
      checkCondition: () => pulleyType === 'fixed',
      hint: '太棒了！定滑轮固定在支架上，改变力的方向但不省力！',
    },
    {
      id: 2,
      title: '认识动滑轮',
      description: '切换到动滑轮模式，观察它如何省力',
      checkCondition: () => pulleyType === 'movable',
      hint: '正确！动滑轮随重物移动，能省一半的力！',
    },
    {
      id: 3,
      title: '滑轮组',
      description: '尝试滑轮组模式，观察省力效果',
      checkCondition: () => pulleyType === 'compound',
      hint: '太好了！滑轮组结合了定滑轮和动滑轮的优点！',
    },
    {
      id: 4,
      title: '省力计算',
      description: '显示重物并尝试提升，观察省力效果',
      checkCondition: () => showLoad,
      hint: '完美！滑轮组能显著省力，让重物变轻！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '⚙️ 定滑轮的主要作用是什么？',
      options: ['省力', '改变力的方向', '加快速度', '增加摩擦'],
      correctAnswer: 1,
      hint: '提示: 定滑轮不省力',
      explanation: '正确！定滑轮改变力的方向，但不省力！',
    },
    {
      id: 2,
      question: '🎯 动滑轮能省多少力？',
      options: ['不省力', '省一半力', '省全部力', '省两倍力'],
      correctAnswer: 1,
      hint: '提示: 动滑轮把重物分担到两段绳子上',
      explanation: '太棒了！动滑轮省一半力，因为两段绳子分担重量！',
    },
    {
      id: 3,
      question: '💪 滑轮组的优点是什么？',
      options: ['只改变方向', '只省力', '既省力又改变方向', '不省力也不改变方向'],
      correctAnswer: 2,
      hint: '提示: 结合定滑轮和动滑轮',
      explanation: '对了！滑轮组结合了定滑轮和动滑轮的优点！',
    },
    {
      id: 4,
      question: '🏗️ 升旗杆使用的是哪种滑轮？',
      options: ['动滑轮', '滑轮组', '定滑轮', '没有滑轮'],
      correctAnswer: 2,
      hint: '提示: 滑轮固定在顶部',
      explanation: '正确！升旗杆使用定滑轮，改变力的方向让人方便升旗！',
    },
    {
      id: 5,
      question: '🔬 如果用3段绳子承重，能省多少力？',
      options: ['不省力', '省1/3力', '省2/3力', '省全部力'],
      correctAnswer: 2,
      hint: '提示: 每段绳子分担1/3重量',
      explanation: '太聪明了！3段绳子分担重量，所以省2/3的力！',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-yellow-900/20 to-gray-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">⚙️</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">滑轮的力量</h1>
              <p className="text-sm text-yellow-300">升旗仪式</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-gray-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">升旗仪式</h2>
                <p className="text-lg text-yellow-200 leading-relaxed">
                  每周一早晨，全校同学在<span className="text-2xl mx-1">🏫</span>操场集合参加升旗仪式！
                  升旗手轻轻拉绳子，<span className="text-2xl mx-1">🚩</span>国旗就缓缓升起来了！
                  <br />
                  <span className="text-yellow-300 font-bold">
                    为什么拉绳子就能让国旗升上去呢？让我们一起来探索滑轮的奥秘！
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
                    🎨 滑轮实验室
                  </h2>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-yellow-400">
                      {pulleyType === 'fixed' ? '⚙️' : pulleyType === 'movable' ? '🔄' : '🔧'}
                    </div>
                    <div className="text-sm text-yellow-300 mt-1">
                      {pulleyType === 'fixed' ? '定滑轮' : pulleyType === 'movable' ? '动滑轮' : '滑轮组'}
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
                    <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 5, 10]} fov={60} />
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 20, 10]} castShadow />
                    <Pulley3D
                      pulleyType={pulleyType}
                      showLoad={showLoad}
                      liftDistance={liftDistance}
                    />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-yellow-200 text-sm mt-4 text-center">
                  💡 选择不同滑轮类型，观察它们的工作原理！
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

                {/* 滑轮类型选择 */}
                <div className="space-y-3 mb-6">
                  <label className="block text-white font-bold text-lg mb-2">⚙️ 滑轮类型</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setPulleyType('fixed')}
                      className={`py-2 px-3 rounded-lg font-bold text-sm transition-all ${
                        pulleyType === 'fixed'
                          ? 'bg-gradient-to-r from-yellow-500 to-amber-500'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                    >
                      定滑轮
                    </button>
                    <button
                      onClick={() => setPulleyType('movable')}
                      className={`py-2 px-3 rounded-lg font-bold text-sm transition-all ${
                        pulleyType === 'movable'
                          ? 'bg-gradient-to-r from-yellow-500 to-amber-500'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                    >
                      动滑轮
                    </button>
                    <button
                      onClick={() => setPulleyType('compound')}
                      className={`py-2 px-3 rounded-lg font-bold text-sm transition-all ${
                        pulleyType === 'compound'
                          ? 'bg-gradient-to-r from-yellow-500 to-amber-500'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                    >
                      滑轮组
                    </button>
                  </div>
                </div>

                {/* 显示重物 */}
                <div className="mb-6">
                  <button
                    onClick={() => setShowLoad(!showLoad)}
                    className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
                      showLoad
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    {showLoad ? '📦 重物已显示' : '🎁 显示重物'}
                  </button>
                </div>

                {/* 提升距离 */}
                {showLoad && (
                  <div className="space-y-4 mb-6">
                    <label className="block text-white font-bold text-lg flex items-center gap-2">
                      📏 提升高度: {liftDistance}m
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.5"
                      value={liftDistance}
                      onChange={(e) => setLiftDistance(Number(e.target.value))}
                      className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                    />
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>低</span>
                      <span>中</span>
                      <span>高</span>
                    </div>
                  </div>
                )}

                {/* 知识点 */}
                <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-gray-500/10 border-2 border-yellow-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
                    📖 滑轮知识
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span>
                        <span className="text-white font-bold">定滑轮</span>
                        <br />
                        <span className="text-xs">固定不动，改变力的方向</span>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>
                        <span className="text-white font-bold">动滑轮</span>
                        <br />
                        <span className="text-xs">随重物移动，省一半力</span>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <span>
                        <span className="text-white font-bold">滑轮组</span>
                        <br />
                        <span className="text-xs">既省力又改变方向</span>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400">•</span>
                      <span>
                        <span className="text-white font-bold">省力计算</span>
                        <br />
                        <span className="text-xs">F = G / n (n为绳子段数)</span>
                      </span>
                    </li>
                  </ul>
                </div>

                {/* 有趣事实 */}
                <div className="p-4 bg-gradient-to-br from-gray-500/10 to-slate-500/10 border-2 border-gray-500/30 rounded-lg">
                  <h3 className="font-bold text-gray-400 mb-2 flex items-center gap-2">
                    ⭐ 有趣事实
                  </h3>
                  <p className="text-slate-200 text-sm">
                    古埃及人建造金字塔时可能使用了滑轮系统来搬运巨大的石块！🏗️
                  </p>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="滑轮知识挑战"
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
            <p className="text-2xl text-white mb-2">你掌握了滑轮的原理！</p>
            <p className="text-xl text-yellow-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-gray-200 mb-6">你真是个物理小天才！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-gray-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
