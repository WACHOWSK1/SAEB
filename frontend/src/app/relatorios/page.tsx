'use client';

import React, { useState } from 'react';
import { Layout, Card, Button, Row, Col, Space, Divider } from 'antd';
import { FilePdfOutlined, FileExcelOutlined, FileTextOutlined, PictureOutlined } from '@ant-design/icons';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { SaebFilterState } from '../../types/saeb';

const { Content } = Layout;

export default function RelatoriosPage() {
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

  return (
    <Layout className="min-h-screen">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout>
        <Header
          title="Central de Relatórios e Exportações"
          filters={filters}
          onFilterChange={(u) => setFilters((p) => ({ ...p, ...u }))}
          onResetFilters={() => setFilters({ componente: 'Todos', uf: 'Brasil (Todos)', municipio: 'Todos', escola: 'Todas', rede: 'Todas', localizacao: 'Todas', metrica: 'ponderado', search: '' })}
          onExport={() => alert('Exportando relatório geral...')}
        />

        <Content className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          <Card className="bg-white border-[#E4E4E4] rounded-xl shadow-2xs" title={<span className="font-extrabold text-[#202124]">Exportar Recorte Atual (SAEB 2023 · 9º Ano EF)</span>}>
            <p className="text-xs text-[#5F6368] mb-6">
              Gere relatórios institucionais completos contendo metadados oficiais, filtros aplicados, metodologia e carimbo de data.
            </p>

            <Row gutter={[16, 16]}>
              <Col span={24} md={6}>
                <div className="p-4 border border-[#E4E4E4] rounded-xl bg-[#FAFAFA] text-center space-y-3">
                  <FilePdfOutlined className="text-4xl text-[#D32F2F]" />
                  <h4 className="font-bold text-[#202124] text-sm m-0">Relatório Executivo PDF</h4>
                  <p className="text-xs text-[#5F6368] m-0">Documento formatado para impressão com gráficos e KPIs</p>
                  <Button type="primary" danger className="w-full text-xs font-bold" onClick={() => alert('Download do PDF iniciado!')}>
                    Baixar PDF
                  </Button>
                </div>
              </Col>

              <Col span={24} md={6}>
                <div className="p-4 border border-[#E4E4E4] rounded-xl bg-[#FAFAFA] text-center space-y-3">
                  <FileExcelOutlined className="text-4xl text-[#388E3C]" />
                  <h4 className="font-bold text-[#202124] text-sm m-0">Planilha Completa XLSX</h4>
                  <p className="text-xs text-[#5F6368] m-0">Planilha Excel contendo microdados agregados e agrupamentos</p>
                  <Button className="w-full text-xs font-bold border-[#388E3C] text-[#388E3C]" onClick={() => alert('Download do XLSX iniciado!')}>
                    Baixar XLSX
                  </Button>
                </div>
              </Col>

              <Col span={24} md={6}>
                <div className="p-4 border border-[#E4E4E4] rounded-xl bg-[#FAFAFA] text-center space-y-3">
                  <FileTextOutlined className="text-4xl text-[#1976D2]" />
                  <h4 className="font-bold text-[#202124] text-sm m-0">Microdados CSV (UTF-8)</h4>
                  <p className="text-xs text-[#5F6368] m-0">Tabela separada por ponto e vírgula com acentuação correta</p>
                  <Button className="w-full text-xs font-bold border-[#1976D2] text-[#1976D2]" onClick={() => (window.location.href = 'http://localhost:8000/api/export')}>
                    Baixar CSV
                  </Button>
                </div>
              </Col>

              <Col span={24} md={6}>
                <div className="p-4 border border-[#E4E4E4] rounded-xl bg-[#FAFAFA] text-center space-y-3">
                  <PictureOutlined className="text-4xl text-[#FFCC00]" />
                  <h4 className="font-bold text-[#202124] text-sm m-0">Pacote de Imagens ECharts</h4>
                  <p className="text-xs text-[#5F6368] m-0">Exportação em alta resolução (PNG) dos gráficos e rankings</p>
                  <Button className="w-full text-xs font-bold bg-[#FFCC00] text-black border-0 hover:bg-[#D9AD00]" onClick={() => alert('Pacote de imagens gerado!')}>
                    Baixar Gráficos
                  </Button>
                </div>
              </Col>
            </Row>

            <Divider className="my-6" />

            <div className="bg-[#FAFAFA] p-4 rounded-xl border border-[#E4E4E4] text-xs text-[#5F6368] space-y-1">
              <p className="font-bold text-[#202124] m-0">Informações Obrigatórias Incluídas nos Relatórios Exportados:</p>
              <p className="m-0">• Fonte Oficial: Microdados SAEB 2023 / INEP / MEC</p>
              <p className="m-0">• Escopo da Amostra: 9º Ano do Ensino Fundamental (Língua Portuguesa e Matemática)</p>
              <p className="m-0">• Metodologia: Taxas de acerto ponderadas via peso amostral `PESO_ALUNO`</p>
              <p className="m-0">• Restrição: Não contém comparações temporais com edições anteriores (2021/2019)</p>
            </div>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}
