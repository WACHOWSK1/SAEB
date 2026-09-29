'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Alert } from 'antd';
import {
  PercentageOutlined,
  UserOutlined,
  GlobalOutlined,
  TrophyOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { FilterBar } from '../components/layout/FilterBar';
import { KpiCard } from '../components/kpi/KpiCard';
import { DescriptorRankingChart } from '../components/charts/DescriptorRankingChart';
import { DistributionDonutChart } from '../components/charts/DistributionDonutChart';
import { RadarDimensionsChart } from '../components/charts/RadarDimensionsChart';
import { AnalyticsTable } from '../components/tables/AnalyticsTable';
import { SaebFilterState, SaebKpiData, DescritorItem } from '../types/saeb';
import { fetchSaebDescritores } from '../services/api';

import { useThresholds } from '../services/thresholds';

const { Content } = Layout;

export default function VisaoGeralPage() {
  const thresholds = useThresholds();
  const [collapsed, setCollapsed] = useState(false);
  const [filters, setFilters] = useState<SaebFilterState>({
    anoEscolar: '9º Ano EF',
    componente: 'Todos',
    uf: 'Brasil (Todos)',
    municipio: 'Todos',
    escola: 'Todas',
    rede: 'Todas',
    localizacao: 'Todas',
    metrica: 'ponderado',
    search: '',
  });

  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState<SaebKpiData | null>(null);
  const [descritores, setDescritores] = useState<DescritorItem[]>([]);

  const ufsList = [
    'Brasil (Todos)',
    'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará',
    'Distrito Federal', 'Espírito Santo', 'Goiás', 'Maranhão',
    'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará',
    'Paraíba', 'Paraná', 'Pernambuco', 'Piauí',
    'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul',
    'Rondônia', 'Roraima', 'Santa Catarina', 'São Paulo',
    'Sergipe', 'Tocantins'
  ];

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetchSaebDescritores(filters, thresholds);
      setKpiData(res.kpis);
      setDescritores(res.descritores);
      setLoading(false);
    }
    load();
  }, [filters, thresholds]);

  const handleFilterChange = (updated: Partial<SaebFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      anoEscolar: '9º Ano EF',
      componente: 'Todos',
      uf: 'Brasil (Todos)',
      municipio: 'Todos',
      escola: 'Todas',
      rede: 'Todas',
      localizacao: 'Todas',
      metrica: 'ponderado',
      search: '',
    });
  };

  const filteredDescritores = descritores.filter((item) => {
    if (!filters.search) return true;
    const q = filters.search.toLowerCase();
    return (
      item.CO_DESCRITOR.toLowerCase().includes(q) ||
      item.descricao.toLowerCase().includes(q) ||
      item.DS_DISCIPLINA.toLowerCase().includes(q)
    );
  });

  const hasData = descritores.length > 0 && kpiData !== null;
  const isEmpty = !loading && (descritores.length === 0 || kpiData === null);

  return (
    <Layout className="min-h-screen bg-[#F5F5F5] flex flex-row">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout className="bg-[#F5F5F5] flex-1">
        <Header
          title="Visão Geral · Diagnóstico Pedagógico"
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          onExport={() => alert('Exportando relatório SAEB 2023 em PDF...')}
        />

        <Content className="p-6 space-y-4 max-w-7xl mx-auto w-full">
          {/* Filter Bar */}
          <div className="mb-4">
            <FilterBar filters={filters} onFilterChange={handleFilterChange} ufsList={ufsList} />
          </div>


          {/* Empty State — quando os filtros não retornam dados */}
          {isEmpty && (
            <Alert
              message="Nenhum dado disponível para o recorte selecionado"
              description={`Não foram encontrados registros para os filtros: ${filters.anoEscolar} · ${filters.componente} · ${filters.uf} · Rede: ${filters.rede}. Tente ajustar os filtros ou restaurar os valores padrão.`}
              type="warning"
              showIcon
              className="border-yellow-400 bg-amber-50 rounded-xl"
            />
          )}

          {/* Conteúdo principal — só exibe quando há dados */}
          {hasData && (
            <div className={loading ? 'opacity-50 pointer-events-none transition-opacity duration-300' : 'transition-opacity duration-300'}>
              <Alert type="info" showIcon className="mb-4" title="Leitura dos resultados" description={`${kpiData.totalDescritores} códigos com dados, dos quais ${kpiData.correspondenciasPendentes} adicionais à matriz de 2001. As faixas são critérios próprios do painel. Consulte a nota técnica antes de utilizar os resultados na pesquisa.`} />
              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* ROW 1 */}
                <KpiCard
                  title="Média Geral de Acerto"
                  value={`${kpiData.mediaGeral.toFixed(1)}%`}
                  subtitle={`${kpiData.totalDescritores} habilidades avaliadas`}
                  tooltipText={`Percentual calculado pela razão entre os somatórios da métrica ${filters.metrica === 'ponderado' ? 'ponderada' : 'simples'}.`}
                  statusBorderColor="#FFCC00"
                  accentColor="#202124"
                  icon={<PercentageOutlined />}
                />

                <KpiCard
                  title="Respostas Computadas"
                  value={kpiData.totalRespostas.toLocaleString('pt-BR')}
                  subtitle="Respostas a itens no recorte selecionado"
                  tooltipText="Somatório de respostas computadas aos itens. Um estudante pode contribuir com várias respostas; não é uma contagem de participantes únicos."
                  statusBorderColor="#202124"
                  accentColor="#202124"
                  icon={<UserOutlined />}
                />

                <KpiCard
                  title="Descritores em Nível Crítico"
                  value={`${kpiData.criticosCount}`}
                  subtitle={`${kpiData.criticosPct.toFixed(1)}% do total de habilidades`}
                  tooltipText={`Quantidade de códigos com percentual inferior a ${thresholds.criticoMax}%, na métrica selecionada. Critério próprio do painel.`}
                  statusBorderColor="#D32F2F"
                  accentColor="#D32F2F"
                  icon={<WarningOutlined />}
                />

                {/* ROW 2 */}
                <KpiCard
                  title="UFs Analisadas"
                  value={String(kpiData.totalUFs)}
                  subtitle="UFs com dados no recorte selecionado"
                  tooltipText="Total de unidades federativas com registros válidos nos microdados SAEB 2023 para o 9º ano."
                  statusBorderColor="#202124"
                  accentColor="#202124"
                  icon={<GlobalOutlined />}
                />

                <KpiCard
                  title="Ponto Forte (Maior Taxa)"
                  value={`${kpiData.topDescritor.pct.toFixed(1)}%`}
                  subtitle={`${kpiData.topDescritor.codigo} · ${kpiData.topDescritor.disc}`}
                  tooltipText="Descritor com a maior taxa percentual de acerto entre os estudantes no recorte selecionado."
                  statusBorderColor="#388E3C"
                  accentColor="#388E3C"
                  icon={<TrophyOutlined />}
                />

                <KpiCard
                  title="Ponto Crítico (Menor Taxa)"
                  value={`${kpiData.worstDescritor.pct.toFixed(1)}%`}
                  subtitle={`${kpiData.worstDescritor.codigo} · ${kpiData.worstDescritor.disc}`}
                  tooltipText="Descritor com a menor taxa de acerto, demandando intervenção pedagógica prioritária."
                  statusBorderColor="#D32F2F"
                  accentColor="#D32F2F"
                  icon={<WarningOutlined />}
                />
              </div>

              {/* Visualizations Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
                <div className="lg:col-span-2">
                  <DescriptorRankingChart
                    items={filteredDescritores}
                    title="Ranking Completo de Desempenho dos Descritores (SAEB 2023)"
                    thresholds={thresholds}
                  />
                </div>
                <div>
                  <DistributionDonutChart
                    items={filteredDescritores}
                    thresholds={thresholds}
                  />
                  <RadarDimensionsChart
                    metric={filters.metrica}
                    items={filteredDescritores}
                    title="Desempenho por Eixo Temático"
                  />
                </div>
              </div>

              {/* TanStack Analytics Table */}
              <AnalyticsTable
                data={filteredDescritores}
                thresholds={thresholds}
                onSelectDescritor={(code, disc) => (window.location.href = `/descritores/?code=${encodeURIComponent(code)}&disc=${encodeURIComponent(disc)}`)}
              />
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}
