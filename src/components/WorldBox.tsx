import { useBox, type Triplet } from "@react-three/cannon";
import { groundMaterial } from "./Materials";
// import { useTexture } from "@react-three/drei";
import { useRef } from "react";
import {
  // BackSide,
  FrontSide,
  Mesh,
  RepeatWrapping,
  TextureLoader,
  Vector2,
} from "three";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

interface WorldBoxProps {
  position: Triplet; // [x,y,z] position (world box origin at middle of back-top edge
  dims: Triplet; // [x,y,z] wallDims of world box
}

function WorldBox({ position, dims, ...props }: WorldBoxProps) {
  const wallPositions: Triplet[] = [
    [
      position[0] + dims[0] / 2,
      position[1] - dims[1] / 2,
      position[2] - dims[2] / 2,
    ], // right face
    [
      position[0] - dims[0] / 2,
      position[1] - dims[1] / 2,
      position[2] - dims[2] / 2,
    ], // left face
    [position[0], position[1], position[2] - dims[2] / 2], // top face
    [position[0], position[1] - dims[1], position[2] - dims[2] / 2], // bottom face
    [position[0], position[1] - dims[1] / 2, position[2] - dims[2]], // back face
    [position[0], position[1] - dims[1] / 2, position[2]], // front face
  ];
  const wallDims: Triplet[] = [
    [1, dims[1], dims[2]], // right face
    [1, dims[1], dims[2]], // left face
    [dims[0], 1, dims[2]], // top face
    [dims[0], 1, dims[2]], // bottom face
    [dims[0], dims[1], 1], // back face
    [dims[0], dims[1], 1], // front face
  ];

  for (let i = 0; i < wallPositions.length; i++) {
    useBox(
      () => ({
        type: "Static",
        position: wallPositions[i],
        args: wallDims[i],
        material: groundMaterial,
      }),
      useRef<Mesh>(null)
    );
  }

  // Load Image Texture
  // const texture = useTexture("textures/granular_concrete_diff_4k.jpg");
  // const texture = useTexture("textures/metal_plate_rough_4k.jpg");
  // const texture = useTexture("textures/asphalt_04_diff_4k.jpg");
  // const texture = useTexture("textures/ashen_dunes.png");
  // const texture = useTexture("textures/macro_flour_diff_4k.jpg");
  // Load HDR Texture
  // const texture = new RGBELoader().load(
  //   "textures/rustig_koppie_puresky_1k.hdr"
  // );

  const brickTexture = new TextureLoader().load(
    // "textures/seamlessTextures/IMGP5505_seamless.jpg"
    "textures/wests_textures/stone wall 6.png"
  );
  const brickTextureScale: number = 2;
  brickTexture.wrapS = brickTexture.wrapT = RepeatWrapping;
  brickTexture.repeat = new Vector2(
    dims[1] / brickTextureScale,
    dims[1] / brickTextureScale
  );

  const grassTexture = new TextureLoader().load(
    "textures/seamlessTextures/clover.jpg"
  );
  const grassTextureScale: number = 5;
  grassTexture.wrapS = grassTexture.wrapT = RepeatWrapping;
  grassTexture.repeat = new Vector2(
    dims[1] / grassTextureScale,
    dims[1] / grassTextureScale
  );

  const textures = [
    brickTexture, // right
    brickTexture, // left
    null, // top
    grassTexture, // bottom
    brickTexture, // back
    brickTexture, // front
  ];

  return (
    <group>
      {(() => {
        return wallPositions.map((_, i) => {
          return (
            <mesh receiveShadow position={wallPositions[i]} key={i}>
              {/* <meshPhongMaterial color={"white"} side={FrontSide} /> */}
              {(() => {
                if (textures[i]) {
                  return (
                    <>
                      <boxGeometry args={wallDims[i]} />
                      <meshPhongMaterial map={textures[i]} side={FrontSide} />
                    </>
                  );
                }
              })()}
            </mesh>
          );
        });
      })()}
    </group>
  );
}

export default WorldBox;
