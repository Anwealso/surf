import type { BodyProps, Triplet } from "@react-three/cannon";
import { useRef } from "react";
import ConvexPolyRamp from "./segments/ConvexPolyRamp";
import type { ConvexPolyRampProps } from "./segments/ConvexPolyRamp";

type RampProps = Pick<BodyProps, "position" | "rotation"> & {
  length: number;
  setPosition?: (position: Triplet) => void;
  setRotation?: (rotation: Triplet) => void;
};

function Ramp({
  position,
  rotation,
  length,
  setPosition,
  setRotation,
}: RampProps): JSX.Element {
  const ref = useRef<THREE.Mesh>(null!);

  const sections: ConvexPolyRampProps[] = [
    {
      position: [position![0] + 0, position![1], position![2]],
      rotation: [rotation![0] + 0.1, rotation![1], rotation![2]],
    },
    {
      position: [position![0] + 5, position![1], position![2]],
      rotation: [
        rotation![0] + 0.1,
        rotation![1] + 0.2,
        rotation![2] + Math.PI,
      ],
    },
  ];

  return (
    <group ref={ref}>
      {sections.map((args: ConvexPolyRampProps) => (
        <ConvexPolyRamp position={args.position} rotation={args.rotation} />
      ))}
    </group>
  );
}

export default Ramp;
