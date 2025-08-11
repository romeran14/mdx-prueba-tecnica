
import { Canvas, useFrame  } from '@react-three/fiber';
import { useProgress, Html ,useGLTF } from "@react-three/drei"
import { Suspense ,  useEffect, useRef } from 'react';


const SwanModelLoader = () => {

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

			const ref = useRef(null);


    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.y += 0.01; // Rotates around the Y-axis
        }
    });


    return (
        <group ref={ref} scale={3.6} dispose={null}>
            {/* LUZ AMBIENTAL */}
            <ambientLight intensity={10} />
            {/* LUZ DIRECCIONAL */}
            <directionalLight
                position={[10, 10, 5]}
                intensity={10}
                castShadow
            />
            {/* <perspectiveCamera/> */}
            <primitive object={scene} castShadow />
        </group>
    )
}
useGLTF.preload('/assets/model/model/swan.glb')


const Loader = () => {
  const { progress } = useProgress()
  return <Html center>{progress.toFixed(1)} % loaded</Html>
}

export default function SwanModel() {

  return (
    <Canvas gl={{ antialias: true }}  shadows
          camera={{
        position: [0, 0, 10], // Posición inicial de la cámara [x, y, z]
        fov: 50, // Campo de visión en grados
      }}
    >
      <Suspense fallback={<Loader />}>
         <SwanModelLoader/>

      </Suspense>
    </Canvas>
  )
}

useGLTF.preload('/assets/model/model/swan.glb')