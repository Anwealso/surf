import type { BodyProps, Triplet } from "@react-three/cannon";
import { useMemo, useRef } from "react";
import { Group } from "three";
import { RampSectionProps } from "./segments/SegmentHelpers";
import PerfectTriangle from "./segments/PerfectTriangle";
import FlatSideTriangle from "./segments/FlatSideTriangle";
import FlatTopTriangle from "./segments/FlatTopTriangle";
import { RollerCoasterLiftersGeometry } from "three/examples/jsm/Addons.js";

export enum TwistAxis {
  x,
  y,
}

type RampProps = Pick<BodyProps, "position" | "rotation"> & {
  twist: { axis: TwistAxis; w: number; v: number };
  rampDensity: number;
  setPosition?: (position: Triplet) => void;
  setRotation?: (rotation: Triplet) => void;
};

function Ramp({
  position,
  rotation,
  twist,
  rampDensity,
}: RampProps): JSX.Element {
  const ref = useRef<Group>(null!);

  const dtheta: number = 0.1;
  const dy: number = 0.635;
  const dz: number = 4;

  // function getRampSections(
  //   twist: { axis: TwistAxis; w: number; v: number },
  //   rampDensity: number
  // ): RampSectionProps[] {
  //   let rampSections: RampSectionProps[] = [];

  //   // const numSections = Math.max(twist.v * rampDensity);
  //   // for (let i: number = 0; i < numSections; i++) {
  //   //   childRefs.push(useRef<Group>(null!));

  //   //   const help = pointToWorld()

  //   //   // Create the ramp section in the original "relative to our local origin" format
  //   //   const original = {
  //   //     position: pointToWorld[position![0], position![1] + dy * i, position![2] - dz * i],
  //   //     rotation: [rotation![0] + dtheta * i, rotation![1], rotation![2]],
  //   //   };

  //   //   // Rotate those coordinates according to the parents orientatio to ge the e world position

  //   //   // Update by applying a quaternion transformation
  //   //   const adjusted = body.quaternion.set(
  //   //     mesh.quaternion.x,
  //   //     mesh.quaternion.y,
  //   //     mesh.quaternion.z,
  //   //     mesh.quaternion.w
  //   //   );

  //   //   rampSections.push(adjusted);
  //   // }

  //   rampSections = [
  //     {
  //       position: [position![0], position![1], position![2]],
  //       rotation: [rotation![0], rotation![1], rotation![2]],
  //     },
  //     {
  //       position: [position![0], position![1] + dy * 1, position![2] - dz * 1],
  //       rotation: [rotation![0] + dtheta * 1, rotation![1], rotation![2]],
  //     },
  //     {
  //       position: [position![0], position![1] + dy * 2, position![2] - dz * 2],
  //       rotation: [rotation![0] + dtheta * 2, rotation![1], rotation![2]],
  //     },
  //     {
  //       position: [0, 0, -12],
  //       rotation: [0, 0, 0],
  //     },
  //   ];

  //   return rampSections;
  // }

  // const rampSections = useMemo(
  //   () => getRampSections(twist, rampDensity),
  //   [position, rotation]
  // );
  // const rampSections = useMemo(() => getRampSections(), []);

  const rampSections: RampSectionProps[] = [
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
      {rampSections.map((rampSectionArgs: RampSectionProps, i) => (
        <FlatSideTriangle
          // parentRef={ref}
          // ref={childRefs[i]}
          position={rampSectionArgs.position}
          rotation={rampSectionArgs.rotation}
          size={[dz, dz, dz]}
          key={i}
        />
      ))}
    </group>
  );
}

export default Ramp;
