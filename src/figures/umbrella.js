const { Cam, clamp, fit, open, proj, rad, spring, stepS, tween, tset, tval, tdone, pointer, register, disposer, mk } = HL;

const COUNT = 7, RADIUS = 46, REST = [1, 4, 0, 3, 7, 2, 5];

function mount({ stage, svg, read }, lift) {
  const bag = disposer(), C = Cam(45, 0.5, 2.55);
  fit(C, [[-56, -56, 0], [56, 56, 0], [-56, -56, 101], [56, 56, 60]], 200, 166);
  const P = proj(C), g = mk("g", {}, svg), apex = [0, 0, 94], rings = [], arms = [];
  mk("path", { d: open([P(0, 0, 5), P(0, 0, 94)]), class: "nf sil" }, g);
  const hook = mk("path", { d: open([P(0, 0, 8), P(-5, 0, 4), P(-12, 0, 4), P(-15, 0, 7)]), class: "nf lo" }, g);
  for (let i = 0; i < COUNT; i++) {
    const a = (i / COUNT) * Math.PI * 2 - 0.26;
    const x = Math.cos(a) * RADIUS, y = Math.sin(a) * RADIUS;
    const edge = P(x, y, 56 + REST[i]);
    const rib = mk("path", { class: "nf " + (i === 4 ? "hi" : "lo") }, g);
    const stay = mk("path", { class: "nf lo" }, g);
    const tw = tween(REST[i]);
    arms.push({ a, x, y, tw, rib, stay, base: REST[i] });
    rings.push(edge);
  }
  const edgeLine = mk("path", { class: "nf lo" }, g);
  let active = -1;
  const B = register(stage, (_dt, now) => {
    let moving = false;
    const pts = [];
    arms.forEach((a) => {
      const h = tval(a.tw, now), end = P(a.x, a.y, 56 + h);
      a.rib.setAttribute("d", open([P(...apex), end]));
      a.stay.setAttribute("d", open([P(a.x * 0.24, a.y * 0.24, 85), P(a.x * 0.82, a.y * 0.82, 65 + h * 0.6)]));
      a.rib.classList.toggle("hi", a === arms[(active < 0 ? 4 : active)]);
      pts.push(end);
      if (!tdone(a.tw, now)) moving = true;
    });
    edgeLine.setAttribute("d", open(pts.concat(pts[0] ? [pts[0]] : [])));
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
