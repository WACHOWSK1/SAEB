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
          onResetFilters={() => setFilters({ anoEscolar: '9º Ano EF', componente: 'Todos', uf: 'Brasil (Todos)', municipio: 'Todos', escola: 'Todas', rede: 'Todas', localizacao: 'Todas', metrica: 'ponderado', search: '' })}
          onExport={() => alert('Exportando Nota Técnica...')}
        />

        <Content className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Institutional Note */}
          <Card className="bg-white border-[#E4E4E4] rounded-xl shadow-2xs">
            <h2 className="text-xl font-extrabold text-[#202124] mb-3">
              Nota Técnica: Processamento de Microdados SAEB 2023 (9º Ano EF)
            </h2>
            <p className="text-xs text-[#5F6368] leading-relaxed mb-6">
              Esta nota técnica documenta a metodologia de extração, agregação e cálculo estatístico aplicada aos microdados oficiais do Sistema de Avaliação da Educação Básica (SAEB 2023), promovido pelo Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira (INEP/MEC), com recorte focado na etapa final do Ensino Fundamental (9º Ano EF).
            </p>

            {/* High-level Summary Badges */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="p-3 bg.FAFAFA border border-[#E4E4E4] rounded-lg">
                <span className="text-[11px] font-bold text-[#5F6368] uppercase block mb-0.5">Base Oficial</span>
                <p className="text-sm font-black text-[#202124] m-0">SAEB 2023 (Edição Completa)</p>
              </div>
              <div className="p-3 bg-[#FAFAFA] border border-[#E4E4E4] rounded-lg">
                <span className="text-[11px] font-bold text-[#5F6368] uppercase block mb-0.5">Universo Avaliado</span>
                <p className="text-sm font-black text-[#202124] m-0">2.489.289 Estudantes</p>
              </div>
              <div className="p-3 bg-[#FAFAFA] border border-[#E4E4E4] rounded-lg">
                <span className="text-[11px] font-bold text-[#5F6368] uppercase block mb-0.5">Amparo Matemático</span>
                <p className="text-sm font-black text-[#202124] m-0">Horvitz-Thompson / BIB</p>
              </div>
              <div className="p-3 bg-[#FAFAFA] border border-[#E4E4E4] rounded-lg">
                <span className="text-[11px] font-bold text-[#5F6368] uppercase block mb-0.5">Item-Level Dataset</span>
                <p className="text-sm font-black text-[#202124] m-0">129.443.028 Respostas</p>
              </div>
            </div>

            <Divider className="my-4" />

            {/* Detailed Scientific Sections */}
            <div className="space-y-6 text-xs text-[#202124] leading-relaxed">
              {/* Section 1 */}
              <div>
                <h3 className="text-sm font-extrabold text-[#202124] uppercase tracking-wider mb-2 text-[#D9AD00]">
                  1. Desenho Amostral e Plano de Ponderação Estatística
                </h3>
                <p className="text-[#5F6368] mb-2">
                  O SAEB combina aplicação censitária nas redes públicas urbanas com amostragem probabilística estratificada por conglomerados para escolas privadas e rurais. Para compensar as diferentes probabilidades de seleção dos estudantes e controlar taxas de não-resposta, o INEP atribui a cada estudante $i$ um peso amostral de expansão populacional $w_i$ (<code className="bg-gray-100 px-1 rounded">PESO_ALUNO</code>).
                </p>
                <p className="text-[#5F6368]">
                  O uso do peso amostral garante que cada estudante na amostra represente a proporção exata da população de alunos do 9º ano EF no seu respectivo estrato populacional (UF, rede e localização).
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h3 className="text-sm font-extrabold text-[#202124] uppercase tracking-wider mb-2 text-[#D9AD00]">
                  2. Formulation Matemática: Taxa de Acerto por Descritor ($P_d$)
                </h3>
                <p className="text-[#5F6368] mb-3">
                  A taxa percentual de domínio em cada descritor $d$ da Matriz de Referência do SAEB é calculada sob duas métricas complementares na plataforma:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#FAFAFA] border border-[#E4E4E4] rounded-xl space-y-2">
                    <span className="font-extrabold text-[#202124] block">
                      A. Métrica Ponderada (Estimador de Horvitz-Thompson)
                    </span>
                    <p className="text-[11px] text-[#5F6368] m-0">
                      Representa a estimativa populacional não-viesada da proporção de acertos no universo do 9º ano EF:
                    </p>
                    <div className="p-2 bg-white rounded border border-[#E4E4E4] font-mono text-[11px] text-center text-[#202124]">
                      P_ponderado(d) = ( Σ [w_i * x_(i,d)] / Σ w_i ) * 100
                    </div>
                    <p className="text-[10px] text-gray-500 m-0">
                      Onde $w_i$ é o peso <code className="bg-gray-100 px-1">PESO_ALUNO</code> e $x_(i,d) \in &#123;0, 1&#125;$ indica acerto no item correspondente ao descritor $d$.
                    </p>
                  </div>

                  <div className="p-4 bg-[#FAFAFA] border border-[#E4E4E4] rounded-xl space-y-2">
                    <span className="font-extrabold text-[#202124] block">
                      B. Métrica Simples (Direta da Amostra Observada)
                    </span>
                    <p className="text-[11px] text-[#5F6368] m-0">
                      Média aritmética simples direta das respostas brutas registradas no banco de microdados:
                    </p>
                    <div className="p-2 bg-white rounded border border-[#E4E4E4] font-mono text-[11px] text-center text-[#202124]">
                      P_simples(d) = ( Σ x_(i,d) / N_respostas ) * 100
                    </div>
                    <p className="text-[10px] text-gray-500 m-0">
                      Trata todas as observações amostrais com pesos idênticos ($w_i = 1$). Recomendada exclusivamente para análise estatística descritiva dos microdados brutos.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div>
                <h3 className="text-sm font-extrabold text-[#202124] uppercase tracking-wider mb-2 text-[#D9AD00]">
                  3. Estrutura de Teste e Amostragem de Itens por Bloco Incompleto Balanceado (BIB)
                </h3>
                <p className="text-[#5F6368] mb-2">
                  No SAEB, devido ao número extenso de habilidades avaliadas nas Matrizes de Referência de Língua Portuguesa e Matemática, adota-se o formato de Bloco Incompleto Balanceado (BIB). Cada estudante responde a um caderno de teste (formato de prova) composto por 2 blocos de 13 itens de Língua Portuguesa e 2 blocos de 13 itens de Matemática.
                </p>
                <p className="text-[#5F6368]">
                  Dessa forma, cada participante responde a <strong>26 itens por disciplina</strong> (totalizando <strong>52 respostas individuais</strong> ao responder ambas as provas). O volume total de 129.443.028 registros no banco corresponde às respostas individuais a itens, equivalendo a <strong>2.489.289 estudantes avaliados</strong> na população nacional do 9º Ano EF.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h3 className="text-sm font-extrabold text-[#202124] uppercase tracking-wider mb-2 text-[#D9AD00]">
                  4. Agregação Hierárquica e Recortes Territoriais
                </h3>
                <p className="text-[#5F6368]">
                  O pipeline de dados agrega as respostas observadas respeitando a estrutura geoadministrativa oficial (Nacional $\rightarrow$ Unidade da Federação $\rightarrow$ Rede de Ensino). As análises por descritor mantêm consistência metodológica ao ponderar cada subconjunto pelo somatório dos pesos amostrais válidos contidos no respectivo recorte.
                </p>
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
