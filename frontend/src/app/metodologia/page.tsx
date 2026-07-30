'use client';

import React, { useState } from 'react';
import { Layout, Card, InputNumber, Button, Form, Alert, Tag, Divider, Row, Col } from 'antd';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { SaebFilterState, DEFAULT_THRESHOLDS, PerformanceThresholds } from '../../types/saeb';

const { Content } = Layout;

export default function MetodologiaPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [thresholds, setThresholds] = useState<PerformanceThresholds>(DEFAULT_THRESHOLDS);
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

  const handleSaveThresholds = (values: any) => {
    setThresholds({
      criticoMax: values.criticoMax,
      atencaoMax: values.atencaoMax,
      intermediarioMax: values.intermediarioMax,
    });
    alert('Limiares de desempenho atualizados e documentados para esta sessão!');
  };

  return (
    <Layout className="min-h-screen">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout>
        <Header
          title="Metodologia e Dados · Nota Técnica SAEB 2023"
          filters={filters}
          onFilterChange={(u) => setFilters((p) => ({ ...p, ...u }))}
          onResetFilters={() => setFilters({ componente: 'Todos', uf: 'Brasil (Todos)', municipio: 'Todos', escola: 'Todas', rede: 'Todas', localizacao: 'Todas', metrica: 'ponderado', search: '' })}
          onExport={() => alert('Exportando Nota Técnica...')}
        />

        <Content className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Institutional Note */}
          <Card className="bg-white border-[#E4E4E4] rounded-xl shadow-2xs">
            <h2 className="text-lg font-extrabold text-[#202124] mb-2">
              Nota Técnica: Processamento de Microdados SAEB 2023 (9º Ano EF)
            </h2>
            <p className="text-xs text-[#5F6368] leading-relaxed mb-4">
              Esta plataforma processa exclusivamente a edição de 2023 do Sistema de Avaliação da Educação Básica (SAEB), focada em estudantes do 9º ano do Ensino Fundamental. O cálculo das taxas percentuais de acerto por descritor utiliza os pesos amostrais originais (`PESO_ALUNO`) fornecidos pelo INEP para garantir representatividade populacional fidedigna.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 bg-[#FAFAFA] border border-[#E4E4E4] rounded-lg">
                <span className="text-[11px] font-bold text-[#5F6368] uppercase">Edição da Base</span>
                <p className="text-sm font-black text-[#202124] m-0">SAEB 2023 (Oficial INEP)</p>
              </div>
              <div className="p-3 bg-[#FAFAFA] border border-[#E4E4E4] rounded-lg">
                <span className="text-[11px] font-bold text-[#5F6368] uppercase">Público-Alvo</span>
                <p className="text-sm font-black text-[#202124] m-0">9º Ano Ensino Fundamental</p>
              </div>
              <div className="p-3 bg-[#FAFAFA] border border-[#E4E4E4] rounded-lg">
                <span className="text-[11px] font-bold text-[#5F6368] uppercase">Componentes</span>
                <p className="text-sm font-black text-[#202124] m-0">L. Portuguesa e Matemática</p>
              </div>
              <div className="p-3 bg-[#FAFAFA] border border-[#E4E4E4] rounded-lg">
                <span className="text-[11px] font-bold text-[#5F6368] uppercase">Formulação</span>
                <p className="text-sm font-black text-[#202124] m-0">Ponderada vs Simples</p>
              </div>
            </div>
          </Card>

          {/* Configurable Thresholds Card */}
          <Card className="bg-white border-[#E4E4E4] rounded-xl shadow-2xs" title={<span className="font-extrabold text-[#202124]">Configuração dos Limiares de Desempenho Pedagógico</span>}>
            <p className="text-xs text-[#5F6368] mb-4">
              A classificação dos descritores por nível de atenção é configurável. Ajuste os valores percentuais abaixo para reclassificar o diagnóstico na plataforma:
            </p>

            <Form layout="vertical" initialValues={thresholds} onFinish={handleSaveThresholds}>
              <Row gutter={16}>
                <Col span={24} md={8}>
                  <Form.Item
                    name="criticoMax"
                    label={<span className="text-xs font-bold text-[#D32F2F]">🔴 Limite Máximo Nível Crítico (%)</span>}
                    rules={[{ required: true }]}
                  >
                    <InputNumber min={0} max={100} step={1} className="w-full" addonAfter="%" />
                  </Form.Item>
                  <p className="text-[11px] text-[#5F6368] m-0">Valores &lt; este percentual são marcados como Crítico (Ex: &lt; 40%)</p>
                </Col>

                <Col span={24} md={8}>
                  <Form.Item
                    name="atencaoMax"
                    label={<span className="text-xs font-bold text-[#F57C00]">🟠 Limite Máximo Nível Atenção (%)</span>}
                    rules={[{ required: true }]}
                  >
                    <InputNumber min={0} max={100} step={1} className="w-full" addonAfter="%" />
                  </Form.Item>
                  <p className="text-[11px] text-[#5F6368] m-0">Valores entre Crítico e este percentual são marcados como Atenção (Ex: 40–50%)</p>
                </Col>

                <Col span={24} md={8}>
                  <Form.Item
                    name="intermediarioMax"
                    label={<span className="text-xs font-bold text-[#997A00]">🟡 Limite Máximo Intermediário (%)</span>}
                    rules={[{ required: true }]}
                  >
                    <InputNumber min={0} max={100} step={1} className="w-full" addonAfter="%" />
                  </Form.Item>
                  <p className="text-[11px] text-[#5F6368] m-0">Valores acima deste percentual são marcados como Adequado (Ex: &gt; 70%)</p>
                </Col>
              </Row>

              <Divider className="my-4" />

              <div className="flex justify-end">
                <Button type="primary" htmlType="submit" className="bg-[#FFCC00] text-black font-bold border-0 hover:bg-[#D9AD00]">
                  Salvar e Aplicar Limiares
                </Button>
              </div>
            </Form>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}
