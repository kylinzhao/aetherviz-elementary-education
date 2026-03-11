/**
 * 探索式学习任务系统模块
 * 提供任务引导、渐进式提示、完成检测
 * 帮助学生探索式学习
 */

class TaskSystem {
    constructor(config) {
        this.lessonId = config.lessonId;
        this.taskContainer = config.container;
        this.onTaskComplete = config.onTaskComplete || null;
        this.onGoalComplete = config.onGoalComplete || null;
        this.taskData = this.getTaskData();
        this.currentTask = null;
        this.currentGoalIndex = 0;
        this.completedGoals = new Set();
        this.hintLevel = 0;
        this.lastProgressTime = Date.now();
        this.inactivityTimer = null;

        this.init();
    }

    /**
     * 获取任务数据
     * 可以扩展为从服务器加载
     */
    getTaskData() {
        // 默认任务数据
        const defaultTaskData = {
            'lesson-square': {
                basic: {
                    title: '认识正方形',
                    description: '通过探索了解正方形的特征',
                    goals: [
                        {
                            id: 'find-square',
                            text: '找到场景中的正方形',
                            hints: ['正方形是橙色的', '在屏幕中央有一个大图形', '它有4条边']
                        },
                        {
                            id: 'count-edges',
                            text: '数出正方形有几条边',
                            hints: ['正方形有4条边', '每条边长度相等', '用控制面板切换到正方形模式']
                        },
                        {
                            id: 'count-corners',
                            text: '数出正方形有几个角',
                            hints: ['正方形有4个角', '每个角都是90度直角', '切换到正方体看看有什么不同']
                        }
                    ]
                },
                advanced: {
                    title: '探索平面与立体',
                    description: '比较正方形和正方体的区别',
                    goals: [
                        {
                            id: 'switch-cube',
                            text: '切换到正方体',
                            hints: ['使用控制面板的切换按钮', '正方体是立体的', '点击"正方体"按钮']
                        },
                        {
                            id: 'count-faces',
                            text: '观察正方体有几个面',
                            hints: ['正方体有6个面', '每个面都是正方形', '旋转看看各个面']
                        }
                    ]
                }
            },
            'lesson-triangle': {
                basic: {
                    title: '认识三角形',
                    description: '探索不同类型的三角形',
                    goals: [
                        {
                            id: 'find-triangle',
                            text: '找到场景中的三角形',
                            hints: ['三角形是紫色的', '在屏幕中央有一个图形', '它有3条边']
                        },
                        {
                            id: 'switch-types',
                            text: '尝试切换不同类型的三角形',
                            hints: ['使用控制面板的标签页', '有等边、等腰、直角等类型', '点击不同的标签看看']
                        },
                        {
                            id: 'adjust-size',
                            text: '调整三角形的大小',
                            hints: ['使用滑块控制', '可以调整边长', '观察形状的变化']
                        }
                    ]
                }
            },
            'lesson-clock': {
                basic: {
                    title: '学习时间',
                    description: '认识时钟和时间',
                    goals: [
                        {
                            id: 'find-clock',
                            text: '找到时钟',
                            hints: ['时钟是圆形的', '在屏幕中央', '有时针、分针、秒针']
                        },
                        {
                            id: 'adjust-time',
                            text: '调整时间',
                            hints: ['使用时间滑块', '或者使用+/-按钮', '尝试调整到8:30']
                        },
                        {
                            id: 'read-time',
                            text: '读取当前显示的时间',
                            hints: ['看时针定几时', '看分针定几分', '注意时针在两个数字之间时']
                        }
                    ]
                }
            }
        };

        return defaultTaskData[this.lessonId] || {};
    }

    /**
     * 初始化任务系统
     */
    init() {
        if (!this.taskContainer) {
            console.error('Task container not found');
            return;
        }

        // 默认加载第一个任务
        const taskKeys = Object.keys(this.taskData);
        if (taskKeys.length > 0) {
            this.loadTask(taskKeys[0]);
        }

        this.addStyles();
        this.startInactivityTimer();
    }

    /**
     * 添加任务系统样式
     */
    addStyles() {
        if (document.getElementById('task-system-styles')) return;

        const style = document.createElement('style');
        style.id = 'task-system-styles';
        style.textContent = `
            .task-sidebar {
                position: fixed;
                left: 0;
                top: 70px;
                width: 30%;
                height: calc(100vh - 70px);
                background: rgba(15, 23, 42, 0.95);
                backdrop-filter: blur(10px);
                border-right: 1px solid rgba(255, 255, 255, 0.1);
                padding: 24px;
                overflow-y: auto;
                z-index: 85;
                transform: translateX(0);
                transition: transform 0.3s ease;
            }

            .task-sidebar.hidden {
                transform: translateX(-100%);
            }

            .task-header {
                margin-bottom: 20px;
            }

            .task-title {
                font-size: 24px;
                font-weight: bold;
                color: #F8FAFC;
                margin-bottom: 8px;
            }

            .task-description {
                font-size: 14px;
                color: #CBD5E1;
                line-height: 1.5;
            }

            .task-progress {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 20px;
            }

            .task-progress-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }

            .task-progress-title {
                font-size: 16px;
                font-weight: bold;
                color: #F8FAFC;
            }

            .task-progress-count {
                font-size: 14px;
                color: #CBD5E1;
            }

            .task-progress-bar {
                width: 100%;
                height: 8px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 4px;
                overflow: hidden;
            }

            .task-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #22C55E 0%, #16A34A 100%);
                transition: width 0.5s ease;
            }

            .task-goals {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .task-goal {
                background: rgba(255, 255, 255, 0.05);
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 16px;
                transition: all 0.3s ease;
            }

            .task-goal.active {
                border-color: #FBBF24;
                background: rgba(251, 191, 36, 0.1);
            }

            .task-goal.completed {
                border-color: #22C55E;
                background: rgba(34, 197, 94, 0.1);
                opacity: 0.7;
            }

            .task-goal-header {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                margin-bottom: 8px;
            }

            .task-goal-checkbox {
                width: 24px;
                height: 24px;
                min-width: 24px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .task-goal-checkbox:hover {
                border-color: #FBBF24;
            }

            .task-goal.completed .task-goal-checkbox {
                background: #22C55E;
                border-color: #22C55E;
            }

            .task-goal-text {
                flex: 1;
                font-size: 15px;
                color: #F8FAFC;
                line-height: 1.5;
            }

            .task-goal.completed .task-goal-text {
                text-decoration: line-through;
                color: #94A3B8;
            }

            .task-goal-hint {
                margin-top: 12px;
                padding: 12px;
                background: rgba(251, 191, 36, 0.1);
                border-left: 3px solid #FBBF24;
                border-radius: 6px;
                display: none;
            }

            .task-goal-hint.show {
                display: block;
                animation: fadeIn 0.3s ease;
            }

            .task-goal-hint-title {
                font-size: 13px;
                font-weight: bold;
                color: #FBBF24;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .task-goal-hint-text {
                font-size: 14px;
                color: #F8FAFC;
                line-height: 1.5;
            }

            .task-hint-level {
                display: inline-block;
                padding: 2px 8px;
                background: rgba(251, 191, 36, 0.2);
                border-radius: 4px;
                font-size: 11px;
                color: #FBBF24;
            }

            .hint-buttons {
                display: flex;
                gap: 8px;
                margin-top: 8px;
            }

            .hint-btn {
                flex: 1;
                padding: 8px 12px;
                font-size: 13px;
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                background: rgba(255, 255, 255, 0.1);
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .hint-btn:hover {
                background: rgba(251, 191, 36, 0.2);
                border-color: #FBBF24;
            }

            .hint-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .task-complete-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.5s ease;
            }

            .task-complete-overlay.show {
                opacity: 1;
                pointer-events: auto;
            }

            .task-complete-modal {
                background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.2) 100%);
                border: 2px solid #22C55E;
                border-radius: 24px;
                padding: 48px;
                text-align: center;
                transform: scale(0.8);
                transition: transform 0.5s ease;
            }

            .task-complete-overlay.show .task-complete-modal {
                transform: scale(1);
            }

            .task-complete-icon {
                font-size: 80px;
                margin-bottom: 20px;
                animation: bounce 1s ease infinite;
            }

            .task-complete-title {
                font-size: 36px;
                font-weight: bold;
                color: #22C55E;
                margin-bottom: 12px;
            }

            .task-complete-text {
                font-size: 18px;
                color: #F8FAFC;
                margin-bottom: 24px;
            }

            .task-complete-btn {
                padding: 16px 32px;
                font-size: 18px;
                border-radius: 12px;
                border: none;
                background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .task-complete-btn:hover {
                transform: scale(1.05);
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
            }

            @media (max-width: 640px) {
                .task-sidebar {
                    width: 100%;
                    max-height: 40vh;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 加载任务
     */
    loadTask(taskId) {
        this.currentTask = this.taskData[taskId];
        if (!this.currentTask) return;

        this.currentGoalIndex = 0;
        this.completedGoals.clear();
        this.hintLevel = 0;

        this.render();
    }

    /**
     * 渲染任务界面
     */
    render() {
        if (!this.currentTask) return;

        const goals = this.currentTask.goals || [];
        const completedCount = this.completedGoals.size;
        const progress = (completedCount / goals.length) * 100;

        let goalsHTML = goals.map((goal, index) => {
            const isActive = index === this.currentGoalIndex;
            const isCompleted = this.completedGoals.has(goal.id);

            return `
                <div class="task-goal ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}" data-goal-id="${goal.id}">
                    <div class="task-goal-header">
                        <div class="task-goal-checkbox" onclick="taskSystem.toggleGoal('${goal.id}')">
                            ${isCompleted ? '✓' : ''}
                        </div>
                        <div class="task-goal-text">${goal.text}</div>
                    </div>
                    ${isActive ? `
                        <div class="task-goal-hint" id="hint-${goal.id}">
                            <div class="task-goal-hint-title">
                                💡 提示
                                <span class="task-hint-level" id="hint-level-${goal.id}">第 1 级</span>
                            </div>
                            <div class="task-goal-hint-text" id="hint-text-${goal.id}">
                                ${goal.hints ? goal.hints[0] : ''}
                            </div>
                            <div class="hint-buttons">
                                <button class="hint-btn" id="prev-hint-${goal.id}" onclick="taskSystem.prevHint()" ${this.hintLevel === 0 ? 'disabled' : ''}>
                                    ◀ 更简单
                                </button>
                                <button class="hint-btn" id="next-hint-${goal.id}" onclick="taskSystem.nextHint()" ${this.hintLevel >= (goal.hints?.length || 1) - 1 ? 'disabled' : ''}>
                                    更详细 ▶
                                </button>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');

        this.taskContainer.innerHTML = `
            <div class="task-sidebar">
                <div class="task-header">
                    <div class="task-title">${this.currentTask.title}</div>
                    <div class="task-description">${this.currentTask.description}</div>
                </div>

                <div class="task-progress">
                    <div class="task-progress-header">
                        <div class="task-progress-title">📊 完成进度</div>
                        <div class="task-progress-count">${completedCount} / ${goals.length}</div>
                    </div>
                    <div class="task-progress-bar">
                        <div class="task-progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>

                <div class="task-goals">
                    ${goalsHTML}
                </div>
            </div>

            <div class="task-complete-overlay" id="completeOverlay">
                <div class="task-complete-modal">
                    <div class="task-complete-icon">🎉</div>
                    <div class="task-complete-title">任务完成！</div>
                    <div class="task-complete-text">太棒了！你已经完成了所有探索任务</div>
                    <button class="task-complete-btn" onclick="taskSystem.closeComplete()">
                        继续探索
                    </button>
                </div>
            </div>
        `;

        // 显示当前目标的提示
        if (goals[this.currentGoalIndex]) {
            this.showHint(this.currentGoalIndex);
        }
    }

    /**
     * 切换目标完成状态
     */
    toggleGoal(goalId) {
        const goal = this.currentTask.goals.find(g => g.id === goalId);
        if (!goal) return;

        if (this.completedGoals.has(goalId)) {
            this.completedGoals.delete(goalId);
        } else {
            this.completedGoals.add(goalId);
            this.recordProgress();

            // 移动到下一个未完成的目标
            const goals = this.currentTask.goals;
            for (let i = 0; i < goals.length; i++) {
                if (!this.completedGoals.has(goals[i].id)) {
                    this.currentGoalIndex = i;
                    break;
                }
            }

            // 检查是否全部完成
            if (this.completedGoals.size === goals.length) {
                this.showComplete();
            }

            // 回调
            if (this.onGoalComplete) {
                this.onGoalComplete(goalId);
            }
        }

        this.render();
    }

    /**
     * 记录进度
     */
    recordProgress() {
        this.lastProgressTime = Date.now();
    }

    /**
     * 启动不活动检测定时器
     */
    startInactivityTimer() {
        if (this.inactivityTimer) {
            clearInterval(this.inactivityTimer);
        }

        this.inactivityTimer = setInterval(() => {
            const inactiveTime = Date.now() - this.lastProgressTime;
            const inactiveMinutes = inactiveTime / (1000 * 60);

            // 如果1分钟没有进展，自动显示提示
            if (inactiveMinutes >= 1 && this.currentTask && this.currentTask.goals) {
                const currentGoal = this.currentTask.goals[this.currentGoalIndex];
                if (currentGoal && !this.completedGoals.has(currentGoal.id)) {
                    this.autoShowHint();
                }
            }
        }, 10000); // 每10秒检查一次
    }

    /**
     * 自动显示提示
     */
    autoShowHint() {
        const goal = this.currentTask.goals[this.currentGoalIndex];
        if (!goal) return;

        // 如果提示还没有显示，显示第一级提示
        const hintContainer = document.getElementById(`hint-${goal.id}`);
        if (hintContainer && !hintContainer.classList.contains('show')) {
            hintContainer.classList.add('show');
        }

        // 如果当前是第0级提示，升级到第1级
        if (this.hintLevel === 0 && goal.hints && goal.hints.length > 1) {
            this.hintLevel = 1;
            this.updateHintDisplay(goal.id);
        }
    }

    /**
     * 显示提示
     */
    showHint(goalIndex) {
        const goal = this.currentTask.goals[goalIndex];
        if (!goal) return;

        setTimeout(() => {
            const hintContainer = document.getElementById(`hint-${goal.id}`);
            if (hintContainer) {
                hintContainer.classList.add('show');
            }
        }, 1000); // 延迟1秒显示提示，让学生先尝试
    }

    /**
     * 下一个更详细的提示
     */
    nextHint() {
        const goal = this.currentTask.goals[this.currentGoalIndex];
        if (!goal || !goal.hints) return;

        if (this.hintLevel < goal.hints.length - 1) {
            this.hintLevel++;
            this.updateHintDisplay(goal.id);
        }
    }

    /**
     * 上一个更简单的提示
     */
    prevHint() {
        const goal = this.currentTask.goals[this.currentGoalIndex];
        if (!goal || !goal.hints) return;

        if (this.hintLevel > 0) {
            this.hintLevel--;
            this.updateHintDisplay(goal.id);
        }
    }

    /**
     * 更新提示显示
     */
    updateHintDisplay(goalId) {
        const goal = this.currentTask.goals.find(g => g.id === goalId);
        if (!goal || !goal.hints) return;

        const hintText = document.getElementById(`hint-text-${goalId}`);
        const hintLevel = document.getElementById(`hint-level-${goalId}`);
        const nextBtn = document.getElementById(`next-hint-${goalId}`);
        const prevBtn = document.getElementById(`prev-hint-${goalId}`);

        if (hintText) {
            hintText.textContent = goal.hints[this.hintLevel];
        }
        if (hintLevel) {
            hintLevel.textContent = `第 ${this.hintLevel + 1} 级`;
        }
        if (nextBtn) {
            nextBtn.disabled = this.hintLevel >= goal.hints.length - 1;
        }
        if (prevBtn) {
            prevBtn.disabled = this.hintLevel === 0;
        }
    }

    /**
     * 显示完成动画
     */
    showComplete() {
        const overlay = document.getElementById('completeOverlay');
        if (overlay) {
            overlay.classList.add('show');

            // 3秒后自动关闭
            setTimeout(() => {
                this.closeComplete();
            }, 3000);
        }

        // 回调
        if (this.onTaskComplete) {
            this.onTaskComplete();
        }
    }

    /**
     * 关闭完成界面
     */
    closeComplete() {
        const overlay = document.getElementById('completeOverlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    }

    /**
     * 切换任务侧边栏显示
     */
    toggle() {
        this.taskContainer.classList.toggle('hidden');
    }

    /**
     * 显示任务侧边栏
     */
    show() {
        this.taskContainer.classList.remove('hidden');
    }

    /**
     * 隐藏任务侧边栏
     */
    hide() {
        this.taskContainer.classList.add('hidden');
    }

    /**
     * 销毁任务系统
     */
    destroy() {
        if (this.inactivityTimer) {
            clearInterval(this.inactivityTimer);
        }
        if (this.taskContainer) {
            this.taskContainer.innerHTML = '';
        }
    }
}
