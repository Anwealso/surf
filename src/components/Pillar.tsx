import { useRef } from "react";
import type { CylinderArgs, CylinderProps, Triplet } from "@react-three/cannon";
import { useCylinder } from "@react-three/cannon";
import type { Mesh } from "three";
import { Cylinder } from "@react-three/drei";

function Pillar(props: CylinderProps, position: Triplet) {
  const args: CylinderArgs = [0.7, 0.7, 5, 16];

  const [ref] = useCylinder(
    () => ({
      args,
      mass: 1,
      position: position, // does this do anything?????
      ...props,
    }),
    useRef<Mesh>(null)
  );
  return (
    <Cylinder ref={ref} args={args}>
      <meshNormalMaterial />
    </Cylinder>
  );
}

export default Pillar;
