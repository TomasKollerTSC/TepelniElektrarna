// Editor session auth: password compared as SHA-256 digests; cookie = payload.HMAC with a server-side
// nonce, so logout revokes it. Sessions live in memory: a restart logs everyone out.

import crypto from 'node:crypto';

const sha256 = (s) => crypto.createHash('sha256').update(String(s), 'utf8').digest();

function safeEq(a, b) {
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const b64url = (buf) => Buffer.from(buf).toString('base64url');
const fromB64url = (s) => Buffer.from(s, 'base64url');

export function createAuth({ password, secret, ttlMs }) {
  const pwHash = sha256(password); // 32 bytes
  const sign = (payload) =>
    b64url(crypto.createHmac('sha256', secret).update(payload).digest());
  const nonces = new Map(); // nonce -> expiry ms

  function issue() {
    const nonce = crypto.randomUUID();
    const exp = Date.now() + ttlMs;
    nonces.set(nonce, exp);
    const payload = b64url(JSON.stringify({ n: nonce, e: exp }));
    return payload + '.' + sign(payload);
  }

  // Returns the nonce if the token is valid (signature + known, unexpired
  // nonce), else null.
  function verify(token) {
    if (typeof token !== 'string') return null;
    const i = token.lastIndexOf('.');
    if (i < 0) return null;
    const payload = token.slice(0, i);
    const sig = token.slice(i + 1);
    if (!safeEq(Buffer.from(sig), Buffer.from(sign(payload)))) return null;
    let data;
    try {
      data = JSON.parse(fromB64url(payload).toString('utf8'));
    } catch {
      return null;
    }
    const exp = nonces.get(data?.n);
    if (exp === undefined || exp < Date.now()) {
      if (data?.n) nonces.delete(data.n);
      return null;
    }
    return data.n;
  }

  const checkPassword = (submitted) =>
    typeof submitted === 'string' && safeEq(sha256(submitted), pwHash);
  const revoke = (nonce) => nonces.delete(nonce);
  const renew = (nonce) => { if (nonces.has(nonce)) nonces.set(nonce, Date.now() + ttlMs); };

  return { issue, verify, checkPassword, revoke, renew };
}
