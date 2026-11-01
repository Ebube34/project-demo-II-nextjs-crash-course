import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import LightRays from "@/components/LightRays";
import Navbar from "@/components/Navbar";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const SchibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const MartianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "devEvent",
  description: "The Hub For Every Every Dev Event You Mustn't Miss",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("min-h-screen", "antialiased", SchibstedGrotesk.variable, MartianMono.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        
<div className="absolute inset-0 top-0 z-[-1] min-h-screen">
  <LightRays
            raysOrigin="top-center-offset"
            raysColor="#5dfeca"
            raysSpeed={1}
            lightSpread={0.5}
            rayLength={1.5}
            glow={0.6}
            haze={0.25}
            followMouse
            mouseInfluence={0.05}
            rayDensity={1}
            tilt={0}
            raySharpness={0.35}
            atmosphere={1}
            intensity={1}
            fadeDistance={1}
            saturation={1}
            noiseAmount={0}
            distortion={0}
            pulsating={false}
            cursorShadow
            clickPulse
            intro
            lightMode={false} style={undefined}/>
            </div>
        
        <main>
        {children}
        </main>
        
        </body>
    </html>
  );
}
