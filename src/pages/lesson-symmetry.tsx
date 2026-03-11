import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';

// 对称图形可视化组件
function SymmetryVisualization({ showAxis, showRotation, shapeType }: {
  showAxis: boolean;
  showRotation: boolean;
  shapeType: 'butterfly' | 'star' | 'heart';
}) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (showRotation && meshRef.current) {
      meshRef.current.rotation.z += 0.01;
    }
  });

  return (
    <group>
      {/* 对称轴 */}
      {showAxis && (
        <mesh position={[0, 3, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 6, 8]} />
          <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.5} />
        </mesh>
      )}

      {/* 蝴蝶形状 */}
      {shapeType === 'butterfly' && (
        <group ref={meshRef}>
          {/* 左翅膀 */}
          <mesh position={[-1.5, 0, 0]}>
            <sphereGeometry args={[1.5, 16, 16]} />
            <meshStandardMaterial color="#a855f7" />
          </mesh>
          <mesh position={[-2.5, 0.8, 0]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#c084fc" />
          </mesh>
          {/* 右翅膀 */}
          <mesh position={[1.5, 0, 0]}>
            <sphereGeometry args={[1.5, 16, 16]} />
            <meshStandardMaterial color="#a855f7" />
          </mesh>
          <mesh position={[2.5, 0.8, 0]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#c084fc" />
          </mesh>
          {/* 身体 */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 2, 8]} />
            <meshStandardMaterial color="#ec4899" />
          </mesh>
        </group>
      )}

      {/* 星星形状 */}
      {shapeType === 'star' && (
        <group ref={meshRef}>
          {[0, 72, 144, 216, 288].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <mesh key={angle} position={[Math.cos(rad) * 2, Math.sin(rad) * 2, 0]}>
                <coneGeometry args={[0.5, 1.5, 4]} />
                <meshStandardMaterial color="#f472b6" />
              </mesh>
            );
          })}
          {/* 内圈小星星 */}
          {[36, 108, 180, 252, 324].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <mesh key={angle} position={[Math.cos(rad) * 1, Math.sin(rad) * 1, 0]}>
                <coneGeometry args={[0.3, 1, 4]} />
                <meshStandardMaterial color="#fbcfe8" />
              </mesh>
            );
          })}
        </group>
      )}

      {/* 爱心形状 */}
      {shapeType === 'heart' && (
        <group ref={meshRef}>
          <mesh position={[-0.8, 0.5, 0]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#db2777" />
          </mesh>
          <mesh position={[0.8, 0.5, 0]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#db2777" />
          </mesh>
          <mesh position={[0, -0.5, 0]} rotation={[0, 0, 0]}>
            <coneGeometry args={[1.2, 2, 3]} />
            <meshStandardMaterial color="#be185d" />
          </mesh>
        </group>
      )}
    </group>
  );
}

export default function LessonSymmetry() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [showAxis, setShowAxis] = useState(false);
  const [showRotation, setShowRotation] = useState(false);
  const [shapeType, setShapeType] = useState<'butterfly' | 'star' | 'heart'>('butterfly');
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
      title: '找出蝴蝶的对称轴',
      description: '点击"显示对称轴"按钮，看看蝴蝶的对称轴在哪里',
      checkCondition: () => showAxis === true,
      hint: '太棒了！粉色的线就是对称轴，它把蝴蝶分成完全一样的两半！',
    },
    {
      id: 2,
      title: '看看旋转的星星',
      description: '点击"开始旋转"按钮，观察星星旋转180度会怎样',
      checkCondition: () => showRotation === true,
      hint: '哇！星星转180度后还是原来的样子，这就是中心对称！',
    },
    {
      id: 3,
      title: '换一个图形试试',
      description: '点击"爱心"按钮，看看爱心的对称性',
      checkCondition: () => shapeType === 'heart',
      hint: '漂亮！爱心也是轴对称图形，沿着中间对折完全重合！',
    },
    {
      id: 4,
      title: '观察五角星',
      description: '点击"星星"按钮，看看星星有多少条对称轴',
      checkCondition: () => shapeType === 'star' && showAxis === true,
      hint: '太聪明了！五角星有5条对称轴，每一条都穿过一个角！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '🦋 蝴蝶的对称轴在哪里？',
      options: ['横着中间', '竖着中间', '斜着', '没有对称轴'],
      correctAnswer: 1,
      hint: '提示: 想象把蝴蝶从中间竖着对折',
      explanation: '正确！蝴蝶的对称轴在竖着中间，把蝴蝶分成左右完全相同的两部分',
    },
    {
      id: 2,
      question: '⭐ 下面哪个是轴对称图形？',
      options: ['月亮', '五角星', '数字3', '小写字母b'],
      correctAnswer: 1,
      hint: '提示: 想想哪个图形能对折后完全重合',
      explanation: '太棒了！五角星是轴对称图形，它有5条对称轴！',
    },
    {
      id: 3,
      question: '🔄 中心对称是什么意思？',
      options: ['图形有中心', '旋转180度后重合', '有一条对称轴', '图形是圆的'],
      correctAnswer: 1,
      hint: '提示: 想想星星旋转后会发生什么',
      explanation: '对！中心对称就是绕中心旋转180度后和原来一模一样！',
    },
    {
      id: 4,
      question: '❤️ 爱心有几条对称轴？',
      options: ['1条', '2条', '4条', '无数条'],
      correctAnswer: 0,
      hint: '提示: 爱心只能竖着对折',
      explanation: '正确！爱心只有1条对称轴，就是竖着中间的那条线！',
    },
    {
      id: 5,
      question: '🏠 下面哪个不是对称图形？',
      options: ['等边三角形', '正方形', '数字8', '小写字母p'],
      correctAnswer: 3,
      hint: '提示: 试着对折看看哪些能重合',
      explanation: '太聪明了！小写字母p不是对称图形，对折后不能完全重合！',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/20 to-pink-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">🦋</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">蝴蝶的对称翅膀</h1>
              <p className="text-sm text-purple-300">探索对称的秘密</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">蝴蝶探险</h2>
                <p className="text-lg text-purple-200 leading-relaxed">
                  小蝴蝶<span className="text-2xl mx-1">🦋</span>在花园里飞舞，
                  它发现了一个神奇的<span className="text-2xl mx-1">✨</span>秘密：
                  自己的翅膀两边<span className="text-2xl mx-1">🎯</span>一模一样！
                  <br />
                  <span className="text-yellow-300 font-bold">
                    这就是对称！大自然里到处都是对称的美！
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
                    🎨 对称图形展示
                  </h2>
                  <div className="text-center">
                    <div className="text-sm text-purple-300">
                      {shapeType === 'butterfly' && '🦋 蝴蝶'}
                      {shapeType === 'star' && '⭐ 星星'}
                      {shapeType === 'heart' && '❤️ 爱心'}
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
                    <SymmetryVisualization showAxis={showAxis} showRotation={showRotation} shapeType={shapeType} />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-purple-200 text-sm mt-4 text-center">
                  💡 观察图形的对称性，试试不同的形状和角度！
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

                {/* 形状选择 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    🎨 选择形状
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setShapeType('butterfly')}
                      className={`p-3 rounded-lg font-bold text-2xl transition-all ${
                        shapeType === 'butterfly'
                          ? 'bg-purple-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      🦋
                    </button>
                    <button
                      onClick={() => setShapeType('star')}
                      className={`p-3 rounded-lg font-bold text-2xl transition-all ${
                        shapeType === 'star'
                          ? 'bg-purple-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      ⭐
                    </button>
                    <button
                      onClick={() => setShapeType('heart')}
                      className={`p-3 rounded-lg font-bold text-2xl transition-all ${
                        shapeType === 'heart'
                          ? 'bg-purple-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      ❤️
                    </button>
                  </div>
                </div>

                {/* 对称轴开关 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    📏 对称轴
                  </label>
                  <button
                    onClick={() => setShowAxis(!showAxis)}
                    className={`w-full p-3 rounded-lg font-bold transition-all ${
                      showAxis
                        ? 'bg-pink-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {showAxis ? '隐藏对称轴' : '显示对称轴'}
                  </button>
                </div>

                {/* 旋转开关 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    🔄 旋转动画
                  </label>
                  <button
                    onClick={() => setShowRotation(!showRotation)}
                    className={`w-full p-3 rounded-lg font-bold transition-all ${
                      showRotation
                        ? 'bg-pink-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {showRotation ? '停止旋转' : '开始旋转'}
                  </button>
                </div>

                {/* 对称的概念 */}
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                    📖 什么是对称？
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <p className="text-green-300">
                      对称就是<span className="font-bold">两边完全一样</span>！
                    </p>
                    <p className="text-white text-base leading-relaxed">
                      想象把图形沿着一条线<span className="text-yellow-300 font-bold">对折</span>，
                      两边能<span className="text-yellow-300 font-bold">完全重合</span>！
                    </p>
                  </div>
                </div>

                {/* 两种对称 */}
                <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-lg">
                  <h3 className="font-bold text-purple-400 mb-2 flex items-center gap-2">
                    💡 两种对称
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <span>
                        <span className="text-white font-bold">轴对称：</span>沿一条线对折重合（像蝴蝶）
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <span>
                        <span className="text-white font-bold">中心对称：</span>旋转180度重合（像星星）
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="对称挑战赛"
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
            <p className="text-xl text-purple-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-green-300 mb-6">你真是个对称小达人！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
