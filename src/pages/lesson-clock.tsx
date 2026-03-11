import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';
import * as THREE from 'three';

// 时钟组件
function Clock({ hour, minute, showLabels, showHourHand, showMinuteHand }: {
  hour: number;
  minute: number;
  showLabels: boolean;
  showHourHand: boolean;
  showMinuteHand: boolean;
}) {
  const clockRef = useRef<THREE.Group>(null);

  // 计算时针和分针的角度
  const hourAngle = -((hour % 12) * 30 + minute * 0.5) * (Math.PI / 180);
  const minuteAngle = -(minute * 6) * (Math.PI / 180);

  return (
    <group ref={clockRef}>
      {/* 钟面 */}
      <mesh position={[0, 0, -0.1]}>
        <cylinderGeometry args={[3, 3, 0.2, 32]} />
        <meshStandardMaterial color="#FEF3C7" />
      </mesh>

      {/* 钟面边框 */}
      <mesh position={[0, 0, -0.1]}>
        <torusGeometry args={[3, 0.15, 16, 64]} />
        <meshStandardMaterial color="#F59E0B" />
      </mesh>

      {/* 刻度和数字 */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x = Math.cos(angle) * 2.3;
        const y = Math.sin(angle) * 2.3;

        return (
          <group key={i}>
            {/* 刻度线 */}
            <mesh position={[Math.cos(angle) * 2.6, Math.sin(angle) * 2.6, 0.1]} rotation={[0, 0, angle + Math.PI / 2]}>
              <boxGeometry args={[0.1, 0.3, 0.05]} />
              <meshStandardMaterial color="#DC2626" />
            </mesh>

            {/* 数字标签 */}
            {showLabels && (
              <mesh position={[x, y, 0.15]}>
                <sphereGeometry args={[0.25, 16, 16]} />
                <meshStandardMaterial color={
                  i === 0 ? '#EF4444' : // 12点红色
                  i === 3 ? '#F59E0B' : // 3点橙色
                  i === 6 ? '#10B981' : // 6点绿色
                  i === 9 ? '#3B82F6' : // 9点蓝色
                  '#8B5CF6' // 其他紫色
                } />
              </mesh>
            )}
          </group>
        );
      })}

      {/* 中心点 */}
      <mesh position={[0, 0, 0.3]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#1F2937" />
      </mesh>

      {/* 时针 - 短而粗 */}
      {showHourHand && (
        <mesh position={[0, 0, 0.2]} rotation={[0, 0, hourAngle]}>
          <boxGeometry args={[0.15, 1.5, 0.05]} />
          <meshStandardMaterial color="#1F2937" />
        </mesh>
      )}

      {/* 分针 - 长而细 */}
      {showMinuteHand && (
        <mesh position={[0, 0.5, 0.25]} rotation={[0, 0, minuteAngle]}>
          <boxGeometry args={[0.08, 2.2, 0.05]} />
          <meshStandardMaterial color="#3B82F6" />
        </mesh>
      )}
    </group>
  );
}

export default function LessonClock() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [hour, setHour] = useState(10);
  const [minute, setMinute] = useState(0);
  const [showLabels, setShowLabels] = useState(false);
  const [showHourHand, setShowHourHand] = useState(true);
  const [showMinuteHand, setShowMinuteHand] = useState(true);
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
      cameraRef.current.position.set(0, 0.001, 0.001);
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

  // 定义引导任务
  const tasks: Task[] = [
    {
      id: 1,
      title: '认识钟面',
      description: '点击"显示数字"按钮，看看钟面上的数字是怎么排列的',
      checkCondition: () => showLabels === true,
      hint: '太棒了！钟面有12个数字，从1到12排成一圈！',
    },
    {
      id: 2,
      title: '找出时针和分针',
      description: '点击"隐藏时针"和"隐藏分针"按钮，看看哪根是时针，哪根是分针',
      checkCondition: () => showHourHand === true && showMinuteHand === true,
      hint: '对啦！时针短而粗，分针长而细！',
    },
    {
      id: 3,
      title: '认识整点',
      description: '把时间调到3点，观察时针和分针的位置',
      checkCondition: () => hour === 3 && minute === 0,
      hint: '正确！3点整时，分针指向12，时针指向3！',
    },
    {
      id: 4,
      title: '认识半点',
      description: '把时间调到6点半，观察时针和分针在哪里',
      checkCondition: () => hour === 6 && minute === 30,
      hint: '太聪明了！6点半时，分针指向6，时针在6和7的中间！',
    },
    {
      id: 5,
      title: '写出时间',
      description: '把时间调到10点15分，然后说出这是几点几分',
      checkCondition: () => hour === 10 && minute === 15,
      hint: '很好！10点15分也叫10点一刻！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '🕐 时针和分针有什么区别？',
      options: ['时针长，分针短', '时针短，分针长', '一样长', '没有区别'],
      correctAnswer: 1,
      hint: '提示: 看看3D时钟上哪根针更长',
      explanation: '正确！时针短而粗，分针长而细，这样我们就能区分它们了！',
    },
    {
      id: 2,
      question: '⏰ 当时钟显示3点整时，分针指向哪里？',
      options: ['3', '6', '9', '12'],
      correctAnswer: 3,
      hint: '提示: 整点时分针总是指向同一个数字',
      explanation: '太棒了！整点时，分针总是指向12！',
    },
    {
      id: 3,
      question: '🕐 6点半的时候，时针指向哪里？',
      options: ['6', '7', '6和7中间', '5和6中间'],
      correctAnswer: 2,
      hint: '提示: 半点时时针在两个数字中间',
      explanation: '对！6点半时，时针在6和7的中间，因为已经过了6点，还没到7点！',
    },
    {
      id: 4,
      question: '⏰ 下面哪个时间是整点？',
      options: ['4点30分', '5点00分', '8点15分', '9点45分'],
      correctAnswer: 1,
      hint: '提示: 整点的分钟数是0',
      explanation: '正确！5点00分就是5点整，分针指向12！',
    },
    {
      id: 5,
      question: '🕐 一天有多少小时？',
      options: ['12小时', '24小时', '60小时', '100小时'],
      correctAnswer: 1,
      hint: '提示: 一天有两个12小时',
      explanation: '太聪明了！一天有24小时，白天12小时，晚上12小时！',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-red-900/20 via-yellow-900/20 via-green-900/20 via-blue-900/20 via-purple-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">🕐</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">时间小管家</h1>
              <p className="text-sm text-yellow-300">学会认时间，做时间的主人</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">小闹钟的一天</h2>
                <p className="text-lg text-yellow-200 leading-relaxed">
                  小闹钟<span className="text-2xl mx-1">⏰</span>每天早上7点<span className="text-2xl mx-1">🌅</span>就开始工作，
                  它用<span className="text-2xl mx-1">🔔</span>清脆的声音叫醒小朋友。
                  <br />
                  中午12点<span className="text-2xl mx-1">☀️</span>，它提醒大家该吃午饭了；
                  晚上9点<span className="text-2xl mx-1">🌙</span>，它又催促大家该睡觉啦！
                  <br />
                  <span className="text-green-300 font-bold">
                    学会认时间，你也能做时间的小管家！
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
                    🎨 3D 时钟展示
                  </h2>
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {hour.toString().padStart(2, '0')}:{minute.toString().padStart(2, '0')}
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
                    <ambientLight intensity={0.8} />
                    <directionalLight position={[10, 10, 10]} castShadow intensity={1} />
                    <pointLight position={[0, 5, 5]} intensity={0.5} />
                    <Clock
                      hour={hour}
                      minute={minute}
                      showLabels={showLabels}
                      showHourHand={showHourHand}
                      showMinuteHand={showMinuteHand}
                    />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-yellow-200 text-sm mt-4 text-center">
                  💡 拖动鼠标旋转时钟，观察时针和分针的位置！
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

                {/* 时间调整 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    ⏰ 调整时间
                  </label>

                  {/* 小时选择 */}
                  <div className="space-y-2">
                    <div className="text-sm text-yellow-300">时: {hour}点</div>
                    <input
                      type="range"
                      min="1"
                      max="12"
                      value={hour}
                      onChange={(e) => setHour(Number(e.target.value))}
                      className="w-full h-3 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* 分钟选择 */}
                  <div className="space-y-2">
                    <div className="text-sm text-blue-300">分: {minute}分</div>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      step="5"
                      value={minute}
                      onChange={(e) => setMinute(Number(e.target.value))}
                      className="w-full h-3 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* 快速按钮 */}
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <button
                      onClick={() => { setHour(3); setMinute(0); }}
                      className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg text-white text-sm font-bold hover:opacity-90 transition-opacity"
                    >
                      3点
                    </button>
                    <button
                      onClick={() => { setHour(6); setMinute(30); }}
                      className="p-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg text-white text-sm font-bold hover:opacity-90 transition-opacity"
                    >
                      6点半
                    </button>
                    <button
                      onClick={() => { setHour(10); setMinute(15); }}
                      className="p-2 bg-gradient-to-r from-yellow-500 to-green-500 rounded-lg text-white text-sm font-bold hover:opacity-90 transition-opacity"
                    >
                      10:15
                    </button>
                  </div>
                </div>

                {/* 显示控制 */}
                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => setShowLabels(!showLabels)}
                    className={`w-full p-3 rounded-lg font-bold transition-all ${
                      showLabels
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {showLabels ? '隐藏数字' : '显示数字'}
                  </button>

                  <button
                    onClick={() => setShowHourHand(!showHourHand)}
                    className={`w-full p-3 rounded-lg font-bold transition-all ${
                      showHourHand
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {showHourHand ? '隐藏时针' : '显示时针'}
                  </button>

                  <button
                    onClick={() => setShowMinuteHand(!showMinuteHand)}
                    className={`w-full p-3 rounded-lg font-bold transition-all ${
                      showMinuteHand
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {showMinuteHand ? '隐藏分针' : '显示分针'}
                  </button>
                </div>

                {/* 时钟知识 */}
                <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
                    📖 时钟知识
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <p className="text-yellow-300">
                      钟面有<span className="font-bold text-xl">12个数字</span>
                    </p>
                    <p className="text-white text-base leading-relaxed">
                      <span className="text-red-400 font-bold">时针</span>短而粗，走一格是1小时<br />
                      <span className="text-blue-400 font-bold">分针</span>长而细，走一格是1分钟
                    </p>
                  </div>
                </div>

                {/* 整点和半点 */}
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-lg">
                  <h3 className="font-bold text-green-400 mb-2 flex items-center gap-2">
                    💡 整点和半点
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      <span>
                        <span className="text-white font-bold">整点：</span>分针指向12，时针指向几就是几点
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      <span>
                        <span className="text-white font-bold">半点：</span>分针指向6，时针在两个数字中间
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="时间挑战赛"
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
            <p className="text-lg text-green-300 mb-6">你真是个时间小管家！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
