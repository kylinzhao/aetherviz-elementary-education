import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';

// 电路元件可视化组件
function CircuitVisualization({ bulbOn, batteryCount, circuitType }: { bulbOn: boolean; batteryCount: number; circuitType: 'simple' | 'series' | 'parallel' }) {
  const bulbColor = bulbOn ? '#FFD700' : '#4A4A4A';
  const wireColor = '#3B82F6';
  const batteryColor = '#F59E0B';

  return (
    <group>
      {/* 电池 */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[1.5, 0.8, 0.5]} />
        <meshStandardMaterial color={batteryColor} />
      </mesh>
      <mesh position={[0, 2, 0.3]}>
        <boxGeometry args={[0.3, 0.4, 0.1]} />
        <meshStandardMaterial color="#D97706" />
      </mesh>

      {/* 导线 - 简单电路 */}
      {circuitType === 'simple' && (
        <>
          {/* 左边导线 */}
          <mesh position={[-1, 1, 0]}>
            <boxGeometry args={[0.15, 2, 0.15]} />
            <meshStandardMaterial color={wireColor} emissive={bulbOn ? wireColor : '#000000'} emissiveIntensity={bulbOn ? 0.3 : 0} />
          </mesh>
          {/* 右边导线 */}
          <mesh position={[1, 1, 0]}>
            <boxGeometry args={[0.15, 2, 0.15]} />
            <meshStandardMaterial color={wireColor} emissive={bulbOn ? wireColor : '#000000'} emissiveIntensity={bulbOn ? 0.3 : 0} />
          </mesh>
          {/* 底部导线 */}
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[2.15, 0.15, 0.15]} />
            <meshStandardMaterial color={wireColor} emissive={bulbOn ? wireColor : '#000000'} emissiveIntensity={bulbOn ? 0.3 : 0} />
          </mesh>
        </>
      )}

      {/* 串联电路 */}
      {circuitType === 'series' && (
        <>
          <mesh position={[-1.5, 1, 0]}>
            <boxGeometry args={[0.15, 2, 0.15]} />
            <meshStandardMaterial color={wireColor} emissive={bulbOn ? wireColor : '#000000'} emissiveIntensity={bulbOn ? 0.3 : 0} />
          </mesh>
          <mesh position={[1.5, 1, 0]}>
            <boxGeometry args={[0.15, 2, 0.15]} />
            <meshStandardMaterial color={wireColor} emissive={bulbOn ? wireColor : '#000000'} emissiveIntensity={bulbOn ? 0.3 : 0} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[3.15, 0.15, 0.15]} />
            <meshStandardMaterial color={wireColor} emissive={bulbOn ? wireColor : '#000000'} emissiveIntensity={bulbOn ? 0.3 : 0} />
          </mesh>
          {/* 第二个灯泡 */}
          <mesh position={[0, 0.3, 0.5]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial color={bulbColor} emissive={bulbColor} emissiveIntensity={bulbOn ? 0.8 : 0} />
          </mesh>
        </>
      )}

      {/* 并联电路 */}
      {circuitType === 'parallel' && (
        <>
          {/* 主干导线 */}
          <mesh position={[-2, 1.5, 0]}>
            <boxGeometry args={[0.15, 1, 0.15]} />
            <meshStandardMaterial color={wireColor} emissive={bulbOn ? wireColor : '#000000'} emissiveIntensity={bulbOn ? 0.3 : 0} />
          </mesh>
          {/* 分支1 */}
          <mesh position={[-1, 1, 0]}>
            <boxGeometry args={[0.15, 1.5, 0.15]} />
            <meshStandardMaterial color={wireColor} emissive={bulbOn ? wireColor : '#000000'} emissiveIntensity={bulbOn ? 0.3 : 0} />
          </mesh>
          {/* 分支2 */}
          <mesh position={[1, 1, 0]}>
            <boxGeometry args={[0.15, 1.5, 0.15]} />
            <meshStandardMaterial color={wireColor} emissive={bulbOn ? wireColor : '#000000'} emissiveIntensity={bulbOn ? 0.3 : 0} />
          </mesh>
          {/* 底部连接 */}
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[4.15, 0.15, 0.15]} />
            <meshStandardMaterial color={wireColor} emissive={bulbOn ? wireColor : '#000000'} emissiveIntensity={bulbOn ? 0.3 : 0} />
          </mesh>
          {/* 第二个灯泡 */}
          <mesh position={[1, 1, 0.5]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial color={bulbColor} emissive={bulbColor} emissiveIntensity={bulbOn ? 0.8 : 0} />
          </mesh>
        </>
      )}

      {/* 主灯泡 */}
      <mesh position={circuitType === 'simple' ? [0, 0.3, 0.5] : [-1, 0.3, 0.5]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color={bulbColor} emissive={bulbColor} emissiveIntensity={bulbOn ? 1 : 0} />
      </mesh>

      {/* 开关 */}
      <mesh position={[circuitType === 'simple' ? 0 : circuitType === 'series' ? -1.5 : -2, 1, 0]}>
        <boxGeometry args={[0.3, 0.6, 0.3]} />
        <meshStandardMaterial color="#10B981" />
      </mesh>

      {/* 光晕效果（仅在灯泡亮起时） */}
      {bulbOn && (
        <pointLight
          position={[circuitType === 'simple' ? 0 : circuitType === 'series' ? -1 : 0, 0.5, 0.5]}
          color="#FFD700"
          intensity={2}
          distance={5}
        />
      )}
    </group>
  );
}

export default function LessonCircuit() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [bulbOn, setBulbOn] = useState(true);
  const [batteryCount, setBatteryCount] = useState(1);
  const [circuitType, setCircuitType] = useState<'simple' | 'series' | 'parallel'>('simple');
  const [currentStep, setCurrentStep] = useState(1);
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // 视角控制函数
  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 5, 8);
      cameraRef.current.lookAt(0, 1, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 1, 0);
      controlsRef.current.update();
    }
  };

  const topView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 12, 0.001);
      cameraRef.current.lookAt(0, 1, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 1, 0);
      controlsRef.current.update();
    }
  };

  const frontView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 2, 12);
      cameraRef.current.lookAt(0, 1, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 1, 0);
      controlsRef.current.update();
    }
  };

  const sideView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(12, 2, 0);
      cameraRef.current.lookAt(0, 1, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 1, 0);
      controlsRef.current.update();
    }
  };

  const isoView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(8, 8, 8);
      cameraRef.current.lookAt(0, 1, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 1, 0);
      controlsRef.current.update();
    }
  };

  // 定义引导任务
  const tasks: Task[] = [
    {
      id: 1,
      title: '打开开关，点亮灯泡',
      description: '点击"开关"按钮，让小灯泡亮起来！',
      checkCondition: () => bulbOn,
      hint: '太棒了！电流通过了，灯泡亮了！',
    },
    {
      id: 2,
      title: '试试串联电路',
      description: '点击"串联电路"按钮，看看两个灯泡会怎样？',
      checkCondition: () => circuitType === 'series',
      hint: '观察到了吗？串联电路中灯泡会变暗一些！',
    },
    {
      id: 3,
      title: '试试并联电路',
      description: '点击"并联电路"按钮，比较和串联有什么不同？',
      checkCondition: () => circuitType === 'parallel',
      hint: '对了！并联电路中每个灯泡都很亮！',
    },
    {
      id: 4,
      title: '关闭开关观察',
      description: '点击"开关"关闭灯泡，观察电路断开时的状态',
      checkCondition: () => !bulbOn && currentStep === 4,
      hint: '明白了吗？开关断开，电流无法通过！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '🔌 电路中必不可少的元件不包括下列哪个？',
      options: ['电源', '导线', '用电器', '开关'],
      correctAnswer: 3,
      hint: '提示: 想想最简单的电路需要什么？',
      explanation: '正确！开关不是必须的，但它能控制电路的通断！',
    },
    {
      id: 2,
      question: '💡 串联电路中，一个灯泡坏了，另一个灯泡会？',
      options: ['更亮', '继续亮', '也熄灭', '闪烁'],
      correctAnswer: 2,
      hint: '提示: 串联电路只有一条电流路径',
      explanation: '对！串联电路只有一条路，一处断开全部没电！',
    },
    {
      id: 3,
      question: '💡 并联电路中，一个灯泡坏了，另一个灯泡会？',
      options: ['更亮', '继续亮', '也熄灭', '闪烁'],
      correctAnswer: 1,
      hint: '提示: 并联电路有多条独立的电流路径',
      explanation: '正确！并联电路各支路独立，一个坏了不影响其他！',
    },
    {
      id: 4,
      question: '🔌 家里的电器是怎样连接的？',
      options: ['串联', '并联', '有时串联有时并联', '都不对'],
      correctAnswer: 1,
      hint: '提示: 想想电视坏了，冰箱还会工作吗？',
      explanation: '聪明！家用电器都是并联的，这样才能独立控制！',
    },
    {
      id: 5,
      question: '🔋 增加电池数量，灯泡会？',
      options: ['变暗', '不变', '变亮', '闪烁'],
      correctAnswer: 2,
      hint: '提示: 更多电池意味着更强的电力',
      explanation: '太棒了！电池增多，电流增强，灯泡更亮！',
    },
  ];

  const handleTaskComplete = (taskId: number) => {
    if (taskId === currentStep && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-yellow-900/20 to-blue-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">🔌</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">小电工实验室</h1>
              <p className="text-sm text-yellow-300">探索电路的奥秘</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-blue-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">点亮小灯泡</h2>
                <p className="text-lg text-yellow-200 leading-relaxed">
                  小电工<span className="text-2xl mx-1">👷</span>收到一个任务：
                  要让黑暗的房间<span className="text-2xl mx-1">🏠</span>亮起来！
                  他需要连接<span className="text-2xl mx-1">🔋</span>电池、
                  <span className="text-2xl mx-1">💡</span>灯泡和
                  <span className="text-2xl mx-1">🔌</span>导线。
                  <br />
                  <span className="text-yellow-300 font-bold">
                    让我们帮小电工搭建电路，点亮小灯泡吧！
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
                    🎨 电路实验台
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm text-yellow-300">电路类型</div>
                      <div className="text-lg font-bold text-white">
                        {circuitType === 'simple' ? '简单电路' : circuitType === 'series' ? '串联电路' : '并联电路'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-yellow-300">灯泡状态</div>
                      <div className="text-lg font-bold" style={{ color: bulbOn ? '#FFD700' : '#9CA3AF' }}>
                        {bulbOn ? '💡 亮' : '💡 暗'}
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
                    <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 5, 8]} fov={60} />
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 20, 10]} castShadow />
                    <CircuitVisualization bulbOn={bulbOn} batteryCount={batteryCount} circuitType={circuitType} />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-yellow-200 text-sm mt-4 text-center">
                  💡 拖动鼠标旋转视角，滚轮缩放 | 使用按钮切换不同电路类型
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

                {/* 开关控制 */}
                <div className="mb-6">
                  <button
                    onClick={() => {
                      setBulbOn(!bulbOn);
                      if (currentStep === 3) setCurrentStep(4);
                    }}
                    className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                      bulbOn
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                        : 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
                    }`}
                  >
                    {bulbOn ? '🔓 开关已打开' : '🔒 开关已关闭'}
                  </button>
                </div>

                {/* 电路类型选择 */}
                <div className="space-y-3 mb-6">
                  <label className="block text-white font-bold text-lg">选择电路类型：</label>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => {
                        setCircuitType('simple');
                        if (currentStep === 2) setCurrentStep(3);
                      }}
                      className={`py-3 px-4 rounded-lg font-bold transition-all ${
                        circuitType === 'simple'
                          ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      🔌 简单电路
                    </button>
                    <button
                      onClick={() => {
                        setCircuitType('series');
                        if (currentStep === 1) setCurrentStep(2);
                      }}
                      className={`py-3 px-4 rounded-lg font-bold transition-all ${
                        circuitType === 'series'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      🔗 串联电路
                    </button>
                    <button
                      onClick={() => setCircuitType('parallel')}
                      className={`py-3 px-4 rounded-lg font-bold transition-all ${
                        circuitType === 'parallel'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      🔄 并联电路
                    </button>
                  </div>
                </div>

                {/* 电池数量 */}
                <div className="space-y-4">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    🔋 电池数量: {batteryCount}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="1"
                    value={batteryCount}
                    onChange={(e) => setBatteryCount(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>1节</span>
                    <span>2节</span>
                    <span>3节</span>
                  </div>
                </div>
              </div>

              {/* 知识点 */}
              <div className="glass-panel rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  📚 知识小贴士
                </h3>
                <div className="space-y-3 text-sm text-slate-300">
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="font-bold text-yellow-400 mb-1">🔌 电路元件</div>
                    <div>电源、导线、用电器是电路的基本组成部分</div>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="font-bold text-blue-400 mb-1">🔗 串联电路</div>
                    <div>元件依次连接，只有一条电流路径</div>
                  </div>
                  <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <div className="font-bold text-purple-400 mb-1">🔄 并联电路</div>
                    <div>元件并列连接，有多条电流路径</div>
                  </div>
                </div>
              </div>

              {/* 小测验 */}
              <QuizGame
                title="电路小测验"
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
