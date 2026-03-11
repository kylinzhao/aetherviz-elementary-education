import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';

// 天气可视化组件
function WeatherVisualization({ weatherType, showTemperature }: {
  weatherType: 'sunny' | 'rainy' | 'cloudy';
  showTemperature: boolean;
}) {
  const sunRef = React.useRef<THREE.Mesh>(null);
  const raindropsRef = React.useRef<THREE.Group>(null);

  useFrame((state) => {
    // 太阳旋转
    if (sunRef.current && weatherType === 'sunny') {
      sunRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
    // 雨滴下落
    if (raindropsRef.current && weatherType === 'rainy') {
      raindropsRef.current.children.forEach((drop, i) => {
        const mesh = drop as THREE.Mesh;
        mesh.position.y -= 0.1;
        if (mesh.position.y < -3) {
          mesh.position.y = 3;
        }
      });
    }
  });

  return (
    <group>
      {/* 太阳 */}
      {weatherType === 'sunny' && (
        <>
          <mesh ref={sunRef} position={[2, 2, 0]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1} />
          </mesh>
          {/* 太阳光芒 */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <mesh key={angle} position={[2 + Math.cos(rad) * 1.8, 2 + Math.sin(rad) * 1.8, 0]}>
                <boxGeometry args={[0.3, 0.8, 0.1]} />
                <meshStandardMaterial color="#fcd34d" />
              </mesh>
            );
          })}
          {/* 地面 */}
          <mesh position={[0, -2, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[8, 0.3, 4]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>
        </>
      )}

      {/* 雨天 */}
      {weatherType === 'rainy' && (
        <>
          {/* 乌云 */}
          <group position={[0, 2.5, 0]}>
            <mesh position={[-0.5, 0, 0]}>
              <sphereGeometry args={[0.8, 16, 16]} />
              <meshStandardMaterial color="#6b7280" />
            </mesh>
            <mesh position={[0.6, 0.2, 0]}>
              <sphereGeometry args={[0.6, 16, 16]} />
              <meshStandardMaterial color="#6b7280" />
            </mesh>
            <mesh position={[0, -0.2, 0]}>
              <sphereGeometry args={[0.7, 16, 16]} />
              <meshStandardMaterial color="#6b7280" />
            </mesh>
          </group>
          {/* 雨滴 */}
          <group ref={raindropsRef}>
            {Array.from({ length: 20 }).map((_, i) => (
              <mesh key={i} position={[Math.random() * 6 - 3, Math.random() * 4 - 2, 0]}>
                <capsuleGeometry args={[0.05, 0.3, 4, 8]} />
                <meshStandardMaterial color="#60a5fa" />
              </mesh>
            ))}
          </group>
          {/* 地面 */}
          <mesh position={[0, -2, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[8, 0.3, 4]} />
            <meshStandardMaterial color="#4b5563" />
          </mesh>
        </>
      )}

      {/* 阴天 */}
      {weatherType === 'cloudy' && (
        <>
          {/* 云朵 */}
          <group position={[0, 2, 0]}>
            <mesh position={[-1, 0, 0]}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial color="#d1d5db" />
            </mesh>
            <mesh position={[0, 0.3, 0]}>
              <sphereGeometry args={[1.2, 16, 16]} />
              <meshStandardMaterial color="#e5e7eb" />
            </mesh>
            <mesh position={[1, 0, 0]}>
              <sphereGeometry args={[0.9, 16, 16]} />
              <meshStandardMaterial color="#d1d5db" />
            </mesh>
          </group>
          {/* 第二朵云 */}
          <group position={[2, 1, 0]}>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.8, 16, 16]} />
              <meshStandardMaterial color="#d1d5db" />
            </mesh>
            <mesh position={[0.5, 0.2, 0]}>
              <sphereGeometry args={[0.6, 16, 16]} />
              <meshStandardMaterial color="#e5e7eb" />
            </mesh>
          </group>
          {/* 地面 */}
          <mesh position={[0, -2, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[8, 0.3, 4]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>
        </>
      )}

      {/* 温度计 */}
      {showTemperature && (
        <group position={[-3, 0, 0]}>
          {/* 温度计外壳 */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 4, 8]} />
            <meshStandardMaterial color="#fef3c7" transparent opacity={0.8} />
          </mesh>
          {/* 温度计底部球 */}
          <mesh position={[0, -2.2, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial
              color={
                weatherType === 'sunny' ? '#ef4444' :
                weatherType === 'rainy' ? '#3b82f6' : '#fbbf24'
              }
            />
          </mesh>
          {/* 温度刻度线 */}
          {[0, 0.5, 1, 1.5, 2].map((pos, i) => (
            <mesh key={i} position={[0.3, pos - 1, 0]} rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.3, 0.05, 0.05]} />
              <meshStandardMaterial color="#374151" />
            </mesh>
          ))}
          {/* 液体柱 */}
          <mesh position={[0, weatherType === 'sunny' ? 0.5 : weatherType === 'rainy' ? -0.5 : 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
            <meshStandardMaterial
              color={
                weatherType === 'sunny' ? '#ef4444' :
                weatherType === 'rainy' ? '#3b82f6' : '#fbbf24'
              }
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

export default function LessonWeather() {
  const navigate = useNavigate();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const [weatherType, setWeatherType] = useState<'sunny' | 'rainy' | 'cloudy'>('sunny');
  const [showTemperature, setShowTemperature] = useState(false);
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
      title: '认识晴天',
      description: '点击"晴天"按钮，观察晴天的特点',
      checkCondition: () => weatherType === 'sunny',
      hint: '太棒了！晴天有太阳，天气温暖晴朗！',
    },
    {
      id: 2,
      title: '认识雨天',
      description: '点击"雨天"按钮，看看雨天的样子',
      checkCondition: () => weatherType === 'rainy',
      hint: '对啦！雨天有乌云和雨滴，记得带伞！',
    },
    {
      id: 3,
      title: '认识阴天',
      description: '点击"阴天"按钮，观察阴天的特征',
      checkCondition: () => weatherType === 'cloudy',
      hint: '真聪明！阴天云层很厚，但没有雨！',
    },
    {
      id: 4,
      title: '观察温度变化',
      description: '点击"显示温度计"，看看不同天气的温度',
      checkCondition: () => showTemperature === true,
      hint: '太聪明了！不同天气的温度不一样哦！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '☀️ 晴天的特点是什么？',
      options: ['有太阳', '下雨', '乌云密布', '刮大风'],
      correctAnswer: 0,
      hint: '提示: 晴天最明显的是什么天体？',
      explanation: '正确！晴天有太阳照耀，天气晴朗温暖！',
    },
    {
      id: 2,
      question: '🌧️ 雨天需要带什么？',
      options: ['太阳镜', '雨伞', '扇子', '帽子'],
      correctAnswer: 1,
      hint: '提示: 雨天会淋湿，需要什么工具？',
      explanation: '太棒了！雨天要带雨伞或雨衣，避免淋湿！',
    },
    {
      id: 3,
      question: '☁️ 阴天和雨天有什么不同？',
      options: ['阴天有云，雨天有雨', '阴天热，雨天冷', '阴天黑，雨天亮', '没有区别'],
      correctAnswer: 0,
      hint: '提示: 想想阴天会不会下雨？',
      explanation: '对！阴天云层厚但不下雨，雨天会下雨！',
    },
    {
      id: 4,
      question: '🌡️ 哪种天气温度最高？',
      options: ['晴天', '雨天', '阴天', '雪天'],
      correctAnswer: 0,
      hint: '提示: 哪种天气有太阳照着？',
      explanation: '真聪明！晴天有太阳照射，温度最高！',
    },
    {
      id: 5,
      question: '🌈 雨后会出现什么？',
      options: ['月亮', '彩虹', '星星', '雾'],
      correctAnswer: 1,
      hint: '提示: 雨后阳光透过水珠会形成什么？',
      explanation: '太棒了！雨后阳光照射水珠会形成美丽的彩虹！',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900/30 via-sky-900/20 to-gray-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">🌤</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">天气预报员</h1>
              <p className="text-sm text-blue-300">观察天气变化</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-yellow-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">观察天气变化</h2>
                <p className="text-lg text-blue-200 leading-relaxed">
                  小天气观察员<span className="text-2xl mx-1">👀</span>每天起床都会看窗外，
                  今天是什么天气呢<span className="text-2xl mx-1">🤔</span>？
                  <br />
                  <span className="text-yellow-300 font-bold">
                    让我们一起学习认识晴天、雨天、阴天，观察温度的变化吧！
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
                    🌤 天气展示
                  </h2>
                  <div className="text-center">
                    <div className="text-sm text-blue-300">
                      {weatherType === 'sunny' && '☀️ 晴天'}
                      {weatherType === 'rainy' && '🌧️ 雨天'}
                      {weatherType === 'cloudy' && '☁️ 阴天'}
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
                    <WeatherVisualization weatherType={weatherType} showTemperature={showTemperature} />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-blue-200 text-sm mt-4 text-center">
                  💡 观察不同天气的特点，学习天气预报知识！
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

                {/* 天气选择 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    🌤 选择天气
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setWeatherType('sunny')}
                      className={`p-3 rounded-lg font-bold text-2xl transition-all ${
                        weatherType === 'sunny'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      ☀️
                    </button>
                    <button
                      onClick={() => setWeatherType('rainy')}
                      className={`p-3 rounded-lg font-bold text-2xl transition-all ${
                        weatherType === 'rainy'
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      🌧️
                    </button>
                    <button
                      onClick={() => setWeatherType('cloudy')}
                      className={`p-3 rounded-lg font-bold text-2xl transition-all ${
                        weatherType === 'cloudy'
                          ? 'bg-gray-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      ☁️
                    </button>
                  </div>
                </div>

                {/* 温度计开关 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    🌡️ 温度计
                  </label>
                  <button
                    onClick={() => setShowTemperature(!showTemperature)}
                    className={`w-full p-3 rounded-lg font-bold transition-all ${
                      showTemperature
                        ? 'bg-yellow-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {showTemperature ? '隐藏温度计' : '显示温度计'}
                  </button>
                </div>

                {/* 天气的知识 */}
                <div className="p-4 bg-gradient-to-br from-blue-500/10 to-sky-500/10 border-2 border-blue-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
                    📖 什么是天气？
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <p className="text-blue-300">
                      天气就是<span className="font-bold">大气的状态</span>！
                    </p>
                    <p className="text-white text-base leading-relaxed">
                      包括<span className="text-yellow-300 font-bold">温度、湿度、风力、降水</span>等，
                      天气每天都在<span className="text-yellow-300 font-bold">变化</span>！
                    </p>
                  </div>
                </div>

                {/* 三种天气 */}
                <div className="p-4 bg-gradient-to-br from-sky-500/10 to-gray-500/10 border-2 border-sky-500/30 rounded-lg">
                  <h3 className="font-bold text-sky-400 mb-2 flex items-center gap-2">
                    💡 三种天气
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">•</span>
                      <span>
                        <span className="text-white font-bold">晴天：</span>阳光明媚，温度高，适合户外活动
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>
                        <span className="text-white font-bold">雨天：</span>乌云密布，下雨，记得带伞
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>
                        <span className="text-white font-bold">阴天：</span>云层厚，无阳光，温度适中
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="天气挑战赛"
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
            <p className="text-2xl text-white mb-2">你是个小小天气预报员！</p>
            <p className="text-xl text-blue-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-sky-300 mb-6">你真是个天气小达人！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-yellow-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
