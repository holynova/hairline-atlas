const { Cam, fit, open, proj, rings, prism, rrect, circ, facing, solid, put, mk, seg, tween, tset, tval, tdone, pointer, register, disposer } = HL;

const PORTS = [[-40, -18], [-27, 26], [2, -27], [31, 24], [43, -10]];

function mount({ stage, svg, read }, lift) {
  const bag = disposer(), C = Cam(45, 0.5, 2.05);
  fit(C, [[-76, -56, 0], [76, 56, 0], [-76, -56, 78], [76, 56, 78]], 200, 166);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const [deck, deckIn] = rings(-58, -37, 58, 37, 9, 1.7);
  put(solid(g), prism(P, front, deck, deckIn, 5, 16));
  const [module, moduleIn] = rings(-18, -15, 18, 15, 7, 1.2);
  put(solid(g), prism(P, front, module, moduleIn, 16, 26));
  mk("path", { d: open(circ(8, 32).map((q) => P(q.u, q.v, 26.4))), class: "nf lo" }, g);
  mk("path", { d: open(circ(4.5, 24).map((q) => P(q.u, q.v, 27))), class: "nf hi" }, g);
  [0, 1, 2, 3].forEach((i) => {
    const a = i * Math.PI / 2;
    mk("path", { d: open([P(Math.cos(a) * 5.3, Math.sin(a) * 5.3, 27.1), P(Math.cos(a) * 7, Math.sin(a) * 7, 27.1)]), class: "nf lo" }, g);
  });
  mk("path", { d: open(rrect(-8, -6, 8, 6, 2, 5).map((q) => P(q.u, q.v, 27.2))), class: "nf lo" }, g);
  const screws = [[-51, -30], [51, -30], [-51, 30], [51, 30]];
  screws.forEach(([x, y]) => {
    mk("path", { d: open(circ(1.5, 16).map((q) => P(x + q.u, y + q.v, 16.2))), class: "nf lo" }, g);
    mk("path", { d: open([P(x - 0.7, y, 16.3), P(x + 0.7, y, 16.3)]), class: "nf lo" }, g);
  });
  for (let x = -38; x <= 38; x += 8) mk("path", { d: open([P(x, -35, 7), P(x + 3, -35, 7)]), class: "nf lo" }, g);

  const routes = PORTS.map(([x, y], i) => {
    const jack = solid(g), slot = mk("path", { class: "nf sil" }, g), notch = mk("path", { class: "nf lo" }, g);
    const contacts = mk("path", { class: "nf lo" }, g), led = mk("ellipse", { rx: 1.2, ry: 0.9, class: `dot ${i === 2 ? "" : "off"}` }, g);
    const cable = Array.from({ length: 3 }, (_, k) => ({ el: mk("path", { class: `nf ${i === 2 ? "hi" : "lo"}` }, g), tw: tween(i === 2 ? 1 : 0), k }));
    const plug = solid(g), plugFace = mk("path", { class: "nf lo" }, g), strain = mk("path", { class: "nf lo" }, g), latch = mk("path", { class: "nf lo" }, g);
    const [plugRing, plugInner] = rings(-5, -3.5, 5, 3.5, 1.4, 0.8);
    const points = [[0, 0, 27], [x * 0.24, y * 0.22, 40 + i % 2 * 2], [x * 0.66, y * 0.72, 33 + i % 2 * 2], [x, y, 24]];
    const tip = P(x, y, 21), pull = tween(i === 2 ? 2 : 0);
    put(jack, prism(P, front, rings(x - 7, y - 6, x + 7, y + 6, 2, 0.7)[0], rings(x - 7, y - 6, x + 7, y + 6, 2, 0.7)[1], 16, 19));
    slot.setAttribute("d", open(rrect(x - 5, y - 4, x + 5, y + 4, 1.2, 4).map((q) => P(q.u, q.v, 19.2))));
    notch.setAttribute("d", open([P(x - 2, y - 2.3, 19.4), P(x + 2, y - 2.3, 19.4), P(x + 3, y - 1, 19.4)]));
    contacts.setAttribute("d", Array.from({ length: 6 }, (_, k) => seg(P(x - 3.5 + k * 1.4, y + 1.1, 19.5), P(x - 3.5 + k * 1.4, y + 2.6, 19.5))).join(""));
    const ledAt = P(x - 7.7, y + 4.3, 19.7); led.setAttribute("cx", ledAt[0]); led.setAttribute("cy", ledAt[1]);
    return { i, x, y, jack, slot, notch, contacts, led, cable, plug, plugFace, strain, latch, plugRing, plugInner, points, tip, pull };
  });

  let active = -1;
  const B = register(stage, (_dt, now) => {
      let moving = false;
    routes.forEach((route) => {
      const amount = tval(route.pull, now), along = amount * 0.56;
      const move = (x, y, z) => P(route.x + x + route.x / 48 * along, route.y + y + route.y / 48 * along, z);
      const points = route.points.map((p, i) => {
        const liftAt = [0, 0.34, 0.72, 0.85][i];
        const radial = [0, 0.25, 0.65, 1][i] * along;
        return P(p[0] + route.x / 48 * radial, p[1] + route.y / 48 * radial, p[2] + amount * liftAt);
      });
      route.cable.forEach((part) => {
        part.el.setAttribute("d", open(points.slice(part.k, part.k + 2)));
        const lit = tval(part.tw, now) > 0.5;
        part.el.classList.toggle("hi", lit); part.el.classList.toggle("lo", !lit);
        if (!tdone(part.tw, now)) moving = true;
      });
      const z0 = 19 + amount * 0.8, z1 = 23 + amount * 0.85;
      put(route.plug, prism(move, front, route.plugRing, route.plugInner, z0, z1));
      route.plugFace.setAttribute("d", open(rrect(-3.5, -2, 3.5, 2, 0.8, 4).map((q) => move(q.u, q.v, z1 + 0.2))));
      route.strain.setAttribute("d", [-1.4, 0, 1.4].map((offset) => open([move(offset, -2.3, z1), move(offset, -4.1, z1)])).join(""));
      route.latch.setAttribute("d", open([move(-2.1, -0.4, z1 + 0.2), move(0, -0.4, z1 + 1.6), move(2.1, -0.4, z1 + 0.2)]));
      route.plug.sil.classList.toggle("hi", route.i === (active < 0 ? 2 : active));
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
      route.cable.forEach((part) => tset(part.tw, route.i === shown ? 1 : 0, now, route.i === shown ? part.k * 75 : 0));
      const raw = i < 0 ? 0 : Math.abs(route.i - i), distance = i < 0 ? Infinity : Math.min(raw, PORTS.length - raw);
      const target = i < 0 ? (route.i === shown ? 2 : 0) : route.i === i ? lift : distance === 1 ? lift * 0.18 : 0;
      tset(route.pull, target, now, route.i === i ? 150 : distance === 1 ? 48 : 0);
      route.jack.sil.classList.toggle("hi", route.i === shown);
      route.slot.classList.toggle("hi", route.i === shown); route.slot.classList.toggle("lo", route.i !== shown);
      route.led.classList.toggle("dot", route.i === shown); route.led.classList.toggle("off", route.i !== shown);
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
  means: "A network switch releases a connector; its patch cable lifts from the fixed jack.",
  rules: [1, 2, 3, 4, 6, 8, 9],
  range: [34, 66, 76],
  tour: [[126, 194], [190, 214], [274, 194], null],
  mount,
});
