// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract RandomNumberGenerator is VRFConsumerBase {
    bytes32 internal keyHash;
    uint256 internal fee;
     

    uint256 public randomResult;
    uint256 public maxRange;


    constructor(address VRFCoordinator, address LINKToken, bytes32 KeyHash)
        VRFConsumerBase(
            VRFCoordinator, // VRF Coordinator
            LINKToken  // LINK Token
        ) public
    {
        keyHash = KeyHash;
        fee = 0.0001 * 10 ** 18; // 0.0001 LINK
    }

    /**
     * Requests randomness
     */
    function getRandomNumber(uint256 maxValue) public returns (bytes32 requestId) {
        maxRange = maxValue;
        require(LINK.balanceOf(address(this)) > fee, "Not enough LINK - fill contract with faucet");
        return requestRandomness(keyHash, fee);
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        bytes32 i = requestId;
        i = requestId;
        randomResult = (randomness % maxRange) + 1;
    }

    function getRandom() public view returns (uint256) {
        uint256 numb = (randomResult % maxRange) + 1;
        return numb;
    }


}