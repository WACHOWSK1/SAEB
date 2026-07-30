# Dashboard de Descritores do SAEB 📊

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
