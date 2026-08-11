import os
import json
import pandas as pd
from fastapi import FastAPI, Query
from fastapi.responses import HTMLResponse, StreamingResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

# ─── Load Reference Dictionary ──────────────────────────────────────────────────
DESCRITORES_LP = {
    'D1': 'Localizar informações explícitas em um texto',
    'D2': 'Estabelecer relações entre partes de um texto, identificando repetições ou substituições',
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
    'D20': 'Reconhecer diferentes formas de tratar uma informação na comparação de textos de um mesmo tema',
    'D21': 'Reconhecer posições distintas entre duas ou mais opiniões relativas ao mesmo fato ou tema',
    'H11': 'Reconhecer recursos coesivos e conectivos que contribuem para a continuidade textual',
    'H12': 'Identificar a relação entre pronomes, advérbios e seus referentes no texto',
    'H24': 'Reconhecer o efeito de sentido decorrente do uso de recursos estilísticos e figuras de linguagem'
}

DESCRITORES_MT = {
    'D1': 'Identificar a localização/movimentação de objeto em mapas, croquis e outras representações gráficas',
    'D2': 'Identificar propriedades comuns e diferenças entre figuras bidimensionais e tridimensionais',
    'D3': 'Identificar propriedades de triângulos pela comparação de medidas de lados e ângulos',
    'D4': 'Identificar relação entre quadriláteros por meio de suas propriedades',
    'D5': 'Reconhecer a conservação ou modificação de perímetro e área em ampliação/redução de polígonos em malhas',
    'D6': 'Reconhecer ângulos como mudança de direção ou giros, identificando ângulos retos e não retos',
    'D7': 'Reconhecer que as imagens de uma figura construída por transformação homotética são semelhantes',
    'D8': 'Resolver problema utilizando propriedades dos polígonos (soma de ângulos internos, número de diagonais)',
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
    'D24': 'Reconhecer representações decimais de números racionais como extensão do sistema decimal',
    'D25': 'Efetuar cálculos que envolvam operações com números racionais',
    'D26': 'Resolver problema com números racionais que envolvam as operações fundamentais',
    'D27': 'Efetuar cálculos simples com valores aproximados de radicais',
    'D28': 'Resolver problema que envolva porcentagem',
    'D29': 'Resolver problema que envolva variação proporcional (direta ou inversa) entre grandezas',
    'D31': 'Resolver problema que envolva equação do 2º grau',
    'D33': 'Identificar uma equação ou inequação do 1º grau que expressa um problema',
    'D34': 'Identificar um sistema de equações do 1º grau que expressa um problema',
    'D35': 'Associar informações apresentadas em tabelas simples a gráficos e vice-versa',
    'D36': 'Resolver problema envolvendo informações apresentadas em tabelas e/ou gráficos',
    'D37': 'Associar informações apresentadas em listas e/ou tabelas aos gráficos correspondentes',
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

DESCRITORES_EXTENDED = {
    # 2º Ano EF - Língua Portuguesa
    'H1.1': 'Identificar letras do alfabeto',
    'H1.2': 'Reconhecer diferentes formas gráficas de letras',
    'H2.1': 'Identificar o número de sílabas de uma palavra',
    'H2.2': 'Reconhecer a sílaba inicial ou final de palavras',
    'H4': 'Localizar informação explícita em textos curtos',
    'H5': 'Inferir informação em textos verbais e não-verbais',
    'H6': 'Identificar assunto principal de um texto',
    'H7': 'Reconhecer o gênero textual de um texto curto',
    'H8.1': 'Reconhecer pontuação de final de frase',
    'H8.2': 'Identificar efeitos de sentido decorrentes de pontuação/notação',
    'H9': 'Reconhecer o conflito gerador do enredo em textos narrativos curtos',

    # 2º Ano EF - Matemática
    '2A1.1': 'Resolver problemas de adição e subtração com números naturais',
    '2A1.2': 'Reconhecer contagem e ordenação de elementos',
    '2A1.3': 'Identificar composição e decomposição de números naturais',
    '2A1.4': 'Comparar quantidades de objetos de dois conjuntos',
    '2E1.1': 'Interpretar dados em tabelas simples',
    '2E1.2': 'Interpretar informações em gráficos de colunas',
    '2E1.3': 'Ler e organizar dados estatísticos elementares',
    '2G1.1': 'Identificar figuras geométricas espaciais',
    '2G1.2': 'Reconhecer figuras geométricas planas',
    '2G1.3': 'Identificar a localização de objetos no espaço',
    '2M1.1': 'Comparar comprimentos, massas e capacidades',
    '2M1.2': 'Identificar horas e medidas de tempo',
    '2M1.3': 'Comparar capacidades e massas utilizando termos de referência',
    '2M1.4': 'Reconhecer valores de moedas e cédulas do sistema monetário',
    '2M1.5': 'Reconhecer unidades de medida de tempo (dias, semanas, meses)',
    '2M1.6': 'Estimar e comparar durações de eventos e intervalos de tempo',
    '2M1.7': 'Ler horas inteiras e meias horas em relógios digitais ou analógicos',
    '2M2.1': 'Identificar equivalência de valores de cédulas e moedas',
    '2M2.2': 'Resolver problemas de compra e venda com dinheiro do sistema monetário',
    '2M2.3': 'Resolver problemas envolvendo o sistema monetário brasileiro',
    '2N1.1': 'Reconhecer e escrever a representação numérica de quantidades',
    '2N1.2': 'Comparar e ordenar números naturais pela compreensão do sistema decimal',
    '2N1.3': 'Identificar o valor posicional dos algarismos em números naturais',
    '2N1.4': 'Compor e decompor números naturais de até três ordens',
    '2N1.5': 'Estimar e comparar quantidades de objetos em conjuntos',
    '2N1.6': 'Resolver problemas de adição envolvendo as ideias de juntar e acrescentar',
    '2N1.7': 'Resolver problemas de subtração envolvendo as ideias de retirar e comparar',
    '2N1.8': 'Resolver problemas de multiplicação ou divisão com suporte de imagens',
    '2N2.1': 'Reconhecer a representação gráfica de números naturais',
    '2N2.2': 'Identificar frações unitárias ou partes de um conjunto de objetos',
    '2N2.3': 'Resolver problemas simples com ideias de metade e terça parte',

    # 5º Ano EF
    'H2': 'Reconhecer a sílaba tônica ou padrão silábico em palavras',
    'H8': 'Identificar a finalidade ou o assunto de textos instrucionais e informativos',
    'H13': 'Reconhecer o uso de pontuação como recurso expressivo',
    'H14': 'Distinguir o sentido de conjunções e conectivos em textos adaptados',
    '5E1.2': 'Ler dados expressos em tabelas de dupla entrada',
    '5G1.1': 'Identificar propriedades de polígonos e figuras planas',
    '5G1.4': 'Reconhecer vistas de objetos tridimensionais',
    '5G1.6': 'Identificar planificações de sólidos geométricos',
    '5G1.8': 'Reconhecer simetria de reflexão em figuras geométricas',
    '5M2.2': 'Resolver problemas envolvendo unidades de medida de tempo',
    '5N1.3': 'Resolver problemas com números naturais e operações fundamentais',
    '5N1.4': 'Identificar frações como representação associada à parte de um todo',
    '5N1.5': 'Reconhecer a representação decimal de números racionais',
    '5N1.8': 'Resolver problemas simples que envolvam porcentagem',
    '5N2.3': 'Resolver problemas com números racionais na representação decimal',
    '5N2.4': 'Identificar frações equivalentes em diferentes representações',
    '5N2.7': 'Efetuar adição ou subtração com números racionais decimais',

    # Ensino Médio
    'D32': 'Resolver problema envolvendo cálculo de probabilidade de um evento',

    # Ciências Humanas (CH)
    '1.0/A1': 'Analisar transformações sociais e territoriais no tempo e no espaço',
    '1.0/B1': 'Compreender formas de organização social, política e cultural',
    '1.0/C1': 'Identificar marcos históricos e diversidade de sujeitos sociais',
    '2.0/A2': 'Analisar a interação entre sociedade, natureza e espaço geográfico',
    '2.0/B2': 'Compreender a dinâmica populacional e os fluxos migratórios',
    '2.0/C2': 'Identificar os impactos ambientais da ação humana nos territórios',
    '3.0/A3': 'Reconhecer processos de ocupação, cidadania e constituição de direitos',
    '3.0/B3': 'Compreender lutas sociais e formas de representação política',
    '3.0/C3': 'Analisar a construção de identidades e patrimônios culturais',
    '4.0/A4': 'Reconhecer a diversidade cultural, direitos humanos e memórias históricas',
    '4.0/B4': 'Analisar relações de poder e geopolítica nos espaços urbanos e rurais',
    '4.0/C4': 'Compreender os meios de produção e o trabalho na sociedade contemporânea',
    '5.0/A5': 'Compreender a formação histórica das cidades e a urbanização',
    '5.0/B5': 'Analisar processos de migração e distribuição da população no território',
    '5.0/C5': 'Identificar os impactos socioambientais da expansão urbana e agrícola',
    '6.0/A6': 'Compreender a cidadania, Direitos Humanos e constituição das leis',
    '6.0/B6': 'Analisar lutas sociais, movimentos de resistência e inclusão',
    '6.0/C6': 'Identificar patrimônios materiais e imateriais e memória cultural',
    'A4': 'Analisar a organização geopolítica, fronteiras e estados nacionais',
    'A5': 'Compreender a dinâmica de crescimento urbano e transformações sociais',
    'A6': 'Analisar instâncias de participação democrática e direitos cidadãos',
    'B4': 'Compreender as redes de transporte, comunicação e a globalização',
    'B5': 'Analisar a estrutura demográfica e os movimentos migratórios',
    'B6': 'Compreender políticas públicas e movimentos de inclusão social',
    'C4': 'Analisar o desenvolvimento econômico, industrialização e o trabalho',
    'C5': 'Identificar problemas ambientais urbanos e rurais no espaço brasileiro',
    'C6': 'Analisar manifestações culturais, mídias e patrimônio histórico',

    # Ciências da Natureza (CN)
    'A1': 'Compreender matéria, energia e suas transformações no ambiente',
    'A2': 'Analisar processos biológicos, saúde humana e ecossistemas',
    'A3': 'Identificar fenômenos astronômicos, estrutura da Terra e sistema solar',
    'B1': 'Reconhecer propriedades dos materiais e ciclos da matéria na natureza',
    'B2': 'Analisar interações dos seres vivos, teias alimentares e biodiversidade',
    'B3': 'Compreender recursos hídricos, atmosféricos e sustentabilidade ambiental',
    'C1': 'Identificar fontes de energia, ondas, luz e som no cotidiano',
    'C2': 'Compreender hereditariedade, reprodução e funcionamento do corpo humano',
    'C3': 'Analisar o impacto de tecnologias e intervenções humanas na biosfera'
}

def get_desc_text(code, disc):
    if disc == 'Língua Portuguesa':
        return DESCRITORES_LP.get(code, DESCRITORES_EXTENDED.get(code, f"Descritor {code}"))
    elif disc == 'Matemática':
        return DESCRITORES_MT.get(code, DESCRITORES_EXTENDED.get(code, f"Descritor {code}"))
    return DESCRITORES_EXTENDED.get(code, f"Descritor {code}")

# ─── Load Parquet Dataset ────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_PATH = os.path.join(BASE_DIR, "data", "processed", "saeb_descritores.parquet")

if not os.path.exists(DATA_PATH):
    raise FileNotFoundError(f"Parquet data file not found at {DATA_PATH}")

df_raw = pd.read_parquet(DATA_PATH)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SAEB 2023 Multi-Ano API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve Web Static Files
WEB_DIR = os.path.join(BASE_DIR, "src", "web", "public")
os.makedirs(WEB_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory=WEB_DIR), name="static")

def filter_dataset(ano="9º Ano EF", disc="Todos", uf="Brasil (Todos)", rede="Todas"):
    fdf = df_raw.copy()
    if ano and ano not in ["Todos", "Todos os Anos"]:
        fdf = fdf[fdf["ANO_ESCOLAR"] == ano]
        
    if disc in ["Todos", "LP+MT"]:
        fdf = fdf[fdf["DS_DISCIPLINA"].isin(["Língua Portuguesa", "Matemática"])]
    elif disc not in ["Todas", "Todos", "Todas as Disciplinas"]:
        fdf = fdf[fdf["DS_DISCIPLINA"] == disc]
        
    if uf and uf not in ["Brasil (Todos)", "Brasil", "Todos"]:
        fdf = fdf[fdf["NM_UF"] == uf]
        
    if rede and rede not in ["Todas", "Todas as Redes"]:
        fdf = fdf[fdf["TP_REDE"] == rede]
        
    return fdf

@app.get("/")
def read_root():
    index_file = os.path.join(WEB_DIR, "index.html")
    if os.path.exists(index_file):
        with open(index_file, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse("<h1>API SAEB 2023 Ativa. Frontend index.html não localizado.</h1>")

@app.get("/api/meta")
def get_metadata():
    anos = sorted(df_raw["ANO_ESCOLAR"].unique().tolist())
    ufs = sorted(df_raw["NM_UF"].unique().tolist())
    disciplinas = ["Língua Portuguesa", "Matemática", "Ciências Humanas", "Ciências da Natureza"]
    redes = ["Todas", "Pública", "Privada"]
    return {
        "anos": ["Todos"] + anos,
        "ufs": ["Brasil (Todos)"] + ufs,
        "disciplinas": ["Todos"] + disciplinas,
        "redes": redes
    }

@app.get("/api/descritores")
def get_descritores(
    ano: str = Query("9º Ano EF"),
    disc: str = Query("Todos"),
    uf: str = Query("Brasil (Todos)"),
    rede: str = Query("Todas"),
    metrica: str = Query("ponderado")
):
    fdf = filter_dataset(ano, disc, uf, rede)
    if fdf.empty:
        return {"kpis": {}, "descritores": []}

    # Proper aggregation
    agg_dict = {
        "TOTAL_RESPOSTAS": ("TOTAL_RESPOSTAS", "sum"),
        "TOTAL_ACERTOS": ("TOTAL_ACERTOS", "sum")
    }
    has_peso = "PESO_TOTAL_RESPOSTAS" in fdf.columns and "PESO_TOTAL_ACERTOS" in fdf.columns
    if has_peso:
        agg_dict["PESO_TOTAL_RESPOSTAS"] = ("PESO_TOTAL_RESPOSTAS", "sum")
        agg_dict["PESO_TOTAL_ACERTOS"] = ("PESO_TOTAL_ACERTOS", "sum")

    agg_df = fdf.groupby(["DS_DISCIPLINA", "CO_DESCRITOR"], as_index=False).agg(**agg_dict)
    
    agg_df["pct_simples"] = (agg_df["TOTAL_ACERTOS"] * 100.0 / agg_df["TOTAL_RESPOSTAS"]).round(1)
    if has_peso:
        agg_df["pct_ponderado"] = (agg_df["PESO_TOTAL_ACERTOS"] * 100.0 / agg_df["PESO_TOTAL_RESPOSTAS"]).round(1)
    else:
        agg_df["pct_ponderado"] = agg_df["pct_simples"]

    use_pct = "pct_ponderado" if metrica == "ponderado" else "pct_simples"
    agg_df["pct"] = agg_df[use_pct]
    agg_df["descricao"] = agg_df.apply(lambda r: get_desc_text(r["CO_DESCRITOR"], r["DS_DISCIPLINA"]), axis=1)

    # Classify band — 4 levels matching frontend thresholds
    def band(v):
        if v < 40.0:
            return "Crítico"
        elif v < 50.0:
            return "Atenção"
        elif v < 70.0:
            return "Intermediário"
        else:
            return "Adequado"
    
    agg_df["faixa"] = agg_df["pct"].apply(band)

    # Sort ascending for chart (or descending)
    sorted_df = agg_df.sort_values("pct", ascending=False).copy()

    # Calculate KPIs
    if metrica == "ponderado" and has_peso:
        media_geral = float((fdf["PESO_TOTAL_ACERTOS"].sum() * 100.0 / fdf["PESO_TOTAL_RESPOSTAS"].sum()).round(1))
    else:
        media_geral = float((fdf["TOTAL_ACERTOS"].sum() * 100.0 / fdf["TOTAL_RESPOSTAS"].sum()).round(1))

    total_respostas = int(fdf["TOTAL_RESPOSTAS"].sum())
    items_per_student = 52 if disc == "Todos" else 26
    total_estudantes = int(round(total_respostas / items_per_student))
    top = sorted_df.iloc[0].to_dict()
    worst = sorted_df.iloc[-1].to_dict()
    criticos = int((sorted_df["pct"] < 40.0).sum())

    results = sorted_df.to_dict(orient="records")

    return {
        "kpis": {
            "media_geral": media_geral,
            "total_respostas": total_respostas,
            "total_estudantes": total_estudantes,
            "total_descritores": len(results),
            "criticos_count": criticos,
            "top_descritor": {"codigo": top["CO_DESCRITOR"], "disc": top["DS_DISCIPLINA"], "pct": top["pct"], "desc": top["descricao"]},
            "worst_descritor": {"codigo": worst["CO_DESCRITOR"], "disc": worst["DS_DISCIPLINA"], "pct": worst["pct"], "desc": worst["descricao"]}
        },
        "descritores": results
    }

@app.get("/api/equidade")
def get_equidade(
    ano: str = Query("9º Ano EF"),
    disc: str = Query("Todos"),
    uf: str = Query("Brasil (Todos)"),
    metrica: str = Query("ponderado")
):
    # Compares Public vs Private
    fdf = filter_dataset(ano, disc, uf, rede="Todas")

    has_peso = "PESO_TOTAL_RESPOSTAS" in fdf.columns
    agg_dict = {"TOTAL_RESPOSTAS": ("TOTAL_RESPOSTAS", "sum"), "TOTAL_ACERTOS": ("TOTAL_ACERTOS", "sum")}
    if has_peso:
        agg_dict["PESO_TOTAL_RESPOSTAS"] = ("PESO_TOTAL_RESPOSTAS", "sum")
        agg_dict["PESO_TOTAL_ACERTOS"] = ("PESO_TOTAL_ACERTOS", "sum")

    agg_df = fdf.groupby(["DS_DISCIPLINA", "CO_DESCRITOR", "TP_REDE"], as_index=False).agg(**agg_dict)
    
    agg_df["pct_simples"] = (agg_df["TOTAL_ACERTOS"] * 100.0 / agg_df["TOTAL_RESPOSTAS"]).round(1)
    if has_peso:
        agg_df["pct_ponderado"] = (agg_df["PESO_TOTAL_ACERTOS"] * 100.0 / agg_df["PESO_TOTAL_RESPOSTAS"]).round(1)
    else:
        agg_df["pct_ponderado"] = agg_df["pct_simples"]

    use_col = "pct_ponderado" if metrica == "ponderado" else "pct_simples"
    
    pivot = agg_df.pivot_table(index=["DS_DISCIPLINA", "CO_DESCRITOR"], columns="TP_REDE", values=use_col).reset_index()
    if "Pública" in pivot.columns and "Privada" in pivot.columns:
        pivot = pivot.dropna(subset=["Pública", "Privada"])
        pivot["gap"] = (pivot["Privada"] - pivot["Pública"]).round(1)
        pivot["descricao"] = pivot.apply(lambda r: get_desc_text(r["CO_DESCRITOR"], r["DS_DISCIPLINA"]), axis=1)
        pivot = pivot.sort_values("gap", ascending=False)
        
        items = pivot.to_dict(orient="records")
        avg_gap = float(pivot["gap"].mean().round(1))
        return {
            "avg_gap": avg_gap,
            "top_gap": items[0] if items else None,
            "min_gap": items[-1] if items else None,
            "items": items
        }
    return {"avg_gap": 0, "items": []}

@app.get("/api/ufs")
def get_ufs(
    ano: str = Query("9º Ano EF"),
    disc: str = Query("Todos"),
    rede: str = Query("Todas"),
    metrica: str = Query("ponderado")
):
    fdf = filter_dataset(ano, disc, uf="Brasil (Todos)", rede=rede)

    has_peso = "PESO_TOTAL_RESPOSTAS" in fdf.columns
    agg_dict = {"TOTAL_RESPOSTAS": ("TOTAL_RESPOSTAS", "sum"), "TOTAL_ACERTOS": ("TOTAL_ACERTOS", "sum")}
    if has_peso:
        agg_dict["PESO_TOTAL_RESPOSTAS"] = ("PESO_TOTAL_RESPOSTAS", "sum")
        agg_dict["PESO_TOTAL_ACERTOS"] = ("PESO_TOTAL_ACERTOS", "sum")

    uf_agg = fdf.groupby(["NM_UF"], as_index=False).agg(**agg_dict)
    
    if metrica == "ponderado" and has_peso:
        uf_agg["pct"] = (uf_agg["PESO_TOTAL_ACERTOS"] * 100.0 / uf_agg["PESO_TOTAL_RESPOSTAS"]).round(1)
        media_br = float((fdf["PESO_TOTAL_ACERTOS"].sum() * 100.0 / fdf["PESO_TOTAL_RESPOSTAS"].sum()).round(1)) if not fdf.empty else 0.0
    else:
        uf_agg["pct"] = (uf_agg["TOTAL_ACERTOS"] * 100.0 / uf_agg["TOTAL_RESPOSTAS"]).round(1)
        media_br = float((fdf["TOTAL_ACERTOS"].sum() * 100.0 / fdf["TOTAL_RESPOSTAS"].sum()).round(1)) if not fdf.empty else 0.0

    sorted_uf = uf_agg.sort_values("pct", ascending=False).to_dict(orient="records")

    return {
        "media_br": media_br,
        "ufs": sorted_uf
    }

@app.get("/api/tabela")
def get_tabela(
    search: str = Query(""),
    ano: str = Query("9º Ano EF"),
    disc: str = Query("Todos"),
    uf: str = Query("Brasil (Todos)"),
    rede: str = Query("Todas")
):
    fdf = filter_dataset(ano, disc, uf, rede)
    if search:
        mask = (
            fdf["CO_DESCRITOR"].str.contains(search, case=False, na=False) |
            fdf["NM_UF"].str.contains(search, case=False, na=False) |
            fdf["DS_DISCIPLINA"].str.contains(search, case=False, na=False)
        )
        fdf = fdf[mask]

    fdf["DS_HABILIDADE"] = fdf.apply(lambda r: get_desc_text(r["CO_DESCRITOR"], r["DS_DISCIPLINA"]), axis=1)
    
    cols = ["ANO_ESCOLAR", "DS_DISCIPLINA", "CO_DESCRITOR", "DS_HABILIDADE", "NM_UF", "TP_REDE", "TOTAL_RESPOSTAS", "TOTAL_ACERTOS", "PCT_ACERTO", "PCT_ACERTO_PONDERADO"]
    res = fdf[[c for c in cols if c in fdf.columns]].head(500).to_dict(orient="records")
    return {"total": len(fdf), "rows": res}

@app.get("/api/export")
def export_csv(
    ano: str = Query("9º Ano EF"),
    disc: str = Query("Todos"),
    uf: str = Query("Brasil (Todos)"),
    rede: str = Query("Todas")
):
    fdf = filter_dataset(ano, disc, uf, rede)
    fdf["DS_HABILIDADE"] = fdf.apply(lambda r: get_desc_text(r["CO_DESCRITOR"], r["DS_DISCIPLINA"]), axis=1)
    
    cols = ["ANO_ESCOLAR", "DS_DISCIPLINA", "CO_DESCRITOR", "DS_HABILIDADE", "NM_UF", "TP_REDE", "TOTAL_RESPOSTAS", "TOTAL_ACERTOS", "PCT_ACERTO", "PCT_ACERTO_PONDERADO"]
    csv_str = fdf[[c for c in cols if c in fdf.columns]].to_csv(index=False, sep=";", encoding="utf-8-sig")
    
    return StreamingResponse(
        iter([csv_str.encode("utf-8-sig")]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=saeb_2023_descritores.csv"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
