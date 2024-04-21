import { RepeatWrapping, Vector2, type Mesh } from "three";
import { useRef } from "react";
import type { BoxProps } from "@react-three/cannon";
import { useBox } from "@react-three/cannon";
import { useTexture } from "@react-three/drei";

function Box({ ...props }: BoxProps) {
  const [ref] = useBox(
    () => ({
      material: "ground",
      type: "Static",
      ...props,
    }),
    useRef<Mesh>(null)
  );

  const texture = useTexture("textures/square_tiles_diff_4k.jpg");
  const textureScale: number = 0.4;

  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat = new Vector2(60 / 20 / textureScale, 20 / 20 / textureScale);

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry {...props} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

export default Box;
