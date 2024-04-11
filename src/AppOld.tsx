import CustomNavbar from "./meme/CustomNavbar";
import Overlay from "./meme/Overlay";

import { Canvas } from "@react-three/fiber";
import {
  Stats,
  // Environment,
  // OrbitControls,
  PointerLockControls,
} from "@react-three/drei";
import Lighting from "./components/Lighting";
import Game from "./components/Game";

function App() {
  return (
    <>
      <CustomNavbar></CustomNavbar>

      <Canvas shadows camera={{ position: [0, 0, 4], fov: 60 }}>
        <Lighting />
        <PointerLockControls />
        <Game />
        <Stats />
      </Canvas>

      <Overlay />
    </>
  );
}

export default App;
