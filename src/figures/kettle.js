const { Cam, clamp, facing, fit, hull, open, poly, proj, prism, rrect, ringAt, run, rings, solid, put, mk, rad, spring, stepS, pointer, register, disposer, circ, seg } = HL;

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
  const handleOuter = Array.from({ length: 25 }, (_, i) => {
    const a = rad(48 + i * 12);
    return P(-39 + Math.cos(a) * 24, -2, 31 + Math.sin(a) * 23);
  });
  const handleInner = Array.from({ length: 21 }, (_, i) => {
    const a = rad(60 + i * 12);
    return P(-39 + Math.cos(a) * 18.5, -2, 31 + Math.sin(a) * 17.5);
  });
  mk("path", { d: open(handleOuter), class: "nf sil" }, g);
  mk("path", { d: open(handleInner), class: "nf lo" }, g);
  const upperMount = rrect(-31, 45, -25, 53, 2, 5), lowerMount = rrect(-31, 15, -25, 23, 2, 5);
  mk("path", { d: open(upperMount.map((q) => P(q.u, 19, q.v))), class: "nf lo" }, g);
  mk("path", { d: open(lowerMount.map((q) => P(q.u, 25, q.v))), class: "nf lo" }, g);
  const spoutOuter = [P(24, -9, 38), P(38, -10, 45), P(48, -10, 55), P(58, -8, 61), P(63, -5, 61)];
  const spoutInner = [P(63, 5, 55), P(57, 9, 54), P(47, 9, 48), P(38, 9, 39), P(25, 9, 28)];
  mk("path", { d: poly(spoutOuter.concat(spoutInner)), class: "sil" }, g);
  mk("path", { d: open([P(26, 0, 33), P(40, 0, 40), P(50, 0, 51), P(60, 0, 57)]), class: "nf lo" }, g);
  mk("path", { d: open(circ(6.2, 28).map((q) => P(62, q.u * 0.72, 57 + q.v * 0.65))), class: "nf sil" }, g);
  mk("path", { d: open(circ(3.7, 24).map((q) => P(62, q.u * 0.7, 57 + q.v * 0.58))), class: "nf lo" }, g);
  const shell = solid(g); put(shell, bodyShape(P, front));
  const [base, baseIn] = rings(-28, -23, 28, 23, 15, 1.2);
  put(solid(g), prism(P, front, base, baseIn, 3, 8));
  mk("path", { d: open(ringAt(P, rrect(-25.5, -20.5, 25.5, 20.5, 12, 6), 5)), class: "nf lo" }, g);
  const rim = rrect(-22, -20, 22, 20, 13, 6);
  mk("path", { d: open(ringAt(P, rim, 53)), class: "nf lo" }, g);

  const gauge = rrect(19, 31, 24.5, 46, 1.7, 5);
  mk("path", { d: open(gauge.map((q) => P(q.u, 28.2, q.v))), class: "nf lo" }, g);
  mk("path", { d: [35, 39, 43].map((z, i) => seg(P(19.4, 28.4, z), P(i === 1 ? 22.7 : 23.8, 28.4, z))).join(""), class: "nf lo" }, g);

  // Turned body seams, enamel flutes and rolled lower bands give the broad
  // shell the small manufacturing details that survive at thumbnail size.
  const frontArc = (rx, ry, z) => Array.from({ length: 25 }, (_, i) => {
    const a = Math.PI * i / 24;
    return P(rx * Math.cos(a), ry * Math.sin(a), z);
  });
  [[30, 26, 11], [32, 28, 16], [30, 26, 44], [26, 22, 49]].forEach(([rx, ry, z], i) => {
    mk("path", { d: open(frontArc(rx, ry, z)), class: i === 1 ? "nf sil" : "nf lo" }, g);
  });
  for (const x of [-17, -12, -7, 0, 7, 12, 17]) {
    const y = 25.5 - Math.abs(x) * 0.18;
    const z0 = Math.abs(x) > 14 ? 20 : 15, z1 = Math.abs(x) > 14 ? 43 : 46;
    mk("path", { d: open([P(x, y, z0), P(x * .96, y + 1, z0 + 6), P(x * .92, y + 1.2, z1 - 6), P(x * .9, y, z1)]), class: "nf lo" }, g);
  }
  for (const z of [13, 15, 47]) {
    for (const x of [-23, -18, 18, 23]) {
      mk("path", { d: open(circ(0.8, 14).map((q) => P(x + q.u, 25.4, z + q.v))), class: "nf lo" }, g);
    }
  }
  // Rolled spout collar and a pair of seams make its taper read in profile.
  mk("path", { d: open([P(28, 2, 40), P(34, 2, 43), P(38, 2, 47)]), class: "nf lo" }, g);
  mk("path", { d: open([P(29, -1, 38), P(35, -1, 41), P(40, -1, 45)]), class: "nf lo" }, g);
  for (let i = 0; i < 4; i++) {
    const z = 17 + i * 5;
    mk("path", { d: open([P(-55, -3, z), P(-53, -3, z + 1), P(-52, -3, z + 2)]), class: "nf lo" }, g);
  }

  const lidGroup = mk("g", {}, g), lidFace = mk("path", { class: "sil hi" }, lidGroup);
  const lidCrease = mk("path", { class: "nf lo" }, lidGroup), lidRing = rrect(-19, -18, 19, 18, 7, 6);
  const lidInner = rrect(-15.5, -14.5, 15.5, 14.5, 5, 6);
  const crown = mk("path", { class: "nf hi" }, lidGroup), knobBase = mk("path", { class: "nf lo" }, lidGroup), knobCrown = mk("path", { class: "nf lo" }, lidGroup), hingePin = mk("path", { class: "nf lo" }, lidGroup);
  mk("path", { d: open([P(-8, -18, 50.5), P(-8, -18, 54), P(8, -18, 54), P(8, -18, 50.5)]), class: "nf lo" }, g);
  mk("path", { d: open(circ(2.2, 20).map((q) => P(-8 + q.u, -18, 54 + q.v))), class: "nf hi" }, g);
  const angle = spring(rad(8));
  function mapLid(q, a, inset = 0) {
    const d = q.v + 18;
    return P(q.u, -18 + d * Math.cos(a), 53 + d * Math.sin(a) + inset);
  }
  function drawLid() {
    lidFace.setAttribute("d", poly(lidRing.map((q) => mapLid(q, angle.x))));
    lidCrease.setAttribute("d", open(lidInner.map((q) => mapLid(q, angle.x, 0.3))));
    const center = mapLid({ u: 0, v: -4 }, angle.x, 1.3);
    knobBase.setAttribute("d", open(circ(4.1, 24).map((q) => mapLid({ u: q.u, v: -4 + q.v }, angle.x, 1.2))));
    crown.setAttribute("d", open([center, mapLid({ u: 0, v: -4 }, angle.x, 7), mapLid({ u: 0, v: -4 }, angle.x, 9)]));
    knobCrown.setAttribute("d", open(circ(2.5, 20).map((q) => mapLid({ u: q.u, v: -4 + q.v }, angle.x, 9))));
    hingePin.setAttribute("d", open([mapLid({ u: -7, v: -16 }, angle.x), mapLid({ u: 7, v: -16 }, angle.x)]));
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
  range: [30, 50, 66],
  tour: [[200, 147], [200, 96], [240, 116], null],
  mount,
});
