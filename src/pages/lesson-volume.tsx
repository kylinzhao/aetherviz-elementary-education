import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';

// 积木堆叠可视化组件
function VolumeVisualization({ length, width, height }: { length: number; width: number; height: number }) {
  const cubeSize = 1;
  const spacing = 0.05;

  return (
    <group position={[-(length * cubeSize) / 2, -(height * cubeSize) / 2, -(width * cubeSize) / 2]}>
      {Array.from({ length: height }).map((_, y) =>
        Array.from({ length: width }).map((_, z) =>
          Array.from({ length: length }).map((_, x) => {
            const hue = ((x + y + z) * 15) % 360;
            return (
              <mesh
                key={`${x}-${y}-${z}`}
                position={[
                  x * (cubeSize + spacing),
                  y * (cubeSize + spacing),
                  z * (cubeSize + spacing),
                ]}
              >
                <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
                <meshStandardMaterial color={`hsl(${200 + (y * 20) % 60}, 70%, 50%)`} />
              </mesh>
            );
          })
        )
      )}
    </group>
  );
}

export default function LessonVolume() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [length, setLength] = useState(3);
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(2);
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const volume = length * width * height;

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
      cameraRef.current.position.set(0, 2, 15);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const sideView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(15, 2, 0);
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
      title: '认识体积 - 堆一个3层高的积木塔',
      description: '调整"📏 高度（层数）"滑块到3',
      checkCondition: () => height === 3,
      hint: '太棒了！你看，物体占空间的大小就是体积！',
    },
    {
      id: 2,
      title: '数小立方体 - 4层每层6个积木',
      description: '把长度调为3，宽度调为2，高度调为4',
      checkCondition: () => length === 3 && width === 2 && height === 4,
      hint: '正确！一共24个小立方体！',
    },
    {
      id: 3,
      title: '长方体体积 - 长×宽×高',
      description: '试试：长4、宽3、高2，算出体积是多少？',
      checkCondition: () => length === 4 && width === 3 && height === 2,
      hint: '对了！4 × 3 × 2 = 24',
    },
    {
      id: 4,
      title: '正方体体积 - 边长³',
      description: '把长、宽、高都调成3，这是正方体！',
      checkCondition: () => length === 3 && width === 3 && height === 3,
      hint: '完美！正方体体积 = 边长 × 边长 × 边长 = 27',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '📦 一个长方体，长4厘米，宽3厘米，高2厘米，体积是多少？',
      options: ['9立方厘米', '12立方厘米', '24立方厘米', '18立方厘米'],
      correctAnswer: 2,
      hint: '提示：体积 = 长 × 宽 × 高 = 4 × 3 × 2 = ?',
      explanation: '正确！长方体体积 = 长 × 宽 × 高 = 4 × 3 × 2 = 24立方厘米',
    },
    {
      id: 2,
      question: '📦 一个正方体棱长是5厘米，它的体积是多少？',
      options: ['25立方厘米', '100立方厘米', '125立方厘米', '15立方厘米'],
      correctAnswer: 2,
      hint: '提示：正方体体积 = 棱长 × 棱长 × 棱长',
      explanation: '太棒了！正方体体积 = 5 × 5 × 5 = 125立方厘米',
    },
    {
      id: 3,
      question: '📦 长方体体积公式是什么？',
      options: ['长 + 宽 + 高', '长 × 宽 × 高', '（长 + 宽）× 高', '长 × 宽 + 高'],
      correctAnswer: 1,
      hint: '提示：体积是用乘法计算的哦～',
      explanation: '对！长方体体积 = 长 × 宽 × 高',
    },
    {
      id: 4,
      question: '📦 一个盒子长6分米，宽4分米，高3分米，能装多少东西？',
      options: ['13立方分米', '72立方分米', '24立方分米', '48立方分米'],
      correctAnswer: 1,
      hint: '提示：6 × 4 × 3 = ?',
      explanation: '正确！6 × 4 × 3 = 72立方分米',
    },
    {
      id: 5,
      question: '📦 正方体和长方体的体积计算方法有什么相同？',
      options: ['都用加法', '都是长×宽×高', '都一样', '没有关系'],
      correctAnswer: 1,
      hint: '提示：正方体是特殊的长方体，长宽高都相等',
      explanation: '太聪明了！都是 长 × 宽 × 高，正方体就是三个边长相乘！',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900/20 to-green-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">📦</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">积木堆叠</h1>
              <p className="text-sm text-blue-300">学习体积的秘密</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">建造城堡</h2>
                <p className="text-lg text-blue-200 leading-relaxed">
                  小建筑师<span className="text-2xl mx-1">🏗️</span>要建造一座漂亮的城堡！
                  他需要用很多<span className="text-2xl mx-1">📦</span>积木来搭建。
                  让我们帮他算算需要多少积木吧！
                  <br />
                  <span className="text-green-300 font-bold">
                    体积就是物体占空间的大小，等于长×宽×高！
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
                    🎨 积木搭建场景
                  </h2>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400">
                      {length} × {width} × {height} = {volume}
                    </div>
                    <div className="text-sm text-blue-300 mt-1">
                      长{length} × 宽{width} × 高{height} = {volume}个积木
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
                    <VolumeVisualization length={length} width={width} height={height} />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-blue-200 text-sm mt-4 text-center">
                  💡 每个小方块都是一个积木！拖动滑块看看积木怎么变化～
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

                {/* 长度 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    📏 长度：{length}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>1</span>
                    <span>5</span>
                  </div>
                </div>

                {/* 宽度 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    📐 宽度：{width}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>1</span>
                    <span>5</span>
                  </div>
                </div>

                {/* 高度 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    🏗️ 高度（层数）：{height}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>1层</span>
                    <span>5层</span>
                  </div>
                </div>

                {/* 体积公式 */}
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                    📖 体积是什么？
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <p className="text-green-300">
                      体积是物体<span className="font-bold">占空间的大小</span>！
                    </p>
                    <p className="text-white text-base leading-relaxed">
                      长方体体积 = <span className="text-green-300 font-bold">长 × 宽 × 高</span>
                    </p>
                    <p className="text-white text-base leading-relaxed">
                      正方体体积 = <span className="text-green-300 font-bold">棱长 × 棱长 × 棱长</span>
                    </p>
                  </div>
                </div>

                {/* 小技巧 */}
                <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30 rounded-lg">
                  <h3 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
                    💡 小秘密
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>
                        <span className="text-white font-bold">单位：</span>体积用立方米(m³)、立方厘米(cm³)等
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>
                        <span className="text-white font-bold">数积木：</span>就是数有多少个小立方体
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="体积挑战赛"
                questions={quizQuestions}
                onComplete={(score, total) => {
                  setQuizScore(score);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 完成庆祝（所有任务和测验都完成后显示） */}
      {tasksCompleted && quizScore !== null && quizScore >= 4 && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="glass-panel rounded-3xl p-8 max-w-lg w-full text-center animate-bounce">
            <div className="text-8xl mb-4">🏆</div>
            <h2 className="text-4xl font-bold text-yellow-400 mb-4">太棒了！</h2>
            <p className="text-2xl text-white mb-2">你完成了所有挑战！</p>
            <p className="text-xl text-blue-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-green-300 mb-6">你真是个体积小达人！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
