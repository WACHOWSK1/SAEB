"""
Pipeline de ETL de Ultra Performance para Microdados do SAEB 2023
Processa os microdados diretamente via SQL no engine C++ do DuckDB.
"""

import os
import sys
import time
import pandas as pd
import duckdb

# Forçar stdout UTF-8 sem buffer
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Diretórios de entrada e saída com resolução dinâmica e suporte a múltiplos ambientes
POSSIBLE_RAW_DIRS = [
    r"C:\Users\Nitro5 R7\OneDrive\Documentos\PESSOAL\MESTRADO\DISSERTAÇÃO\FUNDAMENTAÇÃO TEÓRICA\HABILIDADES SAEB\microdados_saeb_2023\MICRODADOS_SAEB_2023\DADOS",
    r"C:\Users\bruno_soares47\OneDrive\Documentos\PESSOAL\MESTRADO\DISSERTAÇÃO\FUNDAMENTAÇÃO TEÓRICA\HABILIDADES SAEB\microdados_saeb_2023\MICRODADOS_SAEB_2023\DADOS",
    os.path.join(os.path.expanduser("~"), "OneDrive", "Documentos", "PESSOAL", "MESTRADO", "DISSERTAÇÃO", "FUNDAMENTAÇÃO TEÓRICA", "HABILIDADES SAEB", "microdados_saeb_2023", "MICRODADOS_SAEB_2023", "DADOS"),
    os.path.join(os.path.dirname(__file__), "..", "..", "data", "raw")
]

DATA_RAW_DIR = next((p for p in POSSIBLE_RAW_DIRS if os.path.exists(p)), POSSIBLE_RAW_DIRS[0])
DATA_OUTROS_DIR = os.path.join(DATA_RAW_DIR, "OUTROS ANOS")
DATA_PROC_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data", "processed")

# Mapping das UFs
UF_NAMES = {
    11: "Rondônia", 12: "Acre", 13: "Amazonas", 14: "Roraima", 15: "Pará", 16: "Amapá", 17: "Tocantins",
    21: "Maranhão", 22: "Piauí", 23: "Ceará", 24: "Rio Grande do Norte", 25: "Paraíba", 26: "Pernambuco", 
    27: "Alagoas", 28: "Sergipe", 29: "Bahia",
    31: "Minas Gerais", 32: "Espírito Santo", 33: "Rio de Janeiro", 35: "São Paulo",
    41: "Paraná", 42: "Santa Catarina", 43: "Rio Grande do Sul",
    50: "Mato Grosso do Sul", 51: "Mato Grosso", 52: "Goiás", 53: "Distrito Federal"
}

DISCIPLINA_NAMES = {
    'LP': 'Língua Portuguesa',
    'MT': 'Matemática',
    'CH': 'Ciências Humanas',
    'CN': 'Ciências da Natureza'
}

def find_file(filename: str) -> str:
    p1 = os.path.join(DATA_RAW_DIR, filename)
    if os.path.exists(p1):
        return p1
    p2 = os.path.join(DATA_OUTROS_DIR, filename)
    if os.path.exists(p2):
        return p2
    return None

def load_items_to_duckdb(con: duckdb.DuckDBPyConnection, items_csv_path: str):
    print(f"Lendo metadados de itens ({items_csv_path})...", flush=True)
    df_items = pd.read_csv(items_csv_path, sep=';', encoding='latin1')
    df_obj = df_items[df_items['TP_ITEM'] == 'Resposta Objetiva'].copy()
    
    df_obj = df_obj[['ID_SERIE', 'TP_DISCIPLINA', 'NU_BLOCO', 'NU_POSICAO', 'ID_ITEM', 'NU_DESCRITOR_HABILIDADE', 'TX_GABARITO']].dropna()
    df_obj['ID_SERIE'] = df_obj['ID_SERIE'].astype(int)
    df_obj['NU_BLOCO'] = df_obj['NU_BLOCO'].astype(int)
    df_obj['NU_POSICAO'] = df_obj['NU_POSICAO'].astype(int)
    df_obj['ID_ITEM'] = df_obj['ID_ITEM'].astype(str).str.strip()
    df_obj['TP_DISCIPLINA'] = df_obj['TP_DISCIPLINA'].astype(str).str.strip()
    df_obj['NU_DESCRITOR_HABILIDADE'] = df_obj['NU_DESCRITOR_HABILIDADE'].astype(str).str.strip()
    df_obj['TX_GABARITO'] = df_obj['TX_GABARITO'].astype(str).str.strip()
    
    df_obj.columns = ['serie', 'disc', 'bloco', 'pos', 'id_item', 'descritor', 'gabarito']
    con.execute("CREATE TABLE item_lookup AS SELECT * FROM df_obj")
    print(f"Mapeados {len(df_obj)} itens objetiva na tabela DuckDB.", flush=True)

def run_etl():
    t_start = time.time()
    os.makedirs(DATA_PROC_DIR, exist_ok=True)
    
    con = duckdb.connect()
    items_path = find_file("TS_ITEM.csv")
    if not items_path:
        raise FileNotFoundError("Arquivo TS_ITEM.csv não localizado!")
    load_items_to_duckdb(con, items_path)
    
    file_configs = [
        {"file": "TS_ALUNO_2EF.csv", "serie_ts_item": 2, "ano_label": "2º Ano EF", "discs": ["LP", "MT"]},
        {"file": "TS_ALUNO_5EF.csv", "serie_ts_item": 5, "ano_label": "5º Ano EF", "discs": ["LP", "MT", "CH", "CN"]},
        {"file": "TS_ALUNO_9EF.csv", "serie_ts_item": 9, "ano_label": "9º Ano EF", "discs": ["LP", "MT", "CH", "CN"]},
        {"file": "TS_ALUNO_34EM.csv", "serie_ts_item": 3, "ano_label": "3ª/4ª Série EM", "discs": ["LP", "MT"]},
    ]
    
    all_results = []
    
    for cfg in file_configs:
        file_path = find_file(cfg["file"])
        if not file_path:
            print(f"Aviso: Arquivo nao encontrado: {cfg['file']}. Pulando...", flush=True)
            continue
            
        file_path_clean = file_path.replace('\\', '/')
        print(f"\nProcessando {cfg['file']} ({cfg['ano_label']})...", flush=True)
        t_file = time.time()
        
        con.execute("DROP TABLE IF EXISTS current_students")
        con.execute(f"CREATE TABLE current_students AS SELECT * FROM read_csv_auto('{file_path_clean}', delim=';', header=True, ignore_errors=True)")
        print(f" - Tabela {cfg['file']} carregada no DuckDB em {time.time()-t_file:.2f}s.", flush=True)
        
        columns = [col[0].upper() for col in con.execute("DESCRIBE current_students").fetchall()]
        
        for disc in cfg["discs"]:
            disc_ext = DISCIPLINA_NAMES.get(disc, disc)
            peso_col = f"PESO_ALUNO_{disc}" if f"PESO_ALUNO_{disc}" in columns else ("PESO" if "PESO" in columns else None)
            presenca_col = f"IN_PRESENCA_{disc}" if f"IN_PRESENCA_{disc}" in columns else ("IN_PRESENCA" if "IN_PRESENCA" in columns else None)
            profic_col = f"IN_PROFICIENCIA_{disc}" if f"IN_PROFICIENCIA_{disc}" in columns else ("IN_PROFICIENCIA" if "IN_PROFICIENCIA" in columns else None)
            
            for bloco_num in [1, 2, 3]:
                col_bloco_id = f"ID_BLOCO_{bloco_num}_{disc}"
                col_bloco_tx = f"TX_RESP_BLOCO{bloco_num}_{disc}"
                
                if col_bloco_id not in columns or col_bloco_tx not in columns:
                    continue
                
                # Critérios de elegibilidade para a análise ponderada:
                # 1. Aluno presente na avaliação do componente (IN_PRESENCA = 1)
                # 2. Aluno com proficiência apurada (IN_PROFICIENCIA = 1)
                # 3. Aluno com peso amostral válido estritamente positivo (PESO > 0)
                # Sem imputação de peso artificial (elimina COALESCE(peso, 1.0))
                filters = ["s.IN_SITUACAO_CENSO = 1", f"s.{col_bloco_id} IS NOT NULL", f"s.{col_bloco_tx} IS NOT NULL"]
                if presenca_col:
                    filters.append(f"s.{presenca_col} = 1")
                if profic_col:
                    filters.append(f"s.{profic_col} = 1")
                if peso_col:
                    filters.append(f"s.{peso_col} IS NOT NULL")
                    filters.append(f"s.{peso_col} > 0")
                    peso_resp_sql = f"SUM(s.{peso_col})"
                    peso_acerto_sql = f"SUM(CASE WHEN SUBSTR(s.{col_bloco_tx}, CAST(item.pos AS INT), 1) = item.gabarito THEN s.{peso_col} ELSE 0.0 END)"
                else:
                    peso_resp_sql = "COUNT(*)"
                    peso_acerto_sql = f"SUM(CASE WHEN SUBSTR(s.{col_bloco_tx}, CAST(item.pos AS INT), 1) = item.gabarito THEN 1 ELSE 0 END)"
                
                where_clause = " AND ".join(filters)
                
                # Use integer tags instead of UTF-8 literals in SQL to avoid encoding issues
                query = f"""
                SELECT 
                    {cfg['serie_ts_item']} AS SERIE_TAG,
                    item.descritor AS CO_DESCRITOR,
                    item.id_item AS ID_ITEM,
                    s.ID_UF AS ID_UF,
                    s.IN_PUBLICA AS IN_PUBLICA,
                    COUNT(*) AS TOTAL_RESPOSTAS,
                    SUM(CASE WHEN SUBSTR(s.{col_bloco_tx}, CAST(item.pos AS INT), 1) = item.gabarito THEN 1 ELSE 0 END) AS TOTAL_ACERTOS,
                    {peso_resp_sql} AS PESO_TOTAL_RESPOSTAS,
                    {peso_acerto_sql} AS PESO_TOTAL_ACERTOS
                FROM current_students s
                JOIN item_lookup item 
                  ON item.serie = {cfg['serie_ts_item']} 
                 AND item.disc = '{disc}' 
                 AND item.bloco = s.{col_bloco_id}
                WHERE {where_clause}
                GROUP BY item.descritor, item.id_item, s.ID_UF, s.IN_PUBLICA
                """
                
                try:
                    df_block = con.execute(query).df()
                    if not df_block.empty:
                        # Assign labels from Python (pure UTF-8, no SQL encoding issues)
                        df_block["ANO_ESCOLAR"] = cfg["ano_label"]
                        df_block["DS_DISCIPLINA"] = disc_ext
                        df_block.drop(columns=["SERIE_TAG"], inplace=True)
                        all_results.append(df_block)
                except Exception as e:
                    print(f"Erro no bloco {bloco_num} ({disc}): {e}", flush=True)
                    continue

        print(f"Concluido {cfg['ano_label']} em {time.time()-t_file:.2f}s!", flush=True)

    if not all_results:
        print("Nenhum resultado gerado!")
        return
        
    df_raw_agg = pd.concat(all_results, ignore_index=True)
    
    df_final = df_raw_agg.groupby(
        ["ANO_ESCOLAR", "DS_DISCIPLINA", "CO_DESCRITOR", "ID_ITEM", "ID_UF", "IN_PUBLICA"], 
        as_index=False
    ).agg({
        "TOTAL_RESPOSTAS": "sum",
        "TOTAL_ACERTOS": "sum",
        "PESO_TOTAL_RESPOSTAS": "sum",
        "PESO_TOTAL_ACERTOS": "sum"
    })
    
    df_final["NM_UF"] = df_final["ID_UF"].map(lambda x: UF_NAMES.get(int(x) if pd.notnull(x) else 0, f"UF {x}"))
    df_final["TP_REDE"] = df_final["IN_PUBLICA"].map(lambda x: "Pública" if x == 1 else "Privada")
    
    df_final["PCT_ACERTO"] = df_final["TOTAL_ACERTOS"] * 100.0 / df_final["TOTAL_RESPOSTAS"]
    df_final["PCT_ACERTO_PONDERADO"] = df_final["PESO_TOTAL_ACERTOS"] * 100.0 / df_final["PESO_TOTAL_RESPOSTAS"]
    
    df_final = df_final[[
        "ANO_ESCOLAR", "DS_DISCIPLINA", "CO_DESCRITOR", "ID_ITEM", 
        "ID_UF", "NM_UF", "TP_REDE", "TOTAL_RESPOSTAS", "TOTAL_ACERTOS",
        "PESO_TOTAL_RESPOSTAS", "PESO_TOTAL_ACERTOS", 
        "PCT_ACERTO", "PCT_ACERTO_PONDERADO"
    ]]
    
    out_parquet = os.path.join(DATA_PROC_DIR, "saeb_descritores.parquet")
    out_csv = os.path.join(DATA_PROC_DIR, "saeb_descritores.csv")
    
    df_final.to_parquet(out_parquet, index=False)
    df_final.to_csv(out_csv, index=False, sep=';', encoding='utf-8-sig', float_format='%.15g')
    
    print(f"\nETL de Alta Performance Finalizado com sucesso em {time.time()-t_start:.2f}s!", flush=True)
    print(f"Total de registros agregados gerados: {len(df_final)}", flush=True)
    print(f"Salvo em:\n - {out_parquet}\n - {out_csv}", flush=True)
    return df_final

if __name__ == "__main__":
    run_etl()
