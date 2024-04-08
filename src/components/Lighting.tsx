import { Environment } from "@react-three/drei";

function Lighting() {
  return (
    <>
      {/* Alex's Custom Lighting Setup */}
      {/* <Environment preset="sunset" /> */}
      {/* <ambientLight intensity={0.5} /> */}
      {/* Key Light */}
      {/* <directionalLight position={[-2, 2, 2]} intensity={1} /> */}
      {/* Fill Light */}
      {/* <directionalLight position={[-2, 0, -2]} intensity={0.5} /> */}
      {/* Back Light */}
      {/* <directionalLight position={[2, 0, 2]} intensity={0.2} /> */}

      {/* Pro Lighting Setup (lighting chained to camera) */}
      <Environment files="/images/rustig_koppie_puresky_1k.hdr" background />
      <directionalLight
        intensity={1}
        castShadow={true}
        shadow-bias={-0.00015}
        shadow-radius={4}
        shadow-blur={10}
        shadow-mapSize={[2048, 2048]}
        position={[85.0, 80.0, 70.0]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
    </>
  );
}

export default Lighting;
