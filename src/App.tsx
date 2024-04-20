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
import Ramp from "./components/ramps/Ramp";
import { TwistAxis, CrossSection } from "./components/ramps/Ramp";
import Box from "./components/Box";

const PLAYER_HEIGHT: number = 2;
const END_BOX_Z: number = -150;
const END_BOX_Y: number = -45;

const MAP_LENGTH: number = 160;
const MAP_WIDTH: number = 40;
const MAP_HEIGHT: number = 60;

function App() {
  const ToggledDebug = useToggledControl(Debug, "?");

  return (
    <>
      <CustomNavbar></CustomNavbar>

      <Canvas shadows>
        <Lighting />

        <Physics
          broadphase="SAP"
          defaultContactMaterial={{
            contactEquationRelaxation: 4,
            friction: 2e-3,
          }}
          gravity={[0, -20, 0]}
          allowSleep
        >
          <Player
            position={[0, 5, 0]}
            rotation={[0, 0, 0]}
            mass={60}
            args={[0.5, PLAYER_HEIGHT, 8, 8]}
          />

          <Box
            position={[0, 0, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            userData={{ id: "floor" }}
            args={[10, 10, 1]}
          />

          <Box
            position={[0, 5, 5]}
            rotation={[0, 0, 0]}
            userData={{ id: "floor" }}
            args={[10, 10, 1]}
          />
          <Box
            position={[-5, 5, 0]}
            rotation={[0, Math.PI / 2, 0]}
            userData={{ id: "floor" }}
            args={[10, 10, 1]}
          />
          <Box
            position={[5, 5, 0]}
            rotation={[0, Math.PI / 2, 0]}
            userData={{ id: "floor" }}
            args={[10, 10, 1]}
          />

          <Plane
            position={[0, -100, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            userData={{ id: "floor" }}
            args={[500, 500]}
          />

          <Ramp
            position={[0, -15, -10]}
            rotation={[-(Math.PI / 2) + Math.PI / 6, 0, 0]}
            // rotation={[0, Math.PI, 0]}
            // rotation={[Math.PI / 2, 0, 0]}
            twist={{ axis: TwistAxis.x, w: Math.PI * (1 / 2.5), v: 80 }}
            crossSection={CrossSection.PerfectTriangle}
            segmentLegth={2}
          />

          <Ramp
            position={[0, -45, -95]}
            rotation={[-Math.PI / 16, 0, 0]}
            // rotation={[0, Math.PI, 0]}
            // rotation={[Math.PI / 2, 0, 0]}
            twist={{ axis: TwistAxis.x, w: Math.PI * (1 / 8), v: 30 }}
            crossSection={CrossSection.PerfectTriangle}
            segmentLegth={2}
          />

          <Box
            position={[0, END_BOX_Y - 5, END_BOX_Z]}
            rotation={[-Math.PI / 2, 0, 0]}
            userData={{ id: "floor" }}
            args={[10, 10, 1]}
          />
          <Box
            position={[0, END_BOX_Y, END_BOX_Z - 5]}
            rotation={[0, 0, 0]}
            userData={{ id: "floor" }}
            args={[10, 10, 1]}
          />
          <Box
            position={[-5, END_BOX_Y, END_BOX_Z]}
            rotation={[0, Math.PI / 2, 0]}
            userData={{ id: "floor" }}
            args={[10, 10, 1]}
          />
          <Box
            position={[5, END_BOX_Y, END_BOX_Z]}
            rotation={[0, Math.PI / 2, 0]}
            userData={{ id: "floor" }}
            args={[10, 10, 1]}
          />
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
