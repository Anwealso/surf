import { Physics } from "@react-three/cannon";
import { Stats, Environment, PointerLockControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import CustomNavbar from "./components/CustomNavbar";
import Overlay from "./components/Overlay";
import Lighting from "./components/Lighting";
import Player from "./components/Player";
import Ramp from "./components/ramps/Ramp";
import { TwistAxis, CrossSection } from "./components/ramps/Ramp";
import Box from "./components/Box";
import WorldBox from "./components/WorldBox";

const PLAYER_HEIGHT: number = 2;
const END_BOX_Y: number = -45;
const END_BOX_Z: number = -155;

const WORLDBOX_DIMS_X: number = 60;
const WORLDBOX_DIMS_Y: number = 80;
const WORLDBOX_DIMS_Z: number = 180;

function App() {
  return (
    <>
      <CustomNavbar></CustomNavbar>

      <Canvas shadows>
        <Lighting />

        <Physics
          broadphase="SAP"
          defaultContactMaterial={{
            contactEquationRelaxation: 4,
            friction: 40e-3,
          }}
          gravity={[0, -10, 0]}
          allowSleep
        >
          <Player
            position={[0, 5, 0]}
            rotation={[0, 0, 0]}
            mass={100}
            args={[0.5, PLAYER_HEIGHT, 8, 8]}
          />

          <WorldBox
            position={[0, 20, 10]}
            dims={[WORLDBOX_DIMS_X, WORLDBOX_DIMS_Y, WORLDBOX_DIMS_Z]}
          />

          <Box
            position={[0, 0, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            userData={{ id: "floor" }}
            args={[WORLDBOX_DIMS_X, 20, 1]}
          />

          <Ramp
            position={[0, -15, -5]}
            rotation={[-(Math.PI / 2) + Math.PI / 6, 0, 0]}
            twist={{ axis: TwistAxis.x, w: Math.PI * (1 / 2.3), v: 90 }}
            crossSection={CrossSection.PerfectTriangle}
            segmentLegth={2}
          />

          <Ramp
            position={[0, -45, -95]}
            rotation={[-Math.PI / 16, 0, 0]}
            twist={{ axis: TwistAxis.x, w: Math.PI * (1 / 8), v: 30 }}
            crossSection={CrossSection.PerfectTriangle}
            segmentLegth={2}
          />

          <Box
            position={[0, END_BOX_Y, END_BOX_Z - 20 / 2]}
            rotation={[-Math.PI / 2, 0, 0]}
            userData={{ id: "floor" }}
            args={[WORLDBOX_DIMS_X, 20, 1]}
          />

          {/* Test Box */}
          <Box position={[-1, 2, -5]} args={[2, 2, 2]} />
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
