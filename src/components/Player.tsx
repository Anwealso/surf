import { useEffect, useRef, useMemo, useState } from "react";
import { Group, Vector3 } from "three";
import { useFrame, Camera } from "@react-three/fiber";
import { CompoundBodyProps, useCompoundBody } from "@react-three/cannon";
import { useControls } from "./useControls";
import useFollowCam from "./useFollowCam";

const GROUND_SPEED = 14;
const JUMP_SPEED = 6;
const AIR_SPEED = GROUND_SPEED / 10;

const SPEED_RAMP = 6;

type OurCompoundBodyProps = Pick<CompoundBodyProps, "position" | "rotation"> & {
  mass: number; // mass of player
  args: [
    radius: number,
    length: number,
    capSegments: number,
    radialSegments: number
  ]; // shape of the capsule
  setPlayerSpeed: any; // mass of player
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
    const movespeed = playerOnFloor ? GROUND_SPEED : AIR_SPEED;
    const speedDelta =
      SPEED_RAMP * delta * (playerOnFloor ? GROUND_SPEED : AIR_SPEED);

    if (left || right || forward || backward) {
      const moveVector: Vector3 = new Vector3(0, 0, 0);

      if (left) {
        moveVector.add(
          getSideVector(camera, playerDirection).multiplyScalar(-speedDelta)
        );
      } else if (right) {
        moveVector.add(
          getSideVector(camera, playerDirection).multiplyScalar(speedDelta)
        );
      }
      if (forward) {
        moveVector.add(
          getForwardVector(camera, playerDirection).multiplyScalar(speedDelta)
        );
      } else if (backward) {
        moveVector.add(
          getForwardVector(camera, playerDirection).multiplyScalar(-speedDelta)
        );
      }
      console.log(
        `moveVector F/B: [${moveVector.x}, ${moveVector.y}, ${moveVector.z}]`
      );

      // Clamp the moveVector x/z values to be
      //   - at most the difference between the playerVelocity speed and the +1 * movespeed, and
      //   - at minimum the difference between the playerVelocity speed and the -1 * movespeed
      // i.e. If we are under, the moveVector will be non-zero and we will add this to our playerVelocity
      // and make us go faster, and if we are over, we will not add anything to the existing playerVelocity.
      moveVector.clamp(
        new Vector3(
          -movespeed - playerVelocity.x,
          -Number.MAX_VALUE,
          -movespeed - playerVelocity.z
        ),
        new Vector3(
          movespeed - playerVelocity.x,
          Number.MAX_VALUE,
          movespeed - playerVelocity.z
        )
      );

      // And the clamped moveVector to the playerVelocity
      playerVelocity.add(moveVector);
    }

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
