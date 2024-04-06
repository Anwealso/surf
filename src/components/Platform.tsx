import * as THREE from 'three'
import { useRef } from 'react'
import * as R3F from '@react-three/fiber'

function Platform(props: R3F.ThreeElements['mesh']) {
    const meshRef = useRef<THREE.Mesh>(null!)

    const lengthX = 10;
    const lengthY = 10;
    const segmentDensity = 10;

    return (
        <mesh
            {...props}
            ref={meshRef}
            rotation={[0.5*Math.PI, 0, 0]}
        >
            <planeGeometry
                args={[lengthX, lengthY, segmentDensity*lengthX, segmentDensity*lengthY]} attach="geometry" />
            <meshBasicMaterial wireframe color={'lime'} />
        </mesh>
    )
}

export default Platform
