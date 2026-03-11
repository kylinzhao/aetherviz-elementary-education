import { useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';

// 视角控制 Hook
export function useViewControls(defaultPosition: [number, number, number] = [0, 5, 10]) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);

  // 一键回正
  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(...defaultPosition);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  // 顶视图(从正上方看)
  const topView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 15, 0);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  // 前视图(从正前方看)
  const frontView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 2, 12);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  // 侧视图(从右侧看)
  const sideView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(12, 2, 0);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  // 等轴视图(3D 视角)
  const isoView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(8, 8, 8);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  return {
    cameraRef,
    controlsRef,
    resetView,
    topView,
    frontView,
    sideView,
    isoView,
  };
}

// 视角控制按钮组件
interface ViewControlButtonsProps {
  onReset: () => void;
  onTopView: () => void;
  onFrontView: () => void;
  onSideView: () => void;
  onIsoView?: () => void;
}

export function ViewControlButtons({
  onReset,
  onTopView,
  onFrontView,
  onSideView,
  onIsoView,
}: ViewControlButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={onReset}
        className="px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm font-bold transition-colors"
        title="恢复默认视角"
      >
        🔄 回正
      </button>
      <button
        onClick={onTopView}
        className="px-3 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white text-sm font-bold transition-colors"
        title="顶视图"
      >
        ⬇️ 顶视
      </button>
      <button
        onClick={onFrontView}
        className="px-3 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white text-sm font-bold transition-colors"
        title="前视图"
      >
        ➡️ 前视
      </button>
      <button
        onClick={onSideView}
        className="px-3 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white text-sm font-bold transition-colors"
        title="侧视图"
      >
        ⬇️ 侧视
      </button>
      {onIsoView && (
        <button
          onClick={onIsoView}
          className="px-3 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg text-white text-sm font-bold transition-colors"
          title="等轴视图"
        >
          🎲 3D
        </button>
      )}
    </div>
  );
}
