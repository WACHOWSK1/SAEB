# Auditoria SAEB 2023 — critério metodológico 40/60/70

Comece por PARECER_MICRODADOS_SAEB_2023.md. Critérios finais da pesquisa: Crítico p<40%; Atenção 40%≤p<60%; Intermediário 60%≤p<70%; Adequado p≥70%. Não são faixas oficiais do Inep.

Arquivos principais:
- resultados/selecionados_matriz_2001_41.csv: 41 descritores D priorizados, 12 LP/29 MT.
- resultados/selecionados_base_completa_52.csv: análise ampliada de 52 códigos, 15 LP/37 MT.
- resultados/criterio_60.json e resultados/contagem_faixas_60.csv: critérios e contagens.
- resultados/comparacao_68_codigos_criterio_60.csv: percentuais antigos e corrigidos com as novas faixas.
- resultados/saeb_descritores_9ef_lp_mt_corrigido.csv: 9.828 agregados item × UF × rede para atualizar a base do dashboard.

A subpasta sensibilidade_50 preserva as listas e as faixas da análise anterior com limite de 50%; ela não representa o critério escolhido pelo pesquisador. A comparação de 50% e 60% usa os mesmos percentuais recalculados e documenta a escolha exploratória.

Reproduzir com o CSV bruto de alunos disponível na pasta de origem, Python, pandas e DuckDB:
python 01_diagnosticar.py --alunos TS_ALUNO_9EF.csv --itens TS_ITEM.csv --saida resultados
python 02_recalcular.py --saida resultados --dashboard-csv resultados/saeb_descritores_anterior_9ef_lp_mt.csv
python 04_reclassificar_60.py --saida resultados

O arquivo TS_ALUNO_9EF.csv e o banco DuckDB temporário não acompanham o pacote. As listas de seleção prontas usam ponto e vírgula, UTF-8 com BOM e vírgula decimal; CSVs técnicos usam ponto decimal.
