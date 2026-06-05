import React from 'react';
import { useGLTF, Float } from '@react-three/drei';

export default function SushiModel(props) {
  const { scene } = useGLTF('/sushi.glb');
  
  return (
    <Float 
      speed={2} 
      rotationIntensity={0.5} 
      floatIntensity={0.5} 
    >
      {/* We use primitive to render a Three.js scene object */}
      <primitive object={scene} {...props} />
    </Float>
  );
}

// Preload the model so it loads instantly when the component mounts
useGLTF.preload('/sushi.glb');
