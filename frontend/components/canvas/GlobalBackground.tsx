"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Preload } from "@react-three/drei";
import * as THREE from "three";

function BackgroundScene() {
    const starsRef = useRef<THREE.Group>(null);
    const lightRef = useRef<THREE.SpotLight>(null);

    useFrame((state) => {
        const mouseX = state.pointer.x;
        const mouseY = state.pointer.y;

        if (starsRef.current) {
            starsRef.current.rotation.x = THREE.MathUtils.lerp(starsRef.current.rotation.x, -mouseY * 0.1, 0.05);
            starsRef.current.rotation.y = THREE.MathUtils.lerp(starsRef.current.rotation.y, mouseX * 0.1, 0.05);
        }

        if (lightRef.current) {
            lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, mouseX * 10, 0.1);
            lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, mouseY * 10, 0.1);
        }
    });

    return (
        <>
            <ambientLight intensity={0.4} />
            <spotLight
                ref={lightRef}
                position={[0, 0, 10]}
                angle={0.5}
                penumbra={1}
                intensity={2}
                color="#00FF94"
                distance={25}
            />

            <group ref={starsRef}>
                <Sparkles count={400} scale={20} size={1.5} speed={0.4} opacity={0.4} color="#00FF94" />
                <Sparkles count={300} scale={25} size={3} speed={0.2} opacity={0.2} color="#ffffff" />
            </group>
        </>
    );
}

export default function GlobalBackground() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none bg-[#050505]">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
            >
                <BackgroundScene />
                <Preload all />
            </Canvas>
        </div>
    );
}
