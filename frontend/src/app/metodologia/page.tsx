'use client';

import React, { useState } from 'react';
import { Layout, Card, InputNumber, Button, Form, Alert, Row, Col } from 'antd';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { SaebFilterState, PerformanceThresholds } from '../../types/saeb';
import { saveThresholds, useThresholds } from '../../services/thresholds';

const { Content } = Layout;
const initialFilters: SaebFilterState = {
  anoEscolar: '9º Ano EF', componente: 'Todos', uf: 'Brasil (Todos)', municipio: 'Todos',
  escola: 'Todas', rede: 'Todas', localizacao: 'Todas', metrica: 'ponderado', search: '',
};

export default function MetodologiaPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const thresholds = useThresholds();
  const [feedback, setFeedback] = useState('');
  const handleSaveThresholds = (values: PerformanceThresholds) => {
    try {
      saveThresholds(values);
      setFeedback('Limiares salvos neste navegador e aplicados às páginas do painel.');
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Não foi possível salvar os limiares.');
    }
  };
  return <Layout className="min-h-screen">
    <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
    <Layout>
      <Header title="Metodologia e Dados · Nota Técnica SAEB 2023" filters={filters}
        onFilterChange={update => setFilters(previous => ({...previous, ...update}))}
        onResetFilters={() => setFilters(initialFilters)} onExport={() => window.print()} />
      <Content className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        <Card className="bg-white border-[#E4E4E4] rounded-xl shadow-2xs">
          <h2 className="text-xl font-extrabold mb-3">Nota técnica: diagnóstico descritivo do SAEB 2023</h2>
          <div className="text-sm text-[#5F6368] space-y-5 leading-relaxed">
            <p>O painel apresenta percentuais de acerto em itens de Língua Portuguesa e Matemática do 9º ano do Ensino Fundamental, por código, UF e rede. O percentual de acerto é um indicador descritivo do conjunto de respostas selecionado. Não equivale à proficiência calculada pelo Inep nem mede, isoladamente, o domínio de uma habilidade.</p>
            <Alert type="success" showIcon title="Reprocessamento e auditoria dos microdados"
              description="Os dados desta versão foram reprocessados e auditados ponta a ponta a partir dos microdados oficiais do Inep (TS_ALUNO_9EF.csv e TS_ITEM.csv). Foram excluídos 406.071 registros sem peso amostral válido (incluindo 400.618 ausentes e 5.453 outros registros sem peso positivo ou sem proficiência apurada), eliminando a distorção anterior de imputação de peso." />
            <section>
              <h3 className="font-bold text-[#202124]">1. Recorte e conjunto de estudantes elegíveis</h3>
              <p>O universo analisado compreende o <strong>conjunto de estudantes elegíveis para a análise ponderada</strong> do 9º ano do Ensino Fundamental no SAEB 2023, sob os critérios de validação do Inep: <code>IN_SITUACAO_CENSO = 1</code>, presença no teste do componente (<code>IN_PRESENCA = 1</code>), proficiência apurada (<code>IN_PROFICIENCIA = 1</code>) e peso amostral estritamente positivo (<code>PESO &gt; 0</code>), totalizando 2.083.218 estudantes. A consistência com o Censo Escolar não transforma o recorte, que inclui a rede privada (de delineamento amostral), em uma população integralmente censitária.</p>
              <p>A base reúne agregações por componente (Língua Portuguesa e Matemática), UF e rede de ensino (Pública ou Privada). Município, escola, turma e localização urbana/rural não estão abertos neste agregado.</p>
              <p><a href="/data/saeb-2023-9ef.json" download className="underline">Baixar os dados agregados e os metadados de conferência</a>. O arquivo contém a identificação da fonte, seu hash SHA-256 e a cobertura completa de códigos.</p>
            </section>
            <section>
              <h3 className="font-bold text-[#202124]">2. Respostas, acertos e pesos</h3>
              <p>A unidade fundamental contabilizada é a resposta computada a um item do caderno de prova. Como os cadernos são estruturados pelo delineamento de blocos incompletos balanceados (BIB), cada estudante responde a uma amostra de itens do banco, podendo responder a múltiplos itens associados ao mesmo descritor. Por isso, a contagem de respostas não representa estudantes únicos.</p>
              <p>Após o reprocessamento dos microdados com o descarte dos 406.071 registros sem peso, o agregado totaliza <strong>108.327.336 respostas a itens computadas</strong> (foram retiradas 21.115.692 respostas espúrias e 3.352 acertos observados da versão anterior não filtrada).</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#FAFAFA] rounded-xl border">
                  <strong>Métrica simples (Acertos Observados)</strong>
                  <p>100 × total de acertos observados / total de respostas computadas.</p>
                  <p>No agregado nacional, são <strong>56.149.996 acertos observados</strong> sobre 108.327.336 respostas, resultando em uma taxa simples de <strong>51,83%</strong>.</p>
                </div>
                <div className="p-4 bg-[#FAFAFA] rounded-xl border">
                  <strong>Métrica ponderada (Soma dos Pesos)</strong>
                  <p>100 × soma dos pesos das respostas corretas / soma dos pesos das respostas computadas.</p>
                  <p>A soma ponderada dos acertos é de aproximadamente <strong>75.977.829,44</strong> sobre uma soma ponderada de respostas de <strong>141.109.904,59</strong>, resultando na taxa média ponderada de <strong>53,84%</strong>.</p>
                </div>
              </div>
              <p><strong>Atenção à interpretação pedagógica:</strong> O indicador considera respostas a itens, com ponderação. Ele mede a proporção de acertos nos itens associados a cada descritor e <em>não mede diretamente quantos estudantes dominam ou deixam de dominar a habilidade</em> (o que exigiria modelos psicométricos de Teoria de Resposta ao Item com definição de pontos de corte na escala de proficiência contínua).</p>
            </section>
            <section>
              <h3 className="font-bold text-[#202124]">3. Matriz de referência e códigos da base</h3>
              <p>A matriz de 2001 contém 21 descritores de Língua Portuguesa e 37 de Matemática. O Inep informa que essa matriz foi mantida para esses componentes e etapa no SAEB 2023. A Portaria Inep nº 267, de 21 de junho de 2023, também identifica a matriz de 2001 nos arts. 8º e 9º e no Anexo I.</p>
              <p>O agregado deste projeto contém 68 códigos: 24 em LP e 44 em Matemática. Desses, 56 correspondem aos códigos da matriz de 2001: 21 de LP e 35 de Matemática. D30 e D32 de Matemática não aparecem no agregado. Essa ausência, isoladamente, não demonstra a inexistência de itens na aplicação original.</p>
              <p>Os outros 12 códigos são H11, H12 e H24, em LP, e 9A1.3, 9A2.1, 9A2.2, 9A2.3, 9E2.1, 9N1.1, 9N1.5, 9N1.6 e 9N1.7, em Matemática. Seus resultados são preservados no catálogo como códigos adicionais. A descrição, a matriz de origem e uma eventual função experimental exigem documentação específica; a nomenclatura, sozinha, não comprova essas atribuições.</p>
              <p>As descrições dos códigos D no catálogo são sínteses para consulta. Para citações literais, utilize o texto da matriz oficial. O gráfico por eixos inclui somente códigos correspondentes à matriz de 2001; a visão conjunta organiza seus tópicos em cinco grupos próprios do painel.</p>
              <p className="flex flex-wrap gap-4">
                <a className="underline" href="https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/saeb/matrizes-e-escalas">Matrizes e escalas — Inep</a>
                <a className="underline" href="https://www.in.gov.br/web/dou/-/portaria-n-267-de-21-de-junho-de-2023-491971666">Portaria Inep nº 267/2023</a>
              </p>
            </section>
            <section>
              <h3 className="font-bold text-[#202124]">4. Critério de atenção pedagógica</h3>
              <p>As faixas são critérios definidos para este painel e para o recorte da pesquisa. Não são níveis oficiais de proficiência do Inep. Na configuração padrão: Crítico, abaixo de 40%; Atenção, de 40% até menos de 60%; Intermediário, de 60% até menos de 70%; Adequado, a partir de 70%.</p>
              <p>A seleção de prioridade pedagógica (Crítico e Atenção) corresponde, portanto, a percentuais inferiores a 60%. Registre também a métrica, o componente, a rede, o território, a data da consulta e se foram considerados todos os códigos ou apenas aqueles da matriz de 2001. Os resultados de um recorte não devem ser transferidos automaticamente para outro.</p>
            </section>
          </div>
        </Card>
        <Card title="Configuração dos limiares de atenção pedagógica">
          <p className="text-sm mb-4">Os limites ficam salvos neste navegador. Informe três valores crescentes; o limite superior de cada faixa é exclusivo.</p>
          <Form key={JSON.stringify(thresholds)} layout="vertical" initialValues={thresholds} onFinish={handleSaveThresholds}>
            <Row gutter={16}>
              {([
                ['criticoMax', 'Crítico: percentual inferior a'],
                ['atencaoMax', 'Atenção: percentual inferior a'],
                ['intermediarioMax', 'Intermediário: percentual inferior a'],
              ] as const).map(([name, label]) => <Col span={24} md={8} key={name}>
                <Form.Item name={name} label={label} rules={[{required: true}]}>
                  <InputNumber min={0} max={100} step={1} suffix="%" className="w-full" />
                </Form.Item>
              </Col>)}
            </Row>
            <Button type="primary" htmlType="submit">Salvar e aplicar limiares</Button>
          </Form>
          {feedback && <p role="status" className="text-sm mt-3">{feedback}</p>}
        </Card>
      </Content>
    </Layout>
  </Layout>;
}
