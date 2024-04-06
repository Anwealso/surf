import { useMemo } from 'react'
import { Octree } from 'three/examples/jsm/math/Octree.d.ts'
// import { type ObjectMap } from '@react-three/fiber';
import { Object3D } from 'three';


export default function useOctree(scene: Object3D) {
  //console.log('in useOctree')
  const octree = useMemo(() => {
    console.log('new Octree')
    return new Octree().fromGraphNode(scene)
  }, [scene])

  return octree
}
