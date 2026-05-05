import { useState, useEffect, useRef, useCallback } from 'react';
import { TABS, LABELS, TAB_PHOTOS, PHOTO_SOURCES, CONTENT, tabPhoto } from './Texts';
import UpperPart from './components/UpperPart';
import MiddlePart from './components/MiddlePart';
import BottomPart from './components/BottomPart';

const SLEEP_TIMEOUT = 180_000;

// Preload all tab images into browser cache on module load
Object.values(TAB_PHOTOS).forEach(src => { new Image().src = src; });
['CZ', 'EN', 'DE'].forEach(l => { new Image().src = `/f/4R/kondenzator-${l}.png`; });

export default function App() {
  const [screen, setScreen] = useState('sleep');
  const [language, setLanguage] = useState('cz');
  const [activeTab, setActiveTab] = useState('what');
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
        <div className="touch-hint"><img src="./g/touch-hint.png" alt="Touch hint" /></div>
      </div>
    );
  }

  const content = CONTENT[language][activeTab];

  return (
    <div className="screen active" onClick={resetTimer}>
      <UpperPart photo={tabPhoto(activeTab, language)} source={PHOTO_SOURCES[activeTab]} />
      <MiddlePart
        language={language}
        switchLang={switchLang}
        headline={LABELS[language][activeTab]}
        intro={content.intro}
        body={content.body}
      />
      <BottomPart
        tabs={TABS}
        tabPhoto={tabPhoto}
        labels={LABELS}
        content={CONTENT}
        language={language}
        switchTab={switchTab}
      />
    </div>
  );
}
