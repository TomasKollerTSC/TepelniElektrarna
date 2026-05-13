export const TABS = ['what', 'made', 'purpose', 'how'];

export const LABELS = {
  cz: { what: 'Co je tepelný výměník?', made: 'Z čeho se skládá?', purpose: 'K čemu slouží?', how: 'Jak funguje?' },
  en: { what: 'What is a heat exchanger?', made: 'What is it made of?', purpose: 'What is it used for?', how: 'How does it work?' },
  de: { what: 'Was ist ein Wärmetauscher?', made: 'Woraus besteht er?', purpose: 'Wozu dient er?', how: 'Wie funktioniert er?' },
};

export const TITLES = { cz: 'Tepelný výměník', en: 'Heat Exchanger', de: 'Wärmetauscher' };

export const TAB_PHOTOS = {
  what:    '/f/4R/kondenzator-CZ.png',
  how:     '/f/4R/iStock-trubkový svazek výměníku .jpg',
  made:    '/f/4R/iStock-model trubkového výměníku.jpg',
  purpose: '/f/4R/iStock-vnitřek výměníku.jpg',
  
};

export const tabPhoto = (tab, lang) => {
  if (tab === 'what') return `/f/4R/kondenzator-${lang.toUpperCase()}.png`;
  return TAB_PHOTOS[tab];
};

export const PHOTO_SOURCES = {
  cz: {
    what:    'Grafika: www.svetenergie.cz (princip výměníku)',
    made:    'Ilustrativní obrázek: model trubkového výměníku',
    purpose: 'Ilustrativní obrázek: vnitřek výměníku',
    how:     'Ilustrativní obrázek: trubkový svazek výměníku',
  },
  en: {
    what:    'Graphics: www.svetenergie.cz (how a heat exchanger works)',
    made:    'Illustrative image: model of a tube heat exchanger',
    purpose: 'Illustrative image: inside the heat exchanger',
    how:     'Illustrative image: heat exchanger tube bundle',
  },
  de: {
    what:    'Grafik: www.svetenergie.cz (Prinzip des Wärmetauschers)',
    made:    'Illustration: Modell eines Rohrwärmetauschers',
    purpose: 'Illustration: Inneres des Wärmetauschers',
    how:     'Illustration: Rohrbündel des Wärmetauschers',
  },
};

export const CONTENT = {
  cz: {
    what: {
      intro: 'Tepelný výměník je zařízení, které umožňuje, aby se teplo předávalo z teplejší látky na chladnější. V elektrárnách se nejčastěji používají trubkové (nebo deskové) výměníky, kde si dvě látky předávají teplo přes kovovou stěnu a nemísí se.',
      body: 'Tepelný výměník je zařízení, které umožňuje, aby se teplo předávalo z teplejší látky na chladnější. V elektrárnách se nejčastěji používají trubkové (nebo deskové) výměníky, kde si dvě látky předávají teplo přes kovovou stěnu a nemísí se.\nV tepelné elektrárně propojuje různé části systému – vodu, páru i chladicí vodu. Díky výměníkům se pára po turbíně ochladí a změní zpět na vodu, nebo se voda předehřeje dřív, než vstoupí do kotle. Teplo se tak v elektrárně opakovaně využívá a zvyšuje se účinnost výroby.',
    },
    made: {
      intro: 'Tepelný výměník tvoří části, které usměrňují proudění pro účinné předávání tepla. Každá z nich pomáhá tomu, aby se energie využila co nejlépe.',
      body: 'Tepelný výměník tvoří části, které usměrňují proudění pro účinné předávání tepla. Každá z nich pomáhá tomu, aby se energie využila co nejlépe.\nZákladem je těleso výměníku, pevná konstrukce, která celý systém uzavírá a odděluje jednotlivé látky. Uvnitř se nachází trubkový svazek nebo deskový modul, kde si teplá a chladná látka předávají energii přes kovovou stěnu.\nVstupní a výstupní komory přivádějí látky na správné místo a přepážky zpomalují jejich proudění, aby mělo teplo čas přejít tam, kam má. Některé výměníky pracují jako chladiče, např. kondenzátor, ve kterém se pára ochlazením změní zpět na vodu.',
    },
    purpose: {
      intro: 'Tepelný výměník zajišťuje, aby se teplo v elektrárně bez užitku neztrácelo, ale stále se vracelo do oběhu. Je jedním z důvodů, proč může elektrárna pracovat efektivně.',
      body: 'Tepelný výměník zajišťuje, aby se teplo v elektrárně bez užitku neztrácelo, ale stále se vracelo do oběhu. Je jedním z důvodů, proč může elektrárna pracovat efektivně.\nDíky výměníkům pára po turbíně vychladne a zkapalní, voda se předehřívá před vstupem do kotle a celý systém funguje jako uzavřený koloběh. Elektrárna tak dokáže vyrobit více elektřiny ze stejného množství paliva. Bez tepelných výměníků by velká část energie jednoduše odešla pryč nevyužitá.',
    },
    how: {
      intro: 'Tepelný výměník funguje tak, že teplo přechází přes kovovou stěnu z horké látky na chladnější. U trubkových a deskových výměníků se látky nemísí, protože jsou od sebe odděleny právě touto stěnou. Existují ale i směšovací výměníky, kde se horké a chladnější médium mohou smíchat (a tím se teplo předá ještě rychleji).',
      body: 'Tepelný výměník funguje tak, že teplo přechází přes kovovou stěnu z horké látky na chladnější. U trubkových a deskových výměníků se média nemísí, protože jsou od sebe oddělena právě touto stěnou. Existují ale i směšovací výměníky, kde se horké a chladnější médium mohou smíchat (a tím se teplo předá ještě rychleji).\nUvnitř trubkového výměníku proudí například horká pára a studená voda odděleně. Mezi nimi je pevná kovová stěna, která vede teplo, ale obě média odděluje. Horká pára se postupně ochlazuje, studená voda se naopak ohřívá.\nV kondenzátoru (typicky trubkovém výměníku) pára po turbíně předá zbylé teplo chladicí vodě a změní se zpět na kapalnou vodu. Ta se pak vrací do oběhu a může znovu putovat elektrárnou.',
    },
  },
  en: {
    what: {
      intro: 'The heat exchanger is a device that allows heat to be transferred from a warmer substance to a cooler one. In power plants, tubular (or plate) heat exchangers are most commonly used, where two substances transfer heat through a metal wall and do not mix.',
      body: 'The heat exchanger is a device that allows heat to be transferred from a warmer substance to a cooler one. In power plants, tubular (or plate) heat exchangers are most commonly used, where two substances transfer heat through a metal wall and do not mix.\nIn a thermal power plant, they connect different parts of the system – water, steam and cooling water. Heat exchangers enable steam to be cooled after passing through the turbine and condensed back into water, or the water is preheated before it enters the boiler. The heat is thus reused in the power plant and the efficiency of production is increased.',
    },
    made: {
      intro: 'The heat exchanger consists of parts that direct the flow for efficient heat transfer. Each of them helps to make the best possible use of energy.',
      body: 'The heat exchanger consists of parts that direct the flow for efficient heat transfer. Each of them helps to make the best possible use of energy.\nThe basis is the heat exchanger body, a solid structure that encloses the entire system and separates the individual substances. Inside, there is a tube bundle or plate module where the hot and cold substances exchange the energy through a metal wall.\nThe inlet and outlet chambers bring the substances to the right place and the baffles slow down the flow so that the heat has time to go where it needs to go. Some heat exchangers work as coolers, e.g., a condenser in which the steam is cooled back to water.',
    },
    purpose: {
      intro: 'The heat exchanger ensures that the heat in the power plant is not wasted, but is still recirculated. This is one of the reasons why a power plant can operate efficiently.',
      body: 'The heat exchanger ensures that the heat in the power plant is not wasted, but is still recirculated. This is one of the reasons why a power plant can operate efficiently.\nHeat exchangers enable steam to cool down and condense after passing through the turbine; the water is preheated before entering the boiler and the whole system works as a closed circuit. The plant can thus produce more electricity from the same amount of fuel. Without heat exchangers, a large part of the energy would simply be wasted.',
    },
    how: {
      intro: 'Heat exchangers work by transferring heat from a hot substance to a cooler one through a metal wall. In tubular and plate heat exchangers, the substances do not mix because they are separated by this wall. However, there are also mixing exchangers where the hotter and cooler media can be mixed, thus transferring heat even faster.',
      body: 'Heat exchangers work by transferring heat from a hot substance to a cooler one through a metal wall. In tube and plate heat exchangers, the media do not mix because they are separated by this wall. However, there are also mixing exchangers where the hotter and cooler media can be mixed, thus transferring heat even faster.\nInside the tubular heat exchanger, for example, hot steam and cold water flow separately. There is a solid metal wall between them that conducts heat but separates the two media. The hot steam gradually cools down, while the cold water heats up.\nIn the condenser (typically a tube exchanger), the steam from the turbine transfers its remaining heat to the cooling water and condenses it back into water. It is then returned to circulation and can flow through the power plant again.',
    },
  },
  de: {
    what: {
      intro: 'Ein Wärmetauscher ist eine Anlage, die es ermöglicht, Wärme von einem wärmeren Medium auf ein kälteres zu übertragen. In Kraftwerken werden am häufigsten Rohr- (oder Platten-)Wärmetauscher eingesetzt, bei denen zwei Medien Wärme über eine metallische Trennwand austauschen, ohne sich zu vermischen.',
      body: 'Ein Wärmetauscher ist eine Anlage, die es ermöglicht, Wärme von einem wärmeren Medium auf ein kälteres zu übertragen. In Kraftwerken werden am häufigsten Rohr- (oder Platten-)Wärmetauscher eingesetzt, bei denen zwei Medien Wärme über eine metallische Trennwand austauschen, ohne sich zu vermischen.\nIm thermischen Kraftwerk verbindet der Wärmetauscher verschiedene Teile des Systems – Wasser, Dampf und Kühlwasser. Durch seinen Einsatz wird der Dampf nach der Turbine abgekühlt und wieder in Wasser umgewandelt, oder das Wasser wird vorgewärmt, bevor es in den Kessel gelangt. So wird die Wärme im Kraftwerk mehrfach genutzt und der Wirkungsgrad der Stromerzeugung erhöht.',
    },
    made: {
      intro: 'Ein Wärmetauscher besteht aus mehreren Bauteilen, die den Strömungsverlauf so lenken, dass eine möglichst effiziente Wärmeübertragung gewährleistet wird. Jedes dieser Bauteile trägt dazu bei, die Energie bestmöglich zu nutzen.',
      body: 'Ein Wärmetauscher besteht aus mehreren Bauteilen, die den Strömungsverlauf so lenken, dass eine möglichst effiziente Wärmeübertragung gewährleistet wird. Jedes dieser Bauteile trägt dazu bei, die Energie bestmöglich zu nutzen.\nDie Grundlage bildet das Gehäuse des Wärmetauschers – eine stabile Konstruktion, die das gesamte System umschließt und die einzelnen Medien voneinander trennt. Im Inneren befinden sich ein Rohrbündel oder ein Plattenmodul, in denen ein warmes und ein kaltes Medium über eine metallische Trennwand Energie austauschen.\nEin- und Auslasskammern führen die Medien an die richtigen Stellen, während Leitbleche ihre Strömung verlangsamen, damit die Wärme ausreichend Zeit hat, übertragen zu werden. Manche Wärmetauscher arbeiten als Kühler, beispielsweise der Kondensator, in dem der Dampf durch Abkühlung wieder zu Wasser wird.',
    },
    purpose: {
      intro: 'Der Wärmetauscher sorgt dafür, dass Wärme im Kraftwerk nicht ungenutzt verloren geht, sondern kontinuierlich in den Kreislauf zurückgeführt wird. Er ist einer der Gründe dafür, dass ein Kraftwerk effizient arbeiten kann.',
      body: 'Der Wärmetauscher sorgt dafür, dass Wärme im Kraftwerk nicht ungenutzt verloren geht, sondern kontinuierlich in den Kreislauf zurückgeführt wird. Er ist einer der Gründe dafür, dass ein Kraftwerk effizient arbeiten kann.\nDurch den Einsatz von Wärmetauschern kühlt der Dampf nach der Turbine ab und verflüssigt sich, Wasser wird vor dem Eintritt in den Kessel vorgewärmt und das gesamte System arbeitet als geschlossener Kreislauf. So kann ein Kraftwerk aus derselben Brennstoffmenge mehr elektrische Energie erzeugen. Ohne Wärmetauscher würde ein großer Teil der Energie ungenutzt verloren gehen.',
    },
    how: {
      intro: 'Ein Wärmetauscher funktioniert so, dass Wärme über eine metallische Trennwand von einem heißen auf ein kälteres Medium übertragen wird. Bei Rohr- und Plattenwärmetauschern vermischen sich die Medien nicht, da sie durch diese Wand voneinander getrennt sind. Es gibt jedoch auch Mischwärmetauscher, bei denen sich ein heißes und ein kälteres Medium direkt vermischen können – dadurch erfolgt die Wärmeübertragung noch schneller.',
      body: 'Ein Wärmetauscher funktioniert so, dass Wärme über eine metallische Trennwand von einem heißen auf ein kälteres Medium übertragen wird. Bei Rohr- und Plattenwärmetauschern vermischen sich die Medien nicht, da sie durch diese Wand voneinander getrennt sind.\nEs gibt jedoch auch Mischwärmetauscher, bei denen sich ein heißes und ein kälteres Medium direkt vermischen können – dadurch erfolgt die Wärmeübertragung noch schneller.\nIm Inneren eines Rohrwärmetauschers strömen beispielsweise heißer Dampf und kaltes Wasser getrennt voneinander. Zwischen ihnen befindet sich eine feste Metallwand, die Wärme leitet, die beiden Medien jedoch voneinander trennt. Der heiße Dampf kühlt sich dabei allmählich ab, während sich das kalte Wasser erwärmt.\nIm Kondensator – der typischerweise als Rohrwärmetauscher ausgeführt ist – gibt der Dampf nach der Turbine seine restliche Wärme an das Kühlwasser ab und wird wieder zu flüssigem Wasser. Dieses Wasser kehrt anschließend in den Kreislauf zurück und durchläuft das Kraftwerk erneut.',
    },
  },
};
