"""Smoke-test the rendered routes and all published PDFs against a running server."""
import json, sys, subprocess, urllib.request, urllib.error
from pathlib import Path
base=sys.argv[1].rstrip('/') if len(sys.argv)>1 else 'http://127.0.0.1:3000'
routes=['/apps/2048','/apps/multiplication','/apps/graph-standard-slope','/apps/function-families','/apps/mathboard/session-1','/apps/mathboard/session-1/teacher','/apps/graph-standard','/apps/graph-linear','/apps/line-equations','/courses/algebra-2/vocabulary','/courses/precalculus/vocabulary','/','/courses/algebra-2','/courses/precalculus','/courses/algebra-2/units/unit-1a','/courses/precalculus/units/unit-1','/courses/algebra-2/one-step-equations','/courses/precalculus/rectangular-coordinates','/apps','/apps/one-step-solver','/apps/factoring','/apps/slope','/apps/slope/results','/resources']
root=Path(__file__).resolve().parents[1]
# Read the same lesson/unit catalog used by the website so new pages are checked.
result=subprocess.run(['node','--experimental-strip-types','--input-type=module','-e',
 "import {lessons} from './src/content/lessons.ts'; import {units} from './src/content/units.ts'; console.log(JSON.stringify([...lessons.map(l=>'/courses/'+l.course+'/'+l.slug), ...units.map(u=>'/courses/'+u.course+'/units/'+u.slug)]))"],cwd=root,capture_output=True,text=True,check=True)
routes=list(dict.fromkeys(routes+json.loads(result.stdout)))
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
print(f'Passed: {len(routes)} routes, {len(manifest["materials"])} public PDFs, 2 legacy redirects.')
