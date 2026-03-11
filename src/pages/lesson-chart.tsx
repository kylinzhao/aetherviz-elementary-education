import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';

// 柱状图可视化组件
function BarChart({ data }: { data: number[] }) {
  const colors = [
    '#FF6B6B', // 红
    '#4ECDC4', // 青
    '#45B7D1', // 蓝
    '#FFA07A', // 橙
    '#98D8C8', // 绿
    '#F7DC6F', // 黄
  ];

  return (
    <group position={[-(data.length * 1.5) / 2, -2, 0]}>
      {data.map((value, index) => (
        <group key={index} position={[index * 1.5, 0, 0]}>
          {/* 柱子 */}
          <mesh position={[0, value / 2, 0]}>
            <boxGeometry args={[1, value, 1]} />
            <meshStandardMaterial color={colors[index % colors.length]} />
          </mesh>
          {/* 底座 */}
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[1.2, 0.1, 1.2]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
        </group>
      ))}
      {/* 地板 */}
      <mesh position={[(data.length * 1.5) / 2 - 0.75, -0.1, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[data.length * 1.5 + 0.5, 0.2, 3]} />
        <meshStandardMaterial color="#1F2937" />
      </mesh>
    </group>
  );
}

// 饼图可视化组件
function PieChart({ data }: { data: number[] }) {
  const colors = [
    '#FF6B6B', // 红
    '#4ECDC4', // 青
    '#45B7D1', // 蓝
    '#FFA07A', // 橙
    '#98D8C8', // 绿
  ];

  const total = data.reduce((sum, val) => sum + val, 0);
  let startAngle = 0;

  return (
    <group>
      {data.map((value, index) => {
        const sliceAngle = (value / total) * Math.PI * 2;
        const endAngle = startAngle + sliceAngle;

        // 创建扇形（简化为多个薄方块）
        const segments = 10;
        const segmentAngle = sliceAngle / segments;

        const slices = Array.from({ length: segments }).map((_, i) => {
          const angle = startAngle + i * segmentAngle;
          return (
            <mesh
              key={`${index}-${i}`}
              position={[
                Math.cos(angle) * 1.5,
                0,
                Math.sin(angle) * 1.5,
              ]}
              rotation={[0, -angle, 0]}
            >
              <boxGeometry args={[segmentAngle * 2, 0.5, 3]} />
              <meshStandardMaterial color={colors[index % colors.length]} />
            </mesh>
          );
        });

        startAngle = endAngle;
        return <group key={index}>{slices}</group>;
      })}
    </group>
  );
}

export default function LessonChart() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const [barData, setBarData] = useState([3, 5, 2, 6, 4]);
  const [pieData, setPieData] = useState([3, 2, 5]);
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
      title: '认识柱状图 - 看看谁的积木最高',
      description: '点击"📊 柱状图"按钮，选择柱状图',
      checkCondition: () => chartType === 'bar',
      hint: '太棒了！柱状图用高度表示数量！',
    },
    {
      id: 2,
      title: '认识饼图 - 看看每份占多少',
      description: '点击"🥧 饼图"按钮，选择饼图',
      checkCondition: () => chartType === 'pie',
      hint: '正确！饼图用扇形大小表示占比！',
    },
    {
      id: 3,
      title: '读取数据 - 找出最多的',
      description: '在柱状图模式，观察哪根柱子最高（答案：第4根，高度6）',
      checkCondition: () => chartType === 'bar' && barData[3] === 6,
      hint: '对啦！第4根柱子最高，表示数量最多是6！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '📊 柱状图主要用来表示什么？',
      options: ['部分与整体的关系', '数量的大小比较', '变化的趋势', '时间的流逝'],
      correctAnswer: 1,
      hint: '提示：柱子越高代表数量越大～',
      explanation: '正确！柱状图用柱子的高度来表示数量的大小，方便比较！',
    },
    {
      id: 2,
      question: '🥧 饼图主要用来表示什么？',
      options: ['数量的大小比较', '部分占整体的比例', '变化的趋势', '位置的关系'],
      correctAnswer: 1,
      hint: '提示：就像披萨分块一样～',
      explanation: '太聪明了！饼图用扇形大小表示各部分占整体的比例！',
    },
    {
      id: 3,
      question: '📊 如果柱状图中第3根柱子高度是8，表示什么？',
      options: ['第3个项目有8个', '一共有8个项目', '第3个项目占80%', '3加8等于11'],
      correctAnswer: 0,
      hint: '提示：柱子的高度直接对应数量',
      explanation: '对！第3根柱子高度是8，表示第3个项目的数量是8！',
    },
    {
      id: 4,
      question: '🥧 饼图的一半（半圆）表示占整体的多少？',
      options: ['25%', '50%', '75%', '100%'],
      correctAnswer: 1,
      hint: '提示：一半就是二分之一',
      explanation: '正确！半圆占整个圆的一半，就是50%！',
    },
    {
      id: 5,
      question: '📊 柱状图和饼图有什么共同点？',
      options: ['都只用一种颜色', '都能展示数据', '都只能表示3个数据', '都不需要标注'],
      correctAnswer: 1,
      hint: '提示：它们都是图表的一种',
      explanation: '太棒了！它们都是用来展示数据的好工具，让数据更容易理解！',
    },
  ];

  const currentData = chartType === 'bar' ? barData : pieData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-red-900/20 via-yellow-900/20 via-green-900/20 via-blue-900/20 via-purple-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">📊</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">图表小达人</h1>
              <p className="text-sm text-purple-300">学会看懂数据图表</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">班级统计员</h2>
                <p className="text-lg text-purple-200 leading-relaxed">
                  小明是班里的<span className="text-2xl mx-1">📊</span>统计员！
                  今天老师让他统计同学们最喜欢的水果<span className="text-2xl mx-1">🍎</span>。
                  他用<span className="text-2xl mx-1">📈</span>图表来展示数据，
                  这样大家一眼就能看明白了！
                  <br />
                  <span className="text-yellow-300 font-bold">
                    图表能把数字变成漂亮的图画，让数据更容易理解！
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
                    🎨 图表展示场景
                  </h2>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-400">
                      {chartType === 'bar' ? '📊 柱状图' : '🥧 饼图'}
                    </div>
                    <div className="text-sm text-purple-300 mt-1">
                      {chartType === 'bar'
                        ? `数据：${barData.join(', ')}`
                        : `数据：${pieData.join(', ')}（总和：${pieData.reduce((a, b) => a + b, 0)}）`}
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
                    {chartType === 'bar' ? (
                      <BarChart data={barData} />
                    ) : (
                      <PieChart data={pieData} />
                    )}
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-purple-200 text-sm mt-4 text-center">
                  💡 {chartType === 'bar'
                    ? '柱状图用不同高度的柱子表示数量大小！'
                    : '饼图用扇形大小表示各部分占整体的比例！'}
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

                {/* 图表类型选择 */}
                <div className="space-y-3 mb-6">
                  <label className="block text-white font-bold text-lg">选择图表类型：</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setChartType('bar')}
                      className={`py-3 px-4 rounded-lg font-bold transition-all ${
                        chartType === 'bar'
                          ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      📊 柱状图
                    </button>
                    <button
                      onClick={() => setChartType('pie')}
                      className={`py-3 px-4 rounded-lg font-bold transition-all ${
                        chartType === 'pie'
                          ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      🥧 饼图
                    </button>
                  </div>
                </div>

                {/* 数据调整（仅柱状图） */}
                {chartType === 'bar' && (
                  <div className="mb-6">
                    <label className="block text-white font-bold text-lg mb-3">
                      📊 调整柱子高度：
                    </label>
                    <div className="space-y-2">
                      {barData.map((value, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-white text-sm w-16">柱子{index + 1}:</span>
                          <input
                            type="range"
                            min="1"
                            max="8"
                            step="1"
                            value={value}
                            onChange={(e) => {
                              const newData = [...barData];
                              newData[index] = Number(e.target.value);
                              setBarData(newData);
                            }}
                            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            style={{
                              accentColor: [
                                '#FF6B6B',
                                '#4ECDC4',
                                '#45B7D1',
                                '#FFA07A',
                                '#98D8C8',
                              ][index],
                            }}
                          />
                          <span className="text-white text-sm w-8">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 数据调整（仅饼图） */}
                {chartType === 'pie' && (
                  <div className="mb-6">
                    <label className="block text-white font-bold text-lg mb-3">
                      🥧 调整数据大小：
                    </label>
                    <div className="space-y-2">
                      {pieData.map((value, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span
                            className="text-white text-sm w-20"
                            style={{
                              color: ['#FF6B6B', '#4ECDC4', '#45B7D1'][index],
                            }}
                          >
                            数据{index + 1}:
                          </span>
                          <input
                            type="range"
                            min="1"
                            max="8"
                            step="1"
                            value={value}
                            onChange={(e) => {
                              const newData = [...pieData];
                              newData[index] = Number(e.target.value);
                              setPieData(newData);
                            }}
                            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            style={{
                              accentColor: ['#FF6B6B', '#4ECDC4', '#45B7D1'][index],
                            }}
                          />
                          <span className="text-white text-sm w-8">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 图表知识 */}
                <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-purple-400 mb-3 flex items-center gap-2">
                    📖 图表知识
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <p className="text-purple-300">
                      <span className="text-white font-bold">柱状图：</span>
                      用柱子高度比较数量大小
                    </p>
                    <p className="text-purple-300">
                      <span className="text-white font-bold">饼图：</span>
                      用扇形表示各部分占比
                    </p>
                    <p className="text-purple-300">
                      <span className="text-white font-bold">数据：</span>
                      可以用数字、颜色、图形展示
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
                        <span className="text-white font-bold">彩虹色：</span>不同颜色帮助区分数据
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>
                        <span className="text-white font-bold">找规律：</span>最高的柱子或最大的扇形就是最多的
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="图表挑战赛"
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
            <p className="text-xl text-purple-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-green-300 mb-6">你真是个图表小达人！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
