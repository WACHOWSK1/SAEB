'use client';

import React from 'react';
import { Tag, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { SaebFilterState } from '../../types/saeb';

interface HeaderProps {
  title: string;
  filters: SaebFilterState;
  onFilterChange: (filters: Partial<SaebFilterState>) => void;
  onResetFilters: () => void;
  onExport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const activeCount = [
    filters.componente !== 'Todos' ? `Disciplina: ${filters.componente}` : null,
    filters.uf !== 'Brasil (Todos)' ? `UF: ${filters.uf}` : null,
    filters.rede !== 'Todas' ? `Rede: ${filters.rede}` : null,
    filters.metrica !== 'ponderado' ? `Métrica: Simples` : null,
  ].filter(Boolean);

  return (
    <header className="bg-white border-b border-[#E4E4E4] px-6 py-4 sticky top-0 z-20 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Title & Tag */}
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-[#202124] tracking-tight m-0">
              {title}
            </h1>
            <Tag color="#FFCC00" className="text-black font-extrabold px-2.5 py-0.5 rounded-md border-0 text-xs shadow-2xs">
              SAEB 2023 — 9º ano do Ensino Fundamental
            </Tag>
          </div>
          <p className="text-xs text-[#5F6368] mt-1 m-0 flex items-center gap-1.5">
            <span>Microdados Oficiais INEP/MEC</span>
            <span>•</span>
            <span>Última atualização: Microdados 2023 (Edição Completa)</span>
          </p>
        </div>

        {/* Clear Filters Button (If active) */}
        {activeCount.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              icon={<ReloadOutlined />}
              onClick={onResetFilters}
              size="small"
              className="text-xs text-[#5F6368] hover:text-black border-[#E4E4E4]"
            >
              Limpar Filtros ({activeCount.length})
            </Button>
          </div>
        )}
      </div>

      {/* Active Filter Tags */}
      {activeCount.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-[#E4E4E4] flex items-center gap-2 text-xs">
          <span className="text-[#5F6368] font-bold">Filtros ativos:</span>
          {activeCount.map((tag, idx) => (
            <Tag key={idx} color="gold" className="text-black border-gold-300 font-medium">
              {tag}
            </Tag>
          ))}
        </div>
      )}
    </header>
  );
};
