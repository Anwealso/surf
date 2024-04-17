import { useRef } from "react";
import type { PlaneProps } from "@react-three/cannon";
import { usePlane } from "@react-three/cannon";
import { DoubleSide, Group } from "three";

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
        <meshStandardMaterial color="white" side={DoubleSide} />
      </mesh>
    </group>
  );
}

export default Plane;
