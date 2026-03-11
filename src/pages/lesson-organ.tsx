import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';

// 心脏3D模型
function Heart3D({ beating }: { beating: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }: { clock: { getElapsedTime: () => number } }) => {
    if (meshRef.current && beating) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.1;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial color="#EF4444" />
    </mesh>
  );
}

// 肺部3D模型
function Lungs3D() {
  return (
    <group>
      <mesh position={[-0.8, 0, 0]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color="#F472B6" />
      </mesh>
      <mesh position={[0.8, 0, 0]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color="#F472B6" />
      </mesh>
    </group>
  );
}

// 血液循环路径
function BloodCirculation() {
  return (
    <group>
      {/* 血管 */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[2, 0.1, 16, 100]} />
        <meshStandardMaterial color="#DC2626" />
      </mesh>
      {/* 血球 */}
      <mesh position={[1.5, 0, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#991B1B" />
      </mesh>
    </group>
  );
}

// 消化系统
function DigestiveSystem() {
  return (
    <group>
      {/* 胃 */}
      <mesh position={[0, 0.5, 0]} scale={[1, 1.5, 1]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#FB7185" />
      </mesh>
      {/* 肠道 */}
      <mesh position={[0, -1.5, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.8, 0.3, 16, 100, Math.PI]} />
        <meshStandardMaterial color="#FDA4AF" />
      </mesh>
    </group>
  );
}

// 呼吸系统
function RespiratorySystem() {
  return (
    <group>
      {/* 气管 */}
      <mesh position={[0, 1, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 2, 32]} />
        <meshStandardMaterial color="#EC4899" />
      </mesh>
      {/* 肺 */}
      <mesh position={[-0.6, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#F472B6" />
      </mesh>
      <mesh position={[0.6, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#F472B6" />
      </mesh>
    </group>
  );
}

// 根据选择的器官显示不同的3D模型
function OrganVisualization({ selectedOrgan, beating }: { selectedOrgan: string; beating: boolean }) {
  switch (selectedOrgan) {
    case 'heart':
      return <Heart3D beating={beating} />;
    case 'lungs':
      return <Lungs3D />;
    case 'circulation':
      return <BloodCirculation />;
    case 'digestive':
      return <DigestiveSystem />;
    case 'respiratory':
      return <RespiratorySystem />;
    default:
      return <Heart3D beating={beating} />;
  }
}

export default function LessonOrgan() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [selectedOrgan, setSelectedOrgan] = useState('heart');
  const [beating, setBeating] = useState(true);
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const organInfo: Record<string, { name: string; emoji: string; description: string }> = {
    heart: { name: '心脏', emoji: '❤️', description: '人体的泵，负责输送血液' },
    lungs: { name: '肺部', emoji: '🫁', description: '呼吸的重要器官，交换氧气' },
    circulation: { name: '血液循环', emoji: '🩸', description: '血液在全身流动的路径' },
    digestive: { name: '消化系统', emoji: '🍔', description: '消化食物，吸收营养' },
    respiratory: { name: '呼吸系统', emoji: '💨', description: '吸入氧气，呼出二氧化碳' },
  };

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
      title: '认识心脏',
      description: '选择心脏器官，观察它的跳动',
      checkCondition: () => selectedOrgan === 'heart' && beating,
      hint: '太棒了！心脏在咚咚咚地跳！',
    },
    {
      id: 2,
      title: '血液循环',
      description: '选择血液循环，了解血液的流动',
      checkCondition: () => selectedOrgan === 'circulation',
      hint: '正确！血液在全身循环流动！',
    },
    {
      id: 3,
      title: '呼吸系统',
      description: '选择呼吸系统，看看肺部是如何工作的',
      checkCondition: () => selectedOrgan === 'respiratory',
      hint: '真聪明！肺部帮助我们呼吸！',
    },
    {
      id: 4,
      title: '消化系统',
      description: '选择消化系统，了解食物的消化过程',
      checkCondition: () => selectedOrgan === 'digestive',
      hint: '完美！消化系统帮我们吸收营养！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '❤️ 心脏的主要功能是什么？',
      options: ['呼吸', '输送血液', '消化食物', '排泄废物'],
      correctAnswer: 1,
      hint: '提示: 心脏像一个泵',
      explanation: '正确！心脏是人体的泵，负责输送血液到全身',
    },
    {
      id: 2,
      question: '🫁 我们在哪里吸入氧气？',
      options: ['心脏', '肺部', '胃', '肠道'],
      correctAnswer: 1,
      hint: '提示: 呼吸时空气进入的地方',
      explanation: '对！肺部是呼吸器官，负责交换氧气',
    },
    {
      id: 3,
      question: '🩸 血液为什么会流动？',
      options: ['因为心脏跳动', '因为重力', '因为风吹', '因为温度'],
      correctAnswer: 0,
      hint: '提示: 想想心脏在做什么',
      explanation: '太棒了！心脏的跳动推动血液流动',
    },
    {
      id: 4,
      question: '🍔 食物在哪个器官中被消化？',
      options: ['心脏', '肺部', '胃和肠道', '大脑'],
      correctAnswer: 2,
      hint: '提示: 消化系统包括哪些器官？',
      explanation: '真聪明！胃和肠道组成消化系统，负责消化食物',
    },
    {
      id: 5,
      question: '💨 呼吸时，我们吸入什么气体？',
      options: ['二氧化碳', '氧气', '氮气', '氢气'],
      correctAnswer: 1,
      hint: '提示: 人体需要什么气体来维持生命？',
      explanation: '正确！我们呼吸时吸入氧气，呼出二氧化碳',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-red-900/20 to-pink-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">🫀</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">身体探秘</h1>
              <p className="text-sm text-red-300">探索人体奥秘</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">人体内部探险</h2>
                <p className="text-lg text-red-200 leading-relaxed">
                  今天，我们要进行一次神奇的<span className="text-2xl mx-1">🔬</span>人体探险！
                  我们要潜入人体内部，参观<span className="text-2xl mx-1">❤️</span>心脏、
                  <span className="text-2xl mx-1">🫁</span>肺部等重要的器官。
                  <br />
                  <span className="text-yellow-300 font-bold">
                    快准备好，让我们开始这场奇妙的探险之旅吧！
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
                    🎨 人体器官可视化
                  </h2>
                  <div className="text-center">
                    <div className="text-4xl mb-1">{organInfo[selectedOrgan].emoji}</div>
                    <div className="text-2xl font-bold text-red-400">
                      {organInfo[selectedOrgan].name}
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
                    <OrganVisualization selectedOrgan={selectedOrgan} beating={beating} />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-red-200 text-sm mt-4 text-center">
                  💡 {organInfo[selectedOrgan].description} - 拖动鼠标从不同角度观察！
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

                {/* 器官选择 */}
                <div className="space-y-3 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    🫀 选择要探索的器官
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => setSelectedOrgan('heart')}
                      className={`p-3 rounded-lg font-bold transition-all flex items-center gap-3 ${
                        selectedOrgan === 'heart'
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      <span className="text-2xl">❤️</span>
                      <span>心脏</span>
                    </button>
                    <button
                      onClick={() => setSelectedOrgan('lungs')}
                      className={`p-3 rounded-lg font-bold transition-all flex items-center gap-3 ${
                        selectedOrgan === 'lungs'
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      <span className="text-2xl">🫁</span>
                      <span>肺部</span>
                    </button>
                    <button
                      onClick={() => setSelectedOrgan('circulation')}
                      className={`p-3 rounded-lg font-bold transition-all flex items-center gap-3 ${
                        selectedOrgan === 'circulation'
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      <span className="text-2xl">🩸</span>
                      <span>血液循环</span>
                    </button>
                    <button
                      onClick={() => setSelectedOrgan('respiratory')}
                      className={`p-3 rounded-lg font-bold transition-all flex items-center gap-3 ${
                        selectedOrgan === 'respiratory'
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      <span className="text-2xl">💨</span>
                      <span>呼吸系统</span>
                    </button>
                    <button
                      onClick={() => setSelectedOrgan('digestive')}
                      className={`p-3 rounded-lg font-bold transition-all flex items-center gap-3 ${
                        selectedOrgan === 'digestive'
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      <span className="text-2xl">🍔</span>
                      <span>消化系统</span>
                    </button>
                  </div>
                </div>

                {/* 心跳控制 */}
                {selectedOrgan === 'heart' && (
                  <div className="p-4 bg-gradient-to-br from-red-500/10 to-pink-500/10 border-2 border-red-500/30 rounded-lg mb-6">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-white font-bold">💓 心跳动画</span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={beating}
                          onChange={(e) => setBeating(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-14 h-8 rounded-full transition-colors ${beating ? 'bg-red-500' : 'bg-slate-600'}`}>
                          <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${beating ? 'translate-x-7' : 'translate-x-1'}`} />
                        </div>
                      </div>
                    </label>
                  </div>
                )}

                {/* 器官知识 */}
                <div className="p-4 bg-gradient-to-br from-red-500/10 to-pink-500/10 border-2 border-red-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-red-400 mb-3 flex items-center gap-2">
                    📖 人体小知识
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <p className="text-red-300">
                      人体有<span className="font-bold">很多重要器官</span>！
                    </p>
                    <p className="text-white text-base leading-relaxed">
                      • <span className="text-yellow-300 font-bold">心脏：</span>每天跳动10万次
                    </p>
                    <p className="text-white text-base leading-relaxed">
                      • <span className="text-yellow-300 font-bold">肺部：</span>每天呼吸2万次
                    </p>
                    <p className="text-white text-base leading-relaxed">
                      • <span className="text-yellow-300 font-bold">血液：</span>全长可绕地球2圈
                    </p>
                  </div>
                </div>

                {/* 小技巧 */}
                <div className="p-4 bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-2 border-pink-500/30 rounded-lg">
                  <h3 className="font-bold text-pink-400 mb-2 flex items-center gap-2">
                    💡 小秘密
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-pink-400">•</span>
                      <span>
                        <span className="text-white font-bold">保护心脏：</span>多做运动！
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-400">•</span>
                      <span>
                        <span className="text-white font-bold">健康呼吸：</span>远离吸烟！
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="身体知识挑战"
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
            <p className="text-2xl text-white mb-2">你完成了所有挑战！</p>
            <p className="text-xl text-red-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-pink-300 mb-6">你真是个身体探秘小专家！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
