import { useEffect, useRef, useMemo, useState } from "react";
// import { Capsule } from "three/examples/jsm/math/Capsule.js";
import type { Mesh } from "three";
import {
  // DoubleSide,
  Vector3,
} from "three";
import {
  // useThree,
  useFrame,
  Camera,
} from "@react-three/fiber";
import type { BoxProps } from "@react-three/cannon";
import {
  // useBox,
  useSphere,
} from "@react-three/cannon";
import { useControls } from "./useControls";
import useFollowCam from "./useFollowCam";

// const STEPS_PER_FRAME = 5;
const GROUND_SPEED = 5;
const AIR_SPEED = GROUND_SPEED / 3;
const MAX_SPEED = 15;
const JUMP_SPEED = 5;
const SPEED_RAMP = 4;

function Platform({ ...props }: BoxProps) {
  const controls = useControls();
  // const playerOnFloor = useRef(true);
  const playerPosition: Vector3 = useMemo(() => new Vector3(), []);
  const playerVelocity: Vector3 = useMemo(() => new Vector3(), []);
  const playerDirection: Vector3 = useMemo(() => new Vector3(), []);
  const playerAngularVelocity: Vector3 = useMemo(() => new Vector3(), []);
  // const capsule = useMemo(
  //   () => new Capsule(new Vector3(0, 10, 0), new Vector3(0, 11, 0), 0.5),
  //   []
  // );

  const [playerOnFloor, _]: [boolean, any] = useState(true);

  // const [ref, api] = useBox(
  //   () => ({
  //     allowSleep: false,
  //     args: [1.7, 1, 4],
  //     mass: 60,
  //     onCollide: (e) => {
  //       console.log("bonk", e.body.userData, playerOnFloor);
  //       // setPlayerOnFloor(!playerOnFloor);
  //     },
  //     onCollideBegin: () => {
  //       setPlayerOnFloor(true);
  //     },
  //     onCollideEnd: () => {
  //       // setPlayerOnFloor(false);
  //     },
  //     ...props,
  //   }),
  //   useRef<Mesh>(null)
  // );

  const [ref, api] = useSphere(
    () => ({ args: [0.1], mass: 1, ...props }),
    useRef<Mesh>(null)
  );

  const { camera } = useFollowCam(ref);

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
    const speedDelta =
      SPEED_RAMP * delta * (playerOnFloor ? GROUND_SPEED : AIR_SPEED);

    left &&
      playerVelocity.add(
        getSideVector(camera, playerDirection).multiplyScalar(-speedDelta)
      );
    right &&
      playerVelocity.add(
        getSideVector(camera, playerDirection).multiplyScalar(speedDelta)
      );
    forward &&
      playerVelocity.add(
        getForwardVector(camera, playerDirection).multiplyScalar(speedDelta)
      );
    backward &&
      playerVelocity.add(
        getForwardVector(camera, playerDirection).multiplyScalar(-speedDelta)
      );
    playerVelocity.clamp(
      new Vector3(-MAX_SPEED, -Number.MAX_VALUE, -MAX_SPEED),
      new Vector3(MAX_SPEED, Number.MAX_VALUE, MAX_SPEED)
    );

    if (playerOnFloor) {
      if (jump) {
        playerVelocity.y = JUMP_SPEED;
      }
    }
    api.velocity.set(playerVelocity.x, playerVelocity.y, playerVelocity.z);

    if (reset) {
      api.position.set(0, 0, 0);
      api.rotation.set(0, 0, 0);
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);
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
    // handleControls(camera, delta, playerVelocity, playerOnFloor.current);
    // teleportPlayerIfOob(capsule, playerVelocity)
  });

  return (
    <mesh ref={ref} receiveShadow>
      <boxGeometry {...props} />
      {/* <meshStandardMaterial color="#3333FF" side={DoubleSide} /> */}
      <meshStandardMaterial color="#3333FF" />
    </mesh>
  );
}

export default Platform;
