'use client';

import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
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
import { AnalyticsTable } from '../components/tables/AnalyticsTable';
import { SaebFilterState, SaebKpiData, DescritorItem, DEFAULT_THRESHOLDS } from '../types/saeb';
import { fetchSaebDescritores } from '../services/api';

const { Content } = Layout;

export default function VisaoGeralPage() {
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
      const res = await fetchSaebDescritores(filters, DEFAULT_THRESHOLDS);
      setKpiData(res.kpis);
      setDescritores(res.descritores);
      setLoading(false);
    }
    load();
  }, [filters]);

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

          {/* KPI Cards Grid: 3 in top row, 3 in bottom row with exact same vertical gap (gap-4) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* ROW 1 */}
            <KpiCard
              title="Média Geral de Acerto"
              value={`${kpiData?.mediaGeral.toFixed(1) || '--'}%`}
              subtitle={`${kpiData?.totalDescritores || 0} habilidades avaliadas`}
              tooltipText="Percentual médio ponderado de acertos calculado com base nos pesos amostrais dos estudantes do 9º ano EF no SAEB 2023."
              statusBorderColor="#FFCC00"
              accentColor="#202124"
              icon={<PercentageOutlined />}
            />

            <KpiCard
              title="Estudantes Avaliados"
              value={(kpiData?.totalEstudantes || 0).toLocaleString('pt-BR')}
              subtitle="Estudantes no recorte selecionado"
              tooltipText="Número total de estudantes do 9º ano do Ensino Fundamental que participaram da avaliação no recorte selecionado."
              statusBorderColor="#202124"
              accentColor="#202124"
              icon={<UserOutlined />}
            />

            <KpiCard
              title="Descritores em Nível Crítico"
              value={`${kpiData?.criticosCount || 0}`}
              subtitle={`${kpiData?.criticosPct.toFixed(1) || '0'}% do total de habilidades`}
              tooltipText="Quantidade de descritores com taxa de acerto ponderado inferior a 40%, exigindo intervenção pedagógica prioritária."
              statusBorderColor="#D32F2F"
              accentColor="#D32F2F"
              icon={<WarningOutlined />}
            />

            {/* ROW 2 */}
            <KpiCard
              title="UFs Analisadas"
              value="27"
              subtitle="Todas as unidades federativas"
              tooltipText="Total de unidades federativas com registros válidos nos microdados SAEB 2023 para o 9º ano."
              statusBorderColor="#202124"
              accentColor="#202124"
              icon={<GlobalOutlined />}
            />

            <KpiCard
              title="Ponto Forte (Maior Taxa)"
              value={`${kpiData?.topDescritor.pct.toFixed(1) || '--'}%`}
              subtitle={`${kpiData?.topDescritor.codigo || '--'} · ${kpiData?.topDescritor.disc || ''}`}
              tooltipText="Descritor com a maior taxa percentual de acerto entre os estudantes no recorte selecionado."
              statusBorderColor="#388E3C"
              accentColor="#388E3C"
              icon={<TrophyOutlined />}
            />

            <KpiCard
              title="Ponto Crítico (Menor Taxa)"
              value={`${kpiData?.worstDescritor.pct.toFixed(1) || '--'}%`}
              subtitle={`${kpiData?.worstDescritor.codigo || '--'} · ${kpiData?.worstDescritor.disc || ''}`}
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
                thresholds={DEFAULT_THRESHOLDS}
              />
            </div>
            <div>
              <DistributionDonutChart
                items={filteredDescritores}
                thresholds={DEFAULT_THRESHOLDS}
              />
            </div>
          </div>

          {/* TanStack Analytics Table */}
          <AnalyticsTable
            data={filteredDescritores}
            thresholds={DEFAULT_THRESHOLDS}
            onSelectDescritor={(code) => (window.location.href = `/descritores?code=${code}`)}
          />
        </Content>
      </Layout>
    </Layout>
  );
}
