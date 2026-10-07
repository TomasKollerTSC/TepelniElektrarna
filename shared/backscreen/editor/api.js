async function call(method, url, body) {
  const res = await fetch(url, {
    method,
    credentials: 'same-origin',
    headers: body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : undefined,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const e = new Error(data.error || `HTTP ${res.status}`);
    e.status = res.status;
    throw e;
  }
  return data;
}

export const api = {
  session: () => call('GET', '/api/session'),
  login: (password) => call('POST', '/api/login', { password }),
  logout: () => call('POST', '/api/logout', {}),
  load: () => call('GET', '/api/content'),
  save: (content) => call('PUT', '/api/content', { content }),
  publish: () => call('POST', '/api/publish', {}),
  restore: (file) => call('POST', '/api/restore-backup', { file }),
  upload: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return call('POST', '/api/media', fd);
  },
};
