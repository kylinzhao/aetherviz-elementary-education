import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';

// 平方数方阵可视化组件
function SquareVisualization({ squareSize, showGrid, animate }: {
  squareSize: number;
  showGrid: boolean;
  animate: boolean;
}) {
  const groupRef = React.useRef<THREE.Group>(null);

  useFrame((state) => {
    if (animate && groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  const colors = ['#a855f7', '#c084fc', '#e9d5ff', '#f3e8ff'];

  return (
    <group ref={groupRef}>
      {Array.from({ length: squareSize }).map((_, rowIndex) => (
        <group key={rowIndex} position={[0, rowIndex * 1.1 - (squareSize * 1.1) / 2, 0]}>
          {Array.from({ length: squareSize }).map((_, colIndex) => (
            <mesh
              key={`${rowIndex}-${colIndex}`}
              position={[colIndex * 1.1 - (squareSize * 1.1) / 2, 0, 0]}
            >
              <boxGeometry args={[1, 1, 0.3]} />
              <meshStandardMaterial
                color={colors[(rowIndex + colIndex) % colors.length]}
                emissive={colors[(rowIndex + colIndex) % colors.length]}
                emissiveIntensity={0.3}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* 显示网格线 */}
      {showGrid && squareSize > 0 && (
        <>
          {/* 水平线 */}
          {Array.from({ length: squareSize + 1 }).map((_, i) => (
            <mesh
              key={`h-${i}`}
              position={[0, i * 1.1 - (squareSize * 1.1) / 2 - 0.55, -0.2]}
            >
              <boxGeometry args={[squareSize * 1.1, 0.05, 0.05]} />
              <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
            </mesh>
          ))}
          {/* 垂直线 */}
          {Array.from({ length: squareSize + 1 }).map((_, i) => (
            <mesh
              key={`v-${i}`}
              position={[i * 1.1 - (squareSize * 1.1) / 2 - 0.55, 0, -0.2]}
            >
              <boxGeometry args={[0.05, squareSize * 1.1, 0.05]} />
              <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
}

export default function LessonSquareStats() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [squareSize, setSquareSize] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const totalSquares = squareSize * squareSize;

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
      title: '认识1×1方阵',
      description: '将方阵大小设置为1，看看最小的平方数',
      checkCondition: () => squareSize === 1,
      hint: '太棒了！1×1=1，这是最小的平方数！只有1个小方块！',
    },
    {
      id: 2,
      title: '探索2×2方阵',
      description: '将方阵大小设置为2，观察4个小方块组成的正方形',
      checkCondition: () => squareSize === 2,
      hint: '完美！2×2=4，你看到一个由4个小方块组成的正方形！',
    },
    {
      id: 3,
      title: '发现3×3方阵',
      description: '将方阵大小设置为3，数数看有多少个小方块',
      checkCondition: () => squareSize === 3,
      hint: '太聪明了！3×3=9，一共9个小方块！这就是3的平方！',
    },
    {
      id: 4,
      title: '显示网格线',
      description: '点击"显示网格线"按钮，更清楚地看到方阵结构',
      checkCondition: () => showGrid === true,
      hint: '哇！金色的网格线让方阵更清楚了！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '🟲 1×1等于多少？',
      options: ['0', '1', '2', '11'],
      correctAnswer: 1,
      hint: '提示: 1乘1还是1',
      explanation: '正确！1×1=1，这是最小的平方数！',
    },
    {
      id: 2,
      question: '🟲 2×2等于多少？',
      options: ['4', '22', '2', '8'],
      correctAnswer: 0,
      hint: '提示: 数数2×2的方阵里有几个小方块',
      explanation: '太棒了！2×2=4，方阵里有4个小方块！',
    },
    {
      id: 3,
      question: '🟲 3×3等于多少？',
      options: ['6', '9', '33', '12'],
      correctAnswer: 1,
      hint: '提示: 3×3的方阵里，每行3个，共3行',
      explanation: '对！3×3=9，一共9个小方块！',
    },
    {
      id: 4,
      question: '🟲 4×4等于多少？',
      options: ['16', '8', '44', '12'],
      correctAnswer: 0,
      hint: '提示: 4乘4，或者4个4相加',
      explanation: '太聪明了！4×4=16，这就是4的平方！',
    },
    {
      id: 5,
      question: '🟲 下面哪个是平方数？',
      options: ['6', '9', '10', '15'],
      correctAnswer: 1,
      hint: '提示: 平方数是某个数自己乘自己',
      explanation: '正确！9是平方数，因为3×3=9！',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/20 to-amber-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">🟲</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">完美平方数</h1>
              <p className="text-sm text-purple-300">探索数字方阵的秘密</p>
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
                <h2 className="text-2xl font-bold text-white mb-2">数字方阵的秘密</h2>
                <p className="text-lg text-purple-200 leading-relaxed">
                  小探险家<span className="text-2xl mx-1">🔍</span>发现了一个神奇的<span className="text-2xl mx-1">✨</span>秘密：
                  有些数字可以排成<span className="text-2xl mx-1">🟲</span>完美的正方形！
                  <br />
                  <span className="text-yellow-300 font-bold">
                    像兵棋一样整齐排列，这就是平方数！
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
                    🎨 平方数方阵展示
                  </h2>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-yellow-400">
                      {squareSize} × {squareSize} = {totalSquares}
                    </div>
                    <div className="text-sm text-purple-300 mt-1">
                      {squareSize}行{squareSize}列 = {totalSquares}个小方块
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
                    <PerspectiveCamera makeDefault ref={cameraRef} position={[8, 6, 10]} fov={60} />
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 20, 10]} castShadow />
                    <SquareVisualization squareSize={squareSize} showGrid={showGrid} animate={animate} />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-purple-200 text-sm mt-4 text-center">
                  💡 观察不同大小的方阵，每个都是完美的正方形！
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

                {/* 方阵大小选择 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    🟲 方阵大小: {squareSize}×{squareSize}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={squareSize}
                    onChange={(e) => setSquareSize(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>1×1</span>
                    <span>5×5</span>
                  </div>
                </div>

                {/* 快速选择按钮 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    ⚡ 快速选择
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSquareSize(size)}
                        className={`p-3 rounded-lg font-bold transition-all ${
                          squareSize === size
                            ? 'bg-purple-500 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {size}×{size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 网格线开关 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    📏 网格线
                  </label>
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`w-full p-3 rounded-lg font-bold transition-all ${
                      showGrid
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {showGrid ? '隐藏网格线' : '显示网格线'}
                  </button>
                </div>

                {/* 旋转动画 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    🔄 旋转动画
                  </label>
                  <button
                    onClick={() => setAnimate(!animate)}
                    className={`w-full p-3 rounded-lg font-bold transition-all ${
                      animate
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {animate ? '停止旋转' : '开始旋转'}
                  </button>
                </div>

                {/* 平方数的概念 */}
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                    📖 什么是平方数？
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <p className="text-green-300">
                      平方数是一个<span className="font-bold">数自己乘自己</span>！
                    </p>
                    <p className="text-white text-base leading-relaxed">
                      比如 {squareSize}×{squareSize} = {totalSquares}
                    </p>
                    <p className="text-white text-base leading-relaxed">
                      可以排成<span className="text-yellow-300 font-bold">{squareSize}行{squareSize}列</span>的方阵！
                    </p>
                  </div>
                </div>

                {/* 平方数列表 */}
                <div className="p-4 bg-gradient-to-br from-purple-500/10 to-amber-500/10 border-2 border-purple-500/30 rounded-lg">
                  <h3 className="font-bold text-purple-400 mb-2 flex items-center gap-2">
                    💡 常见平方数
                  </h3>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { n: 1, square: 1 },
                      { n: 2, square: 4 },
                      { n: 3, square: 9 },
                      { n: 4, square: 16 },
                      { n: 5, square: 25 },
                      { n: 6, square: 36 },
                    ].map(({ n, square }) => (
                      <div
                        key={n}
                        className={`p-2 rounded-lg ${
                          squareSize === n
                            ? 'bg-purple-500 text-white'
                            : 'bg-slate-800/50 text-slate-300'
                        }`}
                      >
                        <div className="text-xs text-slate-400">{n}×{n}</div>
                        <div className="text-lg font-bold">{square}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="平方数挑战赛"
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
            <p className="text-xl text-purple-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-green-300 mb-6">你真是个平方数小达人！</p>
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
