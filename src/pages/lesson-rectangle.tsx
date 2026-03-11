import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';

// 长方形可视化
function RectangleVisualization({ width, height }: { width: number; height: number }) {
  return (
    <group>
      {/* 长方形主体 */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[width, 0.5, height]} />
        <meshStandardMaterial color="#10B981" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* 边框高亮 - 金色 */}
      <mesh position={[0, 0.26, 0]}>
        <boxGeometry args={[width + 0.1, 0.05, height + 0.1]} />
        <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.3} />
      </mesh>

      {/* 尺寸标注 - 长 */}
      <mesh position={[0, -0.5, height / 2 + 1]}>
        <boxGeometry args={[width, 0.1, 0.1]} />
        <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.2} />
      </mesh>

      {/* 尺寸标注 - 宽 */}
      <mesh position={[width / 2 + 1, -0.5, 0]}>
        <boxGeometry args={[0.1, 0.1, height]} />
        <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.2} />
      </mesh>

      {/* 角落装饰 */}
      {[[-width/2, -height/2], [width/2, -height/2], [width/2, height/2], [-width/2, height/2]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.3, pos[1]]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export default function LessonRectangle() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [width, setWidth] = useState(6);
  const [height, setHeight] = useState(4);
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const perimeter = 2 * (width + height);
  const area = width * height;

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
      title: '把画框长度调成8',
      description: '拖动"📏 长度"滑块到8',
      checkCondition: () => width === 8,
      hint: '太棒了！画框变长了！',
    },
    {
      id: 2,
      title: '计算周长：8+5+8+5=?',
      description: '把宽度拖到5，看看周长是多少',
      checkCondition: () => width === 8 && height === 5,
      hint: '对了！(8+5)×2=26，这就是周长！',
    },
    {
      id: 3,
      title: '计算面积：8×5=?',
      description: '保持8×5，看看画框面积',
      checkCondition: () => width === 8 && height === 5,
      hint: '哇！8×5=40，画框可以放40个小格子！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '📐 长方形长10，宽3，周长是多少？',
      options: ['13', '26', '30', '20'],
      correctAnswer: 1,
      hint: '提示: (10 + 3) × 2 = ?',
      explanation: '正确！(10 + 3) × 2 = 26',
    },
    {
      id: 2,
      question: '📐 长方形长7，宽4，面积是多少？',
      options: ['11', '22', '28', '44'],
      correctAnswer: 2,
      hint: '提示: 长 × 宽 = ?',
      explanation: '太棒了！7 × 4 = 28',
    },
    {
      id: 3,
      question: '📐 周长20的长方形，长是6，宽是多少？',
      options: ['3', '4', '5', '14'],
      correctAnswer: 1,
      hint: '提示: (6 + 宽) × 2 = 20',
      explanation: '对了！(6 + 4) × 2 = 20，所以宽是4',
    },
    {
      id: 4,
      question: '📐 面积36的正方形，边长是多少？',
      options: ['4', '6', '8', '9'],
      correctAnswer: 1,
      hint: '提示: ? × ? = 36',
      explanation: '正确！6 × 6 = 36',
    },
    {
      id: 5,
      question: '📐 一个画框长12，宽8，需要多长的木条做边？',
      options: ['20', '40', '96', '80'],
      correctAnswer: 1,
      hint: '提示: 这是在求周长哦！',
      explanation: '太聪明了！(12 + 8) × 2 = 40',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-900/20 to-amber-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">📐</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">长方形画板</h1>
              <p className="text-sm text-emerald-300">学习周长和面积的秘密</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">小画家的画框</h2>
                <p className="text-lg text-emerald-200 leading-relaxed">
                  小画家<span className="text-2xl mx-1">🎨</span>想要做一个漂亮的画框，
                  需要计算<span className="text-2xl mx-1">📏</span>周长来准备木条，
                  还要计算<span className="text-2xl mx-1">📐</span>面积来准备玻璃！
                  <br />
                  <span className="text-yellow-300 font-bold">
                    周长是围成一圈的长度，面积是里面的空间大小！
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
                    🎨 画框工作台
                  </h2>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-yellow-400">
                      {width} × {height}
                    </div>
                    <div className="text-sm text-emerald-300 mt-1">
                      长{width} × 宽{height}
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
                    <RectangleVisualization width={width} height={height} />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-emerald-200 text-sm mt-4 text-center">
                  💡 绿色是长度，金色是宽度！拖动滑块改变画框大小～
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

                {/* 长度控制 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    📏 长度: {width}
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="10"
                    step="1"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>3</span>
                    <span>10</span>
                  </div>
                </div>

                {/* 宽度控制 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    📐 宽度: {height}
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="10"
                    step="1"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>3</span>
                    <span>10</span>
                  </div>
                </div>

                {/* 周长计算 */}
                <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-2 border-emerald-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-emerald-400 mb-3 flex items-center gap-2">
                    📏 周长是什么？
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <p className="text-emerald-300">
                      周长是<span className="font-bold">围成一圈的总长度</span>！
                    </p>
                    <p className="text-white text-base leading-relaxed">
                      公式：<span className="text-yellow-300 font-bold">(长 + 宽) × 2</span>
                    </p>
                    <p className="text-lg text-center py-2 bg-slate-800/50 rounded-lg">
                      ({width} + {height}) × 2 = <span className="text-yellow-400 font-bold">{perimeter}</span>
                    </p>
                  </div>
                </div>

                {/* 面积计算 */}
                <div className="p-4 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-2 border-amber-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-amber-400 mb-3 flex items-center gap-2">
                    📐 面积是什么？
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <p className="text-amber-300">
                      面积是<span className="font-bold">里面能放多少小格子</span>！
                    </p>
                    <p className="text-white text-base leading-relaxed">
                      公式：<span className="text-yellow-300 font-bold">长 × 宽</span>
                    </p>
                    <p className="text-lg text-center py-2 bg-slate-800/50 rounded-lg">
                      {width} × {height} = <span className="text-yellow-400 font-bold">{area}</span>
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
                        <span className="text-white font-bold">周长</span>是边框需要的木条长度
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>
                        <span className="text-white font-bold">面积</span>是玻璃需要的大小
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="画框挑战赛"
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
            <p className="text-xl text-emerald-300 mb-4">
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
