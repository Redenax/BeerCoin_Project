const balanceParagraph = document.getElementById("balance");
const payment = document.getElementById("payment");
const receive = document.getElementById("receive");
const payment2 = document.getElementById("BeerCoin");
const receive2 = document.getElementById("Ethereum");

async function fetchJSONFile(filePath) {
    const response = await fetch(filePath);
    const data = await response.json();
    return data;
}

window.addEventListener('load', async () => {
    // Controlla se MetaMask è installato
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Richiede l'autorizzazione dell'utente per accedere all'indirizzo Ethereum
            await ethereum.enable();

            // Recupera l'indirizzo del portafoglio corrente
            const accounts = await web3.eth.getAccounts();
            const currentAddress = accounts[0];

        } catch (error) {
            console.error('L\'utente ha rifiutato l\'accesso o si è verificato un errore:', error);
        }
    } else {
        console.error('MetaMask non è installato!');
    }
    receive.value = "";

});
getGasInfo();


$('.js-input').on('input focus blur', function () {
    const $this = $(this);

    if ($this.val() || $this.is(":focus")) {
        $this.addClass('not-empty');
    } else {
        $this.removeClass('not-empty');
    }
    const $receiveInput = $('#receive');
    const $EthereumInput = $('#Ethereum');

    if ($receiveInput.val() || $receiveInput.is(":focus")) {
        $receiveInput.addClass('not-empty');
    } else {
        $receiveInput.removeClass('not-empty');
    }
    if ($EthereumInput.val() || $EthereumInput.is(":focus")) {
        $EthereumInput.addClass('not-empty');
    } else {
        $EthereumInput.removeClass('not-empty');
    }

});

$('#receive').on('input focus blur', function () {
    const $this = $(this);

    if ($this.val() || $this.is(":focus")) {
        $this.addClass('not-empty');
    } else {
        $this.removeClass('not-empty');
    }

    const $paymentInput = $('#payment'); // Assumi che l'ID dell'input "receive" sia "receive"

    if ($paymentInput.val() || $paymentInput.is(":focus")) {
        $paymentInput.addClass('not-empty');
    } else {
        $paymentInput.removeClass('not-empty');
    }
});

$('#Ethereum').on('input focus blur', function () {
    const $this = $(this);

    if ($this.val() || $this.is(":focus")) {
        $this.addClass('not-empty');
    } else {
        $this.removeClass('not-empty');
    }
    const $beerCoinInput = $('#BeerCoin'); // Assumi che l'ID dell'input "receive" sia "receive"

    if ($beerCoinInput.val() || $beerCoinInput.is(":focus")) {
        $beerCoinInput.addClass('not-empty');
    } else {
        $beerCoinInput.removeClass('not-empty');
    }
});

$('#Send').click(function () {
    // Disabilita il pulsante "Sell" e attiva il pulsante "Buy"
    $('#Send').prop('disabled', true).addClass('active_button').removeClass('hidden_button');
    $('#Buy').prop('disabled', false).addClass('hidden_button').removeClass('active_button');
    $('#Sell').prop('disabled', false).addClass('hidden_button').removeClass('active_button');

    $('#Send_element').addClass('active').removeClass('hidden');
    $('#Buy_element').addClass('hidden').removeClass('active');
    $('#Sell_element').addClass('hidden').removeClass('active');
});


// Aggiunge un gestore di eventi al clic dei pulsanti
$('#Sell').click(function () {
    // Disabilita il pulsante "Sell" e attiva il pulsante "Buy"
    $('#Sell').prop('disabled', true).addClass('active_button').removeClass('hidden_button');
    $('#Buy').prop('disabled', false).addClass('hidden_button').removeClass('active_button');
    $('#Send').prop('disabled', false).addClass('hidden_button').removeClass('active_button');

    $('#Sell_element').addClass('active').removeClass('hidden');
    $('#Buy_element').addClass('hidden').removeClass('active');
    $('#Send_element').addClass('hidden').removeClass('active');
});

// Aggiunge un gestore di eventi al clic dei pulsanti
$('#Buy').click(function () {
    // Disabilita il pulsante "Buy" e attiva il pulsante "Sell"
    $('#Buy').prop('disabled', true).addClass('active_button').removeClass('hidden_button');
    $('#Sell').prop('disabled', false).addClass('hidden_button').removeClass('active_button');
    $('#Send').prop('disabled', false).addClass('hidden_button').removeClass('active_button');

    $('#Buy_element').addClass('active').removeClass('hidden');
    $('#Sell_element').addClass('hidden').removeClass('active');
    $('#Send_element').addClass('hidden').removeClass('active');
});

$(document).ready(function () {
    // Carica il contenuto da un file esterno nel contenitore "contenuto"
    $("#bar").load("../html/bar.html");
    $("#footer").load("../html/footer.html")
});

async function getGasInfo() {
    try {
        const api_key = await fetchJSONFile('../json/Api_key.json');
        const key = api_key.API_key;
        const response = await fetch('https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=' + key);
        const data = await response.json();
        if (data && data.result) {
            const gasPriceGwei = data.result.FastGasPrice;

            const responseCryptoCompare = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD`);
            const dataCryptoCompare = await responseCryptoCompare.json();

            if (dataCryptoCompare && dataCryptoCompare.USD) {
                const gweiToDollarsRate = dataCryptoCompare.USD;
                const gasPriceDollars = (gasPriceGwei * (0.000000001) * gweiToDollarsRate * 65000);

                elements = document.getElementsByClassName('Cost');
                // Iteriamo attraverso la collezione e impostiamo l'innerHTML per ciascun elemento
                for (var i = 0; i < elements.length; i++) {
                    elements[i].innerHTML = `${gasPriceGwei} Gwei ($${gasPriceDollars.toFixed(2)})`;
                }
            } else {
                console.error('Dati di tasso di cambio non disponibili.');
            }
        } else {
            console.error('Dati di prezzo del gas non disponibili.');
        }

    } catch (error) {
        console.error('Errore durante la richiesta dei dati del gas:', error);
    }

}

setInterval(getGasInfo, 30000);