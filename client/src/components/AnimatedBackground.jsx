import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, OrbitControls } from '@react-three/drei';


// Floating Sphere Component
function FloatingSphere({ position, color, speed }) {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
            meshRef.current.rotation.x += 0.01;
            meshRef.current.rotation.y += 0.01;
        }
    });

    return (
        <Sphere ref={meshRef} args={[1, 32, 32]} position={position}>
            <MeshDistortMaterial
                color={color}
                attach="material"
                distort={0.4}
                speed={2}
                roughness={0.2}
                metalness={0.8}
            />
        </Sphere>
    );
}

// Particle System
function Particles({ count = 100 }) {
    const points = useRef();

    const particlesPosition = React.useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        return positions;
    }, [count]);

    useFrame((state) => {
        if (points.current) {
            points.current.rotation.y = state.clock.elapsedTime * 0.05;
        }
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particlesPosition.length / 3}
                    array={particlesPosition}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="#667eea"
                sizeAttenuation
                transparent
                opacity={0.6}
            />
        </points>
    );
}

// Main Animated Background Component
const AnimatedBackground = ({ showParticles = true, showSpheres = true }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            opacity: 0.6
        }}>
            <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, -10, -5]} intensity={0.5} color="#f093fb" />

                {showSpheres && (
                    <>
                        <FloatingSphere position={[-3, 0, 0]} color="#667eea" speed={0.5} />
                        <FloatingSphere position={[3, 1, -2]} color="#764ba2" speed={0.7} />
                        <FloatingSphere position={[0, -2, -1]} color="#4facfe" speed={0.6} />
                    </>
                )}

                {showParticles && <Particles count={150} />}

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.5}
                />
            </Canvas>
        </div>
    );
};

export default AnimatedBackground;
