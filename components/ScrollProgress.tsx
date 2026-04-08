'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const progress = progressRef.current;
    if (!progress) return;

    gsap.to(progress, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      },
    });
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-50">
      <div
        ref={progressRef}
        className="h-full bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 origin-left scale-x-0 shadow-lg shadow-indigo-500/50"
      ></div>
    </div>
  );
}