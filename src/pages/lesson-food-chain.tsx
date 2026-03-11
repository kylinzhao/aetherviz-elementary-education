import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';
import * as THREE from 'three';

// 能量流动粒子
function EnergyParticle({ position, active }: { position: [number, number, number]; active: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && active) {
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = position[1] + Math.sin(time * 3) * 0.5;
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.opacity = 0.5 + Math.sin(time * 5) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color="#FCD34D" transparent opacity={active ? 0.8 : 0.2} />
    </mesh>
  );
}

// 食物链层
function FoodChainLayer({ level, y, color }: { level: number; y: number; color: string }) {
  return (
    <mesh position={[0, y, 0]} rotation={[0, 0, 0]}>
      <cylinderGeometry args={[4 - level * 0.8, 4 - level * 0.8, 0.5, 32]} />
      <meshStandardMaterial color={color} transparent opacity={0.6} />
    </mesh>
  );
}

// 食物链场景
function FoodChainScene({ activeLevel }: { activeLevel: number }) {
  const colors = ['#22C55E', '#FCD34D', '#F59E0B', '#EF4444'];
  const labels = ['生产者', '初级消费者', '次级消费者', '顶级捕食者'];

  return (
    <group>
      {[0, 1, 2, 3].map((level) => (
        <group key={level}>
          <FoodChainLayer level={level} y={level * 1.5 - 2} color={colors[level]} />
          {activeLevel === level && (
            <EnergyParticle position={[2, level * 1.5 - 2, 0]} active={true} />
          )}
        </group>
      ))}
    </group>
  );
}

export default function LessonFoodChain() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [activeLevel, setActiveLevel] = useState<number | null>(null);
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // 视角控制函数
  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 2, 12);
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
      title: '认识食物链',
      description: '点击"生产者"按钮，了解能量来源',
      checkCondition: () => activeLevel === 0,
      hint: '太棒了！植物是食物链的基础！',
    },
    {
      id: 2,
      title: '生产者与消费者',
      description: '点击"初级消费者"按钮，看看谁吃植物',
      checkCondition: () => activeLevel === 1,
      hint: '对了！草食动物吃植物！',
    },
    {
      id: 3,
      title: '能量金字塔',
      description: '点击"次级消费者"，了解能量传递',
      checkCondition: () => activeLevel === 2,
      hint: '真聪明！肉食动物吃草食动物！',
    },
    {
      id: 4,
      title: '生态平衡',
      description: '点击"顶级捕食者"，了解生态系统平衡',
      checkCondition: () => activeLevel === 3,
      hint: '很好！狮子是食物链的顶端！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '🌿 食物链的能量来自哪里？',
      options: ['月亮', '太阳', '星星', '地球'],
      correctAnswer: 1,
      hint: '提示: 植物需要什么来制造食物？',
      explanation: '正确！太阳是所有能量的来源，植物通过光合作用把太阳能变成食物！',
    },
    {
      id: 2,
      question: '🐰 兔子吃什么？它是哪种消费者？',
      options: ['吃肉，次级消费者', '吃草，初级消费者', '什么都吃，顶级消费者', '吃虫子'],
      correctAnswer: 1,
      hint: '提示: 兔子喜欢吃胡萝卜和青草',
      explanation: '对！兔子是草食动物，吃植物，所以是初级消费者！',
    },
    {
      id: 3,
      question: '🦁 为什么食物链顶端是大型动物？',
      options: ['因为它们最强壮', '因为能量逐级减少', '因为它们最聪明', '不知道'],
      correctAnswer: 1,
      hint: '提示: 能量在传递过程中会损失',
      explanation: '太聪明了！能量每传递一次就减少很多，所以顶层动物数量最少！',
    },
    {
      id: 4,
      question: '🌱 如果没有植物，会发生什么？',
      options: ['动物会更好', '所有动物都会饿死', '只有肉食动物受影响', '生态系统会更健康'],
      correctAnswer: 1,
      hint: '提示: 植物是食物链的基础',
      explanation: '正确！植物是生产者，没有它们，所有动物都没有食物，生态系统会崩溃！',
    },
    {
      id: 5,
      question: '⚖️ 什么是生态平衡？',
      options: ['动物数量一样多', '各种生物数量保持稳定', '只有植物和动物', '没有捕食者'],
      correctAnswer: 1,
      hint: '提示: 就像跷跷板一样，两边要平衡',
      explanation: '太棒了！生态平衡就是各种生物的数量保持稳定，食物链才能正常运转！',
    },
  ];

  const foodChainLevels = [
    {
      id: 0,
      name: '生产者',
      icon: '🌱',
      color: 'bg-green-500/20',
      borderColor: 'border-green-500/30',
      description: '植物通过光合作用制造食物',
      examples: ['🌿 草', '🌳 树', '🌾 庄稼', '🌻 花朵'],
      emoji: '🌞',
    },
    {
      id: 1,
      name: '初级消费者',
      icon: '🐰',
      color: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30',
      description: '吃植物的草食动物',
      examples: ['🐰 兔子', '🐄 牛', '🐑 羊', '🦌 鹿'],
      emoji: '🥗',
    },
    {
      id: 2,
      name: '次级消费者',
      icon: '🦊',
      color: 'bg-orange-500/20',
      borderColor: 'border-orange-500/30',
      description: '吃草食动物的肉食动物',
      examples: ['🦊 狐狸', '🐺 狼', '🦅 鹰', '🐍 蛇'],
      emoji: '🍖',
    },
    {
      id: 3,
      name: '顶级捕食者',
      icon: '🦁',
      color: 'bg-red-500/20',
      borderColor: 'border-red-500/30',
      description: '食物链最顶端的王者',
      examples: ['🦁 狮子', '🐅 老虎', '🦅 老鹰', '🦈 鲨鱼'],
      emoji: '👑',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-green-900/20 to-yellow-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">🍃</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">食物链探险</h1>
              <p className="text-sm text-green-300">探索大自然的能量循环</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-yellow-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">大自然的循环</h2>
                <p className="text-lg text-green-200 leading-relaxed">
                  在<span className="text-2xl mx-1">🌿</span>大自然里，
                  每种生物都是<span className="text-2xl mx-1">🔗</span>食物链的一环！
                  从<span className="text-2xl mx-1">🌞</span>太阳开始，
                  能量在<span className="text-2xl mx-1">🌱</span>植物、
                  <span className="text-2xl mx-1">🐰</span>动物之间传递！
                  <br />
                  <span className="text-yellow-300 font-bold">
                    让我们一起探索这个神奇的能量旅程吧！
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
                    🎨 能量金字塔
                  </h2>
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
                    <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 2, 12]} fov={60} />
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 20, 10]} castShadow />
                    <FoodChainScene activeLevel={activeLevel ?? -1} />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-green-200 text-sm mt-4 text-center">
                  💡 能量从下往上传递，每层都会减少！点击下方按钮了解详情～
                </p>
              </div>

              {/* 食物链层级按钮 */}
              <div className="glass-panel rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">食物链层级</h3>
                <div className="space-y-3">
                  {foodChainLevels.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setActiveLevel(level.id)}
                      className={`w-full p-4 rounded-lg text-left transition-all ${
                        activeLevel === level.id
                          ? `${level.color} border-2 ${level.borderColor}`
                          : 'bg-slate-800/50 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-4xl">{level.icon}</span>
                        <span className="font-bold text-white text-lg">{level.name}</span>
                        <span className="text-2xl ml-auto">{level.emoji}</span>
                      </div>
                      {activeLevel === level.id && (
                        <div className="space-y-2">
                          <p className="text-sm text-slate-200">{level.description}</p>
                          <div className="grid grid-cols-4 gap-2 text-xs">
                            {level.examples.map((example, idx) => (
                              <div key={idx} className="text-slate-300 text-center">
                                {example}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 任务卡片 */}
              <TaskCard
                title="学习任务"
                tasks={tasks}
                onAllCompleted={() => setTasksCompleted(true)}
              />
            </div>

            {/* 右侧：知识点和小测验 */}
            <div className="lg:col-span-1 space-y-6">
              {/* 知识点 */}
              <div className="glass-panel rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  📚 知识宝库
                </h2>

                {/* 什么是食物链 */}
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-lg mb-4">
                  <h3 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                    🔗 什么是食物链？
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <p>
                      食物链是<span className="text-yellow-300 font-bold">能量流动</span>的路径！
                    </p>
                    <p>
                      从<span className="text-green-300 font-bold">太阳</span>到植物，
                      再从植物到动物，一层一层传递！
                    </p>
                  </div>
                </div>

                {/* 能量金字塔 */}
                <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-2 border-yellow-500/30 rounded-lg mb-4">
                  <h3 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
                    🔺 能量金字塔
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span><span className="text-white font-bold">底层最大：</span>植物数量最多</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span><span className="text-white font-bold">越往上越小：</span>能量逐级减少</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span><span className="text-white font-bold">顶层最小：</span>顶级捕食者最少</span>
                    </li>
                  </ul>
                </div>

                {/* 生态平衡 */}
                <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 rounded-lg">
                  <h3 className="font-bold text-emerald-400 mb-3 flex items-center gap-2">
                    ⚖️ 生态平衡
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400">•</span>
                      <span><span className="text-white font-bold">相互依存：</span>每种生物都很重要</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400">•</span>
                      <span><span className="text-white font-bold">数量平衡：</span>太多太少都不行</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400">•</span>
                      <span><span className="text-white font-bold">保护自然：</span>维护生态平衡</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="食物链挑战"
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
            <p className="text-2xl text-white mb-2">你成了食物链专家！</p>
            <p className="text-xl text-green-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-yellow-300 mb-6">你真是个小小生态学家！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-yellow-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
