import type { BodyProps, Triplet } from "@react-three/cannon";
import {
  useMemo,
  // useMemo,
  useRef,
} from "react";
import { Group, Matrix4, Object3D, Vector3 } from "three";
import { RampSectionProps } from "./segments/SegmentHelpers";
// import PerfectTriangle from "./segments/PerfectTriangle";
import FlatSideTriangle from "./segments/FlatSideTriangle";
// import FlatTopTriangle from "./segments/FlatTopTriangle";

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
  const numSections = Math.max(twist.v / rampDensity);
  const crossSectionScale: number = 4;

  function getRampSections(): RampSectionProps[] {
    let rampSections: RampSectionProps[] = [];

    for (let i: number = 0; i <= numSections; i++) {
      // Create the ramp section in the original "relative to our local origin" format
      const bodyFrameCoords = new Object3D();
      bodyFrameCoords.position.set(
        twist.axis == TwistAxis.y
          ? twist.v * (1 - Math.cos((i / numSections) * twist.w))
          : 0,
        twist.axis == TwistAxis.x
          ? twist.v * (1 - Math.cos((i / numSections) * twist.w))
          : 0,
        -twist.v * Math.sin(twist.w * (i / numSections))
      );
      bodyFrameCoords.rotation.set(
        twist.axis == TwistAxis.x ? twist.w * (i / numSections) : 0,
        twist.axis == TwistAxis.y ? -twist.w * (i / numSections) : 0,
        0
      );

      // Rotate those coordinates according to the parents orientation to get the world position
      const worldFrameCoords = bodyFrameCoords.copy(bodyFrameCoords);
      const positionVector: Vector3 = new Vector3(...position!);
      const rotationVector: Vector3 = new Vector3(...rotation!);
      const theta: number = rotationVector.length();
      const x: number = rotationVector.x;
      const y: number = rotationVector.y;
      const z: number = rotationVector.z;

      // console.log(positionVector);

      worldFrameCoords.applyMatrix4(
        new Matrix4(
          ...[
            x * x * (1 - Math.cos(theta)) + Math.cos(theta),
            y * x * (1 - Math.cos(theta)) - z * Math.sin(theta),
            z * x * (1 - Math.cos(theta)) + y * Math.sin(theta),
            positionVector.x,
          ],
          ...[
            x * y * (1 - Math.cos(theta)) + z * Math.sin(theta),
            y * y * (1 - Math.cos(theta)) + Math.cos(theta),
            z * y * (1 - Math.cos(theta)) - x * Math.sin(theta),
            positionVector.y,
          ],
          ...[
            x * z * (1 - Math.cos(theta)) - y * Math.sin(theta),
            y * z * (1 - Math.cos(theta)) + x * Math.sin(theta),
            z * z * (1 - Math.cos(theta)) + Math.cos(theta),
            positionVector.z,
          ],
          ...[0, 0, 0, 1]
        )
      );

      const sectionPosition: RampSectionProps = {
        position: [
          worldFrameCoords.position.x,
          worldFrameCoords.position.y,
          worldFrameCoords.position.z,
        ],
        rotation: [
          worldFrameCoords.rotation.x,
          worldFrameCoords.rotation.y,
          worldFrameCoords.rotation.z,
        ],
      };

      rampSections.push(sectionPosition);
    }

    return rampSections;
  }

  const rampSections = useMemo(() => getRampSections(), []);

  return (
    <group ref={ref}>
      {rampSections.map((rampSectionArgs: RampSectionProps, i) => (
        <FlatSideTriangle
          position={rampSectionArgs.position}
          rotation={rampSectionArgs.rotation}
          size={[
            crossSectionScale,
            crossSectionScale,
            crossSectionScale * rampDensity,
          ]}
          key={i}
        />
      ))}
    </group>
  );
}

export default Ramp;
