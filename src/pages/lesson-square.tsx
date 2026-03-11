import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';

// 正方形可视化
function SquareVisualization({ side }: { side: number }) {
  return (
    <group>
      {/* 正方形主体 */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[side, 0.5, side]} />
        <meshStandardMaterial color="#3B82F6" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* 边框高亮 - 银色 */}
      <mesh position={[0, 0.26, 0]}>
        <boxGeometry args={[side + 0.1, 0.05, side + 0.1]} />
        <meshStandardMaterial color="#C0C0C0" emissive="#C0C0C0" emissiveIntensity={0.3} />
      </mesh>

      {/* 对角线 */}
      <mesh position={[0, 0.3, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[side * 1.414, 0.05, 0.05]} />
        <meshStandardMaterial color="#60A5FA" emissive="#60A5FA" emissiveIntensity={0.3} />
      </mesh>

      {/* 另一条对角线 */}
      <mesh position={[0, 0.3, 0]} rotation={[0, -Math.PI / 4, 0]}>
        <boxGeometry args={[side * 1.414, 0.05, 0.05]} />
        <meshStandardMaterial color="#60A5FA" emissive="#60A5FA" emissiveIntensity={0.3} />
      </mesh>

      {/* 四条边的标记 */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI) / 2;
        const x = Math.cos(angle) * (side / 2);
        const z = Math.sin(angle) * (side / 2);
        return (
          <mesh key={i} position={[x, 0.3, z]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#C0C0C0" emissive="#C0C0C0" emissiveIntensity={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function LessonSquare() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [side, setSide] = useState(5);
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const perimeter = 4 * side;
  const area = side * side;

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
      title: '创建一个边长为7的正方形',
      description: '拖动"📏 边长"滑块到7',
      checkCondition: () => side === 7,
      hint: '太棒了！7×7的完美正方形！',
    },
    {
      id: 2,
      title: '发现正方形的秘密：4条边都相等！',
      description: '试试改变边长，观察4条边是否同时变化',
      checkCondition: () => side === 7,
      hint: '对！正方形每条边都一样长！',
    },
    {
      id: 3,
      title: '计算周长和面积',
      description: '7×7的正方形，周长和面积是多少？',
      checkCondition: () => side === 7,
      hint: '周长：7×4=28，面积：7×7=49',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '🟦 正方形边长是6，周长是多少？',
      options: ['12', '24', '36', '18'],
      correctAnswer: 1,
      hint: '提示: 边长 × 4 = ?',
      explanation: '正确！6 × 4 = 24',
    },
    {
      id: 2,
      question: '🟦 正方形边长是8，面积是多少？',
      options: ['16', '32', '64', '24'],
      correctAnswer: 2,
      hint: '提示: 边长 × 边长 = ?',
      explanation: '太棒了！8 × 8 = 64',
    },
    {
      id: 3,
      question: '🟦 正方形周长是36，边长是多少？',
      options: ['6', '9', '12', '18'],
      correctAnswer: 1,
      hint: '提示: 边长 × 4 = 36',
      explanation: '对了！36 ÷ 4 = 9',
    },
    {
      id: 4,
      question: '🟦 正方形面积是49，边长是多少？',
      options: ['5', '6', '7', '8'],
      correctAnswer: 2,
      hint: '提示: ? × ? = 49',
      explanation: '正确！7 × 7 = 49',
    },
    {
      id: 5,
      question: '🟦 一个正方形手帕，边长10厘米，做4条边需要多少花边？',
      options: ['20厘米', '30厘米', '40厘米', '100厘米'],
      correctAnswer: 2,
      hint: '提示: 这是求周长哦！',
      explanation: '太聪明了！10 × 4 = 40厘米',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900/20 to-slate-700/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">🟦</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">魔法正方形</h1>
              <p className="text-sm text-blue-300">发现完美形状的秘密</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-slate-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">寻找完美形状</h2>
                <p className="text-lg text-blue-200 leading-relaxed">
                  在几何王国里，有一个最特别的形状——<span className="text-2xl mx-1">🟦</span>正方形！
                  它的<span className="text-2xl mx-1">✨</span>四条边都一样长，
                  四个角也都一样大！
                  <br />
                  <span className="text-yellow-300 font-bold">
                    让我们一起来探索这个完美的形状吧！
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
                    🎨 魔法形状工作台
                  </h2>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-yellow-400">
                      {side} × {side}
                    </div>
                    <div className="text-sm text-blue-300 mt-1">
                      边长{side}的正方形
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
                    <SquareVisualization side={side} />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-blue-200 text-sm mt-4 text-center">
                  💡 蓝色是正方形，银色边框闪闪发光！拖动滑块改变大小～
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

                {/* 边长控制 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    📏 边长: {side}
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="10"
                    step="1"
                    value={side}
                    onChange={(e) => setSide(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>3</span>
                    <span>10</span>
                  </div>
                </div>

                {/* 正方形的特征 */}
                <div className="p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-2 border-blue-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
                    ✨ 正方形的秘密
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <p className="text-blue-300">
                      正方形是<span className="font-bold">最完美的四边形</span>！
                    </p>
                    <ul className="text-white text-base space-y-1">
                      <li className="flex items-center gap-2">
                        <span className="text-blue-400">▸</span>
                        <span>4条边<span className="text-yellow-300 font-bold">都相等</span></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-400">▸</span>
                        <span>4个角<span className="text-yellow-300 font-bold">都是直角</span></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-400">▸</span>
                        <span>对角线<span className="text-yellow-300 font-bold">互相垂直</span></span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 周长计算 */}
                <div className="p-4 bg-gradient-to-br from-slate-500/10 to-gray-500/10 border-2 border-slate-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-slate-300 mb-3 flex items-center gap-2">
                    📏 周长计算
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <p className="text-slate-300">
                      公式：<span className="font-bold text-white">边长 × 4</span>
                    </p>
                    <p className="text-lg text-center py-2 bg-slate-800/50 rounded-lg">
                      {side} × 4 = <span className="text-yellow-400 font-bold">{perimeter}</span>
                    </p>
                  </div>
                </div>

                {/* 面积计算 */}
                <div className="p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-2 border-indigo-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-indigo-400 mb-3 flex items-center gap-2">
                    📐 面积计算
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <p className="text-indigo-300">
                      公式：<span className="font-bold text-white">边长 × 边长</span>
                    </p>
                    <p className="text-lg text-center py-2 bg-slate-800/50 rounded-lg">
                      {side} × {side} = <span className="text-yellow-400 font-bold">{area}</span>
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
                        <span className="text-white font-bold">正方形</span>是特殊的长方形
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>
                        <span className="text-white font-bold">记住：</span>正方形四条边全都相等！
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="魔法形状挑战赛"
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
            <p className="text-xl text-blue-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-green-300 mb-6">你真是个几何小达人！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
