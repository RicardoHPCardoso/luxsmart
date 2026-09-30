// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Calculator } from './Calculator';

const campoPostes = () => screen.getByLabelText<HTMLInputElement>('Número de postes (valor exato)');

describe('<Calculator />', () => {
  it('começa com o exemplo de uma rua', () => {
    render(<Calculator />);
    expect(campoPostes().value).toBe('30');
    expect(
      screen.getByRole('slider', { name: 'Número de postes' }).getAttribute('aria-valuetext'),
    ).toBe('30 postes');
  });

  it('"Aplicar à cidade de Indaiatuba" preenche com os dados de referência', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar à cidade de Indaiatuba' }));

    expect(campoPostes().value).toBe('28000');
    expect(
      screen
        .getByRole('slider', { name: 'Potência sem movimento (dimerização)' })
        .getAttribute('aria-valuetext'),
    ).toBe('30%');

    fireEvent.click(screen.getByRole('button', { name: 'Exemplo: uma rua' }));
    expect(campoPostes().value).toBe('30');
  });

  it('mover o slider de movimento para 100% zera a economia', () => {
    render(<Calculator />);
    fireEvent.change(screen.getByRole('slider', { name: 'Parte da noite com movimento' }), {
      target: { value: '1' },
    });
    expect(screen.getByText('sem retorno')).toBeTruthy();
  });

  it('o campo numérico aceita digitação e respeita os limites ao sair', () => {
    render(<Calculator />);
    const campo = campoPostes();
    fireEvent.focus(campo);
    fireEvent.change(campo, { target: { value: '99999' } });
    fireEvent.blur(campo);
    expect(campo.value).toBe('40000');
  });
});
