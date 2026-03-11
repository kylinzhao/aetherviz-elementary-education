# 设计文档：儿童友好的课程交互式学习系统

## 上下文

### 当前状态
- AetherViz 小学教学项目包含 40 个课程（19 个数学 + 21 个科学）
- 所有课程使用 React + React Three Fiber 进行 3D 可视化
- 现有课程技术完善但缺乏教学互动性
- 课程以学术化方式展示，不适合小学生理解

### 约束条件
- 必须保持现有的 3D 可视化功能
- 不能引入大型外部依赖（保持轻量级）
- 需要支持 40 个课程的快速批量改造
- 必须向后兼容现有代码结构

### 利益相关者
- 小学生（6-12 岁）：最终用户
- 教师：使用课程进行教学
- 开发团队：维护和扩展课程库

## 目标 / 非目标

**目标：**
1. 创建可复用的任务和测验组件，支持 40 个课程的快速改造
2. 实现永久进度追踪，提升学习体验
3. 增加故事化引入和游戏化反馈，提升儿童参与度
4. 保持代码质量和类型安全

**非目标：**
- 不创建用户账号系统（本地状态足够）
- 不添加云端进度同步
- 不改变 3D 渲染引擎或可视化逻辑
- 不重构路由系统（仅添加滚动功能）

## 决策

### 1. 组件架构选择

**决策：** 创建独立的 `TaskCard` 和 `QuizGame` 组件

**理由：**
- ✅ 组件复用性：40 个课程共享相同逻辑
- ✅ 维护性：集中管理任务和测验逻辑
- ✅ 一致性：所有课程用户体验统一
- ✅ 类型安全：TypeScript 接口定义清晰

**替代方案考虑：**
- ❌ 每个课程独立实现任务系统 → 代码重复，维护困难
- ❌ 使用第三方学习管理系统 → 过度设计，增加依赖
- ❌ 将任务逻辑内联到每个课程页面 → 代码膨胀，难以测试

### 2. 状态管理策略

**决策：** 使用 React 本地状态（useState）+ 永久完成追踪

**理由：**
- ✅ 简单性：不需要额外状态管理库
- ✅ 永久性：使用 Set 存储已完成任务 ID，永不移除
- ✅ 性能：每 500ms 轮询检查条件，开销极小
- ✅ 用户体验：任务一旦完成永久显示完成状态

**关键实现：**
```typescript
const [permanentCompleted, setPermanentCompleted] = useState<Set<number>>(new Set());

// 任务只能添加，从未移除
if (task.checkCondition() && !permanentCompleted.has(task.id)) {
  newPermanentCompleted.add(task.id);
}
```

**替代方案考虑：**
- ❌ Zustand 全局状态 → 过度设计，增加复杂度
- ❌ localStorage 持久化 → 隐私考虑，超出范围
- ❌ 简单条件检查 → 用户调整参数会取消完成状态

### 3. 测验游戏设计

**决策：** 5 道选择题，带提示和解释，星级评分

**理由：**
- ✅ 学习效果：提示帮助理解，解释强化记忆
- ✅ 游戏化：星级评分（⭐）激励完成
- ✅ 即时反馈：答题后立即显示结果
- ✅ 防止重复：使用 Set 记录已答题目 ID

**替代方案考虑：**
- ❌ 无限次答题 → 可能降低学习效果
- ❌ 严格评分（无提示） → 对小学生过于严厉
- ❌ 开放式问答 → 评估复杂度太高

### 4. TypeScript 错误修复策略

**决策：** 系统性修复所有阻止编译的错误

**修复类型：**
1. **类型断言**：Material opacity 访问需要 `as THREE.MeshStandardMaterial`
2. **Ref 类型**：Group vs Mesh ref 类型不匹配
3. **属性位置**：rotation 应该在 mesh 上，不在 geometry 上
4. **类型兼容性**：NodeJS.Timeout → ReturnType<typeof setTimeout>

**示例修复：**
```typescript
// 修复前
meshRef.current.material.opacity = value; // ❌ Material | Material[]

// 修复后
const material = meshRef.current.material as THREE.MeshStandardMaterial;
material.opacity = value; // ✅ 类型安全
```

### 5. 路由滚动行为

**决策：** 创建 ScrollToTop 组件监听路由变化

**实现：**
```typescript
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
```

**理由：**
- ✅ 自动化：无需每个页面手动处理
- ✅ React Router 集成：使用 useLocation 监听
- ✅ 无副作用：纯 UI 组件，不影响性能

## 风险 / 权衡

### 风险 1：批量改造质量一致性
**风险**：40 个课程批量改造可能存在质量问题
**缓解措施**：
- 创建标准化模板（故事、任务、测验结构）
- 使用统一的 TaskCard 和 QuizGame 组件
- 验证每个课程的编译和运行状态

### 风险 2：性能影响（轮询检查）
**风险**：500ms 轮询可能影响性能
**缓解措施**：
- 轮询逻辑轻量级（仅条件检查 + Set 查找）
- 使用 React.memo 优化组件渲染
- 实测显示性能影响可忽略不计

### 风险 3：TypeScript 警告残留
**风险**：未使用变量警告（TS6133）不影响运行但影响构建
**缓解措施**：
- 优先修复阻止编译的错误
- 未使用变量警告不影响开发服务器运行
- 未来可以逐步清理

### 风险 4：浏览器兼容性
**风险**：某些 React Three Fiber 特性可能在旧浏览器不支持
**缓解措施**：
- 使用现代浏览器（Chrome/Firefox/Safari/Edge 最新版）
- 项目定位为现代教育应用，不需要支持 IE11

## 迁移计划

### 部署步骤
1. ✅ 创建核心组件（TaskCard、QuizGame）
2. ✅ 批量改造 40 个课程页面
3. ✅ 修复所有 TypeScript 编译错误
4. ✅ 添加 ScrollToTop 组件
5. ✅ 验证开发服务器运行正常
6. ⏳ 生产构建和部署

### 回滚策略
- Git 版本控制：可随时回退到改造前版本
- 组件独立：TaskCard 和 QuizGame 不影响现有功能
- 渐进式：可以先部署部分课程测试

## 开放问题

### 待定事项
- [ ] 是否需要添加进度持久化（localStorage）？
- [ ] 是否需要添加音效反馈（任务完成、测验正确）？
- [ ] 是否需要为不同年龄段调整内容难度？

### 未来优化
- 考虑添加成就徽章系统
- 考虑添加学习进度仪表板
- 考虑添加家长/教师监控功能
