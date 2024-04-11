import { Vector3 } from "three";

export const Gravity: number = 30;
export const ballCount: number = 100;
export const rampCount: number = 100;
export const radius: number = 0.2;
export const balls: { position: number[] }[] = [...Array(ballCount)].map(
  () => ({ position: [Math.random() * 50 - 25, 20, Math.random() * 50 - 25] })
);
export const ramps: { position: number[] }[] = [...Array(rampCount)].map(
  () => ({
    position: [Math.random() * 50 - 25, 20, Math.random() * 50 - 25],
  })
);
export const v1: Vector3 = new Vector3();
export const v2: Vector3 = new Vector3();
export const v3: Vector3 = new Vector3();
export const frameSteps: number = 5;
