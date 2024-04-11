import { Stats, Environment, PointerLockControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Game from "./components/Game";
import Overlay from "./components/Overlay";
import Lighting from "./components/Lighting";

export default function App() {
  return (
    <>
      <Canvas shadows>
        <Lighting />

        <Game />
        <PointerLockControls />
        <Stats />
      </Canvas>
      <Overlay />
    </>
  );
}
