/**
 * AetherViz 小学教学 - 完整教学内容数据库
 * 包含所有主题的题库、任务和学习目标
 */

const ContentDatabase = {
    // ================================
    // 数学模块内容
    // ================================

    math: {
        // 几何图形
        geometry: {
            id: 'math-geometry',
            title: '认识几何图形',
            grade: '1-2',
            objectives: [
                '认识常见的平面图形（三角形、正方形、长方形、圆形）',
                '知道每种图形的名称和特征',
                '能区分不同的图形'
            ],
            facts: [
                '正方形有 4 条边，4 条边都相等',
                '三角形有 3 条边和 3 个角',
                '圆形没有角，边缘是圆的',
                '长方形有 2 条长边和 2 条短边'
            ],
            quiz: [
                {
                    id: 1,
                    question: '正方形有几条边？',
                    options: ['3 条', '4 条', '5 条'],
                    correct: 1,
                    explanation: '正方形有 4 条边，而且 4 条边都相等。',
                    difficulty: 'easy'
                },
                {
                    id: 2,
                    question: '下面哪个是三角形？',
                    options: ['🔳 正方形', '🔺 三角形', '🔴 圆形'],
                    correct: 1,
                    explanation: '三角形有 3 条边和 3 个角。',
                    difficulty: 'easy'
                },
                {
                    id: 3,
                    question: '圆形有角吗？',
                    options: ['有', '没有'],
                    correct: 1,
                    explanation: '圆形没有角，它的边缘是圆的。',
                    difficulty: 'easy'
                },
                {
                    id: 4,
                    question: '长方形的对边有什么特点？',
                    options: ['相等', '不相等', '一条长一条短'],
                    correct: 0,
                    explanation: '长方形的对边相等，两条长边相等，两条短边相等。',
                    difficulty: 'medium'
                },
                {
                    id: 5,
                    question: '正方形和长方形有什么不同？',
                    options: ['正方形四条边都相等', '长方形四条边都相等', '没有区别'],
                    correct: 0,
                    explanation: '正方形的四条边都相等，长方形只有对边相等。',
                    difficulty: 'medium'
                },
                {
                    id: 6,
                    question: '三角形的三个角加起来是多少度？',
                    options: ['90度', '180度', '360度'],
                    correct: 1,
                    explanation: '三角形的三个内角和永远是 180 度。',
                    difficulty: 'hard'
                },
                {
                    id: 7,
                    question: '哪种图形最容易滚动？',
                    options: ['正方形', '三角形', '圆形'],
                    correct: 2,
                    explanation: '圆形没有角和边，所以最容易滚动。',
                    difficulty: 'easy'
                },
                {
                    id: 8,
                    question: '窗框通常是什么形状？',
                    options: ['圆形', '长方形', '三角形'],
                    correct: 1,
                    explanation: '窗框通常是长方形的。',
                    difficulty: 'easy'
                },
                {
                    id: 9,
                    question: '哪个图形最稳固？',
                    options: ['正方形', '三角形', '圆形'],
                    correct: 1,
                    explanation: '三角形是最稳固的图形，所以桥梁常用三角形结构。',
                    difficulty: 'medium'
                },
                {
                    id: 10,
                    question: '足球是什么形状的？',
                    options: ['正方形', '圆形（从上面看）', '三角形'],
                    correct: 1,
                    explanation: '足球从上面看是圆形的。',
                    difficulty: 'easy'
                }
            ],
            tasks: [
                {
                    id: 'task-geo-1',
                    title: '找出所有的正方形',
                    description: '点击场景中的正方形图形',
                    difficulty: 'basic',
                    hints: [
                        '正方形有 4 条边',
                        '正方形的 4 条边都相等',
                        '那个黄色的方形就是正方形'
                    ]
                },
                {
                    id: 'task-geo-2',
                    title: '数一数三角形',
                    description: '数一数场景中有几个三角形',
                    difficulty: 'advanced',
                    hints: [
                        '三角形有 3 条边',
                        '仔细看每个图形的边数',
                        '共有 2 个三角形'
                    ]
                },
                {
                    id: 'task-geo-3',
                    title: '图形配对',
                    description: '将图形名称和对应的图形配对',
                    difficulty: 'challenge',
                    hints: [
                        '正方形有 4 条相等的边',
                        '三角形有 3 条边',
                        '圆形没有边'
                    ]
                }
            ]
        },

        // 分数概念
        fraction: {
            id: 'math-fraction',
            title: '认识分数',
            grade: '3-4',
            objectives: [
                '理解分数的概念',
                '认识分子和分母',
                '能比较简单分数的大小'
            ],
            facts: [
                '分数表示把整体平均分成若干份',
                '分母表示平均分成的总份数',
                '分子表示取的份数',
                '分母越大，每一份越小'
            ],
            quiz: [
                {
                    id: 1,
                    question: '分数 3/4 表示什么？',
                    options: [
                        '把整体分成 3 份，取 4 份',
                        '把整体平均分成 4 份，取 3 份',
                        '把整体分成 4 份，取 4 份'
                    ],
                    correct: 1,
                    explanation: '分母 4 表示平均分成 4 份，分子 3 表示取其中的 3 份。',
                    difficulty: 'easy'
                },
                {
                    id: 2,
                    question: '1/2 和 1/4 哪个大？',
                    options: ['1/2 大', '1/4 大', '一样大'],
                    correct: 0,
                    explanation: '分母越小，每一份越大，所以 1/2 大于 1/4。',
                    difficulty: 'medium'
                },
                {
                    id: 3,
                    question: '把一个蛋糕平均分成 8 份，吃了 3 份，吃了多少？',
                    options: ['3/8', '8/3', '5/8'],
                    correct: 0,
                    explanation: '分母是 8，分子是 3，所以是 3/8。',
                    difficulty: 'easy'
                },
                {
                    id: 4,
                    question: '3/4 和 1/4 相加等于多少？',
                    options: ['4/8', '1', '4/4'],
                    correct: 1,
                    explanation: '同分母分数相加，分子相加：3+1=4，所以是 4/4，也就是 1。',
                    difficulty: 'medium'
                },
                {
                    id: 5,
                    question: '半个蛋糕可以怎么表示？',
                    options: ['1/3', '1/2', '2/2'],
                    correct: 1,
                    explanation: '一半就是 1/2。',
                    difficulty: 'easy'
                },
                {
                    id: 6,
                    question: '1/4、1/2、1/8 按从小到大排列是？',
                    options: ['1/8 < 1/4 < 1/2', '1/2 < 1/4 < 1/8', '1/4 < 1/8 < 1/2'],
                    correct: 0,
                    explanation: '分母越大分数越小，所以 1/8 < 1/4 < 1/2。',
                    difficulty: 'hard'
                },
                {
                    id: 7,
                    question: '4/4 等于多少？',
                    options: ['1/2', '1', '4'],
                    correct: 1,
                    explanation: '分子分母相等时，分数等于 1。',
                    difficulty: 'easy'
                },
                {
                    id: 8,
                    question: '2/5 和 3/5 哪个大？',
                    options: ['2/5 大', '3/5 大', '一样大'],
                    correct: 1,
                    explanation: '同分母分数，分子大的分数就大。',
                    difficulty: 'easy'
                },
                {
                    id: 9,
                    question: '一个披萨平均分成 6 份，吃了 2 份，还剩多少？',
                    options: ['4/6', '2/6', '6/6'],
                    correct: 0,
                    explanation: '6 份吃了 2 份，还剩 4 份，所以是 4/6。',
                    difficulty: 'medium'
                },
                {
                    id: 10,
                    question: '下面哪个和 1/2 相等？',
                    options: ['2/5', '3/6', '4/6'],
                    correct: 1,
                    explanation: '3/6 = 1/2（分子分母同时除以 3）',
                    difficulty: 'hard'
                }
            ],
            tasks: [
                {
                    id: 'task-frac-1',
                    title: '创建分数 1/2',
                    description: '调整滑块，创建表示 1/2 的饼图',
                    difficulty: 'basic',
                    hints: [
                        '分母设为 2',
                        '分子设为 1',
                        '就是一半的意思'
                    ]
                },
                {
                    id: 'task-frac-2',
                    title: '比较分数大小',
                    description: '比较 1/2 和 1/4 的大小',
                    difficulty: 'advanced',
                    hints: [
                        '分母小的分数大',
                        '1/2 > 1/4',
                        '分母越大每一份越小'
                    ]
                },
                {
                    id: 'task-frac-3',
                    title: '分数加法挑战',
                    description: '计算 1/4 + 2/4 = ?',
                    difficulty: 'challenge',
                    hints: [
                        '同分母相加，分子相加',
                        '1 + 2 = 3',
                        '答案是 3/4'
                    ]
                }
            ]
        },

        // 测量与单位
        measurement: {
            id: 'math-measurement',
            title: '测量与单位',
            grade: '2-3',
            objectives: [
                '认识长度单位（厘米、分米、米）',
                '了解面积和体积的概念',
                '会进行简单的单位换算'
            ],
            facts: [
                '1 米 = 10 分米 = 100 厘米',
                '1 分米 = 10 厘米',
                '面积 = 长 × 宽',
                '体积 = 长 × 宽 × 高'
            ],
            quiz: [
                {
                    id: 1,
                    question: '1 米等于多少厘米？',
                    options: ['10 厘米', '100 厘米', '1000 厘米'],
                    correct: 1,
                    explanation: '1 米 = 100 厘米。',
                    difficulty: 'easy'
                },
                {
                    id: 2,
                    question: '哪个单位最长？',
                    options: ['厘米', '分米', '米'],
                    correct: 2,
                    explanation: '米是最长的单位，1 米 = 10 分米 = 100 厘米。',
                    difficulty: 'easy'
                },
                {
                    id: 3,
                    question: '课桌的高度大约是多少？',
                    options: ['10 厘米', '60 厘米', '200 厘米'],
                    correct: 1,
                    explanation: '课桌的高度大约是 60 厘米（约 6 分米）。',
                    difficulty: 'easy'
                },
                {
                    id: 4,
                    question: '长方形的面积怎么计算？',
                    options: ['长 + 宽', '长 × 宽', '(长 + 宽) × 2'],
                    correct: 1,
                    explanation: '长方形的面积 = 长 × 宽。',
                    difficulty: 'easy'
                },
                {
                    id: 5,
                    question: '正方形边长 5 厘米，面积是多少？',
                    options: ['10 平方厘米', '25 平方厘米', '20 平方厘米'],
                    correct: 1,
                    explanation: '正方形面积 = 边长 × 边长 = 5 × 5 = 25 平方厘米。',
                    difficulty: 'medium'
                },
                {
                    id: 6,
                    question: '1 平方米等于多少平方厘米？',
                    options: ['100', '1000', '10000'],
                    correct: 2,
                    explanation: '1 平方米 = 10000 平方厘米（100 × 100）。',
                    difficulty: 'hard'
                },
                {
                    id: 7,
                    question: '长方形长 10 厘米，宽 5 厘米，周长是多少？',
                    options: ['15 厘米', '30 厘米', '50 厘米'],
                    correct: 1,
                    explanation: '周长 = (长 + 宽) × 2 = (10 + 5) × 2 = 30 厘米。',
                    difficulty: 'medium'
                },
                {
                    id: 8,
                    question: '铅笔的长度大约是多少？',
                    options: ['1 厘米', '10 厘米', '100 厘米'],
                    correct: 1,
                    explanation: '铅笔的长度大约是 10 厘米左右。',
                    difficulty: 'easy'
                },
                {
                    id: 9,
                    question: '教室的宽度大约是多少？',
                    options: ['5 米', '20 米', '100 米'],
                    correct: 0,
                    explanation: '教室的宽度大约是 5-8 米左右。',
                    difficulty: 'easy'
                },
                {
                    id: 10,
                    question: '正方体边长 3 厘米，体积是多少？',
                    options: ['9 立方厘米', '27 立方厘米', '6 立方厘米'],
                    correct: 1,
                    explanation: '正方体体积 = 边长 × 边长 × 边长 = 3 × 3 × 3 = 27。',
                    difficulty: 'hard'
                }
            ],
            tasks: [
                {
                    id: 'task-meas-1',
                    title: '单位换算练习',
                    description: '将 5 分米换算成厘米',
                    difficulty: 'basic',
                    hints: ['1 分米 = 10 厘米', '5 分米 = 50 厘米']
                },
                {
                    id: 'task-meas-2',
                    title: '计算面积',
                    description: '计算长 6 厘米，宽 4 厘米的长方形面积',
                    difficulty: 'advanced',
                    hints: ['面积 = 长 × 宽', '6 × 4 = 24', '24 平方厘米']
                },
                {
                    id: 'task-meas-3',
                    title: '体积计算挑战',
                    description: '计算边长 4 厘米的正方体体积',
                    difficulty: 'challenge',
                    hints: ['体积 = 边长³', '4 × 4 × 4', '64 立方厘米']
                }
            ]
        },

        // 统计图表
        statistics: {
            id: 'math-statistics',
            title: '统计图表',
            grade: '4-6',
            objectives: [
                '认识柱状图、折线图、饼图',
                '能读懂简单的统计图表',
                '会制作简单的统计图表'
            ],
            facts: [
                '柱状图用于比较数量',
                '折线图用于展示变化趋势',
                '饼图用于展示占比',
                '统计可以帮助我们更好地理解数据'
            ],
            quiz: [
                {
                    id: 1,
                    question: '哪种图表最适合比较不同班级的人数？',
                    options: ['柱状图', '折线图', '饼图'],
                    correct: 0,
                    explanation: '柱状图最适合用来比较不同类别的数量。',
                    difficulty: 'easy'
                },
                {
                    id: 2,
                    question: '折线图主要用于什么？',
                    options: ['比较数量', '展示变化趋势', '展示占比'],
                    correct: 1,
                    explanation: '折线图主要用于展示数据随时间的变化趋势。',
                    difficulty: 'easy'
                },
                {
                    id: 3,
                    question: '饼图中的扇区大小代表什么？',
                    options: ['数量的多少', '占比的大小', '变化的快慢'],
                    correct: 1,
                    explanation: '饼图中扇区越大，表示该类别的占比越大。',
                    difficulty: 'easy'
                },
                {
                    id: 4,
                    question: '如果柱状图的柱子最高，说明什么？',
                    options: ['数量最少', '数量最多', '数量相同'],
                    correct: 1,
                    explanation: '柱状图的柱子越高，表示该类别的数量越多。',
                    difficulty: 'easy'
                },
                {
                    id: 5,
                    question: '下面哪种情况适合用饼图？',
                    options: ['比较身高', '展示成绩分布', '记录每日温度'],
                    correct: 1,
                    explanation: '饼图适合展示各类别的占比情况。',
                    difficulty: 'medium'
                },
                {
                    id: 6,
                    question: '折线图中的点与点之间的连线说明什么？',
                    options: ['数据的增减', '数据的相等', '数据的总数'],
                    correct: 0,
                    explanation: '折线图中的连线表示数据的增减变化。',
                    difficulty: 'medium'
                },
                {
                    id: 7,
                    question: '如果饼图中某个扇区占一半，是多少度？',
                    options: ['90 度', '180 度', '270 度'],
                    correct: 1,
                    explanation: '一半就是 180 度。',
                    difficulty: 'medium'
                },
                {
                    id: 8,
                    question: '统计图中最重要的信息是什么？',
                    options: ['颜色', '数据', '标题'],
                    correct: 1,
                    explanation: '统计图中最重要的信息是它所展示的数据。',
                    difficulty: 'easy'
                },
                {
                    id: 9,
                    question: '制作统计图的第一步是什么？',
                    options: ['画图', '收集数据', '涂颜色'],
                    correct: 1,
                    explanation: '制作统计图前要先收集和整理数据。',
                    difficulty: 'easy'
                },
                {
                    id: 10,
                    question: '哪种图表能同时展示多个类别的数量对比？',
                    options: ['饼图', '柱状图', '无法比较'],
                    correct: 1,
                    explanation: '柱状图可以同时展示多个类别的数量对比。',
                    difficulty: 'easy'
                }
            ],
            tasks: [
                {
                    id: 'task-stat-1',
                    title: '读取柱状图',
                    description: '找出柱状图中数量最多的类别',
                    difficulty: 'basic',
                    hints: ['找最高的柱子', '柱子越高数量越多']
                },
                {
                    id: 'task-stat-2',
                    title: '制作饼图',
                    description: '根据给定的数据制作简单的饼图',
                    difficulty: 'advanced',
                    hints: ['计算各类别的占比', '按占比画扇形', '标注类别名称']
                },
                {
                    id: 'task-stat-3',
                    title: '分析折线图',
                    description: '描述折线图中的变化趋势',
                    difficulty: 'challenge',
                    hints: ['观察线的走向', '上升表示增加', '下降表示减少']
                }
            ]
        }
    },

    // ================================
    // 科学模块内容
    // ================================

    science: {
        // 简单机械
        machines: {
            id: 'science-machines',
            title: '简单机械',
            grade: '3-5',
            objectives: [
                '认识杠杆、滑轮、斜面',
                '理解简单机械的工作原理',
                '知道简单机械在生活中的应用'
            ],
            facts: [
                '杠杆可以省力或省距离',
                '定滑轮不省力但能改变力的方向',
                '动滑轮可以省一半的力',
                '斜面可以省力，但要多走距离'
            ],
            quiz: [
                {
                    id: 1,
                    question: '跷跷板是什么简单机械？',
                    options: ['杠杆', '滑轮', '斜面'],
                    correct: 0,
                    explanation: '跷跷板利用了杠杆的原理。',
                    difficulty: 'easy'
                },
                {
                    id: 2,
                    question: '使用杠杆时，支点在中间会怎样？',
                    options: ['省力', '改变方向', '费距离'],
                    correct: 1,
                    explanation: '支点在中间时，杠杆可以改变力的方向。',
                    difficulty: 'medium'
                },
                {
                    id: 3,
                    question: '定滑轮能省力吗？',
                    options: ['能省力', '不能省力但能改变方向', '能省一半力'],
                    correct: 1,
                    explanation: '定滑轮不能省力，但可以改变力的方向。',
                    difficulty: 'easy'
                },
                {
                    id: 4,
                    question: '动滑轮可以省多少力？',
                    options: ['不省力', '省一半力', '省所有力'],
                    correct: 1,
                    explanation: '动滑轮可以省一半的力。',
                    difficulty: 'medium'
                },
                {
                    id: 5,
                    question: '走斜坡上楼和直接上楼相比有什么好处？',
                    options: ['更省力', '更快', '更容易'],
                    correct: 0,
                    explanation: '斜坡（斜面）可以省力，但需要走更长的距离。',
                    difficulty: 'easy'
                },
                {
                    id: 6,
                    question: '撬棍是什么简单机械的应用？',
                    options: ['滑轮', '杠杆', '斜面'],
                    correct: 1,
                    explanation: '撬棍是杠杆的应用。',
                    difficulty: 'easy'
                },
                {
                    id: 7,
                    question: '滑轮组有什么作用？',
                    options: ['只能改变方向', '只能省力', '既能省力又能改变方向'],
                    correct: 2,
                    explanation: '滑轮组既能省力又能改变力的方向。',
                    difficulty: 'hard'
                },
                {
                    id: 8,
                    question: '斜面的坡度越缓，越怎样？',
                    options: ['越费力', '越省力', '没区别'],
                    correct: 1,
                    explanation: '斜面的坡度越缓（越平），越省力。',
                    difficulty: 'medium'
                },
                {
                    id: 9,
                    question: '生活中哪里用到了滑轮？',
                    options: ['楼梯', '旗杆', '门'],
                    correct: 1,
                    explanation: '旗杆上的滑轮用来升降旗帜。',
                    difficulty: 'easy'
                },
                {
                    id: 10,
                    question: '剪刀是什么简单机械？',
                    options: ['杠杆', '滑轮', '斜面'],
                    correct: 0,
                    explanation: '剪刀是杠杆的应用。',
                    difficulty: 'easy'
                }
            ],
            tasks: [
                {
                    id: 'task-mach-1',
                    title: '平衡杠杆',
                    description: '调整支点位置，使杠杆平衡',
                    difficulty: 'basic',
                    hints: ['支点在中间时平衡', '两边的力和距离相等']
                },
                {
                    id: 'task-mach-2',
                    title: '组装滑轮组',
                    description: '组装一个能省力的滑轮组',
                    difficulty: 'advanced',
                    hints: ['动滑轮能省力', '组合定滑轮和动滑轮']
                },
                {
                    id: 'task-mach-3',
                    title: '设计斜面',
                    description: '设计一个省力的斜面坡道',
                    difficulty: 'challenge',
                    hints: ['坡度越缓越省力', '但需要更长的距离']
                }
            ]
        },

        // 物质三态
        states: {
            id: 'science-states',
            title: '物质的三态',
            grade: '3-4',
            objectives: [
                '认识固体、液体、气体',
                '了解三态之间的转化',
                '知道生活中的三态变化'
            ],
            facts: [
                '固体有固定的形状和体积',
                '液体有固定的体积但没有固定的形状',
                '气体没有固定的形状和体积',
                '温度变化会引起三态变化'
            ],
            quiz: [
                {
                    id: 1,
                    question: '冰是什么状态的？',
                    options: ['固体', '液体', '气体'],
                    correct: 0,
                    explanation: '冰是水的固体状态。',
                    difficulty: 'easy'
                },
                {
                    id: 2,
                    question: '水变成水蒸气是什么变化？',
                    options: ['凝固', '熔化', '汽化'],
                    correct: 2,
                    explanation: '液体变成气体叫做汽化（或蒸发）。',
                    difficulty: 'easy'
                },
                {
                    id: 3,
                    question: '冰化成水是什么变化？',
                    options: ['熔化', '凝固', '汽化'],
                    correct: 0,
                    explanation: '固体变成液体叫做熔化。',
                    difficulty: 'easy'
                },
                {
                    id: 4,
                    question: '水结冰是什么变化？',
                    options: ['熔化', '凝固', '汽化'],
                    correct: 1,
                    explanation: '液体变成固体叫做凝固。',
                    difficulty: 'easy'
                },
                {
                    id: 5,
                    question: '哪种状态的粒子排列最紧密？',
                    options: ['固体', '液体', '气体'],
                    correct: 0,
                    explanation: '固体的粒子排列最紧密，有固定的形状。',
                    difficulty: 'medium'
                },
                {
                    id: 6,
                    question: '水在多少度会沸腾？',
                    options: ['0°C', '100°C', '150°C'],
                    correct: 1,
                    explanation: '水在 100°C 时会沸腾变成水蒸气。',
                    difficulty: 'easy'
                },
                {
                    id: 7,
                    question: '下面的霜是什么现象？',
                    options: ['凝固', '凝华', '熔化'],
                    correct: 1,
                    explanation: '霜是水蒸气直接变成冰晶，叫做凝华。',
                    difficulty: 'hard'
                },
                {
                    id: 8,
                    question: '空气是什么状态？',
                    options: ['固体', '液体', '气体'],
                    correct: 2,
                    explanation: '空气是气体，没有固定的形状和体积。',
                    difficulty: 'easy'
                },
                {
                    id: 9,
                    question: '哪种状态的粒子可以自由移动？',
                    options: ['固体', '液体', '气体'],
                    correct: 2,
                    explanation: '气体的粒子可以自由移动，充满整个空间。',
                    difficulty: 'medium'
                },
                {
                    id: 10,
                    question: '冬天窗户上的冰花是怎么形成的？',
                    options: ['水冻结', '水蒸气凝华', '水蒸发'],
                    correct: 1,
                    explanation: '冰花是水蒸气直接凝华成冰晶形成的。',
                    difficulty: 'hard'
                }
            ],
            tasks: [
                {
                    id: 'task-state-1',
                    title: '识别三态',
                    description: '区分场景中的固体、液体和气体',
                    difficulty: 'basic',
                    hints: ['固体有固定形状', '液体可以流动', '气体看不见']
                },
                {
                    id: 'task-state-2',
                    title: '三态转化',
                    description: '描述冰化成水的过程',
                    difficulty: 'advanced',
                    hints: ['冰是固体', '化成水是熔化', '需要吸收热量']
                },
                {
                    id: 'task-state-3',
                    title: '水的循环',
                    description: '解释水在自然界中的循环',
                    difficulty: 'challenge',
                    hints: ['蒸发→凝结→降水', '水的三态变化', '循环往复']
                }
            ]
        },

        // 植物生长
        plants: {
            id: 'science-plants',
            title: '植物的生长',
            grade: '4-6',
            objectives: [
                '了解植物的生命周期',
                '认识光合作用',
                '知道植物的组成部分'
            ],
            facts: [
                '植物由根、茎、叶组成',
                '光合作用需要阳光、水和二氧化碳',
                '光合作用产生氧气和葡萄糖',
                '植物从种子开始生长'
            ],
            quiz: [
                {
                    id: 1,
                    question: '植物进行光合作用的主要部位是？',
                    options: ['根', '叶', '茎'],
                    correct: 1,
                    explanation: '叶子是植物进行光合作用的主要部位。',
                    difficulty: 'easy'
                },
                {
                    id: 2,
                    question: '光合作用需要什么？',
                    options: ['只需要水', '阳光、水和二氧化碳', '只需要阳光'],
                    correct: 1,
                    explanation: '光合作用需要阳光、水和二氧化碳。',
                    difficulty: 'easy'
                },
                {
                    id: 3,
                    question: '光合作用产生什么？',
                    options: ['二氧化碳和水', '氧气和葡萄糖', '氮气'],
                    correct: 1,
                    explanation: '光合作用产生氧气和葡萄糖。',
                    difficulty: 'easy'
                },
                {
                    id: 4,
                    question: '植物的根有什么作用？',
                    options: ['进行光合作用', '吸收水分和养分', '制造食物'],
                    correct: 1,
                    explanation: '根从土壤中吸收水分和养分。',
                    difficulty: 'easy'
                },
                {
                    id: 5,
                    question: '植物的哪部分含有叶绿体？',
                    options: ['根', '茎', '叶'],
                    correct: 2,
                    explanation: '叶子中含有叶绿体，是光合作用的地方。',
                    difficulty: 'medium'
                },
                {
                    id: 6,
                    question: '种子发芽时，先长出什么？',
                    options: ['芽向上', '根向下', '同时长'],
                    correct: 1,
                    explanation: '种子发芽时，根先向下生长。',
                    difficulty: 'medium'
                },
                {
                    id: 7,
                    question: '植物为什么需要阳光？',
                    options: ['保持温暖', '进行光合作用', '吸引昆虫'],
                    correct: 1,
                    explanation: '植物需要阳光来进行光合作用，制造食物。',
                    difficulty: 'easy'
                },
                {
                    id: 8,
                    question: '植物的茎有什么作用？',
                    options: ['吸收水分', '支撑和运输', '进行光合作用'],
                    correct: 1,
                    explanation: '茎支撑植物，并运输水分和养分。',
                    difficulty: 'medium'
                },
                {
                    id: 9,
                    question: '开花植物的种子从哪里来？',
                    options: ['从根来', '从花来', '从叶来'],
                    correct: 1,
                    explanation: '种子是由花的子房发育来的。',
                    difficulty: 'medium'
                },
                {
                    id: 10,
                    question: '植物释放出的气体是什么？',
                    options: ['二氧化碳', '氧气', '氮气'],
                    correct: 1,
                    explanation: '植物通过光合作用释放氧气。',
                    difficulty: 'easy'
                }
            ],
            tasks: [
                {
                    id: 'task-plant-1',
                    title: '观察种子发芽',
                    description: '观察种子发芽过程中的变化',
                    difficulty: 'basic',
                    hints: ['先长根后长芽', '根向下芽向上']
                },
                {
                    id: 'task-plant-2',
                    title: '理解光合作用',
                    description: '解释光合作用的过程和产物',
                    difficulty: 'advanced',
                    hints: ['需要阳光和水', '产生氧气和食物', '在叶子中进行']
                },
                {
                    id: 'task-plant-3',
                    title: '植物生命周期',
                    description: '描述植物从种子到结种子的完整过程',
                    difficulty: 'challenge',
                    hints: ['发芽→生长→开花→结果', '循环往复']
                }
            ]
        },

        // 太阳系
        solar: {
            id: 'science-solar',
            title: '太阳系',
            grade: '5-6',
            objectives: [
                '认识太阳和八大行星',
                '了解行星的运动',
                '知道地球的自转和公转'
            ],
            facts: [
                '太阳是太阳系的中心',
                '地球绕太阳公转，同时自转',
                '公转产生一年，自转产生昼夜',
                '月球绕地球转动产生月相'
            ],
            quiz: [
                {
                    id: 1,
                    question: '太阳系的中心是什么？',
                    options: ['地球', '太阳', '月球'],
                    correct: 1,
                    explanation: '太阳是太阳系的中心。',
                    difficulty: 'easy'
                },
                {
                    id: 2,
                    question: '地球绕太阳转一圈需要多久？',
                    options: ['一天', '一个月', '一年'],
                    correct: 2,
                    explanation: '地球绕太阳公转一圈需要一年时间。',
                    difficulty: 'easy'
                },
                {
                    id: 3,
                    question: '地球自转产生什么？',
                    options: ['一年四季', '昼夜交替', '月相变化'],
                    correct: 1,
                    explanation: '地球自转产生昼夜交替。',
                    difficulty: 'easy'
                },
                {
                    id: 4,
                    question: '哪个行星离太阳最近？',
                    options: ['地球', '水星', '金星'],
                    correct: 1,
                    explanation: '水星是离太阳最近的行星。',
                    difficulty: 'easy'
                },
                {
                    id: 5,
                    question: '最大的行星是？',
                    options: ['地球', '木星', '土星'],
                    correct: 1,
                    explanation: '木星是太阳系中最大的行星。',
                    difficulty: 'easy'
                },
                {
                    id: 6,
                    question: '月相变化是由什么引起的？',
                    options: ['地球自转', '月球绕地球转', '太阳绕地球转'],
                    correct: 1,
                    explanation: '月相变化是由于月球绕地球转动造成的。',
                    difficulty: 'medium'
                },
                {
                    id: 7,
                    question: '哪个行星有光环？',
                    options: ['火星', '土星', '金星'],
                    correct: 1,
                    explanation: '土星有美丽的光环。',
                    difficulty: 'easy'
                },
                {
                    id: 8,
                    question: '地球为什么有四季变化？',
                    options: ['地球自转', '地球公转且地轴倾斜', '月球引力'],
                    correct: 1,
                    explanation: '地球公转时地轴倾斜产生四季变化。',
                    difficulty: 'hard'
                },
                {
                    id: 9,
                    question: '太阳是什么？',
                    options: ['行星', '恒星', '卫星'],
                    correct: 1,
                    explanation: '太阳是一颗恒星，自己发光发热。',
                    difficulty: 'easy'
                },
                {
                    id: 10,
                    question: '月球绕地球转一圈大约需要多久？',
                    options: ['一天', '一个月', '一年'],
                    correct: 1,
                    explanation: '月球绕地球转一圈大约需要一个月。',
                    difficulty: 'medium'
                }
            ],
            tasks: [
                {
                    id: 'task-solar-1',
                    title: '行星排序',
                    description: '按离太阳由近到远的顺序排列行星',
                    difficulty: 'basic',
                    hints: ['水星最近', '地球第三', '海王星最远']
                },
                {
                    id: 'task-solar-2',
                    title: '理解公转',
                    description: '解释地球公转产生的一年四季',
                    difficulty: 'advanced',
                    hints: ['绕太阳一圈', '地轴倾斜', '四季变化']
                },
                {
                    id: 'task-solar-3',
                    title: '月相变化',
                    description: '描述月相变化的原因和过程',
                    difficulty: 'challenge',
                    hints: ['月球绕地球', '太阳照射', '从不同角度看']
                }
            ]
        }
    },

    // ================================
    // 工具函数
    // ================================

    /**
     * 根据主题 ID 获取内容
     */
    getContent(topicId) {
        const [subject, topic] = topicId.split('-');
        if (this[subject] && this[subject][topic]) {
            return this[subject][topic];
        }
        return null;
    },

    /**
     * 获取所有主题列表
     */
    getAllTopics() {
        const topics = [];
        Object.keys(this).forEach(subject => {
            Object.keys(this[subject]).forEach(topic => {
                const data = this[subject][topic];
                topics.push({
                    id: data.id,
                    title: data.title,
                    grade: data.grade,
                    subject: subject
                });
            });
        });
        return topics;
    },

    /**
     * 根据年级筛选主题
     */
    getTopicsByGrade(grade) {
        const allTopics = this.getAllTopics();
        return allTopics.filter(topic => topic.grade.includes(grade));
    }
};

// 导出到全局
window.ContentDatabase = ContentDatabase;
