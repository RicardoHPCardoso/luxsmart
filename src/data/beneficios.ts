/**
 * Cards da seção "Benefícios". `icone` referencia um ícone em components/icons.
 */
import type { NomeIcone } from '@/components/icons/icons';

export interface Beneficio {
  titulo: string;
  descricao: string;
  icone: NomeIcone;
}

export const BENEFICIOS: readonly Beneficio[] = [
  {
    titulo: 'Economia na conta de luz',
    descricao:
      'A luz só trabalha a 100% quando alguém precisa dela. No resto da noite, consome uma fração da potência.',
    icone: 'moeda',
  },
  {
    titulo: 'Segurança mantida',
    descricao:
      'A rua nunca fica apagada: o modo econômico mantém orientação e a luz total volta no instante em que há movimento.',
    icone: 'escudo',
  },
  {
    titulo: 'Menos poluição luminosa',
    descricao:
      'Menos luz desperdiçada no céu noturno durante a madrugada, com menor impacto sobre a fauna e o sono dos moradores.',
    icone: 'estrela',
  },
  {
    titulo: 'LED dura mais',
    descricao:
      'Operar dimerizado reduz a temperatura de trabalho do LED e da sua eletrônica, o que tende a prolongar a vida útil do equipamento.',
    icone: 'ciclo',
  },
  {
    titulo: 'Dados para a prefeitura',
    descricao:
      'Com a comunicação Wi-Fi prevista como evolução futura, cada poste poderá enviar horários de movimento e consumo, apoiando o planejamento da iluminação e da manutenção.',
    icone: 'grafico',
  },
  {
    titulo: 'ODS 7 e 11 da ONU',
    descricao:
      'Contribui com a eficiência energética (ODS 7 — energia limpa e acessível) e com cidades mais sustentáveis (ODS 11).',
    icone: 'globo',
  },
];
