from pathlib import Path
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
from matplotlib.mathtext import math_to_image
from matplotlib.font_manager import FontProperties
from PIL import Image
from pypdf import PdfReader
out=Path('public/handouts/parallel-perpendicular-classroom-notes.pdf')
c=canvas.Canvas(str(out),pagesize=letter);c.setTitle('Write the Linear Equation - Parallel and Perpendicular Classroom Notes');c.setAuthor('MacInTodd Math')
blue='#194fa4';red='#b42c3c';ink='#17344f'
def text(x,y,s,size=9,bold=False,color=ink):
 c.setFillColor(HexColor(color));c.setFont('Helvetica-Bold' if bold else 'Helvetica',size);c.drawString(x,y,s)
def math(s,x,y,maxwidth=500,size=11):
 stream=BytesIO();math_to_image('$'+s+'$',stream,prop=FontProperties(size=size),dpi=240,format='png',color=ink);stream.seek(0);im=Image.open(stream);w,h=im.size;wp=w*72/240;hp=h*72/240;scale=min(1,maxwidth/wp);stream.seek(0);c.drawImage(ImageReader(stream),x,y-hp*scale/2,width=wp*scale,height=hp*scale,mask='auto')
def box(x,y,w,h):
 c.setStrokeColor(HexColor('#9aabba'));c.setLineWidth(.65);c.roundRect(x,y,w,h,5,stroke=1,fill=0)
def rule(x,y,w):
 c.setStrokeColor(HexColor('#a1acb6'));c.setLineWidth(.45);c.line(x,y,x+w,y)
def grid(x,y,size):
 c.saveState();unit=size/20;c.setStrokeColor(HexColor('#d5dde5'));c.setLineWidth(.25)
 for i in range(21):
  c.line(x+i*unit,y,x+i*unit,y+size);c.line(x,y+i*unit,x+size,y+i*unit)
 c.setStrokeColor(HexColor('#60768a'));c.setLineWidth(.65);c.line(x,y+size/2,x+size,y+size/2);c.line(x+size/2,y,x+size/2,y+size)
 c.setFont('Helvetica',5.5);c.setFillColor(HexColor('#465d70'))
 for n in [-8,-4,4,8]:
  c.drawCentredString(x+(n+10)*unit,y+size/2-7,str(n));c.drawRightString(x+size/2-3,y+(n+10)*unit-2,str(n))
 c.restoreState()
def section(top,bottom,label):
 box(36,bottom,540,top-bottom);text(46,top-15,label,10.5,True)
for back in [False,True]:
 topic='Perpendicular' if back else 'Parallel';accent=red if back else blue
 text(36,761,'Write the Linear Equation',18,True);text(36,742,topic+' lines - classroom notes',12,True,accent)
 text(36,726,'Name: ______________________________  Hour: ______  Date: ______________',9)
 ids=['T5','T6a','T6b','T6c','T7','T8'] if back else ['P1','P2a','P2b','P2c','P3','P4']
 section(716,558,f'Slide {5 if back else 1} | {ids[0]} - Draw, discuss, and write')
 text(48,681,f'Write the line {topic.lower()} to the blue line through the point.',9)
 math(r'y=\frac{2}{3}x-4\qquad P=(6,-2)',48,658,350,13)
 text(48,634,'Graph the given line. Plot P. Sketch and label the new line.',9)
 if back:
  text(48,609,'Right 3, up 2 becomes right ___, down ___.',9.5)
  text(48,589,'Perpendicular lines intersect at a ____________________.',9.5)
 else:
  text(48,607,'Parallel lines in a plane _____________________________.',9.5)
 text(48,570,'New equation: _____________________________________',9.5)
 grid(422,567,140)
 section(548,346,f'Slide {6 if back else 2} - Compare slopes; complete all three')
 text(48,519,'Graph each given line and point. Sketch the new line. Record both slopes and its equation.',8.5)
 givens=[r'y=\frac{2}{3}x-4',r'y=-\frac{1}{2}x+3',r'y=\frac{3}{2}x-1']
 points=[(2,1),(2,1),(3,0)] if back else [(3,1),(4,0),(2,1)]
 for j in range(3):
  x=42+j*178;box(x,352,172,160);text(x+7,500,ids[j+1],10,True,accent)
  math(givens[j],x+42,498,125,10.5);math(f'P=({points[j][0]},{points[j][1]})',x+7,481,155,10)
  grid(x+47,395,78)
  text(x+7,381,'Blue m: ______  New m: ______',8.3)
  text(x+7,361,'y = ________________________',9)
 section(336,166,f'Slide {7 if back else 3} | {ids[4]} - Find the exact intercept')
 pt='(3,1)' if back else '(4,-2)';math(r'y=\frac{2}{3}x-4\qquad P='+pt,48,300,500,12)
 if back:math(r'm_{\mathrm{new}}=-\frac{1}{m_{\mathrm{given}}}\qquad m_{\mathrm{new}}m_{\mathrm{given}}=-1',48,279,490,10)
 else:text(48,279,'Distinct nonvertical parallel lines have the __________________ slope.',9.5)
 text(48,259,'1. Determine the given slope: __________',9.5);text(307,259,'2. New slope: __________',9.5)
 text(48,237,'3. Substitute the point and new slope:',9.5);math(r'y-y_1=m_{\mathrm{new}}(x-x_1)',270,237,285,10)
 rule(58,214,390)
 text(48,195,'4. Distribute and rewrite in slope-intercept form:',9.5);rule(305,193,140)
 text(48,177,'Point check: ______________  Slope check: ______________',8.5)
 grid(464,175,101)
 section(156,36,f'Slide {8 if back else 4} | {ids[5]} - Try it independently')
 ip='(1,0)' if back else '(2,1)';math(r'y=-\frac{2}{3}x+1\qquad P='+ip,48,117,205,12)
 text(48,97,'Use the same four steps.',9.5);text(48,78,'y = ______________________',10)
 text(48,58,'Check: slope and point.',9)
 box(270,45,296,88)
 text(36,22,'MacInTodd Math | beta/parallel-perpendicular-lesson | '+('Back: perpendicular' if back else 'Front: parallel'),7)
 text(520,22,'2 / 2' if back else '1 / 2',7)
 c.showPage()
c.save();reader=PdfReader(str(out));assert len(reader.pages)==2
for p,ids in zip(reader.pages,[['P1','P2a','P2b','P2c','P3','P4'],['T5','T6a','T6b','T6c','T7','T8']]):
 for id in ids:assert id in p.extract_text(),id
Path('output/pdf/parallel-perpendicular-classroom-notes.pdf').write_bytes(out.read_bytes())
print(out)
