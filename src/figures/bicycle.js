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
  const spokes = Array.from({ length: 14 }, () => mk("path", { class: "nf lo" }, g));
  spokes.forEach((el, i) => { const ring = wheel(P, A[0], A[1], A[2], 20); el.setAttribute("d", open([P(A[0], A[1], A[2]), ring[i * 4]])); });
  mk("path", { d: open(wheel(P, A[0], 1.2, A[2], 8)), class: "nf lo" }, g);
  mk("path", { d: open(circ(3.2, 20).map((q) => P(A[0] + q.u, A[1] + 1.4, A[2] + q.v))), class: "nf sil" }, g);
  mk("path", { d: open([P(A[0], A[1] - 1.6, A[2]), P(A[0], A[1] + 1.6, A[2])]), class: "nf lo" }, g);
  const frame = mk("path", { class: "sil" }, g);
  frame.setAttribute("d", open([P(...A), P(...seat), P(...crank), P(...A), P(...head), P(...seat), P(...head), P(...B)]));
  mk("path", { d: open([P(A[0], 1.1, A[2]), P(seat[0], 1.1, seat[2]), P(crank[0], 1.1, crank[2]), P(A[0], 1.1, A[2]), P(head[0], 1.1, head[2]), P(seat[0], 1.1, seat[2]), P(head[0], 1.1, head[2]), P(B[0], 1.1, B[2])]), class: "nf lo" }, g);
  mk("path", { d: open([P(...seat), P(-21, 0, 58), P(-33, 0, 59), P(-39, 0, 57), P(-28, 0, 55), P(...seat)]), class: "nf hi" }, g);
  mk("path", { d: open([P(-23, 0, 50), P(-23, 0, 56)]), class: "nf lo" }, g);
  mk("path", { d: open([P(-26, 0, 54), P(-20, 0, 54)]), class: "nf lo" }, g);
  mk("path", { d: open([P(...head), P(36, 0, 59), P(48, 0, 59), P(52, 0, 56), P(47, 0, 55), P(40, 0, 56)]), class: "nf sil" }, g);
  mk("path", { d: open(circ(4.5, 20).map((q) => P(35 + q.u, 0, 56 + q.v))), class: "nf lo" }, g);
  mk("path", { d: open([P(38, 0, 54), P(38, 0, 59)]), class: "nf lo" }, g);
  mk("path", { d: open([P(...crank), P(-13, 0, 18), P(-23, 0, 18), P(-23, 0, 20)]), class: "nf lo" }, g);
  mk("path", { d: open(circ(7.2, 28).map((q) => P(crank[0] + q.u, -1, crank[2] + q.v))), class: "nf lo" }, g);
  mk("path", { d: open(circ(6.2, 28).map((q) => P(A[0] + q.u, -1, A[2] + q.v))), class: "nf lo" }, g);
  mk("path", { d: open([P(-9, -1, 29), P(-43, -1, 32), P(-43, -1, 16), P(-9, -1, 19), P(-9, -1, 29)]), class: "nf lo" }, g);
  mk("path", { d: open([P(-10, -1.6, 28), P(-42, -1.6, 30.5), P(-42, -1.6, 17.5), P(-10, -1.6, 20), P(-10, -1.6, 28)]), class: "nf lo" }, g);
  // Machined sprocket teeth, chainring arms and a paired chain run show how
  // the pedal spindle actually transfers force to the rear hub.
  for (const [x, z, r, n] of [[-2, 24, 9, 16], [-52, 24, 8, 14]]) {
    for (let i = 0; i < n; i++) {
      const a = i * Math.PI * 2 / n, b = (i + .5) * Math.PI * 2 / n;
      mk("path", { d: open([P(x + Math.cos(a) * r, -1.2, z + Math.sin(a) * r), P(x + Math.cos(b) * (r + 1.1), -1.2, z + Math.sin(b) * (r + 1.1))]), class: "nf lo" }, g);
    }
  }
  mk("path", { d: open([P(-9, -2, 32), P(-42, -2, 33.5)]), class: "sil" }, g);
  mk("path", { d: open([P(-9, -2, 16), P(-42, -2, 14.5)]), class: "sil" }, g);
  for (const [x, z, r] of [[-2, 24, 3], [-52, 24, 2.5], [51, 24, 3]]) {
    mk("path", { d: open(circ(r, 24).map((q) => P(x + q.u, -2, z + q.v))), class: "nf lo" }, g);
    mk("path", { d: open([P(x - r * .6, -2.2, z), P(x + r * .6, -2.2, z)]), class: "nf lo" }, g);
  }
  // Twin brake calipers and curved mudguards follow the tire without hiding it.
  mk("path", { d: open([P(-60, -1, 43), P(-58, -1, 50), P(-52, -1, 55), P(-45, -1, 53)]), class: "nf lo" }, g);
  mk("path", { d: open([P(43, -1, 46), P(47, -1, 52), P(53, -1, 55), P(59, -1, 51)]), class: "nf lo" }, g);
  mk("path", { d: open([P(-59, -1, 45), P(-56, -1, 49), P(-52, -1, 51), P(-48, -1, 50)]), class: "nf lo" }, g);
  mk("path", { d: open([P(45, -1, 47), P(49, -1, 50), P(53, -1, 51), P(57, -1, 49)]), class: "nf lo" }, g);
  mk("path", { d: open([P(39, -1, 55), P(48, -1, 50), P(53, -1, 28)]), class: "nf dash" }, g);
  mk("path", { d: open([P(-18, -1, 27), P(-18, -1, 20)]), class: "nf dash" }, g);
  const pedal = mk("path", { d: open([P(-13, 0, 18), P(-24, 0, 18), P(-26, 0, 20), P(-22, 0, 20)]), class: "nf sil" }, g);
  const fork = mk("path", { class: "nf lo" }, g), front = mk("path", { class: "nf hi" }, g), inner = mk("path", { class: "nf lo" }, g);
  const spokesFront = Array.from({ length: 14 }, () => mk("path", { class: "nf lo" }, g));
  mk("path", { d: open(wheel(P, B[0], 1.2, B[2], 8)), class: "nf lo" }, g);
  mk("path", { d: open(circ(3.2, 20).map((q) => P(B[0] + q.u, 1.4, B[2] + q.v))), class: "nf hi" }, g);
  mk("path", { d: open(circ(8.5, 24).map((q) => P(B[0] + q.u, 1.5, B[2] + q.v))), class: "nf lo" }, g);
  mk("path", { d: open([P(26, 0, 51), P(32, 1, 46), P(51, 1, 24)]), class: "nf dash" }, g);
  const steer = spring(rad(0));
  function drawFront() {
    const yaw = steer.x, frontWheel = wheel(P, B[0], B[1], B[2], 24, yaw), inside = wheel(P, B[0], B[1], B[2], 20, yaw);
    front.setAttribute("d", open(frontWheel)); inner.setAttribute("d", open(inside));
    const forkEndA = P(B[0] - Math.sin(yaw) * 3, B[1] + Math.cos(yaw) * 3, B[2] - 24);
    const forkEndB = P(B[0] + Math.sin(yaw) * 3, B[1] - Math.cos(yaw) * 3, B[2] - 24);
    fork.setAttribute("d", open([P(...head), P(B[0] - 2, B[1], 49), forkEndA, forkEndB, P(B[0] + 2, B[1], 49), P(...head)]));
    spokesFront.forEach((el, i) => { const point = inside[(i * 4) % inside.length]; el.setAttribute("d", open([P(...B), point])); });
  }
  drawFront();
  const Bloop = register(stage, (dt) => { const moving = stepS(steer, dt); if (moving) drawFront(); return moving; });
  bag.add(Bloop.unregister);
  let lastX = 200;
  function aim(x) { lastX = x; steer.t = rad(clamp((x - 200) / 118, -1, 1) * maxTurn); read.textContent = "steer"; Bloop.wake(); }
  bag.add(pointer(stage, { move: ([x]) => aim(x), leave: () => { steer.t = rad(0); read.textContent = "rest"; Bloop.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxTurn = v; if (read.textContent === "steer") aim(lastX); }, destroy: bag.dispose };
}

hairline({
  name: "bicycle",
  means: "The bicycle's front wheel turns with the pointer while its frame holds steady.",
  rules: [1, 3, 4, 8, 9],
  range: [8, 22, 34],
  tour: [[116, 160], [200, 135], [286, 160], null],
  mount,
});
