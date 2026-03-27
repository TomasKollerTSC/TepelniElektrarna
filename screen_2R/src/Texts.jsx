export const TABS = ['what', 'made', 'purpose', 'how'];

export const LABELS = {
  cz: { what: 'Co je kotel?', made: 'Z čeho je?', purpose: 'K čemu slouží?', how: 'Jak funguje?' },
  en: { what: 'What is a boiler?', made: 'What is it made of?', purpose: 'What is it used for?', how: 'How does it work?' },
  de: { what: 'Was ist ein Kessel?', made: 'Woraus besteht er?', purpose: 'Wozu dient er?', how: 'Wie funktioniert er?' },
};

export const TITLES = { cz: 'Kotel', en: 'Boiler', de: 'Kessel' };

export const GENERAL_TEXT = {
  cz: 'Kotlem v tepelné elektrárně všechno začíná. Právě tady se chemická energie paliva mění na teplo. Spalováním uhlí, zemního plynu nebo biomasy se ohřívá demineralizovaná (chemicky upravená) voda v systému trubek, která se postupně mění na páru. Kotel je navržen tak, aby využil co nejvíce vzniklého tepla a účinně ho předal vodě. Jeho úkol je vždy stejný – připravit páru s dostatečnou teplotou a tlakem pro další části elektrárny.',
  en: 'Everything begins with the boiler in a thermal power plant. This is where the chemical energy of the fuel is converted into heat. The combustion of coal, natural gas or biomass heats demineralised (chemically treated) water in a system of pipes, gradually converting it into steam. The boiler is designed to utilise as much of the generated heat as possible and efficiently transfer it to the water. Its task is always the same – to produce steam with sufficient temperature and pressure for other parts of the plant.',
  de: 'Im Kessel eines thermischen Kraftwerks beginnt der gesamte Prozess. Hier wird die chemische Energie des Brennstoffs in Wärme umgewandelt. Durch die Verbrennung von Kohle, Erdgas oder Biomasse wird demineralisiertes (chemisch aufbereitetes) Wasser in einem Rohrsystem erhitzt, bis es sich in Dampf verwandelt. Der Kessel ist so konstruiert, dass möglichst viel der entstehenden Wärme genutzt und effizient an das Wasser übertragen wird. Seine Aufgabe ist stets dieselbe: Dampf mit ausreichend hoher Temperatur und ausreichendem Druck für die weiteren Anlagenbereiche bereitzustellen.',
};

export const TAB_PHOTOS = {
  what:    '/f/2R/Elektrárna Ledvice_dron.png',
  made:    '/f/2R/FOTO_10_pohled do kotle.jpg',
  purpose: '/f/2R/FOTO_11_plynové hořáky kotle.jpg',
  how:     '/f/2R/FOTO_10_pohled do kotle.jpg',
};

export const PHOTO_SOURCES = {
  what:    'Lorem ipsum dolor sit amet',
  made:    'Lorem ipsum dolor sit amet',
  purpose: 'Lorem ipsum dolor sit amet',
  how:     'Lorem ipsum dolor sit amet',
};

export const CONTENT = {
  cz: {
    what: {
      intro: 'Kotel je zařízení, které mění chemickou energii paliva na teplo potřebné k výrobě páry. Podle použitého paliva se může lišit konstrukcí i provozem, ale cíl zůstává stejný.',
      body: 'Kotel je zařízení, které mění chemickou energii paliva na teplo potřebné k výrobě páry.\nPodle použitého paliva se může lišit konstrukcí i provozem, ale cíl zůstává stejný.\nUhlí, zemní plyn i biomasa uvolňují teplo jiným způsobem. Konstrukce kotle se proto přizpůsobuje tomu, jak palivo hoří, jaké teploty dosahuje a jaké zbytky spalováním vznikají. U uhlí a biomasy vzniká popel a prach, u zemního plynu pevné zbytky nevznikají. Ať už se spaluje cokoliv, výsledkem musí být stabilní proud páry o stanovených parametrech, který pokračuje do turbíny.',
    },
    made: {
      intro: 'Kotel se skládá z několika částí, které předávají teplo z horkých spalin do vody a páry a zajišťují bezpečný odvod zbytků spalování. Jednotlivé části se mohou lišit podle toho, jestli se spaluje uhlí, plyn nebo biomasa.',
      body: 'Kotel se skládá z několika částí, které předávají teplo z horkých spalin do vody a páry a zajišťují odvod zbytků spalování.\nKaždá z nich pracuje trochu jinak podle typu paliva.\n\nSpalovací komora (topeniště)\nMísto, kde palivo hoří.\nU uhlí a biomasy se zde spaluje pevné palivo a vzniká popel a prach. Topeniště je proto rozměrné a uzpůsobené k odvodu pevných zbytků.\nU plynu spalování probíhá v hořácích, bez vzniku popela a s rovnoměrným plamenem.\n\nVýparník (vodní trubky)\nZde voda přijímá teplo ze spalin a mění se na páru.\nU kotlů na uhlí a biomasu musí trubky odolávat zanášení popelem. U plynových kotlů je přenos tepla čistší a rovnoměrnější.\n\nPřehřívák páry\nZvyšuje teplotu páry nad bod nasycení (nad teplotu varu při daném tlaku).\nVyšší teplota páry znamená vyšší účinnost turbíny bez ohledu na typ paliva.\n\nPřihřívák páry\nSlouží k opětovnému ohřevu páry, která už částečně expandovala v turbíně.\nPoužívá se pro zvýšení účinnosti ve výkonově větších elektrárnách.\n\nEkonomizér\nTeplo, které by jinak uniklo komínem, nepřijde nazmar. Spaliny v něm ještě předehřívají vodu. U uhlí a biomasy tím šetří palivo, u plynu zvyšuje celkovou účinnost.\n\nZařízení pro zachytávání zbytků spalování\nU uhlí a biomasy zachytává popel a prach, který odvádějí pryč k dalšímu využití nebo bezpečnému uložení. Při spalování plynu pevný odpad nevzniká, proto tato část v plynovém kotli není.',
    },
    purpose: {
      intro: 'Kotel dodává páru pro turbínu. Parametry páry (tlak a teplota) mají velký vliv na výkon a účinnost celé elektrárny.',
      body: 'Kotel dodává páru pro turbínu. Parametry páry (tlak a teplota) mají velký vliv na výkon i účinnost celé elektrárny.\nKotel je „zdroj tepla" parního oběhu – bez něj by nevznikla pára, která pohání turbínu. Uhelné a biomasové kotle obvykle mění výkon pomaleji, protože spalují pevná paliva a mají časovou setrvačnost, zatímco plynové zdroje se regulují rychleji. U biomasy je navíc potřeba pečlivě hlídat kvalitu paliva (vlhkost, složení), aby spalování probíhalo stabilně. Ve všech případech platí: cílem je bezpečný provoz, dobrá účinnost a dodržení požadavků na čistotu spalin.',
    },
    how: {
      intro: 'Palivo se spaluje, voda se mění na páru a zbytky spalování se oddělují. Způsob, jakým k tomu dochází, se liší podle paliva.',
      body: 'Palivo se spaluje, voda se mění na páru a zbytky spalování se oddělují.\nZpůsob, jakým k tomu dochází, se liší podle paliva.\nU uhlí a biomasy po hoření vzniká popel, který se zachytí a odváží k dalšímu využití nebo bezpečnému uložení. U plynu vznikají spaliny bez pevných zbytků. Spaliny se upravují tak, aby provoz splnil stanovené limity. Zbytkové teplo se vrací zpět do procesu – kotel se snaží využít co nejvíce energie z paliva.\nPára následně míří do turbíny, kde expanduje a roztáčí hřídel. Po projití turbínou se pára ochladí v kondenzátoru na vodu a ta se znovu vrací do kotle.',
    },
  },
  en: {
    what: {
      intro: 'The boiler is a device that converts the chemical energy of the fuel into the heat needed to produce steam. The design and operation may vary depending on the fuel used, but the aim remains the same.',
      body: 'The boiler is a device that converts the chemical energy of the fuel into the heat needed to produce steam.\nThe design and operation may vary depending on the fuel used, but the aim remains the same.\nCoal, natural gas and biomass release heat in different ways. The design of the boiler is therefore adapted to the way the fuel burns, the temperature it reaches and the residues produced by combustion. Coal and biomass produce ash and dust; natural gas does not produce solid residues. Whatever is being burned, the result must be a steady stream of steam with defined parameters that is fed to the turbine.',
    },
    made: {
      intro: 'The boiler consists of several parts that transfer the heat from the hot flue gases to water and steam and ensure the safe removal of combustion residues. The individual parts may differ depending on whether coal, gas or biomass is burned.',
      body: 'The boiler consists of several parts that transfer the heat from the hot flue gases to water and steam and ensure the removal of combustion residues.\nEach of the parts works a little differently depending on the type of fuel.\n\nCombustion chamber (furnace)\nThe place where the fuel burns.\nIn the case of coal and biomass, solid fuel is burned and ash and dust are produced. The furnace is therefore large and adapted for the removal of solid residues.\nIn the case of gas, combustion takes place in burners, without ash formation and with a uniform flame.\n\nEvaporator (water pipes)\nHere the water receives heat from the flue gases and is converted into steam.\nFor coal and biomass boilers, the pipes must be able to withstand blocking with ash. For gas boilers, the heat transfer is cleaner and more uniform.\n\nSuperheater\nRaises the steam temperature above the saturation point (above the boiling point at a given pressure).\nHigher steam temperature means higher turbine efficiency regardless of fuel type.\n\nSteam reheater\nUsed to reheat steam that has partially expanded in the turbine.\nIt is used to increase efficiency in larger power plants.\n\nEconomizer\nHeat that would otherwise escape through the chimney is not wasted. The flue gases in it preheat the water. For coal and biomass, this saves fuel; for gas it increases overall efficiency.\n\nCombustion residue collection equipment\nFor coal and biomass it captures ash and dust, which are then removed for further use or safe storage. No solid waste is generated during gas combustion, so this part is not included in the gas boiler.',
    },
    purpose: {
      intro: 'The boiler supplies steam to the turbine. The steam parameters (pressure and temperature) have a great influence on the performance and efficiency of the whole plant.',
      body: 'The boiler supplies steam to the turbine. The steam parameters (pressure and temperature) have a great influence on the performance and efficiency of the entire plant.\nThe boiler is the \'heat source\' of the steam cycle – without it, the steam that drives the turbine would not be generated. Coal and biomass boilers typically change the power output more slowly because they burn solid fuels and have time inertia, while gas-fired sources regulate more quickly. In addition, the quality of the fuel (moisture content, composition) must be carefully monitored to ensure stable combustion. In all cases the aim is safe operation, good efficiency and compliance with the requirements for clean flue gases.',
    },
    how: {
      intro: 'The fuel is burned, the water is converted to steam and the combustion residues are separated. The way this happens depends on the fuel.',
      body: 'The fuel is burned, the water is converted to steam and the combustion residues are separated.\nThe way this happens depends on the fuel.\nCoal and biomass produce ash during combustion, which is captured and transported for further use or safe storage. Gas produces combustion gases without solid residues. The flue gases are treated so that the plant operations comply with specified limits. The residual heat is returned to the process – the boiler tries to use as much energy as possible from the fuel.\nThe steam then goes into the turbine where it expands and spins the shaft. After passing through the turbine, the steam is cooled in the water condenser and returned to the boiler.',
    },
  },
  de: {
    what: {
      intro: 'Der Kessel ist eine Anlage, die die chemische Energie des Brennstoffs in Wärme umwandelt, die zur Erzeugung von Dampf benötigt wird. Je nach eingesetztem Brennstoff können sich Aufbau und Betriebsweise unterscheiden – das Ziel bleibt jedoch immer gleich.',
      body: 'Der Kessel ist eine Anlage, die die chemische Energie des Brennstoffs in Wärme umwandelt, die zur Erzeugung von Dampf benötigt wird.\nJe nach eingesetztem Brennstoff können sich Aufbau und Betriebsweise unterscheiden – das Ziel bleibt jedoch immer gleich.\nKohle, Erdgas und Biomasse setzen Wärme auf unterschiedliche Weise frei. Die Konstruktion des Kessels wird daher an das jeweilige Brennverhalten angepasst – daran, wie der Brennstoff verbrennt, welche Temperaturen erreicht werden und welche Rückstände dabei entstehen.\nBei Kohle und Biomasse fallen Asche und Staub an, während bei der Verbrennung von Erdgas keine festen Rückstände entstehen.\nUnabhängig vom Brennstoff muss das Ergebnis stets ein stabiler Dampfstrom mit definierten Druck- und Temperaturwerten sein, der anschließend in die Turbine geleitet wird.',
    },
    made: {
      intro: 'Der Kessel besteht aus mehreren Bauteilen, die die Wärme der heißen Abgase auf Wasser und Dampf übertragen und einen sicheren Abtransport der Verbrennungsrückstände gewährleisten. Die einzelnen Komponenten können sich je nachdem, ob Kohle, Erdgas oder Biomasse eingesetzt wird, in ihrer Bauweise und Funktionsweise unterscheiden.',
      body: 'Der Kessel besteht aus mehreren Bauteilen, die die Wärme der heißen Abgase auf Wasser und Dampf übertragen und den Abtransport der Verbrennungsrückstände sicherstellen.\nJede dieser Komponenten arbeitet abhängig vom Brennstoff auf leicht unterschiedliche Weise.\n\nBrennkammer (Feuerraum)\nHier wird der Brennstoff verbrannt.\nBei Kohle und Biomasse werden feste Brennstoffe eingesetzt, wobei Asche und Staub entstehen. Der Feuerraum ist daher groß dimensioniert und für den Abtransport fester Rückstände ausgelegt.\nBei Erdgas erfolgt die Verbrennung in Brennern – ohne Aschebildung und mit gleichmäßigem Flammenbild.\n\nVerdampfer (Wasserrohre)\nIn diesem Bereich nimmt das Wasser die Wärme der Abgase auf und wandelt sich in Dampf um.\nBei Kohle- und Biomassekesseln müssen die Rohre widerstandsfähig gegen Ablagerungen durch Asche sein.\nIn Gaskesseln erfolgt die Wärmeübertragung sauberer und gleichmäßiger.\n\nDampfüberhitzer\nEr erhöht die Temperatur des Dampfes über den Sättigungspunkt hinaus (also über die Siedetemperatur bei dem jeweiligen Druck).\nEine höhere Dampftemperatur steigert den Wirkungsgrad der Turbine – unabhängig vom verwendeten Brennstoff.\n\nZwischenüberhitzer\nEr dient dazu, Dampf, der in der Turbine bereits teilweise expandiert ist, erneut zu erhitzen.\nDiese Technik wird vor allem in leistungsstärkeren Kraftwerken eingesetzt, um den Gesamtwirkungsgrad weiter zu erhöhen.\n\nEconomiser (Speisewasservorwärmer)\nWärme, die sonst durch den Schornstein verloren ginge, wird hier weiter genutzt. Die Abgase erwärmen das Speisewasser vor, bevor es in den Kessel gelangt. Bei Kohle- und Biomasseanlagen spart dies Brennstoff, bei Gasanlagen erhöht es den Gesamtwirkungsgrad.\n\nAnlagen zur Abgasreinigung\nBei Kohle und Biomasse werden Asche und Staub abgeschieden und entweder weiterverwertet oder sicher entsorgt. Bei der Verbrennung von Erdgas entstehen keine festen Rückstände, weshalb diese Einrichtungen in Gaskesseln nicht erforderlich sind.',
    },
    purpose: {
      intro: 'Der Kessel liefert den Dampf für die Turbine. Die Dampfparameter – insbesondere Druck und Temperatur – haben großen Einfluss auf Leistung und Wirkungsgrad des gesamten Kraftwerks.',
      body: 'Der Kessel liefert den Dampf für die Turbine. Die Dampfparameter – insbesondere Druck und Temperatur – haben großen Einfluss auf Leistung und Wirkungsgrad des gesamten Kraftwerks. Der Kessel ist die \u201EWärmequelle\u201C des Dampfkraftprozesses – ohne ihn entstünde kein Dampf, der die Turbine antreibt. Kohle- und Biomassekessel verändern ihre Leistung in der Regel langsamer, da sie feste Brennstoffe verbrennen und eine gewisse thermische Trägheit aufweisen. Gasanlagen hingegen lassen sich schneller regeln. Bei Biomasse ist zusätzlich eine sorgfältige Kontrolle der Brennstoffqualität (Feuchtegehalt, Zusammensetzung) erforderlich, damit die Verbrennung stabil verläuft. In allen Fällen gilt: Ziel sind ein sicherer Betrieb, ein hoher Wirkungsgrad und die Einhaltung der Emissionsanforderungen.',
    },
    how: {
      intro: 'Der Brennstoff wird verbrannt, Wasser verwandelt sich in Dampf und die Verbrennungsrückstände werden abgeschieden. Wie dieser Prozess abläuft, hängt vom jeweiligen Brennstoff ab.',
      body: 'Der Brennstoff wird verbrannt, Wasser verwandelt sich in Dampf und die Verbrennungsrückstände werden abgeschieden. Wie dieser Prozess abläuft, hängt vom jeweiligen Brennstoff ab. Bei Kohle und Biomasse entsteht nach der Verbrennung Asche, die aufgefangen und entweder weiterverwertet oder sicher entsorgt wird. Bei Erdgas entstehen Abgase ohne feste Rückstände. Diese werden so behandelt, dass die vorgeschriebenen Emissionsgrenzwerte eingehalten werden. Auch die verbleibende Wärme wird möglichst wieder in den Prozess zurückgeführt – der Kessel ist darauf ausgelegt, so viel Energie wie möglich aus dem Brennstoff zu nutzen. Der erzeugte Dampf strömt anschließend in die Turbine, wo er expandiert und die Welle in Rotation versetzt. Nach dem Durchströmen der Turbine wird der Dampf im Kondensator wieder zu Wasser abgekühlt und dem Kessel erneut zugeführt.',
    },
  },
};
