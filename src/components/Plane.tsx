import * as THREE from "three";
import { useRef } from "react";
import type { PlaneProps } from "@react-three/cannon";
import { usePlane } from "@react-three/cannon";

function Plane({
  size,
  ...props
}: PlaneProps & {
  size: [number, number];
}) {
  const [ref] = usePlane(
    () => ({ material: "ground", type: "Static", ...props }),
    useRef<Group>(null)
  );

  return (
    <group ref={ref}>
      <mesh receiveShadow>
        <planeGeometry args={size} />
        <meshStandardMaterial color="#909090" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default Plane;
