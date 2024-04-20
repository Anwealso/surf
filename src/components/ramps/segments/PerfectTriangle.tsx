import type { Triplet } from "@react-three/cannon";
import { useConvexPolyhedron } from "@react-three/cannon";
import { useMemo, useRef } from "react";
import { BufferAttribute, BufferGeometry, type Mesh } from "three";
import {
  type RampSectionProps,
  toConvexProps,
  RAMP_RATIO,
} from "./SegmentHelpers";

function PerfectTriangle({
  position,
  rotation,
  size = [1, 1, 1],
}: RampSectionProps) {
  const geometry = getGeometry(size);
  const args = useMemo(() => toConvexProps(geometry), [geometry]);
  const [ref] = useConvexPolyhedron(
    () => ({
      material: "ground",
      type: "Static",
      args,
      position,
      rotation,
    }),
    useRef<Mesh>(null)
  );

  function getGeometry(size: Triplet): BufferGeometry {
    const geometry = new BufferGeometry();

    // Width of the sloped section of the ramp
    const slopeWidth: number = 1 / RAMP_RATIO / 2;

    const vertices = new Float32Array([
      // Front face points
      ...[-slopeWidth, 0, -0.5],
      ...[0, 1, -0.5],
      ...[+slopeWidth, 0, -0.5],
      // Back face points
      ...[-slopeWidth, 0, 0.5],
      ...[0, 1, 0.5],
      ...[+slopeWidth, 0, 0.5],
    ]);

    const indices = [
      // Front face
      ...[0, 1, 2],
      // Back face
      ...[3, 5, 4],
      // Left face
      ...[0, 3, 4],
      ...[0, 4, 1],
      // Right face
      ...[2, 4, 5],
      ...[2, 1, 4],
      // Bottom face
      ...[0, 2, 5],
      ...[0, 5, 3],
    ];

    // Add the indices and vertices
    geometry.setIndex(indices);
    geometry.setAttribute("position", new BufferAttribute(vertices, 3));

    // Compute and normalise normals
    geometry.computeVertexNormals();
    geometry.normalizeNormals();

    // Scale the geometry as desired
    geometry.scale(...size);

    return geometry;
  }

  return (
    <mesh castShadow receiveShadow {...{ geometry, position, ref, rotation }}>
      <meshStandardMaterial wireframe color="blue" />
      {/* <meshStandardMaterial color={"blue"} side={DoubleSide} /> */}
      {/* <meshNormalMaterial side={DoubleSide} /> */}
    </mesh>
  );
}

export default PerfectTriangle;
