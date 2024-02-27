// Funzione per ottenere il contenuto di un file JSON
async function fetchJSONFile(filePath) {
    const response = await fetch(filePath);
    const data = await response.json();
    return data;
}

// Funzione principale
async function main() {
    try {
        // Ottieni l'indirizzo corrente di MetaMask
        const currentAddress = await getCurrentAddress();
        if (currentAddress) {
            console.log('Indirizzo Metamask corrente:', currentAddress);
            return currentAddress;
            // Ora puoi utilizzare l'indirizzo corrente come necessario nel tuo codice
            // Ad esempio, puoi passarlo come parametro o utilizzarlo in altre chiamate a contratti intelligenti, ecc.
        } else {
            console.log('Non è stato possibile ottenere l\'indirizzo corrente da MetaMask.');
        }
    } catch (error) {
        console.error('Errore:', error);
    }
}

// Funzione per ottenere l'indirizzo corrente da MetaMask
async function getCurrentAddress() {
    try {
        // Richiedi l'accesso al conto Metamask
        await window.ethereum.request({method: 'eth_requestAccounts'});

        // Ottieni l'indirizzo corrente
        const accounts = await web3.eth.getAccounts();
        return accounts[0]; // Restituisci il primo account (l'utente può averne più di uno)
    } catch (error) {
        console.error('Errore durante il recupero dell\'indirizzo corrente:', error);
        return null;
    }
}

async function balance() {
    try {
        // Ottieni l'indirizzo corrente di MetaMask
        const currentAddress = await getCurrentAddress();

        // Ottieni l'indirizzo del contratto e l'ABI da file JSON
        const contractAddressData = await fetchJSONFile('../json/contractAddress.json');
        const contractABIData = await fetchJSONFile('../json/contractTokenExABI.json');

        const contractAddress = contractAddressData.address;
        const contractABI = contractABIData;

        // Crea un'istanza del contratto
        const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

        // Chiamata al contratto per ottenere il saldo
        const result = await contractInstance.methods.balanceOf(currentAddress).call();

        // Formatta il saldo in modo che sia visibile solo fino a due decimali
        const formattedBalance = (result / Math.pow(10, 18)).toFixed(2); // Arrotonda a due decimali

        // Aggiorna il paragrafo con l'ID "balance" nel tuo documento HTML con il saldo formattato
        const balanceParagraph = document.getElementById("balance");
        balanceParagraph.innerText = `Il tuo saldo è ${formattedBalance} BeerCoin`;

        // Stampa il saldo nella console
        console.log('Saldo:', formattedBalance);
    } catch (error) {
        console.error('Errore:', error);
    }
}


// Funzione per ottenere il rapporto Birra/Ether come intero
async function ratio() {
    try {
        // Ottieni l'indirizzo del contratto e l'ABI da file JSON
        const contractAddressData = await fetchJSONFile('../json/contractAddress.json');
        const contractABIData = await fetchJSONFile('../json/contractTokenExABI.json');

        const contractAddress = contractAddressData.address;
        const contractABI = contractABIData;

        // Crea un'istanza del contratto
        const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

        // Chiamata al contratto per ottenere il rapporto
        const result = await contractInstance.methods.getBeerToEthRatio().call();

        // Converte il valore in virgola mobile in un intero utilizzando parseInt()
        const ratioInteger = parseInt(result);

        // Stampa il rapporto come intero
        console.log('Rapporto Birra/Ether (intero):', ratioInteger);

        // Restituisci il valore intero del rapporto
        return ratioInteger;
    } catch (error) {
        console.error('Errore:', error);
        return; // Restituisci undefined in caso di errore
    }
}

// Funzione per effettuare lo scambio di Ether per Birra
async function Exchange() {
    try {
        // Ottieni l'indirizzo corrente di MetaMask
        const currentAddress = await getCurrentAddress();

        // Ottieni l'indirizzo del contratto e l'ABI da file JSON
        const contractAddressData = await fetchJSONFile('../json/contractAddress.json');
        const contractABIData = await fetchJSONFile('../json/contractTokenExABI.json');

        const contractAddress = contractAddressData.address;
        const contractABI = contractABIData;

        // Crea un'istanza del contratto
        const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

        // Imposta l'account mittente
        const fromAccount = currentAddress;

        // Imposta l'importo da inviare in Wei
        const amountToSend = web3.utils.toWei(payment.value, 'ether');

        // Chiama la funzione del contratto payable per lo scambio
        const receipt = await contractInstance.methods.exchangeEthForBeer().send({
            from: fromAccount,
            value: amountToSend
        });
        slideImage();
        console.log('Transazione confermata:', receipt);
    } catch (error) {
        console.error('Errore durante la transazione:', error);
    }
}

// Funzione per effettuare lo scambio di Ether per Birra
async function Exchange2(amountToSend) {
    try {
        // Ottieni l'indirizzo corrente di MetaMask
        const currentAddress = await getCurrentAddress();

        // Ottieni l'indirizzo del contratto e l'ABI da file JSON
        const contractAddressData = await fetchJSONFile('../json/contractAddress.json');
        const contractABIData = await fetchJSONFile('../json/contractTokenExABI.json');

        const contractAddress = contractAddressData.address;
        const contractABI = contractABIData;

        // Crea un'istanza del contratto
        const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

        // Imposta l'account mittente
        const fromAccount = currentAddress;


        await contractInstance.methods.approve(contractAddress, amountToSend).send({from: fromAccount});


        // Chiama la funzione del contratto payable per lo scambio
        const receipt = await contractInstance.methods.exchangeBeerForEth(amountToSend).send({from: fromAccount});

        console.log('Transazione confermata:', receipt);
        slideImageEth()
    } catch (error) {
        console.error('Errore durante la transazione:', error);
    }
}

// Funzione per inviare token a un destinatario
async function inviaToken(destinatario, amountInWei) {
    try {
        // Ottieni l'indirizzo del mittente
        const fromAccount = await getCurrentAddress();

        // Ottieni l'indirizzo del contratto e l'ABI da file JSON
        const contractAddressData = await fetchJSONFile('../json/contractAddress.json');
        const contractABIData = await fetchJSONFile('../json/contractTokenExABI.json');

        const contractAddress = contractAddressData.address;
        const contractABI = contractABIData;

        // Crea un'istanza del contratto
        const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

        // Approva il contratto del token a prelevare l'importo specificato
        await contractInstance.methods.approve(destinatario, amountInWei).send({from: fromAccount});

        // Trasferisce effettivamente i token al destinatario
        const tx = await contractInstance.methods.transfer(destinatario, amountInWei).send({from: fromAccount});

        console.log('Trasferimento di token completato:', tx);
    } catch (error) {
        console.error('Errore durante il trasferimento di token:', error);
    }
}

// Funzione per inviare token
async function InviareToken() {
    try {
        // Ottieni il destinatario e l'importo dai campi di input nel documento HTML
        const destinatario = document.getElementById('receiver').value;
        const amountInEther = document.getElementById('value').value;
        const amountInWei = web3.utils.toWei(amountInEther, 'ether');

        // Invia i token al destinatario
        await inviaToken(destinatario, amountInWei);
        fill()
        console.log('Invio di token completato con successo');
    } catch (error) {
        console.error('Errore durante l\'invio di token:', error);
    }
}

setInterval(balance, 5000);

async function UpdateOnKey() {
    try {
        const valueratio = await ratio(); // Attendere che la Promise venga risolta

        if (!isNaN(payment.value) && payment.value !== "") {
            receive.value = payment.value * valueratio;
            console.log("ratio: " + valueratio);
            console.log(receive.value);

        } else {
            console.log("Il valore inserito non è un numero valido.");
            receive.value = "";
        }


    } catch (error) {
        console.error('Errore:', error);
    }
}

async function UpdateOnKey2() {
    try {
        const valueratio = await ratio(); // Attendere che la Promise venga risolta

        if (!isNaN(payment2.value) && payment2.value !== "") {
            receive2.value = payment2.value / valueratio;
            console.log("ratio: " + valueratio);
            console.log(payment2.value);

        } else {
            console.log("Il valore inserito non è un numero valido.");
            payment2.value = "";
        }


    } catch (error) {
        console.error('Errore:', error);
    }
}

async function UpdateOnKey3() {
    try {
        const valueratio = await ratio(); // Attendere che la Promise venga risolta

        if (!isNaN(receive.value) && receive.value !== "") {
            payment.value = receive.value / valueratio;
            console.log("ratio: " + valueratio);
            console.log(payment.value);

        } else {
            console.log("Il valore inserito non è un numero valido.");
            payment.value = "";
        }


    } catch (error) {
        console.error('Errore:', error);
    }
}

async function UpdateOnKey4() {
    try {
        const valueratio = await ratio(); // Attendere che la Promise venga risolta

        if (!isNaN(receive2.value) && receive2.value !== "") {
            payment2.value = receive2.value * valueratio;
            console.log("ratio: " + valueratio);
            console.log(payment2.value);

        } else {
            console.log("Il valore inserito non è un numero valido.");
            payment2.value = "";
        }


    } catch (error) {
        console.error('Errore:', error);
    }
}


payment.addEventListener("input", () => {
    // Verifica se il valore inserito in payment è un numero valido
    if (!isNaN(payment.value) && payment.value !== "") {
        // Chiamare la funzione ogni volta che viene inserito un numero
        UpdateOnKey();
    } else {
        console.log("Il valore inserito non è un numero valido.");
        // Gestione se il valore inserito non è un numero valido
    }
    if (payment.value == "") {
        receive.value = "";
    }
});

receive.addEventListener("input", () => {
    // Verifica se il valore inserito in payment è un numero valido
    if (!isNaN(receive.value) && receive.value !== "") {
        // Chiamare la funzione ogni volta che viene inserito un numero
        UpdateOnKey3();
    } else {
        console.log("Il valore inserito non è un numero valido.");
        // Gestione se il valore inserito non è un numero valido
    }
    if (receive.value == "") {
        payment.value = "";
    }
});

payment.addEventListener("keydown", (event) => {
    // Ottieni il codice del tasto premuto
    const keyCode = event.keyCode || event.which;

    // Consenti solo l'inserimento di numeri (0-9), punto, virgola, backspace e tasti di controllo (ad es. Ctrl+C, Ctrl+V)
    const isNumber = (keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105) || keyCode == 190 || keyCode == 59;

    const isBackspaceOrControl = keyCode == 8 || (keyCode >= 37 && keyCode <= 40) || (event.ctrlKey && (keyCode == 67 || keyCode == 86));

    // Consenti l'input solo se è un numero, punto, virgola, backspace o un tasto di controllo
    if (!isNumber && !isBackspaceOrControl) {
        event.preventDefault();
    }
});
receive.addEventListener("keydown", (event) => {
    // Ottieni il codice del tasto premuto
    const keyCode = event.keyCode || event.which;

    // Consenti solo l'inserimento di numeri (0-9), punto, virgola, backspace e tasti di controllo (ad es. Ctrl+C, Ctrl+V)
    const isNumber = (keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105) || keyCode == 190 || keyCode == 59;

    const isBackspaceOrControl = keyCode == 8 || (keyCode >= 37 && keyCode <= 40) || (event.ctrlKey && (keyCode == 67 || keyCode == 86));

    // Consenti l'input solo se è un numero, punto, virgola, backspace o un tasto di controllo
    if (!isNumber && !isBackspaceOrControl) {
        event.preventDefault();
    }
});

payment2.addEventListener("input", () => {
    // Verifica se il valore inserito in payment è un numero valido
    if (!isNaN(payment2.value) && payment2.value !== "") {
        // Chiamare la funzione ogni volta che viene inserito un numero
        UpdateOnKey2();
    } else {
        console.log("Il valore inserito non è un numero valido.");
        // Gestione se il valore inserito non è un numero valido
    }
    if (payment2.value == "") {
        receive2.value = "";
    }
});
receive2.addEventListener("input", () => {
    // Verifica se il valore inserito in payment è un numero valido
    if (!isNaN(receive2.value) && receive2.value !== "") {
        // Chiamare la funzione ogni volta che viene inserito un numero
        UpdateOnKey4();
    } else {
        console.log("Il valore inserito non è un numero valido.");
        // Gestione se il valore inserito non è un numero valido
    }
    if (receive2.value == "") {
        payment2.value = "";
    }
});


payment2.addEventListener("keydown", (event) => {
    // Ottieni il codice del tasto premuto
    const keyCode = event.keyCode || event.which;

    // Consenti solo l'inserimento di numeri (0-9), punto, virgola, backspace e tasti di controllo (ad es. Ctrl+C, Ctrl+V)
    const isNumber = (keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105) || keyCode == 190 || keyCode == 59;

    const isBackspaceOrControl = keyCode == 8 || (keyCode >= 37 && keyCode <= 40) || (event.ctrlKey && (keyCode == 67 || keyCode == 86));

    // Consenti l'input solo se è un numero, punto, virgola, backspace o un tasto di controllo
    if (!isNumber && !isBackspaceOrControl) {
        event.preventDefault();
    }
});
receive2.addEventListener("keydown", (event) => {
    // Ottieni il codice del tasto premuto
    const keyCode = event.keyCode || event.which;

    // Consenti solo l'inserimento di numeri (0-9), punto, virgola, backspace e tasti di controllo (ad es. Ctrl+C, Ctrl+V)
    const isNumber = (keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105) || keyCode == 190 || keyCode == 59;

    const isBackspaceOrControl = keyCode == 8 || (keyCode >= 37 && keyCode <= 40) || (event.ctrlKey && (keyCode == 67 || keyCode == 86));

    // Consenti l'input solo se è un numero, punto, virgola, backspace o un tasto di controllo
    if (!isNumber && !isBackspaceOrControl) {
        event.preventDefault();
    }
});

const submitButton = document.getElementById("submit_buy");

submitButton.addEventListener("click", async () => {
    try {
        // Avvia la funzione per inviare i token
        await Exchange();
    } catch (error) {
        console.error('Errore durante l\'invio di token:', error);
    }
});

const submitSendButton = document.getElementById("submit_send");

submitSendButton.addEventListener("click", async () => {
    try {
        // Avvia la funzione per inviare i token
        await InviareToken();
    } catch (error) {
        console.error('Errore durante l\'invio di token:', error);
    }
});

// Funzione per inviare token
async function ExToken() {
    try {
        // Ottieni il destinatario e l'importo dai campi di input nel documento HTML

        const amountInEther = document.getElementById('BeerCoin').value;
        const amountInWei = web3.utils.toWei(amountInEther, 'ether');

        // Invia i token al destinatario
        await Exchange2(amountInWei);

        console.log('Invio di token completato con successo');
    } catch (error) {
        console.error('Errore durante l\'invio di token:', error);
    }
}

const submitSellButton = document.getElementById("submit_sell");

submitSellButton.addEventListener("click", async () => {
    try {
        // Avvia la funzione per inviare i token
        await ExToken();
    } catch (error) {
        console.error('Errore durante l\'invio di token:', error);
    }
});

function slideImage() {
    const container = document.getElementById("slidingImg");

    // Creazione dell'elemento img per la prima immagine
    const slidingImageEth = new Image();
    slidingImageEth.classList.add('slidingBeer');
    slidingImageEth.src = '../immagini/ethereum-eth-logo-colored.svg';
    slidingImageEth.alt = 'Sliding Ethereum';

    // Aggiunta dell'elemento img al contenitore
    container.appendChild(slidingImageEth);

    // Aggiunta della classe per avviare l'animazione dopo un breve ritardo
    setTimeout(() => {
        slidingImageEth.classList.add('slidingBeer-show');
    }, 100);

    // Rendi l'immagine Beer trasparente dopo 3 secondi
    setTimeout(() => {
        slidingImageEth.style.opacity = 0;

        // Rimuovi l'immagine Beer dopo l'animazione di trasparenza
        setTimeout(() => {
            container.removeChild(slidingImageEth);

            // Creazione dell'elemento img per la seconda immagine
            const slidingImage = new Image();
            slidingImage.classList.add('slidingEth');
            slidingImage.src = '../immagini/cartoon-beer-icon-png.webp';
            slidingImage.alt = 'Sliding Beer';

            // Aggiunta dell'elemento img al contenitore
            container.appendChild(slidingImage);

            // Aggiunta della classe per avviare l'animazione Ethereum dopo un breve ritardo
            setTimeout(() => {
                slidingImage.classList.add('slidingEth-show');
            }, 100);

            // Rendi l'immagine Ethereum trasparente dopo 3 secondi
            setTimeout(() => {
                slidingImage.style.opacity = 0;

                // Rimuovi l'immagine Ethereum dopo l'animazione di trasparenza
                setTimeout(() => {
                    container.removeChild(slidingImage);
                }, 1000);

            }, 1000);
        }, 800);
    }, 3000);
}

function slideImageEth() {
    const container = document.getElementById("slidingImgSell");

    // Creazione dell'elemento img per la prima immagine
    const slidingImage = new Image();
    slidingImage.classList.add('slidingBeer');
    slidingImage.src = '../immagini/cartoon-beer-icon-png.webp';
    slidingImage.alt = 'Sliding Beer';

    // Aggiunta dell'elemento img al contenitore
    container.appendChild(slidingImage);

    // Aggiunta della classe per avviare l'animazione dopo un breve ritardo
    setTimeout(() => {
        slidingImage.classList.add('slidingBeer-show');
    }, 100);

    // Rendi l'immagine Beer trasparente dopo 3 secondi
    setTimeout(() => {
        slidingImage.style.opacity = 0;

        // Rimuovi l'immagine Beer dopo l'animazione di trasparenza
        setTimeout(() => {
            container.removeChild(slidingImage);

            // Creazione dell'elemento img per la seconda immagine
            const slidingImageEth = new Image();
            slidingImageEth.classList.add('slidingEth');
            slidingImageEth.src = '../immagini/ethereum-eth-logo-colored.svg';
            slidingImageEth.alt = 'Sliding Ethereum';

            // Aggiunta dell'elemento img al contenitore
            container.appendChild(slidingImageEth);

            // Aggiunta della classe per avviare l'animazione Ethereum dopo un breve ritardo
            setTimeout(() => {
                slidingImageEth.classList.add('slidingEth-show');
            }, 100);

            // Rendi l'immagine Ethereum trasparente dopo 3 secondi
            setTimeout(() => {
                slidingImageEth.style.opacity = 0;

                // Rimuovi l'immagine Ethereum dopo l'animazione di trasparenza
                setTimeout(() => {
                    container.removeChild(slidingImageEth);
                }, 1000);

            }, 1000);
        }, 800);
    }, 3000);
}


var mugHeight;
var beerHeight;
var percentFilled;
var roundedPercent;


function getHeights() {
    mugHeight = $('#mug').height();
    beerHeight = $('#beer').height();
    percentFilled = (beerHeight / mugHeight) * 100;
    roundedPercent = Math.round(percentFilled);

    return roundedPercent;
}


function fill() {
    $('#beer').addClass('fill');
    $('#beer').css('animation-play-state', 'running');
    $('#pour').addClass('pouring');

    $('#handle').addClass('hover');

    const intervalID = setInterval(() => {
        verify(intervalID)
    }, 500);
}


function verify(intervalID) {
    var height = 0;
    height = getHeights();
    if (height === 100) {
        $('#beer').css('animation-play-state', 'paused');
        $('#pour').removeClass('pouring');

        $('#handle').removeClass('hover');

        setTimeout(() => {
            $('#beer').removeClass('fill');
        }, 2000);
        clearInterval(intervalID)
    }
}

