// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ETAPAS } from '@/data/etapas';
import { HARDWARE } from '@/data/hardware';
import { FlowDiagram } from './FlowDiagram';

const movimento = ETAPAS.find((e) => e.id === 'movimento')!;

/** Texto do elemento apontado por aria-describedby (o cartão com a função). */
function descricao(botao: HTMLElement): string {
  const id = botao.getAttribute('aria-describedby');
  return (id && document.getElementById(id)?.textContent) || '';
}

describe('<FlowDiagram />', () => {
  it('cada componente é um botão cuja descrição é a sua função', () => {
    render(<FlowDiagram etapa={movimento} />);
    const esp32 = screen.getByRole('button', { name: /ESP32/ });
    expect(descricao(esp32)).toContain(HARDWARE.esp32.funcao);

    const pwm = screen.getByRole('button', { name: /PWM/ });
    expect(pwm.textContent).toContain('saída: 100%');
  });

  it('o Wi-Fi aparece como previsto, nunca como implementado', () => {
    render(<FlowDiagram etapa={movimento} />);
    const wifi = screen.getAllByRole('button', { name: /Wi-Fi/ })[0]!;
    expect(wifi.textContent).toMatch(/Previsto · evolução futura/);
    expect(descricao(wifi)).toContain(HARDWARE.wifi.funcao);
    expect(descricao(wifi)).not.toMatch(/Parte do protótipo/);
  });
});
