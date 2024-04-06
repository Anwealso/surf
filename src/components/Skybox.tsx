import * as THREE from 'three'
import { useRef } from 'react'
import * as R3F from '@react-three/fiber'

function Skybox(props: R3F.ThreeElements['mesh']) {
    const meshRef = useRef<THREE.Mesh>(null!)

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
            <boxGeometry args={[8, 3, 16]} attach="geometry" />
            <meshStandardMaterial
                color={'white'}
                attach="material"
                side={THREE.BackSide}
            />
        </mesh>
    )
}

export default Skybox
