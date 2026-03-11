import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';
import * as THREE from 'three';

// 杠杆3D模型
function Lever3D({
  leftWeight,
  rightWeight,
  leftDistance,
  rightDistance,
  balanced,
}: {
  leftWeight: number;
  rightWeight: number;
  leftDistance: number;
  rightDistance: number;
  balanced: boolean;
}) {
  const leverRef = useRef<THREE.Group>(null);
  const [rotation, setRotation] = useState(0);

  useFrame((state, delta) => {
    if (leverRef.current) {
      // 计算目标角度
      const leftMoment = leftWeight * leftDistance;
      const rightMoment = rightWeight * rightDistance;
      let targetRotation = 0;

      if (!balanced) {
        if (leftMoment > rightMoment) {
          targetRotation = -0.3;
        } else if (rightMoment > leftMoment) {
          targetRotation = 0.3;
        }
      }

      // 平滑过渡
      setRotation((prev) => {
        const diff = targetRotation - prev;
        return prev + diff * 0.05;
      });

      leverRef.current.rotation.z = rotation;
    }
  });

  return (
    <group ref={leverRef}>
      {/* 支点（三角形） */}
      <mesh position={[0, -0.5, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.5, 1, 4]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* 杠杆板 */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[8, 0.2, 1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* 左侧重量 */}
      <mesh position={[-leftDistance, 0.5, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#22C55E" />
      </mesh>
      <mesh position={[-leftDistance, 0.5, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.9]} />
        <meshStandardMaterial color="#16A34A" />
      </mesh>

      {/* 右侧重量 */}
      <mesh position={[rightDistance, 0.5, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#EAB308" />
      </mesh>
      <mesh position={[rightDistance, 0.5, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.9]} />
        <meshStandardMaterial color="#CA8A04" />
      </mesh>

      {/* 刻度线 */}
      {[1, 2, 3].map((i) => (
        <group key={`left-${i}`}>
          <mesh position={[-i * 1.2, 0.15, 0.51]}>
            <boxGeometry args={[0.05, 0.1, 0.05]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[i * 1.2, 0.15, 0.51]}>
            <boxGeometry args={[0.05, 0.1, 0.05]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function LessonLever() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [leftWeight, setLeftWeight] = useState(2);
  const [rightWeight, setRightWeight] = useState(2);
  const [leftDistance, setLeftDistance] = useState(2);
  const [rightDistance, setRightDistance] = useState(2);
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // 计算是否平衡
  const balanced = leftWeight * leftDistance === rightWeight * rightDistance;

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
      title: '认识杠杆',
      description: '观察跷跷板的结构，找出支点、动力臂和阻力臂',
      checkCondition: () => true,
      hint: '太棒了！支点是中间的三角形，动力臂是施加力量的部分！',
    },
    {
      id: 2,
      title: '动力臂探索',
      description: '调节左侧距离，观察动力臂长度对平衡的影响',
      checkCondition: () => leftDistance >= 2,
      hint: '正确！动力臂越长，需要的力量越小！',
    },
    {
      id: 3,
      title: '阻力臂探索',
      description: '调节右侧重量和距离，找到平衡点',
      checkCondition: () => balanced,
      hint: '对了！当左右两边的力矩相等时，杠杆就平衡了！',
    },
    {
      id: 4,
      title: '平衡条件',
      description: '让杠杆平衡：左侧2kg×距离2 = 右侧4kg×距离1',
      checkCondition: () => balanced && leftWeight === 2 && rightWeight === 4,
      hint: '完美！动力×动力臂 = 阻力×阻力臂！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '⚖️ 杠杆平衡的条件是什么？',
      options: [
        '左边重量 = 右边重量',
        '左边力矩 = 右边力矩',
        '左边距离 = 右边距离',
        '随便放就行',
      ],
      correctAnswer: 1,
      hint: '提示: 力矩 = 重量 × 距离',
      explanation: '正确！当左边力矩（重量×距离）等于右边力矩时，杠杆平衡！',
    },
    {
      id: 2,
      question: '🎯 如果左边2kg距离3格，右边3kg应该放在哪里？',
      options: ['距离1格', '距离2格', '距离3格', '距离4格'],
      correctAnswer: 1,
      hint: '提示: 2×3 = 3×?',
      explanation: '太棒了！2×3=6，3×2=6，所以应该放在距离2格！',
    },
    {
      id: 3,
      question: '💪 动力臂越长，需要的力量会怎样？',
      options: ['越大', '越小', '不变', '不知道'],
      correctAnswer: 1,
      hint: '提示: 想想用撬棍撬石头',
      explanation: '对了！动力臂越长，越省力！这就是杠杆原理！',
    },
    {
      id: 4,
      question: '🏗️ 生活中哪个不是杠杆的应用？',
      options: ['跷跷板', '撬棍', '滑轮', '筷子'],
      correctAnswer: 2,
      hint: '提示: 滑轮是另一种简单机械',
      explanation: '正确！滑轮是另一种简单机械，不是杠杆！',
    },
    {
      id: 5,
      question: '🔬 杠杆的三要素是什么？',
      options: [
        '支点、动力、阻力',
        '支点、动力臂、阻力臂',
        '重量、距离、力矩',
        '长度、宽度、高度',
      ],
      correctAnswer: 1,
      hint: '提示: 和支点相关的两部分',
      explanation: '太聪明了！杠杆的三要素是支点、动力臂和阻力臂！',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-green-900/20 to-yellow-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">⚖️</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">跷跷板科学</h1>
              <p className="text-sm text-green-300">发现杠杆的奥秘</p>
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
                <h2 className="text-2xl font-bold text-white mb-2">公园跷跷板</h2>
                <p className="text-lg text-green-200 leading-relaxed">
                  小明和<span className="text-2xl mx-1">👦</span>小华在公园玩<span className="text-2xl mx-1">⚖️</span>跷跷板！
                  小明很奇怪：<span className="text-2xl mx-1">🤔</span>为什么我坐在这个位置，
                  跷跷板就不平衡了呢？
                  <br />
                  <span className="text-yellow-300 font-bold">
                    让我们来探索杠杆的平衡条件吧！
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
                    🎨 跷跷板实验室
                  </h2>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400">
                      {balanced ? '⚖️ 平衡' : '⚠️ 不平衡'}
                    </div>
                    <div className="text-sm text-green-300 mt-1">
                      左边力矩: {leftWeight * leftDistance} |
                      右边力矩: {rightWeight * rightDistance}
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
                    <Lever3D
                      leftWeight={leftWeight}
                      rightWeight={rightWeight}
                      leftDistance={leftDistance}
                      rightDistance={rightDistance}
                      balanced={balanced}
                    />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-green-200 text-sm mt-4 text-center">
                  💡 调节重量和距离，让跷跷板平衡！
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

                {/* 左侧重量 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    🟦 左边重量: {leftWeight} kg
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={leftWeight}
                    onChange={(e) => setLeftWeight(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>1kg</span>
                    <span>5kg</span>
                  </div>
                </div>

                {/* 左侧距离 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    📏 左边距离: {leftDistance} 格
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="1"
                    value={leftDistance}
                    onChange={(e) => setLeftDistance(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>近</span>
                    <span>远</span>
                  </div>
                </div>

                {/* 右侧重量 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    🟨 右边重量: {rightWeight} kg
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={rightWeight}
                    onChange={(e) => setRightWeight(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>1kg</span>
                    <span>5kg</span>
                  </div>
                </div>

                {/* 右侧距离 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    📏 右边距离: {rightDistance} 格
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="1"
                    value={rightDistance}
                    onChange={(e) => setRightDistance(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>近</span>
                    <span>远</span>
                  </div>
                </div>

                {/* 知识点 */}
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-yellow-500/10 border-2 border-green-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                    📖 杠杆原理
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      <span>
                        <span className="text-white font-bold">支点</span>
                        <br />
                        <span className="text-xs">杠杆绕着转动的固定点</span>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span>
                        <span className="text-white font-bold">平衡条件</span>
                        <br />
                        <span className="text-xs">动力×动力臂 = 阻力×阻力臂</span>
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
                    古希腊的阿基米德说过："给我一个支点，我就能撬起整个地球！" 🌍
                  </p>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="杠杆挑战赛"
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
            <p className="text-2xl text-white mb-2">你掌握了杠杆原理！</p>
            <p className="text-xl text-green-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-yellow-300 mb-6">你真是个物理小天才！</p>
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
