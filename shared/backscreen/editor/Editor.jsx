import { useEffect, useState } from 'react';
import { api } from './api.js';
import EditorForm from './EditorForm.jsx';
import './editor.css';

function Login({ onDone }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.login(password);
      onDone();
    } catch (err) {
      setError(err.status === 429 ? 'Příliš mnoho pokusů, zkuste to za chvíli.' : 'Nesprávné heslo.');
    }
  };
  return (
    <form className="be-login" onSubmit={submit}>
      <h1>Editor obsahu</h1>
      <input type="password" autoFocus placeholder="Heslo" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Přihlásit</button>
      {error && <p className="be-error">{error}</p>}
    </form>
  );
}

export default function Editor({ title }) {
  const [state, setState] = useState('checking');
  useEffect(() => {
    api.session().then((s) => setState(s.auth ? 'in' : 'out')).catch(() => setState('out'));
  }, []);
  useEffect(() => { document.title = `Editor – ${title}`; }, [title]);
  if (state === 'checking') return null;
  return (
    <div className="be-root">
      {state === 'in'
        ? <EditorForm title={title} onLogout={() => api.logout().finally(() => setState('out'))} />
        : <Login onDone={() => setState('in')} />}
    </div>
  );
}
