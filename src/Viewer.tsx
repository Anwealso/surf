import './Viewer.css'
import { Canvas } from '@react-three/fiber'
import {
    Stats,
    Environment,
    OrbitControls,
    PointerLockControls,
} from '@react-three/drei'

import Lighting from './components/Lighting'
import Game from './Game'

function Viewer() {
    return (
        <>
            <div id="viewer-container">
                <Canvas shadows camera={{ position: [0, 0, 4], fov: 60 }}>
                    <Lighting />
                    {/* <Environment files="/images/rustig_koppie_puresky_1k.hdr" background /> */}

                    <PointerLockControls />

                    <Game />
                    
                    <Stats />
                </Canvas>
            </div>
        </>
    )
}

export default Viewer
