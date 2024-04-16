import { useEffect, useRef, useMemo, useState } from "react";
import { CapsuleGeometry, DoubleSide, Group, Vector3 } from "three";
import { useFrame, Camera } from "@react-three/fiber";
import {
  CompoundBodyProps,
  Triplet,
  useCompoundBody,
  useSphere,
} from "@react-three/cannon";
import { useControls } from "./useControls";
import useFollowCam from "./useFollowCam";
import { Capsule } from "@react-three/drei";

// const STEPS_PER_FRAME = 5;
const GROUND_SPEED = 5;
const AIR_SPEED = GROUND_SPEED / 10;
const MAX_SPEED = 15;
const JUMP_SPEED = 5;
const SPEED_RAMP = 4;

type OurCompoundBodyProps = Pick<CompoundBodyProps, "position" | "rotation"> & {
  mass: number; // mass of player
  args: [
    radius: number,
    length: number,
    capSegments: number,
    radialSegments: number
  ]; // shape of the capsule
};

function Player({
  mass,
  args,
  position,
  ...props
}: OurCompoundBodyProps): JSX.Element {
  const controls = useControls();
  // const playerOnFloor = useRef(true);
  const playerPosition: Vector3 = useMemo(() => new Vector3(), []);
  const playerVelocity: Vector3 = useMemo(() => new Vector3(), []);
  const playerDirection: Vector3 = useMemo(() => new Vector3(), []);
  const playerAngularVelocity: Vector3 = useMemo(() => new Vector3(), []);

  const [playerOnFloor, _]: [boolean, any] = useState(true);

  // const [ref, api] = useSphere(
  //   () => ({ args: [1], mass: 1, position: [2, 2, 2] }),
  //   useRef<Mesh>(null)
  // );

  const [ref, api] = useCompoundBody(
    () => ({
      mass: 60,
      position: position,
      fixedRotation: true,
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

    // api.rotation.set(0, 0, 0);

    if (reset) {
      api.position.set(...position!);
      api.rotation.set(0, 0, 0);
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
