import type { Mesh } from "three";
import { DoubleSide } from "three";
import { useRef } from "react";
import type { BoxProps } from "@react-three/cannon";
import { useBox } from "@react-three/cannon";

function Triramp({ ...props }: BoxProps) {
  const [ref] = useBox(
    () => ({
      material: "ground",
      type: "Static",
      ...props,
    }),
    useRef<Mesh>(null)
  );

  return (
    <mesh ref={ref} receiveShadow>
      <boxGeometry {...props} />
      <meshStandardMaterial color="#3333FF" side={DoubleSide} />
    </mesh>
  );
}

export default Triramp;
