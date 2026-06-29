import SurpriseGate from "./components/SurpriseGate";
import FloatingParticles from "./components/FloatingParticles";
import FloatingHearts from "./components/FloatingHearts";
import CursorFX from "./components/CursorFX";
import MobileFX from "./components/MobileFX";
import HeroContent from "./components/HeroContent";
import { HEARTS, PARTICLES } from "./lib/scene-data";

export default function Page() {
  return (
    <SurpriseGate>
      <main className="scene">
        <div className="aurora" />
        <FloatingParticles particles={PARTICLES} />
        <FloatingHearts hearts={HEARTS} />
        <CursorFX />
        <MobileFX />
        <HeroContent />
        <div className="vignette" />
      </main>
    </SurpriseGate>
  );
}
