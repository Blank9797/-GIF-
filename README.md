# ⭐ Kirby GIF Maker

Generatore di GIF animate kawaii: scegli il personaggio, componi la scena, scrivi il testo e scarica la GIF. Tutto client-side, zero dipendenze, perfetto anche da iPhone.

## Metterla online con Vercel

1. Vai su [vercel.com](https://vercel.com) → **Add New → Project** → importa questo repo GitHub
2. Nessuna configurazione necessaria (è un sito statico): premi **Deploy**
3. Apri l'URL che ti dà Vercel dal telefono — fatto ✨

**Su iPhone**: genera la GIF e tocca **📤 Condividi → Salva immagine** per averla animata nel Rullino (oppure tieni premuta la GIF).

## Avvio in locale

```bash
node server.js
```

Poi apri **http://localhost:8660** (funziona anche aprendo `index.html` direttamente nel browser).

## Cosa fa

- **Interfaccia bilingue** 🇮🇹 Italiano / 🇯🇵 日本語 (toggle in alto, memorizzato)
- **2 stili di disegno**: **Realistico 🎨** (default) — resa da action figure 3D: luci da studio, volumi, materiali (vinile, pelo, tessuto, gel), occhi lucidi con riflessi, ombre morbide — e **Kawaii 🍬** (piatto pastello)
- **123 personaggi** organizzati per gruppi (Pokémon, Sanrio, Ghibli, Giochi, Animali, Cibo & cose): dai 14 "storici" disegnati a mano (Kirby, Pikachu, Kabigon, Kuromi, Totoro, Doraemon…) a oltre 100 costruiti col sistema parametrico (forme + orecchie + code + pattern componibili)
- **Fusioni** tra personaggi: scegli "Fusione con…" e il personaggio prende palette, orecchie e coda dell'altro (Totoro×Eevee, Kirby×Pikachu…)
- **Il tuo Avatar ✨**: carnagione (6), pettinatura (9), colore capelli (8) e altezza (basso/medio/alto) — e funziona con tutte le facce, pose e cappelli
- **54 facce espressive**: dalle classiche a piagnucolone, occhi a ¥, congelato coi denti che battono, robotico a LED, ipnotizzato a spirale, bolla di sonno, cattivissimo con le zanne, occhioni dolci, musetto :3, UwU, OwO, derp…
- **Sfondi super personalizzabili**: 9 **ambienti disegnati** (città al tramonto, prato, spiaggia, Monte Fuji, sakura, spazio, synthwave con griglia animata, fondale marino, cameretta) + gradiente **su misura con 2 color picker** + 6 **pattern** sovrapponibili (pois, righe, cuoricini, stelline, onde giapponesi seigaiha, griglia)
- **Aure manga** dietro al personaggio: raggi di concentrazione, cerchio magico dorato rotante, fiamme, fulmini, cuori in orbita
- **Compagni animati**: uccellino, farfalla, fantasmino, stellina, ape che ronza in orbita
- **7 tipi di cartello**: legno, lavagna (col gessetto), neon (bordo che pulsa), carta strappata con scotch, cartello stradale, targa d'oro, cuore
- **5 caratteri tipografici**: tondo, elegante (serif), gessetto, marker, da macchina
- **11 pose**: col cartello, saluta, balla, salto, corsa, seduto, in volo, muscoli 💪, cuoricino, giravolta, relax
- **14 cappelli** + **6 accessori** (occhiali, sciarpa, papillon, baffi…)
- **8 colori del corpo** ("Classico ⭐" usa la palette originale del personaggio; gli altri ricolorano chiunque)
- **Dove va il testo**: cartello di Kirby, fumetto, nuvoletta dei pensieri, scritta stile meme sopra/sotto
- **10 animazioni del testo**: onda, rimbalzo, macchina da scrivere, tremolio, pop, battito, gira, arcobaleno, neon, ferma
- **12 sfondi** (incluso arcobaleno pastello) + **10 effetti** (stelline, cuoricini, petali, coriandoli, bolle, neve, note, fulmini, meteore)
- **Cornici**: polaroid o cerchio; **fluidità**: 30/20/10 fps; dimensioni 320/400/480; durate 1,5/2/3 s
- Pulsante 🎲 per una combinazione a sorpresa; testo multiriga (max 3) con auto-fit

## Come funziona

Tutto client-side (`index.html` + `real.js`), zero dipendenze:

- Personaggi disegnati proceduralmente in **canvas** (spazio 500×500 scalato); i 14 storici sono definiti a mano in `CHAR_ART`, gli altri come **ricette parametriche** (`addChars`: forma da `P_SHAPES`, orecchie da `P_EARS`, code da `P_TAILS`, pattern da `P_MARKS`, palette derivata con `pal()`); pose e facce sono componibili, i costumi si agganciano alla testa
- Tutte le animazioni sono periodiche in t∈[0,1) → loop perfetto
- Encoder **GIF89a** scritto da zero: quantizzazione median-cut a 256 colori (istogramma RGB555) + dithering ordinato Bayer 4×4 + compressione LZW, loop infinito NETSCAPE2.0
- `POST /save` salva una GIF/PNG in `samples/` (usato per i test)
