// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { INDAIATUBA } from '@/data/indaiatuba';
import { listarDadosReferencia } from '@/lib/indaiatubaScenarios';
import { HowWeCalculate } from './HowWeCalculate';

describe('<HowWeCalculate />', () => {
  it('começa fechado', () => {
    const { container } = render(<HowWeCalculate />);
    expect(container.querySelector('details')?.open).toBe(false);
    expect(screen.getByText('Como calculamos?')).toBeTruthy();
  });

  it('lista todos os dados de referência com a fonte de cada um', () => {
    render(<HowWeCalculate />);
    for (const grupo of listarDadosReferencia(INDAIATUBA)) {
      for (const dado of grupo.dados) {
        expect(screen.getByText(dado.rotulo)).toBeTruthy();
      }
    }
    expect(screen.getAllByText(/Prefeitura de Indaiatuba/).length).toBeGreaterThan(0);
  });

  it('mostra a fórmula do fator de uso do LuxSmart', () => {
    render(<HowWeCalculate />);
    expect(
      screen.getByText(/Fator de uso do LuxSmart = \(1 − movimento\) × 30% \+ movimento/),
    ).toBeTruthy();
  });
});
