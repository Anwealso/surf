import {
  Debug,
  Physics,
  SphereProps,
  TrimeshProps,
  useSphere,
  useTrimesh,
} from "@react-three/cannon";
import {
  Stats,
  Environment,
  PointerLockControls,
  OrbitControls,
  TorusKnot,
  Tube,
  useGLTF,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";

import { useToggledControl } from "./components/useToggledControl";
// import Vehicle from "./components/Vehicle";
import Plane from "./components/Plane";
import Platform from "./components/Platform";
import Pillar from "./components/Pillar";
import CustomNavbar from "../archive/CustomNavbar";
import Overlay from "./components/Overlay";
import Lighting from "./components/Lighting";
import Player from "./components/Player";
import Composite from "./components/Composite";
import { BufferGeometry, Curve, Mesh, Vector3 } from "three";

const SCALE_FACTOR: number = 5;

type BowlGLTF = GLTF & {
  materials: {};
  nodes: {
    bowl: Mesh & {
      geometry: BufferGeometry & { index: ArrayLike<number> };
    };
  };
};

// class CustomSinCurve extends Curve {
//   constructor(scale = 1) {
//     super();
//     this.scale = scale;
//   }

//   getPoint(t, optionalTarget = new Vector3()) {
//     const tx = t * 3 - 1.5;
//     const ty = Math.sin(2 * Math.PI * t);
//     const tz = 0;

//     return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
//   }
// }

// const Rail = ({
//   args = [0.1],
//   position,
// }: Pick<SphereProps, "args" | "position">) => {
//   const [ref] = useSphere(
//     () => ({ args, mass: 1, position }),
//     useRef<Mesh>(null)
//   );
//   const [radius] = args;
//   const path = new CustomSinCurve(10);

//   return (
//     <Tube ref={ref} args={[path, 60, 2, 3, false]}>
//       <meshNormalMaterial />
//     </Tube>
//   );
// };

const WeirdCheerio = ({
  args = [0.1],
  position,
}: Pick<SphereProps, "args" | "position">) => {
  const [ref] = useSphere(
    () => ({ args, mass: 1, position }),
    useRef<Mesh>(null)
  );
  const [radius] = args;

  return (
    <TorusKnot ref={ref} args={[radius, radius / 2]}>
      <meshNormalMaterial />
    </TorusKnot>
  );
};

const Bowl = ({
  rotation,
  scaleFactor,
}: Pick<TrimeshProps, "rotation"> & { scaleFactor: number }) => {
  const {
    nodes: {
      bowl: { geometry },
    },
  } = useGLTF("/models/bowl.glb") as BowlGLTF;

  useEffect(() => {
    // Scale up the geometry
    geometry.scale(SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR);
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
    <mesh ref={ref} geometry={geometry}>
      <meshStandardMaterial color={"lightgreen"} wireframe={true} />
    </mesh>
  );
};

function App() {
  const ToggledDebug = useToggledControl(Debug, "?");

  const SPACING = 15;
  const SPACING_SIDE = 5;
  const PLATFORM_LENGTH = 20;
  const PLATFORM_HEIGHT_OFFSET = 2;
  const PLATFORM_TILT_DEG = 45;
  const ROTATION_RIGHT = (Math.PI / 180) * PLATFORM_TILT_DEG;
  const ROTATION_LEFT = -(Math.PI / 180) * PLATFORM_TILT_DEG;
  const POSITION_RIGHT = SPACING_SIDE;
  const POSITION_LEFT = -SPACING_SIDE;

  return (
    <>
      <CustomNavbar></CustomNavbar>

      <Canvas shadows>
        <Lighting />

        <Physics
          broadphase="SAP"
          defaultContactMaterial={{
            contactEquationRelaxation: 4,
            friction: 1e-3,
          }}
          // gravity={[0, -60, 0]}
          allowSleep
        >
          {/* <Physics shouldInvalidate={false}> */}
          <ToggledDebug>
            <Platform
              position={[POSITION_LEFT, PLATFORM_HEIGHT_OFFSET, 0]}
              rotation={[0, 0, ROTATION_LEFT]}
              userData={{ id: "floor" }}
              args={[6, 0.1, PLATFORM_LENGTH]}
            />
            <Platform
              position={[POSITION_RIGHT, PLATFORM_HEIGHT_OFFSET, -SPACING * 1]}
              rotation={[0, 0, ROTATION_RIGHT]}
              userData={{ id: "floor" }}
              args={[6, 0.1, PLATFORM_LENGTH]}
            />
            <Platform
              position={[POSITION_LEFT, PLATFORM_HEIGHT_OFFSET, -SPACING * 2]}
              rotation={[0, 0, ROTATION_LEFT]}
              userData={{ id: "floor" }}
              args={[6, 0.1, PLATFORM_LENGTH]}
            />
            <Platform
              position={[POSITION_RIGHT, PLATFORM_HEIGHT_OFFSET, -SPACING * 3]}
              rotation={[0, 0, ROTATION_RIGHT]}
              userData={{ id: "floor" }}
              args={[6, 0.1, PLATFORM_LENGTH]}
            />
            <Platform
              position={[POSITION_LEFT, PLATFORM_HEIGHT_OFFSET, -SPACING * 4]}
              rotation={[0, 0, ROTATION_LEFT]}
              userData={{ id: "floor" }}
              args={[6, 0.1, PLATFORM_LENGTH]}
            />

            <Plane
              position={[0, 0, 16]}
              rotation={[-Math.PI / 2, 0, 0]}
              userData={{ id: "floor" }}
              args={[500, 500]}
            />

            <Bowl rotation={[0, 2, 0]} scaleFactor={SCALE_FACTOR} />
            {/* <WeirdCheerio position={[0.3, 11 - 5, 0]} /> */}
            {/* <WeirdCheerio position={[0, 10 - 5, 0]} /> */}
            <WeirdCheerio
              position={[0.4, 9 - 5, 0.7]}
              args={[0.1 * SCALE_FACTOR]}
            />
            {/* <WeirdCheerio position={[0.2, 13 - 5, 1]} /> */}

            {/* <Composite
              position={[0, 1, 0]}
              rotation={[0, 0, 0]}
              userData={{ id: "compositeBody" }}
              args={[3, 3, 3]}
            /> */}

            <Player
              // position={[0, 10, 10]}
              position={[0, 3, 2]}
              rotation={[0, -Math.PI / 4, 0]}
              angularVelocity={[0, 0.5, 0]}
              args={[1, 2, 1]}
            />

            <Pillar position={[-5, 5, -5]} userData={{ id: "pillar-1" }} />
            <Pillar position={[0, 5, -5]} userData={{ id: "pillar-2" }} />
            <Pillar position={[5, 5, -5]} userData={{ id: "pillar-3" }} />
          </ToggledDebug>
        </Physics>
        <Suspense fallback={null}>
          <Environment preset="night" />
        </Suspense>

        <PointerLockControls />
        <Stats />
      </Canvas>

      <Overlay />
    </>
  );
}

export default App;
