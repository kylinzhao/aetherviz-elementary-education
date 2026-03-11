/**
 * AetherViz 小学教学 - 数据持久化管理系统
 * 使用 LocalStorage 存储学习进度、成就和设置
 */

const DataManager = {
    // 数据结构
    data: {
        progress: {
            completedTopics: [],
            currentTopic: null,
            learningTime: 0,
            streakDays: 0,
            lastVisitDate: null
        },
        achievements: {
            badges: [],
            quizStreak: 0,
            tasksCompleted: 0,
            perfectScores: 0
        },
        settings: {
            voiceEnabled: true,
            voiceRate: 0.8,
            voiceVolume: 1.0,
            mode: 'simple',
            fontSize: 100,
            theme: 'math'
        },
        topicProgress: {} // 每个主题的具体进度
    },

    /**
     * 初始化数据管理器
     */
    init() {
        this.loadAll();
        this.updateStreak();
    },

    /**
     * 保存所有数据
     */
    saveAll() {
        try {
            localStorage.setItem('aetherviz_data', JSON.stringify(this.data));
            return true;
        } catch (e) {
            console.error('保存数据失败:', e);
            return false;
        }
    },

    /**
     * 加载所有数据
     */
    loadAll() {
        const saved = localStorage.getItem('aetherviz_data');

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.data = { ...this.data, ...parsed };
            } catch (e) {
                console.error('加载数据失败:', e);
            }
        }
    },

    /**
     * 清除所有数据
     */
    clearAll() {
        if (confirm('确定要清除所有学习数据吗？此操作不可恢复！')) {
            localStorage.removeItem('aetherviz_data');
            this.data = {
                progress: {
                    completedTopics: [],
                    currentTopic: null,
                    learningTime: 0,
                    streakDays: 0,
                    lastVisitDate: null
                },
                achievements: {
                    badges: [],
                    quizStreak: 0,
                    tasksCompleted: 0,
                    perfectScores: 0
                },
                settings: {
                    voiceEnabled: true,
                    voiceRate: 0.8,
                    voiceVolume: 1.0,
                    mode: 'simple',
                    fontSize: 100,
                    theme: 'math'
                },
                topicProgress: {}
            };
            this.saveAll();
        }
    },

    // ================================
    // 学习进度管理
    // ================================

    /**
     * 标记主题为已完成
     * @param {string} topicId - 主题ID
     */
    completeTopic(topicId) {
        if (!this.data.progress.completedTopics.includes(topicId)) {
            this.data.progress.completedTopics.push(topicId);
            this.checkAchievements();
            this.saveAll();
        }
    },

    /**
     * 设置当前主题
     * @param {string} topicId - 主题ID
     */
    setCurrentTopic(topicId) {
        this.data.progress.currentTopic = topicId;
        this.saveAll();
    },

    /**
     * 增加学习时间（秒）
     * @param {number} seconds - 学习秒数
     */
    addLearningTime(seconds) {
        this.data.progress.learningTime += seconds;
        this.checkAchievements();
        this.saveAll();
    },

    /**
     * 更新学习连续天数
     */
    updateStreak() {
        const today = new Date().toDateString();
        const lastVisit = this.data.progress.lastVisitDate;

        if (lastVisit) {
            const lastDate = new Date(lastVisit);
            const daysDiff = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));

            if (daysDiff === 1) {
                // 连续学习
                this.data.progress.streakDays++;
            } else if (daysDiff > 1) {
                // 中断了
                this.data.progress.streakDays = 1;
            }
            // daysDiff === 0 表示今天已经来过了
        } else {
            // 首次访问
            this.data.progress.streakDays = 1;
        }

        this.data.progress.lastVisitDate = today;
        this.saveAll();
    },

    /**
     * 获取主题进度
     * @param {string} topicId - 主题ID
     */
    getTopicProgress(topicId) {
        if (!this.data.topicProgress[topicId]) {
            this.data.topicProgress[topicId] = {
                started: false,
                completed: false,
                quizScore: 0,
                tasksCompleted: [],
                timeSpent: 0
            };
        }
        return this.data.topicProgress[topicId];
    },

    /**
     * 更新主题进度
     * @param {string} topicId - 主题ID
     * @param {Object} updates - 更新内容
     */
    updateTopicProgress(topicId, updates) {
        const progress = this.getTopicProgress(topicId);
        this.data.topicProgress[topicId] = { ...progress, ...updates };
        this.saveAll();
    },

    // ================================
    // 成就管理
    // ================================

    /**
     * 解锁徽章
     * @param {string} badgeId - 徽章ID
     */
    unlockBadge(badgeId) {
        if (!this.data.achievements.badges.includes(badgeId)) {
            this.data.achievements.badges.push(badgeId);
            this.saveAll();
            return true;
        }
        return false;
    },

    /**
     * 增加连胜记录
     */
    incrementQuizStreak() {
        this.data.achievements.quizStreak++;
        this.checkAchievements();
        this.saveAll();
    },

    /**
     * 重置连胜记录
     */
    resetQuizStreak() {
        this.data.achievements.quizStreak = 0;
        this.saveAll();
    },

    /**
     * 完成任务
     * @param {string} taskId - 任务ID
     */
    completeTask(taskId) {
        this.data.achievements.tasksCompleted++;
        this.checkAchievements();
        this.saveAll();
    },

    /**
     * 检查并解锁成就
     */
    checkAchievements() {
        // 学习大师 - 完成10个主题
        if (this.data.progress.completedTopics.length >= 10) {
            this.unlockBadge('learning-master');
        }

        // 数学探险家 - 完成5个数学主题
        const mathTopics = this.data.progress.completedTopics.filter(id => id.startsWith('math'));
        if (mathTopics.length >= 5) {
            this.unlockBadge('math-explorer');
        }

        // 科学探险家 - 完成5个科学主题
        const scienceTopics = this.data.progress.completedTopics.filter(id => id.startsWith('science'));
        if (scienceTopics.length >= 5) {
            this.unlockBadge('science-explorer');
        }

        // 答题高手 - 连续答对20题
        if (this.data.achievements.quizStreak >= 20) {
            this.unlockBadge('quiz-master');
        }

        // 学习达人 - 累计学习10小时
        if (this.data.progress.learningTime >= 36000) {
            this.unlockBadge('study-expert');
        }

        // 坚持不懈 - 连续学习7天
        if (this.data.progress.streakDays >= 7) {
            this.unlockBadge('streak-warrior');
        }

        // 任务达人 - 完成50个任务
        if (this.data.achievements.tasksCompleted >= 50) {
            this.unlockBadge('task-champion');
        }
    },

    // ================================
    // 设置管理
    // ================================

    /**
     * 更新设置
     * @param {Object} updates - 设置更新
     */
    updateSettings(updates) {
        this.data.settings = { ...this.data.settings, ...updates };
        this.saveAll();
    },

    /**
     * 获取设置
     * @param {string} key - 设置键
     */
    getSetting(key) {
        return this.data.settings[key];
    },

    // ================================
    // 数据导出和导入
    // ================================

    /**
     * 导出数据为 JSON
     */
    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `aetherviz-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        URL.revokeObjectURL(url);
    },

    /**
     * 导入数据
     * @param {File} file - 导入的文件
     */
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const imported = JSON.parse(e.target.result);

                    // 验证数据格式
                    if (imported.progress && imported.achievements && imported.settings) {
                        this.data = imported;
                        this.saveAll();
                        resolve(true);
                    } else {
                        reject(new Error('数据格式不正确'));
                    }
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    },

    /**
     * 获取学习报告
     */
    getReport() {
        return {
            completedTopics: this.data.progress.completedTopics.length,
            currentTopic: this.data.progress.currentTopic,
            learningTime: this.data.progress.learningTime,
            learningTimeHours: (this.data.progress.learningTime / 3600).toFixed(1),
            streakDays: this.data.progress.streakDays,
            badges: this.data.achievements.badges,
            quizStreak: this.data.achievements.quizStreak,
            tasksCompleted: this.data.achievements.tasksCompleted,
            topicProgress: this.data.topicProgress
        };
    },

    /**
     * 获取薄弱知识点
     */
    getWeakTopics() {
        const topics = Object.entries(this.data.topicProgress);
        const weakTopics = [];

        topics.forEach(([topicId, progress]) => {
            if (progress.started && !progress.completed) {
                if (progress.quizScore < 60 || progress.tasksCompleted.length === 0) {
                    weakTopics.push({
                        topicId,
                        score: progress.quizScore,
                        tasksCompleted: progress.tasksCompleted.length
                    });
                }
            }
        });

        return weakTopics.sort((a, b) => a.score - b.score);
    },

    /**
     * 推荐下一个学习主题
     */
    recommendNextTopic() {
        // 基于薄弱知识点推荐
        const weakTopics = this.getWeakTopics();
        if (weakTopics.length > 0) {
            return weakTopics[0].topicId;
        }

        // 基于完成进度推荐
        const allTopics = [
            'math-geometry-basic',
            'math-fraction-intro',
            'math-measurement',
            'math-statistics',
            'science-machines',
            'science-states',
            'science-plants',
            'science-astronomy'
        ];

        for (const topic of allTopics) {
            if (!this.data.progress.completedTopics.includes(topic)) {
                return topic;
            }
        }

        return null; // 所有主题都已完成
    }
};

// 导出到全局
window.DataManager = DataManager;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    DataManager.init();
});
