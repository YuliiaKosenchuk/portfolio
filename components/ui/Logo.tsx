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

  useGSAP(() => {
    gsap.from(".logo-brace-l", { 
      x: -20, 
      opacity: 0, 
      duration: 0.8, 
      ease: "power3.out" 
    });

    gsap.from(".logo-brace-r", { 
      x: 20, 
      opacity: 0, 
      duration: 0.8, 
      ease: "power3.out" 
    });

    gsap.from(".logo-letters", { 
      y: 10, 
      opacity: 0, 
      scale: 0.8, 
      duration: 1, 
      delay: 0.2, 
      ease: "back.out(1.7)" 
    });
  }, { scope: container });

  const gradientStyles = "bg-linear-to-br from-[#6366f1] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent select-none";

  return (
    <Link 
      href="/" 
      ref={container}
      className="inline-flex items-center gap-1 font-sans no-underline group"
    >
      <span className={`logo-brace-l text-4xl font-black ${gradientStyles}`}>
        {'{'}
      </span>
      <div className="logo-letters flex items-center">
        <span className={`-mb-2 text-3xl font-black tracking-tighter transition-transform group-hover:scale-100 ${gradientStyles}`}>
          Y
        </span>
        <span className={`-mb-2 text-3xl font-black tracking-tighter transition-transform group-hover:scale-100 ${gradientStyles}`}>
          K
        </span>
      </div>
      <span className={`logo-brace-r text-4xl font-black ${gradientStyles}`}>
        {'}'}
      </span>
    </Link>
  );
};