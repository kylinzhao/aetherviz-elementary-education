import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';

// 尺子3D模型
function Ruler3D() {
  return (
    <group position={[0, 0, 0]}>
      {/* 尺子主体 */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[6, 0.3, 0.1]} />
        <meshStandardMaterial color="#10B981" />
      </mesh>
      {/* 刻度线 */}
      {Array.from({ length: 31 }).map((_, i) => (
        <mesh key={i} position={[-3 + i * 0.2, 0.2, 0]}>
          <boxGeometry args={i % 5 === 0 ? [0.02, 0.15, 0.02] : [0.01, 0.1, 0.02]} />
          <meshStandardMaterial color="#FBBF24" />
        </mesh>
      ))}
    </group>
  );
}

// 被测量的物体
function MeasuredObject({ length }: { length: number }) {
  return (
    <mesh position={[0, -0.5, 0]}>
      <boxGeometry args={[length, 0.4, 0.4]} />
      <meshStandardMaterial color="#3B82F6" />
    </mesh>
  );
}

// 测量场景
function MeasurementScene({ objectLength }: { objectLength: number }) {
  return (
    <group>
      <Ruler3D />
      <MeasuredObject length={objectLength} />
    </group>
  );
}

export default function LessonMeasurement() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [objectLength, setObjectLength] = useState(3);
  const [selectedUnit, setSelectedUnit] = useState<'cm' | 'm'>('cm');
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
      title: '认识尺子',
      description: '旋转视角，仔细观察尺子上的刻度线',
      checkCondition: () => true, // 自动完成
      hint: '太棒了！你看到尺子上的刻度了吗？',
    },
    {
      id: 2,
      title: '测量长度',
      description: '调整物体长度到5厘米，观察尺子上的对应位置',
      checkCondition: () => objectLength === 5,
      hint: '完美！物体的长度是5厘米！',
    },
    {
      id: 3,
      title: '单位换算',
      description: '选择"米"作为单位，看看数值有什么变化',
      checkCondition: () => selectedUnit === 'm',
      hint: '真聪明！1米 = 100厘米',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '📏 1米等于多少厘米？',
      options: ['10厘米', '100厘米', '1000厘米', '50厘米'],
      correctAnswer: 1,
      hint: '提示: 米是大单位，厘米是小单位',
      explanation: '正确！1米 = 100厘米',
    },
    {
      id: 2,
      question: '📏 一支铅笔大约有多长？',
      options: ['1米', '2厘米', '15厘米', '50厘米'],
      correctAnswer: 2,
      hint: '提示: 想想你用的铅笔',
      explanation: '对！一支铅笔大约15厘米长',
    },
    {
      id: 3,
      question: '📏 3米等于多少厘米？',
      options: ['30厘米', '300厘米', '3000厘米', '150厘米'],
      correctAnswer: 1,
      hint: '提示: 3 × 100 = ?',
      explanation: '太棒了！3米 = 300厘米',
    },
    {
      id: 4,
      question: '📏 下面哪个最长？',
      options: ['10厘米', '1米', '50厘米', '20厘米'],
      correctAnswer: 1,
      hint: '提示: 把米都换成厘米来比较',
      explanation: '正确！1米 = 100厘米，是最长的',
    },
    {
      id: 5,
      question: '📏 教室的高度大约是多少？',
      options: ['3厘米', '30厘米', '3米', '10米'],
      correctAnswer: 2,
      hint: '提示: 想想教室有多高',
      explanation: '真聪明！教室大约3米高',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-green-900/20 to-emerald-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">📏</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">测量小达人</h1>
              <p className="text-sm text-green-300">学习测量的奥秘</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">小小裁缝师</h2>
                <p className="text-lg text-green-200 leading-relaxed">
                  在一个神奇的裁缝店里，有一位<span className="text-2xl mx-1">🧵</span>小小裁缝师。
                  他每天都要用<span className="text-2xl mx-1">📏</span>尺子测量布料，
                  为客人制作漂亮的<span className="text-2xl mx-1">👗</span>衣服。
                  <br />
                  <span className="text-yellow-300 font-bold">
                    今天，让我们来学习测量的秘密吧！
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
                    🎨 测量场景
                  </h2>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-yellow-400">
                      {objectLength} {selectedUnit}
                    </div>
                    <div className="text-sm text-green-300 mt-1">
                      物体长度
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
                    <MeasurementScene objectLength={objectLength} />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-green-200 text-sm mt-4 text-center">
                  💡 绿色的尺子，金色的刻度！蓝色是要测量的物体～
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

                {/* 物体长度 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    📦 物体长度: {objectLength}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="0.5"
                    value={objectLength}
                    onChange={(e) => setObjectLength(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>1</span>
                    <span>6</span>
                  </div>
                </div>

                {/* 单位选择 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    📐 选择单位
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedUnit('cm')}
                      className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${
                        selectedUnit === 'cm'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      厘米 (cm)
                    </button>
                    <button
                      onClick={() => setSelectedUnit('m')}
                      className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${
                        selectedUnit === 'm'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      米 (m)
                    </button>
                  </div>
                </div>

                {/* 测量知识 */}
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                    📖 测量小知识
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <p className="text-green-300">
                      尺子是测量长度的<span className="font-bold">神奇工具</span>！
                    </p>
                    <p className="text-white text-base leading-relaxed">
                      • 大刻度线代表<span className="text-yellow-300 font-bold">厘米</span>
                    </p>
                    <p className="text-white text-base leading-relaxed">
                      • 小刻度线代表<span className="text-yellow-300 font-bold">毫米</span>
                    </p>
                    <p className="text-white text-base leading-relaxed">
                      • 1米 = <span className="text-yellow-300 font-bold">100厘米</span>
                    </p>
                  </div>
                </div>

                {/* 小技巧 */}
                <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-2 border-yellow-500/30 rounded-lg">
                  <h3 className="font-bold text-yellow-400 mb-2 flex items-center gap-2">
                    💡 小秘密
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span>
                        <span className="text-white font-bold">零刻度：</span>从0开始测量！
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span>
                        <span className="text-white font-bold">对齐：</span>物体一端对准0刻度
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="测量挑战赛"
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
            <p className="text-xl text-green-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-green-300 mb-6">你真是个测量小达人！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
