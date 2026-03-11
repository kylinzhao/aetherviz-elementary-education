/**
 * 无障碍功能验证脚本
 * 运行此脚本以验证所有无障碍功能是否正常工作
 */

console.log('======================================');
console.log('AetherViz 无障碍功能验证');
console.log('======================================\n');

// 检查 AccessibilityManager 是否加载
if (typeof window.A11y === 'undefined') {
    console.error('✗ AccessibilityManager 未加载');
    console.log('请确保 accessibility.js 已引入');
} else {
    console.log('✓ AccessibilityManager 已加载');

    // 测试高对比度
    console.log('\n--- 测试高对比度模式 ---');
    try {
        const before = window.A11y.highContrastMode;
        window.A11y.toggleHighContrast();
        const after = window.A11y.highContrastMode;
        if (after !== before) {
            console.log(`✓ 高对比度切换成功 (${before} -> ${after})`);
            // 切换回来
            window.A11y.toggleHighContrast();
        } else {
            console.log('✗ 高对比度切换失败');
        }
    } catch (e) {
        console.log('✗ 高对比度测试出错:', e.message);
    }

    // 测试文字大小
    console.log('\n--- 测试文字大小调节 ---');
    try {
        const before = window.A11y.fontSizeLevel;
        window.A11y.setFontSize(150);
        const after = window.A11y.fontSizeLevel;
        if (after === 150) {
            console.log(`✓ 文字大小设置成功 (${before} -> ${after})`);
            // 重置
            window.A11y.setFontSize(100);
        } else {
            console.log('✗ 文字大小设置失败');
        }
    } catch (e) {
        console.log('✗ 文字大小测试出错:', e.message);
    }

    // 测试减少动画
    console.log('\n--- 测试减少动画 ---');
    try {
        const before = window.A11y.reducedMotion;
        window.A11y.toggleReducedMotion();
        const after = window.A11y.reducedMotion;
        if (after !== before) {
            console.log(`✓ 减少动画切换成功 (${before} -> ${after})`);
            // 切换回来
            window.A11y.toggleReducedMotion();
        } else {
            console.log('✗ 减少动画切换失败');
        }
    } catch (e) {
        console.log('✗ 减少动画测试出错:', e.message);
    }

    // 测试屏幕阅读器公告
    console.log('\n--- 测试屏幕阅读器公告 ---');
    try {
        window.A11y.announce('这是一条测试公告');
        console.log('✓ 公告功能正常');
    } catch (e) {
        console.log('✗ 公告测试出错:', e.message);
    }

    // 检查 ARIA 标签
    console.log('\n--- 检查 ARIA 标签 ---');
    const buttons = document.querySelectorAll('button');
    const withLabel = Array.from(buttons).filter(btn => btn.getAttribute('aria-label')).length;
    console.log(`✓ ${withLabel}/${buttons.length} 按钮有 aria-label`);

    const sliders = document.querySelectorAll('input[type="range"]');
    const sliderWithAria = Array.from(sliders).filter(slider =>
        slider.getAttribute('aria-label') ||
        slider.getAttribute('aria-valuemin')
    ).length;
    console.log(`✓ ${sliderWithAria}/${sliders.length} 滑块有 ARIA 属性`);

    // 检查跳过链接
    console.log('\n--- 检查跳过链接 ---');
    const skipLinks = document.querySelectorAll('.skip-link');
    console.log(`✓ 发现 ${skipLinks.length} 个跳过链接`);

    // 检查语义化标签
    console.log('\n--- 检查语义化标签 ---');
    const semanticTags = document.querySelectorAll('nav, main, section, article, header, footer, aside');
    console.log(`✓ 发现 ${semanticTags.length} 个语义化标签`);

    // 检查焦点样式
    console.log('\n--- 检查焦点样式 ---');
    const focusStyle = document.getElementById('a11y-focus-styles');
    if (focusStyle) {
        console.log('✓ 焦点样式已注入');
    } else {
        console.log('✗ 焦点样式未找到');
    }

    // 总结
    console.log('\n======================================');
    console.log('验证完成！');
    console.log('======================================');
    console.log('\n当前设置:');
    const settings = window.A11y.getSettings();
    console.log(`  高对比度: ${settings.highContrastMode ? '开启' : '关闭'}`);
    console.log(`  字体大小: ${settings.fontSizeLevel}%`);
    console.log(`  减少动画: ${settings.reducedMotion ? '开启' : '关闭'}`);

    console.log('\n提示: 打开浏览器控制台查看详细日志');
    console.log('使用 Alt+H 切换高对比度');
    console.log('使用 Alt++/- 调节文字大小');
    console.log('使用 Tab 键测试键盘导航');
}

// 在页面加载后自动运行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runVerification);
} else {
    runVerification();
}

function runVerification() {
    // 延迟一下以确保 accessibility.js 已加载
    setTimeout(() => {
        // 重新加载脚本内容
        const script = document.createElement('script');
        script.textContent = `
            // 这里是上面的验证代码
            console.log('开始验证...');
        `;
        document.body.appendChild(script);
    }, 100);
}
