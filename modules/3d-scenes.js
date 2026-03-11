/**
 * AetherViz 小学教学 - 3D 可视化场景库
 * 包含数学和科学主题的 3D 场景
 */

const Scene3D = {
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    animationId: null,

    /**
     * 初始化 3D 场景
     */
    init() {
        const container = document.getElementById('canvas-container');
        if (!container) return;

        // 创建场景
        this.scene = new THREE.Scene();

        // 创建相机
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 5, 10);

        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        container.appendChild(this.renderer.domElement);

        // 添加灯光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // 添加 OrbitControls（简化版）
        this.addControls();

        // 响应窗口大小变化
        window.addEventListener('resize', () => this.onWindowResize());

        // 开始动画循环
        this.animate();
    },

    /**
     * 添加轨道控制
     */
    addControls() {
        // 简化的 OrbitControls 实现
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        this.renderer.domElement.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        this.renderer.domElement.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaMove = {
                x: e.clientX - previousMousePosition.x,
                y: e.clientY - previousMousePosition.y
            };

            const deltaRotationQuaternion = new THREE.Quaternion()
                .setFromEuler(new THREE.Euler(
                    toRad(deltaMove.y * 0.5),
                    toRad(deltaMove.x * 0.5),
                    0,
                    'XYZ'
                ));

            this.camera.quaternion.multiplyQuaternions(deltaRotationQuaternion, this.camera.quaternion);
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        this.renderer.domElement.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // 滚轮缩放
        this.renderer.domElement.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.camera.position.z += e.deltaY * 0.01;
            this.camera.position.z = Math.max(5, Math.min(50, this.camera.position.z));
        });

        function toRad(degrees) {
            return degrees * (Math.PI / 180);
        }
    },

    /**
     * 动画循环
     */
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    },

    /**
     * 窗口大小变化
     */
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    },

    /**
     * 清除场景
     */
    clearScene() {
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }

        // 重新添加灯光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        this.scene.add(directionalLight);
    }
};

// ================================
// 几何图形模块
// ================================

const GeometryModule = {
    /**
     * 创建平面图形
     */
    createPlaneShapes() {
        Scene3D.clearScene();

        const shapes = [
            { name: '三角形', sides: 3, color: 0x3B82F6, x: -4 },
            { name: '正方形', sides: 4, color: 0x10B981, x: -1.3 },
            { name: '长方形', sides: 4, color: 0xF59E0B, x: 1.3, isRect: true },
            { name: '圆形', sides: 32, color: 0xEF4444, x: 4 }
        ];

        shapes.forEach(shape => {
            let geometry;
            if (shape.name === '圆形') {
                geometry = new THREE.CircleGeometry(1, 32);
            } else if (shape.isRect) {
                geometry = new THREE.PlaneGeometry(2, 1.5);
            } else {
                geometry = new THREE.CircleGeometry(1, shape.sides);
            }

            const material = new THREE.MeshStandardMaterial({
                color: shape.color,
                side: THREE.DoubleSide
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = shape.x;
            mesh.rotation.x = -Math.PI / 2;
            mesh.userData = { name: shape.name };

            Scene3D.scene.add(mesh);
        });
    },

    /**
     * 创建立体图形
     */
    createSolidShapes() {
        Scene3D.clearScene();

        const shapes = [
            { name: '正方体', geometry: new THREE.BoxGeometry(1.5, 1.5, 1.5), color: 0x3B82F6, x: -3 },
            { name: '长方体', geometry: new THREE.BoxGeometry(2, 1.5, 1), color: 0x10B981, x: 0 },
            { name: '圆柱', geometry: new THREE.CylinderGeometry(0.8, 0.8, 2, 32), color: 0xF59E0B, x: 3 }
        ];

        shapes.forEach(shape => {
            const material = new THREE.MeshStandardMaterial({ color: shape.color });
            const mesh = new THREE.Mesh(shape.geometry, material);
            mesh.position.x = shape.x;
            mesh.position.y = 1;
            mesh.userData = { name: shape.name };
            Scene3D.scene.add(mesh);
        });
    }
};

// ================================
// 分数模块
// ================================

const FractionModule = {
    /**
     * 创建分数饼图
     * @param {number} numerator - 分子
     * @param {number} denominator - 分母
     */
    createFractionPie(numerator = 3, denominator = 4) {
        Scene3D.clearScene();

        const radius = 2;
        const segments = denominator;
        const filledSegments = numerator;

        // 创建背景圆
        const bgGeometry = new THREE.CircleGeometry(radius, 64);
        const bgMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            side: THREE.DoubleSide
        });
        const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
        bgMesh.rotation.x = -Math.PI / 2;
        Scene3D.scene.add(bgMesh);

        // 创建填充扇形
        if (filledSegments > 0) {
            const shape = new THREE.Shape();
            const anglePerSegment = (Math.PI * 2) / segments;

            shape.moveTo(0, 0);
            for (let i = 0; i <= filledSegments; i++) {
                const angle = i * anglePerSegment;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                shape.lineTo(x, y);
            }
            shape.lineTo(0, 0);

            const geometry = new THREE.ShapeGeometry(shape);
            const material = new THREE.MeshStandardMaterial({
                color: 0x3B82F6,
                side: THREE.DoubleSide
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.x = -Math.PI / 2;
            Scene3D.scene.add(mesh);
        }

        // 添加分隔线
        for (let i = 0; i < segments; i++) {
            const angle = i * ((Math.PI * 2) / segments);
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
            ]);
            const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
            const line = new THREE.Line(lineGeometry, lineMaterial);
            Scene3D.scene.add(line);
        }
    }
};

// ================================
// 简单机械模块
// ================================

const MachinesModule = {
    /**
     * 创建杠杆模型
     */
    createLever() {
        Scene3D.clearScene();

        // 创建支座
        const fulcrumGeometry = new THREE.ConeGeometry(0.5, 1, 4);
        const fulcrumMaterial = new THREE.MeshStandardMaterial({ color: 0x8B5CF6 });
        const fulcrum = new THREE.Mesh(fulcrumGeometry, fulcrumMaterial);
        fulcrum.position.y = 0.5;
        fulcrum.rotation.y = Math.PI / 4;
        Scene3D.scene.add(fulcrum);

        // 创建杠杆臂
        const armGeometry = new THREE.BoxGeometry(8, 0.2, 0.5);
        const armMaterial = new THREE.MeshStandardMaterial({ color: 0xF59E0B });
        const arm = new THREE.Mesh(armGeometry, armMaterial);
        arm.position.y = 1.1;
        arm.userData = { type: 'lever-arm' };
        Scene3D.scene.add(arm);

        // 左侧物体
        const leftWeightGeometry = new THREE.BoxGeometry(1, 1, 1);
        const leftWeightMaterial = new THREE.MeshStandardMaterial({ color: 0x3B82F6 });
        const leftWeight = new THREE.Mesh(leftWeightGeometry, leftWeightMaterial);
        leftWeight.position.set(-3, 1.6, 0);
        leftWeight.userData = { type: 'weight', side: 'left' };
        Scene3D.scene.add(leftWeight);

        // 右侧物体
        const rightWeightGeometry = new THREE.BoxGeometry(1, 1, 1);
        const rightWeightMaterial = new THREE.MeshStandardMaterial({ color: 0x10B981 });
        const rightWeight = new THREE.Mesh(rightWeightGeometry, rightWeightMaterial);
        rightWeight.position.set(3, 1.6, 0);
        rightWeight.userData = { type: 'weight', side: 'right' };
        Scene3D.scene.add(rightWeight);

        // 添加力箭头
        this.createForceArrow(-3, 2.5, 0xEF4444); // 左侧力
        this.createForceArrow(3, 2.5, 0x22C55E);  // 右侧力
    },

    /**
     * 创建力箭头
     */
    createForceArrow(x, y, color) {
        const dir = new THREE.Vector3(0, -1, 0);
        const origin = new THREE.Vector3(x, y, 0);
        const length = 1;
        const arrowHelper = new THREE.ArrowHelper(dir, origin, length, color, 0.3, 0.2);
        Scene3D.scene.add(arrowHelper);
    }
};

// ================================
// 物质三态模块
// ================================

const StatesModule = {
    /**
     * 创建粒子系统展示三态
     */
    createParticleStates() {
        Scene3D.clearScene();

        // 固体（紧密排列，轻微振动）
        this.createSolidState(-4);

        // 液体（可以流动，保持体积）
        this.createLiquidState(0);

        // 气体（自由扩散）
        this.createGasState(4);
    },

    createSolidState(x) {
        const particles = [];
        const spacing = 0.5;

        for (let i = -2; i <= 2; i++) {
            for (let j = -2; j <= 2; j++) {
                const geometry = new THREE.SphereGeometry(0.15, 16, 16);
                const material = new THREE.MeshStandardMaterial({ color: 0x3B82F6 });
                const particle = new THREE.Mesh(geometry, material);
                particle.position.set(x + i * spacing, j * spacing, 0);
                particle.userData = { vibration: true };
                Scene3D.scene.add(particle);
                particles.push(particle);
            }
        }
    },

    createLiquidState(x) {
        const particles = [];
        for (let i = 0; i < 25; i++) {
            const geometry = new THREE.SphereGeometry(0.15, 16, 16);
            const material = new THREE.MeshStandardMaterial({ color: 0x10B981 });
            const particle = new THREE.Mesh(geometry, material);
            particle.position.set(
                x + (Math.random() - 0.5) * 3,
                Math.random() * 3,
                (Math.random() - 0.5) * 2
            );
            particle.userData = { flow: true };
            Scene3D.scene.add(particle);
            particles.push(particle);
        }
    },

    createGasState(x) {
        const particles = [];
        for (let i = 0; i < 20; i++) {
            const geometry = new THREE.SphereGeometry(0.1, 16, 16);
            const material = new THREE.MeshStandardMaterial({ color: 0xF59E0B });
            const particle = new THREE.Mesh(geometry, material);
            particle.position.set(
                x + (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 5
            );
            particle.userData = { diffuse: true };
            Scene3D.scene.add(particle);
            particles.push(particle);
        }
    }
};

// ================================
// 太阳系模块
// ================================

const SolarSystemModule = {
    planets: [],
    animationSpeed: 0.01,

    /**
     * 创建太阳系
     */
    createSolarSystem() {
        Scene3D.clearScene();

        // 创建太阳
        const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFBBF24 });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        Scene3D.scene.add(sun);

        // 创建点光源
        const sunLight = new THREE.PointLight(0xffffff, 2, 100);
        Scene3D.scene.add(sunLight);

        // 创建行星数据
        const planetData = [
            { name: '水星', radius: 0.15, distance: 2, speed: 4.74, color: 0xA0A0A0 },
            { name: '金星', radius: 0.25, distance: 3, speed: 3.50, color: 0xFFC649 },
            { name: '地球', radius: 0.26, distance: 4, speed: 2.98, color: 0x3B82F6 },
            { name: '火星', radius: 0.20, distance: 5, speed: 2.41, color: 0xEF4444 }
        ];

        planetData.forEach(data => {
            // 创建轨道
            const orbitGeometry = new THREE.RingGeometry(data.distance - 0.02, data.distance + 0.02, 64);
            const orbitMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide,
                opacity: 0.2,
                transparent: true
            });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2;
            Scene3D.scene.add(orbit);

            // 创建行星
            const planetGeometry = new THREE.SphereGeometry(data.radius, 32, 32);
            const planetMaterial = new THREE.MeshStandardMaterial({ color: data.color });
            const planet = new THREE.Mesh(planetGeometry, planetMaterial);
            planet.userData = { ...data, angle: Math.random() * Math.PI * 2 };
            Scene3D.scene.add(planet);
            this.planets.push(planet);
        });
    },

    /**
     * 更新行星位置（动画）
     */
    updatePlanets() {
        this.planets.forEach(planet => {
            planet.userData.angle += planet.userData.speed * this.animationSpeed;
            planet.position.x = Math.cos(planet.userData.angle) * planet.userData.distance;
            planet.position.z = Math.sin(planet.userData.angle) * planet.userData.distance;
        });
    }
};

// 导出模块
window.Scene3D = Scene3D;
window.GeometryModule = GeometryModule;
window.FractionModule = FractionModule;
window.MachinesModule = MachinesModule;
window.StatesModule = StatesModule;
window.SolarSystemModule = SolarSystemModule;

// 初始化场景
document.addEventListener('DOMContentLoaded', () => {
    Scene3D.init();
});
