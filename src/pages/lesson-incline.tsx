import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';
import * as THREE from 'three';

// 斜坡3D模型
function Incline3D({
  angle,
  sliding,
  blockPosition,
}: {
  angle: number;
  sliding: boolean;
  blockPosition: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const blockRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = (angle * Math.PI) / 180;
    }
  });

  return (
    <group ref={groupRef} position={[0, -2, 0]}>
      {/* 斜坡（三角形） */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[6, 0.2, 2]} />
        <meshStandardMaterial color="#3B82F6" />
      </mesh>

      {/* 斜面下的支撑物 */}
      <mesh position={[2.5, -1.5, 0]}>
        <boxGeometry args={[0.2, 3, 2]} />
        <meshStandardMaterial color="#64748B" />
      </mesh>

      {/* 滑块 */}
      <mesh
        ref={blockRef}
        position={[-2.5 + blockPosition, 0.35, 0]}
        rotation={[0, 0, (-angle * Math.PI) / 180]}
      >
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#22C55E" />
      </mesh>

      {/* 地面 */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 4]} />
        <meshStandardMaterial color="#22C55E" />
      </mesh>

      {/* 角度标注 */}
      <mesh position={[1, 0.3, 1.1]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#EAB308" />
      </mesh>
    </group>
  );
}

export default function LessonIncline() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [angle, setAngle] = useState(30);
  const [sliding, setSliding] = useState(false);
  const [blockPosition, setBlockPosition] = useState(0);
  const [weight, setWeight] = useState(5);
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

  // 模拟滑动
  const startSlide = () => {
    if (!sliding) {
      setSliding(true);
      setBlockPosition(0);
      const duration = 2000 / (angle / 15); // 角度越大滑得越快
      let start = Date.now();

      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - start) / duration, 1);

        if (progress < 1) {
          setBlockPosition(progress * 4.5); // 滑动距离
          requestAnimationFrame(animate);
        } else {
          setSliding(false);
          setBlockPosition(4.5);
        }
      };

      animate();
    }
  };

  // 定义引导任务
  const tasks: Task[] = [
    {
      id: 1,
      title: '观察斜面',
      description: '调节角度滑块，观察不同角度的斜坡形状',
      checkCondition: () => angle >= 20 && angle <= 40,
      hint: '太棒了！角度越大，斜坡越陡！',
    },
    {
      id: 2,
      title: '省力原理',
      description: '点击"开始滑动"，观察滑块如何滑下斜坡',
      checkCondition: () => blockPosition > 3,
      hint: '正确！斜坡可以省力，把重物从低处运到高处！',
    },
    {
      id: 3,
      title: '角度影响',
      description: '将角度调到45度，再试一次滑动',
      checkCondition: () => angle >= 40 && blockPosition > 3,
      hint: '对了！角度越大，物体下滑越快！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '📐 斜面是一种什么机械？',
      options: ['费力机械', '省力机械', '不省力也不费力', '不知道'],
      correctAnswer: 1,
      hint: '提示: 想想推车上坡',
      explanation: '正确！斜面是一种省力机械，可以省力地提升重物！',
    },
    {
      id: 2,
      question: '🎯 斜面的角度越大，需要的力会怎样？',
      options: ['越小', '越大', '不变', '不知道'],
      correctAnswer: 1,
      hint: '提示: 陡坡更难爬',
      explanation: '太棒了！角度越大，需要的力越大，但移动距离越短！',
    },
    {
      id: 3,
      question: '🏔️ 生活中哪个不是斜面的应用？',
      options: ['盘山公路', '螺丝', '楼梯', '滑轮'],
      correctAnswer: 3,
      hint: '提示: 滑轮是另一种简单机械',
      explanation: '对了！滑轮是另一种简单机械，不是斜面！',
    },
    {
      id: 4,
      question: '💡 斜面的省力原理是什么？',
      options: [
        '增加摩擦力',
        '延长运动距离，减小需要的力',
        '减小重力',
        '增加重力',
      ],
      correctAnswer: 1,
      hint: '提示: 功=力×距离',
      explanation: '正确！斜面通过延长运动距离来减小需要的力，这就是省力原理！',
    },
    {
      id: 5,
      question: '🔬 斜面的倾角越小，会怎样？',
      options: [
        '越省力但距离越长',
        '越费力但距离越短',
        '不省力也不费力',
        '无法滑动',
      ],
      correctAnswer: 0,
      hint: '提示: 平缓的坡更容易走',
      explanation: '太聪明了！倾角越小，越省力但需要的距离越长！',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900/20 to-green-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">📐</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">斜坡滑梯</h1>
              <p className="text-sm text-blue-300">探索斜面的奥秘</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">滑滑梯的奥秘</h2>
                <p className="text-lg text-blue-200 leading-relaxed">
                  小明很喜欢玩<span className="text-2xl mx-1">🎢</span>滑滑梯！
                  他发现：<span className="text-2xl mx-1">🤔</span>有的滑梯很快，
                  有的滑梯很慢，这是为什么呢？
                  <br />
                  <span className="text-green-300 font-bold">
                    让我们一起探索斜坡的省力原理吧！
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
                    🎨 斜坡实验室
                  </h2>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-400">
                      {angle}°
                    </div>
                    <div className="text-sm text-blue-300 mt-1">
                      当前角度
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
                    <Incline3D
                      angle={angle}
                      sliding={sliding}
                      blockPosition={blockPosition}
                    />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-blue-200 text-sm mt-4 text-center">
                  💡 调节角度观察斜坡变化，点击"开始滑动"看滑块下滑！
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

                {/* 滑动按钮 */}
                <button
                  onClick={startSlide}
                  disabled={sliding}
                  className="w-full py-4 rounded-lg font-bold text-lg transition-opacity mb-6 bg-gradient-to-r from-blue-500 to-green-500 hover:opacity-90 disabled:opacity-50"
                >
                  {sliding ? '🎢 滑动中...' : '▶️ 开始滑动'}
                </button>

                {/* 角度控制 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    📐 斜坡角度: {angle}°
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={angle}
                    onChange={(e) => {
                      setAngle(Number(e.target.value));
                      setBlockPosition(0);
                      setSliding(false);
                    }}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>平缓 10°</span>
                    <span>陡峭 60°</span>
                  </div>
                </div>

                {/* 重量控制 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    📦 物体重量: {weight} kg
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>轻 1kg</span>
                    <span>重 10kg</span>
                  </div>
                </div>

                {/* 知识点 */}
                <div className="p-4 bg-gradient-to-br from-blue-500/10 to-green-500/10 border-2 border-blue-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
                    📖 斜面原理
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>
                        <span className="text-white font-bold">省力机械</span>
                        <br />
                        <span className="text-xs">斜面能省力地提升重物</span>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      <span>
                        <span className="text-white font-bold">角度影响</span>
                        <br />
                        <span className="text-xs">角度越小越省力，但距离越长</span>
                      </span>
                    </li>
                  </ul>
                </div>

                {/* 应用场景 */}
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                    🏔️ 生活中的斜面
                  </h3>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-slate-800/50 rounded-lg">
                      <div className="text-2xl mb-1">🛣️</div>
                      <div className="text-xs text-slate-300">盘山公路</div>
                    </div>
                    <div className="p-2 bg-slate-800/50 rounded-lg">
                      <div className="text-2xl mb-1">🔩</div>
                      <div className="text-xs text-slate-300">螺丝</div>
                    </div>
                    <div className="p-2 bg-slate-800/50 rounded-lg">
                      <div className="text-2xl mb-1">🪜</div>
                      <div className="text-xs text-slate-300">楼梯</div>
                    </div>
                  </div>
                </div>

                {/* 有趣事实 */}
                <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-2 border-cyan-500/30 rounded-lg">
                  <h3 className="font-bold text-cyan-400 mb-2 flex items-center gap-2">
                    ⭐ 有趣事实
                  </h3>
                  <p className="text-slate-200 text-sm">
                    金字塔的建造可能使用了斜坡来搬运巨大的石块！🏛️
                  </p>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="斜面挑战赛"
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
      {tasksCompleted && quizScore !== null && quizScore >= 3 && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="glass-panel rounded-3xl p-8 max-w-lg w-full text-center animate-bounce">
            <div className="text-8xl mb-4">🏆</div>
            <h2 className="text-4xl font-bold text-yellow-400 mb-4">太棒了！</h2>
            <p className="text-2xl text-white mb-2">你掌握了斜面原理！</p>
            <p className="text-xl text-blue-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-green-300 mb-6">你真是个物理小达人！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
