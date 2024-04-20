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
import { TwistAxis } from "./components/ramps/Ramp";

const PLAYER_HEIGHT: number = 2;

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
          <Debug>
            <Plane
              position={[0, 0, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              userData={{ id: "floor" }}
              args={[500, 500]}
            />

            {/* <Ramp
            position={[0, 0, 0]}
            // rotation={[0, Math.PI / 4, 0]}
            rotation={[0, 0, 0]}
            twist={{ axis: TwistAxis.y, w: Math.PI / 2, v: 50 }}
            // twist={{ axis: TwistAxis.y, w: 0, v: 50 }}
            rampDensity={0.5}
          /> */}

            <Ramp
              position={[0, 0, 2]}
              rotation={[0, 0, Math.PI / 2]}
              // rotation={[Math.PI / 2, 0, 0]}
              twist={{ axis: TwistAxis.y, w: Math.PI / 2, v: 20 }}
              rampDensity={0.25}
            />

            <Player
              position={[6, 10, 8]}
              rotation={[0, 0, 0]}
              mass={60}
              args={[0.5, PLAYER_HEIGHT, 8, 8]}
            />
          </Debug>
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
