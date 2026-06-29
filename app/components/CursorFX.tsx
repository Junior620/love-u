"use client";

import { useEffect, useRef } from "react";
import { subscribePointer, subscribeFrame } from "../lib/pointerLoop";
import { spawnBurst } from "../lib/burst";

/**
 * Effets liés au curseur de la souris (desktop uniquement) :
 * lueur, point, traînée, explosion au clic, parallaxe via pointerLoop.
 */
export default function CursorFX() {
  const glowRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !fine) return;

    const glow = glowRef.current;
    const dot = dotRef.current;
    const trail = trailRef.current;
    const burst = burstRef.current;
    if (!glow || !dot || !trail || !burst) return;

    let gx = window.innerWidth / 2;
    let gy = window.innerHeight / 2;
    let lastX = gx;
    let lastY = gy;
    let count = 0;
    let tx = gx;
    let ty = gy;

    const spawn = (x: number, y: number) => {
      const s = document.createElement("span");
      const isHeart = count++ % 3 === 0;
      s.className = "trail " + (isHeart ? "trail-heart" : "trail-spark");
      if (isHeart) s.textContent = "♥";

      const ox = (Math.random() - 0.5) * 16;
      const oy = (Math.random() - 0.5) * 16;
      s.style.setProperty("--sc", (0.6 + Math.random() * 0.7).toFixed(2));
      s.style.setProperty("--dx", `${((Math.random() - 0.5) * 30).toFixed(1)}px`);
      s.style.setProperty("--dy", `${(-20 - Math.random() * 30).toFixed(1)}px`);
      s.style.left = `${x + ox}px`;
      s.style.top = `${y + oy}px`;

      trail.appendChild(s);
      s.addEventListener("animationend", () => s.remove());
      window.setTimeout(() => s.remove(), 1200);
    };

    const unsubPointer = subscribePointer((pointer) => {
      tx = pointer.x;
      ty = pointer.y;

      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;

      if (pointer.active) {
        glow.classList.add("is-active");
        dot.classList.add("is-active");
      }

      const dx = tx - lastX;
      const dy = ty - lastY;
      if (dx * dx + dy * dy > 22 * 22) {
        spawn(tx, ty);
        lastX = tx;
        lastY = ty;
      }
    });

    const unsubFrame = subscribeFrame(() => {
      gx += (tx - gx) * 0.18;
      gy += (ty - gy) * 0.18;
      glow.style.transform = `translate3d(${gx}px, ${gy}px, 0) translate(-50%, -50%)`;
    });

    const onDown = (e: PointerEvent) => {
      if (!fine) return;
      spawnBurst(burst, e.clientX, e.clientY);
    };

    window.addEventListener("pointerdown", onDown, { passive: true });

    return () => {
      unsubPointer();
      unsubFrame();
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <>
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
      <div ref={trailRef} className="cursor-trail" aria-hidden="true" />
      <div ref={burstRef} className="cursor-burst" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
