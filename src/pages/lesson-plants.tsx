import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';
import * as THREE from 'three';

// 植物3D模型
function Plant3D({
  growthStage,
  showLeaves,
  showFlowers,
}: {
  growthStage: number;
  showLeaves: boolean;
  showFlowers: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const stemHeight = 1 + growthStage * 2;

  return (
    <group ref={groupRef}>
      {/* 根 */}
      <mesh position={[0, -0.3, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {[0, 0.2, -0.2].map((x, i) => (
        <mesh key={`root-${i}`} position={[x, -0.5, 0]}>
          <cylinderGeometry args={[0.05, 0.02, 0.6]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      ))}

      {/* 茎 */}
      <mesh position={[0, stemHeight / 2, 0]}>
        <cylinderGeometry args={[0.1, 0.15, stemHeight]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>

      {/* 叶 */}
      {showLeaves && [1, 2].map((level) => (
        <React.Fragment key={`level-${level}`}>
          <mesh position={[0.5, stemHeight * 0.3 * level, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#32CD32" />
          </mesh>
          <mesh position={[-0.5, stemHeight * 0.3 * level, 0]} rotation={[0, 0, Math.PI / 4]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#32CD32" />
          </mesh>
        </React.Fragment>
      ))}

      {/* 花 */}
      {showFlowers && (
        <>
          <mesh position={[0, stemHeight + 0.2, 0]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial color="#FFD700" />
          </mesh>
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh
              key={`petal-${i}`}
              position={[
                Math.cos((i * Math.PI * 2) / 5) * 0.3,
                stemHeight + 0.3,
                Math.sin((i * Math.PI * 2) / 5) * 0.3,
              ]}
            >
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#FF6347" />
            </mesh>
          ))}
        </>
      )}

      {/* 地面 */}
      <mesh position={[0, -0.8, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[2, 2, 0.2, 32]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
    </group>
  );
}

export default function LessonPlants() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [growthStage, setGrowthStage] = useState(1);
  const [showLeaves, setShowLeaves] = useState(false);
  const [showFlowers, setShowFlowers] = useState(false);
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
      title: '认识根茎叶',
      description: '观察植物结构，找出根、茎、叶的位置和作用',
      checkCondition: () => true,
      hint: '太棒了！根在土里吸收水分，茎支撑植物，叶进行光合作用！',
    },
    {
      id: 2,
      title: '光合作用',
      description: '点击"显示叶子"，观察叶子的作用',
      checkCondition: () => showLeaves,
      hint: '正确！叶子通过光合作用制造养分，让植物健康成长！',
    },
    {
      id: 3,
      title: '植物生长',
      description: '调节生长阶段，观察植物从种子到长大的过程',
      checkCondition: () => growthStage >= 2,
      hint: '太好了！植物需要阳光、水分和营养才能长大！',
    },
    {
      id: 4,
      title: '开花结果',
      description: '让植物完全长大并开花',
      checkCondition: () => showFlowers && growthStage === 3,
      hint: '完美！花朵会授粉结果，完成植物的生命周期！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '🌱 植物的哪个部分吸收水分和营养？',
      options: ['叶子', '茎', '根', '花'],
      correctAnswer: 2,
      hint: '提示: 在土里的部分',
      explanation: '正确！根在土里吸收水分和营养，让植物健康成长！',
    },
    {
      id: 2,
      question: '☀️ 光合作用主要在植物的哪个部分进行？',
      options: ['根', '茎', '叶', '花'],
      correctAnswer: 2,
      hint: '提示: 绿色的部分',
      explanation: '太棒了！叶子含有叶绿素，可以进行光合作用制造养分！',
    },
    {
      id: 3,
      question: '💧 植物生长需要哪些条件？',
      options: ['只需要阳光', '只需要水', '阳光、水和营养', '什么都不需要'],
      correctAnswer: 2,
      hint: '提示: 想想你怎样照顾植物',
      explanation: '对了！植物需要阳光、水分和营养才能健康成长！',
    },
    {
      id: 4,
      question: '🌸 植物开花的目的是什么？',
      options: ['为了好看', '为了繁殖', '为了喝水', '为了玩'],
      correctAnswer: 1,
      hint: '提示: 花会变成什么？',
      explanation: '正确！花朵授粉后会结果，里面含有种子，可以繁殖新植物！',
    },
    {
      id: 5,
      question: '🌳 植物的茎有什么作用？',
      options: ['支撑植物', '吸收水分', '进行光合作用', '制造种子'],
      correctAnswer: 0,
      hint: '提示: 想想树干的作用',
      explanation: '太聪明了！茎支撑植物，让叶子和花能接受阳光！',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-green-900/20 to-yellow-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">🌱</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">植物成长日记</h1>
              <p className="text-sm text-green-300">小园丁的观察</p>
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
                <h2 className="text-2xl font-bold text-white mb-2">小园丁的观察</h2>
                <p className="text-lg text-green-200 leading-relaxed">
                  小明在花园里种了一颗<span className="text-2xl mx-1">🌱</span>小种子！
                  每天他都给种子浇<span className="text-2xl mx-1">💧</span>水，
                  放在<span className="text-2xl mx-1">☀️</span>阳光下。
                  <br />
                  <span className="text-yellow-300 font-bold">
                    让我们一起来观察植物是如何成长的吧！
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
                    🌿 植物实验室
                  </h2>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400">
                      {growthStage === 1 ? '🌱' : growthStage === 2 ? '🌿' : '🌳'}
                    </div>
                    <div className="text-sm text-green-300 mt-1">
                      生长阶段: {['种子', '幼苗', '成长'][growthStage - 1]}
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
                    <Plant3D
                      growthStage={growthStage}
                      showLeaves={showLeaves}
                      showFlowers={showFlowers}
                    />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-green-200 text-sm mt-4 text-center">
                  💡 观察植物从种子到开花结果的全过程！
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

                {/* 生长阶段 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    🌱 生长阶段: {['种子', '幼苗', '成长'][growthStage - 1]}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="1"
                    value={growthStage}
                    onChange={(e) => setGrowthStage(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>种子</span>
                    <span>幼苗</span>
                    <span>成长</span>
                  </div>
                </div>

                {/* 显示叶子 */}
                <div className="mb-6">
                  <button
                    onClick={() => setShowLeaves(!showLeaves)}
                    className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
                      showLeaves
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    {showLeaves ? '🍃 叶子已显示' : '🌿 显示叶子'}
                  </button>
                </div>

                {/* 显示花朵 */}
                <div className="mb-6">
                  <button
                    onClick={() => setShowFlowers(!showFlowers)}
                    className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
                      showFlowers
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    {showFlowers ? '🌸 花朵已盛开' : '🌺 显示花朵'}
                  </button>
                </div>

                {/* 知识点 */}
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-yellow-500/10 border-2 border-green-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                    📖 植物知识
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      <span>
                        <span className="text-white font-bold">根</span>
                        <br />
                        <span className="text-xs">吸收水分和营养，固定植物</span>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span>
                        <span className="text-white font-bold">茎</span>
                        <br />
                        <span className="text-xs">支撑植物，运输水分和营养</span>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400">•</span>
                      <span>
                        <span className="text-white font-bold">叶</span>
                        <br />
                        <span className="text-xs">进行光合作用制造养分</span>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400">•</span>
                      <span>
                        <span className="text-white font-bold">花</span>
                        <br />
                        <span className="text-xs">授粉后结果，含有种子</span>
                      </span>
                    </li>
                  </ul>
                </div>

                {/* 有趣事实 */}
                <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-2 border-yellow-500/30 rounded-lg">
                  <h3 className="font-bold text-yellow-400 mb-2 flex items-center gap-2">
                    ⭐ 有趣事实
                  </h3>
                  <p className="text-slate-200 text-sm">
                    有些树可以活几千年！世界上最老的树已经超过5000岁啦！🌳
                  </p>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="植物知识挑战"
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
            <h2 className="text-4xl font-bold text-green-400 mb-4">太棒了！</h2>
            <p className="text-2xl text-white mb-2">你成为了植物小专家！</p>
            <p className="text-xl text-yellow-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-green-200 mb-6">你真是个小园丁！</p>
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
