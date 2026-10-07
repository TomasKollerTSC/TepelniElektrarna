import { useEffect, useState } from 'react';
import { MAX_CARDS, localized } from '../schema.js';
import { api } from './api.js';
import { LocalizedField, PhotoField } from './fields.jsx';

const BODY_HINT = 'Prázdný řádek začíná nový odstavec. Krátký první řádek odstavce bez tečky na konci se zobrazí jako mezititulek.';

const newCard = () => ({
  id: `karta-${Date.now().toString(36)}`,
  label: localized({}), intro: localized({}), body: localized({}), photo: '', photoSource: localized({}),
});

function CardEditor({ card, index, count, open, onToggle, onChange, onMove, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const set = (key) => (value) => onChange({ ...card, [key]: value });
  return (
    <section className={`be-card${open ? ' is-open' : ''}`}>
      <header className="be-card-head">
        <button type="button" className="be-card-title" onClick={onToggle}>
          {open ? '▾' : '▸'} {index + 1}. {card.label.cz || '(bez názvu)'}
        </button>
        <button type="button" className="be-button be-quiet" disabled={index === 0} onClick={() => onMove(-1)}>↑</button>
        <button type="button" className="be-button be-quiet" disabled={index === count - 1} onClick={() => onMove(1)}>↓</button>
        {confirming
          ? <>
            <button type="button" className="be-button be-danger" onClick={onDelete}>Opravdu smazat</button>
            <button type="button" className="be-button be-quiet" onClick={() => setConfirming(false)}>Zpět</button>
          </>
          : <button type="button" className="be-button be-quiet" disabled={count <= 1} onClick={() => setConfirming(true)}>Smazat</button>}
      </header>
      {open && (
        <div className="be-card-body">
          <LocalizedField label="Název karty" value={card.label} onChange={set('label')} />
          <LocalizedField label="Úvod (zobrazí se i na kartě)" value={card.intro} onChange={set('intro')} multiline rows={3} />
          <LocalizedField label="Text" value={card.body} onChange={set('body')} multiline rows={8} hint={BODY_HINT} />
          <PhotoField label="Fotka" value={card.photo} onChange={set('photo')} />
          <LocalizedField label="Popisek fotky" value={card.photoSource} onChange={set('photoSource')} />
        </div>
      )}
    </section>
  );
}

export default function EditorForm({ title, onLogout }) {
  const [content, setContent] = useState(null);
  const [backups, setBackups] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState('');
  const [open, setOpen] = useState(null);
  const [restoreFile, setRestoreFile] = useState('');

  const reload = async () => {
    const data = await api.load();
    setContent(data.content);
    setBackups(data.backups || []);
    setDirty(false);
  };
  useEffect(() => { reload().catch(() => setStatus('Obsah se nepodařilo načíst.')); }, []);
  useEffect(() => {
    const warn = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  if (!content) return <p className="be-status">{status || 'Načítám…'}</p>;

  const update = (next) => { setContent(next); setDirty(true); setStatus(''); };
  const setHome = (key) => (value) => update({ ...content, home: { ...content.home, [key]: value } });
  const setCards = (cards) => update({ ...content, cards });

  const run = async (label, fn) => {
    setStatus(`${label}…`);
    try {
      await fn();
    } catch (err) {
      setStatus(err.status === 401 ? 'Přihlášení vypršelo – přihlaste se znovu.' : `Chyba: ${err.message}`);
      return false;
    }
    return true;
  };
  const save = () => run('Ukládám', async () => {
    const res = await api.save(content);
    setContent(res.content);
    setDirty(false);
    setStatus('Koncept uložen. Na obrazovce se projeví až po zveřejnění.');
  });
  const preview = async () => { if (await save()) window.open('/?preview', '_blank'); };
  const publish = async () => {
    if (!(await save())) return;
    await run('Zveřejňuji', async () => {
      await api.publish();
      setStatus('Zveřejněno. Obrazovka se aktualizuje do 10 sekund.');
    });
  };
  const restore = () => restoreFile && run('Obnovuji', async () => {
    const res = await api.restore(restoreFile);
    setContent(res.content);
    setDirty(true);
    setStatus('Záloha načtena do konceptu. Zkontrolujte ji a zveřejněte.');
  });

  const cards = content.cards;
  const moveCard = (i, d) => {
    const next = [...cards];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    setCards(next);
    setOpen(next[i + d].id);
  };

  return (
    <div className="be-form">
      <header className="be-top">
        <h1>{title}</h1>
        <div className="be-actions">
          <button type="button" className="be-button" onClick={save} disabled={!dirty}>Uložit koncept</button>
          <button type="button" className="be-button" onClick={preview}>Náhled</button>
          <button type="button" className="be-button be-primary" onClick={publish}>Zveřejnit</button>
          <button type="button" className="be-button be-quiet" onClick={onLogout}>Odhlásit</button>
        </div>
        {status && <p className="be-status">{status}{dirty && !status.endsWith('…') ? ' (neuložené změny)' : ''}</p>}
        {!status && dirty && <p className="be-status">Neuložené změny</p>}
      </header>

      <h2>Úvodní obrazovka</h2>
      <LocalizedField label="Nadpis" value={content.home.title} onChange={setHome('title')} />
      <LocalizedField label="Text" value={content.home.text} onChange={setHome('text')} multiline rows={5} />
      <PhotoField label="Fotka" value={content.home.photo} onChange={setHome('photo')} />
      <LocalizedField label="Popisek fotky" value={content.home.photoSource} onChange={setHome('photoSource')} />

      <h2>Karty</h2>
      {cards.map((card, i) => (
        <CardEditor
          key={card.id}
          card={card}
          index={i}
          count={cards.length}
          open={open === card.id}
          onToggle={() => setOpen(open === card.id ? null : card.id)}
          onChange={(c) => setCards(cards.map((x) => (x.id === card.id ? c : x)))}
          onMove={(d) => moveCard(i, d)}
          onDelete={() => setCards(cards.filter((x) => x.id !== card.id))}
        />
      ))}
      <button
        type="button"
        className="be-button"
        disabled={cards.length >= MAX_CARDS}
        onClick={() => { const c = newCard(); setCards([...cards, c]); setOpen(c.id); }}
      >
        + Přidat kartu
      </button>

      {backups.length > 0 && (
        <>
          <h2>Zálohy</h2>
          <p className="be-hint">Každé zveřejnění uloží předchozí verzi. Obnovení ji načte do konceptu.</p>
          <div className="be-restore">
            <select value={restoreFile} onChange={(e) => setRestoreFile(e.target.value)}>
              <option value="">Vyberte zálohu…</option>
              {backups.map((b) => <option key={b} value={b}>{b.replace(/^content-|\.json$/g, '').replace(/T(\d\d)-(\d\d)-(\d\d).*/, ' $1:$2:$3')}</option>)}
            </select>
            <button type="button" className="be-button" disabled={!restoreFile} onClick={restore}>Obnovit do konceptu</button>
          </div>
        </>
      )}
    </div>
  );
}
