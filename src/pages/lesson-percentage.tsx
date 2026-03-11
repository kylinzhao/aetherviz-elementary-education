import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';

// 百分数可视化（购物打折）
function PercentageVisualization({ percentage }: { percentage: number }) {
  const angle = (percentage / 100) * Math.PI * 2;

  return (
    <group>
      {/* 圆形背景（像标签） */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 3, 32]} />
        <meshStandardMaterial color="#1E293B" side={2} transparent opacity={0.5} />
      </mesh>
      {/* 百分比扇形 */}
      <mesh rotation={[Math.PI / 2, 0, angle / 2]}>
        <ringGeometry args={[0, 3, 32, 1, 0, angle]} />
        <meshStandardMaterial color="#DC2626" side={2} />
      </mesh>
      {/* 中心装饰（像金币） */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[1, 1, 0.2, 32]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

export default function LessonPercentage() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [percentage, setPercentage] = useState(75);
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // 视角控制函数
  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 8, 8);
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
      title: '认识百分数：找到25%',
      description: '拖动滑块到25%，看看是多少',
      checkCondition: () => percentage === 25,
      hint: '太棒了！25%就是1/4，四分之一！',
    },
    {
      id: 2,
      title: '一半是多少？找到50%',
      description: '拖动滑块到50%，看看是一半吗',
      checkCondition: () => percentage === 50,
      hint: '正确！50%就是一半，1/2！',
    },
    {
      id: 3,
      title: '全部是多少？找到100%',
      description: '拖动滑块到100%，是整个圆吗',
      checkCondition: () => percentage === 100,
      hint: '完美！100%就是全部，整个圆！',
    },
    {
      id: 4,
      title: '试试75%',
      description: '拖动滑块到75%，比一半多还是少',
      checkCondition: () => percentage === 75,
      hint: '做得好！75%比一半多，是四分之三！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '💯 50%是什么意思？',
      options: ['全部', '一半', '四分之一', '不知道'],
      correctAnswer: 1,
      hint: '提示: 50% = 1/2',
      explanation: '正确！50%就是一半！',
    },
    {
      id: 2,
      question: '💯 一个玩具100元，打5折（50%），要多少钱？',
      options: ['20元', '30元', '50元', '70元'],
      correctAnswer: 2,
      hint: '提示: 100元 × 50% = 100 × 0.5 = ?',
      explanation: '太棒了！100 × 50% = 50元！',
    },
    {
      id: 3,
      question: '💯 25%和1/4，它们一样吗？',
      options: ['一样', '不一样', '不知道'],
      correctAnswer: 0,
      hint: '提示: 25% = 25/100 = 1/4',
      explanation: '对了！25% = 1/4，它们相等！',
    },
    {
      id: 4,
      question: '💯 一个蛋糕吃了75%，还剩多少？',
      options: ['25%', '50%', '75%', '100%'],
      correctAnswer: 0,
      hint: '提示: 100% - 75% = ?',
      explanation: '太聪明了！100% - 75% = 25%，还剩25%！',
    },
    {
      id: 5,
      question: '💯 100%表示什么？',
      options: ['一半', '四分之一', '全部', '四分之三'],
      correctAnswer: 2,
      hint: '提示: 100%就是整个，所有东西',
      explanation: '正确！100%就是全部，完整的东西！',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-red-900/20 to-amber-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">💯</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">百分数大冒险</h1>
              <p className="text-sm text-red-300">购物打折</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-amber-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">购物打折大冒险</h2>
                <p className="text-lg text-red-200 leading-relaxed">
                  今天是<span className="text-2xl mx-1">🎉</span>购物节！
                  超市里好多东西都在<span className="text-2xl mx-1">🏷️</span>打折！
                  让我们看看<span className="text-2xl mx-1">🎯</span>打折标签上的百分数吧！
                  <br />
                  <span className="text-yellow-300 font-bold">
                    百分数就是"一百份中的几份"，帮你算出打折后的价格！
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
                    🎨 打折标签场景
                  </h2>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-yellow-400">{percentage}%</div>
                    <div className="text-sm text-red-300 mt-1">
                      {percentage === 25 && '四分之一（1/4）'}
                      {percentage === 50 && '一半（1/2）'}
                      {percentage === 75 && '四分之三（3/4）'}
                      {percentage === 100 && '全部（1）'}
                      {![25, 50, 75, 100].includes(percentage) && `${percentage / 100} 的部分`}
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
                    <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 8, 8]} fov={60} />
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 20, 10]} castShadow />
                    <PercentageVisualization percentage={percentage} />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-red-200 text-sm mt-4 text-center">
                  💡 红色部分是折扣比例，金色圆圈像硬币！拖动滑块试试看～
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

                {/* 百分比控制 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    🏷️ 打折幅度: {percentage}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={percentage}
                    onChange={(e) => setPercentage(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* 百分数的意义 */}
                <div className="p-4 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-red-400 mb-3 flex items-center gap-2">
                    📖 百分数是什么？
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <p className="text-red-300">
                      百分数就是<span className="font-bold">一百分之几</span>！
                    </p>
                    <p className="text-white text-base leading-relaxed">
                      {percentage}% 表示：
                    </p>
                    <p className="text-lg text-center py-2 bg-slate-800/50 rounded-lg">
                      <span className="text-yellow-400 font-bold">{percentage}</span>%
                      {' '} = {' '} {percentage}/100
                      {' '} = {' '}
                      <span className="text-yellow-400 font-bold">{(percentage / 100).toFixed(2)}</span>
                    </p>
                    <div className="mt-2 space-y-1">
                      {percentage === 25 && (
                        <p className="text-amber-300 text-sm">💡 25% = 1/4 = 四分之一</p>
                      )}
                      {percentage === 50 && (
                        <p className="text-amber-300 text-sm">💡 50% = 1/2 = 一半</p>
                      )}
                      {percentage === 75 && (
                        <p className="text-amber-300 text-sm">💡 75% = 3/4 = 四分之三</p>
                      )}
                      {percentage === 100 && (
                        <p className="text-amber-300 text-sm">💡 100% = 1 = 全部</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 快速选择 */}
                <div className="p-4 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-2 border-amber-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-amber-400 mb-3 flex items-center gap-2">
                    ⭐ 常见折扣
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 25, 50, 75, 100].map((v) => (
                      <button
                        key={v}
                        onClick={() => setPercentage(v)}
                        className="p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors border border-slate-700/50"
                      >
                        <div className="text-sm text-white">{v}%</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 小技巧 */}
                <div className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-2 border-orange-500/30 rounded-lg">
                  <h3 className="font-bold text-orange-400 mb-2 flex items-center gap-2">
                    💡 小秘密
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400">•</span>
                      <span>
                        <span className="text-white font-bold">25% = 1/4</span>
                        <br />
                        <span className="text-xs">四分之一，常见的"打七五折"</span>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400">•</span>
                      <span>
                        <span className="text-white font-bold">50% = 1/2</span>
                        <br />
                        <span className="text-xs">一半，就是"打五折"</span>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400">•</span>
                      <span>
                        <span className="text-white font-bold">100% = 1</span>
                        <br />
                        <span className="text-xs">全部，没有打折</span>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="折扣挑战赛"
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
            <p className="text-lg text-green-300 mb-6">你真是个百分数小达人！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-amber-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
