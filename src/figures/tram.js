const { Cam, clamp, fit, open, proj, rings, prism, rrect, circ, facing, solid, put, mk, tween, tset, tval, tdone, pointer, register, disposer } = HL;

const CENTRES = [-55, 0, 55], REST = [1, 4, 0];

function mount({ stage, svg, read }, travel) {
  const bag = disposer(), C = Cam(45, 0.5, 1.65);
  fit(C, [[-96, -38, 0], [96, 40, 0], [-96, -38, 74], [96, 40, 74]], 200, 166);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  mk("path", { d: open([P(-89, 31, 8), P(90, 31, 8)]), class: "nf lo" }, g);
  mk("path", { d: open([P(-89, 20, 8), P(90, 20, 8)]), class: "nf dash" }, g);
  const cars = CENTRES.map((cx, i) => {
    const group = mk("g", {}, g), wheels = [];
    for (const dx of [-15, 15]) wheels.push(mk("path", { class: "nf lo" }, group));
    const shell = solid(group);
    const windows = [];
    for (let k = 0; k < 3; k++) windows.push(mk("path", { class: "nf lo" }, group));
    const door = mk("path", { class: "nf lo" }, group);
    const trolley = mk("path", { class: "nf lo" }, group);
    return { cx, i, shell, wheels, windows, door, trolley, lift: tween(REST[i]) };
  });
  const couplers = [mk("path", { class: "nf lo" }, g), mk("path", { class: "nf lo" }, g)];
  let active = -1;
  function draw(car, now) {
    const z = tval(car.lift, now), cx = car.cx, localP = (x, y, h) => P(x + cx, y, h + z);
    const [outer, inner] = rings(cx - 25, -17, cx + 25, 17, 8, 1.1);
    put(car.shell, prism(localP, front, outer, inner, 18, 46));
    car.wheels.forEach((el, k) => {
      const x = cx + (k === 0 ? -15 : 15), circle = circ(7.5, 28).map((q) => P(x + q.u, 17, 16 + q.v + z));
      el.setAttribute("d", open(circle));
    });
    car.windows.forEach((el, k) => {
      const x0 = cx - 18 + k * 12, pane = rrect(x0, 29, x0 + 9, 41, 2, 4);
      el.setAttribute("d", open(pane.map((q) => P(q.u, 17.2, q.v + z))));
    });
    const door = rrect(cx + 12, 19, cx + 21, 44, 2, 4);
    car.door.setAttribute("d", open(door.map((q) => P(q.u, 17.3, q.v + z))));
    car.trolley.setAttribute("d", car.i === 1 ? open([P(cx - 8, 0, 46 + z), P(cx - 2, 0, 61 + z), P(cx + 8, 0, 61 + z), P(cx + 13, 0, 46 + z)]) : "");
    const highlighted = car.i === (active < 0 ? 1 : active);
    car.shell.sil.classList.toggle("hi", highlighted);
    car.door.classList.toggle("hi", highlighted); car.door.classList.toggle("lo", !highlighted);
    return !tdone(car.lift, now);
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    cars.forEach((car) => { if (draw(car, now)) moving = true; });
    couplers.forEach((el, i) => {
      const a = cars[i], b = cars[i + 1], za = tval(a.lift, now), zb = tval(b.lift, now), mid = (a.cx + b.cx) / 2;
      el.setAttribute("d", open([P(a.cx + 25, 17, 26 + za), P(mid, 20, 22 + (za + zb) / 2), P(b.cx - 25, 17, 26 + zb)]));
    });
    return moving;
  });
  bag.add(B.unregister);
  const restCenters = CENTRES.map((x) => P(x, 0, 31));
  function choose([x, y]) {
    let best = -1, distance = Infinity;
    restCenters.forEach((p, i) => { const d = Math.hypot(x - p[0], y - p[1]); if (d < distance) { best = i; distance = d; } });
    return distance < 62 ? best : -1;
  }
  function select(i) {
    if (i === active) return;
    const from = i < 0 ? active : i, now = performance.now(); active = i;
    cars.forEach((car, k) => {
      const distance = Math.abs(k - from), target = i < 0 ? REST[k] : REST[k] + Math.max(0, travel - distance * 5);
      tset(car.lift, target, now, distance * 42);
    });
    read.textContent = i < 0 ? "rest" : `car ${String(i + 1).padStart(2, "0")}`;
    B.wake();
  }
  bag.add(pointer(stage, { move: (p) => select(choose(p)), leave: () => select(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { travel = v; if (active >= 0) { const current = active; active = -1; select(current); } }, destroy: bag.dispose };
}

hairline({
  name: "tram",
  means: "Three connected tram cars rise from the track in the order the pointer reaches them.",
  rules: [1, 2, 3, 4, 8, 9],
  range: [7, 14, 22],
  tour: [[136, 167], [200, 138], [266, 167], null],
  mount,
});
