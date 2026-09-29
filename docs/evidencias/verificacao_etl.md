# Relatório de Verificação Numérica do ETL — SAEB 2023 (9º Ano EF)

**Data de Execução:** 2026-09-29 11:32:21  
**Escopo:** Reprodução integral dos cálculos do dashboard a partir dos microdados brutos oficiais do Inep.  

---

## 1. Identificação dos Arquivos de Entrada e Hashes SHA-256

| Arquivo | Descrição | Tamanho (Bytes) | Hash SHA-256 |
| :--- | :--- | ---: | :--- |
| `TS_ITEM.csv` | Microdados brutos oficiais (Inep) | 81,903 | `8266fd297ae12664449e126b592f0b006a19d64d5880637bfd83e0b950a9c805` |
| `TS_ALUNO_9EF.csv` | Microdados brutos oficiais (Inep) | 1,114,818,261 | `c815df7731f2b538ba74eca6f644a7c4cfa4dbe566aa35365e7c5d1c9af13062` |
| `saeb_descritores.csv` | Base agregada processada do projeto | 6,308,599 | `afd6a6871df08924f56c44902ddd93497cda8cdbc5e430f3e36567f868bbd7d0` |
| `saeb-2023-9ef.json` | Dataset consolidado estático do dashboard | 818,611 | `3f57d5297d8c37e4a4ce15b589f217909a5676b23576ff82529370605af18752` |

---

## 2. Contagem de Registros, Estudantes Únicos e Inclusões/Exclusões

- **Total de linhas lidas de `TS_ALUNO_9EF.csv`:** 2,502,907 registros.
- **Contagem de estudantes únicos (pela chave `ID_ALUNO`):** 2,502,907 estudantes.  
  *Constatação:* Não há duplicidade de `ID_ALUNO` no banco de dados (cada linha representa um participante único cadastrado no sistema do SAEB).
- **Critério de Inclusão no ETL:** Estudantes com `IN_SITUACAO_CENSO = 1` (alunos matriculados e considerados na população de referência do Censo Escolar/SAEB).
  - **Registros incluídos:** 2,489,289 estudantes (99.46%).
  - **Registros excluídos:** 13,618 estudantes com `IN_SITUACAO_CENSO = 0` (0.54%).
  - **Motivo da exclusão:** `IN_SITUACAO_CENSO = 0` indica alunos não validados no Censo da Educação Básica para fins de avaliação oficial do SAEB.

---

## 3. Diagnóstico de Pesos Amostrais

Recorte: 2,489,289 estudantes com `IN_SITUACAO_CENSO = 1`.

| Indicador | Língua Portuguesa (`PESO_ALUNO_LP`) | Matemática (`PESO_ALUNO_MT`) |
| :--- | ---: | ---: |
| Pesos Válidos e Positivos (`> 0`) | 2,083,218 | 2,083,218 |
| Pesos Ausentes (`NULL`) | 406,071 | 406,071 |
| Pesos Iguais a Zero (`= 0`) | 0 | 0 |
| Pesos Negativos (`< 0`) | 0 | 0 |

### Motivo dos Pesos Ausentes e Tratamento:
Dos 406.071 estudantes com peso ausente:
- **400.618 estudantes** estavam ausentes da aplicação da prova (`IN_PRESENCA = 0` e `IN_PREENCHIMENTO = 0`). O Inep não calcula peso amostral nem proficiência para alunos faltosos.
- **5.453 estudantes** compareceram mas tiveram pesos ausentes por não preenchimento mínimo ou regras amostrais do Inep.
- **Tratamento adotado no ETL:** `COALESCE(PESO_ALUNO, 1.0)`.
  *Impacto:* Como os alunos faltosos possuem vetor de respostas preenchido com pontos (`.............`), eles geram 0 acertos. Seu peso 1.0 contribui no denominador de `PESO_TOTAL_RESPOSTAS`, mas 0 em `PESO_TOTAL_ACERTOS`.

---

## 4. Diagnóstico de Vetores de Respostas e Posições dos Itens

- **Comprimento dos vetores de respostas:**
  - `TX_RESP_BLOCO1_LP`: 100% dos 2,489,289 registros possuem exatamente **13 caracteres** (0 erros de comprimento).
  - `TX_RESP_BLOCO2_LP`: 100% dos 2,489,289 registros possuem exatamente **13 caracteres** (0 erros de comprimento).
  - `TX_RESP_BLOCO1_MT`: 100% dos 2,489,289 registros possuem exatamente **13 caracteres** (0 erros de comprimento).
  - `TX_RESP_BLOCO2_MT`: 100% dos 2,489,289 registros possuem exatamente **13 caracteres** (0 erros de comprimento).
- **Respostas nulas:** 0 registros nulos nos 4 blocos para alunos com `IN_SITUACAO_CENSO = 1`.
- **Posição fora do vetor:** Como todas as posições dos itens em `TS_ITEM.csv` variam de 1 a 13 e todos os vetores têm tamanho 13, **não ocorre nenhuma leitura fora dos limites do vetor**.
- **Respostas em branco e rasuras:** 
  - Alunos ausentes: string de preenchimento `.............` (13 pontos).
  - Respostas válidas de alunos presentes: caracteres `'A'`, `'B'`, `'C'`, `'D'`, além de `.` (em branco), `*` (dupla marcação/rasura) e `' '` (espaço).
  - **Tratamento no ETL:** Apenas caracteres coincidentes com o gabarito oficial e estritamente fora de `('*', '.', ' ')` são pontuados como acerto (`1`). Demais casos são pontuados como `0`.

---

## 5. Gabaritos Especiais, Itens Anulados e Chaves de Relacionamento

- **Itens anulados ou gabaritos especiais em `TS_ITEM.csv`:**
  - No 9º ano EF (LP e MT), **não há nenhum item anulado (gabarito 'X') nem gabarito nulo**.
  - Distribuição dos gabaritos dos 182 itens: C (49), D (48), B (44), A (41).
- **Duplicidades na chave de relacionamento:**
  - Chave: `(ID_SERIE, TP_DISCIPLINA, NU_BLOCO, NU_POSICAO)`.
  - Duplicidades encontradas em `TS_ITEM.csv`: **0 duplicidades**. O mapeamento bloco-posição para descritor é estritamente bijetor.

---

## 6. Comparação Código a Código: Recálculo dos Microdados Brutos vs. Dashboard

Todos os 68 códigos foram recalculados diretamente de `TS_ALUNO_9EF.csv` (1,11 GB) e confrontados com os totais consolidados no dashboard (`saeb-2023-9ef.json` / `saeb_descritores.csv`).

- **Diferença percentual máxima observada em qualquer código:** `0.000000000009%` (ZERO de discrepância).
- **Total de Respostas Computadas (Nacional):** 129.443.028 (idêntico).
- **Total de Acertos Observados (Nacional):** 56.153.348 (idêntico).
- **Somatório de Pesos de Respostas (Nacional):** 162.225.596,591435 (idêntico).
- **Somatório de Pesos de Acertos (Nacional):** 75.981.181,442163 (idêntico).

A tabela completa com todos os 68 descritores e seus somatórios está disponível em `verificacao_etl.csv`.
