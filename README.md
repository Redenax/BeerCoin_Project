# Contratto EthBeerTokenExchange

## Panoramica

Il contratto EthBeerTokenExchange facilita lo scambio di token ERC20 chiamati BeerToken con Ether (ETH) e viceversa sulla blockchain Ethereum. Implementa l'interfaccia standard dei token ERC20 (IERC20) per consentire il trasferimento e la gestione dei token.

## Principali Caratteristiche

### Deploy e Inizializzazione del Contratto
Il contratto viene deployato sulla blockchain Ethereum, richiedendo almeno 0.5 ETH durante il deploy. Durante l'inizializzazione, vengono impostati vari parametri come il nome del token, il simbolo, il numero di decimali, la fornitura totale di token e il tasso di cambio iniziale tra BeerToken ed Ether.

### Gestione dei Token
Il contratto gestisce i BeerToken con operazioni standard come il trasferimento di token tra account (trasferimento), l'approvazione per consentire a un altro account di spendere i token (approvazione), e il trasferimento di token da un account all'altro con la considerazione dell'approvazione (trasferimento da).

### Scambio BeerToken:Ether
Gli utenti possono scambiare BeerToken con Ether e viceversa. Il contratto permette agli utenti di inviare BeerToken al contratto e ricevere Ether in cambio, oppure inviare Ether al contratto e ricevere BeerToken in cambio. Durante gli scambi, viene mantenuto un rapporto dinamico tra i saldi di BeerToken ed Ether nel contratto per garantire un equilibrio tra le due risorse.

### Gestione del Rapporto BeerToken:Ether
Il contratto monitora costantemente il rapporto tra i saldi di BeerToken ed Ether. Se il rapporto supera un limite massimo predefinito (MAX_RATIO), viene aggiornato per limitare il valore massimo. Ciò garantisce che il contratto mantenga un equilibrio tra i due asset.

### Altre Funzionalità
Il contratto include funzioni per recuperare il saldo di Ether nel contratto, per impostare manualmente il rapporto di scambio BeerToken:Ether, e per ottenere il rapporto attuale BeerToken:Ether.

## Conclusione
Il contratto EthBeerTokenExchange fornisce un'infrastruttura sicura e trasparente per lo scambio di token ERC20 BeerToken con Ether sulla blockchain Ethereum. Implementa funzionalità chiave per la gestione dei token e offre un meccanismo efficiente per gli utenti per scambiare i loro asset digitali in modo decentralizzato e affidabile. La gestione dinamica del rapporto tra BeerToken ed Ether assicura che il contratto mantenga un equilibrio adeguato tra i due asset, garantendo stabilità ed efficienza nelle operazioni di scambio.
