import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';
import * as THREE from 'three';

// 光源组件
function LightSource({ position, color, intensity }: { position: [number, number, number]; color: string; intensity: number }) {
  return (
    <>
      <pointLight position={position} color={color} intensity={intensity} distance={20} />
      <mesh position={position}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
    </>
  );
}

// 光线演示组件
function LightBeam({ showType }: { showType: 'straight' | 'reflect' | 'refract' | 'rainbow' }) {
  const groupRef = useRef<THREE.Group>(null);

  const beams = {
    straight: (
      <>
        {/* 光源 */}
        <LightSource position={[-4, 0, 0]} color="#FFFF00" intensity={2} />
        {/* 直线传播的光束 */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 8, 8]} />
          <meshStandardMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={0.8} transparent opacity={0.6} />
        </mesh>
        {/* 目标物体 */}
        <mesh position={[4, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </>
    ),
    reflect: (
      <>
        {/* 光源 */}
        <LightSource position={[-3, 3, 0]} color="#FFFF00" intensity={2} />
        {/* 入射光 */}
        <mesh position={[-1, 1, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.1, 0.1, 3, 8]} />
          <meshStandardMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={0.8} transparent opacity={0.6} />
        </mesh>
        {/* 镜子 */}
        <mesh position={[0, -1, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[4, 0.2, 2]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* 反射光 */}
        <mesh position={[1, 1, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <cylinderGeometry args={[0.1, 0.1, 3, 8]} />
          <meshStandardMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={0.8} transparent opacity={0.6} />
        </mesh>
      </>
    ),
    refract: (
      <>
        {/* 光源 */}
        <LightSource position={[-4, 0, 0]} color="#FFFF00" intensity={2} />
        {/* 入射光 */}
        <mesh position={[-2, 0, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 2.5, 8]} />
          <meshStandardMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={0.8} transparent opacity={0.6} />
        </mesh>
        {/* 玻璃砖 */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#87CEEB" transparent opacity={0.4} metalness={0.1} roughness={0.1} />
        </mesh>
        {/* 折射光 */}
        <mesh position={[2, -0.5, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <cylinderGeometry args={[0.1, 0.1, 2.5, 8]} />
          <meshStandardMaterial color="#FFFF00" emissive="#FFFF00" emissiveIntensity={0.8} transparent opacity={0.6} />
        </mesh>
      </>
    ),
    rainbow: (
      <>
        {/* 光源 */}
        <LightSource position={[-4, 2, 0]} color="#FFFFFF" intensity={2} />
        {/* 白光 */}
        <mesh position={[-1, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
          <cylinderGeometry args={[0.15, 0.15, 3, 8]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.8} />
        </mesh>
        {/* 棱镜 */}
        <mesh position={[1, -1, 0]} rotation={[0, 0, 0]}>
          <extrudeGeometry args={[new THREE.Shape().moveTo(-1, -1).lineTo(1, -1).lineTo(0, 1).closePath(), { depth: 2, bevelEnabled: false }]} />
          <meshStandardMaterial color="#E0E0FF" transparent opacity={0.5} metalness={0.1} roughness={0.1} />
        </mesh>
        {/* 彩虹光 */}
        {[
          { color: '#FF0000', pos: [2.5, 0, 0] as [number, number, number], angle: Math.PI / 12 },
          { color: '#FF7F00', pos: [2.7, 0.3, 0] as [number, number, number], angle: Math.PI / 8 },
          { color: '#FFFF00', pos: [2.9, 0.6, 0] as [number, number, number], angle: Math.PI / 10 },
          { color: '#00FF00', pos: [3.1, 0.9, 0] as [number, number, number], angle: 0 },
          { color: '#0000FF', pos: [3.3, 1.2, 0] as [number, number, number], angle: -Math.PI / 10 },
          { color: '#4B0082', pos: [3.5, 1.5, 0] as [number, number, number], angle: -Math.PI / 8 },
        ].map((beam, i) => (
          <mesh key={i} position={beam.pos} rotation={[0, 0, beam.angle]}>
            <cylinderGeometry args={[0.05, 0.05, 1.5, 8]} />
            <meshStandardMaterial color={beam.color} emissive={beam.color} emissiveIntensity={1} />
          </mesh>
        ))}
      </>
    ),
  };

  return <group ref={groupRef}>{beams[showType]}</group>;
}

export default function LessonLight() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [showType, setShowType] = useState<'straight' | 'reflect' | 'refract' | 'rainbow'>('straight');
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
      title: '观察光的直线传播',
      description: '点击"光的直线传播"按钮，观察光如何沿直线传播',
      checkCondition: () => showType === 'straight',
      hint: '太棒了！光总是沿直线传播的！',
    },
    {
      id: 2,
      title: '探索反射现象',
      description: '点击"反射现象"按钮，观察光线照射到镜子上的反射',
      checkCondition: () => showType === 'reflect',
      hint: '正确！入射角等于反射角！',
    },
    {
      id: 3,
      title: '发现折射奥秘',
      description: '点击"折射现象"按钮，观察光线穿过玻璃时如何偏折',
      checkCondition: () => showType === 'refract',
      hint: '对了！光从一种介质进入另一种介质时会发生折射！',
    },
    {
      id: 4,
      title: '创造彩虹',
      description: '点击"色散彩虹"按钮，观察白光如何分解成七彩',
      checkCondition: () => showType === 'rainbow',
      hint: '太神奇了！白光是由七种颜色组成的！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '💡 光在空气中是如何传播的？',
      options: ['曲线传播', '直线传播', '螺旋传播', '随机传播'],
      correctAnswer: 1,
      hint: '提示: 观察光束的形状',
      explanation: '正确！光总是沿直线传播的！',
    },
    {
      id: 2,
      question: '🪞 光照射到镜子上会发生什么？',
      options: ['吸收', '折射', '反射', '消失'],
      correctAnswer: 2,
      hint: '提示: 看看镜子如何改变光的方向',
      explanation: '太棒了！镜子会把光反射回去！',
    },
    {
      id: 3,
      question: '💎 光从空气进入水中会怎样？',
      options: ['保持方向', '发生折射', '完全消失', '变成彩虹'],
      correctAnswer: 1,
      hint: '提示: 观察光线穿过玻璃砖',
      explanation: '对了！光进入不同介质时会发生折射！',
    },
    {
      id: 4,
      question: '🌈 彩虹是怎么形成的？',
      options: ['光的反射', '光的折射', '光的色散', '光的吸收'],
      correctAnswer: 2,
      hint: '提示: 看看白光穿过棱镜',
      explanation: '太聪明了！白光色散形成彩虹！',
    },
    {
      id: 5,
      question: '⚡ 光在真空中的速度是？',
      options: ['每秒30万公里', '每秒340米', '每秒1000公里', '瞬间到达'],
      correctAnswer: 0,
      hint: '提示: 光速是宇宙中最快的速度',
      explanation: '正确！光在真空中的速度是每秒30万公里！',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-yellow-50">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">💡</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-600">
                光影魔术师
              </h1>
              <p className="text-sm text-yellow-600">发现光的奥秘</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-lg font-bold hover:opacity-90 transition-opacity shadow-md"
          >
            ← 返回首页
          </button>
        </div>
      </nav>

      {/* 故事引入 */}
      <div className="pt-28 pb-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-xl border-4 border-yellow-300">
            <div className="flex items-start gap-4">
              <span className="text-5xl">📖</span>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-yellow-800 mb-2">手影戏的秘密</h2>
                <p className="text-lg text-yellow-700 leading-relaxed">
                  小明喜欢玩<span className="text-2xl mx-1">👋</span>手影戏！
                  他发现用手挡住光线，墙上就会出现<span className="text-2xl mx-1">🦋</span>各种有趣的影子。
                  <br />
                  <span className="text-amber-600 font-bold">
                    为什么会有影子呢？光还有什么神奇的秘密？让我们来探索吧！
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
                  <h2 className="text-xl font-bold text-yellow-800 flex items-center gap-2">
                    🎨 光影实验室
                  </h2>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {showType === 'straight' && '直线传播'}
                      {showType === 'reflect' && '反射现象'}
                      {showType === 'refract' && '折射现象'}
                      {showType === 'rainbow' && '色散彩虹'}
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
                <div className="w-full h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-yellow-100 to-amber-100">
                  <Canvas shadows gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
                    <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 5, 10]} fov={60} />
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 10, 10]} castShadow intensity={1} />
                    <LightBeam showType={showType} />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-yellow-700 text-sm mt-4 text-center">
                  💡 点击下方按钮观察不同光现象 | 拖动鼠标旋转视角
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
                <h2 className="text-xl font-bold text-yellow-800 mb-6 flex items-center gap-2">
                  🎛️ 控制面板
                </h2>

                {/* 光现象按钮 */}
                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => setShowType('straight')}
                    className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                      showType === 'straight'
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg scale-105'
                        : 'bg-gradient-to-r from-yellow-200 to-amber-200 text-yellow-800 hover:scale-102'
                    }`}
                  >
                    💡 光的直线传播
                  </button>
                  <button
                    onClick={() => setShowType('reflect')}
                    className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                      showType === 'reflect'
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg scale-105'
                        : 'bg-gradient-to-r from-yellow-200 to-amber-200 text-yellow-800 hover:scale-102'
                    }`}
                  >
                    🪞 反射现象
                  </button>
                  <button
                    onClick={() => setShowType('refract')}
                    className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                      showType === 'refract'
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg scale-105'
                        : 'bg-gradient-to-r from-yellow-200 to-amber-200 text-yellow-800 hover:scale-102'
                    }`}
                  >
                    💎 折射现象
                  </button>
                  <button
                    onClick={() => setShowType('rainbow')}
                    className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                      showType === 'rainbow'
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg scale-105'
                        : 'bg-gradient-to-r from-yellow-200 to-amber-200 text-yellow-800 hover:scale-102'
                    }`}
                  >
                    🌈 色散彩虹
                  </button>
                </div>

                {/* 知识点 */}
                <div className="p-4 bg-gradient-to-br from-yellow-100 to-amber-100 border-2 border-yellow-300 rounded-lg mb-6">
                  <h3 className="font-bold text-yellow-700 mb-3 flex items-center gap-2">
                    📖 光的知识
                  </h3>
                  <ul className="text-yellow-800 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600">•</span>
                      <span>
                        <span className="font-bold">直线传播</span>
                        <br />
                        <span className="text-xs">光在同种均匀介质中沿直线传播</span>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600">•</span>
                      <span>
                        <span className="font-bold">反射定律</span>
                        <br />
                        <span className="text-xs">入射角等于反射角</span>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600">•</span>
                      <span>
                        <span className="font-bold">折射现象</span>
                        <br />
                        <span className="text-xs">光从一种介质进入另一种介质会偏折</span>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>
                        <span className="font-bold">光的色散</span>
                        <br />
                        <span className="text-xs">白光可以分解成七种颜色</span>
                      </span>
                    </li>
                  </ul>
                </div>

                {/* 有趣事实 */}
                <div className="p-4 bg-gradient-to-br from-amber-100 to-yellow-100 border-2 border-amber-300 rounded-lg">
                  <h3 className="font-bold text-amber-700 mb-2 flex items-center gap-2">
                    ⭐ 有趣事实
                  </h3>
                  <p className="text-amber-800 text-sm">
                    彩虹有七种颜色：红、橙、黄、绿、蓝、靛、紫！🌈
                  </p>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="光学问答赛"
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
            <h2 className="text-4xl font-bold text-yellow-600 mb-4">太棒了！</h2>
            <p className="text-2xl text-yellow-800 mb-2">你完成了光影探险！</p>
            <p className="text-xl text-amber-600 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-green-600 mb-6">你真是个光学问答小专家！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity shadow-lg"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
