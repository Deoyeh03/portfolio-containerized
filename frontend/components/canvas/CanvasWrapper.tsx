"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Preload } from "@react-three/drei";

interface CanvasWrapperProps {
    children: React.ReactNode;
    className?: string;
    cameraPosition?: [number, number, number];
    fov?: number;
}

export default function CanvasWrapper({
    children,
    className,
    cameraPosition = [0, 0, 5],
    fov = 45,
}: CanvasWrapperProps) {
    return (
        <div className={`w-full h-full relative ${className}`}>
            <Canvas
                camera={{ position: cameraPosition, fov: fov }}
                dpr={[1, 2]} // Handle high-dpi screens
                gl={{ antialias: true, alpha: true }}
            >
                <Suspense fallback={null}>
                    {children}
                    <Preload all />
                </Suspense>
            </Canvas>
        </div>
    );
}
