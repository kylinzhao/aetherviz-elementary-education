import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';

// 地图可视化组件
function MapVisualization({ showMap, showProvinces, showCapitals }: {
  showMap: boolean;
  showProvinces: boolean;
  showCapitals: boolean;
}) {
  const mapRef = React.useRef<THREE.Group>(null);

  useFrame((state) => {
    if (mapRef.current) {
      mapRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={mapRef}>
      {/* 中国地图轮廓 - 用立方体简化表示 */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[5, 3, 0.3]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>

      {/* 省份标记 */}
      {showProvinces && (
        <>
          <mesh position={[-1.5, 0.8, 0.3]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0.5, 1, 0.3]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[1.5, -0.5, 0.3]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[-0.8, -1, 0.3]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
          </mesh>
        </>
      )}

      {/* 省会标记 - 星星形状 */}
      {showCapitals && (
        <>
          <mesh position={[-1.5, 0.8, 0.6]} rotation={[0, 0, Math.PI / 4]}>
            <coneGeometry args={[0.15, 0.4, 5]} />
            <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[0.5, 1, 0.6]} rotation={[0, 0, Math.PI / 4]}>
            <coneGeometry args={[0.15, 0.4, 5]} />
            <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[1.5, -0.5, 0.6]} rotation={[0, 0, Math.PI / 4]}>
            <coneGeometry args={[0.15, 0.4, 5]} />
            <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[-0.8, -1, 0.6]} rotation={[0, 0, Math.PI / 4]}>
            <coneGeometry args={[0.15, 0.4, 5]} />
            <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.8} />
          </mesh>
        </>
      )}
    </group>
  );
}

export default function LessonStates() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [showMap, setShowMap] = useState(false);
  const [showProvinces, setShowProvinces] = useState(false);
  const [showCapitals, setShowCapitals] = useState(false);
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

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
      title: '认识中国地图',
      description: '点击"显示地图"按钮，看看我们的祖国',
      checkCondition: () => showMap === true,
      hint: '太棒了！这就是我们祖国的形状，像一只雄鸡！',
    },
    {
      id: 2,
      title: '找找省份在哪里',
      description: '点击"显示省份"按钮，看看有哪些省份',
      checkCondition: () => showProvinces === true,
      hint: '对啦！金色的圆点代表不同的省份！',
    },
    {
      id: 3,
      title: '认识省会城市',
      description: '点击"显示省会"按钮，学习省会城市',
      checkCondition: () => showCapitals === true,
      hint: '真聪明！星星标记的就是省会城市！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '🗺️ 中国地图像什么动物？',
      options: ['兔子', '雄鸡', '老虎', '熊猫'],
      correctAnswer: 1,
      hint: '提示: 想想公鸡的头和尾巴',
      explanation: '正确！中国地图像一只昂首挺胸的雄鸡！',
    },
    {
      id: 2,
      question: '⭐ 什么是省会城市？',
      options: ['最大的城市', '省政府所在的城市', '人口最多的城市', '最古老的城市'],
      correctAnswer: 1,
      hint: '提示: 省会就是省政府所在的地方',
      explanation: '太棒了！省会就是一个省的政治、经济中心！',
    },
    {
      id: 3,
      question: '🏙️ 下面哪个是直辖市？',
      options: ['南京', '北京', '广州', '西安'],
      correctAnswer: 1,
      hint: '提示: 直辖市直接归中央政府管辖',
      explanation: '对！北京是中华人民共和国的首都，也是直辖市！',
    },
    {
      id: 4,
      question: '🌊 中国有多少个省级行政区？',
      options: ['23个', '34个', '56个', '66个'],
      correctAnswer: 1,
      hint: '提示: 包括省、自治区、直辖市和特别行政区',
      explanation: '真聪明！中国有34个省级行政区！',
    },
    {
      id: 5,
      question: '📍 你的家乡在哪里？',
      options: ['东部', '南部', '西部', '北部'],
      correctAnswer: 0,
      hint: '提示: 根据你自己的实际情况回答',
      explanation: '每个人都可以根据自己的实际情况回答这个问题！',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900/30 via-orange-900/20 to-yellow-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">🗺️</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">🧊 物质三态</h1>
              <p className="text-sm text-yellow-300">探索物质的三种形态</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">小小旅行家</h2>
                <p className="text-lg text-yellow-200 leading-relaxed">
                  小明<span className="text-2xl mx-1">🧒</span>是个好奇的旅行家，
                  他背起小书包<span className="text-2xl mx-1">🎒</span>，
                  准备游遍我们伟大的祖国<span className="text-2xl mx-1">🇨🇳</span>！
                  <br />
                  <span className="text-yellow-300 font-bold">
                    让我们一起认识地图、省份和省会城市吧！
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
                    🗺️ 中国地图
                  </h2>
                  <div className="text-center">
                    <div className="text-sm text-yellow-300">
                      {showMap && '🇨🇳 美丽中国'}
                      {!showMap && '点击显示地图'}
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
                    <MapVisualization showMap={showMap} showProvinces={showProvinces} showCapitals={showCapitals} />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-yellow-200 text-sm mt-4 text-center">
                  💡 认识我们的祖国，了解中国的版图！
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

                {/* 地图开关 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    🗺️ 地图显示
                  </label>
                  <button
                    onClick={() => setShowMap(!showMap)}
                    className={`w-full p-3 rounded-lg font-bold transition-all ${
                      showMap
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {showMap ? '隐藏地图' : '显示地图'}
                  </button>
                </div>

                {/* 省份开关 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    📍 省份标记
                  </label>
                  <button
                    onClick={() => setShowProvinces(!showProvinces)}
                    className={`w-full p-3 rounded-lg font-bold transition-all ${
                      showProvinces
                        ? 'bg-yellow-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {showProvinces ? '隐藏省份' : '显示省份'}
                  </button>
                </div>

                {/* 省会开关 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    ⭐ 省会城市
                  </label>
                  <button
                    onClick={() => setShowCapitals(!showCapitals)}
                    className={`w-full p-3 rounded-lg font-bold transition-all ${
                      showCapitals
                        ? 'bg-yellow-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {showCapitals ? '隐藏省会' : '显示省会'}
                  </button>
                </div>

                {/* 地图的知识 */}
                <div className="p-4 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-red-400 mb-3 flex items-center gap-2">
                    📖 什么是地图？
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <p className="text-red-300">
                      地图就是<span className="font-bold">从天空看地面</span>的画！
                    </p>
                    <p className="text-white text-base leading-relaxed">
                      地图上标明了<span className="text-yellow-300 font-bold">山川、河流、城市</span>的位置，
                      帮助我们<span className="text-yellow-300 font-bold">认识世界</span>！
                    </p>
                  </div>
                </div>

                {/* 地图要素 */}
                <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-lg">
                  <h3 className="font-bold text-yellow-400 mb-2 flex items-center gap-2">
                    💡 地图三要素
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span>
                        <span className="text-white font-bold">方向：</span>上北下南，左西右东
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span>
                        <span className="text-white font-bold">比例尺：</span>图上距离与实际距离的比
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span>
                        <span className="text-white font-bold">图例：</span>地图上的符号说明
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="地理挑战赛"
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
            <p className="text-2xl text-white mb-2">你是个小小旅行家！</p>
            <p className="text-xl text-yellow-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-red-300 mb-6">你真是个地理小达人！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-yellow-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
