import { useState } from 'react';
import { LANGS, photoFor } from '../schema.js';
import { mediaUrl } from '../useContent.js';
import { api } from './api.js';

const LANG_NAMES = { cz: 'CZ', en: 'EN', de: 'DE' };

export function LocalizedField({ label, value, onChange, multiline, rows = 4, hint }) {
  return (
    <fieldset className="be-field">
      <legend>{label}</legend>
      {hint && <p className="be-hint">{hint}</p>}
      {LANGS.map((l) => (
        <label key={l} className="be-lang-row">
          <span className="be-lang">{LANG_NAMES[l]}</span>
          {multiline
            ? <textarea rows={rows} value={value[l]} onChange={(e) => onChange({ ...value, [l]: e.target.value })} />
            : <input type="text" value={value[l]} onChange={(e) => onChange({ ...value, [l]: e.target.value })} />}
        </label>
      ))}
    </fieldset>
  );
}

function PhotoSlot({ path, onChange, caption }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      onChange((await api.upload(file)).url);
    } catch (err) {
      setError(err.status === 413 ? 'Soubor je příliš velký (max 20 MB).' : 'Nahrání se nepovedlo (JPG, PNG nebo WebP).');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="be-photo">
      {caption && <span className="be-lang">{caption}</span>}
      {path ? <img src={mediaUrl(path)} alt="" /> : <div className="be-photo-empty">bez fotky</div>}
      <div className="be-photo-actions">
        <label className="be-button">
          {busy ? 'Nahrávám…' : path ? 'Vyměnit' : 'Nahrát fotku'}
          <input type="file" accept="image/jpeg,image/png,image/webp" hidden disabled={busy} onChange={pick} />
        </label>
        {path && <button type="button" className="be-button be-quiet" onClick={() => onChange('')}>Odebrat</button>}
      </div>
      {error && <p className="be-error">{error}</p>}
    </div>
  );
}

export function PhotoField({ label, value, onChange }) {
  const perLang = value && typeof value === 'object';
  const toggle = () => onChange(perLang ? photoFor(value, 'cz') : Object.fromEntries(LANGS.map((l) => [l, value || ''])));
  return (
    <fieldset className="be-field">
      <legend>{label}</legend>
      <label className="be-check">
        <input type="checkbox" checked={perLang} onChange={toggle} /> Jiná fotka pro každý jazyk (fotka obsahuje text)
      </label>
      <div className="be-photos">
        {perLang
          ? LANGS.map((l) => (
            <PhotoSlot key={l} caption={LANG_NAMES[l]} path={value[l]} onChange={(p) => onChange({ ...value, [l]: p })} />
          ))
          : <PhotoSlot path={value} onChange={onChange} />}
      </div>
    </fieldset>
  );
}
