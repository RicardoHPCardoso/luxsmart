import { MotionConfig } from 'framer-motion';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SkipLink } from '@/components/layout/SkipLink';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { Benefits } from '@/sections/Benefits';
import { Calculator } from '@/sections/Calculator/Calculator';
import { Dashboard } from '@/sections/Dashboard/Dashboard';
import { Hero } from '@/sections/Hero/Hero';
import { HowItWorks } from '@/sections/HowItWorks/HowItWorks';
import { Methodology } from '@/sections/Methodology';
import { Problem } from '@/sections/Problem';
import { Roadmap } from '@/sections/Roadmap';
import { Simulator } from '@/sections/Simulator/Simulator';
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
          <Simulator />
          <Dashboard />
          <Calculator />
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
