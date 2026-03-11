# 教学系统模块说明

本目录包含两个可复用的教学系统模块，用于增强小学数学互动教学。

## 模块列表

### 1. 问答互动系统 (quiz-system.js)

一个通用的问答系统模块，支持选择题、判断题、填空题等多种题型。

#### 功能特点

- **多种题型支持**：选择题、判断题、填空题
- **即时反馈动画**：正确/错误的视觉反馈
- **连胜记录显示**：连续答对题数追踪
- **表扬效果**：连续答对3题以上触发庆祝动画
- **答案解释**：每题提供详细解释
- **进度追踪**：显示答题进度和正确率
- **完成统计**：测验结束后显示详细统计

#### 使用方法

```javascript
// 初始化问答系统
window.quizSystem = new QuizSystem({
    lessonId: 'lesson-square',  // 课程ID，用于获取对应题库
    container: document.getElementById('quiz-container'),  // 容器元素
    onAnswer: (result) => {
        console.log('答题结果:', result);
        // result: { quizIndex, isCorrect, streakCount }
    }
});
```

#### 题库格式

在 `QuizSystem.getQuizData()` 方法中定义题库：

```javascript
{
    'lesson-square': [
        {
            type: 'choice',  // 选择题
            question: '正方形有几条边？',
            options: ['3条', '4条', '5条'],
            correct: 1,  // 正确答案索引
            explanation: '正方形有4条边，而且4条边都相等。'
        },
        {
            type: 'truefalse',  // 判断题
            question: '正方形是特殊的四边形',
            correct: true,  // true表示正确，false表示错误
            explanation: '正确！正方形不仅有四条边...'
        }
    ]
}
```

#### 主要方法

- `getQuizData()` - 获取题库数据
- `checkAnswer(userAnswer)` - 检查答案
- `nextQuiz()` - 下一题
- `restart()` - 重新开始

---

### 2. 探索式学习任务系统 (task-system.js)

任务引导系统，帮助学生通过探索式学习掌握知识。

#### 功能特点

- **任务目标引导**：清晰的任务目标说明
- **渐进式提示系统**：3级提示（从简单到详细）
- **智能提示触发**：无进展1分钟后自动提示
- **任务完成检测**：可勾选任务目标
- **完成动画祝贺**：任务完成时的庆祝效果
- **进度追踪**：实时显示完成进度
- **侧边栏显示**：固定在左侧的任务面板

#### 使用方法

```javascript
// 初始化任务系统
window.taskSystem = new TaskSystem({
    lessonId: 'lesson-square',  // 课程ID
    container: document.getElementById('task-container'),  // 容器元素
    onTaskComplete: () => {
        console.log('任务完成！');
    },
    onGoalComplete: (goalId) => {
        console.log('目标完成:', goalId);
    }
});

// 控制侧边栏显示
window.taskSystem.show();  // 显示
window.taskSystem.hide();  // 隐藏
window.taskSystem.toggle();  // 切换
```

#### 任务数据格式

在 `TaskSystem.getTaskData()` 方法中定义任务：

```javascript
{
    'lesson-square': {
        basic: {
            title: '认识正方形',
            description: '通过探索了解正方形的特征',
            goals: [
                {
                    id: 'find-square',
                    text: '找到场景中的正方形',
                    hints: [
                        '正方形是橙色的',  // 第1级提示
                        '在屏幕中央有一个大图形',  // 第2级提示
                        '它有4条边'  // 第3级提示
                    ]
                },
                {
                    id: 'count-edges',
                    text: '数出正方形有几条边',
                    hints: ['正方形有4条边', '每条边长度相等', '用控制面板切换到正方形模式']
                }
            ]
        }
    }
}
```

#### 提示级别

1. **第1级提示**：最简单的提示，给学生一点方向
2. **第2级提示**：更具体的指导
3. **第3级提示**：非常详细的操作步骤

#### 主要方法

- `loadTask(taskId)` - 加载指定任务
- `toggleGoal(goalId)` - 切换目标完成状态
- `nextHint()` - 显示更详细的提示
- `prevHint()` - 显示更简单的提示
- `show()` / `hide()` / `toggle()` - 控制侧边栏显示

---

## 已集成的页面

以下页面已集成这两个系统：

1. **正方形课程** (`templates/lesson-square.html`)
   - 5道题目（选择题+判断题）
   - 2个探索任务（基础任务+高级任务）

2. **三角形课程** (`templates/lesson-triangle.html`)
   - 4道题目
   - 1个探索任务

3. **时钟课程** (`templates/lesson-clock.html`)
   - 4道题目
   - 1个探索任务

---

## 设计理念

### 儿童友好设计

- **大按钮**：易于点击
- **明亮色彩**：吸引注意力
- **Emoji图标**：增加趣味性
- **即时反馈**：正向激励
- **简单语言**：易于理解

### 游戏化元素

- **连胜系统**：激励连续答对
- **星级评价**：完成测验后给予评级
- **进度条**：可视化学习进度
- **庆祝动画**：成就感的视觉反馈

### 渐进式学习

- **提示分级**：从简单到详细
- **自动引导**：检测困难自动提示
- **探索式**：鼓励主动探索而非直接给出答案

---

## 扩展指南

### 添加新课程题目

1. 在对应模块的 `getQuizData()` 中添加课程ID和题目
2. 在 `getTaskData()` 中添加任务数据

### 自定义样式

两个模块的样式都已内嵌在 JavaScript 中，可以通过修改 `addStyles()` 方法来自定义外观。

### 与其他系统集成

两个系统都提供了回调函数：

```javascript
// 问答系统回调
onAnswer: (result) => {
    // result.quizIndex - 题目索引
    // result.isCorrect - 是否正确
    // result.streakCount - 当前连胜数
}

// 任务系统回调
onTaskComplete: () => { }
onGoalComplete: (goalId) => { }
```

可以用来：
- 记录学习数据到服务器
- 更新页面其他部分的状态
- 触发成就系统
- 统计学习进度

---

## 技术特点

- **纯原生JavaScript**：无外部依赖
- **模块化设计**：易于复用和扩展
- **响应式布局**：支持移动端
- **性能优化**：高效的DOM操作
- **代码清晰**：详细注释

---

## 浏览器兼容性

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- 移动端浏览器

---

## 未来改进方向

- [ ] 支持更多题型（填空题、连线题等）
- [ ] 添加声音反馈
- [ ] 服务器端保存进度
- [ ] 多语言支持
- [ ] 更多主题样式
- [ ] 成就系统
- [ ] 排行榜功能
