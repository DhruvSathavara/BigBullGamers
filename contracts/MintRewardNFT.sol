// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract MintRewardNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address public owner;


    constructor() ERC721("BigBullGamersNFT", "BBG") {
        owner = msg.sender;
    }

    function createToken() public returns (uint) {
        require(_tokenIds.current() < 10000, "No More NFTs can be minted");
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        string memory tokenURI = "https://ipfs.moralis.io:2053/ipfs/QmTBFrmexeAHbBMgrD81NXRretDAu9MHj5mfqW8rDm5ssf/metadata/2.json";

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }
}