# lighting-watch – hlídání inicializace osvětlení

Služba pro **master Pi** exponátu, běží vedle releasu integrátora (`/opt/techmania-control`, Jiří Wild).
Jeho soubory nemění a jeho nasazení ji nepřepíše. Stejná složka je v repozitářích všech čtyř exponátů
(TE, JE, Gravitační baterie, Jaderná fúze); exponát si bere z `EXHIBIT_ID` v `/etc/techmania/backend.env`.

| Exponát | Master | S-Play |
|---|---|---|
| Tepelná elektrárna | 10.42.133.10 | 10.42.133.12 |
| Jaderná elektrárna | 10.42.131.10 | 10.42.131.12 |
| Gravitační baterie | 10.42.134.10 (Wi-Fi 192.168.140.13) | 10.42.134.12 |
| Jaderná fúze | 10.42.132.10 (client1) | 10.42.132.12 |

**Problém:** stmívatelná světla (obrys, niky) fungují jen tehdy, když na S-Play běží „nosné“ playlisty.
Spouští je *inicializace* přes Control App. Služba integrátora `techmania-lighting-startup` ji pošle
jen jednou, 120 s poté, co S-Play odpoví na ping. Ping ale znamená jen to, že běží síť PC, ne přehrávač –
při pomalém startu se inicializace ztratí (7. 10. 2026 zůstala JE ráno tmavá). A když se S-Play
restartuje přes den, nikdo ji znovu neinicializuje.

**Řešení:** `techmania-lighting-watch` pinguje S-Play každých 5 s. Kdykoli se S-Play objeví
(ranní zapnutí nebo restart; výpadek kratší než ~15 s se nepočítá), pošle inicializaci
**za 120 s a znovu za 300 s**. Pokud S-Play už běží ve chvíli startu služby (instalace, restart
samotného masteru), nedělá nic – přes den tak nikdy nepřenastaví světla uprostřed hry.

Inicializace = obrys 100 %, niky 0 %, nosné playlisty spuštěné. Jediný vedlejší efekt: když někdo
hraje do 5 minut od zapnutí S-Play, druhá inicializace jednou zhasne niky, než je hra znovu nastaví.

### Instalace / aktualizace (na masteru)

```bash
scp -r ops/lighting-watch techmania@<master>:/tmp/
ssh techmania@<master> 'bash /tmp/lighting-watch/install.sh'
```

Exponát si služba bere z `EXHIBIT_ID` v `/etc/techmania/backend.env`. Instaluje do
`/usr/local/lib/techmania-extra/` a `/etc/systemd/system/techmania-lighting-watch.service`.

### Kontrola

```bash
systemctl status techmania-lighting-watch
journalctl -u techmania-lighting-watch -n 20 -o cat      # watching / splay_appeared / initialized
cat /var/lib/techmania/lighting-watch/latest.json        # poslední inicializace
```

Ruční inicializace (stejné jako tlačítko „Initialize lighting“ v Control App):

```bash
curl -X POST http://127.0.0.1:8000/api/scene-controllers/<device>/controls/initialize \
     -H 'Content-Type: application/json' -d '{}'
```

`<device>`: `tepelni_lighting`, `lighting` (JE), `gravity_battery_lighting`, `tokamak_lighting`.

### Odinstalace

```bash
sudo systemctl disable --now techmania-lighting-watch
sudo rm /etc/systemd/system/techmania-lighting-watch.service /usr/local/lib/techmania-extra/lighting_watch.py
sudo systemctl daemon-reload
```

### Test logiky (lokálně)

```bash
cd lighting-watch && python test_watch.py
```
