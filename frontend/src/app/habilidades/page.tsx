'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Card, Tag, Input, Radio, Table, Badge, Space } from 'antd';
import { SearchOutlined, BulbOutlined } from '@ant-design/icons';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { SaebFilterState, DescritorItem, DEFAULT_THRESHOLDS } from '../../types/saeb';
import { fetchSaebDescritores, classifyPerformance } from '../../services/api';

const { Content } = Layout;

export default function HabilidadesPage() {
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

  const [descritores, setDescritores] = useState<DescritorItem[]>([]);
  const [activeDisc, setActiveDisc] = useState<'Todos' | 'Língua Portuguesa' | 'Matemática'>('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function load() {
      const res = await fetchSaebDescritores(filters, DEFAULT_THRESHOLDS);
      setDescritores(res.descritores);
    }
    load();
  }, [filters]);

  const filtered = descritores.filter((item) => {
    const matchDisc = activeDisc === 'Todos' || item.DS_DISCIPLINA === activeDisc;
    const matchSearch = !searchTerm || (
      item.CO_DESCRITOR.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchDisc && matchSearch;
  });

  const columns = [
    {
      title: 'Código',
      dataIndex: 'CO_DESCRITOR',
      key: 'CO_DESCRITOR',
      width: 100,
      render: (code: string) => (
        <Tag color="gold" className="font-extrabold text-black text-xs px-2 py-0.5 border-gold-400">
          {code}
        </Tag>
      ),
    },
    {
      title: 'Componente Curricular',
      dataIndex: 'DS_DISCIPLINA',
      key: 'DS_DISCIPLINA',
      width: 180,
      render: (disc: string) => (
        <span className={`font-bold text-xs ${disc === 'Língua Portuguesa' ? 'text-blue-700' : 'text-[#D9AD00]'}`}>
          {disc}
        </span>
      ),
    },
    {
      title: 'Descrição Oficial da Habilidade (Matriz SAEB 2023 / BNCC)',
      dataIndex: 'descricao',
      key: 'descricao',
      render: (desc: string) => (
        <span className="text-xs text-[#202124] font-medium leading-relaxed">
          {desc}
        </span>
      ),
    },
    {
      title: 'Taxa de Acerto',
      dataIndex: 'pct',
      key: 'pct',
      width: 120,
      sorter: (a: DescritorItem, b: DescritorItem) => a.pct - b.pct,
      render: (pct: number) => (
        <span className="font-mono font-black text-xs text-[#202124]">
          {pct.toFixed(1)}%
        </span>
      ),
    },
    {
      title: 'Nível de Aprendizagem',
      key: 'nivel',
      width: 160,
      render: (_: any, record: DescritorItem) => {
        const perf = classifyPerformance(record.pct, DEFAULT_THRESHOLDS);
        return (
          <Tag
            style={{
              backgroundColor: perf.badgeBg,
              color: perf.textColor,
              borderColor: perf.color,
              fontWeight: 800,
              padding: '2px 8px',
            }}
          >
            ● {perf.label}
          </Tag>
        );
      },
    },
  ];

  return (
    <Layout className="min-h-screen bg-[#F5F5F5] flex flex-row">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout className="bg-[#F5F5F5] flex-1">
        <Header
          title="Matriz de Habilidades e Descritores · SAEB 2023"
          filters={filters}
          onFilterChange={(u) => setFilters((p) => ({ ...p, ...u }))}
          onResetFilters={() => setFilters({ componente: 'Todos', uf: 'Brasil (Todos)', municipio: 'Todos', escola: 'Todas', rede: 'Todas', localizacao: 'Todas', metrica: 'ponderado', search: '' })}
          onExport={() => alert('Exportando catálogo de habilidades...')}
        />

        <Content className="p-6 space-y-4 max-w-7xl mx-auto w-full">
          {/* Controls Card */}
          <Card className="bg-white border-[#E4E4E4] rounded-xl shadow-2xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-extrabold text-[#202124] m-0 flex items-center gap-2">
                  <BulbOutlined className="text-[#FFCC00]" />
                  Catálogo Completo das Habilidades Avaliadas (9º Ano EF)
                </h2>
                <p className="text-xs text-[#5F6368] m-0 mt-1">
                  Exibindo todas as {filtered.length} habilidades oficiais da Matriz de Referência do SAEB 2023.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Radio.Group
                  value={activeDisc}
                  onChange={(e) => setActiveDisc(e.target.value)}
                  buttonStyle="solid"
                  className="font-bold text-xs"
                >
                  <Radio.Button value="Todos">Todos ({descritores.length})</Radio.Button>
                  <Radio.Button value="Língua Portuguesa">Português (24)</Radio.Button>
                  <Radio.Button value="Matemática">Matemática (44)</Radio.Button>
                </Radio.Group>

                <Input
                  placeholder="Buscar habilidade..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-56 text-xs font-medium"
                  allowClear
                />
              </div>
            </div>
          </Card>

          {/* Catalog Table */}
          <Card className="bg-white border-[#E4E4E4] rounded-xl shadow-2xs" bodyStyle={{ padding: 0 }}>
            <Table
              dataSource={filtered}
              columns={columns}
              rowKey={(r) => r.CO_DESCRITOR + r.DS_DISCIPLINA}
              pagination={{ pageSize: 15, showSizeChanger: true, pageSizeOptions: ['15', '30', '68'] }}
              size="middle"
              className="text-xs"
            />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}
