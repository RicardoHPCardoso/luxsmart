// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FLUXO_PRINCIPAL, HARDWARE } from '@/data/hardware';
import { ComponentFlow } from './ComponentFlow';

/** Texto do elemento apontado por aria-describedby (o cartão com a função). */
function descricao(botao: HTMLElement): string {
  const id = botao.getAttribute('aria-describedby');
  return (id && document.getElementById(id)?.textContent) || '';
}

describe('<ComponentFlow />', () => {
  it('mostra os componentes do fluxo, na ordem, cada um com a sua função', () => {
    render(<ComponentFlow />);
    const botoes = screen.getAllByRole('button');
    expect(botoes.map((b) => b.textContent)).toEqual(
      FLUXO_PRINCIPAL.map((id) => HARDWARE[id].sigla),
    );
    botoes.forEach((botao, i) => {
      expect(descricao(botao)).toContain(HARDWARE[FLUXO_PRINCIPAL[i]!].funcao);
    });
  });

  it('o Wi-Fi aparece só como selo "Previsto", sem botão de função', () => {
    render(<ComponentFlow />);
    expect(screen.queryByRole('button', { name: /Wi-Fi/ })).toBeNull();
    expect(screen.getByText(/Wi-Fi: Previsto/)).toBeTruthy();
  });

  it('deixa claro que a demonstração é uma maquete', () => {
    render(<ComponentFlow />);
    expect(screen.getByText(/maquete em escala/)).toBeTruthy();
  });
});
