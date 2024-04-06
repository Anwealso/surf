import * as THREE from 'three'
import { useRef, useState, useEffect } from 'react'
// import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import * as R3F from '@react-three/fiber'
import './Viewer.css'
import {
    // Stats,
    OrbitControls,
    Environment,
    useTexture,
    // useMask,
} from '@react-three/drei'
import Ramp from './components/Ramp'
import Skybox from './components/Skybox'
import Background from './components/Background'
import Box from './components/Box'

function Viewer() {
    return (
        <>
            <div id="viewer-container">
                <R3F.Canvas shadows camera={{ position: [0, 0, 4], fov: 42 }}>
                    <Environment preset="sunset" />
                    <ambientLight intensity={0.5} />
                    {/* Key Light */}
                    {/* <directionalLight position={[-2, 2, 2]} intensity={1} /> */}
                    {/* Fill Light */}
                    {/* <directionalLight position={[-2, 0, -2]} intensity={0.5} /> */}
                    {/* Back Light */}
                    {/* <directionalLight position={[2, 0, 2]} intensity={0.2} /> */}
                    <OrbitControls />

                    <Ramp position={[0, 0, 0]} />

                    <Background position={[0, 0, -7.99]} />
                    
                    <Box position={[0, 0, -3]} />
                    
                    <Skybox position={[0, 0, 0]} />
                </R3F.Canvas>
            </div>
        </>
    )
}

export default Viewer
