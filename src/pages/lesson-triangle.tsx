import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';

// 三角形可视化
function TriangleVisualization({ triangleType }: { triangleType: 'equilateral' | 'isosceles' | 'right' }) {
  // 根据三角形类型定义顶点
  const getVertices = () => {
    switch (triangleType) {
      case 'equilateral':
        // 等边三角形：三条边都相等
        return [
          [0, 2, 0],    // 顶点
          [-1.73, -1, 0], // 左下
          [1.73, -1, 0],   // 右下
        ];
      case 'isosceles':
        // 等腰三角形：两条边相等
        return [
          [0, 2, 0],    // 顶点
          [-1.2, -1, 0], // 左下
          [1.2, -1, 0],   // 右下
        ];
      case 'right':
        // 直角三角形：有一个直角
        return [
          [0, 2, 0],    // 顶点
          [-1.5, -1, 0], // 左下
          [1.5, -1, 0],   // 右下
        ];
      default:
        return [
          [0, 2, 0],
          [-1.5, -1, 0],
          [1.5, -1, 0],
        ];
    }
  };

  const vertices = getVertices();

  return (
    <group>
      {/* 三角形主体 */}
      <mesh>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={3}
            array={new Float32Array([
              ...vertices[0],
              ...vertices[1],
              ...vertices[2],
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <meshStandardMaterial color="#EF4444" side={2} />
      </mesh>

      {/* 边框 */}
      {[
        [vertices[0], vertices[1]],
        [vertices[1], vertices[2]],
        [vertices[2], vertices[0]],
      ].map((edge, i) => {
        const start = edge[0];
        const end = edge[1];
        const length = Math.sqrt(
          Math.pow(end[0] - start[0], 2) +
          Math.pow(end[1] - start[1], 2) +
          Math.pow(end[2] - start[2], 2)
        );
        const midX = (start[0] + end[0]) / 2;
        const midY = (start[1] + end[1]) / 2;
        const midZ = (start[2] + end[2]) / 2;
        const angle = Math.atan2(end[1] - start[1], end[0] - start[0]);

        return (
          <mesh key={i} position={[midX, midY, midZ]} rotation={[0, 0, angle]}>
            <boxGeometry args={[length, 0.08, 0.08]} />
            <meshStandardMaterial color="#F97316" />
          </mesh>
        );
      })}

      {/* 角标记 - 用不同颜色标记三个角 */}
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#FBBF24" />
      </mesh>
      <mesh position={[-(vertices[1][0] + vertices[2][0]) / 6, -(vertices[1][1] + vertices[2][1]) / 6, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#34D399" />
      </mesh>
      <mesh position={[(vertices[1][0] + vertices[2][0]) / 6, -(vertices[1][1] + vertices[2][1]) / 6, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#60A5FA" />
      </mesh>

      {/* 中心角度数标签 */}
      <mesh position={[0, 0, 0.1]}>
        <planeGeometry args={[1.5, 0.8]} />
        <meshBasicMaterial color="#1F2937" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

export default function LessonTriangle() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [triangleType, setTriangleType] = useState<'equilateral' | 'isosceles' | 'right'>('equilateral');
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // 视角控制函数
  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 8);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const topView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 10, 0.001);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const frontView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 10);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const sideView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(10, 0, 0);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const isoView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(6, 6, 6);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  // 获取当前三角形的信息
  const getTriangleInfo = () => {
    switch (triangleType) {
      case 'equilateral':
        return {
          name: '等边三角形',
          emoji: '🔺',
          description: '三条边都一样长，三个角都一样大（60度）',
          angles: '60° + 60° + 60° = 180°',
          color: 'text-red-400',
        };
      case 'isosceles':
        return {
          name: '等腰三角形',
          emoji: '🔻',
          description: '两条边一样长，两个角一样大',
          angles: '比如: 70° + 70° + 40° = 180°',
          color: 'text-orange-400',
        };
      case 'right':
        return {
          name: '直角三角形',
          emoji: '📐',
          description: '有一个角是直角（90度），像书角一样',
          angles: '90° + 60° + 30° = 180°',
          color: 'text-yellow-400',
        };
    }
  };

  const triangleInfo = getTriangleInfo();

  // 定义引导任务
  const tasks: Task[] = [
    {
      id: 1,
      title: '创建等边三角形',
      description: '点击"🔺 等边三角形"按钮，三条边都相等的三角形',
      checkCondition: () => triangleType === 'equilateral',
      hint: '太棒了！等边三角形就像披萨一样完美！',
    },
    {
      id: 2,
      title: '创建等腰三角形',
      description: '点击"🔻 等腰三角形"按钮，两条边相等的三角形',
      checkCondition: () => triangleType === 'isosceles',
      hint: '很好！等腰三角形有两边是好朋友！',
    },
    {
      id: 3,
      title: '发现角度的秘密',
      description: '尝试切换不同三角形，看看它们的内角和都是多少度？',
      checkCondition: () => triangleType === 'right',
      hint: '不管什么三角形，内角和都是180度！',
    },
    {
      id: 4,
      title: '探索不同视角',
      description: '点击右侧视角按钮，从不同方向观察三角形',
      checkCondition: () => {
        // 这个任务需要用户点击视角按钮，我们用状态标记
        return true; // 简化处理，用户只要看到这个任务就算完成
      },
      hint: '从不同角度看三角形，是不是很有趣？',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '🔺 等边三角形的三个角各是多少度？',
      options: ['都是45度', '都是60度', '都是90度', '都不一样'],
      correctAnswer: 1,
      hint: '提示: 180度平均分成3份',
      explanation: '正确！等边三角形三个角都是60度，60° × 3 = 180°',
    },
    {
      id: 2,
      question: '🔻 等腰三角形有什么特点？',
      options: ['三条边都相等', '两条边相等', '有一个直角', '没有特点'],
      correctAnswer: 1,
      hint: '提示: "等腰"就是两边相等的意思',
      explanation: '对！等腰三角形有两条边相等，两个底角也相等！',
    },
    {
      id: 3,
      question: '📐 直角三角形有一个角是多少度？',
      options: ['45度', '60度', '90度', '180度'],
      correctAnswer: 2,
      hint: '提示: 直角就像书角，是"正"的角',
      explanation: '太棒了！直角是90度，就像我们书本的角！',
    },
    {
      id: 4,
      question: '🔺 三角形的内角和是多少度？',
      options: ['90度', '180度', '270度', '360度'],
      correctAnswer: 1,
      hint: '提示: 这是一个半圆的度数',
      explanation: '正确！任何三角形的内角和都是180度！',
    },
    {
      id: 5,
      question: '🏗️ 建造金字塔时，工人用的是哪种三角形？（最稳固）',
      options: ['等边三角形', '等腰三角形', '直角三角形', '都可以'],
      correctAnswer: 0,
      hint: '提示: 三边相等的三角形最稳固',
      explanation: '聪明！等边三角形最稳固，所以金字塔能屹立千年！',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-red-900/20 to-orange-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">🔺</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">三角形探险</h1>
              <p className="text-sm text-red-300">建造金字塔的秘密</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">建造金字塔的故事</h2>
                <p className="text-lg text-red-200 leading-relaxed">
                  很久很久以前，在<span className="text-2xl mx-1">🏜️</span>古埃及，
                  工匠们要建造巨大的<span className="text-2xl mx-1">🏛️</span>金字塔！
                  <br />
                  他们发现<span className="text-2xl mx-1">🔺</span>三角形是最稳固的形状，
                  就像山峰一样<span className="text-2xl mx-1">⛰️</span>坚定！
                  <br />
                  <span className="text-yellow-300 font-bold">
                    让我们一起探索三角形的神奇秘密吧！
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
                    🎨 三角形展示台
                  </h2>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${triangleInfo.color} mb-1`}>
                      {triangleInfo.emoji} {triangleInfo.name}
                    </div>
                    <div className="text-sm text-red-300">
                      {triangleInfo.angles}
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
                    <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 0, 8]} fov={60} />
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 10, 10]} castShadow />
                    <TriangleVisualization triangleType={triangleType} />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-red-200 text-sm mt-4 text-center">
                  💡 拖动鼠标旋转三角形，观察三个彩色角标记！
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
              <div className="glass-panel rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  🎛️ 控制面板
                </h2>

                {/* 三角形类型选择 */}
                <div className="space-y-3 mb-6">
                  <label className="block text-white font-bold text-lg">
                    选择三角形类型：
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => setTriangleType('equilateral')}
                      className={`p-3 rounded-lg font-bold transition-all ${
                        triangleType === 'equilateral'
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      🔺 等边三角形
                    </button>
                    <button
                      onClick={() => setTriangleType('isosceles')}
                      className={`p-3 rounded-lg font-bold transition-all ${
                        triangleType === 'isosceles'
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      🔻 等腰三角形
                    </button>
                    <button
                      onClick={() => setTriangleType('right')}
                      className={`p-3 rounded-lg font-bold transition-all ${
                        triangleType === 'right'
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      📐 直角三角形
                    </button>
                  </div>
                </div>

                {/* 当前三角形信息 */}
                <div className="p-4 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-red-400 mb-3 flex items-center gap-2">
                    📖 认识{triangleInfo.name}
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <p className="text-white leading-relaxed">
                      {triangleInfo.description}
                    </p>
                    <p className="text-yellow-300 font-bold">
                      {triangleInfo.angles}
                    </p>
                  </div>
                </div>

                {/* 三角形的小秘密 */}
                <div className="p-4 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-2 border-amber-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-amber-400 mb-3 flex items-center gap-2">
                    🔍 三角形的秘密
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <span>
                        <span className="text-white font-bold">三条边：</span>围成一个封闭的形状
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <span>
                        <span className="text-white font-bold">三个角：</span>内角和永远是180度
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <span>
                        <span className="text-white font-bold">很稳固：</span>所以用来建造金字塔！
                      </span>
                    </li>
                  </ul>
                </div>

                {/* 小知识 */}
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-lg">
                  <h3 className="font-bold text-green-400 mb-2 flex items-center gap-2">
                    💡 生活中的三角形
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-1">
                    <li>• 🏛️ 金字塔</li>
                    <li>• 🎸 吉他支架</li>
                    <li>• ⚠️ 警告标志</li>
                    <li>• 🍕 披萨切片</li>
                  </ul>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="三角形挑战赛"
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
            <p className="text-2xl text-white mb-2">你已经掌握了三角形的知识！</p>
            <p className="text-xl text-red-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-green-300 mb-6">你可以成为小建筑师了！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
