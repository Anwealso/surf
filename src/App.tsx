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

const PLAYER_HEIGHT: number = 2;

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
            friction: 2e-3,
          }}
          gravity={[0, -20, 0]}
          allowSleep
        >
          {/* <Physics shouldInvalidate={false}> */}
          <ToggledDebug>
            <Plane
              position={[0, 0, 16]}
              rotation={[-Math.PI / 2, 0, 0]}
              userData={{ id: "floor" }}
              args={[500, 500]}
            />

            <Ramp position={[0, 0, 0]} rotation={[0, 0, 0]} length={10} />

            <Player
              position={[0, 10, 8]}
              rotation={[0, 0, 0]}
              mass={60}
              args={[0.5, PLAYER_HEIGHT, 4, 8]}
            />

            <Pillar position={[3, 8, 0]} userData={{ id: "pillar-1" }} />
            {/* <Pillar position={[-5, 5, -5]} userData={{ id: "pillar-1" }} /> */}
            {/* <Pillar position={[0, 5, -5]} userData={{ id: "pillar-2" }} /> */}
            {/* <Pillar position={[5, 5, -5]} userData={{ id: "pillar-3" }} /> */}
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
