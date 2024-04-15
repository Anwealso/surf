import type { ConvexPolyhedronProps, Triplet } from "@react-three/cannon";
import { useConvexPolyhedron } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { BufferGeometry, Mesh } from "three";
import { Geometry } from "three-stdlib";

const OBJECT_MASS = 4;

function toConvexProps(
  bufferGeometry: BufferGeometry
): [vertices: Triplet[], faces: Triplet[]] {
  const geo = new Geometry().fromBufferGeometry(bufferGeometry);
  geo.mergeVertices();
  const vertices: Triplet[] = geo.vertices.map((v) => [v.x, v.y, v.z]);
  const faces: Triplet[] = geo.faces.map((f) => [f.a, f.b, f.c]);
  return [vertices, faces];
}

type CustomGLTF = GLTF & {
  materials: {};
  nodes: { Cylinder: Mesh };
};

export type ConvexPolyRampProps = ConvexPolyhedronProps & {};

function ConvexPolyRamp({ position, rotation }: ConvexPolyRampProps) {
  const {
    nodes: {
      Cylinder: { geometry },
    },
  } = useGLTF("models/diamond.glb") as CustomGLTF;
  const args = useMemo(() => toConvexProps(geometry), [geometry]);
  const [ref] = useConvexPolyhedron(
    () => ({ args, mass: OBJECT_MASS, position, rotation }),
    useRef<Mesh>(null)
  );

  return (
    <mesh castShadow receiveShadow {...{ geometry, position, ref, rotation }}>
      <meshStandardMaterial wireframe color="white" />
    </mesh>
  );
}

export default ConvexPolyRamp;
