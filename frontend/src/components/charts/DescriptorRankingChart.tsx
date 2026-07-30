'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { DescritorItem, PerformanceThresholds } from '../../types/saeb';
import { classifyPerformance } from '../../services/api';

interface DescriptorRankingChartProps {
  items: DescritorItem[];
  title?: string;
  maxDisplay?: number;
  thresholds: PerformanceThresholds;
}

export const DescriptorRankingChart: React.FC<DescriptorRankingChartProps> = ({
  items,
  title = 'Ranking dos Descritores por Taxa de Acerto',
  maxDisplay,
  thresholds,
}) => {
  // Sort items ascending by pct for bottom-to-top horizontal bar chart
  const sorted = [...items].sort((a, b) => a.pct - b.pct);
  const displayItems = maxDisplay ? sorted.slice(0, maxDisplay) : sorted;

  // Y-axis shows ONLY the code (and discipline acronym if LP vs MT to distinguish)
  const yCategories = displayItems.map((item) => {
    const discAbbr = item.DS_DISCIPLINA === 'Língua Portuguesa' ? 'LP' : 'MT';
    return `${item.CO_DESCRITOR} (${discAbbr})`;
  });

  const seriesData = displayItems.map((item) => {
    const perf = classifyPerformance(item.pct, thresholds);
    return {
      value: item.pct,
      itemStyle: { color: perf.color, borderRadius: [0, 4, 4, 0] },
      rawItem: item,
    };
  });

  const option = {
    title: {
      text: title,
      textStyle: { fontSize: 14, fontWeight: 'bold', color: '#202124', fontFamily: 'Inter' },
      left: 10,
      top: 5,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        shadowStyle: { color: 'rgba(255, 204, 0, 0.12)' }
      },
      backgroundColor: '#202124',
      borderColor: '#FFCC00',
      borderWidth: 1,
      textStyle: { color: '#ffffff', fontFamily: 'Inter', fontSize: 12 },
      formatter: (params: any) => {
        const data = params[0].data.rawItem as DescritorItem;
        const perf = classifyPerformance(data.pct, thresholds);
        return `
          <div style="font-family: Inter, sans-serif; padding: 6px; space-y-1;">
            <div style="font-weight: 800; color: #FFCC00; font-size: 14px; margin-bottom: 4px;">
              ${data.CO_DESCRITOR} · ${data.DS_DISCIPLINA}
            </div>
            <div style="margin-bottom: 6px; color: #E4E4E4; font-size: 12px; line-height: 1.4;">
              📖 <b>Habilidade:</b> ${data.descricao}
            </div>
            <div style="margin-bottom: 3px;">
              ✅ <b>Taxa de Acerto:</b> <span style="font-weight: 900; font-size: 13px;">${data.pct.toFixed(1)}%</span>
            </div>
            <div style="margin-bottom: 3px;">
              🎯 <b>Nível de Atenção:</b> <span style="color: ${perf.color}; font-weight: 900;">● ${perf.label}</span>
            </div>
            <div style="color: #9E9E9E; font-size: 11px; margin-top: 4px;">
              📊 Total de Respostas: ${data.TOTAL_RESPOSTAS.toLocaleString('pt-BR')}
            </div>
          </div>
        `;
      },
    },
    grid: { left: '2%', right: '8%', bottom: '3%', top: '45px', containLabel: true },
    xAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: { formatter: '{value}%', style: { fontFamily: 'Inter', fontSize: 11 } },
      splitLine: { lineStyle: { color: '#E4E4E4', type: 'dashed' } },
    },
    yAxis: {
      type: 'category',
      data: yCategories,
      triggerEvent: true,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: '#E4E4E4' } },
      axisLabel: {
        fontFamily: 'Inter',
        fontSize: 11,
        fontWeight: 'bold',
        color: '#202124',
        backgroundColor: '#FFFBE6',
        borderColor: '#FFE58F',
        borderWidth: 1,
        borderRadius: 4,
        padding: [3, 8],
      },
    },
    series: [
      {
        name: 'Percentual de Acerto',
        type: 'bar',
        barWidth: 16,
        data: seriesData,
        label: {
          show: true,
          position: 'right',
          formatter: '{c}%',
          fontSize: 10,
          fontWeight: 'bold',
          color: '#5F6368',
        },
      },
    ],
  };

  return (
    <div className="w-full bg-white p-3 rounded-xl border border-[#E4E4E4] shadow-2xs">
      <ReactECharts
        option={option}
        style={{ height: `${Math.max(450, displayItems.length * 28)}px`, width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};
