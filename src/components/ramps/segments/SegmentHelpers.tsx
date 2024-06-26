import type { ConvexPolyhedronProps, Triplet } from "@react-three/cannon";
import { BufferGeometry } from "three";
import { Geometry } from "three-stdlib";

// export const RAMP_RATIO: number = 544 / 512; // height/width
export const RAMP_RATIO: number = 1 / 1;

export type RampSectionProps = ConvexPolyhedronProps & {
  physicsMaterial:
    | string
    | {
        name: string | undefined;
        friction?: number | undefined;
        restitution?: number | undefined;
      }
    | undefined;
  renderMaterial: JSX.Element;
  size: Triplet;
};

export function toConvexProps(
  bufferGeometry: BufferGeometry
): [vertices: Triplet[], faces: Triplet[]] {
  const geo = new Geometry().fromBufferGeometry(bufferGeometry);
  geo.mergeVertices();
  const vertices: Triplet[] = geo.vertices.map((v) => [v.x, v.y, v.z]);
  const faces: Triplet[] = geo.faces.map((f) => [f.a, f.b, f.c]);
  return [vertices, faces];
}
