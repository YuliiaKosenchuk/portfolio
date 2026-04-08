'use client';

import Link from 'next/link';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

export const Logo = () => {
  const container = useRef<HTMLAnchorElement>(null);
  const { contextSafe } = useGSAP({ scope: container });

  useGSAP(() => {
    gsap.from(".logo-brace-l", { x: -20, opacity: 0, duration: 0.8, ease: "power3.out" });
    gsap.from(".logo-brace-r", { x: 20, opacity: 0, duration: 0.8, ease: "power3.out" });
    gsap.from(".logo-letters", { y: 10, opacity: 0, scale: 0.8, duration: 1, delay: 0.2, ease: "back.out(1.7)" });
  }, { scope: container });

  const onMouseEnter = contextSafe(() => {
    gsap.to(".logo-brace-l", { x: -10, duration: 0.4, ease: "power2.out" });
    gsap.to(".logo-brace-r", { x: 10, duration: 0.4, ease: "power2.out" });
  });

  const onMouseLeave = contextSafe(() => {
    gsap.to([".logo-brace-l", ".logo-brace-r"], { x: 0, duration: 0.4, ease: "power2.inOut" });
    gsap.to(".logo-letters", { scale: 1, duration: 0.4, ease: "power2.inOut" });
  });

  const gradientStyles = "py-2 bg-[length:200%_auto] bg-linear-to-br from-[#6366f1] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent select-none group-hover:bg-right-center";

  return (
    <Link 
      href="/" 
      ref={container}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="inline-flex items-center gap-1 font-sans no-underline group py-2 px-4 overflow-visible"
    >
      <span className={`logo-brace-l text-6xl font-bold ${gradientStyles}`}>
        {'{'}
      </span>
      
      <div className="logo-letters flex items-center">
        <span className={`-mb-3 text-5xl font-black tracking-tighter ${gradientStyles}`}>
          Y
        </span>
        <span className={`-mb-3 text-5xl font-black tracking-tighter ${gradientStyles}`}>
          K
        </span>
      </div>

      <span className={`logo-brace-r text-6xl font-bold ${gradientStyles}`}>
        {'}'}
      </span>
    </Link>
  );
};