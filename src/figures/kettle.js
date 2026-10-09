const { Cam, clamp, facing, fit, hull, open, poly, proj, prism, rrect, ringAt, run, rings, solid, put, mk, rad, spring, stepS, pointer, register, disposer } = HL;

function bodyShape(P, front) {
  const foot = rrect(-26, -23, 26, 23, 15, 8), belly = rrect(-33, -29, 33, 29, 20, 8);
  const shoulder = rrect(-22, -20, 22, 20, 14, 8);
  const inner = rrect(-19.5, -17.5, 19.5, 17.5, 11, 8);
  return {
    sil: poly(hull(ringAt(P, foot, 5).concat(ringAt(P, belly, 25), ringAt(P, shoulder, 53)))),
    crease: open(ringAt(P, run(inner, front), 53)),
  };
}

function mount({ stage, svg, read }, strength) {
  const bag = disposer(), C = Cam(45, 0.5, 2.6);
  fit(C, [[-62, -34, 0], [64, 34, 0], [-60, -30, 93], [62, 20, 53]], 200, 166);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const handlePts = Array.from({ length: 17 }, (_, i) => {
    const a = rad(60 + i * 15);
    return P(-41 + Math.cos(a) * 22, -2, 31 + Math.sin(a) * 21);
  });
  mk("path", { d: open(handlePts), class: "nf lo" }, g);
  const spoutOuter = [P(23, -8, 39), P(40, -8, 46), P(54, -8, 56), P(61, -7, 57)];
  const spoutInner = [P(61, 7, 49), P(54, 8, 48), P(40, 8, 35), P(25, 8, 28)];
  mk("path", { d: poly(spoutOuter.concat(spoutInner)), class: "sil" }, g);
  mk("path", { d: open([P(27, 0, 33), P(42, 0, 38), P(56, 0, 47)]), class: "nf lo" }, g);
  const shell = solid(g); put(shell, bodyShape(P, front));
  const [base, baseIn] = rings(-28, -23, 28, 23, 15, 1.2);
  put(solid(g), prism(P, front, base, baseIn, 3, 8));
  const rim = rrect(-22, -20, 22, 20, 13, 6);
  mk("path", { d: open(ringAt(P, rim, 53)), class: "nf lo" }, g);

  const lidGroup = mk("g", {}, g), lidFace = mk("path", { class: "sil hi" }, lidGroup);
  const lidCrease = mk("path", { class: "nf lo" }, lidGroup), lidRing = rrect(-19, -18, 19, 18, 7, 6);
  const lidInner = rrect(-15.5, -14.5, 15.5, 14.5, 5, 6);
  const cap = mk("path", { class: "nf hi" }, lidGroup);
  const angle = spring(rad(8));
  function mapLid(q, a, inset = 0) {
    const d = q.v + 18;
    return P(q.u, -18 + d * Math.cos(a), 53 + d * Math.sin(a) + inset);
  }
  function drawLid() {
    lidFace.setAttribute("d", poly(lidRing.map((q) => mapLid(q, angle.x))));
    lidCrease.setAttribute("d", open(lidInner.map((q) => mapLid(q, angle.x, 0.3))));
    const knob = mapLid({ u: 0, v: -3 }, angle.x);
    cap.setAttribute("d", open([knob, P(0, -18 + 15 * Math.cos(angle.x), 53 + 15 * Math.sin(angle.x) + 5)]));
  }
  drawLid();

  const B = register(stage, (dt) => { const moving = stepS(angle, dt); if (moving) drawLid(); return moving; });
  bag.add(B.unregister);
  let pointerY = null;
  bag.add(pointer(stage, {
    move: ([x, y]) => {
      pointerY = y;
      angle.t = rad(8 + clamp((190 - y) / 108, 0, 1) * strength);
      read.textContent = "lid"; B.wake();
    },
    leave: () => { pointerY = null; angle.t = rad(8); read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { strength = v; if (pointerY !== null) { angle.t = rad(8 + clamp((190 - pointerY) / 108, 0, 1) * strength); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "kettle",
  means: "A kettle lid lifts as the pointer rises, then settles back onto the rim.",
  rules: [1, 3, 4, 8, 9],
  range: [28, 46, 66],
  tour: [[200, 147], [200, 96], [240, 116], null],
  mount,
});
