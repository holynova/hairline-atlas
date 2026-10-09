const { Cam, clamp, fit, fillet, open, poly, proj, spring, stepS, pointer, register, disposer, mk, rad } = HL;

function mount({ stage, svg, read }, reach) {
  const bag = disposer(), C = Cam(45, 0.5, 1.78);
  fit(C, [[-64, -42, 0], [66, 42, 0], [-50, -45, 93], [62, 45, 85]], 200, 166);
  const P = proj(C), g = mk("g", {}, svg);
  mk("path", { d: open([P(-78, -40, 5), P(84, -40, 5)]), class: "nf dash" }, g);
  mk("path", { d: open([P(-78, 40, 5), P(84, 40, 5)]), class: "nf dash" }, g);
  const hull = fillet([[-55, -17], [-42, -29], [35, -25], [53, -10], [57, 0], [53, 10], [35, 25], [-42, 29], [-55, 17]], [4, 6, 8, 5, 4, 5, 8, 6, 4], 4);
  mk("path", { d: poly(hull.map(([x, y]) => P(x, y, 15))), class: "sil" }, g);
  const deck = fillet([[-43, -12], [-32, -19], [33, -17], [45, -7], [47, 0], [45, 7], [33, 17], [-32, 19], [-43, 12]], [3, 4, 5, 3, 2, 3, 5, 4, 3], 4);
  mk("path", { d: open(deck.map(([x, y]) => P(x, y, 16.5))), class: "nf lo" }, g);
  mk("path", { d: open([P(-13, 0, 15), P(-13, 0, 86)]), class: "nf lo" }, g);
  mk("path", { d: open([P(-13, 0, 15), P(-13, 0, 86), P(-13, 0, 16)]), class: "nf dash" }, g);
  const sail = mk("path", { class: "sil hi" }, g), fold = mk("path", { class: "nf lo" }, g);
  const boom = mk("path", { class: "nf lo" }, g), sheet = spring(rad(10));
  const sailShape = [[0, 82], [0, 23], [43, 31]];
  function sailPoint([u, z], angle) {
    return P(-13 + u * Math.cos(angle), u * Math.sin(angle), z);
  }
  function draw() {
    const a = sheet.x;
    sail.setAttribute("d", poly(sailShape.map((p) => sailPoint(p, a))));
    fold.setAttribute("d", open([sailPoint([2, 75], a), sailPoint([4, 38], a), sailPoint([38, 32], a)]));
    boom.setAttribute("d", open([P(-13, 0, 24), sailPoint([43, 31], a)]));
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
  range: [14, 25, 38],
  tour: [[126, 162], [206, 137], [280, 158], null],
  mount,
});
