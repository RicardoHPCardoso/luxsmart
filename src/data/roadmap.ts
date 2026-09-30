/**
 * ROADMAP do projeto. Atualize `status` e `periodo` conforme o andamento.
 */

export type StatusEtapaRoadmap = 'concluido' | 'em-andamento' | 'planejado';

export interface EtapaRoadmap {
  titulo: string;
  periodo: string;
  descricao: string;
  entregas: readonly string[];
  status: StatusEtapaRoadmap;
}

export const ROTULO_STATUS_ROADMAP: Record<StatusEtapaRoadmap, string> = {
  concluido: 'Concluído',
  'em-andamento': 'Em andamento',
  planejado: 'Planejado',
};

export const ROADMAP: readonly EtapaRoadmap[] = [
  {
    titulo: 'Pesquisa',
    periodo: '2026 · 1º semestre',
    descricao:
      'Levantamento de dados da iluminação pública de Indaiatuba e de soluções existentes.',
    entregas: ['Dados de referência', 'Escolha dos sensores', 'Modelo de cálculo de economia'],
    status: 'concluido',
  },
  {
    titulo: 'Protótipo',
    periodo: '2026 · 2º semestre',
    descricao: 'Montagem do poste em escala com sensores, microcontrolador e LED dimerizável.',
    entregas: ['Circuito montado', 'Firmware com os 3 estados', 'Site de apresentação'],
    status: 'em-andamento',
  },
  {
    titulo: 'Testes',
    periodo: '2027 · 1º semestre',
    descricao: 'Medição de consumo real, tempo de resposta e alcance dos sensores.',
    entregas: ['Relatório de consumo medido', 'Ajuste de dimerização e tempo de espera'],
    status: 'planejado',
  },
  {
    titulo: 'Piloto em uma rua',
    periodo: 'A definir',
    descricao: 'Instalação em uma rua de Indaiatuba, em parceria com a Prefeitura.',
    entregas: ['Comparativo antes × depois', 'Feedback de moradores'],
    status: 'planejado',
  },
  {
    titulo: 'Expansão',
    periodo: 'A definir',
    descricao: 'Ampliação gradual para outras vias, com monitoramento centralizado.',
    entregas: ['Painel de gestão para a Prefeitura', 'Plano de manutenção'],
    status: 'planejado',
  },
];
