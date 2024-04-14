import type { Mesh } from "three";
import { DoubleSide } from "three";
import { useRef } from "react";
import type { BoxProps } from "@react-three/cannon";
import { useBox } from "@react-three/cannon";

function Platform({ ...props }: BoxProps) {
  const [ref] = useBox(
    () => ({
      material: "ground",
      type: "Static",
      ...props,
    }),
    useRef<Mesh>(null)
  );

  // const texture = useTexture("textures/bg.jpeg");

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry {...props} />
      <meshStandardMaterial color="#FFFFFF" side={DoubleSide} />
      {/* <meshBasicMaterial map={texture} /> */}
    </mesh>
  );
}

export default Platform;
