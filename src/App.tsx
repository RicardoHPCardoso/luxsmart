import { MotionConfig } from 'framer-motion';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SkipLink } from '@/components/layout/SkipLink';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { Hero } from '@/sections/Hero/Hero';
import { HowItWorks } from '@/sections/HowItWorks/HowItWorks';
import { Methodology } from '@/sections/Methodology';
import { ProblemSolution } from '@/sections/ProblemSolution';
import { Results } from '@/sections/Results/Results';
import { Roadmap } from '@/sections/Roadmap';
import { Simulate } from '@/sections/Simulate/Simulate';
import { Team } from '@/sections/Team';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <SkipLink />
        <Header />
        <main id="conteudo" tabIndex={-1}>
          <Hero />
          <ProblemSolution />
          <HowItWorks />

          <Results />
          <Simulate />
          <Roadmap />
          <Team />
          <Methodology />
        </main>
        <Footer />
      </SmoothScroll>
    </MotionConfig>
  );
}
