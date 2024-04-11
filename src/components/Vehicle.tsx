import type { BoxProps, WheelInfoOptions } from "@react-three/cannon";
import { useBox, useRaycastVehicle } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { Mesh } from "three";

import { Chassis } from "./Chassis";
import { useControls } from "../useControls";
import { PerspectiveCamera } from "@react-three/drei";
import useFollowCam from "../useFollowCam";

export type VehicleProps = Required<
  Pick<BoxProps, "angularVelocity" | "position" | "rotation">
> & {
  back?: number;
  force?: number;
  front?: number;
  height?: number;
  maxBrake?: number;
  radius?: number;
  steer?: number;
  width?: number;
};

function Vehicle({
  angularVelocity,
  // back = -1.15,
  // force = 1500,
  // front = 1.3,
  // height = -0.04,
  // maxBrake = 50,
  position,
  // radius = 0.7,
  rotation,
}: // steer = 0.5,
// width = 1.2,
VehicleProps) {
  const controls = useControls();

  // const wheelInfo: WheelInfoOptions = {
  //   axleLocal: [-1, 0, 0], // This is inverted for asymmetrical wheel models (left v. right sided)
  //   customSlidingRotationalSpeed: -30,
  //   dampingCompression: 4.4,
  //   dampingRelaxation: 10,
  //   directionLocal: [0, -1, 0], // set to same as Physics Gravity
  //   frictionSlip: 2,
  //   maxSuspensionForce: 1e4,
  //   maxSuspensionTravel: 0.3,
  //   radius,
  //   suspensionRestLength: 0.3,
  //   suspensionStiffness: 30,
  //   useCustomSlidingRotationalSpeed: true,
  // };

  const [chassisBody, chassisApi] = useBox(
    () => ({
      allowSleep: false,
      angularVelocity,
      args: [1.7, 1, 4],
      mass: 500,
      onCollide: (e) => console.log("bonk", e.body.userData),
      position,
      rotation,
    }),
    useRef<Mesh>(null)
  );
  const { yaw } = useFollowCam(chassisBody, [0, 0.5, -1.5]);

  // const [vehicle, vehicleApi] = useRaycastVehicle(
  //   () => ({
  //     chassisBody,
  //     wheelInfos: [wheelInfo1, wheelInfo2, wheelInfo3, wheelInfo4],
  //     wheels,
  //   }),
  //   useRef<Group>(null)
  // );

  // useEffect(
  //   () => vehicleApi.sliding.subscribe((v) => console.log("sliding", v)),
  //   []
  // );

  const chassisVelocity = useRef([0, 0, 0]);
  useEffect(() => {
    const chassisVelocityUnsubscribe = chassisApi.velocity.subscribe(
      (vel) => (chassisVelocity.current = vel)
    );
    return chassisVelocityUnsubscribe;
  }, []);
  const chassisPosition = useRef([0, 0, 0]);
  useEffect(() => {
    const chassisPositionUnsubscribe = chassisApi.position.subscribe(
      (pos) => (chassisPosition.current = pos)
    );
    return chassisPositionUnsubscribe;
  }, []);
  const chassisAngularVelocity = useRef([0, 0, 0]);
  useEffect(() => {
    const chassisAngularVelocityUnsubscribe = chassisApi.position.subscribe(
      (angVel) => (chassisAngularVelocity.current = angVel)
    );
    return chassisAngularVelocityUnsubscribe;
  }, []);

  useFrame((state, delta) => {
    const { backward, jump, forward, left, reset, right } = controls.current;
    const playerOnFloor = false;
    const speedDelta = delta * (playerOnFloor ? 25 : 8);

    if (right || left || forward || backward || jump) {
      chassisApi.velocity.set(
        chassisVelocity.current[0] +
          (right ? +speedDelta : left ? -speedDelta : 0),
        jump ? 5 : chassisVelocity.current[1],
        chassisVelocity.current[2] +
          (forward ? -speedDelta : backward ? +speedDelta : 0)
      );
    }

    if (reset) {
      chassisApi.position.set(...position);
      chassisApi.velocity.set(0, 0, 0);
      chassisApi.angularVelocity.set(...angularVelocity);
      chassisApi.rotation.set(...rotation);
    }

    // state.camera.lookAt(targetRef.current.position);
    state.camera.updateProjectionMatrix();
  });

  return (
    <group position={[0, -0.4, 0]}>
      <PerspectiveCamera makeDefault fov={60} />
      <Chassis ref={chassisBody} />
      {/* <Wheel ref={wheels[0]} radius={radius} leftSide />
      <Wheel ref={wheels[1]} radius={radius} />
      <Wheel ref={wheels[2]} radius={radius} leftSide />
      <Wheel ref={wheels[3]} radius={radius} /> */}
    </group>
  );
}

export default Vehicle;
