const SPEC = __FIGURE_SPEC__;
const { Cam, clamp, fit, hull, open, poly, proj, rings, prism, rrect, circ, facing, solid, put, mk, rad, spring, stepS, pointer, register, disposer } = HL;

function mount({ stage, svg, read }, span) {
  const bag=disposer(), C=Cam(45,0.5,2.4);
  fit(C,[[-62,-48,0],[62,48,0],[-62,-48,82],[62,48,108]],200,166);
  const P=proj(C), front=facing(C), g=mk("g",{},svg);
  const line=(pts,cls="nf lo")=>mk("path",{d:open(pts),class:cls},g);
  const shape=(pts,cls="nf lo")=>mk("path",{d:poly(pts),class:cls},g);
  const box=(a,b,c,d,z0,z1,r=5,inset=1)=>{const el=solid(g);put(el,prism(P,front,...rings(a,b,c,d,r,inset),z0,z1));return el;};
  const ringAt=(r,z)=>r.map(q=>P(q.u,q.v,z));
  const faceRing=(x,y,z,r,n=40)=>circ(r,n).map(q=>P(x+q.u,y,z+q.v));
  const planRing=(x,y,z,r,n=40)=>circ(r,n).map(q=>P(x+q.u,y+q.v,z));
  const circle=(pts,cls="nf lo")=>line(pts,cls);
  const planCircle=(x,y,z,r,cls="nf lo")=>circle(planRing(x,y,z,r),cls);
  box(-44,-32,44,32,0,5,6,1.2);
  line([P(-37,-24,5.3),P(37,-24,5.3),P(37,24,5.3),P(-37,24,5.3),P(-37,-24,5.3)],"nf lo");
  const springValue=spring(0);let active,last=200,draw=()=>{};

  if(SPEC.kind==="lamp"){
    box(-23,-20,13,20,5,9,10,1);planCircle(-5,0,9,15,"nf sil");planCircle(-5,0,9.5,11,"nf lo");
    box(-10,-9,-1,9,9,17,4,1.2);circle(faceRing(-5,-10,14,4),"nf lo");
    line([P(-5,0,17),P(-5,0,20)],"nf sil");
    const moving=mk("path",{class:"nf lo"},g),p1={x:-5,z:20},zig=(a,b,y,amp,n)=>{const out=[];for(let i=0;i<=n;i++){const t=i/n,x=a.x+(b.x-a.x)*t,z=a.z+(b.z-a.z)*t+(i===0||i===n?0:(i%2?amp:-amp));out.push(P(x,y,z));}return out;};
    draw=()=>{const a=rad(54+springValue.x*1.7),b=rad(48-springValue.x*2),p2={x:p1.x+24*Math.cos(a),z:p1.z+24*Math.sin(a)},p3={x:p2.x+22*Math.cos(b),z:p2.z+22*Math.sin(b)},shadeA=b-.42;
      const arm=[open([P(p1.x,-4,p1.z),P(p2.x,-4,p2.z),P(p3.x,-4,p3.z)]),open([P(p1.x,4,p1.z),P(p2.x,4,p2.z),P(p3.x,4,p3.z)]),open([P(p1.x,-4,p1.z),P(p1.x,4,p1.z)]),open([P(p2.x,-4,p2.z),P(p2.x,4,p2.z)]),open([P(p3.x,-4,p3.z),P(p3.x,4,p3.z)]),poly(faceRing(p2.x,-5,p2.z,4)),poly(faceRing(p3.x,-5,p3.z,4))];
      const shade=[{x:p3.x+4*Math.cos(shadeA),z:p3.z+4*Math.sin(shadeA)},{x:p3.x+20*Math.cos(shadeA-.7),z:p3.z+20*Math.sin(shadeA-.7)},{x:p3.x+23*Math.cos(shadeA+.7),z:p3.z+23*Math.sin(shadeA+.7)},{x:p3.x+5*Math.cos(shadeA+.2),z:p3.z+5*Math.sin(shadeA+.2)}];
      arm.push(poly(shade.map(q=>P(q.x,-6,q.z))),open([P(shade[1].x,-6,shade[1].z),P(shade[2].x,-6,shade[2].z)]),open([P(p3.x+7*Math.cos(shadeA),-7,p3.z+7*Math.sin(shadeA)),P(p3.x+17*Math.cos(shadeA),-7,p3.z+17*Math.sin(shadeA))]));
      arm.push(open(zig(p1,p2,-5,1.6,12)),open(zig(p2,p3,-5,1.2,10)));moving.setAttribute("d",arm.join(""));
      active.setAttribute("d",open(zig(p1,p2,-6,1.8,12)));};
  } else if(SPEC.kind==="moka"){
    const foot=rrect(-25,-23,25,23,10,6),belly=rrect(-31,-28,31,28,13,6),neck=rrect(-21,-18,21,18,7,6),inner=rrect(-19,-16,19,16,5,6);
    const lower=solid(g);put(lower,{sil:poly(hull(ringAt(foot,5).concat(ringAt(belly,21),ringAt(neck,36)))),crease:open(ringAt(inner,36))});
    line([P(-28,-20,23),P(28,-20,23)],"nf lo");
    for(let i=0;i<5;i++)line([P(-16+i*8,-17,26),P(-14+i*8,-17,29)],"nf lo");
    planCircle(0,0,37,19,"nf sil");planCircle(0,0,38,15,"nf lo");
    line([P(0,-4,37),P(0,4,37)],"nf lo");
    // Side handle, tapered pouring lip, filter seam and safety valve give the pot its profile.
    line([P(24,-1,16),P(34,-1,17),P(38,-1,23),P(37,-1,32),P(31,-1,36),P(23,-1,35)],"nf sil");
    line([P(27,-2,18),P(32,-2,19),P(34,-2,23),P(33,-2,29),P(29,-2,32)],"nf lo");
    line([P(-19,-2,44),P(-28,-2,47),P(-34,-2,52),P(-30,-2,51),P(-20,-2,48)],"nf sil");
    circle(faceRing(0,-4,44,2),"nf sil");line([P(0,-5,43),P(0,-5,45)],"nf lo");
    for(let i=0;i<7;i++)line([P(-18+i*6,-19,18),P(-17+i*6,-19,20)],"nf lo");
    line([P(-21,-20,34),P(21,-20,34)],"nf lo");
    const upper=solid(g), top=rrect(-21,-19,21,19,7,6),topIn=rrect(-18,-16,18,16,5,6);
    draw=()=>{const z=38+springValue.x;put(upper,prism(P,front,top,topIn,z,61+springValue.x));
      active.setAttribute("d",[open([P(21,0,46+springValue.x),P(33,0,47+springValue.x),P(35,0,55+springValue.x)]),open([P(-21,0,45+springValue.x),P(-29,0,48+springValue.x),P(-30,0,54+springValue.x)]),open([P(-7,-17,61+springValue.x),P(7,-17,61+springValue.x)]),open([P(-18,-16,z+3),P(18,-16,z+3)])].join(""));};
  } else if(SPEC.kind==="clock"){
    box(-22,-15,22,15,8,48,7,1.3);
    circle(faceRing(0,-16,31,25),"nf sil");circle(faceRing(0,-17,31,21),"nf lo");circle(faceRing(0,-18,31,17),"nf lo");
    for(let i=0;i<12;i++){const a=i*Math.PI/6;line([P(Math.sin(a)*18,-19,31+Math.cos(a)*18),P(Math.sin(a)*20,-19,31+Math.cos(a)*20)],"nf lo");}
    [-13,13].forEach(x=>{circle(faceRing(x,-4,53,10),"nf sil");circle(faceRing(x,-5,53,7),"nf lo");line([P(x-6,-6,50),P(x,-6,58),P(x+6,-6,50)],"nf lo");});
    line([P(-24,-14,10),P(-29,-14,4),P(-17,-14,4)],"nf sil");line([P(24,-14,10),P(29,-14,4),P(17,-14,4)],"nf sil");
    draw=()=>{const a=rad(springValue.x*2.4);active.setAttribute("d",[open([P(0,-20,31),P(Math.sin(a)*13,-20,31+Math.cos(a)*13)]),open([P(0,-21,31),P(Math.sin(a*.52+1.1)*11,-21,31+Math.cos(a*.52+1.1)*11)]),open([P(0,-18,49),P(Math.sin(a*.8)*7,-18,57)])].join(""));};
  } else if(SPEC.kind==="turntable"){
    box(-42,-31,42,31,5,13,5,1.2);
    for(let i=0;i<7;i++)planCircle(-5,0,14,28-i*3.3,i===0?"nf sil":"nf lo");
    planCircle(-5,0,14.4,3,"nf lo");planCircle(28,-18,15,6,"nf sil");
    for(let i=0;i<9;i++)line([P(-34+i*7,-27,13.5),P(-32+i*7,-27,13.5)],"nf lo");
    draw=()=>{const a=rad(-62+springValue.x*2),ex=28+Math.cos(a)*37,ey=-18+Math.sin(a)*37;
      active.setAttribute("d",[open([P(28,-18,17),P(ex,ey,22),P(ex-2,ey+4,22)]),open([P(ex-4,ey+4,21),P(ex+1,ey+6,21)]),open([P(27,-18,14),P(33,-18,14)])].join(""));};
  } else if(SPEC.kind==="scissors"){
    planCircle(-25,-8,25,11,"nf sil");planCircle(-25,8,25,11,"nf sil");planCircle(-25,-8,25,7,"nf lo");planCircle(-25,8,25,7,"nf lo");
    draw=()=>{const a=rad(15+springValue.x*.58),u=[Math.cos(a),Math.sin(a)],v=[-u[1],u[0]],paths=[];
      for(const side of [-1,1]){const off=side*2,pt=(t,w)=>P(u[0]*t+v[0]*w,u[1]*t+v[1]*w+off,25+side*.5);
        paths.push(poly([pt(-4,-3),pt(9,-3),pt(57,0),pt(9,3),pt(-4,3)]));paths.push(open([pt(9,0),pt(57,0)]));}
      paths.push(open([P(0,0,23),P(0,0,27)]));active.setAttribute("d",paths.join(""));};
  } else if(SPEC.kind==="sewing"){
    shape([P(-38,-12,9),P(39,-12,9),P(39,-12,18),P(18,-12,18),P(18,-12,50),P(9,-12,62),P(-23,-12,62),P(-34,-12,54),P(-34,-12,21),P(-38,-12,18)],"nf sil");
    line([P(-33,-13,52),P(-22,-13,57),P(6,-13,57),P(12,-13,49),P(12,-13,19),P(31,-13,19)],"nf lo");
    for(let i=0;i<4;i++)circle(faceRing(-10+i*7,-15,65,3),"nf lo");
    circle(faceRing(32,-13,32,18),"nf sil");circle(faceRing(32,-14,32,13),"nf lo");
    circle(faceRing(-21,-13,75,5),"nf lo");
    draw=()=>{const z=24-springValue.x*.8;active.setAttribute("d",[open([P(4,-15,49),P(4,-15,z),P(11,-15,z)]),open([P(1,-16,z+3),P(7,-16,z+3)]),open([P(-22,-12,61),P(-22,-12,75),P(-20,-12,77),P(-18,-12,61)])].join(""));};
  } else if(SPEC.kind==="watch"){
    // A stitched leather strap, articulated lug links, fluted bezel and a real crown.
    shape([P(-7,-47,17),P(-10,-39,17),P(-10,-22,17),P(-13,-18,17),P(-13,18,17),P(-10,22,17),P(-10,39,17),P(-7,47,17),P(7,47,17),P(10,39,17),P(10,22,17),P(13,18,17),P(13,-18,17),P(10,-22,17),P(10,-39,17),P(7,-47,17)],"sil");
    for(const x of [-7,7])line([P(x,-43,17.5),P(x,-25,17.5),P(x,-22,17.5)],"nf lo");
    for(let i=0;i<5;i++){const y=23+i*4;planCircle(0,y,18,1.5,"nf lo");}
    for(const y of [-21,21]){line([P(-14,y,22),P(-10,y,29),P(10,y,29),P(14,y,22)],"nf sil");line([P(-13,y,20),P(-10,y,24)],"nf lo");line([P(13,y,20),P(10,y,24)],"nf lo");}
    box(-23,-23,23,23,21,31,11,1.4);planCircle(0,0,31.5,21,"nf sil");planCircle(0,0,32,18,"nf lo");planCircle(0,0,32.2,14,"nf lo");
    for(let i=0;i<12;i++){const a=i*Math.PI/6;line([P(Math.cos(a)*19,Math.sin(a)*19,32.5),P(Math.cos(a)*21,Math.sin(a)*21,32.5)],"nf lo");}
    box(22,-4,29,4,24,29,2,1);for(let i=0;i<5;i++)line([P(25,-3+i*1.5,24),P(28,-3+i*1.5,24)],"nf lo");
    planCircle(0,0,32.3,2,"nf lo");
    draw=()=>{const a=rad(-58+springValue.x*3.2);active.setAttribute("d",[open([P(0,0,33),P(Math.cos(a)*13,Math.sin(a)*13,33)]),open([P(0,0,33.3),P(Math.cos(a*.08+1.2)*9,Math.sin(a*.08+1.2)*9,33.3)]),open([P(0,-3,33),P(0,3,33)])].join(""));};
  }

  active=mk("path",{class:"nf hi"},g);draw();
  const B=register(stage,dt=>{const before=springValue.x,moving=stepS(springValue,dt);if(moving||springValue.x!==before)draw();return moving;});bag.add(B.unregister);
  function aim(x){last=x;springValue.t=clamp((x-200)/90,-1,1)*span;read.textContent=SPEC.readout;B.wake();}
  bag.add(pointer(stage,{move:([x])=>aim(x),leave:()=>{springValue.t=0;read.textContent="rest";B.wake();}}));
  bag.add(()=>svg.replaceChildren());
  return {set:v=>{span=v;if(read.textContent!=="rest")aim(last);},destroy:bag.dispose};
}

hairline({name:SPEC.id,means:SPEC.means,rules:[1,3,4,8,9],range:SPEC.range,answer:SPEC.answer,edge:SPEC.edge,tour:SPEC.tour,mount});
