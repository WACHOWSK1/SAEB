# 📌 Estado Atual do Projeto · Plataforma SAEB 2023 (9º Ano EF)

> **Arquivo de Recuperação de Contexto e Retomada Rápida**  
> **Última Atualização:** 30 de Julho de 2026

---

## 🎯 1. Visão Geral e Regras de Negócio Estritas

- **Escopo Exclusivo:** SAEB 2023 — 9º ano do Ensino Fundamental.
- **Componentes Curriculares:** Língua Portuguesa (24 descritores) e Matemática (44 descritores) — Total de 68 descritores oficiais.
- **Proibição Estrita:** Sem séries históricas fictícias, sem comparações com 2021/2019, sem dados inventados. Exibe "Dado não disponível" quando o campo não consta nos microdados.
- **Identidade Visual:** Padrão Ant Design / Tailwind com paleta institucional (`#FFCC00`, `#202124`, `#F5F5F5`).

---

## 📦 2. Controle de Versão (Git)

- **Repositório:** Git inicializado localmente no workspace.
- **Autor/Email:** Bruno Soares (`bsoares9288@gmail.com`)
- **Commit Inicial Realizado:** `cceacfb` — *"feat: commit inicial da Plataforma SAEB 2023 9º Ano EF (Backend FastAPI, Frontend Next.js/Tailwind/AntD, ETL DuckDB)"*
- **Arquivos Rastreados:** 51 arquivos fonte (ETL Python, Backend FastAPI, Frontend Next.js 16/React 19, componentes AntD, ECharts, TanStack Table, microdados processados e artefatos).

---

## 🛡️ 3. Resumo da Auditoria Completa Realizada

1. **Auditoria Oficial das Matrizes do INEP (PDF 2001 vs Microdados 2023):**
   - Cruzados todos os 344 itens do 9º Ano EF em `TS_ITEM.csv`: exatamente 24 descritores de Língua Portuguesa e 44 de Matemática (total de 68 descritores).
   - **Correção Crítica no Descritor D35 de Matemática:** Foi detectada e corrigida uma atribuição errônea histórica. D35 estava descrito como tabelas/gráficos e alocado em Estatística/Probabilidade; na Matriz Oficial do SAEB (Quadro 2 do INEP), D35 é **"Identificar a relação entre as representações algébrica e geométrica de um sistema de equações do 1º grau"**, pertencente ao eixo **Álgebra e Funções**. A correção foi aplicada em `frontend/src/services/api.ts`, `RadarDimensionsChart.tsx`, `src/api/server.py` e `src/dashboard/app.py`.
   - **Enriquecimento Textual Canônico:** Textos literais de D2, D20, D21 (LP) e D2, D5, D7, D8, D24, D37 (MT) alinhados 100% com o documento do INEP.
2. **Estatísticas e Percentuais Ponderados Reais:**
   - Validados todos os 68 descritores oficiais diretamente da base agrupada em Parquet (`saeb_descritores.parquet`) e `TS_ALUNO_9EF.csv`.
   - Conferência automatizada de precisão: 0 divergências entre os cálculos ponderados da base e os dados servidos na interface.
3. **Resiliência do Pipeline de ETL:**
   - `src/etl/process_saeb.py` atualizado com detecção dinâmica e resiliente do caminho de microdados em múltiplos ambientes.
4. **Alinhamento das Faixas de Aprendizagem (Backend vs Frontend):**
   - Atualizada a regra em `src/api/server.py` para utilizar 4 faixas alinhadas com o frontend:
     - 🔴 **Crítico:** < 40,0%
     - 🟠 **Atenção:** 40,0% – 50,0%
     - 🟡 **Intermediário:** 50,0% – 70,0%
     - 🟢 **Adequado:** ≥ 70,0%
5. **Substituição de KPIs Fictícios:**
   - Removidos cards com valores não deriváveis da base agrupada ("Escolas Avaliadas" e "Municípios Participantes").
   - Adicionados dois KPIs ancorados em dados reais: **"Descritores em Nível Crítico"** e **"UFs Analisadas (27)"**.
7. **Auditoria Metodológica Externa (68 Habilidades vs. 58 Tradicionais):**
   - **Origem dos 68 Códigos em `TS_ITEM.csv`:** A Matriz de Referência impressa de 2001 possui 58 descritores teóricos (21 LP + 37 MT). No entanto, nos microdados reais do SAEB 2023 (`TS_ITEM.csv` do 9º ano EF), existem exatamente **68 códigos únicos avaliados**:
     - **Língua Portuguesa (24 códigos):** 21 descritores tradicionais (D1 a D21) + 3 habilidades de transição BNCC (`H11`, `H12`, `H24`).
     - **Matemática (44 códigos):** 35 descritores tradicionais avaliados (D1 a D29, D31, D33 a D37; D30 e D32 não possuíram itens testados em 2023) + 9 habilidades alinhadas à BNCC (`9A1.3`, `9A2.1`, `9A2.2`, `9A2.3`, `9E2.1`, `9N1.1`, `9N1.5`, `9N1.6`, `9N1.7`).
   - **Impacto nos Níveis de Desempenho:**
     - Base Completa (68 habilidades): 23 Críticos (< 40%) e 26 em Atenção (40–50%).
     - Matriz Clássica Apenas (56 descritores D): 16 Críticos e 22 em Atenção.
     - Itens de Transição BNCC (12 habilidades): 7 Críticos, 4 em Atenção e 1 Adequado.
   - **Distinção Estatística entre Estudantes e Respostas (D14):**
     - O valor de 3.553.706 no descritor D14 de Língua Portuguesa refere-se ao somatório de respostas aos 5 itens de prova que avaliaram esse descritor no modelo de Bloco Incompleto Balanceado (BIB), e **não** ao total de estudantes únicos (que totaliza ~2,49 milhões no Brasil).
     - Rótulo corrigido na interface para **"Total de Respostas Computadas"** com nota técnica explicativa.

---

## 🏗️ 4. Arquitetura do Sistema

```
SAEB/
├── data/processed/
│   ├── saeb_descritores.parquet  (Base oficial agrupada SAEB 2023 9EF)
│   └── saeb_descritores.csv
├── src/
│   ├── api/
│   │   └── server.py             (FastAPI Backend - Porta 8000)
│   └── etl/
│       └── process_saeb.py       (ETL DuckDB de Alta Performance)
└── frontend/                     (Next.js 16 + React + TypeScript + Ant Design + ECharts)
    └── src/
        ├── app/                  (VisaoGeral, Descritores, Habilidades, Territorial, Metodologia)
        ├── components/           (Layout, Filters, KPI Cards, ECharts, TanStack Table)
        └── services/api.ts       (Conexão API FastAPI com fallback fidedigno aos microdados)
```

---

## 🚀 5. Comandos de Inicialização Rápida

```bash
# Terminal 1 - Backend FastAPI (Porta 8000)
python src/api/server.py

# Terminal 2 - Frontend Next.js (Porta 3000)
cd frontend
npm run start -- -p 3000
```
