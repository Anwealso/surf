import { useRef, useEffect, useMemo } from "react";
import { Capsule } from "three/examples/jsm/math/Capsule.js";
import { Vector3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import useKeyboard from "../useKeyboard";

const GRAVITY = 30;
const STEPS_PER_FRAME = 5;
const BOUNCINESS = 1;
const AIR_RESISTANCE = 0.1;
const FRICTION = 1;

export default function Player({ octree, colliders, ballCount }) {
  const playerOnFloor = useRef(false);
  const playerVelocity = useMemo(() => new Vector3(), []);
  const playerDirection = useMemo(() => new Vector3(), []);
  const capsule = useMemo(
    () => new Capsule(new Vector3(0, 10, 0), new Vector3(0, 11, 0), 0.5),
    []
  );
  const { camera } = useThree();
  let clicked = 0;

  const onPointerDown = () => {
    throwBall(camera, capsule, playerDirection, playerVelocity, clicked++);
  };
  useEffect(() => {
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
    };
  });

  useEffect(() => {
    colliders[ballCount] = { capsule: capsule, velocity: playerVelocity };
  }, [colliders, ballCount, capsule, playerVelocity]);

  const keyboard = useKeyboard();

  function getForwardVector(camera, playerDirection) {
    camera.getWorldDirection(playerDirection);
    playerDirection.y = 0;
    playerDirection.normalize();
    return playerDirection;
  }

  function getSideVector(camera, playerDirection) {
    camera.getWorldDirection(playerDirection);
    playerDirection.y = 0;
    playerDirection.normalize();
    playerDirection.cross(camera.up);
    return playerDirection;
  }

  function controls(
    camera,
    delta,
    playerVelocity,
    playerOnFloor,
    playerDirection
  ) {
    const speedDelta = delta * (playerOnFloor ? 25 : 8);
    keyboard["KeyA"] &&
      playerVelocity.add(
        getSideVector(camera, playerDirection).multiplyScalar(-speedDelta)
      );
    keyboard["KeyD"] &&
      playerVelocity.add(
        getSideVector(camera, playerDirection).multiplyScalar(speedDelta)
      );
    keyboard["KeyW"] &&
      playerVelocity.add(
        getForwardVector(camera, playerDirection).multiplyScalar(speedDelta)
      );
    keyboard["KeyS"] &&
      playerVelocity.add(
        getForwardVector(camera, playerDirection).multiplyScalar(-speedDelta)
      );
    if (playerOnFloor) {
      if (keyboard["Space"]) {
        playerVelocity.y = 15;
      }
    }
  }

  function updatePlayer(
    camera,
    delta,
    octree,
    capsule,
    playerVelocity,
    playerOnFloor
  ) {
    // Updated the velocity vector
    if (playerOnFloor) {
      // If on floor, add friction
      let frictionalDamping = (Math.exp(-4 * delta) - 1) * FRICTION;
      playerVelocity.addScaledVector(playerVelocity, frictionalDamping);
    } else {
      // If in air, add gravity
      playerVelocity.y -= GRAVITY * delta;
    }
    // Add air resistance
    let airDamping = (Math.exp(-4 * delta) - 1) * AIR_RESISTANCE;
    playerVelocity.addScaledVector(playerVelocity, airDamping);

    // Move the player based on their velocity vector
    const deltaPosition = playerVelocity.clone().multiplyScalar(delta);
    capsule.translate(deltaPosition);
    // Handle player collisions
    playerOnFloor = playerCollisions(capsule, octree, playerVelocity);
    // Keep the camera stuck to the player (move the camera to the new player position)
    camera.position.copy(capsule.end);
    return playerOnFloor;
  }

  function throwBall(camera, capsule, playerDirection, playerVelocity, count) {
    const { sphere, velocity } = colliders[count % ballCount];

    camera.getWorldDirection(playerDirection);

    sphere.center
      .copy(capsule.end)
      .addScaledVector(playerDirection, capsule.radius * 1.5);

    velocity.copy(playerDirection).multiplyScalar(50);
    velocity.addScaledVector(playerVelocity, 2);
  }

  function playerCollisions(capsule, octree, playerVelocity) {
    // Check whether the player capsule instersects with the octree made from the world platform model (defined in glb file)
    const result = octree.capsuleIntersect(capsule);
    let playerOnFloor = false;

    // If the player does intersect the world platform
    if (result) {
      playerOnFloor = result.normal.y > 0;
      if (!playerOnFloor) {
        // If the player is not standing on the world plarform (i.e. we are hitting into the side of world platform cones, balls, etc.)
        // Then bang deflect the player off the object towards the direction of the object surface normal
        playerVelocity.addScaledVector(
          result.normal,
          -result.normal.dot(playerVelocity) * BOUNCINESS
        );
      }
      capsule.translate(result.normal.multiplyScalar(result.depth));
    }
    return playerOnFloor;
  }

  function teleportPlayerIfOob(camera, capsule, playerVelocity) {
    if (camera.position.y <= -100) {
      playerVelocity.set(0, 0, 0);
      capsule.start.set(0, 10, 0);
      capsule.end.set(0, 11, 0);
      camera.position.copy(capsule.end);
      camera.rotation.set(0, 0, 0);
    }
  }

  useFrame(({ camera }, delta) => {
    controls(
      camera,
      delta,
      playerVelocity,
      playerOnFloor.current,
      playerDirection
    );
    const deltaSteps = Math.min(0.05, delta) / STEPS_PER_FRAME;
    for (let i = 0; i < STEPS_PER_FRAME; i++) {
      playerOnFloor.current = updatePlayer(
        camera,
        deltaSteps,
        octree,
        capsule,
        playerVelocity,
        playerOnFloor.current
      );
    }
    teleportPlayerIfOob(camera, capsule, playerVelocity);
  });
}
