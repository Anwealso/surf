import CustomNavbar from "./components/CustomNavbar";
import Overlay from "./components/Overlay";

import { Canvas } from "@react-three/fiber";
import {
  Stats,
  Environment,
  OrbitControls,
  PointerLockControls,
} from "@react-three/drei";
import Lighting from "./components/Lighting";
import Game from "./components/Game";
import FrictionDemo from "./components/demo-Friction";
import VehicleDemo from "./components/demo-Vehicle";

function App() {
  return (
    <>
      <VehicleDemo />
    </>
  );
}

export default App;
