export const siteConfig = {
  /** URL publique du site (utilisée pour Open Graph, sitemap, etc.) */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://gabrielle.goldenbeans.com",
  eyebrow: "Rien que pour toi",
  message: "Tu es la plus belle",
  finale: "I love u",
  relationshipStartDate: "2026-04-26",
  surpriseMode: true,
  burstCooldownMs: 300,
  openGraph: {
    title: "I love u",
  },
};

export function getDaysTogether(startDate: string): number {
  const start = new Date(startDate + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = today.getTime() - start.getTime();
  return Math.max(0, Math.floor(diff / 86_400_000));
}

export function formatDaysLabel(days: number): string {
  if (days === 0) return "0 jour ensemble";
  if (days === 1) return "1 jour ensemble";
  return `${days} jours ensemble`;
}
