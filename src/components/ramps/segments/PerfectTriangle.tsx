import type { ConvexPolyhedronProps, Triplet } from "@react-three/cannon";
import { useConvexPolyhedron } from "@react-three/cannon";
// import { useTexture } from "@react-three/drei";
import { useMemo, useRef } from "react";
import {
  // BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  // Vector3,
  type Mesh,
} from "three";
import { Geometry } from "three-stdlib";

const OBJECT_MASS = 4;

function toConvexProps(
  bufferGeometry: BufferGeometry
): [vertices: Triplet[], faces: Triplet[]] {
  const geo = new Geometry().fromBufferGeometry(bufferGeometry);
  geo.mergeVertices();
  const vertices: Triplet[] = geo.vertices.map((v) => [v.x, v.y, v.z]);
  const faces: Triplet[] = geo.faces.map((f) => [f.a, f.b, f.c]);

  console.log(vertices);
  console.log(faces);

  return [vertices, faces];
}

// function toConvexProps(geo: Geometry): [vertices: Triplet[], faces: Triplet[]] {
//   const vertices: Triplet[] = geo.vertices.map((v) => [v.x, v.y, v.z]);
//   const faces: Triplet[] = geo.faces.map((f) => [f.a, f.b, f.c]);

//   console.log(vertices);
//   console.log(faces);

//   return [vertices, faces];
// }

function getRampGeometry(size: Triplet): BufferGeometry {
  const geometry = new BufferGeometry();
  // geo.vertices.push(
  //   // Front face
  //   new Vector3(-0.5, 0, 0),
  //   new Vector3(0, 1, 0),
  //   new Vector3(-0.5, 0, 0),
  //   // Back face
  //   new Vector3(-0.5, 0, 1),
  //   new Vector3(0, 1, 1),
  //   new Vector3(-0.5, 0, 1)
  // );

  const vertices = new Float32Array([
    // Front face points
    ...[-0.5, 0, 0],
    ...[0, 1, 0],
    ...[0.5, 0, 0],
    // Back face points
    ...[-0.5, 0, 1],
    ...[0, 1, 1],
    ...[0.5, 0, 1],
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
    ...[0, 5, 2],
    ...[0, 3, 5],
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

// type CustomGLTF = GLTF & {
//   materials: {};
//   nodes: { Cylinder: Mesh };
// };

export type ConvexPolyRampProps = ConvexPolyhedronProps & { scale?: number };

// function ConvexPolyRamp({ position, rotation, scale }: ConvexPolyRampProps) {
function ConvexPolyRamp({
  position,
  rotation,
  scale = (1 / 750) * 4,
}: ConvexPolyRampProps) {
  // const texture = useTexture("textures/bg.jpeg");

  // const geometry = new BoxGeometry(2, 2, 2);
  const geometry = getRampGeometry([750 * scale, 450 * scale, 5]);

  // console.log(geometry);

  const args = useMemo(() => toConvexProps(geometry), [geometry]);
  const [ref] = useConvexPolyhedron(
    () => ({
      material: "ground",
      type: "Static",
      args,
      mass: OBJECT_MASS,
      position,
      rotation,
    }),
    useRef<Mesh>(null)
  );

  return (
    <mesh castShadow receiveShadow {...{ geometry, position, ref, rotation }}>
      {/* <meshStandardMaterial wireframe color="white" /> */}
      <meshStandardMaterial color={"blue"} side={DoubleSide} />
      {/* <meshBasicMaterial map={texture} /> */}
    </mesh>
  );
}

export default ConvexPolyRamp;
