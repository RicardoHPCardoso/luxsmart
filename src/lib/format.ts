/**
 * Formatação de números em português do Brasil.
 * Todos os formatadores são criados uma única vez (Intl é caro de instanciar).
 */

const LOCALE = 'pt-BR';

const inteiro = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 });
const umaCasa = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1 });
const umaCasaFixa = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const compacto = new Intl.NumberFormat(LOCALE, { notation: 'compact', maximumFractionDigits: 1 });
const moeda = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});
const moedaCentavos = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 1234567 → "1.234.567" (ou com casas decimais). */
export function formatarNumero(valor: number, casas = 0): string {
  if (casas === 0) return inteiro.format(valor);
  if (casas === 1) return umaCasa.format(valor);
  return new Intl.NumberFormat(LOCALE, { maximumFractionDigits: casas }).format(valor);
}

/** 1234567 → "1,2 mi"; 34500 → "34,5 mil". */
export function formatarCompacto(valor: number): string {
  return compacto.format(valor);
}

/** 1234567 → "R$ 1.234.567". Use `centavos` para valores pequenos (tarifas). */
export function formatarMoeda(valor: number, { centavos = false } = {}): string {
  return (centavos ? moedaCentavos : moeda).format(valor);
}

/** 1234567 → "R$ 1,2 mi". */
export function formatarMoedaCompacta(valor: number): string {
  return `R$ ${formatarCompacto(valor)}`;
}

/** 0.4432 → "44%". */
export function formatarPercentual(fracao: number, casas = 0): string {
  return `${formatarNumero(fracao * 100, casas)}%`;
}

const ESCALAS_ENERGIA = [
  { limite: 1e6, divisor: 1e6, unidade: 'GWh' },
  { limite: 1e3, divisor: 1e3, unidade: 'MWh' },
] as const;

/**
 * Energia com unidade legível e uma casa decimal fixa (para comparar valores
 * lado a lado): 12_300_000 kWh → "12,3 GWh"; 7_000_000 → "7,0 GWh".
 */
export function formatarEnergia(kwh: number): string {
  const escala = ESCALAS_ENERGIA.find((e) => Math.abs(kwh) >= e.limite);
  if (!escala) return `${formatarNumero(kwh)} kWh`;
  return `${umaCasaFixa.format(kwh / escala.divisor)} ${escala.unidade}`;
}

/** 11.8667 → "11h52min". */
export function formatarHoras(horasDecimais: number): string {
  let horas = Math.floor(horasDecimais);
  let minutos = Math.round((horasDecimais - horas) * 60);
  if (minutos === 60) {
    horas += 1;
    minutos = 0;
  }
  return minutos === 0 ? `${horas}h` : `${horas}h${String(minutos).padStart(2, '0')}min`;
}

/** Payback em anos: 2.34 → "2,3 anos"; Infinity → "sem retorno". */
export function formatarAnos(anos: number): string {
  if (!Number.isFinite(anos)) return 'sem retorno';
  if (anos < 1) {
    const meses = Math.max(1, Math.round(anos * 12));
    return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
  }
  return `${formatarNumero(anos, 1)} ${anos < 2 ? 'ano' : 'anos'}`;
}

/**
 * Formata um dado de referência de acordo com a unidade declarada em
 * `data/indaiatuba.ts` (usado na tabela da seção de metodologia).
 */
export function formatarDadoReferencia(dado: {
  valor: number | readonly number[];
  unidade: string;
}): string {
  const { valor, unidade } = dado;
  if (typeof valor !== 'number') return valor.map((v) => formatarNumero(v, 2)).join(' · ');

  if (unidade === '%' || unidade.startsWith('% ')) return formatarPercentual(valor);
  switch (unidade) {
    case 'R$/kWh':
      return `${formatarMoeda(valor, { centavos: true })}/kWh`;
    case 'R$/ponto':
      return `${formatarMoeda(valor)} por ponto`;
    case 'h/noite':
      return `${formatarHoras(valor)} por noite`;
    case 'W':
      return `${formatarNumero(valor)} W`;
    case 'pontos':
      return `${formatarNumero(valor)} pontos`;
    default:
      return `${formatarNumero(valor, 3)} ${unidade}`;
  }
}
