import { useRef } from "react";
import type { PlaneProps } from "@react-three/cannon";
import { usePlane } from "@react-three/cannon";

function Plane(props: PlaneProps) {
  const [ref] = usePlane(
    () => ({ material: "ground", type: "Static", ...props }),
    useRef<Group>(null)
  );
  return (
    <group ref={ref}>
      <mesh receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#909090" />
      </mesh>
    </group>
  );
}

export default Plane;
