import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuroraBackground } from '@/components/ui/AuroraBackground';
import { BorderBeam } from '@/components/ui/BorderBeam';
import { Sparkles } from '@/components/ui/Sparkles';
import { TextGenerateEffect } from '@/components/ui/TextGenerateEffect';

const courses = [
  // 数学课程 (19个)
  {
    id: 'symmetry',
    icon: '🦋',
    title: '对称图形',
    description: '探索轴对称和中心对称的奥秘',
    grade: '3-5年级',
    subject: '数学',
    path: '/lesson/symmetry',
    status: 'ready',
  },
  {
    id: 'angle',
    icon: '📐',
    title: '角的认识',
    description: '学习角的分类与测量方法',
    grade: '3-5年级',
    subject: '数学',
    path: '/lesson/angle',
    status: 'ready',
  },
  {
    id: 'area',
    icon: '📏',
    title: '面积计算',
    description: '掌握长方形和正方形的面积',
    grade: '3-5年级',
    subject: '数学',
    path: '/lesson/area',
    status: 'ready',
  },
  {
    id: 'rectangle',
    icon: '📐',
    title: '长方形',
    description: '周长与面积的计算',
    grade: '3-5年级',
    subject: '数学',
    path: '/lesson/rectangle',
    status: 'ready',
  },
  {
    id: 'square',
    icon: '🟦',
    title: '正方形',
    description: '正方形的性质和计算',
    grade: '3-5年级',
    subject: '数学',
    path: '/lesson/square',
    status: 'ready',
  },
  {
    id: 'triangle',
    icon: '🔺',
    title: '三角形',
    description: '三角形内角和与分类',
    grade: '4-6年级',
    subject: '数学',
    path: '/lesson/triangle',
    status: 'ready',
  },
  {
    id: 'circle',
    icon: '⭕',
    title: '圆的认识',
    description: '圆的周长和面积',
    grade: '5-6年级',
    subject: '数学',
    path: '/lesson/circle',
    status: 'ready',
  },
  {
    id: 'cuboid',
    icon: '📦',
    title: '长方体',
    description: '顶点棱面的认识',
    grade: '4-6年级',
    subject: '数学',
    path: '/lesson/cuboid',
    status: 'ready',
  },
  {
    id: 'cylinder',
    icon: '🥫',
    title: '圆柱体',
    description: '表面积和体积计算',
    grade: '5-6年级',
    subject: '数学',
    path: '/lesson/cylinder',
    status: 'ready',
  },
  {
    id: 'cone',
    icon: '🔺',
    title: '圆锥体',
    description: '体积和表面积',
    grade: '5-6年级',
    subject: '数学',
    path: '/lesson/cone',
    status: 'ready',
  },
  {
    id: 'multiplication',
    icon: '✖️',
    title: '乘法',
    description: '乘法分组模型可视化',
    grade: '2-4年级',
    subject: '数学',
    path: '/lesson/multiplication',
    status: 'ready',
  },
  {
    id: 'division',
    icon: '➗',
    title: '除法',
    description: '除法分配模型',
    grade: '3-5年级',
    subject: '数学',
    path: '/lesson/division',
    status: 'ready',
  },
  {
    id: 'number-line',
    icon: '📊',
    title: '数轴',
    description: '有理数与数轴表示',
    grade: '5-7年级',
    subject: '数学',
    path: '/lesson/number-line',
    status: 'ready',
  },
  {
    id: 'percentage',
    icon: '💯',
    title: '百分数',
    description: '百分数的认识与应用',
    grade: '5-7年级',
    subject: '数学',
    path: '/lesson/percentage',
    status: 'ready',
  },
  {
    id: 'ratio',
    icon: '⚖️',
    title: '比',
    description: '比的认识和化简',
    grade: '5-7年级',
    subject: '数学',
    path: '/lesson/ratio',
    status: 'ready',
  },
  {
    id: 'probability',
    icon: '🎲',
    title: '可能性',
    description: '概率大小计算',
    grade: '6-8年级',
    subject: '数学',
    path: '/lesson/probability',
    status: 'ready',
  },
  {
    id: 'volume',
    icon: '📦',
    title: '长方体体积',
    description: '体积的计算方法',
    grade: '4-6年级',
    subject: '数学',
    path: '/lesson/volume',
    status: 'ready',
  },
  {
    id: 'fraction',
    icon: '🍕',
    title: '分数',
    description: '分数的认识与运算',
    grade: '3-5年级',
    subject: '数学',
    path: '/lesson/fraction',
    status: 'ready',
  },
  {
    id: 'square-stats',
    icon: '🟲',
    title: '完全平方数',
    description: '平方数与根号',
    grade: '6-8年级',
    subject: '数学',
    path: '/lesson/square-stats',
    status: 'ready',
  },
  // 科学课程 (20个)
  {
    id: 'sound',
    icon: '🔊',
    title: '声音',
    description: '声音的产生与传播',
    grade: '3-6年级',
    subject: '科学',
    path: '/lesson/sound',
    status: 'ready',
  },
  {
    id: 'water-cycle',
    icon: '💧',
    title: '水循环',
    description: '自然界中水的循环',
    grade: '3-6年级',
    subject: '科学',
    path: '/lesson/water-cycle',
    status: 'ready',
  },
  {
    id: 'buoyancy',
    icon: '⛵',
    title: '浮力',
    description: '浮力与沉浮条件',
    grade: '4-7年级',
    subject: '科学',
    path: '/lesson/buoyancy',
    status: 'ready',
  },
  {
    id: 'chart',
    icon: '📊',
    title: '统计图表',
    description: '柱状图与折线图',
    grade: '3-6年级',
    subject: '科学',
    path: '/lesson/chart',
    status: 'ready',
  },
  {
    id: 'circuit',
    icon: '🔌',
    title: '电路',
    description: '简单电路的组成',
    grade: '4-7年级',
    subject: '科学',
    path: '/lesson/circuit',
    status: 'ready',
  },
  {
    id: 'classification',
    icon: '🧬',
    title: '生物分类',
    description: '生物的分类方法',
    grade: '4-6年级',
    subject: '科学',
    path: '/lesson/classification',
    status: 'ready',
  },
  {
    id: 'clock',
    icon: '🕐',
    title: '时钟',
    description: '时间与钟表的认读',
    grade: '1-3年级',
    subject: '科学',
    path: '/lesson/clock',
    status: 'ready',
  },
  {
    id: 'earth',
    icon: '🌍',
    title: '地球结构',
    description: '地球的内部构造',
    grade: '4-6年级',
    subject: '科学',
    path: '/lesson/earth',
    status: 'ready',
  },
  {
    id: 'food-chain',
    icon: '🍃',
    title: '食物链',
    description: '生态系统的能量流动',
    grade: '4-6年级',
    subject: '科学',
    path: '/lesson/food-chain',
    status: 'ready',
  },
  {
    id: 'incline',
    icon: '📐',
    title: '斜面',
    description: '斜面与力的分解',
    grade: '5-8年级',
    subject: '科学',
    path: '/lesson/incline',
    status: 'ready',
  },
  {
    id: 'lever',
    icon: '⚖️',
    title: '杠杆',
    description: '杠杆原理与应用',
    grade: '5-8年级',
    subject: '科学',
    path: '/lesson/lever',
    status: 'ready',
  },
  {
    id: 'light',
    icon: '💡',
    title: '光的传播',
    description: '光的直线传播',
    grade: '3-6年级',
    subject: '科学',
    path: '/lesson/light',
    status: 'ready',
  },
  {
    id: 'magnet',
    icon: '🧲',
    title: '磁铁',
    description: '磁铁的性质与应用',
    grade: '3-5年级',
    subject: '科学',
    path: '/lesson/magnet',
    status: 'ready',
  },
  {
    id: 'measurement',
    icon: '📏',
    title: '测量',
    description: '长度测量工具与方法',
    grade: '2-4年级',
    subject: '科学',
    path: '/lesson/measurement',
    status: 'ready',
  },
  {
    id: 'organ',
    icon: '🫀',
    title: '人体器官',
    description: '主要器官的功能',
    grade: '3-6年级',
    subject: '科学',
    path: '/lesson/organ',
    status: 'ready',
  },
  {
    id: 'plants',
    icon: '🌱',
    title: '植物',
    description: '植物的结构组成',
    grade: '3-5年级',
    subject: '科学',
    path: '/lesson/plants',
    status: 'ready',
  },
  {
    id: 'pulley',
    icon: '⚙️',
    title: '滑轮',
    description: '滑轮组的工作原理',
    grade: '5-8年级',
    subject: '科学',
    path: '/lesson/pulley',
    status: 'ready',
  },
  {
    id: 'rock',
    icon: '🪨',
    title: '岩石矿物',
    description: '岩石与矿物的认识',
    grade: '4-6年级',
    subject: '科学',
    path: '/lesson/rock',
    status: 'ready',
  },
  {
    id: 'solar',
    icon: '🌞',
    title: '太阳系',
    description: '太阳系与行星运动',
    grade: '4-7年级',
    subject: '科学',
    path: '/lesson/solar',
    status: 'ready',
  },
  {
    id: 'states',
    icon: '🧊',
    title: '物质三态',
    description: '固液气三态变化',
    grade: '3-5年级',
    subject: '科学',
    path: '/lesson/states',
    status: 'ready',
  },
  {
    id: 'weather',
    icon: '🌤️',
    title: '天气气候',
    description: '天气与气候的区别',
    grade: '3-5年级',
    subject: '科学',
    path: '/lesson/weather',
    status: 'ready',
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <AuroraBackground>
      <div className="relative z-10 w-full">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-3xl font-bold gradient-text">
              AetherViz 小学教学
            </h1>
            <BorderBeam size={250} duration={12} delay={9} />
          </div>
        </nav>

        {/* Hero Section */}
        <main className="pt-24 pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Hero Text */}
            <div className="text-center mb-12">
              <TextGenerateEffect
                words="探索科学的奥秘"
                className="text-5xl md:text-6xl font-bold mb-4"
              />
              <p className="text-xl text-slate-300 mt-4">
                通过互动式 3D 可视化,让学习变得生动有趣
              </p>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => navigate(course.path)}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </AuroraBackground>
  );
}

interface CourseCardProps {
  course: typeof courses[0];
  onClick: () => void;
}

function CourseCard({ course, onClick }: CourseCardProps) {
  return (
    <div
      className="group relative p-6 glass-panel rounded-2xl cursor-pointer transition-all hover:scale-105 hover:bg-slate-800/50"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <Sparkles>
          <span className="text-5xl">{course.icon}</span>
        </Sparkles>
        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
          {course.grade}
        </span>
      </div>

      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
        {course.title}
      </h3>

      <p className="text-slate-400 text-sm mb-4">{course.description}</p>

      <div className="flex items-center justify-between">
        <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">
          {course.subject}
        </span>
        {course.status === 'ready' && (
          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-xs">
            ✅ 准备就绪
          </span>
        )}
      </div>

      <button className="w-full mt-4 py-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg font-bold hover:opacity-90 transition-opacity">
        开始学习 →
      </button>
    </div>
  );
}
