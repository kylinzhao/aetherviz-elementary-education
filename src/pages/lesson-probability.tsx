import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';

// 概率可视化（幸运大转盘）
interface ProbabilityVisualizationProps {
  redSize: number;
  blueSize: number;
  greenSize: number;
  yellowSize: number;
}

function ProbabilityVisualization({ redSize, blueSize, greenSize, yellowSize }: ProbabilityVisualizationProps) {
  const total = redSize + blueSize + greenSize + yellowSize;
  const redAngle = (redSize / total) * Math.PI * 2;
  const blueAngle = (blueSize / total) * Math.PI * 2;
  const greenAngle = (greenSize / total) * Math.PI * 2;
  const yellowAngle = (yellowSize / total) * Math.PI * 2;

  let currentAngle = 0;

  return (
    <group>
      {/* 转盘背景 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[3, 3, 0.3, 32]} />
        <meshStandardMaterial color="#1E293B" />
      </mesh>

      {/* 红色区域 */}
      <mesh rotation={[Math.PI / 2, 0, currentAngle]} position={[0, 0.16, 0]}>
        <cylinderGeometry args={[3, 3, 0.1, 32, 1, false, 0, redAngle]} />
        <meshStandardMaterial color="#EF4444" />
      </mesh>
      {currentAngle += redAngle}

      {/* 蓝色区域 */}
      <mesh rotation={[Math.PI / 2, 0, currentAngle]} position={[0, 0.16, 0]}>
        <cylinderGeometry args={[3, 3, 0.1, 32, 1, false, 0, blueAngle]} />
        <meshStandardMaterial color="#3B82F6" />
      </mesh>
      {currentAngle += blueAngle}

      {/* 绿色区域 */}
      <mesh rotation={[Math.PI / 2, 0, currentAngle]} position={[0, 0.16, 0]}>
        <cylinderGeometry args={[3, 3, 0.1, 32, 1, false, 0, greenAngle]} />
        <meshStandardMaterial color="#10B981" />
      </mesh>
      {currentAngle += greenAngle}

      {/* 黄色区域 */}
      <mesh rotation={[Math.PI / 2, 0, currentAngle]} position={[0, 0.16, 0]}>
        <cylinderGeometry args={[3, 3, 0.1, 32, 1, false, 0, yellowAngle]} />
        <meshStandardMaterial color="#FBBF24" />
      </mesh>

      {/* 指针 */}
      <mesh position={[0, 1, 2.5]}>
        <coneGeometry args={[0.2, 0.8, 8]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* 中心点 */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* 底座 */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.5, 1, 0.4, 16]} />
        <meshStandardMaterial color="#4B5563" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}

export default function LessonProbability() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [redSize, setRedSize] = useState(1);
  const [blueSize, setBlueSize] = useState(1);
  const [greenSize, setGreenSize] = useState(1);
  const [yellowSize, setYellowSize] = useState(1);
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

  const total = redSize + blueSize + greenSize + yellowSize;

  // 定义引导任务
  const tasks: Task[] = [
    {
      id: 1,
      title: '认识可能',
      description: '让每种颜色都出现1次（所有都是1）',
      checkCondition: () => redSize === 1 && blueSize === 1 && greenSize === 1 && yellowSize === 1,
      hint: '太棒了！每种颜色出现的可能性都相同！',
    },
    {
      id: 2,
      title: '一定发生',
      description: '让红色占满整个转盘（红色=4，其他=0）',
      checkCondition: () => redSize === 4 && blueSize === 0 && greenSize === 0 && yellowSize === 0,
      hint: '完美！红色一定会出现！',
    },
    {
      id: 3,
      title: '不可能',
      description: '让蓝色不可能出现（蓝色=0）',
      checkCondition: () => blueSize === 0 && redSize > 0,
      hint: '对了！蓝色不可能出现！',
    },
    {
      id: 4,
      title: '比较大小',
      description: '让红色比蓝色大（红色=3，蓝色=1）',
      checkCondition: () => redSize === 3 && blueSize === 1 && greenSize === 0 && yellowSize === 0,
      hint: '太聪明了！红色出现的机会比蓝色大！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '🎲 转盘有4块红色，其他颜色都没有，转到红色的可能性是？',
      options: ['可能', '一定', '不可能', '不知道'],
      correctAnswer: 1,
      hint: '提示: 整个转盘都是红色',
      explanation: '正确！当整个转盘都是红色时，一定会转到红色！',
    },
    {
      id: 2,
      question: '🎲 转盘有2块红色和2块蓝色，转到哪个颜色的可能性大？',
      options: ['红色大', '蓝色大', '一样大', '无法判断'],
      correctAnswer: 2,
      hint: '提示: 它们占的面积相同',
      explanation: '太棒了！红色和蓝色各占一半，可能性一样大！',
    },
    {
      id: 3,
      question: '🎲 转盘没有绿色，转到绿色的可能性是？',
      options: ['可能', '一定', '不可能', '很小'],
      correctAnswer: 2,
      hint: '提示: 转盘上根本没有绿色',
      explanation: '对了！没有绿色的区域，所以不可能转到绿色！',
    },
    {
      id: 4,
      question: '🎲 转盘有3块红色和1块蓝色，转到哪个颜色的可能性大？',
      options: ['红色大', '蓝色大', '一样大', '无法判断'],
      correctAnswer: 0,
      hint: '提示: 红色占的地方更大',
      explanation: '正确！红色占3/4，蓝色占1/4，红色可能性更大！',
    },
    {
      id: 5,
      question: '🎲 哪个事件的可能性最大？',
      options: ['1/2', '1/4', '1/10', '0'],
      correctAnswer: 0,
      hint: '提示: 分数越大，可能性越大',
      explanation: '太聪明了！1/2最大，表示50%的可能性！',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/20 to-amber-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">🎲</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">幸运大转盘</h1>
              <p className="text-sm text-purple-300">探索可能性的奥秘</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-amber-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">游乐园大抽奖</h2>
                <p className="text-lg text-purple-200 leading-relaxed">
                  欢迎来到<span className="text-2xl mx-1">🎡</span>游乐园！
                  今天我们玩<span className="text-2xl mx-1">🎲</span>幸运大转盘游戏！
                  <br />
                  <span className="text-yellow-300 font-bold">
                    可能性告诉我们事情发生的几率有多大！
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
                    🎨 幸运转盘
                  </h2>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400">
                      总共 {total} 块
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
                    <ProbabilityVisualization
                      redSize={redSize}
                      blueSize={blueSize}
                      greenSize={greenSize}
                      yellowSize={yellowSize}
                    />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-purple-200 text-sm mt-4 text-center">
                  💡 拖动滑块改变每种颜色的大小！
                </p>
              </div>

              {/* 任务卡片 */}
              <TaskCard
                title="抽奖任务"
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

                {/* 红色区域 */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <label className="text-white font-bold flex items-center gap-2">
                      🔴 红色: {redSize}
                    </label>
                    <span className="text-red-400 text-sm">
                      {total > 0 ? Math.round((redSize / total) * 100) : 0}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="1"
                    value={redSize}
                    onChange={(e) => setRedSize(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                </div>

                {/* 蓝色区域 */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <label className="text-white font-bold flex items-center gap-2">
                      🔵 蓝色: {blueSize}
                    </label>
                    <span className="text-blue-400 text-sm">
                      {total > 0 ? Math.round((blueSize / total) * 100) : 0}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="1"
                    value={blueSize}
                    onChange={(e) => setBlueSize(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                {/* 绿色区域 */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <label className="text-white font-bold flex items-center gap-2">
                      🟢 绿色: {greenSize}
                    </label>
                    <span className="text-green-400 text-sm">
                      {total > 0 ? Math.round((greenSize / total) * 100) : 0}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="1"
                    value={greenSize}
                    onChange={(e) => setGreenSize(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                </div>

                {/* 黄色区域 */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <label className="text-white font-bold flex items-center gap-2">
                      🟡 黄色: {yellowSize}
                    </label>
                    <span className="text-yellow-400 text-sm">
                      {total > 0 ? Math.round((yellowSize / total) * 100) : 0}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="1"
                    value={yellowSize}
                    onChange={(e) => setYellowSize(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  />
                </div>

                {/* 可能性的意义 */}
                <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-purple-400 mb-3 flex items-center gap-2">
                    📖 可能性是什么？
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <p className="text-purple-300">
                      可能性告诉我们<span className="font-bold">事情发生的几率</span>！
                    </p>
                    <ul className="space-y-1 text-xs">
                      <li className="text-white">• <span className="text-yellow-400 font-bold">一定</span> = 肯定会发生（100%）</li>
                      <li className="text-white">• <span className="text-green-400 font-bold">可能</span> = 有机会发生</li>
                      <li className="text-white">• <span className="text-red-400 font-bold">不可能</span> = 不会发生（0%）</li>
                    </ul>
                  </div>
                </div>

                {/* 小技巧 */}
                <div className="p-4 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-2 border-amber-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-amber-400 mb-2 flex items-center gap-2">
                    💡 可能性小秘密
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <span>
                        <span className="text-white font-bold">占的地方越大</span>，转到可能性越大
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <span>
                        <span className="text-white font-bold">面积相同</span>，可能性一样大
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <span>
                        <span className="text-white font-bold">没有这个颜色</span>，不可能转到
                      </span>
                    </li>
                  </ul>
                </div>

                {/* 快速设置 */}
                <div className="p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-2 border-indigo-500/30 rounded-lg">
                  <h3 className="font-bold text-indigo-400 mb-3 flex items-center gap-2">
                    ⭐ 快速设置
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => { setRedSize(1); setBlueSize(1); setGreenSize(1); setYellowSize(1); }}
                      className="w-full p-2 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors text-sm text-white border border-slate-700/50"
                    >
                      🎲 平均分配 (1:1:1:1)
                    </button>
                    <button
                      onClick={() => { setRedSize(3); setBlueSize(1); setGreenSize(0); setYellowSize(0); }}
                      className="w-full p-2 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors text-sm text-white border border-slate-700/50"
                    >
                      🔴 红色优势 (3:1)
                    </button>
                    <button
                      onClick={() => { setRedSize(4); setBlueSize(0); setGreenSize(0); setYellowSize(0); }}
                      className="w-full p-2 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors text-sm text-white border border-slate-700/50"
                    >
                      🔴 一定红色 (100%)
                    </button>
                  </div>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="抽奖挑战赛"
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
            <p className="text-2xl text-white mb-2">你成为概率大师了！</p>
            <p className="text-xl text-purple-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-amber-300 mb-6">你真懂可能性的奥秘！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-amber-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
