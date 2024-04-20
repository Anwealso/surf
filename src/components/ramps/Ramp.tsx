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
  const numSections = Math.floor(twist.v / segmentLegth);
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
      const positionVector: Vector3 = new Vector3(...position!);
      const rotationVector: Vector3 = new Vector3(...rotation!);
      const theta: number = rotationVector.length();
      rotationVector.normalize();
      const x: number = rotationVector.x;
      const y: number = rotationVector.y;
      const z: number = rotationVector.z;

      // console.log(positionVector);
      // console.log(`theta: ${theta / Math.PI} * PI`);
      // console.log(`x: ${x}`);
      // console.log(`y: ${y}`);
      // console.log(`z: ${z}`);
      // console.log("===============================");

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
