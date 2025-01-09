const { ethers } = require('hardhat');
const fs = require('fs');
const path = require('path');

// Deploy the MyToken contract
async function deployToken() {
  const TokenFactory = await ethers.getContractFactory('MyToken');
  const initialSupply = 1000000;
  const initialPrice = 100; 

  const tokenContract = await TokenFactory.deploy(initialSupply, initialPrice);
  await tokenContract.waitForDeployment();
  console.log('MyToken deployed to:', tokenContract.target);

  return tokenContract.target;
}

// Deploy the ReferralRewards contract
async function deployReferralRewards(tokenAddress) {
  const ReferralFactory = await ethers.getContractFactory('ReferralRewards');

  const referralContract = await ReferralFactory.deploy(tokenAddress);
  await referralContract.waitForDeployment();
  console.log('ReferralRewards deployed to:', referralContract.target);

  return referralContract.target;
}

// Store deployed contract addresses in a JSON file
function storeDeployedAddresses(tokenAddress, referralAddress) {
  const deployedContracts = {
    MyToken: tokenAddress,
    ReferralRewards: referralAddress
  };

  const filePath = path.resolve(__dirname, '../../src/deployedContracts/deployedAddresses.json');
  fs.writeFileSync(filePath, JSON.stringify(deployedContracts, null, 2));
  console.log('Deployed contract addresses saved to:', filePath);
}

// Main deployment function
(async () => {
  try {
    const tokenAddress = await deployToken();
    const referralAddress = await deployReferralRewards(tokenAddress);
    storeDeployedAddresses(tokenAddress, referralAddress);
  } catch (error) {
    console.error('Error deploying contracts:', error);
  }
})();