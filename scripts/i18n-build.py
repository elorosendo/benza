#!/usr/bin/env python3
"""Gera lib/i18n/dict/*.ts a partir de scripts/translations/part*.txt (pt-BR || pt-PT || es-ES || fr-FR || en-US)."""
import json, glob, re, sys, os
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rows = {}
for f in sorted(glob.glob(os.path.join(root, 'scripts/translations/part*.txt'))):
    for n, line in enumerate(open(f, encoding='utf-8'), 1):
        line = line.rstrip('\n')
        if not line.strip(): continue
        cols = [c.strip() for c in line.split(' || ')]
        if len(cols) != 5:
            print(f'ERRO {os.path.basename(f)}:{n}: {len(cols)} colunas -> {line[:70]}'); sys.exit(1)
        rows[cols[0]] = cols[1:]
langs = ['pt-PT', 'es-ES', 'fr-FR', 'en-US']
out = {l: {} for l in langs}
for key, vals in rows.items():
    for l, v in zip(langs, vals):
        out[l][key] = key if (v == '=') else v
for l in langs:
    body = ',\n'.join(f'  {json.dumps(k, ensure_ascii=False)}: {json.dumps(v, ensure_ascii=False)}' for k, v in sorted(out[l].items()))
    open(os.path.join(root, f'lib/i18n/dict/{l}.ts'), 'w', encoding='utf-8').write(
        f'// Gerado por scripts/i18n-build.py a partir de scripts/translations/*.txt. Não editar à mão.\nconst dict: Record<string, string> = {{\n{body},\n}};\nexport default dict;\n')
keys = json.load(open('/tmp/i18n-keys.json'))
ignore = {'BRL'}
missing = [k for k in keys if k not in rows and k not in ignore]
print(f'{len(rows)} linhas, {sum(len(v) for v in out.values())} traduções; chaves sem linha: {len(missing)}')
for k in missing: print('  FALTA:', k)
