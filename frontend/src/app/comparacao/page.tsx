'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Alert, Select, Table, Tag } from 'antd';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { SaebFilterState, EquityGapItem, DEFAULT_THRESHOLDS } from '../../types/saeb';
import { fetchSaebEquidade } from '../../services/api';

const { Content } = Layout;

export default function ComparacaoPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [filters, setFilters] = useState<SaebFilterState>({
    componente: 'Todos',
    uf: 'Brasil (Todos)',
    municipio: 'Todos',
    escola: 'Todas',
    rede: 'Todas',
    localizacao: 'Todas',
    metrica: 'ponderado',
    search: '',
  });

  const [equidadeData, setEquidadeData] = useState<{ avgGap: number; items: EquityGapItem[] }>({ avgGap: 19.4, items: [] });

  useEffect(() => {
    async function load() {
      const res = await fetchSaebEquidade(filters);
      setEquidadeData(res);
    }
    load();
  }, [filters]);

  const columns = [
    {
      title: 'Disciplina',
      dataIndex: 'DS_DISCIPLINA',
      key: 'DS_DISCIPLINA',
      render: (v: string) => <span className="font-extrabold text-[#202124]">{v}</span>,
    },
    {
      title: 'Código',
      dataIndex: 'CO_DESCRITOR',
      key: 'CO_DESCRITOR',
      render: (v: string) => <Tag color="gold" className="font-black text-black">{v}</Tag>,
    },
    {
      title: 'Habilidade',
      dataIndex: 'descricao',
      key: 'descricao',
      render: (v: string) => <span className="text-xs text-[#202124]">{v}</span>,
    },
    {
      title: 'Rede Pública (%)',
      dataIndex: 'Pública',
      key: 'Pública',
      render: (v: number) => <span className="font-mono text-[#202124] font-bold">{v ? v.toFixed(1) + '%' : '--'}</span>,
    },
    {
      title: 'Rede Privada (%)',
      dataIndex: 'Privada',
      key: 'Privada',
      render: (v: number) => <span className="font-mono text-[#202124] font-bold">{v ? v.toFixed(1) + '%' : '--'}</span>,
    },
    {
      title: 'Gap (Privada - Pública)',
      dataIndex: 'gap',
      key: 'gap',
      render: (v: number) => (
        <span className={`font-mono font-black ${v >= 0 ? 'text-[#388E3C]' : 'text-[#D32F2F]'}`}>
          {v >= 0 ? `+${v.toFixed(1)} pp` : `${v.toFixed(1)} pp`}
        </span>
      ),
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout>
        <Header
          title="Comparações Internas (SAEB 2023)"
          filters={filters}
          onFilterChange={(u) => setFilters((p) => ({ ...p, ...u }))}
          onResetFilters={() => setFilters({ componente: 'Todos', uf: 'Brasil (Todos)', municipio: 'Todos', escola: 'Todas', rede: 'Todas', localizacao: 'Todas', metrica: 'ponderado', search: '' })}
          onExport={() => alert('Exportando comparações...')}
        />

        <Content className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          <Alert
            message="Regra de Comparação Estrita (SAEB 2023)"
            description="Como os dados abrangem exclusivamente a edição de 2023 para o 9º ano EF, todas as comparações exibidas são estritamente internas (ex: Rede Pública vs Privada no mesmo ano de 2023, Estado vs Média Nacional 2023). Não são exibidas séries históricas ou comparações temporais."
            type="info"
            showIcon
            className="border-blue-200 bg-blue-50 rounded-xl"
          />

          <Row gutter={[16, 16]}>
            <Col span={24} md={8}>
              <Card className="bg-white border-[#E4E4E4] rounded-xl shadow-2xs">
                <span className="text-xs font-bold text-[#5F6368] uppercase">Desigualdade Média (Gap Privada vs Pública)</span>
                <h2 className="text-3xl font-black text-[#202124] mt-2 mb-0">+{equidadeData.avgGap.toFixed(1)} pp</h2>
                <p className="text-xs text-[#5F6368] mt-1 m-0">Vantagem média em pontos percentuais da Rede Privada no SAEB 2023</p>
              </Card>
            </Col>
            <Col span={24} md={16}>
              <Card className="bg-white border-[#E4E4E4] rounded-xl shadow-2xs">
                <span className="text-xs font-bold text-[#5F6368] uppercase">Nota Metodológica sobre Equidade</span>
                <p className="text-xs text-[#202124] mt-2 m-0 leading-relaxed">
                  O Gap em pontos percentuais representa a diferença direta de acertos entre os estudantes da Rede Privada e da Rede Pública. Esta métrica possibilita identificar habilidades com maior assimetria de aprendizado sem necessidade de dados temporais.
                </p>
              </Card>
            </Col>
          </Row>

          <Card className="bg-white border-[#E4E4E4] rounded-xl shadow-2xs" title={<span className="font-extrabold text-[#202124]">Comparativo por Habilidade: Rede Pública vs Rede Privada (2023)</span>}>
            <Table
              dataSource={equidadeData.items}
              columns={columns}
              rowKey={(r) => r.CO_DESCRITOR + r.DS_DISCIPLINA}
              pagination={{ pageSize: 12 }}
              size="small"
            />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}
