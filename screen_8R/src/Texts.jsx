export const TABS = ['who', 'mix', 'heat', 'future'];

export const LABELS = {
  cz: { who: 'Kdo vyrábí elektřinu?', mix: 'Co je energetický mix?', heat: 'Proč potřebujeme teplo?', future: 'Kam energetika míří?' },
  en: { who: 'Who generates electricity?', mix: 'What is the energy mix?', heat: 'Why do we need heat?', future: 'Where is energy heading?' },
  de: { who: 'Wer erzeugt Strom?', mix: 'Was ist der Energiemix?', heat: 'Warum brauchen wir Wärme?', future: 'Wohin geht die Energiewirtschaft?' },
};

export const TITLES = { cz: 'Energetika', en: 'Energy Industry', de: 'Energiewirtschaft' };

export const TAB_PHOTOS = {
  who:    '/f/8R/8R_01_Kdo vyrábí elektřinu.jpg',
  mix:    '/f/8R/8R_02_Co je energetický mix.jpg',
  heat:   '/f/8R/8R_03_Proč potřebujeme teplo.jpeg',
  future: '/f/8R/Kam energetika míří.JPG',
};

export const CONTENT = {
  cz: {
    who: {
      intro: 'Elektřina, kterou denně používáme, vzniká na několika různých místech a různými způsoby. Česká republika si spotřebu elektřiny pokrývá sama – je soběstačná.',
      body: 'Největší podíl elektřiny v ČR pochází z jaderných elektráren (přibližně 40 %). Důležitou roli stále hrají uhelné elektrárny, i když jejich podíl postupně klesá. Plyn a obnovitelné zdroje – solární, větrné a vodní elektrárny spolu s biomasou – tvoří rostoucí část mixu. ČR dokonce část elektřiny vyváží do zahraničí. Síť přenosových vedení a transformátorů zajišťuje, aby elektřina bezpečně doputovala ke každému spotřebiteli.',
    },
    mix: {
      intro: 'Energetický mix ukazuje, z jakých zdrojů elektřina pochází a jaký mají podíl na celkové výrobě. Je to vyvážená kombinace zdrojů, které se musí vzájemně doplňovat.',
      body: 'Jaderná energie tvoří přibližně 42 % výroby elektřiny v ČR a je jejím největším zdrojem. Uhlí představuje asi 35 %, zemní plyn přibližně 5 %. Obnovitelné zdroje (slunce, vítr, voda, biomasa) dosahují kolem 16,5 %. Různé zdroje se doplňují: obnovitelné zdroje jsou ekologické, ale závislé na počasí. Jaderné a tepelné elektrárny poskytují stabilní základní výkon. Správný mix zajišťuje dodávku elektřiny za každého počasí.',
    },
    heat: {
      intro: 'Bez tepla by velká část elektřiny vůbec nevznikla. Tepelné i jaderné elektrárny totiž pracují na stejném principu – využívají teplo k vytvoření pohybu.',
      body: 'Spalování uhlí, plynu nebo biomasy – případně štěpení jader uranu – uvolní teplo. Teplo přemění vodu na páru. Pára roztočí turbínu, turbína pohání generátor. Tepelné elektrárny navíc umožňují rychlou regulaci výkonu. Díky kombinované výrobě tepla a elektřiny je možné využít až 50 % tepla pro zásobování měst teplem. To zvyšuje celkovou účinnost a snižuje emise.',
    },
    future: {
      intro: 'Česká energetika se postupně proměňuje, ale stabilita dodávek zůstává klíčová. Budoucnost není o jednom zdroji, ale o jejich chytré kombinaci.',
      body: 'Do roku 2030 by obnovitelné zdroje měly tvořit 20–30 % výroby. Uhlí bude postupně utlumováno. Jaderná energetika má v budoucnosti klíčovou roli – v ČR jsou plánované nové bloky. Mix se bude stávat čistším, ale základní požadavek zůstane: bezpečná a spolehlivá dodávka elektřiny celý rok, za každého počasí. Chytrá kombinace jaderné, plynové a obnovitelné energie je cestou vpřed.',
    },
  },
  en: {
    who: {
      intro: 'The electricity we use every day is generated in several different places and in different ways. The Czech Republic covers its own electricity consumption and is self-sufficient.',
      body: 'The largest share of electricity in the Czech Republic comes from nuclear power plants (approximately 40%). Coal-fired power plants still play an important role, although their share is gradually declining. Gas and renewables – solar, wind and hydro power plants along with biomass – form a growing part of the mix. The Czech Republic even exports part of its electricity. The network of transmission lines and transformers ensures that electricity safely reaches every consumer.',
    },
    mix: {
      intro: 'The energy mix shows from which sources the electricity comes and their share of total production. It is a balanced combination of resources that must complement each other.',
      body: 'Nuclear energy accounts for approximately 42% of Czech electricity production and is its largest source. Coal accounts for about 35%, natural gas about 5%. Renewables (sun, wind, water, biomass) reach around 16.5%. Different sources complement each other: renewables are ecological but weather-dependent. Nuclear and thermal plants provide stable base power. The right mix ensures electricity supply in any weather.',
    },
    heat: {
      intro: 'Without heat, much of the electricity would not be generated. Thermal and nuclear power plants work on the same principle – they use heat to create motion.',
      body: 'Burning coal, gas or biomass – or splitting uranium nuclei – releases heat. Heat converts water into steam. Steam turns the turbine, the turbine drives the generator. Thermal power plants also enable rapid output regulation. Through combined heat and power generation, up to 50% of the heat can be used to supply cities with heating. This increases overall efficiency and reduces emissions.',
    },
    future: {
      intro: 'The Czech energy sector is gradually transforming, but the stability of supply remains a key factor. The future does not lie in the use of one source, but in a smart combination of them.',
      body: 'By 2030, renewables should account for 20-30% of production. Coal will be gradually phased out. Nuclear energy has a key role in the future – new units are planned in the Czech Republic. The mix will become cleaner, but the basic requirement will remain: safe and reliable electricity supply all year, in any weather. A smart combination of nuclear, gas and renewable energy is the way forward.',
    },
  },
  de: {
    who: {
      intro: 'Der Strom, den wir täglich nutzen, wird an verschiedenen Orten und auf unterschiedliche Weise erzeugt. Die Tschechische Republik deckt ihren Strombedarf selbst und ist in der Stromerzeugung weitgehend autark.',
      body: 'Der größte Anteil des Stroms in der Tschechischen Republik stammt aus Kernkraftwerken (ca. 40 %). Kohlekraftwerke spielen nach wie vor eine wichtige Rolle, obwohl ihr Anteil schrittweise sinkt. Gas und erneuerbare Energien – Solar-, Wind- und Wasserkraftwerke sowie Biomasse – bilden einen wachsenden Teil des Energiemixes. Die Tschechische Republik exportiert sogar einen Teil ihres Stroms. Das Netz aus Übertragungsleitungen und Transformatoren sorgt dafür, dass Strom sicher zu jedem Verbraucher gelangt.',
    },
    mix: {
      intro: 'Der Energiemix zeigt, aus welchen Quellen Strom stammt und welchen Anteil sie an der Gesamterzeugung haben. Er ist eine ausgewogene Kombination verschiedener Energiequellen, die sich gegenseitig ergänzen müssen.',
      body: 'Kernenergie macht etwa 42 % der tschechischen Stromerzeugung aus und ist die größte Quelle. Kohle hat einen Anteil von ca. 35 %, Erdgas ca. 5 %. Erneuerbare Energien (Sonne, Wind, Wasser, Biomasse) erreichen rund 16,5 %. Verschiedene Quellen ergänzen sich: Erneuerbare sind umweltfreundlich, aber wetterabhängig. Kern- und Wärmekraftwerke liefern stabile Grundlastleistung. Der richtige Mix gewährleistet die Stromversorgung bei jedem Wetter.',
    },
    heat: {
      intro: 'Ohne Wärme würde ein großer Teil der elektrischen Energie überhaupt nicht entstehen. Sowohl thermische als auch Kernkraftwerke arbeiten nach demselben Prinzip – sie nutzen Wärme, um Bewegung zu erzeugen.',
      body: 'Das Verbrennen von Kohle, Gas oder Biomasse – oder die Spaltung von Urankernen – setzt Wärme frei. Die Wärme wandelt Wasser in Dampf um. Der Dampf dreht die Turbine, die Turbine treibt den Generator an. Wärmekraftwerke ermöglichen zudem eine schnelle Leistungsregelung. Durch Kraft-Wärme-Kopplung können bis zu 50 % der Wärme für die Fernwärmeversorgung von Städten genutzt werden. Dies erhöht den Gesamtwirkungsgrad und senkt die Emissionen.',
    },
    future: {
      intro: 'Die tschechische Energiewirtschaft befindet sich im Wandel, doch die Versorgungssicherheit bleibt entscheidend. Die Zukunft liegt nicht in einer einzelnen Energiequelle, sondern in ihrer intelligenten Kombination.',
      body: 'Bis 2030 sollen erneuerbare Energien 20-30 % der Erzeugung ausmachen. Kohle wird schrittweise auslaufen. Kernenergie spielt in der Zukunft eine Schlüsselrolle – in der Tschechischen Republik sind neue Blöcke geplant. Der Mix wird sauberer werden, aber die Grundanforderung bleibt: sichere und zuverlässige Stromversorgung das ganze Jahr über, bei jedem Wetter. Eine intelligente Kombination aus Kern-, Gas- und erneuerbarer Energie ist der Weg nach vorn.',
    },
  },
};
