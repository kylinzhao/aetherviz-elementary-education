/**
 * AetherViz 小学教学 - 问答和游戏化系统
 * 包含问答、任务、成就、排行榜等功能
 */

// ================================
// 问答系统
// ================================

const QuizSystem = {
    currentQuiz: null,
    streak: 0,
    difficulty: 'easy',

    /**
     * 题库数据
     */
    questionBank: {
        math: [
            {
                id: 1,
                question: '正方形有几条边？',
                options: ['3 条', '4 条', '5 条'],
                correct: 1,
                explanation: '正方形有 4 条边，而且 4 条边都相等。',
                difficulty: 'easy'
            },
            {
                id: 2,
                question: '下面哪个是圆形？',
                options: ['🔳 正方形', '🔴 圆形', '🔺 三角形'],
                correct: 1,
                explanation: '圆形是圆圆的，没有角。',
                difficulty: 'easy'
            }
        ],
        science: [
            {
                id: 3,
                question: '水在多少度会结冰？',
                options: ['0°C', '10°C', '100°C'],
                correct: 0,
                explanation: '水在 0°C 的时候会结成冰。',
                difficulty: 'easy'
            }
        ]
    },

    /**
     * 创建问答面板
     */
    createQuizPanel(subject = 'math') {
        const questions = this.questionBank[subject] || [];
        const currentQ = questions[Math.floor(Math.random() * questions.length)];
        this.currentQuiz = currentQ;

        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 360px;
            max-height: 380px;
            background: rgba(22, 78, 99, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(20, 184, 166, 0.3);
            border-radius: 16px;
            padding: 20px;
            z-index: 95;
        `;

        panel.innerHTML = `
            <h3 style="font-size: 20px; margin-bottom: 16px;">❓ 小测验</h3>
            <p style="font-size: 18px; margin-bottom: 16px;">${currentQ.question}</p>
            <div class="quiz-options" style="display: flex; flex-direction: column; gap: 8px;"></div>
            <div class="quiz-feedback" style="margin-top: 12px; padding: 12px; border-radius: 8px; display: none;"></div>
            <div style="margin-top: 12px; font-size: 14px; color: rgba(255,255,255,0.6);">
                连续答对: <span id="streak-count">${this.streak}</span> 题
            </div>
        `;

        const optionsContainer = panel.querySelector('.quiz-options');
        currentQ.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'btn-kid';
            btn.style.cssText = 'width: 100%; min-height: 50px; font-size: 16px;';
            btn.textContent = option;
            btn.onclick = () => this.checkAnswer(index, currentQ.correct, currentQ.explanation, panel);
            optionsContainer.appendChild(btn);
        });

        return panel;
    },

    /**
     * 检查答案
     */
    checkAnswer(selected, correct, explanation, panel) {
        const feedback = panel.querySelector('.quiz-feedback');
        feedback.style.display = 'block';

        if (selected === correct) {
            // 正确
            feedback.style.background = 'rgba(34, 197, 94, 0.2)';
            feedback.innerHTML = `✅ 太棒了！${explanation}`;
            this.streak++;
            CartoonAnimations.showCelebration();
            CartoonAnimations.showConfetti();

            // 解锁成就
            if (this.streak >= 3) {
                DataManager.unlockBadge('quiz-streak-3');
            }
        } else {
            // 错误
            feedback.style.background = 'rgba(239, 68, 68, 0.2)';
            feedback.innerHTML = `❌ 不对哦。${explanation}`;
            this.streak = 0;
        }

        document.getElementById('streak-count').textContent = this.streak;
        DataManager.saveAll();

        // 禁用所有按钮
        panel.querySelectorAll('.quiz-options button').forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
        });
    }
};

// ================================
// 探索任务系统
// ================================

const TaskSystem = {
    currentTask: null,
    hintLevel: 0,

    /**
     * 任务数据
     */
    tasks: {
        geometry: [
            {
                id: 'task-1',
                title: '找出所有正方形',
                description: '点击场景中的正方形图形',
                difficulty: 'basic',
                hints: [
                    '正方形有 4 条边',
                    '正方形的 4 条边都相等',
                    '那个黄色的方形就是正方形'
                ]
            }
        ]
    },

    /**
     * 创建任务面板
     */
    createTaskPanel(subject = 'geometry') {
        const tasks = this.tasks[subject] || [];
        const currentTask = tasks[0];

        const panel = document.createElement('div');
        panel.id = 'task-panel';
        panel.style.cssText = `
            position: fixed;
            left: 20px;
            top: 90px;
            width: 280px;
            background: rgba(15, 23, 42, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(20, 184, 166, 0.3);
            border-radius: 16px;
            padding: 20px;
            z-index: 90;
        `;

        panel.innerHTML = `
            <h3 style="font-size: 18px; margin-bottom: 12px;">🎯 探索任务</h3>
            <div class="task-title" style="font-weight: bold; margin-bottom: 8px;">${currentTask.title}</div>
            <div class="task-desc" style="color: rgba(255,255,255,0.7); margin-bottom: 16px;">${currentTask.description}</div>
            <div class="task-hints" style="margin-top: 12px;"></div>
            <button class="btn-kid hint-btn" style="width: 100%; margin-top: 12px; font-size: 16px;">
                💡 获取提示
            </button>
        `;

        // 提示按钮事件
        const hintBtn = panel.querySelector('.hint-btn');
        hintBtn.onclick = () => this.showHint(panel, currentTask);

        this.currentTask = currentTask;
        return panel;
    },

    /**
     * 显示提示
     */
    showHint(panel, task) {
        const hintsContainer = panel.querySelector('.task-hints');
        const hint = task.hints[this.hintLevel];

        if (hint) {
            const hintEl = document.createElement('div');
            hintEl.style.cssText = `
                padding: 8px 12px;
                margin-bottom: 8px;
                background: rgba(251, 191, 36, 0.2);
                border-left: 3px solid #FBBF24;
                border-radius: 4px;
                font-size: 14px;
            `;
            hintEl.textContent = `提示 ${this.hintLevel + 1}: ${hint}`;
            hintsContainer.appendChild(hintEl);

            this.hintLevel++;

            if (this.hintLevel >= task.hints.length) {
                panel.querySelector('.hint-btn').disabled = true;
                panel.querySelector('.hint-btn').textContent = '没有更多提示了';
            }
        }
    },

    /**
     * 完成任务
     */
    completeTask() {
        if (this.currentTask) {
            DataManager.completeTask(this.currentTask.id);
            CartoonAnimations.showCelebration();
            alert('🎉 任务完成！太棒了！');
        }
    }
};

// ================================
// 成就系统
// ================================

const AchievementSystem = {
    badges: {
        'math-explorer': { name: '数学探险家', icon: '🔢', description: '完成 5 个数学主题' },
        'science-explorer': { name: '科学探险家', icon: '🔬', description: '完成 5 个科学主题' },
        'quiz-master': { name: '答题高手', icon: '🏆', description: '连续答对 20 题' },
        'streak-warrior': { name: '坚持不懈', icon: '🔥', description: '连续学习 7 天' }
    },

    /**
     * 显示成就通知
     */
    showAchievementNotification(badgeId) {
        const badge = this.badges[badgeId];
        if (!badge) return;

        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 20px;
            background: linear-gradient(135deg, #F59E0B, #EAB308);
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            animation: slide-in 0.5s ease;
        `;
        notification.innerHTML = `
            <div style="font-size: 48px; text-align: center;">${badge.icon}</div>
            <div style="font-size: 20px; font-weight: bold; margin-top: 8px; color: white;">${badge.name}</div>
            <div style="font-size: 14px; color: rgba(255,255,255,0.8); margin-top: 4px;">${badge.description}</div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slide-out 0.5s ease forwards';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    },

    /**
     * 显示成就面板
     */
    showAchievementPanel() {
        const badges = DataManager.data.achievements.badges;

        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            max-height: 80vh;
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(20, 184, 166, 0.3);
            border-radius: 20px;
            padding: 24px;
            z-index: 1000;
            overflow-y: auto;
        `;

        panel.innerHTML = `
            <h2 style="font-size: 24px; margin-bottom: 16px;">🏆 我的成就</h2>
            <div class="badges-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;"></div>
            <button class="btn-kid" style="width: 100%; margin-top: 16px;" onclick="this.parentElement.remove()">
                关闭
            </button>
        `;

        const grid = panel.querySelector('.badges-grid');

        // 显示已解锁的徽章
        badges.forEach(badgeId => {
            const badge = this.badges[badgeId];
            if (badge) {
                const badgeEl = document.createElement('div');
                badgeEl.style.cssText = `
                    padding: 16px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    text-align: center;
                `;
                badgeEl.innerHTML = `
                    <div style="font-size: 48px;">${badge.icon}</div>
                    <div style="font-weight: bold; margin-top: 8px;">${badge.name}</div>
                    <div style="font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 4px;">${badge.description}</div>
                `;
                grid.appendChild(badgeEl);
            }
        });

        document.body.appendChild(panel);
    }
};

// ================================
// 学习进度可视化
// ================================

const ProgressMap = {
    /**
     * 显示知识点地图
     */
    showProgressMap() {
        const report = DataManager.getReport();

        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 600px;
            max-height: 80vh;
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(20, 184, 166, 0.3);
            border-radius: 20px;
            padding: 24px;
            z-index: 1000;
            overflow-y: auto;
        `;

        const topics = [
            { id: 'math-geometry', name: '几何图形', subject: 'math' },
            { id: 'math-fraction', name: '分数', subject: 'math' },
            { id: 'science-states', name: '物质三态', subject: 'science' },
            { id: 'science-plants', name: '植物', subject: 'science' }
        ];

        panel.innerHTML = `
            <h2 style="font-size: 24px; margin-bottom: 16px;">📊 学习进度</h2>
            <div class="stats" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px;">
                <div style="padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                    <div style="font-size: 32px; font-weight: bold;">${report.completedTopics}</div>
                    <div style="font-size: 14px; color: rgba(255,255,255,0.6);">已完成主题</div>
                </div>
                <div style="padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                    <div style="font-size: 32px; font-weight: bold;">${report.learningTimeHours}h</div>
                    <div style="font-size: 14px; color: rgba(255,255,255,0.6);">学习时长</div>
                </div>
                <div style="padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                    <div style="font-size: 32px; font-weight: bold;">${report.streakDays}</div>
                    <div style="font-size: 14px; color: rgba(255,255,255,0.6);">连续天数</div>
                </div>
                <div style="padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                    <div style="font-size: 32px; font-weight: bold;">${report.badges.length}</div>
                    <div style="font-size: 14px; color: rgba(255,255,255,0.6);">获得徽章</div>
                </div>
            </div>
            <h3 style="font-size: 18px; margin-bottom: 12px;">📚 知识点</h3>
            <div class="topics-list"></div>
            <button class="btn-kid" style="width: 100%; margin-top: 16px;" onclick="this.parentElement.remove()">关闭</button>
        `;

        const list = panel.querySelector('.topics-list');
        topics.forEach(topic => {
            const isCompleted = report.completedTopics.includes(topic.id);
            const topicEl = document.createElement('div');
            topicEl.style.cssText = `
                padding: 12px;
                margin-bottom: 8px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                border-left: 4px solid ${isCompleted ? '#22C55E' : '#64748B'};
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;
            topicEl.innerHTML = `
                <span>${topic.name}</span>
                <span style="color: ${isCompleted ? '#22C55E' : '#64748B'};">${isCompleted ? '✅ 已掌握' : '○ 未学习'}</span>
            `;
            list.appendChild(topicEl);
        });

        document.body.appendChild(panel);
    }
};

// 添加动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slide-in {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slide-out {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// 导出
window.QuizSystem = QuizSystem;
window.TaskSystem = TaskSystem;
window.AchievementSystem = AchievementSystem;
window.ProgressMap = ProgressMap;
