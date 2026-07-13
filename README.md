# Quest — prototipo web

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

- Dashboard con check-in rapido, aggiornamento narrativo, ritmo e crediti
- Stanza pubblica con filtri per fase e soluzioni recuperate da blocchi simili già superati
- Ricerca full-text dimostrativa tra ricette e corsi, oltre alla scoperta per categorie
- Libreria di ricette clonabili con dati reali, sommario e blocchi critici espandibili
- Marketplace con corsi, stanze private e protezioni d'acquisto
- Profilo con storico trasparente di traguardi, pause e cambi di rotta
- Onboarding guidato che mostra la stanza prima dell'ingresso e accompagna il Giorno 1
- Flussi interattivi per aggiornamenti, segnali, nuova Quest, clonazione e acquisto

Il progetto è un prototipo frontend con dati dimostrativi locali. Autenticazione, persistenza, upload e pagamenti richiedono il collegamento a Supabase e Stripe indicato nella documentazione tecnica.
