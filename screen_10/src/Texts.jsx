export const TABS = ['what', 'how', 'made', 'purpose'];

export const LABELS = {
  cz: { what: 'Co je generátor?', how: 'Jak funguje?', made: 'Z čeho se skládá?', purpose: 'K čemu slouží?' },
  en: { what: 'What is a generator?', how: 'How does it work?', made: 'What is it made of?', purpose: 'What is it used for?' },
  de: { what: 'Was ist ein Generator?', how: 'Wie funktioniert er?', made: 'Woraus besteht er?', purpose: 'Wozu dient er?' },
};

export const TITLES = { cz: 'Generátor', en: 'Generator', de: 'Generator' };

export const GENERAL_TEXT = {
  cz: 'Generátor je poháněný turbínou. Uvnitř generátoru se otáčivý pohyb jeho rotoru mění na elektrický proud, který lze poslat dál elektrickou sítí do domů, měst i továren. Právě zde se energie z paliva definitivně promění v elektřinu, kterou běžně používáme.',
  en: 'The generator is driven by a turbine. Inside the generator, the rotating motion of its rotor is converted into an electric current that can be supplied through the electrical mains to homes, cities, factories. This is where the energy from the fuel is finally converted into the electricity we normally use.',
  de: 'Der Generator wird von der Turbine angetrieben. Im Inneren des Generators wird die Drehbewegung des Rotors in elektrischen Strom umgewandelt, der anschließend über das Stromnetz in Haushalte, Städte und Industrieanlagen geleitet wird. Hier wird die im Brennstoff enthaltene Energie endgültig in elektrische Energie umgewandelt, die wir im Alltag nutzen.',
};

export const OVERVIEW_PHOTO = '/f/10/Generátor_Elektrárna Ledvice.jpg';

export const OVERVIEW_SOURCE = {
  cz: 'Foto: ČEZ (generátor elektrárny Ledvice)',
  en: 'Photo: ČEZ (Ledvice power plant generator)',
  de: 'Foto: ČEZ (Generator, Kraftwerk Ledvice)',
};

export const TAB_PHOTOS = {
  what:    '/f/10/10_01_Co je_Generátor.jpeg',
  how:     '/f/10/Gen_CZ.jpg',
  made:    '/f/10/FOTO_92_vinutí.jpg',
  purpose: '/f/10/Generátor_Elektrárna Ledvice.jpg',
};

export const tabPhoto = (tab, lang) => {
  if (tab === 'how') return `/f/10/Gen_${lang.toUpperCase()}.jpg`;
  return TAB_PHOTOS[tab];
};

export const PHOTO_SOURCES = {
  what:    'Foto: ČEZ (Generátor Elektrárna Ledvice)',
  how:     'Grafika: www.svetenergie.cz (princip generátoru)',
  made:    'Foto: ČEZ (vinutí)',
  purpose: 'Foto: ČEZ (generátor elektrárny Ledvice)',
};

export const TAB_VIDEOS = {
  what: null,
  how: null,
  made: null,
  purpose: null,
};

export const CONTENT = {
  cz: {
    what: {
      intro: 'Generátor je zařízení, které mění otáčivý pohyb na elektrickou energii.\nV tepelné elektrárně navazuje přímo na turbínu a je místem, kde se pohyb konečně promění v elektřinu.',
      body: 'Turbína a generátor jsou spojeny společnou hřídelí, která přenáší otáčivý pohyb přímo mezi nimi. Pokud se hřídel točí, generátor vyrábí elektrickou energii, která je následně odváděna do elektrické sítě. Generátor je tak posledním článkem přeměny energie v elektrárně.',
    },
    how: {
      intro: 'Otáčením hřídele se uvnitř generátoru vytváří měnící se magnetické pole, které vyrábí elektřinu.\nPohyb se tu mění na elektrický proud díky elektromagnetické indukci.',
      body: 'Uvnitř generátoru se otáčí rotor, který vytváří magnetické pole. Kolem něj je stator s cívkami vodičů. Magnetické pole rotoru se pohybuje vůči cívkám statoru, a tím vzniká v cívkách elektrické napětí a proud. Aby byla elektřina stabilní a použitelná, musí se rotor otáčet přesně stanovenou rychlostí (v synchronizaci s elektrickou sítí) a magnetické pole musí být rovnoměrné.',
    },
    made: {
      intro: 'Generátor má pevnou i pohyblivou část, které spolu vyrábějí elektrickou energii.\nKaždá z nich hraje svou roli v přeměně pohybu na elektrický proud.',
      body: 'Rotor je otáčivá část spojená s turbínou, která vytváří magnetické pole. Stator je pevná část s cívkami, ve kterých se indukuje elektrické napětí, a po připojení k elektrické síti se odvádí elektrický proud. Ložiska umožňují plynulé otáčení rotoru a chladicí systém odvádí teplo vznikající při výrobě elektřiny. Hotová elektrická energie pak odchází ven přes vývody do rozvodné sítě.',
    },
    purpose: {
      intro: 'Generátor vyrábí elektřinu z pohybu turbíny.\nJe místem, kde se energie stává využitelnou pro domácnosti, města i průmysl.',
      body: 'Zajišťuje stabilní výrobu elektrické energie a propojuje celý energetický proces – od kotle přes turbínu až po elektrickou síť. Bez generátoru by se veškerý pohyb a teplo v elektrárně nikdy nepřeměnily v elektřinu, kterou můžeme používat.',
    },
  },
  en: {
    what: {
      intro: 'The generator is a device that converts rotational motion into electrical energy.\nIn a thermal power plant, it connects directly to the turbine and is the point where motion is finally converted into electricity.',
      body: 'The turbine and generator are connected by a common shaft that transmits the rotational motion directly between them. When the shaft rotates, the generator produces electricity, which is then supplied into the grid. The generator is therefore the last link in the power plant energy conversion.',
    },
    how: {
      intro: 'The rotation of the shaft creates an alternating magnetic field inside the generator, which produces electricity.\nHere, motion is converted into electric current by electromagnetic induction.',
      body: 'Inside the generator, a rotor rotates to create a magnetic field. A stator with wire conductor coils surrounds it. The magnetic field of the rotor moves relative to the stator coils, thus generating electrical voltage and current in the coils. For the electricity to be stable and usable, the rotor must rotate at a precise speed (in synchronisation with the power network) and the magnetic field must be uniform.',
    },
    made: {
      intro: 'The generator has a fixed and a moving part, which together produce electricity.\nEach of them plays its role in converting motion into electric current.',
      body: 'The rotor is the rotating part connected to the turbine that creates the magnetic field. The stator is a solid part with coils in which electrical voltage is induced and electric current is supplied when connected to the grid. The bearings allow the rotor to rotate smoothly, and the cooling system transfers the heat generated during the power generation. The produced electricity is then supplied through outputs to the grid.',
    },
    purpose: {
      intro: 'The generator produces electricity from the motion of the turbine.\nThis is the place where energy becomes usable for households, cities and industry.',
      body: 'It ensures stable power generation and interconnects the entire energy process – from the boiler to the turbine to the power grid. Without the generator, all the motion and heat in the plant would never be converted into electricity that we can use.',
    },
  },
  de: {
    what: {
      intro: 'Der Generator ist eine Anlage, die eine Drehbewegung in elektrische Energie umwandelt. In einem thermischen Kraftwerk ist er direkt an die Turbine angeschlossen und bildet den Ort, an dem Bewegung schließlich in Strom umgewandelt wird.',
      body: 'Turbine und Generator sind über eine gemeinsame Welle miteinander verbunden, die die Drehbewegung unmittelbar überträgt. Dreht sich die Welle, erzeugt der Generator elektrische Energie, die anschließend in das Stromnetz eingespeist wird. Der Generator ist somit das letzte Glied der Energieumwandlung im Kraftwerk.',
    },
    how: {
      intro: 'Durch die Drehung der Welle entsteht im Inneren des Generators ein sich veränderndes Magnetfeld, das elektrische Energie erzeugt.\nDie Bewegung wird hier durch elektromagnetische Induktion in elektrischen Strom umgewandelt.',
      body: 'Im Generator rotiert ein Rotor, der ein Magnetfeld erzeugt. Um ihn herum befindet sich der feststehende Stator mit Leiterspulen. Bewegt sich das Magnetfeld des Rotors relativ zu den Spulen des Stators, entsteht in den Spulen eine elektrische Spannung und ein Strom. Damit der erzeugte Strom stabil und nutzbar ist, muss sich der Rotor mit einer exakt festgelegten Drehzahl bewegen (synchron zur elektrischen Netzfrequenz), und das Magnetfeld muss gleichmäßig aufgebaut sein.',
    },
    made: {
      intro: 'Der Generator besteht aus einer festen und einer beweglichen Komponente, die gemeinsam elektrische Energie erzeugen.\nJede von ihnen übernimmt eine eigene Aufgabe bei der Umwandlung von Bewegung in elektrischen Strom.',
      body: 'Der Rotor ist der rotierende Teil, der mit der Turbine verbunden ist und das Magnetfeld erzeugt. Der Stator ist der feststehende Teil mit Spulen, in denen elektrische Spannung induziert wird; nach der Verbindung mit dem Stromnetz wird der erzeugte Strom abgeführt. Lager ermöglichen eine gleichmäßige Drehbewegung des Rotors, während ein Kühlsystem die bei der Stromerzeugung entstehende Wärme abführt. Die fertige elektrische Energie verlässt den Generator schließlich über Anschlussleitungen in das Versorgungsnetz.',
    },
    purpose: {
      intro: 'Der Generator erzeugt elektrische Energie aus der Bewegung der Turbine.\nEr ist der Ort, an dem Energie für Haushalte, Städte und Industrie nutzbar wird.',
      body: 'Er gewährleistet eine stabile Stromerzeugung und verbindet den gesamten Energieumwandlungsprozess – vom Kessel über die Turbine bis hin zum Stromnetz. Ohne den Generator würden sich die Bewegung und die Wärme im Kraftwerk niemals in die elektrische Energie verwandeln, die wir im Alltag nutzen.',
    },
  },
};
