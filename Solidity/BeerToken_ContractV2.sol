// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Interfaccia standard del token ERC20
interface IERC20 {
    // Funzione per trasferire un certo numero di token a un determinato indirizzo
    function transfer(address to, uint256 amount) external returns (bool);
    
    // Funzione per trasferire un certo numero di token da un indirizzo all'altro
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    
    // Funzione per approvare un altro indirizzo a spendere un numero specifico di token dal proprio account
    function approve(address spender, uint256 amount) external returns (bool);
    
    // Funzione per ottenere il saldo di un determinato account
    function balanceOf(address account) external view returns (uint256);
    
    // Funzione per ottenere l'importo di token che il proprietario ha approvato per spender
    function allowance(address owner, address spender) external view returns (uint256);
    
    // Evento emesso quando avviene un trasferimento di token
    event Transfer(address indexed from, address indexed to, uint256 amount);
    
    // Evento emesso quando avviene un'approvazione per spender
    event Approval(address indexed owner, address indexed spender, uint256 amount);
}

contract EthBeerTokenExchange is IERC20 {
    // Mappa dei saldi degli utenti
    mapping(address => uint256) public balances;
    
    // Mappa delle autorizzazioni per spendere i token
    mapping(address => mapping(address => uint256)) public allowances;

    // Indirizzo del proprietario del contratto
    address public owner;
    
    // Nome del token
    string public name;
    
    // Simbolo del token
    string public symbol;
    
    // Decimali del token
    uint8 public decimals;
    
    // Quantità totale di token in circolazione
    uint256 public totalSupply;

    // Ratio di scambio BeerToken:Ether
    uint256 public beerToEthRatio;
    
    // Rapporto massimo 2:1 (200%)
    uint256 public constant MAX_RATIO = 200000;

    // Costruttore del contratto
    constructor() payable {
        // Verifica che almeno 0.5 ETH siano stati inviati durante il deploy
        require(msg.value >= 0.5 ether, "Insufficient Ether sent during deployment");
        
        // Imposta il proprietario del contratto come l'indirizzo che ha effettuato il deploy
        owner = msg.sender;
        
        // Imposta il nome del token
        name = "Beer Token";
        
        // Imposta il simbolo del token
        symbol = "BEER";
        
        // Imposta il numero di decimali del token
        decimals = 18;
        
        // Imposta la quantità totale di token in circolazione (100 milioni)
        totalSupply = 100000000 * (10 ** uint256(decimals)); // 100.000.000 BeerToken
        
        // Imposta il rapporto di scambio iniziale BeerToken:Ether (0.01 ETH per 1 BeerToken)
        beerToEthRatio = 100000; // 1 BeerToken = 0.00001 Ether

        // Assegna l'intera fornitura di token al contratto
        balances[address(this)] = totalSupply;

        // Assegna un'aliquota iniziale di token al creatore del contratto
        uint256 creatorAllocation = 1000 * (10 ** uint256(decimals));
        balances[msg.sender] = creatorAllocation;

        // Emetti eventi per registrare le assegnazioni iniziali di token
        emit Transfer(address(0), address(this), totalSupply);
        emit Transfer(address(this), msg.sender, creatorAllocation);
    }

    // Funzione per trasferire token da un account a un altro
    function transfer(address to, uint256 amount) external override returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    // Funzione interna per effettuare il trasferimento di token
    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "Transfer from the zero address");
        require(recipient != address(0), "Transfer to the zero address");
        require(balances[sender] >= amount, "Insufficient balance");

        balances[sender] -= amount;
        balances[recipient] += amount;

        emit Transfer(sender, recipient, amount);
    }

    // Funzione per approvare un altro account a spendere i token dal proprio account
    function approve(address spender, uint256 amount) external override returns (bool) {
        allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    // Funzione per trasferire i token da un account a un altro, con l'approvazione presa in considerazione
    function transferFrom(address sender, address recipient, uint256 amount) external override returns (bool) {
        require(sender != address(0), "Transfer from the zero address");
        require(recipient != address(0), "Transfer to the zero address");
        require(amount <= balances[sender], "Insufficient balance");
        require(amount <= allowances[sender][msg.sender], "Insufficient allowance");

        balances[sender] -= amount;
        balances[recipient] += amount;
        allowances[sender][msg.sender] -= amount;

        emit Transfer(sender, recipient, amount);
        return true;
    }

    // Funzione per ottenere il saldo di un determinato account
    function balanceOf(address account) external view override returns (uint256) {
        return balances[account];
    }

    // Funzione per ottenere l'importo di token che il proprietario ha approvato per spender
    function allowance(address _owner, address _spender) external view override returns (uint256) {
        return allowances[_owner][_spender];
    }

    // Funzione per impostare il rapporto di scambio BeerToken:Ether
    function setBeerToEthRatio(uint256 _ratio) external {
        require(msg.sender == owner, "Only owner can set ratio");
        beerToEthRatio = _ratio;
    }

    // Funzione per ottenere il saldo Ether nel contratto
    function getBalanceEth() external view returns (uint256) {
        return address(this).balance;
    }

    // Funzione per scambiare BeerToken con Ether
    function exchangeBeerForEth(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient BeerToken balance");
        uint256 ethAmount = amount / beerToEthRatio;
        require(address(this).balance >= ethAmount, "Insufficient Ether liquidity");

        balances[msg.sender] -= amount;
        balances[address(this)] += amount;

        payable(msg.sender).transfer(ethAmount);

        emit Transfer(msg.sender, address(this), amount);

        // Aggiorna il rapporto in base alla percentuale di BeerToken ed Ether nel contratto
        updateRatio();
    }

    // Funzione per scambiare Ether con BeerToken
    function exchangeEthForBeer() external payable {
        require(msg.value > 0, "No Ether sent");
        uint256 ethAmount = msg.value;
        uint256 amount = ethAmount * beerToEthRatio;
        require(balances[address(this)] >= amount, "Insufficient BeerToken liquidity");

        balances[msg.sender] += amount;
        balances[address(this)] -= amount;

        emit Transfer(address(this), msg.sender, amount);

        // Aggiorna il rapporto in base alla percentuale di BeerToken ed Ether nel contratto
        updateRatio();
    }

    // Funzione per aggiornare il rapporto in base alla percentuale di BeerToken ed Ether nel contratto
    function updateRatio() internal {
        uint256 beerBalance = balances[address(this)];
        uint256 ethBalance = address(this).balance;

        // Calcola il rapporto attuale BeerToken:Ether in percentuale
        uint256 currentRatio = (beerBalance * 100) / ethBalance;

        // Limita il rapporto massimo al valore massimo consentito
        if (currentRatio > MAX_RATIO) {
            currentRatio = MAX_RATIO;
        }

        // Aggiorna il rapporto BeerToken:Ether in base alla percentuale attuale
        beerToEthRatio = currentRatio;
    }

    // Funzione per ottenere il rapporto attuale BeerToken:Ether
    function getBeerToEthRatio() external view returns (uint256) {
        return beerToEthRatio;
    }
}
