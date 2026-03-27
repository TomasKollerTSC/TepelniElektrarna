export const TABS = ['what', 'made', 'purpose', 'how'];

export const LABELS = {
  cz: { what: 'Co je turbína?', made: 'Z čeho se skládá?', purpose: 'K čemu slouží?', how: 'Jak funguje?' },
  en: { what: 'What is a turbine?', made: 'What is it made of?', purpose: 'What is it for?', how: 'How does it work?' },
  de: { what: 'Was ist eine Turbine?', made: 'Woraus besteht sie?', purpose: 'Wozu dient sie?', how: 'Wie funktioniert sie?' },
};

export const TITLES = { cz: 'Turbína', en: 'Turbine', de: 'Turbine' };

export const TAB_PHOTOS = {
  what:    '/f/7R/7R_01_turbína.jpg',
  made:    '/f/7R/7R Z čeho se skládá.png',
  purpose: '/f/7R/7R_04_K čemu slouží.jpg',
  how:     '/f/7R/7R jak funguje.png',
};

export const CONTENT = {
  cz: {
    what: {
      intro: 'Turbína je stroj, který převádí energii horké páry na otáčivý pohyb. V tepelné elektrárně je zásadním článkem mezi kotlem, kde pára vzniká, a generátorem, který z pohybu vyrábí elektřinu.',
      body: 'Pára pod vysokým tlakem a teplotou vstupuje do turbíny a proudí přes soustavu lopatek. Tím roztáčí rotor turbíny, který je spojen s rotorem generátoru. Jak pára prochází turbínou, expanduje a ochlazuje se – odevzdává svou energii lopatkám. Výstupní pára pak proudí do kondenzátoru, kde se opět změní na kapalnou vodu. Turbína tak tvoří klíčový přechod mezi tepelnou a mechanickou energií.',
    },
    made: {
      intro: 'Turbína se skládá ze statorových a rotorových částí, které společně přeměňují energii páry na otáčivý pohyb.',
      body: 'Stator (pevná část): Obsahuje pevné lopatky, které usměrňují proudění páry. Rotor (otáčivá část): Nese pohyblivé lopatky, na které pára tlačí a způsobuje otáčení. Hřídel: Přenáší rotační pohyb na generátor. Kondenzátorové připojení: Výstup páry z turbíny vede přímo do kondenzátoru. Ložiska: Umožňují plynulé otáčení rotoru při vysokých otáčkách.',
    },
    purpose: {
      intro: 'Úkolem turbíny je přeměnit tepelnou energii páry na otáčivý pohyb, který pohání generátor.',
      body: 'Turbína je srdcem každé tepelné elektrárny. Bez ní by tepelná energie vzniklá spalováním nemohla být přeměněna na elektrický proud. Výkon turbíny lze regulovat množstvím přiváděné páry. Při nízkém výkonu elektrárny turbína spotřebovává méně páry, při vysokém výkonu více. Správná funkce turbíny zajišťuje stabilní dodávku elektřiny do sítě.',
    },
    how: {
      intro: 'Horká pára proudí turbínou a postupně roztáčí její lopatky. Tím se energie páry mění na mechanický otáčivý pohyb rotoru.',
      body: 'Pára vstupuje do turbíny přes vstupní ventily a naráží na první řadu statorových lopatek. Ty usměrní proudění a zvýší rychlost páry. Pára pak tlačí na rotorové lopatky, čímž rotor roztočí. Tento proces se opakuje v mnoha stupních turbíny – v každém stupni pára expanduje, ztrácí tlak a teplotu, ale předává energii rotoru. Na výstupu z turbíny má pára nízký tlak a teplotu a odchází do kondenzátoru.',
    },
  },
  en: {
    what: {
      intro: 'The turbine is a machine that converts the energy of hot steam into rotary motion. In a thermal power plant, it is the essential link between the boiler, where the steam is generated, and the generator, which produces electricity from the movement.',
      body: 'High-pressure, high-temperature steam enters the turbine and flows through a system of blades. This rotates the turbine rotor, which is connected to the generator rotor. As the steam passes through the turbine, it expands and cools – transferring its energy to the blades. The exhaust steam then flows into a condenser, where it turns back into liquid water. The turbine thus forms the key transition between thermal and mechanical energy.',
    },
    made: {
      intro: 'The turbine consists of stator and rotor parts that together convert steam energy into rotary motion.',
      body: 'Stator (fixed part): Contains fixed blades that direct steam flow. Rotor (rotating part): Carries moving blades that steam pushes against, causing rotation. Shaft: Transfers rotational motion to the generator. Condenser connection: Turbine exhaust leads directly to the condenser. Bearings: Enable smooth rotation of the rotor at high speeds.',
    },
    purpose: {
      intro: 'The purpose of the turbine is to convert the thermal energy of the steam into rotational motion that drives the generator.',
      body: 'The turbine is the heart of every thermal power plant. Without it, the thermal energy from combustion could not be converted into electricity. The turbine output can be regulated by the amount of steam supplied. At low plant output the turbine consumes less steam, at high output it consumes more. Proper turbine function ensures a stable supply of electricity to the grid.',
    },
    how: {
      intro: 'The hot steam flows through the turbine and gradually rotates its blades. This converts the steam energy into mechanical rotational motion of the rotor.',
      body: 'Steam enters the turbine through inlet valves and hits the first row of stator blades. These direct the flow and increase the steam velocity. The steam then pushes on the rotor blades, causing the rotor to spin. This process repeats through many turbine stages – in each stage the steam expands, loses pressure and temperature, but transfers energy to the rotor. At the turbine outlet, the steam has low pressure and temperature and flows to the condenser.',
    },
  },
  de: {
    what: {
      intro: 'Die Turbine ist eine Maschine, die die Energie des heißen Dampfes in eine Drehbewegung umwandelt. In einem thermischen Kraftwerk bildet sie das zentrale Bindeglied zwischen dem Kessel, in dem der Dampf entsteht, und dem Generator, der aus dieser Bewegung elektrische Energie erzeugt.',
      body: 'Hochdruckdampf bei hoher Temperatur tritt in die Turbine ein und strömt durch ein System von Schaufeln. Dabei dreht er den Turbinenrotor, der mit dem Generatorrotor verbunden ist. Während der Dampf die Turbine durchströmt, expandiert er und kühlt ab – er gibt seine Energie an die Schaufeln ab. Der Abdampf strömt dann in den Kondensator, wo er wieder zu Wasser wird. Die Turbine bildet so den Schlüsselübergang zwischen thermischer und mechanischer Energie.',
    },
    made: {
      intro: 'Die Turbine besteht aus Stator- und Rotorteilen, die gemeinsam die Dampfenergie in eine Drehbewegung umwandeln.',
      body: 'Stator (feststehender Teil): Enthält feststehende Schaufeln, die die Dampfströmung lenken. Rotor (drehbarer Teil): Trägt bewegliche Schaufeln, gegen die der Dampf drückt und die Drehung verursacht. Welle: Überträgt die Drehbewegung auf den Generator. Kondensatoranschluss: Der Turbinenabdampf führt direkt in den Kondensator. Lager: Ermöglichen die reibungslose Rotation des Rotors bei hohen Drehzahlen.',
    },
    purpose: {
      intro: 'Die Aufgabe der Turbine besteht darin, die thermische Energie des Dampfes in eine Drehbewegung umzuwandeln, die den Generator antreibt.',
      body: 'Die Turbine ist das Herzstück jedes thermischen Kraftwerks. Ohne sie könnte die durch Verbrennung entstehende Wärmeenergie nicht in elektrischen Strom umgewandelt werden. Die Turbinenleistung lässt sich durch die Menge des zugeführten Dampfes regeln. Bei geringer Kraftwerksleistung verbraucht die Turbine weniger Dampf, bei hoher Leistung mehr. Die ordnungsgemäße Funktion der Turbine gewährleistet eine stabile Stromversorgung des Netzes.',
    },
    how: {
      intro: 'Heißer Dampf strömt durch die Turbine und setzt ihre Schaufeln schrittweise in Bewegung. Dabei wird die Energie des Dampfes in eine mechanische Drehbewegung des Rotors umgewandelt.',
      body: 'Dampf tritt durch Einlassventile in die Turbine ein und trifft auf die erste Reihe von Statorschaufeln. Diese lenken die Strömung und erhöhen die Dampfgeschwindigkeit. Der Dampf drückt dann auf die Rotorschaufeln und versetzt den Rotor in Drehung. Dieser Vorgang wiederholt sich in vielen Turbinenstufen – in jeder Stufe expandiert der Dampf, verliert Druck und Temperatur, gibt aber Energie an den Rotor ab. Am Turbinenaustritt hat der Dampf niedrigen Druck und niedrige Temperatur und strömt in den Kondensator.',
    },
  },
};
