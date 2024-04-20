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
import Platform from "./components/Platform";

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
          <Player
            position={[0, 2, 5]}
            rotation={[0, 0, 0]}
            mass={60}
            args={[0.5, PLAYER_HEIGHT, 8, 8]}
          />

          <Platform
            position={[
              0,
              (50 * Math.sin(Math.PI / 2) * 2) / Math.PI,
              -5 + (-(50 * Math.sin(Math.PI / 2)) * 2) / Math.PI,
            ]}
            rotation={[-Math.PI / 2, 0, 0]}
            userData={{ id: "start_zone" }}
            args={[10, 10, 2]}
          />

          <Plane
            position={[0, 0, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            userData={{ id: "floor" }}
            args={[500, 500]}
          />

          {/* Reference plane */}
          {/* <Plane
            position={[2, 0, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            userData={{ id: "floor" }}
            args={[500, 500]}
          /> */}

          <Ramp
            position={[0, 20, -30]}
            // rotation={[0, 0, 0]}

            // rotation={[0, 0, 0]}
            // rotation={[Math.PI / 2, 0, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            // rotation={[Math.PI / 2, -Math.PI / 2, 0]}
            twist={{ axis: TwistAxis.y, w: -Math.PI, v: 50 }}
            crossSection={CrossSection.PerfectTriangle}
            segmentLegth={2}
          />

          {/* <Ramp
            position={[0, 0, 2]}
            rotation={[0, 0, Math.PI / 2]}
            // rotation={[Math.PI / 2, 0, 0]}
            twist={{ axis: TwistAxis.y, w: Math.PI / 2, v: 10 }}
            crosssection={CrossSection.PerfectTriangle}
            segmentLegth={2}
          /> */}
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
