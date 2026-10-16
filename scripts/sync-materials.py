"""Publish only explicitly selected PDFs. Originals are never modified.
Usage: python3 scripts/sync-materials.py --source-root '/path/to/2026 2027 School Year'
Requires pypdf. Re-run after reviewing source changes; do not use on a timer.
"""
import argparse, hashlib, io, json, time
from pathlib import Path
from pypdf import PdfReader, PdfWriter

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--source-root', required=True, type=Path)
args = parser.parse_args()
manifest = json.loads((ROOT / 'content-sources.json').read_text())
for item in manifest['materials']:
    if item.get('generated'):
        continue
    source = args.source_root / item['source']
    data = b''
    for attempt in range(5):
        data = source.read_bytes()
        if data.startswith(b'%PDF') and len(data) > 100:
            break
        time.sleep(1)
    if not data.startswith(b'%PDF'):
        raise ValueError(f'PDF not downloaded or not readable: {source}')
    reader = PdfReader(io.BytesIO(data))
    writer = PdfWriter()
    indices = item.get('pages', list(range(1, len(reader.pages) + 1)))
    for number in indices:
        writer.add_page(reader.pages[number - 1])
    output = ROOT / 'public' / 'materials' / item['output']
    output.parent.mkdir(parents=True, exist_ok=True)
    writer.write(output)
    # Rewriting resolves malformed source xref tables for browser PDF readers.
    item['sourceSha256'] = hashlib.sha256(data).hexdigest()
    item['publishedSha256'] = hashlib.sha256(output.read_bytes()).hexdigest()
    item['publishedPages'] = len(indices)
    print(f'Published {output.relative_to(ROOT)} ({len(indices)} pages)')
(ROOT / 'content-sources.json').write_text(json.dumps(manifest, indent=2) + '\n')
