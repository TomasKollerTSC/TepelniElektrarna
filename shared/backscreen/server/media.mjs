// Upload checks: extension allowlist, magic bytes, content hash, safe names. Images only; no SVG.

import { promises as fs } from 'node:fs';
import { createReadStream } from 'node:fs';
import crypto from 'node:crypto';

export const IMAGE_MAX = 20 * 1024 * 1024;

// Magic bytes must match the extension.
const SIGS = {
  jpg: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  jpeg: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  png: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  webp: (b) => b.slice(0, 4).toString('ascii') === 'RIFF' && b.slice(8, 12).toString('ascii') === 'WEBP',
};

export const ALLOWED_EXT = Object.keys(SIGS);

export const extOf = (name) => {
  const m = /\.([A-Za-z0-9]+)$/.exec(name || '');
  return m ? m[1].toLowerCase() : '';
};

export async function sniffOk(file, ext) {
  const fd = await fs.open(file, 'r');
  try {
    const buf = Buffer.alloc(16);
    await fd.read(buf, 0, 16, 0);
    return typeof SIGS[ext] === 'function' ? SIGS[ext](buf) : false;
  } finally {
    await fd.close();
  }
}

export function hashFile(file) {
  return new Promise((resolve, reject) => {
    const h = crypto.createHash('sha256');
    createReadStream(file)
      .on('data', (d) => h.update(d))
      .on('end', () => resolve(h.digest('hex')))
      .on('error', reject);
  });
}

export function sanitizeBase(name) {
  const base = (name || 'file').replace(/\.[^.]*$/, '');
  const s = base
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return s || 'file';
}
