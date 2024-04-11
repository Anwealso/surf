import React, { Suspense, useEffect, useReducer } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function Test() {
  // const [flag, toggle] = useReducer((state) => !state, true);
  const { scene } = useLoader(GLTFLoader, "/models/Horse.glb") as any;
  return <primitive object={scene} />;
}

export default Test;
