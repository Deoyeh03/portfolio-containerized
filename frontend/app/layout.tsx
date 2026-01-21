import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter for now, can switch
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Engineering the Future | Portfolio",
  description: "Senior Full-Stack Engineer Portfolio",
  icons: {
    icon: '/logo.png',
  },
};

import AIChatWidget from "@/components/ui/AIChatWidget";
import GlobalBackground from "@/components/canvas/GlobalBackground";
import Providers from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={cn(inter.className, "antialiased min-h-screen bg-background text-foreground")} suppressHydrationWarning>
        <Providers>
          <GlobalBackground />
          {children}
          <AIChatWidget />
        </Providers>
      </body>
    </html>
  );
}
