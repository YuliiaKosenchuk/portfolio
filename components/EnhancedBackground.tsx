"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const PARTICLE_COUNT = 80;
const CONNECTION_DISTANCE = 160;
const PARTICLE_COLOR = "99, 102, 241";
const LINE_COLOR = "139, 92, 246";
const CANVAS_WIDTH = 2560;
const CANVAS_HEIGHT = 1440;

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  pulseSpeed: number;
  pulseOffset: number;
}

const createParticle = (): Particle => ({
  x: Math.random() * CANVAS_WIDTH,
  y: Math.random() * CANVAS_HEIGHT,
  size: Math.random() * 2.5 + 0.5,
  speedX: (Math.random() - 0.5) * 0.4,
  speedY: (Math.random() - 0.5) * 0.4,
  opacity: Math.random() * 0.6 + 0.2,
  pulseSpeed: Math.random() * 0.02 + 0.01,
  pulseOffset: Math.random() * Math.PI * 2,
});

export function EnhancedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hexCanvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hexCanvas = hexCanvasRef.current;
    if (!canvas || !hexCanvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    const hexCtx = hexCanvas.getContext("2d", { alpha: true });
    if (!ctx || !hexCtx) return;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    hexCanvas.width = CANVAS_WIDTH;
    hexCanvas.height = CANVAS_HEIGHT;

    // Сітка малюється рівно один раз — більше ніколи
    drawHexGrid(hexCtx, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Частинки теж не прив'язані до розміру вікна
    const particles: Particle[] = Array.from(
      { length: PARTICLE_COUNT },
      createParticle,
    );
    
    requestAnimationFrame(() => {
      canvas.style.opacity = "1";
      hexCanvas.style.opacity = "1";
    });

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      frameRef.current++;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ── Оновлення та малювання частинок ──────────────
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = CANVAS_WIDTH;
        if (p.x > CANVAS_WIDTH) p.x = 0;
        if (p.y < 0) p.y = CANVAS_HEIGHT;
        if (p.y > CANVAS_HEIGHT) p.y = 0;

        // Пульсація розміру
        const pulse = Math.sin(frameRef.current * p.pulseSpeed + p.pulseOffset);
        const currentSize = p.size + pulse * 0.5;
        const currentOpacity = p.opacity + pulse * 0.15;

        // Glow ефект для великих частинок
        if (p.size > 1.8) {
          ctx.beginPath();
          const glow = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            currentSize * 4,
          );
          glow.addColorStop(
            0,
            `rgba(${PARTICLE_COLOR}, ${currentOpacity * 0.4})`,
          );
          glow.addColorStop(1, `rgba(${PARTICLE_COLOR}, 0)`);
          ctx.arc(p.x, p.y, currentSize * 4, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        // Сама частинка
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${PARTICLE_COLOR}, ${currentOpacity})`;
        ctx.fill();
      });

      // ── З'єднуючі лінії — кожен 2-й кадр для оптимізації ──

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.6; // ← чіткіші лінії

            // Градієнтна лінія
            const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            gradient.addColorStop(0, `rgba(${PARTICLE_COLOR}, ${alpha})`);
            gradient.addColorStop(0.5, `rgba(${LINE_COLOR}, ${alpha * 1.2})`);
            gradient.addColorStop(1, `rgba(${PARTICLE_COLOR}, ${alpha})`);

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = alpha * 1.5; // ← товщина залежить від відстані
            ctx.stroke();
          }
        }
      }
    };

    animate();
    return () => {
      cancelAnimationFrame(rafRef.current);
      // window.removeEventListener("resize", handleResize);
    };
  }, []);

  useGSAP(
    () => {
      const orbs = containerRef.current?.querySelectorAll(".orb");
      if (!orbs) return;

      orbs.forEach((orb, i) => {
        gsap.to(orb, {
          x: `+=${gsap.utils.random(-150, 150)}`,
          y: `+=${gsap.utils.random(-150, 150)}`,
          scale: gsap.utils.random(0.85, 1.25),
          duration: gsap.utils.random(10, 18),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.8,
        });
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      style={{ backgroundColor: "#0a0a0f" }}
    >
      <canvas
        ref={hexCanvasRef}
        className="absolute inset-0 w-full h-full opacity-0 transition-opacity duration-1000"
        style={{ objectFit: "cover" }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-0 transition-opacity duration-1000"
        style={{ objectFit: "cover" }}
      />

      {/* Orbs */}
      <div className="orb absolute -top-40 -left-40 w-150 h-150 bg-linear-to-br from-indigo-600/30 to-purple-600/30 rounded-full blur-3xl" />
      <div className="orb absolute top-1/4 -right-20 w-125 h-125 bg-linear-to-br from-purple-600/30 to-pink-600/30 rounded-full blur-3xl" />
      <div className="orb absolute -bottom-40 left-1/4 w-175 h-175 bg-linear-to-br from-pink-600/20 to-indigo-600/20 rounded-full blur-3xl" />
      <div className="orb absolute bottom-1/3 right-1/4 w-100 h-100 bg-linear-to-br from-cyan-600/25 to-blue-600/25 rounded-full blur-3xl" />
      {/* Новий orb */}
      <div className="orb absolute top-1/2 left-1/2 w-80 h-80 bg-linear-to-br from-violet-600/15 to-fuchsia-600/15 rounded-full blur-3xl" />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-size-[50px_50px] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0a0a0f_100%)]" />
    </div>
  );
}

function drawHexGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const size = 40;
  const h = size * Math.sqrt(3);
  ctx.lineWidth = 0.3;

  for (let row = -1; row < height / h + 1; row++) {
    for (let col = -1; col < width / (size * 1.5) + 1; col++) {
      const x = col * size * 1.5;
      const y = row * h + (col % 2 === 0 ? 0 : h / 2);

      // Відстань від центру для fade ефекту
      const distX = (x - width / 2) / (width / 2);
      const distY = (y - height / 2) / (height / 2);
      const dist = Math.sqrt(distX * distX + distY * distY);
      const alpha = Math.max(0, 0.06 - dist * 0.05);

      if (alpha <= 0) continue;

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const px = x + size * 0.9 * Math.cos(angle);
        const py = y + size * 0.9 * Math.sin(angle);

        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
      ctx.stroke();
    }
  }
}
