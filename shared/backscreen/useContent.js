import { useEffect, useState } from 'react';
import { normalizeContent } from './schema.js';

export const EDITOR_PORT = 8081;
// The kiosk page comes from the display runtime (:8080); the editor server on :8081 owns the content.
export const EDITOR_ORIGIN = window.location.port === String(EDITOR_PORT) ? '' : `http://127.0.0.1:${EDITOR_PORT}`;
export const isPreview = new URLSearchParams(window.location.search).has('preview');

export const mediaUrl = (path) => (path && path.startsWith('/media/') ? EDITOR_ORIGIN + path : path || '');

const POLL_MS = 10000;

// Published content, refreshed in place; the bundled defaults stand in until (or unless) the editor answers.
export function useContent(defaults) {
  const [content, setContent] = useState(() => normalizeContent(defaults));
  useEffect(() => {
    let last = '';
    let stopped = false;
    const url = `${EDITOR_ORIGIN}/data/${isPreview ? 'content.draft.json' : 'content.json'}`;
    const load = async () => {
      try {
        const res = await fetch(url, { cache: 'no-store', credentials: isPreview ? 'include' : 'omit' });
        if (!res.ok) return;
        const text = await res.text();
        if (text === last || stopped) return;
        const next = normalizeContent(JSON.parse(text));
        if (next && next.cards.length) {
          last = text;
          setContent(next);
        }
      } catch {
        // editor server not up yet: keep showing what we have
      }
    };
    load();
    if (isPreview) return () => { stopped = true; };
    const id = setInterval(load, POLL_MS);
    return () => { stopped = true; clearInterval(id); };
  }, []);
  return content;
}
