// This demo is also playable without installation here:
// https://codesandbox.io/s/basic-demo-forked-ebr0x

import type {
  CylinderArgs,
  CylinderProps,
  PlaneProps,
} from "@react-three/cannon";
import { Debug, Physics, useCylinder, usePlane } from "@react-three/cannon";
import { Stats, Environment, PointerLockControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import type { Group, Mesh } from "three";

import { useToggledControl } from "./useToggledControl";
import Vehicle from "./components/Vehicle";
import Plane from "./components/Plane";
import Pillar from "./components/Pillar";
import CustomNavbar from "./components/CustomNavbar";
import Overlay from "./components/Overlay";
import Lighting from "./components/Lighting";

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
            friction: 1e-3,
          }}
          allowSleep
        >
          <ToggledDebug>
            <Plane
              position={[0, -2, 0]}
              rotation={[0, (Math.PI / 180) * 20, 0]}
              size={[10, 10]}
              userData={{ id: "floor" }}
            />
            <Vehicle
              position={[0, 2, 0]}
              rotation={[0, -Math.PI / 4, 0]}
              angularVelocity={[0, 0.5, 0]}
            />
            <Pillar position={[-5, 2.5, -5]} userData={{ id: "pillar-1" }} />
            <Pillar position={[0, 2.5, -5]} userData={{ id: "pillar-2" }} />
            <Pillar position={[5, 2.5, -5]} userData={{ id: "pillar-3" }} />
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
