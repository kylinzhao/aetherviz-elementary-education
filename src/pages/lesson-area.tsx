import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';

// 矩形面积可视化 - 铺地砖模型
function RectangleVisualization({ width, height }: { width: number; height: number }) {
  const squares = [];
  const squareSize = 1;

  for (let x = 0; x < width; x += squareSize) {
    for (let z = 0; z < height; z += squareSize) {
      squares.push(
        <mesh
          key={`${x}-${z}`}
          position={[x - width / 2 + squareSize / 2, 0, z - height / 2 + squareSize / 2]}
        >
          <boxGeometry args={[squareSize * 0.95, 0.15, squareSize * 0.95]} />
          <meshStandardMaterial
            color={`hsl(${240 + (x + z) * 8}, 75%, 55%)`}
            transparent
            opacity={0.85}
          />
        </mesh>
      );
    }
  }

  return (
    <group>
      {/* 地面网格 */}
      <gridHelper args={[20, 20, 0x4a5568, 0x2d3748]} position={[0, -0.1, 0]} />
      {squares}
      {/* 边框标注 */}
      <mesh position={[0, -0.3, -height / 2 - 0.5]}>
        <boxGeometry args={[width, 0.15, 0.15]} />
        <meshStandardMaterial color="#8B5CF6" />
      </mesh>
      <mesh position={[width / 2 + 0.5, -0.3, 0]}>
        <boxGeometry args={[0.15, 0.15, height]} />
        <meshStandardMaterial color="#3B82F6" />
      </mesh>
    </group>
  );
}

export default function LessonArea() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(2);
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const area = width * height;

  // 视角控制函数
  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(6, 8, 10);
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
      cameraRef.current.position.set(0, 2, 15);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const sideView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(15, 2, 0);
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
      title: '铺一个正方形房间',
      description: '把长和宽都调成4，铺满16块地砖',
      checkCondition: () => width === 4 && height === 4,
      hint: '太棒了！正方形房间需要16块地砖！',
    },
    {
      id: 2,
      title: '铺一个长方形房间',
      description: '长调成6，宽调成4，看看需要多少块地砖',
      checkCondition: () => width === 6 && height === 4,
      hint: '完美！长方形房间需要24块地砖！',
    },
    {
      id: 3,
      title: '发现面积的秘密',
      description: '试试算算：长5宽3，需要多少块地砖？',
      checkCondition: () => width === 5 && height === 3,
      hint: '对了！5 × 3 = 15块地砖！',
    },
    {
      id: 4,
      title: '当个小设计师',
      description: '设计一个需要36块地砖的房间（提示：6×6）',
      checkCondition: () => width === 6 && height === 6,
      hint: '哇！你是个天才设计师！6 × 6 = 36块！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '📏 一个房间长5米，宽3米，需要铺多少块地砖？（每块1平方米）',
      options: ['8块', '15块', '18块', '16块'],
      correctAnswer: 1,
      hint: '提示: 5 + 5 + 5 = ?',
      explanation: '正确！5 × 3 = 15块地砖',
    },
    {
      id: 2,
      question: '📏 正方形边长是4米，面积是多少平方米？',
      options: ['8平方米', '12平方米', '16平方米', '20平方米'],
      correctAnswer: 2,
      hint: '提示: 4 × 4 = ?',
      explanation: '太聪明了！正方形面积 = 边长 × 边长 = 16平方米',
    },
    {
      id: 3,
      question: '📏 长方形长6米宽2米，和正方形边长4米，哪个面积大？',
      options: ['长方形大', '正方形大', '一样大', '不知道'],
      correctAnswer: 2,
      hint: '提示: 6 × 2 = ?，4 × 4 = ?',
      explanation: '对！6 × 2 = 12，4 × 4 = 16，它们的面积都是12和16',
    },
    {
      id: 4,
      question: '📏 面积 = 20平方米，长是5米，宽是多少米？',
      options: ['2米', '3米', '4米', '5米'],
      correctAnswer: 2,
      hint: '提示: 5 × ? = 20',
      explanation: '正确！20 ÷ 5 = 4米',
    },
    {
      id: 5,
      question: '📏 长方形的长和宽都增加2倍，面积会变成原来的几倍？',
      options: ['2倍', '3倍', '4倍', '6倍'],
      correctAnswer: 2,
      hint: '提示: 试试 2 × 3 = 6，然后 4 × 6 = ?',
      explanation: '太棒了！长和宽都乘2，面积会乘4！',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900/20 to-purple-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">📏</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">铺地板游戏</h1>
              <p className="text-sm text-blue-300">学习面积的秘密</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">装修小房间</h2>
                <p className="text-lg text-blue-200 leading-relaxed">
                  小美要装修她的<span className="text-2xl mx-1">🏠</span>小房间啦！
                  她买了好多漂亮的<span className="text-2xl mx-1">🟦</span>地砖，
                  每块地砖都是<span className="text-2xl mx-1">📐</span>1平方米大小。
                  让我们帮小美算算，不同大小的房间需要铺多少块地砖吧！
                  <br />
                  <span className="text-yellow-300 font-bold">
                    面积就是能铺多少块地砖！
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
                    🎨 铺地板场景
                  </h2>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-yellow-400">
                      {width} × {height} = {area}
                    </div>
                    <div className="text-sm text-blue-300 mt-1">
                      {width}米长 × {height}米宽 = {area}块地砖
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
                    <PerspectiveCamera makeDefault ref={cameraRef} position={[6, 8, 10]} fov={60} />
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 20, 10]} castShadow />
                    <RectangleVisualization width={width} height={height} />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-blue-200 text-sm mt-4 text-center">
                  💡 每个方块代表一块地砖！拖动滑块试试铺不同的房间～
                </p>
              </div>

              {/* 任务卡片 */}
              <TaskCard
                title="装修任务"
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

                {/* 房间长 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    📐 房间长（米）: {width}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    step="1"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>2米</span>
                    <span>8米</span>
                  </div>
                </div>

                {/* 房间宽 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    📏 房间宽（米）: {height}
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
                    <span>2米</span>
                    <span>8米</span>
                  </div>
                </div>

                {/* 面积的意义 */}
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                    📖 面积是什么？
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <p className="text-green-300">
                      面积就是<span className="font-bold">能铺多少块地砖</span>！
                    </p>
                    <p className="text-white text-base leading-relaxed">
                      {width} × {height} 就是{' '}
                      <span className="text-yellow-300 font-bold">
                        {width}行，每行{height}块地砖
                      </span>
                      ：
                    </p>
                    <p className="text-lg text-center py-2 bg-slate-800/50 rounded-lg">
                      {Array.from({ length: width }).map((_, i) => (
                        <span key={i} className="inline">
                          {height}
                          {i < width - 1 && ' + '}
                        </span>
                      ))}
                      {' = '}
                      <span className="text-yellow-400 font-bold">{area}</span>
                    </p>
                  </div>
                </div>

                {/* 小技巧 */}
                <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30 rounded-lg">
                  <h3 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
                    💡 小秘密
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>
                        <span className="text-white font-bold">公式：</span>
                        面积 = 长 × 宽
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>
                        <span className="text-white font-bold">单位：</span>平方米（m²）
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>
                        <span className="text-white font-bold">正方形：</span>长宽相等，边长 × 边长
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="地砖挑战赛"
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
            <p className="text-2xl text-white mb-2">你完成了所有装修任务！</p>
            <p className="text-xl text-blue-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-green-300 mb-6">你真是个面积计算小达人！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
