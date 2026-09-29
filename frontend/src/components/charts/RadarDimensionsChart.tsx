'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { DescritorItem, MetricaAcerto } from '../../types/saeb';
import { axisRate, GLOBAL_AXES } from '../../services/calculations';

interface Props {
  items: DescritorItem[];
  metric: MetricaAcerto;
  title?: string;
}
const LP = 'Língua Portuguesa';
const MT = 'Matemática';
const LP_AXES = [
  { name: 'Procedimentos\nde leitura', disc: LP, codes: ['D1','D3','D4','D6','D14'] },
  { name: 'Suporte, gênero\ne enunciador', disc: LP, codes: ['D5','D12'] },
  { name: 'Relação\nentre textos', disc: LP, codes: ['D20','D21'] },
  { name: 'Coerência\ne coesão', disc: LP, codes: ['D2','D7','D8','D9','D10','D11','D15'] },
  { name: 'Recursos e\nefeitos de sentido', disc: LP, codes: ['D16','D17','D18','D19'] },
  { name: 'Variação\nlinguística', disc: LP, codes: ['D13'] },
];
const MT_AXES = [
  { name: 'Espaço\ne forma', disc: MT, codes: Array.from({length: 11}, (_, i) => `D${i+1}`) },
  { name: 'Grandezas\ne medidas', disc: MT, codes: ['D12','D13','D14','D15'] },
  { name: 'Números, operações,\nálgebra e funções', disc: MT, codes: Array.from({length: 20}, (_, i) => `D${i+16}`) },
  { name: 'Tratamento\nda informação', disc: MT, codes: ['D36','D37'] },
];

export const RadarDimensionsChart: React.FC<Props> = ({ items, metric, title = 'Desempenho por Eixo Temático' }) => {
  const hasLP = items.some(item => item.DS_DISCIPLINA === LP);
  const hasMT = items.some(item => item.DS_DISCIPLINA === MT);
  const axes = hasLP && hasMT ? GLOBAL_AXES : hasLP ? LP_AXES : MT_AXES;
  const values = axes.map(axis => axisRate(items, axis.disc, axis.codes, metric));
  // Não desenhar um polígono com valores inventados para os eixos ausentes.
  const complete = values.every(value => value !== null);
  const option = {
    title: { text: title, left: 10, top: 5, textStyle: {fontSize: 13, color: '#202124'} },
    tooltip: { trigger: 'item' },
    radar: {
      radius: '48%', center: ['50%', '55%'],
      indicator: axes.map(axis => ({name: axis.name, max: 100})),
      axisName: {color: '#202124', fontSize: 10, lineHeight: 13},
      splitArea: {areaStyle: {color: ['rgba(255,204,0,.04)','rgba(255,204,0,.12)']}},
    },
    series: [{ type: 'radar', data: [{
      name: metric === 'ponderado' ? 'Acerto ponderado (%)' : 'Acerto simples (%)',
      value: values.map(value => value === null ? null : Number(value.toFixed(1))),
      itemStyle: {color: '#D9AD00'}, lineStyle: {width: 2.5},
      areaStyle: {color: 'rgba(255,204,0,.35)'},
    }] }],
  };
  return <div className="w-full bg-white p-3 rounded-xl border border-[#E4E4E4] shadow-2xs mt-4">
    {complete ? <ReactECharts option={option} notMerge style={{height: '360px', width: '100%'}} /> :
      <p className="text-xs p-4">Dado não disponível para todos os eixos do recorte.</p>}
    <p className="text-[11px] text-[#5F6368]">Inclui apenas códigos correspondentes à matriz de 2001 com dados no recorte. A visão conjunta reúne os tópicos em cinco grupos próprios do painel. Percentuais calculados pelos somatórios da métrica selecionada.</p>
  </div>;
};
