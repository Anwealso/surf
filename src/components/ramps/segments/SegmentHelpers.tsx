import type { ConvexPolyhedronProps, Triplet } from "@react-three/cannon";
import { BufferGeometry } from "three";
import { Geometry } from "three-stdlib";

// export const RAMP_RATIO: number = 544 / 512;
export const RAMP_RATIO: number = 1 / 1.2;

export type RampSectionProps = ConvexPolyhedronProps & {
  size?: Triplet;
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
