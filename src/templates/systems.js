const SPEC = __FIGURE_SPEC__;
const { Cam, clamp, fit, open, poly, proj, rings, prism, rrect, circ, facing, solid, put, mk, rad, spring, stepS, pointer, register, disposer } = HL;

function mount({ stage, svg, read }, span) {
  const bag=disposer(),C=Cam(45,.5,2.55);fit(C,[[-62,-42,0],[62,42,0],[-62,-42,82],[62,42,82]],200,166);
  const P=proj(C),front=facing(C),cables=mk("g",{},svg),g=mk("g",{},svg),line=(p,c="nf lo")=>mk("path",{d:open(p),class:c},g),wire=(p,c="nf lo")=>mk("path",{d:open(p),class:c},cables),shape=(p,c="nf sil")=>mk("path",{d:poly(p),class:c},g);
  const box=(a,b,c,d,z0,z1,r=4,k=1)=>{const q=solid(g);put(q,prism(P,front,...rings(a,b,c,d,r,k),z0,z1));return q;};
  const face=(x,y,z,r,n=32)=>circ(r,n).map(q=>P(x,y,z+q.v)), plan=(x,y,z,r,n=32)=>circ(r,n).map(q=>P(x+q.u,y+q.v,z));
  box(-42,-24,42,24,0,3,4,.9);const s=spring(0);let active,last=200,draw=()=>{};

  if(SPEC.kind==="dns"){
    // Recursive query rises through resolver, root and authority; each rack has real ports and rails.
    const xs=[-34,-15,5,26],zs=[17,31,46,62],ws=[18,19,20,22],units=[];
    for(let i=0;i<4;i++){const x=xs[i],z=zs[i],w=ws[i];units.push(box(x-w/2,-13,x+w/2,13,z-6,z+6,3,1));
      for(let k=0;k<3;k++){line([P(x-w/2+3,-14,z-3+k*3),P(x+w/2-3,-14,z-3+k*3)],"nf lo");}
      for(let k=0;k<2;k++){line(face(x-w/2+5+k*5,-15,z,1.4),"nf lo");}}
    wire([P(-40,-20,11),P(-40,-20,23),P(-34,-20,25)],"nf sil");wire([P(-25,0,21),P(-15,0,25),P(-15,0,37)],"nf lo");wire([P(-6,0,37),P(5,0,40),P(5,0,52)],"nf lo");wire([P(15,0,52),P(26,0,56)],"nf lo");
    for(const x of [-39,39])line([P(x,18,8),P(x,18,74)],"nf lo");
    const route=[P(-40,-19,11),P(-34,-19,17),P(-15,-19,31),P(5,-19,46),P(26,-19,62)];
    draw=()=>{const t=clamp((s.x+22)/44,0,1),along=t*(route.length-1),i=Math.min(route.length-2,Math.floor(along)),f=along-i,x=xs[Math.min(3,i)],z=zs[Math.min(3,i)],y=-18;
      units.forEach((unit,j)=>{const off=j===i?9:0,w=ws[j],zz=zs[j];put(unit,prism(P,front,...rings(xs[j]-w/2,-13-off,xs[j]+w/2,13-off,3,1),zz-6,zz+6));});
      const a=route[i],b=route[i+1],tip=[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f],path=route.slice(0,i+1).concat([tip]);
      active.setAttribute("d",[open(path),open([P(x-6+f*8,y,z-2),P(x+6+f*8,y,z-2),P(x+6+f*8,y,z+2),P(x-6+f*8,y,z+2),P(x-6+f*8,y,z-2)])].join(""));};
  } else if(SPEC.kind==="balancer"){
    // A weighted rotary distributor receives one trunk and feeds four separate service trays.
    const outputs=[];for(let i=0;i<4;i++){const x=-31+i*21;outputs.push(box(x-8,10,x+8,25,12,35,3,1));for(let k=0;k<3;k++)line([P(x-5,-1,18+k*6),P(x+5,-1,18+k*6)],"nf lo");line(face(x,-2,36,2),"nf lo");}
    line([P(-43,0,23),P(-29,0,23),P(-19,0,36)],"nf sil");line(face(-9,-3,39,13),"nf sil");line(face(-9,-4,39,7),"nf lo");
    for(let i=0;i<4;i++){const a=i*Math.PI/2;line([P(-9,-6,39),P(-9+Math.cos(a)*10,-6,39+Math.sin(a)*10)],"nf lo");}
    line([P(-9,1,48),P(-9,1,57),P(24,1,57)],"nf lo");
    draw=()=>{const a=rad(s.x*3.2),x=-9+Math.cos(a)*9,z=39+Math.sin(a)*9,k=Math.round(((a+Math.PI*2)%(Math.PI*2))/(Math.PI/2));
      outputs.forEach((unit,j)=>{const cx=-31+j*21,y=j===k?-3:10;put(unit,prism(P,front,...rings(cx-8,y,cx+8,y+15,3,1),12,35));});
      active.setAttribute("d",[open([P(-43,-8,23),P(-25,-8,23),P(-9,-8,39),P(x,-8,z),P(-31+k*21,-8,29)]),open([P(x-3,-9,z-2),P(x+3,-9,z-2),P(x+3,-9,z+2),P(x-3,-9,z+2),P(x-3,-9,z-2)])].join(""));};
  } else if(SPEC.kind==="cache"){
    // Three cache banks step forward in depth and rise from the backing frame.
    // Each has a removable cartridge, a dense chip grid, edge connectors and a
    // separate faceplate, so hierarchy reads as three distinct physical layers.
    const tiers=[
      {x:-25,y:11,z:22,w:27,h:17,nx:4,ny:2},
      {x:0,y:0,z:43,w:29,h:19,nx:5,ny:3},
      {x:25,y:-11,z:64,w:31,h:21,nx:6,ny:3},
    ];
    line([P(-42,16,9),P(-42,16,76),P(42,16,76)],"nf sil");
    line([P(42,16,9),P(42,16,76)],"nf sil");
    for(const x of [-42,42]){line([P(x,15,12),P(x,15,74)],"nf lo");for(let z=17;z<72;z+=9)line([P(x-2,14,z),P(x+2,14,z)],"nf lo");}
    const banks=tiers.map((t,i)=>{
      const layer=mk("g",{},g),L=(p,c="nf lo")=>mk("path",{d:open(p),class:c},layer),Q=(a,b,c,d,z0,z1,r=3,k=1)=>{const q=solid(layer);put(q,prism(P,front,...rings(a,b,c,d,r,k),z0,z1));return q;};
      const x0=t.x-t.w/2,x1=t.x+t.w/2,z0=t.z-t.h/2,z1=t.z+t.h/2,y=t.y;
      const shell=Q(x0,y-9,x1,y+9,z0,z1,4,1.2);
      // Recessed cartridge bay, catches and short ventilation slots.
      L([P(x0+2,y-10,z0+2),P(x1-2,y-10,z0+2),P(x1-2,y-10,z1-2),P(x0+2,y-10,z1-2),P(x0+2,y-10,z0+2)],"nf sil");
      L([P(x0+4,y-11,z0+4),P(x1-4,y-11,z0+4),P(x1-4,y-11,z1-4),P(x0+4,y-11,z1-4),P(x0+4,y-11,z0+4)],"nf lo");
      const dx=(x1-x0-10)/t.nx,dz=(z1-z0-9)/t.ny;
      for(let row=0;row<t.ny;row++)for(let col=0;col<t.nx;col++){
        const cx=x0+5+dx*(col+.5),cz=z0+4+dz*(row+.5),w=Math.min(3.4,dx*.52),h=Math.min(2.6,dz*.5);
        L([P(cx-w,y-12,cz-h),P(cx+w,y-12,cz-h),P(cx+w,y-12,cz+h),P(cx-w,y-12,cz+h),P(cx-w,y-12,cz-h)],"nf lo");
        L([P(cx-w*.48,y-12.2,cz),P(cx+w*.48,y-12.2,cz)],"nf lo");
      }
      // Connector fingers at the lower edge and two latch ears on each face.
      for(let k=0;k<t.nx+2;k++){const x=x0+3+(t.w-6)*k/(t.nx+1);L([P(x,y-10,z0-1),P(x,y-10,z0-4)],"nf lo");}
      for(const x of [x0+3,x1-3]){L([P(x,y-12,z0+3),P(x,y-12,z0+6)],"nf sil");L([P(x,y-12,z1-6),P(x,y-12,z1-3)],"nf sil");}
      L([P(x0+4,y-10,z1-2),P(x0+8,y-12,z1+1),P(x1-8,y-12,z1+1),P(x1-4,y-10,z1-2)],"nf lo");
      // Layer-specific cable combs tie the cartridge into the backplane.
      for(let k=0;k<3;k++)L([P(x0+4+k*3,y+9,z0+4),P(x0+4+k*3,y+12,z0+1),P(t.x,y+13,t.z)],"nf lo");
      return {layer,shell,t};
    });
    // The backplane carries clipped trunk lines and a lower service trough.
    box(-39,14,39,19,8,13,2,1);line([P(-36,13,11),P(36,13,11)],"nf lo");
    for(let i=0;i<9;i++){const x=-33+i*8;line([P(x,12,9),P(x,12,12)],"nf lo");}
    draw=()=>{const t=clamp((s.x+30)/60,0,.999),idx=Math.floor(t*3),part=(t*3)%1,bank=banks[idx];
      banks.forEach((b,i)=>b.layer.setAttribute("transform",i===idx?`translate(${(part-.5)*5} -8)`:"translate(0 0)"));
      const q=bank.t,px=q.x+(part-.5)*(q.w-10),z=q.z;
      active.setAttribute("d",[open([P(-40,-24,12),P(-33,-24,17),P(-25,-24,21),P(px,-24,z),P(px,-24,z+5)]),open([P(px-4,-25,z-4),P(px+4,-25,z-4),P(px+4,-25,z+4),P(px-4,-25,z+4),P(px-4,-25,z-4)])].join(""));};
  } else if(SPEC.kind==="queue"){
    // Partitioned queue trough, four messages, a ratcheting gate and an offset consumer chute.
    box(-38,-16,31,16,9,14,4,1.1);line([P(-37,-18,15),P(30,-18,15),P(30,-18,20)],"nf sil");line([P(-37,18,15),P(30,18,15)],"nf lo");
    for(let i=0;i<5;i++){const x=-27+i*13;line([P(x,-17,10),P(x,-17,19)],"nf lo");line([P(x,17,10),P(x,17,19)],"nf lo");}
    const tokens=[];for(let i=0;i<4;i++){const x=-29+i*15;tokens.push(box(x-4,-8,x+4,8,16,22,2,1));line([P(x-2,-9,19),P(x+2,-9,19)],"nf lo");}
    box(32,-12,43,12,7,35,3,1);line([P(35,-14,24),P(40,-14,24),P(40,-14,31)],"nf lo");line([P(31,-18,21),P(38,-18,26)],"nf sil");
    draw=()=>{const t=clamp((s.x+32)/64,0,1),x=-27+t*52;put(tokens[0],prism(P,front,...rings(x-4,-8,x+4,8,2,1),16,22));active.setAttribute("d",[open([P(-41,-21,18),P(x,-21,18),P(Math.min(30,x+14),-21,18),P(36,-21,23)]),open([P(x-4,-22,17),P(x+4,-22,17),P(x+4,-22,22),P(x-4,-22,22),P(x-4,-22,17)])].join(""));};
  } else if(SPEC.kind==="btree"){
    // Split index leaves fan out from a root cassette; hinged covers make the search depth physical.
    const root=box(-10,-15,10,15,57,70,3,1.2);box(-33,-15,-13,15,35,48,3,1);box(13,-15,33,15,35,48,3,1);
    for(const x of [-34,-10,14,34])box(x-7,-14,x+7,14,12,26,2,1);
    const cursor=box(-3,-18,3,-12,60,66,1.5,.5);
    line([P(0,0,56),P(-23,0,48),P(-27,0,38)],"nf sil");line([P(0,0,56),P(23,0,48),P(27,0,38)],"nf sil");
    line([P(-23,0,34),P(-34,0,26)],"nf lo");line([P(-23,0,34),P(-10,0,26)],"nf lo");line([P(23,0,34),P(14,0,26)],"nf lo");line([P(23,0,34),P(34,0,26)],"nf lo");
    for(const x of [-34,-10,14,34]){line([P(x-4,-16,17),P(x+4,-16,17)],"nf lo");line([P(x-4,-16,21),P(x+4,-16,21)],"nf lo");}
    line([P(-7,-16,63),P(7,-16,63)],"nf lo");line([P(-30,-16,41),P(-16,-16,41)],"nf lo");line([P(16,-16,41),P(30,-16,41)],"nf lo");
    draw=()=>{const q=clamp(Math.round((s.x+28)/56*3),0,3),leaf=[-34,-10,14,34][q];put(cursor,prism(P,front,...rings(leaf-3,-18,leaf+3,-12,1.5,.5),18,24));active.setAttribute("d",[open([P(0,-19,64),P(0,-19,56),P(q<2?-23:23,-19,42),P(leaf,-19,23)]),open([P(leaf-4,-20,19),P(leaf+4,-20,19),P(leaf+4,-20,24),P(leaf-4,-20,24),P(leaf-4,-20,19)])].join(""));};
  } else if(SPEC.kind==="auth"){
    // A credential card crosses a challenge gate before the session latch releases.
    for(const x of [-17,17]){box(x-4,-19,x+4,19,12,66,2,1);line([P(x-9,-20,17),P(x+9,-20,17),P(x+9,-20,60),P(x-9,-20,60),P(x-9,-20,17)],"nf sil");
      line([P(x-2,-21,28),P(x+2,-21,28)],"nf lo");line([P(x-2,-21,35),P(x+2,-21,35)],"nf lo");line([P(x-2,-21,42),P(x+2,-21,42)],"nf lo");}
    box(-40,-15,-31,15,17,49,3,1);line([P(-40,-18,47),P(-31,-18,47)],"nf lo");
    box(30,-15,40,15,15,50,3,1);line([P(30,-18,44),P(40,-18,44)],"nf lo");
    line([P(-31,-7,33),P(-21,-7,33),P(-17,-7,40),P(0,-7,40),P(17,-7,33),P(30,-7,33)],"nf lo");
    for(let i=0;i<7;i++){const x=-9+i*3;line([P(x,-8,61),P(x+1,-8,64),P(x+2,-8,61)],"nf lo");}
    draw=()=>{const x=clamp(-35+s.x, -35, 35),gate=x<0?-17:17,z=x<0?40:33;active.setAttribute("d",[open([P(-36,-23,32),P(x,-23,32),P(gate,-23,z),P(34,-23,32)]),open([P(x-5,-24,28),P(x+5,-24,28),P(x+5,-24,36),P(x-5,-24,36),P(x-5,-24,28)])].join(""));};
  } else if(SPEC.kind==="cdn"){
    // Source cabinet and six edge caches make a resilient star; each trunk has its own cable clips.
    box(-7,-14,9,14,30,58,4,1.3);for(let i=0;i<4;i++){const z=35+i*5;line([P(-4,-15,z),P(6,-15,z)],"nf lo");line(face(7,-16,z+1,1.2),"nf lo");}
    const nodes=[[-34,0,57],[-27,0,28],[-12,0,14],[17,0,13],[34,0,31],[29,0,56]],caches=[];
    for(let i=0;i<nodes.length;i++){const [x,y,z]=nodes[i];caches.push(box(x-7,y-7,x+7,y+7,z-5,z+5,3,1));line(face(x,y-9,z,2),"nf lo");
      line([P(x-4,y-9,z-2),P(x+4,y-9,z-2)],"nf lo");}
    nodes.forEach(([x,y,z])=>line([P(0,17,44),P(x,5,z),P(x,0,z)],"nf lo"));
    line([P(-40,-15,64),P(40,-15,64)],"nf sil");line([P(-40,-15,64),P(-34,-15,57)],"nf lo");
    draw=()=>{const i=clamp(Math.round((s.x+28)/56*5),0,5),[x,y,z]=nodes[i];caches.forEach((unit,j)=>{const [cx,cy,cz]=nodes[j],depth=j===i?-10:cy;put(unit,prism(P,front,...rings(cx-7,depth-7,cx+7,depth+7,3,1),cz-5,cz+5));});active.setAttribute("d",[open([P(0,-18,44),P(x,-18,z)]),open([P(x-5,-19,z-4),P(x+5,-19,z-4),P(x+5,-19,z+4),P(x-5,-19,z+4),P(x-5,-19,z-4)])].join(""));};
  }

  active=mk("path",{class:"nf hi"},g);draw();const B=register(stage,dt=>{const before=s.x,moving=stepS(s,dt);if(moving||s.x!==before)draw();return moving;});bag.add(B.unregister);
  function aim(x){last=x;s.t=clamp((x-200)/90,-1,1)*span;read.textContent=SPEC.readout;B.wake();}
  bag.add(pointer(stage,{move:([x])=>aim(x),leave:()=>{s.t=0;read.textContent="rest";B.wake();}}));bag.add(()=>svg.replaceChildren());
  return {set:v=>{span=v;if(read.textContent!=="rest")aim(last);},destroy:bag.dispose};
}
hairline({name:SPEC.id,means:SPEC.means,rules:[1,3,4,8,9],range:SPEC.range,answer:SPEC.answer,edge:SPEC.edge,tour:SPEC.tour,mount});
