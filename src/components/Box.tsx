import { RepeatWrapping, Vector2, type Mesh } from "three";
import { useRef } from "react";
import type { BoxProps } from "@react-three/cannon";
import { useBox } from "@react-three/cannon";
import { useTexture } from "@react-three/drei";
import { groundMaterial } from "./Materials";

function Box({ ...props }: BoxProps) {
  const [ref] = useBox(
    () => ({
      material: groundMaterial,
      type: "Static",
      ...props,
    }),
    useRef<Mesh>(null)
  );

  // const texture = useTexture("textures/square_tiles_diff_4k.jpg");
  // const texture = useTexture("textures/ashen_dunes.png");
  // const texture = useTexture("textures/rubber_tiles_diff_4k.jpg");

  const texture = useTexture("textures/asphalt_04_diff_4k.jpg");
  // const texture = useTexture("textures/wests_textures/paving 5.png");

  // const texture = useTexture("textures/uv.png");
  // const texture = useTexture("textures/ashen_dunes.png");

  const textureScale: number = 0.2;
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
