import * as THREE from "three";
import { useRef } from "react";
import type { BoxProps, Triplet } from "@react-three/cannon";
import { useBox } from "@react-three/cannon";

function Platform({ ...props }: BoxProps) {
  const [ref] = useBox(
    () => ({
      material: "ground",
      type: "Static",
      ...props,
    }),
    useRef<Group>(null)
  );

  return (
    <group ref={ref}>
      <mesh receiveShadow>
        <boxGeometry {...props} />
        <meshStandardMaterial color="#909090" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default Platform;
