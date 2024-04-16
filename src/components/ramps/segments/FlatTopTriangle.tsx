import type { Triplet } from "@react-three/cannon";
import { useConvexPolyhedron } from "@react-three/cannon";
// import { useTexture } from "@react-three/drei";
import { useMemo, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  // DoubleSide,
  type Mesh,
} from "three";
import { type RampSectionProps, toConvexProps } from "./SegmentHelpers";

function FlatTopTriangle({
  position,
  rotation,
  scale = (1 / 1024) * 4,
}: RampSectionProps) {
  // const texture = useTexture("textures/bg.jpeg");
  const geometry = getGeometry([1024 * scale, 544 * scale, 5]);
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

    const baseHeight: number = 0.2;
    const topCutDepth: number = 0.05;
    const rampRatio: number = 544 / 512;
    // Width of the sloped section of the ramp
    const slopeWidth: number = (1 - (baseHeight + topCutDepth)) / rampRatio / 2;
    const topCutWidth: number = (1 - 2 * slopeWidth) / 2;

    const vertices = new Float32Array([
      // Front face points
      ...[-slopeWidth, baseHeight, 0],
      ...[-topCutWidth / 2, 1, 0], // 1
      ...[+slopeWidth, baseHeight, 0],
      // Back face points
      ...[-slopeWidth, baseHeight, 1],
      ...[-topCutWidth / 2, 1, 1], // 4
      ...[+slopeWidth, baseHeight, 1],
      // Extra bottom points for base
      ...[-slopeWidth, 0, 0],
      ...[+slopeWidth, 0, 0],
      ...[-slopeWidth, 0, 1],
      ...[+slopeWidth, 0, 1],
      // Extra top-right point for front and back faces
      ...[+topCutWidth / 2, 1, 0], // 10
      ...[+topCutWidth / 2, 1, 1], // 11
    ]);

    const indices = [
      // Front face
      ...[0, 1, 2],
      ...[1, 10, 2],
      // Back face
      ...[3, 5, 4],
      ...[4, 5, 11],
      // Left face
      ...[0, 3, 4],
      ...[0, 4, 1],
      // Right face
      ...[2, 11, 5],
      ...[2, 10, 11],

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
      // Top face
      ...[1, 4, 11],
      ...[1, 11, 10],
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
      {/* <meshBasicMaterial map={texture} /> */}
      <meshNormalMaterial />
    </mesh>
  );
}

export default FlatTopTriangle;
