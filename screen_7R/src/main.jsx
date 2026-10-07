import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import './bezel.css';

const Editor = lazy(() => import('../../shared/backscreen/editor/Editor.jsx'));
const editing = window.location.pathname.startsWith('/edit');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {editing ? <Suspense fallback={null}><Editor title="Tepelná elektrárna · 7R Turbína" /></Suspense> : <App />}
  </React.StrictMode>
);
