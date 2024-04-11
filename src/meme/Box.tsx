import * as THREE from 'three'
import { useRef, useState } from 'react'
import * as R3F from '@react-three/fiber'

function Box(props: R3F.ThreeElements['mesh']) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)

    R3F.useFrame((state, delta) => (meshRef.current.rotation.x += delta))
    R3F.useFrame((state, delta) => (meshRef.current.rotation.y += delta))
    return (
        <mesh
            {...props}
            ref={meshRef}
            scale={active ? 1.5 : 1}
            onClick={() => setActive(!active)}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    )
}

export default Box
