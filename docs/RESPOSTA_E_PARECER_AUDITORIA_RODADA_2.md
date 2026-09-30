# Avaliação Técnica, Relatório de Auditoria e Resposta Oficial (Rodada 2)
**Data de Emissão:** 29 de setembro de 2026  
**Objeto:** Auditoria de Microdados e Participantes do SAEB 2023 (9º Ano EF — Língua Portuguesa e Matemática)  
**Documentos Auditados:** `PARECER_MICRODADOS_SAEB_2023.md`, scripts de auditoria (`01_diagnosticar.py`, `02_recalcular.py`, `04_reclassificar_60.py`) e pacote de resultados em `AUDITORIA_MICRODADOS_SAEB_2023`.

---

## 1. Resumo Executivo da Avaliação

Após exame minucioso do parecer emitido e da reprodução ponta a ponta dos scripts de auditoria sobre os microdados oficiais do Inep (`TS_ALUNO_9EF.csv` e `TS_ITEM.csv`), **acolhemos integralmente o diagnóstico e as correções propostas**.

### A Descoberta Crítica
Identificou-se a causa raiz exata da distorção anterior que reduzia artificialmente as taxas de acerto do SAEB 2023:
1. **Inclusão indevida de registros sem peso no denominador:** No pipeline de processamento original (`process_saeb.py`), a cláusula de junção/agregação não descartava registros sem peso amostral válido. Foram contabilizados **406.071 registros sem peso**, correspondendo a **400.618 estudantes ausentes** (`IN_PRESENCA = 0`) mais **5.453 outros registros** sem peso positivo ou sem proficiência apurada.
2. **Imputação espúria de peso 1.0:** Por terem peso nulo ou vazio, uma cláusula `COALESCE(peso, 1.0)` atribuiu a esses 406.071 registros o peso artificial de `1.0`.
3. **Efeito multiplicativo no teste:** Em um teste de 52 itens (26 de LP e 26 de MT), esses registros inflacionaram o denominador em **21.115.692 respostas espúrias** e continham **3.352 acertos observados** (portanto, o conjunto excluído não continha apenas zeros). Essa inflação do denominador com acerto quase nulo rebaixou a taxa média nacional ponderada de **53,84%** para **46,84%** (uma deflação artificial de ~7 pontos percentuais).

---

## 2. Parâmetros e Filtros para o Conjunto de Estudantes Elegíveis

A auditoria redefiniu e aplicou os filtros metodológicos para a seleção do **conjunto de estudantes elegíveis para a análise ponderada** do 9º ano EF do SAEB 2023:

```sql
WHERE IN_SITUACAO_CENSO = 1
  AND IN_PRESENCA = 1
  AND IN_PROFICIENCIA = 1
  AND PESO > 0
```

> **Precisão conceitual sobre o universo e indicadores:**
> 1. A consistência com o Censo Escolar (`IN_SITUACAO_CENSO = 1`) não transforma o recorte, que inclui a rede privada com desenho amostral, em uma população integralmente censitária. Por isso, a denominação metodologicamente correta é **conjunto de estudantes elegíveis para a análise ponderada**.
> 2. O campo `IN_PROFICIENCIA_LP` e `IN_PROFICIENCIA_MT` é o **indicador disponibilizado pelo Inep** no dicionário dos microdados para atestar que o estudante respondeu a pelo menos três itens no caderno conjunto de Língua Portuguesa e Matemática, qualificando o caderno como válido para inclusão nas análises de proficiência e peso amostral.

### Síntese dos Totais e Acertos (Observados vs. Ponderados)

| Dimensão | Versão Anterior (Sem Filtro de Elegibilidade) | Versão Auditada e Corrigida | Variação / Diagnóstico |
|---|---|---|---|
| **Estudantes Elegíveis** | 2.489.289 (incluía ausentes e sem peso) | **2.083.218** | -406.071 registros sem peso descartados |
| **Respostas a Itens Computadas** | 129.443.028 | **108.327.336** | -21.115.692 respostas espúrias eliminadas |
| **Contagem de Acertos Observados** | 56.153.348 | **56.149.996** | -3.352 acertos observados no conjunto descartado |
| **Soma Ponderada de Respostas** | 162.225.596,59 | **141.109.904,59** | Base ponderada oficial do plano amostral |
| **Soma Ponderada de Acertos** | 75.981.181,44 | **75.977.829,44** | Acertos ponderados legítimos |
| **Taxa Média Ponderada** | 46,84% | **53,84%** | Razão exata: 75.977.829,44 / 141.109.904,59 |
| **Taxa Média Simples** | 43,38% | **51,83%** | Razão exata: 56.149.996 / 108.327.336 |

---

## 3. Análise da Sensibilidade e Adoção do Limiar 40 / 60 / 70

Com o rebaixamento artificial corrigido, a distribuição real dos descritores subiu e demandou revisão do ponto de corte para priorização pedagógica na dissertação:

### Análise do Limiar Anterior (Corte em 50%)
Se mantivéssemos o corte rígido em $50\%$ após a correção dos microdados:
- Apenas **24 descritores** da Matriz de 2001 ficariam abaixo de 50%, sendo **2 de Língua Portuguesa** (D7 com 48,35% e D14 com 49,44%) e **22 de Matemática**.
- Exemplos de percentuais ponderados em Língua Portuguesa evidenciam a importância dessa escolha:
  - **D1 (LP):** **62,37%** (faixa Intermediário, acima de 60%);
  - **D4 (LP):** **59,38%** (faixa Atenção, pertencente ao intervalo de 50% a 60%);
  - **D14 (LP):** **49,44%** (faixa Atenção, abaixo de 50%).
  - *Nota:* Somente **D4** pertence ao intervalo de 50% a 60% entre esses três exemplos (ao lado de outros descritores de LP como D6 com 59,90%, D15 com 56,72%, D3 com 56,69% e D9 com 56,53%). Manter o corte em 50% descartaria da seleção da pesquisa habilidades que, na interpretação e decisão metodológica do pesquisador para a elaboração de atividades interdisciplinares, merecem atenção formativa, como D4 e D6.

### Justificativa Pedagógica e Metodológica do Limiar 60%
A recomendação de elevar a faixa de **Atenção** para $[40\%, 60\%[$ e o corte de prioridade para $< 60\%$ é plenamente justificada:
1. **Interpretação Pedagógica e Decisão do Pesquisador:** O indicador afere respostas a itens, com ponderação, sem constituir escala ou critério psicométrico validado pelo Inep. Sob a perspectiva metodológica adotada pelo pesquisador nesta dissertação, percentuais ponderados abaixo de 60% são interpretados como indicativo de vulnerabilidade no rendimento nos itens avaliados na etapa de conclusão do Ensino Fundamental. A justificativa adotada para a dissertação ao utilizar o limite de 60% é ampliar o repertório de habilidades contempladas para subsidiar a elaboração de atividades interdisciplinares, sem conferir a esse ponto de corte o estatuto de validação psicométrica. Ressalta-se que o indicador afere respostas a itens e não mede diretamente quantos estudantes individuais dominam ou deixam de dominar a habilidade na perspectiva psicométrica de traço latente.
2. **Abrangência Adequada para a Pesquisa:** O limiar $< 60\%$ seleciona exatamente **41 descritores na Matriz de 2001** (11 Críticos + 30 em Atenção: 12 de Língua Portuguesa e 29 de Matemática) e **52 códigos na base completa** (16 Críticos + 36 em Atenção).
3. **Equilíbrio entre Componentes:** Preserva uma cesta robusta e representativa tanto em Língua Portuguesa quanto em Matemática, sem esvaziar o objeto de análise da dissertação.

### Distribuição segundo os critérios definidos para a pesquisa (Limiares 40 / 60 / 70)

| Faixa de Desempenho | Critério da Pesquisa | Matriz 2001 (56 descritores) | Base Completa (68 habilidades) |
|---|---|---|---|
| **Crítico** | $< 40,0\%$ | **11** | **16** |
| **Atenção** | $40,0\% \le p < 60,0\%$ | **30** | **36** |
| **Intermediário** | $60,0\% \le p < 70,0\%$ | **13** | **14** |
| **Adequado** | $\ge 70,0\%$ | **2** (D5 e D18 de LP) | **2** |
| **TOTAL PRIORITÁRIO** | **$< 60,0\%$ (Crítico + Atenção)** | **41** | **52** |

---

## 4. Atualizações Realizadas no Repositório e no Dashboard

1. **Reprocessamento da Base de Dados:**
   - O arquivo `data/processed/saeb_descritores.csv` e `saeb_descritores.parquet` foi atualizado com as 9.828 linhas conferidas de 9º ano EF (LP e MT).
   - O extrato estático `frontend/public/data/saeb-2023-9ef.json` foi regenerado via `scripts/export_static_data.py`.
2. **Configuração de Limiares no Frontend:**
   - Atualizado o padrão em `frontend/src/types/saeb.ts` para `{ criticoMax: 40.0, atencaoMax: 60.0, intermediarioMax: 70.0 }`.
   - Atualizada a fundamentação textual e a interface interativa em `frontend/src/app/metodologia/page.tsx`.
3. **Bateria de Testes Automatizados:**
   - O conjunto de 8 testes em `frontend/tests/data.test.cjs` foi atualizado com as marcas canônicas exatas da auditoria (108.327.336 respostas, 53,84% ponderado, 51,83% simples, D14 com 49,44% ponderado / 48,04% simples, e faixas `[16, 36, 14, 2]` / `[11, 30, 13, 2]`).
   - Todos os 8 testes executados e aprovados (`pass 8, fail 0`).
4. **Construção de Produção:**
   - Executado `next build` com Turbopack; 12 rotas estáticas pré-renderizadas com sucesso sem erros.
5. **Preservação de Evidências:**
   - Todos os artefatos de diagnóstico, comparação e sensibilidade da Rodada 2 foram incorporados em `docs/auditoria_rodada_2/`.
