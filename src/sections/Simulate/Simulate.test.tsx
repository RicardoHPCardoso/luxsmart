// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { INDAIATUBA } from '@/data/indaiatuba';
import { calcularEconomia, valoresDaCidade } from '@/lib/calculator';
import { comparacaoPorFiltro } from '@/lib/indaiatubaScenarios';
import { formatarMoedaCompacta, formatarPercentual } from '@/lib/format';
import { Simulate } from './Simulate';

const slider = () => screen.getByRole('slider', { name: '% do tempo com movimento na rua' });

/** Texto acessível do resultado (o número animado tem uma cópia para leitores de tela). */
const textoResultado = () =>
  screen.getByText('Resultado em Indaiatuba').closest('div')!.parentElement!.textContent ?? '';

describe('<Simulate />', () => {
  it('começa na média da cidade, com o mesmo resultado da seção Resultados', () => {
    render(<Simulate />);
    const cidade = comparacaoPorFiltro(INDAIATUBA, 'cidade');
    expect(slider().getAttribute('aria-valuetext')).toBe(
      formatarPercentual(valoresDaCidade(INDAIATUBA).movimento),
    );
    expect(textoResultado()).toContain(formatarPercentual(cidade.economiaPercentual));
    expect(textoResultado()).toContain(formatarMoedaCompacta(cidade.economiaReais));
  });

  it('mover o slider recalcula a economia (100% de movimento → 0%)', () => {
    render(<Simulate />);
    fireEvent.change(slider(), { target: { value: '1' } });
    expect(slider().getAttribute('aria-valuetext')).toBe('100%');
    const esperado = calcularEconomia(
      { ...valoresDaCidade(INDAIATUBA), movimento: 1 },
      INDAIATUBA.horasPorNoite.valor,
      INDAIATUBA.fatorEmissao.valor,
    );
    expect(esperado.economiaPercentual).toBeCloseTo(0);
    expect(textoResultado()).toContain('0%');
  });

  it('a rua aceita toque e tem botões para quem usa teclado', () => {
    render(<Simulate />);
    expect(screen.getByRole('img', { name: /Rua simulada com 5 postes/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Enviar carro' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Enviar pedestre' })).toBeTruthy();
  });
});
