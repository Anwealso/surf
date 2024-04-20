import { useBox, type Triplet } from "@react-three/cannon";
import { useTexture } from "@react-three/drei";
import { useRef } from "react";
import { Mesh } from "three";

interface WorldBoxProps {
  position: Triplet; // [x,y,z] position (world box origin at middle of back-top edge
  dims: Triplet; // [x,y,z] wallDims of world box
}

function WorldBox({ position, dims }: WorldBoxProps) {
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

  wallPositions.map((_, i) =>
    useBox(
      () => ({
        material: "ground",
        type: "Static",
        position: wallPositions[i],
        args: wallDims[i],
      }),
      useRef<Mesh>(null)
    )
  );

  return (
    <group>
      {(() => {
        return wallPositions.map((_, i) => {
          return (
            <mesh receiveShadow position={wallPositions[i]}>
              <boxGeometry args={wallDims[i]} />
              <meshBasicMaterial
                map={useTexture("textures/long_white_tiles_ao_4k.jpg")}
              />
              {/* <meshBasicMaterial color={"white"} /> */}
              {/* <meshStandardMaterial color={"white"} /> */}
              {/* <meshPhongMaterial color={"white"} /> */}
            </mesh>
          );
        });
      })()}
    </group>
  );
}

export default WorldBox;
