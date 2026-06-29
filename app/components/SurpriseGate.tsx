"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { siteConfig } from "../lib/config";

type Props = { children: ReactNode };

export default function SurpriseGate({ children }: Props) {
  const [revealed, setRevealed] = useState(!siteConfig.surpriseMode);
  const [overlayVisible, setOverlayVisible] = useState<boolean>(siteConfig.surpriseMode);
  const [enabled, setEnabled] = useState<boolean>(siteConfig.surpriseMode);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !siteConfig.surpriseMode) {
      setRevealed(true);
      setOverlayVisible(false);
      setEnabled(false);
      return;
    }
  }, []);

  const reveal = useCallback(() => {
    setRevealed(true);
    window.setTimeout(() => setOverlayVisible(false), 1200);
  }, []);

  return (
    <>
      {enabled && overlayVisible && (
        <div
          className={`surprise-overlay${revealed ? " is-hidden" : ""}`}
          onPointerDown={reveal}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              reveal();
            }
          }}
          aria-label="Appuie pour découvrir"
        >
          <p className="surprise-hint">Appuie pour découvrir</p>
        </div>
      )}
      <div className={`surprise-gate${revealed ? " scene--revealed" : ""}`}>{children}</div>
    </>
  );
}
