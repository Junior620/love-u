import { rand } from "./rand";

/** Arrondit pour des styles identiques serveur / client. */
const fix = (n: number, decimals = 3) => Number(n.toFixed(decimals));

export type ParticleData = {
  left: string;
  top: string;
  size: string;
  delay: string;
  duration: string;
};

export type HeartData = {
  left: string;
  size: number;
  sizePx: string;
  delay: string;
  duration: string;
  sway: string;
  opacity: string;
  alt: boolean;
};

export const PARTICLE_COUNT = 46;
export const HEART_COUNT = 22;

export const PARTICLES: ParticleData[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  left: `${fix(rand(i + 11) * 100, 2)}%`,
  top: `${fix(rand(i + 211) * 100, 2)}%`,
  size: `${fix(2 + rand(i + 311) * 4, 3)}px`,
  delay: `${fix(-(rand(i + 411) * 6), 3)}s`,
  duration: `${fix(2.5 + rand(i + 511) * 4, 3)}s`,
}));

export const HEARTS: HeartData[] = Array.from({ length: HEART_COUNT }, (_, i) => {
  const size = fix(12 + rand(i + 101) * 26, 3);
  return {
    left: `${fix(3 + rand(i + 1) * 94, 2)}%`,
    size,
    sizePx: `${size}px`,
    delay: `${fix(-(rand(i + 201) * 18), 3)}s`,
    duration: `${fix(11 + rand(i + 301) * 12, 3)}s`,
    sway: `${fix(rand(i + 401) * 60 - 30, 3)}px`,
    opacity: String(fix(0.45 + rand(i + 501) * 0.5, 4)),
    alt: rand(i + 601) > 0.5,
  };
});
