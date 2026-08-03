'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Card, Tag, Select, Row, Col, Alert, Descriptions, Statistic, Progress } from 'antd';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { SaebFilterState, DescritorItem, DEFAULT_THRESHOLDS } from '../../types/saeb';
import { fetchSaebDescritores, classifyPerformance } from '../../services/api';

const { Content } = Layout;

export default function DescritoresPage() {
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
  const [selectedCode, setSelectedCode] = useState<string>('D14');

  useEffect(() => {
    async function load() {
      const res = await fetchSaebDescritores(filters, DEFAULT_THRESHOLDS);
      setDescritores(res.descritores);
      if (res.descritores.length > 0 && !res.descritores.some(d => d.CO_DESCRITOR === selectedCode)) {
        setSelectedCode(res.descritores[0].CO_DESCRITOR);
      }
    }
    load();
  }, [filters]);

  const currentItem = descritores.find((d) => d.CO_DESCRITOR === selectedCode) || descritores[0];
  const perf = currentItem ? classifyPerformance(currentItem.pct, DEFAULT_THRESHOLDS) : classifyPerformance(40.2);

  // Position in ranking
  const sortedDesc = [...descritores].sort((a, b) => b.pct - a.pct);
  const rankPos = currentItem ? sortedDesc.findIndex((d) => d.CO_DESCRITOR === currentItem.CO_DESCRITOR) + 1 : 1;

  return (
    <Layout className="min-h-screen">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout>
        <Header
          title="Análise Detalhada dos Descritores"
          filters={filters}
          onFilterChange={(u) => setFilters((p) => ({ ...p, ...u }))}
          onResetFilters={() => setFilters({ componente: 'Todos', uf: 'Brasil (Todos)', municipio: 'Todos', escola: 'Todas', rede: 'Todas', localizacao: 'Todas', metrica: 'ponderado', search: '' })}
          onExport={() => alert('Exportando relatório do descritor...')}
        />

        <Content className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Descritor Selector Bar */}
          <Card className="bg-white border-[#E4E4E4] rounded-xl shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5F6368] uppercase tracking-wider mb-1">
                  Selecionar Descritor para Análise Profunda (9º Ano EF · SAEB 2023)
                </label>
                <Select
                  showSearch
                  value={selectedCode}
                  onChange={setSelectedCode}
                  className="w-80 font-bold"
                  options={descritores.map((d) => ({
                    value: d.CO_DESCRITOR,
                    label: `${d.CO_DESCRITOR} (${d.DS_DISCIPLINA}) — ${d.descricao.substring(0, 45)}…`,
                  }))}
                />
              </div>
              {currentItem && (
                <div className="flex items-center gap-2">
                  <Tag color="gold" className="text-black font-extrabold text-sm px-3 py-1">
                    {currentItem.CO_DESCRITOR}
                  </Tag>
                  <Tag
                    style={{ backgroundColor: perf.badgeBg, color: perf.textColor, borderColor: perf.color, fontWeight: 800, padding: '4px 12px' }}
                  >
                    ● {perf.label} (Atenção Pedagógica)
                  </Tag>
                </div>
              )}
            </div>
          </Card>

          {currentItem && (
            <Row gutter={[16, 16]}>
              {/* Left Details Card */}
              <Col span={24} lg={16}>
                <Card className="bg-white border-[#E4E4E4] rounded-xl shadow-2xs space-y-4" title={<span className="font-extrabold text-[#202124]">Ficha Técnica da Habilidade</span>}>
                  <Descriptions column={1} bordered size="small" className="bg-[#FAFAFA]">
                    <Descriptions.Item label="Código do Descritor">
                      <span className="font-mono font-bold text-[#202124]">{currentItem.CO_DESCRITOR}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Componente Curricular">
                      <span className="font-bold text-[#202124]">{currentItem.DS_DISCIPLINA}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Descrição Oficial (Matriz SAEB)">
                      <span className="text-[#202124] font-medium">{currentItem.descricao}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="População Analisada">
                      Estudantes do 9º ano do Ensino Fundamental (SAEB 2023)
                    </Descriptions.Item>
                    <Descriptions.Item label="Posição no Ranking Geral">
                      <b>{rankPos}º lugar</b> de {descritores.length} descritores avaliados
                    </Descriptions.Item>
                  </Descriptions>

                  <div className="pt-4 border-t border-[#E4E4E4] space-y-2">
                    <h4 className="text-xs font-bold text-[#5F6368] uppercase tracking-wider m-0">
                      Taxa de Acerto Relativa ao Recorte Selecionado
                    </h4>
                    <Progress
                      percent={parseFloat(currentItem.pct.toFixed(1))}
                      strokeColor={perf.color}
                      strokeWidth={16}
                      format={(percent) => `${percent}% de Acerto`}
                    />
                  </div>

                  <Alert
                    message="Orientação Pedagógica Geral"
                    description="Esta informação é um indicador de diagnóstico agregado do SAEB 2023. As decisões pedagógicas e de intervenção curricular devem ser avaliadas e validadas pela equipe de coordenação e professores da escola."
                    type="info"
                    showIcon
                    className="border-blue-200 bg-blue-50"
                  />
                </Card>
              </Col>

              {/* Right Summary Statistics Card */}
              <Col span={24} lg={8}>
                <Card className="bg-white border-[#E4E4E4] rounded-xl shadow-2xs space-y-4" title={<span className="font-extrabold text-[#202124]">Indicadores Agregados</span>}>
                  <Statistic
                    title="Taxa de Acerto Ponderada"
                    value={currentItem.pct.toFixed(1)}
                    suffix="%"
                    styles={{ content: { color: perf.color, fontWeight: 900, fontSize: '32px' } }}
                  />
                  <hr className="border-[#E4E4E4]" />
                  <Statistic
                    title="Total de Estudantes (Respostas)"
                    value={currentItem.TOTAL_RESPOSTAS}
                    formatter={(val) => Number(val).toLocaleString('pt-BR')}
                    styles={{ content: { color: '#202124', fontWeight: 800 } }}
                  />
                  <hr className="border-[#E4E4E4]" />
                  <Statistic
                    title="Total de Acertos Computados"
                    value={currentItem.TOTAL_ACERTOS}
                    formatter={(val) => Number(val).toLocaleString('pt-BR')}
                    styles={{ content: { color: '#5F6368', fontWeight: 700 } }}
                  />
                </Card>
              </Col>
            </Row>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}
