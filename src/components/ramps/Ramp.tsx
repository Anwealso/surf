import type { BodyProps, Triplet } from "@react-three/cannon";
import { useMemo, useRef } from "react";
import { Group, Matrix4, Object3D } from "three";
import { RampSectionProps } from "./segments/SegmentHelpers";
import PerfectTriangle from "./segments/PerfectTriangle";
import FlatSideTriangle from "./segments/FlatSideTriangle";
import FlatTopTriangle from "./segments/FlatTopTriangle";
import { useTexture } from "@react-three/drei";
import { slipperyMaterial } from "../Materials";

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

const CROSS_SECTION_SCALE: number = 10;

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
  const numSections = Math.ceil(Math.abs(twist.v) / segmentLegth);

  function getRampSections(): RampSectionProps[] {
    const rampSections: RampSectionProps[] = [];

    for (let i: number = 0; i < numSections; i++) {
      // Create the ramp section in the body frame coords format
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

      // Rotate those coordinates according to the parents orientation to get the world position
      const worldFrameCoords = bodyFrameCoords.copy(bodyFrameCoords);
      const alpha: number = rotation![0]; // rotation about the world x axis
      const beta: number = rotation![1]; // rotation about the world y axis
      const gamma: number = rotation![2]; // rotation about the world z axis

      // Compute homogeneous transformation matrix
      // Using extrinsic rotation matrix
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

  const rampSections = useMemo(() => getRampSections(), [segmentLegth]);

  // const texture = useTexture("textures/ramp_basic.jpg");
  const texture = useTexture(
    "textures/PrototypeTextures_kenney/PNG/Orange/texture_02.png"
  );

  // const texture = useTexture("textures/square_tiles_diff_4k.jpg");
  // const texture = useTexture("textures/crate.jpeg");
  // const texture = useTexture("textures/ashen_dunes.png");

  // const texture = useTexture("textures/seamlessTextures/100_1449_seamless.JPG");

  // const texture = useTexture("textures/ashen_dunes.png");
  // texture.offset = new Vector2(0, 2);

  // const texture = useTexture("textures/uv.png");
  // const texture = new TextureLoader().load(
  //   "textures/land_ocean_ice_cloud_2048.jpg"
  // );

  const renderMaterial = <meshBasicMaterial map={texture} />;
  const physicsMaterial = slipperyMaterial;

  return (
    <group ref={ref}>
      {(() => {
        switch (crossSection) {
          case CrossSection.PerfectTriangle:
            return rampSections.map((rampSectionArgs: RampSectionProps, i) => (
              <PerfectTriangle
                position={rampSectionArgs.position}
                rotation={rampSectionArgs.rotation}
                size={[CROSS_SECTION_SCALE, CROSS_SECTION_SCALE, segmentLegth]}
                physicsMaterial={physicsMaterial}
                renderMaterial={renderMaterial}
                key={i}
                userData={{ id: "ramp" }}
                {...props}
              />
            ));
          case CrossSection.FlatSideTriangle:
            return rampSections.map((rampSectionArgs: RampSectionProps, i) => (
              <FlatSideTriangle
                position={rampSectionArgs.position}
                rotation={rampSectionArgs.rotation}
                size={[CROSS_SECTION_SCALE, CROSS_SECTION_SCALE, segmentLegth]}
                physicsMaterial={physicsMaterial}
                renderMaterial={renderMaterial}
                key={i}
                userData={{ id: "ramp" }}
                {...props}
              />
            ));
          case CrossSection.FlatTopTriangle:
            return rampSections.map((rampSectionArgs: RampSectionProps, i) => (
              <FlatTopTriangle
                position={rampSectionArgs.position}
                rotation={rampSectionArgs.rotation}
                size={[CROSS_SECTION_SCALE, CROSS_SECTION_SCALE, segmentLegth]}
                physicsMaterial={physicsMaterial}
                renderMaterial={renderMaterial}
                key={i}
                userData={{ id: "ramp" }}
                {...props}
              />
            ));
        }
      })()}
    </group>
  );
}

export default Ramp;
