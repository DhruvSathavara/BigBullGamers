// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/access/Ownable.sol';
import './DERC721.sol';

contract BulkMint is Ownable {
    event BulkMinted(address indexed _to, uint256 _amount);
    event tokenCreated(address tokenCon);

    function createToken(string memory name, string memory symbol) public returns(address){
        address _address = address(
                new DERC721(
                  name,
                  symbol
                )
            ); // Created token contract.
        emit tokenCreated(_address);
        return _address;
    }

    function bulkMintERC721(
        address tokenAddress,
        uint256 start,
        uint256 end
    ) public {
        for (uint256 i = start; i < end; i++) {
            DERC721(tokenAddress).safeMint(msg.sender);
        }
        emit BulkMinted(msg.sender, end - start);
    }
}