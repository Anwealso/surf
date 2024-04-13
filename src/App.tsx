import { Debug, Physics } from "@react-three/cannon";
import { Stats, Environment, PointerLockControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import { useToggledControl } from "./useToggledControl";
// import Vehicle from "./components/Vehicle";
import Plane from "./components/Plane";
import Platform from "./components/Platform";
import Pillar from "./components/Pillar";
import CustomNavbar from "./components/CustomNavbar";
import Overlay from "./components/Overlay";
import Lighting from "./components/Lighting";
import Player from "./components/Player";

function App() {
  const ToggledDebug = useToggledControl(Debug, "?");

  const SPACING = 15;
  const SPACING_SIDE = 5;
  const PLATFORM_LENGTH = 20;
  const PLATFORM_HEIGHT_OFFSET = 2;
  const PLATFORM_TILT_DEG = 30;
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
          gravity={[0, -50, 0]}
          allowSleep
        >
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

            {/* <Vehicle
              position={[0, 2, 0]}
              rotation={[0, -Math.PI / 4, 0]}
              angularVelocity={[0, 0.5, 0]}
            /> */}

            <Player
              position={[0, 10, 10]}
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
