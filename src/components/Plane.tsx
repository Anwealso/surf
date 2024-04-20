import { useRef } from "react";
import type { PlaneProps } from "@react-three/cannon";
import { usePlane } from "@react-three/cannon";
import { Group } from "three";
import { useTexture } from "@react-three/drei";

function Plane({
  args,
  ...props
}: PlaneProps & {
  args: [number, number];
}) {
  const [ref] = usePlane(
    () => ({
      ...props,
    }),
    useRef<Group>(null)
  );

  // const texture = useTexture("textures/bg.jpeg");
  // const texture = useTexture("textures/long_white_tiles_ao_4k.jpg");
  // const texture = useTexture("textures/long_white_tiles_diff_4k.jpg");
  // const texture = useTexture("textures/rubber_tiles_diff_4k.jpg");
  // const texture = useTexture("textures/square_tiles_diff_4k.jpg");
  // const texture = useTexture("textures/bg.jpeg");

  return (
    <group ref={ref}>
      <mesh receiveShadow>
        <planeGeometry args={args} />
        <meshBasicMaterial color="white" />
        {/* <meshBasicMaterial map={texture} /> */}
      </mesh>
    </group>
  );
}

export default Plane;
