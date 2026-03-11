# 如何为新课程添加题目和任务

本文档展示如何为新的教学页面添加问答系统和任务系统。

## 步骤1：在 HTML 页面中集成模块

### 1.1 添加容器元素

在 `<body>` 标签开始处添加任务容器：

```html
<body>
    <!-- 其他内容 -->
    <div id="task-container"></div>
    <!-- 其他内容 -->
</body>
```

### 1.2 添加问答容器

在控制面板中添加问答容器：

```html
<aside class="control-panel" id="controls">
    <!-- 其他控制项 -->

    <div style="margin-top: 24px; padding: 16px; background: rgba(255,255,255,0.05); border-radius: 12px;">
        <h3 style="font-size: 18px; margin-bottom: 12px;">❓ 问答测试</h3>
        <div id="quiz-container"></div>
    </div>
</aside>
```

### 1.3 加载模块脚本

在 `</body>` 前添加：

```html
<!-- 加载问答和任务系统模块 -->
<script src="../modules/quiz-system.js"></script>
<script src="../modules/task-system.js"></script>
```

### 1.4 初始化系统

在页面的 JavaScript 中添加：

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // 初始化问答系统
    window.quizSystem = new QuizSystem({
        lessonId: 'lesson-your-lesson',  // 你的课程ID
        container: document.getElementById('quiz-container'),
        onAnswer: (result) => {
            console.log('Quiz answer:', result);
        }
    });

    // 初始化任务系统
    window.taskSystem = new TaskSystem({
        lessonId: 'lesson-your-lesson',  // 你的课程ID
        container: document.getElementById('task-container'),
        onTaskComplete: () => {
            console.log('Task completed!');
        },
        onGoalComplete: (goalId) => {
            console.log('Goal completed:', goalId);
        }
    });

    // 默认隐藏任务侧边栏
    window.taskSystem.hide();
});
```

## 步骤2：在模块中添加题目

编辑 `modules/quiz-system.js`，在 `getQuizData()` 方法中添加你的题目：

### 选择题示例

```javascript
getQuizData() {
    return {
        'lesson-your-lesson': [
            {
                type: 'choice',
                question: '你的问题是什么？',
                options: ['选项A', '选项B', '选项C'],
                correct: 1,  // 正确答案的索引（0-based）
                explanation: '解释为什么这个答案正确...'
            },
            // 更多题目...
        ]
    };
}
```

### 判断题示例

```javascript
{
    type: 'truefalse',
    question: '陈述一个需要判断的事实',
    correct: true,  // true 表示正确，false 表示错误
    explanation: '解释为什么这是正确的...'
}
```

## 步骤3：在模块中添加任务

编辑 `modules/task-system.js`，在 `getTaskData()` 方法中添加你的任务：

```javascript
getTaskData() {
    return {
        'lesson-your-lesson': {
            basic: {
                title: '基础任务标题',
                description: '任务描述，告诉学生要做什么',
                goals: [
                    {
                        id: 'goal-1',
                        text: '第一个目标描述',
                        hints: [
                            '第1级提示：最简单的提示',
                            '第2级提示：更具体的指导',
                            '第3级提示：非常详细的操作步骤'
                        ]
                    },
                    {
                        id: 'goal-2',
                        text: '第二个目标描述',
                        hints: [
                            '提示1',
                            '提示2',
                            '提示3'
                        ]
                    }
                    // 更多目标...
                ]
            },
            advanced: {
                // 可选：添加高级任务
                title: '高级任务标题',
                description: '高级任务描述',
                goals: [
                    // 高级任务目标...
                ]
            }
        }
    };
}
```

## 完整示例

假设你要创建一个关于"圆形"的课程：

### 1. HTML 集成

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>认识圆形</title>
</head>
<body>
    <div id="canvas-container"></div>
    <div id="task-container"></div>

    <nav class="navbar">
        <button class="btn-kid" onclick="toggleTaskSidebar()">📋 探索任务</button>
        <!-- 其他按钮 -->
    </nav>

    <aside class="control-panel" id="controls">
        <!-- 其他控制项 -->

        <div style="margin-top: 24px; padding: 16px; background: rgba(255,255,255,0.05); border-radius: 12px;">
            <h3 style="font-size: 18px; margin-bottom: 12px;">❓ 问答测试</h3>
            <div id="quiz-container"></div>
        </div>
    </aside>

    <script src="../modules/quiz-system.js"></script>
    <script src="../modules/task-system.js"></script>
    <script>
        function toggleTaskSidebar() {
            if (window.taskSystem) {
                window.taskSystem.toggle();
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            // 初始化场景
            init();

            // 初始化问答系统
            window.quizSystem = new QuizSystem({
                lessonId: 'lesson-circle',
                container: document.getElementById('quiz-container'),
                onAnswer: (result) => {
                    console.log('Quiz answer:', result);
                }
            });

            // 初始化任务系统
            window.taskSystem = new TaskSystem({
                lessonId: 'lesson-circle',
                container: document.getElementById('task-container'),
                onTaskComplete: () => {
                    console.log('Task completed!');
                },
                onGoalComplete: (goalId) => {
                    console.log('Goal completed:', goalId);
                }
            });

            window.taskSystem.hide();
        });
    </script>
</body>
</html>
```

### 2. 添加题目数据

在 `quiz-system.js` 中添加：

```javascript
getQuizData() {
    return {
        // ... 其他课程的数据 ...

        'lesson-circle': [
            {
                type: 'choice',
                question: '圆形有几条边？',
                options: ['0条', '1条', '无数条'],
                correct: 0,
                explanation: '圆形没有边，它是光滑的曲线。'
            },
            {
                type: 'choice',
                question: '从圆心到圆上任意一点的距离叫做什么？',
                options: ['直径', '半径', '周长'],
                correct: 1,
                explanation: '从圆心到圆上任意一点的距离叫做半径。'
            },
            {
                type: 'truefalse',
                question: '所有圆的周长与直径的比值都相同',
                correct: true,
                explanation: '正确！这个比值就是圆周率π，约等于3.14。'
            },
            {
                type: 'choice',
                question: '圆周率π约等于多少？',
                options: ['2.14', '3.14', '4.14'],
                correct: 1,
                explanation: '圆周率π约等于3.14。'
            }
        ]
    };
}
```

### 3. 添加任务数据

在 `task-system.js` 中添加：

```javascript
getTaskData() {
    return {
        // ... 其他课程的数据 ...

        'lesson-circle': {
            basic: {
                title: '认识圆形',
                description: '通过探索了解圆形的特征',
                goals: [
                    {
                        id: 'find-circle',
                        text: '找到场景中的圆形',
                        hints: [
                            '圆形是红色的',
                            '在屏幕中央有一个圆形',
                            '它没有角，边缘是光滑的'
                        ]
                    },
                    {
                        id: 'observe-radius',
                        text: '观察圆的半径',
                        hints: [
                            '半径是从圆心到圆上的线',
                            '所有半径长度都相等',
                            '用控制面板调整圆的大小'
                        ]
                    },
                    {
                        id: 'count-diameter',
                        text: '理解直径的概念',
                        hints: [
                            '直径是通过圆心的最长线段',
                            '直径长度是半径的2倍',
                            '旋转圆看看各个方向'
                        ]
                    }
                ]
            }
        }
    };
}
```

## 提示设计原则

### 提示级别设计

1. **第1级提示**：给出最基本的提示，让学生有方向
   - 例如："正方形是橙色的"

2. **第2级提示**：更具体的指导，但不是直接答案
   - 例如："在屏幕中央有一个大图形"

3. **第3级提示**：非常详细的操作步骤
   - 例如："它有4条边"

### 提示设计技巧

- ✅ 从简单到详细，循序渐进
- ✅ 使用简明的语言
- ✅ 不要直接给出答案
- ✅ 鼓励学生思考
- ❌ 避免使用专业术语
- ❌ 避免一次性给出所有信息

## 题目设计原则

### 题目类型选择

- **选择题**：适合考查基础知识
- **判断题**：适合考查概念理解
- **填空题**：适合考查记忆和计算

### 题目设计技巧

1. **难度递进**：从简单到困难
2. **覆盖全面**：涵盖课程的所有知识点
3. **语言简洁**：问题要清晰明确
4. **选项合理**：错误选项要有迷惑性但不能太离谱
5. **解释详细**：每个答案都要有清晰的解释

### 题目数量建议

- 基础课程：3-5题
- 中级课程：5-8题
- 高级课程：8-10题

## 常见问题

### Q: 如何测试新添加的题目？

A: 打开对应的课程页面，问答系统会自动加载新题目。也可以使用 `modules/demo.html` 进行测试。

### Q: 任务侧边栏默认是隐藏的，如何显示？

A: 在初始化后调用 `window.taskSystem.show()` 来显示。

### Q: 如何自定义样式？

A: 修改对应模块的 `addStyles()` 方法中的 CSS。

### Q: 能否添加更多提示级别？

A: 可以！在任务数据的 `hints` 数组中添加更多提示，模块会自动适配。

## 扩展功能

### 添加自定义回调

```javascript
window.quizSystem = new QuizSystem({
    lessonId: 'lesson-circle',
    container: document.getElementById('quiz-container'),
    onAnswer: (result) => {
        // 自定义处理逻辑
        if (result.isCorrect) {
            // 记录正确答案到服务器
            saveToServer('correct', result.quizIndex);
        } else {
            // 记录错误答案
            saveToServer('wrong', result.quizIndex);
        }
    }
});
```

### 动态加载题目

```javascript
// 从服务器加载题目
async function loadQuizFromServer(lessonId) {
    const response = await fetch(`/api/quiz/${lessonId}`);
    const data = await response.json();
    return data;
}

// 使用
const quizData = await loadQuizFromServer('lesson-circle');
// 然后初始化问答系统...
```

## 总结

为课程添加问答和任务系统的步骤：

1. ✅ 在 HTML 中添加容器和脚本引用
2. ✅ 在 `quiz-system.js` 中添加题目数据
3. ✅ 在 `task-system.js` 中添加任务数据
4. ✅ 在页面初始化时创建实例
5. ✅ 测试功能是否正常

就这么简单！现在你的课程也拥有互动问答和探索任务功能了！
