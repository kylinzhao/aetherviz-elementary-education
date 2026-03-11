/**
 * SVG静态教学图生成器
 * 提供快速创建教育用SVG图的工具
 */

class StaticDiagram {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.svg = null;
    }

    /**
     * 创建SVG画布
     * @param {number} width - 宽度
     * @param {number} height - 高度
     */
    createSVG(width = 800, height = 600) {
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.setAttribute("width", "100%");
        this.svg.setAttribute("height", "100%");
        this.svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        this.svg.style.background = "#0f172a";
        this.container.appendChild(this.svg);
        return this.svg;
    }

    /**
     * 添加矩形
     */
    addRect(x, y, width, height, options = {}) {
        const {
            fill = "#3b82f6",
            stroke = "#60a5fa",
            strokeWidth = 2,
            opacity = 1
        } = options;

        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", width);
        rect.setAttribute("height", height);
        rect.setAttribute("fill", fill);
        rect.setAttribute("stroke", stroke);
        rect.setAttribute("stroke-width", strokeWidth);
        rect.setAttribute("opacity", opacity);

        this.svg.appendChild(rect);
        return rect;
    }

    /**
     * 添加圆形
     */
    addCircle(cx, cy, r, options = {}) {
        const {
            fill = "#3b82f6",
            stroke = "#60a5fa",
            strokeWidth = 2,
            opacity = 1
        } = options;

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        circle.setAttribute("r", r);
        circle.setAttribute("fill", fill);
        circle.setAttribute("stroke", stroke);
        circle.setAttribute("stroke-width", strokeWidth);
        circle.setAttribute("opacity", opacity);

        this.svg.appendChild(circle);
        return circle;
    }

    /**
     * 添加椭圆
     */
    addEllipse(cx, cy, rx, ry, options = {}) {
        const {
            fill = "#3b82f6",
            stroke = "#60a5fa",
            strokeWidth = 2,
            opacity = 1
        } = options;

        const ellipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        ellipse.setAttribute("cx", cx);
        ellipse.setAttribute("cy", cy);
        ellipse.setAttribute("rx", rx);
        ellipse.setAttribute("ry", ry);
        ellipse.setAttribute("fill", fill);
        ellipse.setAttribute("stroke", stroke);
        ellipse.setAttribute("stroke-width", strokeWidth);
        ellipse.setAttribute("opacity", opacity);

        this.svg.appendChild(ellipse);
        return ellipse;
    }

    /**
     * 添加线条
     */
    addLine(x1, y1, x2, y2, options = {}) {
        const {
            stroke = "#60a5fa",
            strokeWidth = 2,
            opacity = 1,
            dashArray = ""
        } = options;

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("stroke", stroke);
        line.setAttribute("stroke-width", strokeWidth);
        line.setAttribute("opacity", opacity);
        if (dashArray) line.setAttribute("stroke-dasharray", dashArray);

        this.svg.appendChild(line);
        return line;
    }

    /**
     * 添加箭头
     */
    addArrow(x1, y1, x2, y2, options = {}) {
        const {
            color = "#60a5fa",
            strokeWidth = 2,
            arrowSize = 10
        } = options;

        // 添加线条
        this.addLine(x1, y1, x2, y2, { stroke: color, strokeWidth });

        // 计算箭头角度
        const angle = Math.atan2(y2 - y1, x2 - x1);

        // 添加箭头三角形
        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        const points = [
            [x2, y2],
            [
                x2 - arrowSize * Math.cos(angle - Math.PI / 6),
                y2 - arrowSize * Math.sin(angle - Math.PI / 6)
            ],
            [
                x2 - arrowSize * Math.cos(angle + Math.PI / 6),
                y2 - arrowSize * Math.sin(angle + Math.PI / 6)
            ]
        ].map(p => p.join(",")).join(" ");

        polygon.setAttribute("points", points);
        polygon.setAttribute("fill", color);

        this.svg.appendChild(polygon);
        return polygon;
    }

    /**
     * 添加文本
     */
    addText(x, y, text, options = {}) {
        const {
            fontSize = 24,
            fill = "#f1f5f9",
            fontWeight = "normal",
            anchor = "middle",
            opacity = 1
        } = options;

        const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textElement.setAttribute("x", x);
        textElement.setAttribute("y", y);
        textElement.setAttribute("font-size", fontSize);
        textElement.setAttribute("fill", fill);
        textElement.setAttribute("font-weight", fontWeight);
        textElement.setAttribute("text-anchor", anchor);
        textElement.setAttribute("opacity", opacity);
        textElement.textContent = text;

        this.svg.appendChild(textElement);
        return textElement;
    }

    /**
     * 添加多行文本
     */
    addMultilineText(x, y, lines, options = {}) {
        const {
            fontSize = 24,
            lineHeight = 30,
            fill = "#f1f5f9",
            anchor = "middle"
        } = options;

        lines.forEach((line, index) => {
            this.addText(x, y + index * lineHeight, line, {
                fontSize,
                fill,
                anchor
            });
        });
    }

    /**
     * 添加标注（带圆圈和文字）
     */
    addLabel(x, y, text, options = {}) {
        const {
            radius = 20,
            circleFill = "#8b5cf6",
            textColor = "#ffffff"
        } = options;

        // 添加圆圈
        this.addCircle(x, y, radius, {
            fill: circleFill,
            stroke: "none"
        });

        // 添加文字
        this.addText(x, y + radius / 3, text, {
            fontSize: radius,
            fill: textColor,
            fontWeight: "bold"
        });
    }

    /**
     * 添加虚线框
     */
    addDashedRect(x, y, width, height, options = {}) {
        const {
            stroke = "#60a5fa",
            strokeWidth = 2,
            dashArray = "5,5"
        } = options;

        return this.addRect(x, y, width, height, {
            fill: "none",
            stroke,
            strokeWidth,
            opacity: 1
        });
    }

    /**
     * 添加尺寸标注
     */
    addDimension(x1, y1, x2, y2, text, offset = 20) {
        const isVertical = Math.abs(x2 - x1) < Math.abs(y2 - y1);

        if (isVertical) {
            // 垂直标注
            const midX = (x1 + x2) / 2 + offset;
            this.addLine(x1, y1, midX - 10, y1, { stroke: "#60a5fa" });
            this.addLine(x2, y2, midX - 10, y2, { stroke: "#60a5fa" });
            this.addLine(midX - 10, y1, midX - 10, y2, { stroke: "#60a5fa" });
            this.addLine(midX - 15, y1, midX - 5, y1, { stroke: "#60a5fa" });
            this.addLine(midX - 15, y2, midX - 5, y2, { stroke: "#60a5fa" });
            this.addText(midX, (y1 + y2) / 2, text, {
                fontSize: 18,
                anchor: "start"
            });
        } else {
            // 水平标注
            const midY = (y1 + y2) / 2 + offset;
            this.addLine(x1, y1, x1, midY - 10, { stroke: "#60a5fa" });
            this.addLine(x2, y2, x2, midY - 10, { stroke: "#60a5fa" });
            this.addLine(x1, midY - 10, x2, midY - 10, { stroke: "#60a5fa" });
            this.addLine(x1, midY - 15, x1, midY - 5, { stroke: "#60a5fa" });
            this.addLine(x2, midY - 15, x2, midY - 5, { stroke: "#60a5fa" });
            this.addText((x1 + x2) / 2, midY, text, {
                fontSize: 18
            });
        }
    }

    /**
     * 清空SVG
     */
    clear() {
        if (this.svg) {
            this.svg.innerHTML = '';
        }
    }
}
