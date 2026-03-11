/**
 * AetherViz 小学教学 - 语音提示系统
 * 使用 Web Speech API 提供语音引导和提示
 */

const VoiceSystem = {
    synth: null,
    voices: [],
    isSupported: false,
    isEnabled: true,
    settings: {
        rate: 0.8,      // 语速 (0.1 - 10)
        pitch: 1.0,     // 音调 (0 - 2)
        volume: 1.0,    // 音量 (0 - 1)
        voiceIndex: 0   // 选择的语音索引
    },

    /**
     * 初始化语音系统
     */
    init() {
        // 检查浏览器支持
        this.isSupported = 'speechSynthesis' in window;

        if (!this.isSupported) {
            console.warn('当前浏览器不支持 Web Speech API');
            return false;
        }

        this.synth = window.speechSynthesis;

        // 加载可用语音
        this.loadVoices();

        // 监听语音列表变化（某些浏览器异步加载语音）
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this.loadVoices();
        }

        // 从 LocalStorage 加载设置
        this.loadSettings();

        return true;
    },

    /**
     * 加载可用语音列表
     */
    loadVoices() {
        this.voices = this.synth.getVoices();

        // 优先选择中文语音
        const chineseVoice = this.voices.findIndex(voice =>
            voice.lang.includes('zh') || voice.lang.includes('CN')
        );

        if (chineseVoice !== -1) {
            this.settings.voiceIndex = chineseVoice;
        }
    },

    /**
     * 朗读文本
     * @param {string} text - 要朗读的文本
     * @param {Object} options - 选项
     */
    speak(text, options = {}) {
        if (!this.isSupported || !this.isEnabled) {
            return;
        }

        // 取消当前正在播放的语音
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // 应用设置
        utterance.rate = options.rate || this.settings.rate;
        utterance.pitch = options.pitch || this.settings.pitch;
        utterance.volume = options.volume || this.settings.volume;

        // 选择语音
        if (options.voiceIndex !== undefined) {
            utterance.voice = this.voices[options.voiceIndex];
        } else if (this.voices[this.settings.voiceIndex]) {
            utterance.voice = this.voices[this.settings.voiceIndex];
        }

        // 事件监听
        utterance.onstart = () => {
            console.log('🔊 开始朗读:', text);
        };

        utterance.onend = () => {
            console.log('✅ 朗读完成');
        };

        utterance.onerror = (event) => {
            console.error('❌ 语音错误:', event.error);
        };

        this.synth.speak(utterance);
    },

    /**
     * 播放欢迎语音
     */
    playWelcome() {
        // 检查是否首次访问
        const hasVisited = localStorage.getItem('aetherviz_visited');

        if (!hasVisited && this.isEnabled) {
            setTimeout(() => {
                this.speak('欢迎来到 AetherViz 小学教学！让我们一起来学习吧。点击任意元素，我会为你讲解。');
            }, 1000);

            // 标记已访问
            localStorage.setItem('aetherviz_visited', 'true');
        }
    },

    /**
     * 朗读元素
     * @param {HTMLElement} element - 要朗读的元素
     */
    speakElement(element) {
        if (!element) return;

        let text = '';

        // 获取元素的文本内容
        if (element.getAttribute('data-speak')) {
            text = element.getAttribute('data-speak');
        } else if (element.textContent) {
            text = element.textContent.trim();
        } else if (element.alt) {
            text = element.alt;
        } else if (element.title) {
            text = element.title;
        }

        if (text) {
            this.speak(text);
        }
    },

    /**
     * 朗读操作提示
     * @param {string} action - 操作类型
     * @param {*} value - 操作值
     */
    speakAction(action, value) {
        if (!this.isEnabled) return;

        const prompts = {
            slider: (val) => `把数值调整到 ${val}`,
            button: (label) => `点击了 ${label}`,
            success: () => '太棒了！做对了！',
            error: () => '没关系，再试一次',
            reset: () => '场景已重置',
            complete: () => '恭喜你！任务完成了！'
        };

        const prompt = prompts[action];
        if (prompt) {
            this.speak(prompt(value));
        }
    },

    /**
     * 设置语速
     * @param {number} rate - 语速 (0.1 - 10)
     */
    setRate(rate) {
        this.settings.rate = Math.max(0.1, Math.min(10, rate));
        this.saveSettings();
    },

    /**
     * 设置音量
     * @param {number} volume - 音量 (0 - 1)
     */
    setVolume(volume) {
        this.settings.volume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
    },

    /**
     * 设置音调
     * @param {number} pitch - 音调 (0 - 2)
     */
    setPitch(pitch) {
        this.settings.pitch = Math.max(0, Math.min(2, pitch));
        this.saveSettings();
    },

    /**
     * 选择语音
     * @param {number} index - 语音索引
     */
    setVoice(index) {
        if (index >= 0 && index < this.voices.length) {
            this.settings.voiceIndex = index;
            this.saveSettings();
        }
    },

    /**
     * 切换静音状态
     */
    toggleMute() {
        this.isEnabled = !this.isEnabled;
        this.saveSettings();

        if (!this.isEnabled) {
            this.synth.cancel();
        }

        return this.isEnabled;
    },

    /**
     * 保存设置到 LocalStorage
     */
    saveSettings() {
        const settings = {
            isEnabled: this.isEnabled,
            rate: this.settings.rate,
            pitch: this.settings.pitch,
            volume: this.settings.volume,
            voiceIndex: this.settings.voiceIndex
        };

        localStorage.setItem('aetherviz_voice_settings', JSON.stringify(settings));
    },

    /**
     * 从 LocalStorage 加载设置
     */
    loadSettings() {
        const saved = localStorage.getItem('aetherviz_voice_settings');

        if (saved) {
            try {
                const settings = JSON.parse(saved);
                this.isEnabled = settings.isEnabled !== undefined ? settings.isEnabled : true;
                this.settings = { ...this.settings, ...settings };
            } catch (e) {
                console.error('加载语音设置失败:', e);
            }
        }
    },

    /**
     * 停止语音
     */
    stop() {
        if (this.synth) {
            this.synth.cancel();
        }
    },

    /**
     * 暂停语音
     */
    pause() {
        if (this.synth) {
            this.synth.pause();
        }
    },

    /**
     * 恢复语音
     */
    resume() {
        if (this.synth) {
            this.synth.resume();
        }
    },

    /**
     * 获取语音列表
     */
    getVoices() {
        return this.voices.map((voice, index) => ({
            index,
            name: voice.name,
            lang: voice.lang,
            localService: voice.localService
        }));
    }
};

// ================================
// 语音控制面板组件
// ================================

const VoiceControlPanel = {
    /**
     * 创建语音控制面板
     */
    create() {
        if (!VoiceSystem.isSupported) {
            return null;
        }

        const panel = document.createElement('div');
        panel.className = 'voice-control-panel';
        panel.style.cssText = `
            margin-bottom: 24px;
            padding: 16px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            border: 1px solid rgba(20, 184, 166, 0.2);
        `;

        const title = document.createElement('h4');
        title.textContent = '🔊 语音设置';
        title.style.marginBottom = '12px';
        panel.appendChild(title);

        // 静音开关
        const muteContainer = document.createElement('div');
        muteContainer.style.marginBottom = '12px';

        const muteBtn = document.createElement('button');
        muteBtn.className = 'btn-kid';
        muteBtn.innerHTML = VoiceSystem.isEnabled ? '🔊 开启' : '🔇 静音';
        muteBtn.onclick = () => {
            const isEnabled = VoiceSystem.toggleMute();
            muteBtn.innerHTML = isEnabled ? '🔊 开启' : '🔇 静音';
        };

        muteContainer.appendChild(muteBtn);
        panel.appendChild(muteContainer);

        // 语速控制
        const rateContainer = KidSlider.create({
            label: '语速',
            min: 0.1,
            max: 2.0,
            value: VoiceSystem.settings.rate,
            step: 0.1,
            onChange: (value) => {
                VoiceSystem.setRate(parseFloat(value));
            }
        });
        panel.appendChild(rateContainer);

        // 音量控制
        const volumeContainer = KidSlider.create({
            label: '音量',
            min: 0,
            max: 1,
            value: VoiceSystem.settings.volume,
            step: 0.1,
            onChange: (value) => {
                VoiceSystem.setVolume(parseFloat(value));
            }
        });
        panel.appendChild(volumeContainer);

        return panel;
    }
};

// ================================
// 初始化语音系统
// ================================

document.addEventListener('DOMContentLoaded', () => {
    VoiceSystem.init();

    // 为所有带 data-speak 属性的元素添加点击朗读
    document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-speak]');
        if (target) {
            VoiceSystem.speakElement(target);
        }
    });

    // 为滑块添加语音提示
    document.addEventListener('input', (e) => {
        if (e.target.type === 'range') {
            const value = e.target.value;
            VoiceSystem.speakAction('slider', value);
        }
    });

    // 播放欢迎语音
    setTimeout(() => {
        VoiceSystem.playWelcome();
    }, 500);
});

// 导出到全局
window.VoiceSystem = VoiceSystem;
window.VoiceControlPanel = VoiceControlPanel;
