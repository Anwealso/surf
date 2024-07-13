import { useEffect, useRef, useMemo, useState } from "react";
import { Group, Vector3 } from "three";
import { useFrame, Camera } from "@react-three/fiber";
import { CompoundBodyProps, useCompoundBody } from "@react-three/cannon";
import { useControls } from "./useControls";
import useFollowCam from "./useFollowCam";
import { useContactMaterials, boxMaterial } from "./Materials";

const GROUND_SPEED = 14;
const JUMP_SPEED = 6;
const RUN_SPEED = 14;
const AIR_SPEED = GROUND_SPEED / 10;
const MAX_ACCEL = 50;

type OurCompoundBodyProps = Pick<CompoundBodyProps, "position" | "rotation"> & {
  mass: number;
  args: [
    radius: number,
    length: number,
    capSegments: number,
    radialSegments: number
  ];
};

function Player({
  mass,
  args,
  position,
  ...props
}: OurCompoundBodyProps): JSX.Element {
  const controls = useControls();
  const playerPosition: Vector3 = useMemo(() => new Vector3(), []);
  const playerVelocity: Vector3 = useMemo(() => new Vector3(), []);
  const playerDirection: Vector3 = useMemo(() => new Vector3(), []);
  const playerAngularVelocity: Vector3 = useMemo(() => new Vector3(), []);
  useContactMaterials();

  const [playerOnFloor, setPlayerOnFloor] = useState(true);
  const [playerOnRamp, setPlayerOnRamp] = useState(false);

  function resetPlayer() {
    api.position.set(...position!);
    api.velocity.set(0, 0, 0);
    // Use applyForce to ensure velocity is zeroed out
    api.applyForce([0, 0, 0], [0, 0, 0]);
    setPlayerOnFloor(false);
    setPlayerOnRamp(false);
  }

  const [ref, api] = useCompoundBody(
    () => ({
      mass: mass,
      position: position!,
      fixedRotation: true,
      onCollideBegin: (e) => {
        console.log("bonk", e.body.userData);
        if (e.body.userData.id === "deathMaterial") {
          resetPlayer();
        } else {
          setPlayerOnFloor(true);
          // if (isRampCollision(e.contact)) {
          if (e.body.userData.id === "rampMaterial") {
            setPlayerOnRamp(true);
          }
        }
      },
      onCollideEnd: () => {
        setPlayerOnFloor(false);
        setPlayerOnRamp(false);
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

  function teleportPlayerIfOob() {
    if (
      Math.abs(playerPosition.x) > 1000 ||
      Math.abs(playerPosition.y) > 1000 ||
      Math.abs(playerPosition.z) > 1000
    ) {
      resetPlayer();
    }
  }

  useEffect(() => {
    const playerVelocityUnsubscribe = api.velocity.subscribe((vel) =>
      playerVelocity.set(...vel)
    );
    return () => playerVelocityUnsubscribe();
  }, [api.velocity, playerVelocity]);

  useEffect(() => {
    const playerPositionUnsubscribe = api.position.subscribe((pos) =>
      playerPosition.set(...pos)
    );
    return () => playerPositionUnsubscribe();
  }, [api.position, playerPosition]);

  useEffect(() => {
    const playerAngularVelocityUnsubscribe = api.angularVelocity.subscribe(
      (angVel) => playerAngularVelocity.set(...angVel)
    );
    return () => playerAngularVelocityUnsubscribe();
  }, [api.angularVelocity, playerAngularVelocity]);

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

  function handleControls(delta: number) {
    const { backward, jump, forward, left, right, reset } = controls.current;

    const wishdir = getWishdir(playerDirection, backward, forward, left, right);

    playerVelocity.copy(pmAccelerate(playerVelocity, wishdir, delta));

    if (playerOnFloor || playerOnRamp) {
      if (jump) {
        playerVelocity.y = JUMP_SPEED;
      }
    } else {
      playerVelocity.y += -9.81 * delta; // Gravity
    }

    api.velocity.set(playerVelocity.x, playerVelocity.y, playerVelocity.z);

    if (reset) {
      resetPlayer();
    }
  }

  function pmAccelerate(
    vel: Vector3,
    wishDir: Vector3,
    frametime: number = 1 / 120
  ) {
    const currentSpeed = vel.dot(wishDir);
    let addSpeed = (playerOnFloor ? GROUND_SPEED : AIR_SPEED) - currentSpeed;
    addSpeed = Math.max(Math.min(addSpeed, MAX_ACCEL * frametime), 0);
    return vel.add(wishDir.multiplyScalar(addSpeed));
  }

  function getWishdir(
    playerDirection: Vector3,
    backward: boolean,
    forward: boolean,
    left: boolean,
    right: boolean
  ) {
    const wishdir = new Vector3(0, 0, 0);

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

  function isRampCollision(contact) {
    const normal = contact.ni;
    return normal.y < 0.9; // Assuming ramp surfaces have a normal less than this threshold
  }

  useFrame((_, delta) => {
    handleControls(delta);
    teleportPlayerIfOob();
  });

  return <group ref={ref}></group>;
}

export default Player;
