const { Cam, clamp, fit, open, proj, rings, prism, rrect, facing, solid, put, mk, tween, tset, tval, tdone, pointer, register, disposer, circ } = HL;

function mount({ stage, svg, read }, travel) {
  const bag = disposer(), C = Cam(45, 0.5, 1.7);
  fit(C, [[-66, -36, 0], [66, 40, 0], [-66, -36, 78], [66, 40, 78]], 200, 166);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const [cab, cabIn] = rings(-60, -30, 60, 30, 8, 1.5);
  put(solid(g), prism(P, front, cab, cabIn, 5, 76));
  mk("path", { d: open([P(-52, 30.5, 12), P(-52, 30.5, 70), P(52, 30.5, 70), P(52, 30.5, 12)]), class: "nf lo" }, g);
  mk("path", { d: open([P(-60, 30, 18), P(-54, 30, 18), P(-54, 30, 65), P(-60, 30, 65)]), class: "nf sil" }, g);
  mk("path", { d: open([P(60, 30, 18), P(54, 30, 18), P(54, 30, 65), P(60, 30, 65)]), class: "nf sil" }, g);
  [-56, 56].forEach((x) => {
    for (let z = 18; z <= 65; z += 8) mk("path", { d: open(circ(1.25, 12).map((q) => P(x, 30.2, z + q.v))), class: "nf lo" }, g);
  });
  [34, 54].forEach((z) => mk("path", { d: open([P(-51, 29, z), P(51, 29, z)]), class: "nf lo" }, g));
  const items = [
    { x: 0, w: 34, z0: 58, z1: 70, depth: 0, parent: -1, rest: 1 },
    { x: -25, w: 34, z0: 38, z1: 50, depth: 1, parent: 0, rest: 3 },
    { x: 25, w: 34, z0: 38, z1: 50, depth: 1, parent: 0, rest: 0 },
    ...[-39, -13, 13, 39].map((x, i) => ({ x, w: 20, z0: 16, z1: 29, depth: 2, parent: i < 2 ? 1 : 2, rest: [0, 5, 1, 2][i], page: i })),
  ];
  items.forEach((item) => {
    item.body = solid(g); item.face = mk("path", { class: "nf lo" }, g); item.handle = mk("path", { class: "nf lo" }, g);
    item.folder = mk("path", { class: "nf lo" }, g); item.tab = mk("path", { class: "nf lo" }, g); item.paper = mk("path", { class: "nf lo" }, g);
    item.rules = mk("path", { class: "nf lo" }, g); item.gripRing = mk("path", { class: "nf lo" }, g); item.pull = tween(item.rest);
  });
  let active = -1;
  function draw(item, now) {
    const d = tval(item.pull, now), shift = (x, y, z) => P(x, y + d, z);
    const [outer, inner] = rings(item.x - item.w / 2, -9, item.x + item.w / 2, 9, 3.4, 0.9);
    put(item.body, prism(shift, front, outer, inner, item.z0, item.z1));
    const face = rrect(item.x - item.w / 2 + 2, item.z0 + 2, item.x + item.w / 2 - 2, item.z1 - 2, 2, 4);
    item.face.setAttribute("d", open(face.map((q) => shift(q.u, 9.5, q.v))));
    const folder = rrect(item.x - item.w * 0.32, -7, item.x + item.w * 0.32, 7, 1.5, 5);
    item.folder.setAttribute("d", open(folder.map((q) => shift(q.u, q.v, item.z1 + 1.1))));
    const tab = rrect(item.x + item.w * 0.12, -4, item.x + item.w * 0.29, 4, 1, 4);
    item.tab.setAttribute("d", open(tab.map((q) => shift(q.u, q.v, item.z1 + 1.4))));
    item.paper.setAttribute("d", open(rrect(item.x - item.w * 0.27, -5, item.x + item.w * 0.22, 5, 1.2, 4).map((q) => shift(q.u, q.v, item.z1 + 1.8))));
    item.rules.setAttribute("d", [item.z0 + 4.6, (item.z0 + item.z1) / 2, item.z1 - 4.6].map((z) => open([P(item.x - item.w / 2 + 4, 9.7 + d, z), P(item.x + item.w / 2 - 4, 9.7 + d, z)])).join(""));
    item.gripRing.setAttribute("d", open(circ(item.page === undefined ? 2.2 : 1.7, 16).map((q) => P(item.x + q.u, 10 + d, (item.z0 + item.z1) / 2 + q.v))));
    item.handle.setAttribute("d", open([P(item.x - 3, 10 + d, (item.z0 + item.z1) / 2), P(item.x + 3, 10 + d, (item.z0 + item.z1) / 2)]));
    item.body.sil.classList.toggle("hi", item.page === (active < 0 ? 1 : active));
    return !tdone(item.pull, now);
  }
  const B = register(stage, (_dt, now) => { let moving = false; items.forEach((item) => { if (draw(item, now)) moving = true; }); return moving; });
  bag.add(B.unregister);
  const tips = items.filter((item) => item.page !== undefined).map((item) => P(item.x, 0, (item.z0 + item.z1) / 2));
  function choose([x, y]) {
    let which = -1, best = Infinity;
    tips.forEach((p, i) => { const d = Math.hypot(x - p[0], y - p[1]); if (d < best) { best = d; which = i; } });
    return best < 48 ? which : -1;
  }
  function select(i) {
    if (i === active) return;
    const now = performance.now(), prior = i < 0 ? active : i; active = i;
    items.forEach((item) => {
      const target = item.page === i && i >= 0 ? travel : item.depth === 1 && i >= 0 && item.parent === items[3 + i].parent ? travel * 0.64 : item.depth === 0 && i >= 0 ? travel * 0.34 : item.rest;
      tset(item.pull, target, now, item.depth * 75);
    });
    read.textContent = i < 0 ? "rest" : `page ${Math.floor(i / 2) + 1}·${(i % 2) + 1}`;
    B.wake();
  }
  bag.add(pointer(stage, { move: (p) => select(choose(p)), leave: () => select(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { travel = v; if (active >= 0) { const current = active; active = -1; select(current); } }, destroy: bag.dispose };
}

hairline({
  name: "sitemap",
  means: "A card catalogue opens a page and then the drawers that contain it.",
  rules: [1, 3, 4, 6, 8, 9, 10],
  range: [28, 58, 68],
  tour: [[155, 213], [235, 207], [282, 215], null],
  mount,
});
