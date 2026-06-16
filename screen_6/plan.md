Obrazovka 6
-	Spustí se animace CHLAD_1   (úvodní obrázek - bude animováno - pohyb šipek, otáčení čerpadla)
-	V textovém poli dle zvolené jazykové mutace bude umístěn text.
-	 
-	Do pole pro text je zobrazen text dle příslušné jazykové mutace.
Popis animace: - pro animátora
1.	Okruh – LED pásek shora -> bude navazovat LED pásek na animaci - nádoba kde nahoře červené, dle modré - budou se pohybovat šipky v animaci + šipky stoupající páry z chladící věže, zároveň se bude otáčet symbol šipky - čerpadlo.


Text:
Čj	Aj	Nj
Pára, která prošla parní turbínou je ochlazena v kondenzátoru na kapalnou vodu. Chladící okruh doplňuje chladící věž. Voda z okruhu je v kotli opět ohřátá a přeměněná na páru. 	The steam that has passed through the steam turbine is cooled into liquid water in a condenser. A cooling tower completes the cooling circuit. The water from the circuit is reheated and converted to steam in the boiler.	Der Dampf, der die Turbine durchströmt hat, wird im Kondensator wieder zu Wasser abgekühlt. Der Kühlkreislauf wird durch den Kühlturm unterstützt. Das Wasser wird im Kessel erneut erhitzt und wieder in Dampf umgewandelt.


-	Led pásek vedoucí od komory 7 do 6 se rozsvítí a pulsuje – barva červená
-	Led pásek vedoucí od komory 6 do 2 se rozsvítí a pulsuje – barva modrá
Animace a svícení LED běží stále dokola dokud nedojde buď k ukončení hry, tedy že návštěvník přestane hrát nebo do odeslání energie do sítě. Poté se vrací do “spícího režimu”.
LED pásek na zadní straně exponátu se rozsvítí v momentě, kdy se rozsvítí k němu paralelní pásek na přední straně. Zrcadlení probíhá i u barev - část LED pásku je červená, v místě, kde se na druhé straně exponátu nachází dolní okraj obrazovky č.6 , by na zadní měl změnit barvu na modrou, která pokračuje až k oknu 2R. 
-	V průběhu celé hry se zároveň v části 9 exponátu odehrává:
LED kulatá světla (levá část) jsou rozdělena na tři stejné oblasti na výšku.  Spodní oblast (třetina) odpovídá hře na OLED 2, prostřední oblast hře na OLED 4 a horní část průběhu třetí části hry (6, 7 a 8) V průběhu  hry v příslušné oblasti žlutě [PO14.1]problikávají světla – náhodně.Po dokončení části hry se všechna světla v příslušné oblasti trvale rozsvítí žlutě. 
Po úspěšném dokončení hry v prostřední oblasti (OLED 4) se  ve sloupci vpravo postupně odspodu rozsvěcují obdélníková světla  - zeleně - rychlost rozsvícení - celý sloupec za x s.
-	Třetí část hry končí rozsvícením posledního obdélníkového světla. Po dokončení hry se  podsvítí tlačítko pro odeslání energie do sítě a tlačítko se aktivuje. Přehraje se AUDIO_3[PO15.1][JK15.2] - úspěšné dokončení 3/3 hry  (“pozitivně” znějící pípnutí max 2 s) v pravém reproduktoru exponátu.[PO16.1][JK16.2]

Pokud návštěvník neodešle energii do 30 s od rozsvícení všech obdélníkových světel – tzn. nezmačkne tlačítko s bleskem, všechna světla se vrátí do výchozího zhasnutého stavu, OLED2 – na “úvodní obrazovku”, zbytek - “spící režim”.
Po odeslání energie do sítě se přehraje AUDIO_7. [PO17.1][JK17.2](zvuk odeslání energie do sítě - elektřina ) pravý reprodutor exponátu.
