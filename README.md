# Quest — prototipo web

[Demo live su Vercel](https://sito-codex-kappa.vercel.app) · [Repository GitHub](https://github.com/danielegalmax/quest-prototype)

Interfaccia web responsive costruita a partire dalla documentazione in `../Documentazione`.

## Avvio locale

```bash
npm install
npm run dev
```

Vite mostra nel terminale l'indirizzo locale da aprire nel browser.

## Build di produzione

```bash
npm run build
```

La build ottimizzata viene generata nella cartella `dist`.

## Contenuti inclusi

- Feed globale con filtri Generale, Per categoria e Compagni di percorso
- Widget orizzontale con tutte le Quest attive e check-in indipendente
- Stanze dinamiche in modalità membro o spettatore, con filtri per fase
- Ricerca full-text tra ricette e versioni guidate, oltre all’elenco dei cohort attivi
- Libreria di ricette clonabili con dati reali, sommario e blocchi critici espandibili
- Marketplace con corsi, stanze private e protezioni d'acquisto
- Profilo con tutti i percorsi unificati e filtrabili per stato
- Onboarding guidato che mostra la stanza prima dell'ingresso e accompagna il Giorno 1
- Flussi interattivi per aggiornamenti, segnali, nuova Quest, clonazione e acquisto
- Un solo modello dati condiviso tra Ricette e Marketplace, con collegamenti incrociati
- Timeline a blocchi Giorno X riusata nelle stanze e nelle ricette
- Segnale Vetta gratuito, disponibile esclusivamente sui completamenti
- Quest acquistate visibili nel Profilo con la provenienza dal Marketplace
- Pagine condivisibili `/ricetta/:id` e `/corso/:id`, compatibili con refresh e cronologia
- Distinzione esplicita tra clone gratuito e contenuti aggiuntivi del coach

Il progetto è un prototipo frontend con dati dimostrativi locali. Autenticazione, persistenza, upload e pagamenti richiedono il collegamento a Supabase e Stripe indicato nella documentazione tecnica.
