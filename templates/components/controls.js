/**
 * 标准控制面板组件
 * 提供统一的滑块、按钮样式和交互
 */

class ControlPanel {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.options = options;
        this.controls = {};
    }

    /**
     * 创建滑块控件
     * @param {string} id - 控件ID
     * @param {string} label - 标签文本
     * @param {object} options - 滑块选项
     */
    createSlider(id, label, options = {}) {
        const {
            min = 0,
            max = 100,
            value = 50,
            step = 1,
            unit = '',
            onChange = null
        } = options;

        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'control-group';
        sliderContainer.innerHTML = `
            <label for="${id}" class="control-label">${label}</label>
            <div class="slider-wrapper">
                <input
                    type="range"
                    id="${id}"
                    class="control-slider"
                    min="${min}"
                    max="${max}"
                    value="${value}"
                    step="${step}"
                    aria-label="${label}"
                >
                <span class="slider-value" id="${id}-value">${value}${unit}</span>
            </div>
        `;

        this.container.appendChild(sliderContainer);

        const slider = sliderContainer.querySelector(`#${id}`);
        const valueDisplay = sliderContainer.querySelector(`#${id}-value`);

        slider.addEventListener('input', (e) => {
            const newValue = parseFloat(e.target.value);
            valueDisplay.textContent = newValue + unit;
            if (onChange) onChange(newValue);
        });

        this.controls[id] = slider;
        return slider;
    }

    /**
     * 创建按钮控件
     * @param {string} id - 控件ID
     * @param {string} text - 按钮文本
     * @param {object} options - 按钮选项
     */
    createButton(id, text, options = {}) {
        const {
            onClick = null,
            className = 'btn-kid',
            icon = ''
        } = options;

        const button = document.createElement('button');
        button.id = id;
        button.className = className;
        button.innerHTML = `${icon}<span>${text}</span>`;
        button.setAttribute('aria-label', text);

        button.addEventListener('click', onClick);

        this.container.appendChild(button);
        this.controls[id] = button;
        return button;
    }

    /**
     * 创建切换按钮组
     * @param {string} id - 组ID
     * @param {array} buttons - 按钮配置数组
     */
    createButtonGroup(id, buttons) {
        const groupContainer = document.createElement('div');
        groupContainer.className = 'button-group';
        groupContainer.id = id;

        buttons.forEach((btnConfig, index) => {
            const button = document.createElement('button');
            button.className = index === 0 ? 'btn-kid active' : 'btn-kid';
            button.innerHTML = btnConfig.icon ? `${btnConfig.icon}${btnConfig.text}` : btnConfig.text;
            button.setAttribute('data-value', btnConfig.value);
            button.setAttribute('aria-label', btnConfig.text);
            button.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');

            button.addEventListener('click', () => {
                // 移除所有按钮的active状态
                groupContainer.querySelectorAll('button').forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                // 激活当前按钮
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
                if (btnConfig.onClick) btnConfig.onClick(btnConfig.value);
            });

            groupContainer.appendChild(button);
        });

        this.container.appendChild(groupContainer);
        return groupContainer;
    }

    /**
     * 创建信息显示区域
     * @param {string} id - 区域ID
     * @param {string} label - 标签
     */
    createInfo(id, label) {
        const infoContainer = document.createElement('div');
        infoContainer.className = 'info-display';
        infoContainer.innerHTML = `
            <div class="info-label">${label}</div>
            <div class="info-value" id="${id}">-</div>
        `;

        this.container.appendChild(infoContainer);
        return document.getElementById(id);
    }

    /**
     * 更新信息显示
     * @param {string} id - 信息区域ID
     * @param {string} value - 要显示的值
     */
    updateInfo(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }

    /**
     * 禁用控件
     * @param {string} id - 控件ID
     */
    disable(id) {
        if (this.controls[id]) {
            this.controls[id].disabled = true;
        }
    }

    /**
     * 启用控件
     * @param {string} id - 控件ID
     */
    enable(id) {
        if (this.controls[id]) {
            this.controls[id].disabled = false;
        }
    }

    /**
     * 获取控件值
     * @param {string} id - 控件ID
     */
    getValue(id) {
        if (this.controls[id]) {
            return this.controls[id].value;
        }
        return null;
    }

    /**
     * 设置控件值
     * @param {string} id - 控件ID
     * @param {any} value - 要设置的值
     */
    setValue(id, value) {
        if (this.controls[id]) {
            this.controls[id].value = value;
            // 触发input事件以更新显示
            this.controls[id].dispatchEvent(new Event('input'));
        }
    }
}
