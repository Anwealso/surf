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
  material,
  size = [1, 1, 1],
  ...props
}: RampSectionProps & { material: JSX.Element }): JSX.Element {
  const geometry = getGeometry(size);
  const args = useMemo(
    () => toConvexProps(geometry),
    [geometry, position, rotation]
  );
  const [ref] = useConvexPolyhedron(
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

  function getGeometry(size: Triplet): BufferGeometry {
    const geometry = new BufferGeometry();

    // Width of the sloped section of the ramp
    const slopeWidth: number = 1 / RAMP_RATIO / 2;

    const wrapFixerPointDepth = 0.001;

    const vertices = new Float32Array([
      // Front face points
      ...[-slopeWidth, 0, 0.5], // front-left
      ...[0, 1, 0.5], // front-top
      ...[+slopeWidth, 0, 0.5], // front-right
      // Back face points
      ...[-slopeWidth, 0, -0.5], // back-left
      ...[0, 1, -0.5], // back-top
      ...[+slopeWidth, 0, -0.5], // back-right
      // // Mid (spine) points
      ...[0, 1, 0.5 - wrapFixerPointDepth], // mid-front-top
      ...[0, 1, 0.0], // mid-top
      ...[0, 1, -(0.5 - wrapFixerPointDepth)], // mid-back-top
      ...[0, 1, 0.5 - wrapFixerPointDepth], // mid-front-top 2
      ...[0, 1, 0.0], // mid-top 2
      ...[0, 1, -(0.5 - wrapFixerPointDepth)], // mid-back-top 2
    ]);

    const uvs = new Float32Array([
      // Front face points
      ...[0 + Math.sqrt(3) / 6, 1 / 3], // front left
      ...[0.0, 0.5], // front top
      ...[0 + Math.sqrt(3) / 6, 2 / 3], // front right
      // Back face points
      ...[1 - Math.sqrt(3) / 6, 1 / 3], // back left
      ...[1.0, 0.5], // back top
      ...[1 - Math.sqrt(3) / 6, 2 / 3], // back right
      // new spine points - bottom of texture (v=1)
      ...[0 + (Math.sqrt(3) / 6 - 0.001), 0], // mid-front-top
      ...[0.5, 0], // mid-top
      ...[1 - (Math.sqrt(3) / 6 - 0.001), 0], // mid-back-top
      // new spine points - top of texture (v=1)
      ...[0 + (Math.sqrt(3) / 6 - 0.001), 1], // mid-front-top 2
      ...[0.5, 1], // mid-top 2
      ...[1 - (Math.sqrt(3) / 6 - 0.001), 1], // mid-back-top 2
    ]);

    const indices = [
      // Front face
      ...[0, 2, 1],
      // Back face
      ...[3, 4, 5],
      // Left face
      ...[0, 1, 6],
      ...[0, 6, 7],
      ...[0, 7, 3],
      ...[3, 8, 4],
      ...[3, 7, 8],
      // Right face
      ...[2, 9, 1],
      ...[2, 10, 9],
      ...[2, 5, 10],
      ...[5, 11, 10],
      ...[5, 4, 11],
      // Bottom face
      ...[0, 5, 2],
      ...[0, 3, 5],
    ];

    // Add the indices and vertices
    geometry.setAttribute("position", new BufferAttribute(vertices, 3));
    geometry.setAttribute("uv", new BufferAttribute(uvs, 2));
    geometry.setIndex(indices);

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

export default PerfectTriangle;
