const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { classifyPerformance, filterRows, rate, summarize, axisRate, GLOBAL_AXES } = require('../.test-build/services/calculations.js');
const { validThresholds } = require('../.test-build/services/thresholds.js');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data/saeb-2023-9ef.json'), 'utf8'));
const filters = { anoEscolar: '9º Ano EF', componente: 'Todos', uf: 'Brasil (Todos)', municipio: 'Todos', escola: 'Todas', rede: 'Todas', localizacao: 'Todas', metrica: 'ponderado', search: '' };
const national = summarize(data.rows, data.catalog, 'ponderado');
const approx = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`);

test('a publicação identifica exatamente o CSV de origem', () => {
  const source = fs.readFileSync(path.join(__dirname, '../../data/processed/saeb_descritores.csv'));
  assert.equal(data.sourceSha256, crypto.createHash('sha256').update(source).digest('hex'));
  assert.equal(data.rows.length, 3672);
});

test('contagens de faixa e cobertura nacional, sem excluir os códigos adicionais', () => {
  const counts = items => ['critico','atencao','intermediario','adequado'].map(level => items.filter(item => item.faixa === level).length);
  assert.equal(national.descritores.length, 68);
  assert.deepEqual(counts(national.descritores), [16,36,14,2]);
  assert.deepEqual(counts(national.descritores.filter(item => item.matriz2001)), [11,30,13,2]);
  assert.deepEqual(counts(national.descritores.filter(item => !item.matriz2001)), [5,6,1,0]);
  assert.deepEqual(data.coverage['Matemática'].missing, ['D30','D32']);
  assert.equal(national.kpis.totalEstudantes, null);
  assert.equal(national.kpis.totalRespostas, 108327336);
  assert.equal(national.kpis.totalUFs, 27);
});

test('D14 de LP mantém acertos observados ao alternar a métrica', () => {
  for (const metric of ['ponderado','simples']) {
    const d14 = summarize(data.rows, data.catalog, metric).descritores.find(item => item.DS_DISCIPLINA === 'Língua Portuguesa' && item.CO_DESCRITOR === 'D14');
    assert.equal(d14.TOTAL_RESPOSTAS, 2974143);
    assert.equal(d14.TOTAL_ACERTOS, 1428768);
    approx(d14.pct, metric === 'ponderado' ? 49.44453943380041 : 48.039653775894436);
  }
});

test('limiares usam os valores sem arredondamento, incluindo os limites exatos', () => {
  assert.deepEqual([39.9999,40,59.9999,60,69.9999,70].map(value => classifyPerformance(value).faixa), ['critico','atencao','atencao','intermediario','intermediario','adequado']);
  assert.equal(validThresholds({criticoMax:40,atencaoMax:40,intermediarioMax:70}), false);
  assert.equal(validThresholds({criticoMax:40,atencaoMax:60,intermediarioMax:101}), false);
  assert.equal(validThresholds({criticoMax:40,atencaoMax:60,intermediarioMax:70}), true);
});

test('percentuais ponderados agregam os pesos, não as contagens brutas', () => {
  const rows = [
    {TOTAL_RESPOSTAS:100,TOTAL_ACERTOS:90,PESO_TOTAL_RESPOSTAS:10,PESO_TOTAL_ACERTOS:9},
    {TOTAL_RESPOSTAS:10,TOTAL_ACERTOS:1,PESO_TOTAL_RESPOSTAS:100,PESO_TOTAL_ACERTOS:10},
  ];
  approx(rate(rows, 'ponderado'), 100 * 19/110);
  approx(rate(rows, 'simples'), 100 * 91/110);
  assert.equal(rate([], 'ponderado'), null);
});

test('eixos distinguem códigos iguais de componentes diferentes e preservam zero', () => {
  const rows = [
    {DS_DISCIPLINA:'Língua Portuguesa',CO_DESCRITOR:'D1',TOTAL_RESPOSTAS:10,TOTAL_ACERTOS:9,PESO_TOTAL_RESPOSTAS:10,PESO_TOTAL_ACERTOS:9},
    {DS_DISCIPLINA:'Matemática',CO_DESCRITOR:'D1',TOTAL_RESPOSTAS:10,TOTAL_ACERTOS:0,PESO_TOTAL_RESPOSTAS:10,PESO_TOTAL_ACERTOS:0},
  ];
  const items = summarize(rows, data.catalog, 'ponderado').descritores;
  assert.equal(axisRate(items, 'Língua Portuguesa', ['D1'], 'ponderado'), 90);
  assert.equal(axisRate(items, 'Matemática', ['D1'], 'ponderado'), 0);
  assert.equal(axisRate(items, 'Matemática', ['D2'], 'ponderado'), null);
  const expected = [57.719279869696784, 64.90459985182353, 46.26153922373489, 49.99088011429004, 55.942984604020445];
  GLOBAL_AXES.forEach((axis,i) => approx(axisRate(national.descritores, axis.disc, axis.codes, 'ponderado'), expected[i]));
});

test('recortes reais de UF, rede e componente, sem simular dados ausentes', () => {
  const selected = filterRows(data.rows, {...filters, uf:'Paraná', rede:'Pública', componente:'Matemática'});
  assert.ok(selected.length > 0);
  assert.ok(selected.every(row => row.NM_UF === 'Paraná' && row.TP_REDE === 'Pública' && row.DS_DISCIPLINA === 'Matemática'));
  assert.equal(summarize(selected,data.catalog,'ponderado').kpis.totalUFs,1);
  for (const update of [{anoEscolar:'5º Ano EF'}, {escola:'Escola inexistente'}, {municipio:'Curitiba'}, {localizacao:'Rural'}, {uf:'UF inexistente'}]) {
    assert.equal(filterRows(data.rows,{...filters,...update}).length,0);
  }
});

test('as três consultas da interface utilizam os mesmos somatórios publicados', async () => {
  let calls = 0;
  global.fetch = async url => { assert.equal(url, '/data/saeb-2023-9ef.json'); calls++; return {ok:true,json:async () => data}; };
  const api = require('../.test-build/services/api.js');
  const result = await api.fetchSaebDescritores(filters);
  approx(result.kpis.mediaGeral,53.84301666289195);
  const simple = await api.fetchSaebDescritores({...filters,metrica:'simples'});
  approx(simple.kpis.mediaGeral,51.833635048497825);
  const states = await api.fetchSaebUfs({...filters,rede:'Privada',componente:'Matemática'});
  const parana = states.ufs.find(row => row.NM_UF === 'Paraná');
  approx(parana.pct,rate(filterRows(data.rows,{...filters,rede:'Privada',componente:'Matemática',uf:'Paraná'}),'ponderado'));
  const equity = await api.fetchSaebEquidade(filters);
  assert.equal(equity.items.length,68);
  assert.equal(calls,1);
});
