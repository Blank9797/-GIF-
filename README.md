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

- **14 personaggi con le loro sagome originali**: Kirby, Pikachu (corpo a pera), Kabigon/Snorlax (testolina + pancione), Kuromi e My Melody (testona col cappuccio + corpicino), Jigglypuff, Eevee, Gengar (tutto spuntoni), Ditto (blob), Cinnamoroll (orecchie lunghe), Pompompurin, Totoro (ghianda), Doraemon (testa tonda + corpo con collare), Slime di Dragon Quest (goccia)
- **15 facce**: sorridente, raggiante, innamorato, stelline, occhiolino, furbetto, timido, sorpreso, confuso, arrabbiato (💢), triste, disperato, annoiato, KO, assonnato (Zzz)
- **11 pose**: col cartello, saluta, balla, salto, corsa, seduto, in volo, muscoli 💪, cuoricino, giravolta, relax
- **14 cappelli** + **6 accessori** (occhiali, sciarpa, papillon, baffi…)
- **8 colori del corpo** ("Classico ⭐" usa la palette originale del personaggio; gli altri ricolorano chiunque)
- **Dove va il testo**: cartello di Kirby, fumetto, nuvoletta dei pensieri, scritta stile meme sopra/sotto
- **10 animazioni del testo**: onda, rimbalzo, macchina da scrivere, tremolio, pop, battito, gira, arcobaleno, neon, ferma
- **12 sfondi** (incluso arcobaleno pastello) + **10 effetti** (stelline, cuoricini, petali, coriandoli, bolle, neve, note, fulmini, meteore)
- **Cornici**: polaroid o cerchio; **fluidità**: 30/20/10 fps; dimensioni 320/400/480; durate 1,5/2/3 s
- Pulsante 🎲 per una combinazione a sorpresa; testo multiriga (max 3) con auto-fit

## Come funziona

Tutto client-side in un solo `index.html`, zero dipendenze:

- Personaggi disegnati proceduralmente in **canvas** (spazio 500×500 scalato); ogni personaggio è definito in `CHAR_ART` (parti dietro/davanti alla palla + forma corpo alternativa); pose e facce sono componibili, i costumi si agganciano alla testa
- Tutte le animazioni sono periodiche in t∈[0,1) → loop perfetto
- Encoder **GIF89a** scritto da zero: quantizzazione median-cut a 256 colori (istogramma RGB555) + dithering ordinato Bayer 4×4 + compressione LZW, loop infinito NETSCAPE2.0
- `POST /save` salva una GIF/PNG in `samples/` (usato per i test)
