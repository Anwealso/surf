import { useTrimesh } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Mesh } from "three";

type BowlGLTF = GLTF & {
  materials: {};
  nodes: {
    bowl: Mesh & {
      geometry: BufferGeometry & { index: ArrayLike<number> };
    };
  };
};

const Bowl = ({
  rotation,
  position,
  scaleFactor,
}: Pick<TrimeshProps, "rotation"> &
  Pick<SphereProps, "args" | "position"> & {
    scaleFactor: number;
  }) => {
  const {
    nodes: {
      bowl: { geometry },
    },
  } = useGLTF("/models/bowl.glb") as BowlGLTF;

  useEffect(() => {
    // Scale up the geometry
    geometry.scale(scaleFactor, scaleFactor, scaleFactor);
  }, []);

  const {
    attributes: {
      position: { array: vertices },
    },
    index: { array: indices },
  } = geometry;

  const [ref] = useTrimesh(
    () => ({
      args: [vertices, indices],
      mass: 0,
      rotation,
    }),
    useRef<Mesh>(null)
  );

  return (
    <mesh ref={ref} geometry={geometry} position={position}>
      <meshStandardMaterial color={"lightgreen"} wireframe={true} />
    </mesh>
  );
};
export default Bowl;
