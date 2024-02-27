// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Interfaccia standard del token ERC20
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Approval(address indexed owner, address indexed spender, uint256 amount);
}

// Contratto principale
contract BeerToken is IERC20 {
    // Mappa dei saldi degli utenti
    mapping(address => uint256) public balances;
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

    // Costruttore del contratto
    constructor() {
        owner = msg.sender;
        name = "Beer Token";
        symbol = "BEER";
        decimals = 18;
        totalSupply = 100000000 * (10 ** uint256(decimals)); // 100.000.000 BeerToken

        // Trasferisci 100.000.000 BeerToken al contratto
        balances[address(this)] = totalSupply;

        // Trasferisci 1.000 BeerToken al creatore del contratto
        uint256 creatorAllocation = 1000 * (10 ** uint256(decimals));
        balances[msg.sender] = creatorAllocation;

        emit Transfer(address(0), address(this), totalSupply);
        emit Transfer(address(this), msg.sender, creatorAllocation);
    }

    // Funzione per il trasferimento dei token
    function transfer(address to, uint256 amount) external override returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    // Funzione per il trasferimento dei token da un indirizzo all'altro
    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "Transfer from the zero address");
        require(recipient != address(0), "Transfer to the zero address");
        require(balances[sender] >= amount, "Insufficient balance");

        balances[sender] -= amount;
        balances[recipient] += amount;

        emit Transfer(sender, recipient, amount);
    }

    // Funzione per l'approvazione di un indirizzo a spender un numero specifico di token dal proprio account
    function approve(address spender, uint256 amount) external override returns (bool) {
        allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    // Funzione per l'uso approvato di token da parte di spender
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
}
