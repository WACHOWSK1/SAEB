# Documentação dos Itens Adicionais e Matrizes — SAEB 2023 (9º Ano EF)

**Data:** 2026-09-29  
**Fonte Primária:** `TS_ITEM.csv` (Microdados SAEB 2023, Inep/MEC).  

---

## 1. Contextualização Institucional e Normativa

### 1.1. Portaria de Regência: Portaria Inep nº 267, de 21 de junho de 2023
- **Título Oficial:** Portaria Inep nº 267, de 21 de junho de 2023, que estabelece as diretrizes de realização do Sistema de Avaliação da Educação Básica (Saeb) no ano de 2023.
- **Publicação:** Diário Oficial da União (DOU), Edição 117, Seção 1, 22/06/2023, p. 119.
- **Link Oficial (DOU / SME-Rio):** [Portaria Inep nº 267/2023](https://educacao.prefeitura.rio/wp-content/uploads/sites/42/2023/07/PORTARIA-No-267-DE-21-DE-JUNHO-DE-2023-DOU-Imprensa-Nacional.pdf)
- **Dispositivos Pertinentes:**
  - **Art. 8º, inciso V:** Define a aplicação censitária para as turmas de 9º ano do Ensino Fundamental.
  - **Art. 9º, inciso V, alínea 'b':** Estabelece que os testes de Língua Portuguesa e Matemática para o 9º ano do Ensino Fundamental serão estruturados com base nas **Matrizes de Referência vigentes desde 2001**.
  - **Anexo I:** Lista formalmente os tópicos e descritores das Matrizes de 2001 para a divulgação oficial da escala de proficiência do Saeb.

### 1.2. A Matriz de Referência alinhada à BNCC (Inep, 2020)
- **Documento:** *Matriz de Referência de Matemática: 5º e 9º anos do Ensino Fundamental — SAEB/BNCC* (Brasília: Inep/MEC, 2020).
- **Link Oficial Inep:** [Matriz de Referência de Matemática - BNCC](https://download.inep.gov.br/educacao_basica/saeb/matriz-de-referencia-de-matematica_BNCC.pdf)
- **Identificação dos Códigos Adicionais em Matemática:**
  A nomenclatura dos 9 códigos adicionais de Matemática presentes em `TS_ITEM.csv` segue o padrão estrito dos eixos temáticos da Matriz SAEB/BNCC do 9º ano:
  - **9N (Números):** `9N1.1`, `9N1.5`, `9N1.6`, `9N1.7`.
  - **9A (Álgebra):** `9A1.3`, `9A2.1`, `9A2.2`, `9A2.3`.
  - **9E (Estatística e Probabilidade):** `9E2.1`.
- **Descrição Oficial do Código 9E2.1 (página 16 do documento do Inep):**
  > *"Resolver problemas que envolvam dados estatísticos apresentados em tabelas (simples ou de dupla entrada) ou gráficos (barras simples ou agrupadas, colunas simples ou agrupadas, pictóricos, de linhas, de setores ou em histograma)."*

---

## 2. Distinção entre Prática Psicométrica e Evidência Empírica Posicional

### 2.1. Natureza Psicométrica: Pré-testagem e Calibração de Itens
No modelo psicométrico da Teoria de Resposta ao Item (TRI) adotado pelo Inep, novos itens devem ser testados operacionalmente em larga escala para estimativa prévia de seus parâmetros de calibração (discriminação $a$, dificuldade $b$ e acerto casual $c$) antes de comporem escalas oficiais definitivas. 

Como a Portaria Inep nº 267/2023 determinou que os resultados de proficiência divulgados do 9º EF permaneceriam na escala histórica de 2001, e o Inep não publicou escalas oficiais da BNCC para o 9º ano em 2023, a presença desses itens nos cadernos de prova constitui a prática de inserção de itens para pré-testagem e ancoragem do banco nacional de itens (BNI).

### 2.2. Esclarecimento Factual sobre a Posição dos Itens nos Blocos

É fundamental distinguir a interpretação psicométrica da distribuição física dos itens nos blocos de prova. Retifica-se aqui a generalização anterior: **nem todas as posições 12 e 13 são ocupadas exclusivamente por códigos da nova matriz**.

#### A. Em Matemática (7 blocos de 13 itens = 91 itens):
- **Blocos 1, 3, 4, 5, 6 e 7:** As posições terminais 12 e 13 são de fato ocupadas pelos 9 descritores com código BNCC (`9A...`, `9N...`, `9E...`).
- **Bloco 2 (Exceção importante):**
  - **Posição 12:** É ocupada pelo descritor **`D22`** (Matriz de 2001: *"Identificar fração como representação associada a diferentes significados"*), item código `70493`, gabarito `A`.
  - **Posição 13:** É ocupada pelo código BNCC **`9A2.2`** (Álgebra: *"Resolver problemas que envolvam cálculo do valor numérico de expressões algébricas"*), item código `139228`, gabarito `C`.

#### B. Em Língua Portuguesa (7 blocos de 13 itens = 91 itens):
Os 3 códigos adicionais (`H11`, `H12`, `H24`) **não ocupam apenas as posições finais**:
- **`H12`:** Está localizado no **Bloco 3, Posição 2** (Item `140515`, Gabarito `D`).
- **`H11`:** Está localizado no **Bloco 7, Posição 11** (Item `140151`, Gabarito `C`).
- **`H24`:** Está localizado no **Bloco 7, Posição 13** (Item `140348`, Gabarito `D`).

---

## 3. Mapeamento Posicional Completo dos 182 Itens de LP e MT (9º Ano EF)

### Matemática (91 Itens)

| Bloco | Posição | ID Item | Descritor | Matriz Origem | Gabarito |
| :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | 1 | 111374 | **D8** | Matriz 2001 | C |
| 1 | 2 | 22459 | **D16** | Matriz 2001 | B |
| 1 | 3 | 70460 | **D19** | Matriz 2001 | B |
| 1 | 4 | 109581 | **D3** | Matriz 2001 | D |
| 1 | 5 | 110516N | **D5** | Matriz 2001 | C |
| 1 | 6 | 110417 | **D28** | Matriz 2001 | A |
| 1 | 7 | 94982 | **D1** | Matriz 2001 | D |
| 1 | 8 | 95269 | **D28** | Matriz 2001 | A |
| 1 | 9 | 94895 | **D17** | Matriz 2001 | B |
| 1 | 10 | 110457 | **D35** | Matriz 2001 | C |
| 1 | 11 | 110090 | **D36** | Matriz 2001 | D |
| 1 | 12 | 140344 | **9A1.3** | BNCC (2020) | A |
| 1 | 13 | 139161 | **9N1.7** | BNCC (2020) | A |
| 2 | 1 | 34936 | **D9** | Matriz 2001 | C |
| 2 | 2 | 110079 | **D36** | Matriz 2001 | A |
| 2 | 3 | 110596 | **D34** | Matriz 2001 | B |
| 2 | 4 | 110254 | **D29** | Matriz 2001 | A |
| 2 | 5 | 66364 | **D16** | Matriz 2001 | C |
| 2 | 6 | 103238 | **D10** | Matriz 2001 | B |
| 2 | 7 | 94904 | **D2** | Matriz 2001 | A |
| 2 | 8 | 95052 | **D20** | Matriz 2001 | D |
| 2 | 9 | 95560 | **D28** | Matriz 2001 | A |
| 2 | 10 | 28581N | **D15** | Matriz 2001 | D |
| 2 | 11 | 109491N | **D2** | Matriz 2001 | D |
| 2 | 12 | 70493 | **D22** | Matriz 2001 | A |
| 2 | 13 | 139228 | **9A2.2** | BNCC (2020) | C |
| 3 | 1 | 110996 | **D1** | Matriz 2001 | A |
| 3 | 2 | 28647N | **D14** | Matriz 2001 | D |
| 3 | 3 | 22358 | **D16** | Matriz 2001 | C |
| 3 | 4 | 111022 | **D37** | Matriz 2001 | B |
| 3 | 5 | 110953 | **D34** | Matriz 2001 | D |
| 3 | 6 | 109873 | **D2** | Matriz 2001 | D |
| 3 | 7 | 95203N | **D4** | Matriz 2001 | B |
| 3 | 8 | 95274N | **D27** | Matriz 2001 | C |
| 3 | 9 | 95369NN | **D13** | Matriz 2001 | C |
| 3 | 10 | 28734 | **D23** | Matriz 2001 | A |
| 3 | 11 | 110212 | **D26** | Matriz 2001 | B |
| 3 | 12 | 140243 | **9N1.1** | BNCC (2020) | D |
| 3 | 13 | 139639 | **9A2.2** | BNCC (2020) | B |
| 4 | 1 | 111298 | **D31** | Matriz 2001 | D |
| 4 | 2 | 110431 | **D36** | Matriz 2001 | C |
| 4 | 3 | 65805 | **D13** | Matriz 2001 | B |
| 4 | 4 | 112292 | **D24** | Matriz 2001 | A |
| 4 | 5 | 47085 | **D21** | Matriz 2001 | A |
| 4 | 6 | 111299 | **D33** | Matriz 2001 | D |
| 4 | 7 | 95077N | **D7** | Matriz 2001 | C |
| 4 | 8 | 95720 | **D26** | Matriz 2001 | C |
| 4 | 9 | 95788 | **D14** | Matriz 2001 | B |
| 4 | 10 | 109718 | **D6** | Matriz 2001 | D |
| 4 | 11 | 110532 | **D6** | Matriz 2001 | A |
| 4 | 12 | 140104 | **9A2.1** | BNCC (2020) | D |
| 4 | 13 | 139860 | **9N1.6** | BNCC (2020) | B |
| 5 | 1 | 111372 | **D33** | Matriz 2001 | A |
| 5 | 2 | 68078 | **D27** | Matriz 2001 | A |
| 5 | 3 | 22405 | **D17** | Matriz 2001 | B |
| 5 | 4 | 109256 | **D4** | Matriz 2001 | B |
| 5 | 5 | 47013 | **D24** | Matriz 2001 | D |
| 5 | 6 | 109513 | **D12** | Matriz 2001 | A |
| 5 | 7 | 95101N | **D9** | Matriz 2001 | B |
| 5 | 8 | 94966NN | **D16** | Matriz 2001 | D |
| 5 | 9 | 95655 | **D25** | Matriz 2001 | D |
| 5 | 10 | 109575 | **D37** | Matriz 2001 | C |
| 5 | 11 | 109492 | **D3** | Matriz 2001 | A |
| 5 | 12 | 139864 | **9A2.1** | BNCC (2020) | C |
| 5 | 13 | 140349 | **9A1.3** | BNCC (2020) | A |
| 6 | 1 | 111057 | **D37** | Matriz 2001 | D |
| 6 | 2 | 67864 | **D27** | Matriz 2001 | A |
| 6 | 3 | 70468 | **D19** | Matriz 2001 | B |
| 6 | 4 | 112432 | **D18** | Matriz 2001 | B |
| 6 | 5 | 46114 | **D22** | Matriz 2001 | A |
| 6 | 6 | 110496 | **D28** | Matriz 2001 | A |
| 6 | 7 | 95786N | **D12** | Matriz 2001 | C |
| 6 | 8 | 95448 | **D21** | Matriz 2001 | D |
| 6 | 9 | 95562 | **D23** | Matriz 2001 | C |
| 6 | 10 | 111068 | **D1** | Matriz 2001 | C |
| 6 | 11 | 109889 | **D12** | Matriz 2001 | B |
| 6 | 12 | 140053 | **9E2.1** | BNCC (2020) | C |
| 6 | 13 | 140046 | **9A2.3** | BNCC (2020) | C |
| 7 | 1 | 34894 | **D2** | Matriz 2001 | C |
| 7 | 2 | 29111 | **D37** | Matriz 2001 | D |
| 7 | 3 | 65310 | **D18** | Matriz 2001 | B |
| 7 | 4 | 109916 | **D7** | Matriz 2001 | C |
| 7 | 5 | 110193 | **D12** | Matriz 2001 | B |
| 7 | 6 | 109731 | **D29** | Matriz 2001 | D |
| 7 | 7 | 95756 | **D11** | Matriz 2001 | B |
| 7 | 8 | 95026 | **D19** | Matriz 2001 | D |
| 7 | 9 | 95613 | **D22** | Matriz 2001 | B |
| 7 | 10 | 111053 | **D34** | Matriz 2001 | A |
| 7 | 11 | 70366 | **D9** | Matriz 2001 | B |
| 7 | 12 | 139580 | **9N1.7** | BNCC (2020) | A |
| 7 | 13 | 139868 | **9N1.5** | BNCC (2020) | C |

### Língua Portuguesa (91 Itens)

| Bloco | Posição | ID Item | Descritor | Matriz Origem | Gabarito |
| :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | 1 | 34528 | **D20** | Matriz 2001 | B |
| 1 | 2 | 109621 | **D1** | Matriz 2001 | A |
| 1 | 3 | 109245 | **D3** | Matriz 2001 | B |
| 1 | 4 | 109630 | **D15** | Matriz 2001 | A |
| 1 | 5 | 67476 | **D18** | Matriz 2001 | C |
| 1 | 6 | 109426 | **D21** | Matriz 2001 | A |
| 1 | 7 | 45913 | **D10** | Matriz 2001 | B |
| 1 | 8 | 96171 | **D11** | Matriz 2001 | B |
| 1 | 9 | 95149 | **D12** | Matriz 2001 | D |
| 1 | 10 | 65594 | **D2** | Matriz 2001 | D |
| 1 | 11 | 109579 | **D12** | Matriz 2001 | A |
| 1 | 12 | 110067 | **D10** | Matriz 2001 | C |
| 1 | 13 | 65760 | **D5** | Matriz 2001 | B |
| 2 | 1 | 109804 | **D1** | Matriz 2001 | B |
| 2 | 2 | 109618 | **D9** | Matriz 2001 | C |
| 2 | 3 | 70075N | **D18** | Matriz 2001 | D |
| 2 | 4 | 109220 | **D14** | Matriz 2001 | C |
| 2 | 5 | 65051 | **D21** | Matriz 2001 | D |
| 2 | 6 | 109535 | **D19** | Matriz 2001 | C |
| 2 | 7 | 95912 | **D13** | Matriz 2001 | C |
| 2 | 8 | 95390 | **D12** | Matriz 2001 | A |
| 2 | 9 | 19827 | **D9** | Matriz 2001 | C |
| 2 | 10 | 34412 | **D7** | Matriz 2001 | B |
| 2 | 11 | 110112 | **D2** | Matriz 2001 | D |
| 2 | 12 | 109591N | **D13** | Matriz 2001 | C |
| 2 | 13 | 109808 | **D11** | Matriz 2001 | C |
| 3 | 1 | 110070 | **D1** | Matriz 2001 | D |
| 3 | 2 | 140515 | **H12** | Matriz Complementar/H | D |
| 3 | 3 | 111333 | **D15** | Matriz 2001 | D |
| 3 | 4 | 110274N | **D10** | Matriz 2001 | B |
| 3 | 5 | 111277 | **D17** | Matriz 2001 | A |
| 3 | 6 | 109887 | **D12** | Matriz 2001 | C |
| 3 | 7 | 95300N | **D15** | Matriz 2001 | C |
| 3 | 8 | 95403 | **D11** | Matriz 2001 | B |
| 3 | 9 | 96082 | **D13** | Matriz 2001 | D |
| 3 | 10 | 110458 | **D4** | Matriz 2001 | C |
| 3 | 11 | 34150 | **D14** | Matriz 2001 | B |
| 3 | 12 | 34732 | **D3** | Matriz 2001 | A |
| 3 | 13 | 109237N | **D19** | Matriz 2001 | C |
| 4 | 1 | 19980 | **D8** | Matriz 2001 | D |
| 4 | 2 | 110507 | **D5** | Matriz 2001 | B |
| 4 | 3 | 109520N | **D14** | Matriz 2001 | B |
| 4 | 4 | 69914 | **D16** | Matriz 2001 | C |
| 4 | 5 | 110907NN | **D13** | Matriz 2001 | A |
| 4 | 6 | 110706 | **D9** | Matriz 2001 | B |
| 4 | 7 | 94971 | **D14** | Matriz 2001 | A |
| 4 | 8 | 96151N | **D6** | Matriz 2001 | B |
| 4 | 9 | 95501N | **D12** | Matriz 2001 | A |
| 4 | 10 | 109786 | **D12** | Matriz 2001 | B |
| 4 | 11 | 34726 | **D6** | Matriz 2001 | C |
| 4 | 12 | 111017 | **D19** | Matriz 2001 | D |
| 4 | 13 | 70115 | **D3** | Matriz 2001 | C |
| 5 | 1 | 109926 | **D4** | Matriz 2001 | A |
| 5 | 2 | 109619 | **D9** | Matriz 2001 | D |
| 5 | 3 | 109252 | **D10** | Matriz 2001 | C |
| 5 | 4 | 111302N | **D11** | Matriz 2001 | B |
| 5 | 5 | 109214N | **D4** | Matriz 2001 | C |
| 5 | 6 | 109806 | **D8** | Matriz 2001 | C |
| 5 | 7 | 68305 | **D3** | Matriz 2001 | D |
| 5 | 8 | 96134 | **D5** | Matriz 2001 | D |
| 5 | 9 | 95386N | **D9** | Matriz 2001 | A |
| 5 | 10 | 109297 | **D16** | Matriz 2001 | D |
| 5 | 11 | 111112 | **D13** | Matriz 2001 | B |
| 5 | 12 | 70170 | **D15** | Matriz 2001 | C |
| 5 | 13 | 110584 | **D17** | Matriz 2001 | A |
| 6 | 1 | 109647 | **D9** | Matriz 2001 | D |
| 6 | 2 | 109919 | **D11** | Matriz 2001 | C |
| 6 | 3 | 109645 | **D10** | Matriz 2001 | D |
| 6 | 4 | 110522 | **D3** | Matriz 2001 | C |
| 6 | 5 | 109354 | **D2** | Matriz 2001 | D |
| 6 | 6 | 109459 | **D6** | Matriz 2001 | B |
| 6 | 7 | 96157 | **D5** | Matriz 2001 | D |
| 6 | 8 | 95150N | **D7** | Matriz 2001 | D |
| 6 | 9 | 96102N | **D8** | Matriz 2001 | A |
| 6 | 10 | 109141 | **D15** | Matriz 2001 | C |
| 6 | 11 | 33976N | **D9** | Matriz 2001 | D |
| 6 | 12 | 109172 | **D15** | Matriz 2001 | D |
| 6 | 13 | 111143 | **D16** | Matriz 2001 | C |
| 7 | 1 | 109422 | **D11** | Matriz 2001 | C |
| 7 | 2 | 109631 | **D18** | Matriz 2001 | B |
| 7 | 3 | 110914N | **D19** | Matriz 2001 | D |
| 7 | 4 | 110752N | **D7** | Matriz 2001 | D |
| 7 | 5 | 109937 | **D14** | Matriz 2001 | B |
| 7 | 6 | 109189 | **D1** | Matriz 2001 | C |
| 7 | 7 | 96100N | **D1** | Matriz 2001 | D |
| 7 | 8 | 95104N | **D6** | Matriz 2001 | A |
| 7 | 9 | 95112N | **D2** | Matriz 2001 | B |
| 7 | 10 | 109599 | **D4** | Matriz 2001 | A |
| 7 | 11 | 140151 | **H11** | Matriz Complementar/H | C |
| 7 | 12 | 65731 | **D16** | Matriz 2001 | A |
| 7 | 13 | 140348 | **H24** | Matriz Complementar/H | D |
