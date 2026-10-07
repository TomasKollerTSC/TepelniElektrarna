// Back-screen content, shared by the screens, the editor and the editor server so all three
// accept exactly the same shape.

export const LANGS = ['cz', 'en', 'de'];
export const MAX_CARDS = 12;

const str = (v, max) => (typeof v === 'string' ? v.slice(0, max) : '');
export const localized = (v, max = 12000) => Object.fromEntries(LANGS.map((l) => [l, str(v?.[l], max)]));

// Bundled photos live under /f/ in the app build; uploads live under /media/ on the editor server.
const PHOTO_RE = /^\/(f|media)\/[^?#<>"\\]+$/;
const photoPath = (v) => (typeof v === 'string' && PHOTO_RE.test(v) && !v.includes('..') ? v : '');

// A photo is one path, or {cz, en, de} when the picture itself carries text in that language.
export function normalizePhoto(v) {
  if (v && typeof v === 'object') return Object.fromEntries(LANGS.map((l) => [l, photoPath(v[l])]));
  return photoPath(v);
}

export const photoFor = (photo, lang) =>
  photo && typeof photo === 'object' ? photo[lang] || photo.cz || '' : photo || '';

const ID_RE = /^[a-z0-9-]{1,40}$/;

export function normalizeContent(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const seen = new Set();
  const cards = (Array.isArray(raw.cards) ? raw.cards : []).slice(0, MAX_CARDS).map((c, i) => {
    let id = typeof c?.id === 'string' && ID_RE.test(c.id) ? c.id : `karta-${i + 1}`;
    while (seen.has(id)) id = `${id}-x`;
    seen.add(id);
    return {
      id,
      label: localized(c?.label, 200),
      intro: localized(c?.intro, 3000),
      body: localized(c?.body, 12000),
      photo: normalizePhoto(c?.photo),
      photoSource: localized(c?.photoSource, 300),
    };
  });
  const home = raw.home || {};
  return {
    schemaVersion: 1,
    home: {
      title: localized(home.title, 200),
      text: localized(home.text, 6000),
      photo: normalizePhoto(home.photo),
      photoSource: localized(home.photoSource, 300),
    },
    cards,
  };
}

export function mediaRefs(content) {
  const out = new Set();
  const add = (p) => {
    for (const v of p && typeof p === 'object' ? Object.values(p) : [p]) if (v?.startsWith('/media/')) out.add(v);
  };
  add(content?.home?.photo);
  for (const c of content?.cards || []) add(c.photo);
  return [...out];
}
