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
      lerp: 0.08,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Формула плавності
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true, // Плавний скрол коліщатком
      wheelMultiplier: 1, // Швидкість скролу
      touchMultiplier: 1.5, // Швидкість для тачпадів/телефонів
    });

    // Синхронізуємо Lenis із GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const tickerFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickerFn); 
    };
  }, []);

  return <>{children}</>;
}
