import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';

// 圆形游乐场可视化
function CircleVisualization({ radius }: { radius: number }) {
  return (
    <group>
      {/* 圆的主体 - 橙色主题 */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius, 64]} />
        <meshStandardMaterial color="#F97316" side={2} transparent opacity={0.8} />
      </mesh>

      {/* 半径线 - 黄色 */}
      <mesh position={[radius / 2, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[radius, 0.1, 0.1]} />
        <meshStandardMaterial color="#FBBF24" />
      </mesh>

      {/* 半径箭头 - 黄色 */}
      <mesh position={[radius, 0, 0]}>
        <coneGeometry args={[0.15, 0.3, 8]} />
        <meshStandardMaterial color="#FBBF24" />
      </mesh>

      {/* 中心点 - 红色 */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#EF4444" />
      </mesh>

      {/* 直径线 - 绿色 */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[radius * 2, 0.08, 0.08]} />
        <meshStandardMaterial color="#10B981" />
      </mesh>
    </group>
  );
}

export default function LessonCircle() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [radius, setRadius] = useState(1);
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const diameter = radius * 2;
  const circumference = 2 * Math.PI * radius;
  const area = Math.PI * radius * radius;

  // 视角控制函数
  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 8, 0.001);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const topView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 10, 0.001);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const frontView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 2, 10);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const sideView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(10, 2, 0);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const isoView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(6, 6, 6);
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
      title: '找到圆心（红色小点）',
      description: '在3D场景中找到圆的中心红点，那就是圆心！',
      checkCondition: () => radius > 0,
      hint: '太棒了！红色小点就是圆心，它是圆的"家"！',
    },
    {
      id: 2,
      title: '把半径调成2米',
      description: '拖动"📏 半径大小"滑块到2',
      checkCondition: () => radius === 2,
      hint: '完美！半径是2米，从圆心到边缘的距离！',
    },
    {
      id: 3,
      title: '观察直径的变化',
      description: '当半径是2时，直径是多少？看看绿色线！',
      checkCondition: () => radius === 2,
      hint: '对啦！直径是4米，正好是半径的2倍！',
    },
    {
      id: 4,
      title: '试试最大的圆！半径5米',
      description: '拖动滑块到最大值5，看看圆形有多大！',
      checkCondition: () => radius === 5,
      hint: '哇！这是一个超级大的圆形游乐场！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '⭕ 圆的"圆心"是什么？',
      options: ['圆的边缘', '圆的中心点', '圆的半径', '圆的直径'],
      correctAnswer: 1,
      hint: '提示: 圆心就是圆最中间的那个红点！',
      explanation: '正确！圆心是圆的中心点，所有点到圆心的距离都相等！',
    },
    {
      id: 2,
      question: '⭕ 如果半径是3米，直径是多少米？',
      options: ['3米', '6米', '9米', '12米'],
      correctAnswer: 1,
      hint: '提示: 直径 = 半径 × 2',
      explanation: '太聪明了！直径是半径的2倍，3 × 2 = 6米！',
    },
    {
      id: 3,
      question: '⭕ 半径和直径有什么关系？',
      options: ['直径 = 半径', '直径 = 半径 × 2', '半径 = 直径 × 2', '没关系'],
      correctAnswer: 1,
      hint: '提示: 直径比半径长一倍！',
      explanation: '对！直径永远等于半径的2倍！',
    },
    {
      id: 4,
      question: '⭕ 哪个是圆的半径？',
      options: ['从圆上任意一点到圆心的距离', '通过圆心的最长的线', '圆的边缘', '圆的面积'],
      correctAnswer: 0,
      hint: '提示: 半径是黄色的线，从中心连到边缘！',
      explanation: '正确！半径是从圆心到圆上任意一点的距离！',
    },
    {
      id: 5,
      question: '⭕ 如果直径是10米，半径是多少米？',
      options: ['2米', '5米', '10米', '20米'],
      correctAnswer: 1,
      hint: '提示: 半径 = 直径 ÷ 2',
      explanation: '太棒了！10 ÷ 2 = 5，半径是5米！',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-orange-900/20 to-amber-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">⭕</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">圆形游乐场</h1>
              <p className="text-sm text-orange-300">认识圆的奥秘</p>
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
                <h2 className="text-2xl font-bold text-white mb-2">设计圆形花园</h2>
                <p className="text-lg text-orange-200 leading-relaxed">
                  小设计师<span className="text-2xl mx-1">👨‍🎨</span>要建一个美丽的<span className="text-2xl mx-1">⭕</span>圆形花园！
                  首先，我们要确定花园的<span className="text-2xl mx-1">📍</span>中心（圆心），
                  然后测量从中心到边缘的<span className="text-2xl mx-1">📏</span>距离（半径）。
                  <br />
                  <span className="text-yellow-300 font-bold">
                    让我们一起探索圆的秘密吧！
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
                    🎨 圆形花园设计图
                  </h2>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400">
                      半径 {radius} 米
                    </div>
                    <div className="text-sm text-amber-300 mt-1">
                      直径 {diameter} 米
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
                    <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 8, 0.001]} fov={60} />
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 20, 10]} castShadow />
                    <CircleVisualization radius={radius} />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-amber-200 text-sm mt-4 text-center">
                  💡 拖动鼠标旋转视角 | 黄色线是半径，绿色线是直径，红点是圆心！
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

                {/* 半径控制 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    📏 半径大小: {radius} 米
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>1米</span>
                    <span>5米</span>
                  </div>
                </div>

                {/* 圆的要素 */}
                <div className="p-4 bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-2 border-orange-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-orange-400 mb-3 flex items-center gap-2">
                    📐 圆的三要素
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-red-400 font-bold">🔴 圆心:</span>
                      <span className="text-white">圆的中心点</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-400 font-bold">📏 半径:</span>
                      <span className="text-white">{radius.toFixed(1)} 米</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-400 font-bold">📐 直径:</span>
                      <span className="text-white">{diameter.toFixed(1)} 米</span>
                    </div>
                  </div>
                </div>

                {/* 小知识 */}
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                    💡 小知识
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      <span>
                        <span className="text-white font-bold">圆心</span>是圆的"家"，在正中间
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      <span>
                        <span className="text-white font-bold">半径</span>是从圆心到边缘的线
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      <span>
                        <span className="text-white font-bold">直径</span>是通过圆心的最长线
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      <span>
                        <span className="text-white font-bold">秘密:</span>直径 = 半径 × 2
                      </span>
                    </li>
                  </ul>
                </div>

                {/* 更多数据 */}
                <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30 rounded-lg">
                  <h3 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
                    📊 更多数据
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-pink-400">周长:</span>
                      <span className="text-white">{circumference.toFixed(2)} 米</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-400">面积:</span>
                      <span className="text-white">{area.toFixed(2)} 平方米</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="圆形挑战赛"
                questions={quizQuestions}
                onComplete={(score, total) => {
                  setQuizScore(score);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 完成庆祝（所有任务和测验都完成后显示） */}
      {tasksCompleted && quizScore !== null && quizScore >= 4 && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="glass-panel rounded-3xl p-8 max-w-lg w-full text-center animate-bounce">
            <div className="text-8xl mb-4">🏆</div>
            <h2 className="text-4xl font-bold text-yellow-400 mb-4">太棒了！</h2>
            <p className="text-2xl text-white mb-2">你完成了所有挑战！</p>
            <p className="text-xl text-amber-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-green-300 mb-6">你真是个圆形小专家！</p>
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
