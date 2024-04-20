import { useRef } from "react";
import type { PlaneProps } from "@react-three/cannon";
import { usePlane } from "@react-three/cannon";
import { Group } from "three";
// import { useTexture } from "@react-three/drei";

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

  return (
    <group ref={ref}>
      <mesh receiveShadow>
        <planeGeometry args={args} />
        <meshBasicMaterial color="white" />
      </mesh>
    </group>
  );
}

export default Plane;
