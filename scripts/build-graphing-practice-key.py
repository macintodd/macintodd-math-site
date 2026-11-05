"""Overlay worked solutions on the teacher's original two-page practice layout."""
import io,math,argparse
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from pypdf import PdfReader,PdfWriter
from pdf_publish import compress_for_browser
parser=argparse.ArgumentParser();parser.add_argument('--source',required=True);parser.add_argument('--output',required=True);args=parser.parse_args()
pdfmetrics.registerFont(TTFont('Answer','/System/Library/Fonts/Supplemental/Arial.ttf'))
pdfmetrics.registerFont(TTFont('AnswerBold','/System/Library/Fonts/Supplemental/Arial Bold.ttf'))
pdfmetrics.registerFont(TTFont('Work','/System/Library/Fonts/Supplemental/Courier New.ttf'))
purple=HexColor('#6726a5');reader=PdfReader(args.source);writer=PdfWriter();S=.72

def text(x,y,value,size=10,bold=False,color=purple):
 c.setFillColor(color);c.setFont('AnswerBold' if bold else 'Answer',size);c.drawString(x*S,792-y*S,value)
def work(x,y,value,size=10):
 c.setFillColor(purple);c.setFont('Work',size);c.drawString(x*S,792-y*S,value)
def frac(x,y,n,d,size=10):
 # Top-coordinate anchor is the center of the fraction bar.
 c.setFont('Answer',size);c.setFillColor(purple);c.setStrokeColor(purple)
 width=max(pdfmetrics.stringWidth(str(n),'Answer',size),pdfmetrics.stringWidth(str(d),'Answer',size))+5
 cx=x*S;cy=792-y*S;c.drawCentredString(cx,cy+3,str(n));c.line(cx-width/2,cy,cx+width/2,cy);c.drawCentredString(cx,cy-size,str(d))
def graph(box,m=None,b=None,pts=(),vertical=None,color=purple,labels=True):
 x0,y0,x1,y1=box;ox=(x0+x1)/2;oy=(y0+y1)/2;step=(x1-x0)*(.85/12);r=step*6
 def xy(x,y):return ox+x*step,oy+y*step
 c.saveState();clip=c.beginPath();clip.rect(ox-r,oy-r,2*r,2*r);c.clipPath(clip,stroke=0,fill=0);c.setStrokeColor(color);c.setFillColor(color);c.setLineWidth(1.3)
 if vertical is not None: ends=[(vertical,-6),(vertical,6)]
 else:
  ends=[(-6,m*(-6)+b),(6,m*6+b)]
  if m:ends += [((-6-b)/m,-6),((6-b)/m,6)]
  ends=[p for p in ends if -6-1e-8<=p[0]<=6+1e-8 and -6-1e-8<=p[1]<=6+1e-8];ends=sorted(set(ends))
 a,z=xy(*ends[0]),xy(*ends[-1]);c.line(*a,*z)
 for tip,other in [(a,z),(z,a)]:
  ang=math.atan2(other[1]-tip[1],other[0]-tip[0]);p=c.beginPath();p.moveTo(*tip)
  for delta in (-.45,.45):p.lineTo(tip[0]+5*math.cos(ang+delta),tip[1]+5*math.sin(ang+delta))
  p.close();c.drawPath(p,stroke=0,fill=1)
 for x,y in pts:
  px,py=xy(x,y);c.circle(px,py,2.2,stroke=0,fill=1)
  if labels:
   label=f'({x}, {y})';c.setFont('Answer',6.6);tw=pdfmetrics.stringWidth(label,'Answer',6.6)
   lx=min(max(px+4,ox-r+2),ox+r-tw-2);ly=py+5 if y<4 else py-10;c.drawString(lx,ly,label)
 c.restoreState()
# Image placements are the original graph coordinates in PDF points.
X=[(55.32969,204.67499),(231.3274,380.6727),(406.2388,555.5841)]
Y=[(503.8626,653.2079),(273.5153,422.8606),(88.40892,237.75422)]
for pageindex in (0,1):
 buf=io.BytesIO();c=canvas.Canvas(buf,pagesize=(612,792));text(700,78 if pageindex==0 else 57,'WORKED KEY',8,True)
 if pageindex==0:
  lines=[(-3,5,[(0,5),(1,2)]),(.5,-3,[(0,-3),(2,-2)]),(4,-1,[(0,-1),(1,3)]),(-2/3,2,[(0,2),(3,0)]),(1,4,[(0,4),(1,5)]),(-1,5,[(0,5),(1,4)]),(-3/5,3,[(0,3),(5,0)]),(2,4,[(-2,0),(0,4)]),(1,-5,[(0,-5),(5,0)])]
  for i,(m,b,pts) in enumerate(lines):
   col=i%3;row=i//3;graph((*X[col][:1],Y[row][0],X[col][1],Y[row][1]),m,b,pts)
   x=col*246
   if i<6:
    yy=146 if row==0 else 480
    if i in (1,3):frac(x+100,yy-3,1 if i==1 else '−2',2 if i==1 else 3)
    else:text(x+92,yy,str(int(m)),11,True)
    text(x+220,yy,str(b),11,True)
   else:
    text(x+64,994,str({6:(5,0),7:(-2,0),8:(5,0)}[i]),9,True);text(x+198,994,str({6:(0,3),7:(0,4),8:(0,-5)}[i]),9,True)
  text(685,462,'y = −x + 5',10,True)
  for x,rows in [(63,['y = 0: 3x = 15, x = 5','x = 0: 5y = 15, y = 3']),(309,['y = 0: −2x = 4, x = −2','x = 0: y = 4']),(555,['y = 0: 7x = 35, x = 5','x = 0: −7y = 35, y = −5'])]:
   for j,v in enumerate(rows):text(x,1014+j*18,v,8.7)
 else:
  boxes=[(53.88288,495.9254,203.22818,645.2707),(231.3274,495.9254,380.6727,645.2707),(407.6276,495.9254,556.9729,645.2707)]
  for box,m,b,pts in zip(boxes,[2,2,3],[3,-6,-6],[[(0,3),(1,5)],[(0,-6),(3,0)],[(0,-6),(2,0)]]):graph(box,m,b,pts)
  # Inverse operations are beneath matching terms, on both sides.
  for x,rows,n,d,rhs,final in [
   (92,['4y − 8x = 12','    +8x   +8x','4y      = 8x + 12'],'4y','4','8x + 12','y = 2x + 3'),
   (338,['2x − y = 6','−2x      −2x','    −y = −2x + 6'],'−y','−1','−2x + 6','y = 2x − 6'),
   (584,['9x − 3y = 18','−9x       −9x','    −3y = −9x + 18'],'−3y','−3','−9x + 18','y = 3x − 6')]:
   for j,v in enumerate(rows):work(x,121+j*19,v,9.4)
   frac(x+25,181,n,d,8.5);text(x+52,185,'=',9);frac(x+109,181,rhs,d,8.5);text(x+20,209,final,10,True)
  boxes2=[(53.88288,227.5022,203.22818,376.8475),(231.3274,227.5022,380.6727,376.8475),(407.6276,227.5022,556.9729,376.8475)]
  text(70,470,'0',11,True);text(312,470,'undefined',10,True)
  graph(boxes2[0],0,3,[(-2,3),(2,3)]);graph(boxes2[1],pts=[(-5,0),(-5,3)],vertical=-5)
  colors=[HexColor(x) for x in ['#6726a5','#087a9e','#b24528','#247441']]
  for m,b,pts,vertical,color in [(0,5,[(-2,5),(2,5)],None,colors[0]),(None,None,[(3,-2),(3,2)],3,colors[1]),(None,None,[(0,-4),(0,-1)],0,colors[2]),(0,3,[(-3,3),(4,3)],None,colors[3])]:graph(boxes2[2],m,b,pts,vertical,color,False)
  for x,y,v,k in [(690,498,'y = 5',0),(690,521,'x = 3',1),(690,542,'x = 0',2),(690,563,'y = 3',3)]:text(x,y,v,9,True,colors[k])
  text(72,960,'L(w) = 0.35w + 120',11,True);text(72,982,'w: weight in pounds (w ≥ 0)',9);text(72,1002,'L(w): total length in inches',9);text(72,1022,'m = 0.35 inch per pound',9)
  text(320,884,'M(t) = 15t + 50',11,True)
  # Wallet calculation: subtract 50 vertically beneath like terms.
  for j,v in enumerate(['15t + 50 = 140','    − 50   −50','15t      = 90','  t      = 6 hours']):work(320,992+j*16,v,9.6)
  text(564,907,'t is time in minutes.',9)
  text(564,944,'V(t) = −8t + 200',11,True)
  for j,v in enumerate(['0 = −8t + 200','−200    − 200','−200 = −8t','      t = 25 minutes']):work(564,1007+j*16,v,9.2)
 c.save();overlay=PdfReader(buf).pages[0];pg=reader.pages[pageindex];pg.merge_page(overlay);writer.add_page(pg)
compress_for_browser(writer);writer.add_metadata({'/Title':'Unit 1B Lesson 3 - Graphing Linear Equations - Worked Practice Key','/Author':'MacIntodd Math','/Subject':'Prepared worked solution key; purple answers on the original practice worksheet.'});out=Path(args.output);out.parent.mkdir(parents=True,exist_ok=True);writer.write(out);print(out)
