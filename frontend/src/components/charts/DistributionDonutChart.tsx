'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { DescritorItem, PerformanceThresholds } from '../../types/saeb';
import { classifyPerformance } from '../../services/api';

interface DistributionDonutChartProps {
  items: DescritorItem[];
  thresholds: PerformanceThresholds;
}

export const DistributionDonutChart: React.FC<DistributionDonutChartProps> = ({
  items,
  thresholds,
}) => {
  let critico = 0;
  let atencao = 0;
  let intermediario = 0;
  let adequado = 0;

  items.forEach((item) => {
    const perf = classifyPerformance(item.pct, thresholds);
    if (perf.faixa === 'critico') critico++;
    else if (perf.faixa === 'atencao') atencao++;
    else if (perf.faixa === 'intermediario') intermediario++;
    else adequado++;
  });

  const total = items.length;

  const option = {
    title: [
      {
        text: 'Distribuição por Nível de Aprendizagem',
        left: 'center',
        top: 10,
        textStyle: { fontSize: 13, fontWeight: 'bold', color: '#202124', fontFamily: 'Inter' },
      },
      {
        text: `${total}\nHabilidades`,
        left: 'center',
        top: '43%',
        textStyle: {
          fontSize: 16,
          fontWeight: '900',
          color: '#202124',
          fontFamily: 'Inter',
          lineHeight: 20,
          align: 'center'
        }
      }
    ],
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        return `
          <div style="font-family: Inter; font-size: 12px; padding: 4px;">
            <b>${params.name}</b><br/>
            Quantidade: <b>${params.value} descritores</b> (${params.percent}%)
          </div>
        `;
      },
    },
    legend: {
      orient: 'horizontal',
      bottom: 10,
      left: 'center',
      icon: 'circle',
      itemGap: 12,
      textStyle: { fontFamily: 'Inter', fontSize: 11, color: '#5F6368' },
    },
    series: [
      {
        name: 'Nível de Aprendizagem',
        type: 'pie',
        radius: ['52%', '72%'],
        center: ['50%', '48%'],
        avoidLabelOverlap: true,
        label: {
          show: false // Hides messy outer connector lines that overlap
        },
        emphasis: {
          scale: true,
          scaleSize: 6,
          label: {
            show: false
          }
        },
        itemStyle: {
          borderRadius: 6,
          borderColor: '#ffffff',
          borderWidth: 2,
        },
        data: [
          { value: critico, name: `Crítico (${critico})`, itemStyle: { color: '#D32F2F' } },
          { value: atencao, name: `Atenção (${atencao})`, itemStyle: { color: '#F57C00' } },
          { value: intermediario, name: `Intermediário (${intermediario})`, itemStyle: { color: '#D9AD00' } },
          { value: adequado, name: `Adequado (${adequado})`, itemStyle: { color: '#388E3C' } },
        ],
      },
    ],
  };

  return (
    <div className="w-full bg-white p-3 rounded-xl border border-[#E4E4E4] shadow-2xs">
      <ReactECharts option={option} style={{ height: '380px', width: '100%' }} opts={{ renderer: 'canvas' }} />
    </div>
  );
};
