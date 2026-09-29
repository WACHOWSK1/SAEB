import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import os

# ─── Page Config ─────────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="SAEB 2023 · 9º Ano EF · Descritores",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ─── Dicionário Oficial de Descritores SAEB/BNCC (9º Ano EF) ──────────────────────
DESCRITORES_LP = {
    'D1': 'Localizar informações explícitas em um texto',
    'D2': 'Estabelecer relações entre partes de um texto, identificando repetições ou substituições que contribuem para a continuidade de um texto',
    'D3': 'Inferir o sentido de uma palavra ou expressão',
    'D4': 'Inferir uma informação implícita em um texto',
    'D5': 'Interpretar texto com auxílio de material gráfico diverso (propagandas, quadrinhos, foto etc.)',
    'D6': 'Identificar o tema de um texto',
    'D7': 'Identificar a tese de um texto',
    'D8': 'Estabelecer relação entre a tese e os argumentos oferecidos para sustentá-la',
    'D9': 'Diferenciar as partes principais das secundárias em um texto',
    'D10': 'Identificar o conflito gerador do enredo e os elementos que constroem a narrativa',
    'D11': 'Estabelecer relação causa/consequência entre partes e elementos do texto',
    'D12': 'Identificar a finalidade de textos de diferentes gêneros',
    'D13': 'Identificar as marcas linguísticas que evidenciam o locutor e o interlocutor de um texto',
    'D14': 'Distinguir um fato da opinião relativa a esse fato',
    'D15': 'Estabelecer relações lógico-discursivas presentes no texto marcadas por conjunções, advérbios etc.',
    'D16': 'Identificar efeitos de ironia ou humor em textos variados',
    'D17': 'Reconhecer o efeito de sentido decorrente do uso da pontuação e de outras notações',
    'D18': 'Reconhecer o efeito de sentido decorrente da escolha de uma determinada palavra ou expressão',
    'D19': 'Reconhecer o efeito de sentido decorrente da exploração de recursos ortográficos e/ou morfossintáticos',
    'D20': 'Reconhecer diferentes formas de tratar uma informação na comparação de textos que tratam do mesmo tema',
    'D21': 'Reconhecer posições distintas entre duas ou mais opiniões relativas ao mesmo fato ou ao mesmo tema',
    'H11': 'Reconhecer recursos coesivos e conectivos que contribuem para a continuidade textual',
    'H12': 'Identificar a relação entre pronomes, advérbios e seus referentes no texto',
    'H24': 'Reconhecer o efeito de sentido decorrente do uso de recursos estilísticos e figuras de linguagem'
}

DESCRITORES_MT = {
    'D1': 'Identificar a localização/movimentação de objeto em mapas, croquis e outras representações gráficas',
    'D2': 'Identificar propriedades comuns e diferenças entre figuras bidimensionais e tridimensionais, relacionando-as com suas planificações',
    'D3': 'Identificar propriedades de triângulos pela comparação de medidas de lados e ângulos',
    'D4': 'Identificar relação entre quadriláteros por meio de suas propriedades',
    'D5': 'Reconhecer a conservação ou modificação de medidas dos lados, do perímetro, da área em ampliação e/ou redução de figuras poligonais usando malhas quadriculadas',
    'D6': 'Reconhecer ângulos como mudança de direção ou giros, identificando ângulos retos e não retos',
    'D7': 'Reconhecer que as imagens de uma figura construída por transformação homotética são semelhantes, identificando propriedades e/ou medidas que se modificam ou não se alteram',
    'D8': 'Resolver problema utilizando propriedades dos polígonos (soma de seus ângulos internos, número de diagonais, cálculo da medida de cada ângulo interno nos polígonos regulares)',
    'D9': 'Interpretar informações apresentadas por meio de coordenadas cartesianas',
    'D10': 'Utilizar relações métricas do triângulo retângulo para resolver problemas significativos',
    'D11': 'Reconhecer círculo/circunferência, seus elementos e algumas de suas relações',
    'D12': 'Resolver problema envolvendo o cálculo de perímetro de figuras planas',
    'D13': 'Resolver problema envolvendo o cálculo de área de figuras planas',
    'D14': 'Resolver problema envolvendo noções de volume',
    'D15': 'Resolver problema utilizando relações entre diferentes unidades de medida',
    'D16': 'Identificar a localização de números inteiros na reta numérica',
    'D17': 'Identificar a localização de números racionais na reta numérica',
    'D18': 'Efetuar cálculos com números inteiros envolvendo as quatro operações e potenciação',
    'D19': 'Resolver problema com números naturais envolvendo diferentes significados das operações',
    'D20': 'Resolver problema com números inteiros envolvendo as operações fundamentais',
    'D21': 'Reconhecer as diferentes representações de um número racional',
    'D22': 'Identificar fração como representação associada a diferentes significados (parte-todo, razão, quociente)',
    'D23': 'Identificar frações equivalentes',
    'D24': 'Reconhecer as representações decimais dos números racionais como uma extensão do sistema decimal',
    'D25': 'Efetuar cálculos que envolvam operações com números racionais',
    'D26': 'Resolver problema com números racionais que envolvam as operações fundamentais',
    'D27': 'Efetuar cálculos simples com valores aproximados de radicais',
    'D28': 'Resolver problema que envolva porcentagem',
    'D29': 'Resolver problema que envolva variação proporcional (direta ou inversa) entre grandezas',
    'D31': 'Resolver problema que envolva equação do 2º grau',
    'D33': 'Identificar uma equação ou inequação do 1º grau que expressa um problema',
    'D34': 'Identificar um sistema de equações do 1º grau que expressa um problema',
    'D35': 'Identificar a relação entre as representações algébrica e geométrica de um sistema de equações do 1º grau',
    'D36': 'Resolver problema envolvendo informações apresentadas em tabelas e/ou gráficos',
    'D37': 'Associar informações apresentadas em listas e/ou tabelas simples aos gráficos que as representam e vice-versa',
    '9A1.3': 'Resolver problemas que envolvam variação proporcional direta ou inversa',
    '9A2.1': 'Resolver problemas que envolvam equação do 1º grau',
    '9A2.2': 'Resolver problemas que envolvam sistema de equações do 1º grau',
    '9A2.3': 'Resolver problemas que envolvam equação do 2º grau',
    '9E2.1': 'Resolver problemas de contagem utilizando o princípio multiplicativo',
    '9N1.1': 'Resolver problemas com números naturais e operações fundamentais',
    '9N1.5': 'Resolver problemas que envolvam cálculo de porcentagens',
    '9N1.6': 'Resolver problemas que envolvam variação proporcional entre grandezas',
    '9N1.7': 'Resolver problemas com números racionais (frações e decimais)'
}

def get_desc_text(code, disc):
    if disc == 'Língua Portuguesa':
        return DESCRITORES_LP.get(code, f"Descritor {code}")
    elif disc == 'Matemática':
        return DESCRITORES_MT.get(code, f"Descritor {code}")
    return f"Descritor {code}"

# ─── Custom CSS (Turquoise & Analogous Palette) ──────────────────────────────────
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
    }

    .block-container {
        padding-top: 1.2rem;
        max-width: 1280px;
    }

    /* Hide modebar icons clutter */
    .js-plotly-plot .plotly .modebar {
        display: none !important;
    }

    /* Header Banner - Deep Turquoise Gradient */
    .dash-header {
        background: linear-gradient(135deg, #0A3641 0%, #0E6251 45%, #11998E 100%);
        border-radius: 16px;
        padding: 30px 36px;
        margin-bottom: 24px;
        color: white;
        box-shadow: 0 10px 25px -5px rgba(17, 153, 142, 0.25);
    }
    .dash-header h1 {
        font-size: 1.85rem;
        font-weight: 800;
        margin: 0 0 6px 0;
        letter-spacing: -0.02em;
        color: #FFFFFF;
    }
    .dash-header p {
        font-size: 0.95rem;
        color: #A7F3D0;
        margin: 0;
        font-weight: 400;
    }

    /* Section Headers */
    .sec-title {
        font-size: 1.2rem;
        font-weight: 800;
        color: #0F4C5C;
        margin-top: 24px;
        margin-bottom: 4px;
        letter-spacing: -0.01em;
    }
    .sec-subtitle {
        font-size: 0.85rem;
        color: #475569;
        margin-bottom: 16px;
    }

    /* KPI Cards */
    .kpi-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 14px;
        margin-bottom: 24px;
    }
    .kpi-card {
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-top: 4px solid #14B8A6;
        border-radius: 12px;
        padding: 16px 14px;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
        transition: transform 0.2s ease;
    }
    .kpi-card:hover {
        transform: translateY(-2px);
    }
    .kpi-label {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.07em;
        color: #64748B;
        font-weight: 700;
        margin-bottom: 4px;
    }
    .kpi-value {
        font-size: 1.75rem;
        font-weight: 800;
        color: #0F4C5C;
        line-height: 1.1;
    }
    .kpi-sub {
        font-size: 0.75rem;
        color: #64748B;
        margin-top: 4px;
    }

    .kpi-crit { border-top-color: #E63946; }
    .kpi-crit .kpi-value { color: #E63946; }
    .kpi-ok { border-top-color: #2A9D8F; }
    .kpi-ok .kpi-value { color: #2A9D8F; }

    /* Performance Band Legend Strip */
    .band-legend {
        display: flex;
        gap: 20px;
        align-items: center;
        padding: 10px 18px;
        background: #F0FDFA;
        border: 1px solid #CCFBF1;
        border-radius: 10px;
        margin-bottom: 16px;
        font-size: 0.82rem;
        font-weight: 600;
        color: #0F4C5C;
    }
    .band-dot {
        width: 12px;
        height: 12px;
        border-radius: 3px;
        display: inline-block;
        margin-right: 6px;
        vertical-align: middle;
    }
    .dot-crit { background: #E63946; }
    .dot-inter { background: #F4A261; }
    .dot-adeq { background: #2A9D8F; }

    /* Descriptor Cards Grid */
    .desc-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
        gap: 12px;
        margin-top: 12px;
    }
    .desc-item {
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-left: 4px solid #14B8A6;
        border-radius: 8px;
        padding: 12px 14px;
        font-size: 0.84rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
    }
    .desc-item-code {
        font-weight: 800;
        color: #0F4C5C;
        font-size: 0.9rem;
    }
    .desc-item-pct {
        float: right;
        font-weight: 800;
        font-size: 0.95rem;
    }
    .desc-item-text {
        color: #334155;
        margin-top: 4px;
        line-height: 1.35;
    }

    /* Sidebar Styling */
    [data-testid="stSidebar"] {
        background: linear-gradient(180deg, #F0FDFA 0%, #E6FFFA 100%);
    }

    /* Tab styles */
    .stTabs [data-baseweb="tab-list"] {
        gap: 6px;
        border-bottom: 2px solid #E2E8F0;
    }
    .stTabs [data-baseweb="tab"] {
        border-radius: 8px 8px 0 0;
        padding: 10px 18px;
        font-weight: 700;
        font-size: 0.9rem;
    }
</style>
""", unsafe_allow_html=True)

# ─── Header ──────────────────────────────────────────────────────────────────────
st.markdown("""
<div class="dash-header">
    <h1>📊 Painel de Descritores SAEB 2023 · 9º Ano EF</h1>
    <p>Análise Diagnóstica das Habilidades da Matriz de Referência — Língua Portuguesa e Matemática</p>
</div>
""", unsafe_allow_html=True)

# ─── Data Loading ────────────────────────────────────────────────────────────────
@st.cache_data
def load_saeb_data():
    data_dir = os.path.join(os.path.dirname(__file__), "..", "..", "data", "processed")
    pq_path = os.path.join(data_dir, "saeb_descritores.parquet")
    if os.path.exists(pq_path):
        df = pd.read_parquet(pq_path)
        # Scope filter: 9º Ano EF, LP & MT
        df = df[(df["ANO_ESCOLAR"] == "9º Ano EF") & (df["DS_DISCIPLINA"].isin(["Língua Portuguesa", "Matemática"]))]
        return df
    return pd.DataFrame()

df = load_saeb_data()

if df.empty:
    st.error("Nenhum dado encontrado em `data/processed/saeb_descritores.parquet`.")
    st.info("Execute primeiro: `python src/etl/process_saeb.py`")
    st.stop()

# ─── Sidebar Filters ────────────────────────────────────────────────────────────
st.sidebar.markdown("### 🎛️ Filtros de Análise")
st.sidebar.caption("Escopo: 9º Ano do Ensino Fundamental")

# Componente Curricular
sel_disc = st.sidebar.selectbox("Componente Curricular", ["Todos", "Língua Portuguesa", "Matemática"])

# Estado (UF)
ufs = sorted(df["NM_UF"].unique().tolist())
sel_uf = st.sidebar.selectbox("Estado (UF)", ["Brasil (Todos)"] + ufs)

# Rede de Ensino
sel_rede = st.sidebar.selectbox("Rede de Ensino", ["Todas", "Pública", "Privada"])

st.sidebar.markdown("---")
# Métrica
sel_metrica = st.sidebar.radio(
    "Métrica de Taxa de Acerto",
    ["Ponderada (Peso Amostral)", "Simples (Direta)"],
    help="A taxa ponderada utiliza os pesos amostrais dos alunos no SAEB para representar fidedignamente a população."
)

st.sidebar.markdown("---")
st.sidebar.caption("Fonte dos Microdados: INEP / MEC (2023)")

# ─── Data Filtering & Correct Aggregation ────────────────────────────────────────
fdf = df.copy()
if sel_disc != "Todos":
    fdf = fdf[fdf["DS_DISCIPLINA"] == sel_disc]
if sel_uf != "Brasil (Todos)":
    fdf = fdf[fdf["NM_UF"] == sel_uf]
if sel_rede != "Todas":
    fdf = fdf[fdf["TP_REDE"] == sel_rede]

def calculate_aggregated_pct(data_df, group_cols):
    """re-aggregates totals to avoid average-of-averages bias."""
    agg_dict = {
        "TOTAL_RESPOSTAS": ("TOTAL_RESPOSTAS", "sum"),
        "TOTAL_ACERTOS": ("TOTAL_ACERTOS", "sum"),
    }
    has_peso = "PESO_TOTAL_RESPOSTAS" in data_df.columns and "PESO_TOTAL_ACERTOS" in data_df.columns
    if has_peso:
        agg_dict["PESO_TOTAL_RESPOSTAS"] = ("PESO_TOTAL_RESPOSTAS", "sum")
        agg_dict["PESO_TOTAL_ACERTOS"] = ("PESO_TOTAL_ACERTOS", "sum")

    agg_df = data_df.groupby(group_cols, as_index=False).agg(**agg_dict)
    agg_df["PCT_SIMPLES"] = (agg_df["TOTAL_ACERTOS"] * 100.0 / agg_df["TOTAL_RESPOSTAS"]).round(1)
    if has_peso:
        agg_df["PCT_PONDERADO"] = (agg_df["PESO_TOTAL_ACERTOS"] * 100.0 / agg_df["PESO_TOTAL_RESPOSTAS"]).round(1)
    else:
        agg_df["PCT_PONDERADO"] = agg_df["PCT_SIMPLES"]
    return agg_df

active_pct_col = "PCT_PONDERADO" if "Ponderada" in sel_metrica else "PCT_SIMPLES"

# Aggregation by Descriptor
desc_df = calculate_aggregated_pct(fdf, ["DS_DISCIPLINA", "CO_DESCRITOR"])
desc_df["PCT"] = desc_df[active_pct_col]
desc_df["DS_HABILIDADE"] = desc_df.apply(lambda r: get_desc_text(r["CO_DESCRITOR"], r["DS_DISCIPLINA"]), axis=1)
desc_df = desc_df.sort_values("PCT", ascending=True)

# Colors for performance bands
def get_band_label(v):
    if v < 40.0:
        return "Crítico (< 40%)"
    elif v < 70.0:
        return "Intermediário (40–70%)"
    else:
        return "Adequado (> 70%)"

def get_band_color(v):
    if v < 40.0:
        return "#E63946"
    elif v < 70.0:
        return "#F4A261"
    else:
        return "#2A9D8F"

COLOR_MAP = {
    "Crítico (< 40%)": "#E63946",
    "Intermediário (40–70%)": "#F4A261",
    "Adequado (> 70%)": "#2A9D8F"
}

# ─── Section 1: KPI Cards ────────────────────────────────────────────────────────
if not desc_df.empty:
    has_peso_fdf = "PESO_TOTAL_ACERTOS" in fdf.columns and "PESO_TOTAL_RESPOSTAS" in fdf.columns
    if "Ponderada" in sel_metrica and has_peso_fdf:
        media_geral = (fdf["PESO_TOTAL_ACERTOS"].sum() * 100.0 / fdf["PESO_TOTAL_RESPOSTAS"].sum())
    else:
        media_geral = (fdf["TOTAL_ACERTOS"].sum() * 100.0 / fdf["TOTAL_RESPOSTAS"].sum())
    top_desc = desc_df.iloc[-1]
    worst_desc = desc_df.iloc[0]
    total_resp = fdf["TOTAL_RESPOSTAS"].sum()
    n_criticos = (desc_df["PCT"] < 40.0).sum()
    n_total = len(desc_df)

    st.markdown(f"""
    <div class="kpi-row">
        <div class="kpi-card">
            <div class="kpi-label">Média Geral de Acerto</div>
            <div class="kpi-value">{media_geral:.1f}%</div>
            <div class="kpi-sub">{n_total} descritores avaliados</div>
        </div>
        <div class="kpi-card kpi-ok">
            <div class="kpi-label">Maior Taxa (Ponto Forte)</div>
            <div class="kpi-value">{top_desc['PCT']:.1f}%</div>
            <div class="kpi-sub"><b>{top_desc['CO_DESCRITOR']}</b> · {top_desc['DS_DISCIPLINA']}</div>
        </div>
        <div class="kpi-card kpi-crit">
            <div class="kpi-label">Menor Taxa (Ponto Crítico)</div>
            <div class="kpi-value">{worst_desc['PCT']:.1f}%</div>
            <div class="kpi-sub"><b>{worst_desc['CO_DESCRITOR']}</b> · {worst_desc['DS_DISCIPLINA']}</div>
        </div>
        <div class="kpi-card kpi-crit">
            <div class="kpi-label">Descritores Críticos (&lt; 40%)</div>
            <div class="kpi-value">{n_criticos}</div>
            <div class="kpi-sub">{(n_criticos*100.0/n_total):.1f}% do total de habilidades</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-label">Total de Respostas</div>
            <div class="kpi-value">{total_resp:,.0f}</div>
            <div class="kpi-sub">no filtro selecionado</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

# ─── Navigation Tabs ─────────────────────────────────────────────────────────────
tab1, tab2, tab3, tab4, tab5 = st.tabs([
    "📊 Ranking por Descritor",
    "⚖️ Equidade: Pública vs Privada",
    "⭕ Distribuição por Faixas",
    "🗺️ Desempenho por Estado (UF)",
    "📖 Guia & Tabela Interativa"
])

PLOTLY_CONFIG = {'displayModeBar': False, 'staticPlot': False}

# ── TAB 1: Ranking por Descritor ─────────────────────────────────────────────────
with tab1:
    st.markdown('<div class="sec-title">Ranking de Desempenho por Descritor / Habilidade</div>', unsafe_allow_html=True)
    st.markdown('<div class="sec-subtitle">Abaixo estão apresentados todos os descritores ordenados pela taxa de acerto. A cor indica o nível de aprendizado.</div>', unsafe_allow_html=True)

    st.markdown("""
    <div class="band-legend">
        <span><span class="band-dot dot-crit"></span> Crítico (&lt; 40%) — Requer Intervenção Urgente</span>
        <span><span class="band-dot dot-inter"></span> Intermediário (40–70%) — Em Desenvolvimentos</span>
        <span><span class="band-dot dot-adeq"></span> Adequado (&gt; 70%) — Aprendizado Consolidado</span>
    </div>
    """, unsafe_allow_html=True)

    if not desc_df.empty:
        plot_df = desc_df.copy()
        plot_df["FAIXA"] = plot_df["PCT"].apply(get_band_label)

        # Formatted Y axis label: CODE + Short Description
        plot_df["Y_LABEL"] = plot_df.apply(
            lambda r: f"{r['CO_DESCRITOR']} — {r['DS_HABILIDADE'][:52]}…" if len(r['DS_HABILIDADE']) > 52 else f"{r['CO_DESCRITOR']} — {r['DS_HABILIDADE']}",
            axis=1
        )

        fig_rank = px.bar(
            plot_df,
            x="PCT",
            y="Y_LABEL",
            color="FAIXA",
            color_discrete_map=COLOR_MAP,
            orientation="h",
            custom_data=["CO_DESCRITOR", "DS_DISCIPLINA", "DS_HABILIDADE", "TOTAL_RESPOSTAS", "PCT"],
            category_orders={"FAIXA": ["Crítico (< 40%)", "Intermediário (40–70%)", "Adequado (> 70%)"]},
            height=max(560, len(plot_df) * 26)
        )

        # FIX: Avoid string format bug by creating exact bar labels
        fig_rank.update_traces(
            text=plot_df["PCT"].apply(lambda v: f" {v:.1f}%"),
            textposition="outside",
            textfont_size=11,
            hovertemplate=(
                "<b>%{customdata[0]}</b> · %{customdata[1]}<br>"
                "<b>Descrição:</b> %{customdata[2]}<br>"
                "<b>Taxa de Acerto:</b> %{customdata[4]:.1f}%<br>"
                "<b>Total de Respostas:</b> %{customdata[3]:,.0f}<extra></extra>"
            )
        )

        fig_rank.update_layout(
            xaxis=dict(title="Taxa de Acerto (%)", range=[0, max(plot_df["PCT"].max() + 12, 50)], gridcolor="#F1F5F9", zeroline=False),
            yaxis=dict(title="", tickfont_size=11, automargin=True),
            margin=dict(l=10, r=40, t=10, b=10),
            plot_bgcolor="#FFFFFF",
            paper_bgcolor="rgba(0,0,0,0)",
            legend=dict(orientation="h", yanchor="bottom", y=1.01, xanchor="center", x=0.5, font_size=11, title_text=""),
            bargap=0.22,
            hovermode="closest"
        )

        st.plotly_chart(fig_rank, use_container_width=True, config=PLOTLY_CONFIG)

# ── TAB 2: Equidade (Pública vs Privada) ─────────────────────────────────────────
with tab2:
    st.markdown('<div class="sec-title">Equidade Educacional: Rede Pública vs Rede Privada</div>', unsafe_allow_html=True)
    st.markdown('<div class="sec-subtitle">Análise das disparidades de aprendizagem entre as redes de ensino. O gráfico de divergência indica a vantagem em pontos percentuais da Rede Privada sobre a Pública.</div>', unsafe_allow_html=True)

    # Use complete dataset without rede filter for comparative
    comp_df = df.copy()
    if sel_disc != "Todos":
        comp_df = comp_df[comp_df["DS_DISCIPLINA"] == sel_disc]
    if sel_uf != "Brasil (Todos)":
        comp_df = comp_df[comp_df["NM_UF"] == sel_uf]

    rede_agg = calculate_aggregated_pct(comp_df, ["DS_DISCIPLINA", "CO_DESCRITOR", "TP_REDE"])
    rede_agg["PCT"] = rede_agg[active_pct_col]

    if not rede_agg.empty:
        pivot_rede = rede_agg.pivot_table(
            index=["DS_DISCIPLINA", "CO_DESCRITOR"],
            columns="TP_REDE",
            values="PCT"
        ).reset_index()

        if "Pública" in pivot_rede.columns and "Privada" in pivot_rede.columns:
            pivot_rede = pivot_rede.dropna(subset=["Pública", "Privada"])
            pivot_rede["GAP"] = (pivot_rede["Privada"] - pivot_rede["Pública"]).round(1)
            pivot_rede["DS_HABILIDADE"] = pivot_rede.apply(lambda r: get_desc_text(r["CO_DESCRITOR"], r["DS_DISCIPLINA"]), axis=1)
            pivot_rede = pivot_rede.sort_values("GAP", ascending=True)

            # Filter for view
            c_col1, c_col2 = st.columns([3, 1])
            with c_col2:
                disc_comp_filter = st.radio("Filtrar Disciplina", ["Todas", "Língua Portuguesa", "Matemática"], key="comp_disc_filter")

            pivot_show = pivot_rede.copy()
            if disc_comp_filter != "Todas":
                pivot_show = pivot_show[pivot_show["DS_DISCIPLINA"] == disc_comp_filter]

            pivot_show["Y_LABEL"] = pivot_show.apply(
                lambda r: f"{r['CO_DESCRITOR']} ({r['DS_DISCIPLINA'][:2]}) — {r['DS_HABILIDADE'][:45]}…",
                axis=1
            )

            with c_col1:
                # Diverging Gap Chart
                fig_gap = go.Figure()
                gap_colors = ["#14B8A6" if g >= 0 else "#E63946" for g in pivot_show["GAP"]]

                fig_gap.add_trace(go.Bar(
                    y=pivot_show["Y_LABEL"],
                    x=pivot_show["GAP"],
                    orientation="h",
                    marker_color=gap_colors,
                    text=pivot_show["GAP"].apply(lambda v: f" +{v:.1f} pp" if v >= 0 else f" {v:.1f} pp"),
                    textposition="outside",
                    textfont_size=10,
                    hovertemplate=(
                        "<b>%{y}</b><br>"
                        "Taxa Pública: " + pivot_show["Pública"].apply(lambda v: f"{v:.1f}%").values + "<br>"
                        "Taxa Privada: " + pivot_show["Privada"].apply(lambda v: f"{v:.1f}%").values + "<br>"
                        "<b>Desigualdade (Gap): %{x:.1f} pp</b><extra></extra>"
                    )
                ))

                fig_gap.add_vline(x=0, line_width=1.5, line_color="#64748B", line_dash="dash")

                fig_gap.update_layout(
                    height=max(480, len(pivot_show) * 24),
                    xaxis=dict(title="Vantagem da Rede Privada sobre a Pública (Pontos Percentuais)", gridcolor="#F1F5F9", zeroline=False),
                    yaxis=dict(title="", tickfont_size=10, automargin=True),
                    margin=dict(l=10, r=45, t=10, b=10),
                    plot_bgcolor="#FFFFFF",
                    paper_bgcolor="rgba(0,0,0,0)"
                )

                st.plotly_chart(fig_gap, use_container_width=True, config=PLOTLY_CONFIG)

            # Highlights Box
            avg_gap = pivot_rede["GAP"].mean()
            top_gap = pivot_rede.iloc[-1]
            min_gap = pivot_rede.iloc[0]

            st.markdown(f"""
            <div style="background:#F0FDFA; border: 1px solid #CCFBF1; border-radius: 12px; padding: 18px 22px; margin-top: 14px;">
                <h4 style="color:#0F4C5C; margin:0 0 10px 0;">💡 Destaques da Análise de Equidade (9º Ano EF)</h4>
                <p style="margin:0 0 6px 0; font-size:0.9rem; color:#334155;">
                    • <b>Desigualdade Média</b>: A Rede Privada apresenta uma taxa de acerto média <b>{avg_gap:.1f} pontos percentuais superior</b> à Rede Pública.
                </p>
                <p style="margin:0 0 6px 0; font-size:0.9rem; color:#334155;">
                    • <b>Maior Disparidade</b>: <b>{top_gap['CO_DESCRITOR']} ({top_gap['DS_DISCIPLINA']})</b> — <i>{top_gap['DS_HABILIDADE']}</i> com gap de <b>+{top_gap['GAP']:.1f} pp</b> (Privada: {top_gap['Privada']:.1f}% vs Pública: {top_gap['Pública']:.1f}%).
                </p>
                <p style="margin:0; font-size:0.9rem; color:#334155;">
                    • <b>Menor Disparidade</b>: <b>{min_gap['CO_DESCRITOR']} ({min_gap['DS_DISCIPLINA']})</b> — <i>{min_gap['DS_HABILIDADE']}</i> com gap de <b>+{min_gap['GAP']:.1f} pp</b>.
                </p>
            </div>
            """, unsafe_allow_html=True)

# ── TAB 3: Distribuição por Faixas (Donut Charts) ────────────────────────────────
with tab3:
    st.markdown('<div class="sec-title">Distribuição das Habilidades por Faixa de Aprendizado</div>', unsafe_allow_html=True)
    st.markdown('<div class="sec-subtitle">Proporção de descritores classificados nos níveis Crítico (&lt;40%), Intermediário (40-70%) e Adequado (&gt;70%).</div>', unsafe_allow_html=True)

    if not desc_df.empty:
        desc_df["FAIXA"] = desc_df["PCT"].apply(get_band_label)

        col_d1, col_d2 = st.columns(2)

        with col_d1:
            st.subheader("Geral (Língua Portuguesa + Matemática)")
            counts_geral = desc_df["FAIXA"].value_counts().reindex(["Crítico (< 40%)", "Intermediário (40–70%)", "Adequado (> 70%)"]).fillna(0)

            fig_donut = go.Figure(go.Pie(
                labels=counts_geral.index,
                values=counts_geral.values,
                hole=0.55,
                marker_colors=["#E63946", "#F4A261", "#2A9D8F"],
                textinfo="label+value+percent",
                hovertemplate="%{label}: <b>%{value} descritores</b> (%{percent})<extra></extra>"
            ))

            fig_donut.update_layout(
                height=340,
                margin=dict(l=20, r=20, t=20, b=20),
                paper_bgcolor="rgba(0,0,0,0)",
                legend=dict(orientation="h", yanchor="bottom", y=-0.15, xanchor="center", x=0.5),
                annotations=[dict(text=f"<b>{len(desc_df)}</b><br>Descritores", x=0.5, y=0.5, font_size=16, font_color="#0F4C5C", showarrow=False)]
            )

            st.plotly_chart(fig_donut, use_container_width=True, config=PLOTLY_CONFIG)

        with col_d2:
            st.subheader("Comparativo por Componente Curricular")

            disc_counts = []
            for d_name in ["Língua Portuguesa", "Matemática"]:
                sub = desc_df[desc_df["DS_DISCIPLINA"] == d_name]
                if not sub.empty:
                    c = sub["FAIXA"].value_counts().reindex(["Crítico (< 40%)", "Intermediário (40–70%)", "Adequado (> 70%)"]).fillna(0)
                    disc_counts.append((d_name, c))

            if disc_counts:
                fig_comp_bar = go.Figure()
                fig_comp_bar.add_trace(go.Bar(
                    name="Língua Portuguesa",
                    x=["Crítico", "Intermediário", "Adequado"],
                    y=[disc_counts[0][1].iloc[0], disc_counts[0][1].iloc[1], disc_counts[0][1].iloc[2]],
                    marker_color="#14B8A6",
                    text=[int(disc_counts[0][1].iloc[i]) for i in range(3)],
                    textposition="auto"
                ))

                if len(disc_counts) > 1:
                    fig_comp_bar.add_trace(go.Bar(
                        name="Matemática",
                        x=["Crítico", "Intermediário", "Adequado"],
                        y=[disc_counts[1][1].iloc[0], disc_counts[1][1].iloc[1], disc_counts[1][1].iloc[2]],
                        marker_color="#0F4C5C",
                        text=[int(disc_counts[1][1].iloc[i]) for i in range(3)],
                        textposition="auto"
                    ))

                fig_comp_bar.update_layout(
                    barmode="group",
                    height=340,
                    margin=dict(l=20, r=20, t=20, b=20),
                    yaxis=dict(title="Número de Descritores", gridcolor="#F1F5F9"),
                    plot_bgcolor="#FFFFFF",
                    paper_bgcolor="rgba(0,0,0,0)",
                    legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="center", x=0.5)
                )

                st.plotly_chart(fig_comp_bar, use_container_width=True, config=PLOTLY_CONFIG)

# ── TAB 4: Desempenho por Estado (UF) ────────────────────────────────────────────
with tab4:
    st.markdown('<div class="sec-title">Desempenho Médio por Unidade da Federação (UF)</div>', unsafe_allow_html=True)
    st.markdown('<div class="sec-subtitle">Taxa de acerto agregada por estado nos descritores do 9º Ano EF, comparada com a média nacional.</div>', unsafe_allow_html=True)

    uf_df = calculate_aggregated_pct(fdf, ["NM_UF"])
    uf_df["PCT"] = uf_df[active_pct_col]
    uf_df = uf_df.sort_values("PCT", ascending=False)

    if not uf_df.empty and len(uf_df) > 1:
        has_peso_fdf = "PESO_TOTAL_ACERTOS" in fdf.columns and "PESO_TOTAL_RESPOSTAS" in fdf.columns
        if "Ponderada" in sel_metrica and has_peso_fdf:
            media_br = (fdf["PESO_TOTAL_ACERTOS"].sum() * 100.0 / fdf["PESO_TOTAL_RESPOSTAS"].sum())
        else:
            media_br = (fdf["TOTAL_ACERTOS"].sum() * 100.0 / fdf["TOTAL_RESPOSTAS"].sum())

        fig_uf = go.Figure()

        fig_uf.add_trace(go.Bar(
            x=uf_df["NM_UF"],
            y=uf_df["PCT"],
            text=uf_df["PCT"].apply(lambda v: f"{v:.1f}%"),
            textposition="outside",
            textfont_size=9,
            marker=dict(
                color=uf_df["PCT"],
                colorscale=[[0, "#CCFBF1"], [0.5, "#14B8A6"], [1, "#0F4C5C"]]
            ),
            customdata=uf_df["TOTAL_RESPOSTAS"],
            hovertemplate="<b>%{x}</b><br>Taxa de Acerto: <b>%{y:.1f}%</b><br>Respostas: %{customdata:,.0f}<extra></extra>"
        ))

        fig_uf.add_hline(
            y=media_br,
            line_dash="dash",
            line_color="#E63946",
            line_width=2,
            annotation_text=f"Média Nacional: {media_br:.1f}%",
            annotation_position="top left",
            annotation_font=dict(size=12, color="#E63946", family="Inter")
        )

        fig_uf.update_layout(
            height=460,
            xaxis=dict(title="", tickangle=-45, tickfont_size=10),
            yaxis=dict(title="Taxa de Acerto (%)", range=[0, min(uf_df["PCT"].max() + 12, 100)], gridcolor="#F1F5F9"),
            margin=dict(l=20, r=20, t=30, b=80),
            plot_bgcolor="#FFFFFF",
            paper_bgcolor="rgba(0,0,0,0)"
        )

        st.plotly_chart(fig_uf, use_container_width=True, config=PLOTLY_CONFIG)
    elif len(uf_df) == 1:
        st.info(f"Estado selecionado: **{uf_df.iloc[0]['NM_UF']}** com taxa de acerto de **{uf_df.iloc[0]['PCT']:.1f}%**.")

# ── TAB 5: Guia & Tabela Interativa ──────────────────────────────────────────────
with tab5:
    st.markdown('<div class="sec-title">Catálogo Completo de Descritores & Tabela Interativa</div>', unsafe_allow_html=True)
    st.markdown('<div class="sec-subtitle">Explore a descrição textual detalhada de cada habilidade ou filtre e baixe a base agregada em CSV.</div>', unsafe_allow_html=True)

    t_col1, t_col2 = st.columns([2, 1])
    with t_col1:
        search_query = st.text_input("🔍 Buscar por Código (ex: D5), Palavra-chave ou Estado:", "", placeholder="Digite para filtrar a tabela abaixo...")
    with t_col2:
        st.metric("Total de Registros Exibidos", f"{len(fdf):,}")

    # Process table dataframe
    df_table = fdf.copy()
    df_table["PCT_ACERTO"] = df_table["PCT_ACERTO"].round(1)
    df_table["PCT_ACERTO_PONDERADO"] = df_table["PCT_ACERTO_PONDERADO"].round(1)
    df_table["DS_HABILIDADE"] = df_table.apply(lambda r: get_desc_text(r["CO_DESCRITOR"], r["DS_DISCIPLINA"]), axis=1)

    if search_query:
        mask = (
            df_table["CO_DESCRITOR"].str.contains(search_query, case=False, na=False) |
            df_table["DS_HABILIDADE"].str.contains(search_query, case=False, na=False) |
            df_table["NM_UF"].str.contains(search_query, case=False, na=False) |
            df_table["DS_DISCIPLINA"].str.contains(search_query, case=False, na=False)
        )
        df_table = df_table[mask]

    cols_order = ["DS_DISCIPLINA", "CO_DESCRITOR", "DS_HABILIDADE", "NM_UF", "TP_REDE", "TOTAL_RESPOSTAS", "TOTAL_ACERTOS", "PCT_ACERTO", "PCT_ACERTO_PONDERADO"]
    df_show = df_table[[c for c in cols_order if c in df_table.columns]].sort_values("PCT_ACERTO_PONDERADO", ascending=False)

    st.dataframe(
        df_show,
        column_config={
            "DS_DISCIPLINA": "Disciplina",
            "CO_DESCRITOR": "Código",
            "DS_HABILIDADE": "Descrição da Habilidade (Matriz SAEB)",
            "NM_UF": "Estado",
            "TP_REDE": "Rede",
            "TOTAL_RESPOSTAS": st.column_config.NumberColumn("Respostas", format="%d"),
            "TOTAL_ACERTOS": st.column_config.NumberColumn("Acertos", format="%d"),
            "PCT_ACERTO": st.column_config.NumberColumn("% Simples", format="%.1f%%"),
            "PCT_ACERTO_PONDERADO": st.column_config.NumberColumn("% Ponderado", format="%.1f%%"),
        },
        use_container_width=True,
        hide_index=True,
        height=480
    )

    csv_data = df_show.to_csv(index=False, sep=';', encoding='utf-8-sig').encode('utf-8-sig')
    st.download_button(
        "📥 Baixar Tabela Filtrada (CSV UTF-8)",
        data=csv_data,
        file_name="saeb_2023_9ef_descritores.csv",
        mime="text/csv",
        use_container_width=True
    )

# ─── Footer ──────────────────────────────────────────────────────────────────────
st.markdown("---")
st.caption("Dashboard de Análise Pedagógica dos Descritores do SAEB 2023 · 9º Ano do Ensino Fundamental · Desenvolvido com Python, DuckDB e Streamlit")
