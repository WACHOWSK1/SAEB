# Dashboard de Descritores do SAEB 📊

## Site estático — revisão dos cálculos de 29/09/2026

O site Next.js em `frontend/` usa os somatórios reais de `data/processed/saeb_descritores.csv`, com recorte de 2023, 9º ano EF, LP e Matemática. O arquivo publicado é `frontend/public/data/saeb-2023-9ef.json`. As telas utilizam a mesma fonte estática; não dependem da API Python nem da variável `NEXT_PUBLIC_API_URL`.

Consulte [a revisão e seus limites](docs/REVISAO_SAEB_2023.md) antes de utilizar os resultados na pesquisa. A conferência do agregado **não substitui o reprocessamento dos microdados originais**. O ETL, a API Python e o Streamlit abaixo são componentes anteriores; não foram validados integralmente nesta revisão.

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
