/** Générateur pseudo-aléatoire déterministe (SSR-safe). */
export const rand = (s: number) => {
  const x = Math.sin(s * 99.13 + 7.7) * 10000;
  return x - Math.floor(x);
};
