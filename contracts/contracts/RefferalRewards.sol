// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ReferralRewards is Ownable {
    IERC20 public rewardToken;

    mapping(address => address) public referrers; // Referee => Referrer
    mapping(address => uint) public rewards; // Referrer => Reward balance

    event ReferralRegistered(address indexed referee, address indexed referrer);
    event RewardClaimed(address indexed user, uint amount);

    constructor(address tokenAddress) Ownable(msg.sender) {
        rewardToken = IERC20(tokenAddress);
    }

    function registerReferral(address referrer) external {
        require(referrer != msg.sender, "Self-referrals not allowed");
        require(referrers[msg.sender] == address(0), "Referral already registered");

        referrers[msg.sender] = referrer;
        emit ReferralRegistered(msg.sender, referrer);
    }

    function calculateReward(address referee, uint rewardAmount) external onlyOwner {
        address referrer = referrers[referee];
        require(referrer != address(0), "No referrer for this user");

        rewards[referrer] += rewardAmount;
    }

    function claimReward() external onlyOwner {
        uint reward = rewards[msg.sender];
        require(reward > 0, "No rewards to claim");

        rewards[msg.sender] = 0;
        require(rewardToken.transfer(msg.sender, reward), "Reward transfer failed");

        emit RewardClaimed(msg.sender, reward);
    }
}
