const { Cam, clamp, fit, fillet, open, poly, proj, spring, stepS, pointer, register, disposer, mk, rad, circ, rrect } = HL;

function mount({ stage, svg, read }, reach) {
  const bag = disposer(), C = Cam(45, 0.5, 1.78);
  fit(C, [[-64, -42, 0], [66, 42, 0], [-50, -45, 93], [62, 45, 85]], 200, 166);
  const P = proj(C), g = mk("g", {}, svg);
  mk("path", { d: open([P(-78, -40, 5), P(84, -40, 5)]), class: "nf dash" }, g);
  mk("path", { d: open([P(-78, 40, 5), P(84, 40, 5)]), class: "nf dash" }, g);
  const hull = fillet([[-55, -17], [-42, -29], [35, -25], [53, -10], [57, 0], [53, 10], [35, 25], [-42, 29], [-55, 17]], [4, 6, 8, 5, 4, 5, 8, 6, 4], 4);
  mk("path", { d: poly(hull.map(([x, y]) => P(x, y, 15))), class: "sil" }, g);
  mk("path", { d: open(fillet([[-48, -20], [-35, -25], [31, -21], [49, -9], [52, 0], [49, 9], [31, 21], [-35, 25], [-48, 20]], [4, 6, 7, 4, 3, 4, 7, 6, 4], 4).map(([x, y]) => P(x, y, 11))), class: "nf lo" }, g);
  mk("path", { d: open([P(-46, -13, 14), P(-34, -19, 12), P(32, -17, 10), P(48, -7, 12), P(50, 0, 12), P(48, 7, 12)]), class: "nf lo" }, g);
  const deck = fillet([[-43, -12], [-32, -19], [33, -17], [45, -7], [47, 0], [45, 7], [33, 17], [-32, 19], [-43, 12]], [3, 4, 5, 3, 2, 3, 5, 4, 3], 4);
  mk("path", { d: open(deck.map(([x, y]) => P(x, y, 16.5))), class: "nf lo" }, g);
  // Planked deck, raised cockpit coaming, cleats and paired lifelines turn the
  // bare hull into a working small sailboat rather than a floating wedge.
  for (let y = -13; y <= 13; y += 6.5) {
    mk("path", { d: open([P(-39, y, 17), P(-26, y, 17), P(-18, y + .6, 17)]), class: "nf lo" }, g);
    mk("path", { d: open([P(27, y, 17), P(37, y, 16.8), P(43, y * .55, 16)]), class: "nf lo" }, g);
  }
  mk("path", { d: open([P(-28, -20, 19), P(-25, -23, 22), P(26, -23, 22), P(31, -18, 19)]), class: "nf sil" }, g);
  mk("path", { d: open([P(-25, -21, 20), P(-22, -21, 21), P(23, -21, 21), P(27, -19, 20)]), class: "nf lo" }, g);
  for (const y of [-24, 24]) {
    mk("path", { d: open([P(-39, y, 17), P(-35, y, 23), P(34, y, 23), P(41, y * .7, 18)]), class: "nf sil" }, g);
    for (let x = -33; x <= 34; x += 11) mk("path", { d: open([P(x, y, 17), P(x, y, 23)]), class: "nf lo" }, g);
  }
  for (const x of [-39, -30, 34, 42]) {
    mk("path", { d: open(circ(2.1, 20).map((q) => P(x + q.u, 1, 18 + q.v))), class: "nf sil" }, g);
    mk("path", { d: open(circ(1.1, 16).map((q) => P(x + q.u, 1.2, 18 + q.v))), class: "nf lo" }, g);
  }
  mk("path", { d: open([P(-5, -10, 16.8), P(-1, -13, 17), P(20, -12, 17), P(26, -8, 17), P(26, 8, 17), P(20, 12, 17), P(-1, 13, 17), P(-5, 10, 16.8)]), class: "nf sil" }, g);
  mk("path", { d: open(rrect(1, -7, 12, 5, 1.6, 4).map((q) => P(q.u, -12.5, q.v + 18))), class: "nf lo" }, g);
  mk("path", { d: open(rrect(14, -5.5, 22, 3, 1.2, 4).map((q) => P(q.u, -8.5, q.v + 18))), class: "nf lo" }, g);
  mk("path", { d: open([P(-49, -14, 17), P(-48, -14, 22), P(-41, -14, 22), P(-38, -14, 17)]), class: "nf lo" }, g);
  mk("path", { d: open([P(-48, -14, 19), P(-42, -14, 19)]), class: "nf lo" }, g);
  mk("path", { d: open(circ(4, 20).map((q) => P(38 + q.u, 1, 18 + q.v))), class: "nf sil" }, g);
  mk("path", { d: open(circ(2.7, 18).map((q) => P(38 + q.u, 1.2, 18 + q.v))), class: "nf lo" }, g);
  [-34, -28, -22, -16].forEach((x) => mk("path", { d: open([P(x, 0, 16.8), P(x + 3, 0, 18)]), class: "nf lo" }, g));
  mk("path", { d: open([P(0, -2, 15), P(2, -2, 4), P(7, -2, 1), P(12, -2, 3), P(14, -2, 15)]), class: "nf sil" }, g);
  mk("path", { d: open([P(-13, -4, 20), P(-13, 4, 20), P(-13, 4, 25), P(-13, -4, 25), P(-13, -4, 20)]), class: "nf lo" }, g);
  mk("path", { d: open([P(-13, 0, 15), P(-13, 0, 86)]), class: "nf lo" }, g);
  mk("path", { d: open([P(-13, 0, 15), P(-13, 0, 86), P(-13, 0, 16)]), class: "nf dash" }, g);
  mk("path", { d: open([P(-13, 0, 83), P(-48, 0, 19), P(36, 0, 18)]), class: "nf dash" }, g);
  mk("path", { d: open([P(-13, 0, 82), P(50, 0, 18)]), class: "nf dash" }, g);
  mk("path", { d: open(circ(5.2, 28).map((q) => P(-13 + q.u, 0, 24 + q.v))), class: "nf hi" }, g);
  const sail = mk("path", { class: "sil hi" }, g), fold = mk("path", { class: "nf lo" }, g);
  const battens = Array.from({ length: 5 }, () => mk("path", { class: "nf lo" }, g));
  const seams = Array.from({ length: 4 }, () => mk("path", { class: "nf lo" }, g));
  const jib = mk("path", { class: "nf sil" }, g), jibSeam = mk("path", { class: "nf lo" }, g);
  const reefMarks = mk("path", { class: "nf lo" }, g), sheetLead = mk("path", { class: "nf lo" }, g);
  const boom = mk("path", { class: "nf sil" }, g), sheet = spring(rad(10));
  const sailShape = [[0,82],[.4,74],[.8,64],[1.2,52],[1.7,39],[2.2,24],[8,24.5],[15,25.5],[23,27],[31,29],[38,30.5],[43,31],[36,32.5],[28,33],[20,33.5],[12,33],[5,31],[0,29]];
  function sailPoint([u, z], angle) {
    return P(-13 + u * Math.cos(angle), u * Math.sin(angle), z);
  }
  function draw() {
    const a = sheet.x;
    sail.setAttribute("d", poly(sailShape.map((p) => sailPoint(p, a))));
    fold.setAttribute("d", open([sailPoint([1, 75], a), sailPoint([3, 57], a), sailPoint([5, 38], a), sailPoint([23, 32], a), sailPoint([38, 32], a)]));
    boom.setAttribute("d", open([P(-13, 0, 24), sailPoint([43, 31], a)]));
    // Curved panel seams, reef ties and a smaller headsail catch the same wind.
    battens.forEach((el, i) => {
      const z = [70, 59, 48, 38, 31][i], reach = [10, 17, 25, 34, 40][i];
      el.setAttribute("d", open([sailPoint([1, z], a), sailPoint([reach * .5, z + 1.5], a), sailPoint([reach, z + 2], a)]));
    });
    seams.forEach((el, i) => {
      const u = 8 + i * 8;
      el.setAttribute("d", open([sailPoint([u, 29 + i * .45], a), sailPoint([u + .6, 41 + i * .35], a), sailPoint([u + 1.2, 54 + i * .25], a), sailPoint([u + 1.8, 67 + i * .15], a)]));
    });
    const clew = sailPoint([43, 31], a), tack = P(29, 0, 20), head = sailPoint([0, 82], a);
    jib.setAttribute("d", poly([head, P(-4, 0, 26), tack, P(28, 0, 24), P(-2, 0, 28)]));
    jibSeam.setAttribute("d", open([P(-3, 0, 28), P(4, 0, 27), P(13, 0, 25), P(22, 0, 23)]));
    const ties=[];for(let k=0;k<5;k++){const z=35+k*7,u=2+k*1.4;ties.push(open([sailPoint([u-.6,z],a),sailPoint([u+.6,z],a)]));}
    reefMarks.setAttribute("d",ties.join(""));
    sheetLead.setAttribute("d", open([clew, P(27, -2, 19), P(21, -2, 17)]));
  }
  draw();
  const B = register(stage, (dt) => { const moving = stepS(sheet, dt); if (moving) draw(); return moving; });
  bag.add(B.unregister);
  let lastX = 200;
  function aim(x) { lastX = x; sheet.t = rad(clamp((x - 200) / 125, -1, 1) * reach); read.textContent = "sheet"; B.wake(); }
  bag.add(pointer(stage, { move: ([x]) => aim(x), leave: () => { sheet.t = rad(10); read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (read.textContent === "sheet") aim(lastX); }, destroy: bag.dispose };
}

hairline({
  name: "sailboat",
  means: "A sail swings around its mast to catch the direction of the pointer.",
  rules: [1, 3, 4, 8, 9],
  range: [16, 36, 48],
  tour: [[126, 162], [206, 137], [280, 158], null],
  mount,
});
