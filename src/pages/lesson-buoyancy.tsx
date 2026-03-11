import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';

// 浮力实验可视化组件
function BuoyancyVisualization({
  objectType,
  waterLevel,
  submerged,
}: {
  objectType: 'wood' | 'iron' | 'submarine';
  waterLevel: number;
  submerged: number;
}) {
  const objectColor = objectType === 'wood' ? '#8B4513' : objectType === 'iron' ? '#4A5568' : '#1E40AF';
  const objectY = objectType === 'wood' ? waterLevel + 0.5 : objectType === 'iron' ? -1 : 0;

  return (
    <group>
      {/* 水面 */}
      <mesh position={[0, waterLevel, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[6, 0.1, 4]} />
        <meshStandardMaterial color="#3B82F6" transparent opacity={0.6} />
      </mesh>

      {/* 水体 */}
      <mesh position={[0, waterLevel - 2.5, 0]}>
        <boxGeometry args={[6, 5, 4]} />
        <meshStandardMaterial color="#60A5FA" transparent opacity={0.3} />
      </mesh>

      {/* 物体 */}
      <mesh position={[0, objectY, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={objectColor} />
      </mesh>

      {/* 潜水艇的特殊显示 */}
      {objectType === 'submarine' && (
        <>
          {/* 潜水艇主体 */}
          <mesh position={[0, objectY, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.6, 0.6, 2, 16]} />
            <meshStandardMaterial color="#1E40AF" />
          </mesh>
          {/* 潜望镜 */}
          <mesh position={[0, objectY + 1, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          {/* 螺旋桨 */}
          <mesh position={[0, objectY, 1.2]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.1, 0.8, 0.1]} />
            <meshStandardMaterial color="#64748B" />
          </mesh>
        </>
      )}

      {/* 浮力箭头（当物体浮起时） */}
      {objectType === 'wood' && (
        <group position={[1.5, objectY, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <coneGeometry args={[0.2, 0.8, 8]} />
            <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.5} />
          </mesh>
        </group>
      )}

      {/* 重力箭头 */}
      <group position={[-1.5, objectY, 0]}>
        <mesh rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.2, 0.8, 8]} />
          <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* 刻度线 */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} position={[3, waterLevel - i * 0.5, 0]}>
          <boxGeometry args={[0.3, 0.02, 0.02]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      ))}
    </group>
  );
}

export default function LessonBuoyancy() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [objectType, setObjectType] = useState<'wood' | 'iron' | 'submarine'>('wood');
  const [waterLevel, setWaterLevel] = useState(0);
  const [submerged, setSubmerged] = useState(50);
  const [currentStep, setCurrentStep] = useState(1);
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // 视角控制函数
  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(6, 4, 8);
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
      title: '观察木块漂浮',
      description: '点击"木块"按钮，观察木块在水中的表现',
      checkCondition: () => objectType === 'wood',
      hint: '太棒了！木块浮在水面上！',
    },
    {
      id: 2,
      title: '观察铁块下沉',
      description: '点击"铁块"按钮，看看铁块会怎样？',
      checkCondition: () => objectType === 'iron',
      hint: '正确！铁块沉到了水底！',
    },
    {
      id: 3,
      title: '调节水位高度',
      description: '拖动"水位高度"滑块，观察水位变化',
      checkCondition: () => waterLevel !== 0,
      hint: '很好！你学会了调节水位！',
    },
    {
      id: 4,
      title: '认识潜水艇',
      description: '点击"潜水艇"按钮，了解潜水艇的浮沉原理',
      checkCondition: () => objectType === 'submarine',
      hint: '太聪明了！潜水艇通过改变自身重量来上浮下沉！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '⛵ 为什么木块能浮在水面上？',
      options: ['木块比水轻', '木块密度比水小', '木块有魔法', '水托着木块'],
      correctAnswer: 1,
      hint: '提示: 密度是物质的重要特性',
      explanation: '正确！木块密度小于水，所以能浮起来！',
    },
    {
      id: 2,
      question: '⚓ 为什么铁块会沉到水底？',
      options: ['铁块比水重', '铁块密度比水大', '铁块不喜欢水', '水推不动铁块'],
      correctAnswer: 1,
      hint: '提示: 想想铁的密度和水的密度谁大？',
      explanation: '对！铁块密度大于水，所以会沉下去！',
    },
    {
      id: 3,
      question: '🚢 巨大的轮船为什么能浮在水面上？',
      options: ['轮船是空的', '轮船形状特殊', '排水量大', '以上都对'],
      correctAnswer: 3,
      hint: '提示: 轮船做成空心是为了增加排水量',
      explanation: '聪明！轮船虽然用钢铁制造，但做成空心后平均密度小于水！',
    },
    {
      id: 4,
      question: '🔬 阿基米德原理告诉我们什么？',
      options: [
        '浮力等于物体重量',
        '浮力等于排开水的重量',
        '浮力与深度有关',
        '浮力与物体颜色有关',
      ],
      correctAnswer: 1,
      hint: '提示: 浮力的大小与排开液体的重量有关',
      explanation: '正确！阿基米德原理：浮力等于物体排开液体的重量！',
    },
    {
      id: 5,
      question: '🚤 潜水艇是怎样上浮和下沉的？',
      options: [
        '改变潜水艇颜色',
        '改变潜水艇大小',
        '改变自身重量',
        '用桨划水',
      ],
      correctAnswer: 2,
      hint: '提示: 潜水艇通过调节水舱中的水量来控制浮沉',
      explanation: '太棒了！潜水艇通过调节水舱中的水改变自身重量来上浮下沉！',
    },
  ];

  const handleTaskComplete = (taskId: number) => {
    if (taskId === currentStep && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900/20 to-cyan-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">⛵</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">浮力小实验</h1>
              <p className="text-sm text-cyan-300">探索浮沉的奥秘</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">游泳池的秘密</h2>
                <p className="text-lg text-cyan-200 leading-relaxed">
                  夏天到了，小明<span className="text-2xl mx-1">🏊</span>去游泳池玩。
                  他发现一个奇怪的现象：
                  有些东西会<span className="text-2xl mx-1">⬆️</span>浮在水面上，
                  有些东西会<span className="text-2xl mx-1">⬇️</span>沉到水底。
                  <br />
                  <span className="text-cyan-300 font-bold">
                    这是为什么呢？让我们一起来探索浮力的秘密吧！
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
                    🎨 浮力实验台
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm text-cyan-300">物体类型</div>
                      <div className="text-lg font-bold text-white">
                        {objectType === 'wood' ? '🪵 木块' : objectType === 'iron' ? '🔩 铁块' : '🚤 潜水艇'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-cyan-300">状态</div>
                      <div className="text-lg font-bold text-white">
                        {objectType === 'wood' ? '⬆️ 漂浮' : objectType === 'iron' ? '⬇️ 下沉' : '🔄 可控'}
                      </div>
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
                    <PerspectiveCamera makeDefault ref={cameraRef} position={[6, 4, 8]} fov={60} />
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 20, 10]} castShadow />
                    <BuoyancyVisualization
                      objectType={objectType}
                      waterLevel={waterLevel}
                      submerged={submerged}
                    />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-cyan-200 text-sm mt-4 text-center">
                  💡 拖动鼠标旋转视角，滚轮缩放 | 切换不同物体观察浮沉现象
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

                {/* 物体选择 */}
                <div className="space-y-3 mb-6">
                  <label className="block text-white font-bold text-lg">选择物体：</label>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => {
                        setObjectType('wood');
                        if (currentStep === 0) setCurrentStep(1);
                      }}
                      className={`py-3 px-4 rounded-lg font-bold transition-all ${
                        objectType === 'wood'
                          ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      🪵 木块
                    </button>
                    <button
                      onClick={() => {
                        setObjectType('iron');
                        if (currentStep === 1) setCurrentStep(2);
                      }}
                      className={`py-3 px-4 rounded-lg font-bold transition-all ${
                        objectType === 'iron'
                          ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      🔩 铁块
                    </button>
                    <button
                      onClick={() => {
                        setObjectType('submarine');
                        if (currentStep === 3) setCurrentStep(4);
                      }}
                      className={`py-3 px-4 rounded-lg font-bold transition-all ${
                        objectType === 'submarine'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      🚤 潜水艇
                    </button>
                  </div>
                </div>

                {/* 水位调节 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    💧 水位高度: {waterLevel.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="-2"
                    max="2"
                    step="0.1"
                    value={waterLevel}
                    onChange={(e) => {
                      setWaterLevel(Number(e.target.value));
                      if (currentStep === 2) setCurrentStep(3);
                    }}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>低</span>
                    <span>高</span>
                  </div>
                </div>

                {/* 浸入程度 */}
                <div className="space-y-4">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    🌊 浸入程度: {submerged}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={submerged}
                    onChange={(e) => setSubmerged(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* 知识点 */}
              <div className="glass-panel rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  📚 知识小贴士
                </h3>
                <div className="space-y-3 text-sm text-slate-300">
                  <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                    <div className="font-bold text-cyan-400 mb-1">⬆️ 浮力</div>
                    <div>物体在液体中受到向上的托力</div>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="font-bold text-blue-400 mb-1">🔬 阿基米德原理</div>
                    <div>浮力等于排开液体的重量</div>
                  </div>
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                    <div className="font-bold text-indigo-400 mb-1">🚤 潜水艇原理</div>
                    <div>通过改变自身重量控制浮沉</div>
                  </div>
                </div>
              </div>

              {/* 小测验 */}
              <QuizGame
                title="浮力小测验"
                questions={quizQuestions}
                onComplete={setQuizScore}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
