const SPEC = __FIGURE_SPEC__;
const { Cam, clamp, fit, open, poly, proj, rrect, circ, mk, rad, spring, stepS, pointer, register, disposer } = HL;

function mount({ stage, svg, read }, span) {
  const bag=disposer(),C=Cam(45,.5,2.65);fit(C,[[-50,-38,0],[50,38,0],[-50,-38,88],[50,38,88]],200,166);
  const P=proj(C),frameG=mk("g",{},svg),background=mk("g",{},svg),g=mk("g",{},svg),traveling=mk("path",{class:"nf lo"},background),line=(p,c="nf lo")=>mk("path",{d:open(p),class:c},g),shape=(p,c="nf sil")=>mk("path",{d:poly(p),class:c},g),frameLine=(p,c="nf lo")=>mk("path",{d:open(p),class:c},frameG),frameShape=(p,c="nf sil")=>mk("path",{d:poly(p),class:c},frameG),backLine=(p,c="nf lo")=>mk("path",{d:open(p),class:c},background),backShape=(p,c="nf sil")=>mk("path",{d:poly(p),class:c},background);
  const y=-13,pt=(u,v)=>P(u*1.12,y,44+(v-44)*1.1),curve=(fn,n=44)=>Array.from({length:n+1},(_,i)=>pt(...fn(i/n)));
  const oval=(cx,cz,rx,rz,n=48)=>Array.from({length:n},(_,i)=>{const a=i*2*Math.PI/n;return pt(cx+rx*Math.cos(a),cz+rz*Math.sin(a));});
  // A double moulded frame, tiny mitred corner joints and a rear easel give each panel real depth.
  frameLine([P(-25,12,7),P(-25,12,1),P(0,16,8),P(25,12,1),P(25,12,7)],"nf sil");
  frameLine([P(-32,10,7),P(-32,10,77),P(32,10,77),P(32,10,7),P(-32,10,7)],"nf sil");
  frameShape([P(-43,10,5),P(43,10,5),P(43,10,83),P(-43,10,83)],"sil");
  frameShape([P(-39,9,9),P(39,9,9),P(39,9,79),P(-39,9,79)],"nf lo");
  frameShape([pt(-35,10),pt(35,10),pt(35,76),pt(-35,76)],"nf sil");
  for(const [u,v,sx,sz] of [[-35,10,1,1],[35,10,-1,1],[-35,76,1,-1],[35,76,-1,-1]])frameLine([pt(u,v),pt(u+sx*2.5,v),pt(u,v+sz*2.5)],"nf lo");
  const s=spring(0);let active,last=200,draw=()=>{};

  if(SPEC.kind==="mona"){
    // Joined hands, a triangular mantle, still face and a distant bridge in receding bands.
    backLine(curve(t=>[-30+60*t,18+8*Math.sin(t*Math.PI)]),"nf lo");
    backLine(curve(t=>[-29+58*t,24+10*Math.sin(t*Math.PI)]),"nf lo");
    shape([pt(-20,23),pt(-15,39),pt(-13,57),pt(-7,67),pt(7,67),pt(14,57),pt(15,39),pt(22,23),pt(12,19),pt(0,22),pt(-12,19)],"sil");
    line(oval(0,56,12,14),"nf sil");line([pt(-12,59),pt(-8,70),pt(0,73),pt(10,69),pt(14,59)],"nf lo");
    line([pt(-7,57),pt(-3,56),pt(1,57)],"nf lo");line([pt(5,57),pt(9,57),pt(11,56)],"nf lo");line([pt(0,55),pt(-1,51),pt(2,50)],"nf lo");line(curve(t=>[-5+10*t,46-2*Math.sin(Math.PI*t)],18),"nf lo");
    line([pt(-13,34),pt(-9,29),pt(-2,26),pt(5,28),pt(11,33),pt(15,38)],"nf sil");
    line([pt(-9,28),pt(-4,25),pt(4,25),pt(9,28),pt(8,31),pt(1,32),pt(-7,31),pt(-12,33)],"nf lo");
    line([pt(-11,65),pt(-7,68),pt(-2,69)],"nf lo");line([pt(7,68),pt(11,65),pt(14,60)],"nf lo");
    line([pt(-10,53),pt(-6,54),pt(-3,53)],"nf lo");line([pt(4,53),pt(8,54),pt(11,53)],"nf lo");
    for(let i=0;i<6;i++){const u=-28+i*11;backLine([pt(u,17),pt(u+6,19),pt(u+12,18)],"nf lo");}
    backLine([pt(-28,21),pt(-23,27),pt(-15,30)],"nf lo");backLine([pt(25,21),pt(19,28),pt(12,30)],"nf lo");
    // distant river, winding road and the small arched bridge
    backLine(curve(t=>[-30+60*t,35+3*Math.sin(5*t)]),"nf lo");backLine(curve(t=>[-30+60*t,39+2*Math.sin(4*t+1)]),"nf lo");
    backLine(curve(t=>[-20+40*t,37+5*Math.sin(Math.PI*t)]),"nf sil");backLine([pt(-13,39),pt(-10,43),pt(0,44),pt(10,43),pt(13,39)],"nf lo");
    for(let i=0;i<3;i++){const u=-26+i*25;backLine([pt(u,47),pt(u+8,49),pt(u+18,48)],"nf lo");}
    // Fine hair sweeps, bodice pleats and the crossed hands supply portrait detail.
    for(let i=0;i<5;i++)line(curve(t=>[-12-i*.6+24*t,69-i*1.7-7*Math.sin(Math.PI*t)],28),"nf lo");
    for(let i=0;i<7;i++){const u=-17+i*5.5;line([pt(u,22),pt(u+3,29),pt(u+2,36),pt(u+5,42)],"nf lo");}
    line([pt(-12,34),pt(-7,31),pt(-1,32),pt(5,35),pt(12,39)],"nf lo");
    for(let i=0;i<4;i++){const u=-7+i*3.4;line([pt(u,28+i*.6),pt(u+2,29+i*.6),pt(u+4,29+i*.5)],"nf sil");}
    line([pt(-8,25),pt(-4,23),pt(2,23),pt(8,25)],"nf lo");
    backLine(curve(t=>[-31+62*t,51+8*Math.sin(Math.PI*t)+2*Math.sin(5*Math.PI*t)],56),"nf lo");
    backLine(curve(t=>[-31+62*t,59+5*Math.sin(Math.PI*t+1)],48),"nf lo");
    draw=()=>{const q=clamp(s.x/20,-1,1),a=rad(s.x*1.7),land=[];for(let j=0;j<4;j++){const spread=1+q*.1,amp=5+j*1.4+q*8;land.push(open(curve(t=>[(t-.5)*60*spread,30+j*6+amp*Math.sin(2*Math.PI*t+j*.7+q*.8)],72)));}traveling.setAttribute("d",land.join(""));active.setAttribute("d",open([pt(-5,27),pt(-2,28),pt(2,27),pt(5+Math.sin(a)*8,29),pt(12,31)]));};
  } else if(SPEC.kind==="starry"){
    // Cypress foreground, a clustered village and concentric, hand-cut sky currents.
    shape([pt(-27,15),pt(-23,24),pt(-25,31),pt(-19,37),pt(-24,44),pt(-16,50),pt(-23,59),pt(-16,63),pt(-15,69),pt(-9,67),pt(-12,59),pt(-7,53),pt(-13,45),pt(-8,38),pt(-14,31),pt(-12,24),pt(-8,15)],"nf sil");
    line([pt(-18,17),pt(-17,33),pt(-20,47),pt(-16,62),pt(-11,68)],"nf lo");
    for(const [u,v,r] of [[-20,63,2],[10,65,4],[21,55,2],[1,51,2],[27,67,2]]){line(oval(u,v,r,r),"nf sil");line(oval(u,v,r+2,r+2),"nf lo");}
    backLine(curve(t=>[-5+34*t,63+3*Math.sin(2*Math.PI*t)+1.8*Math.sin(6*Math.PI*t)],64),"nf sil");
    backLine(curve(t=>[-2+31*t,58+2*Math.sin(2*Math.PI*t+1)+1.5*Math.sin(6*Math.PI*t+1)],64),"nf lo");
    for(let k=0;k<5;k++)backLine(curve(t=>[-7+39*t,69-k*3+2.5*Math.sin(2*Math.PI*t+k*.5)+1.4*Math.sin(6*Math.PI*t+k*.6)],56),"nf lo");
    for(const [u,v,r] of [[10,65,4],[21,55,2],[1,51,2]])for(let i=0;i<8;i++){const a=i*Math.PI/4;backLine([pt(u+Math.cos(a)*(r+2),v+Math.sin(a)*(r+2)),pt(u+Math.cos(a)*(r+5),v+Math.sin(a)*(r+5))],"nf lo");}
    backLine(curve(t=>[-30+60*t,48+2.5*Math.sin(3*Math.PI*t)]),"nf lo");backLine(curve(t=>[-30+60*t,45+2*Math.sin(3*Math.PI*t+1)]),"nf lo");
    shape([pt(-9,16),pt(-8,32),pt(-5,37),pt(-4,16)],"nf sil");shape([pt(8,16),pt(9,26),pt(12,31),pt(14,16)],"nf lo");
    for(let i=0;i<4;i++){const u=-5+i*3;line([pt(u,18),pt(u,25)],"nf lo");}
    line([pt(18,16),pt(18,35),pt(16,35),pt(16,16)],"nf lo");
    for(let i=0;i<7;i++){const z=18+i*6;line([pt(-26+i%2*2,z),pt(-16+i%2*2,z+2),pt(-10,z+1)],"nf lo");}
    draw=()=>{const a=s.x*.11;traveling.setAttribute("d",open(curve(t=>[-5+34*t,63+3*Math.sin(2*Math.PI*t+a)+1.8*Math.sin(6*Math.PI*t+a)],64)));active.setAttribute("d",open(curve(t=>[-2+15*t,59+2*Math.sin(2*Math.PI*t+a)],24)));};
  } else if(SPEC.kind==="wave"){
    // A moving hooked crest, layered current lines, sea spray, three boats and Fuji.
    const waveBody=mk("path",{class:"sil"},g),innerCurl=mk("path",{class:"nf lo"},g),foam=mk("path",{class:"nf sil"},g);
    backLine(curve(t=>[-31+62*t,22+2*Math.sin(7*Math.PI*t)]),"nf lo");
    backLine(curve(t=>[-31+62*t,18+2.6*Math.sin(6*Math.PI*t+1)]),"nf sil");
    // Fine current contours follow the long shoulder into the turning lip.
    for(let j=0;j<6;j++)backLine(curve(t=>[-30+58*t,27+j*2.2+3.4*Math.sin(Math.PI*t+j*.17)]),"nf lo");
    for(let j=0;j<5;j++)line(curve(t=>[-26+47*t,34+j*2.2+4*Math.sin(Math.PI*t+j*.13)]),j===0?"nf sil":"nf lo");
    // The skiffs have a pointed hull, a raised gunwale, rowers and breaking wakes.
    for(let b=0;b<3;b++){
      const u=-23+b*19,v=22+b*2;
      backLine([pt(u,v),pt(u+3,v-1),pt(u+8,v-1),pt(u+13,v),pt(u+16,v+1)],"nf sil");
      backLine([pt(u+2,v+1),pt(u+5,v+3),pt(u+11,v+3),pt(u+14,v+1)],"nf lo");
      for(let k=0;k<3;k++){const x=u+5+k*3.1;backLine([pt(x,v),pt(x+1,v+5),pt(x+2,v+7)],"nf lo");backLine([pt(x-1,v+7),pt(x+3,v+7)],"nf lo");}
      backLine(curve(t=>[u+14*t,v-3-1.4*Math.sin(Math.PI*t)],18),"nf lo");
    }
    // Fuji's double ridge and snow-cut cap sit far behind the nearest boat.
    backLine([pt(13,19),pt(17,29),pt(21,40),pt(25,28),pt(29,19)],"nf sil");
    backLine([pt(10,18),pt(16,31),pt(21,43),pt(27,29),pt(32,18)],"nf sil");
    backLine([pt(17,31),pt(20,33),pt(21,30),pt(23,33),pt(25,29)],"nf lo");
    backLine(curve(t=>[-30+60*t,15+1.8*Math.sin(5*Math.PI*t)]),"nf lo");
    // Spray curls and individual droplets break off the crest instead of forming a plain triangle.
    for(let i=0;i<8;i++){const u=3+i*3.1,v=57+Math.sin(i*.55)*8;line([pt(u,v),pt(u+2,v+4),pt(u+5,v+7),pt(u+4,v+2)],"nf lo");}
    for(const [u,v,r] of [[-1,71,1.2],[5,75,1],[13,69,1.2],[18,64,.9],[23,57,1]])line(oval(u,v,r,r,16),"nf lo");
    // Braided foam traces the hook and its inner hollow; the actual silhouette flexes with the pointer.
    const outline=(a)=>{
      const lift=Math.sin(a)*12,reach=Math.cos(a)*8;
      return [pt(-31,20),pt(-23,25),pt(-16,31),pt(-10,40),pt(-6,50),pt(-3+reach,60),pt(-1+reach,67+lift),pt(3+reach,64+lift),pt(8,57),pt(14,53),pt(12,59),pt(18,58),pt(25,52),pt(30,43),pt(31,33),pt(26,25),pt(18,21)];
    };
    draw=()=>{
      const a=rad(s.x*4.2),z=69+Math.sin(a)*12,crest=curve(t=>[-8+38*t,54+18*Math.sin(Math.PI*t+a*.24)],50);
      waveBody.setAttribute("d",poly(outline(a)));
      innerCurl.setAttribute("d",open(curve(t=>[-6+31*t,46+16*Math.sin(Math.PI*t+a*.2)],48)));
      foam.setAttribute("d",open(curve(t=>[-3+31*t,48+15*Math.sin(Math.PI*t+a*.2)],44)));
      traveling.setAttribute("d",open(crest));
      active.setAttribute("d",open([pt(-3+Math.cos(a)*6,z-5),pt(0+Math.cos(a)*8,z),pt(3+Math.cos(a)*7,z-3)]));
    };
  } else if(SPEC.kind==="pearl"){
    // Turned face, wrapped turban, folded shoulder and a single hanging pearl.
    shape([pt(-18,18),pt(-14,29),pt(-10,43),pt(-14,58),pt(-9,68),pt(10,69),pt(19,62),pt(17,51),pt(13,43),pt(20,34),pt(25,22),pt(18,17)],"nf sil");
    line(oval(1,53,12,15),"nf sil");line([pt(-11,58),pt(-8,68),pt(0,73),pt(13,69),pt(21,62),pt(26,66)],"nf sil");
    line([pt(-16,65),pt(-10,71),pt(4,73),pt(20,69),pt(28,63)],"nf lo");
    line([pt(-10,67),pt(-4,61),pt(5,57),pt(17,55)],"nf lo");line([pt(-7,64),pt(2,62),pt(10,62),pt(20,64)],"nf lo");
    line([pt(5,54),pt(10,54),pt(13,53)],"nf lo");line([pt(15,53),pt(18,52),pt(20,51)],"nf lo");line([pt(12,48),pt(11,44),pt(15,42)],"nf lo");line([pt(12,36),pt(17,35),pt(19,37)],"nf lo");
    line([pt(18,38),pt(23,34),pt(23,26),pt(19,24)],"nf sil");line(oval(19,22,3,4),"nf sil");
    line([pt(-15,23),pt(-6,30),pt(8,34),pt(18,29)],"nf lo");
    for(let i=0;i<6;i++)line(curve(t=>[-12+i*.3+24*t,70-i*2.1-4*Math.sin(Math.PI*t)],22),"nf lo");
    line([pt(-9,59),pt(-3,61),pt(4,61),pt(10,58)],"nf lo");
    line([pt(-5,52),pt(0,49),pt(6,50),pt(9,52)],"nf lo");line([pt(-3,46),pt(2,45),pt(7,46)],"nf lo");
    line([pt(-8,41),pt(-3,38),pt(2,37),pt(8,39)],"nf lo");
    for(let i=0;i<4;i++)line([pt(-14+i*2,19+i),pt(-7+i*2,24+i),pt(1+i*2,27+i)],"nf lo");
    draw=()=>{const a=rad(s.x*3.2);active.setAttribute("d",open([pt(19,29),pt(20+Math.sin(a)*7,25),pt(19+Math.sin(a)*9,19),pt(18+Math.sin(a)*10,15)]));};
  } else if(SPEC.kind==="scream"){
    // Bridge rails converge beyond the foreground figure; sky contours roll behind.
    backLine(curve(t=>[-30+60*t,62+5*Math.sin(5*t)]),"nf sil");backLine(curve(t=>[-30+60*t,57+4*Math.sin(5*t+1)]),"nf lo");
    backLine([pt(-29,18),pt(-18,27),pt(-9,38)],"nf sil");backLine([pt(30,18),pt(18,27),pt(9,38)],"nf sil");
    for(let i=0;i<5;i++){const u=-29+i*14;line([pt(u,18),pt(u,28-i*1.2)],"nf lo");}
    backLine(curve(t=>[-28+56*t,41+3*Math.sin(3*Math.PI*t)]),"nf lo");backLine(curve(t=>[-28+56*t,36+2*Math.sin(3*Math.PI*t+1)]),"nf lo");
    shape([pt(-2,17),pt(-6,29),pt(-5,40),pt(-8,53),pt(-5,65),pt(3,69),pt(10,64),pt(9,52),pt(13,41),pt(10,29),pt(5,18)],"sil");
    line(oval(2,52,8,14),"nf sil");line(oval(2,51,4,9),"nf lo");line([pt(-3,57),pt(0,58),pt(3,57)],"nf lo");
    line([pt(-6,44),pt(-12,37),pt(-10,33)],"nf sil");line([pt(9,44),pt(15,37),pt(13,33)],"nf sil");
    line([pt(-3,54),pt(0,52),pt(3,54)],"nf lo");line([pt(-5,48),pt(-2,49),pt(0,48)],"nf lo");line([pt(3,48),pt(6,49),pt(8,48)],"nf lo");
    line([pt(-3,41),pt(1,39),pt(5,41)],"nf lo");line([pt(-3,34),pt(0,32),pt(4,34)],"nf lo");
    for(let i=0;i<7;i++){const u=-27+i*9;backLine([pt(u,59+i%2*2),pt(u+7,61+i%2*2),pt(u+14,58+i%2*2)],"nf lo");}
    for(let i=0;i<6;i++){const u=-27+i*11;line([pt(u,20),pt(u+7,24),pt(u+14,20)],"nf lo");}
    draw=()=>{const a=s.x*.11;traveling.setAttribute("d",open(curve(t=>[-28+56*t,62+6*Math.sin(5*t+a)],50)));active.setAttribute("d",open([pt(-18,60),pt(-9,61+Math.sin(a)*6),pt(0,61),pt(10,60)]));};
  } else if(SPEC.kind==="lilies"){
    // Pond rings, broken reflections and asymmetrical pads with folded flower cups.
    backLine(curve(t=>[-28+56*t,21+2*Math.sin(4*Math.PI*t)]),"nf sil");backLine(curve(t=>[-28+56*t,67+2*Math.sin(4*Math.PI*t+1)]),"nf lo");
    for(const [u,v,rx,rz] of [[-18,30,8,4],[-2,23,7,3],[17,31,9,4],[-8,45,8,4],[15,52,7,3],[0,61,9,4]]){
      line(oval(u,v,rx,rz),"nf sil");line([pt(u-rx*.8,v),pt(u,v+1),pt(u+rx*.8,v)],"nf lo");
      for(let k=-2;k<=2;k++)line([pt(u,v),pt(u+k*rx*.24,v-1),pt(u+k*rx*.34,v-3)],"nf lo");
      line([pt(u,v-3),pt(u+2,v-8),pt(u+4,v-12)],"nf lo");line([pt(u+2,v-8),pt(u-1,v-11)],"nf lo");
    }
    for(const [u,v] of [[-3,42],[22,45],[-23,56]]){line(oval(u,v,4,2),"nf sil");line(oval(u,v,1.5,1.2),"nf lo");}
    for(let i=0;i<7;i++){const u=-27+i*9;line([pt(u,36),pt(u+3,37),pt(u+6,36)],"nf lo");}
    for(let j=0;j<5;j++)backLine(curve(t=>[-30+60*t,27+j*8+1.5*Math.sin(4*Math.PI*t+j)],44),"nf lo");
    for(const [u,v] of [[-3,42],[22,45],[-23,56]])for(let i=0;i<6;i++){const a=i*Math.PI/3;line([pt(u+Math.cos(a)*4,v+Math.sin(a)*2),pt(u+Math.cos(a)*7,v+Math.sin(a)*4)],"nf lo");}
    draw=()=>{const r=5+Math.abs(s.x)*.55;traveling.setAttribute("d",open(oval(0,43,r*1.7,r,48)));active.setAttribute("d",open([pt(0,43),pt(r*.4,43-r),pt(r,43),pt(r*.4,43+r),pt(0,43)]));};
  } else if(SPEC.kind==="venus"){
    // Shell pedestal, central standing figure, windborne mantle and a shore-line at right.
    const shellL=mk("path",{class:"nf sil"},g),shellR=mk("path",{class:"nf sil"},g),ribs=mk("path",{class:"nf lo"},g);
    const fold=(u,v,side,a)=>{const q=v-27,t=side*a;return [u*Math.cos(t)-q*Math.sin(t),27+u*Math.sin(t)+q*Math.cos(t)];};
    const shellLeft=[[-18,22],[-26,28],[-27,34],[-20,39],[0,42],[0,27]],shellRight=[[0,27],[0,42],[20,39],[27,34],[26,28],[18,22]];
    line([pt(-7,20),pt(-9,28),pt(-7,36),pt(-8,45),pt(-5,56),pt(-2,67),pt(0,70),pt(5,66),pt(8,56),pt(7,46),pt(8,37),pt(11,29),pt(7,21)],"nf sil");
    line([pt(-6,62),pt(-13,67),pt(-20,64),pt(-24,60)],"nf lo");line([pt(6,61),pt(13,66),pt(18,63)],"nf lo");
    line([pt(1,69),pt(0,73),pt(3,74)],"nf lo");line([pt(-19,20),pt(-25,15),pt(-28,16)],"nf sil");line([pt(19,20),pt(24,14),pt(29,15)],"nf sil");
    for(let i=0;i<4;i++)backLine(curve(t=>[-30+10*t,63+i*2+2*Math.sin(Math.PI*t)]),"nf lo");
    line([pt(15,18),pt(23,23),pt(30,21)],"nf lo");
    for(let i=0;i<8;i++)line([pt(-4+i*.9,68-i*.3),pt(-2+i*.9,73-i*.5),pt(0+i*.9,75-i*.6)],"nf lo");
    line([pt(-4,57),pt(0,60),pt(4,60),pt(8,57)],"nf lo");line([pt(-2,49),pt(2,48),pt(6,49)],"nf lo");
    line([pt(-3,45),pt(0,43),pt(3,45)],"nf lo");line([pt(-2,40),pt(2,39),pt(5,41)],"nf lo");
    for(let i=0;i<4;i++)line([pt(-20+i*2,22+i),pt(-12+i*3,27+i*1.4),pt(-4+i*3,30+i)],"nf lo");
    draw=()=>{const a=rad(s.x*1.8),L=shellLeft.map(([u,v])=>pt(...fold(u,v,1,a))),R=shellRight.map(([u,v])=>pt(...fold(u,v,-1,a))),r=[];
      shellL.setAttribute("d",poly(L));shellR.setAttribute("d",poly(R));
      for(let i=0;i<9;i++){const u=-22+i*5.5,side=u<0?1:-1;r.push(open([pt(...fold(u,27,side,a)),pt(...fold(u*.65,34,side,a)),pt(...fold(0,41,side,a))]));}
      ribs.setAttribute("d",r.join(""));active.setAttribute("d",open([pt(...fold(-27,34,1,a)),pt(...fold(-20,39,1,a)),pt(0,42),pt(...fold(20,39,-1,a)),pt(...fold(27,34,-1,a))]));};
  } else if(SPEC.kind==="kiss"){
    // Two figures close into one silhouette; patterned robes keep their separate weight.
    shape([pt(-23,19),pt(-21,32),pt(-15,39),pt(-12,50),pt(-4,56),pt(4,55),pt(12,50),pt(19,40),pt(22,23),pt(10,17),pt(-4,22)],"sil");
    line(oval(-5,56,9,11),"nf sil");line(oval(8,54,8,10),"nf sil");line([pt(-14,58),pt(-10,67),pt(-2,70),pt(5,65)],"nf lo");line([pt(4,63),pt(11,69),pt(20,65),pt(25,57)],"nf lo");
    line([pt(-3,57),pt(1,55),pt(5,57)],"nf lo");line([pt(-12,53),pt(-6,49),pt(0,50),pt(5,53)],"nf lo");
    for(let i=0;i<5;i++){const z=20+i*7;line([pt(-21,z),pt(-15,z+2),pt(-8,z),pt(-1,z+2),pt(6,z)],"nf lo");}
    for(let i=0;i<4;i++){const u=8+i*4;line([pt(u,25),pt(u+4,29),pt(u,33),pt(u+4,37)],"nf lo");}
    for(let row=0;row<5;row++)for(let col=0;col<4;col++){
      const u=-18+col*7+(row%2)*3,z=23+row*6;
      line([pt(u,z),pt(u+2,z+2),pt(u+4,z),pt(u+2,z-2),pt(u,z)],"nf lo");
    }
    line([pt(-9,48),pt(-5,43),pt(0,41)],"nf lo");line([pt(8,47),pt(12,43),pt(16,39)],"nf lo");
    line([pt(-5,37),pt(-1,34),pt(4,32),pt(9,33)],"nf lo");
    line([pt(-18,19),pt(-25,15),pt(-29,17)],"nf sil");line([pt(18,19),pt(26,14),pt(30,16)],"nf sil");
    draw=()=>{const a=s.x*.1;active.setAttribute("d",open([pt(-22,30),pt(-14+Math.sin(a)*8,35),pt(-6+Math.sin(a)*4,42),pt(0,44),pt(6-Math.sin(a)*4,42),pt(14-Math.sin(a)*8,35),pt(22,30)]));};
  } else if(SPEC.kind==="nightwatch"){
    // The captain's extended hand leads a compressed procession of helmets, lances and a drum.
    for(let i=0;i<7;i++){const u=-27+i*9,h=31+(i%3)*5;backLine([pt(u,17),pt(u-2,h),pt(u,h+7),pt(u+3,h),pt(u+5,17)],"nf lo");backLine([pt(u,h+6),pt(u+1,h+10),pt(u+3,h+6)],"nf lo");}
    line([pt(-13,17),pt(-14,34),pt(-12,48),pt(-8,55),pt(3,55),pt(8,48),pt(9,17)],"nf sil");line(oval(-2,56,8,10),"nf sil");
    line([pt(-10,54),pt(-14,60),pt(-6,63),pt(6,60),pt(9,54)],"nf lo");
    line([pt(-7,43),pt(-13,38),pt(-17,36),pt(-22,36)],"nf sil");line([pt(5,43),pt(11,38),pt(17,37),pt(24,42)],"nf sil");
    line([pt(20,22),pt(15,69)],"nf sil");line([pt(26,19),pt(22,72)],"nf lo");line([pt(-25,21),pt(-18,71)],"nf lo");
    line([pt(22,48),pt(25,51),pt(29,47),pt(27,43),pt(23,44),pt(22,48)],"nf sil");
    line([pt(-22,21),pt(-16,23),pt(-10,21)],"nf lo");
    for(let i=0;i<5;i++){const z=25+i*5;line([pt(-10,z),pt(-5,z+2),pt(1,z),pt(6,z+2)],"nf lo");}
    for(let i=0;i<4;i++){const u=-9+i*5;line([pt(u,18),pt(u+2,30),pt(u+1,43)],"nf lo");}
    line([pt(-9,54),pt(-13,58),pt(-9,62),pt(5,62),pt(10,57)],"nf lo");
    line([pt(-6,51),pt(-3,53),pt(1,51)],"nf lo");line([pt(2,48),pt(6,49),pt(8,47)],"nf lo");
    line([pt(22,43),pt(24,46),pt(27,45)],"nf lo");line([pt(21,39),pt(25,40),pt(28,38)],"nf lo");
    draw=()=>{const a=s.x*.14;active.setAttribute("d",open([pt(7,42),pt(15+Math.sin(a)*8,39),pt(22+Math.sin(a)*9,41),pt(29,48)]));};
  } else if(SPEC.kind==="meninas"){
    // Deep room, rear mirror and open doorway; the Infanta stands among attendants and canvas.
    backLine([pt(-29,70),pt(-18,57),pt(20,57),pt(29,70)],"nf sil");backLine([pt(-29,70),pt(-29,18),pt(-17,28),pt(20,28),pt(29,18),pt(29,70)],"nf lo");
    backLine([pt(12,44),pt(12,68),pt(27,68),pt(27,43)],"nf sil");backLine([pt(15,46),pt(24,46),pt(24,65)],"nf lo");
    backLine([pt(-28,61),pt(-19,57),pt(-18,18)],"nf lo");backLine([pt(28,61),pt(20,57),pt(18,18)],"nf lo");
    // framed canvas at left, set slightly in front of the room's converging wall
    backLine([pt(-29,24),pt(-18,24),pt(-18,60),pt(-29,60),pt(-29,24)],"nf sil");backLine([pt(-27,27),pt(-20,27),pt(-20,57),pt(-27,57),pt(-27,27)],"nf lo");
    // Infanta and attendants in a shallow arc
    line([pt(-7,18),pt(-9,29),pt(-6,38),pt(-4,48),pt(1,51),pt(6,48),pt(8,36),pt(10,27),pt(8,18)],"nf sil");line(oval(1,53,5,7),"nf sil");
    for(const u of [-19,14]){line([pt(u-4,19),pt(u-3,32),pt(u,38),pt(u+4,31),pt(u+5,19)],"nf lo");line(oval(u,40,4,6),"nf lo");}
    line([pt(19,18),pt(18,37),pt(24,42),pt(27,37),pt(26,18)],"nf sil");line(oval(23,44,4,5),"nf lo");
    for(let i=0;i<8;i++){const u=-6+i*2;line([pt(u,19),pt(u-1,30+i%2*2),pt(u,43+i%2*2)],"nf lo");}
    for(let i=0;i<5;i++){const z=23+i*5;line([pt(-5,z),pt(0,z+2),pt(5,z)],"nf lo");}
    line([pt(-4,50),pt(0,52),pt(5,50)],"nf lo");line([pt(-3,46),pt(0,44),pt(4,46)],"nf lo");
    for(let i=0;i<5;i++)backLine([pt(-27+i*10,50),pt(-25+i*10,54),pt(-23+i*10,50)],"nf lo");
    // tiny mirror holds two reflected figures without using pictorial text or marks
    line([pt(-8,62),pt(2,62),pt(2,69),pt(-8,69),pt(-8,62)],"nf sil");line([pt(-6,64),pt(-3,67),pt(0,64)],"nf lo");
    draw=()=>{const a=s.x*.11;active.setAttribute("d",open([pt(-8,63),pt(-3+Math.sin(a)*6,62),pt(3+Math.sin(a)*9,65),pt(-2+Math.cos(a)*8,69),pt(-8,63)]));};
  }

  active=mk("path",{class:"nf hi"},g);draw();const B=register(stage,dt=>{const before=s.x,moving=stepS(s,dt);if(moving||s.x!==before)draw();return moving;});bag.add(B.unregister);
  function aim(x){last=x;s.t=clamp((x-200)/90,-1,1)*span;read.textContent=SPEC.readout;B.wake();}
  bag.add(pointer(stage,{move:([x])=>aim(x),leave:()=>{s.t=0;read.textContent="rest";B.wake();}}));bag.add(()=>svg.replaceChildren());
  return {set:v=>{span=v;if(read.textContent!=="rest")aim(last);},destroy:bag.dispose};
}
hairline({name:SPEC.id,means:SPEC.means,rules:[1,3,4,8,9],range:SPEC.range,answer:SPEC.answer,edge:SPEC.edge,tour:SPEC.tour,mount});
