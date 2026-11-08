from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from pathlib import Path
import hashlib,json
root=Path(__file__).resolve().parent.parent
out=root/'public/materials/practice/write-linear-level-4-companion.pdf'
c=canvas.Canvas(str(out),pagesize=(612,792));c.setTitle('Write the Linear Equation LEVEL 4 - Companion Worksheet')
ink=HexColor('#172b4a');grey=HexColor('#536479')
def txt(x,y,s,size=10,font='Helvetica',color=ink):c.setFillColor(color);c.setFont(font,size);c.drawString(x,y,s)
def math(x,y,s,size=14):
 import re
 for part in re.split(r'([xy][12])',s):
  if part in ['x1','x2','y1','y2']:
   txt(x,y,part[0],size,'Times-Italic');x+=c.stringWidth(part[0],'Times-Italic',size);txt(x,y-3,part[1],size*.7,'Times-Roman');x+=size*.4
  else:txt(x,y,part,size,'Times-Roman');x+=c.stringWidth(part,'Times-Roman',size)
def formulas():
 math(36,646,'m =',16);math(70,654,'y2 - y1',14);math(70,635,'x2 - x1',14);c.setStrokeColor(ink);c.setLineWidth(.7);c.line(67,649,123,649)
 math(188,646,'y - y1 = m(x - x1)',16);math(420,646,'y = mx + b',16)
for page in range(2):
 txt(36,755,'WRITE THE LINEAR EQUATION - LEVEL 4',16,'Helvetica-Bold');txt(36,736,'Given Two Points on a Line | Companion worksheet',11)
 txt(36,712,'Name: __________________________  Hour: _____  Date: ______________',10)
 txt(36,690,'Copy the points from the app. Find slope, use point-slope form, distribute, then isolate y.',9)
 txt(36,675,'Work downward. Check that your final equation works for both points.',9)
 formulas()
 for local in range(4):
  i=page*4+local;x=36+(local%2)*276;top=617-(local//2)*287;y=top-269
  c.setStrokeColor(HexColor('#9dacbb'));c.setLineWidth(.7);c.roundRect(x,y,264,269,5,stroke=1,fill=0)
  txt(x+12,top-20,'Shared example' if i==0 else f'Practice {i}',11,'Helvetica-Bold')
  txt(x+12,top-40,'First point: (1, 1)' if i==0 else 'First point: ( ______ , ______ )',10)
  txt(x+12,top-58,'Second point: (3, 5)' if i==0 else 'Second point: ( ______ , ______ )',10)
  txt(x+12,top-80,'Show slope and every equation step below.',8.5,color=grey)
 txt(36,25,'MacInTodd Math | Print two-sided, flip on the long edge.',8,color=grey);txt(546,25,f'{page+1} / 2',8,color=grey)
 c.showPage()
c.save()
manifest=root/'content-sources.json';data=json.loads(manifest.read_text());entry={'generated':True,'output':'practice/write-linear-level-4-companion.pdf','generator':'scripts/create-linear-level4-worksheet.py','selectionReason':'Teacher-requested companion to the two-point guided app. Shared example matches the app; seven tall practice boxes record randomly generated points and vertical solution work. No student information.','publishedSha256':hashlib.sha256(out.read_bytes()).hexdigest(),'publishedPages':2};data['materials']=[e for e in data['materials'] if e['output']!=entry['output']]+[entry];manifest.write_text(json.dumps(data,indent=2)+'\n')
print(out)
