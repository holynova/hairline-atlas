const { Cam, clamp, fit, open, poly, proj, prism, rrect, rings, circ, facing, solid, put, mk, spring, stepS, pointer, register, disposer } = HL;

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

  const lens = mk("g", {}, g), rim = mk("path", { class: "nf lo" }, lens);
  const barrel = mk("path", { class: "nf sil" }, lens), outer = mk("path", { class: "nf hi" }, lens);
  const inner = mk("path", { class: "nf lo" }, lens), glass = mk("path", { class: "nf lo" }, lens);
  const focus = spring(8), center = [2, 25, 32];
  function drawLens() {
    const y0 = center[1], y1 = center[1] + focus.x;
    const a = circle(P, center[0], y0, center[2], 15), b = circle(P, center[0], y1, center[2], 15);
    rim.setAttribute("d", open(a)); outer.setAttribute("d", open(b));
    const aTop = P(center[0], y0, center[2] + 15), bTop = P(center[0], y1, center[2] + 15);
    const aLow = P(center[0], y0, center[2] - 15), bLow = P(center[0], y1, center[2] - 15);
    barrel.setAttribute("d", open([aTop, bTop, ...circle(P, center[0], y1, center[2], 15), bLow, aLow]));
    inner.setAttribute("d", open(circle(P, center[0], y1, center[2], 10.5)));
    glass.setAttribute("d", open(circle(P, center[0], y1, center[2], 5.5)));
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
