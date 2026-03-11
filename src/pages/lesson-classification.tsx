import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Sphere } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';
import * as THREE from 'three';

// 动物模型组件
function AnimalModel({ type, position }: { type: string; position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = position[1] + Math.sin(time * 2 + position[0]) * 0.2;
    }
  });

  const colors: Record<string, string> = {
    mammal: '#8B4513',
    bird: '#3B82F6',
    reptile: '#22C55E',
    fish: '#F59E0B',
  };

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color={colors[type] || '#888888'} />
    </mesh>
  );
}

// 分类容器
function ClassificationContainer() {
  return (
    <group>
      {/* 哺乳动物区域 */}
      <mesh position={[-3, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[2.5, 3, 2.5]} />
        <meshStandardMaterial color="#8B4513" transparent opacity={0.3} />
      </mesh>
      {/* 鸟类区域 */}
      <mesh position={[3, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[2.5, 3, 2.5]} />
        <meshStandardMaterial color="#3B82F6" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export default function LessonClassification() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // 视角控制函数
  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 5, 12);
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
      title: '认识分类',
      description: '点击"哺乳动物"按钮，看看有什么特点',
      checkCondition: () => selectedCategory === 'mammal',
      hint: '太棒了！哺乳动物有毛发，喝奶长大！',
    },
    {
      id: 2,
      title: '哺乳动物',
      description: '哺乳动物有哪些特征？点击按钮查看',
      checkCondition: () => selectedCategory === 'mammal',
      hint: '对了！胎生、有毛发、喝母乳！',
    },
    {
      id: 3,
      title: '鸟类动物',
      description: '点击"鸟类"按钮，了解鸟类特征',
      checkCondition: () => selectedCategory === 'bird',
      hint: '真聪明！鸟类有羽毛，会下蛋，会飞！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '🐶 下列哪种动物是哺乳动物？',
      options: ['鸡', '狗', '金鱼', '青蛙'],
      correctAnswer: 1,
      hint: '提示: 哺乳动物有毛发，喝奶长大',
      explanation: '正确！狗是哺乳动物，有毛发，小时候喝母乳！',
    },
    {
      id: 2,
      question: '🐦 鸟类的特征是什么？',
      options: ['有鳞片', '有羽毛', '有毛皮', '有壳'],
      correctAnswer: 1,
      hint: '提示: 想想小鸟身上有什么',
      explanation: '对！鸟类全身覆盖羽毛，羽毛帮助它们飞翔！',
    },
    {
      id: 3,
      question: '🦁 哺乳动物用什么喂养宝宝？',
      options: ['虫子', '母乳', '草', '蜂蜜'],
      correctAnswer: 1,
      hint: '提示: 就像你小时候喝奶一样',
      explanation: '太棒了！哺乳动物用母乳喂养宝宝，所以叫"哺乳"动物！',
    },
    {
      id: 4,
      question: '🥚 哪些动物是从蛋里孵出来的？',
      options: ['猫', '狗', '鸡', '老鼠'],
      correctAnswer: 2,
      hint: '提示: 鸟类和爬行动物从蛋里出来',
      explanation: '正确！鸡是鸟类，从蛋里孵化出来！',
    },
    {
      id: 5,
      question: '🐋 鲸鱼是鱼还是哺乳动物？',
      options: ['是鱼', '是哺乳动物', '都不是', '不知道'],
      correctAnswer: 1,
      hint: '提示: 鲸鱼用肺呼吸，喝母乳长大',
      explanation: '太聪明了！鲸鱼虽然住在水里，但它们是哺乳动物，不是鱼！',
    },
  ];

  const categories = [
    {
      id: 'mammal',
      name: '哺乳动物',
      icon: '🐻',
      color: 'bg-amber-500/20',
      borderColor: 'border-amber-500/30',
      description: '有毛发、喝母乳、胎生',
      examples: ['🐶 狗', '🐱 猫', '🐘 大象', '🦁 狮子'],
    },
    {
      id: 'bird',
      name: '鸟类动物',
      icon: '🐦',
      color: 'bg-sky-500/20',
      borderColor: 'border-sky-500/30',
      description: '有羽毛、会下蛋、会飞翔',
      examples: ['🐔 鸡', '🦅 老鹰', '🦆 鸭子', '🐧 企鹅'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-green-900/20 to-emerald-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">🧬</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">动物分类家</h1>
              <p className="text-sm text-green-300">探索动物世界的奥秘</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-amber-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">动物园管理员</h2>
                <p className="text-lg text-green-200 leading-relaxed">
                  欢迎来到<span className="text-2xl mx-1">🦁</span>动物园！
                  今天你要当一名<span className="text-2xl mx-1">👨‍🌾</span>动物管理员，
                  帮小动物们找到正确的<span className="text-2xl mx-1">🏠</span>家！
                  <br />
                  <span className="text-yellow-300 font-bold">
                    让我们认识不同的动物类别吧！
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
                    🎨 动物分类园
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
                    <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 5, 12]} fov={60} />
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 20, 10]} castShadow />
                    <ClassificationContainer />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-green-200 text-sm mt-4 text-center">
                  💡 左边是哺乳动物区，右边是鸟类区！点击下方按钮了解详情～
                </p>
              </div>

              {/* 分类按钮 */}
              <div className="glass-panel rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">动物分类</h3>
                <div className="grid grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`p-4 rounded-lg text-left transition-all ${
                        selectedCategory === category.id
                          ? `${category.color} border-2 ${category.borderColor}`
                          : 'bg-slate-800/50 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-4xl">{category.icon}</span>
                        <span className="font-bold text-white text-lg">{category.name}</span>
                      </div>
                      {selectedCategory === category.id && (
                        <div className="space-y-2">
                          <p className="text-sm text-slate-200">{category.description}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {category.examples.map((example, idx) => (
                              <div key={idx} className="text-slate-300">
                                {example}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 任务卡片 */}
              <TaskCard
                title="学习任务"
                tasks={tasks}
                onAllCompleted={() => setTasksCompleted(true)}
              />
            </div>

            {/* 右侧：知识点和小测验 */}
            <div className="lg:col-span-1 space-y-6">
              {/* 知识点 */}
              <div className="glass-panel rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  📚 知识宝库
                </h2>

                {/* 什么是分类 */}
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-lg mb-4">
                  <h3 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                    🎯 什么是分类？
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <p>
                      分类就是把<span className="text-yellow-300 font-bold">相似的动物</span>
                      放在一起！
                    </p>
                    <p>
                      比如：有毛发的放一起，有羽毛的放一起
                    </p>
                  </div>
                </div>

                {/* 哺乳动物特征 */}
                <div className="p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-2 border-amber-500/30 rounded-lg mb-4">
                  <h3 className="font-bold text-amber-400 mb-3 flex items-center gap-2">
                    🐻 哺乳动物特征
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <span><span className="text-white font-bold">有毛发：</span>全身长毛</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <span><span className="text-white font-bold">喝母乳：</span>宝宝喝妈妈的奶</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <span><span className="text-white font-bold">胎生：</span>妈妈直接生宝宝</span>
                    </li>
                  </ul>
                </div>

                {/* 鸟类特征 */}
                <div className="p-4 bg-gradient-to-br from-sky-500/10 to-blue-500/10 border-2 border-sky-500/30 rounded-lg">
                  <h3 className="font-bold text-sky-400 mb-3 flex items-center gap-2">
                    🐦 鸟类特征
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400">•</span>
                      <span><span className="text-white font-bold">有羽毛：</span>全身覆盖羽毛</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400">•</span>
                      <span><span className="text-white font-bold">会下蛋：</span>从蛋里孵化</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400">•</span>
                      <span><span className="text-white font-bold">会飞翔：</span>大部分会飞</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="动物分类挑战"
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
            <p className="text-2xl text-white mb-2">你成了动物分类专家！</p>
            <p className="text-xl text-green-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-amber-300 mb-6">你真是个小小动物学家！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-amber-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
