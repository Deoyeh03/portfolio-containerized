"use client";

import { useRef } from "react";
import { Braces, Rocket, Layers, Code2, Cloud, Shield, Database, Layout, PenTool, Lightbulb } from "lucide-react";
import TiltCard from "../ui/TiltCard";
import { useJourney } from "@/hooks/useApi";

export default function TechJourney() {
    const { data: journeyPoints = [] } = useJourney();
    const containerRef = useRef<HTMLDivElement>(null);

    // Icon map remains the same but used dynamically
    const iconMap: Record<string, any> = {
        "Frontend Evolution": Layout,
        "Modern Stack Mastery": Braces,
        "Scale & Strategy": Rocket,
        "Design System Depth": PenTool,
        "The Backend Bridge": Layers,
        "Creative UI Patterns": Lightbulb,
        "UI Implementation": Code2,
        "Infrastructure": Cloud,
        "Security": Shield,
        "Database Design": Database,
    };

    return (
        <section id="journey" className="py-32 relative bg-background/50">
            <div className="container px-6 mx-auto">
                <div className="mb-16">
                    <h2 className="text-sm font-mono text-primary tracking-widest uppercase mb-4">
                        The Tech Journey
                    </h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-white max-w-4xl leading-tight">
                        A detailed look at the tools I&apos;ve actually used to build real systems.
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 pb-32">
                    {journeyPoints.map((point, index) => (
                        <TiltCard 
                            key={point._id}
                            index={index}
                            title={point.title}
                            subtitle={point.year}
                            icon={iconMap[point.title] || Braces}
                        >
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {point.description}
                            </p>
                        </TiltCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
