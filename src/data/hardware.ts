/**
 * COMPONENTES DE HARDWARE exibidos no diagrama "Como funciona".
 * Troque `nome`, `modelo` e `funcao` pelos componentes que o grupo usar
 * de verdade — o diagrama se atualiza sozinho.
 */

export type IdComponente =
  'luminosidade' | 'presenca' | 'microcontrolador' | 'driver' | 'luminaria';

export interface ComponenteHardware {
  id: IdComponente;
  nome: string;
  /** Modelo/peça sugerida (placeholder até o grupo definir). */
  modelo: string;
  funcao: string;
}

export const HARDWARE: Record<IdComponente, ComponenteHardware> = {
  luminosidade: {
    id: 'luminosidade',
    nome: 'Sensor de luminosidade',
    modelo: 'LDR ou BH1750',
    funcao: 'Mede a luz ambiente para saber se é dia ou noite.',
  },
  presenca: {
    id: 'presenca',
    nome: 'Sensor de presença',
    modelo: 'PIR HC-SR501 ou radar RCWL-0516',
    funcao: 'Detecta carros e pedestres dentro do raio de alcance.',
  },
  microcontrolador: {
    id: 'microcontrolador',
    nome: 'Microcontrolador',
    modelo: 'ESP32',
    funcao: 'Decide o nível de luz e controla o tempo de espera após o movimento.',
  },
  driver: {
    id: 'driver',
    nome: 'Driver dimerizável',
    modelo: 'Driver LED com entrada PWM / 0–10 V',
    funcao: 'Converte o comando do microcontrolador em potência para o LED.',
  },
  luminaria: {
    id: 'luminaria',
    nome: 'Luminária LED',
    modelo: 'LED 84–190 W (conforme a via)',
    funcao: 'Ilumina a rua no nível definido: desligada, econômica ou 100%.',
  },
};
