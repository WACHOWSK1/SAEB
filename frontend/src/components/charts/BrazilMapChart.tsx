'use client';

import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { UfPerformanceItem } from '../../types/saeb';

interface BrazilMapChartProps {
  ufsData: UfPerformanceItem[];
  mediaBr: number;
}

export const BrazilMapChart: React.FC<BrazilMapChartProps> = ({ ufsData, mediaBr }) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    async function loadGeoJson() {
      try {
        const res = await fetch('/brazil-states.json');
        if (res.ok) {
          const geoJson = await res.json();
          echarts.registerMap('brazil', geoJson);
          setIsMapLoaded(true);
        }
      } catch (err) {
        console.error('Error loading Brazil GeoJSON map:', err);
      }
    }
    loadGeoJson();
  }, []);

  if (!isMapLoaded) {
    return (
      <div className="w-full h-[480px] bg-white rounded-xl border border-[#E4E4E4] flex items-center justify-center text-xs text-[#5F6368] font-bold">
        Carregando Mapa Oficial do Brasil (IBGE GeoJSON)...
      </div>
    );
  }

  // Map state names & acronyms to values
  const mapSeriesData = ufsData.map((item) => {
    const diff = item.pct - mediaBr;
    return {
      name: item.NM_UF,
      value: item.pct,
      diff: diff,
      respostas: item.TOTAL_RESPOSTAS,
    };
  });

  const option = {
    title: {
      text: 'Mapa Interativo do Brasil · Taxa de Acerto por Estado (SAEB 2023 9EF)',
      subtext: `Média Nacional do Brasil: ${mediaBr.toFixed(1)}% (Cores no Padrão Institucional)`,
      left: 'center',
      top: 10,
      textStyle: { fontSize: 14, fontWeight: 'bold', color: '#202124', fontFamily: 'Inter' },
      subtextStyle: { fontSize: 11, color: '#5F6368', fontFamily: 'Inter' },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: '#202124',
      borderColor: '#FFCC00',
      borderWidth: 1,
      textStyle: { color: '#ffffff', fontFamily: 'Inter', fontSize: 12 },
      formatter: (params: any) => {
        if (!params.data) {
          return `<div style="font-family: Inter; padding: 4px;"><b>${params.name}</b><br/>Sem dados cadastrados</div>`;
        }
        const val = params.data.value;
        const diff = params.data.diff;
        const diffText = diff >= 0 ? `+${diff.toFixed(1)} pp vs Brasil` : `${diff.toFixed(1)} pp vs Brasil`;
        const isAbove = val >= mediaBr;

        return `
          <div style="font-family: Inter; padding: 6px; space-y-1">
            <div style="font-[#FFCC00]; font-weight: 800; font-size: 14px; margin-bottom: 4px; color: #FFCC00;">
              🇧🇷 ${params.name}
            </div>
            <div><b>Taxa de Acerto:</b> <span style="font-weight: 900; font-size: 14px;">${val.toFixed(1)}%</span></div>
            <div><b>Comparativo:</b> <span style="color: ${isAbove ? '#4CAF50' : '#FF7043'}; font-weight: 800;">${diffText}</span></div>
            <div><b>Situação:</b> <span style="color: ${isAbove ? '#81C784' : '#FF8A65'}; font-weight: 800;">${isAbove ? 'Acima da Média Nacional' : 'Abaixo da Média Nacional'}</span></div>
            ${params.data.respostas ? `<div style="color: #B0BEC5; font-size: 11px; margin-top: 4px;">Total Estudantes: ${params.data.respostas.toLocaleString('pt-BR')}</div>` : ''}
          </div>
        `;
      },
    },
    visualMap: {
      min: 38,
      max: 54,
      left: 'left',
      bottom: '20',
      text: ['Alto (>52%)', 'Baixo (<40%)'],
      calculable: true,
      orient: 'vertical',
      inRange: {
        color: ['#D32F2F', '#F57C00', '#D9AD00', '#FFCC00', '#388E3C'],
      },
      textStyle: { fontFamily: 'Inter', fontSize: 11, color: '#202124' },
    },
    series: [
      {
        name: 'SAEB 2023 UF',
        type: 'map',
        map: 'brazil',
        roam: true,
        zoom: 1.15,
        center: [-53, -14],
        label: {
          show: true,
          fontSize: 9,
          fontWeight: 'bold',
          color: '#202124',
          fontFamily: 'Inter',
        },
        itemStyle: {
          areaColor: '#E4E4E4',
          borderColor: '#ffffff',
          borderWidth: 1.5,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 11,
            fontWeight: '900',
            color: '#000000',
          },
          itemStyle: {
            areaColor: '#FFCC00',
            borderColor: '#202124',
            borderWidth: 2,
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
          },
        },
        data: mapSeriesData,
      },
    ],
  };

  return (
    <div className="w-full bg-white p-3 rounded-xl border border-[#E4E4E4] shadow-2xs">
      <ReactECharts
        option={option}
        notMerge={true}
        lazyUpdate={true}
        style={{ height: '540px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};
