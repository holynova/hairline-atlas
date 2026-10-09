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
  const battens = Array.from({ length: 3 }, () => mk("path", { class: "nf lo" }, g));
  const boom = mk("path", { class: "nf lo" }, g), sheet = spring(rad(10));
  const sailShape = [[0, 82], [0, 23], [12, 25], [28, 28], [43, 31]];
  function sailPoint([u, z], angle) {
    return P(-13 + u * Math.cos(angle), u * Math.sin(angle), z);
  }
  function draw() {
    const a = sheet.x;
    sail.setAttribute("d", poly(sailShape.map((p) => sailPoint(p, a))));
    fold.setAttribute("d", open([sailPoint([2, 75], a), sailPoint([4, 38], a), sailPoint([38, 32], a)]));
    boom.setAttribute("d", open([P(-13, 0, 24), sailPoint([43, 31], a)]));
    battens.forEach((el, i) => {
      const z = [68, 54, 40][i], reach = [13, 25, 36][i];
      el.setAttribute("d", open([sailPoint([1, z], a), sailPoint([reach, z + 2], a)]));
    });
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
