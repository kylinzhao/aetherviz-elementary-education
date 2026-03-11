import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Sparkles } from '@/components/ui/Sparkles';
import { ViewControlButtons } from '@/components/3d/ViewControls';
import { TaskCard, Task } from '@/components/education/TaskCard';
import { QuizGame, QuizQuestion } from '@/components/education/QuizGame';

// 除法分配模型可视化
function DivisionVisualization({ total, groups }: { total: number; groups: number }) {
  const itemsPerGroup = Math.floor(total / groups);
  const spacing = 2;
  const remainder = total % groups;

  return (
    <group>
      {Array.from({ length: groups }).map((_, groupIndex) => (
        <group key={groupIndex} position={[-(groups - 1) * spacing / 2 + groupIndex * spacing, 0, 0]}>
          {Array.from({ length: itemsPerGroup }).map((_, itemIndex) => (
            <mesh key={itemIndex} position={[0, itemIndex * 0.8, 0]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial color={`hsl(${(groupIndex * 60 + itemIndex * 20) % 360}, 70%, 50%)`} />
            </mesh>
          ))}
          {/* 余数单独显示 */}
          {groupIndex === 0 && remainder > 0 && (
            <group position={[0, (itemsPerGroup + 0.5) * 0.8, 0]}>
              {Array.from({ length: remainder }).map((_, i) => (
                <mesh key={`remainder-${i}`} position={[i * 0.7, 0, 0]}>
                  <sphereGeometry args={[0.25, 16, 16]} />
                  <meshStandardMaterial color="#ef4444" />
                </mesh>
              ))}
            </group>
          )}
        </group>
      ))}
    </group>
  );
}

export default function LessonDivision() {
  const navigate = useNavigate();
  const cameraRef = useRef<any>(null);
  const controlsRef = useRef<any>(null);
  const [total, setTotal] = useState(10);
  const [groups, setGroups] = useState(2);
  const [tasksCompleted, setTasksCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const itemsPerGroup = Math.floor(total / groups);
  const remainder = total % groups;

  // 视角控制函数
  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(8, 6, 10);
      cameraRef.current.lookAt(0, 2, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 2, 0);
      controlsRef.current.update();
    }
  };

  const topView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 15, 0.001);
      cameraRef.current.lookAt(0, 2, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 2, 0);
      controlsRef.current.update();
    }
  };

  const frontView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 2, 15);
      cameraRef.current.lookAt(0, 2, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 2, 0);
      controlsRef.current.update();
    }
  };

  const sideView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(15, 2, 0);
      cameraRef.current.lookAt(0, 2, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 2, 0);
      controlsRef.current.update();
    }
  };

  const isoView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(10, 10, 10);
      cameraRef.current.lookAt(0, 2, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 2, 0);
      controlsRef.current.update();
    }
  };

  // 定义引导任务
  const tasks: Task[] = [
    {
      id: 1,
      title: '看看12块蛋糕的样子',
      description: '拖动"🍰 蛋糕总数"滑块到12',
      checkCondition: () => total === 12,
      hint: '太棒了！有12块蛋糕！',
    },
    {
      id: 2,
      title: '分给3个好朋友',
      description: '拖动"👥 朋友人数"滑块到3',
      checkCondition: () => groups === 3,
      hint: '做得好！看看每个人能分到几块？',
    },
    {
      id: 3,
      title: '试试不同的分法！',
      description: '15块蛋糕分给5个人，看看会发生什么',
      checkCondition: () => total === 15 && groups === 5,
      hint: '完美！每人3块，刚好分完！',
    },
    {
      id: 4,
      title: '挑战！有剩余怎么办？',
      description: '试试13块蛋糕分给3个人',
      checkCondition: () => total === 13 && groups === 3,
      hint: '发现了！每人4块，还剩1块！这就是余数！',
    },
  ];

  // 定义测验题目
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: '🍰 10块蛋糕分给2个小朋友，每人几块？',
      options: ['3块', '4块', '5块', '6块'],
      correctAnswer: 2,
      hint: '提示: 10 ÷ 2 = ?',
      explanation: '正确！10 ÷ 2 = 5块，每人5块！',
    },
    {
      id: 2,
      question: '🍰 15块蛋糕分给3个小朋友，每人几块？',
      options: ['4块', '5块', '6块', '3块'],
      correctAnswer: 1,
      hint: '提示: 3 × ? = 15',
      explanation: '太棒了！15 ÷ 3 = 5块！',
    },
    {
      id: 3,
      question: '🍰 7块蛋糕分给2个人，每人几块？剩几块？',
      options: ['3块剩1块', '4块剩1块', '3块剩2块', '2块剩3块'],
      correctAnswer: 0,
      hint: '提示: 2 × 3 = 6，7 - 6 = ?',
      explanation: '对！7 ÷ 2 = 3块，还剩1块！',
    },
    {
      id: 4,
      question: '🍰 "余数"是什么意思？',
      options: ['剩下的蛋糕', '分掉的蛋糕', '蛋糕总数', '朋友人数'],
      correctAnswer: 0,
      hint: '提示: 平均分完后剩下的',
      explanation: '正确！余数就是平均分完后剩下的部分',
    },
    {
      id: 5,
      question: '🍰 20块蛋糕分给4个人，有余数吗？',
      options: ['有', '没有', '不知道'],
      correctAnswer: 1,
      hint: '提示: 4 × 5 = 20',
      explanation: '太聪明了！20 ÷ 4 = 5块，刚好分完，没有余数！',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-pink-900/20 to-rose-900/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles>
              <span className="text-4xl">🍰</span>
            </Sparkles>
            <div>
              <h1 className="text-3xl font-bold gradient-text">公平分享游戏</h1>
              <p className="text-sm text-pink-300">学习除法的秘密</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold text-white mb-2">生日派对大挑战</h2>
                <p className="text-lg text-pink-200 leading-relaxed">
                  今天是小明的<span className="text-2xl mx-1">🎂</span>生日派对！
                  他准备了好多好吃的<span className="text-2xl mx-1">🍰</span>蛋糕！
                  但是要<span className="text-2xl mx-1">🎯</span>公平地分给每个好朋友。
                  <br />
                  <span className="text-yellow-300 font-bold">
                    除法就是公平分配的魔法！让每个人得到的一样多！
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
                    🎨 蛋糕分配场景
                  </h2>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-yellow-400">
                      {total} ÷ {groups} = {itemsPerGroup}
                      {remainder > 0 && <span className="text-red-400"> 余{remainder}</span>}
                    </div>
                    <div className="text-sm text-pink-300 mt-1">
                      {total}块蛋糕 ÷ {groups}个人 = 每人{itemsPerGroup}块
                      {remainder > 0 && <span>，还剩{remainder}块！</span>}
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
                    <DivisionVisualization total={total} groups={groups} />
                    <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
                  </Canvas>
                </div>
                <p className="text-pink-200 text-sm mt-4 text-center">
                  💡 每一列代表一个好朋友，彩色圆球是蛋糕，红色的是剩下的！
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

                {/* 蛋糕总数 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    🍰 蛋糕总数: {total}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    step="1"
                    value={total}
                    onChange={(e) => setTotal(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>2块</span>
                    <span>20块</span>
                  </div>
                </div>

                {/* 朋友人数 */}
                <div className="space-y-4 mb-6">
                  <label className="block text-white font-bold text-lg flex items-center gap-2">
                    👥 朋友人数: {groups}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    step="1"
                    value={groups}
                    onChange={(e) => setGroups(Number(e.target.value))}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>2人</span>
                    <span>6人</span>
                  </div>
                </div>

                {/* 除法的意义 */}
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-lg mb-6">
                  <h3 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                    📖 除法是什么？
                  </h3>
                  <div className="text-sm text-slate-200 space-y-2">
                    <p className="text-green-300">
                      除法就是<span className="font-bold">公平分配</span>！
                    </p>
                    <p className="text-white text-base leading-relaxed">
                      把{total}块蛋糕平均分给{groups}个人：
                    </p>
                    <p className="text-lg text-center py-2 bg-slate-800/50 rounded-lg">
                      每人得到 <span className="text-yellow-400 font-bold">{itemsPerGroup}</span> 块
                      {remainder > 0 && (
                        <span className="text-red-400">
                          ，还剩 <span className="font-bold">{remainder}</span> 块
                        </span>
                      )}
                    </p>
                    {remainder > 0 && (
                      <p className="text-xs text-red-300 mt-2">
                        💡 剩下的{remainder}块就是"余数"，不够再分一次了！
                      </p>
                    )}
                  </div>
                </div>

                {/* 小技巧 */}
                <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-lg">
                  <h3 className="font-bold text-purple-400 mb-2 flex items-center gap-2">
                    💡 小秘密
                  </h3>
                  <ul className="text-slate-200 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <span>
                        <span className="text-white font-bold">平均分：</span>每个人得到的要一样多！
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400">•</span>
                      <span>
                        <span className="text-white font-bold">余数：</span>剩下不够再分的部分
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 小测验游戏 */}
              <QuizGame
                title="分配挑战赛"
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
            <p className="text-xl text-pink-300 mb-4">
              测验得分：{quizScore} / 5 {'⭐'.repeat(quizScore)}
            </p>
            <p className="text-lg text-green-300 mb-6">你真是个分配小达人！</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl font-bold text-xl text-white hover:opacity-90 transition-opacity"
            >
              继续探索其他课程 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
