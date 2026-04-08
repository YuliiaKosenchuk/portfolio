"use client";

import dynamic from "next/dynamic";
import { LanguagePicker } from "@/components/ui/LanguagePicker";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";

const EnhancedBackground = dynamic(
  () =>
    import("@/components/EnhancedBackground").then(
      (mod) => mod.EnhancedBackground,
    ),
  { ssr: false },
);

export default function Home() {
  return (
    <div className="min-h-screen dark bg-[#0a0a0f] relative">
      <EnhancedBackground />
      <LanguagePicker />
      <main className="flex min-h-screen flex-col items-center justify-between">
        <Hero />
      </main>
      <Footer/>
    </div>
  );
}
