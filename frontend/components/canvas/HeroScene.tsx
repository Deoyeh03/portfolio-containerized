"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Sparkles, PerspectiveCamera, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

export default function HeroScene() {
    const meshRef = useRef<THREE.Mesh>(null);
    const starsRef = useRef<THREE.Group>(null);
    const lightRef = useRef<THREE.SpotLight>(null);

    useFrame((state) => {
        // Standard rotation for the object
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
        }

        // Mouse Interaction
        // Normalized mouse coordinates: x [-1, 1], y [-1, 1]
        const mouseX = state.pointer.x;
        const mouseY = state.pointer.y;

        if (starsRef.current) {
            // Parallax effect: Rotate the entire star field against mouse movement
            // Lerp for smoothness
            starsRef.current.rotation.x = THREE.MathUtils.lerp(starsRef.current.rotation.x, -mouseY * 0.2, 0.1);
            starsRef.current.rotation.y = THREE.MathUtils.lerp(starsRef.current.rotation.y, mouseX * 0.2, 0.1);
        }

        // Light follows cursor (like a flashlight)
        if (lightRef.current) {
            lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, mouseX * 6, 0.1);
            lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, mouseY * 6, 0.1);
        }
    });

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />

            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <spotLight
                ref={lightRef}
                position={[0, 0, 10]}
                angle={0.5}
                penumbra={1}
                intensity={2}
                color="#00FF94"
                distance={20}
            />
            <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={0.5} color="#4A90E2" />

            {/* Interactive Stars Group */}
            <group ref={starsRef}>
                <Sparkles count={300} scale={15} size={2} speed={0.4} opacity={0.6} color="#00FF94" />
                <Sparkles count={200} scale={20} size={4} speed={0.2} opacity={0.3} color="#ffffff" />
            </group>

            {/* Abstract Floating Object */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <mesh ref={meshRef} position={[2, 0, 0]} scale={1.5}>
                    <icosahedronGeometry args={[1, 0]} />
                    <MeshDistortMaterial
                        color="#050505"
                        attach="material"
                        distort={0.4}
                        speed={2}
                        roughness={0.2}
                        metalness={0.8}
                        wireframe={true}
                    />
                </mesh>
            </Float>

            {/* Fog for depth */}
            <fog attach="fog" args={["#050505", 5, 20]} />
        </>
    );
}
