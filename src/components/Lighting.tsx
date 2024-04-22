// import { Environment } from "@react-three/drei";

import {
  PerformanceMonitor,
  AccumulativeShadows,
  RandomizedLight,
  Environment,
  Lightformer,
  // Float,
  // useGLTF,
} from "@react-three/drei";
import { useState } from "react";

function Lighting() {
  // const [degraded, degrade] = useState(false);

  return (
    <>
      {/* Alex's Custom Lighting Setup (Key Light, Fill Light, Back Light)*/}
      <Environment preset="sunset" />
      <ambientLight intensity={0.8} />
      {/* Key Light */}
      <directionalLight position={[-2, 2, 2]} intensity={1} />
      {/* Fill Light */}
      <directionalLight position={[-2, 0, -2]} intensity={0.5} />
      {/* Back Light */}
      <directionalLight position={[2, 0, 2]} intensity={0.2} />

      {/* Pro Lighting Setup (lighting chained to camera) */}
      {/* <Environment files="./textures/rustig_koppie_puresky_1k.hdr" background />
      <ambientLight intensity={0.5} />
      <directionalLight
        intensity={1}
        castShadow={true}
        shadow-bias={-0.00015}
        shadow-radius={4}
        shadow-blur={10}
        shadow-mapSize={[2048, 2048]}
        position={[85.0, 80.0, 70.0]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      /> */}

      {/* Pro Lighting Setup */}
      {/* <spotLight
        position={[0, 15, 0]}
        angle={0.3}
        penumbra={1}
        castShadow
        intensity={2}
        shadow-bias={-0.0001}
      />
      <ambientLight intensity={0.5} />
      <AccumulativeShadows
        position={[0, -1.16, 0]}
        frames={100}
        alphaTest={0.9}
        scale={10}
      >
        <RandomizedLight
          amount={8}
          radius={10}
          ambient={0.5}
          position={[1, 5, -1]}
        />
      </AccumulativeShadows>
      <PerformanceMonitor onDecline={() => degrade(true)} />
      <Environment
        frames={degraded ? 1 : Infinity}
        resolution={256}
        files="./textures/rustig_koppie_puresky_1k.hdr"
        background
        blur={1}
      ></Environment> */}
    </>
  );
}

export default Lighting;
