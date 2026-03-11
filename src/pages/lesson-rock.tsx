import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';

// 岩石类型可视化组件
function RockVisualization({ rockType }: { rockType: string }) {
  const getRockColor = (type: string) => {
    switch (type) {
      case 'igneous': return '#78716c'; // 灰色 - 岩浆岩
      case 'sedimentary': return '#a8a29e'; // 浅棕色 - 沉积岩
      case 'metamorphic': return '#dc2626'; // 红色 - 变质岩
      case 'cycle': return '#f59e0b'; // 金色 - 岩石循环
      default: return '#78716c';
    }
  };

  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <dodecahedronGeometry args={[2, 0]} />
        <meshStandardMaterial color={getRockColor(rockType)} roughness={0.8} metalness={0.2} />
      </mesh>
      {rockType === 'igneous' && (
        <>
          <mesh position={[-2.5, 0, 0]} scale={0.6}>
            <dodecahedronGeometry args={[2, 0]} />
            <meshStandardMaterial color="#78716c" roughness={0.8} />
          </mesh>
          <mesh position={[2.5, 0, 0]} scale={0.7}>
            <dodecahedronGeometry args={[2, 0]} />
            <meshStandardMaterial color="#92400e" roughness={0.7} />
          </mesh>
        </>
      )}
      {rockType === 'sedimentary' && (
        <>
          <mesh position={[-2.5, 0.5, 0]} scale={0.5}>
            <boxGeometry args={[1.5, 0.5, 1.5]} />
            <meshStandardMaterial color="#a8a29e" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.8, 0]} scale={0.5}>
            <boxGeometry args={[1.5, 0.5, 1.5]} />
            <meshStandardMaterial color="#78716c" roughness={0.85} />
          </mesh>
          <mesh position={[2.5, 1.1, 0]} scale={0.5}>
            <boxGeometry args={[1.5, 0.5, 1.5]} />
            <meshStandardMaterial color="#d6d3d1" roughness={0.9} />
          </mesh>
        </>
      )}
      {rockType === 'metamorphic' && (
        <>
          <mesh position={[-2, 0, 0]}>
            <torusKnotGeometry args={[0.8, 0.3, 64, 8]} />
            <meshStandardMaterial color="#dc2626" roughness={0.6} metalness={0.3} />
          </mesh>
        </>
      )}
      {rockType === 'cycle' && (
        <>
          <mesh position={[0, 2, 0]} scale={0.8}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[-2.5, -1, 0]} scale={0.6}>
            <dodecahedronGeometry args={[2, 0]} />
            <meshStandardMaterial color="#78716c" roughness={0.8} />
          </mesh>
          <mesh position={[2.5, -1, 0]} scale={0.5}>
            <boxGeometry args={[1.5, 0.5, 1.5]} />
            <meshStandardMaterial color="#a8a29e" roughness={0.9} />
          </mesh>
        </>
      )}
    </group>
  );
}

export default function LessonRock() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [rockType, setRockType] = useState('igneous');
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
      title: '观察岩浆岩',
      description: '点击"岩浆岩"按钮，观察火成岩的特点',
      checkCondition: () => rockType === 'igneous',
      hint: '太棒了！岩浆岩是由熔岩冷却形成的！',
    },
    {
      id: 2,
      title: '发现沉积岩',
      description: '点击"沉积岩"按钮，看看层状结构',
      checkCondition: () => rockType === 'sedimentary',
      hint: '很好！沉积岩像千层蛋糕一样一层层的！',
    },
    {
      id: 3,
      title: '认识变质岩',
      description: '点击"变质岩"按钮，观察变质变化',
      checkCondition: () => rockType === 'metamorphic',
      hint: '真聪明！变质岩是高温高压下变的！',
    },
    {
      id: 4,
      title: '理解岩石循环',
      description: '点击"岩石循环"按钮，看岩石如何转变',
      checkCondition: () => rockType === 'cycle',
      hint: '哇！岩石会不断变化循环，太神奇了！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '🪨 花岗岩属于哪种岩石？',
      options: ['岩浆岩', '沉积岩', '变质岩', '都不是'],
      correctAnswer: 0,
      hint: '提示：花岗岩是由岩浆冷却形成的',
      explanation: '正确！花岗岩是岩浆岩，由岩浆缓慢冷却形成',
    },
    {
      id: 2,
      question: '🪨 石灰岩属于哪种岩石？',
      options: ['岩浆岩', '沉积岩', '变质岩', '都不是'],
      correctAnswer: 1,
      hint: '提示：石灰岩是由海底沉积物形成的',
      explanation: '太棒了！石灰岩是典型的沉积岩',
    },
    {
      id: 3,
      question: '🪨 大理石是由什么岩石变质而来的？',
      options: ['花岗岩', '玄武岩', '石灰岩', '砂岩'],
      correctAnswer: 2,
      hint: '提示：大理石和石灰岩成分相似',
      explanation: '对！大理石是由石灰岩在高温高压下变质形成的',
    },
    {
      id: 4,
      question: '🪨 岩石循环中，岩浆岩可以变成什么？',
      options: ['只能变成沉积岩', '只能变成变质岩', '可以变成沉积岩或变质岩', '不会变化'],
      correctAnswer: 2,
      hint: '提示：岩石在循环中可以有多种变化路径',
      explanation: '正确！岩浆岩风化后可变成沉积岩，受热压可变成变质岩',
    },
    {
      id: 5,
      question: '🪨 以下哪项不是岩石循环的过程？',
      options: ['熔融', '风化', '变质', '消失'],
      correctAnswer: 3,
      hint: '提示：岩石不会凭空消失',
      explanation: '太聪明了！岩石循环包括熔融、冷却、风化、变质等过程，但不会消失',
    },
  ];

  const getRockTitle = (type: string) => {
    switch (type) {
      case 'igneous': return '🌋 岩浆岩';
      case 'sedimentary': return '📚 沉积岩';
      case 'metamorphic': return '🔥 变质岩';
      case 'cycle': return '🔄 岩石循环';
      default: return '🪨 岩石';
    }
  };

  const getRockDescription = (type: string) => {
    switch (type) {
      case 'igneous': return '由岩浆或熔岩冷却凝固形成，如花岗岩、玄武岩';
      case 'sedimentary': return '由沉积物堆积压实形成，有明显层理，如石灰岩、砂岩';
      case 'metamorphic': return '由原有岩石在高温高压下变质形成，如大理石、片岩';
      case 'cycle': return '岩石在岩浆、沉积、变质之间不断转化，永不停止';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-stone-900/20 to-zinc-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">🪨</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">岩石的故事</h1>
              <p className="text-sm text-stone-300">探索岩石的神奇世界</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-stone-500 to-zinc-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">小小地质家</h2>
                <p className="text-lg text-stone-200 leading-relaxed">
                  欢迎来到<span className="text-2xl mx-1">🏔️</span>岩石的世界！
                  你是一名小小<span className="text-2xl mx-1">🔍</span>地质家，
                  今天我们要探索<span className="text-2xl mx-1">🪨</span>岩石的秘密。
                  <br />
                  <span className="text-stone-300 font-bold">
                    有些岩石从火山里诞生，有些在海底慢慢形成，还有些会变身！
                  </span>
                  <br />
                  <span className="text-amber-400 font-bold">
                    让我们一起发现岩石的神奇故事吧！
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
                    🎨 {getRockTitle(rockType)}
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
                    <PerspectiveCamera makeDefault ref={cameraRef} position={[6, 4, 8]} fov={60} />
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 20, 10]} castShadow />
                    <pointLight position={[-10, 10, -10]} intensity={0.5} />
                    <RockVisualization rockType={rockType} />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-stone-300 text-sm mt-4 text-center">
                  💡 {getRockDescription(rockType)}
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
                  🎛️ 岩石选择
                </h2>

                {/* 岩石类型按钮 */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    onClick={() => setRockType('igneous')}
                    className={`p-4 rounded-xl font-bold transition-all ${
                      rockType === 'igneous'
                        ? 'bg-gradient-to-br from-gray-500 to-gray-700 text-white ring-2 ring-gray-400'
                        : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">🌋</div>
                    <div className="text-sm">岩浆岩</div>
                  </button>
                  <button
                    onClick={() => setRockType('sedimentary')}
                    className={`p-4 rounded-xl font-bold transition-all ${
                      rockType === 'sedimentary'
                        ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white ring-2 ring-amber-500'
                        : 'bg-slate-700/50 text-amber-200 hover:bg-slate-600/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">📚</div>
                    <div className="text-sm">沉积岩</div>
                  </button>
                  <button
                    onClick={() => setRockType('metamorphic')}
                    className={`p-4 rounded-xl font-bold transition-all ${
                      rockType === 'metamorphic'
                        ? 'bg-gradient-to-br from-red-500 to-red-700 text-white ring-2 ring-red-400'
                        : 'bg-slate-700/50 text-red-200 hover:bg-slate-600/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">🔥</div>
                    <div className="text-sm">变质岩</div>
                  </button>
                  <button
                    onClick={() => setRockType('cycle')}
                    className={`p-4 rounded-xl font-bold transition-all ${
                      rockType === 'cycle'
                        ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white ring-2 ring-amber-400'
                        : 'bg-slate-700/50 text-amber-200 hover:bg-slate-600/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">🔄</div>
                    <div className="text-sm">岩石循环</div>
                  </button>
                </div>

                {/* 岩石知识 */}
                <div className="p-4 bg-gradient-to-br from-stone-500/10 to-zinc-500/10 border-2 border-stone-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-stone-400 mb-3 flex items-center gap-2">
                    📖 岩石小知识
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <p className="text-stone-300">
                      地球上的岩石主要分为<span className="font-bold text-white">三大类</span>
                    </p>
                    <ul className="space-y-1 ml-2">
                      <li>• <span className="text-gray-300">岩浆岩</span>：火成岩，来自岩浆</li>
                      <li>• <span className="text-amber-300">沉积岩</span>：层层堆积形成</li>
                      <li>• <span className="text-red-300">变质岩</span>：高温高压变身</li>
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
                        <span className="text-white font-bold">观察：</span>注意岩石的颜色和纹理
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <span>
                        <span className="text-white font-bold">思考：</span>想想它们是怎么形成的
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="岩石知识挑战"
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
            <h2 className="text-4xl font-bold text-amber-400 mb-4">太棒了！</h2>
            <p className="text-2xl text-white mb-2">你完成了所有探索！</p>
            <p className="text-xl text-stone-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-green-300 mb-6">你真是个小小地质家！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
