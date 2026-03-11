import React, { useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';

interface ControlledSceneProps {
  children: React.ReactNode;
  defaultPosition?: [number, number, number];
  cameraRef?: React.RefObject<THREE.PerspectiveCamera>;
  controlsRef?: React.RefObject<any>;
}

export function ControlledScene({
  children,
  defaultPosition = [0, 5, 10],
  cameraRef,
  controlsRef,
}: ControlledSceneProps) {
  return (
    <>
      <PerspectiveCamera makeDefault ref={cameraRef} position={defaultPosition} fov={60} />
      <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
      {children}
    </>
  );
}
