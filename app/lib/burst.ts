import { siteConfig } from "./config";

export const BURST_COUNT = 24;

let lastBurstTime = 0;

export type BurstOptions = {
  skipThrottle?: boolean;
  skipShockwave?: boolean;
};

export function spawnBurst(
  container: HTMLElement,
  x: number,
  y: number,
  options: BurstOptions = {},
) {
  const now = performance.now();
  if (!options.skipThrottle && now - lastBurstTime < siteConfig.burstCooldownMs) {
    return false;
  }
  lastBurstTime = now;

  for (let i = 0; i < BURST_COUNT; i++) {
    const s = document.createElement("span");
    const alt = i % 3 === 0;
    s.className = "burst-heart" + (alt ? " alt" : "");
    s.textContent = "♥";

    const angle = (Math.PI * 2 * i) / BURST_COUNT + (Math.random() - 0.5) * 0.35;
    const dist = 80 + Math.random() * 100;
    const bx = Math.cos(angle) * dist;
    const by = Math.sin(angle) * dist;
    const grav = 25 + Math.random() * 35;

    s.style.setProperty("--bx", `${bx.toFixed(1)}px`);
    s.style.setProperty("--by", `${by.toFixed(1)}px`);
    s.style.setProperty("--by-grav", `${(by + grav).toFixed(1)}px`);
    s.style.fontSize = `${14 + Math.random() * 14}px`;
    s.style.left = `${x}px`;
    s.style.top = `${y}px`;
    s.style.animationDelay = `${i * 25}ms`;

    container.appendChild(s);
    s.addEventListener("animationend", () => s.remove());
    window.setTimeout(() => s.remove(), 1600);
  }

  if (!options.skipShockwave) {
    spawnShockwave(container, x, y);
  }

  return true;
}

export function spawnShockwave(container: HTMLElement, x: number, y: number) {
  const ring = document.createElement("span");
  ring.className = "burst-shockwave";
  ring.style.left = `${x}px`;
  ring.style.top = `${y}px`;
  container.appendChild(ring);
  ring.addEventListener("animationend", () => ring.remove());
  window.setTimeout(() => ring.remove(), 800);
}
