const { Cam, clamp, fit, open, poly, proj, prism, rrect, rings, circ, facing, solid, put, mk, spring, stepS, pointer, register, disposer, seg } = HL;

const circle = (P, x, y, z, r) => circ(r, 48).map((q) => P(x + q.u, y, z + q.v));

function box(P, front, g, x0, y0, x1, y1, z0, z1, r = 6) {
  const [outer, inner] = rings(x0, y0, x1, y1, r, 1.1), el = solid(g);
  put(el, prism(P, front, outer, inner, z0, z1));
  return el;
}

function mount({ stage, svg, read }, range) {
  const bag = disposer(), C = Cam(45, 0.5, 2.55);
  fit(C, [[-52, -36, 0], [52, 38, 0], [-52, -36, 72], [52, 38, 67], [38, 66, 52]], 200, 166);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  box(P, front, g, -38, -24, 38, 25, 8, 54, 8);
  box(P, front, g, -41, 12, -27, 25, 14, 49, 4);
  box(P, front, g, -12, -14, 12, 7, 54, 62, 3);
  const dial = circ(5.5, 28).map((q) => P(20 + q.u, 0, 55 + q.v));
  mk("path", { d: open(dial), class: "nf lo" }, g);
  mk("path", { d: open([P(-26, -1, 56), P(-26, 4, 56), P(-22, 4, 56)]), class: "nf lo" }, g);
  mk("path", { d: open(circ(2.8, 20).map((q) => P(20 + q.u, 0, 55 + q.v))), class: "nf hi" }, g);
  const dialTicks = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2, x0 = 20 + Math.cos(a) * 6.3, z0 = 55 + Math.sin(a) * 6.3;
    return seg(P(x0, 0, z0), P(20 + Math.cos(a) * (i % 2 ? 7.5 : 8.3), 0, 55 + Math.sin(a) * (i % 2 ? 7.5 : 8.3)));
  }).join("");
  mk("path", { d: dialTicks, class: "nf lo" }, g);
  mk("path", { d: open(rrect(-7, -9, 7, -2, 1.3, 4).map((q) => P(q.u, q.v, 62))), class: "nf lo" }, g);
  mk("path", { d: open([P(-5, -8, 62), P(-5, -3, 62), P(5, -3, 62), P(5, -8, 62)]), class: "nf lo" }, g);
  mk("path", { d: open([P(-10, -15, 61), P(-8, -16, 68), P(8, -16, 68), P(10, -15, 61)]), class: "nf sil" }, g);
  mk("path", { d: open(circ(3.1, 20).map((q) => P(-25 + q.u, 0, 56 + q.v))), class: "nf hi" }, g);
  const grip = rrect(-36, 17, -28, 45, 3, 6);
  mk("path", { d: open(grip.map((q) => P(q.u, 25.7, q.v))), class: "nf lo" }, g);
  [-33.8, -31.4, -29].forEach((x) => mk("path", { d: open([P(x, 26, 20), P(x - 1.5, 26, 42)]), class: "nf lo" }, g));
  [-1, 1].forEach((side) => {
    const x = side * 39.5;
    mk("path", { d: open(circ(3.1, 18).map((q) => P(x, q.u * 0.72, 19 + q.v))), class: "nf lo" }, g);
    mk("path", { d: open(circ(3.1, 18).map((q) => P(x, q.u * 0.72, 45 + q.v))), class: "nf lo" }, g);
  });

  const lens = mk("g", {}, g), rim = mk("path", { class: "nf lo" }, lens);
  const barrel = mk("path", { class: "nf sil" }, lens), outer = mk("path", { class: "nf hi" }, lens);
  const inner = mk("path", { class: "nf lo" }, lens), glass = mk("path", { class: "nf lo" }, lens);
  const filter = mk("path", { class: "nf lo" }, lens), focusRidges = Array.from({ length: 3 }, () => mk("path", { class: "nf lo" }, lens));
  const iris = Array.from({ length: 6 }, () => mk("path", { class: "nf lo" }, lens));
  const focus = spring(8), center = [2, 25, 32];
  function drawLens() {
    const y0 = center[1], y1 = center[1] + focus.x;
    const a = circle(P, center[0], y0, center[2], 15), b = circle(P, center[0], y1, center[2], 15);
    rim.setAttribute("d", open(a)); outer.setAttribute("d", open(b));
    const aTop = P(center[0], y0, center[2] + 15), bTop = P(center[0], y1, center[2] + 15);
    const aLow = P(center[0], y0, center[2] - 15), bLow = P(center[0], y1, center[2] - 15);
    barrel.setAttribute("d", open([aTop, bTop, ...circle(P, center[0], y1, center[2], 15), bLow, aLow]));
    inner.setAttribute("d", open(circle(P, center[0], y1, center[2], 10.5)));
    filter.setAttribute("d", open(circle(P, center[0], y1, center[2], 7.6)));
    glass.setAttribute("d", open(circle(P, center[0], y1, center[2], 5.5)));
    focusRidges.forEach((el, i) => el.setAttribute("d", open(circle(P, center[0], y0 + (y1 - y0) * (i + 1) / 4, center[2], 14.4 - i * 0.7))));
    iris.forEach((el, i) => {
      const a = i * Math.PI / 3, x0 = center[0] + Math.cos(a) * 2.1, z0 = center[2] + Math.sin(a) * 2.1;
      const x1 = center[0] + Math.cos(a + 0.48) * 4.8, z1 = center[2] + Math.sin(a + 0.48) * 4.8;
      el.setAttribute("d", open([P(x0, y1 - 0.2, z0), P(x1, y1 - 0.2, z1)]));
    });
  }
  drawLens();
  const B = register(stage, (dt) => { const moving = stepS(focus, dt); if (moving) drawLens(); return moving; });
  bag.add(B.unregister);
  let lastX = 200;
  function aim(x) { lastX = x; focus.t = 3 + clamp((x - 95) / 210, 0, 1) * range; read.textContent = "focus"; B.wake(); }
  bag.add(pointer(stage, { move: ([x]) => aim(x), leave: () => { read.textContent = "rest"; focus.t = 8; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { range = v; if (read.textContent === "focus") aim(lastX); }, destroy: bag.dispose };
}

hairline({
  name: "camera",
  means: "The camera lens travels forward as the pointer moves across its body.",
  rules: [1, 3, 4, 8, 9],
  range: [8, 20, 28],
  tour: [[110, 166], [200, 144], [300, 166], null],
  mount,
});
