"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { siteConfig, getDaysTogether } from "../lib/config";

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function waitForReveal(): Promise<void> {
  return new Promise((resolve) => {
    const gate = document.querySelector(".surprise-gate");
    if (!gate || gate.classList.contains("scene--revealed")) {
      resolve();
      return;
    }
    const obs = new MutationObserver(() => {
      if (gate.classList.contains("scene--revealed")) {
        obs.disconnect();
        resolve();
      }
    });
    obs.observe(gate, { attributes: true, attributeFilter: ["class"] });
  });
}

export default function DaysCounter() {
  const target = getDaysTogether(siteConfig.relationshipStartDate);
  const [display, setDisplay] = useState(0);
  const [visible, setVisible] = useState(false);
  const [counting, setCounting] = useState(false);
  const [done, setDone] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [pulseSync, setPulseSync] = useState("0s");

  useEffect(() => {
    if (!counting || done) return;
    setPulse(true);
    const t = window.setTimeout(() => setPulse(false), 100);
    return () => window.clearTimeout(t);
  }, [display, counting, done]);

  useEffect(() => {
    let cancelled = false;
    let raf = 0;

    const run = async () => {
      await waitForReveal();
      if (cancelled) return;

      const revealAt = performance.now();

      await new Promise((r) => setTimeout(r, 400));
      if (cancelled) return;

      setVisible(true);

      const finish = () => {
        const root = getComputedStyle(document.documentElement);
        const period =
          parseFloat(root.getPropertyValue("--pulse-duration")) * 1000 || 2400;
        const heartPulseDelay =
          parseFloat(root.getPropertyValue("--pulse-delay")) * 1000 || 1400;
        const elapsed = performance.now() - revealAt;
        const phase = ((elapsed + heartPulseDelay) % period) / 1000;
        setPulseSync(`${phase}s`);
        setCounting(false);
        setDone(true);
      };

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || target === 0) {
        setDisplay(target);
        finish();
        return;
      }

      setCounting(true);
      const duration = Math.min(2400, 900 + target * 16);
      let startTime = 0;

      const tick = (now: number) => {
        if (!startTime) startTime = now;
        const t = Math.min((now - startTime) / duration, 1);
        setDisplay(Math.round(easeOutExpo(t) * target));

        if (t < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          finish();
        }
      };

      raf = requestAnimationFrame(tick);
    };

    run();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
    };
  }, [target]);

  return (
    <div
      className={`days-block${visible ? " is-visible" : ""}${counting ? " is-counting" : ""}${done ? " is-done" : ""}`}
      style={{ "--pulse-sync": pulseSync } as CSSProperties}
      aria-live="polite"
      aria-label={`${target} ${target <= 1 ? "jour" : "jours"} ensemble`}
    >
      <div className="days-block-inner">
        <span className={`days-number${pulse ? " tick" : ""}`}>{display}</span>
        <span className="days-label">
          {target <= 1 ? "jour ensemble" : "jours ensemble"}
        </span>
      </div>
      {done && target > 0 && (
        <>
          <span className="days-spark s1" aria-hidden="true" />
          <span className="days-spark s2" aria-hidden="true" />
          <span className="days-spark s3" aria-hidden="true" />
        </>
      )}
    </div>
  );
}
