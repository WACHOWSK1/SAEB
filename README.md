# Dashboard de Descritores do SAEB 📊

## Site estático — revisão e auditoria dos microdados (29/09/2026)

O site Next.js em `frontend/` utiliza os somatórios recalculados e auditados a partir dos microdados oficiais do **SAEB 2023 (9º ano EF, Língua Portuguesa e Matemática)**.

### Resultados da Auditoria dos Microdados (Rodada 2):
- **População censitária válida**: 2.083.218 estudantes (`IN_SITUACAO_CENSO = 1`, `IN_PRESENCA = 1`, `IN_PROFICIENCIA = 1`, `PESO > 0`).
- **Respostas a itens avaliadas**: 108.327.336 respostas (eliminando 21.115.692 pesos artificiais de 400.618 estudantes ausentes imputados indevidamente no processamento anterior).
- **Taxa média ponderada nacional**: **53,84%** (simples: 51,83%).
- **Critério de prioridade pedagógica (40 / 60 / 70)**:
  - **Crítico**: $< 40\%$ (11 descritores na Matriz 2001 | 16 na base completa)
  - **Atenção**: $40\% \le p < 60\%$ (30 descritores na Matriz 2001 | 36 na base completa)
  - **Intermediário**: $60\% \le p < 70\%$ (13 descritores na Matriz 2001 | 14 na base completa)
  - **Adequado**: $\ge 70\%$ (2 descritores na Matriz 2001: D5 e D12 de LP)
  - **Prioritários para intervenção pedagógica ($< 60\%$)**: **41 descritores** da Matriz 2001 (12 LP, 29 MT) e **52 habilidades** no total.

Consulte os relatórios completos e evidências em [docs/auditoria_rodada_2/](docs/auditoria_rodada_2/) e [docs/REVISAO_SAEB_2023.md](docs/REVISAO_SAEB_2023.md).

```bash
python scripts/export_static_data.py
cd frontend
npm ci
npm test
npm run build
```

O comando de exportação deve ser executado novamente se o CSV agregado for alterado. Os testes de valores nacionais registram o arquivo conferido nesta revisão; atualize esses valores somente após validar uma nova extração. A pasta `frontend/out/` contém o site estático gerado. A configuração existente do Netlify continua publicando essa pasta.

Este projeto destina-se ao processamento e visualização exploratória dos dados do **SAEB (Sistema de Avaliação da Educação Básica)**, focado na análise da porcentagem de acertos por descritores das Matrizes de Referência.

---

## 📁 Estrutura de Pastas

```text
SAEB/
├── data/
│   ├── raw/                 # Coloque aqui os arquivos .csv fornecidos pelo INEP (ex: TS_ITEM.csv, TS_ALUNO_5EF.csv)
│   └── processed/           # Arquivos processados leves (.parquet) para o dashboard
├── src/
│   ├── etl/
│   │   └── process_saeb.py  # Script em Python/DuckDB para cruzar itens, descritores e respostas dos alunos
│   └── dashboard/
│       └── app.py           # Aplicação web interativa em Streamlit
├── requirements.txt         # Lista de dependências Python
└── README.md
```

---

## 🚀 Como Executar

### 1. Instalar as dependências

No terminal ou prompt de comando (com ambiente Python ativo):

```bash
pip install -r requirements.txt
```

### 2. Processar os Dados (quando você colocar os arquivos em `data/raw/`)

```bash
python src/etl/process_saeb.py
```

### 3. Rodar o Dashboard Interativo

```bash
streamlit run src/dashboard/app.py
```

O dashboard abrirá automaticamente no seu navegador padrão (geralmente em `http://localhost:8501`).
