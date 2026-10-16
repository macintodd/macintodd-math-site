"""Create a complete answer guide for the selected Section 1.1 practice."""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
import hashlib, json

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/materials/precalculus/rectangular-coordinates/completed-practice.pdf'
pdfmetrics.registerFont(TTFont('Guide', '/System/Library/Fonts/Supplemental/Arial.ttf'))
pdfmetrics.registerFont(TTFont('GuideBold', '/System/Library/Fonts/Supplemental/Arial Bold.ttf'))
ink = HexColor('#193c39'); muted = HexColor('#536c62'); green = HexColor('#176b58'); line = HexColor('#dce4db')
c = canvas.Canvas(str(OUT), pagesize=(612,792))
c.setTitle('Rectangular coordinates - Complete practice answer guide')
c.setAuthor('MacIntodd Math - prepared answer guide')
style = ParagraphStyle('body', fontName='Guide', fontSize=10.5, leading=16, textColor=ink)
small = ParagraphStyle('small', parent=style, fontSize=9, leading=14, textColor=muted)

def para(text, x, top, width=508, s=style):
    p=Paragraph(text, s); w,h=p.wrap(width,700); p.drawOn(c,x,top-h); return top-h

def header(page, subtitle):
    c.setFillColor(ink); c.rect(0,778,612,14,fill=1,stroke=0)
    c.setFont('GuideBold',9); c.drawString(48,750,'MACINTODD MATH  /  PRECALCULUS  /  SECTION 1.1')
    c.setFont('GuideBold',23); c.drawString(48,714,'Rectangular coordinates')
    c.setFillColor(muted); c.setFont('Guide',11); c.drawString(48,691,subtitle)
    c.setStrokeColor(line); c.line(48,675,564,675)
    c.setFont('Guide',8); c.drawString(48,32,'Prepared answer guide • Based on the classroom practice • Originals unchanged')
    c.drawRightString(564,32,f'{page} / 3')

def heading(text,x,y):
    c.setFont('GuideBold',13); c.setFillColor(green); c.drawString(x,y,text)

def box(number,title,work,explanation,x,y,w=246,h=112):
    c.setStrokeColor(line); c.roundRect(x,y-h,w,h,6,stroke=1,fill=0)
    c.setFillColor(green); c.setFont('GuideBold',10); c.drawString(x+14,y-21,f'{number}. {title}')
    top=para(work,x+14,y-34,w-28)
    para(explanation,x+14,top-8,w-28,small)

header(1,'Complete practice answer guide • Plotting and interpreting points')
heading('Group A / Problems 1–7',48,648)
# The five requested points on a coordinate grid, with labels kept away from axes.
x0,y0,scale=179,450,14
c.setLineWidth(.45)
for i in range(-8,9):
    c.setStrokeColor(line);c.line(x0+i*scale,y0-8*scale,x0+i*scale,y0+8*scale);c.line(x0-8*scale,y0+i*scale,x0+8*scale,y0+i*scale)
c.setStrokeColor(muted);c.setLineWidth(1);c.line(x0-116,y0,x0+116,y0);c.line(x0,y0-116,x0,y0+116)
c.setFillColor(muted);c.setFont('Guide',8)
for n in (-8,-4,4,8):
    c.drawCentredString(x0+n*scale,y0-12,str(n)); c.drawRightString(x0-5,y0+n*scale-3,str(n))
c.drawString(x0+120,y0-3,'x');c.drawString(x0+5,y0+120,'y')
for name,x,y in [('A',3,-5),('B',-2,4),('C',-6,-1),('D',0,7),('E',5,5)]:
    c.setFillColor(green);c.circle(x0+x*scale,y0+y*scale,3,stroke=0,fill=1);c.setFont('GuideBold',10);c.drawString(x0+x*scale+6,y0+y*scale+5,name)
para('Move horizontally first, then vertically.<br/>Points on axes are not in any quadrant.',63,321,238,small)
y=599
for title,body in [('1. A (3, −5)','Quadrant IV: (+, −)'),('2. B (−2, 4)','Quadrant II: (−, +)'),('3. C (−6, −1)','Quadrant III: (−, −)'),('4. D (0, 7)','On the positive y-axis'),('5. E (5, 5)','Quadrant I: (+, +)'),('6. (−8, 3)','Quadrant II: (−, +)')]:
    c.setFillColor(ink);c.setFont('GuideBold',10);c.drawString(337,y,title);para(body,337,y-9,210,small);y-=49
heading('7. Interpret the model exactly as printed',48,259)
para('The worksheet prints <b>h(t) = 10 + 12t + 4.9t²</b>. For elapsed time, t ≥ 0. Every term is nonnegative and the constant term is 10, so h(t) is always positive in this domain.',48,241)
para('<b>Answer:</b> Quadrant I for t &gt; 0. At t = 0, the point (0, 10) lies on the positive vertical axis.',48,177)
para('<b>Correction to the classroom annotation:</b> Quadrant IV does not occur for this printed formula and t ≥ 0. A falling-object model with a negative t² term would be a different equation.',48,125,s=small)
c.showPage()
header(2,'Complete practice answer guide • Distance and midpoint')
heading('Group B / Distance',48,648)
box(8,'(1, 2) to (4, 6)','d = √[(4 − 1)² + (6 − 2)²]<br/>= √(9 + 16) = <b>5</b>','The horizontal and vertical changes are 3 and 4.',48,629)
box(9,'(−3, 1) to (2, −1)','d = √[(2 + 3)² + (−1 − 1)²]<br/>= <b>√29 ≈ 5.39</b>','√29 has no perfect-square factor greater than 1.',318,629)
box(10,'(0, 0) to (−5, 12)','d = √[(−5)² + 12²]<br/>= √169 = <b>13</b>','Square each signed difference before adding.',48,501)
box(11,'(−2, −3) to (4, 5)','d = √[(4 + 2)² + (5 + 3)²]<br/>= √100 = <b>10</b>','The changes are 6 and 8. Distance is nonnegative.',318,501)
heading('Group C / Midpoint',48,355)
box(12,'(2, 3) and (8, 7)','M = ((2 + 8)/2, (3 + 7)/2)<br/>= <b>(5, 5)</b>','Average the x-values and y-values separately.',48,337)
box(13,'(−4, 6) and (2, −2)','M = ((−4 + 2)/2, (6 − 2)/2)<br/>= <b>(−1, 2)</b>','Include signs when adding coordinates.',318,337)
box(14,'(5, −9) and (−1, 3)','M = ((5 − 1)/2, (−9 + 3)/2)<br/>= <b>(2, −3)</b>','A midpoint is a location, so use an ordered pair.',48,209)
box(15,'(−7, −2) and (7, 10)','M = ((−7 + 7)/2, (−2 + 10)/2)<br/>= <b>(0, 4)</b>','This midpoint lies on the y-axis.',318,209)
c.showPage()
header(3,'Complete practice answer guide • Mixed applications')
heading('16. Verify a right triangle',48,648)
y=para('A(1, 1), B(4, 1), C(4, 5)',48,631)
y=para('AB = |4 − 1| = <b>3</b><br/>BC = |5 − 1| = <b>4</b><br/>AC = √[(4 − 1)² + (5 − 1)²] = √25 = <b>5</b>',48,y-14)
para('Since 3² + 4² = 9 + 16 = 25 = 5², the converse of the Pythagorean Theorem confirms a <b>right triangle</b>. The right angle is at B.',48,y-18)
c.setStrokeColor(line);c.line(48,438,564,438)
heading('17. Estimate sales at the middle year',48,412)
y=para('Use the ordered pairs (2019, 8.2) and (2023, 11.6), with sales measured in millions of dollars.',48,394)
y=para('M = ((2019 + 2023)/2, (8.2 + 11.6)/2)<br/>M = <b>(2021, 9.9)</b>',48,y-14)
para('The estimated 2021 sales are <b>$9.9 million</b>, assuming a linear trend between the given years.',48,y-16)
c.setStrokeColor(line);c.line(48,266,564,266)
heading('18. Convert a map distance to meters',48,240)
y=para('For (2, 3) and (14, 8):<br/>d = √[(14 − 2)² + (8 − 3)²]<br/>d = √(144 + 25) = √169 = <b>13 map units</b>',48,222)
y=para('13 map units × 100 meters per unit = <b>1,300 meters</b>',48,y-14)
para('This is the straight-line distance. The scale conversion comes after the coordinate calculation.',48,y-12,s=small)
c.save()
manifest_path=ROOT/'content-sources.json'
manifest=json.loads(manifest_path.read_text())
item=next(m for m in manifest['materials'] if m.get('generated'))
item['publishedSha256']=hashlib.sha256(OUT.read_bytes()).hexdigest()
item['publishedPages']=3
manifest_path.write_text(json.dumps(manifest,indent=2)+'\n')
print(OUT)
