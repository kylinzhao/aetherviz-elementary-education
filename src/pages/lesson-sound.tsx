import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';
import * as THREE from 'three';

// 音叉振动动画
function TuningFork({ vibrating }: { vibrating: boolean }) {
  const forkRef = useRef<THREE.Group>(null);
  const [time, setTime] = useState(0);

  useFrame((state, delta) => {
    if (vibrating && forkRef.current) {
      setTime((prev) => prev + delta);
      const vibration = Math.sin(time * 50) * 0.1;
      forkRef.current.children.forEach((child, index) => {
        if (index === 1) {
          // 左叉
          child.rotation.z = vibration;
        } else if (index === 2) {
          // 右叉
          child.rotation.z = -vibration;
        }
      });
    }
  });

  return (
    <group ref={forkRef}>
      {/* 手柄 */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 3, 16]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* U型底部 */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.3, 0.1, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* 左叉 */}
      <mesh position={[-0.3, 0.5, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2.5, 16]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* 右叉 */}
      <mesh position={[0.3, 0.5, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2.5, 16]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// 声波可视化
function SoundWaves({ playing, frequency }: { playing: boolean; frequency: number }) {
  const wavesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (playing && wavesRef.current) {
      const time = state.clock.getElapsedTime();
      wavesRef.current.children.forEach((wave, index) => {
        const scale = 1 + ((time * 2 + index * 0.5) % 5);
        wave.scale.set(scale, scale, 1);
        const opacity = Math.max(0, 1 - scale / 5);
        (wave as any).material.opacity = opacity * 0.5;
      });
    }
  });

  const waves = [];
  for (let i = 0; i < 10; i++) {
    waves.push(
      <mesh key={i} position={[2, 0, 0]}>
        <ringGeometry args={[0.5, 0.6, 32]} />
        <meshStandardMaterial
          color="#EF4444"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>
    );
  }

  return <group ref={wavesRef}>{waves}</group>;
}

export default function LessonSound() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [vibrating, setVibrating] = useState(false);
  const [frequency, setFrequency] = useState(440);
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // 视角控制函数
  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 2, 8);
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
      cameraRef.current.position.set(6, 6, 6);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const noteNames: Record<number, string> = {
    262: 'C (do)',
    294: 'D (re)',
    330: 'E (mi)',
    349: 'F (fa)',
    392: 'G (sol)',
    440: 'A (la)',
    494: 'B (si)',
  };

  // 定义引导任务
  const tasks: Task[] = [
    {
      id: 1,
      title: '观察振动',
      description: '点击"开始振动"按钮，观察音叉如何振动并产生声波',
      checkCondition: () => vibrating === true,
      hint: '太棒了！音叉振动会产生声音！',
    },
    {
      id: 2,
      title: '高低音调',
      description: '调节频率滑块，听听不同音调的区别（高音vs低音）',
      checkCondition: () => frequency >= 500 && vibrating,
      hint: '正确！频率越高，音调越高！',
    },
    {
      id: 3,
      title: '大小音量',
      description: '观察声波的扩散，声波传播距离越远，声音越小',
      checkCondition: () => frequency >= 300 && frequency <= 400 && vibrating,
      hint: '对了！声波会向四周扩散！',
    },
    {
      id: 4,
      title: '传播速度',
      description: '在空气中，声音的速度大约是每秒340米',
      checkCondition: () => !vibrating && frequency === 440,
      hint: '很好！声音传播需要时间！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '🔊 声音是由什么产生的？',
      options: ['空气流动', '物体振动', '光波传播', '温度变化'],
      correctAnswer: 1,
      hint: '提示: 看看音叉振动时发生了什么',
      explanation: '正确！声音是由物体振动产生的！',
    },
    {
      id: 2,
      question: '🎵 频率越高，音调会怎样？',
      options: ['越低', '越高', '不变', '听不见'],
      correctAnswer: 1,
      hint: '提示: 试试调节频率滑块',
      explanation: '太棒了！频率越高，音调越高，声音越尖！',
    },
    {
      id: 3,
      question: '🌊 声音在空气中传播的速度大约是？',
      options: ['每秒340米', '每秒1000米', '每秒100米', '瞬间到达'],
      correctAnswer: 0,
      hint: '提示: 声音传播需要时间',
      explanation: '正确！声音在空气中的速度大约是每秒340米！',
    },
    {
      id: 4,
      question: '🎼 人耳能听到的频率范围是？',
      options: ['10-10000Hz', '20-20000Hz', '50-50000Hz', '100-100000Hz'],
      correctAnswer: 1,
      hint: '提示: 20Hz到20000Hz之间',
      explanation: '对了！人耳能听到20到20000赫兹的声音！',
    },
    {
      id: 5,
      question: '🔇 声音在真空中能传播吗？',
      options: ['能', '不能', '有时候能', '更快'],
      correctAnswer: 1,
      hint: '提示: 声音需要介质传播',
      explanation: '太聪明了！声音需要介质（空气、水等）才能传播，真空中没有介质！',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-orange-900/20 to-red-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">🔊</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">声音探险</h1>
              <p className="text-sm text-orange-300">发现声音的秘密</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">音乐会秘密</h2>
                <p className="text-lg text-orange-200 leading-relaxed">
                  小明要去参加<span className="text-2xl mx-1">🎵</span>音乐会啦！
                  他很好奇：<span className="text-2xl mx-1">🤔</span>声音是怎么产生的？
                  为什么有的声音<span className="text-2xl mx-1">🔊</span>大，有的<span className="text-2xl mx-1">🔉</span>小？
                  <br />
                  <span className="text-yellow-300 font-bold">
                    让我们一起来探索声音的奥秘吧！
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
                    🎨 声音实验室
                  </h2>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-red-400">
                      {noteNames[frequency] || `${frequency} Hz`}
                    </div>
                    <div className="text-sm text-orange-300 mt-1">
                      当前频率: {frequency} Hz
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
                    <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 2, 8]} fov={60} />
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 10, 10]} castShadow />
                    <TuningFork vibrating={vibrating} />
                    <SoundWaves playing={vibrating} frequency={frequency} />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-orange-200 text-sm mt-4 text-center">
                  💡 点击"开始振动"观察声波扩散 | 调节频率改变音调
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

                {/* 振动控制 */}
                <button
                  onClick={() => setVibrating(!vibrating)}
                  className={`w-full py-4 rounded-lg font-bold text-lg transition-opacity mb-6 ${
                    vibrating
                      ? 'bg-red-500 hover:opacity-90'
                      : 'bg-green-500 hover:opacity-90'
                  }`}
                >
                  {vibrating ? '⏹ 停止振动' : '▶ 开始振动'}
                </button>

                {/* 频率控制 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    🎵 频率: {frequency} Hz
                  </label>
                  <input
                    type="range"
                    min="200"
                    max="600"
                    step="1"
                    value={frequency}
                    onChange={(e) => setFrequency(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>低音 200Hz</span>
                    <span>高音 600Hz</span>
                  </div>
                </div>

                {/* 音阶按钮 */}
                <div className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-2 border-orange-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-orange-400 mb-3 flex items-center gap-2">
                    🎼 音阶
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(noteNames).map(([freq, name]) => (
                      <button
                        key={freq}
                        onClick={() => setFrequency(Number(freq))}
                        className={`p-2 rounded-lg text-sm transition-colors ${
                          frequency === Number(freq)
                            ? 'bg-orange-500 text-white'
                            : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 知识点 */}
                <div className="p-4 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-red-400 mb-3 flex items-center gap-2">
                    📖 声音的秘密
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span>
                        <span className="text-white font-bold">振动产生声音</span>
                        <br />
                        <span className="text-xs">物体振动时，周围空气也跟着振动</span>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400">•</span>
                      <span>
                        <span className="text-white font-bold">频率决定音调</span>
                        <br />
                        <span className="text-xs">频率越高，音调越高</span>
                      </span>
                    </li>
                  </ul>
                </div>

                {/* 有趣事实 */}
                <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-2 border-yellow-500/30 rounded-lg">
                  <h3 className="font-bold text-yellow-400 mb-2 flex items-center gap-2">
                    ⭐ 有趣事实
                  </h3>
                  <p className="text-slate-200 text-sm">
                    声音在水中传播的速度比在空气中快4倍！🐳
                  </p>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="声音挑战赛"
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
            <p className="text-2xl text-white mb-2">你完成了声音探险！</p>
            <p className="text-xl text-orange-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-green-300 mb-6">你真是个声音小专家！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
