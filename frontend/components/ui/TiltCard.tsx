"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

const ROTATION_RANGE = 20;
const HALF_ROTATION_RANGE = ROTATION_RANGE / 2;

interface TiltCardProps {
    title: string;
    subtitle: string;
    index: number;
    icon?: React.ComponentType<{ className?: string }>;
    onClick?: () => void;
    children?: React.ReactNode;
}

export default function TiltCard({ title, subtitle, index, icon: Icon, onClick, children }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const ySpring = useSpring(y, { stiffness: 300, damping: 30 });

    const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
        const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

        const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
        const rY = mouseX / width - HALF_ROTATION_RANGE;

        x.set(rX);
        y.set(rY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{
                transformStyle: "preserve-3d",
                transform,
            }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative group h-64 w-full rounded-xl bg-gradient-to-br from-white/5 to-white/0 p-6 border border-white/10 cursor-pointer shadow-lg hover:shadow-primary/20 transition-shadow"
        >
            <div
                style={{ transform: "translateZ(50px)" }}
                className="absolute inset-4 flex flex-col justify-end"
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-1 bg-primary rounded-full group-hover:w-16 transition-all duration-300" />
                        {Icon && (
                            <Icon className="w-6 h-6 text-primary/50 group-hover:text-primary transition-colors" />
                        )}
                    </div>
                    <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-muted-foreground text-sm font-medium">
                        {subtitle}
                    </p>
                    {children}
                </div>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
    );
}
