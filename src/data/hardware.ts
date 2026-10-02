/**
 * COMPONENTES DE HARDWARE do protótipo (maquete) do LuxSmart.
 * Exibidos no diagrama "Como funciona". Para trocar ou ajustar um componente,
 * edite só este arquivo — diagrama, etapas e textos se atualizam sozinhos.
 */
import type { NomeIcone } from '@/components/icons/icons';

export type IdComponente = 'ldr' | 'presenca' | 'esp32' | 'leds' | 'pwm' | 'wifi';

/**
 * - `prototipo`: faz parte da maquete em desenvolvimento;
 * - `previsto`: evolução futura, ainda fora do escopo atual (não é apresentado
 *   como funcionalidade implementada).
 */
export type StatusComponente = 'prototipo' | 'previsto';

export interface ComponenteHardware {
  id: IdComponente;
  /** Nome completo, como na lista de componentes do grupo. */
  nome: string;
  /** Rótulo curto usado no diagrama. */
  sigla: string;
  funcao: string;
  icone: NomeIcone;
  status: StatusComponente;
}

export const ROTULO_STATUS_COMPONENTE: Record<StatusComponente, string> = {
  prototipo: 'Parte do protótipo',
  previsto: 'Previsto · evolução futura',
};

export const HARDWARE: Record<IdComponente, ComponenteHardware> = {
  ldr: {
    id: 'ldr',
    nome: 'Sensor de luminosidade LDR',
    sigla: 'LDR',
    funcao: 'Identificar a condição de dia ou noite.',
    icone: 'ldr',
    status: 'prototipo',
  },
  presenca: {
    id: 'presenca',
    nome: 'Sensor de presença PIR e/ou HC-SR04 (ultrassônico)',
    sigla: 'PIR / HC-SR04',
    funcao: 'Detectar pedestres ou veículos no trecho monitorado.',
    icone: 'ultrassom',
    status: 'prototipo',
  },
  esp32: {
    id: 'esp32',
    nome: 'ESP32',
    sigla: 'ESP32',
    funcao: 'Ler os sensores, aplicar a lógica dos modos e comandar a iluminação.',
    icone: 'esp32',
    status: 'prototipo',
  },
  leds: {
    id: 'leds',
    nome: 'LEDs',
    sigla: 'LEDs (postes)',
    funcao: 'Representar os postes da maquete.',
    icone: 'led',
    status: 'prototipo',
  },
  pwm: {
    id: 'pwm',
    nome: 'PWM',
    sigla: 'PWM',
    funcao: 'Controlar a intensidade luminosa e permitir a transição entre os modos.',
    icone: 'pwm',
    status: 'prototipo',
  },
  wifi: {
    id: 'wifi',
    nome: 'Wi-Fi',
    sigla: 'Wi-Fi',
    funcao: 'Recurso previsto para comunicação futura, caso seja incorporado ao escopo.',
    icone: 'wifi',
    status: 'previsto',
  },
};

/** Ordem da lista de componentes (a mesma da tabela do grupo). */
export const COMPONENTES: readonly IdComponente[] = [
  'ldr',
  'presenca',
  'esp32',
  'leds',
  'pwm',
  'wifi',
];

/** Fluxo principal do sinal: LDR + presença → ESP32 → PWM → LEDs. */
export const FLUXO_PRINCIPAL: readonly IdComponente[] = ['ldr', 'presenca', 'esp32', 'pwm', 'leds'];

/** Como a demonstração física é feita (exibido em "Como funciona"). */
export const PROTOTIPO = {
  titulo: 'Demonstração em maquete',
  descricao:
    'A demonstração física é uma maquete em escala: LEDs representam os postes e o ESP32 controla o brilho de cada um por PWM, a partir das leituras do LDR e do sensor de presença.',
} as const;
