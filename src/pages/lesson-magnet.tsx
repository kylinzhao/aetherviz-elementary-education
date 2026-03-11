import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';
import * as THREE from 'three';

// 磁铁组件
function Magnet({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* S极（红色） */}
      <mesh position={[-1, 0, 0]}>
        <boxGeometry args={[1, 0.6, 0.6]} />
        <meshStandardMaterial color="#EF4444" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* N极（蓝色） */}
      <mesh position={[1, 0, 0]}>
        <boxGeometry args={[1, 0.6, 0.6]} />
        <meshStandardMaterial color="#3B82F6" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* 极性标识 */}
      <mesh position={[-1, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 0.3]} />
        <meshBasicMaterial color="#FFFFFF">
          <canvasTexture attach="map" image={createTextTexture('S', '#FFFFFF')} />
        </meshBasicMaterial>
      </mesh>
      <mesh position={[1, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 0.3]} />
        <meshBasicMaterial color="#FFFFFF">
          <canvasTexture attach="map" image={createTextTexture('N', '#FFFFFF')} />
        </meshBasicMaterial>
      </mesh>
    </group>
  );
}

// 创建文字纹理
function createTextTexture(text: string, color: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = color;
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 32, 32);
  }
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 磁场线组件
function MagneticField({ magnets }: { magnets: Array<{ position: [number, number, number]; rotation: [number, number, number] }> }) {
  const lines: JSX.Element[] = [];

  // 为每个磁铁生成磁场线
  magnets.forEach((magnet, magnetIndex) => {
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const radius = 2.5;
      const linePoints: THREE.Vector3[] = [];

      for (let t = 0; t <= 1; t += 0.05) {
        const x = magnet.position[0] + Math.cos(angle) * radius * Math.sin(t * Math.PI);
        const y = magnet.position[1] + t * 2 - 1;
        const z = magnet.position[2] + Math.sin(angle) * radius * Math.sin(t * Math.PI);
        linePoints.push(new THREE.Vector3(x, y, z));
      }

      const curve = new THREE.CatmullRomCurve3(linePoints);
      const tubeGeometry = new THREE.TubeGeometry(curve, 20, 0.02, 8, false);

      lines.push(
        <mesh key={`${magnetIndex}-${i}`} geometry={tubeGeometry}>
          <meshStandardMaterial
            color={magnetIndex % 2 === 0 ? '#3B82F6' : '#EF4444'}
            transparent
            opacity={0.4}
            emissive={magnetIndex % 2 === 0 ? '#3B82F6' : '#EF4444'}
            emissiveIntensity={0.3}
          />
        </mesh>
      );
    }
  });

  return <group>{lines}</group>;
}

// 小铁球组件
function IronBall({ position }: { position: [number, number, number] }) {
  const ballRef = useRef<THREE.Mesh>(null);
  const [attracted, setAttracted] = useState(false);

  useFrame((state) => {
    if (ballRef.current && attracted) {
      const time = state.clock.getElapsedTime();
      const magnetPos = new THREE.Vector3(0, 0, 0);
      const ballPos = ballRef.current.position;
      const direction = magnetPos.clone().sub(ballPos).normalize();
      ballPos.add(direction.multiplyScalar(0.02));
    }
  });

  return (
    <mesh
      ref={ballRef}
      position={position}
      onClick={() => setAttracted(true)}
      onPointerOver={(e) => (e.stopPropagation(), document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'default')}
    >
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial color="#A0A0A0" metalness={0.8} roughness={0.3} />
    </mesh>
  );
}

export default function LessonMagnet() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [showType, setShowType] = useState<'magnet' | 'poles' | 'interact' | 'field'>('magnet');
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
      title: '认识磁铁',
      description: '点击"认识磁铁"按钮，观察条形磁铁的形状和颜色',
      checkCondition: () => showType === 'magnet',
      hint: '太棒了！磁铁有两个极！',
    },
    {
      id: 2,
      title: '找出N极和S极',
      description: '点击"N极S极"按钮，看看磁铁的两端有什么不同',
      checkCondition: () => showType === 'poles',
      hint: '正确！红色是S极，蓝色是N极！',
    },
    {
      id: 3,
      title: '测试磁极作用',
      description: '点击"磁极作用"按钮，观察两个磁铁之间的吸引和排斥',
      checkCondition: () => showType === 'interact',
      hint: '对了！同极相斥，异极相吸！',
    },
    {
      id: 4,
      title: '观察磁场线',
      description: '点击"磁场线"按钮，看看看不见的磁场是什么样子的',
      checkCondition: () => showType === 'field',
      hint: '太神奇了！磁场线从N极出来，回到S极！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '🧲 磁铁有几个极？',
      options: ['1个', '2个', '3个', '4个'],
      correctAnswer: 1,
      hint: '提示: 看看磁铁的两端',
      explanation: '正确！磁铁有两个极：N极和S极！',
    },
    {
      id: 2,
      question: '🔴🔵 两个N极靠近会怎样？',
      options: ['吸引', '排斥', '没有反应', '变成一个磁铁'],
      correctAnswer: 1,
      hint: '提示: 同极相斥',
      explanation: '太棒了！同极相互排斥！',
    },
    {
      id: 3,
      question: '🧲 哪种材料能被磁铁吸引？',
      options: ['木头', '塑料', '铁', '玻璃'],
      correctAnswer: 2,
      hint: '提示: 想想冰箱贴',
      explanation: '对了！铁能被磁铁吸引！',
    },
    {
      id: 4,
      question: '🌍 地球像一个大磁铁，地磁南极在哪里？',
      options: ['北极', '南极', '赤道', '中心'],
      correctAnswer: 0,
      hint: '提示: 指南针的N极指向北方',
      explanation: '太聪明了！地磁南极在地理北极附近！',
    },
    {
      id: 5,
      question: '🧲 磁场线从哪个极出发？',
      options: ['S极到N极', 'N极到S极', '从中心出来', '没有方向'],
      correctAnswer: 1,
      hint: '提示: 观察磁场线的方向',
      explanation: '正确！磁场线从N极出发，回到S极！',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-blue-50">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">🧲</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-600">
                磁铁力量
              </h1>
              <p className="text-sm text-red-600">发现磁力的秘密</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-blue-500 text-white rounded-lg font-bold hover:opacity-90 transition-opacity shadow-md"
          >
            ← 返回首页
          </button>
        </div>
      </nav>

      {/* 故事引入 */}
      <div className="pt-28 pb-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-xl border-4 border-red-300">
            <div className="flex items-start gap-4">
              <span className="text-5xl">📖</span>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-red-800 mb-2">寻找磁力</h2>
                <p className="text-lg text-red-700 leading-relaxed">
                  小明在玩具箱里发现了一块<span className="text-2xl mx-1">🧲</span>磁铁！
                  它能<span className="text-2xl mx-1">🧲</span>吸住回形针，
                  还能让指南针<span className="text-2xl mx-1">🧭</span>转来转去。
                  <br />
                  <span className="text-blue-600 font-bold">
                    磁铁为什么会有这种神奇的力量？让我们一起来探索吧！
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
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-red-800 flex items-center gap-2">
                    🎨 磁力实验室
                  </h2>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {showType === 'magnet' && '认识磁铁'}
                      {showType === 'poles' && 'N极和S极'}
                      {showType === 'interact' && '磁极作用'}
                      {showType === 'field' && '磁场线'}
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
                <div className="w-full h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-red-100 to-blue-100">
                  <Canvas shadows gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
                    <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 5, 10]} fov={60} />
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 10, 10]} castShadow intensity={1} />
                    {showType === 'magnet' && (
                      <>
                        <Magnet position={[0, 0, 0]} rotation={[0, 0, 0]} />
                        <IronBall position={[2, 0, 0]} />
                        <IronBall position={[0, 2, 0]} />
                        <IronBall position={[-2, 0, 0]} />
                      </>
                    )}
                    {showType === 'poles' && (
                      <>
                        <Magnet position={[0, 0, 0]} rotation={[0, 0, 0]} />
                      </>
                    )}
                    {showType === 'interact' && (
                      <>
                        <Magnet position={[-1.5, 0, 0]} rotation={[0, 0, 0]} />
                        <Magnet position={[1.5, 0, 0]} rotation={[0, Math.PI, 0]} />
                      </>
                    )}
                    {showType === 'field' && (
                      <>
                        <Magnet position={[0, 0, 0]} rotation={[0, 0, 0]} />
                        <MagneticField magnets={[{ position: [0, 0, 0], rotation: [0, 0, 0] }]} />
                      </>
                    )}
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-red-700 text-sm mt-4 text-center">
                  💡 点击下方按钮观察不同磁现象 | 拖动鼠标旋转视角 | 点击铁球吸引它
                </p>
              </div>

              {/* 任务卡片 */}
              <TaskCard
                title="探险任务"
                tasks={tasks}
                onAllCompleted={() => setTasksCompleted(true)}
              />
            </div>

            {/* 右侧：控制面板和小测验 */}
            <div className="lg:col-span-1 space-y-6">
              {/* 控制面板 */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-bold text-red-800 mb-6 flex items-center gap-2">
                  🎛️ 控制面板
                </h2>

                {/* 磁现象按钮 */}
                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => setShowType('magnet')}
                    className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                      showType === 'magnet'
                        ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white shadow-lg scale-105'
                        : 'bg-gradient-to-r from-red-200 to-blue-200 text-red-800 hover:scale-102'
                    }`}
                  >
                    🧲 认识磁铁
                  </button>
                  <button
                    onClick={() => setShowType('poles')}
                    className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                      showType === 'poles'
                        ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white shadow-lg scale-105'
                        : 'bg-gradient-to-r from-red-200 to-blue-200 text-red-800 hover:scale-102'
                    }`}
                  >
                    🔴🔵 N极S极
                  </button>
                  <button
                    onClick={() => setShowType('interact')}
                    className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                      showType === 'interact'
                        ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white shadow-lg scale-105'
                        : 'bg-gradient-to-r from-red-200 to-blue-200 text-red-800 hover:scale-102'
                    }`}
                  >
                    🧲 磁极作用
                  </button>
                  <button
                    onClick={() => setShowType('field')}
                    className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                      showType === 'field'
                        ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white shadow-lg scale-105'
                        : 'bg-gradient-to-r from-red-200 to-blue-200 text-red-800 hover:scale-102'
                    }`}
                  >
                    🌀 磁场线
                  </button>
                </div>

                {/* 知识点 */}
                <div className="p-4 bg-gradient-to-br from-red-100 to-blue-100 border-2 border-red-300 rounded-lg mb-6">
                  <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                    📖 磁铁知识
                  </h3>
                  <ul className="text-red-800 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>
                        <span className="font-bold">磁铁有两极</span>
                        <br />
                        <span className="text-xs">N极（北极）和S极（南极）</span>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>
                        <span className="font-bold">同极相斥</span>
                        <br />
                        <span className="text-xs">N极和N极，S极和S极相互排斥</span>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600">•</span>
                      <span>
                        <span className="font-bold">异极相吸</span>
                        <br />
                        <span className="text-xs">N极和S极相互吸引</span>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600">•</span>
                      <span>
                        <span className="font-bold">磁场线</span>
                        <br />
                        <span className="text-xs">从N极出发，回到S极</span>
                      </span>
                    </li>
                  </ul>
                </div>

                {/* 有趣事实 */}
                <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-blue-300 rounded-lg">
                  <h3 className="font-bold text-blue-700 mb-2 flex items-center gap-2">
                    ⭐ 有趣事实
                  </h3>
                  <p className="text-blue-800 text-sm">
                    地球就像一个大磁铁，这就是指南针能工作的原因！🌍
                  </p>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="磁力问答赛"
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
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-center animate-bounce shadow-2xl">
            <div className="text-8xl mb-4">🏆</div>
            <h2 className="text-4xl font-bold text-red-600 mb-4">太棒了！</h2>
            <p className="text-2xl text-red-800 mb-2">你完成了磁力探险！</p>
            <p className="text-xl text-blue-600 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-green-600 mb-6">你真是个磁力问答小专家！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-blue-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity shadow-lg"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
