import { DEFAULT_THRESHOLDS, DescritorItem, MetricaAcerto, PerformanceThresholds, SaebFilterState, SaebKpiData } from '../types/saeb';

export interface SourceRow {
  DS_DISCIPLINA: string;
  CO_DESCRITOR: string;
  NM_UF?: string;
  TP_REDE?: string;
  TOTAL_RESPOSTAS: number;
  TOTAL_ACERTOS: number;
  PESO_TOTAL_RESPOSTAS: number;
  PESO_TOTAL_ACERTOS: number;
}
export type Catalog = Record<string, Record<string, string>>;
export interface StaticDataset {
  schemaVersion: number;
  year: number;
  schoolYear: string;
  sourceSha256: string;
  catalog: Catalog;
  rows: SourceRow[];
}

export function classifyPerformance(pct: number, thresholds: PerformanceThresholds = DEFAULT_THRESHOLDS) {
  if (pct < thresholds.criticoMax) return { faixa: 'critico' as const, label: 'Crítico', color: '#D32F2F', badgeBg: '#FFEBEE', textColor: '#C62828' };
  if (pct < thresholds.atencaoMax) return { faixa: 'atencao' as const, label: 'Atenção', color: '#F57C00', badgeBg: '#FFF3E0', textColor: '#E65100' };
  if (pct < thresholds.intermediarioMax) return { faixa: 'intermediario' as const, label: 'Intermediário', color: '#D9AD00', badgeBg: '#FFFDE7', textColor: '#997A00' };
  return { faixa: 'adequado' as const, label: 'Adequado', color: '#388E3C', badgeBg: '#E8F5E9', textColor: '#2E7D32' };
}

export function filterRows(rows: SourceRow[], filters: SaebFilterState): SourceRow[] {
  if (filters.anoEscolar !== '9º Ano EF' || filters.localizacao !== 'Todas' ||
      filters.municipio !== 'Todos' || filters.escola !== 'Todas') return [];
  return rows.filter(row =>
    (filters.componente === 'Todos' || row.DS_DISCIPLINA === filters.componente) &&
    (filters.uf === 'Brasil (Todos)' || row.NM_UF === filters.uf) &&
    (filters.rede === 'Todas' || row.TP_REDE === filters.rede));
}

export function totals(rows: SourceRow[]) {
  return rows.reduce((sum, row) => ({
    TOTAL_RESPOSTAS: sum.TOTAL_RESPOSTAS + row.TOTAL_RESPOSTAS,
    TOTAL_ACERTOS: sum.TOTAL_ACERTOS + row.TOTAL_ACERTOS,
    PESO_TOTAL_RESPOSTAS: sum.PESO_TOTAL_RESPOSTAS + row.PESO_TOTAL_RESPOSTAS,
    PESO_TOTAL_ACERTOS: sum.PESO_TOTAL_ACERTOS + row.PESO_TOTAL_ACERTOS,
  }), { TOTAL_RESPOSTAS: 0, TOTAL_ACERTOS: 0, PESO_TOTAL_RESPOSTAS: 0, PESO_TOTAL_ACERTOS: 0 });
}

export function rate(rows: SourceRow[], metric: MetricaAcerto): number | null {
  const sum = totals(rows);
  const numerator = metric === 'ponderado' ? sum.PESO_TOTAL_ACERTOS : sum.TOTAL_ACERTOS;
  const denominator = metric === 'ponderado' ? sum.PESO_TOTAL_RESPOSTAS : sum.TOTAL_RESPOSTAS;
  return Number.isFinite(numerator) && Number.isFinite(denominator) && denominator > 0 ? 100 * numerator / denominator : null;
}

export function summarize(rows: SourceRow[], catalog: Catalog, metric: MetricaAcerto, thresholds: PerformanceThresholds = DEFAULT_THRESHOLDS, ufCount?: number): { kpis: SaebKpiData | null; descritores: DescritorItem[] } {
  const groups = new Map<string, SourceRow[]>();
  rows.forEach(row => {
    const key = `${row.DS_DISCIPLINA}|${row.CO_DESCRITOR}`;
    groups.set(key, [...(groups.get(key) ?? []), row]);
  });
  const descritores: DescritorItem[] = [];
  groups.forEach(group => {
    const first = group[0];
    const pct = rate(group, metric);
    if (pct === null) return;
    const description = catalog[first.DS_DISCIPLINA]?.[first.CO_DESCRITOR];
    const perf = classifyPerformance(pct, thresholds);
    descritores.push({
      CO_DESCRITOR: first.CO_DESCRITOR, DS_DISCIPLINA: first.DS_DISCIPLINA,
      descricao: description ?? 'Código adicional presente na base agregada. Descrição e origem documental ainda não validadas nesta revisão.',
      matriz2001: Boolean(description), ...totals(group), pct,
      pct_simples: rate(group, 'simples'), pct_ponderado: rate(group, 'ponderado'),
      faixa: perf.faixa, nivelLabel: perf.label,
    });
  });
  descritores.sort((a, b) => b.pct - a.pct || a.DS_DISCIPLINA.localeCompare(b.DS_DISCIPLINA) || a.CO_DESCRITOR.localeCompare(b.CO_DESCRITOR));
  const mediaGeral = rate(rows, metric);
  if (!descritores.length || mediaGeral === null) return { kpis: null, descritores: [] };
  const describe = (item: DescritorItem) => ({ codigo: item.CO_DESCRITOR, disc: item.DS_DISCIPLINA, pct: item.pct, desc: item.descricao });
  const criticosCount = descritores.filter(d => d.faixa === 'critico').length;
  return { descritores, kpis: {
    mediaGeral, totalRespostas: totals(rows).TOTAL_RESPOSTAS, totalEstudantes: null,
    totalEscolas: null, totalMunicipios: null,
    totalUFs: ufCount ?? new Set(rows.map(row => row.NM_UF).filter(Boolean)).size,
    totalDescritores: descritores.length,
    correspondenciasPendentes: descritores.filter(d => !d.matriz2001).length,
    topDescritor: describe(descritores[0]), worstDescritor: describe(descritores[descritores.length - 1]),
    criticosCount, criticosPct: 100 * criticosCount / descritores.length,
  } };
}

// Sínteses próprias do dashboard. A chave sempre inclui o componente curricular.
export const GLOBAL_AXES = [
  { name: 'Leitura &\nInferência (LP)', disc: 'Língua Portuguesa', codes: ['D1','D3','D4','D6','D14','D2','D7','D8','D9','D10','D11','D15'] },
  { name: 'Análise\nTextual (LP)', disc: 'Língua Portuguesa', codes: ['D5','D12','D13','D16','D17','D18','D19','D20','D21'] },
  { name: 'Espaço &\nMedidas (MT)', disc: 'Matemática', codes: Array.from({length: 15}, (_, i) => `D${i+1}`) },
  { name: 'Números &\nÁlgebra (MT)', disc: 'Matemática', codes: Array.from({length: 20}, (_, i) => `D${i+16}`) },
  { name: 'Estatística &\nDados (MT)', disc: 'Matemática', codes: ['D36','D37'] },
];

export function axisRate(items: DescritorItem[], disc: string, codes: string[], metric: MetricaAcerto) {
  return rate(items.filter(item => item.DS_DISCIPLINA === disc && item.matriz2001 && codes.includes(item.CO_DESCRITOR)), metric);
}
