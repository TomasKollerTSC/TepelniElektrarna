import { useRef, useLayoutEffect } from 'react';
import { tap } from '../tap';
import './middlePart.css';

const LANGUAGES = ['cz', 'en', 'de'];
const FLAG_ALTS = { cz: 'Čeština', de: 'Deutsch', en: 'English' };

function parseBody(text) {
  return text.split('\n\n').map(section => {
    const lines = section.split('\n');
    const first = lines[0].trim();
    if (lines.length > 1 && first.length < 60 && !first.endsWith('.')) {
      return { heading: first, text: lines.slice(1).join(' ') };
    }
    return { text: lines.join(' ') };
  });
}

const MiddlePart = ({ language, switchLang, headline, intro, body, goHome }) => {
  const scrollRef = useRef(null);

  // Each card and language opens at the top of its text.
  useLayoutEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [body, intro]);

  const sections = body.includes('\n\n') ? parseBody(body) : null;

  return (
    <section className="middle">
      <div className="top-bar">
        <div className="lang-flags">
          {LANGUAGES.map(l => (
            <button
              key={l}
              className={`flag-btn${language === l ? ' flag-active' : ''}`}
              {...tap(switchLang(l))}
            >
              <img
                src={`./g/${l}-flag.png`}
                alt={FLAG_ALTS[l]}
                className="flag-img"
              />
            </button>
          ))}
        </div>
        {goHome && (
          <button className="home-btn" {...tap(goHome)}>
            <img src="./g/homeimage.png" alt="Home" className="home-img" />
          </button>
        )}
      </div>
      <h1 className="headline">{headline}</h1>
      <p className="main-text">{intro}</p>
      <div className="helper-text" ref={scrollRef}>
        <div className="helper-text-inner">
          {sections
            ? sections.map((s, i) => (
                <div key={i} className="text-section">
                  {s.heading && <h3 className="section-heading">{s.heading}</h3>}
                  <p className="section-text">{s.text}</p>
                </div>
              ))
            : body
          }
        </div>
      </div>
    </section>
  );
};

export default MiddlePart;
