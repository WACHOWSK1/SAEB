# Conferência independente dos microdados do Saeb 2023 — 9º ano EF

Data: 29 de setembro de 2026. Recorte: Brasil, redes pública e privada, Língua Portuguesa e Matemática. Esta conferência se refere ao arquivo original disponibilizado pelo pesquisador e à versão do agregado identificada abaixo.

## Resultado principal

A leitura integral do microdado confirmou a necessidade de corrigir o denominador anterior, que incluía estudantes sem peso oficial com peso substituto igual a 1. Após o recálculo e a definição expressa do critério metodológico desta pesquisa, ficam prioritários **41 descritores da matriz de 2001** (12 de Língua Portuguesa e 29 de Matemática), entre os 56 com itens efetivamente avaliados. Considerando todos os 68 códigos presentes em `TS_ITEM.csv`, ficam prioritários **52 códigos** (15 de Língua Portuguesa e 37 de Matemática).

O pesquisador definiu as faixas operacionais: Crítico, percentual ponderado de acerto inferior a 40%; Atenção, de 40% até menos de 60%. Intermediário corresponde a 60% até menos de 70%, e Adequado, a 70% ou mais. Esses rótulos e limites não são categorias oficiais do Inep; o percentual por código também não equivale a um nível de proficiência na escala do Saeb. Para documentar a decisão após a análise exploratória, o parecer conserva uma comparação com o limite de 50% inicialmente examinado. A mudança amplia o conjunto de conteúdos disponíveis para planejar atividades interdisciplinares; ela não altera as respostas brutas nem o cálculo dos percentuais.

Os 2.502.907 registros e os 406.071 pesos ausentes relatados pela outra IA foram confirmados diretamente no CSV. O agregado antigo foi reproduzido numericamente, antes de aplicar os filtros de caderno válido, presença e peso positivo. A correção desses filtros altera os percentuais; a posterior escolha do limite de 60% altera apenas a seleção. Ambas as decisões são documentadas separadamente.

## Arquivos e rastreabilidade

- `TS_ALUNO_9EF.csv`: 1.114.818.261 bytes; SHA-256 `c815df7731f2b538ba74eca6f644a7c4cfa4dbe566aa35365e7c5d1c9af13062`.
- `TS_ITEM.csv`: 81.903 bytes; SHA-256 `8266fd297ae12664449e126b592f0b006a19d64d5880637bfd83e0b950a9c805`.
- Agregado anterior `saeb_descritores.csv`, usado para a contraprova: SHA-256 `7410099ca267b7f3e3674815b133fdf28ee0c4bd04409e23b5d1e386cfb1b6e9`. É a cópia com finais de linha LF; outro padrão de finais de linha pode mudar o hash sem mudar os números.
- Pasta de origem fornecida pelo pesquisador: [INEP — Drive](https://drive.google.com/drive/folders/1s_8Qtqtynb_ogVctTtjvdMXZ072lrYYa).
- Processamento em DuckDB 1.5.6, com leitura estrita, sem ignorar erros de linhas. Todos os resultados deste parecer foram calculados; os scripts e as saídas estão no pacote.

Foram lidos 2.502.907 registros, com 2.502.907 identificadores distintos. Não houve divergência de edição ou etapa. O arquivo de itens contém 182 itens objetivos de LP/MT para o 9º ano, 91 por componente, com chave única de componente/bloco/posição e gabaritos A, B, C ou D. Permanecem confirmados os 68 códigos: 24 de LP e 44 de MT. Destes, 56 são descritores D da matriz de 2001 e 12 são códigos adicionais. D30 e D32 de Matemática não têm itens nesse recorte.

## Composição da população analisada

As categorias abaixo são mutuamente exclusivas. Os indicadores de presença, de caderno válido e os pesos coincidem entre LP e MT neste arquivo.

| Situação | Estudantes |
|---|---:|
| Inconsistentes com o Censo (`IN_SITUACAO_CENSO=0`) | 13.618 |
| Consistentes com o Censo, ausentes da aplicação | 400.618 |
| Consistentes e presentes, sem caderno válido (`IN_PROFICIENCIA=0`) | 5.309 |
| Consistentes, presentes e com caderno válido, mas sem peso oficial | 144 |
| Consistentes, presentes, com caderno válido e peso positivo: população ponderada | **2.083.218** |
| Total de registros | **2.502.907** |

Entre os 2.489.289 registros consistentes com o Censo, há 406.071 sem peso. São 400.618 ausentes, 5.309 presentes sem caderno válido e 144 presentes com caderno válido. Portanto, os 5.453 presentes sem peso não constituem um único grupo metodológico. A causa específica da ausência de peso dos 144 estudantes não foi inferida apenas a partir do arquivo de alunos.

Há 2.083.362 estudantes presentes com caderno válido. A diferença de 144 em relação à população ponderada é mantida separada na análise de sensibilidade da métrica simples.

## Critério utilizado no recálculo

Para cada componente curricular, entraram na métrica ponderada os registros que atendem simultaneamente a:

```text
IN_SITUACAO_CENSO = 1
IN_PRESENCA_LP/MT = 1
IN_PROFICIENCIA_LP/MT = 1
PESO_ALUNO_LP/MT > 0, não ausente
```

O dicionário define `IN_PROFICIENCIA_LP` e `IN_PROFICIENCIA_MT` como indicadores de pelo menos três itens respondidos no caderno conjunto de Língua Portuguesa e Matemática. Esse indicador evita inventar um critério de três respostas em cada componente.

**Não foi exigido `IN_PREENCHIMENTO=1` em cada componente.** Existem 648 estudantes em LP e 864 em MT com esse indicador igual a zero, mas presentes, com caderno válido e peso positivo. O caderno é conjunto. Excluir esses registros somente pelo indicador de preenchimento criaria outro recorte e não reproduziria o critério declarado acima.

Cada resposta foi associada ao gabarito por componente, bloco e posição. Os quatro vetores têm 13 caracteres em todos os registros consistentes com o Censo; não há blocos sem correspondência nem caracteres fora do conjunto previsto. Resposta A/B/C/D igual ao gabarito conta como acerto. Branco e marcação nula de estudante elegível permanecem no denominador e não geram acerto. Ausência do estudante é tratada pela exclusão do registro, antes da apuração dos itens.

Para cada código, o percentual é a razão entre a soma dos pesos das respostas corretas e a soma dos pesos de todas as oportunidades de resposta computadas para seus itens, multiplicada por 100. O peso do estudante acompanha cada item a que ele foi exposto. Não se calcula a média dos percentuais já agregados nem se substitui peso ausente por 1.

O arquivo corrigido para integração usa a mesma população de 2.083.218 estudantes para as métricas ponderada e simples; a simples apenas retira a ponderação. A alternativa simples com todos os 2.083.362 cadernos válidos foi calculada em coluna separada (`pct_simples_todos_validos`) para tornar explícita essa escolha.

## Efeito sobre os resultados

| Recorte | Processamento | Crítico | Atenção | Intermediário | Adequado | Prioritários |
|---|---|---:|---:|---:|---:|---:|
| Todos os 68 códigos | Processamento anterior | 23 | 42 | 3 | 0 | 65 |
| Todos os 68 códigos | Recálculo auditado | 16 | 36 | 14 | 2 | 52 |
| 56 descritores D | Processamento anterior | 16 | 37 | 3 | 0 | 53 |
| 56 descritores D | Recálculo auditado | 11 | 30 | 13 | 2 | 41 |

Sob o limite de 60%, o processamento anterior selecionaria 53 descritores D ou 65 códigos no conjunto completo; esses resultados são reproduzidos apenas para mostrar o efeito da correção dos dados. No recálculo auditado, ficam 41 descritores D (11 Críticos e 30 em Atenção) ou 52 códigos no conjunto completo (16 Críticos e 36 em Atenção). Os 11 códigos adicionais abaixo de 60% não foram misturados à seleção principal de 41 descritores.

Como análise de sensibilidade, manter o limite anterior de 50% nos **mesmos percentuais já corrigidos** selecionaria 24 descritores D e 33 códigos na base completa. A diferença de 24 para 41 — e de 33 para 52 — resulta exclusivamente da escolha metodológica do limite. Os valores não foram arredondados antes da classificação.

| Indicador de conferência — todos os 68 códigos | Agregado anterior | Recálculo auditado |
|---|---:|---:|
| Respostas computadas | 129.443.028 | 108.327.336 |
| Acertos observados | 56.153.348 | 56.149.996 |
| Percentual ponderado global das respostas | 46,84% | 53,84% |

O agregado anterior continha **21.115.692 unidades artificiais de peso** no denominador, decorrentes da substituição de 406.071 pesos ausentes por 1 em 52 oportunidades de resposta. No recálculo, 3.352 acertos presentes nesses registros também foram retirados do numerador. O percentual global é apenas uma conferência dos somatórios das respostas; não é a proficiência oficial do Saeb nem a média simples dos percentuais por descritor.

| Exemplo | Percentual anterior | Percentual corrigido | Faixa de pesquisa com limite de 60% |
|---|---:|---:|---|
| LP — D14 | 43,01% | 49,44% | Atenção |
| LP — D20 | 43,87% | 50,47% | Atenção |
| LP — D6 | 52,11% | 59,90% | Atenção |
| MT — D22 | 43,38% | 49,87% | Atenção |
| MT — D15 | 12,78% | 14,70% | Crítico |

O D14 de Língua Portuguesa possui 2.974.143 oportunidades de resposta computadas, 1.428.768 acertos e 49,4445394338% de acerto ponderado após a correção. Isso representa ocorrências de estudante × item, não estudantes únicos.

### Seleção principal — 41 descritores da matriz de 2001

| Componente | Código | Percentual ponderado | Faixa |
|---|---|---:|---|
| Língua Portuguesa | D2 | 54,45% | Atenção |
| Língua Portuguesa | D3 | 56,69% | Atenção |
| Língua Portuguesa | D4 | 59,38% | Atenção |
| Língua Portuguesa | D6 | 59,90% | Atenção |
| Língua Portuguesa | D7 | 48,35% | Atenção |
| Língua Portuguesa | D9 | 56,53% | Atenção |
| Língua Portuguesa | D10 | 57,17% | Atenção |
| Língua Portuguesa | D14 | 49,44% | Atenção |
| Língua Portuguesa | D15 | 56,72% | Atenção |
| Língua Portuguesa | D19 | 54,77% | Atenção |
| Língua Portuguesa | D20 | 50,47% | Atenção |
| Língua Portuguesa | D21 | 56,82% | Atenção |
| Matemática | D1 | 58,20% | Atenção |
| Matemática | D3 | 41,70% | Atenção |
| Matemática | D4 | 38,30% | Crítico |
| Matemática | D5 | 53,82% | Atenção |
| Matemática | D6 | 37,86% | Crítico |
| Matemática | D7 | 43,90% | Atenção |
| Matemática | D8 | 16,80% | Crítico |
| Matemática | D9 | 48,84% | Atenção |
| Matemática | D10 | 35,03% | Crítico |
| Matemática | D11 | 37,13% | Crítico |
| Matemática | D12 | 37,42% | Crítico |
| Matemática | D13 | 48,97% | Atenção |
| Matemática | D14 | 52,95% | Atenção |
| Matemática | D15 | 14,70% | Crítico |
| Matemática | D18 | 36,29% | Crítico |
| Matemática | D19 | 52,97% | Atenção |
| Matemática | D20 | 50,97% | Atenção |
| Matemática | D21 | 48,04% | Atenção |
| Matemática | D22 | 49,87% | Atenção |
| Matemática | D23 | 46,16% | Atenção |
| Matemática | D24 | 41,67% | Atenção |
| Matemática | D26 | 31,31% | Crítico |
| Matemática | D27 | 46,26% | Atenção |
| Matemática | D29 | 51,09% | Atenção |
| Matemática | D31 | 31,93% | Crítico |
| Matemática | D33 | 56,02% | Atenção |
| Matemática | D34 | 44,57% | Atenção |
| Matemática | D35 | 25,95% | Crítico |
| Matemática | D36 | 40,91% | Atenção |

As listas completas de 41 descritores D e de 52 códigos na base completa constam de arquivos separados no pacote. Os limites de 40%, 60% e 70% são decisões do pesquisador para organizar a seleção pedagógica; a matriz oficial não define essas faixas.

## Uso na dissertação e no dashboard

A análise nacional de LP e Matemática, nas redes pública e privada, fornece um recorte descritivo para justificar o planejamento do produto educacional. Na elaboração das missões do *Torneio das Guildas dos Magos*, os 41 descritores D prioritários constituem o conjunto principal de referência para a seleção de conteúdos e desafios, com 12 de LP e 29 de Matemática. Essa seleção por percentual não obriga a usar todos os 41 em cada atividade nem demonstra domínio individual das habilidades.

A escolha de 60% foi explicitada após o exame inicial da distribuição de resultados. Por transparência, os dois limites foram confrontados sobre os percentuais auditados: 50% seleciona 24 descritores D; 60% seleciona 41. O motivo pedagógico declarado pelo pesquisador é ampliar o conjunto de descritores trabalháveis nas atividades interdisciplinares, particularmente em Língua Portuguesa. O limite não foi estabelecido ou recomendado pelo Inep, e a aplicação direta dos valores nacionais às turmas do Paraná deve ser contextualizada. Valores próximos a 60%, como LP/D6 (59,90%), não devem ser interpretados como diferenças substantivas comprovadas em relação aos descritores logo acima do limite: esta é uma análise descritiva, sem erros amostrais ou intervalos de confiança.

A presença dos 12 códigos adicionais nos microdados está comprovada. Sua função psicométrica específica não foi indicada explicitamente nos registros examinados; é prudente identificá-los à parte. A matriz de 2001 é a opção principal mais coerente com a divulgação dos resultados oficiais de LP e Matemática do 9º ano em 2023. O conjunto completo de 52 códigos pode ser apresentado como ampliação exploratória, se essa distinção ficar expressa.

Parágrafo metodológico proposto para a dissertação:

> Para orientar a seleção dos descritores contemplados no produto educacional, foram analisados os microdados do Saeb 2023 relativos ao 9º ano do Ensino Fundamental, considerando os componentes de Língua Portuguesa e Matemática, em âmbito nacional e nas redes pública e privada. Foram incluídos os estudantes com registros consistentes com o Censo Escolar, presentes na aplicação, com caderno válido segundo o indicador disponibilizado pelo Inep e peso amostral positivo. O percentual de acerto de cada descritor foi obtido pela razão entre a soma dos pesos das respostas corretas e a soma dos pesos das oportunidades de resposta computadas nos itens correspondentes. As respostas em branco ou nulas de estudantes elegíveis permaneceram no denominador, enquanto os registros sem peso foram excluídos do cálculo ponderado. Para fins desta pesquisa, foram estabelecidas duas faixas de priorização: Crítico, para percentuais inferiores a 40%, e Atenção, para percentuais iguais ou superiores a 40% e inferiores a 60%. O limite de 60% foi escolhido para ampliar o conjunto de descritores que poderia orientar a elaboração das atividades interdisciplinares; essas faixas não correspondem a níveis oficiais de proficiência do Inep. Entre os 56 descritores da matriz de 2001 com itens identificados na base, 41 atenderam a esses critérios: 12 de Língua Portuguesa e 29 de Matemática.

A classificação é autoral e deve aparecer na metodologia do produto educacional, com a fórmula de cálculo e a razão pedagógica do limite; os dados do Saeb contextualizam a escolha dos conteúdos, sem pretensão de diagnosticar individualmente os estudantes do projeto.

## Integração e reprodução

1. No ETL, aplicar o critério de elegibilidade descrito acima e remover a imputação de peso igual a 1.
2. Incorporar `saeb_descritores_9ef_lp_mt_corrigido.csv`, com 9.828 linhas de item × UF × rede. Ele contém apenas 9º EF, LP e MT; em uma base com outras etapas, substituir somente esse recorte.
3. Regenerar o JSON estático, o resumo e os gráficos do dashboard pelo agregado corrigido; manter percentuais como razões de somatórios.
4. Configurar as faixas **p < 40; 40 ≤ p < 60; 60 ≤ p < 70; p ≥ 70**, preservando a precisão integral ao classificar. Com filtro Brasil e ambas as redes, esperar 108.327.336 oportunidades de resposta, 41 descritores D ou 52 códigos em Crítico + Atenção, conforme o filtro de matriz.
5. Explicitar na interface que os limites são critérios da pesquisa, não categorias oficiais do Inep.

Para reproduzir as contas com Python, pandas e DuckDB, usando o CSV de alunos original e os demais arquivos do pacote:

```bash
python 01_diagnosticar.py --alunos TS_ALUNO_9EF.csv --itens TS_ITEM.csv --saida resultados
python 02_recalcular.py --saida resultados --dashboard-csv resultados/saeb_descritores_anterior_9ef_lp_mt.csv
python 04_reclassificar_60.py --saida resultados
```

O segundo script reproduz as contas e mantém a classificação de 50% apenas como análise de sensibilidade; o terceiro produz as seleções finais de 60%. `TS_ALUNO_9EF.csv` não acompanha o pacote. A cópia reduzida do agregado anterior contém apenas 9º EF LP/MT e tem hash distinto do agregado completo, mas preserva todos os valores utilizados na contraprova.

As verificações incluíram leitura estrita dos registros, reprodução do processamento antigo por código, identidades aritméticas dos denominadores, unicidade dos identificadores e das chaves de itens, integridade de todos os vetores e associação válida dos blocos. O pacote fornece uma versão dos dados pronta para integração; a atualização do site exige regeneração e publicação pela equipe responsável.

## Fontes documentais consultadas

- Inep. [Matrizes e Escalas do Saeb](https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/saeb/matrizes-e-escalas): manutenção da matriz de 2001 para LP e Matemática no 9º ano em 2023 e distinção entre matrizes e escalas de proficiência.
- Inep. [Leia-Me — Microdados do Saeb 2023](https://drive.google.com/file/d/1Y3VWRW4OZf8NeNHDqyQ2p-Y2yvQRmTYI/view), p. 10–11 e 13: consistência com o Censo, caderno válido, presença e pesos.
- Inep. [Dicionário dos microdados do Saeb 2023](https://docs.google.com/spreadsheets/d/1Q3nhC3NI8sttbmZkJxCg1iJ5rq2p9lIM/edit), aba `TS_ALUNO_9EF`: indicadores de presença, preenchimento, proficiência e peso.
- Inep. [Relatório de Amostragem do Saeb 2023](https://drive.google.com/file/d/1GoP_XGqF9MX33VfjZOILl_qZB2B3hKwa/view), p. 18 e 23–26 na numeração impressa: universo de expansão, pesos nulos e ponderação, incluindo a correção por não participação.
