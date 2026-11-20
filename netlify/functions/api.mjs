// Admin API for the Barin menu, as a Netlify Function.
//   GET  /api/menu   -> current menu (public)
//   POST /api/login  -> { password } -> { token }
//   PUT  /api/menu   -> new prices (needs Authorization: Bearer <token>)
// Prices live in Netlify Blobs, so they survive deploys. Env: ADMIN_PASSWORD (required).
import crypto from 'node:crypto';
import { getStore } from '@netlify/blobs';
import seed from '../../src/menu.json';

export const config = { path: ['/api/menu', '/api/login'] };

const SESSION_MS = 12 * 60 * 60 * 1000;
const PRICE_RE = /^\d{1,3}\.\d{2} €$/;
const KEY = 'menu.json';

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

const sha = (s) => crypto.createHash('sha256').update(String(s)).digest();
const safeEqual = (a, b) => crypto.timingSafeEqual(sha(a), sha(b));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Stateless signed token (serverless: no in-memory sessions). Changing ADMIN_PASSWORD invalidates all tokens.
const secret = () => crypto.createHmac('sha256', 'barin-admin-token').update(process.env.ADMIN_PASSWORD).digest();
const sign = (exp) => crypto.createHmac('sha256', secret()).update(String(exp)).digest('hex');
const makeToken = () => {
  const exp = Date.now() + SESSION_MS;
  return `${exp}.${sign(exp)}`;
};
const tokenOk = (req) => {
  const m = (req.headers.get('authorization') || '').match(/^Bearer (\d+)\.([a-f0-9]{64})$/);
  if (!m || Number(m[1]) < Date.now()) return false;
  return safeEqual(m[2], sign(m[1]));
};

const store = () => getStore({ name: 'menu', consistency: 'strong' });
const readMenu = async () => (await store().get(KEY, { type: 'json' })) || seed;

// Admins may change prices/titles and add items. The categories and their sub-headers stay fixed.
function validateAndMerge(current, incoming) {
  if (!incoming || !Array.isArray(incoming.categories)) return 'Invalid payload';
  if (incoming.categories.length !== current.categories.length) return 'Categories mismatch';
  const subCount = (items) => items.filter((i) => i.type === 'subheader').length;
  const result = { categories: [] };
  for (let c = 0; c < current.categories.length; c++) {
    const cur = current.categories[c];
    const inc = incoming.categories[c];
    if (!inc || inc.id !== cur.id || !Array.isArray(inc.items) || inc.items.length > 300)
      return `Category "${cur.label}" mismatch`;
    if (subCount(inc.items) !== subCount(cur.items)) return `Sub-headers of "${cur.label}" changed`;
    if (typeof inc.title !== 'string' || !inc.title.trim() || inc.title.length > 100) return 'Invalid title';
    const items = [];
    for (const it of inc.items) {
      if (!it || typeof it !== 'object') return 'Invalid item';
      if (it.type === 'subheader') {
        if (typeof it.content !== 'string' || !it.content.trim() || it.content.length > 100) return 'Invalid sub-header';
        items.push({ type: 'subheader', content: it.content.trim() });
        continue;
      }
      if (it.type !== 'item') return 'Invalid item type';
      const { name, ingredients, price } = it;
      if (typeof name !== 'string' || name.length > 100) return 'Invalid name';
      if (typeof ingredients !== 'string' || ingredients.length > 300) return 'Invalid ingredients';
      if (!name.trim() && !ingredients.trim()) return 'Item needs a name';
      if (typeof price !== 'string' || (price !== '' && !PRICE_RE.test(price))) return `Invalid price for "${name}"`;
      items.push({ type: 'item', name, ingredients, price });
    }
    result.categories.push({ ...cur, title: inc.title.trim(), items });
  }
  return result;
}

// Best-effort throttle (per warm instance) + constant delay on every failure.
const failures = new Map();

export default async (req) => {
  try {
    const path = new URL(req.url).pathname;

    if (req.method === 'GET' && path === '/api/menu') return json(200, await readMenu());

    if (!process.env.ADMIN_PASSWORD) return json(500, { error: 'ADMIN_PASSWORD is not configured' });

    if (req.method === 'POST' && path === '/api/login') {
      const ip = req.headers.get('x-nf-client-connection-ip') || 'local';
      const f = failures.get(ip);
      if (f && f.until > Date.now()) return json(429, { error: 'Too many attempts, try later' });
      const body = await req.json().catch(() => ({}));
      if (typeof body.password === 'string' && safeEqual(body.password, process.env.ADMIN_PASSWORD)) {
        failures.delete(ip);
        return json(200, { token: makeToken() });
      }
      const count = (f ? f.count : 0) + 1;
      failures.set(ip, { count, until: count >= 5 ? Date.now() + 5 * 60 * 1000 : 0 });
      await sleep(800);
      return json(401, { error: 'Wrong password' });
    }

    if (req.method === 'PUT' && path === '/api/menu') {
      if (!tokenOk(req)) return json(401, { error: 'Unauthorized' });
      const current = await readMenu();
      const merged = validateAndMerge(current, await req.json().catch(() => null));
      if (typeof merged === 'string') return json(400, { error: merged });
      const s = store();
      await s.setJSON(`backup-${Date.now()}.json`, current); // keep the last 20 versions
      const { blobs } = await s.list({ prefix: 'backup-' });
      const old = blobs.map((b) => b.key).sort().slice(0, -20);
      await Promise.all(old.map((k) => s.delete(k)));
      await s.setJSON(KEY, merged);
      return json(200, merged);
    }

    return json(404, { error: 'Not found' });
  } catch (e) {
    console.error(e);
    return json(500, { error: 'Server error' });
  }
};
