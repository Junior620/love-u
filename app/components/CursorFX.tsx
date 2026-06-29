"use client";

import { useEffect, useRef } from "react";
import { subscribePointer, subscribeFrame } from "../lib/pointerLoop";
import { spawnBurst } from "../lib/burst";
import { spawnTrail } from "../lib/trail";

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
    let count = { n: 0 };
    let tx = gx;
    let ty = gy;

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
        spawnTrail(trail, tx, ty, count);
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
