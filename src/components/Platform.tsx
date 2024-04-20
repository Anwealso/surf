import type { Mesh } from "three";
import { useRef } from "react";
import type { BoxProps } from "@react-three/cannon";
import { useBox } from "@react-three/cannon";
import { useTexture } from "@react-three/drei";

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
  // const texture = useTexture("textures/long_white_tiles_ao_4k.jpg");
  // const texture = useTexture("textures/long_white_tiles_diff_4k.jpg");
  // const texture = useTexture("textures/rubber_tiles_diff_4k.jpg");
  const texture = useTexture("textures/square_tiles_diff_4k.jpg");
  // const texture = useTexture("textures/bg.jpg");

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry {...props} />
      {/* <meshPhongMaterial color="grey" /> */}
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

export default Platform;
