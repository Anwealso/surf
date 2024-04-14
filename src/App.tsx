import { Debug, Physics } from "@react-three/cannon";
import { Stats, Environment, PointerLockControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useToggledControl } from "./components/useToggledControl";
import Plane from "./components/Plane";
import Pillar from "./components/Pillar";
import CustomNavbar from "./components/CustomNavbar";
import Overlay from "./components/Overlay";
import Lighting from "./components/Lighting";
import Player from "./components/Player";
import Cheerio from "./components/Cheerio";
import Bowl from "./components/Bowl";

const SCALE_FACTOR: number = 5;

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

//   const path = new CustomSinCurve(10);

//   return (
//     <Tube ref={ref} args={[path, 60, 2, 3, false]}>
//       <meshNormalMaterial />
//     </Tube>
//   );
// };

function App() {
  const ToggledDebug = useToggledControl(Debug, "?");

  // const SPACING = 15;
  // const SPACING_SIDE = 5;
  // const PLATFORM_LENGTH = 20;
  // const PLATFORM_HEIGHT_OFFSET = 2;
  // const PLATFORM_TILT_DEG = 45;
  // const ROTATION_RIGHT = (Math.PI / 180) * PLATFORM_TILT_DEG;
  // const ROTATION_LEFT = -(Math.PI / 180) * PLATFORM_TILT_DEG;
  // const POSITION_RIGHT = SPACING_SIDE;
  // const POSITION_LEFT = -SPACING_SIDE;

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
            {/* <Platform
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
            /> */}

            <Plane
              position={[0, 0, 16]}
              rotation={[-Math.PI / 2, 0, 0]}
              userData={{ id: "floor" }}
              args={[500, 500]}
            />

            <Bowl
              rotation={[0, 2, 0]}
              position={[10, 10, 10]}
              scaleFactor={SCALE_FACTOR}
              args={undefined}
            />
            <Cheerio position={[0.3, 11 - 5, 0]} />
            <Cheerio position={[0, 10 - 5, 0]} />
            <Cheerio position={[0.2, 13 - 5, 1]} />
            <Cheerio
              position={[0.4 * SCALE_FACTOR, 4, 0.7 * SCALE_FACTOR]}
              args={[0.1 * SCALE_FACTOR]}
            />

            {/* <Rail position={[0.2, 13 - 5, 1]} /> */}

            {/* <Composite
              position={[0, 1, 0]}
              rotation={[0, 0, 0]}
              userData={{ id: "compositeBody" }}
              args={[3, 3, 3]}
            /> */}

            <Player
              // position={[0, 10, 10]}
              position={[0, 3, 6]}
              rotation={[0, -Math.PI / 4, 0]}
              angularVelocity={[0, 0.5, 0]}
              args={[1, 2, 1]}
            />

            <Pillar position={[3, 8, 0]} userData={{ id: "pillar-1" }} />
            {/* <Pillar position={[-5, 5, -5]} userData={{ id: "pillar-1" }} />
            <Pillar position={[0, 5, -5]} userData={{ id: "pillar-2" }} />
            <Pillar position={[5, 5, -5]} userData={{ id: "pillar-3" }} /> */}
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
