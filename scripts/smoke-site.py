"""Smoke-test the rendered routes and all published PDFs against a running server."""
import json, sys, urllib.request, urllib.error
from pathlib import Path
base=sys.argv[1].rstrip('/') if len(sys.argv)>1 else 'http://127.0.0.1:3000'
routes=['/','/courses/algebra-2','/courses/precalculus','/courses/algebra-2/units/unit-1a','/courses/precalculus/units/unit-1','/courses/algebra-2/one-step-equations','/courses/precalculus/rectangular-coordinates','/apps','/apps/one-step-solver','/apps/factoring','/apps/slope','/apps/slope/results','/resources']
for route in routes:
 with urllib.request.urlopen(base+route,timeout=30) as r:
  data=r.read().decode(); assert r.status==200; assert 'MacIntodd' in data
 print('OK',route)
manifest=json.loads((Path(__file__).resolve().parents[1]/'content-sources.json').read_text())
for item in manifest['materials']:
 url=base+'/materials/'+item['output']
 with urllib.request.urlopen(url,timeout=30) as r:
  assert r.status==200
  assert r.headers.get_content_type()=='application/pdf'
  assert r.headers.get('Content-Disposition')=='inline'
  assert r.read(4)==b'%PDF'
 print('OK PDF',item['output'])
for old,new in [('/assignments','/courses/algebra-2'),('/assignments/unit1a','/courses/algebra-2/one-step-equations')]:
 try:
  with urllib.request.urlopen(base+old,timeout=30) as r: assert r.url==base+new
 except urllib.error.HTTPError as error:
  assert error.code in (307,308), error.code
  assert error.headers.get('Location')==new, error.headers
print('Passed: 13 routes, 8 public PDFs, 2 legacy redirects.')
