/**
 * AetherViz 小学教学 - 儿童友好 UI 组件库
 * 包含所有适合小学生的交互组件
 * 支持完整的无障碍功能
 */

// ================================
// 大尺寸按钮组件
// ================================

const KidButton = {
    /**
     * 创建儿童友好按钮
     * @param {Object} options - 按钮配置
     * @param {string} options.text - 按钮文字
     * @param {string} options.icon - SVG 图标
     * @param {string} options.color - 颜色主题 (primary, success, warning, error)
     * @param {Function} options.onClick - 点击回调
     * @param {string} options.ariaLabel - ARIA 标签（可选）
     * @param {boolean} options.expanded - 是否展开状态（可选）
     * @param {string} options.controls - 控制的元素 ID（可选）
     * @returns {HTMLElement}
     */
    create({
        text = '按钮',
        icon = '',
        color = 'primary',
        onClick = () => {},
        ariaLabel,
        expanded,
        controls
    }) {
        const button = document.createElement('button');
        button.className = `btn-kid btn-kid-${color}`;

        // 设置 ARIA 属性
        if (ariaLabel) {
            button.setAttribute('aria-label', ariaLabel);
        }
        if (expanded !== undefined) {
            button.setAttribute('aria-expanded', expanded.toString());
        }
        if (controls) {
            button.setAttribute('aria-controls', controls);
        }

        // 添加图标（如果有）
        if (icon) {
            // 确保图标有 aria-hidden
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = icon;
            const svg = tempDiv.querySelector('svg');
            if (svg && !svg.getAttribute('aria-hidden')) {
                svg.setAttribute('aria-hidden', 'true');
            }
            button.innerHTML = icon;
        }

        // 添加文字 span
        const textSpan = document.createElement('span');
        textSpan.textContent = text;
        button.appendChild(textSpan);

        // 设置点击事件
        button.onclick = (e) => {
            onClick(e);
            // 公告给屏幕阅读器
            if (window.A11y && ariaLabel) {
                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                window.A11y.announce(isExpanded ? `${ariaLabel}已打开` : `${ariaLabel}已关闭`);
            }
        };

        // 添加动画效果
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });

        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
        });

        button.addEventListener('mouseup', () => {
            button.style.transform = 'scale(1.05)';
        });

        return button;
    }
};

// ================================
// 大尺寸滑块组件
// ================================

const KidSlider = {
    /**
     * 创建儿童友好滑块
     * @param {Object} options - 滑块配置
     * @param {number} options.min - 最小值
     * @param {number} options.max - 最大值
     * @param {number} options.value - 当前值
     * @param {string} options.label - 标签
     * @param {string} options.ariaLabel - ARIA 标签（可选）
     * @param {Function} options.onChange - 值改变回调
     * @returns {HTMLElement}
     */
    create({
        min = 0,
        max = 100,
        value = 50,
        label = '参数',
        ariaLabel,
        onChange = () => {}
    }) {
        const container = document.createElement('div');
        container.className = 'kid-slider-container';
        container.style.marginBottom = '24px';
        container.setAttribute('role', 'group');
        container.setAttribute('aria-label', ariaLabel || `${label}控制`);

        const labelEl = document.createElement('label');
        labelEl.textContent = label;
        labelEl.style.display = 'block';
        labelEl.style.marginBottom = '8px';
        labelEl.style.fontSize = '18px';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'kid-slider';
        slider.min = min;
        slider.max = max;
        slider.value = value;
        slider.id = `slider-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // 设置 ARIA 属性
        slider.setAttribute('aria-label', ariaLabel || `${label}滑块`);
        slider.setAttribute('aria-valuemin', min);
        slider.setAttribute('aria-valuemax', max);
        slider.setAttribute('aria-valuenow', value);

        // 关联 label
        labelEl.setAttribute('for', slider.id);

        const valueDisplay = document.createElement('div');
        valueDisplay.style.textAlign = 'center';
        valueDisplay.style.marginTop = '8px';
        valueDisplay.style.fontSize = '16px';
        valueDisplay.innerHTML = `值: <span class="slider-value">${value}</span>`;

        // 添加 aria-live 以便屏幕阅读器公告值变化
        valueDisplay.setAttribute('aria-live', 'polite');
        valueDisplay.setAttribute('aria-atomic', 'true');

        slider.addEventListener('input', (e) => {
            const newValue = e.target.value;
            valueDisplay.querySelector('.slider-value').textContent = newValue;
            slider.setAttribute('aria-valuenow', newValue);
            onChange(newValue);

            // 公告给屏幕阅读器（使用防抖避免过于频繁）
            if (window.A11y && !this._announceTimeout) {
                this._announceTimeout = setTimeout(() => {
                    window.A11y.announce(`${label}: ${newValue}`);
                    this._announceTimeout = null;
                }, 300);
            }
        });

        container.appendChild(labelEl);
        container.appendChild(slider);
        container.appendChild(valueDisplay);

        return container;
    }
};

// ================================
// 控制面板组件
// ================================

const ControlPanel = {
    panels: new Map(),

    /**
     * 创建控制面板
     * @param {Object} options - 面板配置
     * @param {string} options.id - 面板ID
     * @param {string} options.title - 面板标题
     * @param {Array} options.controls - 控件数组
     * @returns {HTMLElement}
     */
    create({ id = 'control-panel', title = '控制面板', controls = [] }) {
        const panel = document.createElement('aside');
        panel.id = id;
        panel.className = 'control-panel';

        const titleEl = document.createElement('h2');
        titleEl.textContent = title;
        titleEl.style.fontSize = 'var(--font-size-large)';
        titleEl.style.marginBottom = '16px';

        panel.appendChild(titleEl);

        controls.forEach(control => {
            panel.appendChild(control);
        });

        this.panels.set(id, panel);
        return panel;
    },

    /**
     * 切换面板显示/隐藏
     * @param {string} id - 面板ID
     */
    toggle(id) {
        const panel = this.panels.get(id);
        if (panel) {
            panel.classList.toggle('active');
        }
    }
};

// ================================
// 侧边栏组件
// ================================

const Sidebar = {
    sidebars: new Map(),

    /**
     * 创建侧边栏
     * @param {Object} options - 侧边栏配置
     * @param {string} options.id - 侧边栏ID
     * @param {string} options.title - 标题
     * @param {Array} options.objectives - 学习目标数组
     * @returns {HTMLElement}
     */
    create({ id = 'sidebar', title = '学习目标', objectives = [] }) {
        const sidebar = document.createElement('aside');
        sidebar.id = id;
        sidebar.className = 'sidebar';

        const titleEl = document.createElement('h2');
        titleEl.textContent = title;
        titleEl.style.fontSize = 'var(--font-size-large)';
        titleEl.style.marginBottom = '16px';

        sidebar.appendChild(titleEl);

        if (objectives.length > 0) {
            const ul = document.createElement('ul');
            ul.style.listStyle = 'none';

            objectives.forEach((obj, index) => {
                const li = document.createElement('li');
                li.style.marginBottom = '12px';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `obj-${index}`;
                checkbox.style.width = '20px';
                checkbox.style.height = '20px';

                const label = document.createElement('label');
                label.htmlFor = `obj-${index}`;
                label.textContent = obj;
                label.style.marginLeft = '8px';

                li.appendChild(checkbox);
                li.appendChild(label);
                ul.appendChild(li);
            });

            sidebar.appendChild(ul);
        }

        this.sidebars.set(id, sidebar);
        return sidebar;
    },

    /**
     * 切换侧边栏显示/隐藏
     * @param {string} id - 侧边栏ID
     */
    toggle(id) {
        const sidebar = this.sidebars.get(id);
        if (sidebar) {
            sidebar.classList.toggle('active');
        }
    }
};

// ================================
// 简单/完整模式切换
// ================================

const ModeSwitcher = {
    currentMode: 'simple', // simple | full

    /**
     * 切换模式
     */
    toggle() {
        this.currentMode = this.currentMode === 'simple' ? 'full' : 'simple';
        document.body.classList.toggle('mode-simple', this.currentMode === 'simple');
        document.body.classList.toggle('mode-full', this.currentMode === 'full');

        // 保存到 LocalStorage
        localStorage.setItem('aetherviz_mode', this.currentMode);

        return this.currentMode;
    },

    /**
     * 设置模式
     * @param {string} mode - 模式名称
     */
    setMode(mode) {
        this.currentMode = mode;
        document.body.classList.toggle('mode-simple', mode === 'simple');
        document.body.classList.toggle('mode-full', mode === 'full');
        localStorage.setItem('aetherviz_mode', mode);
    },

    /**
     * 获取当前模式
     */
    getMode() {
        return this.currentMode;
    }
};

// ================================
// 重置按钮组件
// ================================

const ResetButton = {
    /**
     * 创建重置按钮
     * @param {Function} onReset - 重置回调
     * @returns {HTMLElement}
     */
    create(onReset = () => {}) {
        return KidButton.create({
            text: '重置场景',
            icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
            </svg>`,
            color: 'warning',
            onClick: () => {
                if (confirm('确定要重置场景吗？')) {
                    onReset();
                    // 添加重置动画
                    document.body.style.animation = 'none';
                    setTimeout(() => {
                        document.body.style.animation = 'fadeIn 0.5s ease';
                    }, 10);
                }
            }
        });
    }
};

// ================================
// 可折叠小测验面板
// ================================

const QuizPanel = {
    panel: null,
    floatingButton: null,
    isExpanded: true,

    /**
     * 创建小测验面板
     * @param {Object} options - 面板配置
     * @param {Array} options.questions - 问题数组
     * @param {Function} options.onComplete - 完成回调
     * @returns {HTMLElement}
     */
    create({ questions = [], onComplete = () => {} }) {
        // 面板容器
        const panel = document.createElement('div');
        panel.id = 'quiz-panel';
        panel.className = 'quiz-panel';
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
            transition: all 0.3s ease;
            overflow: hidden;
        `;

        // 面板头部
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        `;

        const title = document.createElement('h3');
        title.textContent = '小测验';
        title.style.fontSize = '20px';
        title.style.margin = '0';

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            width: 32px;
            height: 32px;
            border: none;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
        `;
        closeBtn.onclick = () => this.collapse();

        header.appendChild(title);
        header.appendChild(closeBtn);

        // 面板内容
        const content = document.createElement('div');
        content.className = 'quiz-content';
        content.style.maxHeight = '300px';
        content.style.overflowY = 'auto';

        // 添加问题
        if (questions.length > 0) {
            questions.forEach((q, index) => {
                const qEl = this.createQuestion(q, index);
                content.appendChild(qEl);
            });
        }

        panel.appendChild(header);
        panel.appendChild(content);

        // 悬浮按钮（收起时显示）
        const floatingBtn = document.createElement('button');
        floatingBtn.id = 'quiz-floating-btn';
        floatingBtn.className = 'quiz-floating-btn breathe';
        floatingBtn.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: var(--primary-gradient);
            border: none;
            color: white;
            cursor: pointer;
            z-index: 94;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
        floatingBtn.innerHTML = '❓';
        floatingBtn.onclick = () => this.expand();

        this.panel = panel;
        this.floatingButton = floatingBtn;

        return panel;
    },

    /**
     * 创建问题元素
     */
    createQuestion(question, index) {
        const container = document.createElement('div');
        container.style.marginBottom = '16px';

        const qText = document.createElement('p');
        qText.textContent = `${index + 1}. ${question.question}`;
        qText.style.marginBottom = '8px';
        qText.style.fontSize = '16px';

        container.appendChild(qText);

        if (question.options) {
            question.options.forEach((option, optIndex) => {
                const btn = document.createElement('button');
                btn.className = 'btn-kid';
                btn.style.cssText = `
                    width: 100%;
                    margin-bottom: 8px;
                    min-height: 50px;
                    font-size: 16px;
                `;
                btn.textContent = option;
                btn.onclick = () => {
                    if (optIndex === question.correct) {
                        btn.style.background = 'var(--success)';
                        // 庆祝动画
                        this.showCelebration();
                    } else {
                        btn.style.background = 'var(--error)';
                        // 摇晃动画
                        btn.style.animation = 'shake 0.5s ease';
                    }
                };
                container.appendChild(btn);
            });
        }

        return container;
    },

    /**
     * 折叠面板
     */
    collapse() {
        if (this.panel) {
            this.panel.style.display = 'none';
        }
        if (this.floatingButton) {
            this.floatingButton.style.display = 'flex';
        }
        this.isExpanded = false;
    },

    /**
     * 展开面板
     */
    expand() {
        if (this.panel) {
            this.panel.style.display = 'block';
        }
        if (this.floatingButton) {
            this.floatingButton.style.display = 'none';
        }
        this.isExpanded = true;
    },

    /**
     * 显示庆祝动画
     */
    showCelebration() {
        // 简单的星星效果
        const stars = document.createElement('div');
        stars.innerHTML = '⭐⭐⭐';
        stars.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 48px;
            z-index: 1000;
            animation: celebrate 1s ease forwards;
        `;
        document.body.appendChild(stars);

        setTimeout(() => {
            stars.remove();
        }, 1000);
    }
};

// ================================
// 动画效果
// ================================

const Animations = {
    /**
     * 添加CSS动画
     */
    init() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                75% { transform: translateX(10px); }
            }

            @keyframes celebrate {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
            }

            .mode-simple .advanced-controls {
                display: none;
            }

            .mode-full .advanced-controls {
                display: block;
            }
        `;
        document.head.appendChild(style);
    }
};

// ================================
// 导出所有组件
// ================================

window.KidUI = {
    KidButton,
    KidSlider,
    ControlPanel,
    Sidebar,
    ModeSwitcher,
    ResetButton,
    QuizPanel,
    Animations
};

// 初始化动画
Animations.init();
