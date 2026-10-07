// data/content.json = published (what the screen shows), content.draft.json = editor draft,
// backups/ = the previous published versions, media/ = uploads. data/ is never touched by deploys.

import { promises as fs, existsSync } from 'node:fs';
import path from 'node:path';
import { normalizeContent } from '../schema.js';

export function createStore({ dataDir, seedFile }) {
  const PUBLISHED = path.join(dataDir, 'content.json');
  const DRAFT = path.join(dataDir, 'content.draft.json');
  const BACKUPS = path.join(dataDir, 'backups');
  const MEDIA = path.join(dataDir, 'media');
  const serialize = (obj) => JSON.stringify(obj, null, 2) + '\n';

  async function atomicWrite(file, text) {
    await fs.writeFile(`${file}.tmp`, text, 'utf8');
    await fs.rename(`${file}.tmp`, file);
  }

  const invalid = () => Object.assign(new Error('invalid content'), { code: 'EVALIDATION' });
  const parse = (text) => {
    const obj = normalizeContent(JSON.parse(text));
    if (!obj || obj.cards.length === 0) throw invalid();
    return obj;
  };

  async function seedIfMissing() {
    for (const d of [dataDir, BACKUPS, MEDIA]) await fs.mkdir(d, { recursive: true });
    if (!existsSync(PUBLISHED)) {
      const text = serialize(parse(await fs.readFile(seedFile, 'utf8')));
      await atomicWrite(PUBLISHED, text);
      console.log(`[seed] content from ${seedFile}`);
    }
    if (!existsSync(DRAFT)) await fs.copyFile(PUBLISHED, DRAFT);
  }

  return {
    PUBLISHED, DRAFT, MEDIA, seedIfMissing,
    readDraft: async () => parse(await fs.readFile(existsSync(DRAFT) ? DRAFT : PUBLISHED, 'utf8')),
    async writeDraft(raw) {
      const obj = normalizeContent(raw);
      if (!obj || obj.cards.length === 0) throw invalid();
      await atomicWrite(DRAFT, serialize(obj));
      return obj;
    },
    async publish(keep = 20) {
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      await fs.copyFile(PUBLISHED, path.join(BACKUPS, `content-${ts}.json`));
      const files = (await fs.readdir(BACKUPS)).filter((f) => f.endsWith('.json')).sort();
      while (files.length > keep) await fs.unlink(path.join(BACKUPS, files.shift()));
      await atomicWrite(PUBLISHED, await fs.readFile(DRAFT, 'utf8'));
    },
    listBackups: async () => (await fs.readdir(BACKUPS)).filter((f) => f.endsWith('.json')).sort().reverse(),
    async restoreBackup(file) {
      const name = path.basename(String(file || ''));
      if (name !== file || !/^content-[A-Za-z0-9-]+\.json$/.test(name) || !existsSync(path.join(BACKUPS, name))) {
        throw Object.assign(new Error('backup not found'), { code: 'ENOBACKUP' });
      }
      const obj = parse(await fs.readFile(path.join(BACKUPS, name), 'utf8'));
      await atomicWrite(DRAFT, serialize(obj));
      return obj;
    },
  };
}
