import { SphereProps, useSphere } from "@react-three/cannon";
import { TorusKnot } from "@react-three/drei";
import { useRef } from "react";
import { Mesh } from "three";

const Cheerio = ({
  args = [0.1],
}: // position,
Pick<SphereProps, "args" | "position">) => {
  const [ref] = useSphere(
    () => ({ args: [0.1], mass: 1, position: [2, 2, 2] }),
    useRef<Mesh>(null)
  );
  const [radius] = args;

  // const cylArgs: CylinderArgs = [0.7, 0.7, 5, 16];

  return (
    <TorusKnot ref={ref} args={[radius, radius / 2]}>
      <meshNormalMaterial />
    </TorusKnot>
  );
};
// <Cylinder ref={ref} args={cylArgs}>
// </Cylinder>

export default Cheerio;