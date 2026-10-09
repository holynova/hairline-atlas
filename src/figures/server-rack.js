const { Cam, fit, open, proj, prism, rings, rrect, facing, solid, put, mk, seg, tween, tset, tval, tdone, pointer, register, disposer } = HL;

const COUNT = 5, REST = [2, 0, 5, 1, 7];

function mount({ stage, svg, read }, travel) {
  const bag = disposer(), C = Cam(45, 0.5, 2.1);
  fit(C, [[-52, -35, 0], [52, 40, 0], [-52, -35, 94], [52, 40, 94]], 200, 166);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const [caseRing, caseInner] = rings(-39, -26, 39, 26, 8, 1.4);
  put(solid(g), prism(P, front, caseRing, caseInner, 5, 89));
  const sides = mk("path", { d: open([P(-32, 27, 12), P(-32, 27, 82), P(32, 27, 82), P(32, 27, 12)]), class: "nf lo" }, g);
  const bays = Array.from({ length: COUNT }, (_, i) => {
    const z0 = 11 + i * 14, z1 = z0 + 10;
    return { i, z0, z1, rest: REST[i], tray: solid(g), face: mk("path", { class: "nf lo" }, g), vents: mk("path", { class: "nf lo" }, g), indicator: mk("ellipse", { rx: 1.3, ry: 0.9, class: "dot off" }, g), pull: tween(REST[i]) };
  });
  let active = -1;
  function draw(bay, now) {
    const out = tval(bay.pull, now), local = (x, y, z) => P(x, y + out, z);
    const [outer, inner] = rings(-30, 1, 30, 18, 4, 0.8);
    put(bay.tray, prism(local, front, outer, inner, bay.z0, bay.z1));
    const panel = rrect(-25, bay.z0 + 2, 25, bay.z1 - 2, 1.8, 4);
    bay.face.setAttribute("d", open(panel.map((q) => local(q.u, 18.2, q.v))));
    bay.vents.setAttribute("d", [-12, -8, -4].map((x) => seg(P(x, 18.5 + out, bay.z0 + 5), P(x, 18.5 + out, bay.z1 - 5))).join(""));
    const led = P(20, 18.5 + out, bay.z0 + 5);
    bay.indicator.setAttribute("cx", led[0]); bay.indicator.setAttribute("cy", led[1]);
    bay.tray.sil.classList.toggle("hi", bay.i === (active < 0 ? 2 : active));
    bay.indicator.classList.toggle("dot", bay.i === (active < 0 ? 2 : active));
    bay.indicator.classList.toggle("off", bay.i !== (active < 0 ? 2 : active));
    return !tdone(bay.pull, now);
  }
  const B = register(stage, (_dt, now) => { let moving = false; bays.forEach((bay) => { if (draw(bay, now)) moving = true; }); return moving; });
  bag.add(B.unregister);
  const centres = bays.map((bay) => P(0, 0, (bay.z0 + bay.z1) / 2));
  function choose([x, y]) {
    let which = 0, best = Infinity;
    centres.forEach((p, i) => { const d = Math.hypot(x - p[0], y - p[1]); if (d < best) { best = d; which = i; } });
    return best < 54 ? which : -1;
  }
  function select(i) {
    if (i === active) return;
    const from = i < 0 ? active : i, now = performance.now(); active = i;
    bays.forEach((bay, k) => {
      const distance = Math.abs(k - from), target = i < 0 ? bay.rest : bay.rest + Math.max(0, travel - distance * 4);
      tset(bay.pull, target, now, distance * 44);
    });
    read.textContent = i < 0 ? "rest" : `bay ${String(i + 1).padStart(2, "0")}`;
    B.wake();
  }
  bag.add(pointer(stage, { move: (p) => select(choose(p)), leave: () => select(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { travel = v; if (active >= 0) { const current = active; active = -1; select(current); } }, destroy: bag.dispose };
}

hairline({
  name: "server-rack",
  means: "The server bay under the pointer slides forward; nearby bays follow a little later.",
  rules: [1, 2, 3, 4, 6, 8, 9],
  range: [6, 14, 24],
  tour: [[203, 104], [204, 166], [204, 227], null],
  mount,
});
