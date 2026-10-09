const SPEC = __FIGURE_SPEC__;
const { Cam, clamp, fit, hull, open, poly, proj, rings, prism, rrect, circ, facing, solid, put, mk, rad, spring, stepS, pointer, register, disposer } = HL;

function mount({ stage, svg, read }, span) {
  const bag=disposer(), C=Cam(45,.5,2.3);
  fit(C,[[-62,-46,0],[62,46,0],[-62,-46,88],[62,46,88]],200,166);
  const P=proj(C),front=facing(C),g=mk("g",{},svg),line=(p,c="nf lo")=>mk("path",{d:open(p),class:c},g),shape=(p,c="nf sil")=>mk("path",{d:poly(p),class:c},g);
  const R=(a,b,c,d,r=5,k=1)=>rrect(a,b,c,d,r,6), at=(r,z)=>r.map(q=>P(q.u,q.v,z));
  const box=(a,b,c,d,z0,z1,r=5,k=1)=>{const s=solid(g);put(s,prism(P,front,...rings(a,b,c,d,r,k),z0,z1));return s;};
  const face=(x,y,z,r,n=36)=>circ(r,n).map(q=>P(x,y+q.u,z+q.v));
  const ringYZ=(x,y,z,r,n=32)=>circ(r,n).map(q=>P(x,y+q.u,z+q.v));
  const plan=(x,y,z,r,n=36)=>circ(r,n).map(q=>P(x+q.u,y+q.v,z));
  const wheel=(x,y,z,r=10,c="nf sil")=>line(face(x,y,z,r),c), deck=box(-45,-31,45,31,0,4,7,1.2);
  const s=spring(0);let active,last=200,draw=()=>{};

  if(SPEC.kind==="locomotive"){
    // Track, three spoked drivers, boiler bands and a stepped cab make a compact side view.
    for(let i=0;i<8;i++){const x=-48+i*13;line([P(x,-26,2),P(x+3,-26,2),P(x+3,26,2),P(x,26,2),P(x,-26,2)],"nf lo");}
    line([P(-55,-23,5),P(52,-23,5)],"nf sil");line([P(-55,23,5),P(52,23,5)],"nf sil");
    for(const x of [-24,1,28]){wheel(x,21,12,11);wheel(x,23,12,7,"nf lo");}
    // Rounded boiler and cab shells make an opaque body for the layered pipework.
    box(-31,-17,20,17,16,34,11,2);box(18,-19,42,19,11,39,5,1.4);
    // One continuous side profile ties the boiler, running board, cab and rear bunker together.
    shape([P(-51,-22,14),P(-46,-22,18),P(-41,-22,19),P(-38,-22,29),P(-33,-22,36),P(-28,-22,38),P(13,-22,38),P(18,-22,32),P(23,-22,29),P(23,-22,39),P(27,-22,45),P(36,-22,45),P(42,-22,39),P(42,-22,15),P(51,-22,15),P(51,-22,11),P(-51,-22,11)],"nf sil");
    line([P(-50,-21,12),P(50,-21,12)],"nf lo");
    // Ringed boiler barrel, twin steam domes and a flared stack give the side profile depth.
    for(const x of [-31,-18,-4,10,20])line(ringYZ(x,-18,27,10),x===-31||x===20?"nf sil":"nf lo");
    for(const a of [-.65,0,.65])line([P(-30,-18+Math.cos(a)*10,27+Math.sin(a)*10),P(19,-18+Math.cos(a)*10,27+Math.sin(a)*10)],"nf lo");
    // The smokebox door, boiler seams and sight glass make the long barrel read as a vessel.
    line(ringYZ(-32,-18,27,7),"nf lo");line(ringYZ(-33,-18,27,3),"nf lo");line([P(-34,-18,17),P(-34,-18,37)],"nf lo");
    line([P(-30,-19,35),P(18,-19,35)],"nf lo");line([P(-30,-19,19),P(18,-19,19)],"nf lo");
    // Two cast domes use elliptical shoulders and rolled rims, not stacked boxes.
    for(const [x,z0,z1,r] of [[-24,37,44,4.5],[-15,39,45,2.8],[7,36,40,2.7]]){
      line(plan(x,-18,z0,r),"nf lo");line(plan(x,-18,z1,r*.82),"nf sil");
      for(const a of [0,Math.PI/2,Math.PI,Math.PI*1.5])line([P(x+Math.cos(a)*r,-18+Math.sin(a)*r,z0),P(x+Math.cos(a)*r*.82,-18+Math.sin(a)*r*.82,z1)],"nf lo");
      line(plan(x,-18,z1+1,r*.92),"nf lo");
    }
    // A flared stack has a narrow throat and broad lip instead of a square tower.
    line([P(-39,-19,35),P(-39,-19,43),P(-43,-19,52),P(-43,-19,55),P(-31,-19,55),P(-31,-19,52),P(-35,-19,43),P(-35,-19,35)],"nf sil");
    line([P(-44,-19,55),P(-30,-19,55)],"nf lo");line([P(-41,-19,51),P(-33,-19,51)],"nf lo");
    for(const x of [-24,1,28]){wheel(x,-19,12,11);wheel(x,-21,12,7,"nf lo");line([P(x-4,-23,12),P(x+4,-23,12)],"nf lo");}
    line([P(-45,-19,17),P(-39,-19,12),P(-34,-19,12)],"nf lo");
    line([P(-34,-19,18),P(-34,-19,37)],"nf lo");line([P(-38,-19,14),P(-38,-19,23)],"nf lo");
    // One long, stepped running-board contour visually joins the boiler, cab and tender.
    line([P(-51,-22,14),P(-46,-22,17),P(-41,-22,18),P(-37,-22,25),P(-31,-22,31),P(-24,-22,33),P(11,-22,33),P(18,-22,30),P(23,-22,25),P(39,-22,25),P(45,-22,18),P(51,-22,15),P(51,-22,12),P(-51,-22,12),P(-51,-22,14)],"nf sil");
    line(plan(-31,-22,31,6),"nf lo");line(plan(-18,-22,27,7),"nf lo");line(plan(-4,-22,27,7),"nf lo");line(plan(10,-22,27,7),"nf lo");line(plan(20,-22,27,6),"nf lo");
    line([P(-31,-23,18),P(17,-23,18)],"nf lo");line([P(-31,-23,21),P(17,-23,21)],"nf lo");
    for(const x of [-17,14])line([P(x,-18,38),P(x,-18,49)],"nf lo");
    // Framed cab windows, handrail and boiler-side piping break up the coach-like body.
    line([P(23,-20,27),P(23,-20,39),P(34,-20,39),P(34,-20,27),P(23,-20,27)],"nf lo");
    line([P(36,-20,27),P(36,-20,38),P(40,-20,36),P(40,-20,27)],"nf lo");
    line([P(23,-20,33),P(34,-20,33)],"nf lo");line([P(29,-20,27),P(29,-20,39)],"nf lo");
    line([P(-26,-20,18),P(-11,-20,17),P(-8,-20,20),P(-8,-20,24)],"nf lo");
    line([P(-28,-20,22),P(-14,-20,22),P(-14,-20,25)],"nf lo");
    for(let i=0;i<4;i++)line([P(-8+i*4,-21,20),P(-8+i*4,-21,22)],"nf lo");
    line([P(18,-20,39),P(22,-20,42),P(22,-20,47),P(18,-20,47),P(18,-20,39)],"nf lo");
    line([P(25,-20,39),P(29,-20,42),P(29,-20,47),P(25,-20,47),P(25,-20,39)],"nf lo");
    line([P(17,-19,21),P(41,-19,21),P(41,-19,23),P(17,-19,23)],"nf lo");
    line([P(-40,-20,18),P(-45,-20,8),P(-53,-20,5),P(-47,-20,13)],"nf sil");
    line([P(-48,-21,9),P(-39,-21,18),P(-32,-21,18)],"nf lo");
    for(let i=0;i<5;i++)line([P(-49+i*2,-21,7),P(-47+i*2,-21,13)],"nf lo");
    // Crosshead travels along a fixed guide as the three crank pins turn in sequence.
    line([P(-48,-24,8),P(-48,-24,17),P(-24,-24,17),P(-24,-24,8)],"nf sil");
    line([P(-47,-24,10),P(-25,-24,10)],"nf lo");
    draw=()=>{const a=rad(s.x*7.2),pts=[];for(const x of [-24,1,28]){for(let k=0;k<6;k++){const q=a+k*Math.PI/3;pts.push(open([P(x,-23,12),P(x,-23+Math.cos(q)*8,12+Math.sin(q)*8)]));}}
      const crank=-24+Math.cos(a)*8,cz=12+Math.sin(a)*8,cross=-36+Math.cos(a)*10;
      pts.push(open([P(-24,-24,12),P(1,-24,12+Math.sin(a)*9),P(28,-24,12)]));
      pts.push(open([P(-24,-24,12),P(crank,-24,cz),P(cross,-24,12)]));
      pts.push(open([P(cross-3,-25,9),P(cross+3,-25,9),P(cross+3,-25,15),P(cross-3,-25,15),P(cross-3,-25,9)]));
      pts.push(open([P(-24,-24,12),P(1,-24,12),P(28,-24,12)]));active.setAttribute("d",pts.join(""));};
  } else if(SPEC.kind==="helicopter"){
    // A glazed cockpit, tapering tail boom, four-blade rotor and two sprung skids.
    shape([P(-37,-2,35),P(-24,-2,47),P(-8,-2,49),P(5,-2,43),P(17,-2,42),P(38,-2,48),P(45,-2,45),P(23,-2,37),P(8,-2,32),P(-19,-2,31),P(-37,-2,35)]);
    line([P(-38,-4,35),P(-31,-18,39),P(-10,-18,42),P(-2,-4,40),P(-8,-4,31)],"nf sil");
    line([P(-26,-19,39),P(-16,-19,40),P(-14,-4,41)],"nf lo");line([P(-8,-4,42),P(-4,-4,35)],"nf lo");
    line([P(9,0,39),P(45,0,45)],"nf sil");wheel(48,0,45,5,"nf lo");
    line([P(0,0,44),P(0,0,58)],"nf sil");line([P(-3,-2,58),P(4,-2,58)],"nf lo");
    for(const y of [-20,20]){line([P(-16,y,20),P(19,y,20)],"nf sil");line([P(-10,y,21),P(-17,y,31)],"nf sil");line([P(12,y,21),P(19,y,34)],"nf sil");}
    draw=()=>{const a=rad(s.x*2),paths=[];for(let i=0;i<4;i++){const q=a+i*Math.PI/2,dx=Math.cos(q)*42,dy=Math.sin(q)*42;paths.push(open([P(-dx,-dy,59),P(dx,dy,59)]));}
      const ta=a*.75;paths.push(open([P(46,-7,45),P(46+Math.cos(ta)*9,-7+Math.sin(ta)*9,45)]),open([P(46+Math.cos(ta)*9,7+Math.sin(ta)*9,45),P(46-Math.cos(ta)*9,7-Math.sin(ta)*9,45)]));active.setAttribute("d",paths.join(""));};
  } else if(SPEC.kind==="biplane"){
    // A complete early biplane: two ribbed cambered wings, interplane bay,
    // wire rigging, cigar fuselage, radial cowl, cockpit, tailplane and gear.
    shape([P(-31,-36,46),P(-26,-36,50),P(19,-36,49),P(29,-31,46),P(29,31,46),P(19,36,49),P(-26,36,50),P(-31,36,46)],"nf sil");
    shape([P(-22,-31,27),P(-17,-31,31),P(20,-31,30),P(28,-26,27),P(28,26,27),P(20,31,30),P(-17,31,31),P(-22,31,27)],"nf sil");
    for(const y of [-28,-20,-12,-4,4,12,20,28]){
      line([P(-26,y,49.5),P(-15,y,50),P(4,y,49.6),P(20,y,48),P(28,y,46.5)],"nf lo");
      line([P(-17,y,30.5),P(-7,y,31),P(10,y,30.5),P(22,y,28.5),P(27,y,27.5)],"nf lo");
    }
    // Aileron hinges and their divided trailing panels.
    for(const y of [-29,-18,-7,7,18,29]){
      line([P(17,y,48.2),P(25,y,47),P(28,y,46)],"nf lo");
      line([P(16,y*.88,29.3),P(24,y*.88,28),P(27,y*.88,27.4)],"nf lo");
    }
    // Fuselage side rails wrap around a tapered hull rather than a single stick.
    shape([P(-36,-5,32),P(-32,-5,38),P(-22,-5,40),P(-8,-5,39),P(12,-5,36),P(29,-5,34),P(39,-5,34),P(43,-5,32),P(39,-5,30),P(22,-5,29),P(-17,-5,29),P(-31,-5,30)],"sil");
    line([P(-34,5,32),P(-29,5,36),P(-20,5,38),P(-7,5,37),P(14,5,34),P(31,5,33)],"nf lo");
    for(const x of [-25,-15,-5,8,20,31])line([P(x,-5,30),P(x,5,33-(x+25)*.09)],"nf lo");
    // Radial engine cylinders and concentric cowling rings.
    line(ringYZ(-34,0,33,7),"nf sil");line(ringYZ(-35,0,33,5.5),"nf lo");line(ringYZ(-36,0,33,2.2),"nf sil");
    for(let i=0;i<9;i++){const a=i*Math.PI*2/9;line([P(-36,Math.cos(a)*2.4,33+Math.sin(a)*2.4),P(-36,Math.cos(a)*5,33+Math.sin(a)*5)],"nf lo");}
    // Open cockpit rim, windscreen and pilot's helmet sit above the longerons.
    line([P(-5,-5,39),P(-2,-6,46),P(6,-6,47),P(12,-5,37)],"nf sil");
    line([P(-2,-6,45),P(2,-6,43),P(9,-6,42)],"nf lo");
    line(ringYZ(3,0,39,3),"nf lo");line([P(3,-3,40),P(3,-3,44)],"nf lo");
    line([P(-7,-6,37),P(11,-6,35),P(13,-6,37)],"nf lo");
    // Tailplane, fin, control hinge and braced landing wheels.
    shape([P(31,-17,35),P(38,-16,37),P(42,-10,36),P(42,10,36),P(38,16,37),P(31,17,35)],"nf sil");
    shape([P(34,-5,35),P(39,-5,49),P(43,-5,49),P(42,-5,35)],"nf sil");
    line([P(37,-14,36),P(38,14,36)],"nf lo");line([P(40,-4,36),P(40,-4,47)],"nf lo");
    for(const y of [-24,24]){line([P(-9,y,29),P(-4,y,47)],"nf sil");line([P(14,y,28),P(17,y,47)],"nf sil");line([P(-17,y,28),P(16,y,47)],"nf lo");line([P(18,y,28),P(-12,y,47)],"nf lo");}
    for(const x of [-10,16])for(const y of [-27,27])line([P(x,y,47),P(x,y,30)],"nf lo");
    line([P(29,-2,34),P(39,-2,39),P(44,-2,36),P(38,-2,32)],"nf lo");
    for(const y of [-12,12]){line([P(-18,y,25),P(-18,y,17)],"nf sil");line([P(-18,y,18),P(-5,y,17)],"nf sil");wheel(-5,y,16,5,"nf sil");wheel(-5,y,14.5,2,"nf lo");}
    line([P(32,0,30),P(39,0,26),P(42,0,26)],"nf sil");
    wheel(-31,0,21,5,"nf lo");
    draw=()=>{const a=rad(s.x*4.5),blades=[];for(let i=0;i<2;i++){const q=a+i*Math.PI,cy=Math.cos(q),cz=Math.sin(q),ty=-cz,tz=cy;
      blades.push(poly([P(-37,cy*3+ty*3,33+cz*3+tz*3),P(-37,cy*19+ty*5,33+cz*19+tz*5),P(-37,cy*31+ty*2,33+cz*31+tz*2),P(-37,cy*31-ty*2,33+cz*31-tz*2),P(-37,cy*19-ty*5,33+cz*19-tz*5),P(-37,cy*3-ty*3,33+cz*3-tz*3)]));}
      active.setAttribute("d",blades.join(""));};
  } else if(SPEC.kind==="balloon"){
    // Gored envelope with a vent crown, burner, suspension net and woven basket.
    const env=(zoff)=>{const out=[];for(let j=0;j<=18;j++){const a=-Math.PI/2+j*Math.PI/18;const w=23*Math.cos(a);out.push(P(w,0,34+39*Math.sin(a)+zoff));}return out;};
    line(env(0),"nf sil");line(env(0).map((p,i)=>P(-23+46*i/18,0,34+39*Math.sin(-Math.PI/2+i*Math.PI/18))),"nf lo");
    for(const x of [-15,-8,0,8,15])line([P(0,0,72),P(x,0,51),P(x*.78,0,28)],"nf lo");
    line([P(-7,-2,68),P(0,-2,73),P(7,-2,68)],"nf lo");
    for(const y of [-8,8]){line([P(-5,y,26),P(-10,y,10)],"nf sil");line([P(5,y,26),P(10,y,10)],"nf sil");}
    box(-12,-9,12,9,0,11,3,1.3);line([P(-10,-10,4),P(10,-10,4)],"nf lo");line([P(-12,-10,8),P(12,-10,8)],"nf lo");
    line([P(-4,-3,14),P(-4,-3,22),P(0,-3,27),P(4,-3,22),P(4,-3,14)],"nf sil");
    draw=()=>{const z=s.x*.48;active.setAttribute("d",open(env(z).slice(2,17)));};
  } else if(SPEC.kind==="rowboat"){
    // A clinker hull, transverse thwarts, ribs, paired oarlocks and long blades.
    const hullPts=[[-40,0],[-30,-15],[-17,-21],[17,-21],[30,-15],[40,0],[30,15],[17,21],[-17,21],[-30,15]];
    shape(hullPts.map(([x,y])=>P(x,y,9)),"nf sil");shape(hullPts.map(([x,y])=>P(x,y,4)),"nf lo");
    for(let i=0;i<5;i++){const x=-24+i*12;line([P(x,-18,8),P(x-3,-10,14),P(x-3,10,14),P(x,18,8)],"nf lo");}
    for(const x of [-12,12]){line([P(x,-17,16),P(x,-14,19),P(x,14,19),P(x,17,16)],"nf sil");line([P(x,-12,19),P(x,12,19)],"nf lo");}
    for(const y of [-17,17]){line([P(-8,y,18),P(0,y,21),P(8,y,18)],"nf sil");}
    line([P(-13,-18,20),P(-42,-30,14),P(-48,-34,13)],"nf sil");line([P(13,18,20),P(42,30,14),P(48,34,13)],"nf sil");
    line([P(-13,-18,20),P(-10,-15,20)],"nf lo");line([P(13,18,20),P(10,15,20)],"nf lo");
    draw=()=>{const a=rad(s.x*1.7);active.setAttribute("d",[open([P(-13,-18,20),P(-42*Math.cos(a),-18-25*Math.sin(a),14),P(-48*Math.cos(a),-18-29*Math.sin(a),13)]),open([P(13,18,20),P(42*Math.cos(a),18+25*Math.sin(a),14),P(48*Math.cos(a),18+29*Math.sin(a),13)])].join(""));};
  } else if(SPEC.kind==="cablecar"){
    // A two-tower span, cable sheaves, hanger grip and a glazed suspended cabin.
    const cable=[];for(let i=0;i<=16;i++){const x=-50+i*6.25;cable.push(P(x,0,65-5*(1-(x/50)**2)));}line(cable,"nf sil");
    for(const x of [-42,42]){box(x-3,-5,x+3,5,5,66,2,1);line([P(x-10,-7,67),P(x+10,-7,67)],"nf sil");for(let i=0;i<4;i++)wheel(x-6+i*4,-8,69,2,"nf lo");}
    line([P(0,0,60),P(0,0,47),P(-5,0,43)],"nf sil");line([P(-10,-16,43),P(10,-16,43),P(10,16,43),P(-10,16,43),P(-10,-16,43)],"nf lo");
    const cabin=box(-14,-17,14,17,16,42,4,1.5);box(-10,-14,10,14,42,45,3,1);
    for(const y of [-18,18]){line([P(-9,y,21),P(9,y,21),P(9,y,36),P(-9,y,36),P(-9,y,21)],"nf lo");line([P(0,y,21),P(0,y,36)],"nf lo");}
    draw=()=>{const x=clamp(s.x,-24,24);put(cabin,prism(P,front,...rings(x-14,-17,x+14,17,4,1.5),16,42));active.setAttribute("d",open([P(x,0,61-5*(1-(x/50)**2)),P(x,0,48),P(x-5,0,43)]));};
  } else if(SPEC.kind==="roadster"){
    // Low bonnet, open cockpit, two recessed wheel wells, split windshield and steering geometry.
    shape([P(-43,-5,14),P(-36,-5,23),P(-18,-5,25),P(-7,-5,36),P(13,-5,36),P(24,-5,25),P(39,-5,22),P(46,-5,16),P(42,-5,11),P(-38,-5,11),P(-43,-5,14)],"nf sil");
    shape([P(-12,-5,37),P(15,-5,37),P(22,-5,25),P(-20,-5,25),P(-12,-5,37)],"nf lo");
    line([P(-37,-5,20),P(-17,-5,20),P(-9,-5,31),P(10,-5,31),P(19,-5,21),P(41,-5,19)],"nf lo");
    for(const y of [-18,18]){wheel(-25,y,12,11);wheel(27,y,12,11);wheel(-25,y,12,6,"nf lo");wheel(27,y,12,6,"nf lo");}
    line([P(-12,-6,37),P(-12,-20,37),P(14,-20,37),P(14,-6,37)],"nf sil");line([P(-6,-19,36),P(-6,-19,27)],"nf lo");
    line([P(-37,-6,15),P(-28,-6,15)],"nf lo");line([P(37,-6,16),P(43,-6,17)],"nf lo");
    draw=()=>{const a=rad(s.x*1.7),x=27,y=-18;active.setAttribute("d",open([P(x,y,12),P(x+Math.sin(a)*10,y,12+Math.cos(a)*10),P(x+Math.sin(a)*10,y+6,12+Math.cos(a)*10)]));};
  }

  active=mk("path",{class:"nf hi"},g);draw();const B=register(stage,dt=>{const before=s.x,moving=stepS(s,dt);if(moving||s.x!==before)draw();return moving;});bag.add(B.unregister);
  function aim(x){last=x;s.t=clamp((x-200)/90,-1,1)*span;read.textContent=SPEC.readout;B.wake();}
  bag.add(pointer(stage,{move:([x])=>aim(x),leave:()=>{s.t=0;read.textContent="rest";B.wake();}}));bag.add(()=>svg.replaceChildren());
  return {set:v=>{span=v;if(read.textContent!=="rest")aim(last);},destroy:bag.dispose};
}

hairline({name:SPEC.id,means:SPEC.means,rules:[1,3,4,8,9],range:SPEC.range,answer:SPEC.answer,edge:SPEC.edge,tour:SPEC.tour,mount});
