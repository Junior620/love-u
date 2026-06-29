import { siteConfig } from "../lib/config";
import CentralHeart from "./CentralHeart";
import DaysCounter from "./DaysCounter";

export default function HeroContent() {
  const finaleChars = siteConfig.finale.split("");

  return (
    <section className="hero">
      <CentralHeart />
      <DaysCounter />
      <p className="eyebrow">{siteConfig.eyebrow}</p>
      <h1 className="title">
        <span className="title-line">{siteConfig.message}</span>
      </h1>
      <h2 className="finale" aria-label={siteConfig.finale}>
        {finaleChars.map((char, i) => (
          <span
            key={i}
            className="finale-char"
            style={{ animationDelay: `${1.8 + i * 0.06}s, ${2.8 + i * 0.06}s` }}
            aria-hidden={char === " "}
          >
            {char === " " ? "\u00a0" : char}
          </span>
        ))}
      </h2>
    </section>
  );
}
