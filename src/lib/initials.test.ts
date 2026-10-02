import { describe, expect, it } from 'vitest';
import { iniciais } from './initials';

describe('iniciais', () => {
  it('usa todas as palavras do nome completo', () => {
    expect(iniciais('Eduardo Bortoleto')).toBe('EB');
    expect(iniciais('João Pedro Laguna')).toBe('JPL');
    expect(iniciais('Ricardo Henrique Pereira Cardoso')).toBe('RHPC');
  });

  it('ignora partículas como "de", "da" e "dos"', () => {
    expect(iniciais('João Pedro de Carvalho Pacheco')).toBe('JPCP');
    expect(iniciais('Maria da Silva dos Santos')).toBe('MSS');
  });

  it('diferencia nomes que teriam as mesmas iniciais de primeiro e último nome', () => {
    expect(iniciais('João Vitor Fonseca')).toBe('JVF');
    expect(iniciais('Jônatas Andrade Fonseca')).toBe('JAF');
  });

  it('tolera espaços extras e minúsculas', () => {
    expect(iniciais('  samuel   santos cruz ')).toBe('SSC');
    expect(iniciais('')).toBe('');
  });
});
