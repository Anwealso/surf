import { useEffect, useRef, useMemo, useState } from "react";
import { Group, Vector3 } from "three";
import { useFrame, Camera } from "@react-three/fiber";
import { CompoundBodyProps, useCompoundBody } from "@react-three/cannon";
// import { useControls } from "./useControls";
import useFollowCam from "./useFollowCam";
import { PointerLockControlsCannon } from "./PointerLockControlsCannon";

// const STEPS_PER_FRAME = 5;
const GROUND_SPEED = 12;
// const GROUND_SPEED = 17;
const JUMP_SPEED = 3;
const AIR_SPEED = GROUND_SPEED / 4;
// const MAX_SPEED = 15;
const RISE_SPEED = 1;

type OurCompoundBodyProps = Pick<CompoundBodyProps, "position" | "rotation"> & {
  mass: number; // mass of player
  args: [
    radius: number,
    length: number,
    capSegments: number,
    radialSegments: number
  ]; // shape of the player capsule
};

function Player({
  mass,
  args,
  position,
  rotation,
  ...props
}: OurCompoundBodyProps): JSX.Element {
  // const controls = useControls();

  // const playerPosition: Vector3 = useMemo(() => new Vector3(), []);
  // const playerVelocity: Vector3 = useMemo(() => new Vector3(), []);
  // const playerDirection: Vector3 = useMemo(() => new Vector3(), []);
  // const playerAngularVelocity: Vector3 = useMemo(() => new Vector3(), []);

  // const [playerOnFloor, setPlayerOnFloor]: [boolean, any] = useState(true);

  const [ref, api] = useCompoundBody(
    () => ({
      mass: 80,
      position: position,
      fixedRotation: true,
      onCollideBegin: () => {
        setPlayerOnFloor(true);
      },
      onCollideEnd: () => {
        setPlayerOnFloor(false);
      },
      ...props,
      shapes: [
        {
          args: [args[0]],
          position: [0, -args[1] / 2, 0],
          rotation: [0, 0, 0],
          type: "Sphere",
        },
        {
          args: [args[0], args[0], args[1], args[3]],
          position: [0, +args[1] / 2, 0],
          rotation: [0, 0, 0],
          type: "Cylinder",
        },
        {
          args: [args[0]],
          position: [0, +args[1] / 2, 0],
          rotation: [0, 0, 0],
          type: "Sphere",
        },
      ],
    }),
    useRef<Group>(null)
  );

  const { camera } = useFollowCam(ref, args[1] / 2);

  // const controls = new PointerLockControlsCannon(camera, api);

  // // function teleportPlayerIfOob(camera, capsule, playerVelocity: Vector3) {
  // function teleportPlayerIfOob(capsule, playerVelocity: Vector3) {
  //   // if (camera.position.y <= -100) {
  //   if (playerPosition.y <= -100) {
  //     playerVelocity.set(0, 0, 0);
  //     capsule.start.set(0, 10, 0);
  //     capsule.end.set(0, 11, 0);
  //     // camera.position.copy(capsule.end);
  //     // camera.rotation.set(0, 0, 0);
  //   }
  // }

  // const playerVelocity = useRef([0, 0, 0]);
  useEffect(() => {
    const playerVelocityUnsubscribe = api.velocity.subscribe((vel) =>
      playerVelocity.set(...vel)
    );
    return playerVelocityUnsubscribe;
  }, []);
  // const playerPosition = useRef([0, 0, 0]);
  useEffect(() => {
    const playerPositionUnsubscribe = api.position.subscribe((pos) =>
      playerPosition.set(...pos)
    );
    return playerPositionUnsubscribe;
  }, []);
  // const playerAngularVelocity = useRef([0, 0, 0]);
  useEffect(() => {
    const playerAngularVelocityUnsubscribe = api.position.subscribe((angVel) =>
      playerAngularVelocity.set(...angVel)
    );
    return playerAngularVelocityUnsubscribe;
  }, []);

  function getForwardVector(camera: Camera, playerDirection: Vector3): Vector3 {
    camera.getWorldDirection(playerDirection);
    playerDirection.y = 0;
    playerDirection.normalize();
    return playerDirection;
  }

  function getSideVector(camera: Camera, playerDirection: Vector3): Vector3 {
    camera.getWorldDirection(playerDirection);
    playerDirection.y = 0;
    playerDirection.normalize();
    playerDirection.cross(camera.up);
    return playerDirection;
  }

  function handleControls(
    camera: Camera,
    delta: number,
    playerVelocity: Vector3,
    playerOnFloor: boolean,
    playerDirection: Vector3
  ) {
    const { backward, jump, forward, left, reset, right } = controls.current;
    // const speedDelta = RISE_SPEED * delta * (playerOnFloor ? GROUND_SPEED : AIR_SPEED);

    left &&
      playerVelocity.set(
        getSideVector(camera, playerDirection).multiplyScalar(
          -(playerOnFloor ? GROUND_SPEED : AIR_SPEED)
        ).x,
        playerVelocity.y,
        getSideVector(camera, playerDirection).multiplyScalar(
          -(playerOnFloor ? GROUND_SPEED : AIR_SPEED)
        ).z
      );
    right &&
      playerVelocity.set(
        getSideVector(camera, playerDirection).multiplyScalar(
          playerOnFloor ? GROUND_SPEED : AIR_SPEED
        ).x,
        playerVelocity.y,
        getSideVector(camera, playerDirection).multiplyScalar(
          playerOnFloor ? GROUND_SPEED : AIR_SPEED
        ).z
      );
    forward &&
      playerVelocity.set(
        getForwardVector(camera, playerDirection).multiplyScalar(
          playerOnFloor ? GROUND_SPEED : AIR_SPEED
        ).x,
        playerVelocity.y,
        getForwardVector(camera, playerDirection).multiplyScalar(
          playerOnFloor ? GROUND_SPEED : AIR_SPEED
        ).z
      );
    backward &&
      playerVelocity.set(
        getForwardVector(camera, playerDirection).multiplyScalar(
          -(playerOnFloor ? GROUND_SPEED : AIR_SPEED)
        ).x,
        playerVelocity.y,
        getForwardVector(camera, playerDirection).multiplyScalar(
          -(playerOnFloor ? GROUND_SPEED : AIR_SPEED)
        ).z
      );

    if (playerOnFloor) {
      if (jump) {
        playerVelocity.y = JUMP_SPEED;
      }
    }
    api.velocity.set(playerVelocity.x, playerVelocity.y, playerVelocity.z);

    // Reset the players rotation back to forwards on respawn
    // api.rotation.set(0, 0, 0);

    if (reset) {
      api.position.set(...position!);
      api.rotation.set(...rotation!);
      api.velocity.set(0, 0, 0);
    }
  }

  useFrame((_, delta) => {
    handleControls(
      camera,
      delta,
      playerVelocity,
      playerOnFloor,
      playerDirection
    );
    // teleportPlayerIfOob(capsule, playerVelocity)
  });

  return (
    <group ref={ref}>
      {/* <mesh receiveShadow castShadow>
        <capsuleGeometry args={args} />
        <meshStandardMaterial wireframe color="green" />
      </mesh> */}
    </group>
  );
}

export default Player;
