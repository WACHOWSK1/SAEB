'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Card, Tag, Select, Row, Col, Alert, Descriptions, Statistic, Progress, Empty } from 'antd';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { SaebFilterState, DescritorItem, DEFAULT_THRESHOLDS } from '../../types/saeb';
import { fetchSaebDescritores, classifyPerformance } from '../../services/api';

const { Content } = Layout;

export default function DescritoresPage() {
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

  const [descritores, setDescritores] = useState<DescritorItem[]>([]);
  const [loading, setLoading] = useState(true);
  // Armazenar código+disciplina para identificação única
  const [selectedKey, setSelectedKey] = useState<string>('D14|Língua Portuguesa');

  const makeKey = (code: string, disc: string) => `${code}|${disc}`;

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetchSaebDescritores(filters, DEFAULT_THRESHOLDS);
      setDescritores(res.descritores);
      // Se o descritor selecionado não existe no novo resultado, selecionar o primeiro
      if (res.descritores.length > 0) {
        const exists = res.descritores.some(d => makeKey(d.CO_DESCRITOR, d.DS_DISCIPLINA) === selectedKey);
        if (!exists) {
          setSelectedKey(makeKey(res.descritores[0].CO_DESCRITOR, res.descritores[0].DS_DISCIPLINA));
        }
      }
      setLoading(false);
    }
    load();
  }, [filters]);

  const currentItem = descritores.find((d) => makeKey(d.CO_DESCRITOR, d.DS_DISCIPLINA) === selectedKey) || descritores[0];
  const perf = currentItem ? classifyPerformance(currentItem.pct, DEFAULT_THRESHOLDS) : classifyPerformance(40.2);

  // Position in ranking
  const sortedDesc = [...descritores].sort((a, b) => b.pct - a.pct);
  const rankPos = currentItem ? sortedDesc.findIndex((d) => d.CO_DESCRITOR === currentItem.CO_DESCRITOR && d.DS_DISCIPLINA === currentItem.DS_DISCIPLINA) + 1 : 1;

  const isEmpty = !loading && descritores.length === 0;

  return (
    <Layout className="min-h-screen">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout>
        <Header
          title="Análise Detalhada dos Descritores"
          filters={filters}
          onFilterChange={(u) => setFilters((p) => ({ ...p, ...u }))}
          onResetFilters={() => setFilters({ anoEscolar: '9º Ano EF', componente: 'Todos', uf: 'Brasil (Todos)', municipio: 'Todos', escola: 'Todas', rede: 'Todas', localizacao: 'Todas', metrica: 'ponderado', search: '' })}
          onExport={() => alert('Exportando relatório do descritor...')}
        />

        <Content className="p-6 space-y-6 max-w-7xl mx-auto w-full">

          {/* Indicador de carregamento sutil */}
          {loading && (
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#FFCC00] rounded-full" style={{ animation: 'loading-bar 1.2s ease-in-out infinite' }} />
            </div>
          )}
          <style jsx>{`
            @keyframes loading-bar {
              0% { width: 10%; margin-left: 0; }
              50% { width: 60%; margin-left: 20%; }
              100% { width: 10%; margin-left: 90%; }
            }
          `}</style>
          {/* Empty State */}
          {isEmpty && (
            <Alert
              message="Nenhum dado disponível para o recorte selecionado"
              description={`Não foram encontrados descritores para os filtros: ${filters.anoEscolar} · ${filters.componente} · ${filters.uf} · Rede: ${filters.rede}. Tente ajustar os filtros.`}
              type="warning"
              showIcon
              className="border-yellow-400 bg-amber-50 rounded-xl"
            />
          )}

          {/* Conteúdo — só exibe quando tem dados */}
          {descritores.length > 0 && (
            <div className={loading ? 'opacity-50 pointer-events-none transition-opacity duration-300' : 'transition-opacity duration-300'}>
              {/* Descritor Selector Bar */}
              <Card className="bg-white border-[#E4E4E4] rounded-xl shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5F6368] uppercase tracking-wider mb-1">
                      Selecionar Descritor para Análise Profunda (9º Ano EF · SAEB 2023)
                    </label>
                    <Select
                      showSearch
                      value={selectedKey}
                      onChange={setSelectedKey}
                      className="w-80 font-bold"
                      options={descritores.map((d) => ({
                        value: makeKey(d.CO_DESCRITOR, d.DS_DISCIPLINA),
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
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}

