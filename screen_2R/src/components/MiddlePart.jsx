import './middlePart.css';

const LANGUAGES = ['cz', 'de', 'en'];
const FLAG_ALTS = { cz: 'Čeština', de: 'Deutsch', en: 'English' };

const MiddlePart = ({ language, switchLang, headline, intro, body }) => {
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
              src={`/flags/${l}-flag.png`}
              alt={FLAG_ALTS[l]}
              className="flag-img"
            />
          </button>
        ))}
      </div>
      <h1 className="headline">{headline}</h1>
      <p className="main-text">{intro}</p>
      <p className="helper-text">{body}</p>
    </section>
  );
};

export default MiddlePart;
