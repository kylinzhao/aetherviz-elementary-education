import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';

// 圆锥体可视化
function ConeVisualization({ radius, height, showUnfold }: {
  radius: number;
  height: number;
  showUnfold: boolean;
}) {
  if (showUnfold) {
    // 展开图视图
    const slantHeight = Math.sqrt(radius * radius + height * height);
    const sectorAngle = (radius / slantHeight) * 2 * Math.PI;

    return (
      <group>
        {/* 侧面展开（扇形） */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, -sectorAngle / 2]}>
          <ringGeometry args={[0, slantHeight, 32, 1, 0, sectorAngle]} />
          <meshStandardMaterial color="#F472B6" transparent opacity={0.8} side={2} />
        </mesh>

        {/* 底面（圆形） */}
        <mesh position={[slantHeight + radius, 0, 0]}>
          <circleGeometry args={[radius, 32]} />
          <meshStandardMaterial color="#EC4899" side={2} />
        </mesh>

        {/* 半径标注 */}
        <mesh position={[slantHeight + radius / 2, 0, 0]}>
          <boxGeometry args={[radius, 0.05, 0.05]} />
          <meshStandardMaterial color="#FBBF24" />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      {/* 圆锥体主体 */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[radius, height, 32]} />
        <meshStandardMaterial color="#EC4899" transparent opacity={0.8} />
      </mesh>

      {/* 底面高亮 */}
      <mesh position={[0, -height / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius, 32]} />
        <meshStandardMaterial color="#F472B6" side={2} />
      </mesh>

      {/* 高线 */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.05, height, 0.05]} />
        <meshStandardMaterial color="#FBBF24" />
      </mesh>

      {/* 顶点 */}
      <mesh position={[0, height / 2, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#FB923C" emissive="#FB923C" emissiveIntensity={0.5} />
      </mesh>

      {/* 半径线 */}
      <mesh position={[radius / 2, -height / 2 - 0.2, 0]}>
        <boxGeometry args={[radius, 0.05, 0.05]} />
        <meshStandardMaterial color="#FBBF24" />
      </mesh>

      {/* 母线 */}
      <mesh position={[radius / 2, 0, 0]} rotation={[0, 0, Math.atan2(height, radius)]}>
        <boxGeometry args={[Math.sqrt(radius * radius + height * height), 0.05, 0.05]} />
        <meshStandardMaterial color="#F97316" />
      </mesh>
    </group>
  );
}

export default function LessonCone() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [radius, setRadius] = useState(2);
  const [height, setHeight] = useState(4);
  const [showUnfold, setShowUnfold] = useState(false);
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const volume = (1 / 3) * Math.PI * radius * radius * height;
  const slantHeight = Math.sqrt(radius * radius + height * height);

  // 视角控制函数
  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(8, 6, 10);
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
      cameraRef.current.position.set(0, 0, 15);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const sideView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(15, 0, 0);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const isoView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(10, 10, 10);
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
      title: '观察圆锥',
      description: '旋转圆锥，从不同角度观察它的形状',
      checkCondition: () => true,
      hint: '圆锥有一个尖尖的顶点和一个圆形的底面！',
    },
    {
      id: 2,
      title: '展开侧面',
      description: '点击"展开图"按钮，看看圆锥侧面展开后是什么形状',
      checkCondition: () => showUnfold,
      hint: '太棒了！圆锥的侧面展开是一个扇形！',
    },
    {
      id: 3,
      title: '制作大冰淇淋',
      description: '将半径调到3，高度调到6',
      checkCondition: () => radius === 3 && height === 6,
      hint: '完美！你做了一个超级大的冰淇淋！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '🔺 圆锥有几个顶点？',
      options: ['0个', '1个', '2个', '3个'],
      correctAnswer: 1,
      hint: '提示: 圆锥的尖端就是顶点',
      explanation: '正确！圆锥有1个顶点（尖尖的顶部）',
    },
    {
      id: 2,
      question: '🔺 圆锥的侧面展开是什么形状？',
      options: ['圆形', '扇形', '长方形', '三角形'],
      correctAnswer: 1,
      hint: '提示: 像把雨伞撑开的样子',
      explanation: '太棒了！圆锥的侧面展开是扇形',
    },
    {
      id: 3,
      question: '🔺 圆锥的体积公式是什么？',
      options: ['πr²h', '(1/3)πr²h', '2πrh', '(1/2)πr²'],
      correctAnswer: 1,
      hint: '提示: 是同底等高圆柱体积的三分之一',
      explanation: '对！圆锥的体积 = (1/3)πr²h',
    },
    {
      id: 4,
      question: '🔺 一个半径3、高6的圆锥，体积是多少？（π≈3.14）',
      options: ['18π', '36π', '54π', '9π'],
      correctAnswer: 0,
      hint: '提示: (1/3) × π × 3² × 6 = ?',
      explanation: '正确！体积 = (1/3) × π × 9 × 6 = 18π',
    },
    {
      id: 5,
      question: '🔺 生活中哪些物体是圆锥形的？',
      options: ['只有冰淇淋', '只有帐篷', '冰淇淋、帐篷、漏斗', '都不是'],
      correctAnswer: 2,
      hint: '提示: 想想身边有哪些圆锥形的物品',
      explanation: '聪明！冰淇淋、帐篷、漏斗都是圆锥形的',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-pink-900/20 to-orange-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">🔺</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">冰淇淋塔</h1>
              <p className="text-sm text-pink-300">学习圆锥体的知识</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">美味的冰淇淋</h2>
                <p className="text-lg text-pink-200 leading-relaxed">
                  小华最喜欢吃<span className="text-2xl mx-1">🍦</span>冰淇淋了！
                  冰淇淋蛋筒就是一个<span className="text-2xl mx-1">🔺</span>圆锥体。
                  圆锥有一个<span className="text-2xl mx-1">📍</span>尖尖的顶点，
                  底面是<span className="text-2xl mx-1">⭕</span>圆形的！
                  <br />
                  <span className="text-orange-300 font-bold">
                    让我们一起来认识圆锥这个有趣的形状吧！
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
                    🎨 3D圆锥
                  </h2>
                  <button
                    onClick={() => setShowUnfold(!showUnfold)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      showUnfold
                        ? 'bg-pink-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {showUnfold ? '返回立体' : '展开图'}
                  </button>
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
                    <PerspectiveCamera makeDefault ref={cameraRef} position={[8, 6, 10]} fov={60} />
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 20, 10]} castShadow />
                    <ConeVisualization
                      radius={radius}
                      height={height}
                      showUnfold={showUnfold}
                    />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-pink-200 text-sm mt-4 text-center">
                  💡 拖动鼠标旋转圆锥，点击"展开图"看看侧面展开的样子！
                </p>
              </div>

              {/* 任务卡片 */}
              <TaskCard
                title="探索任务"
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

                {/* 半径 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    📏 半径: {radius}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    step="0.5"
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>1</span>
                    <span>4</span>
                  </div>
                </div>

                {/* 高 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    📐 高: {height}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    step="1"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>2</span>
                    <span>8</span>
                  </div>
                </div>

                {/* 圆锥的要素 */}
                <div className="p-4 bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-2 border-pink-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-pink-400 mb-3 flex items-center gap-2">
                    🔺 圆锥的要素
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="bg-slate-800/50 p-2 rounded">
                      <span className="text-pink-300 font-bold">📍 顶点：</span>
                      <span className="text-white">1个</span>
                    </div>
                    <div className="bg-slate-800/50 p-2 rounded">
                      <span className="text-rose-300 font-bold">⭕ 底面：</span>
                      <span className="text-white">1个圆形</span>
                    </div>
                    <div className="bg-slate-800/50 p-2 rounded">
                      <span className="text-orange-300 font-bold">📏 母线：</span>
                      <span className="text-white">{slantHeight.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* 计算结果 */}
                <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
                    🔢 计算结果
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="bg-slate-800/50 p-3 rounded">
                      <div className="text-blue-300 font-bold mb-1">体积公式</div>
                      <div className="text-white text-sm">V = (1/3)πr²h</div>
                      <div className="text-yellow-400 text-lg font-bold mt-2">
                        {volume.toFixed(2)} 立方单位
                      </div>
                    </div>
                  </div>
                </div>

                {/* 小知识 */}
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-lg">
                  <h3 className="font-bold text-green-400 mb-2 flex items-center gap-2">
                    💡 小秘密
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      <span>
                        圆锥体积是同底等高圆柱的<span className="text-white font-bold">1/3</span>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      <span>
                        侧面展开是<span className="text-white font-bold">扇形</span>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      <span>
                        母线长 = <span className="text-white font-bold">√(r² + h²)</span>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="冰淇淋挑战"
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
            <div className="text-8xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold text-orange-400 mb-4">太棒了！</h2>
            <p className="text-2xl text-white mb-2">你完成了所有挑战！</p>
            <p className="text-xl text-pink-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-green-300 mb-6">你真是个圆锥小达人！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
