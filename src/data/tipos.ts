/**
 * Tipos compartilhados pelos arquivos de dados/configuração.
 *
 * Todo número apresentado no site deve declarar sua procedência (`status`).
 * O componente <EstimateBadge> usa esse campo para exibir o selo adequado.
 */

/** Procedência de um dado de referência. */
export type StatusDado =
  /** Informação publicada por fonte identificada (prefeitura, imprensa, órgão oficial). */
  | 'fonte'
  /** Valor calculado/aproximado a partir de outros dados. */
  | 'estimativa'
  /** Premissa do projeto, sem medição ainda. */
  | 'hipotese'
  /** Valor de referência que precisa ser conferido na fonte oficial. */
  | 'verificar'
  /** Valor provisório, a ser substituído pelo grupo. */
  | 'placeholder';

export interface DadoReferencia<T = number> {
  /** Nome curto, exibido em tabelas e rótulos. */
  rotulo: string;
  valor: T;
  unidade: string;
  status: StatusDado;
  /** De onde veio o número. */
  fonte: string;
  /** Contexto, ressalvas e como ajustar. */
  observacao: string;
}
