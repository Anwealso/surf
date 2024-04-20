import type { BodyProps, Triplet } from "@react-three/cannon";
import { useMemo, useRef } from "react";
import { Group, Matrix4, Object3D, Vector3 } from "three";
import { RampSectionProps } from "./segments/SegmentHelpers";
import PerfectTriangle from "./segments/PerfectTriangle";
import FlatSideTriangle from "./segments/FlatSideTriangle";
import FlatTopTriangle from "./segments/FlatTopTriangle";
import { useTexture } from "@react-three/drei";

export enum TwistAxis {
  x,
  y,
}

export enum CrossSection {
  PerfectTriangle,
  FlatSideTriangle,
  FlatTopTriangle,
}

type RampProps = Pick<BodyProps, "position" | "rotation"> & {
  crossSection: CrossSection;
  twist: { axis: TwistAxis; w: number; v: number };
  segmentLegth: number;
  setPosition?: (position: Triplet) => void;
  setRotation?: (rotation: Triplet) => void;
};

function Ramp({
  position,
  rotation,
  crossSection,
  twist,
  segmentLegth,
  ...props
}: RampProps): JSX.Element {
  const ref = useRef<Group>(null!);

  const r = twist.w == 0 ? twist.v : twist.v / twist.w;
  const numSections = Math.floor(Math.abs(twist.v) / segmentLegth);
  const crossSectionScale: number = 4;

  function getRampSections(): RampSectionProps[] {
    let rampSections: RampSectionProps[] = [];

    for (let i: number = 0; i <= numSections; i++) {
      // Create the ramp section in the original "relative to our local origin" format
      const bodyFrameCoords = new Object3D();
      bodyFrameCoords.position.set(
        twist.axis == TwistAxis.y
          ? r * (1 - Math.cos(i * (twist.w / numSections)))
          : 0,
        twist.axis == TwistAxis.x
          ? r * (1 - Math.cos(i * (twist.w / numSections)))
          : 0,
        twist.w == 0
          ? -r * (i / numSections)
          : -r * Math.sin(i * (twist.w / numSections))
      );
      bodyFrameCoords.rotation.set(
        twist.axis == TwistAxis.x ? twist.w * (i / numSections) : 0,
        twist.axis == TwistAxis.y ? -twist.w * (i / numSections) : 0,
        0
      );

      console.log(bodyFrameCoords.position);

      // Rotate those coordinates according to the parents orientation to get the world position
      const worldFrameCoords = bodyFrameCoords.copy(bodyFrameCoords);
      const alpha: number = rotation![0]; // rotation about the world x axis
      const beta: number = rotation![1]; // rotation about the world y axis
      const gamma: number = rotation![2]; // rotation about the world z axis

      // Compute homogeneous transformation matrix
      // Using extrinsic rotation matrix ()
      worldFrameCoords.applyMatrix4(
        new Matrix4(
          ...[
            Math.cos(beta) * Math.cos(gamma),
            Math.sin(alpha) * Math.sin(beta) * Math.cos(gamma) -
              Math.cos(alpha) * Math.sin(gamma),
            Math.cos(alpha) * Math.sin(beta) * Math.cos(gamma) +
              Math.sin(alpha) * Math.sin(gamma),
            position![0],
          ],
          ...[
            Math.cos(beta) * Math.sin(gamma),
            Math.sin(alpha) * Math.sin(beta) * Math.sin(gamma) +
              Math.cos(alpha) * Math.cos(gamma),
            Math.cos(alpha) * Math.sin(beta) * Math.sin(gamma) -
              Math.sin(alpha) * Math.cos(gamma),
            position![1],
          ],
          ...[
            -Math.sin(beta),
            Math.sin(alpha) * Math.cos(beta),
            Math.cos(alpha) * Math.cos(beta),
            position![2],
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

  // const texture = useTexture("textures/long_white_tiles_ao_4k.jpg");
  const material = <meshStandardMaterial wireframe color="blue" />;
  // const material = <meshStandardMaterial color={"blue"} />;
  // const material = <meshBasicMaterial map={texture} />;
  // const material = <meshNormalMaterial />;
  return (
    <group ref={ref}>
      {(() => {
        switch (crossSection) {
          case CrossSection.PerfectTriangle:
            return rampSections.map((rampSectionArgs: RampSectionProps, i) => (
              <PerfectTriangle
                position={rampSectionArgs.position}
                rotation={rampSectionArgs.rotation}
                size={[crossSectionScale, crossSectionScale, segmentLegth]}
                material={material}
                key={i}
                {...props}
              />
            ));
          case CrossSection.FlatSideTriangle:
            return rampSections.map((rampSectionArgs: RampSectionProps, i) => (
              <FlatSideTriangle
                position={rampSectionArgs.position}
                rotation={rampSectionArgs.rotation}
                size={[crossSectionScale, crossSectionScale, segmentLegth]}
                material={material}
                key={i}
                {...props}
              />
            ));
          case CrossSection.FlatTopTriangle:
            return rampSections.map((rampSectionArgs: RampSectionProps, i) => (
              <FlatTopTriangle
                position={rampSectionArgs.position}
                rotation={rampSectionArgs.rotation}
                size={[crossSectionScale, crossSectionScale, segmentLegth]}
                material={material}
                key={i}
                {...props}
              />
            ));
        }
      })()}
    </group>
  );
}

export default Ramp;
