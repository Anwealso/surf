import { useEffect, useRef, useMemo, useState } from "react";
import { Group, Vector3 } from "three";
import { useFrame, Camera } from "@react-three/fiber";
import { CompoundBodyProps, useCompoundBody } from "@react-three/cannon";
import { useControls } from "./useControls";
import useFollowCam from "./useFollowCam";
import { bouncyMaterial, boxMaterial } from "./Materials";

// const GROUND_SPEED = 14;
// const JUMP_SPEED = 6;
// const AIR_SPEED = GROUND_SPEED / 10;
// const SPEED_RAMP = 6;

const JUMP_SPEED = 7;
const RUN_SPEED = 14;
// const AIR_SPEED = GROUND_SPEED / 10;
const MAX_ACCEL = 14;

type OurCompoundBodyProps = Pick<CompoundBodyProps, "position" | "rotation"> & {
  mass: number; // mass of player
  args: [
    radius: number,
    length: number,
    capSegments: number,
    radialSegments: number
  ]; // shape of the capsule
  setPlayerSpeed: any; // a handle to set the player speed that will be seen on the speed monitor
};

function Player({
  mass,
  args,
  position,
  setPlayerSpeed,
  ...props
}: OurCompoundBodyProps): JSX.Element {
  const controls = useControls();
  const playerPosition: Vector3 = useMemo(() => new Vector3(), []);
  const playerVelocity: Vector3 = useMemo(() => new Vector3(), []);
  const playerDirection: Vector3 = useMemo(() => new Vector3(), []);
  const playerAngularVelocity: Vector3 = useMemo(() => new Vector3(), []);

  const [playerOnFloor, setPlayerOnFloor]: [boolean, any] = useState(true);

  const [ref, api] = useCompoundBody(
    () => ({
      mass: mass,
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
          material: boxMaterial,
        },
        {
          args: [args[0], args[0], args[1], args[3]],
          position: [0, +args[1] / 2, 0],
          rotation: [0, 0, 0],
          type: "Cylinder",
          material: boxMaterial,
        },
        {
          args: [args[0]],
          position: [0, +args[1] / 2, 0],
          rotation: [0, 0, 0],
          type: "Sphere",
          material: boxMaterial,
        },
      ],
    }),
    useRef<Group>(null)
  );

  const { camera } = useFollowCam(ref, args[1] / 2);

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

  useEffect(() => {
    const playerVelocityUnsubscribe = api.velocity.subscribe((vel) =>
      playerVelocity.set(...vel)
    );
    return playerVelocityUnsubscribe;
  }, []);
  useEffect(() => {
    const playerPositionUnsubscribe = api.position.subscribe((pos) =>
      playerPosition.set(...pos)
    );
    return playerPositionUnsubscribe;
  }, []);
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

    // Get the current wishdir
    const wishdir = getWishdir(playerDirection, backward, forward, left, right);

    // Accelerate the player in the xy plane
    playerVelocity = pmAccelerate(playerVelocity, wishdir, delta);

    // Handle Z physics (gravity model)
    if (playerOnFloor) {
      if (jump) {
        playerVelocity.y = JUMP_SPEED;
      }
    }

    api.velocity.set(playerVelocity.x, playerVelocity.y, playerVelocity.z);

    // Display player speed on overlay (lags game badly when in use)
    // setPlayerSpeed(
    //   Math.round((playerVelocity.length() + Number.EPSILON) * 10) / 10
    // );

    if (reset) {
      api.position.set(...position!);
      api.velocity.set(0, 0, 0);
    }
  }

  function pmAccelerate(
    vel: Vector3,
    wishDir: Vector3,
    frametime: number = 1 / 120
  ) {
    /**
     * Calculates the new velocity of the player by applying the appropriate acceleration
     *
     * Args:
     *   - vel: Players current velocity
     *   - wishdir: Unit vector direction we want to go
     *   - frametime: The delta time between frames
     */

    const currentSpeed: number = vel.dot(wishDir); // the current speed in the wish direction
    let addSpeed: number = RUN_SPEED - currentSpeed; // the amount of speed to add
    addSpeed = Math.max(Math.min(addSpeed, MAX_ACCEL * frametime), 0); // clamp the addspeed based on the frametime

    return vel.add(wishDir.multiplyScalar(addSpeed));
  }

  function getWishdir(
    playerDirection: Vector3,
    backward: boolean,
    forward: boolean,
    left: boolean,
    right: boolean
  ) {
    /**
     * Calculates the desired movement direction (unit vector) of the player
     * based on te control inputs
     *
     * Args:
     *   - cnotrols: control inputs
     */

    const wishdir: Vector3 = new Vector3(0, 0, 0);

    if (left) {
      wishdir.add(getSideVector(camera, playerDirection).multiplyScalar(-1));
    } else if (right) {
      wishdir.add(getSideVector(camera, playerDirection));
    }
    if (forward) {
      wishdir.add(getForwardVector(camera, playerDirection));
    } else if (backward) {
      wishdir.add(getForwardVector(camera, playerDirection).multiplyScalar(-1));
    }

    return wishdir.normalize();
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
