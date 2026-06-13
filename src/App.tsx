import { useLenisInit } from '@/hooks/useLenis';
import { CustomCursor } from '@/components/CustomCursor';
import { NavigationHeader } from '@/components/NavigationHeader';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/sections/HeroSection';
import { PhilosophySection } from '@/sections/PhilosophySection';
import { MetricsSection } from '@/sections/MetricsSection';
import { SkillsSection } from '@/sections/SkillsSection';
import { ImpactSection } from '@/sections/ImpactSection';
import { VisionSection } from '@/sections/VisionSection';
import { InnovationSection } from '@/sections/InnovationSection';
import { ImpactVideoSection } from '@/sections/ImpactVideoSection';
import { ContactSection } from '@/sections/ContactSection';

export default function App() {
  useLenisInit();

  return (
    <>
      <CustomCursor />
      <NavigationHeader />

      <main>
        <HeroSection />
        <PhilosophySection />
        <MetricsSection />
        <SkillsSection />
        <ImpactSection />
        <VisionSection />
        <InnovationSection />
        <ImpactVideoSection />
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}
