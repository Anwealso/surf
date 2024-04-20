import type { Triplet } from "@react-three/cannon";
import { useConvexPolyhedron } from "@react-three/cannon";
import { useMemo, useRef } from "react";
import { BufferAttribute, BufferGeometry, type Mesh } from "three";
import {
  type RampSectionProps,
  toConvexProps,
  RAMP_RATIO,
} from "./SegmentHelpers";

function FlatSideTriangle({
  position,
  rotation,
  material,
  size = [1, 1, 1],
  ...props
}: RampSectionProps & { material: JSX.Element }): JSX.Element {
  // const meshRef = useRef<Group>(null!);
  const geometry = getScaledGeometry(size);
  const args = useMemo(() => toConvexProps(geometry), [geometry]);
  const [ref, _] = useConvexPolyhedron(
    () => ({
      material: "ground",
      type: "Static",
      args,
      position,
      rotation,
      ...props,
    }),
    useRef<Mesh>(null)
  );

  function getScaledGeometry(size: Triplet): BufferGeometry {
    const geometry = new BufferGeometry();

    const baseHeight: number = 0.2;
    // Width of the sloped section of the ramp
    const slopeWidth: number = (1 - baseHeight) / RAMP_RATIO / 2;

    const vertices = new Float32Array([
      // Front face points
      ...[-slopeWidth, baseHeight, -0.5],
      ...[0, 1, -0.5],
      ...[+slopeWidth, baseHeight, -0.5],
      // Back face points
      ...[-slopeWidth, baseHeight, 0.5],
      ...[0, 1, 0.5],
      ...[+slopeWidth, baseHeight, 0.5],
      // Extra bottom points for base
      ...[-slopeWidth, 0, -0.5],
      ...[+slopeWidth, 0, -0.5],
      ...[-slopeWidth, 0, 0.5],
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

      // Base front
      ...[0, 7, 6],
      ...[0, 2, 7],
      // Base back
      ...[3, 9, 5],
      ...[3, 8, 9],
      // Base left
      ...[6, 3, 0],
      ...[6, 8, 3],
      // Base right
      ...[7, 5, 9],
      ...[7, 2, 5],

      // Bottom face
      ...[6, 9, 8],
      ...[6, 7, 9],
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
    <mesh
      castShadow
      receiveShadow
      geometry={geometry}
      ref={ref}
      position={position}
      rotation={rotation}
    >
      {material}
    </mesh>
  );
}

export default FlatSideTriangle;
