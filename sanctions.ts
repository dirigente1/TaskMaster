import { Sanction } from "../types";

export const SANCTIONS_DATA: Sanction[] = [
  // STRADALI
  { id: 's1', label: 'Sosta non autorizzata su stalli riservati ai disabili', law: 'Codice della Strada', amount: 87, cat: 'stradali' },
  { id: 's2', label: 'Sosta su spiazzola scuolabus', law: 'Codice della Strada', amount: 87, cat: 'stradali' },
  { id: 's3', label: 'Violazione sosta merci/carico/scarico', law: 'Codice della Strada', amount: 41, cat: 'stradali' },
  { id: 's4', label: 'Sosta vietata sul marciapiede', law: 'Codice della Strada', amount: 41, cat: 'stradali' },
  { id: 's5', label: 'Sosta in doppia fila', law: 'Codice della Strada', amount: 87, cat: 'stradali' },
  { id: 's6', label: 'Sosta su strisce pedonali', law: 'Codice della Strada', amount: 87, cat: 'stradali' },
  { id: 's7', label: 'Mancata revisione', law: 'Codice della Strada', amount: 173, cat: 'stradali' },
  { id: 's8', label: 'Assicurazione scaduta', law: 'Codice della Strada', amount: 868, cat: 'stradali' },

  // ANIMALI
  { id: 'a1', label: 'Animale lasciato in auto', law: 'Abbandono temporaneo di animale in veicolo con rischio per il benessere', amount: 500, cat: 'animali' },
  { id: 'a2', label: 'Abbandono di animale', law: 'Lasciarsi definitivamente un animale domestico', amount: 1000, cat: 'animali' },
  { id: 'a3', label: 'Accesso cani in area protetta', law: 'Ingresso non autorizzato di animali in riserva naturale', amount: 50, cat: 'animali' },
  { id: 'a4', label: 'Mancato microchip', law: "Mancata iscrizione all'anagrafe canina o assenza di microchip", amount: 30, cat: 'animali' },
  { id: 'a5', label: 'Cane senza guinzaglio', law: 'Art. 672 C.P. - Condotta di animali senza mezzi di contenimento in luoghi pubblici', amount: 25, cat: 'animali' },
  { id: 'a6', label: 'Mancata museruola', law: 'Art. 672 C.P. / Ordinanza - Mancato utilizzo della museruola dove prevista per legge', amount: 25, cat: 'animali' },
  { id: 'a7', label: 'Mancata raccolta escrementi cani', law: 'Art. 1102 C.C. / Reg. Comunale - Mancata pulizia delle deiezioni canine in area pubblica', amount: 25, cat: 'animali' },

  // AMBIENTE - ESISTENTI
  { id: 'e1', label: 'Abbandono rifiuti generici', law: 'Art. 192 D.Lgs 152/06', amount: 80, cat: 'ambiente' },
  { id: 'e2', label: 'Abbandono rifiuti pericolosi', law: 'Art. 192 D.Lgs 152/06', amount: 500, cat: 'ambiente' },
  { id: 'e3', label: 'Raccolta flora protetta illegale', law: 'Art. 2 L. 394/91', amount: 200, cat: 'ambiente' },
  { id: 'e4', label: 'Accesso veicolare non autorizzato', law: 'Art. 30 L. 394/91', amount: 150, cat: 'ambiente' },
  
  // AMBIENTE - NUOVE SANZIONI MANUTENZIONE TERRITORI PRIVATI
  { 
    id: 'e5', 
    label: 'Mancato taglio erba e vegetazione in aree private', 
    law: 'Ordinanza Sindacale - Mancata manutenzione aree private con rischio incendi e proliferazione parassiti', 
    minAmount: 50, 
    maxAmount: 500, 
    amount: 100, 
    cat: 'ambiente' 
  },
  { 
    id: 'e6', 
    label: 'Mancata rimozione e smaltimento sfalcio e rifiuti aree private', 
    law: 'Ordinanza Sindacale - Rifiuti abbandonati in aree private divenute ricettacolo di animali e parassiti', 
    minAmount: 50, 
    maxAmount: 400, 
    amount: 100, 
    cat: 'ambiente' 
  },
  { 
    id: 'e7', 
    label: 'Mancata pulizia fronte stradale - proliferazione erba e piante infestanti', 
    law: 'Ordinanza Sindacale - Obbligo di taglio e rimozione vegetazione su fronte stradale privato', 
    minAmount: 50, 
    maxAmount: 300, 
    amount: 100, 
    cat: 'ambiente' 
  },
  { 
    id: 'e8', 
    label: 'Uso di diserbanti vietato', 
    law: 'Ordinanza Sindacale - Divieto assoluto uso diserbanti su aree private prospicienti strade pubbliche', 
    minAmount: 100, 
    maxAmount: 1000, 
    amount: 200, 
    cat: 'ambiente' 
  },
  { 
    id: 'e9', 
    label: 'Mancata regolazione siepi e potature alberature', 
    law: 'Ordinanza Sindacale - Obbligo di costante regolazione siepi e taglio rami su aree private prospicienti strade pubbliche', 
    minAmount: 50, 
    maxAmount: 300, 
    amount: 100, 
    cat: 'ambiente' 
  },
  { 
    id: 'e10', 
    label: 'Mancata rimozione potature e sfalcio su aree prospicienti vie pubbliche', 
    law: 'Ordinanza Sindacale - Obbligo smaltimento potature e sfalcio su aree private che aggettano su strade pubbliche', 
    minAmount: 50, 
    maxAmount: 400, 
    amount: 100, 
    cat: 'ambiente' 
  },
  { 
    id: 'e11', 
    label: 'Vegetazione pericolosa per viabilità', 
    law: 'Ordinanza Sindacale - Mancata tutela della viabilità per vegetazione non curata su aree private prospicienti strade', 
    minAmount: 100, 
    maxAmount: 500, 
    amount: 150, 
    cat: 'ambiente' 
  },
];
