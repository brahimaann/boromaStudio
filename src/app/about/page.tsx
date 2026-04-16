"use client";

import { useEffect, useRef } from "react";
import NavigationOverlay from "@/components/NavigationOverlay";
import { navLinks } from "@/lib/nav";

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- Helper Functions ---
    const getPointID = (r: number, c: number, rows: number) => c * rows + r;
    const smoothstep = (min: number, max: number, value: number) => {
      const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
      return x * x * (3 - 2 * x);
    };

    // --- Data Source ---
    const manifesto = `String about_boroma = "Boroma Studios is a multidisciplinary agency operating at the intersection of technical engineering and high-fidelity media production. Based in Minneapolis and Saint Paul, the studio synthesizes structural software architecture with definitive creative direction. We maintain distinct but parallel verticals. The engineering branch develops custom applications and digital infrastructure. The media branch executes professional photography, video production, and audio engineering. Additionally, the studio executes comprehensive creative direction for brands, corporate entities, and organizational groups, architecting unified visual and technical identities. This multi-tiered model ensures rigorous operational capability without compromising aesthetic execution. LOCATION: Minneapolis / Saint Paul";`;
    const charArray = manifesto.replace(/\s+/g, ' ').split('');

    // --- Physics Configuration ---
    let w = container.clientWidth;
    let h = container.clientHeight;

    const CONFIG = {
      awidth: w,
      aheight: h,
      gridW: Math.min(50, Math.floor(w / 15)),
      gridH: Math.min(50, Math.floor(w / 8)),
      gravity: 0.2,
      damping: 0.99,
      iterationsPerFrame: 5,
      compressFactor: 0.02,
      stretchFactor: 1.1,
      mouseSize: 5000,
      mouseStrength: 4,
      contain: false,
      randomSolve: false,
      pointRadius: 0,
      cellWidth: 0,
      cellHeight: 0,
    };

    CONFIG.cellWidth = CONFIG.awidth / (CONFIG.gridW - 1);
    CONFIG.cellHeight = CONFIG.aheight / (CONFIG.gridH - 1);

    // --- Core Classes ---
    class Vec2 {
      x: number;
      y: number;
      constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
      }
      reset(x = 0, y = 0) {
        this.x = x;
        this.y = y;
      }
      clone() {
        return new Vec2(this.x, this.y);
      }
      add(v: Vec2) {
        this.x += v.x;
        this.y += v.y;
        return this;
      }
      subtractNew(v: Vec2) {
        return new Vec2(this.x - v.x, this.y - v.y);
      }
      get lengthSquared() {
        return this.x ** 2 + this.y ** 2;
      }
      get angle() {
        return Math.atan2(this.y, this.x);
      }
    }

    class Particle {
      pos: Vec2;
      oldPos: Vec2;
      velocity: Vec2;
      acceleration: Vec2;
      gravityVec: Vec2;
      pinned: boolean;
      originalPinnedState?: boolean;
      id: number;
      char: string;
      downConstraint?: Constraint;

      constructor({ x, y, pinned = false, id = 0, char = " " }: { x: number; y: number; pinned?: boolean; id?: number; char?: string }) {
        this.pos = new Vec2(x, y);
        this.oldPos = new Vec2(x, y);
        this.velocity = new Vec2();
        this.acceleration = new Vec2();
        this.gravityVec = new Vec2();
        this.pinned = pinned;
        this.id = id;
        this.char = char;
      }
      contain() {
        if (this.pinned) return;
        const radius = 5;
        if (this.pos.x < radius) {
          this.pos.x = radius;
          this.oldPos.x = this.pos.x + Math.abs(this.oldPos.x - this.pos.x) * 0.8;
        } else if (this.pos.x > CONFIG.awidth - radius) {
          this.pos.x = CONFIG.awidth - radius;
          this.oldPos.x = this.pos.x - Math.abs(this.oldPos.x - this.pos.x) * 0.8;
        }
        if (this.pos.y < radius) {
          this.pos.y = radius;
          this.oldPos.y = this.pos.y + Math.abs(this.oldPos.y - this.pos.y) * 0.8;
        } else if (this.pos.y > CONFIG.aheight - radius) {
          this.pos.y = CONFIG.aheight - radius;
          this.oldPos.y = this.pos.y - Math.abs(this.oldPos.y - this.pos.y) * 0.8;
        }
      }
      update(delta: number) {
        if (this.pinned) {
          this.acceleration.reset();
          return;
        }
        this.velocity.reset(
          (this.pos.x - this.oldPos.x) * CONFIG.damping,
          (this.pos.y - this.oldPos.y) * CONFIG.damping
        );
        this.oldPos.reset(this.pos.x, this.pos.y);
        const dd = delta ** 2;
        this.gravityVec.reset(0, CONFIG.gravity / dd);
        this.acceleration.add(this.gravityVec);
        this.pos.x += this.velocity.x + this.acceleration.x * dd;
        this.pos.y += this.velocity.y + this.acceleration.y * dd;
        this.acceleration.reset();
      }
      applyForce(v: Vec2) {
        this.acceleration.add(v);
      }
    }

    class Constraint {
      p1: Particle;
      p2: Particle;
      length: number;
      minLength: number;
      maxLength: number;

      constructor({ p1, p2, length, compressFactor, stretchFactor }: { p1: Particle; p2: Particle; length: number; compressFactor: number; stretchFactor: number }) {
        this.p1 = p1;
        this.p2 = p2;
        this.length = length;
        this.minLength = length * compressFactor;
        this.maxLength = length * stretchFactor;
      }
      solve() {
        const dx = this.p2.pos.x - this.p1.pos.x;
        const dy = this.p2.pos.y - this.p1.pos.y;
        const distance = Math.hypot(dx, dy);
        if (distance === 0) return;

        let targetLength = this.length;
        if (distance < this.minLength) targetLength = this.minLength;
        else if (distance > this.maxLength) targetLength = this.maxLength;
        else return;

        const difference = targetLength - distance;
        const percent = difference / distance / 2;
        const offsetX = dx * percent;
        const offsetY = dy * percent;

        if (!this.p1.pinned) {
          this.p1.pos.x -= offsetX;
          this.p1.pos.y -= offsetY;
        }
        if (!this.p2.pinned) {
          this.p2.pos.x += offsetX;
          this.p2.pos.y += offsetY;
        }
      }
    }

    // --- State ---
    const particles: Particle[] = [];
    const constraints: Constraint[] = [];
    const charCanvases: Record<string, HTMLCanvasElement> = {};
    let rafID: number;

    const initEngine = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      w = canvas.width;
      h = canvas.height;

      const isMobile = w < 768;

      // On mobile: cloth fills ~90% of the narrower dimension, stays square-ish
      // On desktop: shift right to clear the fixed wordmark
      const padding = isMobile ? 32 : 120;
      const navShift = isMobile ? 0 : 80;
      CONFIG.awidth = Math.min(isMobile ? w - padding : 520, w - padding);
      CONFIG.aheight = Math.min(isMobile ? h * 0.75 : 520, h - 120);

      // Fewer columns on mobile so characters stay legible
      CONFIG.gridW = isMobile
        ? Math.min(22, Math.floor(CONFIG.awidth / 14))
        : Math.min(36, Math.floor(CONFIG.awidth / 13));
      CONFIG.gridH = isMobile
        ? Math.min(28, Math.floor(CONFIG.aheight / 18))
        : Math.min(36, Math.floor(CONFIG.aheight / 13));

      CONFIG.cellWidth = CONFIG.awidth / (CONFIG.gridW - 1);
      CONFIG.cellHeight = CONFIG.aheight / (CONFIG.gridH - 1);

      // Store navShift so drawCode can use it without recapturing w
      (CONFIG as typeof CONFIG & { navShift: number }).navShift = navShift;

      const fontSize = Math.max(9, CONFIG.cellHeight * 1.1);

      // Pre-render each unique character to an offscreen canvas
      for (const ch of new Set(charArray)) {
        if (ch === ' ') continue;
        const off = document.createElement('canvas');
        off.width = off.height = Math.ceil(fontSize * 1.5);
        const octx = off.getContext('2d');
        if (!octx) continue;
        octx.font = `${fontSize}px ui-monospace, SFMono-Regular, monospace`;
        octx.textAlign = 'center';
        octx.textBaseline = 'middle';
        octx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        octx.fillText(ch, off.width / 2, off.height / 2);
        charCanvases[ch] = off;
      }

      particles.length = 0;
      constraints.length = 0;

      for (let i = 0; i < CONFIG.gridW; i++) {
        for (let j = 0; j < CONFIG.gridH; j++) {
          const x = i * CONFIG.cellWidth;
          const y = j * CONFIG.cellHeight;
          const id = getPointID(j, i, CONFIG.gridH);
          const pinned = j === 0;
          const charIndex = (i + j * CONFIG.gridW) % charArray.length;
          const char = charArray[charIndex] || ' ';
          particles.push(new Particle({ x, y, pinned, id, char }));
        }
      }

      for (let i = 0; i < CONFIG.gridW; i++) {
        for (let j = 0; j < CONFIG.gridH; j++) {
          const id = getPointID(j, i, CONFIG.gridH);
          const p = particles[id];

          if (j < CONFIG.gridH - 1) {
            const bottomP = particles[getPointID(j + 1, i, CONFIG.gridH)];
            const c = new Constraint({ p1: p, p2: bottomP, length: CONFIG.cellHeight, compressFactor: CONFIG.compressFactor, stretchFactor: CONFIG.stretchFactor });
            constraints.push(c);
            p.downConstraint = c;
          }
          if (i < CONFIG.gridW - 1) {
            const rightP = particles[getPointID(j, i + 1, CONFIG.gridH)];
            constraints.push(new Constraint({ p1: p, p2: rightP, length: CONFIG.cellWidth, compressFactor: 0.6, stretchFactor: 4 }));
          }
        }
      }
    };

    // --- Render ---
    let lastDelta = 0;
    const drawCode = () => {
      const navShift = (CONFIG as typeof CONFIG & { navShift: number }).navShift ?? 0;
      const offsetX = w / 2 - CONFIG.awidth / 2 + navShift;
      const offsetY = h / 2 - CONFIG.aheight / 2;

      particles.forEach((p) => {
        if (!p.char || p.char === ' ') return;
        const img = charCanvases[p.char];
        if (!img) return;

        const half = img.width / 2;
        let cos = 1, sin = 0;

        if (p.downConstraint) {
          const dx = p.downConstraint.p2.pos.x - p.downConstraint.p1.pos.x;
          const dy = p.downConstraint.p2.pos.y - p.downConstraint.p1.pos.y;
          const angle = Math.atan2(dy, dx) - Math.PI / 2;
          cos = Math.cos(angle);
          sin = Math.sin(angle);
        }

        ctx.setTransform(cos, sin, -sin, cos, p.pos.x + offsetX, p.pos.y + offsetY);
        ctx.drawImage(img, -half, -half);
      });

      ctx.setTransform(1, 0, 0, 1, 0, 0);
    };

    const runloop = (delta: number) => {
      rafID = requestAnimationFrame(runloop);
      ctx.clearRect(0, 0, w, h);

      particles.forEach((p) => p.update(delta - lastDelta));
      lastDelta = delta;

      for (let i = 0; i < CONFIG.iterationsPerFrame; i++) {
        for (let j = 0; j < constraints.length; j++) constraints[j].solve();
      }

      drawCode();
    };

    // --- Interaction ---
    const mousePos = new Vec2();
    let grabbedParticle: Particle | null = null;

    const getOffsets = () => {
      const navShift = (CONFIG as typeof CONFIG & { navShift: number }).navShift ?? 0;
      return {
        ox: w / 2 - CONFIG.awidth / 2 + navShift,
        oy: h / 2 - CONFIG.aheight / 2,
      };
    };

    const handleMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const { ox, oy } = getOffsets();
      mousePos.x = e.clientX - rect.left - ox;
      mousePos.y = e.clientY - rect.top - oy;

      if (grabbedParticle) {
        grabbedParticle.pos.reset(mousePos.x, mousePos.y);
        grabbedParticle.oldPos.reset(mousePos.x, mousePos.y);
      }

      for (const p of particles) {
        const diff = mousePos.subtractNew(p.pos);
        const ls = diff.lengthSquared;
        if (ls < CONFIG.mouseSize) {
          const a = diff.angle - Math.PI;
          const strength = smoothstep(CONFIG.mouseSize, -2000, ls) * CONFIG.mouseStrength / 300;
          p.applyForce(new Vec2(Math.cos(a) * strength, Math.sin(a) * strength));
        }
      }
    };

    const handleDown = () => {
      for (const p of particles) {
        if (mousePos.subtractNew(p.pos).lengthSquared < 400) {
          grabbedParticle = p;
          grabbedParticle.originalPinnedState = grabbedParticle.pinned;
          grabbedParticle.pinned = true;
          break;
        }
      }
    };

    const handleUp = () => {
      if (grabbedParticle) {
        grabbedParticle.pinned = grabbedParticle.originalPinnedState ?? false;
        grabbedParticle = null;
      }
    };

    const handleResize = () => initEngine();

    // --- Boot ---
    initEngine();
    canvas.addEventListener('pointermove', handleMove);
    canvas.addEventListener('pointerdown', handleDown);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('resize', handleResize);
    rafID = requestAnimationFrame(runloop);

    return () => {
      cancelAnimationFrame(rafID);
      canvas.removeEventListener('pointermove', handleMove);
      canvas.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <NavigationOverlay links={navLinks} defaultOpen={false} />
      <div
        ref={containerRef}
        className="w-full h-screen bg-black overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className="block w-full h-full cursor-crosshair touch-none"
        />
      </div>
    </>
  );
}
