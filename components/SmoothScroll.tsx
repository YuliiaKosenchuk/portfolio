"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 1. Ініціалізуємо Lenis
    const lenis = new Lenis({
      lerp: 0.5, // Плавність інерції (0.1 - 0.3 зазвичай працює добре)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Формула плавності
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true, // Плавний скрол коліщатком
      wheelMultiplier: 2, // Швидкість скролу
      touchMultiplier: 2, // Швидкість для тачпадів/телефонів
    });

    // Синхронізуємо Lenis із GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return <>{children}</>;
}