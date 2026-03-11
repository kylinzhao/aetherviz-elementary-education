import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';
import * as THREE from 'three';

// 水粒子组件
function WaterParticle({ position, phase, stage }: {
  position: [number, number, number];
  phase: number;
  stage: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime() + phase;
      const material = meshRef.current.material as THREE.MeshStandardMaterial;

      if (stage === 'evaporation') {
        // 蒸发：向上移动
        const y = Math.abs(Math.sin(time * 0.5)) * 5;
        meshRef.current.position.y = y;
        meshRef.current.position.x = position[0] + Math.sin(time * 0.3) * 0.5;
        material.opacity = (5 - y) / 5 * 0.6;
      } else if (stage === 'condensation') {
        // 凝结：在空中聚集形成云
        const y = 4 + Math.sin(time * 0.5) * 0.5;
        meshRef.current.position.y = y;
        meshRef.current.position.x = position[0] + Math.sin(time * 0.5) * 2;
        material.opacity = 0.6 + Math.sin(time * 2) * 0.3;
      } else if (stage === 'precipitation') {
        // 降水：向下落
        const y = 4 - ((time * 2) % 6);
        meshRef.current.position.y = Math.max(0, y);
        meshRef.current.position.x = position[0];
        material.opacity = 0.6;
      } else if (stage === 'collection') {
        // 汇集：流向海洋
        const t = (time * 0.3) % 3;
        const x = position[0] + t;
        const y = Math.sin(t * 2) * 0.5;
        meshRef.current.position.set(x, y, position[2]);
        material.opacity = 0.6;
      } else {
        // 默认：循环运动
        const y = Math.sin(time * 0.5) * 3 + Math.abs(Math.cos(time * 0.3)) * 2;
        meshRef.current.position.y = y;
        meshRef.current.position.x = position[0] + Math.sin(time * 0.5) * 2;
        material.opacity = 0.6 + Math.sin(time * 2) * 0.3;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial color="#3B82F6" transparent opacity={0.6} />
    </mesh>
  );
}

// 太阳组件
function Sun({ active }: { active: boolean }) {
  const sunRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sunRef.current) {
      const time = state.clock.getElapsedTime();
      const material = sunRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = active ? 1 + Math.sin(time * 2) * 0.3 : 0.3;
    }
  });

  return (
    <mesh position={[4, 4, -2]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#FCD34D"
        emissive="#FCD34D"
        emissiveIntensity={1}
      />
      <pointLight intensity={2} />
    </mesh>
  );
}

// 云朵组件
function Cloud({ position, forming }: { position: [number, number, number]; forming: boolean }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial
          color={forming ? "#E5E7EB" : "#9CA3AF"}
          transparent
          opacity={forming ? 0.9 : 0.5}
        />
      </mesh>
      <mesh position={[0.6, 0.1, 0]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial
          color={forming ? "#E5E7EB" : "#9CA3AF"}
          transparent
          opacity={forming ? 0.9 : 0.5}
        />
      </mesh>
      <mesh position={[-0.6, 0.1, 0]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial
          color={forming ? "#E5E7EB" : "#9CA3AF"}
          transparent
          opacity={forming ? 0.9 : 0.5}
        />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial
          color={forming ? "#E5E7EB" : "#9CA3AF"}
          transparent
          opacity={forming ? 0.9 : 0.5}
        />
      </mesh>
    </group>
  );
}

// 地面/水体
function Ground() {
  return (
    <group>
      {/* 地面 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#22C55E" />
      </mesh>
      {/* 海洋 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.9, 2]}>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color="#3B82F6" transparent opacity={0.8} />
      </mesh>
      {/* 河流 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3, -1.85, -2]}>
        <planeGeometry args={[2, 6]} />
        <meshStandardMaterial color="#06B6D4" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

export default function LessonWaterCycle() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [activeStage, setActiveStage] = useState<string>('all');
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // 视角控制函数
  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 3, 10);
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

  const stages = [
    {
      id: 'evaporation',
      name: '认识蒸发',
      icon: '💨',
      color: 'from-orange-500/20 to-yellow-500/20',
      borderColor: 'border-orange-500/30',
      description: '太阳加热使水变成水蒸气上升',
    },
    {
      id: 'condensation',
      name: '天空凝结',
      icon: '☁️',
      color: 'from-gray-500/20 to-slate-500/20',
      borderColor: 'border-gray-500/30',
      description: '水蒸气冷却形成云',
    },
    {
      id: 'precipitation',
      name: '降雨落到',
      icon: '🌧️',
      color: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/30',
      description: '云中的水滴聚集后落下',
    },
    {
      id: 'collection',
      name: '径流回归',
      icon: '💧',
      color: 'from-cyan-500/20 to-teal-500/20',
      borderColor: 'border-cyan-500/30',
      description: '水流回海洋和湖泊',
    },
  ];

  // 定义引导任务
  const tasks: Task[] = [
    {
      id: 1,
      title: '认识蒸发',
      description: '点击"认识蒸发"按钮，观察水蒸气如何向上飘',
      checkCondition: () => activeStage === 'evaporation',
      hint: '太棒了！太阳加热让水变成看不见的水蒸气飞向天空！',
    },
    {
      id: 2,
      title: '天空凝结',
      description: '点击"天空凝结"按钮，看看水蒸气如何变成云',
      checkCondition: () => activeStage === 'condensation',
      hint: '对啦！水蒸气在高空冷却后，聚在一起就变成了云！',
    },
    {
      id: 3,
      title: '降雨落到',
      description: '点击"降雨落到"按钮，观察雨水如何从云中落下',
      checkCondition: () => activeStage === 'precipitation',
      hint: '很好！云里的小水滴越来越多，太重了就会掉下来变成雨！',
    },
    {
      id: 4,
      title: '径流回归',
      description: '点击"径流回归"按钮，看看水如何流回海洋',
      checkCondition: () => activeStage === 'collection',
      hint: '正确！雨水落到地面后，通过河流流回大海，完成循环！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '💨 水循环的第一步是什么？',
      options: ['下雨', '蒸发', '结冰', '沸腾'],
      correctAnswer: 1,
      hint: '提示: 太阳让水变成看不见的水蒸气',
      explanation: '正确！蒸发是水循环的第一步，太阳加热让水变成水蒸气上升！',
    },
    {
      id: 2,
      question: '☁️ 云是怎么形成的？',
      options: ['水蒸气冷却凝结', '风吹来的', '从树上掉下来的', '鸟带来的'],
      correctAnswer: 0,
      hint: '提示: 水蒸气在高空会发生什么',
      explanation: '太棒了！水蒸气在高空冷却后，会凝结成小水滴形成云！',
    },
    {
      id: 3,
      question: '🌧️ 什么时候会下雨？',
      options: ['云太重了', '风太大', '天黑了', '太热了'],
      correctAnswer: 0,
      hint: '提示: 云里的小水滴越来越多会怎样',
      explanation: '对！云里的小水滴聚集太多，太重了就会掉下来变成雨！',
    },
    {
      id: 4,
      question: '💧 下雨后的水流向哪里？',
      options: ['消失在空中', '流回海洋', '钻到地心', '停在山上'],
      correctAnswer: 1,
      hint: '提示: 想想雨水落地后去哪里了',
      explanation: '正确！雨水通过河流、地下水等途径最终流回海洋！',
    },
    {
      id: 5,
      question: '🌍 水循环的动力来源是什么？',
      options: ['月亮', '太阳', '风', '海洋'],
      correctAnswer: 1,
      hint: '提示: 什么给水提供能量让水蒸发',
      explanation: '太聪明了！太阳是水循环的动力来源，它提供热量让水不断循环！',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900/20 via-cyan-900/20 to-white/10">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">💧</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-white bg-clip-text text-transparent">水的旅行</h1>
              <p className="text-sm text-cyan-300">探索大自然的水循环奥秘</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-white rounded-lg font-bold text-slate-900 hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">小水滴的冒险</h2>
                <p className="text-lg text-cyan-200 leading-relaxed">
                  小水滴<span className="text-2xl mx-1">💧</span>住在蓝色的大海里，
                  有一天太阳公公<span className="text-2xl mx-1">☀️</span>出来了，
                  把它变成了看不见的水蒸气<span className="text-2xl mx-1">💨</span>飞向天空。
                  <br />
                  在高空中，它遇到了很多小伙伴，聚在一起变成了白白的云<span className="text-2xl mx-1">☁️</span>。
                  后来，云里太挤了，它又变成雨水<span className="text-2xl mx-1">🌧️</span>落下来，
                  最后顺着河流<span className="text-2xl mx-1">🌊</span>回到了大海的家！
                  <br />
                  <span className="text-blue-300 font-bold">
                    这就是水的旅行，也叫水循环！
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
                    🎨 水循环演示
                  </h2>
                  <div className="text-center">
                    <div className="text-sm text-cyan-300">
                      {activeStage === 'all' && '🌍 完整循环'}
                      {activeStage === 'evaporation' && '💨 蒸发阶段'}
                      {activeStage === 'condensation' && '☁️ 凝结阶段'}
                      {activeStage === 'precipitation' && '🌧️ 降水阶段'}
                      {activeStage === 'collection' && '💧 汇集阶段'}
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
                    <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 3, 10]} fov={60} />
                    <ambientLight intensity={0.5} />
                    <Sun active={activeStage === 'evaporation' || activeStage === 'all'} />
                    <Cloud position={[-2, 3, 0]} forming={activeStage === 'condensation' || activeStage === 'all'} />
                    <Cloud position={[2, 2.5, -1]} forming={activeStage === 'condensation' || activeStage === 'all'} />
                    <Ground />

                    {/* 水粒子 */}
                    {[...Array(20)].map((_, i) => (
                      <WaterParticle
                        key={i}
                        position={[
                          (Math.random() - 0.5) * 6,
                          Math.random() * 4,
                          (Math.random() - 0.5) * 4,
                        ]}
                        phase={i * 0.5}
                        stage={activeStage}
                      />
                    ))}

                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-cyan-200 text-sm mt-4 text-center">
                  💡 拖动鼠标旋转视角，观察水循环的各个阶段！
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
                  🎛️ 水循环过程
                </h2>

                {/* 阶段选择 */}
                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => setActiveStage('all')}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      activeStage === 'all'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 border-2 border-white/50'
                        : 'bg-slate-800/50 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🌍</span>
                      <div>
                        <div className="font-bold text-white">完整循环</div>
                        <div className="text-sm text-slate-300">观看整个水循环过程</div>
                      </div>
                    </div>
                  </button>

                  {stages.map((stage) => (
                    <button
                      key={stage.id}
                      onClick={() => setActiveStage(activeStage === stage.id ? 'all' : stage.id)}
                      className={`w-full p-4 rounded-lg text-left transition-all ${
                        activeStage === stage.id
                          ? `bg-gradient-to-r ${stage.color} border-2 ${stage.borderColor}`
                          : 'bg-slate-800/50 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{stage.icon}</span>
                        <div>
                          <div className="font-bold text-white">{stage.name}</div>
                          {activeStage === stage.id && (
                            <div className="text-sm text-slate-300 mt-1">
                              {stage.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* 水循环知识 */}
                <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
                    📖 水循环知识
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <p className="text-cyan-300">
                      水在自然界<span className="font-bold">不断循环</span>
                    </p>
                    <p className="text-white text-base leading-relaxed">
                      地球上的水永远不会消失，只是<span className="text-yellow-300 font-bold">改变形态</span>和<span className="text-yellow-300 font-bold">位置</span>
                    </p>
                  </div>
                </div>

                {/* 四个阶段 */}
                <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border-2 border-cyan-500/30 rounded-lg">
                  <h3 className="font-bold text-cyan-400 mb-2 flex items-center gap-2">
                    💡 水循环四阶段
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400">1.</span>
                      <span>
                        <span className="text-white font-bold">蒸发：</span>水变成水蒸气上升
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400">2.</span>
                      <span>
                        <span className="text-white font-bold">凝结：</span>水蒸气变成云
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400">3.</span>
                      <span>
                        <span className="text-white font-bold">降水：</span>云变成雨落下
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400">4.</span>
                      <span>
                        <span className="text-white font-bold">汇集：</span>水回到海洋
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="水循环挑战赛"
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
            <p className="text-2xl text-white mb-2">你完成了所有挑战！</p>
            <p className="text-xl text-blue-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-cyan-300 mb-6">你真是个水循环小达人！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-white rounded-xl font-bold text-xl text-slate-900 hover:opacity-90 transition-opacity"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
