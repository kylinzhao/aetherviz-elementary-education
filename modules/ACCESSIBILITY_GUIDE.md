# 无障碍功能使用指南

## 概述

本项目实现了完整的无障碍功能，符合 WCAG 2.1 AA 标准，确保所有学生（包括有视觉、听觉、运动或认知障碍的学生）都能有效使用教学应用。

## 实现的功能列表

### 1. 键盘导航支持 ✓

**功能描述：**
- 所有交互元素可通过键盘访问和操作
- 清晰的焦点指示器
- 完整的键盘快捷键系统

**实现细节：**
- Tab 键：在可聚焦元素间向前导航
- Shift + Tab：向后导航
- Enter / Space：激活按钮和链接
- 方向键：调节滑块值（上/右增加，下/左减少）
- Home / End：跳到滑块的最小/最大值
- Escape：关闭所有打开的面板

**测试方法：**
1. 断开鼠标
2. 使用 Tab 键遍历页面所有元素
3. 验证焦点指示器清晰可见
4. 使用 Enter/Space 激活按钮
5. 使用方向键调节滑块

### 2. 高对比度模式 ✓

**功能描述：**
- 一键切换高对比度模式
- 黑底白字/黄字，确保最大可读性
- 对比度 ≥ 7:1（超过 WCAG AAA 标准）

**实现细节：**
- 纯黑色背景 (#000000)
- 纯白色文字 (#FFFFFF)
- 黄色强调色 (#FFFF00)
- 移除所有阴影和渐变效果
- 所有边框加粗到 3px

**快捷键：** `Alt + H`

**测试方法：**
1. 打开无障碍设置
2. 切换高对比度模式
3. 验证所有文字清晰可读
4. 验证所有交互元素可见

### 3. 文字大小调节 ✓

**功能描述：**
- 100%-200% 范围内自由调节
- 使用 rem 单位确保整体缩放
- 布局不会被破坏

**实现细节：**
- 基准字体：18px (100%)
- 最大字体：36px (200%)
- 所有尺寸使用 rem/em 单位
- 动态调整根元素 font-size

**快捷键：**
- `Alt + +`：增大文字
- `Alt + -`：减小文字
- `Alt + 0`：重置文字

**测试方法：**
1. 逐步增大文字到 200%
2. 检查所有文字清晰可读
3. 检查没有文字被截断
4. 检查布局没有破坏

### 4. ARIA 标签 ✓

**功能描述：**
- 所有交互元素都有适当的 ARIA 属性
- 动态内容通过 aria-live 公告
- 正确的角色和状态描述

**实现的 ARIA 属性：**
```html
<!-- 导航 -->
<nav role="navigation" aria-label="主导航">

<!-- 主内容 -->
<main role="main">

<!-- 按钮 -->
<button aria-label="打开学习目标面板"
        aria-expanded="false"
        aria-controls="sidebar">

<!-- 滑块 -->
<input type="range"
       aria-label="参数1滑块"
       aria-valuemin="0"
       aria-valuemax="100"
       aria-valuenow="50">

<!-- 动态内容 -->
<div aria-live="polite" aria-atomic="true">
    值: 50
</div>

<!-- 模态框 -->
<aside role="dialog"
       aria-modal="true"
       aria-label="学习目标">
```

**测试方法：**
1. 使用屏幕阅读器（如 NVDA、JAWS）
2. 验证所有按钮有清晰描述
3. 验证滑块值被正确公告
4. 验证动态更新被正确通知

### 5. 语义化 HTML ✓

**功能描述：**
- 使用正确的 HTML5 标签
- 正确的标题层级
- 图片和图标有替代文本

**实现的语义化标签：**
- `<nav>` - 导航区域
- `<main>` - 主内容区域
- `<aside>` - 侧边栏
- `<section>` - 内容分组
- `<article>` - 独立内容
- `<header>` - 页眉
- `<footer>` - 页脚
- `<h1>` - `<h6>` - 标题层级

**示例：**
```html
<body>
  <nav role="navigation" aria-label="主导航">
    <!-- 导航内容 -->
  </nav>

  <main role="main">
    <h1>页面标题</h1>
    <section>
      <h2>区域标题</h2>
      <article>
        <h3>文章标题</h3>
        <p>内容...</p>
      </article>
    </section>
  </main>

  <aside role="complementary" aria-label="学习目标">
    <!-- 侧边栏内容 -->
  </aside>
</body>
```

**测试方法：**
1. 使用 HTML 验证器检查
2. 检查标题层级正确
3. 检查 landmark 区域

### 6. 减少动画模式 ✓

**功能描述：**
- 为前庭障碍用户提供的选项
- 禁用所有非必要动画
- 符合 `prefers-reduced-motion` 媒体查询

**实现细节：**
- 动画时长设为 0.01ms
- 过渡效果禁用
- 呼吸动画禁用
- 滚动行为改为即时

**快捷键：** `Alt + R`

**测试方法：**
1. 启用减少动画
2. 验证所有动画停止
3. 验证功能仍然正常

### 7. 跳过导航链接 ✓

**功能描述：**
- 允许键盘用户跳过重复内容
- 快速访问主要区域

**提供的跳过链接：**
- 跳到主内容
- 跳到学习目标
- 跳到控制面板

**测试方法：**
1. 使用 Tab 键导航
2. 第一个焦点应该是跳过链接
3. 激活后应该跳转到相应区域

### 8. 屏幕阅读器支持 ✓

**功能描述：**
- 专门的公告区域
- 所有状态变化都被公告
- 支持 NVDA、JAWS、VoiceOver

**公告内容示例：**
- "学习目标面板已打开"
- "控制面板已关闭"
- "值: 75"
- "高对比度模式已开启"

**测试方法：**
1. 开启屏幕阅读器
2. 操作各种控件
3. 验证所有反馈都被正确朗读

### 9. 焦点管理 ✓

**功能描述：**
- 清晰的焦点指示器
- 焦点陷阱（模态框）
- 焦点返回机制

**焦点样式：**
```css
:focus {
    outline: 3px solid #22D3EE;
    outline-offset: 2px;
    box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.3);
}
```

**测试方法：**
1. 使用 Tab 键导航
2. 验证焦点始终可见
3. 打开模态框后验证焦点陷阱

## 键盘快捷键完整列表

| 快捷键 | 功能 |
|--------|------|
| `Tab` | 下一个可聚焦元素 |
| `Shift + Tab` | 上一个可聚焦元素 |
| `Enter` / `Space` | 激活按钮/链接 |
| `Escape` | 关闭面板/模态框 |
| `方向键` | 调节滑块 |
| `Home` | 滑块到最小值 |
| `End` | 滑块到最大值 |
| `Alt + H` | 切换高对比度 |
| `Alt + +` | 增大文字 |
| `Alt + -` | 减小文字 |
| `Alt + 0` | 重置文字大小 |
| `Alt + R` | 切换减少动画 |

## 在课程页面中使用

### 方法 1：使用基础模板

基础模板（`base-template.html`）已经包含了所有无障碍功能：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <!-- 包含无障碍模块 -->
    <script src="../modules/accessibility.js"></script>
</head>
<body>
    <!-- 模板已包含跳过链接、ARIA 属性等 -->
</body>
</html>
```

### 方法 2：在现有页面中添加

对于已存在的课程页面，只需添加：

```html
<!-- 在 <head> 中 -->
<script src="../modules/accessibility.js"></script>

<!-- 在导航栏中添加无障碍按钮 -->
<button onclick="toggleAccessibility()" aria-label="打开无障碍设置">
    无障碍
</button>

<!-- 在脚本中添加切换函数 -->
<script>
function toggleAccessibility() {
    let panel = document.getElementById('a11y-panel');
    if (!panel) {
        panel = window.A11y.createAccessibilityPanel();
        document.body.appendChild(panel);
    }
    panel.classList.toggle('active');
}
</script>
```

### 方法 3：手动启用特定功能

```javascript
// 只启用高对比度
window.A11y.enableHighContrast();

// 只设置字体大小
window.A11y.setFontSize(150);

// 只启用减少动画
window.A11y.enableReducedMotion();

// 公告消息给屏幕阅读器
window.A11y.announce('欢迎来到认识正方形课程');
```

## 为组件添加 ARIA 属性

### 按钮

```html
<!-- 图标按钮必须有 aria-label -->
<button aria-label="关闭面板">
    <svg>...</svg>
</button>

<!-- 切换按钮 -->
<button aria-label="打开侧边栏"
        aria-expanded="false"
        aria-controls="sidebar">
    菜单
</button>
```

### 滑块

```html
<label for="size-slider">大小</label>
<input type="range"
       id="size-slider"
       min="0"
       max="100"
       value="50"
       aria-label="大小滑块"
       aria-valuemin="0"
       aria-valuemax="100"
       aria-valuenow="50">
<div aria-live="polite">值: 50</div>
```

### 动态内容

```html
<!-- 状态变化时需要公告 -->
<div id="status" aria-live="polite" aria-atomic="true">
    准备就绪
</div>

<script>
// 更新时自动公告
document.getElementById('status').textContent = '加载完成';
</script>
```

## 测试检查清单

### 自动化测试

1. **使用 axe DevTools**
   - 安装 Chrome 扩展
   - 运行自动扫描
   - 修复所有 critical 和 serious 问题

2. **使用 WAVE 工具**
   - 安装 WAVE 浏览器扩展
   - 检查所有页面
   - 修复所有错误

### 手动测试

- [ ] 所有功能可仅用键盘完成
- [ ] 焦点指示器始终可见
- [ ] Tab 顺序符合逻辑
- [ ] 所有图片有 alt 文本
- [ ] 表单控件有关联的 label
- [ ] 颜色不是唯一的信息传递方式
- [ ] 文字对比度 ≥ 4.5:1
- [ ] 链接文本有意义（不是"点击这里"）
- [ ] 页面标题描述页面内容
- [ ] 使用屏幕阅读器测试

### 屏幕阅读器测试

**Windows: NVDA (免费)**
1. 下载安装 NVDA
2. 使用 Ctrl + Alt + N 启动
3. 测试所有交互

**Mac: VoiceOver (内置)**
1. 按 Command + F5 启动
2. 使用 VO 键导航
3. 测试所有交互

## WCAG 2.1 合规性

### 感知性 (Perceivable)
- ✓ 替代文本：所有非文本内容有替代
- ✓ 时基媒体：多媒体有替代
- ✓ 适应性：内容可以不同方式呈现
- ✓ 可视性：对比度、可调整大小、可听清

### 可操作性 (Operable)
- ✓ 键盘可访问：所有功能可用键盘
- ✓ 足够时间：用户有足够时间响应
- ✓ 癫痫和身体反应：无闪烁内容
- ✓ 可导航性：可导航、查找

### 可理解性 (Understandable)
- ✓ 可读性：文本可读可理解
- ✓ 可预测性：界面可预测
- ✓ 输入协助：帮助避免和纠正错误

### 健壮性 (Robust)
- ✓ 兼容性：最大化与当前和未来用户代理的兼容性

## 浏览器兼容性

| 浏览器 | 版本 | 支持状态 |
|--------|------|----------|
| Chrome | 90+ | ✓ 完全支持 |
| Firefox | 88+ | ✓ 完全支持 |
| Safari | 14+ | ✓ 完全支持 |
| Edge | 90+ | ✓ 完全支持 |
| IE 11 | - | ✗ 不支持 |

## 已知限制

1. **IE 11 不支持**
   - 使用了 ES6+ 语法
   - 建议用户升级到现代浏览器

2. **某些动画可能不完全禁用**
   - Three.js 场景动画需要手动处理
   - 建议在代码中检查 `reducedMotion` 设置

3. **复杂组件的自定义键盘处理**
   - 某些自定义组件需要额外实现键盘支持
   - 参考本文档中的示例

## 维护指南

### 添加新功能时

1. 确保可键盘访问
2. 添加适当的 ARIA 属性
3. 提供足够的颜色对比度
4. 测试屏幕阅读器兼容性

### 修改现有功能时

1. 保持键盘导航不变
2. 不破坏已有的 ARIA 属性
3. 测试所有无障碍功能

### 代码审查检查项

- [ ] 新增按钮有 aria-label
- [ ] 新增滑块有 aria-valuenow
- [ ] 动态内容有 aria-live
- [ ] 新增图片有 alt 文本
- [ ] 颜色对比度 ≥ 4.5:1

## 技术支持

如有问题或建议，请：
1. 查看本文档
2. 运行测试页面 `accessibility-test.html`
3. 使用浏览器开发者工具检查
4. 参考WCAG 2.1指南：https://www.w3.org/WAI/WCAG21/quickref/

## 总结

本项目实现了：
- ✓ 完整的键盘导航支持
- ✓ 高对比度模式（对比度 ≥ 7:1）
- ✓ 文字大小调节（100%-200%）
- ✓ 完整的 ARIA 标签系统
- ✓ 语义化 HTML5
- ✓ 减少动画模式
- ✓ 跳过导航链接
- ✓ 屏幕阅读器支持
- ✓ 焦点管理

符合 **WCAG 2.1 AA 标准**，确保所有学生都能有效使用教学应用。
