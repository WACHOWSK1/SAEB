'use client';

import React from 'react';
import { Select, Radio, Card, Tooltip, Popover } from 'antd';
import { FilterOutlined, InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { SaebFilterState, AnoEscolar, ComponenteCurricular, RedeEnsino, MetricaAcerto } from '../../types/saeb';

interface FilterBarProps {
  filters: SaebFilterState;
  onFilterChange: (filters: Partial<SaebFilterState>) => void;
  ufsList: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  ufsList,
}) => {
  const metricHelpContent = (
    <div className="max-w-xs text-xs space-y-2 leading-relaxed text-[#202124]">
      <p className="font-bold border-b pb-1 text-sm text-[#202124]">
        Diferença entre Métricas de Cálculo
      </p>
      <div>
        <span className="font-extrabold text-[#D9AD00] block mb-0.5">
          • Ponderada (Peso INEP):
        </span>
        Utiliza o peso amostral (<code>PESO_ALUNO</code>) fornecido pelo INEP para a expansão populacional. Garante que os resultados reflitam a representatividade estatística real da população de estudantes no SAEB 2023.
      </div>
      <div>
        <span className="font-extrabold text-[#5F6368] block mb-0.5">
          • Simples (Direta):
        </span>
        Média aritmética direta do banco de dados (cada estudante/resposta possui peso igual a 1). Indicada para análise puramente descritiva da amostra observada.
      </div>
    </div>
  );

  return (
    <Card className="bg-white border-[#E4E4E4] shadow-2xs rounded-xl mb-6 py-1">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#E4E4E4]">
        <FilterOutlined className="text-[#FFCC00] text-base" />
        <span className="font-extrabold text-[#202124] text-xs uppercase tracking-wider">
          Filtros Encadeados de Análise Microdado (SAEB 2023 · {filters.anoEscolar || '9º Ano EF'})
        </span>
        <Tooltip title="Os filtros funcionam de forma encadeada. Selecionar um Ano/Série limita os descritores e métricas ao recorte escolhido.">
          <InfoCircleOutlined className="text-gray-400 text-xs hover:text-black cursor-pointer" />
        </Tooltip>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Ano / Série */}
        <div className="lg:col-span-1">
          <label className="block text-[11px] font-bold text-[#5F6368] uppercase tracking-wider mb-1">
            Ano / Série
          </label>
          <Select
            value={filters.anoEscolar || '9º Ano EF'}
            onChange={(val: AnoEscolar) => onFilterChange({ anoEscolar: val })}
            className="w-full text-xs font-semibold"
            options={[
              { value: '2º Ano EF', label: '2º Ano EF' },
              { value: '5º Ano EF', label: '5º Ano EF' },
              { value: '9º Ano EF', label: '9º Ano EF' },
              { value: '3ª/4ª Série EM', label: '3ª Série EM' },
              { value: 'Todos', label: 'Todos os Anos' },
            ]}
          />
        </div>

        {/* Componente Curricular */}
        <div className="lg:col-span-1">
          <label className="block text-[11px] font-bold text-[#5F6368] uppercase tracking-wider mb-1">
            Componente
          </label>
          <Select
            value={filters.componente}
            onChange={(val: ComponenteCurricular) => onFilterChange({ componente: val })}
            className="w-full text-xs font-semibold"
            options={[
              { value: 'Todos', label: 'Todos (LP + MT)' },
              { value: 'Língua Portuguesa', label: 'Língua Portuguesa' },
              { value: 'Matemática', label: 'Matemática' },
            ]}
          />
        </div>

        {/* Estado (UF) */}
        <div className="lg:col-span-1">
          <label className="block text-[11px] font-bold text-[#5F6368] uppercase tracking-wider mb-1">
            Estado (UF)
          </label>
          <Select
            value={filters.uf}
            onChange={(val: string) => onFilterChange({ uf: val, municipio: 'Todos', escola: 'Todas' })}
            showSearch
            className="w-full text-xs font-semibold"
            options={ufsList.map((uf) => ({ value: uf, label: uf }))}
          />
        </div>

        {/* Rede de Ensino */}
        <div className="lg:col-span-1">
          <label className="block text-[11px] font-bold text-[#5F6368] uppercase tracking-wider mb-1">
            Rede de Ensino
          </label>
          <Select
            value={filters.rede}
            onChange={(val: RedeEnsino) => onFilterChange({ rede: val })}
            className="w-full text-xs font-semibold"
            options={[
              { value: 'Todas', label: 'Todas as Redes' },
              { value: 'Pública', label: 'Rede Pública' },
              { value: 'Privada', label: 'Rede Privada' },
            ]}
          />
        </div>

        {/* Métrica */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-1.5 mb-1">
            <label className="block text-[11px] font-bold text-[#5F6368] uppercase tracking-wider m-0">
              Métrica de Cálculo
            </label>
            <Popover content={metricHelpContent} trigger="hover" placement="bottomLeft">
              <QuestionCircleOutlined className="text-[#5F6368] text-xs hover:text-[#202124] cursor-pointer" />
            </Popover>
          </div>
          <Radio.Group
            value={filters.metrica}
            onChange={(e) => onFilterChange({ metrica: e.target.value as MetricaAcerto })}
            buttonStyle="solid"
            className="w-full flex text-xs font-bold"
          >
            <Radio.Button value="ponderado" className="flex-1 text-center text-xs">
              Ponderada (Peso INEP)
            </Radio.Button>
            <Radio.Button value="simples" className="flex-1 text-center text-xs">
              Simples (Direta)
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>
    </Card>
  );
};
