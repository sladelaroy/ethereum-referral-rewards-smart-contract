// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    uint public tokenPrice; // Price of one token in wei

    event TokensPurchased(address indexed buyer, uint amount, uint cost);
    event TokenPriceUpdated(uint oldPrice, uint newPrice);

    constructor(uint initialSupply, uint initialPrice) ERC20("MyToken", "MTK") Ownable(msg.sender) payable {
        _mint(msg.sender, initialSupply * 10 ** decimals());
        tokenPrice = initialPrice;
    }

    
    function buyTokens() external payable {
        require(tokenPrice > 0, "Token price must be set");
        require(msg.value > 0, "Ether sent must be greater than zero");

        uint tokensToBuy = (msg.value * 10 ** decimals()) / tokenPrice;
        require(tokensToBuy > 0, "Not enough Ether sent to buy tokens");
        require(balanceOf(owner()) >= tokensToBuy, "Not enough tokens available for sale");
        _transfer(owner(), msg.sender, tokensToBuy);

        emit TokensPurchased(msg.sender, tokensToBuy, msg.value);
    }

   
    function withdrawFunds() external onlyOwner {
        uint balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }

   
    function updateTokenPrice(uint newPrice) external onlyOwner {
        require(newPrice > 0, "Price must be greater than zero");
        uint oldPrice = tokenPrice;
        tokenPrice = newPrice;

        emit TokenPriceUpdated(oldPrice, newPrice);
    }

    receive() external payable {}
}
