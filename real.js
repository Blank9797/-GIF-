/* Moduli stile "Realistico" — generati e revisionati da agenti, assemblati automaticamente.
   Ogni modulo è isolato in una IIFE ed esporta su globalThis solo i nomi del contratto. */
'use strict';

/* ===== materials-core ===== */
(() => {
// ---- Nucleo materiali/luci: luce chiave da alto-sinistra (-0.45,-0.65) ----

function gradEllipse3D(ctx, x, y, rx, ry, rot, mat) {
  // parsing hex -> [r,g,b] e mix verso un altro colore
  const px = h => {
    let s = String(h).replace('#', '');
    if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
    const n = parseInt(s, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const mix = (a, b, t) => 'rgb(' +
    Math.round(a[0] + (b[0] - a[0]) * t) + ',' +
    Math.round(a[1] + (b[1] - a[1]) * t) + ',' +
    Math.round(a[2] + (b[2] - a[2]) * t) + ')';
  const W = [255, 255, 255], WARM = [255, 246, 230];
  const c0 = px(mat.c0), c1 = px(mat.c1), c2 = px(mat.c2);
  const gl = mat.gloss || 0;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);

  // direzione luce di scena ruotata nel frame locale dell'ellisse
  const co = Math.cos(rot), si = Math.sin(rot);
  const lx = -0.45 * co - 0.65 * si;
  const ly = 0.45 * si - 0.65 * co;
  const k = ry / rx; // squash per rendere circolari i gradienti radiali

  // 1) volume base: radiale off-center verso la luce, 4 stop
  ctx.save();
  ctx.scale(1, k);
  const gx = lx * rx * 0.42, gy = ly * rx * 0.42;
  const g0 = ctx.createRadialGradient(gx, gy, rx * 0.04, gx * 0.25, gy * 0.25, rx * 1.32);
  g0.addColorStop(0, mix(c0, W, 0.45));   // schiarita lato luce (tarata: era troppo calda)
  g0.addColorStop(0.34, mix(c0, W, 0.06));
  g0.addColorStop(0.68, mix(c1, c1, 0));
  g0.addColorStop(1, mix(c2, c1, 0.35));
  ctx.fillStyle = g0;
  ctx.beginPath();
  ctx.arc(0, 0, rx, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // clip sull'ellisse per rimbalzo, AO e specular
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.clip();

  // 2) luce di rimbalzo: banda chiara calda lungo il bordo inferiore (di scena)
  const ab = Math.atan2(co, si); // "basso" di scena nel frame locale
  ctx.globalAlpha = 0.10;
  ctx.strokeStyle = mix(c0, WARM, 0.85);
  ctx.lineWidth = Math.max(2, rx * 0.11);
  ctx.beginPath();
  ctx.ellipse(0, 0, rx * 0.96, ry * 0.96, 0, ab - 1.0, ab + 1.0);
  ctx.stroke();

  // 3) occlusione ambientale: 3 archi concentrici in basso-destra, alpha decrescente
  const aa = Math.atan2(-ly, -lx); // direzione ombra (opposta alla luce)
  ctx.strokeStyle = '#000';
  ctx.lineWidth = rx * 0.16;
  const ao = [[1.0, 0.055], [0.90, 0.032], [0.80, 0.018]];
  for (let i = 0; i < 3; i++) {
    ctx.globalAlpha = ao[i][1];
    ctx.beginPath();
    ctx.ellipse(0, 0, rx * ao[i][0], ry * ao[i][0], 0, aa - 1.15, aa + 1.15);
    ctx.stroke();
  }

  // 4) specularita "vinile": blob morbido + micro-punto verso la luce
  if (gl > 0) {
    ctx.globalAlpha = 1;
    ctx.save();
    ctx.translate(lx * rx * 0.5, ly * ry * 0.5);
    ctx.scale(1, 0.75); // highlight leggermente schiacciato
    const gs = ctx.createRadialGradient(0, 0, 0, 0, 0, rx * 0.32);
    gs.addColorStop(0, 'rgba(255,255,255,' + 0.20 * gl + ')');
    gs.addColorStop(0.6, 'rgba(255,255,255,' + 0.07 * gl + ')');
    gs.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gs;
    ctx.beginPath();
    ctx.arc(0, 0, rx * 0.32, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    const mxp = lx * rx * 0.62, myp = ly * ry * 0.62;
    const gp = ctx.createRadialGradient(mxp, myp, 0, mxp, myp, rx * 0.075);
    gp.addColorStop(0, 'rgba(255,255,255,' + 0.28 * gl + ')');
    gp.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gp;
    ctx.beginPath();
    ctx.arc(mxp, myp, rx * 0.075, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore(); // chiude il clip
  ctx.restore(); // chiude la trasformazione
}

function shapeLighting(ctx, buildPath, cx, cy, r, mat) {
  ctx.save();
  ctx.beginPath();
  buildPath(ctx);
  ctx.clip();

  const lx = cx - 0.45 * r, ly = cy - 0.65 * r;      // punto luce
  const X = cx - r * 1.3, Y = cy - r * 1.3, S = r * 2.6; // rettangolo di copertura
  let g;

  // 1) ombra di forma: trasparente lato luce, scurisce verso basso-destra
  g = ctx.createRadialGradient(lx, ly, r * 0.2, cx + 0.2 * r, cy + 0.3 * r, r * 1.75);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(0.55, 'rgba(0,0,0,0.05)');
  g.addColorStop(1, 'rgba(0,0,0,0.18)');
  ctx.fillStyle = g;
  ctx.fillRect(X, Y, S, S);

  // 2) schiarita verso alto-sinistra
  g = ctx.createRadialGradient(lx, ly, 0, lx, ly, r * 1.05);
  g.addColorStop(0, 'rgba(255,255,255,0.14)');
  g.addColorStop(0.6, 'rgba(255,255,255,0.05)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(X, Y, S, S);

  // 3) rimbalzo caldo dal basso (sopra la zona di contatto)
  g = ctx.createLinearGradient(0, cy + r * 0.3, 0, cy + r);
  g.addColorStop(0, 'rgba(255,240,220,0)');
  g.addColorStop(0.7, 'rgba(255,240,220,0.08)');
  g.addColorStop(1, 'rgba(255,240,220,0.03)');
  ctx.fillStyle = g;
  ctx.fillRect(X, Y, S, S);

  // 4) AO di contatto: ultimi ~18% in basso
  g = ctx.createLinearGradient(0, cy + r * 0.64, 0, cy + r);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(0,0,0,0.12)');
  ctx.fillStyle = g;
  ctx.fillRect(X, Y, S, S);

  // 5) specular morbido alto-sinistra
  if (mat && mat.gloss > 0) {
    const hx = cx - 0.45 * r * 0.55, hy = cy - 0.65 * r * 0.55;
    g = ctx.createRadialGradient(hx, hy, 0, hx, hy, r * 0.42);
    g.addColorStop(0, 'rgba(255,255,255,' + 0.30 * mat.gloss + ')');
    g.addColorStop(0.55, 'rgba(255,255,255,' + 0.10 * mat.gloss + ')');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(X, Y, S, S);
  }

  ctx.restore();
}
Object.assign(globalThis, { gradEllipse3D, shapeLighting });
})();

/* ===== eyes-face ===== */
(() => {
function realEye(ctx, x, y, rx, ry, rot, open) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  if (open < 0.2) {
    // occhio chiuso: ciglia come forma affusolata + ombra morbida sotto
    const lash = (dy, col) => {
      const N = 12;
      ctx.beginPath();
      for (let i = 0; i <= N; i++) {
        const t = i / N, px = -rx + 2 * rx * t;
        const base = Math.sin(Math.PI * t) * ry * 0.22; // leggera curva in giu
        const w = 2.6 * Math.sin(Math.PI * t);          // spessore variabile
        if (i === 0) ctx.moveTo(px, dy + base - w); else ctx.lineTo(px, dy + base - w);
      }
      for (let i = N; i >= 0; i--) {
        const t = i / N, px = -rx + 2 * rx * t;
        const base = Math.sin(Math.PI * t) * ry * 0.22;
        const w = 2.6 * Math.sin(Math.PI * t);
        ctx.lineTo(px, dy + base + w);
      }
      ctx.closePath();
      ctx.fillStyle = col;
      ctx.fill();
    };
    lash(2.5, 'rgba(0,0,0,0.12)');
    lash(0, '#1A1620');
    ctx.restore();
    return;
  }
  const h = ry * Math.min(open, 1);
  // ombra della palpebra appena sopra
  ctx.fillStyle = 'rgba(12,9,16,0.15)';
  ctx.beginPath();
  ctx.ellipse(0, -h * 0.8, rx * 1.15, h * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();
  // corpo occhio: gradiente verticale profondo
  const g = ctx.createLinearGradient(0, -h, 0, h);
  g.addColorStop(0, '#08080F');
  g.addColorStop(0.55, '#131B36');
  g.addColorStop(1, '#1E2C63');
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, h, 0, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();
  // interno clippato: caustica blu e umidita'
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, h, 0, 0, Math.PI * 2);
  ctx.clip();
  const c = ctx.createRadialGradient(0, h * 0.5, 0, 0, h * 0.5, rx * 0.95);
  c.addColorStop(0, 'rgba(58,85,196,0.85)');
  c.addColorStop(0.45, 'rgba(58,85,196,0.35)');
  c.addColorStop(1, 'rgba(58,85,196,0)');
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.ellipse(0, h * 0.45, rx * 0.95, h * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
  // riga di umidita' sul bordo inferiore
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, rx * 0.88, h * 0.88, 0, Math.PI * 0.2, Math.PI * 0.8);
  ctx.stroke();
  ctx.restore();
  // bordo iride leggermente piu scuro
  ctx.strokeStyle = 'rgba(4,4,10,0.7)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, rx - 1, h - 1, 0, 0, Math.PI * 2);
  ctx.stroke();
  // catchlight primario morbido alto-sx: due ellissi sfalsate
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath();
  ctx.ellipse(-rx * 0.26, -h * 0.36, rx * 0.44, h * 0.28, -0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath();
  ctx.ellipse(-rx * 0.32, -h * 0.44, rx * 0.30, h * 0.19, -0.25, 0, Math.PI * 2);
  ctx.fill();
  // catchlight secondario basso-dx
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.beginPath();
  ctx.ellipse(rx * 0.30, h * 0.38, rx * 0.12, h * 0.09, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function realClosedHappy(ctx, x, y) {
  ctx.save();
  // mezzaluna ^ affusolata: segue l'arco raggio 17 centrato (x, y+10)
  const lash = (dy, col) => {
    const N = 14, cx = x, cy = y + 10 + dy, r = 17;
    ctx.beginPath();
    for (let i = 0; i <= N; i++) {
      const t = i / N, a = Math.PI + Math.PI * t;
      const w = 4 * Math.sin(Math.PI * t); // spessore max 8 al centro, 0 alle punte
      const rr = r + w;
      if (i === 0) ctx.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
      else ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
    }
    for (let i = N; i >= 0; i--) {
      const t = i / N, a = Math.PI + Math.PI * t;
      const w = 4 * Math.sin(Math.PI * t);
      ctx.lineTo(cx + Math.cos(a) * (r - w), cy + Math.sin(a) * (r - w));
    }
    ctx.closePath();
    ctx.fillStyle = col;
    ctx.fill();
  };
  lash(2.5, 'rgba(0,0,0,0.12)');
  lash(0, '#1A1620');
  ctx.restore();
}

function realClosedSleep(ctx, x, y) {
  ctx.save();
  // mezzaluna in giu affusolata: segue l'arco raggio 16 centrato (x, y-6)
  const lash = (dy, col) => {
    const N = 14, cx = x, cy = y - 6 + dy, r = 16;
    ctx.beginPath();
    for (let i = 0; i <= N; i++) {
      const t = i / N, a = Math.PI * t;
      const w = 3.2 * Math.sin(Math.PI * t);
      const rr = r + w;
      if (i === 0) ctx.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
      else ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
    }
    for (let i = N; i >= 0; i--) {
      const t = i / N, a = Math.PI * t;
      const w = 3.2 * Math.sin(Math.PI * t);
      ctx.lineTo(cx + Math.cos(a) * (r - w), cy + Math.sin(a) * (r - w));
    }
    ctx.closePath();
    ctx.fillStyle = col;
    ctx.fill();
  };
  lash(2.5, 'rgba(0,0,0,0.12)');
  lash(0, '#1A1620');
  ctx.restore();
}

function realHappyMouth(ctx, cx, my, w, d) {
  ctx.save();
  // stessa geometria del path originale
  const path = () => {
    ctx.beginPath();
    ctx.moveTo(cx - w, my);
    ctx.quadraticCurveTo(cx, my - 12, cx + w, my);
    ctx.quadraticCurveTo(cx + w * 0.85, my + d * 0.95, cx, my + d);
    ctx.quadraticCurveTo(cx - w * 0.85, my + d * 0.95, cx - w, my);
    ctx.closePath();
  };
  // interno con gradiente verticale di profondita'
  path();
  const g = ctx.createLinearGradient(0, my - 12, 0, my + d);
  g.addColorStop(0, '#5E1220');
  g.addColorStop(1, '#2E060E');
  ctx.fillStyle = g;
  ctx.fill();
  // elementi interni clippati
  ctx.save();
  path();
  ctx.clip();
  // ombra interna sotto il labbro superiore: lente tra due curve parallele
  ctx.fillStyle = 'rgba(10,1,5,0.35)';
  ctx.beginPath();
  ctx.moveTo(cx - w, my);
  ctx.quadraticCurveTo(cx, my - 12, cx + w, my);
  ctx.quadraticCurveTo(cx, my + 6, cx - w, my);
  ctx.closePath();
  ctx.fill();
  // lingua con gradiente
  const tg = ctx.createLinearGradient(0, my + d * 0.35, 0, my + d);
  tg.addColorStop(0, '#E0808E');
  tg.addColorStop(1, '#B84A5C');
  ctx.fillStyle = tg;
  ctx.beginPath();
  ctx.ellipse(cx, my + d * 0.82, w * 0.72, d * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();
  // highlight umido sulla lingua
  ctx.fillStyle = 'rgba(255,255,255,0.30)';
  ctx.beginPath();
  ctx.ellipse(cx - w * 0.18, my + d * 0.58, w * 0.28, d * 0.14, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // AO sottile attorno all'apertura
  path();
  ctx.strokeStyle = 'rgba(15,3,7,0.15)';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
}
Object.assign(globalThis, { realEye, realClosedHappy, realClosedSleep, realHappyMouth });
})();

/* ===== textures ===== */
(() => {
function furArc(ctx, cx, cy, r, a0, a1, len, cIn, cOut, seed, n) {
  // n ciuffi triangolari affusolati lungo l'arco, tutto deterministico dal seed
  const hs = i => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const px = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const A = px(cIn), B = px(cOut);
  const mix = t => 'rgb(' + Math.round(A[0] + (B[0] - A[0]) * t) + ',' + Math.round(A[1] + (B[1] - A[1]) * t) + ',' + Math.round(A[2] + (B[2] - A[2]) * t) + ')';
  const m = Math.max(0, Math.min(400, Math.floor(n))); // clamp: budget primitive
  ctx.save();
  for (let i = 0; i < m; i++) {
    const k = seed * 13.7 + i;
    const ang = a0 + (a1 - a0) * ((i + 0.5) / m) + (hs(k) - 0.5) * 0.1;
    const dir = ang + (hs(k + 57.3) - 0.5) * 0.3;      // jitter angolare +-0.15
    const L = len * (0.6 + 0.8 * hs(k + 91.7));         // lunghezza +-40%
    const bx = cx + Math.cos(ang) * r, by = cy + Math.sin(ang) * r;
    const nx = Math.cos(dir), ny = Math.sin(dir);       // verso l'esterno
    const tx = -ny, ty = nx;                            // perpendicolare per la base
    ctx.globalAlpha = 0.5 + 0.3 * hs(k + 33.1);
    ctx.fillStyle = mix(hs(k + 71.9));
    ctx.beginPath();
    ctx.moveTo(bx + tx * 1.25, by + ty * 1.25);
    ctx.lineTo(bx - tx * 1.25, by - ty * 1.25);
    ctx.lineTo(bx + nx * L, by + ny * L);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function furPatch(ctx, x, y, w, h, ang, cIn, cOut, seed, n) {
  // n trattini corti di pelo nel rettangolo centrato (x,y)
  const hs = i => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const px = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const A = px(cIn), B = px(cOut);
  const mix = t => 'rgb(' + Math.round(A[0] + (B[0] - A[0]) * t) + ',' + Math.round(A[1] + (B[1] - A[1]) * t) + ',' + Math.round(A[2] + (B[2] - A[2]) * t) + ')';
  const m = Math.max(0, Math.min(400, Math.floor(n))); // clamp: budget primitive
  ctx.save();
  ctx.lineCap = 'round';
  for (let i = 0; i < m; i++) {
    const k = seed * 17.3 + i;
    const sx = x + (hs(k) - 0.5) * w;
    const sy = y + (hs(k + 41.3) - 0.5) * h;
    const d = ang + (hs(k + 77.7) - 0.5) * 0.5;
    const L = 6 + 8 * hs(k + 19.1);
    ctx.globalAlpha = 0.25 + 0.25 * hs(k + 55.9);
    ctx.lineWidth = 1 + hs(k + 63.2);
    ctx.strokeStyle = mix(hs(k + 29.4));
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + Math.cos(d) * L, sy + Math.sin(d) * L);
    ctx.stroke();
  }
  ctx.restore();
}

function stipple(ctx, x, y, rx, ry, color, alpha, seed, n) {
  // n puntini distribuiti uniformemente nell'ellisse (campionamento polare)
  const hs = i => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const m = Math.max(0, Math.min(400, Math.floor(n))); // clamp: budget primitive
  ctx.save();
  ctx.fillStyle = color;
  for (let i = 0; i < m; i++) {
    const k = seed * 23.9 + i;
    const th = hs(k) * Math.PI * 2;
    const rad = Math.sqrt(hs(k + 47.1)); // sqrt per densita' uniforme
    const dx = x + Math.cos(th) * rx * rad;
    const dy = y + Math.sin(th) * ry * rad;
    ctx.globalAlpha = alpha * (0.3 + 0.7 * hs(k + 83.3));
    ctx.beginPath();
    ctx.arc(dx, dy, 0.6 + hs(k + 11.7), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function sheenBand(ctx, x, y, w, h, rot, alpha) {
  // banda di luce morbida ruotata per riflessi su vinile/tessuto
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  const g = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
  g.addColorStop(0, 'rgba(255,255,255,0)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.55)');
  g.addColorStop(0.5, 'rgba(255,255,255,1)');
  g.addColorStop(0.65, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.globalAlpha = alpha;
  ctx.fillStyle = g;
  ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.restore();
}

const MATERIALS = {
  kirby:       { kind: 'vinyl',  gloss: 0.55, furIn: null,      furOut: null },
  pikachu:     { kind: 'fur',    gloss: 0.25, furIn: '#e0a000', furOut: '#ffe259' },
  kabigon:     { kind: 'fur',    gloss: 0.15, furIn: '#23484d', furOut: '#4a7a78' },
  kuromi:      { kind: 'fabric', gloss: 0.15, furIn: null,      furOut: null },
  purin:       { kind: 'vinyl',  gloss: 0.5,  furIn: null,      furOut: null },
  eevee:       { kind: 'fur',    gloss: 0.15, furIn: '#7a4a22', furOut: '#c68a4d' },
  gengar:      { kind: 'vinyl',  gloss: 0.45, furIn: null,      furOut: null },
  metamon:     { kind: 'slime',  gloss: 0.8,  furIn: null,      furOut: null },
  mymelody:    { kind: 'fabric', gloss: 0.12, furIn: null,      furOut: null },
  cinnamoroll: { kind: 'fur',    gloss: 0.2,  furIn: '#dfe7f2', furOut: '#ffffff' },
  pompompurin: { kind: 'fur',    gloss: 0.2,  furIn: '#dfa93c', furOut: '#ffdf8e' },
  totoro:      { kind: 'fur',    gloss: 0.1,  furIn: '#4e555e', furOut: '#9aa1ab' },
  doraemon:    { kind: 'vinyl',  gloss: 0.7,  furIn: null,      furOut: null },
  slime:       { kind: 'slime',  gloss: 0.9,  furIn: null,      furOut: null }
};
Object.assign(globalThis, { furArc, furPatch, stipple, sheenBand, MATERIALS });
})();

/* ===== environment ===== */
(() => {
// Ombra di contatto a doppio strato: penombra larga + nucleo denso offset in basso
function realShadow(ctx, x, y, rx, ry, alpha) {
  // strato 1: penombra larga (cerchio scalato a ellisse per gradiente radiale corretto)
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(rx / 100, ry / 100);
  const g1 = ctx.createRadialGradient(0, 0, 0, 0, 0, 100);
  g1.addColorStop(0, 'rgba(30,26,60,' + (alpha * 0.55).toFixed(3) + ')');
  g1.addColorStop(0.62, 'rgba(30,26,60,' + (alpha * 0.30).toFixed(3) + ')');
  g1.addColorStop(1, 'rgba(30,26,60,0)');
  ctx.fillStyle = g1;
  ctx.beginPath();
  ctx.arc(0, 0, 100, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // strato 2: nucleo piu scuro, piu piccolo, leggermente sotto
  ctx.save();
  ctx.translate(x, y + ry * 0.14);
  ctx.scale((rx * 0.62) / 100, (ry * 0.55) / 100);
  const a2 = Math.min(1, alpha * 1.1);
  const g2 = ctx.createRadialGradient(0, 0, 0, 0, 0, 100);
  g2.addColorStop(0, 'rgba(22,18,48,' + a2.toFixed(3) + ')');
  g2.addColorStop(0.55, 'rgba(22,18,48,' + (a2 * 0.5).toFixed(3) + ')');
  g2.addColorStop(1, 'rgba(22,18,48,0)');
  ctx.fillStyle = g2;
  ctx.beginPath();
  ctx.arc(0, 0, 100, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Profondita di sfondo: alone ambiente dietro il soggetto + vignettatura agli angoli
function bgDepth(ctx) {
  ctx.save();
  // banda di luce soffusa dietro il soggetto
  const amb = ctx.createRadialGradient(250, 240, 0, 250, 240, 200);
  amb.addColorStop(0, 'rgba(255,252,244,0.07)');
  amb.addColorStop(0.7, 'rgba(255,252,244,0.032)');
  amb.addColorStop(1, 'rgba(255,252,244,0)');
  ctx.fillStyle = amb;
  ctx.fillRect(0, 0, 500, 500);
  // vignettatura morbida: trasparente al centro, ambra scura agli angoli
  const vg = ctx.createRadialGradient(250, 250, 150, 250, 250, 360);
  vg.addColorStop(0, 'rgba(20,16,40,0)');
  vg.addColorStop(0.65, 'rgba(20,16,40,0.045)');
  vg.addColorStop(1, 'rgba(20,16,40,0.10)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, 500, 500);
  ctx.restore();
}

// Rifiniture realistiche del cartello: venature legno, bisello, viti (nel transform locale)
function signRealPass(ctx) {
  const h = i => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const rr = (x0, y0, x1, y1, r) => {
    ctx.beginPath();
    ctx.moveTo(x0 + r, y0);
    ctx.lineTo(x1 - r, y0);
    ctx.quadraticCurveTo(x1, y0, x1, y0 + r);
    ctx.lineTo(x1, y1 - r);
    ctx.quadraticCurveTo(x1, y1, x1 - r, y1);
    ctx.lineTo(x0 + r, y1);
    ctx.quadraticCurveTo(x0, y1, x0, y1 - r);
    ctx.lineTo(x0, y0 + r);
    ctx.quadraticCurveTo(x0, y0, x0 + r, y0);
    ctx.closePath();
  };

  // tutto cio' che segue resta dentro il pannello interno
  ctx.save();
  rr(-112, -50, 112, 50, 10);
  ctx.clip();

  // venature: 15 linee orizzontali leggermente ondulate, deterministiche
  for (let i = 0; i < 15; i++) {
    const yb = -46 + (i + 0.5) * (92 / 15) + (h(i) - 0.5) * 3;
    const amp = 1 + h(i + 20) * 2;
    const ph = h(i + 40) * 6.283;
    ctx.strokeStyle = 'rgba(72,44,20,' + (0.06 + h(i + 60) * 0.06).toFixed(3) + ')';
    ctx.lineWidth = 0.7 + h(i + 80) * 0.9;
    ctx.beginPath();
    for (let x = -112; x <= 112; x += 8) {
      const y = yb + Math.sin(x * 0.045 + ph) * amp + Math.sin(x * 0.11 + ph * 2) * amp * 0.35;
      if (x === -112) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // nodi ellittici, tutti fuori dall'area del testo (|x|<95, |y|<38)
  const knots = [[-103, -12], [102, 26], [-40, 44]];
  for (let k = 0; k < knots.length; k++) {
    const kx = knots[k][0], ky = knots[k][1];
    const kr = 3 + h(k + 7) * 2;
    for (let j = 0; j < 3; j++) {
      ctx.strokeStyle = 'rgba(60,36,16,' + (0.12 - j * 0.03).toFixed(3) + ')';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.ellipse(kx, ky, kr + j * 2.4, (kr + j * 2.4) * 0.55, 0.2, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(60,36,16,0.10)';
    ctx.beginPath();
    ctx.ellipse(kx, ky, kr * 0.7, kr * 0.42, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // bisello: alto chiaro, basso scuro (sfumati, dentro il clip)
  const bt = ctx.createLinearGradient(0, -50, 0, -42);
  bt.addColorStop(0, 'rgba(255,250,240,0.18)');
  bt.addColorStop(1, 'rgba(255,250,240,0)');
  ctx.fillStyle = bt;
  ctx.fillRect(-112, -50, 224, 8);
  const bb = ctx.createLinearGradient(0, 42, 0, 50);
  bb.addColorStop(0, 'rgba(40,22,8,0)');
  bb.addColorStop(1, 'rgba(40,22,8,0.22)');
  ctx.fillStyle = bb;
  ctx.fillRect(-112, 42, 224, 8);
  ctx.restore();

  // 4 viti metalliche agli angoli del pannello (fuori dall'area testo)
  ctx.save();
  const sp = [[-104, -44], [104, -44], [-104, 44], [104, 44]];
  for (let s = 0; s < 4; s++) {
    const sx = sp[s][0], sy = sp[s][1];
    const mg = ctx.createRadialGradient(sx - 1.2, sy - 1.4, 0.5, sx, sy, 4);
    mg.addColorStop(0, '#e8eaee');
    mg.addColorStop(0.55, '#9aa0ab');
    mg.addColorStop(1, '#565d68');
    ctx.fillStyle = mg;
    ctx.beginPath();
    ctx.arc(sx, sy, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(30,30,40,0.35)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    // taglio a croce con rotazione deterministica diversa per vite
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(h(s + 3) * Math.PI);
    ctx.strokeStyle = 'rgba(35,35,45,0.7)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-2.4, 0); ctx.lineTo(2.4, 0);
    ctx.moveTo(0, -2.4); ctx.lineTo(0, 2.4);
    ctx.stroke();
    ctx.restore();
    // micro highlight
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.beginPath();
    ctx.arc(sx - 1.4, sy - 1.6, 0.8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// Relight del personaggio gia' disegnato su canvas trasparente (solo sui pixel opachi)
function charRelight(ctx) {
  ctx.save();
  ctx.globalCompositeOperation = 'source-atop';
  // (a) luce chiave morbida da alto-sinistra
  const key = ctx.createRadialGradient(180, 130, 0, 180, 130, 430);
  key.addColorStop(0, 'rgba(255,255,255,0.10)');
  key.addColorStop(0.5, 'rgba(255,255,255,0.045)');
  key.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = key;
  ctx.fillRect(0, 0, 500, 500);
  // (b) occlusione ambientale dal basso
  const occ = ctx.createLinearGradient(0, 200, 0, 500);
  occ.addColorStop(0, 'rgba(25,15,45,0)');
  occ.addColorStop(1, 'rgba(25,15,45,0.13)');
  ctx.fillStyle = occ;
  ctx.fillRect(0, 200, 500, 300);
  // (c) controluce fredda dal basso-destra
  const rim = ctx.createRadialGradient(420, 430, 0, 420, 430, 260);
  rim.addColorStop(0, 'rgba(90,110,200,0.07)');
  rim.addColorStop(0.6, 'rgba(90,110,200,0.035)');
  rim.addColorStop(1, 'rgba(90,110,200,0)');
  ctx.fillStyle = rim;
  ctx.fillRect(0, 0, 500, 500);
  ctx.globalCompositeOperation = 'source-over';
  ctx.restore();
}
Object.assign(globalThis, { realShadow, bgDepth, signRealPass, charRelight });
})();

/* ===== char-details ===== */
(() => {
const REAL_DETAIL = (() => {
  // hash deterministico 0..1
  const h = i => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const LIT = '255,250,240'; // luce calda da studio
  const SHD = '38,24,60';    // ombra fredda
  // macchia radiale morbida (luce o ombra), rgb = "r,g,b"
  const blob = (ctx, x, y, rx, ry, rot, rgb, a) => {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(rot); ctx.scale(rx, ry);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    g.addColorStop(0, 'rgba(' + rgb + ',' + a + ')');
    g.addColorStop(1, 'rgba(' + rgb + ',0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(0, 0, 1, 0, TAU); ctx.fill();
    ctx.restore();
  };
  // mezzaluna sul bordo di un cerchio (terminatore luce/ombra)
  const cres = (ctx, cx, cy, r, dx, dy, rgb, a) => {
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.clip();
    ctx.fillStyle = 'rgba(' + rgb + ',' + a + ')';
    ctx.beginPath();
    ctx.rect(cx - r - 9, cy - r - 9, r * 2 + 18, r * 2 + 18);
    ctx.arc(cx + dx, cy + dy, r, 0, TAU, true);
    ctx.fill('evenodd');
    ctx.restore();
  };
  // mezzaluna su ellisse (dx,dy in spazio 100)
  const cresE = (ctx, cx, cy, rx, ry, dx, dy, rgb, a) => {
    ctx.save();
    ctx.translate(cx, cy); ctx.scale(rx / 100, ry / 100);
    cres(ctx, 0, 0, 100, dx, dy, rgb, a);
    ctx.restore();
  };
  // arco di piega / cucitura (dash opzionale)
  const seam = (ctx, cx, cy, rx, ry, a0, a1, col, a, w, dash) => {
    ctx.save();
    ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round';
    if (dash) ctx.setLineDash(dash);
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, a0, a1); ctx.stroke();
    ctx.restore();
  };

  return {
    kirby(ctx, C) {
      cres(ctx, 0, 0, 150, -12, -17, SHD, 0.14);       // terminatore basso-dx
      cres(ctx, 0, 0, 150, 9, 13, LIT, 0.16);          // bordo luce alto-sx
      blob(ctx, -64, -96, 52, 34, -0.6, LIT, 0.28);    // gloss vinile principale
      blob(ctx, -28, -130, 20, 11, -0.5, LIT, 0.24);   // riflesso secondario
      blob(ctx, -92, 96, 38, 24, 0.9, C.cheek, 0.10);  // rimbalzo caldo dal basso
      stipple(ctx, 0, 122, 82, 22, '#ffffff', 0.05, 7, 46); // micrograna
    },

    pikachu(ctx, C) {
      furArc(ctx, 0, -30, 120, 3.55, 4.35, 11, C.body1, C.body2, 3, 18);   // pelo cranio sx
      furArc(ctx, 0, -30, 120, -1.15, -0.35, 11, C.body1, C.body2, 5, 18); // pelo cranio dx
      furPatch(ctx, -58, -136, 24, 16, -2.0, C.body1, C.body2, 7, 8);      // base orecchio sx
      furPatch(ctx, 58, -136, 24, 16, -1.1, C.body1, C.body2, 9, 8);       // base orecchio dx
      furPatch(ctx, -100, 62, 28, 42, 1.75, C.body1, C.body2, 11, 10);     // fianco sx
      furPatch(ctx, 102, 66, 28, 42, 1.4, C.body1, C.body2, 13, 10);       // fianco dx
      blob(ctx, 64, 86, 58, 46, 0.65, SHD, 0.13);      // ombra di forma
      blob(ctx, -70, -94, 44, 32, -0.6, LIT, 0.15);    // luce chiave sulla spalla
      stipple(ctx, 148, -78, 34, 60, C.body2, 0.07, 17, 24); // grana coda
      blob(ctx, 126, -120, 28, 14, -0.45, LIT, 0.14);  // luce sulla coda
    },

    kabigon(ctx, C) {
      cresE(ctx, 0, 58, 104, 84, 9, 12, LIT, 0.12);          // luce pancione alto-sx
      cresE(ctx, 0, 58, 104, 84, -10, -14, '90,60,30', 0.10); // ombra calda basso-dx
      stipple(ctx, 0, 96, 80, 40, '#7a5c36', 0.05, 5, 40);   // grana pancia crema
      seam(ctx, 0, 58, 100, 80, Math.PI * 1.06, Math.PI * 1.94, C.body2, 0.12, 6, null); // occlusione bordo pancia
      furArc(ctx, 0, -25, 120, 3.3, 4.15, 10, C.body1, C.body2, 3, 14);   // pelo spalla sx
      furArc(ctx, 0, -25, 120, -0.95, -0.15, 10, C.body1, C.body2, 5, 14); // pelo spalla dx
      furPatch(ctx, -114, 16, 26, 40, 1.85, C.body1, C.body2, 7, 10);     // braccio sx
      furPatch(ctx, 114, 16, 26, 40, 1.3, C.body1, C.body2, 9, 10);       // braccio dx
      blob(ctx, 0, -18, 46, 11, 0, SHD, 0.12);               // occlusione sotto il muso
    },

    kuromi(ctx, C) {
      seam(ctx, 0, -34, 100, 100, 2.55, 3.45, '#000000', 0.12, 5, null);  // piega cappuccio sx
      seam(ctx, 0, -34, 106, 106, -0.5, 0.45, '#000000', 0.12, 5, null);  // piega cappuccio dx
      seam(ctx, 0, -34, 103, 103, -2.2, -1.3, '#ffffff', 0.08, 4, null);  // controluce piega alta
      sheenBand(ctx, -56, -104, 66, 24, -0.55, 0.10);        // sheen tessuto
      seam(ctx, 0, -36, 85, 95, 0, TAU, '#ffffff', 0.15, 2, [5, 7]);      // cucitura bordo viso
      sheenBand(ctx, -26, 92, 56, 20, -0.5, 0.08);           // sheen corpetto
      blob(ctx, 40, 124, 48, 26, 0.5, SHD, 0.13);            // ombra corpetto
    },

    purin(ctx, C) {
      cres(ctx, 0, 0, 150, -12, -17, SHD, 0.13);       // terminatore basso-dx
      cres(ctx, 0, 0, 150, 9, 13, LIT, 0.15);          // bordo luce alto-sx
      blob(ctx, -60, -100, 48, 32, -0.55, LIT, 0.26);  // gloss vinile
      blob(ctx, -6, -142, 22, 9, -0.15, LIT, 0.22);    // luce sul ricciolo
      blob(ctx, -90, 92, 36, 22, 0.9, C.cheek, 0.10);  // rimbalzo rosato
      stipple(ctx, 0, 120, 80, 22, '#ffffff', 0.05, 9, 42); // micrograna
    },

    eevee(ctx, C) {
      furArc(ctx, 0, -44, 100, 3.55, 4.3, 10, C.body1, C.body2, 3, 16);   // pelo testa sx
      furArc(ctx, 0, -44, 100, -1.2, -0.45, 10, C.body1, C.body2, 5, 16); // pelo testa dx
      furPatch(ctx, -54, 34, 34, 22, 2.5, '#fdf3dc', '#d9bd90', 7, 10);   // ciuffo criniera sx
      furPatch(ctx, 4, 44, 36, 22, 1.6, '#fdf3dc', '#d9bd90', 9, 10);     // ciuffo criniera centro
      furPatch(ctx, 58, 32, 34, 22, 0.7, '#fdf3dc', '#d9bd90', 11, 10);   // ciuffo criniera dx
      blob(ctx, 44, 98, 46, 30, 0.5, SHD, 0.13);       // ombra corpo
      blob(ctx, -72, -108, 32, 20, -0.5, LIT, 0.15);   // luce chiave cranio
      furPatch(ctx, 104, 44, 32, 40, -0.85, C.body1, C.body2, 13, 12);    // pelo coda
      blob(ctx, 96, 24, 20, 12, -0.4, LIT, 0.16);      // luce punta coda
      stipple(ctx, 0, 116, 64, 22, C.body2, 0.06, 15, 22); // grana corpo
    },

    gengar(ctx, C) {
      cres(ctx, 0, 0, 150, -13, -19, '8,4,18', 0.20);       // ombra profonda basso-dx
      cres(ctx, 0, 0, 150, 9, 13, '200,190,255', 0.12);     // luce fredda alto-sx
      blob(ctx, -66, -98, 44, 28, -0.6, '220,210,255', 0.16); // gloss tenue
      for (let i = 0; i < 5; i++) {                          // gradienti scuri alla base degli spuntoni
        const a = -2.5 + i * 0.47 + (h(i) - 0.5) * 0.12;
        blob(ctx, Math.cos(a) * 136, Math.sin(a) * 136, 16 + h(i + 9) * 6, 10, a + Math.PI / 2, '8,4,18', 0.16);
      }
      blob(ctx, -90, 98, 34, 20, 0.9, '120,60,160', 0.10);  // rimbalzo violaceo
      stipple(ctx, 0, 122, 80, 20, '#ffffff', 0.04, 11, 36); // micrograna
    },

    metamon(ctx, C) {
      sheenBand(ctx, -88, -74, 74, 26, -0.6, 0.12);    // sheen gelatinoso
      blob(ctx, -60, -106, 44, 26, -0.55, LIT, 0.24);  // gloss principale
      blob(ctx, 74, 90, 52, 36, 0.6, SHD, 0.13);       // ombra di forma
      blob(ctx, -86, 98, 34, 20, 0.85, LIT, 0.10);     // rimbalzo dal basso
      blob(ctx, 100, -60, 22, 40, 0.25, LIT, 0.12);    // riflesso sul bordo dx
      stipple(ctx, 0, 120, 84, 22, '#ffffff', 0.05, 9, 40); // micrograna
    },

    mymelody(ctx, C) {
      seam(ctx, 0, -34, 101, 101, 2.5, 3.4, C.body2, 0.12, 5, null);      // piega cappuccio sx
      seam(ctx, 0, -34, 107, 107, -0.55, 0.4, C.body2, 0.12, 5, null);    // piega cappuccio dx
      seam(ctx, 0, -34, 103, 103, -2.15, -1.25, '#ffffff', 0.10, 4, null); // controluce piega alta
      sheenBand(ctx, -54, -106, 64, 22, -0.55, 0.10);  // sheen tessuto
      seam(ctx, 0, -36, 85, 95, 0, TAU, '#ffffff', 0.15, 2, [4, 8]);      // cucitura bordo viso
      sheenBand(ctx, -24, 94, 54, 18, -0.5, 0.08);     // sheen corpetto
      blob(ctx, 42, 122, 46, 24, 0.5, SHD, 0.11);      // ombra corpetto
      blob(ctx, -66, -118, 30, 16, -0.5, LIT, 0.14);   // luce chiave sul cappuccio
    },

    cinnamoroll(ctx, C) {
      furArc(ctx, 0, -30, 102, 3.5, 4.05, 9, '#ffffff', '#dfe6f0', 3, 14);   // pelo testa sx
      furArc(ctx, 0, -30, 102, -1.05, -0.35, 9, '#ffffff', '#dfe6f0', 5, 14); // pelo testa dx
      furPatch(ctx, -134, -84, 28, 44, -1.95, '#ffffff', '#dfe6f0', 7, 12);  // orecchio sx
      furPatch(ctx, 134, -84, 28, 44, -1.2, '#ffffff', '#dfe6f0', 9, 12);    // orecchio dx
      blob(ctx, 80, 2, 38, 26, 0.45, '96,110,150', 0.10);   // ombra fredda lato dx
      blob(ctx, -84, -100, 36, 22, -0.5, LIT, 0.14);        // luce chiave
      blob(ctx, -34, 96, 40, 22, -0.4, LIT, 0.10);          // luce sul corpo
      blob(ctx, 44, 124, 42, 22, 0.5, '96,110,150', 0.10);  // ombra sul corpo
      stipple(ctx, 0, -120, 60, 9, '#dfe6f0', 0.07, 11, 16); // grana cranio alto
    },

    pompompurin(ctx, C) {
      seam(ctx, 0, -112, 40, 16, Math.PI * 1.1, Math.PI * 1.9, '#7a5230', 0.14, 4, null);  // piega basco
      seam(ctx, -6, -104, 30, 12, Math.PI * 1.15, Math.PI * 1.85, '#7a5230', 0.12, 3, null); // seconda piega
      sheenBand(ctx, -18, -126, 46, 14, -0.35, 0.12);   // sheen basco
      seam(ctx, 0, -102, 46, 14, Math.PI * 0.05, Math.PI * 0.95, '#5d3d1e', 0.15, 2, [4, 6]); // cucitura orlo basco
      blob(ctx, 0, -100, 20, 8, 0, SHD, 0.12);          // ombra del basco sulla fronte
      blob(ctx, 78, -4, 40, 28, 0.45, SHD, 0.10);       // ombra lato dx testa
      blob(ctx, -86, -96, 34, 20, -0.5, LIT, 0.13);     // luce chiave
      sheenBand(ctx, -30, 96, 52, 18, -0.5, 0.08);      // sheen corpo
      stipple(ctx, 0, 128, 60, 20, C.body2, 0.06, 9, 20); // grana corpo
    },

    totoro(ctx, C) {
      cresE(ctx, 0, 60, 90, 80, 8, 11, LIT, 0.10);           // luce pancia alto-sx
      cresE(ctx, 0, 60, 90, 80, -9, -13, '96,74,46', 0.10);  // ombra calda basso-dx
      stipple(ctx, 0, 112, 56, 22, '#8a7350', 0.07, 5, 26);  // grana pancia
      furArc(ctx, 0, -10, 126, 3.25, 3.8, 12, C.body1, C.body2, 3, 16);  // pelo spalla sx
      furArc(ctx, 0, -10, 126, -0.75, -0.2, 12, C.body1, C.body2, 5, 16); // pelo spalla dx
      furPatch(ctx, -118, 58, 30, 50, 1.8, C.body1, C.body2, 7, 12);     // fianco sx
      furPatch(ctx, 118, 58, 30, 50, 1.35, C.body1, C.body2, 9, 12);     // fianco dx
      furPatch(ctx, 0, -138, 34, 18, -1.57, C.body1, C.body2, 11, 8);    // ciuffo in punta
      blob(ctx, -88, -66, 38, 44, -0.4, LIT, 0.10);          // luce chiave lato sx
      blob(ctx, 100, 20, 34, 60, 0.15, SHD, 0.10);           // ombra fianco dx
    },

    doraemon(ctx, C) {
      cres(ctx, 0, -42, 110, 8, 12, LIT, 0.14);        // luce bordo cranio alto-sx
      cres(ctx, 0, -42, 110, -8, -12, SHD, 0.11);      // ombra cranio basso-dx
      blob(ctx, -66, -122, 30, 13, -0.55, LIT, 0.30);  // gloss vinile sul blu
      cres(ctx, 0, 84, 54, 5, 7, LIT, 0.10);           // luce pancia bianca
      blob(ctx, 0, 68, 40, 6, 0, SHD, 0.12);           // ombra del collare sulla pancia
      ctx.save();                                       // campanella metallica
      ctx.globalAlpha = 0.25; ctx.strokeStyle = '#6b4a08'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(0, 76, 11, 0.35, 2.8); ctx.stroke();      // curva d'ombra inferiore
      ctx.globalAlpha = 0.35; ctx.fillStyle = '#fffbe8';
      ctx.beginPath(); ctx.ellipse(-4.5, 71.5, 3.5, 2.5, -0.5, 0, TAU); ctx.fill(); // highlight
      ctx.restore();
      blob(ctx, 0, 92, 13, 4, 0, '60,38,10', 0.20);    // ombra di contatto campanella
      stipple(ctx, 74, -104, 22, 16, '#ffffff', 0.05, 13, 14); // micrograna blu
      cresE(ctx, 0, 92, 86, 58, -9, -7, SHD, 0.10);    // ombra corpo basso-dx
    },

    slime(ctx, C) {
      blob(ctx, -58, -104, 34, 52, -0.22, LIT, 0.30);  // highlight gelatinoso principale
      blob(ctx, 2, -140, 12, 20, 0.12, LIT, 0.26);     // riflesso vicino alla punta
      blob(ctx, 0, 108, 66, 28, 0, '205,235,255', 0.20); // glow interno alla base
      stipple(ctx, -42, 112, 38, 18, '#eaffff', 0.14, 3, 12); // bolle interne sx
      stipple(ctx, 46, 118, 32, 14, '#eaffff', 0.12, 5, 9);   // bolle interne dx
      blob(ctx, 66, 96, 48, 32, 0.5, SHD, 0.13);       // ombra di forma basso-dx
      ctx.save();                                       // densita' al contatto col suolo
      ctx.globalAlpha = 0.14; ctx.fillStyle = 'rgb(20,40,90)';
      ctx.beginPath(); ctx.ellipse(0, 142, 78, 9, 0, 0, TAU); ctx.fill();
      ctx.restore();
    }
  };
})();
Object.assign(globalThis, { REAL_DETAIL });
})();

