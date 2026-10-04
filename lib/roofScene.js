import * as THREE from 'three';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (x) => 1 - Math.pow(1 - x, 3);
const smooth = (x) => x * x * (3 - 2 * x);
const lerp = (a, b, t) => a + (b - a) * t;
function rng(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

// House dimensions
const W = 8;
const D = 6;
const WALL = 2.2;
const PEAK = 1.9;
const OV = 0.4;
const HALF_D = D / 2 + OV;
const EAVE_Y = WALL - OV * (PEAK / (D / 2));
const RIDGE_Y = WALL + PEAK;
const RISE = RIDGE_Y - EAVE_Y;
const THETA = Math.atan2(RISE, HALF_D);
const SL = Math.hypot(HALF_D, RISE);
const RW = W + OV * 2;

function plywoodTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#9a7a52';
  g.fillRect(0, 0, 256, 256);
  const r = rng(7);
  for (let i = 0; i < 900; i++) {
    g.fillStyle = `rgba(${60 + r() * 40},${40 + r() * 30},20,${0.05 + r() * 0.07})`;
    g.fillRect(r() * 256, r() * 256, 1 + r() * 30, 1);
  }
  g.strokeStyle = 'rgba(40,25,10,.55)';
  g.lineWidth = 2;
  g.strokeRect(0, 0, 256, 256);
  g.beginPath();
  g.moveTo(128, 0);
  g.lineTo(128, 128);
  g.moveTo(0, 128);
  g.lineTo(256, 128);
  g.stroke();
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export function createRoofScene(canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 120);
  const disposables = [];
  const track = (o) => (disposables.push(o), o);
  const mat = (opts) => track(new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0, ...opts }));

  // Lights
  scene.add(new THREE.HemisphereLight(0xbcd0ff, 0x16203f, 1.0));
  const sun = new THREE.DirectionalLight(0xffe3b5, 2.6);
  sun.position.set(7, 11, 7);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 40 });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.03;
  scene.add(sun);

  const world = new THREE.Group();
  scene.add(world);

  // Ground
  const ground = new THREE.Mesh(track(new THREE.CircleGeometry(11, 64)), mat({ color: 0x0f1c3b, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  world.add(ground);
  const ring = new THREE.Mesh(track(new THREE.RingGeometry(10.8, 11, 96)), track(new THREE.MeshBasicMaterial({ color: 0xe4c27a })));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.01;
  world.add(ring);

  // Pool, a nod to the neighbourhood
  const pool = new THREE.Mesh(track(new THREE.BoxGeometry(3.2, 0.06, 1.8)), mat({ color: 0x1fb6c9, roughness: 0.25, metalness: 0.1 }));
  pool.position.set(-2.4, 0.03, 5.6);
  pool.receiveShadow = true;
  world.add(pool);
  const deckEdge = new THREE.Mesh(track(new THREE.BoxGeometry(3.7, 0.04, 2.3)), mat({ color: 0x9aa3b5 }));
  deckEdge.position.set(-2.4, 0.01, 5.6);
  deckEdge.receiveShadow = true;
  world.add(deckEdge);

  // Walls
  const stucco = mat({ color: 0xd9cdb8 });
  const walls = new THREE.Mesh(track(new THREE.BoxGeometry(W, WALL, D)), stucco);
  walls.position.y = WALL / 2;
  walls.castShadow = walls.receiveShadow = true;
  world.add(walls);

  const gShape = new THREE.Shape();
  gShape.moveTo(-D / 2, 0);
  gShape.lineTo(D / 2, 0);
  gShape.lineTo(0, PEAK);
  gShape.closePath();
  const gableGeo = track(new THREE.ExtrudeGeometry(gShape, { depth: W, bevelEnabled: false }));
  const gables = new THREE.Mesh(gableGeo, stucco);
  gables.rotation.y = Math.PI / 2;
  gables.position.set(-W / 2, WALL, 0);
  gables.castShadow = gables.receiveShadow = true;
  world.add(gables);

  const winMat = mat({ color: 0x1b2a4d, roughness: 0.3, metalness: 0.2 });
  [-2.3, 0.2, 2.6].forEach((x) => {
    const win = new THREE.Mesh(track(new THREE.BoxGeometry(1.1, 0.9, 0.06)), winMat);
    win.position.set(x, 1.2, D / 2 + 0.02);
    world.add(win);
  });
  const door = new THREE.Mesh(track(new THREE.BoxGeometry(0.9, 1.5, 0.06)), mat({ color: 0xf2f4f7 }));
  door.position.set(-3.1, 0.75, D / 2 + 0.03);
  world.add(door);

  // Plywood deck texture
  const plyTex = plywoodTexture();
  plyTex.repeat.set(RW / 2.4, SL / 2.4);
  disposables.push(plyTex);

  const dummy = new THREE.Object3D();
  const color = new THREE.Color();

  function buildSlope(side, seed) {
    const r = rng(seed);
    const g = new THREE.Group();
    g.rotation.order = 'YXZ';
    g.rotation.y = side > 0 ? 0 : Math.PI;
    g.rotation.x = THETA;
    g.position.set(0, EAVE_Y, side * HALF_D);
    world.add(g);

    // Deck
    const deckGeo = track(new THREE.PlaneGeometry(RW, SL));
    deckGeo.rotateX(-Math.PI / 2);
    deckGeo.translate(0, 0, -SL / 2);
    const deck = new THREE.Mesh(deckGeo, mat({ map: plyTex, color: 0xffffff }));
    deck.receiveShadow = true;
    g.add(deck);
    const underside = new THREE.Mesh(track(new THREE.BoxGeometry(RW, 0.1, SL)), mat({ color: 0x3a2c1c }));
    underside.position.set(0, -0.06, -SL / 2);
    g.add(underside);

    // Old shingles
    const R = 14;
    const C = 22;
    const oldCount = R * C;
    const oldGeo = track(new THREE.BoxGeometry(1, 1, 1));
    const old = new THREE.InstancedMesh(oldGeo, mat({ color: 0xffffff, roughness: 1 }), oldCount);
    old.castShadow = old.receiveShadow = true;
    const oldData = [];
    const oldCols = [0x6e5337, 0x7d6140, 0x5a432c, 0x866a47, 0x4f3a26];
    let idx = 0;
    for (let row = 0; row < R; row++) {
      for (let col = 0; col < C; col++) {
        const tw = RW / C;
        const th = SL / R;
        const off = row % 2 ? tw / 2 : 0;
        oldData.push({
          x: -RW / 2 + (col + 0.5) * tw + off - (row % 2 ? 0 : 0),
          z: -(row + 0.5) * th,
          row,
          tw: tw * 0.96,
          th: th * 1.12,
          t: (1 - row / R) * 0.62 + r() * 0.28,
          dx: (r() - 0.5) * 3,
          dz: 0.6 + r() * 2.6,
          dy: 2.2 + r() * 2.4,
          rx: (r() - 0.5) * 5,
          rz: (r() - 0.5) * 5,
        });
        old.setColorAt(idx++, color.set(oldCols[Math.floor(r() * oldCols.length)]));
      }
    }
    old.instanceColor.needsUpdate = true;
    g.add(old);

    // Underlayment courses
    const S = 7;
    const ch = (SL / S) * 1.2;
    const underMat = mat({ color: 0xc9a362, roughness: 0.95 });
    const courses = [];
    for (let j = 0; j < S; j++) {
      const geo = track(new THREE.PlaneGeometry(RW, ch));
      geo.rotateX(-Math.PI / 2);
      geo.translate(RW / 2, 0, -ch / 2);
      const m = new THREE.Mesh(geo, underMat);
      m.position.set(-RW / 2, 0.05 + j * 0.002, -j * (SL / S));
      m.receiveShadow = true;
      g.add(m);
      courses.push(m);
    }

    // New shingles
    const R2 = 18;
    const C2 = 26;
    const newGeo = track(new THREE.BoxGeometry(1, 1, 1));
    const fresh = new THREE.InstancedMesh(newGeo, mat({ color: 0xffffff, roughness: 0.9 }), R2 * C2);
    fresh.castShadow = fresh.receiveShadow = true;
    const newData = [];
    const newCols = [0x5f6670, 0x777e88, 0x4b525c, 0x8b9099, 0x6a6258, 0x6f7681];
    idx = 0;
    for (let row = 0; row < R2; row++) {
      for (let col = 0; col < C2; col++) {
        const tw = RW / C2;
        const th = SL / R2;
        const off = row % 2 ? tw / 2 : 0;
        newData.push({
          x: -RW / 2 + (col + 0.5) * tw + off - tw / 4,
          z: -(row + 0.5) * th,
          y: 0.1 + row * 0.004,
          tw: tw * 0.95,
          th: th * 1.18,
          t: (row / R2) * 0.8 + r() * 0.12,
        });
        fresh.setColorAt(idx++, color.set(newCols[Math.floor(r() * newCols.length)]));
      }
    }
    fresh.instanceColor.needsUpdate = true;
    g.add(fresh);

    function update(s1, s2, s3) {
      // tear-off
      for (let i = 0; i < oldCount; i++) {
        const d = oldData[i];
        const q = clamp((s1 - d.t) / 0.26);
        if (q <= 0) {
          dummy.position.set(d.x, 0.045, d.z);
          dummy.rotation.set(0, 0, 0);
          dummy.scale.set(d.tw, 0.07, d.th);
        } else {
          const e = ease(q);
          dummy.position.set(d.x + d.dx * e, 0.045 + d.dy * e + q * q * 1.2, d.z + d.dz * e);
          dummy.rotation.set(d.rx * e, 0, d.rz * e);
          const sc = 1 - smooth(clamp((q - 0.55) / 0.45));
          dummy.scale.set(d.tw * sc, 0.07 * sc, d.th * sc);
        }
        dummy.updateMatrix();
        old.setMatrixAt(i, dummy.matrix);
      }
      old.instanceMatrix.needsUpdate = true;
      old.visible = s1 < 0.999;

      // underlayment
      courses.forEach((m, j) => {
        const q = clamp((s2 - (j / S) * 0.78) / 0.24);
        m.visible = q > 0;
        m.scale.x = Math.max(0.0001, ease(q));
      });

      // new shingles
      for (let i = 0; i < newData.length; i++) {
        const d = newData[i];
        const q = clamp((s3 - d.t) / 0.14);
        const e = ease(q);
        dummy.position.set(d.x, d.y + (1 - e) * 0.9, d.z);
        dummy.rotation.set((1 - e) * 0.7, 0, 0);
        const sc = Math.max(0.0001, e);
        dummy.scale.set(d.tw * sc, 0.08 * sc, d.th * sc);
        dummy.updateMatrix();
        fresh.setMatrixAt(i, dummy.matrix);
      }
      fresh.instanceMatrix.needsUpdate = true;
      fresh.visible = s3 > 0;
    }
    return { update };
  }

  const front = buildSlope(1, 11);
  const back = buildSlope(-1, 29);

  // Ridge caps
  const capN = 18;
  const capGeo = track(new THREE.BoxGeometry(1, 1, 1));
  const caps = new THREE.InstancedMesh(
    capGeo,
    mat({ color: 0xe4c27a, roughness: 0.4, metalness: 0.35 }),
    capN
  );
  caps.castShadow = true;
  world.add(caps);

  // Flat deck annex
  const annexLen = 3.8;
  const annexD = 3.8;
  const annexH = 1.7;
  const ax = W / 2 + annexLen / 2 - 0.2;
  const annex = new THREE.Mesh(track(new THREE.BoxGeometry(annexLen, annexH, annexD)), stucco);
  annex.position.set(ax, annexH / 2, 0);
  annex.castShadow = annex.receiveShadow = true;
  world.add(annex);

  const topY = annexH + 0.01;
  const sand = mat({ color: 0xc9b48e });
  const par = 0.22;
  const parapets = [
    [annexLen, par, 0.14, 0, par / 2, annexD / 2 - 0.07],
    [annexLen, par, 0.14, 0, par / 2, -annexD / 2 + 0.07],
    [0.14, par, annexD, annexLen / 2 - 0.07, par / 2, 0],
    [0.14, par, annexD, -annexLen / 2 + 0.07, par / 2, 0],
  ];
  parapets.forEach(([bw, bh, bd, px, py, pz]) => {
    const b = new THREE.Mesh(track(new THREE.BoxGeometry(bw, bh, bd)), sand);
    b.position.set(ax + px, annexH + py, pz);
    b.castShadow = b.receiveShadow = true;
    world.add(b);
  });

  const flatMat = mat({ color: 0x3a3836, roughness: 1 });
  const flatGeo = track(new THREE.PlaneGeometry(annexLen - 0.3, annexD - 0.3));
  flatGeo.rotateX(-Math.PI / 2);
  const flat = new THREE.Mesh(flatGeo, flatMat);
  flat.position.set(ax, topY, 0);
  flat.receiveShadow = true;
  world.add(flat);

  const coatGeo = track(new THREE.PlaneGeometry(annexLen - 0.3, annexD - 0.3));
  coatGeo.rotateX(-Math.PI / 2);
  coatGeo.translate((annexLen - 0.3) / 2, 0, 0);
  const coatMat = mat({ color: 0xf6f8fb, roughness: 0.95 });
  const coat = new THREE.Mesh(coatGeo, coatMat);
  coat.position.set(ax - (annexLen - 0.3) / 2, topY + 0.012, 0);
  coat.receiveShadow = true;
  world.add(coat);

  const ac = new THREE.Mesh(track(new THREE.BoxGeometry(1.0, 0.75, 1.0)), mat({ color: 0xaab3bf, roughness: 0.6, metalness: 0.2 }));
  ac.position.set(ax + 0.9, topY + 0.38, -0.5);
  ac.castShadow = true;
  world.add(ac);
  [-0.6, 0.2].forEach((z, i) => {
    const v = new THREE.Mesh(track(new THREE.CylinderGeometry(0.07, 0.07, 0.35, 12)), mat({ color: 0xf2f4f7 }));
    v.position.set(ax - 0.9 + i * 0.5, topY + 0.18, z + 0.9);
    v.castShadow = true;
    world.add(v);
  });

  const flatDark = new THREE.Color(0x3a3836);
  const flatTan = new THREE.Color(0xc9a362);

  function setStages(P) {
    const s1 = clamp(P);
    const s2 = clamp(P - 1);
    const s3 = clamp(P - 2);
    const s4 = clamp(P - 3);
    front.update(s1, s2, s3);
    back.update(s1, s2, s3);

    for (let k = 0; k < capN; k++) {
      const q = clamp((s4 - (k / capN) * 0.62) / 0.3);
      const e = ease(q);
      const x = -RW / 2 + 0.25 + (k * (RW - 0.5)) / (capN - 1);
      dummy.position.set(x, RIDGE_Y + 0.1 + (1 - e) * 0.8, 0);
      dummy.rotation.set(0, 0, 0);
      const sc = Math.max(0.0001, e);
      dummy.scale.set(0.56 * sc, 0.2 * sc, 0.7 * sc);
      dummy.updateMatrix();
      caps.setMatrixAt(k, dummy.matrix);
    }
    caps.instanceMatrix.needsUpdate = true;

    flatMat.color.copy(flatDark).lerp(flatTan, smooth(clamp(P - 1)));
    const wipe = ease(clamp((s4 - 0.1) / 0.85));
    coat.scale.x = Math.max(0.0001, wipe);
    coat.visible = wipe > 0.001;
  }

  // Camera + loop state
  const target = new THREE.Vector3(1.5, 2.1, 0.4);
  let progressTarget = 0;
  let progress = 0;
  let px = 0;
  let py = 0;
  let tx = 0;
  let ty = 0;
  let aspect = 1;
  let visible = true;
  let raf = 0;
  let lastP = -1;

  function placeCamera() {
    const t = clamp(progress / 4);
    const az = lerp(-0.62, 0.5, smooth(t)) + px * 0.07;
    const el = lerp(0.5, 0.58, smooth(t)) + py * 0.03;
    const fit = aspect < 1 ? 1 + (1 - aspect) * 0.9 : 1;
    const radius = 19.5 * fit;
    camera.position.set(
      target.x + radius * Math.cos(el) * Math.sin(az),
      target.y + radius * Math.sin(el),
      target.z + radius * Math.cos(el) * Math.cos(az)
    );
    camera.lookAt(target);
  }

  function resize() {
    const parent = canvas.parentElement;
    const w = parent.clientWidth || 1;
    const h = parent.clientHeight || 1;
    aspect = w / h;
    renderer.setSize(w, h, false);
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    lastP = -1;
  }

  function frame() {
    raf = requestAnimationFrame(frame);
    if (!visible) return;
    progress += (progressTarget - progress) * 0.09;
    if (Math.abs(progressTarget - progress) < 0.0005) progress = progressTarget;
    px += (tx - px) * 0.06;
    py += (ty - py) * 0.06;
    if (progress !== lastP) {
      setStages(progress);
      lastP = progress;
    }
    placeCamera();
    renderer.render(scene, camera);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement);
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  io.observe(canvas);

  resize();
  setStages(0);
  frame();

  return {
    setProgress(p, immediate = false) {
      progressTarget = clamp(p, 0, 4);
      if (immediate) progress = progressTarget;
    },
    setPointer(x, y) {
      tx = x;
      ty = y;
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      disposables.forEach((d) => d.dispose && d.dispose());
      old_dispose();
      renderer.dispose();
    },
  };

  function old_dispose() {
    scene.traverse((o) => {
      if (o.isInstancedMesh) o.dispose();
    });
  }
}
