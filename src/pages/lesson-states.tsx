import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';

// 物质三态可视化组件
function MatterVisualization() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 固态 - 紧密排列的粒子 */}
      <group position={[-3, 0, 0]}>
        {Array.from({ length: 27 }).map((_, i) => {
          const x = (i % 3) * 0.8 - 0.8;
          const y = Math.floor(i / 3) % 3 * 0.8 - 0.8;
          const z = Math.floor(i / 9) * 0.8 - 0.8;
          return (
            <mesh key={`solid-${i}`} position={[x, y, z]}>
              <sphereGeometry args={[0.25, 16, 16]} />
              <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.3} />
            </mesh>
          );
        })}
      </group>

      {/* 液态 - 较松散排列的粒子 */}
      <group position={[0, 0, 0]}>
        {Array.from({ length: 20 }).map((_, i) => {
          const x = (Math.random() - 0.5) * 2;
          const y = (Math.random() - 0.5) * 2;
          const z = (Math.random() - 0.5) * 2;
          return (
            <mesh key={`liquid-${i}`} position={[x, y, z]}>
              <sphereGeometry args={[0.25, 16, 16]} />
              <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.3} />
            </mesh>
          );
        })}
      </group>

      {/* 气态 - 自由扩散的粒子 */}
      <group position={[3, 0, 0]}>
        {Array.from({ length: 15 }).map((_, i) => {
          const x = (Math.random() - 0.5) * 3;
          const y = (Math.random() - 0.5) * 3;
          const z = (Math.random() - 0.5) * 3;
          return (
            <mesh key={`gas-${i}`} position={[x, y, z]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#94a3b8" emissive="#94a3b8" emissiveIntensity={0.3} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

export default function LessonStates() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [selectedState, setSelectedState] = useState<'solid' | 'liquid' | 'gas'>('solid');
  const [temperature, setTemperature] = useState(25);
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // 根据温度自动切换状态
  useEffect(() => {
    if (temperature <= 0) {
      setSelectedState('solid');
    } else if (temperature >= 100) {
      setSelectedState('gas');
    } else {
      setSelectedState('liquid');
    }
  }, [temperature]);

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
      title: '观察固体状态',
      description: '点击"固体"按钮，观察粒子的排列方式',
      checkCondition: () => selectedState === 'solid',
      hint: '太棒了！固体的粒子紧密排列，像整齐的队伍！',
    },
    {
      id: 2,
      title: '探索液体状态',
      description: '点击"液体"按钮，看看粒子如何运动',
      checkCondition: () => selectedState === 'liquid',
      hint: '对啦！液体的粒子可以自由流动，像一群小鱼！',
    },
    {
      id: 3,
      title: '了解气体状态',
      description: '点击"气体"按钮，观察粒子的运动速度',
      checkCondition: () => selectedState === 'gas',
      hint: '真聪明！气体的粒子快速运动，充满整个空间！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '🧊 下面哪个是固体？',
      options: ['水', '冰', '水蒸气', '空气'],
      correctAnswer: 1,
      hint: '提示: 固体有固定的形状和体积',
      explanation: '正确！冰是水的固体状态！',
    },
    {
      id: 2,
      question: '💧 水在多少度结冰？',
      options: ['100°C', '50°C', '0°C', '-10°C'],
      correctAnswer: 2,
      hint: '提示: 水在零度时变成冰',
      explanation: '太棒了！水在0°C时结冰！',
    },
    {
      id: 3,
      question: '💨 气体的特点是什么？',
      options: ['有固定形状', '粒子紧密排列', '充满整个容器', '不能流动'],
      correctAnswer: 2,
      hint: '提示: 气体可以扩散到整个空间',
      explanation: '对！气体的粒子自由扩散，充满整个容器！',
    },
    {
      id: 4,
      question: '🌡️ 水在多少度沸腾？',
      options: ['0°C', '50°C', '100°C', '150°C'],
      correctAnswer: 2,
      hint: '提示: 烧开水时的温度',
      explanation: '真聪明！水在100°C时沸腾变成水蒸气！',
    },
    {
      id: 5,
      question: '🔄 冰变成水的过程叫什么？',
      options: ['凝固', '熔化', '汽化', '液化'],
      correctAnswer: 1,
      hint: '提示: 固体变成液体的过程',
      explanation: '正确！冰熔化成水！',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-900/30 via-blue-900/20 to-slate-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">🧊</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">物质三态</h1>
              <p className="text-sm text-cyan-300">探索物质的三种形态</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
              <span className="text-5xl">🔬</span>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">探索物质的世界</h2>
                <p className="text-lg text-cyan-200 leading-relaxed">
                  你有没有想过，为什么<span className="text-2xl mx-1">🧊</span>冰是硬的，
                  <span className="text-2xl mx-1">💧</span>水会流动，
                  而<span className="text-2xl mx-1">💨</span>空气看不见？
                  <br />
                  <span className="text-cyan-300 font-bold">
                    让我们一起探索物质的奇妙三态吧！
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
                    🧪 物质三态演示
                  </h2>
                  <div className="text-center">
                    <div className="text-sm text-cyan-300">
                      {selectedState === 'solid' && '🧊 固态'}
                      {selectedState === 'liquid' && '💧 液态'}
                      {selectedState === 'gas' && '💨 气态'}
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
                    <MatterVisualization />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-cyan-200 text-sm mt-4 text-center">
                  💡 观察三种状态下粒子的排列和运动！
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

                {/* 状态切换 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    🧊 物质状态
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setSelectedState('solid')}
                      className={`p-3 rounded-lg font-bold transition-all ${
                        selectedState === 'solid'
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      固体
                    </button>
                    <button
                      onClick={() => setSelectedState('liquid')}
                      className={`p-3 rounded-lg font-bold transition-all ${
                        selectedState === 'liquid'
                          ? 'bg-cyan-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      液体
                    </button>
                    <button
                      onClick={() => setSelectedState('gas')}
                      className={`p-3 rounded-lg font-bold transition-all ${
                        selectedState === 'gas'
                          ? 'bg-slate-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      气体
                    </button>
                  </div>
                </div>

                {/* 温度调节 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    🌡️ 温度调节
                  </label>
                  <input
                    type="range"
                    min="-20"
                    max="120"
                    value={temperature}
                    onChange={(e) => setTemperature(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center p-3 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg">
                    <div className="text-3xl font-bold text-cyan-300">{temperature}°C</div>
                    <div className="text-sm text-slate-300 mt-1">
                      {temperature <= 0 && '❄️ 固态（冰）'}
                      {temperature > 0 && temperature < 100 && '💧 液态（水）'}
                      {temperature >= 100 && '💨 气态（水蒸气）'}
                    </div>
                  </div>
                </div>

                {/* 物质状态知识 */}
                <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-2 border-cyan-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-cyan-400 mb-3 flex items-center gap-2">
                    📖 什么是物质三态？
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <p className="text-cyan-300">
                      物质有<span className="font-bold">三种状态</span>：固体、液体和气体！
                    </p>
                    <p className="text-white text-base leading-relaxed">
                      <span className="text-cyan-300 font-bold">温度</span>会让物质从一种状态变成另一种状态！
                    </p>
                  </div>
                </div>

                {/* 状态特点 */}
                <div className="p-4 bg-gradient-to-br from-blue-500/10 to-slate-500/10 border-2 border-blue-500/30 rounded-lg">
                  <h3 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
                    💡 三态特点
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">🧊</span>
                      <span>
                        <span className="text-white font-bold">固体：</span>粒子紧密排列，有固定形状
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400">💧</span>
                      <span>
                        <span className="text-white font-bold">液体：</span>粒子可以流动，无固定形状
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400">💨</span>
                      <span>
                        <span className="text-white font-bold">气体：</span>粒子快速运动，充满容器
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="物质三态挑战"
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
            <h2 className="text-4xl font-bold text-cyan-400 mb-4">太棒了！</h2>
            <p className="text-2xl text-white mb-2">你是个小小科学家！</p>
            <p className="text-xl text-cyan-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-blue-300 mb-6">你已经掌握了物质三态的知识！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
