import { MotionConfig } from 'framer-motion';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Section } from '@/components/layout/Section';
import { SkipLink } from '@/components/layout/SkipLink';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SECOES } from '@/data/navegacao';
import { Benefits } from '@/sections/Benefits';
import { Hero } from '@/sections/Hero/Hero';
import { HowItWorks } from '@/sections/HowItWorks/HowItWorks';
import { Methodology } from '@/sections/Methodology';
import { Problem } from '@/sections/Problem';
import { Roadmap } from '@/sections/Roadmap';
import { Team } from '@/sections/Team';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <SkipLink />
        <Header />
        <main id="conteudo" tabIndex={-1}>
          <Hero />
          <Problem />
          <HowItWorks />
          <Section id={SECOES.simulador} tema="noite">
            <div className="container-site">
              <SectionHeading tema="noite" sobretitulo="Simulador" titulo="Em construção" />
            </div>
          </Section>
          <Section id={SECOES.dashboard} tema="dia">
            <div className="container-site">
              <SectionHeading sobretitulo="Indaiatuba" titulo="Em construção" />
            </div>
          </Section>
          <Section id={SECOES.calculadora} tema="dia">
            <div className="container-site">
              <SectionHeading sobretitulo="Calculadora" titulo="Em construção" />
            </div>
          </Section>
          <Benefits />
          <Roadmap />
          <Team />
          <Methodology />
        </main>
        <Footer />
      </SmoothScroll>
    </MotionConfig>
  );
}
