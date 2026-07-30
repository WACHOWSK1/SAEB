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

1. **Estatísticas e Percentuais Ponderados Reais:**
   - Validados todos os 68 descritores oficiais diretamente da base agrupada em Parquet (`saeb_descritores.parquet`).
   - Corrigidos percentuais de fallback em `api.ts` para baterem 100% com o cálculo ponderado oficial do INEP (`PESO_TOTAL_ACERTOS * 100 / PESO_TOTAL_RESPOSTAS`).
2. **Alinhamento das Faixas de Aprendizagem (Backend vs Frontend):**
   - Atualizada a regra em `src/api/server.py` para utilizar 4 faixas alinhadas com o frontend:
     - 🔴 **Crítico:** < 40,0%
     - 🟠 **Atenção:** 40,0% – 50,0%
     - 🟡 **Intermediário:** 50,0% – 70,0%
     - 🟢 **Adequado:** ≥ 70,0%
3. **Substituição de KPIs Fictícios:**
   - Removidos cards com valores não deriváveis da base agrupada ("Escolas Avaliadas" e "Municípios Participantes").
   - Adicionados dois KPIs ancorados em dados reais: **"Descritores em Nível Crítico"** e **"UFs Analisadas (27)"**.
4. **Filtros e Interface Visual:**
   - Filtro de UF ajustado para nomes por extenso (`São Paulo`, `Rio de Janeiro`) correspondentes aos microdados.
   - Inserção da logo da **UTFPR / PPG FCET** no espaço central do menu lateral entre "Metodologia e Dados" e "Escopo da Base".

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
