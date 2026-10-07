import { useState, useEffect, useRef, useCallback } from 'react';
import { SLEEP_TIMEOUT_MS } from './config';
import { tap } from './tap';
import MiddlePart from './components/MiddlePart';
import BottomPart from './components/BottomPart';
import defaults from '../public/content.default.json';
import { useContent, mediaUrl, isPreview } from '../../shared/backscreen/useContent';
import { photoFor } from '../../shared/backscreen/schema';

export default function App() {
  const content = useContent(defaults);
  // The editor's preview opens straight into the content, not the sleep screen.
  const [screen, setScreen] = useState(isPreview ? 'active' : 'sleep');
  const [language, setLanguage] = useState('cz');
  const [activeId, setActiveId] = useState(null);
  const timer = useRef(null);
  // A card deleted in the editor while it is open falls back to the home view.
  const card = content.cards.find((c) => c.id === activeId) || null;

  useEffect(() => {
    for (const p of [content.home.photo, ...content.cards.map((c) => c.photo)]) {
      const src = photoFor(p, language);
      if (src) new Image().src = mediaUrl(src);
    }
  }, [content, language]);

  const resetTimer = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setScreen('sleep'), SLEEP_TIMEOUT_MS);
  }, []);

  useEffect(() => {
    if (screen !== 'sleep') resetTimer();
    return () => clearTimeout(timer.current);
  }, [screen, resetTimer]);

  const wake = useCallback(() => {
    setScreen('active');
    setActiveId(null);
    resetTimer();
  }, [resetTimer]);

  const switchLang = useCallback((l) => (e) => {
    e.stopPropagation();
    setLanguage(l);
  }, []);

  const switchTab = useCallback((id) => (e) => {
    e.stopPropagation();
    setActiveId(id);
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); wake(); return; }
      if (screen !== 'active') return;
      const idx = parseInt(e.key) - 1;
      if (idx >= 0 && idx < content.cards.length) { setActiveId(content.cards[idx].id); resetTimer(); }
      if (e.key === 'l' || e.key === 'L') { setLanguage(l => l === 'cz' ? 'en' : l === 'en' ? 'de' : 'cz'); }
      if (e.key === 'Escape') setScreen('sleep');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [screen, wake, resetTimer, content]);

  if (screen === 'sleep') {
    return (
      <div className="screen sleep" {...tap(wake)}>
        <div className="touch-hint"><img src="./g/touch-hint.png" alt="Touch hint" /></div>
      </div>
    );
  }

  const view = card || content.home;
  return (
    <div className="screen active" {...tap(resetTimer)}>
      <MiddlePart
        language={language}
        switchLang={switchLang}
        headline={card ? card.label[language] : content.home.title[language]}
        intro={card ? card.intro[language] : content.home.text[language]}
        body={card ? card.body[language] : ''}
        photo={mediaUrl(photoFor(view.photo, language))}
        photoSource={view.photoSource[language]}
        goHome={card ? switchTab(null) : null}
      />
      <BottomPart cards={content.cards} language={language} switchTab={switchTab} />
    </div>
  );
}
