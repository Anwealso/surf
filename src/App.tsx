import { Physics } from "@react-three/cannon";
import { Stats, Environment, PointerLockControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo, useState } from "react";
import CustomNavbar from "./components/CustomNavbar";
import Overlay from "./components/Overlay";
import Lighting from "./components/Lighting";
import Player from "./components/Player";
// import Ramp from "./components/ramps/Ramp";
// import { TwistAxis, CrossSection } from "./components/ramps/Ramp";
// import Box from "./components/Box";
// import WorldBox from "./components/WorldBox";
import { map_json, parseMap } from "./components/LoadMap";

const PLAYER_HEIGHT: number = 2;
// const RAMP_LENGTH: number = 10;
// const END_BOX_Y: number = -45;
// const END_BOX_Z: number = -155;

// const WORLDBOX_DIMS_X: number = 200;
// const WORLDBOX_DIMS_Y: number = 80;
// const WORLDBOX_DIMS_Z: number = 180;

function App() {
  const map_entities: JSX.Element[] = useMemo(() => {
    return parseMap(map_json);
  }, []);

  const [playerSpeed, setPlayerSpeed] = useState(0);
  return (
    <>
      <CustomNavbar></CustomNavbar>

      <Canvas shadows>
        <Lighting />

        <Physics
          broadphase="SAP"
          defaultContactMaterial={{
            contactEquationRelaxation: 4,
            friction: 2e-2,
            // friction: 0,
          }}
          // gravity={[0, -20, 0]}
          gravity={[0, -9.8, 0]}
          allowSleep
        >
          <Player
            position={[0, 10, -5]}
            rotation={[0, 0, 0]}
            mass={80}
            args={[0.5, PLAYER_HEIGHT, 8, 8]}
            setPlayerSpeed={setPlayerSpeed}
          />

          {map_entities}

          {/* Test Box */}
          {/* <Box position={[-5, 2, -5]} args={[2, 2, 2]} /> */}
          {/* <Ramp
            position={[0, 4, -6]}
            rotation={[0, Math.PI / 4, 0]}
            twist={{ axis: TwistAxis.x, w: 0, v: 4 }}
            crossSection={CrossSection.PerfectTriangle}
            segmentLegth={4}
          /> */}
        </Physics>

        <Suspense fallback={null}>
          <Environment preset="night" />
        </Suspense>

        <PointerLockControls />
        <Stats />
      </Canvas>

      <Overlay playerSpeed={playerSpeed} />
    </>
  );
}

export default App;
