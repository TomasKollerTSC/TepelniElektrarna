// Back-screen content editor: /edit for staff, /data + /media for the screen (which runs from the
// display runtime on 127.0.0.1:8080 and reads these cross-origin), and the screen app itself for preview.

import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import multer from 'multer';
import crypto from 'node:crypto';
import { promises as fs, existsSync } from 'node:fs';
import path from 'node:path';
import { createAuth } from './auth.mjs';
import { ALLOWED_EXT, IMAGE_MAX, extOf, sniffOk, hashFile, sanitizeBase } from './media.mjs';
import { createStore } from './store.mjs';

const ROOT = path.resolve(process.env.BACKSCREEN_ROOT || path.join(import.meta.dirname, '..', '..'));
const DIST = path.join(ROOT, 'dist');
const DATA = path.join(ROOT, 'data');
const PORT = Number(process.env.PORT || 8081);
const SCREEN_NAME = process.env.SCREEN_NAME || 'Zadní obrazovka';
const COOKIE = 'backscreen_edit_session';

const password = process.env.KIOSK_EDIT_PASSWORD || '';
if (password.length < 8) {
  console.error('FATAL: KIOSK_EDIT_PASSWORD missing or shorter than 8 characters.');
  process.exit(1);
}

const store = createStore({ dataDir: DATA, seedFile: path.join(DIST, 'content.default.json') });
await store.seedIfMissing();

const secretFile = path.join(DATA, '.session-secret');
if (!existsSync(secretFile)) await fs.writeFile(secretFile, crypto.randomBytes(32).toString('hex'), { mode: 0o600 });
const auth = createAuth({ password, secret: (await fs.readFile(secretFile, 'utf8')).trim(), ttlMs: 60 * 60 * 1000 });

const UPLOAD_TMP = path.join(DATA, '.uploads-tmp');
await fs.mkdir(UPLOAD_TMP, { recursive: true });
const upload = multer({
  storage: multer.diskStorage({ destination: UPLOAD_TMP, filename: (_r, _f, cb) => cb(null, crypto.randomUUID()) }),
  limits: { fileSize: IMAGE_MAX, files: 1 },
  fileFilter: (_r, file, cb) => cb(null, ALLOWED_EXT.includes(extOf(file.originalname))),
});

const app = express();
app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      // Plain HTTP on the exhibit LAN: forcing https would blank the page.
      upgradeInsecureRequests: null,
    },
  },
  // The screen on :8080 loads /data and /media from here.
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));

const jsonOnly = (req, res, next) => (req.is('application/json') ? next() : res.status(415).json({ error: 'json required' }));
function requireAuth(req, res, next) {
  const nonce = auth.verify(req.cookies[COOKIE]);
  if (!nonce) return res.status(401).json({ error: 'unauthorized' });
  auth.renew(nonce);
  next();
}
const wrap = (fn) => (req, res, next) => fn(req, res).catch(next);

const failures = new Map();
app.post('/api/login', jsonOnly, wrap(async (req, res) => {
  const now = Date.now();
  const rec = failures.get(req.ip) || { count: 0, lockUntil: 0 };
  if (rec.lockUntil > now) return res.status(429).json({ error: 'locked' });
  await new Promise((r) => setTimeout(r, 400));
  if (!auth.checkPassword(req.body?.password)) {
    rec.count += 1;
    rec.lockUntil = rec.count >= 5 ? now + Math.min(60000, 1000 * 2 ** (rec.count - 5)) : 0;
    failures.set(req.ip, rec);
    return res.status(401).json({ error: 'invalid' });
  }
  failures.delete(req.ip);
  res.cookie(COOKIE, auth.issue(), { httpOnly: true, sameSite: 'strict', secure: false, path: '/' });
  res.json({ ok: true });
}));
app.post('/api/logout', (req, res) => {
  const nonce = auth.verify(req.cookies[COOKIE]);
  if (nonce) auth.revoke(nonce);
  res.clearCookie(COOKIE, { path: '/' });
  res.json({ ok: true });
});
app.get('/api/session', (req, res) => {
  const nonce = auth.verify(req.cookies[COOKIE]);
  if (!nonce) return res.status(401).json({ auth: false });
  auth.renew(nonce);
  res.json({ auth: true, screen: SCREEN_NAME });
});

app.get('/api/content', requireAuth, wrap(async (req, res) => {
  res.json({ content: await store.readDraft(), backups: await store.listBackups() });
}));
app.put('/api/content', requireAuth, jsonOnly, wrap(async (req, res) => {
  try {
    res.json({ ok: true, content: await store.writeDraft(req.body?.content) });
  } catch (e) {
    if (e.code === 'EVALIDATION') return res.status(400).json({ error: 'validation' });
    throw e;
  }
}));
app.post('/api/publish', requireAuth, jsonOnly, wrap(async (req, res) => {
  await store.publish();
  res.json({ ok: true });
}));
app.post('/api/restore-backup', requireAuth, jsonOnly, wrap(async (req, res) => {
  try {
    res.json({ ok: true, content: await store.restoreBackup(req.body?.file) });
  } catch (e) {
    if (e.code === 'ENOBACKUP' || e.code === 'EVALIDATION') return res.status(404).json({ error: 'backup' });
    throw e;
  }
}));

app.post('/api/media', requireAuth, (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) return res.status(err.code === 'LIMIT_FILE_SIZE' ? 413 : 400).json({ error: 'upload' });
    if (!req.file) return res.status(415).json({ error: 'unsupported type' });
    const tmp = req.file.path;
    const ext = extOf(req.file.originalname);
    try {
      if (!(await sniffOk(tmp, ext))) {
        await fs.unlink(tmp).catch(() => {});
        return res.status(415).json({ error: 'content does not match type' });
      }
      const name = `${sanitizeBase(req.file.originalname)}-${(await hashFile(tmp)).slice(0, 12)}.${ext}`;
      await fs.rename(tmp, path.join(store.MEDIA, name));
      res.json({ url: `/media/${name}` });
    } catch {
      await fs.unlink(tmp).catch(() => {});
      res.status(500).json({ error: 'save failed' });
    }
  });
});

app.get('/healthz', (req, res) => res.json({ ok: true }));
app.use('/api', (req, res) => res.status(404).json({ error: 'not found' }));

const publicJson = (file) => (req, res) => {
  res.set({ 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' });
  res.sendFile(file, (err) => { if (err && !res.headersSent) res.status(404).end(); });
};
app.get('/data/content.json', publicJson(store.PUBLISHED));
app.get('/data/content.draft.json', requireAuth, (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.sendFile(store.DRAFT, (err) => { if (err && !res.headersSent) res.status(404).end(); });
});
// Uploads get content-hashed names, so they never change under the same URL.
app.use('/media', express.static(store.MEDIA, { immutable: true, maxAge: '365d' }));
app.use(express.static(DIST, { index: false }));
app.get('*', (req, res) => {
  if (path.extname(req.path)) return res.status(404).end();
  res.sendFile(path.join(DIST, 'index.html'));
});

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'server error' });
});

app.listen(PORT, () => console.log(`[backscreen-editor] ${SCREEN_NAME} on :${PORT} (data ${DATA})`));
