export const TABS = ['what', 'made', 'purpose', 'how'];

export const LABELS = {
  cz: { what: 'Co je turbína?', made: 'Z čeho se skládá?', purpose: 'K čemu slouží?', how: 'Jak funguje?' },
  en: { what: 'What is a turbine?', made: 'What is it made of?', purpose: 'What is it used for?', how: 'How does it work?' },
  de: { what: 'Was ist eine Turbine?', made: 'Woraus besteht sie?', purpose: 'Wozu dient sie?', how: 'Wie funktioniert sie?' },
};

export const TITLES = { cz: 'Turbína', en: 'Turbine', de: 'Turbine' };

export const TAB_PHOTOS = {
  what:    '/f/7R/7R_01_turbína.jpg',
  made:    '/f/7R/7R Z čeho se skládá.png',
  purpose: '/f/7R/7R_04_K čemu slouží.jpg',
  how:     '/f/7R/7R jak funguje.png',
};

export const PHOTO_SOURCES = {
  what:    'Foto: ČEZ (Turbína, elektrárny Ledvice)',
  made:    'Lorem ipsum dolor sit amet',
  purpose: 'Foto: ČEZ (Turbína, elektrárny Ledvice)',
  how:     'Lorem ipsum dolor sit amet',
};

export const CONTENT = {
  cz: {
    what: {
      intro: 'Turbína je stroj, který převádí energii horké páry na otáčivý pohyb. V tepelné elektrárně je zásadním článkem mezi kotlem, kde pára vzniká, a generátorem, který z pohybu vyrábí elektřinu.',
      body: 'Turbína je stroj, který převádí energii horké páry na otáčivý pohyb. V tepelné elektrárně je zásadním článkem mezi kotlem, kde pára vzniká, a generátorem, který z pohybu vyrábí elektřinu.\nPára vzniklá v kotli má vysokou teplotu i tlak. Když vstoupí do turbíny, působí na její lopatky a roztočí rotor. Tento rotační pohyb se bez přerušení přenáší do generátoru, kde se mechanická otáčivá energie mění na elektrickou.',
    },
    made: {
      intro: 'Turbína je složená z řad pevné lopatkové části a rotorové lopatkové části. Obě společně usměrňují proud páry v turbíně.',
      body: 'Turbína je složená z řad pevné lopatkové části a rotorové lopatkové části. Obě společně usměrňují proud páry v turbíně.\nKaždá z nich má přesně danou funkci.\nHlavní otáčivou částí je olopatkovaný rotor, který přenáší otáčivý pohyb do generátoru. Rotorové lopatky zachycují energii proudící páry a roztočí rotor. Statorové lopatky proud páry usměrňují tak, aby byla turbína co nejúčinnější. Součástí turbíny jsou také vstupní a výstupní kanály páry a výstupní část do kondenzátoru, který je další částí parního cyklu elektrárny.',
    },
    purpose: {
      intro: 'Úkolem turbíny je přeměnit tepelnou energii páry na otáčivý pohyb, který pohání generátor.',
      body: 'Úkolem turbíny je přeměnit tepelnou energii páry na otáčivý pohyb, který pohání generátor.\nTurbína zároveň umožňuje regulovat výkon elektrárny – změnou množství a tlaku páry lze řídit, jaký výkon bude dodáván do generátoru. Je tak klíčovým místem, kde se tepelná energie páry mění na mechanickou energii využitelnou pro výrobu elektřiny.',
    },
    how: {
      intro: 'Horká pára proudí turbínou a postupně roztáčí její lopatky. Tím se energie páry mění na mechanický otáčivý pohyb rotoru.',
      body: 'Horká pára proudí turbínou a roztáčí její lopatky. Tím se tepelná energie páry mění na mechanický otáčivý pohyb rotoru.\nPára vstupuje do turbíny pod vysokým tlakem a teplotou, a během průchodu se rozpíná a ochlazuje. Každá řada lopatek z ní odebere část energie a přispívá k otáčení rotoru. Po průchodu turbínou pára odchází do kondenzátoru, kde se ochladí zpět na vodu a znovu se použije v kotli.',
    },
  },
  en: {
    what: {
      intro: 'The turbine is a machine that converts the energy of hot steam into rotary motion. In a thermal power plant, it is the essential link between the boiler, where the steam is generated, and the generator, which produces electricity from the movement.',
      body: 'The turbine is a machine that converts the energy of hot steam into rotary motion. In a thermal power plant, it is the essential link between the boiler, where the steam is generated, and the generator, which produces electricity from the movement.\nThe steam generated in the boiler has a high temperature and pressure. When it enters the turbine, it acts on its blades and spins the rotor. This rotational motion is transmitted without interruption to the generator, where the mechanical rotational energy is converted into electrical energy.',
    },
    made: {
      intro: 'The turbine is composed of rows of a fixed blade section and rotor blade section. Both direct the steam flow in the turbine.',
      body: 'The turbine comprises a series of fixed blade and rotor blade sections. Both direct the steam flow in the turbine. Each of them has a precisely defined function.\nThe main rotating part is the bladed rotor, which transmits the rotary motion to the generator. The rotor blades capture the energy of the steam flow and spin the rotor. Stator blades direct the steam flow to make the turbine as efficient as possible. The turbine also includes steam inlet and outlet channels and an outlet to the condenser, which is another part of the power plant\'s steam cycle.',
    },
    purpose: {
      intro: 'The purpose of the turbine is to convert the thermal energy of the steam into rotational motion that drives the generator.',
      body: 'The purpose of the turbine is to convert the thermal energy of the steam into rotational motion that drives the generator.\nThe turbine also allows the power output of the power plant to be controlled – by changing the amount and pressure of steam, the amount of power supplied to the generator can be controlled. It is therefore a key location where the thermal energy of steam is converted into mechanical energy that can be used to generate electricity.',
    },
    how: {
      intro: 'The hot steam flows through the turbine and gradually rotates its blades. This converts the steam energy into mechanical rotational motion of the rotor.',
      body: 'The hot steam flows through the turbine and spins its blades. This converts the thermal energy of the steam into the mechanical rotational motion of the rotor.\nThe steam enters the turbine at high pressure and temperature, then expands and cools as it passes through. Each row of blades takes some of the energy and contributes to the rotation of the rotor. After passing through the turbine, the steam goes to the condenser where it is cooled back into water and reused in the boiler.',
    },
  },
  de: {
    what: {
      intro: 'Die Turbine ist eine Maschine, die die Energie des heißen Dampfes in eine Drehbewegung umwandelt. In einem thermischen Kraftwerk bildet sie das zentrale Bindeglied zwischen dem Kessel, in dem der Dampf entsteht, und dem Generator, der aus dieser Bewegung elektrische Energie erzeugt.',
      body: 'Die Turbine ist eine Maschine, die die Energie des heißen Dampfes in eine Drehbewegung umwandelt. In einem thermischen Kraftwerk bildet sie das zentrale Bindeglied zwischen dem Kessel, in dem der Dampf entsteht, und dem Generator, der aus dieser Bewegung elektrische Energie erzeugt.\nDer im Kessel erzeugte Dampf besitzt eine hohe Temperatur und einen hohen Druck. Beim Eintritt in die Turbine wirkt er auf deren Schaufeln und versetzt den Rotor in Drehung. Diese Rotationsbewegung wird unmittelbar auf den Generator übertragen, wo die mechanische Energie in elektrische Energie umgewandelt wird.',
    },
    made: {
      intro: 'Die Turbine besteht aus Reihen feststehender und rotierender Schaufeln. Gemeinsam lenken sie den Dampfstrom innerhalb der Turbine.',
      body: 'Die Turbine besteht aus Reihen feststehender und rotierender Schaufeln. Gemeinsam lenken sie den Dampfstrom innerhalb der Turbine. Jede dieser Schaufelreihen erfüllt eine genau definierte Funktion.\nDer Hauptbestandteil ist der beschaufelte Rotor, der die Drehbewegung auf den Generator überträgt. Die Rotorschaufeln nehmen die Energie des strömenden Dampfes auf und versetzen den Rotor in Bewegung. Die Leitschaufeln (Stator) lenken den Dampfstrom so, dass die Turbine möglichst effizient arbeitet. Zur Turbine gehören außerdem Ein- und Austrittskanäle für den Dampf sowie der Übergang zum Kondensator, der einen weiteren Bestandteil des Dampfkraftprozesses bildet.',
    },
    purpose: {
      intro: 'Die Aufgabe der Turbine besteht darin, die thermische Energie des Dampfes in eine Drehbewegung umzuwandeln, die den Generator antreibt.',
      body: 'Die Aufgabe der Turbine besteht darin, die thermische Energie des Dampfes in eine Drehbewegung umzuwandeln, die den Generator antreibt.\nDie Turbine ermöglicht außerdem die Regelung der Kraftwerksleistung – durch Veränderung der Dampfmenge und des Dampfdrucks kann gesteuert werden, wie viel Leistung an den Generator abgegeben wird. Sie ist somit der zentrale Ort, an dem die thermische Energie des Dampfes in mechanische Energie umgewandelt wird, die zur Stromerzeugung genutzt werden kann.',
    },
    how: {
      intro: 'Heißer Dampf strömt durch die Turbine und setzt ihre Schaufeln schrittweise in Bewegung. Dabei wird die Energie des Dampfes in eine mechanische Drehbewegung des Rotors umgewandelt.',
      body: 'Heißer Dampf strömt durch die Turbine und treibt deren Schaufeln an. Dabei wird die thermische Energie des Dampfes in eine mechanische Drehbewegung des Rotors umgewandelt.\nDer Dampf tritt mit hohem Druck und hoher Temperatur in die Turbine ein und dehnt sich während seines Durchgangs aus und kühlt sich dabei ab. Jede Schaufelreihe entzieht ihm einen Teil seiner Energie und trägt zur Rotation des Rotors bei.\nNach dem Durchströmen der Turbine gelangt der Dampf in den Kondensator, wo er wieder zu Wasser abgekühlt und anschließend im Kessel erneut genutzt wird.',
    },
  },
};
