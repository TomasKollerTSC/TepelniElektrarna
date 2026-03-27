import { useRef, useLayoutEffect } from 'react';
import './middlePart.css';

const LANGUAGES = ['cz', 'de', 'en'];
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

const MiddlePart = ({ language, switchLang, headline, intro, body }) => {
  const scrollRef = useRef(null);
  const innerRef = useRef(null);

  useLayoutEffect(() => {
    const scroll = scrollRef.current;
    const inner = innerRef.current;
    if (!scroll || !inner) return;

    const availableHeight = scroll.clientHeight;
    if (availableHeight === 0) return;

    const visibleWidth = scroll.clientWidth;
    const gapPx = visibleWidth * 0.02;
    const colWidthPx = (visibleWidth - 2 * gapPx) / 3;

    // Measure content height in a single column
    Object.assign(inner.style, {
      columnCount: 'auto',
      columnWidth: 'auto',
      width: `${colWidthPx}px`,
      height: 'auto',
    });

    const totalHeight = inner.scrollHeight;
    const numCols = Math.max(3, Math.ceil(totalHeight / availableHeight));
    const totalWidth = numCols * colWidthPx + (numCols - 1) * gapPx;

    Object.assign(inner.style, {
      width: `${totalWidth}px`,
      height: '100%',
      columnCount: String(numCols),
      columnWidth: `${colWidthPx}px`,
      columnGap: `${gapPx}px`,
      columnFill: 'auto',
    });
  }, [body]);

  const sections = body.includes('\n\n') ? parseBody(body) : null;

  return (
    <section className="middle">
      <div className="lang-flags">
        {LANGUAGES.map(l => (
          <button
            key={l}
            className={`flag-btn${language === l ? ' flag-active' : ''}`}
            onClick={switchLang(l)}
          >
            <img
              src={`./g/${l}-flag.png`}
              alt={FLAG_ALTS[l]}
              className="flag-img"
            />
          </button>
        ))}
      </div>
      <h1 className="headline">{headline}</h1>
      <p className="main-text">{intro}</p>
      <div className="helper-text" ref={scrollRef}>
        <div className="helper-text-inner" ref={innerRef}>
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
