import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';

// 角的 3D 可视化
function AngleVisualization({ angle = 45 }: { angle?: number }) {
  const radians = (angle * Math.PI) / 180;

  return (
    <group>
      {/* 角的边1 */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[3, 0.1, 0.1]} />
        <meshStandardMaterial color="#10B981" />
      </mesh>

      {/* 角的边2 - 根据角度旋转 */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, -radians]}>
        <boxGeometry args={[3, 0.1, 0.1]} />
        <meshStandardMaterial color="#10B981" />
      </mesh>

      {/* 角的标注弧 */}
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[1, 1.2, 32, 1, 0, radians]} />
        <meshStandardMaterial color="#FBBF24" side={2} />
      </mesh>

      {/* 角度文字球 */}
      <mesh position={[1.5, 0.5, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#14B8A6" />
      </mesh>
    </group>
  );
}

export default function LessonAngle() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [angle, setAngle] = useState(45);
  const [autoRotate, setAutoRotate] = useState(false);
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // 视角控制函数
  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 8);
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
      cameraRef.current.position.set(0, 0, 10);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const sideView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(10, 0, 0);
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

  // 获取角度类型信息（儿童友好版）
  const getAngleType = (angle: number) => {
    if (angle < 90) return {
      type: '锐角',
      emoji: '🔺',
      color: 'text-emerald-400',
      desc: '尖尖的小角，像小山的山顶！',
      funFact: '比直角小的角，看起来很精神！'
    };
    if (angle === 90) return {
      type: '直角',
      emoji: '⬜',
      color: 'text-yellow-400',
      desc: '方方正正的角，像书本的角落！',
      funFact: '最特别的角！就像我们坐得端端正正！'
    };
    if (angle < 180) return {
      type: '钝角',
      emoji: '📐',
      color: 'text-orange-400',
      desc: '胖胖的大角，像滑梯的坡度！',
      funFact: '比直角大的角，看起来很稳重！'
    };
    return {
      type: '平角',
      emoji: '➖',
      color: 'text-cyan-400',
      desc: '平平的角，像一条直线！',
      funFact: '180度就是两个直角加起来！'
    };
  };

  const angleInfo = getAngleType(angle);

  // 自动旋转效果
  React.useEffect(() => {
    if (autoRotate) {
      const interval = setInterval(() => {
        setAngle((prev) => (prev >= 180 ? 0 : prev + 1));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [autoRotate]);

  // 定义引导任务
  const tasks: Task[] = [
    {
      id: 1,
      title: '创建一个直角 ⬜',
      description: '拖动滑块到90度，创建一个方方正正的直角',
      checkCondition: () => angle === 90,
      hint: '太棒了！90度就是直角，像书本的角落一样方方正正！',
    },
    {
      id: 2,
      title: '创建一个锐角 🔺',
      description: '拖动滑块到小于90度，创建一个尖尖的锐角',
      checkCondition: () => angle > 0 && angle < 90,
      hint: '完美！这个角尖尖的，像小山的山顶！',
    },
    {
      id: 3,
      title: '创建一个钝角 📐',
      description: '拖动滑块到大于90度但小于180度，创建一个胖胖的钝角',
      checkCondition: () => angle > 90 && angle < 180,
      hint: '哇！这个角胖胖的，像滑梯的坡度！',
    },
    {
      id: 4,
      title: '挑战平角 ➖',
      description: '拖动滑块到180度，创建一个平平的平角',
      checkCondition: () => angle === 180,
      hint: '厉害！180度就是一条直线，这是两个直角加起来！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '🔺 下面哪个角是锐角？',
      options: ['30度', '90度', '120度', '180度'],
      correctAnswer: 0,
      hint: '提示：锐角是尖尖的小角，比90度小',
      explanation: '正确！30度小于90度，是尖尖的锐角！',
    },
    {
      id: 2,
      question: '⬜ 直角是多少度？',
      options: ['45度', '60度', '90度', '100度'],
      correctAnswer: 2,
      hint: '提示：直角是方方正正的角，像书本的角落',
      explanation: '太棒了！90度就是直角，最特别的角！',
    },
    {
      id: 3,
      question: '📐 150度是什么角？',
      options: ['锐角', '直角', '钝角', '平角'],
      correctAnswer: 2,
      hint: '提示：150度比90度大，但比180度小',
      explanation: '正确！150度是钝角，胖胖的像滑梯！',
    },
    {
      id: 4,
      question: '➖ 平角是多少度？',
      options: ['90度', '120度', '180度', '360度'],
      correctAnswer: 2,
      hint: '提示：平角像一条直线，是两个直角加起来',
      explanation: '对！180度是平角，看起来就是一条直线！',
    },
    {
      id: 5,
      question: '🤔 下面哪个说法是对的？',
      options: [
        '锐角比直角大',
        '钝角比直角小',
        '45度是锐角',
        '100度是直角'
      ],
      correctAnswer: 2,
      hint: '提示：锐角是小于90度的角',
      explanation: '聪明！45度小于90度，所以是锐角！',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-900/20 to-teal-900/20">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">📐</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">角度大冒险</h1>
              <p className="text-sm text-emerald-300">探索角的世界</p>
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
              <span className="text-5xl">🏗️</span>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">小建筑师的故事</h2>
                <p className="text-lg text-emerald-200 leading-relaxed">
                  小明想成为一名<span className="text-2xl mx-1">🏗️</span>建筑师！
                  他正在设计自己的梦想小屋，需要用到各种各样的<span className="text-2xl mx-1">📐</span>角。
                  有些角<span className="text-2xl mx-1">🔺</span>尖尖的，有些<span className="text-2xl mx-1">⬜</span>方方的，
                  还有些<span className="text-2xl mx-1">📐</span>胖胖的！
                  <br />
                  <span className="text-yellow-300 font-bold">
                    让我们帮助小明学会认识不同的角度，建造最棒的房子吧！
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：3D场景和任务 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 3D Scene Area */}
              <div className="glass-panel rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    🎨 角度可视化
                  </h2>
                  <div className="flex items-center gap-4">
                    <ViewControlButtons
                      onReset={resetView}
                      onTopView={topView}
                      onFrontView={frontView}
                      onSideView={sideView}
                      onIsoView={isoView}
                    />
                    <div className={`text-4xl font-bold ${angleInfo.color}`}>
                      {angleInfo.emoji} {angle}°
                    </div>
                  </div>
                </div>
                <div className="w-full h-[400px] rounded-lg overflow-hidden bg-slate-800/50">
                  <Canvas shadows gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
                    <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 0, 8]} fov={60} />
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 10, 10]} castShadow />
                    <AngleVisualization angle={angle} />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-emerald-200 text-sm mt-4 text-center">
                  💡 拖动鼠标旋转视角，观察角度的变化 | 使用按钮快速切换视角
                </p>
              </div>

              {/* 任务卡片 */}
              <TaskCard
                title="学习任务"
                tasks={tasks}
                onAllCompleted={() => setTasksCompleted(true)}
              />
            </div>

            {/* 右侧：控制面板和测验 */}
            <div className="lg:col-span-1 space-y-6">
              {/* Control Panel */}
              <div className="glass-panel rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  🎛️ 控制面板
                </h2>

                {/* Angle Slider */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    📐 角度大小: {angle}°
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    value={angle}
                    onChange={(e) => setAngle(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    disabled={autoRotate}
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>0°</span>
                    <span>90°</span>
                    <span>180°</span>
                  </div>
                </div>

                {/* Auto Rotate Button */}
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`w-full py-3 rounded-lg font-bold transition-opacity mb-6 ${
                    autoRotate
                      ? 'bg-red-500 hover:opacity-90'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90'
                  }`}
                >
                  {autoRotate ? '⏹ 停止自动旋转' : '▶ 自动旋转演示'}
                </button>

                {/* Angle Type Display */}
                <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 rounded-lg mb-6">
                  <h3 className={`text-2xl font-bold ${angleInfo.color} mb-2 flex items-center gap-2`}>
                    {angleInfo.emoji} {angleInfo.type}
                  </h3>
                  <p className="text-white text-base mb-2">{angleInfo.desc}</p>
                  <p className="text-emerald-300 text-sm italic">💡 {angleInfo.funFact}</p>
                </div>

                {/* Common Angles */}
                <div className="space-y-3 mb-6">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    ⭐ 常见角度
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { angle: 30, name: '30°', icon: '🔺', label: '锐角' },
                      { angle: 45, name: '45°', icon: '📐', label: '锐角' },
                      { angle: 90, name: '90°', icon: '⬜', label: '直角' },
                      { angle: 180, name: '180°', icon: '➖', label: '平角' },
                    ].map((item) => (
                      <button
                        key={item.angle}
                        onClick={() => setAngle(item.angle)}
                        className="p-3 bg-slate-800/50 rounded-lg hover:bg-emerald-900/30 transition-colors border-2 border-transparent hover:border-emerald-500/50"
                      >
                        <div className="text-2xl mb-1">{item.icon}</div>
                        <div className="text-sm text-white font-bold">{item.name}</div>
                        <div className="text-xs text-emerald-300">{item.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Knowledge Card */}
                <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30 rounded-lg">
                  <h3 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
                    📖 知识小卡片
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400">•</span>
                      <span>
                        <span className="text-white font-bold">角</span>由两条射线组成，像个张开的嘴巴
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400">•</span>
                      <span>
                        <span className="text-white font-bold">顶点</span>是两条射线相交的地方
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400">•</span>
                      <span>
                        角的大小与边的长短<span className="text-yellow-300 font-bold">无关</span>，只看张开的大小
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="角度挑战赛"
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
            <p className="text-lg text-teal-300 mb-6">你真是个角度小达人！可以去当建筑师啦！🏗️</p>
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
