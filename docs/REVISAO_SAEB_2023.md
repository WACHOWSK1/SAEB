# Revisão do dashboard SAEB 2023

Data: 29/09/2026. Repositório: https://github.com/WACHOWSK1/SAEB. Revisão preparada sobre o commit `1872929` (inclui as correções de rótulo e o filtro de matriz enviados pelo autor). As mudanças desta revisão são locais; não foram enviadas ao GitHub nem publicadas no Netlify.

## Conclusão e alcance

Os 68 códigos existem no arquivo agregado do repositório. Não é correto concluir que estejam errados apenas porque a matriz de 2001 tem 58 descritores. No recorte do 9º ano, 56 códigos correspondem a essa matriz e outros 12 utilizam nomenclaturas diferentes. D30 e D32 de Matemática não aparecem no agregado. Foram preservados todos os códigos.

Esta revisão conferiu os somatórios e a apresentação do agregado. Os arquivos `TS_ITEM.csv` e `TS_ALUNO_9EF.csv` não estão presentes no repositório. Por isso, a conferência não certifica a extração original, a identificação dos itens, o tratamento de respostas e pesos ou a contagem de participantes únicos. A informação do autor de que consultou o arquivo de itens foi registrada como esclarecimento recebido, sem substituí-la por uma conferência independente que não foi possível realizar.

## Resultados reproduzidos

Recorte: Brasil, todas as redes, Língua Portuguesa e Matemática, 9º ano EF, SAEB 2023. Métrica: ponderada. Limites: Crítico abaixo de 40%; Atenção de 40% até menos de 50%; Intermediário de 50% até menos de 70%; Adequado a partir de 70%. A classificação precede o arredondamento.

| Conjunto no agregado | Total | Crítico | Atenção | Intermediário | Adequado | Crítico + Atenção |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Todos os códigos | 68 | 23 | 26 | 19 | 0 | 49 |
| Códigos da matriz de 2001 | 56 | 16 | 22 | 18 | 0 | 38 |
| Códigos adicionais | 12 | 7 | 4 | 1 | 0 | 11 |

O código adicional restante é **9E2.1**, com **58,69833490%**, classificado como **Intermediário**. A afirmação de que existe um código adicional Adequado não corresponde aos limites 40/50/70.

Arquivos de consulta:

- `resultados_68_codigos.csv`: todos os códigos, somatórios observados, percentuais e faixas.
- `selecao_49_codigos.csv`: seleção de Crítico e Atenção na base completa, com 13 códigos de LP e 36 de Matemática.
- `selecao_38_descritores_matriz_2001.csv`: mesma regra, limitada aos códigos D correspondentes à matriz de 2001.

Essas listas identificam candidatos segundo o critério quantitativo; não demonstram, sozinhas, quais foram efetivamente incorporados às missões. A dissertação deve informar o universo escolhido e a seleção pedagógica posterior. Os códigos adicionais não devem receber descrições presumidas.

## Contagens e cálculos corrigidos

| Indicador | Resultado conferido no agregado |
| --- | ---: |
| Respostas computadas, LP + Matemática | 129.443.028 |
| Acertos observados, LP + Matemática | 56.153.348 |
| Percentual global simples | 43,38074353% |
| Percentual global ponderado | 46,83674034% |
| Respostas de D14 — LP | 3.553.706 |
| Acertos observados de D14 — LP | 1.428.839 |
| Percentual simples de D14 — LP | 40,20701206% |
| Percentual ponderado de D14 — LP | 43,01235176% |

O rótulo “Total de Respostas Computadas” está correto. O valor anterior de 1.528.094 acertos no modo estático resultava de multiplicar uma taxa ponderada arredondada pela contagem bruta de respostas. Esse procedimento foi removido: os acertos agora vêm do somatório observado.

O código anterior estimava estudantes dividindo as respostas por 52, ou por 26 quando um componente era selecionado. No total nacional, `129443028 / 52 = 2489289`; essa igualdade explica o valor mostrado, mas não comprova uma contagem independente de estudantes únicos. Essa contagem exige os registros de participantes, uma chave validada e critérios de inclusão explícitos.

O percentual ponderado é a razão entre dois somatórios ponderados. Ao reunir descritores, UFs ou redes, a revisão soma os numeradores e os denominadores e só então calcula a razão. Não calcula uma média de percentuais ponderados usando quantidades brutas como pesos.

## Gráfico por eixos

O código anterior procurava apenas `D1`, `D2` etc., sem distinguir o componente curricular. Assim, misturava Português e Matemática na visão conjunta. Também substituía dados ausentes ou zero por valores fixos. Ambos os procedimentos foram removidos.

Para a visão conjunta abaixo, entram somente os 56 códigos correspondentes à matriz de 2001. Os cinco grupos são sínteses próprias do painel, e não uma reprodução dos tópicos oficiais. Nas visões por componente, foram usados os seis tópicos de LP e os quatro de Matemática.

| Grupo do painel | Códigos incluídos | Percentual ponderado |
| --- | --- | ---: |
| Leitura e inferência — LP | D1, D3, D4, D6, D14, D2, D7, D8, D9, D10, D11, D15 | 50,2% |
| Análise textual — LP | D5, D12, D13, D16, D17, D18, D19, D20, D21 | 56,5% |
| Espaço e medidas — Matemática | D1 a D15 | 40,2% |
| Números e álgebra — Matemática | D16 a D29, D31, D33 a D35 | 43,5% |
| Estatística e dados — Matemática | D36 e D37 | 48,7% |

O parágrafo anteriormente proposto a partir do gráfico com 47,2%, 51,0%, 48,5%, 44,7% e 46,9% deve ser revisto. Esses valores não devem ser mantidos após a identificação do problema de agregação. O novo gráfico também tem um recorte explícito: códigos da matriz de 2001 presentes no agregado.

## Esclarecimentos que ainda exigem evidência

1. **Portaria e itens experimentais.** A referência correta é **Portaria Inep nº 267, de 21 de junho de 2023**, e não “Portaria MEC nº 267”. Seus arts. 8º, V, e 9º, V, b, e o Anexo I indicam a matriz de 2001 para LP e Matemática do 9º ano. Ela não basta para atribuir os 12 códigos a uma aplicação experimental nem para afirmar que ocupariam as posições 12 e 13 dos blocos. Isso exige uma nota técnica ou documentação específica dos itens.
2. **“Portaria 2001”.** 2001 é o ano da matriz de referência; não foi identificado um ato com o número “2001” que fundamente esse rótulo.
3. **Descrições dos códigos adicionais.** Há pelo menos uma divergência verificável no esclarecimento recebido: na matriz de Matemática alinhada à BNCC, 9E2.1 se refere a problemas com dados estatísticos em tabelas e gráficos. A descrição “contagem e princípio multiplicativo” não corresponde àquela matriz. É necessário documentar a origem das descrições de todos os códigos adicionais antes de usá-las nas missões.
4. **D30 e D32.** A ausência na base agregada foi confirmada. A ausência na aplicação original depende da conferência do arquivo de itens, incluindo etapa, componente, tipo, bloco e posição. Um print de uma explicação não substitui esse extrato.
5. **Desempenho dos códigos adicionais.** As contagens são descritivas. Não demonstram que os percentuais menores decorreriam de maior complexidade, novidade curricular ou transição para a BNCC. A expressão “significativamente mais baixo” exigiria análise estatística apropriada, além de uma hipótese bem definida.

Fontes primárias consultadas:

- [Inep — Matrizes e escalas](https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/saeb/matrizes-e-escalas).
- [Portaria Inep nº 267/2023 — texto do DOU reproduzido pela SME/Rio](https://educacao.prefeitura.rio/wp-content/uploads/sites/42/2023/07/PORTARIA-No-267-DE-21-DE-JUNHO-DE-2023-DOU-Imprensa-Nacional.pdf).
- [Inep — matriz de Matemática alinhada à BNCC, p. 16, código 9E2.1](https://download.inep.gov.br/educacao_basica/saeb/matriz-de-referencia-de-matematica_BNCC.pdf).
- [Inep — matriz de Matemática de 2001](https://download.inep.gov.br/educacao_basica/saeb/matriz-de-referencia-de-matematica_2001.pdf).
- Arquivos do repositório: `data/Leia-Me.pdf`, `data/Dicionario.xlsx`, `data/Matriz_LP_MT.pdf` e o CSV agregado.

## Extração original: pontos para resolver com os microdados

O ETL existente não foi alterado nem executado nesta revisão. Antes de produzir uma nova base, conferir:

- O dicionário do 9º ano apresenta `TX_RESP_BLOCO_1_LP` e nomes semelhantes; o script procura `TX_RESP_BLOCO1_LP`, sem o separador após BLOCO. A resolução dos nomes deve ser explícita e a ausência das colunas esperadas deve interromper o processamento.
- O script substitui peso ausente por 1. Isso mistura observações sem peso e ponderação oficial. O Leia-Me informa que existem estudantes sem peso; o tratamento precisa ser definido e documentado.
- `contains(gabarito, resposta)` precisa de proteção contra resposta vazia, posição fora do comprimento do vetor, itens anulados (`X`) e regras de crédito parcial. Um caractere vazio não pode ser tratado como resposta correta.
- A leitura com `ignore_errors=True` e os blocos `except Exception: continue` podem omitir dados ou falhas sem relatório. É necessário registrar rejeições e interromper erros de estrutura.
- Validar a chave do vínculo item–bloco–posição–etapa–componente, as condições de participação e os denominadores. Conferir as contagens antes e depois de cada exclusão.

Esses achados são riscos identificados no código. Não provam, isoladamente, que todos tenham afetado o CSV atualmente publicado. Para concluir a auditoria, é necessário reproduzir a extração com os arquivos originais e comparar os resultados.

## Registro para a dissertação

Uma redação possível, após explicitar qual universo foi efetivamente usado nas missões:

> Para delimitar as habilidades que orientaram a elaboração das missões, foram considerados os resultados de Língua Portuguesa e Matemática do 9º ano do Ensino Fundamental, referentes ao SAEB 2023, no recorte nacional e com todas as redes de ensino. O diagnóstico utilizou o percentual de acertos ponderado, calculado pela razão entre o somatório dos pesos associados às respostas corretas e o somatório dos pesos das respostas computadas no respectivo código. Foram priorizados os resultados classificados no painel como Crítico, inferiores a 40%, e Atenção, iguais ou superiores a 40% e inferiores a 50%. Essas denominações constituem critérios operacionais adotados para a pesquisa e não correspondem aos níveis oficiais de proficiência do Inep. A seleção quantitativa subsidiou a escolha pedagógica das habilidades e sua articulação entre os dois componentes curriculares.

Se o universo escolhido for a matriz de 2001, registrar os **38 descritores candidatos entre os 56 com dados**. Se forem utilizados todos os códigos, registrar os **49 candidatos entre 68**, apresentando separadamente os 12 códigos adicionais e a documentação de suas descrições. Não alterar retroativamente o universo apenas para ajustar as contagens às missões já elaboradas.

## Mudanças e verificação técnica

- Fonte estática gerada do CSV por `scripts/export_static_data.py`: 3.672 combinações de componente, código, UF e rede, preservando quatro somatórios.
- Removidos multiplicadores fixos de UF, rede e métrica e a estimativa de acertos baseada em percentual arredondado.
- O site Next.js utiliza uma única fonte estática em todas as páginas de consulta. A API Python anterior permanece no repositório e não participa desse fluxo.
- Corrigidos o radar, a contagem de UFs no recorte, os rótulos de respostas, os links que distinguem componente e código e a alternância de métrica.
- O seletor de matriz recebido do autor foi mantido, com rótulos que distinguem códigos da matriz de 2001 e códigos adicionais sem presumir sua origem.
- Limiares configuráveis com validação, armazenamento no navegador e aplicação nas páginas de diagnóstico.
- Nota técnica revisada para distinguir percentuais de acerto, proficiência, respostas e participantes.
- Verificação: oito testes automatizados dos cálculos e consultas, checagem TypeScript e compilação de produção Next.js com exportação estática bem-sucedidas. Não foi realizada validação visual em navegador nesta revisão.

Hash SHA-256 do CSV conferido: `7410099ca267b7f3e3674815b133fdf28ee0c4bd04409e23b5d1e386cfb1b6e9`.

## Aplicação do pacote de correções

O arquivo `SAEB_correcoes_2026-09-29.zip` contém somente arquivos novos ou alterados, com caminhos relativos à raiz do repositório. Deve ser aplicado sobre o commit `1872929`, preservando eventuais alterações posteriores. O patch equivalente permite conferir a compatibilidade antes de aplicar:

```bash
git apply --check SAEB_correcoes_2026-09-29.patch
git apply SAEB_correcoes_2026-09-29.patch
cd frontend
npm ci
npm test
npm run build
```

Depois da integração, a publicação segue o fluxo habitual do projeto. Este pacote não atualiza o site já publicado.
