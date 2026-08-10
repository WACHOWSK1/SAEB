'use client';

import React, { useState } from 'react';
import { Layout, Card, Tag } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { SaebFilterState } from '../../types/saeb';

const { Content } = Layout;

export default function SobrePage() {
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
    <Layout className="min-h-screen bg-[#F5F5F5] flex flex-row">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout className="bg-[#F5F5F5] flex-1 min-w-0">
        <Header
          title="Sobre o Projeto · Pesquisa & Contexto Institucional"
          filters={filters}
          onFilterChange={(u) => setFilters((p) => ({ ...p, ...u }))}
          onResetFilters={() =>
            setFilters({
              anoEscolar: '9º Ano EF',
              componente: 'Todos',
              uf: 'Brasil (Todos)',
              municipio: 'Todos',
              escola: 'Todas',
              rede: 'Todas',
              localizacao: 'Todas',
              metrica: 'ponderado',
              search: '',
            })
          }
        />

        <Content className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header Banner Card */}
          <Card className="bg-white border-[#E4E4E4] rounded-xl shadow-2xs overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#E4E4E4]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Tag color="gold" className="text-black font-extrabold text-xs px-2.5 py-0.5 uppercase tracking-wide">
                    Pesquisa Científica · 2026
                  </Tag>
                  <Tag color="blue" className="font-extrabold text-xs px-2.5 py-0.5 uppercase tracking-wide">
                    PPGFCET / UTFPR
                  </Tag>
                </div>
                <h1 className="text-xl md:text-2xl font-black text-[#202124] m-0 tracking-tight">
                  Plataforma de Inteligência Educacional com Microdados do SAEB 2023
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src="/logo-ppgfcet.png"
                  alt="UTFPR PPGFCET"
                  className="h-12 w-auto object-contain"
                />
              </div>
            </div>

            {/* Main Text Content */}
            <div className="pt-6 flex flex-col gap-6 text-[#202124] text-sm md:text-base leading-relaxed">
              <p className="text-gray-700 text-justify m-0">
                Este dashboard foi desenvolvido com o propósito de ampliar as possibilidades de análise e compreensão dos microdados do Sistema de Avaliação da Educação Básica (SAEB), edição de 2023, transformando um amplo conjunto de informações educacionais em uma ferramenta de consulta, investigação e apoio à tomada de decisões pedagógicas.
              </p>

              {/* Highlight Box — Pesquisa & Autoria */}
              <div className="p-5 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-[#D9AD00] font-black text-sm uppercase tracking-wider">
                  <BookOutlined />
                  Iniciativa de Pesquisa Acadêmica
                </div>
                <p className="font-semibold text-gray-900 text-sm md:text-base m-0 leading-relaxed">
                  A iniciativa integra uma pesquisa desenvolvida, em 2026, no Programa de Pós-Graduação em Formação Científica e Tecnológica (PPGFCET) da Universidade Tecnológica Federal do Paraná (UTFPR), pelo mestrando{' '}
                  <a
                    href="http://lattes.cnpq.br/4115333036030116"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-extrabold text-[#202124] hover:text-[#D9AD00] underline underline-offset-2 transition-colors"
                  >
                    Bruno Oliveira Soares
                  </a>
                  , sob orientação do{' '}
                  <a
                    href="http://lattes.cnpq.br/7856446665313251"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-extrabold text-[#202124] hover:text-[#D9AD00] underline underline-offset-2 transition-colors"
                  >
                    Prof. Dr. Giulio Domêminico Bordin
                  </a>.
                </p>
              </div>

              <p className="text-gray-700 text-justify m-0">
                A plataforma busca tornar os dados do SAEB mais acessíveis e exploráveis, contribuindo para a identificação de padrões, resultados e aspectos relevantes do ensino brasileiro. Mais do que apresentar indicadores, seu objetivo é instrumentalizar professores, pesquisadores e demais profissionais da educação, oferecendo subsídios que possam apoiar reflexões sobre a aprendizagem, o planejamento de ações pedagógicas e a elaboração de materiais e estratégias educacionais.
              </p>

              <p className="text-gray-700 text-justify m-0">
                Ao aproximar os microdados da realidade de quem pesquisa, planeja e atua diretamente na educação, o dashboard pretende favorecer uma leitura mais clara e contextualizada das informações produzidas pelo SAEB, contribuindo para que os dados educacionais possam ser utilizados não apenas como instrumentos de diagnóstico, mas também como ponto de partida para investigação, planejamento e desenvolvimento de novas práticas.
              </p>
            </div>
          </Card>

          {/* Footer Metadata Card */}
          <Card className="bg-white border-[#E4E4E4] rounded-xl shadow-2xs">
            <div className="flex items-center gap-3 text-xs md:text-sm text-gray-700 font-medium">
              <DatabaseOutlined className="text-[#FFCC00] text-lg shrink-0" />
              <div>
                <span className="font-extrabold text-[#202124]">Fonte dos dados: </span>
                Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira (Inep) — Microdados do SAEB 2023.
              </div>
            </div>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}
