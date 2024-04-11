import * as THREE from "three";
import { useRef } from "react";
import type { PlaneProps } from "@react-three/cannon";
import { usePlane } from "@react-three/cannon";

function Plane({
  position,
  rotation,
  size,
  ...props
}: PlaneProps & {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
}) {
  const [ref] = usePlane(
    () => ({
      material: "ground",
      type: "Static",
      ...props,
    }),
    useRef<Group>(null)
  );

  // Allows us to dictate the plane rotation from the horizontal rather than the vertical in the parent
  rotation = [rotation[0] - Math.PI / 2, rotation[1], rotation[2]];

  return (
    <group ref={ref}>
      <mesh ref={ref} position={position} rotation={rotation} receiveShadow>
        <planeGeometry args={size} />
        <meshStandardMaterial color="#909090" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default Plane;
