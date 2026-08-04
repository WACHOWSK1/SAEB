'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Card, Table, Tag, Statistic } from 'antd';
import ReactECharts from 'echarts-for-react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { FilterBar } from '../../components/layout/FilterBar';
import { SaebFilterState, UfPerformanceItem } from '../../types/saeb';
import { fetchSaebUfs } from '../../services/api';

const { Content } = Layout;

export default function TerritorialPage() {
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

  const [ufData, setUfData] = useState<{ mediaBr: number; ufs: UfPerformanceItem[] }>({ mediaBr: 46.8, ufs: [] });

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
      const res = await fetchSaebUfs(filters);
      setUfData(res);
    }
    load();
  }, [filters]);

  const sortedUfs = [...ufData.ufs].sort((a, b) => b.pct - a.pct);
  const topUf = sortedUfs[0] || { NM_UF: 'Paraná', pct: 52.5 };
  const worstUf = sortedUfs[sortedUfs.length - 1] || { NM_UF: 'Roraima', pct: 34.6 };

  // Apache ECharts State Bar Chart with National Benchmark Line
  const barOption = {
    title: {
      text: `Desempenho por Estado (UF) vs Média Nacional (${filters.anoEscolar || '9º Ano EF'} · ${ufData.mediaBr.toFixed(1)}%)`,
      textStyle: { fontSize: 13, fontWeight: 'bold', color: '#202124', fontFamily: 'Inter' },
      left: 10,
      top: 5,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const item = params[0];
        const diff = item.value - ufData.mediaBr;
        const diffText = diff >= 0 ? `+${diff.toFixed(1)} pp vs Brasil` : `${diff.toFixed(1)} pp vs Brasil`;
        return `
          <div style="font-family: Inter; font-size: 12px; padding: 4px;">
            <b>${item.name}</b><br/>
            Taxa de Acerto Média: <b>${item.value.toFixed(1)}%</b><br/>
            Comparativo Nacional: <b>${diffText}</b>
          </div>
        `;
      },
    },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '50px', containLabel: true },
    xAxis: {
      type: 'category',
      data: sortedUfs.map(u => u.NM_UF),
      axisLabel: { rotate: 45, fontFamily: 'Inter', fontSize: 10, color: '#202124' },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      min: Math.max(0, Math.floor(Math.min(...sortedUfs.map(u => u.pct), ufData.mediaBr) - 5)),
      max: Math.min(100, Math.ceil(Math.max(...sortedUfs.map(u => u.pct), ufData.mediaBr) + 5)),
      axisLabel: { formatter: '{value}%', fontFamily: 'Inter', fontSize: 11 },
      splitLine: { lineStyle: { color: '#E4E4E4', type: 'dashed' } }
    },
    series: [
      {
        name: 'Taxa de Acerto (%)',
        type: 'bar',
        barWidth: 16,
        data: sortedUfs.map(u => ({
          value: u.pct,
          itemStyle: {
            color: u.pct >= ufData.mediaBr ? '#388E3C' : '#F57C00',
            borderRadius: [4, 4, 0, 0]
          }
        })),
        markLine: {
          symbol: 'none',
          data: [
            {
              yAxis: ufData.mediaBr,
              name: 'Média Brasil',
              lineStyle: { color: '#FFCC00', width: 2, type: 'solid' },
              label: { formatter: `Média Brasil: ${ufData.mediaBr.toFixed(1)}%`, position: 'insideEndTop', color: '#202124', fontWeight: 'bold' }
            }
          ]
        }
      }
    ]
  };

  const columns = [
    {
      title: 'Posição',
      key: 'pos',
      width: 80,
      render: (_: any, __: any, index: number) => <span className="font-extrabold text-xs text-gray-500">{index + 1}º</span>,
    },
    {
      title: 'Estado (UF)',
      dataIndex: 'NM_UF',
      key: 'NM_UF',
      render: (v: string) => <span className="font-extrabold text-xs text-[#202124]">{v}</span>
    },
    {
      title: 'Taxa Média de Acerto (%)',
      dataIndex: 'pct',
      key: 'pct',
      render: (v: number) => <span className="font-mono font-black text-xs text-[#202124]">{v.toFixed(1)}%</span>
    },
    {
      title: `Diferença vs Média Brasil (${ufData.mediaBr.toFixed(1)}%)`,
      key: 'diff',
      render: (_: any, r: UfPerformanceItem) => {
        const diff = r.pct - ufData.mediaBr;
        return (
          <span className={`font-mono font-bold text-xs ${diff >= 0 ? 'text-[#388E3C]' : 'text-[#D32F2F]'}`}>
            {diff >= 0 ? `+${diff.toFixed(1)} pp` : `${diff.toFixed(1)} pp`}
          </span>
        );
      }
    },
    {
      title: 'Situação Relativa',
      key: 'status',
      render: (_: any, r: UfPerformanceItem) => {
        const isAbove = r.pct >= ufData.mediaBr;
        return (
          <Tag color={isAbove ? 'green' : 'orange'} className="font-bold text-xs">
            {isAbove ? 'Acima da Média Nacional' : 'Abaixo da Média Nacional'}
          </Tag>
        );
      }
    },
    {
      title: 'Total de Respostas',
      dataIndex: 'TOTAL_RESPOSTAS',
      key: 'TOTAL_RESPOSTAS',
      render: (v: number) => <span className="font-mono text-gray-600 text-xs">{v ? v.toLocaleString('pt-BR') : '--'}</span>
    },
  ];

  return (
    <Layout className="min-h-screen bg-[#F5F5F5] flex flex-row">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout className="bg-[#F5F5F5] flex-1 min-w-0">
        <Header
          title="Análise Territorial das Unidades da Federação"
          filters={filters}
          onFilterChange={(u) => setFilters((p) => ({ ...p, ...u }))}
          onResetFilters={() => setFilters({ anoEscolar: '9º Ano EF', componente: 'Todos', uf: 'Brasil (Todos)', municipio: 'Todos', escola: 'Todas', rede: 'Todas', localizacao: 'Todas', metrica: 'ponderado', search: '' })}
        />

        <Content className="p-6 space-y-4 max-w-7xl mx-auto w-full">
          {/* Filter Bar */}
          <div className="mb-4">
            <FilterBar filters={filters} onFilterChange={(u) => setFilters((p) => ({ ...p, ...u }))} ufsList={ufsList} />
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white border-[#E4E4E4] rounded-xl shadow-2xs">
              <Statistic
                title={<span className="text-xs font-bold text-[#5F6368] uppercase">Média Nacional - {filters.anoEscolar || '9º Ano EF'}</span>}
                value={ufData.mediaBr.toFixed(1)}
                suffix="%"
                styles={{ content: { color: '#FFCC00', fontWeight: 900, fontSize: '28px' } }}
              />
              <p className="text-xs text-[#5F6368] m-0 mt-1">27 Unidades da Federação avaliadas</p>
            </Card>

            <Card className="bg-white border-[#E4E4E4] rounded-xl shadow-2xs">
              <Statistic
                title={<span className="text-xs font-bold text-[#5F6368] uppercase">Estado com Maior Acerto</span>}
                value={topUf.pct.toFixed(1)}
                suffix="%"
                styles={{ content: { color: '#388E3C', fontWeight: 900, fontSize: '28px' } }}
              />
              <p className="text-xs font-bold text-[#202124] m-0 mt-1">{topUf.NM_UF}</p>
            </Card>

            <Card className="bg-white border-[#E4E4E4] rounded-xl shadow-2xs">
              <Statistic
                title={<span className="text-xs font-bold text-[#5F6368] uppercase">Estado com Menor Acerto</span>}
                value={worstUf.pct.toFixed(1)}
                suffix="%"
                styles={{ content: { color: '#D32F2F', fontWeight: 900, fontSize: '28px' } }}
              />
              <p className="text-xs font-bold text-[#202124] m-0 mt-1">{worstUf.NM_UF}</p>
            </Card>
          </div>

          {/* Clean State Performance Bar Chart */}
          <Card className="bg-white border-[#E4E4E4] rounded-xl shadow-2xs p-2">
            <ReactECharts option={barOption} style={{ height: '420px', width: '100%' }} opts={{ renderer: 'canvas' }} />
          </Card>

          {/* Full State Table */}
          <Card className="bg-white border-[#E4E4E4] rounded-xl shadow-2xs" title={<span className="font-extrabold text-[#202124]">Ranking Territorial Completo de todas as 27 UFs ({filters.anoEscolar || '9º Ano EF'} · SAEB 2023)</span>}>
            <Table
              dataSource={sortedUfs}
              columns={columns}
              rowKey="NM_UF"
              pagination={{ pageSize: 27 }}
              size="small"
            />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}
