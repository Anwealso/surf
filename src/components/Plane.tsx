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
      material: "ground",
      type: "Static",
      ...props,
    }),
    useRef<Group>(null)
  );

  // Allows us to dictate the plane rotation from the horizontal rather than the vertical in the parent
  return (
    <group ref={ref}>
      <mesh receiveShadow>
        <planeGeometry args={args} />
        <meshStandardMaterial color="#909090" side={DoubleSide} />
      </mesh>
    </group>
  );
}

export default Plane;
