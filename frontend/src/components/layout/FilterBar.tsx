'use client';

import React from 'react';
import { Select, Radio, Card, Form, Tooltip } from 'antd';
import { FilterOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { SaebFilterState, ComponenteCurricular, RedeEnsino, MetricaAcerto } from '../../types/saeb';

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
  return (
    <Card className="bg-white border-[#E4E4E4] shadow-2xs rounded-xl mb-6 py-1">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#E4E4E4]">
        <FilterOutlined className="text-[#FFCC00] text-base" />
        <span className="font-extrabold text-[#202124] text-xs uppercase tracking-wider">
          Filtros Encadeados de Análise Microdado (SAEB 2023 · 9º Ano EF)
        </span>
        <Tooltip title="Os filtros funcionam de forma encadeada. Selecionar um Estado limita os municípios disponíveis.">
          <InfoCircleOutlined className="text-gray-400 text-xs hover:text-black cursor-pointer" />
        </Tooltip>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Componente Curricular */}
        <div>
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
        <div>
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
        <div>
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
          <label className="block text-[11px] font-bold text-[#5F6368] uppercase tracking-wider mb-1">
            Métrica de Cálculo
          </label>
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
