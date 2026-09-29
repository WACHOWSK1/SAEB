"""Exporta o CSV agregado para o site estático, sem simular filtros.

Não substitui a validação com TS_ITEM.csv e TS_ALUNO_9EF.csv, ausentes do repo.
"""
import argparse
import csv
import hashlib
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MEASURES = ("TOTAL_RESPOSTAS", "TOTAL_ACERTOS", "PESO_TOTAL_RESPOSTAS", "PESO_TOTAL_ACERTOS")
KEYS = ("DS_DISCIPLINA", "CO_DESCRITOR", "NM_UF", "TP_REDE")


def export_dataset(source: Path, target: Path):
    catalog = json.loads((ROOT / "data/reference/descritores_9ef_2001.json").read_text(encoding="utf-8"))
    groups = {}
    with source.open(encoding="utf-8-sig", newline="") as stream:
        for row in csv.DictReader(stream, delimiter=";"):
            if row["ANO_ESCOLAR"] != "9º Ano EF" or row["DS_DISCIPLINA"] not in catalog:
                continue
            key = tuple(row[field] for field in KEYS)
            totals = groups.setdefault(key, [0.0] * len(MEASURES))
            for index, field in enumerate(MEASURES):
                value = float(row[field])
                if not math.isfinite(value) or value < 0:
                    raise ValueError(f"Valor inválido em {key}: {field}")
                totals[index] += value
    if not groups:
        raise ValueError("Nenhum registro do 9º ano em LP/Matemática.")
    rows = []
    for key, totals in sorted(groups.items()):
        if totals[1] > totals[0] or totals[3] > totals[2] + 1e-6:
            raise ValueError(f"Acertos excedem denominador: {key}")
        for index in (0, 1):
            if not totals[index].is_integer():
                raise ValueError(f"Contagem não inteira: {key}")
            totals[index] = int(totals[index])
        rows.append(dict(zip(KEYS + MEASURES, key + tuple(totals))))
    coverage = {}
    for discipline, descriptors in catalog.items():
        observed = {row["CO_DESCRITOR"] for row in rows if row["DS_DISCIPLINA"] == discipline}
        expected = set(descriptors)
        coverage[discipline] = {
            "expected": len(expected), "matched": len(observed & expected),
            "missing": sorted(expected - observed), "unmapped": sorted(observed - expected),
        }
    result = {
        "schemaVersion": 1, "year": 2023, "schoolYear": "9º Ano EF",
        "source": "data/processed/saeb_descritores.csv",
        "sourceSha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "validationStatus": "Agregados conferidos; microdados brutos não reprocessados nesta revisão.",
        "coverage": coverage, "catalog": catalog, "rows": rows,
    }
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(result, ensure_ascii=False, separators=(",", ":"), allow_nan=False) + "\n", encoding="utf-8")
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=ROOT / "data/processed/saeb_descritores.csv")
    parser.add_argument("--output", type=Path, default=ROOT / "frontend/public/data/saeb-2023-9ef.json")
    args = parser.parse_args()
    result = export_dataset(args.input, args.output)
    print(json.dumps({"rows": len(result["rows"]), "coverage": result["coverage"], "sourceSha256": result["sourceSha256"]}, ensure_ascii=False, indent=2))
