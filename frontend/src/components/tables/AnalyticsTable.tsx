'use client';

import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { Tag, Button, Input } from 'antd';
import { SearchOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { DescritorItem, PerformanceThresholds } from '../../types/saeb';
import { classifyPerformance } from '../../services/api';

interface AnalyticsTableProps {
  data: DescritorItem[];
  thresholds: PerformanceThresholds;
  onSelectDescritor?: (code: string) => void;
}

export const AnalyticsTable: React.FC<AnalyticsTableProps> = ({
  data,
  thresholds,
  onSelectDescritor,
}) => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'pct', desc: false }, // Worst first
  ]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns: ColumnDef<DescritorItem>[] = [
    {
      accessorKey: 'DS_DISCIPLINA',
      header: 'Disciplina',
      cell: (info) => (
        <span className="font-extrabold text-[#202124]">{info.getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'CO_DESCRITOR',
      header: 'Código',
      cell: (info) => (
        <Tag
          color="gold"
          className="font-black text-black border-gold-400 cursor-pointer"
          onClick={() => onSelectDescritor?.(info.getValue() as string)}
        >
          {info.getValue() as string}
        </Tag>
      ),
    },
    {
      accessorKey: 'descricao',
      header: 'Descrição da Habilidade (Matriz SAEB)',
      cell: (info) => (
        <span className="text-gray-700 text-xs">{info.getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'pct',
      header: '% Acerto',
      cell: (info) => {
        const val = info.getValue() as number;
        return (
          <span className="font-mono font-black text-[#202124]">
            {val.toFixed(1)}%
          </span>
        );
      },
    },
    {
      accessorKey: 'TOTAL_RESPOSTAS',
      header: 'Respostas',
      cell: (info) => (
        <span className="font-mono text-gray-600 text-xs">
          {(info.getValue() as number).toLocaleString('pt-BR')}
        </span>
      ),
    },
    {
      id: 'nivelAtencao',
      header: 'Nível de Atenção Pedagógica',
      cell: ({ row }) => {
        const item = row.original;
        const perf = classifyPerformance(item.pct, thresholds);
        return (
          <Tag
            style={{
              backgroundColor: perf.badgeBg,
              color: perf.textColor,
              borderColor: perf.color,
              fontWeight: 800,
              padding: '2px 8px',
            }}
          >
            ● {perf.label}
          </Tag>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  });

  return (
    <div className="bg-white rounded-xl border border-[#E4E4E4] p-4 shadow-2xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E4E4E4]">
        <div>
          <h3 className="text-sm font-extrabold text-[#202124] uppercase tracking-wider m-0">
            Tabela Analítica dos Descritores (TanStack Table)
          </h3>
          <p className="text-xs text-[#5F6368] m-0">
            Exibindo {table.getFilteredRowModel().rows.length} habilidades ordenadas por percentual de acerto.
          </p>
        </div>
        <Input
          placeholder="Filtrar tabela..."
          prefix={<SearchOutlined className="text-gray-400" />}
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-64 text-xs"
          allowClear
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#202124]">
          <thead className="bg-[#FAFAFA] text-[#5F6368] uppercase font-bold text-[11px] tracking-wider border-b border-[#E4E4E4]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-4 py-3 cursor-pointer select-none hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-1.5">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <ArrowUpOutlined className="text-[#FFCC00]" />,
                        desc: <ArrowDownOutlined className="text-[#FFCC00]" />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-[#E4E4E4] bg-white">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-[#F0F9FF] transition">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2.5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between pt-3 border-t border-[#E4E4E4] text-xs text-[#5F6368]">
        <span>
          Página <b>{table.getState().pagination.pageIndex + 1}</b> de <b>{table.getPageCount()}</b>
        </span>
        <div className="flex gap-2">
          <Button
            size="small"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="text-xs"
          >
            Anterior
          </Button>
          <Button
            size="small"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="text-xs"
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
};
