import type { BodyProps, Triplet } from "@react-three/cannon";
import { useRef } from "react";
import ConvexPolyRamp from "./segments/ConvexPolyRamp";
import type { ConvexPolyRampProps } from "./segments/ConvexPolyRamp";
import { Group } from "three";

type RampProps = Pick<BodyProps, "position" | "rotation"> & {
  length: number;
  setPosition?: (position: Triplet) => void;
  setRotation?: (rotation: Triplet) => void;
};

function Ramp({
  position,
  rotation,
}: // length,
// setPosition,
// setRotation,
RampProps): JSX.Element {
  const ref = useRef<Group>(null!);

  const dtheta: number = 0.1;
  const dy: number = 0.635;
  const dz: number = 4;

  const sections: ConvexPolyRampProps[] = [
    {
      position: [position![0], position![1], position![2]],
      rotation: [rotation![0], rotation![1], rotation![2]],
    },
    {
      position: [position![0], position![1] + dy * 0.8, position![2] - dz * 1],
      rotation: [rotation![0] + dtheta * 1, rotation![1], rotation![2]],
    },
    {
      position: [position![0], position![1] + dy * 2, position![2] - dz * 2],
      rotation: [rotation![0] + dtheta * 2, rotation![1], rotation![2]],
    },
    {
      position: [position![0], position![1] + dy * 4, position![2] - dz * 3],
      rotation: [rotation![0] + dtheta * 3, rotation![1], rotation![2]],
    },
  ];

  return (
    <group ref={ref}>
      {sections.map((args: ConvexPolyRampProps, i) => (
        <ConvexPolyRamp
          position={args.position}
          rotation={args.rotation}
          key={i}
        />
      ))}
    </group>
  );
}

export default Ramp;
