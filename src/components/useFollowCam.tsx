import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { Object3D, Vector3 } from "three";

export default function useFollowCam(
  ref: Group,
  heightOffset: number // height to offset from centre of player body
) {
  const { scene, camera } = useThree();

  const pivot = useMemo(() => new Object3D(), []);
  const alt = useMemo(() => new Object3D(), []);
  const yaw = useMemo(() => new Object3D(), []);
  const pitch = useMemo(() => new Object3D(), []);
  const worldPosition = useMemo(() => new Vector3(), []);

  function onDocumentMouseWheel(e) {
    if (document.pointerLockElement) {
      e.preventDefault();
      const v = camera.position.z + e.deltaY * 0.005;
      if (v >= 0.5 && v <= 5) {
        camera.position.z = v;
      }
    }
  }

  useEffect(() => {
    scene.add(pivot);
    pivot.add(alt);
    alt.add(yaw);
    yaw.add(pitch);
    pitch.add(camera);
    camera.position.set(0, heightOffset, 0);

    // scene.add(camera);
    // document.addEventListener("mousewheel", onDocumentMouseWheel, {
    //   passive: false,
    // });
    // return () => {
    //   document.removeEventListener("mousewheel", onDocumentMouseWheel);
    // };
  }, [camera]);

  useFrame(() => {
    ref.current.getWorldPosition(worldPosition);
    pivot.position.lerp(worldPosition, 1); // position the pivot point at this world position
  });

  return { camera, pivot, alt, yaw, pitch };
}
