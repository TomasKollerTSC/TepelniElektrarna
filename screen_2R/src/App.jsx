import { useState, useEffect, useRef } from 'react';

const SLEEP_TIMEOUT = 180_000;

const TABS = ['what', 'made', 'purpose', 'how'];

const LABELS = {
  cz: { what: 'Co je kotel?', made: 'Z čeho se skládá?', purpose: 'K čemu slouží?', how: 'Jak funguje?' },
  en: { what: 'What is a boiler?', made: 'What is it made of?', purpose: 'What is it for?', how: 'How does it work?' },
  de: { what: 'Was ist ein Kessel?', made: 'Woraus besteht er?', purpose: 'Wozu dient er?', how: 'Wie funktioniert er?' },
};

const TITLES = { cz: 'Kotel', en: 'Boiler', de: 'Kessel' };

const TAB_PHOTOS = {
  what:    '/f/2R/Elektrárna Ledvice_dron.png',
  made:    '/f/2R/FOTO_10_pohled do kotle.jpg',
  purpose: '/f/2R/FOTO_11_plynové hořáky kotle.jpg',
  how:     '/f/2R/FOTO_10_pohled do kotle.jpg',
};

const CONTENT = {
  cz: {
    what: {
      intro: 'Kotel je zařízení, které mění chemickou energii paliva na teplo potřebné k výrobě páry. Podle použitého paliva se může lišit konstrukcí i provozem, ale cíl zůstává stejný.',
      body: 'V kotli se spaluje palivo – uhlí, zemní plyn nebo biomasa. Uvolněné teplo ohřívá vodu proudící v trubkách kotle. Voda se postupně mění v páru o vysokém tlaku a teplotě, která pak pohání turbínu. Způsob spalování se liší podle paliva: uhlí se mele na prášek, biomasa se spaluje na roštu a plyn hoří v hořácích. Při spalování vznikají spaliny, které předávají teplo dalším částem kotle, a poté jsou čištěny a odváděny komínem.',
    },
    made: {
      intro: 'Kotel se skládá z několika částí, které společně zachycují teplo a zajišťují bezpečný odvod zbytků spalování.',
      body: 'Spalovací komora (topeniště): Místo, kde dochází ke spalování paliva. Výparník: Soustava trubek, ve kterých se voda ohřívá a mění na páru. Přehřívák páry: Zvyšuje teplotu a tlak páry. Ekonomizér: Předehřívá napájecí vodu pomocí tepla ze spalin. Zařízení pro zachytávání zbytků: Elektrostatické odlučovače a filtry zachycují popílek a čistí spaliny.',
    },
    purpose: {
      intro: 'Kotel dodává páru pro turbínu. Parametry páry (tlak a teplota) mají velký vliv na výkon a účinnost celé elektrárny.',
      body: 'Pára vyrobená v kotli pohání turbínu, která pohání generátor vyrábějící elektřinu. Výkon kotle určuje, kolik elektřiny může elektrárna vyrobit. Kotle na uhlí nebo biomasu reagují na změny zatížení pomaleji než plynové kotle, které lze rychle regulovat. Správná funkce kotle je klíčová pro bezpečný a efektivní provoz celé elektrárny.',
    },
    how: {
      intro: 'Palivo se spaluje, voda se mění na páru a zbytky spalování se oddělují. Způsob, jakým k tomu dochází, se liší podle paliva.',
      body: 'Palivo vstupuje do spalovací komory, kde hoří a uvolňuje teplo. Teplo ohřívá vodu v trubkách výparníku. Vzniklá pára proudí přes přehřívák, kde dosáhne požadované teploty a tlaku. Spaliny procházejí ekonomizérem, kde předají zbývající teplo napájecí vodě, a poté jsou čištěny a odváděny do atmosféry. Celý proces je řízen automaticky, aby byl bezpečný a co nejúčinnější.',
    },
  },
  en: {
    what: {
      intro: 'The boiler is a device that converts the chemical energy of the fuel into the heat needed to produce steam. The design and operation may vary depending on the fuel used, but the aim remains the same.',
      body: 'In the boiler, fuel is burned – coal, natural gas or biomass. The heat released heats the water flowing through the boiler tubes. The water gradually turns into high-pressure, high-temperature steam, which then drives the turbine. The combustion method varies by fuel: coal is ground into powder, biomass burns on a grate and gas burns in burners. Combustion produces flue gases that transfer heat to other parts of the boiler, then are cleaned and discharged through the chimney.',
    },
    made: {
      intro: 'The boiler consists of several parts that together capture heat and ensure the safe removal of combustion residues.',
      body: 'Combustion chamber (furnace): Where the fuel is burned. Evaporator: A system of tubes in which water is heated and converted to steam. Superheater: Increases the temperature and pressure of the steam. Economizer: Preheats the feed water using heat from the flue gases. Residue collection equipment: Electrostatic precipitators and filters capture fly ash and clean the flue gases.',
    },
    purpose: {
      intro: 'The boiler supplies steam to the turbine. The steam parameters (pressure and temperature) have a great influence on the performance and efficiency of the whole plant.',
      body: 'The steam produced in the boiler drives the turbine, which drives a generator producing electricity. The boiler output determines how much electricity the plant can produce. Coal or biomass boilers respond more slowly to load changes than gas boilers, which can be quickly regulated. The proper functioning of the boiler is critical to the safe and efficient operation of the entire plant.',
    },
    how: {
      intro: 'The fuel is burned, the water is converted to steam and the combustion residues are separated. The way this happens depends on the fuel.',
      body: 'Fuel enters the combustion chamber, where it burns and releases heat. The heat heats the water in the evaporator tubes. The resulting steam flows through the superheater, where it reaches the required temperature and pressure. The flue gases pass through the economizer, where they transfer residual heat to the feed water, then are cleaned and discharged into the atmosphere. The entire process is controlled automatically to ensure it is safe and as efficient as possible.',
    },
  },
  de: {
    what: {
      intro: 'Der Kessel ist eine Anlage, die die chemische Energie des Brennstoffs in Wärme umwandelt, die zur Erzeugung von Dampf benötigt wird. Je nach eingesetztem Brennstoff können sich Aufbau und Betriebsweise unterscheiden – das Ziel bleibt jedoch immer gleich.',
      body: 'Im Kessel wird Brennstoff verbrannt – Kohle, Erdgas oder Biomasse. Die freigesetzte Wärme erhitzt das Wasser in den Kesselrohren. Das Wasser verwandelt sich schrittweise in Hochdruckdampf, der dann die Turbine antreibt. Die Verbrennungsmethode variiert je nach Brennstoff: Kohle wird zu Pulver gemahlen, Biomasse verbrennt auf einem Rost und Gas verbrennt in Brennern. Bei der Verbrennung entstehen Rauchgase, die Wärme an andere Kesselteile abgeben und anschließend gereinigt und über den Schornstein abgeleitet werden.',
    },
    made: {
      intro: 'Der Kessel besteht aus mehreren Teilen, die gemeinsam Wärme aufnehmen und die sichere Entsorgung der Verbrennungsrückstände gewährleisten.',
      body: 'Brennkammer (Feuerraum): Der Ort, an dem der Brennstoff verbrannt wird. Verdampfer: Ein Rohrsystem, in dem Wasser erhitzt und in Dampf umgewandelt wird. Überhitzer: Erhöht Temperatur und Druck des Dampfes. Economiser: Vorwärmung des Speisewassers mithilfe der Rauchgaswärme. Rückstandssammelanlage: Elektrofilter und Gewebefilter fangen Flugasche auf und reinigen die Rauchgase.',
    },
    purpose: {
      intro: 'Der Kessel liefert den Dampf für die Turbine. Die Dampfparameter – insbesondere Druck und Temperatur – haben großen Einfluss auf Leistung und Wirkungsgrad des gesamten Kraftwerks.',
      body: 'Der im Kessel erzeugte Dampf treibt die Turbine an, die wiederum einen Generator antreibt, der Strom erzeugt. Die Kesselleistung bestimmt, wie viel Strom das Kraftwerk erzeugen kann. Kohle- oder Biomassekessel reagieren auf Laständerungen langsamer als Gaskessel, die schnell geregelt werden können. Die ordnungsgemäße Funktion des Kessels ist entscheidend für den sicheren und effizienten Betrieb des gesamten Kraftwerks.',
    },
    how: {
      intro: 'Der Brennstoff wird verbrannt, Wasser verwandelt sich in Dampf und die Verbrennungsrückstände werden abgeschieden. Wie dieser Prozess abläuft, hängt vom jeweiligen Brennstoff ab.',
      body: 'Brennstoff gelangt in die Brennkammer, wo er verbrennt und Wärme freisetzt. Die Wärme erhitzt das Wasser in den Verdampferrohren. Der entstehende Dampf strömt durch den Überhitzer, wo er die erforderliche Temperatur und den erforderlichen Druck erreicht. Die Rauchgase passieren den Economiser, wo sie Restwärme an das Speisewasser abgeben, bevor sie gereinigt und in die Atmosphäre abgeleitet werden. Der gesamte Prozess wird automatisch gesteuert, um Sicherheit und Effizienz zu gewährleisten.',
    },
  },
};

export default function App() {
  const [screen, setScreen] = useState('sleep');
  const [language, setLanguage] = useState('cz');
  const [activeTab, setActiveTab] = useState('what');
  const timer = useRef(null);

  const resetTimer = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setScreen('sleep'), SLEEP_TIMEOUT);
  };

  useEffect(() => {
    if (screen !== 'sleep') resetTimer();
    return () => clearTimeout(timer.current);
  }, [screen]);

  const wake = () => { setScreen('active'); resetTimer(); };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setScreen('active'); return; }
      if (screen !== 'active') return;
      const idx = parseInt(e.key) - 1;
      if (idx >= 0 && idx < TABS.length) setActiveTab(TABS[idx]);
      if (e.key === 'l' || e.key === 'L') setLanguage(l => l === 'cz' ? 'en' : l === 'en' ? 'de' : 'cz');
      if (e.key === 'Escape') setScreen('sleep');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [screen]);

  if (screen === 'sleep') {
    return (
      <div className="screen sleep" onClick={wake}>
        <div className="touch-hint">✋</div>
      </div>
    );
  }

  const tab = activeTab;
  const content = CONTENT[language][tab];
  const photo = TAB_PHOTOS[tab];

  return (
    <div className="screen active" onClick={resetTimer}>
      {/* Header */}
      <div className="header">
        <div className="lang-bar">
          {['cz', 'en', 'de'].map(l => (
            <button key={l} className={`lang-btn ${language === l ? 'sel' : ''}`}
              onClick={(e) => { e.stopPropagation(); setLanguage(l); }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button className="home-btn" onClick={(e) => { e.stopPropagation(); setScreen('sleep'); }}>⌂</button>
      </div>

      {/* Photo strip */}
      <div className="photo-strip">
        <img src={photo} alt="" className="photo-img" />
        <div className="photo-title-overlay">
          <span className="screen-label">{TITLES[language]}</span>
          <h1 className="tab-title">{LABELS[language][tab]}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="content-area">
        <div className="col intro-col">
          <p className="intro-text">{content.intro}</p>
        </div>
        <div className="col body-col">
          <p className="body-text">{content.body}</p>
        </div>
      </div>

      {/* Tab thumbnails */}
      <div className="tab-row">
        {TABS.map(t => (
          <button key={t} className={`tab-thumb ${t === activeTab ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); setActiveTab(t); }}>
            <img src={TAB_PHOTOS[t]} alt="" className="thumb-img" />
            <span className="thumb-label">{LABELS[language][t]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
