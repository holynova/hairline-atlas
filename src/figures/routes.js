const { Cam, fit, open, proj, rings, prism, circ, facing, solid, put, mk, tween, tset, tval, tdone, pointer, register, disposer } = HL;

const PORTS = [[-40, -18], [-27, 26], [2, -27], [31, 24], [43, -10]];

function mount({ stage, svg, read }, lift) {
  const bag = disposer(), C = Cam(45, 0.5, 2.3);
  fit(C, [[-61, -42, 0], [61, 42, 0], [-61, -42, 72], [61, 42, 72]], 200, 166);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const [board, boardInner] = rings(-54, -34, 54, 34, 8, 1.3);
  put(solid(g), prism(P, front, board, boardInner, 4, 16));
  const hub = rings(-12, -12, 12, 12, 6, 1.2);
  put(solid(g), prism(P, front, hub[0], hub[1], 16, 26));
  mk("path", { d: open(circ(6, 28).map((q) => P(q.u, q.v, 27))), class: "nf lo" }, g);
  const routes = PORTS.map(([x, y], i) => {
    const points = [[0, 0, 29], [x * 0.28, y * 0.25, 39 + (i % 2) * 2], [x * 0.7, y * 0.78, 31 + (i % 2) * 3], [x, y, 18]];
    const parts = [];
    for (let k = 0; k < 3; k++) parts.push({ el: mk("path", { class: "nf lo" }, g), tw: tween(i === 2 ? 1 : 0) });
    const port = mk("path", { class: "nf " + (i === 2 ? "hi" : "lo") }, g);
    const ring = open(circ(4.3, 24).map((q) => P(x + q.u, y + q.v, 18.5)));
    port.setAttribute("d", ring);
    const plug = mk("path", { class: "nf " + (i === 2 ? "hi" : "lo") }, g);
    const tip = P(x, y, 20);
    return { i, x, y, points, parts, port, plug, tip, pull: tween(i === 2 ? 2 : 0) };
  });
  let active = -1;
  const B = register(stage, (_dt, now) => {
    let moving = false;
    routes.forEach((route) => {
      const pull = tval(route.pull, now);
      const points = route.points.map((p, i) => {
        const along = [0, 0.3, 0.72, 1][i], outward = pull * 0.55 * along;
        return P(p[0] + route.x / 48 * outward, p[1] + route.y / 48 * outward, p[2] + pull * [0, 0.3, 0.76, 1][i]);
      });
      route.parts.forEach((part, k) => {
        part.el.setAttribute("d", open(points.slice(k, k + 2)));
        const lit = tval(part.tw, now) > 0.5;
        part.el.classList.toggle("hi", lit); part.el.classList.toggle("lo", !lit);
        if (!tdone(part.tw, now)) moving = true;
      });
      route.plug.setAttribute("d", open(circ(3.3, 20).map((q) => P(route.x + q.u, route.y + q.v, 18.8 + pull))));
      if (!tdone(route.pull, now)) moving = true;
    });
    return moving;
  });
  bag.add(B.unregister);
  function choose([x, y]) {
    let selected = -1, best = Infinity;
    routes.forEach((route) => { const d = Math.hypot(x - route.tip[0], y - route.tip[1]); if (d < best) { best = d; selected = route.i; } });
    return best < 58 ? selected : -1;
  }
  function select(i) {
    if (i === active) return;
    const now = performance.now(); active = i;
    const shown = i < 0 ? 2 : i;
    routes.forEach((route) => {
      route.parts.forEach((part, k) => tset(part.tw, route.i === shown ? 1 : 0, now, route.i === shown ? k * 75 : 0));
      tset(route.pull, route.i === shown ? (i < 0 ? 2 : lift) : 0, now, route.i === shown ? 150 : 0);
      route.port.classList.toggle("hi", route.i === shown); route.port.classList.toggle("lo", route.i !== shown);
      route.plug.classList.toggle("hi", route.i === shown); route.plug.classList.toggle("lo", route.i !== shown);
    });
    read.textContent = i < 0 ? "rest" : `route ${String(i + 1).padStart(2, "0")}`;
    B.wake();
  }
  bag.add(pointer(stage, { move: (p) => select(choose(p)), leave: () => select(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = v; if (active >= 0) { const current = active; active = -1; select(current); } }, destroy: bag.dispose };
}

hairline({
  name: "routes",
  means: "A selected plug lifts clear of a still route board, keeping each connection easy to trace.",
  rules: [1, 2, 3, 4, 6, 8, 9],
  range: [8, 44, 48],
  tour: [[126, 194], [190, 214], [274, 194], null],
  mount,
});
