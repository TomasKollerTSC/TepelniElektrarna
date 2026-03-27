import { useState, useEffect, useRef, useCallback } from 'react';
import { TABS, LABELS, TITLES, TAB_PHOTOS, CONTENT } from './Texts';

const SLEEP_TIMEOUT = 180_000;

// Preload all tab images into browser cache on module load
Object.values(TAB_PHOTOS).forEach(src => { new Image().src = src; });

export default function App() {
  const [screen, setScreen] = useState('sleep');
  const [language, setLanguage] = useState('cz');
  const [activeTab, setActiveTab] = useState('who');
  const timer = useRef(null);

  const resetTimer = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setScreen('sleep'), SLEEP_TIMEOUT);
  }, []);

  useEffect(() => {
    if (screen !== 'sleep') resetTimer();
    return () => clearTimeout(timer.current);
  }, [screen, resetTimer]);

  const wake = useCallback(() => {
    setScreen('active');
    setActiveTab(TABS[0]);
    resetTimer();
  }, [resetTimer]);

  const goSleep = useCallback((e) => {
    e.stopPropagation();
    setScreen('sleep');
  }, []);

  const switchLang = useCallback((l) => (e) => {
    e.stopPropagation();
    setLanguage(l);
  }, []);

  const switchTab = useCallback((t) => (e) => {
    e.stopPropagation();
    setActiveTab(t);
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); wake(); return; }
      if (screen !== 'active') return;
      const idx = parseInt(e.key) - 1;
      if (idx >= 0 && idx < TABS.length) { setActiveTab(TABS[idx]); resetTimer(); }
      if (e.key === 'l' || e.key === 'L') { setLanguage(l => l === 'cz' ? 'en' : l === 'en' ? 'de' : 'cz'); }
      if (e.key === 'Escape') setScreen('sleep');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [screen, wake, resetTimer]);

  if (screen === 'sleep') {
    return (
      <div className="screen sleep" onClick={wake}>
        <div className="touch-hint">&#9995;</div>
      </div>
    );
  }

  const content = CONTENT[language][activeTab];
  const photo = TAB_PHOTOS[activeTab];

  return (
    <div className="screen active" onClick={resetTimer}>
      <div className="header">
        <div className="lang-bar">
          {['cz', 'en', 'de'].map(l => (
            <button key={l} className={`lang-btn ${language === l ? 'sel' : ''}`}
              onClick={switchLang(l)}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button className="home-btn" onClick={goSleep}>&#8962;</button>
      </div>

      <div className="photo-strip">
        <img src={photo} alt="" className="photo-img" />
        <div className="photo-title-overlay">
          <span className="screen-label">{TITLES[language]}</span>
          <h1 className="tab-title">{LABELS[language][activeTab]}</h1>
        </div>
      </div>

      <div className="content-area">
        <div className="col intro-col">
          <p className="intro-text">{content.intro}</p>
        </div>
        <div className="col body-col">
          <p className="body-text">{content.body}</p>
        </div>
      </div>

      <div className="tab-row">
        {TABS.map(t => (
          <button key={t} className={`tab-thumb ${t === activeTab ? 'active' : ''}`}
            onClick={switchTab(t)}>
            <img src={TAB_PHOTOS[t]} alt="" className="thumb-img" />
            <span className="thumb-label">{LABELS[language][t]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
