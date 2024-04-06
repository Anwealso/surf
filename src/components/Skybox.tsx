import * as THREE from 'three'
import { useRef } from 'react'
import * as R3F from '@react-three/fiber'

function Skybox(props: R3F.ThreeElements['mesh']) {
    const meshRef = useRef<THREE.Mesh>(null!)

    return (
        <mesh
            {...props}
            ref={meshRef}
            rotation={[0, 0, 0]}
        >
            <boxGeometry args={[24, 9, 48]} attach="geometry" />
            <meshStandardMaterial
                color={'white'}
                attach="material"
                side={THREE.BackSide}
            />
        </mesh>
    )
}

export default Skybox
