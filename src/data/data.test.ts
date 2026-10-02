import { describe, expect, it } from 'vitest';
import { EQUIPE } from './equipe';
import { ETAPAS } from './etapas';
import { COMPONENTES, FLUXO_PRINCIPAL, HARDWARE, PROTOTIPO } from './hardware';
import { ROADMAP } from './roadmap';

describe('hardware do protótipo', () => {
  it('lista os 6 componentes reais, na ordem da tabela do grupo', () => {
    expect(COMPONENTES.map((id) => HARDWARE[id].nome)).toEqual([
      'Sensor de luminosidade LDR',
      'Sensor de presença PIR e/ou HC-SR04 (ultrassônico)',
      'ESP32',
      'LEDs',
      'PWM',
      'Wi-Fi',
    ]);
  });

  it('o Wi-Fi é previsto (evolução futura) e fica fora do fluxo principal', () => {
    expect(HARDWARE.wifi.status).toBe('previsto');
    expect(FLUXO_PRINCIPAL).not.toContain('wifi');
    COMPONENTES.filter((id) => id !== 'wifi').forEach((id) =>
      expect(HARDWARE[id].status).toBe('prototipo'),
    );
  });

  it('o fluxo principal é LDR + presença → ESP32 → PWM → LEDs', () => {
    expect(FLUXO_PRINCIPAL).toEqual(['ldr', 'presenca', 'esp32', 'pwm', 'leds']);
  });

  it('a demonstração é descrita como maquete com LEDs no lugar dos postes', () => {
    expect(PROTOTIPO.descricao).toMatch(/maquete/i);
    expect(PROTOTIPO.descricao).toMatch(/LEDs representam os postes/);
  });

  it('não volta a citar componentes antigos/placeholder', () => {
    const texto = JSON.stringify({ HARDWARE, ETAPAS, ROADMAP, PROTOTIPO });
    expect(texto).not.toMatch(/BH1750|RCWL|radar|HC-SR501|0–10 V|driver|microcontrolador/i);
  });
});

describe('etapas', () => {
  it('só usam componentes do fluxo principal (nunca o Wi-Fi previsto)', () => {
    for (const etapa of ETAPAS) {
      [...etapa.ativos, ...etapa.cadeia.map((p) => p.componente)].forEach((id) =>
        expect(FLUXO_PRINCIPAL).toContain(id),
      );
    }
  });

  it('cada estado aponta o componente responsável', () => {
    const [dia, noite, movimento] = ETAPAS;
    expect(dia?.cadeia.map((p) => p.componente)).toEqual(['ldr', 'esp32']);
    expect(noite?.cadeia.at(-1)?.componente).toBe('pwm');
    expect(movimento?.cadeia.map((p) => p.componente)).toEqual(['presenca', 'pwm']);
    expect(movimento?.cadeia.at(-1)?.acao).toMatch(/100%/);
  });
});

describe('equipe', () => {
  it('mantém as áreas e os integrantes na ordem definida', () => {
    expect(EQUIPE.map((a) => a.titulo)).toEqual([
      'Documentação',
      'Circuito e eletrônica',
      'Maquete',
      'Back-end',
      'Front-end',
    ]);
    expect(EQUIPE.flatMap((a) => a.integrantes.map((p) => p.nome))).toEqual([
      'Eduardo Bortoleto',
      'João Pedro Laguna',
      'João Vitor Fonseca',
      'Jônatas Andrade Fonseca',
      'Samuel Santos Cruz',
      'João Pedro de Carvalho Pacheco',
      'Ricardo Henrique Pereira Cardoso',
    ]);
  });

  it('não usa fotos nem placeholders', () => {
    const integrantes = EQUIPE.flatMap((a) => a.integrantes);
    expect(integrantes.every((p) => p.foto === undefined)).toBe(true);
    expect(JSON.stringify(EQUIPE)).not.toMatch(/Integrante \d/);
  });
});
