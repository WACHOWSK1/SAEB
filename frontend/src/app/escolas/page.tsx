'use client';

import React, { useState } from 'react';
import { Layout, Card, Alert, Empty } from 'antd';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { SaebFilterState } from '../../types/saeb';

const { Content } = Layout;

export default function EscolasPage() {
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

  return (
    <Layout className="min-h-screen">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout>
        <Header
          title="Análise no Nível de Escolas"
          filters={filters}
          onFilterChange={(u) => setFilters((p) => ({ ...p, ...u }))}
          onResetFilters={() => setFilters({ anoEscolar: '9º Ano EF', componente: 'Todos', uf: 'Brasil (Todos)', municipio: 'Todos', escola: 'Todas', rede: 'Todas', localizacao: 'Todas', metrica: 'ponderado', search: '' })}
          onExport={() => alert('Exportando escolas...')}
        />
        <Content className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          <Alert message="Acesso ao Diagnóstico por Escola (SAEB 2023 · 9º Ano EF)" description="Selecione um Estado e Município no painel superior para filtrar as escolas da sua rede de ensino." type="warning" showIcon className="border-yellow-400 bg-amber-50" />
          <Card className="bg-white border-[#E4E4E4] rounded-xl shadow-2xs">
            <Empty description="Selecione um Município ou Escola específica no filtro de topo para carregar o relatório individual." />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}
