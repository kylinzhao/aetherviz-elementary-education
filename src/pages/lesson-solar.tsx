import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';

// 太阳系可视化组件
function SolarVisualization({ planetIndex }: { planetIndex: number }) {
  const sunRef = useRef<THREE.Mesh>(null);
  const planetsRef = useRef<(THREE.Group | null)[]>([]);

  useFrame(({ clock }) => {
    if (sunRef.current) {
      sunRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
    planetsRef.current.forEach((planet, i) => {
      if (planet) {
        const speed = (8 - i) * 0.1;
        planet.rotation.y = clock.getElapsedTime() * speed;
      }
    });
  });

  const planetData = [
    { name: '水星', color: '#9ca3af', size: 0.3, distance: 2.5 },
    { name: '金星', color: '#fbbf24', size: 0.5, distance: 3.5 },
    { name: '地球', color: '#3b82f6', size: 0.5, distance: 4.5 },
    { name: '火星', color: '#ef4444', size: 0.4, distance: 5.5 },
    { name: '木星', color: '#d97706', size: 1.2, distance: 7.5 },
    { name: '土星', color: '#fcd34d', size: 1.0, distance: 9.5, hasRing: true },
    { name: '天王星', color: '#22d3ee', size: 0.7, distance: 11.5 },
    { name: '海王星', color: '#3b82f6', size: 0.7, distance: 13.5 },
  ];

  return (
    <group>
      {/* 太阳 */}
      <mesh ref={sunRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={1} />
        <pointLight color="#fbbf24" intensity={2} distance={20} />
      </mesh>

      {/* 行星 */}
      {planetData.map((planet, i) => (
        <group key={i} ref={(el) => (planetsRef.current[i] = el)}>
          <mesh position={[planet.distance, 0, 0]}>
            <sphereGeometry args={[planet.size, 32, 32]} />
            <meshStandardMaterial
              color={planet.color}
              emissive={planet.color}
              emissiveIntensity={planetIndex === i + 1 ? 0.5 : 0.2}
            />
          </mesh>
          {/* 土星环 */}
          {planet.hasRing && (
            <mesh position={[planet.distance, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[planet.size * 1.4, planet.size * 2, 32]} />
              <meshStandardMaterial color="#fcd34d" side={2} transparent opacity={0.7} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

export default function LessonSolar() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [planetIndex, setPlanetIndex] = useState(1);
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // 视角控制函数
  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(10, 8, 12);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const topView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 20, 0.001);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const frontView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 2, 20);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const sideView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(20, 2, 0);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const isoView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(12, 12, 12);
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
      title: '认识太阳',
      description: '点击"太阳"按钮，观察太阳系的中心',
      checkCondition: () => planetIndex === 0,
      hint: '太棒了！太阳是太阳系的中心，给所有行星提供光和热！',
    },
    {
      id: 2,
      title: '观察内行星',
      description: '点击"水星金星地球"按钮，看看内太阳系',
      checkCondition: () => planetIndex === 1,
      hint: '很好！水星、金星、地球是离太阳最近的行星！',
    },
    {
      id: 3,
      title: '发现火星和木星',
      description: '点击"火星木星"按钮，看看红色的火星和巨大的木星',
      checkCondition: () => planetIndex === 2,
      hint: '真聪明！火星是红色星球，木星是最大的行星！',
    },
    {
      id: 4,
      title: '探索土星和天王星',
      description: '点击"土星天王"按钮，观察带环的土星',
      checkCondition: () => planetIndex === 3,
      hint: '哇！土星有美丽的光环，天王星是躺着转的！',
    },
    {
      id: 5,
      title: '拜访海王星',
      description: '点击"海王星"按钮，看看最远的蓝色行星',
      checkCondition: () => planetIndex === 4,
      hint: '太酷了！海王星是太阳系最远的行星，也是蓝色的！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '☀️ 太阳系最大的行星是哪颗？',
      options: ['地球', '火星', '木星', '土星'],
      correctAnswer: 2,
      hint: '提示：它是离太阳第五远的行星',
      explanation: '正确！木星是太阳系中最大的行星，体积可以装下1300多个地球！',
    },
    {
      id: 2,
      question: '☀️ 哪颗行星被称为"红色星球"？',
      options: ['金星', '火星', '木星', '水星'],
      correctAnswer: 1,
      hint: '提示：它的名字和战争之神有关',
      explanation: '太棒了！火星因为表面富含氧化铁而呈现红色！',
    },
    {
      id: 3,
      question: '☀️ 太阳系有光环的行星是？',
      options: ['只有土星', '只有木星', '土星、木星、天王星、海王星都有', '所有行星都有'],
      correctAnswer: 2,
      hint: '提示：不止一颗行星有光环',
      explanation: '对！虽然土星的光环最明显，但木星、天王星和海王星也有光环！',
    },
    {
      id: 4,
      question: '☀️ 离太阳最近的行星是？',
      options: ['金星', '地球', '水星', '火星'],
      correctAnswer: 2,
      hint: '提示：它也是最小的行星',
      explanation: '正确！水星是离太阳最近的行星，也是最小的行星！',
    },
    {
      id: 5,
      question: '☀️ 地球在太阳系中排第几？',
      options: ['第2颗', '第3颗', '第4颗', '第5颗'],
      correctAnswer: 1,
      hint: '提示：想想水星和金星后面是哪颗？',
      explanation: '太聪明了！地球是太阳系第3颗行星，也是我们美丽的家园！',
    },
  ];

  const getPlanetTitle = (index: number) => {
    switch (index) {
      case 0: return '☀️ 太阳';
      case 1: return '🌍 内行星：水星、金星、地球';
      case 2: return '🔴 火星与木星';
      case 3: return '🪐 土星与天王星';
      case 4: return '🔵 海王星';
      default: return '🌌 太阳系';
    }
  };

  const getPlanetDescription = (index: number) => {
    switch (index) {
      case 0: return '太阳是太阳系的中心，是一颗巨大的恒星，给所有行星提供光和热。太阳的质量占整个太阳系的99.86%！';
      case 1: return '水星是最小最快的行星，金星是最热的行星，地球是我们的家园，也是已知唯一有生命的行星。';
      case 2: return '火星是红色的行星，有巨大的火山和峡谷；木星是最大的行星，有著名的大红斑风暴。';
      case 3: return '土星有美丽的光环系统；天王星是冰巨星，它的自转轴几乎躺平了，像是在"打滚"运行。';
      case 4: return '海王星是最远的行星，是一颗深蓝色的冰巨星，有强烈的风暴，风速可达每小时2000公里！';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-gray-900/20 to-black/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">☀️</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">太阳系家族</h1>
              <p className="text-sm text-yellow-300">探索宇宙的奥秘</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">太空旅行</h2>
                <p className="text-lg text-yellow-100 leading-relaxed">
                  欢迎来到<span className="text-2xl mx-1">🌌</span>太空旅行！
                  今天我们要一起探索<span className="text-2xl mx-1">☀️</span>太阳系家族。
                  <br />
                  <span className="text-yellow-200 font-bold">
                    太阳系就像一个大家庭，太阳是家长，八大行星是孩子。
                  </span>
                  <br />
                  <span className="text-amber-400 font-bold">
                    让我们坐上太空船，开始这段奇妙的旅程吧！🚀
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
                    🎨 {getPlanetTitle(planetIndex)}
                  </h2>
                  <ViewControlButtons
                    onReset={resetView}
                    onTopView={topView}
                    onFrontView={frontView}
                    onSideView={sideView}
                    onIsoView={isoView}
                  />
                </div>
                <div className="w-full h-[400px] rounded-lg overflow-hidden bg-black/50">
                  <Canvas shadows gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
                    <PerspectiveCamera makeDefault ref={cameraRef} position={[10, 8, 12]} fov={60} />
                    <ambientLight intensity={0.3} />
                    <SolarVisualization planetIndex={planetIndex} />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-yellow-200 text-sm mt-4 text-center">
                  💡 {getPlanetDescription(planetIndex)}
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
                  🎛️ 行星选择
                </h2>

                {/* 行星按钮 */}
                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => setPlanetIndex(0)}
                    className={`w-full p-4 rounded-xl font-bold transition-all ${
                      planetIndex === 0
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white ring-2 ring-yellow-400'
                        : 'bg-slate-700/50 text-yellow-200 hover:bg-slate-600/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">☀️</div>
                    <div className="text-sm">太阳</div>
                  </button>
                  <button
                    onClick={() => setPlanetIndex(1)}
                    className={`w-full p-4 rounded-xl font-bold transition-all ${
                      planetIndex === 1
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white ring-2 ring-blue-400'
                        : 'bg-slate-700/50 text-blue-200 hover:bg-slate-600/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">🌍</div>
                    <div className="text-sm">水星、金星、地球</div>
                  </button>
                  <button
                    onClick={() => setPlanetIndex(2)}
                    className={`w-full p-4 rounded-xl font-bold transition-all ${
                      planetIndex === 2
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white ring-2 ring-red-400'
                        : 'bg-slate-700/50 text-red-200 hover:bg-slate-600/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">🔴</div>
                    <div className="text-sm">火星、木星</div>
                  </button>
                  <button
                    onClick={() => setPlanetIndex(3)}
                    className={`w-full p-4 rounded-xl font-bold transition-all ${
                      planetIndex === 3
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white ring-2 ring-amber-400'
                        : 'bg-slate-700/50 text-amber-200 hover:bg-slate-600/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">🪐</div>
                    <div className="text-sm">土星、天王星</div>
                  </button>
                  <button
                    onClick={() => setPlanetIndex(4)}
                    className={`w-full p-4 rounded-xl font-bold transition-all ${
                      planetIndex === 4
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white ring-2 ring-blue-500'
                        : 'bg-slate-700/50 text-blue-200 hover:bg-slate-600/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">🔵</div>
                    <div className="text-sm">海王星</div>
                  </button>
                </div>

                {/* 太阳系知识 */}
                <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-2 border-yellow-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
                    📖 太阳系小知识
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <p className="text-yellow-300">
                      太阳系有<span className="font-bold text-white">8颗行星</span>
                    </p>
                    <ul className="space-y-1 ml-2 text-xs">
                      <li>• <span className="text-gray-300">内行星</span>：水星、金星、地球、火星</li>
                      <li>• <span className="text-orange-300">外行星</span>：木星、土星、天王星、海王星</li>
                      <li>• <span className="text-yellow-300">中心</span>：太阳（恒星）</li>
                    </ul>
                  </div>
                </div>

                {/* 小技巧 */}
                <div className="p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-2 border-amber-500/30 rounded-lg">
                  <h3 className="font-bold text-amber-400 mb-2 flex items-center gap-2">
                    💡 探索小贴士
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <span>
                        <span className="text-white font-bold">观察：</span>注意行星的大小和颜色
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <span>
                        <span className="text-white font-bold">思考：</span>行星为什么有不同的颜色？
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="太阳系知识挑战"
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
            <p className="text-2xl text-white mb-2">你完成了太空旅行！</p>
            <p className="text-xl text-yellow-200 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-green-300 mb-6">你真是个小小天文学家！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
