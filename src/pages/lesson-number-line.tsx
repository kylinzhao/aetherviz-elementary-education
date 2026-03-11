import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';

// 数轴可视化（青蛙跳荷叶）
function NumberLineVisualization({ value }: { value: number }) {
  const marks = [];
  for (let i = -10; i <= 10; i++) {
    marks.push(
      <group key={i} position={[i, 0, 0]}>
        {/* 荷叶 */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.1, 16]} />
          <meshStandardMaterial color={i === 0 ? "#EF4444" : "#10B981"} />
        </mesh>
        {/* 荷叶数字 */}
        {i % 2 === 0 && (
          <mesh position={[0, 1.5, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color={i === 0 ? "#EF4444" : "#059669"} />
          </mesh>
        )}
      </group>
    );
  }

  return (
    <group>
      {/* 河流 */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[20, 0.05, 2]} />
        <meshStandardMaterial color="#06B6D4" transparent opacity={0.6} />
      </mesh>
      {/* 箭头 */}
      <mesh position={[10.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.3, 0.6, 8]} />
        <meshStandardMaterial color="#059669" />
      </mesh>
      {marks}
      {/* 青蛙当前位置 */}
      <mesh position={[value, 1, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#FBBF24" emissive="#FBBF24" emissiveIntensity={0.5} />
      </mesh>
      {/* 跳跃路径 */}
      {value !== 0 && (
        <mesh position={[value / 2, 0.5, 0]} rotation={[0, 0, Math.atan2(1, value)]}>
          <boxGeometry args={[Math.abs(value), 0.05, 0.05]} />
          <meshStandardMaterial color="#FBBF24" />
        </mesh>
      )}
    </group>
  );
}

export default function LessonNumberLine() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [value, setValue] = useState(3);
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // 视角控制函数
  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 8, 15);
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
      cameraRef.current.position.set(0, 2, 18);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const sideView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(18, 2, 0);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const isoView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(12, 12, 12);
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
      title: '找到数字0的位置',
      description: '拖动滑块让小青蛙跳到红色的荷叶（数字0）',
      checkCondition: () => value === 0,
      hint: '太棒了！红色荷叶就是起点0！',
    },
    {
      id: 2,
      title: '跳到数字5',
      description: '让小青蛙向右跳5步到数字5',
      checkCondition: () => value === 5,
      hint: '做得好！从0往右跳5步就是+5！',
    },
    {
      id: 3,
      title: '试试减法！从5跳回2',
      description: '让小青蛙从5往左跳3步到数字2',
      checkCondition: () => value === 2,
      hint: '正确！5 - 3 = 2，你学会了减法！',
    },
    {
      id: 4,
      title: '挑战负数！跳到-3',
      description: '让小青蛙从0往左跳3步到-3',
      checkCondition: () => value === -3,
      hint: '哇！你发现了负数！在0的左边！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '🐸 小青蛙从0向右跳4步，到数字几？',
      options: ['3', '4', '5', '6'],
      correctAnswer: 1,
      hint: '提示: 向右就是加法，0 + 4 = ?',
      explanation: '正确！向右跳4步就是+4！',
    },
    {
      id: 2,
      question: '🐸 小青蛙在数字6，向左跳2步，到数字几？',
      options: ['3', '4', '5', '8'],
      correctAnswer: 1,
      hint: '提示: 向左就是减法，6 - 2 = ?',
      explanation: '太棒了！6 - 2 = 4！',
    },
    {
      id: 3,
      question: '🐸 数字-5在0的哪边？',
      options: ['左边', '右边', '不在数轴上', '不知道'],
      correctAnswer: 0,
      hint: '提示: 负数都在0的左边',
      explanation: '对了！-5在0的左边，负数都在左边！',
    },
    {
      id: 4,
      question: '🐸 从-3向右跳5步，到数字几？',
      options: ['1', '2', '3', '8'],
      correctAnswer: 1,
      hint: '提示: -3 + 5 = ? 从负数往右跳变大',
      explanation: '太聪明了！-3 + 5 = 2！',
    },
    {
      id: 5,
      question: '🐸 哪个数字最大？',
      options: ['-2', '0', '3', '5'],
      correctAnswer: 3,
      hint: '提示: 数轴上右边的数字总是更大',
      explanation: '正确！5在所有数字的右边，所以最大！',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-900/20 to-teal-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">📊</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">数字跳跃</h1>
              <p className="text-sm text-emerald-300">青蛙跳荷叶</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">青蛙跳荷叶</h2>
                <p className="text-lg text-emerald-200 leading-relaxed">
                  有一只可爱的小<span className="text-2xl mx-1">🐸</span>青蛙，
                  它住在<span className="text-2xl mx-1">🌊</span>小河上的荷叶之间！
                  小青蛙喜欢在荷叶上<span className="text-2xl mx-1">🎯</span>跳来跳去！
                  <br />
                  <span className="text-yellow-300 font-bold">
                    每一片荷叶都有一个数字，向右跳变大，向左跳变小，还能跳到负数那边去！
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
                    🎨 青蛙跳跃场景
                  </h2>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-yellow-400">
                      {value}
                    </div>
                    <div className="text-sm text-emerald-300 mt-1">
                      {value > 0 && `从0向右跳${value}步`}
                      {value < 0 && `从0向左跳${Math.abs(value)}步`}
                      {value === 0 && '在起点'}
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
                    <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 8, 15]} fov={60} />
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 20, 10]} castShadow />
                    <NumberLineVisualization value={value} />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-emerald-200 text-sm mt-4 text-center">
                  💡 绿色荷叶是数字位置，金色小球是小青蛙！拖动滑块让它跳来跳去～
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

                {/* 数值控制 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    🐸 青蛙位置: {value}
                  </label>
                  <input
                    type="range"
                    min="-8"
                    max="8"
                    step="1"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>-8 (左边)</span>
                    <span>+8 (右边)</span>
                  </div>
                </div>

                {/* 数轴要素 */}
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                    📖 数轴是什么？
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <p className="text-green-300">
                      数轴就是<span className="font-bold">荷叶排队</span>！
                    </p>
                    <ul className="text-white space-y-1">
                      <li>• <span className="text-red-400 font-bold">红色荷叶</span>：起点0</li>
                      <li>• <span className="text-emerald-400 font-bold">右边</span>：正数（+1, +2...）</li>
                      <li>• <span className="text-cyan-400 font-bold">左边</span>：负数（-1, -2...）</li>
                    </ul>
                  </div>
                </div>

                {/* 快速选择 */}
                <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border-2 border-cyan-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-cyan-400 mb-3 flex items-center gap-2">
                    ⭐ 快速跳跃
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {[-5, -2, 0, 2, 3, 5, -3, 4].map((v) => (
                      <button
                        key={v}
                        onClick={() => setValue(v)}
                        className="p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors border border-slate-700/50"
                      >
                        <div className="text-sm text-white">{v}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 小技巧 */}
                <div className="p-4 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 border-2 border-teal-500/30 rounded-lg">
                  <h3 className="font-bold text-teal-400 mb-2 flex items-center gap-2">
                    💡 小秘密
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-400">•</span>
                      <span>
                        <span className="text-white font-bold">向右跳：</span>数字变大（加法）
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-400">•</span>
                      <span>
                        <span className="text-white font-bold">向左跳：</span>数字变小（减法）
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-400">•</span>
                      <span>
                        <span className="text-white font-bold">右边的数</span>总比左边大
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="青蛙挑战赛"
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
            <p className="text-xl text-emerald-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-green-300 mb-6">你真是个数轴小达人！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
