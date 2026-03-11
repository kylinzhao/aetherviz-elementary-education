import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';
import * as THREE from 'three';

// 地球层级组件
function EarthLayer({ radius, color, y, transparent = false }: { radius: number; color: string; y: number; transparent?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, y, 0]}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial
        color={color}
        transparent={transparent}
        opacity={transparent ? 0.6 : 1}
        wireframe={transparent}
      />
    </mesh>
  );
}

// 板块运动组件
function TectonicPlate() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.children.forEach((plate, index) => {
        (plate as THREE.Mesh).position.x = Math.sin(time * 0.2 + index) * 0.5;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[i * 0.3 - 0.3, 0, 0]}>
          <boxGeometry args={[0.8, 0.1, 0.8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      ))}
    </group>
  );
}

// 地球场景
function EarthScene({ activeLayer }: { activeLayer: number }) {
  return (
    <group>
      {/* 地核 */}
      <EarthLayer radius={1} color="#EF4444" y={0} />
      {/* 地幔 */}
      <EarthLayer radius={1.8} color="#F59E0B" y={0} transparent />
      {/* 地壳 */}
      <EarthLayer radius={2.5} color="#3B82F6" y={0} transparent />
      {/* 板块 */}
      {activeLayer === 3 && <TectonicPlate />}
    </group>
  );
}

export default function LessonEarth() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [activeLayer, setActiveLayer] = useState<number | null>(null);
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // 视角控制函数
  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 3, 8);
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
      cameraRef.current.position.set(0, 2, 10);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const sideView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(10, 2, 0);
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

  // 定义引导任务
  const tasks: Task[] = [
    {
      id: 1,
      title: '地壳薄薄',
      description: '点击"地壳"按钮，了解地球表面',
      checkCondition: () => activeLayer === 0,
      hint: '太棒了！地壳就像地球的薄皮！',
    },
    {
      id: 2,
      title: '地幔厚厚',
      description: '点击"地幔"按钮，看看中间层',
      checkCondition: () => activeLayer === 1,
      hint: '对了！地幔是最厚的一层！',
    },
    {
      id: 3,
      title: '地核火热',
      description: '点击"地核"按钮，了解地球中心',
      checkCondition: () => activeLayer === 2,
      hint: '真聪明！地核超级热，像个大火球！',
    },
    {
      id: 4,
      title: '板块运动',
      description: '点击"板块运动"，了解地壳变化',
      checkCondition: () => activeLayer === 3,
      hint: '很好！板块运动会形成高山和地震！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '🌍 地球最外面的一层叫什么？',
      options: ['地核', '地幔', '地壳', '大气层'],
      correctAnswer: 2,
      hint: '提示: 就像苹果的皮一样薄',
      explanation: '正确！地壳是地球最外层的薄皮，我们生活在地壳上！',
    },
    {
      id: 2,
      question: '🔥 地球中心有多热？',
      options: ['和室温一样', '像开水一样热', '像太阳一样热', '像冰箱一样冷'],
      correctAnswer: 2,
      hint: '提示: 比火山还要热得多',
      explanation: '太棒了！地核温度高达6000°C，和太阳表面一样热！',
    },
    {
      id: 3,
      question: '🍰 地球的结构像什么？',
      options: ['像一块石头', '像洋葱一样分层', '像一个气球', '像一盆水'],
      correctAnswer: 1,
      hint: '提示: 一层又一层',
      explanation: '对！地球像一个洋葱，分为地壳、地幔、地核三层！',
    },
    {
      id: 4,
      question: '🏔️ 山脉是怎么形成的？',
      options: ['人们堆出来的', '板块碰撞挤压', '从天上掉下来的', '风吹出来的'],
      correctAnswer: 1,
      hint: '提示: 和板块运动有关',
      explanation: '正确！当两个板块相撞时，地壳会隆起形成山脉！',
    },
    {
      id: 5,
      question: '🌊 地震是怎么发生的？',
      options: ['地球生气了', '板块突然移动', '有人敲地面', '星星撞击'],
      correctAnswer: 1,
      hint: '提示: 和板块运动有关',
      explanation: '太聪明了！当板块突然移动时会产生震动，这就是地震！',
    },
  ];

  const earthLayers = [
    {
      id: 0,
      name: '地壳',
      icon: '🌍',
      color: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30',
      description: '地球最外层的薄薄外壳',
      thickness: '5-70公里',
      temperature: '表面温度',
      state: '固态岩石',
      emoji: '🏔️',
    },
    {
      id: 1,
      name: '地幔',
      icon: '🔥',
      color: 'bg-orange-500/20',
      borderColor: 'border-orange-500/30',
      description: '中间层，最厚的一层',
      thickness: '约2900公里',
      temperature: '1000-3700°C',
      state: '半熔融岩石',
      emoji: '🌋',
    },
    {
      id: 2,
      name: '地核',
      icon: '☀️',
      color: 'bg-red-500/20',
      borderColor: 'border-red-500/30',
      description: '地球中心的火热核心',
      thickness: '约3500公里',
      temperature: '约6000°C',
      state: '液态铁和镍',
      emoji: '🔥',
    },
    {
      id: 3,
      name: '板块运动',
      icon: '🏔️',
      color: 'bg-amber-500/20',
      borderColor: 'border-amber-500/30',
      description: '地壳板块的移动和碰撞',
      examples: ['形成山脉', '引发地震', '火山喷发', '大陆漂移'],
      emoji: '🌍',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900/20 to-green-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">🌍</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">地球探秘</h1>
              <p className="text-sm text-blue-300">探索地球内部的奥秘</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 via-green-500 to-orange-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">地球的洋葱结构</h2>
                <p className="text-lg text-blue-200 leading-relaxed">
                  我们的<span className="text-2xl mx-1">🌍</span>地球，
                  就像一个<span className="text-2xl mx-1">🧅</span>大洋葱！
                  一层又一层，从外到里分别是：
                  <span className="text-2xl mx-1">🏔️</span>地壳、
                  <span className="text-2xl mx-1">🔥</span>地幔、
                  <span className="text-2xl mx-1">☀️</span>地核！
                  <br />
                  <span className="text-orange-300 font-bold">
                    让我们一起探索地球内部的秘密吧！
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
                    🎨 地球内部结构
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
                    <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 3, 8]} fov={60} />
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 20, 10]} castShadow />
                    <pointLight position={[0, 0, 0]} intensity={2} color="#EF4444" />
                    <EarthScene activeLayer={activeLayer ?? -1} />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-blue-200 text-sm mt-4 text-center">
                  💡 红色是地核，橙色是地幔，蓝色是地壳！点击下方按钮了解详情～
                </p>
              </div>

              {/* 地球层级按钮 */}
              <div className="glass-panel rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">地球层级</h3>
                <div className="grid grid-cols-2 gap-4">
                  {earthLayers.map((layer) => (
                    <button
                      key={layer.id}
                      onClick={() => setActiveLayer(layer.id)}
                      className={`p-4 rounded-lg text-left transition-all ${
                        activeLayer === layer.id
                          ? `${layer.color} border-2 ${layer.borderColor}`
                          : 'bg-slate-800/50 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-4xl">{layer.icon}</span>
                        <span className="font-bold text-white text-lg">{layer.name}</span>
                      </div>
                      {activeLayer === layer.id && (
                        <div className="space-y-2">
                          <p className="text-sm text-slate-200">{layer.description}</p>
                          {layer.thickness && (
                            <p className="text-xs text-slate-300">厚度: {layer.thickness}</p>
                          )}
                          {layer.temperature && (
                            <p className="text-xs text-slate-300">温度: {layer.temperature}</p>
                          )}
                          {layer.state && (
                            <p className="text-xs text-slate-300">状态: {layer.state}</p>
                          )}
                          {layer.examples && (
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {layer.examples.map((example, idx) => (
                                <div key={idx} className="text-slate-300 text-center">
                                  {example}
                                </div>
                              ))}
                            </div>
                          )}
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

                {/* 地球分层 */}
                <div className="p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-2 border-blue-500/30 rounded-lg mb-4">
                  <h3 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
                    🧅 地球的分层
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <p>
                      地球像<span className="text-yellow-300 font-bold">洋葱</span>一样分层！
                    </p>
                    <p>
                      从外到里：<span className="text-blue-300">地壳</span>→
                      <span className="text-orange-300">地幔</span>→
                      <span className="text-red-300">地核</span>
                    </p>
                  </div>
                </div>

                {/* 地壳 */}
                <div className="p-4 bg-gradient-to-br from-sky-500/10 to-cyan-500/10 border-2 border-sky-500/30 rounded-lg mb-4">
                  <h3 className="font-bold text-sky-400 mb-3 flex items-center gap-2">
                    🏔️ 地壳
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400">•</span>
                      <span><span className="text-white font-bold">很薄：</span>就像苹果皮</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400">•</span>
                      <span><span className="text-white font-bold">分裂的：</span>分成很多板块</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400">•</span>
                      <span><span className="text-white font-bold">我们在上面：</span>陆地和海洋</span>
                    </li>
                  </ul>
                </div>

                {/* 地幔 */}
                <div className="p-4 bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-2 border-orange-500/30 rounded-lg mb-4">
                  <h3 className="font-bold text-orange-400 mb-3 flex items-center gap-2">
                    🔥 地幔
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400">•</span>
                      <span><span className="text-white font-bold">最厚：</span>占地球体积的84%</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400">•</span>
                      <span><span className="text-white font-bold">半熔融：</span>像很稠的粥</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400">•</span>
                      <span><span className="text-white font-bold">很热：</span>1000-3700°C</span>
                    </li>
                  </ul>
                </div>

                {/* 地核 */}
                <div className="p-4 bg-gradient-to-br from-red-500/10 to-rose-500/10 border-2 border-red-500/30 rounded-lg">
                  <h3 className="font-bold text-red-400 mb-3 flex items-center gap-2">
                    ☀️ 地核
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span><span className="text-white font-bold">超热：</span>6000°C，和太阳一样！</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span><span className="text-white font-bold">金属：</span>主要是铁和镍</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span><span className="text-white font-bold">分层：</span>内核固态，外核液态</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="地球探秘挑战"
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
            <p className="text-2xl text-white mb-2">你成了地球科学专家！</p>
            <p className="text-xl text-blue-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-green-300 mb-6">你真是个小小地质学家！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 via-green-500 to-orange-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
