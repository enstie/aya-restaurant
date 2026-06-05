import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import SushiModel from '../components/SushiModel';

export default function Hero3DScene() {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // 1024px covers both tablets and phones
      setIsTablet(window.innerWidth <= 1024);
    };
    
    handleResize(); // Check immediately on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Base scale is 15. Reduce by 15% (15 * 0.85 = 12.75) for tablets/phones
  const modelScale = isTablet ? 12.75 : 15;

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Environment preset="city" />
        <SushiModel scale={modelScale} position={[0, -1.0, 0]} />
      </Suspense>
    </Canvas>
  );
}
