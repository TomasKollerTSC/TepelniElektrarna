# Editor obsahu zadních obrazovek (2R, 4R, 7R, 8R, 10)

Každá zadní obrazovka má vlastní editor na **svém Pi**: `http://<IP Pi>:8081/edit`.
Heslo je v `/opt/backscreen-editor/.env` na daném Pi (do wiki se neukládá).

| Exponát | 2R | 4R | 7R | 8R | 10 |
|---|---|---|---|---|---|
| Tepelná elektrárna | 192.168.140.27 | .17 | .25 | .21 | .23 |
| Jaderná elektrárna | 192.168.140.19 | .36 | .38 | .34 | .33 |

## Co jde upravit

Úvodní obrazovka (nadpis, text, fotka, popisek) a karty: název, úvod, text, fotka, popisek –
vše v CZ/EN/DE. Karty lze přidávat (max. 12), mazat a měnit jejich pořadí. Fotka může být
jedna pro všechny jazyky, nebo zvlášť pro každý jazyk (když je v obrázku text).

V textu karty začíná prázdný řádek nový odstavec; krátký první řádek odstavce bez tečky
se zobrazí jako mezititulek.

Postup: **Uložit koncept → Náhled → Zveřejnit**. Obrazovka si nový obsah načte sama do
10 s, bez restartu. Každé zveřejnění uloží předchozí verzi do záloh; v editoru ji lze obnovit.

## Jak to funguje

- Obrazovka běží dál v display runtime integrátora (`127.0.0.1:8080`). Obsah si načítá
  z editoru na stejném Pi (`127.0.0.1:8081/data/content.json`). Když editor neběží, ukáže
  výchozí obsah zabudovaný v aplikaci (`public/content.default.json` každé obrazovky).
- Editor (`backscreen-editor.service`, Node) ukládá vše do `/opt/backscreen-editor/data/`
  (zveřejněný obsah, koncept, zálohy, nahrané fotky). Nasazení tuto složku nikdy nemění.
- `schema.js` je jediná definice obsahu – používá ji obrazovka, editor i server.

## Nasazení / aktualizace

Pro danou obrazovku: sestavit (`vite build`), zabalit `app/` (tato složka + `server/node_modules`)
a `dist/` (build obrazovky) do tgz, na Pi spustit `deploy/install.sh <tgz> "<název>" [heslo]`.
Heslo se nastaví při první instalaci a dál zůstává, pokud se nezadá nové.

Kontrola na Pi: `systemctl status backscreen-editor`, `journalctl -u backscreen-editor -n 20`.
