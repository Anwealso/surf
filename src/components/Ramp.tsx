import * as THREE from 'three'
import { useRef, useEffect } from 'react'
import * as R3F from '@react-three/fiber'

function Ramp(props: R3F.ThreeElements['mesh']) {
    const meshRef = useRef<THREE.Mesh>(null!)
    // const [hovered, setHover] = useState(false)
    // const [active, setActive] = useState(false)

    const radialSegments = 200
    const radius = 0.5
    const colorFace = 'red'

    return (
        <mesh
            {...props}
            ref={meshRef}
            // scale={active ? 1.2 : 1}
            // onClick={() => setControls({ playAudio: !playAudio })}
            // onPointerOver={() => setHover(true)}
            // onPointerOut={() => setHover(false)}
            rotation={[0, 0, 0]}
        >
            {/* Top Head Dome */}
            <sphereGeometry
                args={[
                    radius,
                    radialSegments,
                    Math.round(radialSegments / 2),
                    0,
                    Math.PI * 2,
                    0,
                    Math.PI * 0.5,
                ]}
                attach="geometry"
            />
            <meshStandardMaterial
                color={colorFace}
                attach="material"
                metalness={0}
            />
        </mesh>
    )
}

export default Ramp
