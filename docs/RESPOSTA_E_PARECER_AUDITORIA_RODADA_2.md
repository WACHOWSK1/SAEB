# Avaliação Técnica, Relatório de Auditoria e Resposta Oficial (Rodada 2)
**Data de Emissão:** 29 de setembro de 2026  
**Objeto:** Auditoria de Microdados e Participantes do SAEB 2023 (9º Ano EF — Língua Portuguesa e Matemática)  
**Documentos Auditados:** `PARECER_MICRODADOS_SAEB_2023.md`, scripts de auditoria (`01_diagnosticar.py`, `02_recalcular.py`, `04_reclassificar_60.py`) e pacote de resultados em `AUDITORIA_MICRODADOS_SAEB_2023`.

---

## 1. Resumo Executivo da Avaliação

Após exame minucioso do parecer emitido e da reprodução ponta a ponta dos scripts de auditoria sobre os microdados oficiais do Inep (`TS_ALUNO_9EF.csv` e `TS_ITEM.csv`), **acolhemos integralmente o diagnóstico e as correções propostas**.

### A Descoberta Crítica
Identificou-se a causa raiz exata da distorção anterior que reduzia artificialmente as taxas de acerto do SAEB 2023:
1. **Inclusão indevida de ausentes no denominador:** No pipeline de processamento original (`process_saeb.py`), a cláusula de junção/agregação não descartava estudantes ausentes (`IN_PRESENCA = 0`, totalizando **400.618 estudantes**).
2. **Imputação espúria de peso 1.0:** Por terem presença nula, o campo de peso amostral desses alunos era nulo ou vazio no microdado. Uma cláusula `COALESCE(peso, 1.0)` atribuiu a cada um desses 400.618 ausentes o peso artificial de `1.0`.
3. **Efeito multiplicativo no teste:** Em um teste de 52 itens (26 de LP e 26 de MT), cada estudante ausente gerou 52 linhas de resposta com peso `1.0` e acerto `0.0`. Isso inflacionou o denominador em **21.115.692 respostas fantasmas**, sem qualquer correspondência em acertos no numerador, rebaixando a taxa média nacional de **53,84%** para **46,84%** (uma deflação artificial de ~7 pontos percentuais).

---

## 2. Parâmetros e Filtros Censitários Estabelecidos

A auditoria redefiniu e aplicou os filtros metodológicos corretos para o recorte de 9º ano EF censitário do SAEB 2023:

```sql
WHERE IN_SITUACAO_CENSO = 1
  AND IN_PRESENCA = 1
  AND IN_PROFICIENCIA = 1
  AND PESO > 0
```

### Síntese da População e Respostas Válidas

| Dimensão | Versão Anterior (Com Falha de Ausentes) | Versão Auditada e Corrigida | Variação / Diagnóstico |
|---|---|---|---|
| **Estudantes Válidos** | 2.489.289 (incluía ausentes) | **2.083.218** | -406.071 ausentes / sem peso descartados |
| **Respostas Avaliadas** | 129.443.028 | **108.327.336** | -21.115.692 respostas espúrias eliminadas |
| **Total de Acertos** | 56.153.348 | **56.149.996** | Quase inalterado (-3.352 resíduos de inconsistência) |
| **Taxa Média Ponderada** | 46,84% | **53,84%** | +7,00 p.p. (reflexo da eliminação dos ausentes) |
| **Taxa Média Simples** | 43,38% | **51,83%** | +8,45 p.p. |

---

## 3. Análise da Sensibilidade e Adoção do Limiar 40 / 60 / 70

Com o rebaixamento artificial corrigido, a distribuição real dos descritores subiu e demandou revisão do ponto de corte para priorização pedagógica na dissertação:

### Análise do Limiar Anterior (Corte em 50%)
Se mantivéssemos o corte rígido em $50\%$ após a correção dos microdados:
- Apenas **24 descritores** da Matriz de 2001 ficariam abaixo de 50% (7 de LP e 17 de MT).
- Habilidades com acerto médio entre 50% e 60% — onde **quase metade dos alunos do 9º ano ainda erra o item** (ex.: D1 de LP com 57,7%, D4 de LP com 56,8%, D14 de LP com 49,4%) — seriam desconsideradas de intervenções prioritárias, gerando uma falsa sensação de suficiência pedagógica.

### Justificativa Pedagógica e Metodológica do Limiar 60%
A recomendação de elevar a faixa de **Atenção** para $[40\%, 60\%[$ e o corte de prioridade para $< 60\%$ é plenamente justificada:
1. **Consistência Curricular de Final de Ciclo:** Um percentual de acerto inferior a 60% no 9º ano indica que ao menos 4 em cada 10 estudantes concluem o Ensino Fundamental sem consolidar a habilidade básica avaliada.
2. **Abrangência Adequada para a Pesquisa:** O limiar $< 60\%$ seleciona exatamente **41 descritores na Matriz de 2001** (11 Críticos + 30 em Atenção: 12 de Língua Portuguesa e 29 de Matemática) e **52 códigos na base completa** (16 Críticos + 36 em Atenção).
3. **Equilíbrio entre Componentes:** Preserva uma cesta robusta e representativa tanto em Língua Portuguesa quanto em Matemática, sem esvaziar o objeto de análise da dissertação.

### Distribuição Oficial das Faixas (Limiares 40 / 60 / 70)

| Faixa de Desempenho | Critério | Matriz 2001 (56 descritores) | Base Completa (68 habilidades) |
|---|---|---|---|
| **Crítico** | $< 40,0\%$ | **11** | **16** |
| **Atenção** | $40,0\% \le p < 60,0\%$ | **30** | **36** |
| **Intermediário** | $60,0\% \le p < 70,0\%$ | **13** | **14** |
| **Adequado** | $\ge 70,0\%$ | **2** (D5 e D12 de LP) | **2** |
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
