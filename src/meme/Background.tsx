import * as THREE from 'three'
import { useRef, useState, useEffect } from 'react'
// import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import * as R3F from '@react-three/fiber'
import {
    // Stats,
    OrbitControls,
    Environment,
    useTexture,
    // useMask,
} from '@react-three/drei'

function Background(props: R3F.ThreeElements['mesh']) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const texture = useTexture('textures/bg.jpeg')

    return (
        <mesh {...props} ref={meshRef}>
            <planeGeometry args={[6, 3]} />
            <meshBasicMaterial map={texture} />
        </mesh>
    )
}


export default Background
