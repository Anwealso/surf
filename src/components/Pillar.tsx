import { useRef } from "react";
import type { CylinderArgs, CylinderProps } from "@react-three/cannon";
import { useCylinder } from "@react-three/cannon";
import type { Mesh } from "three";

function Pillar(props: CylinderProps) {
  const args: CylinderArgs = [0.7, 0.7, 5, 16];
  const [ref] = useCylinder(
    () => ({
      args,
      mass: 10,
      ...props,
    }),
    useRef<Mesh>(null)
  );
  return (
    <mesh ref={ref} castShadow>
      <cylinderGeometry args={args} />
      <meshNormalMaterial />
    </mesh>
  );
}

export default Pillar;
