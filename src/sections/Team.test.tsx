// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EQUIPE } from '@/data/equipe';
import { Team } from './Team';

describe('<Team />', () => {
  it('mostra um card por área, na ordem, com os integrantes dentro', () => {
    render(<Team />);
    const titulos = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    expect(titulos).toEqual(EQUIPE.map((a) => a.titulo));

    const circuito = screen
      .getByRole('heading', { name: 'Circuito e eletrônica' })
      .closest('article');
    expect(circuito).not.toBeNull();
    expect(within(circuito!).getByText('João Pedro Laguna')).toBeTruthy();
    expect(within(circuito!).getByText('João Vitor Fonseca')).toBeTruthy();
  });

  it('usa avatares com iniciais do nome completo, sem fotos', () => {
    const { container } = render(<Team />);
    expect(container.querySelectorAll('img')).toHaveLength(0);
    expect(screen.getByText('JPCP')).toBeTruthy();
    expect(screen.getByText('RHPC')).toBeTruthy();
    expect(screen.getByText('JAF')).toBeTruthy();
    expect(screen.getByText('JVF')).toBeTruthy();
  });

  it('cita o curso e a instituição', () => {
    render(<Team />);
    expect(screen.getByText(/Ciência da Computação \(UNIMAX\)/)).toBeTruthy();
  });
});
