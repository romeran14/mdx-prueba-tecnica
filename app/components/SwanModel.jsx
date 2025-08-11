import { useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber';
import { useProgress, Html, OrbitControls } from "@react-three/drei"
import { Suspense, useEffect } from 'react';
import * as THREE from 'three'; // Importamos THREE para acceder a los materiales

const Loader = () => {
  const { progress } = useProgress()
  return <Html center>{progress.toFixed(1)} % loaded</Html>
}

export default function SwanModel() {
  const { scene } = useGLTF('/assets/model/model/swan.glb');

 useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.color.setHex(0xCFB53B); // <-- ¡Nuevo color dorado más claro!
        child.material.roughness = 0.2;  
        child.material.metalness = 0.65; 
        child.material.emissiveIntensity = 5; 
        child.material.needsUpdate = true;
      }
    });
  }, [scene]); 


  return (
    <Canvas gl={{ antialias: true }}  shadows>
      <Suspense fallback={<Loader />}>

        <group  scale={4.75} dispose={null}>
          {/* LUZ AMBIENTAL */}
          <ambientLight intensity={10} />

          {/* LUZ DIRECCIONAL */}
          <directionalLight
            position={[10, 10, 5]}
            intensity={10}
            castShadow
          />

          <primitive object={scene} castShadow />

 
        </group>
      </Suspense>
    </Canvas>
  )
}

useGLTF.preload('/assets/model/model/swan.glb')