"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import type { ParticleData } from "../lib/scene-data";
import { subscribeFrame } from "../lib/pointerLoop";

const REPULSION_RADIUS = 80;
const REPULSION_STRENGTH = 20;
const REPULSION_LERP = 0.2;

type Props = { particles: ParticleData[] };

export default function FloatingParticles({ particles }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const container = containerRef.current;
    if (!container) return;

    const wraps = Array.from(container.querySelectorAll<HTMLElement>(".particle-wrap"));
    const offsets = wraps.map(() => ({ x: 0, y: 0 }));

    return subscribeFrame((pointer) => {
      const { x: tx, y: ty, active } = pointer;
      if (!active) return;

      for (let i = 0; i < wraps.length; i++) {
        const wrap = wraps[i];
        const rect = wrap.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - tx;
        const dy = cy - ty;
        const dist = Math.hypot(dx, dy);

        let targetX = 0;
        let targetY = 0;

        if (dist < REPULSION_RADIUS && dist > 0.001) {
          const t = 1 - dist / REPULSION_RADIUS;
          const force = t * t * REPULSION_STRENGTH;
          targetX = (dx / dist) * force;
          targetY = (dy / dist) * force;
        }

        offsets[i].x += (targetX - offsets[i].x) * REPULSION_LERP;
        offsets[i].y += (targetY - offsets[i].y) * REPULSION_LERP;

        wrap.style.setProperty("--px", `${offsets[i].x.toFixed(2)}px`);
        wrap.style.setProperty("--py", `${offsets[i].y.toFixed(2)}px`);
      }
    });
  }, []);

  return (
    <div ref={containerRef} className="particles">
      {particles.map((p, i) => (
        <span
          key={i}
          className="particle-wrap"
          style={{ left: p.left, top: p.top }}
        >
          <span
            className="particle"
            style={
              {
                "--s": p.size,
                animationDelay: p.delay,
                animationDuration: p.duration,
              } as CSSProperties
            }
          />
        </span>
      ))}
    </div>
  );
}
