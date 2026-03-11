/**
 * AetherViz 小学教学 - 无障碍功能管理器
 * 实现 WCAG 2.1 AA 标准的无障碍功能
 */

class AccessibilityManager {
    constructor() {
        this.highContrastMode = false;
        this.fontSizeLevel = 100;
        this.reducedMotion = false;
        this.screenReaderMode = false;
        this.keyboardShortcuts = new Map();

        this.init();
    }

    /**
     * 初始化无障碍功能
     */
    init() {
        this.loadSettings();
        this.initKeyboardNavigation();
        this.initFocusIndicators();
        this.initSkipLinks();
        this.initAnnouncer();
        this.applySavedSettings();
    }

    /**
     * 从 localStorage 加载设置
     */
    loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('a11y_settings') || '{}');
            this.highContrastMode = settings.highContrast || false;
            this.fontSizeLevel = settings.fontSize || 100;
            this.reducedMotion = settings.reducedMotion || false;
        } catch (e) {
            console.warn('Failed to load accessibility settings:', e);
        }
    }

    /**
     * 保存设置到 localStorage
     */
    saveSettings() {
        try {
            localStorage.setItem('a11y_settings', JSON.stringify({
                highContrast: this.highContrastMode,
                fontSize: this.fontSizeLevel,
                reducedMotion: this.reducedMotion
            }));
        } catch (e) {
            console.warn('Failed to save accessibility settings:', e);
        }
    }

    /**
     * 应用保存的设置
     */
    applySavedSettings() {
        if (this.highContrastMode) {
            this.enableHighContrast();
        }
        if (this.fontSizeLevel !== 100) {
            this.setFontSize(this.fontSizeLevel);
        }
        if (this.reducedMotion) {
            this.enableReducedMotion();
        }
    }

    // ===========================
    // 高对比度模式
    // ===========================

    /**
     * 切换高对比度模式
     */
    toggleHighContrast() {
        this.highContrastMode = !this.highContrastMode;
        if (this.highContrastMode) {
            this.enableHighContrast();
        } else {
            this.disableHighContrast();
        }
        this.saveSettings();
        this.announce(this.highContrastMode ? '高对比度模式已开启' : '高对比度模式已关闭');
        return this.highContrastMode;
    }

    /**
     * 启用高对比度模式
     */
    enableHighContrast() {
        document.body.classList.add('high-contrast');

        // 动态添加高对比度样式
        if (!document.getElementById('a11y-high-contrast-styles')) {
            const style = document.createElement('style');
            style.id = 'a11y-high-contrast-styles';
            style.textContent = `
                body.high-contrast {
                    --bg-gradient: #000000 !important;
                    --text-primary: #FFFFFF !important;
                    --text-secondary: #FFFF00 !important;
                    --glass-bg: rgba(0, 0, 0, 0.9) !important;
                    --glass-border: #FFFFFF !important;
                }

                body.high-contrast .navbar,
                body.high-contrast .sidebar,
                body.high-contrast .control-panel {
                    background: #000000 !important;
                    border: 2px solid #FFFFFF !important;
                }

                body.high-contrast .btn-kid {
                    background: #000000 !important;
                    border: 3px solid #FFFF00 !important;
                    color: #FFFF00 !important;
                }

                body.high-contrast .btn-kid:hover,
                body.high-contrast .btn-kid:focus {
                    background: #FFFF00 !important;
                    color: #000000 !important;
                }

                body.high-contrast .course-card {
                    background: #000000 !important;
                    border: 3px solid #FFFFFF !important;
                }

                body.high-contrast .course-card:hover,
                body.high-contrast .course-card:focus {
                    border-color: #FFFF00 !important;
                    outline: 3px solid #FFFF00 !important;
                }

                body.high-contrast input[type="range"].kid-slider {
                    background: #FFFFFF !important;
                }

                body.high-contrast input[type="range"].kid-slider::-webkit-slider-thumb {
                    background: #FFFF00 !important;
                    border: 3px solid #000000 !important;
                }

                body.high-contrast input[type="checkbox"] {
                    appearance: none;
                    width: 24px;
                    height: 24px;
                    border: 3px solid #FFFFFF !important;
                    background: #000000 !important;
                }

                body.high-contrast input[type="checkbox"]:checked {
                    background: #FFFF00 !important;
                }

                /* 确保文字对比度 */
                body.high-contrast * {
                    text-shadow: none !important;
                    box-shadow: none !important;
                }

                /* 强制焦点可见 */
                body.high-contrast *:focus {
                    outline: 3px solid #FFFF00 !important;
                    outline-offset: 2px !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * 禁用高对比度模式
     */
    disableHighContrast() {
        document.body.classList.remove('high-contrast');
    }

    // ===========================
    // 文字大小调节
    // ===========================

    /**
     * 设置文字大小
     * @param {number} level - 文字大小百分比 (100-200)
     */
    setFontSize(level) {
        this.fontSizeLevel = Math.max(100, Math.min(200, level));
        document.documentElement.style.fontSize = `${this.fontSizeLevel}%`;
        this.saveSettings();
        this.announce(`文字大小设置为 ${this.fontSizeLevel}%`);
        return this.fontSizeLevel;
    }

    /**
     * 增加文字大小
     */
    increaseFontSize() {
        return this.setFontSize(this.fontSizeLevel + 10);
    }

    /**
     * 减少文字大小
     */
    decreaseFontSize() {
        return this.setFontSize(this.fontSizeLevel - 10);
    }

    /**
     * 重置文字大小
     */
    resetFontSize() {
        return this.setFontSize(100);
    }

    // ===========================
    // 键盘导航
    // ===========================

    /**
     * 初始化键盘导航
     */
    initKeyboardNavigation() {
        // 全局键盘事件监听
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // 为所有交互元素添加键盘支持
        this.enhanceKeyboardSupport();

        // 添加焦点陷阱（用于模态框）
        this.initFocusTrap();
    }

    /**
     * 处理键盘按键
     */
    handleKeyPress(e) {
        // Escape - 关闭面板/模态框
        if (e.key === 'Escape') {
            this.closeActivePanels();
        }

        // Alt + H - 切换高对比度
        if (e.altKey && e.key === 'h') {
            e.preventDefault();
            this.toggleHighContrast();
        }

        // Alt + + - 增加文字大小
        if (e.altKey && (e.key === '=' || e.key === '+')) {
            e.preventDefault();
            this.increaseFontSize();
        }

        // Alt + - - 减少文字大小
        if (e.altKey && e.key === '-') {
            e.preventDefault();
            this.decreaseFontSize();
        }

        // Alt + 0 - 重置文字大小
        if (e.altKey && e.key === '0') {
            e.preventDefault();
            this.resetFontSize();
        }

        // Alt + R - 切换减少动画
        if (e.altKey && e.key === 'r') {
            e.preventDefault();
            this.toggleReducedMotion();
        }
    }

    /**
     * 增强键盘支持
     */
    enhanceKeyboardSupport() {
        // 为所有按钮添加 Enter/Space 支持
        document.querySelectorAll('button, [role="button"]').forEach(btn => {
            if (!btn.hasAttribute('tabindex')) {
                btn.setAttribute('tabindex', '0');
            }
        });

        // 为滑块添加方向键支持
        document.querySelectorAll('input[type="range"]').forEach(slider => {
            slider.addEventListener('keydown', (e) => {
                const min = parseFloat(slider.min);
                const max = parseFloat(slider.max);
                const step = parseFloat(slider.step) || 1;
                let value = parseFloat(slider.value);

                switch(e.key) {
                    case 'ArrowLeft':
                    case 'ArrowDown':
                        e.preventDefault();
                        slider.value = Math.max(min, value - step);
                        slider.dispatchEvent(new Event('input', { bubbles: true }));
                        this.announce(`值: ${slider.value}`);
                        break;
                    case 'ArrowRight':
                    case 'ArrowUp':
                        e.preventDefault();
                        slider.value = Math.min(max, value + step);
                        slider.dispatchEvent(new Event('input', { bubbles: true }));
                        this.announce(`值: ${slider.value}`);
                        break;
                    case 'Home':
                        e.preventDefault();
                        slider.value = min;
                        slider.dispatchEvent(new Event('input', { bubbles: true }));
                        this.announce(`值: ${min}`);
                        break;
                    case 'End':
                        e.preventDefault();
                        slider.value = max;
                        slider.dispatchEvent(new Event('input', { bubbles: true }));
                        this.announce(`值: ${max}`);
                        break;
                }
            });
        });

        // 为自定义交互元素添加键盘支持
        document.querySelectorAll('[data-interactive]').forEach(el => {
            if (!el.hasAttribute('tabindex')) {
                el.setAttribute('tabindex', '0');
            }

            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    el.click();
                }
            });
        });
    }

    /**
     * 初始化焦点陷阱（用于模态框）
     */
    initFocusTrap() {
        // 为所有模态框添加焦点陷阱
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.classList && node.classList.contains('modal')) {
                        this.trapFocus(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * 焦点陷阱
     */
    trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });

        // 聚焦到第一个元素
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }

    /**
     * 关闭活动面板
     */
    closeActivePanels() {
        // 关闭侧边栏
        document.querySelectorAll('.sidebar.active').forEach(sidebar => {
            sidebar.classList.remove('active');
        });

        // 关闭控制面板
        document.querySelectorAll('.control-panel.active').forEach(panel => {
            panel.classList.remove('active');
        });

        // 关闭模态框
        document.querySelectorAll('.modal.show').forEach(modal => {
            modal.classList.remove('show');
        });

        this.announce('面板已关闭');
    }

    // ===========================
    // 焦点指示器
    // ===========================

    /**
     * 初始化焦点指示器
     */
    initFocusIndicators() {
        // 添加焦点样式
        if (!document.getElementById('a11y-focus-styles')) {
            const style = document.createElement('style');
            style.id = 'a11y-focus-styles';
            style.textContent = `
                /* 强制焦点可见 */
                *:focus {
                    outline: 3px solid #22D3EE !important;
                    outline-offset: 2px !important;
                }

                /* 移除默认样式，使用自定义焦点 */
                *:focus:not(:focus-visible) {
                    outline: 3px solid #22D3EE !important;
                }

                /* 焦点可见时更明显 */
                *:focus-visible {
                    outline: 3px solid #22D3EE !important;
                    outline-offset: 2px !important;
                    box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.3) !important;
                }

                /* 跳过链接默认隐藏 */
                .skip-link {
                    position: absolute;
                    top: -100px;
                    left: 0;
                    background: #000000;
                    color: #FFFFFF;
                    padding: 12px 24px;
                    z-index: 10000;
                    text-decoration: none;
                    font-size: 18px;
                }

                .skip-link:focus {
                    top: 0;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ===========================
    // 跳过链接
    // ===========================

    /**
     * 初始化跳过链接
     */
    initSkipLinks() {
        // 创建跳过链接容器
        let skipLinksContainer = document.getElementById('skip-links');
        if (!skipLinksContainer) {
            skipLinksContainer = document.createElement('div');
            skipLinksContainer.id = 'skip-links';
            document.body.insertBefore(skipLinksContainer, document.body.firstChild);
        }

        // 添加主内容跳过链接
        this.addSkipLink('跳到主内容', '#main-content');

        // 添加导航跳过链接
        this.addSkipLink('跳到导航', '.navbar');

        // 添加控制面板跳过链接
        this.addSkipLink('跳到控制', '#controls');
    }

    /**
     * 添加跳过链接
     */
    addSkipLink(text, target) {
        const container = document.getElementById('skip-links');
        if (!container) return;

        const link = document.createElement('a');
        link.href = target;
        link.className = 'skip-link';
        link.textContent = text;
        container.appendChild(link);
    }

    // ===========================
    // 屏幕阅读器公告
    // ===========================

    /**
     * 初始化公告区域
     */
    initAnnouncer() {
        if (!document.getElementById('a11y-announcer')) {
            const announcer = document.createElement('div');
            announcer.id = 'a11y-announcer';
            announcer.setAttribute('role', 'status');
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.style.cssText = `
                position: absolute;
                left: -10000px;
                width: 1px;
                height: 1px;
                overflow: hidden;
            `;
            document.body.appendChild(announcer);
        }
    }

    /**
     * 公告消息给屏幕阅读器
     * @param {string} message - 公告消息
     */
    announce(message) {
        const announcer = document.getElementById('a11y-announcer');
        if (announcer) {
            announcer.textContent = '';
            setTimeout(() => {
                announcer.textContent = message;
            }, 100);
        }
    }

    // ===========================
    // 减少动画
    // ===========================

    /**
     * 切换减少动画模式
     */
    toggleReducedMotion() {
        this.reducedMotion = !this.reducedMotion;
        if (this.reducedMotion) {
            this.enableReducedMotion();
        } else {
            this.disableReducedMotion();
        }
        this.saveSettings();
        this.announce(this.reducedMotion ? '减少动画已开启' : '减少动画已关闭');
        return this.reducedMotion;
    }

    /**
     * 启用减少动画
     */
    enableReducedMotion() {
        document.documentElement.setAttribute('data-reduced-motion', 'true');

        if (!document.getElementById('a11y-reduced-motion-styles')) {
            const style = document.createElement('style');
            style.id = 'a11y-reduced-motion-styles';
            style.textContent = `
                [data-reduced-motion] *,
                [data-reduced-motion] *::before,
                [data-reduced-motion] *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }

                [data-reduced-motion] .breathe {
                    animation: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * 禁用减少动画
     */
    disableReducedMotion() {
        document.documentElement.removeAttribute('data-reduced-motion');
    }

    // ===========================
    // ARIA 属性增强
    // ===========================

    /**
     * 为元素添加 ARIA 标签
     */
    addAriaLabels() {
        // 为所有按钮添加标签
        document.querySelectorAll('button').forEach((btn, index) => {
            if (!btn.getAttribute('aria-label') && !btn.textContent.trim()) {
                btn.setAttribute('aria-label', `按钮 ${index + 1}`);
            }
        });

        // 为所有图标按钮添加标签
        document.querySelectorAll('button svg').forEach(icon => {
            const btn = icon.closest('button');
            if (btn && !btn.getAttribute('aria-label')) {
                const iconClass = icon.getAttribute('class') || '';
                let label = '按钮';

                if (iconClass.includes('close') || iconClass.includes('x')) {
                    label = '关闭';
                } else if (iconClass.includes('menu') || iconClass.includes('hamburger')) {
                    label = '菜单';
                } else if (iconClass.includes('settings') || iconClass.includes('gear')) {
                    label = '设置';
                }

                btn.setAttribute('aria-label', label);
            }
        });

        // 为滑块添加标签
        document.querySelectorAll('input[type="range"]').forEach(slider => {
            if (!slider.getAttribute('aria-label')) {
                const label = slider.closest('label')?.textContent || '滑块';
                slider.setAttribute('aria-label', label.trim());
                slider.setAttribute('aria-valuemin', slider.min);
                slider.setAttribute('aria-valuemax', slider.max);
                slider.setAttribute('aria-valuenow', slider.value);
            }
        });

        // 为模态框添加角色
        document.querySelectorAll('.modal, .sidebar, .control-panel').forEach(panel => {
            if (!panel.getAttribute('role')) {
                panel.setAttribute('role', 'dialog');
                panel.setAttribute('aria-modal', 'true');
            }
        });

        // 为动态内容添加 live region
        document.querySelectorAll('[data-dynamic]').forEach(el => {
            if (!el.getAttribute('aria-live')) {
                el.setAttribute('aria-live', 'polite');
            }
        });
    }

    // ===========================
    // 创建无障碍控制面板
    // ===========================

    /**
     * 创建无障碍控制面板
     */
    createAccessibilityPanel() {
        const panel = document.createElement('div');
        panel.id = 'a11y-panel';
        panel.className = 'control-panel';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', '无障碍设置');
        panel.setAttribute('aria-modal', 'true');

        const title = document.createElement('h2');
        title.textContent = '无障碍设置';
        title.style.fontSize = 'var(--font-size-large)';
        title.style.marginBottom = '24px';

        // 高对比度切换
        const highContrastToggle = this.createToggleButton({
            label: '高对比度模式',
            checked: this.highContrastMode,
            onChange: () => this.toggleHighContrast(),
            ariaLabel: '切换高对比度模式'
        });

        // 文字大小控制
        const fontSizeControl = this.createFontSizeControl();

        // 减少动画切换
        const reducedMotionToggle = this.createToggleButton({
            label: '减少动画',
            checked: this.reducedMotion,
            onChange: () => this.toggleReducedMotion(),
            ariaLabel: '切换减少动画'
        });

        // 键盘快捷键说明
        const shortcutsHelp = this.createShortcutsHelp();

        // 关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn-kid';
        closeBtn.textContent = '关闭';
        closeBtn.style.marginTop = '24px';
        closeBtn.setAttribute('aria-label', '关闭无障碍设置');
        closeBtn.onclick = () => {
            panel.classList.remove('active');
            this.announce('无障碍设置已关闭');
        };

        panel.appendChild(title);
        panel.appendChild(highContrastToggle);
        panel.appendChild(fontSizeControl);
        panel.appendChild(reducedMotionToggle);
        panel.appendChild(shortcutsHelp);
        panel.appendChild(closeBtn);

        return panel;
    }

    /**
     * 创建切换按钮
     */
    createToggleButton({ label, checked = false, onChange, ariaLabel }) {
        const container = document.createElement('div');
        container.style.marginBottom = '24px';

        const labelEl = document.createElement('label');
        labelEl.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            font-size: 18px;
            padding: 12px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
        `;

        const labelText = document.createElement('span');
        labelText.textContent = label;

        const toggle = document.createElement('input');
        toggle.type = 'checkbox';
        toggle.checked = checked;
        toggle.setAttribute('aria-label', ariaLabel);
        toggle.style.cssText = `
            width: 48px;
            height: 24px;
            appearance: none;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            position: relative;
            cursor: pointer;
            transition: background 0.3s;
        `;

        const toggleStyle = document.createElement('style');
        toggleStyle.textContent = `
            input[type="checkbox"]::before {
                content: '';
                position: absolute;
                width: 20px;
                height: 20px;
                background: white;
                border-radius: 50%;
                top: 2px;
                left: 2px;
                transition: transform 0.3s;
            }

            input[type="checkbox"]:checked {
                background: var(--success);
            }

            input[type="checkbox"]:checked::before {
                transform: translateX(24px);
            }
        `;
        document.head.appendChild(toggleStyle);

        toggle.addEventListener('change', onChange);

        labelEl.appendChild(labelText);
        labelEl.appendChild(toggle);
        container.appendChild(labelEl);

        return container;
    }

    /**
     * 创建文字大小控制
     */
    createFontSizeControl() {
        const container = document.createElement('div');
        container.style.marginBottom = '24px';
        container.style.padding = '12px';
        container.style.background = 'rgba(255, 255, 255, 0.05)';
        container.style.borderRadius = '8px';

        const label = document.createElement('label');
        label.textContent = `文字大小: ${this.fontSizeLevel}%`;
        label.style.display = 'block';
        label.style.marginBottom = '12px';
        label.style.fontSize = '18px';

        const controls = document.createElement('div');
        controls.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
        `;

        const decreaseBtn = document.createElement('button');
        decreaseBtn.className = 'btn-kid';
        decreaseBtn.textContent = '−';
        decreaseBtn.setAttribute('aria-label', '减少文字大小');
        decreaseBtn.style.cssText = `
            min-width: 44px;
            min-height: 44px;
            font-size: 24px;
        `;
        decreaseBtn.onclick = () => {
            this.decreaseFontSize();
            label.textContent = `文字大小: ${this.fontSizeLevel}%`;
        };

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'kid-slider';
        slider.min = '100';
        slider.max = '200';
        slider.step = '10';
        slider.value = this.fontSizeLevel;
        slider.setAttribute('aria-label', '文字大小滑块');
        slider.style.flex = '1';

        slider.addEventListener('input', (e) => {
            this.setFontSize(parseInt(e.target.value));
            label.textContent = `文字大小: ${this.fontSizeLevel}%`;
        });

        const increaseBtn = document.createElement('button');
        increaseBtn.className = 'btn-kid';
        increaseBtn.textContent = '+';
        increaseBtn.setAttribute('aria-label', '增加文字大小');
        increaseBtn.style.cssText = `
            min-width: 44px;
            min-height: 44px;
            font-size: 24px;
        `;
        increaseBtn.onclick = () => {
            this.increaseFontSize();
            label.textContent = `文字大小: ${this.fontSizeLevel}%`;
        };

        const resetBtn = document.createElement('button');
        resetBtn.className = 'btn-kid';
        resetBtn.textContent = '重置';
        resetBtn.setAttribute('aria-label', '重置文字大小');
        resetBtn.style.marginLeft = '8px';
        resetBtn.onclick = () => {
            this.resetFontSize();
            label.textContent = `文字大小: ${this.fontSizeLevel}%`;
            slider.value = this.fontSizeLevel;
        };

        controls.appendChild(decreaseBtn);
        controls.appendChild(slider);
        controls.appendChild(increaseBtn);
        controls.appendChild(resetBtn);

        container.appendChild(label);
        container.appendChild(controls);

        return container;
    }

    /**
     * 创建键盘快捷键帮助
     */
    createShortcutsHelp() {
        const container = document.createElement('div');
        container.style.padding = '12px';
        container.style.background = 'rgba(255, 255, 255, 0.05)';
        container.style.borderRadius = '8px';
        container.style.marginTop = '16px';

        const title = document.createElement('h3');
        title.textContent = '键盘快捷键';
        title.style.fontSize = '16px';
        title.style.marginBottom = '12px';

        const shortcuts = [
            { keys: 'Alt + H', desc: '切换高对比度' },
            { keys: 'Alt + +', desc: '增加文字大小' },
            { keys: 'Alt + -', desc: '减少文字大小' },
            { keys: 'Alt + 0', desc: '重置文字大小' },
            { keys: 'Alt + R', desc: '切换减少动画' },
            { keys: 'Esc', desc: '关闭面板' },
            { keys: 'Tab', desc: '导航到下一个元素' },
            { keys: 'Shift + Tab', desc: '导航到上一个元素' },
            { keys: 'Enter / Space', desc: '激活按钮' },
            { keys: '方向键', desc: '调节滑块' }
        ];

        const list = document.createElement('dl');
        list.style.cssText = `
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 8px 16px;
            font-size: 14px;
        `;

        shortcuts.forEach(({ keys, desc }) => {
            const dt = document.createElement('dt');
            dt.textContent = keys;
            dt.style.fontFamily = 'monospace';
            dt.style.color = 'var(--accent-cyan)';

            const dd = document.createElement('dd');
            dd.textContent = desc;
            dd.style.margin = '0';

            list.appendChild(dt);
            list.appendChild(dd);
        });

        container.appendChild(title);
        container.appendChild(list);

        return container;
    }

    // ===========================
    // 工具方法
    // ===========================

    /**
     * 检查是否满足对比度要求
     * @param {string} foreground - 前景色
     * @param {string} background - 背景色
     * @returns {number} 对比度比值
     */
    checkContrast(foreground, background) {
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        };

        const luminance = (r, g, b) => {
            const a = [r, g, b].map(v => {
                v /= 255;
                return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
            });
            return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
        };

        const fg = hexToRgb(foreground);
        const bg = hexToRgb(background);

        if (!fg || !bg) return 0;

        const fgLum = luminance(fg.r, fg.g, fg.b);
        const bgLum = luminance(bg.r, bg.g, bg.b);

        const lighter = Math.max(fgLum, bgLum);
        const darker = Math.min(fgLum, bgLum);

        return (lighter + 0.05) / (darker + 0.05);
    }

    /**
     * 获取当前设置
     */
    getSettings() {
        return {
            highContrastMode: this.highContrastMode,
            fontSizeLevel: this.fontSizeLevel,
            reducedMotion: this.reducedMotion
        };
    }

    /**
     * 重置所有设置
     */
    resetAll() {
        this.highContrastMode = false;
        this.fontSizeLevel = 100;
        this.reducedMotion = false;

        document.body.classList.remove('high-contrast');
        document.documentElement.style.fontSize = '100%';
        document.documentElement.removeAttribute('data-reduced-motion');

        this.saveSettings();
        this.announce('所有设置已重置');
    }
}

// ===========================
// 全局实例
// ===========================

window.A11y = new AccessibilityManager();

// 页面加载完成后增强 ARIA 标签
document.addEventListener('DOMContentLoaded', () => {
    window.A11y.addAriaLabels();
});

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityManager;
}
