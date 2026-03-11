import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';

// 圆柱体可视化
function CylinderVisualization({ radius, height, showUnfold }: {
  radius: number;
  height: number;
  showUnfold: boolean;
}) {
  if (showUnfold) {
    // 展开图视图
    return (
      <group>
        {/* 侧面展开（长方形） */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[2 * Math.PI * radius, height]} />
          <meshStandardMaterial color="#8B5CF6" transparent opacity={0.8} side={2} />
        </mesh>

        {/* 顶面（圆形） */}
        <mesh position={[-Math.PI * radius - radius, height / 2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <circleGeometry args={[radius, 32]} />
          <meshStandardMaterial color="#A78BFA" side={2} />
        </mesh>

        {/* 底面（圆形） */}
        <mesh position={[-Math.PI * radius - radius, -height / 2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <circleGeometry args={[radius, 32]} />
          <meshStandardMaterial color="#7C3AED" side={2} />
        </mesh>

        {/* 尺寸标注 */}
        <mesh position={[0, height / 2 + 0.5, 0]}>
          <boxGeometry args={[2 * Math.PI * radius, 0.05, 0.05]} />
          <meshStandardMaterial color="#FBBF24" />
        </mesh>
        <mesh position={[-Math.PI * radius, 0, 0]}>
          <boxGeometry args={[0.05, height, 0.05]} />
          <meshStandardMaterial color="#FBBF24" />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      {/* 圆柱体主体 */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[radius, radius, height, 32]} />
        <meshStandardMaterial color="#8B5CF6" transparent opacity={0.8} />
      </mesh>

      {/* 顶面高亮 */}
      <mesh position={[0, height / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius, 32]} />
        <meshStandardMaterial color="#A78BFA" side={2} />
      </mesh>

      {/* 底面高亮 */}
      <mesh position={[0, -height / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius, 32]} />
        <meshStandardMaterial color="#7C3AED" side={2} />
      </mesh>

      {/* 侧面展开辅助线 */}
      <mesh position={[radius, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[height, 0.05, 0.05]} />
        <meshStandardMaterial color="#FBBF24" />
      </mesh>

      {/* 半径线 */}
      <mesh position={[radius / 2, -height / 2 - 0.2, 0]}>
        <boxGeometry args={[radius, 0.05, 0.05]} />
        <meshStandardMaterial color="#FBBF24" />
      </mesh>
    </group>
  );
}

export default function LessonCylinder() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [radius, setRadius] = useState(2);
  const [height, setHeight] = useState(4);
  const [showUnfold, setShowUnfold] = useState(false);
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const surfaceArea = 2 * Math.PI * radius * (radius + height);
  const volume = Math.PI * radius * radius * height;

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
      title: '观察圆柱',
      description: '旋转圆柱，从不同角度观察它是什么样子的',
      checkCondition: () => true,
      hint: '圆柱有上下两个圆形的底面，和一个弯曲的侧面！',
    },
    {
      id: 2,
      title: '展开侧面',
      description: '点击"展开图"按钮，看看圆柱侧面展开后是什么形状',
      checkCondition: () => showUnfold,
      hint: '太棒了！圆柱的侧面展开是一个长方形！',
    },
    {
      id: 3,
      title: '建造圆柱塔',
      description: '将半径调到3，高度调到6',
      checkCondition: () => radius === 3 && height === 6,
      hint: '完美！你建造了一座高大的圆柱塔！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '🥫 圆柱有几个底面？',
      options: ['1个', '2个', '3个', '4个'],
      correctAnswer: 1,
      hint: '提示: 上面和下面各有一个',
      explanation: '正确！圆柱有2个圆形的底面',
    },
    {
      id: 2,
      question: '🥫 圆柱的侧面展开是什么形状？',
      options: ['圆形', '三角形', '长方形', '梯形'],
      correctAnswer: 2,
      hint: '提示: 想象把圆柱的侧面剪开摊平',
      explanation: '太棒了！圆柱的侧面展开是长方形',
    },
    {
      id: 3,
      question: '🥫 圆柱的体积公式是什么？',
      options: ['πr²h', '2πrh', 'πr²', '2πr²'],
      correctAnswer: 0,
      hint: '提示: 底面积 × 高',
      explanation: '对！圆柱的体积 = πr²h（底面积×高）',
    },
    {
      id: 4,
      question: '🥫 一个半径2、高5的圆柱，体积是多少？（π≈3.14）',
      options: ['20π', '25π', '62.8', '31.4'],
      correctAnswer: 0,
      hint: '提示: π × 2² × 5 = ?',
      explanation: '正确！体积 = π × 4 × 5 = 20π',
    },
    {
      id: 5,
      question: '🥫 生活中哪些物体是圆柱形的？',
      options: ['只有罐头', '只有蜡烛', '罐头、蜡烛、柱子', '都不是'],
      correctAnswer: 2,
      hint: '提示: 想想身边有哪些圆柱形的物品',
      explanation: '聪明！罐头、蜡烛、柱子都是圆柱形的',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-900/20 to-purple-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">🥫</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">圆柱城堡</h1>
              <p className="text-sm text-indigo-300">学习圆柱体的奥秘</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">建造圆柱塔</h2>
                <p className="text-lg text-indigo-200 leading-relaxed">
                  小红要建造一座神奇的<span className="text-2xl mx-1">🏰</span>圆柱城堡！
                  圆柱是一种很有趣的<span className="text-2xl mx-1">✨</span>立体图形，
                  它的底面是<span className="text-2xl mx-1">⭕</span>圆形的，
                  侧面可以展开成一个<span className="text-2xl mx-1">📐</span>长方形！
                  <br />
                  <span className="text-purple-300 font-bold">
                    让我们一起来探索圆柱的秘密吧！
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
                    🎨 3D圆柱
                  </h2>
                  <button
                    onClick={() => setShowUnfold(!showUnfold)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      showUnfold
                        ? 'bg-purple-500 text-white'
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
                    <CylinderVisualization
                      radius={radius}
                      height={height}
                      showUnfold={showUnfold}
                    />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-indigo-200 text-sm mt-4 text-center">
                  💡 拖动鼠标旋转圆柱，点击"展开图"看看侧面展开的样子！
                </p>
              </div>

              {/* 任务卡片 */}
              <TaskCard
                title="建造任务"
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
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
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
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>2</span>
                    <span>8</span>
                  </div>
                </div>

                {/* 圆柱的要素 */}
                <div className="p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-2 border-indigo-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-indigo-400 mb-3 flex items-center gap-2">
                    📐 圆柱的要素
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="bg-slate-800/50 p-2 rounded">
                      <span className="text-purple-300 font-bold">⭕ 底面：</span>
                      <span className="text-white">2个圆形</span>
                    </div>
                    <div className="bg-slate-800/50 p-2 rounded">
                      <span className="text-indigo-300 font-bold">📜 侧面：</span>
                      <span className="text-white">1个曲面</span>
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
                      <div className="text-white text-sm">V = πr²h</div>
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
                        侧面展开的长方形<span className="text-white font-bold">长 = 底面周长</span>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      <span>
                        侧面展开的长方形<span className="text-white font-bold">宽 = 圆柱的高</span>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      <span>
                        体积 = <span className="text-white font-bold">底面积 × 高</span>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="圆柱挑战"
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
            <h2 className="text-4xl font-bold text-purple-400 mb-4">太棒了！</h2>
            <p className="text-2xl text-white mb-2">你完成了所有挑战！</p>
            <p className="text-xl text-indigo-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-green-300 mb-6">你真是个圆柱小专家！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
