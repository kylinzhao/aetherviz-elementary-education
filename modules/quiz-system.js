/**
 * 问答互动系统模块
 * 提供通用的问答功能，支持选择题、判断题、填空题
 * 包含即时反馈、连胜记录、表扬效果
 */

class QuizSystem {
    constructor(config) {
        this.lessonId = config.lessonId;
        this.quizContainer = config.container;
        this.onAnswer = config.onAnswer || null;
        this.quizData = this.getQuizData();
        this.currentQuizIndex = 0;
        this.correctCount = 0;
        this.streakCount = 0;
        this.maxStreak = 0;
        this.totalAnswered = 0;

        this.init();
    }

    /**
     * 获取题库数据
     * 可以扩展为从服务器加载
     */
    getQuizData() {
        // 默认题库数据
        const defaultQuizData = {
            'lesson-square': [
                {
                    type: 'choice',
                    question: '正方形有几条边？',
                    options: ['3条', '4条', '5条'],
                    correct: 1,
                    explanation: '正方形有4条边，而且4条边都相等。'
                },
                {
                    type: 'choice',
                    question: '正方形有几个角？',
                    options: ['3个', '4个', '5个'],
                    correct: 1,
                    explanation: '正方形有4个角，每个角都是90度直角。'
                },
                {
                    type: 'choice',
                    question: '正方形的四条边长度怎么样？',
                    options: ['都不相等', '部分相等', '全部相等'],
                    correct: 2,
                    explanation: '正方形的四条边长度全部相等，这是它的重要特征。'
                },
                {
                    type: 'choice',
                    question: '下面哪个是正方形？',
                    options: ['长方形', '正方形', '三角形'],
                    correct: 1,
                    explanation: '正方形的四条边都相等，而长方形的对边相等。'
                },
                {
                    type: 'truefalse',
                    question: '正方形是特殊的四边形',
                    correct: true,
                    explanation: '正确！正方形不仅有四条边，而且四条边都相等，四个角都是直角。'
                }
            ],
            'lesson-triangle': [
                {
                    type: 'choice',
                    question: '三角形有几条边？',
                    options: ['2条', '3条', '4条'],
                    correct: 1,
                    explanation: '三角形有3条边，这是三角形的基本特征。'
                },
                {
                    type: 'choice',
                    question: '等边三角形的三个角各是多少度？',
                    options: ['45度', '60度', '90度'],
                    correct: 1,
                    explanation: '等边三角形的三个角都是60度，三个角加起来是180度。'
                },
                {
                    type: 'choice',
                    question: '直角三角形有一个角是多少度？',
                    options: ['60度', '90度', '120度'],
                    correct: 1,
                    explanation: '直角三角形有一个角是90度，这个角叫做直角。'
                },
                {
                    type: 'truefalse',
                    question: '三角形的内角和是180度',
                    correct: true,
                    explanation: '正确！任何三角形的三个内角加起来都是180度。'
                }
            ],
            'lesson-clock': [
                {
                    type: 'choice',
                    question: '时针走得快还是分针走得快？',
                    options: ['时针快', '分针快', '一样快'],
                    correct: 1,
                    explanation: '分针走得更快！分针走一圈，时针才走一格。'
                },
                {
                    type: 'choice',
                    question: '秒针走一圈是多少秒？',
                    options: ['30秒', '60秒', '100秒'],
                    correct: 1,
                    explanation: '秒针走一圈是60秒，也就是1分钟。'
                },
                {
                    type: 'choice',
                    question: '时针走一圈是几小时？',
                    options: ['6小时', '12小时', '24小时'],
                    correct: 1,
                    explanation: '时针走一圈是12小时，一天会转两圈。'
                },
                {
                    type: 'truefalse',
                    question: '8:30的时候，时针在8和9的中间',
                    correct: true,
                    explanation: '正确！当分针指向6的时候，时针会走一半到两个数字中间。'
                }
            ]
        };

        return defaultQuizData[this.lessonId] || [];
    }

    /**
     * 初始化问答系统
     */
    init() {
        if (!this.quizContainer) {
            console.error('Quiz container not found');
            return;
        }

        this.renderQuiz();
        this.addStyles();
    }

    /**
     * 添加问答系统样式
     */
    addStyles() {
        if (document.getElementById('quiz-system-styles')) return;

        const style = document.createElement('style');
        style.id = 'quiz-system-styles';
        style.textContent = `
            .quiz-container {
                padding: 20px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 16px;
                margin-top: 16px;
            }

            .quiz-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
                padding-bottom: 12px;
                border-bottom: 2px solid rgba(255, 255, 255, 0.1);
            }

            .quiz-title {
                font-size: 20px;
                font-weight: bold;
                color: #F8FAFC;
            }

            .quiz-progress {
                font-size: 14px;
                color: #CBD5E1;
            }

            .streak-display {
                text-align: center;
                padding: 12px;
                background: rgba(251, 191, 36, 0.1);
                border-radius: 12px;
                margin-bottom: 16px;
            }

            .streak-icon {
                font-size: 24px;
                margin-bottom: 4px;
            }

            .streak-count {
                font-size: 20px;
                font-weight: bold;
                color: #FBBF24;
            }

            .streak-label {
                font-size: 12px;
                color: #CBD5E1;
            }

            .quiz-question {
                font-size: 18px;
                color: #F8FAFC;
                margin-bottom: 20px;
                line-height: 1.6;
            }

            .quiz-options {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .quiz-option {
                width: 100%;
                padding: 16px 20px;
                font-size: 16px;
                border-radius: 12px;
                border: 2px solid rgba(255, 255, 255, 0.2);
                background: rgba(255, 255, 255, 0.1);
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: left;
            }

            .quiz-option:hover:not(:disabled) {
                transform: scale(1.02);
                background: rgba(255, 255, 255, 0.15);
                border-color: rgba(255, 255, 255, 0.3);
            }

            .quiz-option:disabled {
                cursor: not-allowed;
                opacity: 0.7;
            }

            .quiz-option.correct {
                background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%);
                border-color: #22C55E;
                animation: pulse-green 0.5s ease;
            }

            .quiz-option.wrong {
                background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
                border-color: #EF4444;
                animation: shake 0.5s ease;
            }

            .quiz-explanation {
                margin-top: 16px;
                padding: 16px;
                background: rgba(251, 191, 36, 0.1);
                border-left: 4px solid #FBBF24;
                border-radius: 8px;
                font-size: 15px;
                color: #F8FAFC;
                line-height: 1.6;
                display: none;
            }

            .quiz-explanation.show {
                display: block;
                animation: fadeIn 0.3s ease;
            }

            .quiz-next-btn {
                width: 100%;
                margin-top: 16px;
                padding: 16px;
                font-size: 16px;
                border-radius: 12px;
                border: none;
                background: var(--primary-gradient);
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
                display: none;
            }

            .quiz-next-btn.show {
                display: block;
            }

            .quiz-next-btn:hover {
                transform: scale(1.02);
            }

            .quiz-complete {
                text-align: center;
                padding: 32px 16px;
            }

            .quiz-complete-title {
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 16px;
                background: var(--primary-gradient);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .quiz-complete-stats {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 20px;
            }

            .quiz-complete-stat {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .quiz-complete-stat:last-child {
                border-bottom: none;
            }

            .celebration-overlay {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1000;
                pointer-events: none;
                text-align: center;
            }

            .celebration-text {
                font-size: 48px;
                font-weight: bold;
                background: linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: celebrate 1.5s ease forwards;
            }

            .celebration-stars {
                font-size: 64px;
                animation: starBurst 1s ease forwards;
            }

            @keyframes pulse-green {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                75% { transform: translateX(10px); }
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            @keyframes celebrate {
                0%, 100% { transform: scale(1); opacity: 0; }
                50% { transform: scale(1.3); opacity: 1; }
            }

            @keyframes starBurst {
                0% { transform: scale(0) rotate(0deg); opacity: 0; }
                50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
                100% { transform: scale(1) rotate(360deg); opacity: 0; }
            }

            .true-false-buttons {
                display: flex;
                gap: 12px;
            }

            .true-false-buttons .quiz-option {
                flex: 1;
                text-align: center;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 渲染问答界面
     */
    renderQuiz() {
        if (this.currentQuizIndex >= this.quizData.length) {
            this.renderComplete();
            return;
        }

        const quiz = this.quizData[this.currentQuizIndex];
        let optionsHTML = '';

        if (quiz.type === 'choice') {
            optionsHTML = `
                <div class="quiz-options">
                    ${quiz.options.map((option, index) => `
                        <button class="quiz-option" onclick="quizSystem.checkAnswer(${index})">
                            ${option}
                        </button>
                    `).join('')}
                </div>
            `;
        } else if (quiz.type === 'truefalse') {
            optionsHTML = `
                <div class="true-false-buttons">
                    <button class="quiz-option" onclick="quizSystem.checkAnswer(true)">
                        ✅ 正确
                    </button>
                    <button class="quiz-option" onclick="quizSystem.checkAnswer(false)">
                        ❌ 错误
                    </button>
                </div>
            `;
        }

        this.quizContainer.innerHTML = `
            <div class="quiz-container">
                <div class="quiz-header">
                    <div class="quiz-title">❓ 小测验</div>
                    <div class="quiz-progress">
                        ${this.currentQuizIndex + 1} / ${this.quizData.length}
                    </div>
                </div>

                <div class="streak-display">
                    <div class="streak-icon">🔥</div>
                    <div class="streak-count">连胜 ${this.streakCount} 题</div>
                    <div class="streak-label">最高连胜: ${this.maxStreak} 题</div>
                </div>

                <div class="quiz-question">
                    ${quiz.question}
                </div>

                ${optionsHTML}

                <div class="quiz-explanation" id="explanation"></div>

                <button class="quiz-next-btn" id="nextBtn" onclick="quizSystem.nextQuiz()">
                    下一题 ➡️
                </button>
            </div>
        `;
    }

    /**
     * 检查答案
     */
    checkAnswer(userAnswer) {
        const quiz = this.quizData[this.currentQuizIndex];
        const isCorrect = userAnswer === quiz.correct;
        const buttons = this.quizContainer.querySelectorAll('.quiz-option');

        // 禁用所有按钮
        buttons.forEach(btn => btn.disabled = true);

        this.totalAnswered++;

        if (isCorrect) {
            this.streakCount++;
            this.correctCount++;
            if (this.streakCount > this.maxStreak) {
                this.maxStreak = this.streakCount;
            }

            // 标记正确答案
            if (quiz.type === 'choice') {
                buttons[userAnswer].classList.add('correct');
            } else if (quiz.type === 'truefalse') {
                buttons[userAnswer ? 0 : 1].classList.add('correct');
            }

            // 连续答对3题以上的表扬
            if (this.streakCount >= 3) {
                this.showCelebration();
            }
        } else {
            this.streakCount = 0;

            // 标记错误答案
            if (quiz.type === 'choice') {
                buttons[userAnswer].classList.add('wrong');
                buttons[quiz.correct].classList.add('correct');
            } else if (quiz.type === 'truefalse') {
                buttons[userAnswer ? 0 : 1].classList.add('wrong');
                buttons[quiz.correct ? 0 : 1].classList.add('correct');
            }
        }

        // 显示解释
        const explanation = document.getElementById('explanation');
        explanation.innerHTML = `<strong>${isCorrect ? '✅ 太棒了！' : '❌ 不对哦'}</strong><br>${quiz.explanation}`;
        explanation.classList.add('show');

        // 显示下一题按钮
        document.getElementById('nextBtn').classList.add('show');

        // 更新连胜显示
        this.updateStreakDisplay();

        // 回调
        if (this.onAnswer) {
            this.onAnswer({
                quizIndex: this.currentQuizIndex,
                isCorrect,
                streakCount: this.streakCount
            });
        }
    }

    /**
     * 显示表扬动画
     */
    showCelebration() {
        const messages = [
            '太厉害了！',
            '你是天才！',
            '完美！',
            '不可思议！',
            '继续加油！'
        ];
        const message = messages[Math.floor(Math.random() * messages.length)];

        const overlay = document.createElement('div');
        overlay.className = 'celebration-overlay';
        overlay.innerHTML = `
            <div class="celebration-stars">⭐⭐⭐</div>
            <div class="celebration-text">${message}</div>
        `;
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.remove();
        }, 1500);
    }

    /**
     * 更新连胜显示
     */
    updateStreakDisplay() {
        const streakDisplay = this.quizContainer.querySelector('.streak-display');
        if (streakDisplay) {
            streakDisplay.innerHTML = `
                <div class="streak-icon">🔥</div>
                <div class="streak-count">连胜 ${this.streakCount} 题</div>
                <div class="streak-label">最高连胜: ${this.maxStreak} 题</div>
            `;
        }
    }

    /**
     * 下一题
     */
    nextQuiz() {
        this.currentQuizIndex++;
        this.renderQuiz();
    }

    /**
     * 渲染完成界面
     */
    renderComplete() {
        const accuracy = Math.round((this.correctCount / this.totalAnswered) * 100);
        let grade = '';
        if (accuracy >= 90) grade = '🏆 优秀';
        else if (accuracy >= 70) grade = '⭐ 良好';
        else if (accuracy >= 60) grade = '👍 及格';
        else grade = '💪 继续努力';

        this.quizContainer.innerHTML = `
            <div class="quiz-container">
                <div class="quiz-complete">
                    <div class="quiz-complete-title">🎉 测验完成！</div>

                    <div class="quiz-complete-stats">
                        <div class="quiz-complete-stat">
                            <span>总题数</span>
                            <span>${this.totalAnswered} 题</span>
                        </div>
                        <div class="quiz-complete-stat">
                            <span>答对</span>
                            <span style="color: #22C55E;">${this.correctCount} 题</span>
                        </div>
                        <div class="quiz-complete-stat">
                            <span>正确率</span>
                            <span style="color: ${accuracy >= 70 ? '#22C55E' : '#F59E0B'};">${accuracy}%</span>
                        </div>
                        <div class="quiz-complete-stat">
                            <span>最高连胜</span>
                            <span style="color: #FBBF24;">${this.maxStreak} 题</span>
                        </div>
                        <div class="quiz-complete-stat">
                            <span>评级</span>
                            <span>${grade}</span>
                        </div>
                    </div>

                    <button class="quiz-option" onclick="quizSystem.restart()">
                        🔄 重新开始
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * 重新开始
     */
    restart() {
        this.currentQuizIndex = 0;
        this.correctCount = 0;
        this.streakCount = 0;
        this.maxStreak = 0;
        this.totalAnswered = 0;
        this.renderQuiz();
    }
}
