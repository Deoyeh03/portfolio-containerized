"use client";

import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import RoleCards from "@/components/sections/RoleCards";
import TechJourney from "@/components/sections/TechJourney";
import TechStack from "@/components/sections/TechStack";
import Resume from "@/components/sections/Resume";
import GitHubHeatmap from "@/components/sections/GitHubHeatmap";
import FloatingNav from "@/components/ui/FloatingNav";

import { useAnalytics } from "@/hooks/useAnalytics";
import { useEffect } from "react";

export default function Home() {
  const { trackVisit } = useAnalytics();

  useEffect(() => {
    trackVisit();
  }, [trackVisit]);

  return (
    <main className="flex min-h-screen flex-col bg-background relative selection:bg-primary selection:text-black">
      <FloatingNav />
      <Hero />
      <TechJourney />
      <RoleCards />
      <Projects />
      <TechStack />
      <GitHubHeatmap />
      <Resume />
    </main>
  );
}
