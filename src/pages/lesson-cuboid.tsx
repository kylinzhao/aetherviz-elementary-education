import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';

// 长方体可视化
function CuboidVisualization({ width, height, depth, showVertices, showEdges, showFaces }: {
  width: number;
  height: number;
  depth: number;
  showVertices: boolean;
  showEdges: boolean;
  showFaces: boolean;
}) {
  return (
    <group>
      {/* 长方体主体 */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#D97706" transparent opacity={0.8} />
      </mesh>

      {/* 顶点标记 */}
      {showVertices && [
        [-width/2, height/2, depth/2],
        [width/2, height/2, depth/2],
        [width/2, height/2, -depth/2],
        [-width/2, height/2, -depth/2],
        [-width/2, -height/2, depth/2],
        [width/2, -height/2, depth/2],
        [width/2, -height/2, -depth/2],
        [-width/2, -height/2, -depth/2],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#FCD34D" emissive="#FCD34D" emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* 边框高亮 */}
      {showEdges && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial color="#F59E0B" wireframe />
        </mesh>
      )}

      {/* 面标记 */}
      {showFaces && [
        { pos: [0, 0, depth/2], rot: [0, 0, 0], color: '#FBBF24' },
        { pos: [0, 0, -depth/2], rot: [0, Math.PI, 0], color: '#F59E0B' },
        { pos: [width/2, 0, 0], rot: [0, Math.PI/2, 0], color: '#FCD34D' },
        { pos: [-width/2, 0, 0], rot: [0, -Math.PI/2, 0], color: '#FBBF24' },
        { pos: [0, height/2, 0], rot: [Math.PI/2, 0, 0], color: '#FCD34D' },
        { pos: [0, -height/2, 0], rot: [-Math.PI/2, 0, 0], color: '#F59E0B' },
      ].map((face, i) => (
        <mesh
          key={i}
          position={face.pos as [number, number, number]}
          rotation={face.rot as [number, number, number]}
        >
          <planeGeometry args={[width, height]} />
          <meshStandardMaterial color={face.color} side={2} transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export default function LessonCuboid() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState(3);
  const [depth, setDepth] = useState(2);
  const [showVertices, setShowVertices] = useState(false);
  const [showEdges, setShowEdges] = useState(false);
  const [showFaces, setShowFaces] = useState(false);
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const vertices = 8;
  const edges = 12;
  const faces = 6;
  const volume = width * height * depth;

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
      title: '数一数顶点',
      description: '点击"显示顶点"按钮，数数长方体有多少个顶点',
      checkCondition: () => showVertices,
      hint: '太棒了！长方体有8个顶点（角）！',
    },
    {
      id: 2,
      title: '数一数棱',
      description: '点击"显示棱"按钮，数数长方体有多少条棱',
      checkCondition: () => showEdges,
      hint: '正确！长方体有12条棱（边）！',
    },
    {
      id: 3,
      title: '数一数面',
      description: '点击"显示面"按钮，数数长方体有多少个面',
      checkCondition: () => showFaces,
      hint: '很好！长方体有6个面！',
    },
    {
      id: 4,
      title: '改变盒子大小',
      description: '将长、宽、高分别调到 5、4、3',
      checkCondition: () => width === 5 && height === 4 && depth === 3,
      hint: '完美！你制作了一个 5×4×3 的盒子！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '📦 一个长方体有多少个顶点（角）？',
      options: ['6个', '8个', '10个', '12个'],
      correctAnswer: 1,
      hint: '提示: 试着数数盒子的角',
      explanation: '正确！长方体有8个顶点（角）',
    },
    {
      id: 2,
      question: '📦 一个长方体有多少条棱（边）？',
      options: ['8条', '10条', '12条', '14条'],
      correctAnswer: 2,
      hint: '提示: 每个面有4条边',
      explanation: '太棒了！长方体有12条棱（边）',
    },
    {
      id: 3,
      question: '📦 一个长方体有多少个面？',
      options: ['4个', '5个', '6个', '8个'],
      correctAnswer: 2,
      hint: '提示: 上面、下面、前面、后面...',
      explanation: '对！长方体有6个面',
    },
    {
      id: 4,
      question: '📦 一个长4、宽3、高2的盒子，体积是多少？',
      options: ['9', '12', '24', '都不对'],
      correctAnswer: 2,
      hint: '提示: 4 × 3 × 2 = ?',
      explanation: '正确！体积 = 4 × 3 × 2 = 24',
    },
    {
      id: 5,
      question: '📦 长方体的哪个面最大？（长5、宽4、高3）',
      options: ['上面', '前面', '侧面', '都一样大'],
      correctAnswer: 1,
      hint: '提示: 比较每个面的面积',
      explanation: '聪明！前面的面积是 5×4=20，是最大的！',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-amber-900/20 to-yellow-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">📦</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">神秘盒子</h1>
              <p className="text-sm text-amber-300">探索长方体的秘密</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">礼物盒的秘密</h2>
                <p className="text-lg text-amber-200 leading-relaxed">
                  小明收到了一个神秘的<span className="text-2xl mx-1">📦</span>礼物盒！
                  这个盒子是个长方体，有很多<span className="text-2xl mx-1">🎯</span>秘密等待发现。
                  让我们一起探索长方体的<span className="text-2xl mx-1">✨</span>顶点、棱和面吧！
                  <br />
                  <span className="text-yellow-300 font-bold">
                    顶点就是盒子的角，棱是边线，面是平的一整块！
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
                    🎨 3D盒子
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowVertices(!showVertices)}
                      className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${
                        showVertices
                          ? 'bg-yellow-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      显示顶点
                    </button>
                    <button
                      onClick={() => setShowEdges(!showEdges)}
                      className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${
                        showEdges
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      显示棱
                    </button>
                    <button
                      onClick={() => setShowFaces(!showFaces)}
                      className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${
                        showFaces
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      显示面
                    </button>
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
                    <CuboidVisualization
                      width={width}
                      height={height}
                      depth={depth}
                      showVertices={showVertices}
                      showEdges={showEdges}
                      showFaces={showFaces}
                    />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-amber-200 text-sm mt-4 text-center">
                  💡 拖动鼠标旋转盒子，点击按钮显示顶点、棱和面！
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
                  🎛️ 控制面板
                </h2>

                {/* 长 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    📏 长: {width}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    step="1"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>2</span>
                    <span>8</span>
                  </div>
                </div>

                {/* 宽 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    📐 宽: {height}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    step="1"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>2</span>
                    <span>8</span>
                  </div>
                </div>

                {/* 高 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    📏 高: {depth}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    step="1"
                    value={depth}
                    onChange={(e) => setDepth(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>2</span>
                    <span>8</span>
                  </div>
                </div>

                {/* 长方体要素 */}
                <div className="p-4 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-2 border-amber-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-amber-400 mb-3 flex items-center gap-2">
                    📦 盒子的秘密
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center bg-slate-800/50 p-2 rounded">
                      <span className="text-yellow-400 font-bold">📍 顶点:</span>
                      <span className="text-white text-lg">{vertices} 个</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-800/50 p-2 rounded">
                      <span className="text-amber-400 font-bold">📏 棱:</span>
                      <span className="text-white text-lg">{edges} 条</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-800/50 p-2 rounded">
                      <span className="text-orange-400 font-bold">🎲 面:</span>
                      <span className="text-white text-lg">{faces} 个</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-800/50 p-2 rounded">
                      <span className="text-yellow-300 font-bold">📦 体积:</span>
                      <span className="text-white text-lg">{volume} 立方单位</span>
                    </div>
                  </div>
                </div>

                {/* 小知识 */}
                <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30 rounded-lg">
                  <h3 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
                    💡 小秘密
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>
                        <span className="text-white font-bold">相对的面</span>大小相等
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>
                        <span className="text-white font-bold">相对的棱</span>长度相等
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>
                        体积 = <span className="text-white font-bold">长 × 宽 × 高</span>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="盒子挑战"
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
            <div className="text-8xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold text-yellow-400 mb-4">太棒了！</h2>
            <p className="text-2xl text-white mb-2">你完成了所有挑战！</p>
            <p className="text-xl text-amber-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-green-300 mb-6">你真是个立体图形小达人！</p>
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
