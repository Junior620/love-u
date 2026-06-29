/** Étincelle / cœur de traînée (desktop + mobile). */
export function spawnTrail(container: HTMLElement, x: number, y: number, count: { n: number }) {
  const s = document.createElement("span");
  const isHeart = count.n++ % 3 === 0;
  s.className = "trail " + (isHeart ? "trail-heart" : "trail-spark");
  if (isHeart) s.textContent = "♥";

  const ox = (Math.random() - 0.5) * 16;
  const oy = (Math.random() - 0.5) * 16;
  s.style.setProperty("--sc", (0.6 + Math.random() * 0.7).toFixed(2));
  s.style.setProperty("--dx", `${((Math.random() - 0.5) * 30).toFixed(1)}px`);
  s.style.setProperty("--dy", `${(-20 - Math.random() * 30).toFixed(1)}px`);
  s.style.left = `${x + ox}px`;
  s.style.top = `${y + oy}px`;

  container.appendChild(s);
  s.addEventListener("animationend", () => s.remove());
  window.setTimeout(() => s.remove(), 1200);
}
