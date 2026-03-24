import { useState, useEffect, useRef } from 'react';

const SLEEP_TIMEOUT = 180_000;
const TABS = ['what', 'made', 'purpose', 'how'];

const LABELS = {
  cz: { what: 'Co je generátor?', made: 'Z čeho se skládá?', purpose: 'K čemu slouží?', how: 'Jak funguje?' },
  en: { what: 'What is a generator?', made: 'What is it made of?', purpose: 'What is it for?', how: 'How does it work?' },
  de: { what: 'Was ist ein Generator?', made: 'Woraus besteht er?', purpose: 'Wozu dient er?', how: 'Wie funktioniert er?' },
};

const TITLES = { cz: 'Generátor', en: 'Generator', de: 'Generator' };

const TAB_PHOTOS = {
  what:    '/f/10/10_01_Co je_Generátor.jpeg',
  made:    '/f/10/10_01_Co je_Generátor.jpeg',
  purpose: '/f/10/10_04_K čemu slouží_generátor.jpg',
  how:     '/f/10/10_04_K čemu slouží_generátor.jpg',
};

const CONTENT = {
  cz: {
    what: {
      intro: 'Generátor je zařízení, které mění otáčivý pohyb na elektrickou energii. V tepelné elektrárně navazuje přímo na turbínu a je místem, kde se pohyb konečně promění v elektřinu.',
      body: 'Turbína a generátor jsou spojeny společnou hřídelí. Otáčení hřídele přenáší pohyb přímo. Jakmile se hřídel otáčí, generátor vyrábí elektřinu a dodává ji do sítě. Generátor tak uzavírá celý řetězec přeměny energie v elektrárně: palivo → teplo → pára → pohyb → elektřina. Je posledním článkem tohoto řetězce, který výslednou energii přemění do využitelné podoby.',
    },
    made: {
      intro: 'Generátor se skládá z několika klíčových částí, které společně zajišťují výrobu elektřiny elektromagnetickou indukcí.',
      body: 'Rotor (otáčivá část): Připojený k hřídeli turbíny. Při otáčení vytváří magnetické pole. Stator (pevná část): Obklopuje rotor. Obsahuje vodiče, ve kterých se indukuje elektrický proud. Ložiska: Umožňují plynulé otáčení rotoru. Chladící systém: Odvádí teplo vznikající při výrobě elektřiny. Výstupní svorky: Odvádějí vyrobenou elektřinu do transformátoru a dále do sítě.',
    },
    purpose: {
      intro: 'Generátor vyrábí elektřinu z pohybu turbíny. Je místem, kde energie stává využitelnou pro domácnosti, města i průmysl.',
      body: 'Generátor zajišťuje stabilní výrobu elektřiny. Propojuje celý proces přeměny energie: kotel dodává páru, pára pohání turbínu, turbína pohání generátor. Bez generátoru by pohyb turbíny a teplo v elektrárně nikdy nepřešly do podoby elektřiny, kterou denně používáme. Výkon generátoru odpovídá výkonu turbíny – čím více páry, tím více elektřiny.',
    },
    how: {
      intro: 'Otáčením hřídele se uvnitř generátoru vytváří měnící se magnetické pole, které vyrábí elektřinu elektromagnetickou indukcí.',
      body: 'Rotor, připojený k hřídeli turbíny, se otáčí uvnitř statoru. Rotující rotor vytváří měnící se magnetické pole. Stator obklopující rotor obsahuje vodiče uspořádané do cívek. Měnící se magnetické pole indukuje v cívkách napětí a elektrický proud. Aby byl proud stabilní a využitelný, musí se rotor otáčet přesnou rychlostí synchronizovanou s frekvencí elektrické sítě. Výstupní elektřina pak putuje přes transformátor do přenosové sítě.',
    },
  },
  en: {
    what: {
      intro: 'The generator is a device that converts rotational motion into electrical energy. In a thermal power plant, it connects directly to the turbine and is the point where motion is finally converted into electricity.',
      body: 'The turbine and generator are connected by a common shaft. Shaft rotation transmits motion directly. When the shaft rotates, the generator produces electricity and supplies it to the grid. The generator thus closes the entire energy conversion chain in the plant: fuel → heat → steam → motion → electricity. It is the last link in this chain that converts the resulting energy into a usable form.',
    },
    made: {
      intro: 'The generator consists of several key parts that together ensure electricity production by electromagnetic induction.',
      body: 'Rotor (rotating part): Connected to the turbine shaft. Creates a magnetic field when rotating. Stator (fixed part): Surrounds the rotor. Contains conductors in which electric current is induced. Bearings: Enable smooth rotation of the rotor. Cooling system: Removes heat generated during electricity production. Output terminals: Lead the generated electricity to the transformer and then to the grid.',
    },
    purpose: {
      intro: 'The generator produces electricity from the motion of the turbine. This is the place where energy becomes usable for households, cities and industry.',
      body: 'The generator ensures stable electricity production. It connects the entire energy conversion process: the boiler supplies steam, the steam drives the turbine, the turbine drives the generator. Without the generator, the turbine movement and heat in the plant would never be converted into the electricity we use daily. The generator output corresponds to the turbine output – the more steam, the more electricity.',
    },
    how: {
      intro: 'The rotation of the shaft creates an alternating magnetic field inside the generator, which produces electricity by electromagnetic induction.',
      body: 'The rotor, connected to the turbine shaft, rotates inside the stator. The rotating rotor creates an alternating magnetic field. The stator surrounding the rotor contains conductors arranged in coils. The alternating magnetic field induces voltage and electric current in the coils. For the current to be stable and usable, the rotor must rotate at a precise speed synchronized with the electrical grid frequency. The output electricity then travels through a transformer to the transmission network.',
    },
  },
  de: {
    what: {
      intro: 'Der Generator ist eine Anlage, die eine Drehbewegung in elektrische Energie umwandelt. In einem thermischen Kraftwerk ist er direkt an die Turbine angeschlossen und bildet den Ort, an dem Bewegung schließlich in Strom umgewandelt wird.',
      body: 'Turbine und Generator sind durch eine gemeinsame Welle verbunden. Die Wellendrehung überträgt die Bewegung direkt. Sobald sich die Welle dreht, erzeugt der Generator Strom und speist ihn ins Netz ein. Der Generator schließt damit die gesamte Energieumwandlungskette im Kraftwerk: Brennstoff → Wärme → Dampf → Bewegung → Strom. Er ist das letzte Glied dieser Kette, das die resultierende Energie in eine nutzbare Form umwandelt.',
    },
    made: {
      intro: 'Der Generator besteht aus mehreren Schlüsselteilen, die gemeinsam die Stromerzeugung durch elektromagnetische Induktion sicherstellen.',
      body: 'Rotor (drehbarer Teil): Mit der Turbinenwelle verbunden. Erzeugt bei Drehung ein Magnetfeld. Stator (feststehender Teil): Umgibt den Rotor. Enthält Leiter, in denen elektrischer Strom induziert wird. Lager: Ermöglichen die reibungslose Rotation des Rotors. Kühlsystem: Leitet die bei der Stromerzeugung entstehende Wärme ab. Ausgangsklemmen: Leiten den erzeugten Strom zum Transformator und dann ins Netz.',
    },
    purpose: {
      intro: 'Der Generator erzeugt elektrische Energie aus der Bewegung der Turbine. Er ist der Ort, an dem Energie für Haushalte, Städte und Industrie nutzbar wird.',
      body: 'Der Generator gewährleistet eine stabile Stromerzeugung. Er verbindet den gesamten Energieumwandlungsprozess: Der Kessel liefert Dampf, der Dampf treibt die Turbine an, die Turbine treibt den Generator an. Ohne den Generator würden die Turbinenbewegung und die Wärme im Kraftwerk niemals in den Strom umgewandelt, den wir täglich nutzen. Die Generatorleistung entspricht der Turbinenleistung – je mehr Dampf, desto mehr Strom.',
    },
    how: {
      intro: 'Durch die Drehung der Welle entsteht im Inneren des Generators ein sich veränderndes Magnetfeld, das durch elektromagnetische Induktion elektrische Energie erzeugt.',
      body: 'Der mit der Turbinenwelle verbundene Rotor dreht sich im Inneren des Stators. Der rotierende Rotor erzeugt ein sich veränderndes Magnetfeld. Der den Rotor umgebende Stator enthält in Spulen angeordnete Leiter. Das sich verändernde Magnetfeld induziert in den Spulen Spannung und elektrischen Strom. Damit der Strom stabil und nutzbar ist, muss sich der Rotor mit einer genauen, mit der Netzfrequenz synchronisierten Geschwindigkeit drehen. Der erzeugte Strom gelangt dann über einen Transformator ins Übertragungsnetz.',
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
      <div className="screen sleep" onClick={() => setScreen('active')}>
        <div className="touch-hint">✋</div>
      </div>
    );
  }

  const tab = activeTab;
  const content = CONTENT[language][tab];
  const photo = TAB_PHOTOS[tab];

  return (
    <div className="screen active" onClick={resetTimer}>
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
      <div className="photo-strip">
        <img src={photo} alt="" className="photo-img" />
        <div className="photo-title-overlay">
          <span className="screen-label">{TITLES[language]}</span>
          <h1 className="tab-title">{LABELS[language][tab]}</h1>
        </div>
      </div>
      <div className="content-area">
        <div className="col intro-col"><p className="intro-text">{content.intro}</p></div>
        <div className="col body-col"><p className="body-text">{content.body}</p></div>
      </div>
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
