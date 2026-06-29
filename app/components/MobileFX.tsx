"use client";

import { useEffect, useRef } from "react";
import { spawnBurst } from "../lib/burst";

const LONG_PRESS_MS = 500;

export default function MobileFX() {
  const burstRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || !coarse) return;

    const burst = burstRef.current;
    if (!burst) return;

    let pressTimer: ReturnType<typeof setTimeout> | null = null;
    let pressX = 0;
    let pressY = 0;

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

    const onUp = () => clearPress();

    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });

    return () => {
      clearPress();
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return <div ref={burstRef} className="cursor-burst" aria-hidden="true" />;
}
