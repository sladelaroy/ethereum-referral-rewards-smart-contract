import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import deployedContracts from './deployedContracts/deployedAddresses.json';
import tokenAbi from './contractsABI/MyToken.json';
import referralAbi from './contractsABI/ReferralRewards.json'; 

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [referralContract, setReferralContract] = useState(null);
  const [referrer, setReferrer] = useState('');
  const [refferalReward, setRefferalReward] = useState(100);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setProvider(provider);
        setSigner(signer);

        const tokenContract = new ethers.Contract(deployedContracts.MyToken, tokenAbi.abi, signer);
        const referralContract = new ethers.Contract(deployedContracts.ReferralRewards, referralAbi.abi, signer);

        setTokenContract(tokenContract);
        setReferralContract(referralContract);
      } else {
        console.error('Please install MetaMask!');
      }
    };

    init();
  }, []);

  function handleRefferalReward () {
    alert(`Refferal Reward set to ${refferalReward}`);
  };

  const handleAddReferral = async () => {
    try {
      const tx = await referralContract.registerReferral(referrer);
      console.log(tx);
      await tx.wait();
      alert(`you were reffered by ${referrer}`);

      await referralContract.calculateReward(referrer, refferalReward);
      const reward = await referralContract.rewards(referrer)
      alert(`${referrer} received ${refferalReward} tokens as reward`);

    } catch (error) {
      console.error('Error adding referral:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h4>Set the amount of tokens the refferer is to receive</h4>
      <input 
          type="text"
          value={refferalReward}
          onChange={(e) => setRefferalReward(e.target.value)}
          placeholder="amount of token to be rewarded" 
        /> 
        <button onClick={() => handleRefferalReward()}>
          Set Refferal Reward
        </button>

        <h4>Enter the address of the person who referred you</h4>
        <input 
          type="text"
          value={referrer}
          onChange={(e) => setReferrer(`${e.target.value}`)}
          placeholder="Referrer Address" 
        /> 
        <button 
          onClick={handleAddReferral}>
            Add Refferal
        </button>
      </header>
    </div>
  );
}

export default App;
