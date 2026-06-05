import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Float } from '@react-three/drei';

export default function SushiModel(props) {
  const { scene } = useGLTF('/sushi.glb');
  const groupRef = useRef();

  // Spin the model slowly on the Y axis every frame
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Negative rotation on Y axis spins it clockwise (when viewed from above)
      groupRef.current.rotation.y -= delta * 0.3;
    }
  });
  
  return (
    <Float 
      speed={2} 
      rotationIntensity={0} // Disable the random sway so it only spins smoothly
      floatIntensity={0.5} 
    >
      <group ref={groupRef}>
        {/* We use primitive to render a Three.js scene object */}
        <primitive object={scene} {...props} />
      </group>
    </Float>
  );
}

// Preload the model so it loads instantly when the component mounts
useGLTF.preload('/sushi.glb');
