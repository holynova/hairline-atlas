const { Cam, clamp, fit, open, proj, rad, spring, stepS, tween, tset, tval, tdone, pointer, register, disposer, mk, circ } = HL;

const COUNT = 7, RADIUS = 46, REST = [1, 4, 0, 3, 7, 2, 5];

function mount({ stage, svg, read }, lift) {
  const bag = disposer(), C = Cam(45, 0.5, 2.55);
  fit(C, [[-56, -56, 0], [56, 56, 0], [-56, -56, 101], [56, 56, 60]], 200, 166);
  const P = proj(C), g = mk("g", {}, svg), apex = [0, 0, 94], arms = [];
  mk("path", { d: open([P(0, 0, 5), P(0, 0, 94)]), class: "nf sil" }, g);
  mk("path", { d: open([P(0, 0, 8), P(-3, 0, 3), P(-9, 0, 1), P(-15, 0, 3), P(-16, 0, 6), P(-13, 0, 8)]), class: "nf sil" }, g);
  [10, 12.5, 15, 17.5].forEach((z) => mk("path", { d: open([P(-0.9, 0, z), P(0.9, 0, z)]), class: "nf lo" }, g));
  mk("path", { d: open(circ(3.4, 24).map((q) => P(q.u, 0, 65 + q.v))), class: "nf sil" }, g);
  mk("path", { d: open(circ(2.4, 20).map((q) => P(q.u, 0, 89 + q.v))), class: "nf hi" }, g);
  for (let i = 0; i < COUNT; i++) {
    const a = (i / COUNT) * Math.PI * 2 - 0.26;
    const x = Math.cos(a) * RADIUS, y = Math.sin(a) * RADIUS;
    const edge = P(x, y, 56 + REST[i]);
    const rib = mk("path", { class: "nf " + (i === 4 ? "hi" : "lo") }, g);
    const stay = mk("path", { class: "nf lo" }, g);
    const tie = mk("path", { class: "nf lo" }, g), cuff = mk("path", { class: "nf lo" }, g);
    const panel = mk("path", { class: "nf lo" }, g), bartack = mk("path", { class: "nf lo" }, g);
    const tw = tween(REST[i]);
    arms.push({ a, x, y, tw, rib, stay, tie, cuff, panel, bartack, base: REST[i] });
  }
  const edgeLine = mk("path", { class: "nf sil" }, g), innerEdge = mk("path", { class: "nf lo" }, g);
  let active = -1;
  const B = register(stage, (_dt, now) => {
    let moving = false;
    const pts = [], inner = [];
    arms.forEach((a, i) => {
      const h = tval(a.tw, now), end = P(a.x, a.y, 56 + h);
      const next = arms[(i + 1) % COUNT], hNext = tval(next.tw, now), nextA = next.a + (i === COUNT - 1 ? Math.PI * 2 : 0), mid = (a.a + nextA) / 2;
      a.rib.setAttribute("d", open([P(...apex), end]));
      a.stay.setAttribute("d", open([P(a.x * 0.2, a.y * 0.2, 84), P(a.x * 0.76, a.y * 0.76, 65 + h * 0.6)]));
      a.tie.setAttribute("d", open([P(a.x * 0.2, a.y * 0.2, 84), P(a.x * 0.44, a.y * 0.44, 75 + h * 0.3), P(a.x * 0.76, a.y * 0.76, 65 + h * 0.6)]));
      a.cuff.setAttribute("d", open(circ(2, 16).map((q) => P(a.x + q.u * 0.72, a.y + q.u * 0.22, 56 + h + q.v * 0.72))));
      const m = P(Math.cos(mid) * 39, Math.sin(mid) * 39, 56 + (h + hNext) / 2);
      a.panel.setAttribute("d", open([P(...apex), P(a.x * 0.48 + next.x * 0.09, a.y * 0.48 + next.y * 0.09, 78), m]));
      a.bartack.setAttribute("d", open([P(a.x * 0.45 - a.y * 0.035, a.y * 0.45 + a.x * 0.035, 78 + h * 0.2), P(a.x * 0.45 + a.y * 0.035, a.y * 0.45 - a.x * 0.035, 78 + h * 0.2)]));
      a.rib.classList.toggle("hi", a === arms[(active < 0 ? 4 : active)]);
      pts.push(end);
      pts.push(P(Math.cos(mid) * 43, Math.sin(mid) * 43, 56 + (h + hNext) / 2));
      inner.push(P(Math.cos(mid) * 39.5, Math.sin(mid) * 39.5, 56 + (h + hNext) / 2));
      if (!tdone(a.tw, now)) moving = true;
    });
    edgeLine.setAttribute("d", open(pts.concat(pts[0] ? [pts[0]] : [])));
    innerEdge.setAttribute("d", open(inner));
    return moving;
  });
  bag.add(B.unregister);
  const restTips = arms.map((a) => P(a.x, a.y, 56 + a.base));
  function choose(p) {
    let i = 0, best = Infinity;
    restTips.forEach((q, k) => { const d = Math.hypot(p[0] - q[0], p[1] - q[1]); if (d < best) { best = d; i = k; } });
    return best < 74 ? i : -1;
  }
  function select(i) {
    if (i === active) return;
    const from = i < 0 ? active : i, now = performance.now(); active = i;
    arms.forEach((a, k) => {
      const raw = Math.abs(k - from), distance = Math.min(raw, COUNT - raw);
      const target = i < 0 ? a.base : a.base + Math.max(0, lift - distance * 3.5);
      tset(a.tw, target, now, distance * 38);
    });
    read.textContent = i < 0 ? "rest" : `rib ${String(i + 1).padStart(2, "0")}`;
    B.wake();
  }
  bag.add(pointer(stage, { move: selectFrom, leave: () => select(-1) }));
  function selectFrom(p) { select(choose(p)); }
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = v; if (active >= 0) { const current = active; active = -1; select(current); } }, destroy: bag.dispose };
}

hairline({
  name: "umbrella",
  means: "Seven umbrella ribs flex away from the one the pointer brushes.",
  rules: [1, 2, 3, 4, 8, 9],
  range: [6, 11, 17],
  tour: [[238, 144], [172, 144], [203, 192], null],
  mount,
});
