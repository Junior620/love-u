"use client";

import { useCallback, useRef } from "react";
import { spawnBurst } from "../lib/burst";

export default function CentralHeart() {
  const stageRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(() => {
    const stage = stageRef.current;
    const burst = burstRef.current;
    if (!stage || !burst) return;

    stage.classList.remove("heart-stage--pop");
    void stage.offsetWidth;
    stage.classList.add("heart-stage--pop");
    window.setTimeout(() => stage.classList.remove("heart-stage--pop"), 500);

    const rect = stage.getBoundingClientRect();
    spawnBurst(burst, rect.left + rect.width / 2, rect.top + rect.height / 2, {
      skipThrottle: true,
    });
  }, []);

  return (
    <>
      <div ref={burstRef} className="cursor-burst" aria-hidden="true" />
      <div ref={stageRef} className="heart-stage" onClick={handleClick} role="button" tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); } }}
        aria-label="Cœur lumineux — clique pour une explosion de cœurs">
        <span className="halo" />
        <span className="orbit-spark s1" />
        <span className="orbit-spark s2" />
        <span className="orbit-spark s3" />
        <span className="orbit-spark s4" />
        <svg className="heart-svg" viewBox="0 0 32 29.6" aria-hidden="true">
          <defs>
            <linearGradient id="heartGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff9ad5" />
              <stop offset="50%" stopColor="#ff4f9a" />
              <stop offset="100%" stopColor="#b14cff" />
            </linearGradient>
          </defs>
          <path
            d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"
            fill="url(#heartGrad)"
          />
        </svg>
      </div>
    </>
  );
}
