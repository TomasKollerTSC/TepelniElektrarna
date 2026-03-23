import { useState, useEffect, useRef } from 'react';

const SLEEP_TIMEOUT = 180_000;

const TABS = ['what', 'made', 'purpose', 'how'];

const LABELS = {
  cz: { what: 'Co je výměník?', made: 'Z čeho se skládá?', purpose: 'K čemu slouží?', how: 'Jak funguje?' },
  en: { what: 'What is a heat exchanger?', made: 'What is it made of?', purpose: 'What is it for?', how: 'How does it work?' },
  de: { what: 'Was ist ein Wärmetauscher?', made: 'Woraus besteht er?', purpose: 'Wozu dient er?', how: 'Wie funktioniert er?' },
};

const TITLES = { cz: 'Tepelný výměník', en: 'Heat Exchanger', de: 'Wärmetauscher' };

// Only one photo available for 4R – reused for all tabs
const TAB_PHOTOS = {
  what:    '/f/4R/10.png',
  made:    '/f/4R/10.png',
  purpose: '/f/4R/10.png',
  how:     '/f/4R/10.png',
};

const CONTENT = {
  cz: {
    what: {
      intro: 'Tepelný výměník je zařízení, které přenáší teplo z jedné kapaliny nebo plynu do druhé – aniž by se tyto látky vzájemně smísily. Je nezbytnou součástí každé tepelné elektrárny.',
      body: 'V tepelné elektrárně slouží výměník jako „tepelný most" mezi různými okruhy. Horká pára nebo voda na jedné straně předává své teplo chladnější kapalině na straně druhé. Tím se získá energie, aniž by docházelo k přímému kontaktu obou médií. Výměníky jsou navrženy tak, aby přenos tepla probíhal co nejefektivněji – s minimálními ztrátami a maximální spolehlivostí.',
    },
    made: {
      intro: 'Výměník tepla se skládá z teplosměnných ploch, přípojek pro vstup a výstup médií a pláště, který celé zařízení uzavírá a izoluje.',
      body: 'Trubkový svazek: Soustava kovových trubek, jimiž protéká jedno médium. Plášť (těleso): Obal, ve kterém proudí druhé médium kolem trubek. Přepážky: Desky uvnitř pláště, které usměrňují tok a zvyšují přestup tepla. Příruby a hrdla: Zajišťují bezpečné připojení potrubí. Materiál trubek bývá nerezová ocel nebo speciální slitiny, které odolávají vysokým teplotám a tlakům.',
    },
    purpose: {
      intro: 'Výměník tepla zajišťuje efektivní využití energie v celém energetickém cyklu elektrárny. Bez něj by velká část tepla přišla vniveč.',
      body: 'V napájecím okruhu předehřívá napájecí vodu pomocí odebírané páry z turbíny – tím se zvyšuje celková účinnost elektrárny. V kondenzátoru přebírá teplo z páry, která prošla turbínou, a mění ji zpět na kapalnou vodu. V systémech dálkového vytápění přenáší teplo z elektrárny do domácností a průmyslu. Správně dimenzovaný výměník výrazně snižuje spotřebu paliva a emise.',
    },
    how: {
      intro: 'Princip výměníku tepla je jednoduchý: dvě média s různou teplotou proudí odděleně, ale v těsné blízkosti. Teplo samovolně přechází z teplejšího média na chladnější.',
      body: 'Horké médium vstupuje do výměníku a proudí buď uvnitř trubek, nebo kolem nich. Chladné médium proudí ve směru opačném (protiproud) nebo kolmém (křížový tok). Teplo prostupuje stěnou trubky z teplého media do chladného. Horké médium se ochlazuje a chladné se zahřívá. Výstupní teploty závisí na průtocích, teplosměnné ploše a vlastnostech médií. Protiproudé uspořádání dosahuje nejvyšší účinnosti.',
    },
  },
  en: {
    what: {
      intro: 'A heat exchanger is a device that transfers heat from one fluid or gas to another without the two substances mixing. It is an essential component of every thermal power plant.',
      body: 'In a thermal power plant, the heat exchanger serves as a "thermal bridge" between different circuits. Hot steam or water on one side transfers its heat to a cooler liquid on the other side. This recovers energy without the two media coming into direct contact. Heat exchangers are designed so that heat transfer is as efficient as possible – with minimal losses and maximum reliability.',
    },
    made: {
      intro: 'A heat exchanger consists of heat transfer surfaces, connections for the inlet and outlet of the media and a shell that encloses and insulates the entire device.',
      body: 'Tube bundle: A set of metal tubes through which one medium flows. Shell: The enclosure in which the second medium flows around the tubes. Baffles: Plates inside the shell that direct flow and increase heat transfer. Flanges and nozzles: Ensure safe pipe connections. Tube material is usually stainless steel or special alloys that can withstand high temperatures and pressures.',
    },
    purpose: {
      intro: 'The heat exchanger ensures efficient use of energy throughout the plant\'s energy cycle. Without it, a large portion of the heat would be wasted.',
      body: 'In the feed circuit, it preheats the feed water using steam extracted from the turbine – thus increasing the overall efficiency of the plant. In the condenser, it absorbs heat from the steam that has passed through the turbine and converts it back into liquid water. In district heating systems, it transfers heat from the power plant to homes and industry. A correctly dimensioned heat exchanger significantly reduces fuel consumption and emissions.',
    },
    how: {
      intro: 'The principle of the heat exchanger is simple: two media at different temperatures flow separately but in close proximity. Heat naturally flows from the hotter medium to the cooler one.',
      body: 'Hot medium enters the heat exchanger and flows either inside the tubes or around them. Cold medium flows in the opposite direction (counter-flow) or at right angles (cross-flow). Heat passes through the tube wall from the hot medium to the cold medium. The hot medium cools down and the cold medium heats up. Outlet temperatures depend on flow rates, heat transfer area and properties of the media. Counter-flow arrangement achieves the highest efficiency.',
    },
  },
  de: {
    what: {
      intro: 'Ein Wärmetauscher ist ein Gerät, das Wärme von einer Flüssigkeit oder einem Gas auf eine andere überträgt – ohne dass sich die beiden Stoffe vermischen. Er ist ein unverzichtbarer Bestandteil jedes Wärmekraftwerks.',
      body: 'Im Wärmekraftwerk dient der Wärmetauscher als „Wärmebrücke" zwischen verschiedenen Kreisläufen. Heißer Dampf oder heißes Wasser auf einer Seite gibt seine Wärme an eine kühlere Flüssigkeit auf der anderen Seite ab. So wird Energie zurückgewonnen, ohne dass die beiden Medien in direkten Kontakt kommen. Wärmetauscher sind so konzipiert, dass der Wärmeübergang so effizient wie möglich erfolgt – mit minimalen Verlusten und maximaler Zuverlässigkeit.',
    },
    made: {
      intro: 'Ein Wärmetauscher besteht aus Wärmeübertragungsflächen, Anschlüssen für den Ein- und Austritt der Medien sowie einem Gehäuse, das das gesamte Gerät umschließt und isoliert.',
      body: 'Rohrbündel: Eine Gruppe von Metallrohren, durch die ein Medium fließt. Gehäuse (Mantel): Die Umhüllung, in der das zweite Medium um die Rohre herum strömt. Umlenkbleche: Platten im Inneren des Gehäuses, die die Strömung lenken und den Wärmeübergang erhöhen. Flansche und Stutzen: Sorgen für sichere Rohranschlüsse. Das Rohrmaterial besteht meist aus Edelstahl oder Speziallegierungen, die hohen Temperaturen und Drücken standhalten.',
    },
    purpose: {
      intro: 'Der Wärmetauscher sorgt für eine effiziente Nutzung der Energie im gesamten Energiekreislauf des Kraftwerks. Ohne ihn würde ein Großteil der Wärme verschwendet werden.',
      body: 'Im Speisewasserkreislauf wärmt er das Speisewasser mit aus der Turbine entnommenem Dampf vor – wodurch der Gesamtwirkungsgrad des Kraftwerks erhöht wird. Im Kondensator nimmt er die Wärme des durch die Turbine geströmten Dampfes auf und wandelt ihn wieder in flüssiges Wasser um. In Fernwärmesystemen überträgt er Wärme vom Kraftwerk in Haushalte und Industrie. Ein richtig dimensionierter Wärmetauscher reduziert den Brennstoffverbrauch und die Emissionen erheblich.',
    },
    how: {
      intro: 'Das Prinzip des Wärmetauschers ist einfach: Zwei Medien mit unterschiedlicher Temperatur fließen getrennt, aber in enger Nachbarschaft. Wärme geht von selbst vom wärmeren Medium auf das kältere über.',
      body: 'Heißes Medium tritt in den Wärmetauscher ein und strömt entweder durch die Rohre oder um sie herum. Kaltes Medium strömt in entgegengesetzter Richtung (Gegenstrom) oder quer dazu (Kreuzstrom). Wärme geht durch die Rohrwand vom heißen Medium auf das kalte über. Das heiße Medium kühlt sich ab, das kalte erwärmt sich. Die Austrittstemperaturen hängen von den Durchflussmengen, der Wärmeübertragungsfläche und den Eigenschaften der Medien ab. Das Gegenstromprinzip erreicht den höchsten Wirkungsgrad.',
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
