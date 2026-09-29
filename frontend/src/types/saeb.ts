// Types for SAEB 2023 9º Ano EF Educational Intelligence Platform

export type AnoEscolar = 'Todos' | '2º Ano EF' | '5º Ano EF' | '9º Ano EF' | '3ª/4ª Série EM';
export type ComponenteCurricular = 'Todos' | 'Língua Portuguesa' | 'Matemática';
export type RedeEnsino = 'Todas' | 'Pública' | 'Privada';
export type Localizacao = 'Todas' | 'Urbana' | 'Rural';
export type MetricaAcerto = 'ponderado' | 'simples';

export type PerformanceLevel = 'critico' | 'atencao' | 'intermediario' | 'adequado';

export interface PerformanceThresholds {
  criticoMax: number;      // e.g. < 40.0%
  atencaoMax: number;      // e.g. 40.0% - 50.0%
  intermediarioMax: number; // e.g. 50.0% - 70.0%
}

export const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  criticoMax: 40.0,
  atencaoMax: 50.0,
  intermediarioMax: 70.0,
};

export interface SaebFilterState {
  anoEscolar: AnoEscolar;
  componente: ComponenteCurricular;
  uf: string;
  municipio: string;
  escola: string;
  rede: RedeEnsino;
  localizacao: Localizacao;
  metrica: MetricaAcerto;
  search: string;
}

export interface DescritorItem {
  CO_DESCRITOR: string;
  DS_DISCIPLINA: string;
  descricao: string;
  pct: number;
  pct_simples: number | null;
  pct_ponderado: number | null;
  matriz2001: boolean;
  TOTAL_RESPOSTAS: number;
  TOTAL_ACERTOS: number;
  PESO_TOTAL_RESPOSTAS: number;
  PESO_TOTAL_ACERTOS: number;
  faixa: PerformanceLevel;
  nivelLabel: string;
}

export interface SaebKpiData {
  mediaGeral: number;
  totalEstudantes: number | null;
  totalEscolas: number | null;
  totalMunicipios: number | null;
  totalRespostas: number;
  totalUFs: number;
  correspondenciasPendentes: number;
  totalDescritores: number;
  topDescritor: {
    codigo: string;
    disc: string;
    pct: number;
    desc: string;
  };
  worstDescritor: {
    codigo: string;
    disc: string;
    pct: number;
    desc: string;
  };
  criticosCount: number;
  criticosPct: number;
}

export interface EquityGapItem {
  CO_DESCRITOR: string;
  DS_DISCIPLINA: string;
  descricao: string;
  Pública: number;
  Privada: number;
  gap: number;
}

export interface UfPerformanceItem {
  NM_UF: string;
  pct: number;
  TOTAL_RESPOSTAS: number;
}
