import * as THREE from "three";
import { useRef } from "react";
import * as R3F from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

function Skybox(props: R3F.ThreeElements["mesh"]) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const texture = useTexture("textures/bg.jpeg");

  return (
    <mesh {...props} ref={meshRef}>
      <planeGeometry args={[6, 3]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

export default Skybox;
