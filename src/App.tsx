import { MotionConfig } from 'framer-motion';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Section } from '@/components/layout/Section';
import { SkipLink } from '@/components/layout/SkipLink';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { NAVEGACAO, SECOES } from '@/data/navegacao';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <SkipLink />
        <Header />
        <main id="conteudo" tabIndex={-1}>
          <Section id={SECOES.inicio} tema="noite" className="flex min-h-dvh items-center">
            <div className="container-site">
              <h1 className="text-5xl font-bold">LuxSmart</h1>
            </div>
          </Section>
          {NAVEGACAO.map((item, i) => (
            <Section key={item.id} id={item.id} tema={i % 2 === 0 ? 'noite' : 'dia'}>
              <div className="container-site">
                <SectionHeading
                  sobretitulo={item.rotulo}
                  titulo={item.rotulo}
                  tema={i % 2 === 0 ? 'noite' : 'dia'}
                />
              </div>
            </Section>
          ))}
        </main>
        <Footer />
      </SmoothScroll>
    </MotionConfig>
  );
}
