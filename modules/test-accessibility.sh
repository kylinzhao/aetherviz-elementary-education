#!/bin/bash

# 无障碍功能测试脚本
# 用于验证所有无障碍功能是否正常工作

echo "======================================"
echo "AetherViz 无障碍功能测试"
echo "======================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试计数器
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# 测试函数
run_test() {
    local test_name="$1"
    local test_command="$2"

    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "测试 $TOTAL_TESTS: $test_name ... "

    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ 通过${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}✗ 失败${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

echo "1. 检查文件存在性"
echo "--------------------------------------"

run_test "accessibility.js 存在" "test -f modules/accessibility.js"
run_test "accessibility-test.html 存在" "test -f modules/accessibility-test.html"
run_test "ACCESSIBILITY_GUIDE.md 存在" "test -f modules/ACCESSIBILITY_GUIDE.md"
run_test "base-template.html 已更新" "grep -q 'accessibility.js' templates/base-template.html"
run_test "index.html 已更新" "grep -q 'accessibility.js' index.html"

echo ""
echo "2. 检查无障碍功能实现"
echo "--------------------------------------"

run_test "AccessibilityManager 类存在" "grep -q 'class AccessibilityManager' modules/accessibility.js"
run_test "高对比度模式函数存在" "grep -q 'enableHighContrast' modules/accessibility.js"
run_test "字体大小调节函数存在" "grep -q 'setFontSize' modules/accessibility.js"
run_test "键盘导航初始化存在" "grep -q 'initKeyboardNavigation' modules/accessibility.js"
run_test "ARIA 标签函数存在" "grep -q 'addAriaLabels' modules/accessibility.js"
run_test "减少动画功能存在" "grep -q 'enableReducedMotion' modules/accessibility.js"
run_test "屏幕阅读器公告存在" "grep -q 'announce' modules/accessibility.js"

echo ""
echo "3. 检查模板中的 ARIA 属性"
echo "--------------------------------------"

run_test "base-template 有 role 属性" "grep -q 'role=' templates/base-template.html"
run_test "base-template 有 aria-label" "grep -q 'aria-label' templates/base-template.html"
run_test "base-template 有跳过链接" "grep -q 'skip-link' templates/base-template.html"
run_test "base-template 有 aria-live" "grep -q 'aria-live' templates/base-template.html"
run_test "base-template 有 aria-expanded" "grep -q 'aria-expanded' templates/base-template.html"

echo ""
echo "4. 检查 UI 组件的无障碍支持"
echo "--------------------------------------"

run_test "KidButton 支持 ariaLabel" "grep -q 'ariaLabel' modules/kid-ui-components.js"
run_test "KidSlider 支持 ARIA" "grep -q 'aria-valuemin' modules/kid-ui-components.js"
run_test "组件有屏幕阅读器公告" "grep -q 'window.A11y.announce' modules/kid-ui-components.js"

echo ""
echo "5. 检查键盘快捷键"
echo "--------------------------------------"

run_test "Alt+H 快捷键实现" "grep -q \"Alt.*H.*高对比度\" modules/accessibility.js"
run_test "Alt+R 快捷键实现" "grep -q \"Alt.*R.*减少动画\" modules/accessibility.js"
run_test "Escape 键处理" "grep -q \"key === 'Escape'\" modules/accessibility.js"
run_test "方向键支持" "grep -q \"ArrowLeft.*ArrowRight\" modules/accessibility.js"

echo ""
echo "6. 检查语义化 HTML"
echo "--------------------------------------"

run_test "使用 nav 标签" "grep -q '<nav' index.html"
run_test "使用 main 标签" "grep -q '<main' index.html"
run_test "使用 aside 标签" "grep -q '<aside' index.html"
run_test "使用 article 标签" "grep -q '<article' index.html"
run_test "使用 header 标签" "grep -q '<header' index.html"

echo ""
echo "7. 检查对比度标准"
echo "--------------------------------------"

run_test "高对比度 CSS 存在" "grep -q 'high-contrast' modules/accessibility.js"
run_test "对比度比值 >= 7:1" "grep -q '21:1\|19:1' modules/accessibility.js"

echo ""
echo "8. 检查文档完整性"
echo "--------------------------------------"

run_test "文档有功能列表" "grep -q '实现的功能列表' modules/ACCESSIBILITY_GUIDE.md"
run_test "文档有快捷键说明" "grep -q '键盘快捷键' modules/ACCESSIBILITY_GUIDE.md"
run_test "文档有测试方法" "grep -q '测试方法' modules/ACCESSIBILITY_GUIDE.md"
run_test "文档有 WCAG 合规性" "grep -q 'WCAG' modules/ACCESSIBILITY_GUIDE.md"

echo ""
echo "======================================"
echo "测试总结"
echo "======================================"
echo -e "总测试数: $TOTAL_TESTS"
echo -e "${GREEN}通过: $PASSED_TESTS${NC}"
echo -e "${RED}失败: $FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✓ 所有测试通过！${NC}"
    echo ""
    echo "可以运行以下命令查看测试页面："
    echo "  cd modules"
    echo "  python3 -m http.server 8000"
    echo "  然后访问: http://localhost:8000/accessibility-test.html"
    exit 0
else
    echo -e "${RED}✗ 有 $FAILED_TESTS 个测试失败${NC}"
    echo "请检查上述失败项并修复问题。"
    exit 1
fi
