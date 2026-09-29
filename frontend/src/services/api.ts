import { SaebFilterState, EquityGapItem, UfPerformanceItem, PerformanceThresholds, DEFAULT_THRESHOLDS } from '../types/saeb';
import { filterRows, rate, summarize, totals, StaticDataset } from './calculations';
export { classifyPerformance } from './calculations';

// Todas as telas usam a mesma versão do agregado publicado com o site.
let datasetPromise: Promise<StaticDataset> | undefined;

async function dataset(): Promise<StaticDataset> {
  if (!datasetPromise) datasetPromise = fetch('/data/saeb-2023-9ef.json')
    .then(async response => {
      if (!response.ok) throw new Error('Base agregada indisponível');
      const data: StaticDataset = await response.json();
      if (data.schemaVersion !== 1 || data.year !== 2023 || data.schoolYear !== '9º Ano EF' || !Array.isArray(data.rows)) throw new Error('Base incompatível');
      return data;
    }).catch(error => { datasetPromise = undefined; throw error; });
  return datasetPromise;
}

export async function fetchSaebDescritores(filters: SaebFilterState, thresholds: PerformanceThresholds = DEFAULT_THRESHOLDS) {
  try {
    const data = await dataset();
    return summarize(filterRows(data.rows, filters), data.catalog, filters.metrica, thresholds);
  } catch (error) {
    console.error('Dados do SAEB indisponíveis:', error);
    return { kpis: null, descritores: [] };
  }
}

export async function fetchSaebUfs(filters: SaebFilterState): Promise<{ mediaBr: number; ufs: UfPerformanceItem[] }> {
  try {
    const data = await dataset();
    const rows = filterRows(data.rows, { ...filters, uf: 'Brasil (Todos)' });
    const ufs: UfPerformanceItem[] = [];
    for (const uf of new Set(rows.map(row => row.NM_UF))) {
      const group = rows.filter(row => row.NM_UF === uf);
      const pct = rate(group, filters.metrica);
      if (uf && pct !== null) ufs.push({ NM_UF: uf, pct, TOTAL_RESPOSTAS: totals(group).TOTAL_RESPOSTAS });
    }
    return { mediaBr: rate(rows, filters.metrica) ?? 0, ufs: ufs.sort((a,b) => b.pct-a.pct) };
  } catch (error) {
    console.error('Dados territoriais indisponíveis:', error);
    return { mediaBr: 0, ufs: [] };
  }
}

export async function fetchSaebEquidade(filters: SaebFilterState): Promise<{ avgGap: number; items: EquityGapItem[] }> {
  try {
    const data = await dataset();
    const all = filterRows(data.rows, { ...filters, rede: 'Todas' });
    const publicItems = summarize(all.filter(row => row.TP_REDE === 'Pública'), data.catalog, filters.metrica).descritores;
    const privateItems = summarize(all.filter(row => row.TP_REDE === 'Privada'), data.catalog, filters.metrica).descritores;
    const items: EquityGapItem[] = [];
    for (const pub of publicItems) {
      const priv = privateItems.find(item => item.CO_DESCRITOR === pub.CO_DESCRITOR && item.DS_DISCIPLINA === pub.DS_DISCIPLINA);
      if (priv) items.push({ CO_DESCRITOR: pub.CO_DESCRITOR, DS_DISCIPLINA: pub.DS_DISCIPLINA, descricao: pub.descricao, Pública: pub.pct, Privada: priv.pct, gap: priv.pct - pub.pct });
    }
    return { avgGap: items.length ? items.reduce((sum, item) => sum + item.gap, 0) / items.length : 0, items: items.sort((a,b) => b.gap-a.gap) };
  } catch (error) {
    console.error('Comparação entre redes indisponível:', error);
    return { avgGap: 0, items: [] };
  }
}
