export const TABS = ['who', 'mix', 'heat', 'future'];

export const LABELS = {
  cz: { who: 'Kdo vyrábí elektřinu?', mix: 'Co je energetický mix?', heat: 'Proč potřebujeme teplo?', future: 'Kam energetika míří?' },
  en: { who: 'Who generates the electricity?', mix: 'What does energy mix mean?', heat: 'Why do we need heat?', future: 'In what direction is the energy sector heading?' },
  de: { who: 'Wer erzeugt Strom?', mix: 'Was ist der Energiemix?', heat: 'Warum brauchen wir Wärme?', future: 'Wohin entwickelt sich die Energiewirtschaft?' },
};

export const TITLES = { cz: 'Energetika', en: 'Energy Industry', de: 'Energiewirtschaft' };

export const GENERAL_TEXT = {
  cz: 'Tepelné elektrárny patří mezi základní pilíře výroby elektřiny. Využívají teplo k výrobě páry, která roztáčí turbínu a ta pohání generátor. Společně s jadernými, vodními a obnovitelnými zdroji tvoří energetický mix – tedy kombinaci zdrojů, ze kterých elektřina pochází. Tepelné elektrárny jsou důležité hlavně proto, že jejich výkon lze dobře řídit podle aktuální spotřeby elektřiny. Díky tomu pomáhají udržet stabilní dodávky elektřiny i ve chvílích, kdy jiné zdroje vyrábějí méně.',
  en: 'Thermal power plants are among the basic pillars of electricity production. They use heat to produce steam, which turns turbines that drive generators. Together with nuclear, hydro and renewable resources, they make up the energy mix – the combination of sources from which electricity comes. Thermal power plants are primarily important because their output can be well controlled according to the actual electricity consumption. This helps maintain a stable supply of electricity even when other sources produce less.',
  de: 'Thermische Kraftwerke gehören zu den grundlegenden Säulen der Stromerzeugung. Sie nutzen Wärme zur Erzeugung von Dampf, der eine Turbine antreibt, welche wiederum den Generator in Bewegung setzt. Gemeinsam mit Kernkraftwerken, Wasserkraftwerken und erneuerbaren Energiequellen bilden sie den Energiemix – also die Kombination verschiedener Quellen, aus denen elektrische Energie gewonnen wird. Thermische Kraftwerke sind besonders wichtig, weil sich ihre Leistung gut an den aktuellen Strombedarf anpassen lässt. Dadurch tragen sie dazu bei, eine stabile Stromversorgung auch dann zu gewährleisten, wenn andere Energiequellen weniger produzieren.',
};

export const OVERVIEW_PHOTO = '/f/8R/Elektrárna Prunéřov_dron_D.jpg';

export const OVERVIEW_SOURCE = {
  cz: 'Foto: ČEZ (elektrárna Prunéřov)',
  en: 'Photo: ČEZ (Prunéřov power plant)',
  de: 'Foto: ČEZ (Kraftwerk Prunéřov)',
};

export const TAB_PHOTOS = {
  who:    '/f/8R/8R_01_Kdo vyrábí elektřinu.jpg',
  mix:    '/f/8R/8R_02_Co je energetický mix.jpg',
  heat:   '/f/8R/8R_03_Proč potřebujeme teplo.jpeg',
  future: '/f/8R/iStock žárovka.jpg',
};

export const PHOTO_SOURCES = {
  who:    'Foto: ČEZ (rozvodna)',
  mix:    'Foto: ČEZ (druhy elektráren)',
  heat:   'Foto: ČEZ (JE Temelín)',
  future: 'Ilustrační obrázek: žárovka',
};

export const TAB_VIDEOS = {
  who: null,
  mix: null,
  heat: null,
  future: null,
};

export const CONTENT = {
  cz: {
    who: {
      intro: 'Elektřina, kterou denně používáme, vzniká na několika různých místech a různými způsoby.\nČeská republika si spotřebu elektřiny pokrývá sama, je soběstačná.',
      body: 'Česká republika je ve výrobě elektřiny soběstačná, část vyrobené elektřiny dokonce putuje i dál do světa. Ročně se u nás vyrobí přibližně 72 až 74 TWh elektřiny (výroba se může mezi roky lišit). Největší část dodávají jaderné elektrárny, které vyrobí zhruba 40 % celkové produkce. Významnou roli mají také tepelné elektrárny, zejména uhelné a plynové. Menší, ale rostoucí podíl připadá na obnovitelné zdroje, jako jsou vodní, solární, větrné elektrárny a biomasa.',
    },
    mix: {
      intro: 'Energetický mix ukazuje, z jakých zdrojů elektřina pochází a jaký mají podíl na celkové výrobě.\nJe to vyvážená kombinace zdrojů, které se musí vzájemně doplňovat.',
      body: 'V současnosti tvoří český energetický mix 42 % jádro, 35 % uhlí, 5 % zemní plyn a zhruba 16,5 % obnovitelné zdroje. Obnovitelné zdroje vyrábějí elektřinu hlavně ze slunce, vody, větru a biomasy, jejich výkon se ale mění podle počasí. Právě proto zůstávají stabilní zdroje důležitou součástí mixu – pomáhají vyrovnávat výkyvy výroby i spotřeby.',
    },
    heat: {
      intro: 'Bez tepla by velká část elektřiny vůbec nevznikla.\nTepelné i jaderné elektrárny totiž pracují na stejném principu – využívají teplo k vytvoření pohybu.',
      body: 'Tepelné i jaderné elektrárny pracují na stejném principu – využívají teplo k postupné přeměně přes energii pohybovou až na energii elektrickou. Spalováním uhlí, plynu nebo štěpením jádra vzniká teplo, které mění vodu na páru. Ta roztáčí turbínu spojenou s generátorem. Tepelné elektrárny jsou důležité hlavně proto, že jejich výkon lze poměrně rychle regulovat a přizpůsobit aktuální spotřebě. Navíc přibližně polovina tepla z některých elektráren nekončí bez užitku, ale slouží k vytápění měst v rámci kombinované výroby elektřiny a tepla.',
    },
    future: {
      intro: 'Česká energetika se postupně proměňuje, ale stabilita dodávek zůstává klíčová.\nBudoucnost není o jednom zdroji, ale o jejich chytré kombinaci.',
      body: 'Do roku 2030 se počítá s dalším růstem obnovitelných zdrojů, které by měly tvořit zhruba 20 až 30 % výroby elektřiny. Výroba z uhlí má naopak postupně klesat. Významnou roli má do budoucna sehrát jaderná energetika, včetně plánovaných nových bloků. Energetický mix se tak bude dál měnit, aby byl čistší, ale zároveň spolehlivý v každém ročním období.',
    },
  },
  en: {
    who: {
      intro: 'The electricity we use every day is generated in several different places and in different ways.\nThe Czech Republic covers its own electricity consumption and is self-sufficient.',
      body: 'The Czech Republic is self-sufficient in electricity production, and some of the electricity produced even is supplied abroad. Approximately 72 to 74 TWh of electricity is produced annually (production may vary from year to year). The largest part is supplied by nuclear power plants, which produce about 40% of the total output. Thermal power plants, especially coal and gas-fired plants, also play an important role. A smaller but growing share is accounted for by renewable sources such as hydro, solar, wind and biomass.',
    },
    mix: {
      intro: 'The energy mix shows from which sources the electricity comes and their share of total production.\nIt is a balanced combination of resources that must complement each other.',
      body: 'Currently, the Czech energy mix is 42% nuclear, 35% coal, 5% natural gas and about 16.5% renewables. Renewable energy sources mainly produce electricity from the sun, water, wind and biomass, but their output may vary according to the weather. This is why stable resources remain an important part of the mix – they help to smooth out fluctuations in production and consumption.',
    },
    heat: {
      intro: 'Without heat, much of the electricity would not be generated.\nThermal and nuclear power plants work on the same principle – they use heat to create motion.',
      body: 'Thermal and nuclear power plants work on the same principle – they use heat to convert kinetic energy to electrical energy. The combustion of coal, gas and nuclear fission produces heat that turns water into steam. This rotates a turbine connected to the generator. Thermal power plants are primarily important because their output can be regulated relatively quickly and adapted to current consumption. In addition, approximately half of the heat from some power plants is used to heat cities as part of combined heat and power generation rather than being wasted.',
    },
    future: {
      intro: 'The Czech energy sector is gradually transforming, but the stability of supply remains a key factor.\nThe future does not lie in the use of one source, but in a smart combination of them.',
      body: 'Renewable energy sources are expected to continue to grow until 2030, accounting for approximately 20–30% of electricity generation. Coal production, on the other hand, is expected to gradually decline. Nuclear power is expected to play a significant role in the future, including planned new units. The energy mix will continue to be cleaner but reliable in all seasons.',
    },
  },
  de: {
    who: {
      intro: 'Der Strom, den wir täglich nutzen, wird an verschiedenen Orten und auf unterschiedliche Weise erzeugt.\nDie Tschechische Republik deckt ihren Strombedarf selbst und ist in der Stromerzeugung weitgehend autark.',
      body: 'Die Tschechische Republik ist in der Stromerzeugung autark; ein Teil des produzierten Stroms wird sogar ins Ausland exportiert. Jährlich werden in Tschechien etwa 72 bis 74 TWh elektrische Energie erzeugt (die Produktion kann von Jahr zu Jahr variieren). Den größten Anteil liefern Kernkraftwerke mit rund 40 % der Gesamtproduktion. Eine bedeutende Rolle spielen außerdem thermische Kraftwerke, insbesondere Kohle- und Gaskraftwerke. Einen kleineren, jedoch wachsenden Anteil übernehmen erneuerbare Energiequellen wie Wasserkraft-, Solar- und Windkraftanlagen sowie Biomasse.',
    },
    mix: {
      intro: 'Der Energiemix zeigt, aus welchen Quellen Strom stammt und welchen Anteil sie an der gesamten Stromerzeugung haben.\nEr ist eine ausgewogene Kombination verschiedener Energiequellen, die sich gegenseitig ergänzen müssen.',
      body: 'Derzeit besteht der Energiemix in Tschechien zu etwa 42 % aus Kernenergie, zu 35 % aus Kohle, zu 5 % aus Erdgas und zu rund 16,5 % aus erneuerbaren Energiequellen. Erneuerbare Energien erzeugen Strom vor allem aus Sonne, Wasser, Wind und Biomasse, ihre Leistung schwankt jedoch je nach Wetterbedingungen. Gerade deshalb bleiben stabile Energiequellen ein wichtiger Bestandteil des Energiemix – sie helfen, Schwankungen in der Stromerzeugung und im Verbrauch auszugleichen.',
    },
    heat: {
      intro: 'Ohne Wärme würde ein großer Teil der elektrischen Energie überhaupt nicht entstehen.\nSowohl thermische als auch Kernkraftwerke arbeiten nach demselben Prinzip – sie nutzen Wärme, um Bewegung zu erzeugen.',
      body: 'Thermische und Kernkraftwerke arbeiten nach demselben Grundprinzip – sie nutzen Wärme, um Energie schrittweise von der thermischen über die mechanische in elektrische Energie umzuwandeln. Durch die Verbrennung von Kohle oder Erdgas sowie durch die Kernspaltung entsteht Wärme, die Wasser in Dampf verwandelt. Dieser treibt eine mit dem Generator verbundene Turbine an. Thermische Kraftwerke sind besonders wichtig, weil sich ihre Leistung vergleichsweise schnell regulieren und an den aktuellen Strombedarf anpassen lässt. Darüber hinaus wird in einigen Anlagen etwa die Hälfte der erzeugten Wärme nicht ungenutzt abgeführt, sondern im Rahmen der Kraft-Wärme-Kopplung zur Beheizung von Städten eingesetzt.',
    },
    future: {
      intro: 'Die tschechische Energiewirtschaft befindet sich im Wandel, doch die Versorgungssicherheit bleibt entscheidend.\nDie Zukunft liegt nicht in einer einzelnen Energiequelle, sondern in ihrer intelligenten Kombination.',
      body: 'Bis zum Jahr 2030 wird mit einem weiteren Ausbau der erneuerbaren Energien gerechnet, die etwa 20 bis 30 % der Stromerzeugung ausmachen sollen. Die Stromproduktion aus Kohle hingegen soll schrittweise zurückgehen. Eine wichtige Rolle wird künftig auch die Kernenergie spielen, einschließlich geplanter neuer Reaktorblöcke. Der Energiemix wird sich daher weiter verändern – mit dem Ziel, sauberer zu werden und zugleich in allen Jahreszeiten zuverlässig zu bleiben.',
    },
  },
};
