const { Cam, clamp, fit, open, proj, circ, rad, spring, stepS, pointer, register, disposer, mk } = HL;

const wheel = (P, cx, cy, cz, r, turn = 0) => {
  const c = Math.cos(turn), s = Math.sin(turn);
  return circ(r, 56).map((q) => P(cx + q.u * c, cy + q.u * s, cz + q.v));
};

function mount({ stage, svg, read }, maxTurn) {
  const bag = disposer(), C = Cam(45, 0.5, 2.3);
  fit(C, [[-80, -33, 0], [82, 36, 0], [-80, -33, 67], [82, 36, 67]], 200, 166);
  const P = proj(C), g = mk("g", {}, svg);
  const A = [-52, 0, 24], B = [51, 0, 24], crank = [-2, 0, 24], seat = [-23, 0, 55], head = [29, 0, 54];
  const rear = mk("path", { class: "nf lo" }, g), rearInner = mk("path", { class: "nf lo" }, g);
  function setRear() {
    rear.setAttribute("d", open(wheel(P, A[0], A[1], A[2], 24)));
    rearInner.setAttribute("d", open(wheel(P, A[0], A[1], A[2], 20)));
  }
  setRear();
  const spokes = [];
  for (let i = 0; i < 4; i++) spokes.push(mk("path", { class: "nf lo" }, g));
  spokes.forEach((el, i) => el.setAttribute("d", open([P(A[0], A[1], A[2]), ...wheel(P, A[0], A[1], A[2], 20).slice(i * 13, i * 13 + 2)])));
  const frame = mk("path", { class: "nf sil" }, g);
  frame.setAttribute("d", open([P(...A), P(...seat), P(...crank), P(...A), P(...head), P(...seat), P(...head), P(...B)]));
  mk("path", { d: open([P(...seat), P(-13, 0, 59), P(-34, 0, 59)]), class: "nf hi" }, g);
  mk("path", { d: open([P(...head), P(39, 0, 60), P(49, 0, 58), P(36, 0, 58)]), class: "nf lo" }, g);
  mk("path", { d: open([P(...crank), P(-13, 0, 18), P(7, 0, 30), P(...crank)]), class: "nf lo" }, g);
  const pedal = mk("path", { d: open([P(-13, 0, 18), P(-23, 0, 18)]), class: "nf lo" }, g);
  const fork = mk("path", { class: "nf lo" }, g), front = mk("path", { class: "nf hi" }, g), inner = mk("path", { class: "nf lo" }, g);
  const spokesFront = [];
  for (let i = 0; i < 4; i++) spokesFront.push(mk("path", { class: "nf lo" }, g));
  const steer = spring(rad(7));
  function drawFront() {
    const yaw = steer.x, frontWheel = wheel(P, B[0], B[1], B[2], 24, yaw), inside = wheel(P, B[0], B[1], B[2], 20, yaw);
    front.setAttribute("d", open(frontWheel)); inner.setAttribute("d", open(inside));
    const forkEndA = P(B[0] - Math.sin(yaw) * 3, B[1] + Math.cos(yaw) * 3, B[2] - 24);
    const forkEndB = P(B[0] + Math.sin(yaw) * 3, B[1] - Math.cos(yaw) * 3, B[2] - 24);
    fork.setAttribute("d", open([P(...head), P(B[0] - 2, B[1], 49), forkEndA, forkEndB, P(B[0] + 2, B[1], 49), P(...head)]));
    spokesFront.forEach((el, i) => { const point = inside[(i * 14) % inside.length]; el.setAttribute("d", open([P(...B), point])); });
  }
  drawFront();
  const Bloop = register(stage, (dt) => { const moving = stepS(steer, dt); if (moving) drawFront(); return moving; });
  bag.add(Bloop.unregister);
  let lastX = 200;
  function aim(x) { lastX = x; steer.t = rad(clamp((x - 200) / 118, -1, 1) * maxTurn); read.textContent = "steer"; Bloop.wake(); }
  bag.add(pointer(stage, { move: ([x]) => aim(x), leave: () => { steer.t = rad(7); read.textContent = "rest"; Bloop.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxTurn = v; if (read.textContent === "steer") aim(lastX); }, destroy: bag.dispose };
}

hairline({
  name: "bicycle",
  means: "The bicycle's front wheel turns with the pointer while its frame holds steady.",
  rules: [1, 3, 4, 8, 9],
  range: [6, 14, 22],
  tour: [[116, 160], [200, 135], [286, 160], null],
  mount,
});
