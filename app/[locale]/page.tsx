"use client";

import dynamic from "next/dynamic";
import { Logo } from "@/components/ui/Logo";
// import { FloatingNav } from "@/components/FloatingNav";
import { LanguagePicker } from "@/components/ui/LanguagePicker";

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
      {/* <FloatingNav /> */}
      <LanguagePicker />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Logo />
      </main>
    </div>
  );
}
