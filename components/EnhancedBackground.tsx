"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const PARTICLE_COUNT = 130;
const CONNECTION_DISTANCE = 150;
const CELL_SIZE = CONNECTION_DISTANCE;
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
  // Тип частинки: 0 = коло, 1 = хрестик, 2 = ромб
  type: 0 | 1 | 2;
}

const createParticle = (): Particle => ({
  x: Math.random() * CANVAS_WIDTH,
  y: Math.random() * CANVAS_HEIGHT,
  size: Math.random() * 2.5 + 0.5,
  speedX: (Math.random() - 0.5) * 0.35,
  speedY: (Math.random() - 0.5) * 0.35,
  opacity: Math.random() * 0.5 + 0.15,
  pulseSpeed: Math.random() * 0.018 + 0.008,
  pulseOffset: Math.random() * Math.PI * 2,
  // 80% кіл, 12% хрестиків, 8% ромбів
  type: Math.random() < 0.8 ? 0 : Math.random() < 0.6 ? 1 : 2,
});

type SpatialGrid = Map<string, Particle[]>;

function buildGrid(particles: Particle[]): SpatialGrid {
  const grid: SpatialGrid = new Map();
  for (const p of particles) {
    const key = `${Math.floor(p.x / CELL_SIZE)},${Math.floor(p.y / CELL_SIZE)}`;
    if (!grid.has(key)) grid.set(key, []);
    grid.get(key)!.push(p);
  }
  return grid;
}

function getNeighbors(grid: SpatialGrid, p: Particle): Particle[] {
  const cx = Math.floor(p.x / CELL_SIZE);
  const cy = Math.floor(p.y / CELL_SIZE);
  const result: Particle[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const key = `${cx + dx},${cy + dy}`;
      const cell = grid.get(key);
      if (cell) result.push(...cell);
    }
  }
  return result;
}

function drawCross(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
) {
  const s = size * 1.8;
  ctx.moveTo(x - s, y);
  ctx.lineTo(x + s, y);
  ctx.moveTo(x, y - s);
  ctx.lineTo(x, y + s);
}

function drawDiamond(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
) {
  const s = size * 2;
  ctx.moveTo(x, y - s);
  ctx.lineTo(x + s * 0.6, y);
  ctx.lineTo(x, y + s);
  ctx.lineTo(x - s * 0.6, y);
  ctx.closePath();
}

export function EnhancedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hexCanvasRef = useRef<HTMLCanvasElement>(null);
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

    drawHexGrid(hexCtx, CANVAS_WIDTH, CANVAS_HEIGHT);

    const particles: Particle[] = Array.from(
      { length: PARTICLE_COUNT },
      createParticle,
    );

    requestAnimationFrame(() => {
      canvas.style.opacity = "1";
      hexCanvas.style.opacity = "1";
    });

    // ── Один GSAP ticker замість окремого rAF ─────────────────────────────
    const drawFrame = () => {
      frameRef.current++;
      const frame = frameRef.current;

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = CANVAS_WIDTH;
        if (p.x > CANVAS_WIDTH) p.x = 0;
        if (p.y < 0) p.y = CANVAS_HEIGHT;
        if (p.y > CANVAS_HEIGHT) p.y = 0;
      }

      // ── Просторова сітка — будується раз на кадр ──
      const grid = buildGrid(particles);

      // ── З'єднуючі лінії через spatial grid ──
      ctx.lineWidth = 0.8;
      const drawn = new Set<string>();

      for (const p1 of particles) {
        const neighbors = getNeighbors(grid, p1);
        for (const p2 of neighbors) {
          if (p1 === p2) continue;
          // Уникаємо дублювання пар
          const pairKey =
            p1.x < p2.x
              ? `${p1.x},${p1.y}-${p2.x},${p2.y}`
              : `${p2.x},${p2.y}-${p1.x},${p1.y}`;
          if (drawn.has(pairKey)) continue;
          drawn.add(pairKey);

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < CONNECTION_DISTANCE * CONNECTION_DISTANCE) {
            const alpha = (1 - Math.sqrt(distSq) / CONNECTION_DISTANCE) * 0.45;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${LINE_COLOR}, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      // ── Малювання частинок ──
      ctx.shadowBlur = 0;
      for (const p of particles) {
        const pulse = Math.sin(frame * p.pulseSpeed + p.pulseOffset);
        const currentSize = p.size + pulse * 0.4;
        const currentOpacity = p.opacity + pulse * 0.12;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${PARTICLE_COLOR}, ${currentOpacity})`;
        ctx.strokeStyle = `rgba(${PARTICLE_COLOR}, ${currentOpacity * 0.7})`;
        ctx.lineWidth = 0.8;

        if (p.type === 0) {
          // Коло
          if (p.size > 1.8) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = `rgba(${PARTICLE_COLOR}, 0.4)`;
          }
          ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (p.type === 1) {
          // Хрестик — stroke без fill
          drawCross(ctx, p.x, p.y, currentSize);
          ctx.stroke();
        } else {
          // Ромб — тільки контур
          drawDiamond(ctx, p.x, p.y, currentSize);
          ctx.stroke();
        }
      }
    };

    gsap.ticker.add(drawFrame);

    return () => {
      gsap.ticker.remove(drawFrame);
    };
  }, []);

  useGSAP(
    () => {
      const orbs = containerRef.current?.querySelectorAll(".orb");
      if (!orbs) return;

      // Кожному орбу — унікальні параметри синусоїди
      const orbData = Array.from(orbs).map(() => ({
        // Радіус плавання по X і Y незалежно
        rx: gsap.utils.random(60, 140),
        ry: gsap.utils.random(50, 120),
        // Швидкість по X і Y різна → еліптична траєкторія
        speedX: gsap.utils.random(0.00018, 0.00032),
        speedY: gsap.utils.random(0.00014, 0.00026),
        // Зсув фази щоб орби не рухались синхронно
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
      }));

      const floatFn = () => {
        const now = performance.now();
        orbs.forEach((orb, i) => {
          const d = orbData[i];
          const x = Math.sin(now * d.speedX + d.phaseX) * d.rx;
          const y = Math.cos(now * d.speedY + d.phaseY) * d.ry;
          gsap.set(orb, { x, y });
        });
      };

      gsap.ticker.add(floatFn);
      return () => gsap.ticker.remove(floatFn);
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

      {/* Орби через radial-gradient — без blur фільтра */}
      <div
        className="orb absolute -top-40 -left-40 w-150 h-150 will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(79,70,229,0.2) 0%, rgba(147,51,234,0.08) 55%, transparent 75%)",
          transform: "translateZ(0)",
        }}
      />
      <div
        className="orb absolute top-1/4 -right-20 w-125 h-125 will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(147,51,234,0.18) 0%, rgba(219,39,119,0.07) 55%, transparent 75%)",
          transform: "translateZ(0)",
        }}
      />
      <div
        className="orb absolute -bottom-40 left-1/4 w-175 h-175 will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(219,39,119,0.12) 0%, rgba(79,70,229,0.06) 55%, transparent 75%)",
          transform: "translateZ(0)",
        }}
      />
      <div
        className="orb absolute bottom-1/3 right-1/4 w-100 h-100 will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(8,145,178,0.15) 0%, rgba(37,99,235,0.06) 55%, transparent 75%)",
          transform: "translateZ(0)",
        }}
      />
      {/* <div className="orb absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-indigo-600/30 to-purple-600/30 rounded-full blur-3xl"></div>
      <div className="orb absolute top-1/4 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-full blur-3xl"></div>
      <div className="orb absolute -bottom-40 left-1/4 w-[700px] h-[700px] bg-gradient-to-br from-pink-600/20 to-indigo-600/20 rounded-full blur-3xl"></div>
      <div className="orb absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-cyan-600/25 to-blue-600/25 rounded-full blur-3xl"></div> */}

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-size-[50px_50px] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      {/* Vignette */}
      <div className="absolute inset-0 bg-[#0a0a0f]/40" />
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
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
      ctx.stroke();
    }
  }
}
