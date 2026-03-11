/**
 * AetherViz 小学教学 - 主题和动画管理器
 * 包含卡通化视觉元素和主题配色切换
 */

const ThemeManager = {
    currentTheme: 'math',

    themes: {
        math: {
            name: '数学',
            colors: ['#3B82F6', '#F59E0B'], // 蓝色、橙色
            icon: '🔢',
            gradient: 'linear-gradient(135deg, #3B82F6 0%, #0EA5E9 100%)',
            primaryColor: '#3B82F6',
            secondaryColor: '#F59E0B'
        },
        science: {
            name: '科学',
            colors: ['#10B981', '#8B5CF6'], // 绿色、紫色
            icon: '🔬',
            gradient: 'linear-gradient(135deg, #10B981 0%, #22D3EE 100%)',
            primaryColor: '#10B981',
            secondaryColor: '#8B5CF6'
        },
        astronomy: {
            name: '天文',
            colors: ['#1E40AF', '#F59E0B'], // 深蓝、金色
            icon: '🌟',
            gradient: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
            primaryColor: '#1E40AF',
            secondaryColor: '#F59E0B'
        }
    },

    /**
     * 设置主题
     * @param {string} themeName - 主题名称
     */
    setTheme(themeName) {
        if (!this.themes[themeName]) {
            console.warn(`主题 ${themeName} 不存在`);
            return;
        }

        this.currentTheme = themeName;
        const theme = this.themes[themeName];

        // 更新 CSS 变量
        document.documentElement.style.setProperty('--current-primary', theme.primaryColor);
        document.documentElement.style.setProperty('--current-secondary', theme.secondaryColor);
        document.documentElement.style.setProperty('--current-gradient', theme.gradient);

        // 更新主题类
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${themeName}`);

        // 保存到 LocalStorage
        localStorage.setItem('aetherviz_theme', themeName);
    },

    /**
     * 获取当前主题
     */
    getCurrentTheme() {
        return this.themes[this.currentTheme];
    },

    /**
     * 初始化主题
     */
    init() {
        const savedTheme = localStorage.getItem('aetherviz_theme');
        if (savedTheme && this.themes[savedTheme]) {
            this.setTheme(savedTheme);
        } else {
            this.setTheme('math');
        }
    }
};

// ================================
// 卡通动画效果
// ================================

const CartoonAnimations = {
    /**
     * 添加呼吸动画
     * @param {HTMLElement} element - 目标元素
     */
    addBreathe(element) {
        element.style.animation = 'breathe 2s ease-in-out infinite';
    },

    /**
     * 添加摇晃动画（错误提示）
     * @param {HTMLElement} element - 目标元素
     */
    addShake(element) {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'shake 0.5s ease';
        }, 10);
    },

    /**
     * 添加跳跃动画（成功提示）
     * @param {HTMLElement} element - 目标元素
     */
    addJump(element) {
        element.style.animation = 'jump 0.6s ease';
    },

    /**
     * 添加闪烁动画（强调）
     * @param {HTMLElement} element - 目标元素
     */
    addBlink(element) {
        element.style.animation = 'blink 0.8s ease';
    },

    /**
     * 添加旋转动画
     * @param {HTMLElement} element - 目标元素
     */
    addSpin(element) {
        element.style.animation = 'spin 1s ease';
    },

    /**
     * 显示庆祝动画
     */
    showCelebration() {
        // 创建星星容器
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000;
            pointer-events: none;
        `;

        // 创建多个星星
        for (let i = 0; i < 10; i++) {
            const star = document.createElement('div');
            star.textContent = '⭐';
            star.style.cssText = `
                position: absolute;
                font-size: ${20 + Math.random() * 30}px;
                animation: celebrate-star 1s ease forwards;
                animation-delay: ${i * 0.1}s;
                left: ${Math.random() * 200 - 100}px;
                top: ${Math.random() * 200 - 100}px;
            `;
            container.appendChild(star);
        }

        document.body.appendChild(container);

        setTimeout(() => {
            container.remove();
        }, 1500);
    },

    /**
     * 显示彩带动画
     */
    showConfetti() {
        const colors = ['#22D3EE', '#34D399', '#FBBF24', '#FB7185', '#FB923C'];
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
        `;

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            const color = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: ${color};
                left: ${Math.random() * 100}%;
                top: -10px;
                animation: confetti-fall 2s ease forwards;
                animation-delay: ${Math.random() * 0.5}s;
                border-radius: 2px;
            `;
            container.appendChild(confetti);
        }

        document.body.appendChild(container);

        setTimeout(() => {
            container.remove();
        }, 2500);
    },

    /**
     * 初始化所有动画
     */
    init() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes breathe {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                75% { transform: translateX(10px); }
            }

            @keyframes jump {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
            }

            @keyframes blink {
                0%, 50%, 100% { opacity: 1; }
                25%, 75% { opacity: 0.5; }
            }

            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            @keyframes celebrate-star {
                0% {
                    transform: scale(0) rotate(0deg);
                    opacity: 0;
                }
                50% {
                    transform: scale(1.2) rotate(180deg);
                    opacity: 1;
                }
                100% {
                    transform: scale(1) rotate(360deg);
                    opacity: 0;
                }
            }

            @keyframes confetti-fall {
                to {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }

            /* 主题样式 */
            .theme-math {
                --current-primary: #3B82F6;
                --current-secondary: #F59E0B;
            }

            .theme-science {
                --current-primary: #10B981;
                --current-secondary: #8B5CF6;
            }

            .theme-astronomy {
                --current-primary: #1E40AF;
                --current-secondary: #F59E0B;
            }
        `;
        document.head.appendChild(style);
    }
};

// ================================
// 学科吉祥物图标
// ================================

const MascotIcons = {
    math: `
        <svg viewBox="0 0 100 100" width="60" height="60">
            <circle cx="50" cy="50" r="45" fill="#3B82F6"/>
            <text x="50" y="65" font-size="40" text-anchor="middle">🔢</text>
        </svg>
    `,
    science: `
        <svg viewBox="0 0 100 100" width="60" height="60">
            <circle cx="50" cy="50" r="45" fill="#10B981"/>
            <text x="50" y="65" font-size="40" text-anchor="middle">🔬</text>
        </svg>
    `,
    astronomy: `
        <svg viewBox="0 0 100 100" width="60" height="60">
            <circle cx="50" cy="50" r="45" fill="#1E40AF"/>
            <text x="50" y="65" font-size="40" text-anchor="middle">🌟</text>
        </svg>
    `
};

// ================================
// 导出
// ================================

window.ThemeManager = ThemeManager;
window.CartoonAnimations = CartoonAnimations;
window.MascotIcons = MascotIcons;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    CartoonAnimations.init();
    ThemeManager.init();
});
