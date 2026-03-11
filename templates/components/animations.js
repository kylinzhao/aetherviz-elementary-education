/**
 * 常用动画效果库
 * 提供预定义的动画函数
 */

class Animations {
    /**
     * 弹性缓动函数
     * @param {number} t - 时间进度 (0-1)
     */
    static easeOutElastic(t) {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }

    /**
     * 弹跳缓动函数
     * @param {number} t - 时间进度 (0-1)
     */
    static easeOutBounce(t) {
        const n1 = 7.5625;
        const d1 = 2.75;

        if (t < 1 / d1) {
            return n1 * t * t;
        } else if (t < 2 / d1) {
            return n1 * (t -= 1.5 / d1) * t + 0.75;
        } else if (t < 2.5 / d1) {
            return n1 * (t -= 2.25 / d1) * t + 0.9375;
        } else {
            return n1 * (t -= 2.625 / d1) * t + 0.984375;
        }
    }

    /**
     * 平滑缓动函数
     * @param {number} t - 时间进度 (0-1)
     */
    static easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    /**
     * 旋转动画
     * @param {THREE.Object3D} object - 要旋转的对象
     * @param {object} options - 动画选项
     */
    static rotate(object, options = {}) {
        const {
            axis = 'y',
            speed = 0.01,
            duration = null,
            onComplete = null
        } = options;

        const startTime = Date.now();
        const initialRotation = object.rotation[axis];

        const animate = () => {
            if (duration) {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                object.rotation[axis] = initialRotation + (speed * progress * 100);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    if (onComplete) onComplete();
                }
            } else {
                object.rotation[axis] += speed;
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    /**
     * 浮动动画
     * @param {THREE.Object3D} object - 要浮动的对象
     * @param {object} options - 动画选项
     */
    static float(object, options = {}) {
        const {
            amplitude = 0.1,
            frequency = 0.001,
            axis = 'y'
        } = options;

        const initialY = object.position[axis];
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            object.position[axis] = initialY + Math.sin(elapsed * frequency) * amplitude;
            requestAnimationFrame(animate);
        };

        animate();
    }

    /**
     * 缩放动画
     * @param {THREE.Object3D} object - 要缩放的对象
     * @param {number} targetScale - 目标缩放值
     * @param {number} duration - 动画时长（毫秒）
     * @param {function} easing - 缓动函数
     */
    static scale(object, targetScale, duration = 300, easing = Animations.easeInOutCubic) {
        const initialScale = object.scale.x;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easing(progress);

            const newScale = initialScale + (targetScale - initialScale) * easedProgress;
            object.scale.set(newScale, newScale, newScale);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    /**
     * 位置移动动画
     * @param {THREE.Object3D} object - 要移动的对象
     * @param {THREE.Vector3} targetPosition - 目标位置
     * @param {number} duration - 动画时长（毫秒）
     * @param {function} easing - 缓动函数
     */
    static move(object, targetPosition, duration = 300, easing = Animations.easeInOutCubic) {
        const initialPosition = object.position.clone();
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easing(progress);

            object.position.x = initialPosition.x + (targetPosition.x - initialPosition.x) * easedProgress;
            object.position.y = initialPosition.y + (targetPosition.y - initialPosition.y) * easedProgress;
            object.position.z = initialPosition.z + (targetPosition.z - initialPosition.z) * easedProgress;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    /**
     * 颜色渐变动画
     * @param {THREE.Material} material - 材质对象
     * @param {number} targetColor - 目标颜色（十六进制）
     * @param {number} duration - 动画时长（毫秒）
     */
    static fadeColor(material, targetColor, duration = 300) {
        const initialColor = material.color.getHex();
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const currentColor = new THREE.Color(initialColor).lerp(new THREE.Color(targetColor), progress);
            material.color.setHex(currentColor.getHex());

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    /**
     * 透明度渐变动画
     * @param {THREE.Material} material - 材质对象
     * @param {number} targetOpacity - 目标透明度 (0-1)
     * @param {number} duration - 动画时长（毫秒）
     */
    static fadeOpacity(material, targetOpacity, duration = 300) {
        const initialOpacity = material.opacity;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            material.opacity = initialOpacity + (targetOpacity - initialOpacity) * progress;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    /**
     * 呼吸动画（缩放+透明度）
     * @param {THREE.Object3D} object - 要动画的对象
     * @param {object} options - 动画选项
     */
    static breathe(object, options = {}) {
        const {
            minScale = 0.95,
            maxScale = 1.05,
            duration = 1000,
            axis = 'y'
        } = options;

        const breathe = () => {
            Animations.scale(object, maxScale, duration / 2, Animations.easeInOutCubic);
            setTimeout(() => {
                Animations.scale(object, minScale, duration / 2, Animations.easeInOutCubic);
            }, duration / 2);
        };

        // 持续呼吸
        setInterval(breathe, duration);
    }

    /**
     * 路径动画（沿路径移动）
     * @param {THREE.Object3D} object - 要移动的对象
     * @param {array} points - 路径点数组
     * @param {number} duration - 动画时长（毫秒）
     */
    static followPath(object, points, duration = 1000) {
        let currentPoint = 0;
        const startTime = Date.now();

        const animate = () => {
            if (currentPoint >= points.length - 1) return;

            const elapsed = Date.now() - startTime;
            const segmentDuration = duration / (points.length - 1);
            const segmentProgress = (elapsed % segmentDuration) / segmentDuration;

            const startPoint = points[currentPoint];
            const endPoint = points[currentPoint + 1];

            object.position.x = startPoint.x + (endPoint.x - startPoint.x) * segmentProgress;
            object.position.y = startPoint.y + (endPoint.y - startPoint.y) * segmentProgress;
            object.position.z = startPoint.z + (endPoint.z - startPoint.z) * segmentProgress;

            if (segmentProgress >= 1) {
                currentPoint++;
            }

            requestAnimationFrame(animate);
        };

        animate();
    }
}
