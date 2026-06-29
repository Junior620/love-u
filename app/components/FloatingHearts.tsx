"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import type { HeartData } from "../lib/scene-data";
import { subscribeFrame } from "../lib/pointerLoop";

const REPULSION_RADIUS = 120;
const REPULSION_STRENGTH = 45;
const REPULSION_LERP = 0.18;

type Props = { hearts: HeartData[] };

export default function FloatingHearts({ hearts }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const container = containerRef.current;
    if (!container) return;

    const wraps = Array.from(container.querySelectorAll<HTMLElement>(".heart-wrap"));
    const sizes = hearts.map((h) => h.size);
    const offsets = wraps.map(() => ({ x: 0, y: 0 }));

    return subscribeFrame((pointer) => {
      if (!pointer.finePointer && !pointer.touching) return;

      const { x: tx, y: ty } = pointer;

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
        let targetR = 0;
        let repelled = false;

        if (dist < REPULSION_RADIUS && dist > 0.001) {
          const t = 1 - dist / REPULSION_RADIUS;
          const sizeFactor = 0.7 + sizes[i] / 38;
          const force = t * t * REPULSION_STRENGTH * sizeFactor;
          targetX = (dx / dist) * force;
          targetY = (dy / dist) * force;
          targetR = (dx / dist) * 12;
          repelled = true;
        }

        offsets[i].x += (targetX - offsets[i].x) * REPULSION_LERP;
        offsets[i].y += (targetY - offsets[i].y) * REPULSION_LERP;
        const rot = offsets[i].x * 0.15 + targetR * REPULSION_LERP;

        wrap.style.setProperty("--rx", `${offsets[i].x.toFixed(2)}px`);
        wrap.style.setProperty("--ry", `${offsets[i].y.toFixed(2)}px`);
        wrap.style.setProperty("--rr", `${rot.toFixed(2)}deg`);
        wrap.classList.toggle("is-repelled", repelled);
      }
    });
  }, [hearts]);

  return (
    <div ref={containerRef} className="hearts">
      {hearts.map((h, i) => (
        <span key={i} className="heart-wrap" style={{ left: h.left }}>
          <span
            className={`heart${h.alt ? " alt" : ""}`}
            style={
              {
                fontSize: h.sizePx,
                animationDelay: h.delay,
                animationDuration: h.duration,
                "--sway": h.sway,
                "--o": h.opacity,
              } as CSSProperties
            }
          >
            ♥
          </span>
        </span>
      ))}
    </div>
  );
}
