"use client";

import { useEffect, useRef } from "react";
import { subscribePointer, subscribeFrame } from "../lib/pointerLoop";
import { spawnBurst } from "../lib/burst";
import { spawnTrail } from "../lib/trail";

const LONG_PRESS_MS = 500;

/**
 * Effets tactiles (mobile) : traînée, lueur au doigt, répulsion (via pointerLoop),
 * tap = explosion, appui long = rafale.
 */
export default function MobileFX() {
  const burstRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || !coarse) return;

    const burst = burstRef.current;
    const trail = trailRef.current;
    const glow = glowRef.current;
    const dot = dotRef.current;
    if (!burst || !trail || !glow || !dot) return;

    let pressTimer: ReturnType<typeof setTimeout> | null = null;
    let pressX = 0;
    let pressY = 0;
    let lastX = 0;
    let lastY = 0;
    let gx = 0;
    let gy = 0;
    let tx = 0;
    let ty = 0;
    let trailCount = { n: 0 };

    const clearPress = () => {
      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;

      const target = e.target as HTMLElement;
      if (target.closest(".heart-stage")) return;

      pressX = e.clientX;
      pressY = e.clientY;
      lastX = pressX;
      lastY = pressY;

      glow.classList.add("is-active");
      dot.classList.add("is-active");

      spawnBurst(burst, pressX, pressY);

      clearPress();
      pressTimer = setTimeout(() => {
        pressTimer = null;
        for (let i = 0; i < 3; i++) {
          window.setTimeout(() => {
            const jitter = () => (Math.random() - 0.5) * 30;
            spawnBurst(burst, pressX + jitter(), pressY + jitter(), {
              skipShockwave: i > 0,
            });
          }, i * 120);
        }
      }, LONG_PRESS_MS);
    };

    const onUp = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        glow.classList.remove("is-active");
        dot.classList.remove("is-active");
      }
      clearPress();
    };

    const unsubPointer = subscribePointer((pointer) => {
      if (!pointer.touching) return;

      tx = pointer.x;
      ty = pointer.y;

      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;

      const dx = tx - lastX;
      const dy = ty - lastY;
      if (dx * dx + dy * dy > 18 * 18) {
        spawnTrail(trail, tx, ty, trailCount);
        lastX = tx;
        lastY = ty;
      }
    });

    const unsubFrame = subscribeFrame((pointer) => {
      if (!pointer.touching) return;
      tx = pointer.x;
      ty = pointer.y;
      gx += (tx - gx) * 0.2;
      gy += (ty - gy) * 0.2;
      glow.style.transform = `translate3d(${gx}px, ${gy}px, 0) translate(-50%, -50%)`;
    });

    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });

    return () => {
      clearPress();
      unsubPointer();
      unsubFrame();
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <>
      <div ref={glowRef} className="touch-glow" aria-hidden="true" />
      <div ref={trailRef} className="touch-trail" aria-hidden="true" />
      <div ref={burstRef} className="cursor-burst" aria-hidden="true" />
      <div ref={dotRef} className="touch-dot" aria-hidden="true" />
    </>
  );
}
