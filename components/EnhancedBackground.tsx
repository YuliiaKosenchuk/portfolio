"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function EnhancedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  useEffect(() => {
    // if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    function animate() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${particle.opacity})`;
        ctx.fill();
      });

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 150)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // useEffect(() => {
  //   const container = containerRef.current;
  //   if (!container) return;

  //   const orbs = container.querySelectorAll(".orb");

  //   orbs.forEach((orb, index) => {
  //     gsap.to(orb, {
  //       x: `+=${gsap.utils.random(-200, 200)}`,
  //       y: `+=${gsap.utils.random(-200, 200)}`,
  //       scale: gsap.utils.random(0.8, 1.3),
  //       duration: gsap.utils.random(8, 15),
  //       repeat: -1,
  //       yoyo: true,
  //       ease: "sine.inOut",
  //       delay: index * 0.5,
  //     });
  //   });
  // }, []);

  useGSAP(
    () => {
      // if (!mounted) return;

      const orbs = containerRef.current?.querySelectorAll(".orb");
      if (!orbs) return;

      orbs.forEach((orb, index) => {
        gsap.to(orb, {
          x: `+=${gsap.utils.random(-200, 200)}`,
          y: `+=${gsap.utils.random(-200, 200)}`,
          scale: gsap.utils.random(0.8, 1.3),
          duration: gsap.utils.random(8, 15),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.5,
        });
      });
    },
    { scope: containerRef },
  );

  // if (!mounted) {
  //   return <div className="fixed inset-0 bg-[#0a0a0f]" />;
  // }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
    >
      {/* Canvas for particles */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Gradient Orbs */}
      <div className="orb absolute -top-40 -left-40 w-150 h-150 bg-linear-to-br from-indigo-600/30 to-purple-600/30 rounded-full blur-3xl"></div>
      <div className="orb absolute top-1/4 -right-20 w-125 h-125 bg-linear-to-br from-purple-600/30 to-pink-600/30 rounded-full blur-3xl"></div>
      <div className="orb absolute -bottom-40 left-1/4 w-175 h-175 bg-linear-to-br from-pink-600/20 to-indigo-600/20 rounded-full blur-3xl"></div>
      <div className="orb absolute bottom-1/3 right-1/4 w-100 h-100 bg-linear-to-br from-cyan-600/25 to-blue-600/25 rounded-full blur-3xl"></div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-size-[50px_50px] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0a0a0f_100%)]"></div>
    </div>
  );
}
