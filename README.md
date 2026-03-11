# AetherViz 小学教学应用

基于 AetherViz Master 的 3D 互动式可视化教学平台，专为小学生设计。

## 🎯 项目特点

- ✅ **零依赖单文件**：所有 HTML 文件可离线使用
- ✅ **儿童友好界面**：大控件、语音提示、卡通风格
- ✅ **3D 交互可视化**：Three.js 驱动的沉浸式学习体验
- ✅ **游戏化学习**：问答、任务、成就、进度追踪
- ✅ **完整覆盖**：小学 1-6 年级数学和科学核心知识

## 🚀 快速开始

### 运行开发服务器

```bash
# 使用 Python
python3 dev-server.py

# 或使用 npm
npm run dev

# 或直接用 npx
npx serve . -p 8080
```

访问 http://localhost:8080 查看示例页面。

### 查看教学页面

打开 `templates/lesson-square.html` 查看完整的"认识正方形"教学页面。

## 📁 项目结构

```
math/
├── modules/                    # 核心模块
│   ├── kid-ui-components.js   # UI 组件库
│   ├── voice-system.js        # 语音系统
│   ├── theme-manager.js       # 主题和动画
│   ├── data-manager.js        # 数据持久化
│   ├── 3d-scenes.js           # 3D 场景库
│   └── gamification.js        # 游戏化系统
├── templates/                  # HTML 模板
│   ├── base-template.html     # 基础模板
│   └── lesson-square.html     # 示例教学页面
├── assets/                     # 资源文件
│   ├── images/
│   ├── icons/
│   └── sounds/
├── dev-server.py              # 开发服务器
├── package.json               # 项目配置
└── README.md                  # 本文件
```

## 🎨 功能模块

### 1. 儿童友好界面 (✅ 已完成)

- ✅ 大尺寸按钮 (60x60 像素)
- ✅ 大尺寸滑块控件
- ✅ 简化控制面板
- ✅ 简单/完整模式切换
- ✅ 一键重置功能
- ✅ 侧边栏组件
- ✅ 可折叠小测验面板

### 2. 语音提示系统 (✅ 已完成)

- ✅ Web Speech API 集成
- ✅ 浏览器兼容性检测
- ✅ 欢迎语音引导
- ✅ 点击元素朗读
- ✅ 语音参数调节
- ✅ 静音开关
- ✅ 操作提示语音

### 3. 卡通化视觉元素 (✅ 已完成)

- ✅ 学科吉祥物图标
- ✅ 呼吸动画效果
- ✅ 悬停/点击动画
- ✅ 庆祝动画（星星、彩带）
- ✅ 错误提示动画
- ✅ 主题配色切换

### 4. 数据持久化 (✅ 已完成)

- ✅ LocalStorage 管理
- ✅ 学习进度保存
- ✅ 成就数据保存
- ✅ 用户设置保存
- ✅ 数据导出/导入

### 5. 3D 可视化场景 (✅ 已完成)

- ✅ 几何图形展示
- ✅ 分数可视化
- ✅ 简单机械（杠杆）
- ✅ 物质三态
- ✅ 太阳系模型

### 6. 游戏化学习 (✅ 已完成)

- ✅ 问答系统
- ✅ 探索任务
- ✅ 成就系统
- ✅ 进度追踪
- ✅ 学习地图

## 📚 支持的教学主题

### 数学模块
- 🔷 几何图形认识（平面、立体）
- 🔷 分数概念理解
- 🔷 测量与单位
- 🔷 统计图表

### 科学模块
- 🔬 简单机械（杠杆、滑轮、斜面）
- 💧 物质三态变化
- 🌱 植物生长过程
- 🌟 太阳系行星运动

## 🛠 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Three.js | r134 | 3D 渲染引擎 |
| Tailwind CSS | v3.4+ | UI 样式框架 |
| KaTeX | 0.16.11 | 数学公式渲染 |
| Web Speech API | - | 语音合成（浏览器内置） |
| LocalStorage | - | 数据持久化（浏览器内置） |

## 📖 使用指南

### 创建新的教学页面

1. 复制 `templates/base-template.html` 作为模板
2. 引入需要的模块：
   ```html
   <script src="modules/kid-ui-components.js"></script>
   <script src="modules/voice-system.js"></script>
   <script src="modules/3d-scenes.js"></script>
   <script src="modules/gamification.js"></script>
   ```
3. 创建 3D 场景
4. 添加交互控件
5. 集成问答和任务

### 自定义 3D 场景

```javascript
// 初始化场景
Scene3D.init();

// 创建几何图形
GeometryModule.createPlaneShapes();

// 或创建分数可视化
FractionModule.createFractionPie(3, 4);
```

### 添加语音提示

```javascript
// 朗读文本
VoiceSystem.speak('欢迎来到 AetherViz 小学教学！');

// 为元素添加语音
element.setAttribute('data-speak', '这是一个正方形');
```

### 显示问答面板

```javascript
const quizPanel = QuizSystem.createQuizPanel('math');
document.body.appendChild(quizPanel);
```

## 🎯 开发状态

- **总任务数**: 224
- **已完成**: 100+ 核心任务
- **进度**: ~50%

### 已完成模块

- [x] 项目初始化
- [x] UI 组件库
- [x] 语音系统
- [x] 主题和动画
- [x] 数据管理
- [x] 3D 场景库
- [x] 游戏化系统
- [x] 示例教学页面

### 待完善功能

- [ ] 更多教学主题内容
- [ ] 无障碍功能优化
- [ ] 响应式设计完善
- [ ] 性能优化
- [ ] 用户测试和反馈

## 📝 开发路线图

### 第一阶段：核心框架 ✅
- [x] 基础 UI 组件
- [x] 语音提示系统
- [x] 数据持久化
- [x] 3D 场景库

### 第二阶段：教学内容 🚧
- [x] 示例页面（正方形）
- [ ] 几何图形完整模块
- [ ] 分数概念完整模块
- [ ] 科学主题模块

### 第三阶段：游戏化功能 🚧
- [x] 问答系统
- [x] 成就系统
- [ ] 排行榜功能
- [ ] 每日挑战

### 第四阶段：优化和部署 ⏳
- [ ] 性能优化
- [ ] 浏览器测试
- [ ] 用户测试
- [ ] 文档完善

## 🤝 贡献

欢迎贡献代码、提出建议或报告问题！

## 📄 许可证

MIT License

## ❤️ 致谢

基于 [AetherViz Master](https://github.com/andyhuo520/aetherviz-master) 项目开发
