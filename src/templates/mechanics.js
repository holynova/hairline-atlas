const SPEC = __FIGURE_SPEC__;
const { Cam, clamp, fit, open, poly, proj, rings, prism, circ, facing, solid, put, mk, rad, spring, stepS, pointer, register, disposer } = HL;

function mount({ stage, svg, read }, span) {
  const bag=disposer(),C=Cam(45,.5,SPEC.kind==="fourbar"?2.4:2.45);fit(C,[[-62,-42,0],[62,42,0],[-62,-42,80],[62,42,80]],200,166);
  const P=proj(C),front=facing(C),g=mk("g",{},svg),line=(p,c="nf lo")=>mk("path",{d:open(p),class:c},g),shape=(p,c="nf sil")=>mk("path",{d:poly(p),class:c},g);
  const box=(a,b,c,d,z0,z1,r=5,k=1)=>{const q=solid(g);put(q,prism(P,front,...rings(a,b,c,d,r,k),z0,z1));return q;};
  const face=(x,y,z,r,n=40)=>circ(r,n).map(q=>P(x,y,z+q.v));
  const plan=(x,y,z,r,n=20)=>circ(r,n).map(q=>P(x+q.u,y+q.v,z));
  const deck=box(-43,-29,43,29,0,5,5,1.2),s=spring(0),radial=(cx,cz,r,n,phase=0)=>Array.from({length:n},(_,i)=>{const a=phase+i*2*Math.PI/n;return P(cx+Math.cos(a)*r,0,cz+Math.sin(a)*r);});let active,last=200,draw=()=>{};
  // A machined perimeter, four recessed channels and slotted corner fasteners
  // give every mechanism a real mounting plate and a readable engineering scale.
  line([P(-37,-23,5.2),P(37,-23,5.2),P(37,23,5.2),P(-37,23,5.2),P(-37,-23,5.2)],"nf lo");
  for(const x of [-34,-28,28,34])line([P(x,-20,5.3),P(x,20,5.3)],"nf lo");
  for(const x of [-36,36])for(const y of [-21,21]){
    line(plan(x,y,5.4,1.7),"nf sil");line([P(x-.85,y,5.5),P(x+.85,y,5.5)],"nf lo");
  }
  for(const x of [-19,-8,8,19]){line(plan(x,0,5.3,1.1),"nf lo");line([P(x,0,5.4),P(x,4,5.4)],"nf lo");}
  const gear=(cx,cz,r,teeth,phase=0,y=0)=>{const out=[];for(let i=0;i<teeth;i++)for(const [f,k] of [[0,.68],[.14,.68],[.19,1],[.43,1],[.48,.68],[.62,.68]]){const a=phase+(i+f)*2*Math.PI/teeth;out.push(P(cx+Math.cos(a)*r*k,y,cz+Math.sin(a)*r*k));}return out;};
  const spokes=(x,z,r,n=6,y=-1)=>{for(let i=0;i<n;i++){const a=i*2*Math.PI/n;line([P(x,y,z),P(x+Math.cos(a)*r,y,z+Math.sin(a)*r)],"nf lo");}};

  if(SPEC.kind==="gears"){
    // Bearing towers and a cross rail hold the meshing wheels above the base plate.
    box(-22,5,-12,17,7,38,3,1);box(12,5,22,17,7,38,3,1);box(-27,10,27,18,8,12,3,1);
    for(const x of [-17,17]){line(face(x,3,36,10),"nf sil");line(face(x,2,36,7),"nf lo");}
    const left=-17,right=17,large=22,small=14,teethL=16,teethS=10;
    const a=rad(0);
    // Four independently updated toothed faces keep both wheels mechanically live.
    const leftFace=mk("path",{class:"nf sil"},g),leftBack=mk("path",{class:"nf lo"},g),rightFace=mk("path",{class:"nf sil"},g),rightBack=mk("path",{class:"nf lo"},g);
    for(let i=0;i<8;i++){
      const q=i*Math.PI/4,al=left+Math.cos(q)*large*.83,az=36+Math.sin(q)*large*.83;
      line([P(al,-3,az),P(al,3,az)],"nf lo");
    }
    for(let i=0;i<6;i++){
      const q=i*Math.PI/3,al=right+Math.cos(q)*small*.82,az=36+Math.sin(q)*small*.82;
      line([P(al,-3,az),P(al,3,az)],"nf lo");
    }
    line(face(left,-4,36,14,40),"nf lo");line(face(right,-4,36,8,36),"nf lo");
    line(face(left,-5,36,8),"nf sil");line(face(left,-6,36,4),"nf lo");
    line(face(right,-5,36,6),"nf sil");line(face(right,-6,36,3),"nf lo");
    for(let i=0;i<8;i++){const q=i*Math.PI/4;line(face(left+Math.cos(q)*10,-5,36+Math.sin(q)*10,1.1),"nf lo");}
    for(let i=0;i<6;i++){const q=i*Math.PI/3;line(face(right+Math.cos(q)*7,-5,36+Math.sin(q)*7,1),"nf lo");}
    draw=()=>{const q=rad(s.x*8),sp=[];
      leftFace.setAttribute("d",poly(gear(left,36,large,teethL,q,3)));leftBack.setAttribute("d",poly(gear(left,36,large,teethL,q,-3)));
      rightFace.setAttribute("d",poly(gear(right,36,small,teethS,-q*1.6,3)));rightBack.setAttribute("d",poly(gear(right,36,small,teethS,-q*1.6,-3)));
      for(let i=0;i<8;i++){const t=q+i*Math.PI/4;sp.push(open([P(left,-7,36),P(left+Math.cos(t)*13,-7,36+Math.sin(t)*13)]));}
      for(let i=0;i<6;i++){const t=-q*1.6+i*Math.PI/3;sp.push(open([P(right,-7,36),P(right+Math.cos(t)*8,-7,36+Math.sin(t)*8)]));}
      sp.push(open([P(left,-8,36),P(left+Math.cos(q)*16,-8,36+Math.sin(q)*16)]),open([P(right,-8,36),P(right+Math.cos(-q*1.6)*10,-8,36+Math.sin(-q*1.6)*10)]));
      active.setAttribute("d",sp.join(""));};
  } else if(SPEC.kind==="crank"){
    line([P(-42,-10,17),P(42,-10,17)],"nf sil");line([P(-42,-10,13),P(42,-10,13)],"nf lo");
    line(face(-23,-8,34,12),"nf sil");line(face(-23,-9,34,4),"nf lo");line([P(-38,-12,18),P(-8,-12,18)],"nf lo");
    const slide=box(10,-17,28,17,20,36,3,1.2),rod=line([P(-12,-13,34),P(18,-13,34)],"nf sil");
    draw=()=>{const a=rad(s.x*4),cx=-23+12*Math.cos(a),cz=34+12*Math.sin(a),sx=clamp(17+12*Math.cos(a),4,31);put(slide,prism(P,front,...rings(sx-9,-17,sx+9,17,3,1.2),20,36));
      rod.setAttribute("d",open([P(cx,-14,cz),P(sx,-14,28),P(sx-5,-14,28)]));active.setAttribute("d",[open([P(-23,-12,34),P(cx,-12,cz)]),open([P(sx-7,-18,19),P(sx+7,-18,19),P(sx+7,-18,37),P(sx-7,-18,37),P(sx-7,-18,19)])].join(""));};
  } else if(SPEC.kind==="cam"){
    const cam=(a)=>Array.from({length:72},(_,i)=>{const t=i*Math.PI/36,r=16+4*Math.cos(3*(t-a));return P(-5+Math.cos(t)*r,0,27+Math.sin(t)*r);});
    const camBody=mk("path",{class:"nf sil"},g);line(face(-5,-2,27,4),"nf lo");
    line([P(-5,-4,47),P(-5,-4,57)],"nf sil");line(face(-5,-5,47,8),"nf sil");line([P(-13,-5,56),P(3,-5,56)],"nf lo");
    for(let i=0;i<5;i++)line([P(-12+i*3,-5,58+i%2*2),P(-9+i*3,-5,58+i%2*2)],"nf lo");
    draw=()=>{const a=rad(s.x*1.4),lift=24+4*Math.cos(3*(-Math.PI/2-a));camBody.setAttribute("d",poly(cam(a)));active.setAttribute("d",[open([P(-5,-6,27),P(-5,-6,47+lift-24)]),open([P(-5,-7,48+lift-24),P(2,-7,48+lift-24)])].join(""));};
  } else if(SPEC.kind==="pulley"){
    line([P(-27,-3,69),P(27,-3,69),P(27,-3,65)],"nf sil");line([P(-27,-3,69),P(-27,-3,65)],"nf sil");
    line(face(-23,-5,59,8),"nf sil");line(face(22,-5,59,8),"nf sil");line(face(0,-5,39,10),"nf sil");
    line([P(-23,-7,69),P(-23,-7,59),P(0,-7,49),P(22,-7,59),P(22,-7,69)],"nf sil");
    const load=box(-10,-14,10,14,14,29,2,1.1);
    line([P(-9,-15,24),P(9,-15,24)],"nf lo");line([P(-8,-15,19),P(8,-15,19)],"nf lo");
    draw=()=>{const z=clamp(s.x*.34,-9,9);put(load,prism(P,front,...rings(-10,-14,10,14,2,1.1),14+z,29+z));active.setAttribute("d",open([P(0,-8,41+z),P(0,-8,69),P(22,-8,69),P(22,-8,59)]));};
  } else if(SPEC.kind==="scissor"){
    line([P(-32,-15,10),P(32,-15,10)],"nf sil");line([P(-28,-15,13),P(28,-15,13)],"nf lo");
    const arms=mk("path",{class:"nf sil"},g),top=box(-25,-18,25,18,0,0,3,1);
    draw=()=>{const half=clamp(17+s.x*.5,9,25),h=Math.sqrt(36*36-half*half)+14,lo=P(-half,-10,14),hi=P(half,-10,14),lt=P(-half,-10,h),rt=P(half,-10,h);
      arms.setAttribute("d",[open([lo,rt]),open([hi,lt]),open([P(-half,-10,14),P(-half,-10,h)]),open([P(half,-10,14),P(half,-10,h)])].join(""));put(top,prism(P,front,...rings(-half-8,-18,half+8,18,3,1),h-2,h+3));
      active.setAttribute("d",[open([P(-half-6,-19,h+4),P(half+6,-19,h+4)]),open([P(-half,-12,14),P(0,-12,h/2),P(half,-12,14)])].join(""));};
  } else if(SPEC.kind==="ratchet"){
    const rat=(a)=>gear(-5,36,24,20,a,-5);
    const ratchetWheel=mk("path",{class:"nf sil"},g);line(face(-5,-7,36,7),"nf sil");line(face(-5,-8,36,3),"nf lo");
    line([P(17,-9,57),P(26,-9,57),P(26,-9,62)],"nf sil");line([P(17,-9,57),P(7,-9,48)],"nf sil");
    const arm=mk("path",{class:"nf sil"},g);
    draw=()=>{const a=rad(s.x*1.25),turn=rad(s.x*4);ratchetWheel.setAttribute("d",poly(rat(turn)));arm.setAttribute("d",open([P(17,-10,57),P(25*Math.cos(a)-5,-10,36+25*Math.sin(a)),P(17,-10,57)]));active.setAttribute("d",open([P(17,-11,57),P(25*Math.cos(a)-5,-11,36+25*Math.sin(a))]));};
  } else if(SPEC.kind==="rack"){
    const pinion=mk("path",{class:"nf sil"},g),pinionSpokes=mk("path",{class:"nf lo"},g);line(face(-18,-5,38,5),"nf lo");
    line([P(0,-7,30),P(42,-7,30),P(42,-7,43),P(0,-7,43),P(0,-7,30)],"nf sil");
    for(let i=0;i<12;i++){const x=i*3.5;line([P(x,-8,43),P(x+1.5,-8,47),P(x+3,-8,43)],"nf lo");}
    line([P(0,-10,26),P(41,-10,26)],"nf lo");
    draw=()=>{const a=rad(s.x*2.5),x=clamp(15-10*a,-5,33),r=[];pinion.setAttribute("d",poly(gear(-18,38,17,12,a,-5)));
      for(let i=0;i<6;i++){const q=a+i*Math.PI/3;r.push(open([P(-18,-6,38),P(-18+Math.cos(q)*10,-6,38+Math.sin(q)*10)]));}
      pinionSpokes.setAttribute("d",r.join(""));active.setAttribute("d",open([P(x,-9,43),P(x+9,-9,43),P(x+9,-9,30),P(x,-9,30)]));};
  } else if(SPEC.kind==="fourbar"){
    const pivot=(x,z)=>{line(face(x,-5,z,4),"nf sil");line(face(x,-6,z,1.5),"nf lo");};
    line([P(-32,-8,19),P(32,-8,19)],"nf sil");pivot(-25,22);pivot(25,22);
    const linkage=mk("path",{class:"nf sil"},g),pins=mk("path",{class:"nf lo"},g);
    draw=()=>{const a=rad(-35+s.x*1.1),phi=rad(25+s.x*.44),ax=-25+19*Math.cos(a),az=22+19*Math.sin(a),bx=25+25*Math.cos(phi),bz=22+25*Math.sin(phi);
      linkage.setAttribute("d",[open([P(-25,-9,22),P(ax,-9,az)]),open([P(ax,-9,az),P(bx,-9,bz)]),open([P(25,-9,22),P(bx,-9,bz)])].join(""));pins.setAttribute("d",[...[[ax,az],[bx,bz]].map(([x,z])=>open([P(x-3,-10,z),P(x+3,-10,z)]))].join(""));
      active.setAttribute("d",open([P(-25,-11,22),P(ax,-11,az),P(bx,-11,bz),P(25,-11,22)]));};
  } else if(SPEC.kind==="geneva"){
    const slots=(a)=>{const out=[];for(let i=0;i<4;i++){const q=a+i*Math.PI/2;out.push(open([P(13,-5,37),P(13+18*Math.cos(q),-5,37+18*Math.sin(q))]));}return out.join("");};
    line(face(13,-6,37,24),"nf sil");line(face(13,-7,37,5),"nf lo");
    line(face(-26,-6,37,12),"nf sil");line(face(-26,-7,37,4),"nf lo");
    const drive=mk("path",{class:"nf sil"},g);
    draw=()=>{const a=rad(s.x*3),idx=clamp(Math.floor((s.x+20)/10),0,3),q=idx*Math.PI/2;active.setAttribute("d",[slots(q),open([P(-26,-9,37),P(-26+Math.cos(a)*12,-9,37+Math.sin(a)*12),P(-26+Math.cos(a)*20,-9,37+Math.sin(a)*20)]),open([P(-26+Math.cos(a)*20,-9,37+Math.sin(a)*20),P(13+Math.cos(q)*17,-9,37+Math.sin(q)*17)])].join(""));
      drive.setAttribute("d",open([P(-26,-8,37),P(-26+Math.cos(a)*12,-8,37+Math.sin(a)*12),P(-26+Math.cos(a)*20,-8,37+Math.sin(a)*20)]));};
  } else if(SPEC.kind==="press"){
    box(-36,-21,-29,21,7,75,2,1);box(29,-21,36,21,7,75,2,1);box(-36,-21,36,21,68,75,3,1.4);
    box(-37,-24,37,24,3,9,3,1.2);line(face(0,-24,73,14),"nf sil");line(face(0,-25,73,10),"nf lo");
    line([P(0,-10,62),P(0,-10,36)],"nf sil");
    for(let i=0;i<9;i++)line([P(-4,-11,60-i*2.4),P(4,-11,58-i*2.4)],"nf lo");
    const ram=box(-23,-18,23,18,28,33,2,1);
    draw=()=>{const a=rad(s.x*1.5),z=clamp(31-s.x*.28,21,41);put(ram,prism(P,front,...rings(-23,-18,23,18,2,1),z,z+5));
      const paths=[];for(let i=0;i<8;i++){const q=a+i*Math.PI/4;paths.push(open([P(Math.cos(q)*18,-7,73+Math.sin(q)*18),P(Math.cos(q)*30,-7,73+Math.sin(q)*30)]));}
      paths.push(open([P(0,-8,73),P(0,-8,z+5)]),open([P(-23,-20,z+5),P(23,-20,z+5)]));active.setAttribute("d",paths.join(""));};
  }

  active=mk("path",{class:"nf hi"},g);draw();const B=register(stage,dt=>{const before=s.x,moving=stepS(s,dt);if(moving||s.x!==before)draw();return moving;});bag.add(B.unregister);
  function aim(x){last=x;s.t=clamp((x-200)/90,-1,1)*span;read.textContent=SPEC.readout;B.wake();}
  bag.add(pointer(stage,{move:([x])=>aim(x),leave:()=>{s.t=0;read.textContent="rest";B.wake();}}));bag.add(()=>svg.replaceChildren());
  return {set:v=>{span=v;if(read.textContent!=="rest")aim(last);},destroy:bag.dispose};
}
hairline({name:SPEC.id,means:SPEC.means,rules:[1,3,4,8,9],range:SPEC.range,answer:SPEC.answer,edge:SPEC.edge,tour:SPEC.tour,mount});
