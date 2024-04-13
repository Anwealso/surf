import { type Mesh, type Group, DoubleSide } from "three";
import { useRef } from "react";
import type { BoxProps, Triplet } from "@react-three/cannon";
import { useCompoundBody } from "@react-three/cannon";

function Composite({ ...props }: BoxProps) {
  const position1: Triplet = [0, 0, 0];
  const position2: Triplet = [1, 0, 0];
  const boxSize: Triplet = [1, 1, 1];
  const sphereRadius: number = 20;

  const [ref] = useCompoundBody(
    () => ({
      ...props,
      shapes: [
        {
          args: boxSize,
          position: position1,
          rotation: [0, 0, 0],
          type: "Box",
        },
        {
          args: [sphereRadius],
          position: position2,
          rotation: [0, 0, 0],
          type: "Sphere",
        },
      ],
    }),
    useRef<Group>(null)
  );

  return (
    <group ref={ref}>
      <mesh castShadow>
        <boxGeometry args={boxSize} />
        <meshNormalMaterial side={DoubleSide} />
      </mesh>
      <mesh castShadow position={position2}>
        <sphereGeometry args={[sphereRadius, 16, 16]} />
        <meshNormalMaterial side={DoubleSide} />
      </mesh>
    </group>
  );
}

export default Composite;
